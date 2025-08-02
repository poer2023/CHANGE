import { Variants, Transition } from 'framer-motion';

// 基础动画变体
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export const slideInFromBottom: Variants = {
  hidden: {
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

export const slideInFromTop: Variants = {
  hidden: {
    opacity: 0,
    y: -50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

export const slideInFromLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

export const slideInFromRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

// 容器动画
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerFastContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

export const staggerSlowContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2
    }
  }
};

// 悬停和交互动画
export const cardHover: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeInOut'
    }
  }
};

export const iconHover: Variants = {
  rest: { rotate: 0 },
  hover: { 
    rotate: 15,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// 特殊效果动画
export const progressBar: Variants = {
  hidden: {
    width: 0
  },
  visible: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.8,
      ease: 'easeInOut'
    }
  })
};

export const typewriter = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1
    }
  }
};

export const pulse: Variants = {
  rest: { scale: 1 },
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
      repeat: Infinity
    }
  }
};

export const shake: Variants = {
  rest: { x: 0 },
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
};

export const bounce: Variants = {
  rest: { y: 0 },
  bounce: {
    y: [0, -20, 0],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
      repeat: Infinity
    }
  }
};

// 聊天和对话动画
export const chatBubble: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

export const typingIndicator: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

// 步骤指示器动画
export const stepIndicator: Variants = {
  inactive: {
    backgroundColor: '#E5E7EB',
    color: '#6B7280',
    scale: 1
  },
  active: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    scale: 1.1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  completed: {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// 表单动画
export const formTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

export const fieldFocus: Variants = {
  blur: { 
    borderColor: '#D1D5DB',
    boxShadow: 'none'
  },
  focus: {
    borderColor: '#3B82F6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
};

// 模态框和弹出层动画
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

export const modalContent: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

export const drawer: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300
    }
  },
  exit: {
    x: '100%',
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

export const dropdown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -10,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: 'easeIn'
    }
  }
};

// 加载和骨架屏动画
export const skeletonPulse: Variants = {
  rest: { opacity: 1 },
  pulse: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity
    }
  }
};

export const loadingSpinner: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity
    }
  }
};

// 工具函数
export const getStaggeredAnimation = (index: number, baseDelay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      delay: baseDelay + index * 0.1,
      ease: 'easeOut'
    }
  }
});

export const getDelayedAnimation = (delay: number, variants: Variants) => ({
  ...variants,
  visible: {
    ...variants.visible,
    transition: {
      ...variants.visible.transition,
      delay
    }
  }
});

// 自定义缓动函数
export const easing = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
  bounce: [0.68, -0.55, 0.265, 1.55]
};

// 过渡配置预设
export const transitions = {
  default: { duration: 0.3, ease: 'easeOut' },
  fast: { duration: 0.15, ease: 'easeOut' },
  slow: { duration: 0.5, ease: 'easeOut' },
  spring: { type: 'spring', damping: 20, stiffness: 300 },
  bouncy: { type: 'spring', damping: 10, stiffness: 400 }
};

// 页面过渡动画
export const pageTransitions = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slideLeft: {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { y: 300, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -300, opacity: 0 },
    transition: { duration: 0.3 }
  }
};