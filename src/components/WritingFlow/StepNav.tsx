import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import CardWrapper from '@/components/shared/CardWrapper';
import { useDemoMode } from '@/state/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  BookOpen, 
  Search, 
  Target, 
  FileText, 
  PenTool,
  CheckCircle,
  Circle
} from 'lucide-react';

interface StepNavProps {
  className?: string;
}

const StepNav: React.FC<StepNavProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { demoMode } = useDemoMode();
  const { t } = useTranslation();
  
  const steps = [
    {
      id: 'topic',
      titleKey: 'steps.topic.title',
      descriptionKey: 'steps.topic.description',
      path: '/writing-flow/topic',
      icon: BookOpen
    },
    {
      id: 'research', 
      titleKey: 'steps.research.title',
      descriptionKey: 'steps.research.description',
      path: '/writing-flow/research',
      icon: Search
    },
    {
      id: 'strategy',
      titleKey: 'steps.strategy.title',
      descriptionKey: 'steps.strategy.description',
      path: '/writing-flow/strategy',
      icon: Target
    },
    {
      id: 'outline',
      titleKey: 'steps.outline.title',
      descriptionKey: 'steps.outline.description', 
      path: '/writing-flow/outline',
      icon: FileText
    }
  ];

  const getCurrentStepIndex = () => {
    const currentPath = location.pathname;
    return steps.findIndex(step => step.path === currentPath);
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  return (
    <CardWrapper 
      className={cn('space-y-2', className)}
    >
      <div className="pb-4 border-b border-slate-200/70">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">{t('steps.title')}</h2>
        <p className="text-sm text-slate-600">{t('steps.subtitle')}</p>
      </div>
      
      <div className="space-y-1">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(index);
          const isClickable = demoMode || status !== 'pending';
          const title = t(step.titleKey);
          const description = t(step.descriptionKey);
          
          return (
            <button
              key={step.id}
              onClick={() => isClickable && navigate(step.path)}
              disabled={!isClickable}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200',
                status === 'current' && 'bg-[#6A5AF9]/10 border border-[#6A5AF9]/20',
                status === 'completed' && 'bg-green-50 border border-green-200/50 hover:bg-green-100',
                status === 'pending' && !demoMode && 'bg-slate-50 border border-slate-200/50 opacity-60 cursor-not-allowed',
                status === 'pending' && demoMode && 'bg-slate-50 border border-slate-200/50 hover:bg-slate-100',
                isClickable && status !== 'current' && 'hover:bg-slate-100'
              )}
            >
              {/* Step Number/Status Icon */}
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg',
                status === 'current' && 'bg-[#6A5AF9] text-white',
                status === 'completed' && 'bg-green-600 text-white',
                status === 'pending' && 'bg-slate-300 text-slate-500'
              )}>
                {status === 'completed' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : status === 'current' ? (
                  <Icon className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
              
              {/* Step Info */}
              <div className="flex-1 min-w-0">
                <div className={cn(
                  'font-medium text-sm',
                  status === 'current' && 'text-[#6A5AF9]',
                  status === 'completed' && 'text-green-700',
                  status === 'pending' && 'text-slate-500'
                )}>
                  {title}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {description}
                </div>
              </div>
              
              {/* Step Number Badge */}
              <div className={cn(
                'flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium',
                status === 'current' && 'bg-[#6A5AF9]/20 text-[#6A5AF9]',
                status === 'completed' && 'bg-green-100 text-green-700',
                status === 'pending' && 'bg-slate-200 text-slate-500'
              )}>
                {index + 1}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Progress Summary */}
      <div className="pt-4 border-t border-slate-200/70">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">{t('steps.progress')}</span>
          <span className="text-sm text-slate-600">
            {Math.max(0, currentStepIndex)}/4
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-[#6A5AF9] h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(0, currentStepIndex) * 25}%` }}
          />
        </div>
      </div>
    </CardWrapper>
  );
};

export default StepNav;