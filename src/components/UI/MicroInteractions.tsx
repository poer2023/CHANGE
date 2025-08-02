import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Heart, Star, ThumbsUp, Share2, Bookmark, Copy, Check } from 'lucide-react';
import { cn } from '@/utils';

// 点赞按钮组件
interface LikeButtonProps {
  liked: boolean;
  onToggle: () => void;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'heart' | 'thumbs';
  className?: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  liked,
  onToggle,
  count,
  size = 'md',
  variant = 'heart',
  className
}) => {
  const controls = useAnimation();
  const [showParticles, setShowParticles] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = async () => {
    onToggle();
    
    if (!liked) {
      setShowParticles(true);
      await controls.start({
        scale: [1, 1.3, 1],
        transition: { duration: 0.3, ease: 'easeOut' }
      });
      setTimeout(() => setShowParticles(false), 600);
    }
  };

  const Icon = variant === 'heart' ? Heart : ThumbsUp;

  return (
    <motion.button
      className={cn(
        'relative flex items-center space-x-2 p-2 rounded-lg transition-colors',
        liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500',
        className
      )}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <motion.div animate={controls}>
          <Icon
            className={cn(
              sizeClasses[size],
              liked ? 'fill-current' : ''
            )}
          />
        </motion.div>
        
        {/* 粒子效果 */}
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-500 rounded-full"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: Math.cos((i * Math.PI) / 3) * 20,
                  y: Math.sin((i * Math.PI) / 3) * 20,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut'
                }}
                style={{
                  left: '50%',
                  top: '50%'
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {count !== undefined && (
        <motion.span
          className="text-sm font-medium"
          animate={{ scale: liked ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.2 }}
        >
          {count}
        </motion.span>
      )}
    </motion.button>
  );
};

// 评分组件
interface RatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  onRatingChange,
  maxRating = 5,
  size = 'md',
  readonly = false,
  className
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleStarClick = (starRating: number) => {
    if (readonly) return;
    onRatingChange?.(starRating);
    setHasInteracted(true);
  };

  const handleStarHover = (starRating: number) => {
    if (readonly) return;
    setHoverRating(starRating);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  return (
    <div 
      className={cn('flex items-center space-x-1', className)}
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(maxRating)].map((_, index) => {
        const starRating = index + 1;
        const isActive = (hoverRating || rating) >= starRating;
        
        return (
          <motion.button
            key={index}
            className={cn(
              'focus:outline-none transition-colors',
              readonly && 'cursor-default'
            )}
            onClick={() => handleStarClick(starRating)}
            onMouseEnter={() => handleStarHover(starRating)}
            disabled={readonly}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            whileHover={!readonly ? { scale: 1.1 } : {}}
          >
            <motion.div
              animate={{
                scale: hasInteracted && rating === starRating ? [1, 1.3, 1] : 1,
                rotate: hasInteracted && rating === starRating ? [0, 15, 0] : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isActive ? 'text-yellow-400 fill-current' : 'text-gray-300',
                  !readonly && 'hover:text-yellow-400'
                )}
              />
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
};

// 复制按钮组件
interface CopyButtonProps {
  text: string;
  onCopy?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'text';
  successMessage?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  onCopy,
  size = 'md',
  variant = 'icon',
  successMessage = '已复制',
  className
}) => {
  const [copied, setCopied] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <motion.button
      className={cn(
        'relative flex items-center space-x-2 p-2 rounded-lg transition-colors',
        'text-gray-400 hover:text-gray-600',
        className
      )}
      onClick={handleCopy}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ rotate: copied ? 360 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {copied ? (
          <Check className={cn(sizeClasses[size], 'text-green-500')} />
        ) : (
          <Copy className={sizeClasses[size]} />
        )}
      </motion.div>
      
      {variant === 'text' && (
        <span className="text-sm font-medium">
          {copied ? successMessage : '复制'}
        </span>
      )}
      
      {/* 复制成功提示 */}
      {copied && variant === 'icon' && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {successMessage}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
        </motion.div>
      )}
    </motion.button>
  );
};

// 书签按钮组件
interface BookmarkButtonProps {
  bookmarked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  bookmarked,
  onToggle,
  size = 'md',
  className
}) => {
  const controls = useAnimation();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = async () => {
    onToggle();
    
    if (!bookmarked) {
      await controls.start({
        scale: [1, 1.2, 1],
        y: [0, -5, 0],
        transition: { duration: 0.4, ease: 'easeOut' }
      });
    }
  };

  return (
    <motion.button
      className={cn(
        'p-2 rounded-lg transition-colors',
        bookmarked ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500',
        className
      )}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div animate={controls}>
        <Bookmark
          className={cn(
            sizeClasses[size],
            bookmarked ? 'fill-current' : ''
          )}
        />
      </motion.div>
    </motion.button>
  );
};

// 分享按钮组件
interface ShareButtonProps {
  onShare: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  onShare,
  size = 'md',
  className
}) => {
  const [shared, setShared] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleShare = () => {
    onShare();
    setShared(true);
    setTimeout(() => setShared(false), 1000);
  };

  return (
    <motion.button
      className={cn(
        'p-2 rounded-lg transition-colors text-gray-400 hover:text-gray-600',
        className
      )}
      onClick={handleShare}
      whileTap={{ scale: 0.95 }}
      animate={{
        rotate: shared ? [0, -10, 10, 0] : 0
      }}
      transition={{ duration: 0.3 }}
    >
      <Share2 className={sizeClasses[size]} />
    </motion.button>
  );
};

// 悬停卡片组件
interface HoverCardProps {
  children: React.ReactNode;
  hoverContent: React.ReactNode;
  delay?: number;
  className?: string;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  hoverContent,
  delay = 300,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(false);
  };

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isHovered && (
        <motion.div
          className="absolute z-10 p-3 bg-white rounded-lg shadow-lg border border-gray-200 min-w-max"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '8px'
          }}
        >
          {hoverContent}
          
          {/* 箭头 */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45" />
        </motion.div>
      )}
    </div>
  );
};

// 拖拽排序项组件
interface DragItemProps {
  children: React.ReactNode;
  id: string;
  onDragEnd?: (draggedId: string, droppedOnId: string) => void;
  className?: string;
}

export const DragItem: React.FC<DragItemProps> = ({
  children,
  id,
  onDragEnd,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateZ = useTransform(x, [-100, 100], [-5, 5]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={cn(
        'cursor-grab active:cursor-grabbing transition-shadow',
        isDragging && 'shadow-lg z-10',
        className
      )}
      drag
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        x,
        y,
        rotateZ: isDragging ? rotateZ : 0
      }}
      whileDrag={{
        scale: 1.05,
        zIndex: 10
      }}
      layout
    >
      {children}
    </motion.div>
  );
};

// 脉冲动画组件
interface PulseProps {
  children: React.ReactNode;
  active?: boolean;
  color?: string;
  size?: number;
  className?: string;
}

export const Pulse: React.FC<PulseProps> = ({
  children,
  active = true,
  color = '#3B82F6',
  size = 40,
  className
}) => {
  return (
    <div className={cn('relative inline-flex', className)}>
      {children}
      
      {active && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.5],
            opacity: [0.7, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      )}
    </div>
  );
};

// 呼吸动画组件
interface BreatheProps {
  children: React.ReactNode;
  scale?: [number, number];
  duration?: number;
  className?: string;
}

export const Breathe: React.FC<BreatheProps> = ({
  children,
  scale = [1, 1.05],
  duration = 3,
  className
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: scale
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
};