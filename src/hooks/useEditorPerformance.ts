import React, { useCallback, useRef, useMemo, useEffect, useState } from 'react';

// 原生实现的debounce函数
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// 原生实现的throttle函数
function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let isThrottled = false;
  return (...args: Parameters<T>) => {
    if (!isThrottled) {
      func(...args);
      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, delay);
    }
  };
}

// 性能监控接口
interface PerformanceMetrics {
  renderTime: number;
  updateCount: number;
  memoryUsage: number;
  lastUpdate: Date;
}

// 编辑器性能优化配置
interface PerformanceConfig {
  debounceDelay: number;
  throttleDelay: number;
  maxRenderUpdates: number;
  virtualScrollThreshold: number;
  lazyLoadingEnabled: boolean;
  memoizationEnabled: boolean;
}

export const useEditorPerformance = (config: Partial<PerformanceConfig> = {}) => {
  const defaultConfig: PerformanceConfig = {
    debounceDelay: 300,
    throttleDelay: 100,
    maxRenderUpdates: 60,
    virtualScrollThreshold: 100,
    lazyLoadingEnabled: true,
    memoizationEnabled: true,
    ...config
  };

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    updateCount: 0,
    memoryUsage: 0,
    lastUpdate: new Date()
  });

  const renderStartTimeRef = useRef<number>(0);
  const updateCountRef = useRef<number>(0);
  const lastRenderTimeRef = useRef<number>(0);

  // 防抖文本更新
  const debouncedUpdate = useCallback(
    debounce((updateFn: Function, ...args: any[]) => {
      const startTime = performance.now();
      updateFn(...args);
      const endTime = performance.now();
      
      updateCountRef.current += 1;
      lastRenderTimeRef.current = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        renderTime: endTime - startTime,
        updateCount: updateCountRef.current,
        lastUpdate: new Date()
      }));
    }, defaultConfig.debounceDelay),
    [defaultConfig.debounceDelay]
  );

  // 节流滚动事件
  const throttledScroll = useCallback(
    throttle((scrollFn: Function, ...args: any[]) => {
      scrollFn(...args);
    }, defaultConfig.throttleDelay),
    [defaultConfig.throttleDelay]
  );

  // 虚拟滚动优化
  const useVirtualScrolling = useCallback((
    items: any[],
    itemHeight: number,
    containerHeight: number,
    scrollTop: number
  ) => {
    return useMemo(() => {
      if (!defaultConfig.lazyLoadingEnabled || items.length < defaultConfig.virtualScrollThreshold) {
        return { visibleItems: items, startIndex: 0, endIndex: items.length - 1 };
      }

      const visibleCount = Math.ceil(containerHeight / itemHeight);
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(startIndex + visibleCount + 2, items.length - 1);
      const visibleItems = items.slice(startIndex, endIndex + 1);

      return { visibleItems, startIndex, endIndex };
    }, [items, itemHeight, containerHeight, scrollTop]);
  }, [defaultConfig.lazyLoadingEnabled, defaultConfig.virtualScrollThreshold]);

  // 内容分块渲染
  const useChunkedRendering = useCallback((
    content: string,
    chunkSize: number = 1000
  ) => {
    return useMemo(() => {
      if (!defaultConfig.lazyLoadingEnabled || content.length < chunkSize) {
        return [content];
      }

      const chunks: string[] = [];
      for (let i = 0; i < content.length; i += chunkSize) {
        chunks.push(content.slice(i, i + chunkSize));
      }
      return chunks;
    }, [content, chunkSize, defaultConfig.lazyLoadingEnabled]);
  }, [defaultConfig.lazyLoadingEnabled]);

  // 智能重新渲染决策
  const shouldRerender = useCallback((
    prevProps: any,
    nextProps: any,
    shallowCompare: boolean = true
  ): boolean => {
    if (!defaultConfig.memoizationEnabled) return true;

    if (shallowCompare) {
      const prevKeys = Object.keys(prevProps);
      const nextKeys = Object.keys(nextProps);
      
      if (prevKeys.length !== nextKeys.length) return true;
      
      return prevKeys.some(key => prevProps[key] !== nextProps[key]);
    }

    return JSON.stringify(prevProps) !== JSON.stringify(nextProps);
  }, [defaultConfig.memoizationEnabled]);

  // 内存使用监控
  const monitorMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      return {
        used: Math.round(memInfo.usedJSHeapSize / 1048576), // MB
        total: Math.round(memInfo.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memInfo.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return { used: 0, total: 0, limit: 0 };
  }, []);

  // 性能警告检测
  const checkPerformanceWarnings = useCallback(() => {
    const warnings: string[] = [];
    
    if (metrics.renderTime > 16) { // > 60fps
      warnings.push('渲染时间过长，可能影响流畅度');
    }
    
    if (metrics.updateCount > defaultConfig.maxRenderUpdates) {
      warnings.push('更新频率过高，建议优化防抖设置');
    }
    
    const memoryInfo = monitorMemoryUsage();
    if (memoryInfo.used > memoryInfo.limit * 0.8) {
      warnings.push('内存使用过高，建议启用虚拟滚动');
    }
    
    return warnings;
  }, [metrics, defaultConfig.maxRenderUpdates, monitorMemoryUsage]);

  // 自动性能优化建议
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions: string[] = [];
    
    if (metrics.renderTime > 10) {
      suggestions.push('考虑启用虚拟滚动优化大量内容渲染');
      suggestions.push('增加防抖延迟以减少更新频率');
    }
    
    if (metrics.updateCount > 50) {
      suggestions.push('使用memo优化组件重新渲染');
      suggestions.push('启用内容分块渲染');
    }
    
    return suggestions;
  }, [metrics]);

  // 性能重置
  const resetMetrics = useCallback(() => {
    updateCountRef.current = 0;
    setMetrics({
      renderTime: 0,
      updateCount: 0,
      memoryUsage: 0,
      lastUpdate: new Date()
    });
  }, []);

  // 监控性能指标
  useEffect(() => {
    const interval = setInterval(() => {
      const memoryInfo = monitorMemoryUsage();
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memoryInfo.used
      }));
    }, 5000); // 每5秒更新一次内存使用情况

    return () => clearInterval(interval);
  }, [monitorMemoryUsage]);

  // 渲染性能跟踪
  const trackRenderStart = useCallback(() => {
    renderStartTimeRef.current = performance.now();
  }, []);

  const trackRenderEnd = useCallback(() => {
    if (renderStartTimeRef.current > 0) {
      const renderTime = performance.now() - renderStartTimeRef.current;
      updateCountRef.current += 1;
      
      setMetrics(prev => ({
        ...prev,
        renderTime,
        updateCount: updateCountRef.current,
        lastUpdate: new Date()
      }));
      
      renderStartTimeRef.current = 0;
    }
  }, []);

  // 批量更新优化
  const batchUpdates = useCallback((updates: (() => void)[]) => {
    // 使用 React 18 的自动批处理
    Promise.resolve().then(() => {
      updates.forEach(update => update());
    });
  }, []);

  // 延迟加载组件
  const lazyLoadComponent = useCallback((
    componentLoader: () => Promise<any>,
    fallback?: React.ComponentType
  ) => {
    if (!defaultConfig.lazyLoadingEnabled) {
      return componentLoader;
    }

    return React.lazy(componentLoader);
  }, [defaultConfig.lazyLoadingEnabled]);

  return {
    // 性能指标
    metrics,
    warnings: checkPerformanceWarnings(),
    suggestions: getOptimizationSuggestions(),

    // 优化方法
    debouncedUpdate,
    throttledScroll,
    useVirtualScrolling,
    useChunkedRendering,
    shouldRerender,
    batchUpdates,
    lazyLoadComponent,

    // 监控方法
    trackRenderStart,
    trackRenderEnd,
    monitorMemoryUsage,
    resetMetrics,

    // 配置
    config: defaultConfig
  };
};

