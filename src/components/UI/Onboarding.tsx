import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, SkipForward, Check } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils';

export interface OnboardingStep {
  id: string;
  title: string;
  content: React.ReactNode;
  target?: string; // CSS selector or element ID
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  offset?: { x: number; y: number };
  allowClickOutside?: boolean;
  showSkip?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  isActive: boolean;
  nextStep: () => void;
  previousStep: () => void;
  skipTour: () => void;
  goToStep: (step: number) => void;
  finish: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
  steps: OnboardingStep[];
  isActive: boolean;
  onFinish: () => void;
  onSkip?: () => void;
  startStep?: number;
  showProgress?: boolean;
  showStepNumbers?: boolean;
  allowSkip?: boolean;
  theme?: 'light' | 'dark';
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({
  children,
  steps,
  isActive,
  onFinish,
  onSkip,
  startStep = 0,
  showProgress = true,
  showStepNumbers = true,
  allowSkip = true,
  theme = 'light'
}) => {
  const [currentStep, setCurrentStep] = useState(startStep);
  const [targetPosition, setTargetPosition] = useState<{ x: number; y: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finish();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onSkip?.();
    finish();
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  };

  const finish = () => {
    onFinish();
  };

  // 计算目标元素位置
  useEffect(() => {
    if (!isActive || !steps[currentStep]?.target) {
      setTargetPosition(null);
      return;
    }

    const updatePosition = () => {
      const target = document.querySelector(steps[currentStep].target!);
      if (target) {
        const rect = target.getBoundingClientRect();
        setTargetPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      } else {
        setTargetPosition(null);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isActive, currentStep, steps]);

  // 防止背景滚动
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isActive]);

  const contextValue: OnboardingContextType = {
    currentStep,
    totalSteps: steps.length,
    isActive,
    nextStep,
    previousStep,
    skipTour,
    goToStep,
    finish
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
      {isActive && (
        <OnboardingOverlay
          step={steps[currentStep]}
          targetPosition={targetPosition}
          theme={theme}
          showProgress={showProgress}
          showStepNumbers={showStepNumbers}
          allowSkip={allowSkip}
        />
      )}
    </OnboardingContext.Provider>
  );
};

interface OnboardingOverlayProps {
  step: OnboardingStep;
  targetPosition: { x: number; y: number } | null;
  theme: 'light' | 'dark';
  showProgress: boolean;
  showStepNumbers: boolean;
  allowSkip: boolean;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({
  step,
  targetPosition,
  theme,
  showProgress,
  showStepNumbers,
  allowSkip
}) => {
  const {
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    skipTour,
    finish
  } = useOnboarding();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const themeClasses = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-200'
    },
    dark: {
      bg: 'bg-gray-800',
      text: 'text-white',
      border: 'border-gray-600'
    }
  };

  const getTooltipPosition = () => {
    if (!targetPosition || step.placement === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const offset = step.offset || { x: 0, y: 0 };
    const spacing = 20;

    switch (step.placement) {
      case 'top':
        return {
          left: targetPosition.x + offset.x,
          top: targetPosition.y - spacing + offset.y,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          left: targetPosition.x + offset.x,
          top: targetPosition.y + spacing + offset.y,
          transform: 'translate(-50%, 0)'
        };
      case 'left':
        return {
          left: targetPosition.x - spacing + offset.x,
          top: targetPosition.y + offset.y,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          left: targetPosition.x + spacing + offset.x,
          top: targetPosition.y + offset.y,
          transform: 'translate(0, -50%)'
        };
      default:
        return {
          left: targetPosition.x + offset.x,
          top: targetPosition.y + spacing + offset.y,
          transform: 'translate(-50%, 0)'
        };
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (step.allowClickOutside && e.target === e.currentTarget) {
      finish();
    }
  };

  const overlayContent = (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleOverlayClick}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 目标元素高亮 */}
      {targetPosition && step.target && (
        <TargetHighlight targetSelector={step.target} />
      )}

      {/* 工具提示 */}
      <motion.div
        className={cn(
          'absolute max-w-sm w-full mx-4 rounded-xl shadow-2xl border p-6 z-10',
          themeClasses[theme].bg,
          themeClasses[theme].text,
          themeClasses[theme].border
        )}
        style={getTooltipPosition()}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.3 }}
      >
        {/* 关闭按钮 */}
        {allowSkip && (
          <button
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={skipTour}
            aria-label="跳过引导"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* 步骤计数 */}
        {showStepNumbers && (
          <div className="text-sm text-gray-500 mb-2">
            步骤 {currentStep + 1} / {totalSteps}
          </div>
        )}

        {/* 进度条 */}
        {showProgress && (
          <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
            <motion.div
              className="bg-primary-600 h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* 标题 */}
        <h3 className="text-lg font-semibold mb-3">
          {step.title}
        </h3>

        {/* 内容 */}
        <div className="mb-6">
          {step.content}
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {!isFirstStep && (
              <Button
                variant="outline"
                size="sm"
                onClick={previousStep}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                上一步
              </Button>
            )}
            
            {allowSkip && step.showSkip !== false && (
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
              >
                <SkipForward className="w-4 h-4 mr-1" />
                跳过
              </Button>
            )}
          </div>

          <div className="flex space-x-2">
            {step.action && (
              <Button
                variant="outline"
                size="sm"
                onClick={step.action.onClick}
              >
                {step.action.label}
              </Button>
            )}
            
            <Button
              size="sm"
              onClick={isLastStep ? finish : nextStep}
            >
              {isLastStep ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  完成
                </>
              ) : (
                <>
                  下一步
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(overlayContent, document.body);
};

// 目标高亮组件
interface TargetHighlightProps {
  targetSelector: string;
}

const TargetHighlight: React.FC<TargetHighlightProps> = ({ targetSelector }) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      const element = document.querySelector(targetSelector);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [targetSelector]);

  if (!targetRect) return null;

  return (
    <motion.div
      className="absolute border-2 border-primary-500 rounded-lg shadow-lg pointer-events-none"
      style={{
        left: targetRect.left - 4,
        top: targetRect.top - 4,
        width: targetRect.width + 8,
        height: targetRect.height + 8
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-primary-500/10 rounded-lg animate-pulse" />
    </motion.div>
  );
};

// Hook for managing onboarding state
export const useOnboardingState = () => {
  const [isActive, setIsActive] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const start = () => setIsActive(true);
  const finish = () => {
    setIsActive(false);
    setHasCompleted(true);
    localStorage.setItem('onboarding-completed', 'true');
  };
  const skip = () => {
    setIsActive(false);
    localStorage.setItem('onboarding-skipped', 'true');
  };
  const reset = () => {
    setIsActive(false);
    setHasCompleted(false);
    localStorage.removeItem('onboarding-completed');
    localStorage.removeItem('onboarding-skipped');
  };

  // 检查是否已完成引导
  useEffect(() => {
    const completed = localStorage.getItem('onboarding-completed');
    const skipped = localStorage.getItem('onboarding-skipped');
    setHasCompleted(!!(completed || skipped));
  }, []);

  return {
    isActive,
    hasCompleted,
    start,
    finish,
    skip,
    reset
  };
};