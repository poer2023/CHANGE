import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/utils';

// 基础进度条组件
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom' | 'inline';
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className,
  barClassName,
  showLabel = false,
  labelPosition = 'inline',
  color = 'primary',
  size = 'md',
  animated = true
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const colorClasses = {
    primary: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const backgroundColorClasses = {
    primary: 'bg-primary-100',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100'
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && labelPosition === 'top' && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">进度</span>
          <span className="text-sm text-gray-600">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div 
        className={cn(
          'w-full rounded-full overflow-hidden',
          sizeClasses[size],
          backgroundColorClasses[color],
          className
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`进度: ${Math.round(percentage)}%`}
      >
        <motion.div
          className={cn(
            'h-full rounded-full flex items-center justify-end pr-2',
            colorClasses[color],
            barClassName
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.8, ease: 'easeOut' } : { duration: 0 }}
        >
          {showLabel && labelPosition === 'inline' && size === 'lg' && (
            <span className="text-xs font-medium text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </motion.div>
      </div>
      
      {showLabel && labelPosition === 'bottom' && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600">{value}</span>
          <span className="text-sm text-gray-600">{max}</span>
        </div>
      )}
    </div>
  );
};

// 圆形进度条组件
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
  animated?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  showLabel = true,
  className,
  animated = true
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    primary: '#2563eb',
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626'
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {/* 背景圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* 进度圆环 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorClasses[color]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeDashoffset }}
          transition={animated ? { duration: 1, ease: 'easeOut' } : { duration: 0 }}
        />
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-xl font-semibold text-gray-900"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      )}
    </div>
  );
};

// 步骤指示器组件
export interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'current' | 'completed' | 'error';
  optional?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  allowClickOnCompleted?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  className,
  allowClickOnCompleted = false
}) => {
  const isHorizontal = orientation === 'horizontal';

  const getStepStatus = (index: number): Step['status'] => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  const handleStepClick = (index: number) => {
    if (!onStepClick) return;
    
    const status = getStepStatus(index);
    if (status === 'completed' && allowClickOnCompleted) {
      onStepClick(index);
    } else if (status === 'current') {
      onStepClick(index);
    }
  };

  return (
    <div className={cn(
      'flex',
      isHorizontal ? 'flex-row items-center' : 'flex-col',
      className
    )}>
      {steps.map((step, index) => {
        const status = step.status === 'error' ? 'error' : getStepStatus(index);
        const isClickable = (status === 'completed' && allowClickOnCompleted) || status === 'current';
        
        return (
          <div
            key={step.id}
            className={cn(
              'flex items-center',
              isHorizontal ? 'flex-row' : 'flex-col',
              index < steps.length - 1 && (isHorizontal ? 'flex-1' : 'pb-8')
            )}
          >
            {/* 步骤圆圈和连接线 */}
            <div className={cn(
              'flex items-center',
              isHorizontal ? 'flex-row' : 'flex-col'
            )}>
              {/* 步骤圆圈 */}
              <motion.button
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium text-sm transition-all duration-200',
                  status === 'completed' && 'bg-green-600 border-green-600 text-white',
                  status === 'current' && 'bg-primary-600 border-primary-600 text-white',
                  status === 'pending' && 'bg-white border-gray-300 text-gray-400',
                  status === 'error' && 'bg-red-600 border-red-600 text-white',
                  isClickable && 'cursor-pointer hover:scale-105',
                  !isClickable && 'cursor-default'
                )}
                onClick={() => handleStepClick(index)}
                disabled={!isClickable}
                whileHover={isClickable ? { scale: 1.05 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
              >
                {status === 'completed' ? (
                  <Check className="w-5 h-5" />
                ) : status === 'error' ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.button>

              {/* 连接线 */}
              {index < steps.length - 1 && (
                <div className={cn(
                  'bg-gray-300',
                  isHorizontal ? 'flex-1 h-0.5 mx-4' : 'w-0.5 h-8 my-2'
                )}>
                  <motion.div
                    className={cn(
                      'h-full',
                      status === 'completed' ? 'bg-green-600' : 'bg-gray-300'
                    )}
                    initial={{ [isHorizontal ? 'width' : 'height']: '0%' }}
                    animate={{ 
                      [isHorizontal ? 'width' : 'height']: status === 'completed' ? '100%' : '0%'
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              )}
            </div>

            {/* 步骤信息 */}
            <div className={cn(
              'ml-4',
              isHorizontal ? 'text-left' : 'text-center mt-2'
            )}>
              <div className={cn(
                'text-sm font-medium',
                status === 'current' && 'text-primary-900',
                status === 'completed' && 'text-green-900',
                status === 'pending' && 'text-gray-500',
                status === 'error' && 'text-red-900'
              )}>
                {step.title}
                {step.optional && (
                  <span className="ml-1 text-xs text-gray-400">(可选)</span>
                )}
              </div>
              {step.description && (
                <p className={cn(
                  'text-xs mt-1',
                  status === 'current' && 'text-primary-600',
                  status === 'completed' && 'text-green-600',
                  status === 'pending' && 'text-gray-400',
                  status === 'error' && 'text-red-600'
                )}>
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 简化的步骤指示器
interface SimpleStepperProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

export const SimpleStepper: React.FC<SimpleStepperProps> = ({
  totalSteps,
  currentStep,
  className
}) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <motion.div
          key={index}
          className={cn(
            'w-3 h-3 rounded-full transition-all duration-300',
            index <= currentStep ? 'bg-primary-600' : 'bg-gray-300'
          )}
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: index === currentStep ? 1.2 : 1,
            backgroundColor: index <= currentStep ? '#2563eb' : '#d1d5db'
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
};