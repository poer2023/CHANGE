import { useState, useEffect, useCallback, useRef } from 'react';
import { ContentAnalysisResult, contentAnalyzer, quickQualityCheck } from '../services/content-analyzer';
import { useDebounce } from './useDebounce';

interface UseContentAnalysisOptions {
  debounceDelay?: number;
  enableRealTimeAnalysis?: boolean;
  enableCache?: boolean;
  autoAnalyze?: boolean;
}

interface ContentAnalysisState {
  result: ContentAnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  lastAnalyzedContent: string;
  quickResult: {
    score: number;
    issues: number;
    suggestions: string[];
  } | null;
}

interface AnalysisCache {
  [contentHash: string]: {
    result: ContentAnalysisResult;
    timestamp: number;
    expiresAt: number;
  };
}

// 缓存过期时间：30分钟
const CACHE_DURATION = 30 * 60 * 1000;

// 内容hash生成函数
function generateContentHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

export const useContentAnalysis = (
  content: string,
  options: UseContentAnalysisOptions = {}
) => {
  const {
    debounceDelay = 1000,
    enableRealTimeAnalysis = true,
    enableCache = true,
    autoAnalyze = true
  } = options;

  const [state, setState] = useState<ContentAnalysisState>({
    result: null,
    isAnalyzing: false,
    error: null,
    lastAnalyzedContent: '',
    quickResult: null
  });

  const cacheRef = useRef<AnalysisCache>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // 防抖处理的内容
  const debouncedContent = useDebounce(content, debounceDelay);

  // 清理过期缓存
  const cleanExpiredCache = useCallback(() => {
    const now = Date.now();
    const cache = cacheRef.current;
    
    Object.keys(cache).forEach(key => {
      if (cache[key].expiresAt < now) {
        delete cache[key];
      }
    });
  }, []);

  // 从缓存获取结果
  const getCachedResult = useCallback((contentHash: string): ContentAnalysisResult | null => {
    if (!enableCache) return null;
    
    const cached = cacheRef.current[contentHash];
    if (cached && cached.expiresAt > Date.now()) {
      return cached.result;
    }
    return null;
  }, [enableCache]);

  // 缓存分析结果
  const setCachedResult = useCallback((contentHash: string, result: ContentAnalysisResult) => {
    if (!enableCache) return;
    
    const now = Date.now();
    cacheRef.current[contentHash] = {
      result,
      timestamp: now,
      expiresAt: now + CACHE_DURATION
    };
    
    // 清理过期缓存
    cleanExpiredCache();
  }, [enableCache, cleanExpiredCache]);

  // 执行完整分析
  const analyzeContent = useCallback(async (
    contentToAnalyze: string,
    options?: {
      citationStyle?: 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'Harvard';
      paperType?: string;
      field?: string;
      force?: boolean; // 强制重新分析，忽略缓存
    }
  ): Promise<ContentAnalysisResult | null> => {
    if (!contentToAnalyze.trim()) {
      setState(prev => ({ ...prev, result: null, error: null }));
      return null;
    }

    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const contentHash = generateContentHash(contentToAnalyze);
    
    // 检查缓存（除非强制重新分析）
    if (!options?.force) {
      const cachedResult = getCachedResult(contentHash);
      if (cachedResult) {
        setState(prev => ({
          ...prev,
          result: cachedResult,
          isAnalyzing: false,
          error: null,
          lastAnalyzedContent: contentToAnalyze
        }));
        return cachedResult;
      }
    }

    setState(prev => ({
      ...prev,
      isAnalyzing: true,
      error: null
    }));

    try {
      const result = await contentAnalyzer.analyzeContent(contentToAnalyze, {
        citationStyle: options?.citationStyle,
        paperType: options?.paperType,
        field: options?.field
      });

      // 检查请求是否已被取消
      if (abortControllerRef.current?.signal.aborted) {
        return null;
      }

      // 缓存结果
      setCachedResult(contentHash, result);

      setState(prev => ({
        ...prev,
        result,
        isAnalyzing: false,
        error: null,
        lastAnalyzedContent: contentToAnalyze
      }));

      return result;
    } catch (error) {
      if (abortControllerRef.current?.signal.aborted) {
        return null;
      }

      const errorMessage = error instanceof Error ? error.message : '分析过程中发生错误';
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage
      }));
      return null;
    }
  }, [getCachedResult, setCachedResult]);

  // 执行快速质量检查
  const quickAnalyze = useCallback(async (contentToAnalyze: string) => {
    if (!contentToAnalyze.trim()) {
      setState(prev => ({ ...prev, quickResult: null }));
      return;
    }

    try {
      const quickResult = await quickQualityCheck(contentToAnalyze);
      setState(prev => ({
        ...prev,
        quickResult
      }));
    } catch (error) {
      console.warn('Quick analysis failed:', error);
    }
  }, []);

  // 重新分析
  const reanalyze = useCallback((options?: {
    citationStyle?: 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'Harvard';
    paperType?: string;
    field?: string;
  }) => {
    return analyzeContent(content, { ...options, force: true });
  }, [analyzeContent, content]);

  // 清除分析结果
  const clearAnalysis = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      result: null,
      isAnalyzing: false,
      error: null,
      lastAnalyzedContent: '',
      quickResult: null
    });
  }, []);

  // 清除缓存
  const clearCache = useCallback(() => {
    cacheRef.current = {};
  }, []);

  // 获取分析进度（如果支持）
  const getAnalysisProgress = useCallback((): number => {
    // 这里可以实现更复杂的进度跟踪
    return state.isAnalyzing ? 50 : (state.result ? 100 : 0);
  }, [state.isAnalyzing, state.result]);

  // 实时分析效果
  useEffect(() => {
    if (!enableRealTimeAnalysis || !autoAnalyze) return;
    
    if (debouncedContent && debouncedContent !== state.lastAnalyzedContent) {
      analyzeContent(debouncedContent);
    }
  }, [debouncedContent, enableRealTimeAnalysis, autoAnalyze, analyzeContent, state.lastAnalyzedContent]);

  // 快速分析效果（更频繁的更新）
  useEffect(() => {
    if (!enableRealTimeAnalysis) return;
    
    const quickContent = useDebounce(content, 500);
    if (quickContent && quickContent.length > 100) { // 至少100字符才进行快速分析
      quickAnalyze(quickContent);
    }
  }, [content, enableRealTimeAnalysis, quickAnalyze]);

  // 清理效果
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // 缓存统计
  const getCacheStats = useCallback(() => {
    const cache = cacheRef.current;
    const entries = Object.values(cache);
    const now = Date.now();
    
    return {
      totalEntries: entries.length,
      validEntries: entries.filter(entry => entry.expiresAt > now).length,
      expiredEntries: entries.filter(entry => entry.expiresAt <= now).length,
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : null,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : null
    };
  }, []);

  return {
    // 状态
    result: state.result,
    quickResult: state.quickResult,
    isAnalyzing: state.isAnalyzing,
    error: state.error,
    lastAnalyzedContent: state.lastAnalyzedContent,
    progress: getAnalysisProgress(),
    
    // 操作
    analyze: analyzeContent,
    quickAnalyze,
    reanalyze,
    clearAnalysis,
    clearCache,
    
    // 工具
    getCacheStats,
    
    // 状态检查
    hasResult: !!state.result,
    hasError: !!state.error,
    isContentChanged: content !== state.lastAnalyzedContent,
    shouldShowQuickResult: !!state.quickResult && !state.result && !state.isAnalyzing
  };
};

