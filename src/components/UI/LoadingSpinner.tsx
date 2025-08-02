import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <motion.div
        className={cn(
          'border-2 border-current border-t-transparent rounded-full',
          sizeClasses[size],
          colorClasses[color]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        role="status"
        aria-label="加载中"
      />
      {text && (
        <motion.p
          className={cn(
            'mt-2 font-medium',
            colorClasses[color],
            textSizeClasses[size]
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// 全屏加载组件
interface FullScreenLoadingProps {
  text?: string;
  showBackground?: boolean;
}

export const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
  text = '加载中...',
  showBackground = true
}) => {
  return (
    <motion.div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        showBackground && 'bg-black/20 backdrop-blur-sm'
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="正在加载"
    >
      <motion.div
        className="bg-white rounded-xl p-8 shadow-xl min-w-[200px]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <LoadingSpinner size="lg" text={text} />
      </motion.div>
    </motion.div>
  );
};

// 骨架屏组件
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animation = true
}) => {
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  };

  const baseClasses = 'bg-gray-200';
  const animationClasses = animation ? 'animate-pulse' : '';

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses,
        !height && variant === 'text' && 'h-4',
        !width && variant === 'text' && 'w-full',
        className
      )}
      style={style}
      role="presentation"
      aria-hidden="true"
    />
  );
};

// 内容加载骨架屏
export const ContentSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 p-4">
      <Skeleton width="60%" height={24} />
      <div className="space-y-2">
        <Skeleton width="100%" />
        <Skeleton width="100%" />
        <Skeleton width="80%" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton height={100} variant="rectangular" />
        <Skeleton height={100} variant="rectangular" />
        <Skeleton height={100} variant="rectangular" />
      </div>
    </div>
  );
};

// 卡片加载骨架屏
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
      <div className="flex items-center space-x-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="space-y-2 flex-1">
          <Skeleton width="40%" />
          <Skeleton width="60%" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton width="100%" />
        <Skeleton width="100%" />
        <Skeleton width="70%" />
      </div>
    </div>
  );
};