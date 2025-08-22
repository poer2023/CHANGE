import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Search, 
  Target, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AutoProgressConfig, AutoProgressState } from '@/types/writing-flow';

interface AutoProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (config: AutoProgressConfig) => void;
  progressState?: AutoProgressState;
  estimatedTime?: { min: number; max: number };
}

const AutoProgressDialog: React.FC<AutoProgressDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  progressState,
  estimatedTime
}) => {
  const [config, setConfig] = useState<AutoProgressConfig>({
    strictVerification: true,
    conservativeCitations: false,
    allowAlternativeResources: true
  });

  const stages = [
    {
      id: 'research',
      name: '文献检索',
      icon: Search,
      description: '搜索并筛选相关学术资源'
    },
    {
      id: 'strategy',
      name: '写作策略',
      icon: Target,
      description: '生成论文主题句和论点结构'
    },
    {
      id: 'outline',
      name: '大纲构建',
      icon: FileText,
      description: '创建详细的文档大纲'
    }
  ];

  const handleConfirm = () => {
    onConfirm(config);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const isProgressing = progressState?.isActive || false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#6E5BFF] to-[#8B7FFF] flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            AI 自动推进
          </DialogTitle>
          <DialogDescription className="text-gray-600 leading-relaxed">
            {isProgressing ? 
              '正在自动完成检索、策略和大纲步骤，可随时中断。' :
              '即将自动完成【检索→策略→大纲】，预计时长与成本影响仅做说明，不收费。'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!isProgressing ? (
            <>
              {/* Configuration Options */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">推进选项</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="strict-verification" className="text-sm font-medium">
                        严谨核验
                      </Label>
                      <p className="text-xs text-gray-600">
                        对所有文献进行完整性和可靠性检查
                      </p>
                    </div>
                    <Switch
                      id="strict-verification"
                      checked={config.strictVerification}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({ ...prev, strictVerification: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="conservative-citations" className="text-sm font-medium">
                        保守引用数量
                      </Label>
                      <p className="text-xs text-gray-600">
                        优先选择高质量文献，适度控制引用数量
                      </p>
                    </div>
                    <Switch
                      id="conservative-citations"
                      checked={config.conservativeCitations}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({ ...prev, conservativeCitations: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="alternative-resources" className="text-sm font-medium">
                        允许替代资源
                      </Label>
                      <p className="text-xs text-gray-600">
                        包含预印本、工作论文等非正式出版物
                      </p>
                    </div>
                    <Switch
                      id="alternative-resources"
                      checked={config.allowAlternativeResources}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({ ...prev, allowAlternativeResources: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Time Estimation */}
              {estimatedTime && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#6E5BFF]"></div>
                    <span className="text-sm font-medium text-gray-900">预计时长</span>
                  </div>
                  <p className="text-lg font-semibold text-[#6E5BFF]">
                    {estimatedTime.min}-{estimatedTime.max} 分钟
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    完成后将直接跳转到 Step 4，您仍需在 Step 4 锁价，Step 5 前付费
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 rounded-full"
                >
                  取消
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 rounded-full bg-gradient-to-r from-[#6E5BFF] to-[#8B7FFF] hover:from-[#5B4FCC] hover:to-[#7A6FCC] text-white"
                >
                  开始自动推进
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Progress Display */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      总体进度
                    </span>
                    <span className="text-sm text-gray-600">
                      {Math.round(progressState?.progress || 0)}%
                    </span>
                  </div>
                  <Progress 
                    value={progressState?.progress || 0} 
                    className="h-2"
                  />
                </div>

                {/* Stage Progress */}
                <div className="space-y-3">
                  {stages.map((stage, index) => {
                    const stageState = progressState?.stages?.find(s => 
                      s.name.toLowerCase().includes(stage.id)
                    );
                    const status = stageState?.status || 'pending';
                    const IconComponent = stage.icon;
                    
                    return (
                      <div 
                        key={stage.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
                          status === 'completed' && "bg-green-50 border-green-200",
                          status === 'in_progress' && "bg-blue-50 border-blue-200",
                          status === 'error' && "bg-red-50 border-red-200",
                          status === 'pending' && "bg-gray-50 border-gray-200"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          status === 'completed' && "bg-green-100",
                          status === 'in_progress' && "bg-blue-100",
                          status === 'error' && "bg-red-100",
                          status === 'pending' && "bg-gray-100"
                        )}>
                          {status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : status === 'in_progress' ? (
                            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                          ) : status === 'error' ? (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <IconComponent className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">
                            {stage.name}
                          </h5>
                          <p className="text-xs text-gray-600">
                            {stageState?.message || stage.description}
                          </p>
                        </div>

                        {status === 'completed' && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {status === 'in_progress' && (
                          <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                        )}
                        {status === 'error' && (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cancel Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="rounded-full border-gray-300 text-gray-600 hover:text-gray-900"
                >
                  <X className="h-4 w-4 mr-2" />
                  中断进程
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AutoProgressDialog;