// 性能优化HOC
export const withPerformanceOptimization = <P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  optimizationConfig?: Partial<PerformanceConfig>
) => {
  const WrappedComponent = React.memo((props: P) => {
    const { trackRenderStart, trackRenderEnd } = useEditorPerformance(optimizationConfig);
    
    useEffect(() => {
      trackRenderStart();
      return () => {
        trackRenderEnd();
      };
    });

    return React.createElement(Component, props);
  });

  WrappedComponent.displayName = `withPerformanceOptimization(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// 虚拟滚动Hook
export const useVirtualList = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const { useVirtualScrolling } = useEditorPerformance();

  const virtualizedItems = useVirtualScrolling(items, itemHeight, containerHeight, scrollTop);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    ...virtualizedItems,
    handleScroll,
    totalHeight: items.length * itemHeight,
    offsetY: virtualizedItems.startIndex * itemHeight
  };
};

// 内容分析性能优化
export const useOptimizedContentAnalysis = () => {
  const { debouncedUpdate } = useEditorPerformance({ debounceDelay: 500 });
  
  const analyzeContent = useCallback((
    content: string,
    analysisFunction: (content: string) => void
  ) => {
    debouncedUpdate(analysisFunction, content);
  }, [debouncedUpdate]);

  return { analyzeContent };
};