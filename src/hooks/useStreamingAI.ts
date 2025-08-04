import { useState, useCallback, useRef } from 'react';
import { defaultGLMClient } from '../services/glm-client';
import { defaultHealthMonitor } from '../services/api-health-monitor';
import { GLMMessage, AIServiceOptions } from '../types';

interface StreamingOptions {
  delay?: number; // 每个字符的延迟（毫秒）
  chunkSize?: number; // 每次流式输出的字符数
  temperature?: number; // AI温度参数
  maxTokens?: number; // 最大token数
  systemMessage?: string; // 系统消息
}

interface StreamingState {
  content: string;
  isStreaming: boolean;
  isComplete: boolean;
  error: string | null;
  connectionStatus: 'unknown' | 'healthy' | 'degraded' | 'failed';
  usingFallback: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export const useStreamingAI = (options: StreamingOptions = {}) => {
  const { 
    delay = 50, 
    chunkSize = 1, 
    temperature = 0.7,
    maxTokens = 4096,
    systemMessage 
  } = options;
  
  const [state, setState] = useState<StreamingState>({
    content: '',
    isStreaming: false,
    isComplete: false,
    error: null,
    connectionStatus: 'unknown',
    usingFallback: false
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 真实AI响应生成（使用智能调用和降级处理）
  const generateAIResponse = useCallback(async (prompt: string): Promise<string> => {
    // 更新连接状态
    const healthStatus = defaultHealthMonitor.getHealthStatus();
    setState(prev => ({ 
      ...prev, 
      connectionStatus: healthStatus.status,
      usingFallback: healthStatus.recommendedMode !== 'api'
    }));

    // 使用智能调用，自动处理降级
    return await defaultHealthMonitor.smartCall(
      // API调用
      async () => {
        if (!defaultGLMClient) {
          throw new Error('GLM客户端未配置，请检查API密钥设置');
        }

        const response = await defaultGLMClient.simpleChat(
          prompt, 
          systemMessage,
          {
            temperature,
            maxTokens,
          }
        );

        // 更新状态为健康
        setState(prev => ({ 
          ...prev, 
          connectionStatus: 'healthy',
          usingFallback: false 
        }));

        return response;
      },
      // 降级调用
      async () => {
        console.info('使用降级模式生成响应');
        setState(prev => ({ 
          ...prev, 
          connectionStatus: 'degraded',
          usingFallback: true 
        }));
        return await generateMockAIResponse(prompt);
      }
    );
  }, [temperature, maxTokens, systemMessage]);

  // 流式AI响应生成（使用智能调用和降级处理）
  const generateStreamingResponse = useCallback(async (
    prompt: string, 
    onChunk?: (chunk: string) => void
  ): Promise<void> => {
    // 更新连接状态
    const healthStatus = defaultHealthMonitor.getHealthStatus();
    setState(prev => ({ 
      ...prev, 
      connectionStatus: healthStatus.status,
      usingFallback: healthStatus.recommendedMode !== 'api'
    }));

    try {
      await defaultHealthMonitor.smartCall(
        // API调用
        async () => {
          if (!defaultGLMClient) {
            throw new Error('GLM客户端未配置，请检查API密钥设置');
          }

          const streamResponse = await defaultGLMClient.simpleChatStream(
            prompt,
            systemMessage,
            {
              temperature,
              maxTokens,
              onStream: onChunk,
              onComplete: (content) => {
                setState(prev => ({
                  ...prev,
                  content,
                  isStreaming: false,
                  isComplete: true,
                  connectionStatus: 'healthy',
                  usingFallback: false
                }));
              },
              onError: (error) => {
                setState(prev => ({
                  ...prev,
                  isStreaming: false,
                  error,
                  connectionStatus: 'failed'
                }));
              }
            }
          );

          // 初始化流式响应状态
          setState(prev => ({
            ...prev,
            content: streamResponse.content,
            isStreaming: !streamResponse.isComplete,
            isComplete: streamResponse.isComplete,
            error: streamResponse.error || null,
            connectionStatus: 'healthy',
            usingFallback: false
          }));

          return streamResponse;
        },
        // 降级调用 - 使用模拟流式响应
        async () => {
          console.info('使用降级模式进行流式响应');
          setState(prev => ({ 
            ...prev, 
            connectionStatus: 'degraded',
            usingFallback: true 
          }));

          const response = await generateMockAIResponse(prompt);
          const characters = response.split('');
          let currentContent = '';

          const streamCharacters = (index: number) => {
            if (abortControllerRef.current?.signal.aborted) {
              return;
            }

            if (index >= characters.length) {
              setState(prev => ({
                ...prev,
                isStreaming: false,
                isComplete: true
              }));
              return;
            }

            // 添加字符到内容
            const chunk = characters.slice(index, index + chunkSize).join('');
            currentContent += chunk;

            setState(prev => ({
              ...prev,
              content: currentContent
            }));

            onChunk?.(chunk);

            // 继续下一个字符
            timeoutRef.current = setTimeout(() => {
              streamCharacters(index + chunkSize);
            }, delay);
          };

          streamCharacters(0);
          return { content: response, isComplete: false, error: undefined };
        }
      );

    } catch (error) {
      console.error('流式响应生成失败:', error);
      setState(prev => ({
        ...prev,
        isStreaming: false,
        error: error instanceof Error ? error.message : '生成内容时发生错误',
        connectionStatus: 'failed'
      }));
    }
  }, [temperature, maxTokens, systemMessage, chunkSize, delay]);

  // 模拟AI响应生成（保持向后兼容）
  const generateMockAIResponse = useCallback(async (prompt: string): Promise<string> => {
    // 模拟不同类型的响应
    const responses = {
      '写作建议': `基于您的内容，我建议以下几点改进：

1. **结构优化**
   - 增强开头的吸引力
   - 确保段落之间的逻辑连接清晰
   - 在结论部分总结核心观点

2. **内容深化**
   - 添加具体的例子和案例研究
   - 引用权威资料和数据支撑
   - 考虑读者的背景知识水平

3. **语言表达**
   - 使用更加精确的专业术语
   - 避免重复和冗余表达
   - 保持语调的一致性

这些改进将显著提升您文档的质量和可读性。`,

      '语法检查': `经过仔细分析，我发现以下几个需要注意的地方：

**语法问题：**
• 第3段第2句：时态不一致，建议统一使用现在时
• 第5段：缺少主语，建议补充完整
• 第7段：标点符号使用不当，建议修正

**用词建议：**
• "非常重要"可以替换为"至关重要"
• "很多"可以使用"大量的"或"众多的"
• 避免过度使用"然后"作为连接词

**句式优化：**
• 某些长句可以拆分为短句以提高可读性
• 建议使用更多的过渡词来增强连贯性

修正这些问题后，您的文档将更加专业和流畅。`,

      '内容扩展': `关于这个主题，我建议从以下角度进行扩展：

**理论基础**
深入探讨相关的理论框架和概念模型，这将为您的论述提供坚实的学术基础。考虑引入以下理论：
- 经典理论的发展脉络
- 现代研究的新进展
- 不同学派的观点比较

**实践应用**
结合实际案例来验证您的观点：
- 成功案例的分析
- 失败案例的教训
- 最佳实践的总结

**未来展望**
讨论该领域的发展趋势：
- 新兴技术的影响
- 政策法规的变化
- 社会需求的演变

**方法论**
详细说明研究方法和分析框架：
- 数据收集方法
- 分析工具的选择
- 评估标准的确定

这样的扩展将使您的文档更加全面和深入。`,

      '结构优化': `为了优化文档结构，我建议采用以下组织方式：

**标准学术结构：**

1. **引言部分 (Introduction)**
   - 研究背景和问题陈述
   - 研究目标和意义
   - 文档结构概述

2. **文献综述 (Literature Review)**
   - 相关研究的回顾
   - 理论框架的建立
   - 研究空白的识别

3. **方法论 (Methodology)**
   - 研究设计
   - 数据收集方法
   - 分析框架

4. **分析与讨论 (Analysis & Discussion)**
   - 主要发现
   - 结果解释
   - 理论与实践的结合

5. **结论 (Conclusion)**
   - 核心贡献总结
   - 局限性说明
   - 未来研究方向

**逻辑流程优化：**
- 确保每个章节都有明确的目标
- 使用过渡段落连接不同部分
- 在每个章节开始提供简短的概述
- 在章节结尾总结要点

这种结构将使您的文档更加专业和易读。`
    };

    // 根据提示词选择合适的响应
    let response = '';
    for (const [key, value] of Object.entries(responses)) {
      if (prompt.toLowerCase().includes(key.toLowerCase())) {
        response = value;
        break;
      }
    }

    // 如果没有匹配的响应，生成通用响应
    if (!response) {
      response = `感谢您的询问。基于您的内容，我认为可以从以下几个方面来改进：

**内容质量提升：**
- 确保论点清晰明确
- 提供充分的证据支撑
- 保持逻辑的连贯性

**表达方式优化：**
- 使用准确的专业术语
- 避免模糊和歧义的表达
- 保持语言的简洁有力

**结构安排优化：**
- 合理安排章节顺序
- 确保各部分比重适当
- 使用清晰的标题和子标题

如果您有具体的问题或需要针对某个部分的建议，请告诉我，我会提供更详细的指导。`;
    }

    return response;
  }, []);

  // 开始流式输出（真实GLM API）
  const startStreaming = useCallback(async (
    prompt: string, 
    onChunk?: (chunk: string) => void,
    useRealAPI = true
  ) => {
    // 取消之前的流式输出
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    abortControllerRef.current = new AbortController();
    
    setState({
      content: '',
      isStreaming: true,
      isComplete: false,
      error: null,
      connectionStatus: 'unknown',
      usingFallback: false
    });

    try {
      if (useRealAPI && defaultGLMClient) {
        // 使用真实GLM API进行流式生成
        await generateStreamingResponse(prompt, onChunk);
      } else {
        // 使用模拟响应（向后兼容）
        const response = await generateMockAIResponse(prompt);
        const characters = response.split('');
        let currentContent = '';

        const streamCharacters = (index: number) => {
          if (abortControllerRef.current?.signal.aborted) {
            return;
          }

          if (index >= characters.length) {
            setState(prev => ({
              ...prev,
              isStreaming: false,
              isComplete: true
            }));
            return;
          }

          // 添加字符到内容
          const chunk = characters.slice(index, index + chunkSize).join('');
          currentContent += chunk;

          setState(prev => ({
            ...prev,
            content: currentContent
          }));

          onChunk?.(chunk);

          // 继续下一个字符
          timeoutRef.current = setTimeout(() => {
            streamCharacters(index + chunkSize);
          }, delay);
        };

        streamCharacters(0);
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        isStreaming: false,
        error: error instanceof Error ? error.message : '生成内容时发生错误'
      }));
    }
  }, [delay, chunkSize, generateStreamingResponse, generateMockAIResponse]);

  // 非流式生成（直接获取完整响应）
  const generateContent = useCallback(async (
    prompt: string,
    useRealAPI = true
  ): Promise<string> => {
    setState(prev => ({
      ...prev,
      isStreaming: true,
      error: null
    }));

    try {
      let response: string;
      
      if (useRealAPI && defaultGLMClient) {
        response = await generateAIResponse(prompt);
      } else {
        response = await generateMockAIResponse(prompt);
      }

      setState(prev => ({
        ...prev,
        content: response,
        isStreaming: false,
        isComplete: true
      }));

      return response;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '生成内容时发生错误';
      
      setState(prev => ({
        ...prev,
        isStreaming: false,
        error: errorMessage
      }));

      throw new Error(errorMessage);
    }
  }, [generateAIResponse, generateMockAIResponse]);

  // 停止流式输出
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState(prev => ({
      ...prev,
      isStreaming: false,
      isComplete: true
    }));
  }, []);

  // 重置状态
  const reset = useCallback(() => {
    stopStreaming();
    setState({
      content: '',
      isStreaming: false,
      isComplete: false,
      error: null,
      connectionStatus: 'unknown',
      usingFallback: false
    });
  }, [stopStreaming]);

  // 测试API连接
  const testConnection = useCallback(async (): Promise<{
    success: boolean;
    latency: number;
    error?: string;
  }> => {
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
        error: error instanceof Error ? error.message : '连接测试失败'
      };
    }
  }, []);

  // 获取客户端状态
  const getClientStatus = useCallback(() => {
    return {
      isConfigured: !!defaultGLMClient,
      modelInfo: defaultGLMClient?.getModelInfo(),
    };
  }, []);

  // 获取API健康状态
  const getHealthStatus = useCallback(() => {
    return defaultHealthMonitor.getHealthStatus();
  }, []);

  // 获取GLM客户端状态
  const getGLMStatus = useCallback(() => {
    return defaultHealthMonitor.getGLMClientStatus();
  }, []);

  // 强制使用降级模式
  const forceFallbackMode = useCallback(() => {
    defaultHealthMonitor.forceFallbackMode();
    setState(prev => ({
      ...prev,
      connectionStatus: 'degraded',
      usingFallback: true
    }));
  }, []);

  // 强制使用API模式
  const forceAPIMode = useCallback(() => {
    defaultHealthMonitor.forceAPIMode();
  }, []);

  return {
    ...state,
    startStreaming,
    generateContent,
    stopStreaming,
    reset,
    testConnection,
    getClientStatus,
    getHealthStatus,
    getGLMStatus,
    forceFallbackMode,
    forceAPIMode,
    // 便捷方法
    isReady: !!defaultGLMClient || state.usingFallback,
    hasValidConfig: !!defaultGLMClient,
  };
};

// 流式文本生成的高级hook
export const useStreamingWriter = () => {
  const [isWriting, setIsWriting] = useState(false);
  const [writtenContent, setWrittenContent] = useState('');

  const writeContent = useCallback(async (
    content: string,
    onProgress?: (progress: number) => void,
    delay: number = 30
  ) => {
    setIsWriting(true);
    setWrittenContent('');

    const words = content.split(' ');
    let currentIndex = 0;

    const writeWord = () => {
      if (currentIndex >= words.length) {
        setIsWriting(false);
        return;
      }

      const word = words[currentIndex];
      setWrittenContent(prev => prev + (currentIndex > 0 ? ' ' : '') + word);
      
      const progress = ((currentIndex + 1) / words.length) * 100;
      onProgress?.(progress);
      
      currentIndex++;
      setTimeout(writeWord, delay);
    };

    writeWord();
  }, []);

  const stopWriting = useCallback(() => {
    setIsWriting(false);
  }, []);

  const clearContent = useCallback(() => {
    setWrittenContent('');
    setIsWriting(false);
  }, []);

  return {
    isWriting,
    writtenContent,
    writeContent,
    stopWriting,
    clearContent
  };
};