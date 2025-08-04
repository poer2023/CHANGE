/**
 * GLM-4.5 API客户端 - 完整的TypeScript实现
 * 支持流式和非流式响应，包含错误处理和重试机制
 */

import { 
  GLMMessage, 
  GLMChatRequest, 
  GLMChatResponse, 
  GLMStreamChunk, 
  GLMError, 
  GLMClientConfig,
  AIServiceOptions,
  StreamingResponse 
} from '../types';

/**
 * GLM-4.5 API客户端配置
 */
const DEFAULT_CONFIG: Partial<GLMClientConfig> = {
  baseURL: 'https://open.bigmodel.cn/api/paas/v4',
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
  rateLimit: 60, // 请求/分钟
  enableCache: true,
  cacheTimeout: 30 * 60 * 1000, // 30分钟
  enableErrorReporting: true,
  maxErrorLogs: 100,
  enablePerformanceMonitoring: true,
};

/**
 * GLM-4.5 API客户端类
 */
export class GLMClient {
  private config: GLMClientConfig;
  private requestHistory: number[] = []; // 请求时间戳历史
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private errorLogs: Array<{ error: string; timestamp: number; context: any }> = [];
  private performanceMetrics: Array<{ endpoint: string; duration: number; timestamp: number }> = [];

  constructor(config: GLMClientConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    if (!this.config.apiKey) {
      throw new Error('GLM API密钥不能为空');
    }

    // 定期清理缓存和日志
    setInterval(() => {
      this.cleanupCache();
      this.cleanupErrorLogs();
      this.cleanupPerformanceMetrics();
    }, 5 * 60 * 1000); // 每5分钟清理一次
  }

  /**
   * 发送非流式聊天请求
   */
  async chat(
    messages: GLMMessage[],
    options: AIServiceOptions = {}
  ): Promise<GLMChatResponse> {
    const request: GLMChatRequest = {
      model: 'glm-4-flash',
      messages,
      stream: false,
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature || 0.7,
    };

    return this.makeRequest('/chat/completions', request);
  }

  /**
   * 发送流式聊天请求
   */
  async chatStream(
    messages: GLMMessage[],
    options: AIServiceOptions = {}
  ): Promise<ReadableStream<GLMStreamChunk>> {
    const request: GLMChatRequest = {
      model: 'glm-4-flash',
      messages,
      stream: true,
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature || 0.7,
    };

    const response = await this.makeStreamRequest('/chat/completions', request);
    return this.createStreamProcessor(response, options);
  }

  /**
   * 便捷的聊天方法 - 简单文本输入输出
   */
  async simpleChat(
    prompt: string,
    systemMessage?: string,
    options: AIServiceOptions = {}
  ): Promise<string> {
    const messages: GLMMessage[] = [];
    
    if (systemMessage) {
      messages.push({ role: 'system', content: systemMessage });
    }
    
    messages.push({ role: 'user', content: prompt });

    try {
      const response = await this.chat(messages, options);
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      if (options.onError) {
        options.onError(this.getErrorMessage(error));
      }
      throw error;
    }
  }

