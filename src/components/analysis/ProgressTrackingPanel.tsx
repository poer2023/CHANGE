/**
 * 智能进度跟踪面板组件
 * 显示论文完成度可视化、各章节进度统计、写作时间分析、里程碑提醒等
 */

import React, { useState, useEffect } from 'react';
import { 
  ProgressTrackingResult,
  SectionProgress,
  Milestone,
  ProgressRecommendation,
  WritingPhase,
  TimeAnalysis
} from '../../services/progress-tracker';
import { Paper } from '../../types';

interface ProgressTrackingPanelProps {
  paper: Paper;
  progressResult?: ProgressTrackingResult;
  onTrack?: () => void;
  onUpdateMilestone?: (milestoneId: string, updates: Partial<Milestone>) => void;
  onApplyRecommendation?: (recommendation: ProgressRecommendation) => void;
  isLoading?: boolean;
}

const ProgressTrackingPanel: React.FC<ProgressTrackingPanelProps> = ({
  paper,
  progressResult,
  onTrack,
  onUpdateMilestone,
  onApplyRecommendation,
  isLoading = false
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'sections' | 'time' | 'milestones' | 'productivity'>('overview');
  const [showMilestoneDetails, setShowMilestoneDetails] = useState<string | null>(null);

  const getPhaseColor = (phase: WritingPhase) => {
    const colors = {
      planning: 'bg-purple-100 text-purple-800',
      research: 'bg-blue-100 text-blue-800',
      outline: 'bg-indigo-100 text-indigo-800',
      drafting: 'bg-green-100 text-green-800',
      revision: 'bg-yellow-100 text-yellow-800',
      proofreading: 'bg-orange-100 text-orange-800',
      finalization: 'bg-red-100 text-red-800'
    };
    return colors[phase] || 'bg-gray-100 text-gray-800';
  };

  const getPhaseLabel = (phase: WritingPhase) => {
    const labels = {
      planning: '规划阶段',
      research: '研究阶段',
      outline: '大纲阶段',
      drafting: '写作阶段',
      revision: '修订阶段',
      proofreading: '校对阶段',
      finalization: '定稿阶段'
    };
    return labels[phase] || phase;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      draft_complete: 'bg-green-100 text-green-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      revision_needed: 'bg-orange-100 text-orange-800',
      completed: 'bg-emerald-100 text-emerald-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      not_started: '未开始',
      in_progress: '进行中',
      draft_complete: '初稿完成',
      under_review: '审阅中',
      revision_needed: '需要修订',
      completed: '已完成'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* 整体进度卡片 */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">整体进度</h3>
          {progressResult && (
            <span className={`px-3 py-1 rounded text-sm font-medium ${getPhaseColor(progressResult.overall.phase)}`}>
              {getPhaseLabel(progressResult.overall.phase)}
            </span>
          )}
        </div>
        
        {progressResult ? (
          <>
            {/* 进度条 */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>完成度</span>
                <span>{progressResult.overall.completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressResult.overall.completionPercentage}%` }}
                />
              </div>
            </div>

            {/* 关键指标 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                title="字数进度"
                value={`${progressResult.overall.totalWordCount.toLocaleString()}`}
                subtitle={`/ ${progressResult.overall.targetWordCount.toLocaleString()}`}
                icon="📝"
              />
              <MetricCard
                title="质量评分"
                value={`${progressResult.overall.qualityScore}`}
                subtitle="/ 100"
                icon="⭐"
              />
              <MetricCard
                title="预计剩余"
                value={`${Math.round(progressResult.overall.estimatedTimeToCompletion)}`}
                subtitle="小时"
                icon="⏰"
              />
              <MetricCard
                title="当前状态"
                value={getStatusLabel(progressResult.overall.status)}
                subtitle=""
                icon="📊"
              />
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>点击"开始跟踪"来获取详细的进度分析</p>
          </div>
        )}
      </div>

      {/* 最近活动 */}
      {progressResult && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
          <div className="space-y-3">
            <ActivityItem
              time="2小时前"
              action="完成了引言部分的修订"
              type="revision"
            />
            <ActivityItem
              time="昨天"
              action="添加了1,200字到方法论章节"
              type="writing"
            />
            <ActivityItem
              time="2天前"
              action="达成里程碑：完成初稿"
              type="milestone"
            />
          </div>
        </div>
      )}

      {/* 关键建议 */}
      {progressResult && progressResult.recommendations.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">关键建议</h3>
          <div className="space-y-3">
            {progressResult.recommendations.slice(0, 3).map((recommendation, index) => (
              <RecommendationCard
                key={index}
                recommendation={recommendation}
                onApply={() => onApplyRecommendation?.(recommendation)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSectionsTab = () => (
    <div className="space-y-6">
      {progressResult && (
        <>
          {/* 章节进度总览 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">章节进度总览</h3>
            <div className="space-y-4">
              {progressResult.sections.map((section, index) => (
                <SectionProgressCard key={index} section={section} />
              ))}
            </div>
          </div>

          {/* 章节统计 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold text-gray-900 mb-3">进度分布</h4>
              <div className="space-y-2">
                {[
                  { status: 'completed', count: progressResult.sections.filter(s => s.status === 'completed').length, color: 'bg-green-500' },
                  { status: 'in_progress', count: progressResult.sections.filter(s => s.status === 'in_progress').length, color: 'bg-blue-500' },
                  { status: 'not_started', count: progressResult.sections.filter(s => s.status === 'not_started').length, color: 'bg-gray-500' }
                ].map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-600">{getStatusLabel(item.status)}</span>
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold text-gray-900 mb-3">字数统计</h4>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {progressResult.sections.reduce((sum, s) => sum + s.wordCount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">总字数</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold text-gray-900 mb-3">平均进度</h4>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(progressResult.sections.reduce((sum, s) => sum + s.completionPercentage, 0) / progressResult.sections.length)}%
                </div>
                <div className="text-sm text-gray-500">完成度</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderTimeTab = () => (
    <div className="space-y-6">
      {progressResult && (
        <>
          {/* 时间统计 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(progressResult.timeAnalysis.totalTimeSpent / 60)}
              </div>
              <div className="text-sm text-gray-500">总时间 (小时)</div>
            </div>
            <div className="bg-white rounded-lg border p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(progressResult.timeAnalysis.averageSessionLength)}
              </div>
              <div className="text-sm text-gray-500">平均时长 (分钟)</div>
            </div>
            <div className="bg-white rounded-lg border p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {progressResult.timeAnalysis.writingVelocity.wordsPerHour}
              </div>
              <div className="text-sm text-gray-500">字/小时</div>
            </div>
            <div className="bg-white rounded-lg border p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {progressResult.timeAnalysis.mostProductiveHours.length > 0 
                  ? `${progressResult.timeAnalysis.mostProductiveHours[0]}:00`
                  : 'N/A'
                }
              </div>
              <div className="text-sm text-gray-500">最佳时段</div>
            </div>
          </div>

          {/* 写作速度趋势 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">写作速度分析</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">速度指标</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">每小时字数:</span>
                    <span className="text-sm font-medium">{progressResult.timeAnalysis.writingVelocity.wordsPerHour}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">每次写作字数:</span>
                    <span className="text-sm font-medium">{progressResult.timeAnalysis.writingVelocity.wordsPerSession}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">趋势:</span>
                    <span className={`text-sm font-medium ${
                      progressResult.timeAnalysis.writingVelocity.trend === 'increasing' ? 'text-green-600' :
                      progressResult.timeAnalysis.writingVelocity.trend === 'decreasing' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {progressResult.timeAnalysis.writingVelocity.trend === 'increasing' ? '上升' :
                       progressResult.timeAnalysis.writingVelocity.trend === 'decreasing' ? '下降' : '稳定'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">时间分布</h4>
                <div className="space-y-2">
                  {Object.entries(progressResult.timeAnalysis.timeDistribution).map(([activity, percentage]) => (
                    <div key={activity} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 capitalize">{activity}:</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 会话模式 */}
          {progressResult.timeAnalysis.sessionPatterns.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">写作模式分析</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {progressResult.timeAnalysis.sessionPatterns.map((pattern, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2 capitalize">{pattern.timeOfDay}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>平均时长:</span>
                        <span>{Math.round(pattern.duration)}分钟</span>
                      </div>
                      <div className="flex justify-between">
                        <span>生产力:</span>
                        <span>{Math.round(pattern.productivity)}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>频率:</span>
                        <span>{Math.round(pattern.frequency * 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderMilestonesTab = () => (
    <div className="space-y-6">
      {progressResult && (
        <>
          {/* 里程碑时间轴 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">里程碑时间轴</h3>
            <div className="space-y-4">
              {progressResult.milestones.map((milestone, index) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  isExpanded={showMilestoneDetails === milestone.id}
                  onToggle={() => setShowMilestoneDetails(
                    showMilestoneDetails === milestone.id ? null : milestone.id
                  )}
                  onUpdate={(updates) => onUpdateMilestone?.(milestone.id, updates)}
                />
              ))}
            </div>
          </div>

          {/* 里程碑统计 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { status: 'completed', label: '已完成', color: 'bg-green-500' },
              { status: 'due', label: '即将到期', color: 'bg-yellow-500' },
              { status: 'overdue', label: '已逾期', color: 'bg-red-500' },
              { status: 'upcoming', label: '未来计划', color: 'bg-blue-500' }
            ].map((item) => (
              <div key={item.status} className="bg-white rounded-lg border p-6 text-center">
                <div className={`inline-block w-8 h-8 rounded-full ${item.color} mb-2`} />
                <div className="text-lg font-bold text-gray-900">
                  {progressResult.milestones.filter(m => m.status === item.status).length}
                </div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderProductivityTab = () => (
    <div className="space-y-6">
      {progressResult && (
        <>
          {/* 生产力总览 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">生产力分析</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {progressResult.productivity.overallScore}
                </div>
                <div className="text-sm text-gray-500">综合评分</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${progressResult.productivity.overallScore}%` }}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">最佳表现时间</h4>
                <div className="space-y-1 text-sm">
                  <div>时间: {progressResult.productivity.peakPerformance.bestHours.join(', ')}点</div>
                  <div>日期: {progressResult.productivity.peakPerformance.bestDays.join(', ')}</div>
                  <div>平均字数: {progressResult.productivity.peakPerformance.averageWordsInPeakHours}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">最佳条件</h4>
                <div className="space-y-1">
                  {progressResult.productivity.peakPerformance.bestConditions.map((condition, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      {condition}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 生产力建议 */}
          {progressResult.productivity.recommendations.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">生产力提升建议</h3>
              <div className="space-y-3">
                {progressResult.productivity.recommendations.map((recommendation, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
                        recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {recommendation.priority === 'high' ? '高' :
                         recommendation.priority === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{recommendation.description}</p>
                    <div className="text-xs text-gray-500">
                      预期提升: +{recommendation.expectedImpact}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* 头部 */}
        <div className="mb-6 bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">智能进度跟踪</h1>
              <p className="text-gray-600">
                追踪论文《{paper.title}》的写作进度和生产力分析
              </p>
            </div>
            <button
              onClick={onTrack}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              )}
              <span>{isLoading ? '分析中...' : '开始跟踪'}</span>
            </button>
          </div>
        </div>

        {/* 标签导航 */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { key: 'overview', label: '总览' },
              { key: 'sections', label: '章节进度' },
              { key: 'time', label: '时间分析' },
              { key: 'milestones', label: '里程碑' },
              { key: 'productivity', label: '生产力' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 内容区域 */}
        <div className="min-h-96">
          {selectedTab === 'overview' && renderOverviewTab()}
          {selectedTab === 'sections' && renderSectionsTab()}
          {selectedTab === 'time' && renderTimeTab()}
          {selectedTab === 'milestones' && renderMilestonesTab()}
          {selectedTab === 'productivity' && renderProductivityTab()}
        </div>
      </div>
    </div>
  );
};

// 指标卡片组件
interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">{icon}</span>
      <span className="text-xs text-gray-500">{title}</span>
    </div>
    <div className="text-xl font-bold text-gray-900">
      {value}
      <span className="text-sm font-normal text-gray-500 ml-1">{subtitle}</span>
    </div>
  </div>
);

// 活动项组件
interface ActivityItemProps {
  time: string;
  action: string;
  type: 'writing' | 'revision' | 'milestone' | 'research';
}

const ActivityItem: React.FC<ActivityItemProps> = ({ time, action, type }) => {
  const getTypeIcon = (type: string) => {
    const icons = {
      writing: '✍️',
      revision: '✏️',
      milestone: '🎯',
      research: '🔍'
    };
    return icons[type as keyof typeof icons] || '📝';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      writing: 'bg-blue-100',
      revision: 'bg-yellow-100',
      milestone: 'bg-green-100',
      research: 'bg-purple-100'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100';
  };

  return (
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-full ${getTypeColor(type)}`}>
        <span className="text-sm">{getTypeIcon(type)}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{action}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};

// 章节进度卡片组件
interface SectionProgressCardProps {
  section: SectionProgress;
}

const SectionProgressCard: React.FC<SectionProgressCardProps> = ({ section }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      draft_complete: 'bg-green-100 text-green-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      revision_needed: 'bg-orange-100 text-orange-800',
      completed: 'bg-emerald-100 text-emerald-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      not_started: '未开始',
      in_progress: '进行中',
      draft_complete: '初稿完成',
      under_review: '审阅中',
      revision_needed: '需要修订',
      completed: '已完成'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{section.title}</h4>
          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
            <span>{section.wordCount.toLocaleString()} / {section.targetWordCount.toLocaleString()} 字</span>
            <span>{Math.round(section.timeSpent / 60)} 小时</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(section.status)}`}>
          {getStatusLabel(section.status)}
        </span>
      </div>

      {/* 进度条 */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>完成度</span>
          <span>{section.completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${section.completionPercentage}%` }}
          />
        </div>
      </div>

      {/* 质量指标 */}
      {section.qualityIndicators.length > 0 && (
        <div className="flex space-x-2">
          {section.qualityIndicators.map((indicator, index) => (
            <div key={index} className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">{indicator.aspect}:</span>
              <span className={`text-xs font-medium ${
                indicator.score >= 80 ? 'text-green-600' :
                indicator.score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {indicator.score}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 问题提醒 */}
      {section.issues.length > 0 && (
        <div className="mt-2 text-xs text-orange-600">
          ⚠️ {section.issues.length} 个需要关注的问题
        </div>
      )}
    </div>
  );
};

// 里程碑卡片组件
interface MilestoneCardProps {
  milestone: Milestone;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<Milestone>) => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, isExpanded, onToggle, onUpdate }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'border-blue-200 bg-blue-50',
      due: 'border-yellow-200 bg-yellow-50',
      overdue: 'border-red-200 bg-red-50',
      completed: 'border-green-200 bg-green-50'
    };
    return colors[status as keyof typeof colors] || 'border-gray-200 bg-gray-50';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      upcoming: '⏳',
      due: '⚠️',
      overdue: '🚨',
      completed: '✅'
    };
    return icons[status as keyof typeof icons] || '📅';
  };

  const getImportanceColor = (importance: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    return colors[importance as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor(milestone.status)}`}>
      <div className="flex items-start justify-between cursor-pointer" onClick={onToggle}>
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-lg">{getStatusIcon(milestone.status)}</span>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-gray-900">{milestone.title}</h4>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getImportanceColor(milestone.importance)}`}>
                {milestone.importance === 'critical' ? '关键' :
                 milestone.importance === 'high' ? '重要' :
                 milestone.importance === 'medium' ? '一般' : '较低'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>目标日期: {formatDate(milestone.targetDate)}</span>
              {milestone.actualDate && (
                <span>完成日期: {formatDate(milestone.actualDate)}</span>
              )}
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg 
            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">完成要求</h5>
              <div className="space-y-1">
                {milestone.requirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={req.isCompleted}
                      onChange={(e) => {
                        const updatedRequirements = [...milestone.requirements];
                        updatedRequirements[index] = {
                          ...req,
                          isCompleted: e.target.checked,
                          completedDate: e.target.checked ? new Date() : undefined
                        };
                        onUpdate({ requirements: updatedRequirements });
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${req.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {req.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {milestone.dependencies.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">依赖项</h5>
                <div className="text-sm text-gray-600">
                  {milestone.dependencies.join(', ')}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              {milestone.status !== 'completed' && (
                <button
                  onClick={() => onUpdate({ status: 'completed', actualDate: new Date() })}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >
                  标记完成
                </button>
              )}
              <button
                onClick={() => {
                  const newDate = new Date(milestone.targetDate);
                  newDate.setDate(newDate.getDate() + 7);
                  onUpdate({ targetDate: newDate });
                }}
                className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
              >
                延期一周
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 建议卡片组件
interface RecommendationCardProps {
  recommendation: ProgressRecommendation;
  onApply?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onApply }) => {
  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'border-red-200 bg-red-50',
      high: 'border-orange-200 bg-orange-50',
      medium: 'border-yellow-200 bg-yellow-50',
      low: 'border-blue-200 bg-blue-50'
    };
    return colors[priority as keyof typeof colors] || 'border-gray-200 bg-gray-50';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    const labels = {
      urgent: '紧急',
      high: '高',
      medium: '中',
      low: '低'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {labels[priority as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className={`border rounded-lg p-4 ${getPriorityColor(recommendation.priority)}`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
        {getPriorityBadge(recommendation.priority)}
      </div>
      <p className="text-sm text-gray-700 mb-3">{recommendation.description}</p>
      
      {recommendation.actions.length > 0 && (
        <div className="space-y-1 mb-3">
          <span className="text-xs font-medium text-gray-600">具体行动:</span>
          {recommendation.actions.slice(0, 2).map((action, index) => (
            <div key={index} className="text-xs text-gray-600 ml-2">
              • {action.action}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          <span>预期收益: {recommendation.expectedBenefit}</span>
          <span className="ml-3">实施时间: {Math.round(recommendation.timeToImplement / 60)}小时</span>
        </div>
        <button
          onClick={onApply}
          className="text-xs bg-white px-3 py-1 rounded border hover:bg-gray-50 transition-colors"
        >
          应用建议
        </button>
      </div>
    </div>
  );
};

export default ProgressTrackingPanel;