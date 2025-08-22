import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  RotateCcw, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Loader2,
  AlertTriangle,
  Target,
  Zap,
  BookOpen,
  RefreshCw,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/state/AppContext';

import { 
  AgentPanelState, 
  Plan, 
  DiffItem, 
  ExecutionResult,
  ExecutionStatus,
  Scope 
} from '@/types/agent';
import { 
  planCommand, 
  applyPlan, 
  undoOperation,
  saveRecipe,
  PlanCommandRequest,
  ApplyPlanRequest 
} from '@/services/agentApi';

import CommandInput from './CommandInput';
import DiffViewer from './DiffViewer';
import AuditPanel from './AuditPanel';

interface AgentPanelProps {
  scope: Scope;
  onScopeChange?: (scope: Scope) => void;
  className?: string;
}

const AgentPanel: React.FC<AgentPanelProps> = ({
  scope,
  onScopeChange,
  className = ''
}) => {
  const { trackTyped } = useApp();
  const [activeTab, setActiveTab] = useState<'command' | 'audit'>('command');
  const [state, setState] = useState<AgentPanelState>({
    status: 'idle',
    currentCommand: '',
    scope,
    previewDiffs: [],
    selectedDiffCategories: new Set(['structure', 'content', 'format', 'reference', 'figure']),
    showPreview: false
  });

  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [executionProgress, setExecutionProgress] = useState(0);

  // 更新作用域
  useEffect(() => {
    setState(prev => ({ ...prev, scope }));
  }, [scope]);

  // 获取状态显示信息
  const getStatusDisplay = (status: ExecutionStatus) => {
    const statusInfo = {
      idle: { label: '待命中', icon: Target, color: 'bg-slate-100 text-slate-600' },
      planning: { label: '解析中', icon: Loader2, color: 'bg-blue-100 text-blue-600 animate-pulse' },
      preview: { label: '预览中', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
      applying: { label: '执行中', icon: Zap, color: 'bg-purple-100 text-purple-600 animate-pulse' },
      success: { label: '已完成', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
      error: { label: '执行失败', icon: AlertCircle, color: 'bg-red-100 text-red-600' },
      partial: { label: '部分成功', icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' }
    };
    
    return statusInfo[status];
  };

  // 处理命令提交
  const handleCommandSubmit = useCallback(async (command: string) => {
    const startTime = Date.now();
    
    setState(prev => ({ 
      ...prev, 
      status: 'planning', 
      currentCommand: command,
      error: undefined
    }));

    // Track command submission
    trackTyped('agent_command_submit', {
      command,
      commandLength: command.length,
      scope: state.scope.type
    }, 'ai_assistant', 'command');

    try {
      const request: PlanCommandRequest = {
        command,
        scope: state.scope,
        docSnapshotId: 'current'
      };

      const response = await planCommand(request);
      
      setState(prev => ({
        ...prev,
        status: 'preview',
        plan: response.plan,
        previewDiffs: response.previewDiffs,
        showPreview: true
      }));

      // Track plan generation success
      trackTyped('agent_plan_generated', {
        planId: response.plan.id,
        stepsCount: response.plan.steps.length,
        estimatedTime: response.plan.estimatedTime,
        commandType: response.plan.steps.map(s => s.type).join(',')
      }, 'ai_assistant', 'plan');

      if (response.warnings.length > 0) {
        response.warnings.forEach(warning => {
          toast.warning(warning);
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '命令解析失败';
      setState(prev => ({ 
        ...prev, 
        status: 'error',
        error: errorMessage
      }));
      
      // Track command error
      trackTyped('error_occurred', {
        errorType: 'client',
        errorMessage,
        context: 'agent_command_submit',
        userAgent: navigator.userAgent
      }, 'error', 'agent');
      
      toast.error(errorMessage);
    }
  }, [state.scope, trackTyped]);

  // 应用修改
  const handleApplyChanges = useCallback(async () => {
    if (!state.plan) return;

    const startTime = Date.now();
    setState(prev => ({ ...prev, status: 'applying' }));
    setExecutionProgress(0);

    // Track plan application start
    trackTyped('agent_plan_apply', {
      planId: state.plan.id,
      stepsCount: state.plan.steps.length,
      executionTime: 0
    }, 'ai_assistant', 'execution');

    // 模拟进度更新
    const progressInterval = setInterval(() => {
      setExecutionProgress(prev => Math.min(prev + Math.random() * 15, 90));
    }, 500);

    try {
      const request: ApplyPlanRequest = {
        planId: state.plan.id,
        acceptSteps: state.plan.steps.map(step => 
          `${step.type}-${Math.random().toString(36).substr(2, 9)}`
        )
      };

      const response = await applyPlan(request);
      
      clearInterval(progressInterval);
      setExecutionProgress(100);

      const executionTime = Date.now() - startTime;

      setState(prev => ({
        ...prev,
        status: response.result.status,
        showPreview: false
      }));

      setLastOperation(response.auditEntry.id);

      // Track operation success/failure
      if (response.result.status === 'success') {
        trackTyped('agent_operation_success', {
          operationId: response.auditEntry.id,
          operationType: 'plan_execution',
          executionTime,
          changedFiles: response.result.changedFiles || 0
        }, 'ai_assistant', 'success');
        
        toast.success(`修改已成功应用！耗时 ${Math.round(response.result.duration / 1000)}s`);
      } else if (response.result.status === 'partial') {
        trackTyped('agent_operation_failed', {
          operationId: response.auditEntry.id,
          error: 'partial_success',
          partialSuccess: true,
          failedSteps: response.result.failedSteps.length
        }, 'error', 'agent');
        
        toast.warning(`部分修改成功，${response.result.failedSteps.length} 个步骤失败`);
      }

      // 刷新相关数据（这里应该触发上下文更新）
      // TODO: 触发文档重新加载和交付物更新

    } catch (error) {
      clearInterval(progressInterval);
      const errorMessage = error instanceof Error ? error.message : '执行失败';
      
      setState(prev => ({ 
        ...prev, 
        status: 'error',
        error: errorMessage
      }));
      
      trackTyped('agent_operation_failed', {
        operationId: state.plan.id,
        error: errorMessage,
        partialSuccess: false,
        failedSteps: state.plan.steps.length
      }, 'error', 'agent');
      
      toast.error(errorMessage);
    }
  }, [state.plan, trackTyped]);

  // 撤销操作
  const handleUndo = useCallback(async () => {
    if (!lastOperation) return;

    const startTime = Date.now();
    try {
      setState(prev => ({ ...prev, status: 'applying' }));
      
      await undoOperation({ operationId: lastOperation });
      
      setState(prev => ({ ...prev, status: 'idle' }));
      setLastOperation(null);
      
      const undoTime = Date.now() - startTime;
      
      trackTyped('agent_undo', {
        operationId: lastOperation,
        undoTime,
        success: true
      }, 'ai_assistant', 'undo');
      
      toast.success('操作已成功撤销');
      
      // TODO: 刷新相关数据

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '撤销失败';
      
      trackTyped('agent_undo', {
        operationId: lastOperation,
        undoTime: Date.now() - startTime,
        success: false
      }, 'error', 'agent');
      
      toast.error(errorMessage);
    }
  }, [lastOperation, trackTyped]);

  // 保存为配方
  const handleSaveRecipe = useCallback(() => {
    if (!state.currentCommand || !state.plan) return;

    const recipeName = prompt('请为这个命令配方命名:', '');
    if (!recipeName) return;

    try {
      const recipe = saveRecipe({
        name: recipeName,
        description: `包含 ${state.plan.steps.length} 个步骤的 Agent 命令`,
        template: state.currentCommand,
        tags: state.plan.steps.map(step => step.type.split('.')[0]),
        usageCount: 0
      });

      trackTyped('agent_recipe_save', {
        recipeName,
        command: state.currentCommand,
        stepsCount: state.plan.steps.length
      }, 'ai_assistant', 'recipe');

      toast.success(`配方 "${recipe.name}" 已保存`);
    } catch (error) {
      trackTyped('error_occurred', {
        errorType: 'client',
        errorMessage: '保存配方失败',
        context: 'agent_recipe_save',
        userAgent: navigator.userAgent
      }, 'error', 'agent');
      
      toast.error('保存配方失败');
    }
  }, [state.currentCommand, state.plan, trackTyped]);

  // 重置状态
  const handleReset = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'idle',
      currentCommand: '',
      plan: undefined,
      previewDiffs: [],
      showPreview: false,
      error: undefined
    }));
    setExecutionProgress(0);
  }, []);

  const statusDisplay = getStatusDisplay(state.status);
  const StatusIcon = statusDisplay.icon;
  const canApply = state.status === 'preview' && state.plan && state.plan.requires.length === 0;
  const canUndo = lastOperation && ['success', 'partial'].includes(state.status);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab 选项卡 */}
      <div className="flex border-b border-gray-200">
        <Button
          variant={activeTab === 'command' ? 'default' : 'ghost'}
          size="sm"
          className="flex-1 rounded-none border-0 h-10"
          onClick={() => {
            setActiveTab('command');
            trackTyped('tab_change', {
              tabGroup: 'agent_panel',
              previousTab: activeTab,
              newTab: 'command',
              context: 'agent_ui'
            }, 'user_action', 'ui_interaction');
          }}
        >
          <Zap className="w-4 h-4 mr-2" />
          命令执行
        </Button>
        <Button
          variant={activeTab === 'audit' ? 'default' : 'ghost'}
          size="sm"
          className="flex-1 rounded-none border-0 h-10"
          onClick={() => {
            setActiveTab('audit');
            trackTyped('tab_change', {
              tabGroup: 'agent_panel',
              previousTab: activeTab,
              newTab: 'audit',
              context: 'agent_ui'
            }, 'user_action', 'ui_interaction');
          }}
        >
          <Activity className="w-4 h-4 mr-2" />
          操作审计
        </Button>
      </div>

      {/* Tab 内容 */}
      {activeTab === 'command' ? (
        <div className="space-y-6">
          {/* 标题和状态 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={`${statusDisplay.color} border-0`}>
                  <StatusIcon className={`w-3 h-3 mr-1 ${state.status === 'applying' || state.status === 'planning' ? 'animate-spin' : ''}`} />
                  {statusDisplay.label}
                </Badge>
              </div>
              
              {(state.status !== 'idle' && state.status !== 'applying') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  重置
                </Button>
              )}
            </div>
            
            <p className="text-sm text-slate-600">
              使用自然语言描述您想要的修改，Agent 将解析并预览变更。
            </p>
          </div>

      {/* 命令输入 */}
      <CommandInput
        onSubmit={handleCommandSubmit}
        scope={state.scope}
        disabled={state.status === 'planning' || state.status === 'applying'}
        loading={state.status === 'planning'}
      />

          {/* 错误显示 */}
          {state.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-800 mb-1">执行出错</h4>
                  <p className="text-sm text-red-700">{state.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 执行进度 */}
          {state.status === 'applying' && (
            <div className="space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#6E5BFF] rounded-full animate-pulse" />
                  <span className="text-slate-600">正在应用修改...</span>
                </div>
                <span className="text-slate-500 font-medium">{Math.round(executionProgress)}%</span>
              </div>
              <Progress value={executionProgress} className="h-2 transition-all duration-500" />
            </div>
          )}

          {/* 计划预览 */}
          {state.showPreview && state.plan && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-slate-900">执行计划</h4>
              <Badge variant="outline" className="text-xs">
                {state.plan.steps.length} 个步骤
              </Badge>
            </div>

            {/* 步骤列表 */}
            <div className="space-y-2 mb-4">
              {state.plan.steps.map((step, index) => {
                const stepIcons = {
                  structure: BookOpen,
                  style: RefreshCw,
                  figure: Target,
                  language: Zap,
                  reference: BookOpen
                };
                
                const stepType = step.type.split('.')[0] as keyof typeof stepIcons;
                const StepIcon = stepIcons[stepType] || Target;

                return (
                  <div key={index} className="flex items-start gap-3 p-2 bg-slate-50 rounded">
                    <div className="flex items-center justify-center w-6 h-6 bg-slate-200 rounded-full flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-slate-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StepIcon className="w-3 h-3 text-slate-500" />
                        <Badge variant="outline" className="text-xs">
                          {step.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 预计时间 */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              <span>预计用时: {state.plan.estimatedTime}</span>
            </div>

            {/* 警告信息 */}
            {state.plan.warnings.length > 0 && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-medium text-orange-800 mb-1">注意事项</h5>
                    <ul className="text-sm text-orange-700 space-y-1">
                      {state.plan.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 依赖检查 */}
            {state.plan.requires.length > 0 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-medium text-red-800 mb-1">缺少依赖</h5>
                    <p className="text-sm text-red-700">
                      需要解决以下问题才能执行：{state.plan.requires.join('、')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 差异预览 */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-200">
              <h4 className="font-medium text-slate-900">变更预览</h4>
            </div>
            <div className="p-4">
              <DiffViewer 
                diffs={state.previewDiffs}
                onCategoryFilter={(categories) => 
                  setState(prev => ({ ...prev, selectedDiffCategories: categories }))
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center gap-3">
        {state.status === 'preview' && (
          <>
            <Button
              onClick={handleApplyChanges}
              disabled={!canApply}
              className="bg-[#6E5BFF] hover:bg-[#5A4ACF] transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <Play className="w-4 h-4 mr-2" />
              应用修改
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSaveRecipe}
              className="transition-all duration-200 hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              保存为配方
            </Button>
          </>
        )}

        {canUndo && (
          <Button
            variant="outline"
            onClick={handleUndo}
            className="text-orange-600 border-orange-200 hover:bg-orange-50 transition-all duration-200 hover:scale-105 animate-in fade-in slide-in-from-right-2"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            撤销上次操作
          </Button>
        )}
      </div>

          {/* 成功状态 */}
          {state.status === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 animate-in zoom-in duration-300" />
                <span className="text-sm font-medium text-green-800">
                  修改已成功应用到文档
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 审计面板 */
        <AuditPanel className="h-full" />
      )}
    </div>
  );
};

export default AgentPanel;