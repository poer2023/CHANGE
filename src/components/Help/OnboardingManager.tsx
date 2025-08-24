import React, { useState, useEffect } from 'react';
import OnboardingTooltip from './OnboardingTooltip';

interface OnboardingStep {
  id: string;
  title: string;
  content: string;
  targetSelector: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

interface OnboardingManagerProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  steps: OnboardingStep[];
}

const OnboardingManager: React.FC<OnboardingManagerProps> = ({
  isActive,
  onComplete,
  onSkip,
  steps
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (!isActive || !currentStep) {
      setIsVisible(false);
      return;
    }

    const timeout = setTimeout(() => {
      const targetElement = document.querySelector(currentStep.targetSelector);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        let x = rect.left + scrollLeft + rect.width / 2;
        let y = rect.top + scrollTop;
        
        // Adjust position based on tooltip position
        switch (currentStep.position) {
          case 'top':
            y -= 10;
            x -= 160; // Half of tooltip width (320px)
            break;
          case 'bottom':
            y += rect.height + 10;
            x -= 160;
            break;
          case 'left':
            y += rect.height / 2;
            x -= 330; // Tooltip width + 10
            break;
          case 'right':
            y += rect.height / 2;
            x += rect.width + 10;
            break;
          default:
            y += rect.height + 10;
            x -= 160;
        }

        // Ensure tooltip stays within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (x < 10) x = 10;
        if (x > viewportWidth - 330) x = viewportWidth - 330;
        if (y < 10) y = 10;
        if (y > viewportHeight + scrollTop - 200) y = viewportHeight + scrollTop - 200;

        setTooltipPosition({ x, y });
        setIsVisible(true);

        // Highlight target element
        targetElement.classList.add('onboarding-highlight');
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
      }
    }, currentStep.delay || 300);

    return () => {
      clearTimeout(timeout);
      // Remove highlight from all elements
      document.querySelectorAll('.onboarding-highlight').forEach(el => {
        el.classList.remove('onboarding-highlight');
      });
    };
  }, [isActive, currentStepIndex, currentStep]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    // Remove highlight from all elements
    document.querySelectorAll('.onboarding-highlight').forEach(el => {
      el.classList.remove('onboarding-highlight');
    });
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    // Remove highlight from all elements
    document.querySelectorAll('.onboarding-highlight').forEach(el => {
      el.classList.remove('onboarding-highlight');
    });
    onSkip();
  };

  if (!isActive || !currentStep || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Custom CSS for highlighting */}
      <style jsx>{`
        :global(.onboarding-highlight) {
          position: relative;
          z-index: 50;
          box-shadow: 0 0 0 4px rgba(110, 91, 255, 0.3), 0 0 0 2px #6E5BFF !important;
          border-radius: 8px !important;
        }
        
        :global(.onboarding-highlight::before) {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 12px;
          background: rgba(110, 91, 255, 0.1);
          pointer-events: none;
          z-index: -1;
        }
      `}</style>

      <div
        style={{
          position: 'absolute',
          left: tooltipPosition.x,
          top: tooltipPosition.y,
          zIndex: 101
        }}
      >
        <OnboardingTooltip
          isOpen={true}
          onClose={handleComplete}
          onNext={handleNext}
          onPrev={currentStepIndex > 0 ? handlePrev : undefined}
          title={currentStep.title}
          content={currentStep.content}
          position={currentStep.position}
          currentStep={currentStepIndex + 1}
          totalSteps={steps.length}
          onSkip={handleSkip}
        />
      </div>
    </>
  );
};

// Predefined onboarding flows
export const WRITING_FLOW_TOUR: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '欢迎使用写作助手',
    content: '我们将用3分钟时间带您了解核心功能，让您快速上手学术写作。',
    targetSelector: 'body',
    position: 'bottom'
  },
  {
    id: 'topic-step',
    title: '第一步：话题选择',
    content: '在这里输入您的研究话题，AI会帮助您精炼主题并确定研究方向。',
    targetSelector: '[data-step="topic"]',
    position: 'bottom'
  },
  {
    id: 'research-step',
    title: '第二步：文献检索',
    content: '系统会自动搜索相关文献，您也可以上传自己的资料来丰富研究基础。',
    targetSelector: '[data-step="research"]',
    position: 'bottom'
  },
  {
    id: 'strategy-step',
    title: '第三步：写作策略',
    content: '根据您的论文类型和要求，制定最适合的写作策略和结构框架。',
    targetSelector: '[data-step="strategy"]',
    position: 'bottom'
  },
  {
    id: 'outline-step',
    title: '第四步：大纲构建',
    content: '生成详细的论文大纲，包括各章节要点和逻辑结构。',
    targetSelector: '[data-step="outline"]',
    position: 'bottom'
  },
  {
    id: 'content-step',
    title: '第五步：内容生成',
    content: '基于前面的准备工作，开始生成高质量的论文内容。',
    targetSelector: '[data-step="content"]',
    position: 'bottom'
  },
  {
    id: 'result-features',
    title: '结果页功能',
    content: '完成后可以导出多种格式，进行引用验证，使用AI助手等高级功能。',
    targetSelector: '[data-result="deck-tabs"]',
    position: 'top',
    delay: 500
  }
];

export const RESULT_PAGE_TOUR: OnboardingStep[] = [
  {
    id: 'deck-tabs-intro',
    title: '结果页功能导览',
    content: '这里包含了所有后处理功能，让您的论文更加完善。',
    targetSelector: '[data-result="deck-tabs"]',
    position: 'top'
  },
  {
    id: 'export-tab',
    title: '导出功能',
    content: '支持Word、PDF、LaTeX等多种格式导出，满足不同提交要求。',
    targetSelector: '[data-tab="deliverables"]',
    position: 'bottom'
  },
  {
    id: 'citation-tab',
    title: '引用验证',
    content: '自动验证所有引用的DOI、PMID等标识符，确保引用的准确性。',
    targetSelector: '[data-tab="verification"]',
    position: 'bottom'
  },
  {
    id: 'ai-assistant-tab',
    title: 'AI助手',
    content: '继续与AI对话，获取编辑建议、内容优化等个性化帮助。',
    targetSelector: '[data-tab="assistant"]',
    position: 'bottom'
  }
];

export default OnboardingManager;