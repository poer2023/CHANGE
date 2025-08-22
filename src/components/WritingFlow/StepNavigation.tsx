import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useWritingFlow } from '@/contexts/WritingFlowContext';
import { WritingStep } from '../../types/writing-flow';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Search,
  Target,
  FileText,
  PenTool,
  CheckCircle,
  Lock,
  AlertTriangle,
  XCircle,
  Clock,
} from 'lucide-react';

interface StepNavigationProps {
  className?: string;
}

interface StepConfig {
  id: WritingStep;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  order: number;
}

const stepConfigs: StepConfig[] = [
  {
    id: 'topic',
    title: '选题',
    description: '确定论文主题和要求',
    icon: BookOpen,
    order: 1,
  },
  {
    id: 'research',
    title: '研究',
    description: '搜集和筛选参考文献',
    icon: Search,
    order: 2,
  },
  {
    id: 'strategy',
    title: '策略',
    description: '制定写作策略和论点',
    icon: Target,
    order: 3,
  },
  {
    id: 'outline',
    title: '大纲',
    description: '构建论文结构框架',
    icon: FileText,
    order: 4,
  },
  {
    id: 'content',
    title: '内容',
    description: '撰写和完善论文内容',
    icon: PenTool,
    order: 5,
  },
];

const StepNavigation: React.FC<StepNavigationProps> = ({ className }) => {
  const { 
    project, 
    setCurrentStep, 
    canProceedToStep, 
    validateStep, 
    getProgressPercentage 
  } = useWritingFlow();
  const navigate = useNavigate();

  const overallProgress = getProgressPercentage();

  const handleStepClick = (step: WritingStep) => {
    if (canProceedToStep(step)) {
      setCurrentStep(step);
      navigate(`/writing-flow/${step}`);
    }
  };

  const getStepStatus = (step: WritingStep) => {
    const isCompleted = project.completedSteps.includes(step);
    const isCurrent = project.currentStep === step;
    const canProceed = canProceedToStep(step);
    const validation = validateStep(step);

    if (isCompleted) return 'completed';
    if (isCurrent) return 'current';
    if (!canProceed) return 'locked';
    return 'available';
  };

  const getStatusIcon = (step: WritingStep, status: string) => {
    const validation = validateStep(step);
    const hasErrors = validation.errors.length > 0;
    const hasWarnings = validation.warnings.length > 0;

    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'current':
        if (hasErrors) return <XCircle className="h-4 w-4 text-red-500" />;
        if (hasWarnings) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'locked':
        return <Lock className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStepVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'current':
        return 'default';
      case 'available':
        return 'outline';
      case 'locked':
        return 'ghost';
      default:
        return 'ghost';
    }
  };

  const getProgressColor = (step: WritingStep) => {
    const validation = validateStep(step);
    if (validation.errors.length > 0) return 'bg-red-500';
    if (validation.warnings.length > 0) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={cn('bg-white border border-[#EEF0F4] rounded-2xl p-6 space-y-6', className)} style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}>
      {/* Overall Progress Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">写作进度</h2>
          <div className="text-sm text-[#5B667A]">{overallProgress}%</div>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {/* Steps Grid */}
      <div className="space-y-3">
        {stepConfigs.map((stepConfig, index) => {
          const status = getStepStatus(stepConfig.id);
          const validation = validateStep(stepConfig.id);
          const Icon = stepConfig.icon;
          const isClickable = status === 'available' || status === 'current' || status === 'completed';

          return (
            <div key={stepConfig.id} className="flex items-center group cursor-pointer transition-all duration-200 hover:bg-gray-50 rounded-xl p-3 -m-3 min-w-0" onClick={() => handleStepClick(stepConfig.id)}>
              {/* Step Number */}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3',
                status === 'current' && 'bg-[#6E5BFF] text-white',
                status === 'completed' && 'bg-green-500 text-white', 
                status === 'available' && 'bg-gray-100 text-gray-400',
                status === 'locked' && 'bg-gray-100 text-gray-400'
              )}>
                <span className="text-sm font-medium">{stepConfig.order}</span>
              </div>
              
              {/* Step Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Icon className={cn(
                    'h-4 w-4 flex-shrink-0',
                    status === 'current' && 'text-[#6E5BFF]',
                    status === 'completed' && 'text-green-500',
                    status === 'available' && 'text-gray-400',
                    status === 'locked' && 'text-gray-400'
                  )} />
                  <div 
                    className="font-medium text-sm truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[140px]"
                    title={stepConfig.title}
                  >
                    {stepConfig.title}
                  </div>
                  {status === 'current' && <Clock className="h-3 w-3 text-[#6E5BFF] flex-shrink-0" />}
                  {status === 'completed' && <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />}
                </div>
                <div className="text-xs text-[#5B667A] truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[140px] mt-1" title={stepConfig.description}>
                  {stepConfig.description}
                </div>
              </div>
            </div>

          );
        })}
      </div>

    </div>
  );
};

export default StepNavigation;