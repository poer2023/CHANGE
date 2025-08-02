// 性能优化工具集

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// 防抖 Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 节流 Hook
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// 虚拟化列表 Hook
interface UseVirtualListOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualList<T>(
  list: T[],
  options: UseVirtualListOptions
) {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStartIndex = Math.floor(scrollTop / itemHeight);
  const visibleEndIndex = Math.min(
    visibleStartIndex + Math.ceil(containerHeight / itemHeight),
    list.length - 1
  );

  const startIndex = Math.max(0, visibleStartIndex - overscan);
  const endIndex = Math.min(list.length - 1, visibleEndIndex + overscan);

  const visibleItems = useMemo(() => {
    return list.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [list, startIndex, endIndex]);

  const totalHeight = list.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
}

// 交集观察者 Hook
interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);

  return { elementRef, isIntersecting, hasIntersected };
}

// 内存化 Hook
export function useMemoizedCallback<Args extends any[], Return>(
  callback: (...args: Args) => Return,
  dependencies: React.DependencyList
) {
  return useCallback(callback, dependencies);
}

// 深比较 useMemo
export function useDeepMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const ref = useRef<{ deps: React.DependencyList; value: T }>();

  if (!ref.current || !deepEqual(ref.current.deps, deps)) {
    ref.current = { deps, value: factory() };
  }

  return ref.current.value;
}

// 深度比较函数
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a == null || b == null) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}

// 异步状态管理 Hook
interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false
  });

  const execute = useCallback(async () => {
    setState({ data: null, error: null, isLoading: true });

    try {
      const result = await asyncFunction();
      setState({ data: result, error: null, isLoading: false });
      return result;
    } catch (error) {
      setState({ data: null, error: error as Error, isLoading: false });
      throw error;
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, execute };
}

// 本地存储缓存 Hook
export function useLocalStorageCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number; // 毫秒
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {}
) {
  const {
    ttl = 5 * 60 * 1000, // 默认5分钟
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCachedData = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const { value, timestamp } = JSON.parse(cached);
      
      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(key);
        return null;
      }

      return deserialize(value);
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }, [key, ttl, deserialize]);

  const setCachedData = useCallback((value: T) => {
    try {
      const cacheData = {
        value: serialize(value),
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }, [key, serialize]);

  const fetchData = useCallback(async () => {
    const cached = getCachedData();
    if (cached) {
      setData(cached);
      return cached;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      setCachedData(result);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, getCachedData, setCachedData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const invalidate = useCallback(() => {
    localStorage.removeItem(key);
    setData(null);
  }, [key]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    invalidate
  };
}

// 图片预加载工具
export function preloadImages(urls: string[]): Promise<void[]> {
  const promises = urls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  });

  return Promise.allSettled(promises).then(() => []);
}

// 资源预加载 Hook
export function usePreloadResources(
  resources: Array<{ type: 'image' | 'script' | 'style'; url: string }>
) {
  const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadResource = (resource: typeof resources[0]) => {
      return new Promise<void>((resolve, reject) => {
        let element: HTMLImageElement | HTMLScriptElement | HTMLLinkElement;

        switch (resource.type) {
          case 'image':
            element = new Image();
            (element as HTMLImageElement).src = resource.url;
            break;
          case 'script':
            element = document.createElement('script');
            (element as HTMLScriptElement).src = resource.url;
            document.head.appendChild(element);
            break;
          case 'style':
            element = document.createElement('link');
            (element as HTMLLinkElement).rel = 'stylesheet';
            (element as HTMLLinkElement).href = resource.url;
            document.head.appendChild(element);
            break;
        }

        element.onload = () => {
          setLoadedResources(prev => new Set(prev).add(resource.url));
          resolve();
        };
        element.onerror = () => reject(new Error(`Failed to load ${resource.type}: ${resource.url}`));
      });
    };

    resources.forEach(resource => {
      loadResource(resource).catch(error => {
        console.warn('Resource preload failed:', error);
      });
    });
  }, [resources]);

  return {
    loadedResources,
    isResourceLoaded: (url: string) => loadedResources.has(url),
    allLoaded: loadedResources.size === resources.length
  };
}

// 性能监控工具
export const performanceMonitor = {
  // 组件渲染时间测量
  measureRender: (componentName: string) => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      const duration = end - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${duration.toFixed(2)}ms`);
      }
      
      // 记录长时间渲染
      if (duration > 16) { // 超过一帧的时间
        console.warn(`Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`);
      }
    };
  },

  // 内存使用监控
  checkMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
    }
    return null;
  },

  // 网络性能监控
  measureNetworkTiming: (url: string) => {
    if ('getEntriesByName' in performance) {
      const entries = performance.getEntriesByName(url);
      if (entries.length > 0) {
        const entry = entries[0] as PerformanceResourceTiming;
        return {
          dns: entry.domainLookupEnd - entry.domainLookupStart,
          tcp: entry.connectEnd - entry.connectStart,
          ssl: entry.connectEnd - entry.secureConnectionStart,
          download: entry.responseEnd - entry.responseStart,
          total: entry.responseEnd - entry.startTime
        };
      }
    }
    return null;
  }
};

// Bundle 分析工具
export const bundleAnalyzer = {
  // 获取已加载的模块信息
  getLoadedModules: () => {
    if (process.env.NODE_ENV === 'development') {
      // 在开发环境中，webpack 会在 window 上暴露模块信息
      return (window as any).__webpack_require__ ? 
        Object.keys((window as any).__webpack_require__.cache || {}) : [];
    }
    return [];
  },

  // 估算 Bundle 大小
  estimateBundleSize: async () => {
    try {
      const response = await fetch('/stats.json'); // 需要 webpack-bundle-analyzer 生成
      const stats = await response.json();
      return stats;
    } catch {
      console.warn('Bundle stats not available');
      return null;
    }
  }
};

// Web Workers 工具
export class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{ task: any; resolve: Function; reject: Function }> = [];
  private busy: boolean[] = [];

  constructor(
    private workerScript: string,
    private poolSize: number = navigator.hardwareConcurrency || 4
  ) {
    this.initializeWorkers();
  }

  private initializeWorkers() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerScript);
      this.workers.push(worker);
      this.busy.push(false);
    }
  }

  async execute<T>(task: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const availableWorkerIndex = this.busy.indexOf(false);
      
      if (availableWorkerIndex !== -1) {
        this.runTask(availableWorkerIndex, task, resolve, reject);
      } else {
        this.queue.push({ task, resolve, reject });
      }
    });
  }

  private runTask(workerIndex: number, task: any, resolve: Function, reject: Function) {
    const worker = this.workers[workerIndex];
    this.busy[workerIndex] = true;

    const handleMessage = (event: MessageEvent) => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
      this.busy[workerIndex] = false;
      
      resolve(event.data);
      this.processQueue();
    };

    const handleError = (error: ErrorEvent) => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
      this.busy[workerIndex] = false;
      
      reject(error);
      this.processQueue();
    };

    worker.addEventListener('message', handleMessage);
    worker.addEventListener('error', handleError);
    worker.postMessage(task);
  }

  private processQueue() {
    if (this.queue.length === 0) return;

    const availableWorkerIndex = this.busy.indexOf(false);
    if (availableWorkerIndex !== -1) {
      const { task, resolve, reject } = this.queue.shift()!;
      this.runTask(availableWorkerIndex, task, resolve, reject);
    }
  }

  terminate() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.busy = [];
    this.queue = [];
  }
}