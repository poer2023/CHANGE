import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingTooltipProps {
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  currentStep?: number;
  totalSteps?: number;
  showSkip?: boolean;
  onSkip?: () => void;
}

const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
  isOpen,
  onClose,
  onNext,
  onPrev,
  title,
  content,
  position = 'bottom',
  currentStep,
  totalSteps,
  showSkip = true,
  onSkip
}) => {
  if (!isOpen) return null;

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-[100]" onClick={onClose} />
      
      {/* Tooltip */}
      <Card className={cn(
        "absolute z-[101] w-80 shadow-lg border-2 border-[#6E5BFF]/20",
        position === 'top' && "-translate-y-2",
        position === 'bottom' && "translate-y-2",
        position === 'left' && "-translate-x-2",
        position === 'right' && "translate-x-2"
      )}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{title}</h4>
              {currentStep && totalSteps && (
                <div className="text-xs text-gray-500">
                  步骤 {currentStep} / {totalSteps}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 -mt-1 -mr-1"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-700 mb-4">{content}</p>

          {/* Progress dots */}
          {currentStep && totalSteps && totalSteps > 1 && (
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    i + 1 === currentStep ? "bg-[#6E5BFF]" : "bg-gray-200"
                  )}
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {showSkip && !isLastStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  跳过引导
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {onPrev && !isFirstStep && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrev}
                  className="text-xs"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  上一步
                </Button>
              )}

              {onNext && (
                <Button
                  size="sm"
                  onClick={onNext}
                  className="text-xs bg-[#6E5BFF] hover:bg-[#5A4AD4]"
                >
                  {isLastStep ? "完成" : "下一步"}
                  {!isLastStep && <ArrowRight className="h-3 w-3 ml-1" />}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OnboardingTooltip;