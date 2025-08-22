import React from 'react';
import { cn } from '@/lib/utils';

interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Segmented: React.FC<SegmentedProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base'
  };

  return (
    <div className={cn(
      'inline-flex bg-gray-100 rounded-xl p-1',
      sizeClasses[size],
      className
    )}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'flex-1 px-3 rounded-lg font-medium transition-all duration-200',
            'hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6E5BFF]',
            value === option.value
              ? 'bg-white text-[#6E5BFF] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export { Segmented };
export type { SegmentedOption, SegmentedProps };