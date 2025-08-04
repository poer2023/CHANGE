/**
 * API健康监控和降级处理服务
 * 提供连接状态检测、自动降级、故障转移等功能
 */

import { defaultGLMClient } from './glm-client';
import { 
  ConnectionStatus, 
  GLMClientStatus, 
  EnvironmentConfig 
} from '../types';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'failed';
  connections: {
    glm: ConnectionStatus;
  };
  recommendedMode: 'api' | 'fallback' | 'offline';
  lastCheck: number;
  nextCheck: number;
}

export interface FallbackOptions {
  enableMockData: boolean;
  enableCache: boolean;
  enableOfflineMode: boolean;
  maxRetryAttempts: number;
  healthCheckInterval: number;
}

/**
 * API健康监控器
 */
export class APIHealthMonitor {
  private healthStatus: HealthCheckResult;
  private fallbackOptions: FallbackOptions;
  private healthCheckTimer: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  constructor(options: Partial<FallbackOptions> = {}) {
    this.fallbackOptions = {
      enableMockData: true,
      enableCache: true,
      enableOfflineMode: true,
      maxRetryAttempts: 3,
      healthCheckInterval: 60000, // 1分钟
      ...options
    };

    this.healthStatus = {
      status: 'failed',
      connections: {
        glm: { success: false, latency: 0, error: 'Not tested' }
      },
      recommendedMode: 'fallback',
      lastCheck: 0,
      nextCheck: 0
    };
  }

  /**
   * 开始健康监控
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.performHealthCheck();

    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.fallbackOptions.healthCheckInterval);
  }

  /**
   * 停止健康监控
   */
  stopMonitoring(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
    this.isMonitoring = false;
  }

  /**
   * 执行健康检查
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    const now = Date.now();
    
    try {
      // 检查GLM API连接
      const glmStatus = await this.checkGLMConnection();
      
      // 确定整体健康状态
      const status = this.determineOverallStatus(glmStatus);
      
      // 推荐运行模式
      const recommendedMode = this.getRecommendedMode(status, glmStatus);

      this.healthStatus = {
        status,
        connections: {
          glm: glmStatus
        },
        recommendedMode,
        lastCheck: now,
        nextCheck: now + this.fallbackOptions.healthCheckInterval
      };

      // 触发状态变化事件
      this.onHealthStatusChange(this.healthStatus);

    } catch (error) {
      console.error('健康检查失败:', error);
      
      this.healthStatus = {
        status: 'failed',
        connections: {
          glm: { 
            success: false, 
            latency: 0, 
            error: error instanceof Error ? error.message : '健康检查失败' 
          }
        },
        recommendedMode: 'fallback',
        lastCheck: now,
        nextCheck: now + this.fallbackOptions.healthCheckInterval
      };
    }

    return this.healthStatus;
  }

  /**
   * 检查GLM API连接
   */
  private async checkGLMConnection(): Promise<ConnectionStatus> {
    if (!defaultGLMClient) {
      return {
        success: false,
        latency: 0,
        error: 'GLM客户端未配置'
      };
    }

    try {
      const result = await defaultGLMClient.testConnection();
      return result;
    } catch (error) {
      return {
        success: false,
        latency: 0,
        error: error instanceof Error ? error.message : 'GLM连接测试失败'
      };
    }
  }

  /**
   * 确定整体健康状态
   */
  private determineOverallStatus(glmStatus: ConnectionStatus): 'healthy' | 'degraded' | 'failed' {
    if (glmStatus.success) {
      if (glmStatus.latency < 2000) {
        return 'healthy';
      } else {
        return 'degraded';
      }
    }
    return 'failed';
  }

  /**
   * 获取推荐运行模式
   */
  private getRecommendedMode(
    status: 'healthy' | 'degraded' | 'failed',
    glmStatus: ConnectionStatus
  ): 'api' | 'fallback' | 'offline' {
    if (status === 'healthy' || (status === 'degraded' && glmStatus.success)) {
      return 'api';
    }

    if (this.fallbackOptions.enableMockData || this.fallbackOptions.enableCache) {
      return 'fallback';
    }

    return 'offline';
  }

  /**
   * 状态变化回调
   */
  private onHealthStatusChange(status: HealthCheckResult): void {
    // 在此处可以添加状态变化的处理逻辑
    // 例如：通知UI更新、记录日志等
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('api-health-change', {
        detail: status
      }));
    }
  }

  /**
   * 获取当前健康状态
   */
  getHealthStatus(): HealthCheckResult {
    return { ...this.healthStatus };
  }

  /**
   * 获取GLM客户端状态
   */
  getGLMClientStatus(): GLMClientStatus | null {
    if (!defaultGLMClient) return null;
    
    return defaultGLMClient.getStatus();
  }

  /**
   * 智能调用 - 根据健康状态选择最佳调用方式
   */
  async smartCall<T>(
    apiCall: () => Promise<T>,
    fallbackCall?: () => Promise<T>,
    options: {
      useCache?: boolean;
      timeout?: number;
      retryCount?: number;
    } = {}
  ): Promise<T> {
    const { useCache = true, timeout = 30000, retryCount = 0 } = options;
    const maxRetries = this.fallbackOptions.maxRetryAttempts;

    // 如果API健康，直接调用
    if (this.healthStatus.recommendedMode === 'api') {
      try {
        return await this.withTimeout(apiCall(), timeout);
      } catch (error) {
        console.warn('API调用失败，尝试降级处理:', error);
        
        // 更新健康状态
        await this.performHealthCheck();
        
        // 如果还有重试机会，递归重试
        if (retryCount < maxRetries) {
          return this.smartCall(apiCall, fallbackCall, {
            ...options,
            retryCount: retryCount + 1
          });
        }
        
        // 尝试降级调用（如果有降级函数）
        if (fallbackCall) {
          return await fallbackCall();
        }
        
        throw error;
      }
    }

    // 如果推荐降级模式且有降级函数，使用降级调用
    if (this.healthStatus.recommendedMode === 'fallback' && fallbackCall) {
      return await fallbackCall();
    }

    // 否则抛出错误
    throw new Error('API不可用且没有可用的降级方案');
  }

  /**
   * 为Promise添加超时控制
   */
  private withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`操作超时 (${timeout}ms)`)), timeout);
      })
    ]);
  }

  /**
   * 强制切换到降级模式
   */
  forceFallbackMode(): void {
    this.healthStatus.recommendedMode = 'fallback';
    this.healthStatus.status = 'degraded';
    this.onHealthStatusChange(this.healthStatus);
  }

  /**
   * 强制切换到API模式
   */
  forceAPIMode(): void {
    this.healthStatus.recommendedMode = 'api';
    this.performHealthCheck(); // 重新检查状态
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.stopMonitoring();
  }
}