// 简化版Hook，用于快速质量检查
export const useQuickQualityCheck = (content: string, debounceDelay = 500) => {
  const [quickResult, setQuickResult] = useState<{
    score: number;
    issues: number;
    suggestions: string[];
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const debouncedContent = useDebounce(content, debounceDelay);

  useEffect(() => {
    if (!debouncedContent || debouncedContent.length < 50) {
      setQuickResult(null);
      return;
    }

    setIsChecking(true);
    quickQualityCheck(debouncedContent)
      .then(result => {
        setQuickResult(result);
        setIsChecking(false);
      })
      .catch(() => {
        setIsChecking(false);
      });
  }, [debouncedContent]);

  return {
    result: quickResult,
    isChecking,
    hasResult: !!quickResult
  };
};

// 批量分析Hook
export const useBatchContentAnalysis = () => {
  const [analyses, setAnalyses] = useState<Map<string, ContentAnalysisResult>>(new Map());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const analyzeBatch = useCallback(async (
    contents: { id: string; content: string; options?: any }[]
  ) => {
    setIsAnalyzing(true);
    setProgress(0);
    
    const results = new Map<string, ContentAnalysisResult>();
    
    for (let i = 0; i < contents.length; i++) {
      const { id, content, options } = contents[i];
      
      try {
        const result = await contentAnalyzer.analyzeContent(content, options);
        results.set(id, result);
      } catch (error) {
        console.error(`Failed to analyze content ${id}:`, error);
      }
      
      setProgress(((i + 1) / contents.length) * 100);
    }
    
    setAnalyses(results);
    setIsAnalyzing(false);
    setProgress(100);
    
    return results;
  }, []);

  const getAnalysis = useCallback((id: string) => {
    return analyses.get(id);
  }, [analyses]);

  const clearBatch = useCallback(() => {
    setAnalyses(new Map());
    setProgress(0);
  }, []);

  return {
    analyses,
    isAnalyzing,
    progress,
    analyzeBatch,
    getAnalysis,
    clearBatch,
    hasAnalyses: analyses.size > 0
  };
};