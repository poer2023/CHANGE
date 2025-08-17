import { useState, useCallback } from 'react';
import { useCredit } from '@/contexts/CreditContext';
import { ServiceType } from '@/lib/pricing';
import { toast } from '@/hooks/use-toast';

interface UseServiceConsumptionOptions {
  onInsufficientBalance?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface ServiceConsumptionResult {
  isLoading: boolean;
  consumeService: (serviceType: ServiceType, wordCount: number, description: string) => Promise<boolean>;
  canAffordService: (serviceType: ServiceType, wordCount: number) => boolean;
  getServiceCost: (serviceType: ServiceType, wordCount: number) => number;
  estimateWordsNeeded: (text: string) => number;
}

export function useServiceConsumption(options: UseServiceConsumptionOptions = {}): ServiceConsumptionResult {
  const [isLoading, setIsLoading] = useState(false);
  const { 
    consumeCredits, 
    canAfford, 
    getCost, 
    getBalance 
  } = useCredit();

  const {
    onInsufficientBalance,
    onSuccess,
    onError
  } = options;

  // 消费服务
  const consumeService = useCallback(async (
    serviceType: ServiceType,
    wordCount: number,
    description: string
  ): Promise<boolean> => {
    if (isLoading) return false;

    setIsLoading(true);
    
    try {
      // 检查余额
      if (!canAfford(serviceType, wordCount)) {
        const balance = getBalance();
        const needed = Math.ceil(wordCount);
        const shortage = needed - balance;
        
        toast({
          title: "余额不足",
          description: `当前余额 ${balance} 字，需要 ${needed} 字，还需 ${shortage} 字`,
          variant: "destructive",
        });
        
        onInsufficientBalance?.();
        return false;
      }

      // 执行扣费
      const success = await consumeCredits(serviceType, wordCount, description);
      
      if (success) {
        toast({
          title: "服务使用成功",
          description: `已消费 ${Math.ceil(wordCount)} 字，当前余额 ${getBalance()} 字`,
        });
        onSuccess?.();
        return true;
      } else {
        throw new Error('消费失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '服务使用失败';
      toast({
        title: "服务使用失败",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, consumeCredits, canAfford, getBalance, onInsufficientBalance, onSuccess, onError]);

  // 检查是否能够承担服务费用
  const canAffordService = useCallback((serviceType: ServiceType, wordCount: number): boolean => {
    return canAfford(serviceType, wordCount);
  }, [canAfford]);

  // 获取服务费用
  const getServiceCost = useCallback((serviceType: ServiceType, wordCount: number): number => {
    return getCost(serviceType, wordCount);
  }, [getCost]);

  // 估算文本字数
  const estimateWordsNeeded = useCallback((text: string): number => {
    // 简单的字数估算，可以根据实际需求调整
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    const punctuation = (text.match(/[，。！？；：""''（）【】]/g) || []).length;
    
    // 中文字符按1:1计算，英文单词按平均5个字符计算，标点符号按0.5计算
    return Math.ceil(chineseChars + englishWords * 5 + punctuation * 0.5);
  }, []);

  return {
    isLoading,
    consumeService,
    canAffordService,
    getServiceCost,
    estimateWordsNeeded
  };
}

// 预定义服务类型的快捷Hook
export function useEssayGeneration(options?: UseServiceConsumptionOptions) {
  const consumption = useServiceConsumption(options);
  
  const generateEssay = useCallback(async (prompt: string, targetLength: number = 1000) => {
    const description = `论文生成: ${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}`;
    return consumption.consumeService('essay_generation', targetLength, description);
  }, [consumption]);

  return {
    ...consumption,
    generateEssay
  };
}

export function useAIChat(options?: UseServiceConsumptionOptions) {
  const consumption = useServiceConsumption(options);
  
  const sendMessage = useCallback(async (message: string) => {
    const wordCount = consumption.estimateWordsNeeded(message);
    const description = `AI对话: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`;
    return consumption.consumeService('ai_chat', wordCount, description);
  }, [consumption]);

  return {
    ...consumption,
    sendMessage
  };
}

export function useDocumentAnalysis(options?: UseServiceConsumptionOptions) {
  const consumption = useServiceConsumption(options);
  
  const analyzeDocument = useCallback(async (fileName: string, contentLength: number) => {
    const description = `文档分析: ${fileName}`;
    return consumption.consumeService('document_analysis', contentLength, description);
  }, [consumption]);

  return {
    ...consumption,
    analyzeDocument
  };
}

export function useTranslation(options?: UseServiceConsumptionOptions) {
  const consumption = useServiceConsumption(options);
  
  const translateText = useCallback(async (text: string, fromLang: string, toLang: string) => {
    const wordCount = consumption.estimateWordsNeeded(text);
    const description = `翻译: ${fromLang} → ${toLang}`;
    return consumption.consumeService('translation', wordCount, description);
  }, [consumption]);

  return {
    ...consumption,
    translateText
  };
}