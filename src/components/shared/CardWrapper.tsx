import React from 'react';
import { cn } from '@/lib/utils';

interface CardWrapperProps {
  children: React.ReactNode;
  className?: string;
  withBrandAccent?: boolean; // 是否显示品牌渐变顶部装饰线
}

/**
 * 通用卡片容器组件
 * 提供统一的设计系统：20px圆角、细边框、柔和阴影
 * 可选的品牌渐变顶部装饰线
 */
const CardWrapper: React.FC<CardWrapperProps> = ({ 
  children, 
  className, 
  withBrandAccent = false 
}) => {
  return (
    <div className={cn(
      // 基础卡片样式
      'relative bg-white border border-[#E7EAF3] rounded-[20px]',
      // 阴影系统
      'shadow-[0_6px_18px_rgba(17,24,39,0.06)] hover:shadow-[0_10px_24px_rgba(17,24,39,0.10)]',
      // 过渡效果
      'transition-shadow duration-200',
      // 内边距
      'p-4 md:p-5',
      className
    )}>
      {/* 品牌渐变装饰线 */}
      {withBrandAccent && (
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#6A5AF9] to-[#3B82F6] rounded-t-[20px]" />
      )}
      
      {children}
    </div>
  );
};

export default CardWrapper;