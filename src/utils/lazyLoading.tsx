import React, { Suspense, lazy, ComponentType, LazyExoticComponent } from 'react';
import { LoadingSpinner, FullScreenLoading } from '@/components/UI';

// 懒加载包装器类型
interface LazyWrapperOptions {
  fallback?: React.ComponentType;
  delay?: number;
  retryAttempts?: number;
  showFullScreen?: boolean;
}

// 创建懒加载组件的工具函数
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyWrapperOptions = {}
): LazyExoticComponent<T> {
  const {
    fallback,
    delay = 200,
    retryAttempts = 3,
    showFullScreen = false
  } = options;

  // 添加重试逻辑的导入函数
  const importWithRetry = async (): Promise<{ default: T }> => {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        return await importFn();
      } catch (error) {
        lastError = error as Error;
        
        // 如果不是最后一次尝试，等待一段时间后重试
        if (attempt < retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      }
    }
    
    throw lastError;
  };

  return lazy(importWithRetry);
}

// 默认加载组件
const DefaultFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <LoadingSpinner size="lg" text="加载中..." />
  </div>
);

// 全屏加载组件
const FullScreenFallback: React.FC = () => (
  <FullScreenLoading text="正在加载页面..." />
);

// 懒加载包装器组件
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  showFullScreen?: boolean;
  errorBoundary?: boolean;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback: CustomFallback,
  showFullScreen = false,
  errorBoundary = true
}) => {
  const FallbackComponent = CustomFallback || 
    (showFullScreen ? FullScreenFallback : DefaultFallback);

  const content = (
    <Suspense fallback={<FallbackComponent />}>
      {children}
    </Suspense>
  );

  if (errorBoundary) {
    return (
      <ErrorBoundary>
        {content}
      </ErrorBoundary>
    );
  }

  return content;
};

// 简化的错误边界（避免循环依赖）
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[200px] p-4">
          <div className="text-center">
            <div className="text-red-500 mb-2">加载失败</div>
            <button
              className="text-blue-600 hover:text-blue-800 underline"
              onClick={() => window.location.reload()}
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 预定义的懒加载组件
export const lazyComponents = {
  // 页面组件
  Dashboard: createLazyComponent(
    () => import('@/pages/Dashboard'),
    { showFullScreen: true }
  ),
  
  Papers: createLazyComponent(
    () => import('@/pages/Papers'),
    { showFullScreen: true }
  ),
  
  ModularEditor: createLazyComponent(
    () => import('@/components/editor/ModularEditor'),
    { showFullScreen: true }
  ),
  
  AgentDemo: createLazyComponent(
    () => import('@/pages/AgentDemo'),
    { showFullScreen: true }
  ),
  
  // 特定组件
  RichTextEditor: createLazyComponent(
    () => import('@/components/editor/RichTextEditor')
  ),
  
  TemplateLibrary: createLazyComponent(
    () => import('@/components/editor/TemplateLibrary')
  ),
  
  // Chart 组件（占位符 - 组件不存在）
  Charts: createLazyComponent(
    () => Promise.resolve({ 
      default: () => <div className="p-4 text-center text-gray-500">图表组件暂未可用</div> 
    })
  )
};

// 路由懒加载 Hook
export const useRoutePreload = () => {
  const preloadRoute = React.useCallback((routeImport: () => Promise<any>) => {
    // 在浏览器空闲时预加载
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        routeImport().catch(() => {
          // 静默处理预加载失败
        });
      });
    } else {
      // 降级到 setTimeout
      setTimeout(() => {
        routeImport().catch(() => {});
      }, 100);
    }
  }, []);

  return { preloadRoute };
};

// 图片懒加载组件
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  placeholder?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  fallback,
  placeholder,
  threshold = 0.1,
  rootMargin = '50px',
  className,
  alt,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const imageSrc = hasError ? fallback : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          {placeholder}
        </div>
      )}
      
      <img
        ref={imgRef}
        src={isInView ? imageSrc : undefined}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};

// 内容懒加载组件
interface LazyContentProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

export const LazyContent: React.FC<LazyContentProps> = ({
  children,
  placeholder,
  threshold = 0.1,
  rootMargin = '50px',
  delay = 0
}) => {
  const [isInView, setIsInView] = React.useState(false);
  const [shouldRender, setShouldRender] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  React.useEffect(() => {
    if (isInView) {
      if (delay > 0) {
        const timer = setTimeout(() => setShouldRender(true), delay);
        return () => clearTimeout(timer);
      } else {
        setShouldRender(true);
      }
    }
  }, [isInView, delay]);

  return (
    <div ref={ref}>
      {shouldRender ? children : placeholder}
    </div>
  );
};

// 模块预加载工具
export const modulePreloader = {
  preloadedModules: new Set<string>(),
  
  preload: async (moduleName: string, importFn: () => Promise<any>) => {
    if (modulePreloader.preloadedModules.has(moduleName)) {
      return;
    }
    
    try {
      await importFn();
      modulePreloader.preloadedModules.add(moduleName);
    } catch (error) {
      console.warn(`Failed to preload module: ${moduleName}`, error);
    }
  },
  
  preloadMultiple: async (modules: Array<{ name: string; import: () => Promise<any> }>) => {
    const promises = modules.map(({ name, import: importFn }) =>
      modulePreloader.preload(name, importFn)
    );
    
    await Promise.allSettled(promises);
  }
};

// 性能监控工具
export const performanceMonitor = {
  startTime: Date.now(),
  
  measureComponentLoad: (componentName: string) => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const duration = end - start;
      
      if ((typeof process !== 'undefined' && process.env?.NODE_ENV) === 'development') {
        console.log(`Component ${componentName} loaded in ${duration.toFixed(2)}ms`);
      }
      
      // 在生产环境中，可以发送到分析服务
      if ((typeof process !== 'undefined' && process.env?.NODE_ENV) === 'production' && duration > 1000) {
        // 记录慢加载组件
        console.warn(`Slow component load: ${componentName} took ${duration.toFixed(2)}ms`);
      }
    };
  },
  
  measureChunkLoad: (chunkName: string) => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const duration = end - start;
      
      if ((typeof process !== 'undefined' && process.env?.NODE_ENV) === 'development') {
        console.log(`Chunk ${chunkName} loaded in ${duration.toFixed(2)}ms`);
      }
    };
  }
};