import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Target, 
  FileText, 
  CheckCircle, 
  Loader2,
  AlertTriangle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutopilotInlineProps {
  currentStep: 'search' | 'strategy' | 'outline' | 'done' | 'error';
  progress: number; // 0-100
  message?: string;
  variant?: 'default' | 'ghost';
}

const AutopilotInline: React.FC<AutopilotInlineProps> = ({
  currentStep,
  progress,
  message,
  variant = 'default'
}) => {
  const steps = [
    { key: 'search', label: '文献检索', icon: Search },
    { key: 'strategy', label: '写作策略', icon: Target },
    { key: 'outline', label: '大纲构建', icon: FileText }
  ];

  const getStepStatus = (stepKey: string) => {
    const stepIndex = steps.findIndex(s => s.key === stepKey);
    const currentIndex = steps.findIndex(s => s.key === currentStep);
    
    if (currentStep === 'error') {
      return stepIndex <= currentIndex ? 'error' : 'pending';
    }
    
    if (currentStep === 'done') {
      return 'completed';
    }
    
    if (stepIndex < currentIndex) {
      return 'completed';
    } else if (stepIndex === currentIndex) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  if (variant === 'ghost') {
    // Simplified ghost variant - only progress bar
    return (
      <div className="space-y-2">
        <Progress 
          value={progress} 
          className="h-1"
          indicatorClassName={cn(
            currentStep === 'error' ? 'bg-red-500' : 'bg-[#6E5BFF]'
          )}
        />
        {message && (
          <div className="text-xs text-muted-foreground">
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">自动推进进度</h4>
        <Badge variant="outline" className="text-xs">
          {currentStep === 'done' ? '已完成' : currentStep === 'error' ? '出错' : '进行中'}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress 
          value={progress} 
          className="h-2"
          indicatorClassName={cn(
            currentStep === 'error' ? 'bg-red-500' : 'bg-[#6E5BFF]'
          )}
        />
        <div className="flex justify-between text-xs text-gray-600">
          <span>{Math.round(progress)}% 完成</span>
          {currentStep === 'done' && (
            <span className="text-green-600 font-medium">✓ 全部完成</span>
          )}
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key);
          const Icon = step.icon;
          
          return (
            <div key={step.key} className="flex flex-col items-center space-y-1">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
                status === 'completed' 
                  ? 'bg-green-100 text-green-600'
                  : status === 'active'
                  ? 'bg-[#6E5BFF] text-white'
                  : status === 'error'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-400'
              )}>
                {status === 'completed' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : status === 'active' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : status === 'error' ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span className={cn(
                'text-xs font-medium',
                status === 'completed' 
                  ? 'text-green-600'
                  : status === 'active'
                  ? 'text-[#6E5BFF]'
                  : status === 'error'
                  ? 'text-red-600'
                  : 'text-gray-500'
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status Message */}
      {message && (
        <div className={cn(
          'p-2 rounded-lg text-xs',
          currentStep === 'error' 
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-blue-50 text-blue-700 border border-blue-200'
        )}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AutopilotInline;