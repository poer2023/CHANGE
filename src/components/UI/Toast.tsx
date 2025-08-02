import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider
interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  defaultDuration?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  defaultDuration = 5000
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? defaultDuration
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    // 自动移除非持久化的toast
    if (!newToast.persistent) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [maxToasts, defaultDuration]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Toast Container
const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast Item
interface ToastItemProps {
  toast: Toast;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const { removeToast } = useToast();
  const [progress, setProgress] = useState(100);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const colorClasses = {
    success: {
      bg: 'bg-success-50 border-success-200',
      icon: 'text-success-600',
      text: 'text-success-800',
      button: 'hover:bg-success-100'
    },
    error: {
      bg: 'bg-error-50 border-error-200',
      icon: 'text-error-600',
      text: 'text-error-800',
      button: 'hover:bg-error-100'
    },
    warning: {
      bg: 'bg-warning-50 border-warning-200',
      icon: 'text-warning-600',
      text: 'text-warning-800',
      button: 'hover:bg-warning-100'
    },
    info: {
      bg: 'bg-primary-50 border-primary-200',
      icon: 'text-primary-600',
      text: 'text-primary-800',
      button: 'hover:bg-primary-100'
    }
  };

  const IconComponent = icons[toast.type];
  const colors = colorClasses[toast.type];

  // 进度条动画
  useEffect(() => {
    if (toast.persistent) return;

    const duration = toast.duration || 5000;
    const interval = 50;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - step;
        if (newProgress <= 0) {
          clearInterval(timer);
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [toast.duration, toast.persistent]);

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-lg border p-4 shadow-lg backdrop-blur-sm',
        colors.bg
      )}
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300
      }}
      layout
      role="alert"
      aria-live="polite"
    >
      {/* 进度条 */}
      {!toast.persistent && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-current opacity-30"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      )}

      <div className="flex items-start space-x-3">
        {/* 图标 */}
        <IconComponent className={cn('w-5 h-5 mt-0.5 flex-shrink-0', colors.icon)} />

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium', colors.text)}>
            {toast.title}
          </p>
          {toast.message && (
            <p className={cn('mt-1 text-sm opacity-90', colors.text)}>
              {toast.message}
            </p>
          )}
          
          {/* 操作按钮 */}
          {toast.action && (
            <button
              className={cn(
                'mt-2 text-sm font-medium underline transition-colors',
                colors.text,
                'hover:no-underline'
              )}
              onClick={toast.action.onClick}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* 关闭按钮 */}
        <button
          className={cn(
            'flex-shrink-0 p-1 rounded-md transition-colors',
            colors.button,
            colors.text
          )}
          onClick={() => removeToast(toast.id)}
          aria-label="关闭通知"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// 便捷方法
export const toast = {
  success: (title: string, message?: string, options?: Partial<Toast>) => ({
    type: 'success' as const,
    title,
    message,
    ...options
  }),
  error: (title: string, message?: string, options?: Partial<Toast>) => ({
    type: 'error' as const,
    title,
    message,
    ...options
  }),
  warning: (title: string, message?: string, options?: Partial<Toast>) => ({
    type: 'warning' as const,
    title,
    message,
    ...options
  }),
  info: (title: string, message?: string, options?: Partial<Toast>) => ({
    type: 'info' as const,
    title,
    message,
    ...options
  })
};

// Hook for easy usage
export const useToastActions = () => {
  const { addToast } = useToast();

  return {
    success: (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) =>
      addToast(toast.success(title, message, options)),
    error: (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) =>
      addToast(toast.error(title, message, options)),
    warning: (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) =>
      addToast(toast.warning(title, message, options)),
    info: (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) =>
      addToast(toast.info(title, message, options))
  };
};