/**
 * 环境配置验证器
 */
export class EnvironmentValidator {
  /**
   * 验证环境配置
   */
  static validate(): {
    isValid: boolean;
    config: EnvironmentConfig;
    issues: string[];
    recommendations: string[];
  } {
    const config: EnvironmentConfig = {
      glmApiKey: import.meta.env?.VITE_GLM_API_KEY,
      glmBaseUrl: import.meta.env?.VITE_GLM_BASE_URL,
      glmTimeout: Number(import.meta.env?.VITE_GLM_TIMEOUT),
      glmMaxRetries: Number(import.meta.env?.VITE_GLM_MAX_RETRIES),
      glmRetryDelay: Number(import.meta.env?.VITE_GLM_RETRY_DELAY),
      glmRateLimit: Number(import.meta.env?.VITE_GLM_RATE_LIMIT),
      glmEnableCache: import.meta.env?.VITE_GLM_ENABLE_CACHE === 'true',
      glmCacheDuration: Number(import.meta.env?.VITE_GLM_CACHE_DURATION),
      glmEnableErrorReporting: import.meta.env?.VITE_GLM_ENABLE_ERROR_REPORTING !== 'false',
      glmMaxErrorLogs: Number(import.meta.env?.VITE_GLM_MAX_ERROR_LOGS),
      glmEnablePerformanceMonitoring: import.meta.env?.VITE_GLM_ENABLE_PERFORMANCE_MONITORING !== 'false',
      debugMode: import.meta.env?.VITE_DEBUG_MODE === 'true',
      useMockData: import.meta.env?.VITE_USE_MOCK_DATA === 'true',
    };

    const issues: string[] = [];
    const recommendations: string[] = [];

    // 必需配置检查
    if (!config.glmApiKey) {
      issues.push('GLM API密钥未配置');
      recommendations.push('设置 VITE_GLM_API_KEY 环境变量');
    }

    // 配置值验证
    if (config.glmTimeout && (config.glmTimeout < 1000 || config.glmTimeout > 300000)) {
      issues.push('GLM超时时间配置不合理 (建议 1000-300000ms)');
      recommendations.push('调整 VITE_GLM_TIMEOUT 到合理范围');
    }

    if (config.glmMaxRetries && (config.glmMaxRetries < 0 || config.glmMaxRetries > 10)) {
      issues.push('GLM重试次数配置不合理 (建议 0-10次)');
      recommendations.push('调整 VITE_GLM_MAX_RETRIES 到合理范围');
    }

    if (config.glmRateLimit && (config.glmRateLimit < 1 || config.glmRateLimit > 1000)) {
      issues.push('GLM速率限制配置不合理 (建议 1-1000/分钟)');
      recommendations.push('调整 VITE_GLM_RATE_LIMIT 到合理范围');
    }

    // 性能优化建议
    if (!config.glmEnableCache) {
      recommendations.push('建议启用缓存以提高性能 (VITE_GLM_ENABLE_CACHE=true)');
    }

    if (!config.glmEnablePerformanceMonitoring) {
      recommendations.push('建议启用性能监控以便调试 (VITE_GLM_ENABLE_PERFORMANCE_MONITORING=true)');
    }

    return {
      isValid: issues.length === 0,
      config,
      issues,
      recommendations
    };
  }

  /**
   * 生成配置报告
   */
  static generateReport(): string {
    const validation = this.validate();
    
    let report = '# 环境配置验证报告\n\n';
    
    report += `**状态**: ${validation.isValid ? '✅ 有效' : '❌ 无效'}\n\n`;
    
    if (validation.issues.length > 0) {
      report += '## 问题\n\n';
      validation.issues.forEach(issue => {
        report += `- ❌ ${issue}\n`;
      });
      report += '\n';
    }
    
    if (validation.recommendations.length > 0) {
      report += '## 建议\n\n';
      validation.recommendations.forEach(rec => {
        report += `- 💡 ${rec}\n`;
      });
      report += '\n';
    }
    
    report += '## 当前配置\n\n';
    report += '```json\n';
    report += JSON.stringify(validation.config, null, 2);
    report += '\n```\n';
    
    return report;
  }
}

// 创建默认的健康监控实例
export const defaultHealthMonitor = new APIHealthMonitor();

// 在应用启动时自动开始监控
if (typeof window !== 'undefined') {
  // 延迟启动，避免影响应用初始化
  setTimeout(() => {
    defaultHealthMonitor.startMonitoring();
  }, 1000);
}

export default APIHealthMonitor;