import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from './Button';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // 调用错误处理回调
    this.props.onError?.(error, errorInfo);

    // 在开发环境中记录错误
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <motion.div
            className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* 错误图标 */}
            <motion.div
              className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </motion.div>

            {/* 错误标题 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              哎呀，出错了！
            </h1>

            {/* 错误描述 */}
            <p className="text-gray-600 mb-6">
              应用程序遇到了一个意外错误。我们已经记录了这个问题，正在努力修复。
            </p>

            {/* 错误详情 (仅在开发环境或允许显示详情时显示) */}
            {(process.env.NODE_ENV === 'development' || this.props.showDetails) && this.state.error && (
              <details className="mb-6 text-left bg-gray-50 rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  <Bug className="inline w-4 h-4 mr-1" />
                  错误详情
                </summary>
                <div className="mt-2 text-xs font-mono text-red-600 bg-red-50 p-3 rounded border">
                  <div className="mb-2">
                    <strong>错误:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>堆栈:</strong>
                      <pre className="mt-1 whitespace-pre-wrap break-all">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* 操作按钮 */}
            <div className="space-y-3">
              <Button
                onClick={this.handleReset}
                className="w-full"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重试
              </Button>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={this.handleReload}
                  className="flex-1"
                >
                  刷新页面
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-1" />
                  回到首页
                </Button>
              </div>
            </div>

            {/* 支持信息 */}
            <p className="mt-6 text-xs text-gray-500">
              如果问题持续存在，请联系技术支持。
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 网络错误组件
interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
  onRetry,
  message = '网络连接出现问题，请检查您的网络设置'
}) => {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-yellow-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        网络连接错误
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          重试
        </Button>
      )}
    </motion.div>
  );
};

// 404 错误组件
export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-6xl font-bold text-primary-600 mb-4"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          404
        </motion.div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          页面未找到
        </h1>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在。可能是页面已被移动或删除，或者您输入了错误的网址。
        </p>
        
        <div className="space-x-4">
          <Button onClick={() => window.history.back()}>
            返回上一页
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <Home className="w-4 h-4 mr-2" />
            回到首页
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// 服务器错误组件
export const ServerError: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-6xl font-bold text-red-600 mb-4"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          500
        </motion.div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          服务器错误
        </h1>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          服务器遇到了一个错误，无法完成您的请求。我们的技术团队已经收到通知，正在努力修复这个问题。
        </p>
        
        <div className="space-x-4">
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新页面
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <Home className="w-4 h-4 mr-2" />
            回到首页
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// 通用错误显示组件
interface ErrorDisplayProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  showIcon?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = '出现错误',
  message = '请稍后重试',
  actionLabel = '重试',
  onAction,
  showIcon = true
}) => {
  return (
    <motion.div
      className="text-center py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {showIcon && (
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6">
        {message}
      </p>
      
      {onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};