  /**
   * 便捷的流式聊天方法
   */
  async simpleChatStream(
    prompt: string,
    systemMessage?: string,
    options: AIServiceOptions = {}
  ): Promise<StreamingResponse> {
    const messages: GLMMessage[] = [];
    
    if (systemMessage) {
      messages.push({ role: 'system', content: systemMessage });
    }
    
    messages.push({ role: 'user', content: prompt });

    let content = '';
    let isComplete = false;
    let error: string | undefined;

    try {
      const stream = await this.chatStream(messages, options);
      const reader = stream.getReader();

      const processStream = async (): Promise<void> => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              isComplete = true;
              if (options.onComplete) {
                options.onComplete(content);
              }
              break;
            }

            const deltaContent = value.choices[0]?.delta?.content || '';
            content += deltaContent;

            if (options.onStream) {
              options.onStream(deltaContent);
            }
          }
        } catch (err) {
          error = this.getErrorMessage(err);
          if (options.onError) {
            options.onError(error);
          }
        }
      };

      // 异步处理流，不等待完成
      processStream();

    } catch (err) {
      error = this.getErrorMessage(err);
      if (options.onError) {
        options.onError(error);
      }
    }

    return {
      content,
      isComplete,
      error,
    };
  }

  /**
   * 测试API连接
   */
  async testConnection(): Promise<{
    success: boolean;
    latency: number;
    model?: string;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      const response = await this.simpleChat('Hello', undefined, { maxTokens: 10 });
      const latency = Date.now() - startTime;

      return {
        success: true,
        latency,
        model: 'glm-4-flash',
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      return {
        success: false,
        latency,
        error: this.getErrorMessage(error),
      };
    }
  }

  /**
   * 获取模型信息
   */
  getModelInfo(): {
    name: string;
    maxTokens: number;
    supportedFeatures: string[];
  } {
    return {
      name: 'GLM-4-Flash',
      maxTokens: 4096,
      supportedFeatures: ['chat', 'stream', 'system_message'],
    };
  }

  /**
   * 检查速率限制
   */
  private checkRateLimit(): boolean {
    if (!this.config.rateLimit) return true;
    
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    
    // 清理超过1分钟的请求记录
    this.requestHistory = this.requestHistory.filter(timestamp => timestamp > oneMinuteAgo);
    
    // 检查是否超过速率限制
    if (this.requestHistory.length >= this.config.rateLimit) {
      return false;
    }
    
    // 记录当前请求
    this.requestHistory.push(now);
    return true;
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(endpoint: string, data: any): string {
    return `${endpoint}:${JSON.stringify(data)}`;
  }

  /**
   * 获取缓存数据
   */
  private getCachedData(key: string): any | null {
    if (!this.config.enableCache) return null;
    
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > (this.config.cacheTimeout || 30 * 60 * 1000)) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  /**
   * 设置缓存数据
   */
  private setCachedData(key: string, data: any): void {
    if (!this.config.enableCache) return;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * 记录错误日志
   */
  private logError(error: string, context: any = {}): void {
    if (!this.config.enableErrorReporting) return;
    
    this.errorLogs.push({
      error,
      timestamp: Date.now(),
      context
    });
    
    // 限制错误日志数量
    if (this.errorLogs.length > (this.config.maxErrorLogs || 100)) {
      this.errorLogs.shift();
    }
  }

  /**
   * 记录性能指标
   */
  private logPerformance(endpoint: string, duration: number): void {
    if (!this.config.enablePerformanceMonitoring) return;
    
    this.performanceMetrics.push({
      endpoint,
      duration,
      timestamp: Date.now()
    });
    
    // 限制性能指标数量（保留最近1000条）
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-1000);
    }
  }

  /**
   * 清理过期缓存
   */
  private cleanupCache(): void {
    if (!this.config.enableCache) return;
    
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > (this.config.cacheTimeout || 30 * 60 * 1000)) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.cache.delete(key));
  }

  /**
   * 清理过期错误日志
   */
  private cleanupErrorLogs(): void {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.errorLogs = this.errorLogs.filter(log => log.timestamp > oneDayAgo);
  }

  /**
   * 清理过期性能指标
   */
  private cleanupPerformanceMetrics(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    this.performanceMetrics = this.performanceMetrics.filter(metric => metric.timestamp > oneHourAgo);
  }

  /**
   * 发送HTTP请求（带重试机制）
   */
  private async makeRequest<T>(
    endpoint: string,
    data: any,
    retryCount = 0
  ): Promise<T> {
    // 检查速率限制
    if (!this.checkRateLimit()) {
      const error = '请求频率超过限制，请稍后重试';
      this.logError(error, { endpoint, retryCount });
      throw new Error(error);
    }

    // 检查缓存（仅对非流式请求）
    const cacheKey = this.getCacheKey(endpoint, data);
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData && !data.stream) {
      return cachedData;
    }

    const url = `${this.config.baseURL}${endpoint}`;
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.config.apiKey,
          'User-Agent': 'CHANGE-GLM-Client/1.0.0'
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      this.logPerformance(endpoint, duration);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error?.message || 
                           `HTTP ${response.status}: ${response.statusText}`;
        
        this.logError(errorMessage, { 
          endpoint, 
          status: response.status, 
          retryCount,
          errorData 
        });
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // 缓存成功的响应（仅对非流式请求）
      if (!data.stream) {
        this.setCachedData(cacheKey, result);
      }

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      this.logPerformance(endpoint, duration);

      // 记录错误
      const errorMessage = this.getErrorMessage(error);
      this.logError(errorMessage, { 
        endpoint, 
        retryCount, 
        duration,
        originalError: error 
      });

      // 重试逻辑
      if (
        retryCount < (this.config.maxRetries || 0) &&
        this.shouldRetry(error)
      ) {
        await this.delay((this.config.retryDelay || 1000) * Math.pow(2, retryCount));
        return this.makeRequest<T>(endpoint, data, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * 发送流式HTTP请求
   */
  private async makeStreamRequest(
    endpoint: string,
    data: any
  ): Promise<Response> {
    const url = `${this.config.baseURL}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.config.apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error?.message || 
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response;
  }

  /**
   * 创建流处理器
   */
  private createStreamProcessor(
    response: Response,
    options: AIServiceOptions
  ): ReadableStream<GLMStreamChunk> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法创建流读取器');
    }

    const decoder = new TextDecoder();

    return new ReadableStream({
      async start(controller) {
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const chunk: GLMStreamChunk = JSON.parse(data);
                  controller.enqueue(chunk);
                } catch (error) {
                  console.warn('解析流数据失败:', data, error);
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      },

      cancel() {
        reader.cancel();
      },
    });
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: unknown): boolean {
    if (error instanceof Error) {
      // 网络错误或临时服务器错误才重试
      return (
        error.name === 'TypeError' || // 网络错误
        error.name === 'AbortError' || // 超时
        error.message.includes('500') || // 服务器内部错误
        error.message.includes('502') || // 网关错误
        error.message.includes('503') || // 服务不可用
        error.message.includes('504')    // 网关超时
      );
    }
    return false;
  }

  /**
   * 获取客户端状态和统计信息
   */
  getStatus(): {
    isConfigured: boolean;
    rateLimitStatus: {
      current: number;
      limit: number;
      resetTime: number;
    };
    cacheStatus: {
      size: number;
      enabled: boolean;
    };
    errorLogs: Array<{ error: string; timestamp: number; context: any }>;
    performanceMetrics: {
      averageLatency: number;
      requestCount: number;
      errorRate: number;
    };
  } {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const recentRequests = this.requestHistory.filter(timestamp => timestamp > oneMinuteAgo);
    
    // 计算性能指标
    const recentMetrics = this.performanceMetrics.filter(m => m.timestamp > oneMinuteAgo);
    const averageLatency = recentMetrics.length > 0 
      ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length 
      : 0;
    
    const recentErrors = this.errorLogs.filter(log => log.timestamp > oneMinuteAgo);
    const errorRate = recentRequests.length > 0 
      ? recentErrors.length / recentRequests.length 
      : 0;

    return {
      isConfigured: !!this.config.apiKey,
      rateLimitStatus: {
        current: recentRequests.length,
        limit: this.config.rateLimit || 60,
        resetTime: Math.max(...recentRequests, now) + 60000
      },
      cacheStatus: {
        size: this.cache.size,
        enabled: this.config.enableCache || false
      },
      errorLogs: this.errorLogs.slice(-10), // 返回最近10条错误
      performanceMetrics: {
        averageLatency,
        requestCount: recentRequests.length,
        errorRate
      }
    };
  }

  /**
   * 清理所有缓存和日志
   */
  clearCache(): void {
    this.cache.clear();
    this.errorLogs.length = 0;
    this.performanceMetrics.length = 0;
    this.requestHistory.length = 0;
  }

  /**
   * 获取错误消息
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return '未知错误';
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 清理资源
   */
  dispose(): void {
    // 清理可能的资源
  }
}

/**
 * 创建GLM客户端实例
 */
export function createGLMClient(config: GLMClientConfig): GLMClient {
  return new GLMClient(config);
}

/**
 * 默认GLM客户端实例（从环境变量获取配置）
 */
export const defaultGLMClient = (() => {
  try {
    const apiKey = import.meta.env?.VITE_GLM_API_KEY || 
                   (typeof process !== 'undefined' ? process.env?.REACT_APP_GLM_API_KEY : '') ||
                   '';
                   
    if (!apiKey) {
      console.warn('GLM API密钥未配置，请设置 VITE_GLM_API_KEY 环境变量');
      return null;
    }

    const config: GLMClientConfig = {
      apiKey,
      baseURL: import.meta.env?.VITE_GLM_BASE_URL || 
               (typeof process !== 'undefined' ? process.env?.REACT_APP_GLM_BASE_URL : '') ||
               'https://open.bigmodel.cn/api/paas/v4',
      timeout: Number(import.meta.env?.VITE_GLM_TIMEOUT) || 30000,
      maxRetries: Number(import.meta.env?.VITE_GLM_MAX_RETRIES) || 3,
      retryDelay: Number(import.meta.env?.VITE_GLM_RETRY_DELAY) || 1000,
      rateLimit: Number(import.meta.env?.VITE_GLM_RATE_LIMIT) || 60,
      enableCache: import.meta.env?.VITE_GLM_ENABLE_CACHE === 'true',
      cacheTimeout: Number(import.meta.env?.VITE_GLM_CACHE_DURATION) * 60 * 1000 || 30 * 60 * 1000,
      enableErrorReporting: import.meta.env?.VITE_GLM_ENABLE_ERROR_REPORTING !== 'false',
      maxErrorLogs: Number(import.meta.env?.VITE_GLM_MAX_ERROR_LOGS) || 100,
      enablePerformanceMonitoring: import.meta.env?.VITE_GLM_ENABLE_PERFORMANCE_MONITORING !== 'false',
    };

    return createGLMClient(config);
  } catch (error) {
    console.error('创建默认GLM客户端失败:', error);
    return null;
  }
})();

export default GLMClient;