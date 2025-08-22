import React from 'react';
import { cn } from '@/lib/utils';
import { useWritingFlow } from '@/contexts/WritingFlowContext';
import { useNavigate } from 'react-router-dom';
import { WritingStep } from '@/types/writing-flow';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Search,
  Target,
  FileText,
  PenTool,
  CheckCircle,
  Clock,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface StepSidebarProps {
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
    description: '确定论文主题',
    icon: BookOpen,
    order: 1,
  },
  {
    id: 'research',
    title: '研究',
    description: '收集参考文献',
    icon: Search,
    order: 2,
  },
  {
    id: 'strategy',
    title: '策略',
    description: '制定写作策略',
    icon: Target,
    order: 3,
  },
  {
    id: 'outline',
    title: '大纲',
    description: '构建文章结构',
    icon: FileText,
    order: 4,
  },
  {
    id: 'content',
    title: '内容',
    description: '撰写论文正文',
    icon: PenTool,
    order: 5,
  },
];

const StepSidebar: React.FC<StepSidebarProps> = ({ className }) => {
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

  return (
    <aside className={cn('bg-white border-r border-[#EEF0F4] p-6 space-y-6', className)} 
           style={{ boxShadow: '6px 0 24px rgba(15,23,42,0.06)' }}>
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">写作流程</h2>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#5B667A]">总体进度</span>
          <span className="text-sm font-medium text-[#6E5BFF]">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {stepConfigs.map((stepConfig) => {
          const status = getStepStatus(stepConfig.id);
          const validation = validateStep(stepConfig.id);
          const Icon = stepConfig.icon;
          const isClickable = status === 'available' || status === 'current' || status === 'completed';

          return (
            <div
              key={stepConfig.id}
              className={cn(
                'group cursor-pointer transition-all duration-200 rounded-xl p-3 min-w-0',
                isClickable && 'hover:bg-gray-50',
                status === 'current' && 'bg-[#6E5BFF]/5 border-l-4 border-[#6E5BFF]',
                !isClickable && 'cursor-not-allowed opacity-60'
              )}
              onClick={() => handleStepClick(stepConfig.id)}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Step Number */}
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  status === 'current' && 'bg-[#6E5BFF] text-white',
                  status === 'completed' && 'bg-green-500 text-white', 
                  status === 'available' && 'bg-gray-100 text-gray-500',
                  status === 'locked' && 'bg-gray-100 text-gray-400'
                )}>
                  {status === 'completed' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : status === 'current' ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{stepConfig.order}</span>
                  )}
                </div>
                
                {/* Step Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className={cn(
                      'h-4 w-4 flex-shrink-0',
                      status === 'current' && 'text-[#6E5BFF]',
                      status === 'completed' && 'text-green-500',
                      status === 'available' && 'text-gray-500',
                      status === 'locked' && 'text-gray-400'
                    )} />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-gray-900 truncate max-w-[140px] hidden sm:inline" title={stepConfig.title}>
                        {stepConfig.title}
                      </div>
                      <div className="text-xs text-[#5B667A] truncate max-w-[140px] hidden sm:inline" title={stepConfig.description}>
                        {stepConfig.description}
                      </div>
                    </div>
                    {validation.errors.length > 0 && (
                      <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                    )}
                    {isClickable && (
                      <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0 group-hover:text-gray-600" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar for Current Step */}
              {status === 'current' && validation.completionPercentage > 0 && (
                <div className="mt-2 ml-11">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#5B667A]">完成度</span>
                    <span className="text-xs text-[#6E5BFF]">{validation.completionPercentage}%</span>
                  </div>
                  <Progress 
                    value={validation.completionPercentage} 
                    className="h-1" 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default StepSidebar;