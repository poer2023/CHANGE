import React from 'react';
import { Clock, FileText, BookOpen, Users, Target, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WritingProject, WritingStep } from '@/types/writing-flow';

interface ProcessSummaryCardProps {
  project: WritingProject;
  className?: string;
}

const ProcessSummaryCard: React.FC<ProcessSummaryCardProps> = ({ project, className = '' }) => {
  // 计算写作流程统计数据
  const completedSteps = project.completedSteps?.length || 0;
  const totalSteps = 5;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);
  
  const sourcesCount = project.sources?.length || 0;
  const selectedSourcesCount = project.sources?.filter(s => s.selected)?.length || 0;
  const wordTarget = project.topic?.wordLimit || 0;
  const claimsCount = project.strategy?.claims?.length || 0;
  const outlineNodesCount = project.outline?.length || 0;
  
  // 估算写作时长
  const createdAt = project.metadata?.createdAt ? new Date(project.metadata.createdAt) : new Date();
  const updatedAt = project.metadata?.updatedAt ? new Date(project.metadata.updatedAt) : new Date();
  const writingDuration = Math.max(1, Math.round((updatedAt.getTime() - createdAt.getTime()) / (1000 * 60))); // 分钟

  // 步骤标签映射
  const stepLabels: Record<WritingStep, string> = {
    topic: '选题',
    research: '检索',
    strategy: '策略',
    outline: '大纲',
    content: '正文'
  };

  // 获取当前步骤状态
  const getCurrentStepStatus = (step: WritingStep) => {
    if (project.completedSteps?.includes(step)) {
      return 'completed';
    } else if (project.currentStep === step) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <div className="w-2 h-2 rounded-full bg-green-400" />;
      case 'current':
        return <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-slate-300" />;
    }
  };

  return (
    <Card className={`bg-card border rounded-2xl p-6 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">写作过程摘要</CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {completionPercentage}% 完成
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 流程进度 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">流程进度</h4>
          <div className="space-y-2">
            {(['topic', 'research', 'strategy', 'outline', 'content'] as WritingStep[]).map((step) => {
              const status = getCurrentStepStatus(step);
              return (
                <div key={step} className="flex items-center gap-3">
                  {getStepIcon(status)}
                  <span className={`text-sm ${
                    status === 'completed' ? 'text-gray-900 font-medium' :
                    status === 'current' ? 'text-blue-600 font-medium' :
                    'text-gray-500'
                  }`}>
                    {stepLabels[step]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 关键数据统计 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">关键数据</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-gray-600">参考文献</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {selectedSourcesCount}<span className="text-sm text-gray-500">/{sourcesCount}</span>
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-gray-600">目标字数</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {wordTarget.toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-gray-600">论点数量</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {claimsCount}
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-gray-600">大纲节点</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {outlineNodesCount}
              </p>
            </div>
          </div>
        </div>

        {/* 写作统计 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">写作统计</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">总耗时</span>
              <span className="text-sm font-medium text-gray-900">
                {writingDuration < 60 ? `${writingDuration} 分钟` : `${Math.round(writingDuration / 60)} 小时`}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">引用格式</span>
              <span className="text-sm font-medium text-gray-900">
                {project.topic?.citationStyle || 'APA'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">语言水平</span>
              <span className="text-sm font-medium text-gray-900">
                {project.topic?.languageLevel === 'undergrad' ? '本科生' :
                 project.topic?.languageLevel === 'postgrad' ? '研究生' :
                 project.topic?.languageLevel === 'esl' ? 'ESL' : '专业'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">开始时间</span>
              <span className="text-sm font-medium text-gray-900">
                {createdAt.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* 质量评估 */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h5 className="text-sm font-medium text-green-900">质量评估</h5>
              <p className="text-xs text-green-700">基于写作流程完整性</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-700">
              {completionPercentage >= 100 ? '优秀' : 
               completionPercentage >= 80 ? '良好' : 
               completionPercentage >= 60 ? '中等' : '待完善'}
            </span>
            <Badge 
              variant="secondary" 
              className="bg-green-200 text-green-800 text-xs"
            >
              {completedSteps}/{totalSteps} 完成
            </Badge>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="pt-2 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full rounded-full text-sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            导出写作报告
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessSummaryCard;