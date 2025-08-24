import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  showIcon?: boolean;
  showText?: boolean;
}

/**
 * 语言切换组件
 * 
 * @example
 * ```tsx
 * // 基础使用
 * <LanguageToggle />
 * 
 * // 自定义样式
 * <LanguageToggle variant="outline" size="sm" showIcon={false} />
 * ```
 */
export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className,
  variant = 'ghost',
  size = 'sm',
  showIcon = true,
  showText = true
}) => {
  const { language, toggleLanguage } = useLanguage();

  const currentLang = language === 'zh' ? '中文' : 'English';
  const nextLang = language === 'zh' ? 'EN' : '中';

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleLanguage}
      className={cn(
        'transition-all duration-200',
        'hover:scale-105 active:scale-95',
        className
      )}
      title={`Switch to ${language === 'zh' ? 'English' : '中文'}`}
    >
      {showIcon && <Globe className="h-4 w-4" />}
      {showText && (
        <span className={cn(showIcon && 'ml-1')}>
          {nextLang}
        </span>
      )}
    </Button>
  );
};

export default LanguageToggle;