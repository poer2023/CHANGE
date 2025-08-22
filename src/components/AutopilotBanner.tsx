import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Target,
  FileText,
  Minimize2,
  Maximize2,
  Pause,
  Play,
  Square,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AutopilotBannerProps } from '@/state/types';

const AutopilotBanner: React.FC<AutopilotBannerProps> = ({
  state,
  onMinimize,
  onPause,
  onResume,
  onStop
}) => {
  if (!state.running && state.step === 'idle') {
    return null;
  }

  const getStageIcon = (stage: string, isActive: boolean, isCompleted: boolean, hasError: boolean) => {
    if (hasError) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (isCompleted) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (isActive) return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    
    switch (stage) {
      case 'search':
        return <Search className="h-4 w-4 text-gray-400" />;
      case 'strategy':
        return <Target className="h-4 w-4 text-gray-400" />;
      case 'outline':
        return <FileText className="h-4 w-4 text-gray-400" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getStageText = (stage: string) => {
    switch (stage) {
      case 'search':
        return `文献检索：命中 ${state.stats.hits}，已验真 ${state.stats.verified}`;
      case 'strategy':
        return `写作策略：候选策略制定中`;
      case 'outline':
        return `大纲构建：章节 ${state.stats.sections}`;
      default:
        return '准备中...';
    }
  };

  const stages = [
    { id: 'search', name: '文献检索' },
    { id: 'strategy', name: '写作策略' },
    { id: 'outline', name: '大纲构建' }
  ];

  const currentStageIndex = stages.findIndex(s => s.id === state.step);
  const isCompleted = state.step === 'done';
  const hasError = state.step === 'error';

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm transition-all duration-300",
      state.minimized ? "h-12" : "h-20"
    )}>
      <div className="max-w-7xl mx-auto px-4 h-full">
        {state.minimized ? (
          // Minimized view
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-[#6E5BFF] to-[#8B7FFF] flex items-center justify-center">
                {hasError ? (
                  <AlertCircle className="h-3 w-3 text-white" />
                ) : isCompleted ? (
                  <CheckCircle className="h-3 w-3 text-white" />
                ) : (
                  <Loader2 className="h-3 w-3 text-white animate-spin" />
                )}
              </div>
              
              <span className="text-sm font-medium text-gray-900">
                AI 自动推进
              </span>
              
              {!hasError && !isCompleted && (
                <Badge variant="secondary" className="text-xs">
                  {Math.round(state.progress)}%
                </Badge>
              )}
              
              {hasError && (
                <Badge variant="destructive" className="text-xs">
                  错误
                </Badge>
              )}
              
              {isCompleted && (
                <Badge className="text-xs bg-green-100 text-green-800">
                  完成
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMinimize(false)}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              
              {!isCompleted && !hasError && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onStop}
                  className="h-8 w-8 p-0"
                >
                  <Square className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          // Full view
          <div className="py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#6E5BFF] to-[#8B7FFF] flex items-center justify-center">
                  {hasError ? (
                    <AlertCircle className="h-4 w-4 text-white" />
                  ) : isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">AI 自动推进</h3>
                  <p className="text-xs text-gray-600">
                    {hasError ? '发生错误，请查看日志' : 
                     isCompleted ? '所有步骤已完成' :
                     getStageText(state.step)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {state.running && state.canPause && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPause}
                    className="h-8"
                  >
                    <Pause className="h-3 w-3 mr-1" />
                    暂停
                  </Button>
                )}
                
                {state.running && !state.canPause && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onResume}
                    className="h-8"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    继续
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMinimize(true)}
                  className="h-8 w-8 p-0"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
                
                {!isCompleted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onStop}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Square className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {!hasError && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">总体进度</span>
                  <span className="text-xs text-gray-600">{Math.round(state.progress)}%</span>
                </div>
                <Progress value={state.progress} className="h-1.5" />
              </div>
            )}

            {/* Stage indicators */}
            <div className="flex items-center gap-4">
              {stages.map((stage, index) => {
                const isActive = state.step === stage.id;
                const isCompleted = index < currentStageIndex || state.step === 'done';
                const stageHasError = hasError && isActive;

                return (
                  <div key={stage.id} className="flex items-center gap-2">
                    {getStageIcon(stage.id, isActive, isCompleted, stageHasError)}
                    <span className={cn(
                      "text-xs font-medium",
                      isCompleted ? "text-green-600" :
                      isActive ? "text-blue-600" :
                      stageHasError ? "text-red-600" :
                      "text-gray-500"
                    )}>
                      {stage.name}
                    </span>
                    
                    {index < stages.length - 1 && (
                      <div className={cn(
                        "w-8 h-px ml-2 mr-2",
                        isCompleted ? "bg-green-300" : "bg-gray-200"
                      )} />
                    )}
                  </div>
                );
              })}

              {isCompleted && (
                <>
                  <div className="w-8 h-px bg-green-300" />
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-green-600">完成</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutopilotBanner;