import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';

interface ProgressData {
  totalWords: number;
  targetWords: number;
  completedSections: number;
  totalSections: number;
  timeSpent: number; // minutes
  averageWritingSpeed: number; // words per minute
  sessionsToday: number;
}

interface ProgressChartProps {
  data: ProgressData;
  detailed?: boolean;
  className?: string;
}

interface Milestone {
  id: string;
  label: string;
  targetWords: number;
  completed: boolean;
  date?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  detailed = false,
  className = ''
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showProjection, setShowProjection] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress((data.totalWords / data.targetWords) * 100);
    }, 300);
    return () => clearTimeout(timer);
  }, [data.totalWords, data.targetWords]);

  const wordProgress = Math.min((data.totalWords / data.targetWords) * 100, 100);
  const sectionProgress = (data.completedSections / data.totalSections) * 100;
  
  const estimatedCompletion = calculateEstimatedCompletion(data);
  const milestones = generateMilestones(data);

  function calculateEstimatedCompletion(data: ProgressData) {
    if (data.averageWritingSpeed === 0) return null;
    
    const remainingWords = Math.max(data.targetWords - data.totalWords, 0);
    const estimatedMinutes = remainingWords / data.averageWritingSpeed;
    const estimatedDays = Math.ceil(estimatedMinutes / (2 * 60)); // 假设每天写2小时
    
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + estimatedDays);
    
    return {
      days: estimatedDays,
      date: completionDate.toLocaleDateString('zh-CN'),
      confidence: Math.min(data.sessionsToday * 20, 100) // 基于写作频率的置信度
    };
  }

  function generateMilestones(data: ProgressData): Milestone[] {
    const milestones: Milestone[] = [];
    const quarterWords = data.targetWords / 4;
    
    for (let i = 1; i <= 4; i++) {
      const targetWords = quarterWords * i;
      const completed = data.totalWords >= targetWords;
      
      milestones.push({
        id: `milestone-${i}`,
        label: `第${i}阶段`,
        targetWords: Math.round(targetWords),
        completed,
        date: completed ? new Date().toLocaleDateString('zh-CN') : undefined
      });
    }
    
    return milestones;
  }

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressGradient = (progress: number): string => {
    if (progress >= 90) return 'from-green-400 to-green-600';
    if (progress >= 70) return 'from-blue-400 to-blue-600';
    if (progress >= 50) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">写作进度</h3>
          <p className="text-gray-600 text-sm">
            当前进度和预期完成时间
          </p>
        </div>
        
        {detailed && (
          <button
            onClick={() => setShowProjection(!showProjection)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            {showProjection ? '隐藏预测' : '显示预测'}
          </button>
        )}
      </div>

      {/* 主要进度指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 字数进度 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">字数进度</span>
            <span className="text-sm text-gray-500">
              {data.totalWords.toLocaleString()} / {data.targetWords.toLocaleString()}
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getProgressGradient(wordProgress)}`}
                style={{ width: `${animatedProgress}%` }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
              {Math.round(wordProgress)}%
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span className={wordProgress >= 100 ? 'text-green-600 font-medium' : ''}>
              {wordProgress >= 100 ? '已完成!' : `还需 ${(data.targetWords - data.totalWords).toLocaleString()} 字`}
            </span>
            <span>{data.targetWords.toLocaleString()}</span>
          </div>
        </div>

        {/* 章节进度 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">章节进度</span>
            <span className="text-sm text-gray-500">
              {data.completedSections} / {data.totalSections}
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getProgressGradient(sectionProgress)}`}
                style={{ 
                  width: `${sectionProgress}%`,
                  transitionDelay: '300ms'
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
              {Math.round(sectionProgress)}%
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>0章节</span>
            <span className={sectionProgress >= 100 ? 'text-green-600 font-medium' : ''}>
              {sectionProgress >= 100 ? '全部完成!' : `还需 ${data.totalSections - data.completedSections} 章节`}
            </span>
            <span>{data.totalSections}章节</span>
          </div>
        </div>
      </div>

      {/* 写作统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 text-sm font-medium">今日时长</div>
          <div className="text-blue-900 text-lg font-semibold">
            {formatTime(data.timeSpent)}
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 text-sm font-medium">写作速度</div>
          <div className="text-green-900 text-lg font-semibold">
            {data.averageWritingSpeed} 字/分
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-purple-600 text-sm font-medium">今日会话</div>
          <div className="text-purple-900 text-lg font-semibold">
            {data.sessionsToday} 次
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-orange-600 text-sm font-medium">完成度</div>
          <div className="text-orange-900 text-lg font-semibold">
            {Math.round(Math.max(wordProgress, sectionProgress))}%
          </div>
        </div>
      </div>

      {/* 里程碑进度 */}
      {detailed && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">阶段里程碑</h4>
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`flex items-center p-3 rounded-lg border-2 transition-all duration-300 ${
                  milestone.completed
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-4 h-4 rounded-full flex-shrink-0 mr-3 ${
                  milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {milestone.completed && (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      milestone.completed ? 'text-green-900' : 'text-gray-700'
                    }`}>
                      {milestone.label}
                    </span>
                    <span className="text-sm text-gray-500">
                      {milestone.targetWords.toLocaleString()} 字
                    </span>
                  </div>
                  {milestone.date && (
                    <div className="text-xs text-green-600 mt-1">
                      完成于 {milestone.date}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 完成预测 */}
      {detailed && showProjection && estimatedCompletion && (
        <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-200 animate-slide-in-down">
          <h4 className="font-medium text-primary-900 mb-3">完成预测</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-primary-600 text-sm font-medium">预计完成时间</div>
              <div className="text-primary-900 text-lg font-semibold">
                {estimatedCompletion.days} 天
              </div>
              <div className="text-primary-700 text-xs">
                {estimatedCompletion.date}
              </div>
            </div>
            
            <div>
              <div className="text-primary-600 text-sm font-medium">预测置信度</div>
              <div className="text-primary-900 text-lg font-semibold">
                {estimatedCompletion.confidence}%
              </div>
              <div className="text-primary-700 text-xs">
                基于当前写作频率
              </div>
            </div>
            
            <div>
              <div className="text-primary-600 text-sm font-medium">建议每日目标</div>
              <div className="text-primary-900 text-lg font-semibold">
                {Math.round((data.targetWords - data.totalWords) / estimatedCompletion.days)} 字
              </div>
              <div className="text-primary-700 text-xs">
                保持当前进度
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded border">
            <div className="text-sm text-gray-700">
              💡 <strong>智能建议:</strong> 
              {estimatedCompletion.days <= 7 && ' 您离目标很近了！保持当前节奏即可按时完成。'}
              {estimatedCompletion.days > 7 && estimatedCompletion.days <= 14 && ' 建议每天增加30分钟写作时间，可以提前完成目标。'}
              {estimatedCompletion.days > 14 && ' 建议调整写作计划，增加每日写作时间或降低目标字数。'}
            </div>
          </div>
        </div>
      )}

      {/* 快速操作 */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-md text-sm font-medium hover:bg-primary-200 transition-colors">
          设置目标
        </button>
        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
          查看历史
        </button>
        {detailed && (
          <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors">
            导出报告
          </button>
        )}
      </div>
    </Card>
  );
};

export default ProgressChart;