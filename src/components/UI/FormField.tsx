import React, { useState, useId, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle, Search, X } from 'lucide-react';
import { cn } from '@/utils';

interface BaseFieldProps {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  wrapperClassName?: string;
}

// 增强的输入框组件
interface InputProps extends BaseFieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  hint,
  required,
  disabled,
  className,
  labelClassName,
  wrapperClassName,
  icon,
  clearable,
  onClear,
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();
  const inputId = props.id || id;
  
  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  const hasValue = !!props.value || !!props.defaultValue;

  const inputClasses = cn(
    'w-full px-3 py-2.5 text-base bg-white border rounded-lg transition-all duration-200',
    'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1',
    icon && 'pl-10',
    (isPassword || clearable) && 'pr-10',
    hasError && 'border-red-300 focus:border-red-500 focus:ring-red-200',
    hasSuccess && 'border-green-300 focus:border-green-500 focus:ring-green-200',
    !hasError && !hasSuccess && 'border-gray-300 focus:border-primary-500 focus:ring-primary-200',
    disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
    className
  );

  const labelClasses = cn(
    'block text-sm font-medium text-gray-700 mb-1',
    disabled && 'opacity-60',
    labelClassName
  );

  return (
    <div className={cn('space-y-1', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">{icon}</div>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={actualType}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : 
            success ? `${inputId}-success` : 
            hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        
        {/* 密码显示/隐藏按钮 */}
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? '隐藏密码' : '显示密码'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
        {/* 清除按钮 */}
        {clearable && hasValue && !disabled && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={onClear}
            aria-label="清除输入"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* 状态图标 */}
        {(hasError || hasSuccess) && !isPassword && !clearable && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {hasError && <AlertCircle className="w-5 h-5 text-red-500" />}
            {hasSuccess && <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>
        )}
      </div>
      
      {/* 错误、成功、提示信息 */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={`${inputId}-error`}
            className="text-sm text-red-600 flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.p>
        )}
        {success && !error && (
          <motion.p
            id={`${inputId}-success`}
            className="text-sm text-green-600 flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {success}
          </motion.p>
        )}
        {hint && !error && !success && (
          <motion.p
            id={`${inputId}-hint`}
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';

// 搜索输入框组件
interface SearchInputProps extends Omit<InputProps, 'icon' | 'type'> {
  onSearch?: (value: string) => void;
  searchDelay?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  searchDelay = 300,
  ...props
}) => {
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    props.onChange?.(e);

    if (onSearch) {
      clearTimeout(searchTimeout);
      const timeout = setTimeout(() => onSearch(value), searchDelay);
      setSearchTimeout(timeout);
    }
  };

  return (
    <Input
      {...props}
      type="search"
      icon={<Search className="w-4 h-4" />}
      onChange={handleChange}
      placeholder={props.placeholder || '搜索...'}
    />
  );
};

// 文本域组件
interface TextareaProps extends BaseFieldProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  autoResize?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  success,
  hint,
  required,
  disabled,
  className,
  labelClassName,
  wrapperClassName,
  autoResize,
  maxLength,
  showCount,
  ...props
}, ref) => {
  const id = useId();
  const textareaId = props.id || id;
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  const currentLength = String(props.value || props.defaultValue || '').length;

  const textareaClasses = cn(
    'w-full px-3 py-2.5 text-base bg-white border rounded-lg transition-all duration-200',
    'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-vertical',
    hasError && 'border-red-300 focus:border-red-500 focus:ring-red-200',
    hasSuccess && 'border-green-300 focus:border-green-500 focus:ring-green-200',
    !hasError && !hasSuccess && 'border-gray-300 focus:border-primary-500 focus:ring-primary-200',
    disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
    autoResize && 'resize-none',
    className
  );

  const labelClasses = cn(
    'block text-sm font-medium text-gray-700 mb-1',
    disabled && 'opacity-60',
    labelClassName
  );

  // 自动调整高度
  const handleAutoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoResize) {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
    props.onChange?.(e);
  };

  return (
    <div className={cn('space-y-1', wrapperClassName)}>
      {label && (
        <label htmlFor={textareaId} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClasses}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${textareaId}-error` : 
            success ? `${textareaId}-success` : 
            hint ? `${textareaId}-hint` : undefined
          }
          onChange={autoResize ? handleAutoResize : props.onChange}
          {...props}
        />
        
        {/* 字符计数 */}
        {(showCount || maxLength) && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-1 rounded">
            {currentLength}{maxLength && `/${maxLength}`}
          </div>
        )}
      </div>
      
      {/* 错误、成功、提示信息 */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={`${textareaId}-error`}
            className="text-sm text-red-600 flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.p>
        )}
        {success && !error && (
          <motion.p
            id={`${textareaId}-success`}
            className="text-sm text-green-600 flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {success}
          </motion.p>
        )}
        {hint && !error && !success && (
          <motion.p
            id={`${textareaId}-hint`}
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Textarea.displayName = 'Textarea';

// 选择框组件
interface SelectProps extends BaseFieldProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  success,
  hint,
  required,
  disabled,
  className,
  labelClassName,
  wrapperClassName,
  options,
  placeholder,
  ...props
}, ref) => {
  const id = useId();
  const selectId = props.id || id;
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;

  const selectClasses = cn(
    'w-full px-3 py-2.5 text-base bg-white border rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer',
    hasError && 'border-red-300 focus:border-red-500 focus:ring-red-200',
    hasSuccess && 'border-green-300 focus:border-green-500 focus:ring-green-200',
    !hasError && !hasSuccess && 'border-gray-300 focus:border-primary-500 focus:ring-primary-200',
    disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
    className
  );

  const labelClasses = cn(
    'block text-sm font-medium text-gray-700 mb-1',
    disabled && 'opacity-60',
    labelClassName
  );

  return (
    <div className={cn('space-y-1', wrapperClassName)}>
      {label && (
        <label htmlFor={selectId} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${selectId}-error` : 
            success ? `${selectId}-success` : 
            hint ? `${selectId}-hint` : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* 状态图标 */}
        {(hasError || hasSuccess) && (
          <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
            {hasError && <AlertCircle className="w-5 h-5 text-red-500" />}
            {hasSuccess && <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>
        )}
      </div>
      
      {/* 错误、成功、提示信息 */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={`${selectId}-error`}
            className="text-sm text-red-600 flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.p>
        )}
        {success && !error && (
          <motion.p
            id={`${selectId}-success`}
            className="text-sm text-green-600 flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {success}
          </motion.p>
        )}
        {hint && !error && !success && (
          <motion.p
            id={`${selectId}-hint`}
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Select.displayName = 'Select';