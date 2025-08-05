import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle, 
  Circle, 
  BarChart3,
  Calendar,
  Zap,
  Award,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';

import { useSmartModule } from '../../contexts/SmartModuleContext';
import { SmartModule, ProgressAnalytics, ProductivityTrend } from '../../types/modular';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { LoadingSpinner } from '../UI/LoadingSpinner';

interface SmartProgressTrackerProps {
  modules: SmartModule[];
  onModuleSelect?: (module: SmartModule | null) => void;
  className?: string;
  compact?: boolean;
  showAnalytics?: boolean;
}

interface ProgressMetrics {
  overallProgress: number;
  completedModules: number;
  totalModules: number;
  totalWordCount: number;
  targetWordCount: number;
  averageQuality: number;
  estimatedTimeRemaining: number;
  productivityScore: number;
  streakDays: number;
  milestones: ProgressMilestone[];
}

interface ProgressMilestone {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: 'modules' | 'words' | 'quality' | 'days';
  isCompleted: boolean;
  completedAt?: Date;
  priority: 'low' | 'medium' | 'high';
}

const SmartProgressTracker: React.FC<SmartProgressTrackerProps> = ({
  modules,
  onModuleSelect,
  className = '',
  compact = false,
  showAnalytics = true
}) => {
  const { getModuleAnalytics, updateAnalytics } = useSmartModule();
  
  // Local state
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'all'>('week');
  const [focusModule, setFocusModule] = useState<SmartModule | null>(null);
  const [showDetails, setShowDetails] = useState(!compact);
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'trends'>('overview');

  // Calculate progress metrics
  const progressMetrics = useMemo<ProgressMetrics>(() => {
    const completedModules = modules.filter(m => m.completionLevel === 'complete').length;
    const totalModules = modules.length;
    const totalWordCount = modules.reduce((sum, m) => sum + m.wordCount, 0);
    const targetWordCount = modules.reduce((sum, m) => sum + (m.template?.wordCountTarget?.max || 500), 0);
    const averageQuality = modules.length > 0 
      ? modules.reduce((sum, m) => sum + m.aiScore, 0) / modules.length 
      : 0;
    
    // Estimate time remaining based on completion rate and module complexity
    const avgTimePerModule = 45; // minutes
    const remainingModules = totalModules - completedModules;
    const estimatedTimeRemaining = remainingModules * avgTimePerModule;
    
    // Calculate productivity score based on multiple factors
    const completionRate = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
    const qualityScore = averageQuality;
    const wordCountProgress = targetWordCount > 0 ? (totalWordCount / targetWordCount) * 100 : 0;
    const productivityScore = (completionRate * 0.4 + qualityScore * 0.3 + Math.min(wordCountProgress, 100) * 0.3);
    
    // Mock streak calculation (in real app, this would be based on actual usage data)
    const streakDays = 7;
    
    // Define milestones
    const milestones: ProgressMilestone[] = [
      {
        id: 'first-module',
        title: 'First Module Complete',
        description: 'Complete your first module',
        target: 1,
        current: completedModules,
        unit: 'modules',
        isCompleted: completedModules >= 1,
        completedAt: completedModules >= 1 ? new Date() : undefined,
        priority: 'low'
      },
      {
        id: 'half-complete',
        title: 'Halfway There',
        description: 'Complete 50% of your modules',
        target: Math.ceil(totalModules / 2),
        current: completedModules,
        unit: 'modules',
        isCompleted: completedModules >= Math.ceil(totalModules / 2),
        priority: 'medium'
      },
      {
        id: 'word-target',
        title: 'Word Count Goal',
        description: 'Reach your word count target',
        target: targetWordCount,
        current: totalWordCount,
        unit: 'words',
        isCompleted: totalWordCount >= targetWordCount,
        priority: 'high'
      },
      {
        id: 'quality-excellence',
        title: 'Quality Excellence',
        description: 'Achieve 90%+ average quality score',
        target: 90,
        current: Math.round(averageQuality),
        unit: 'quality',
        isCompleted: averageQuality >= 90,
        priority: 'high'
      },
      {
        id: 'consistency-streak',
        title: 'Consistency Streak',
        description: 'Maintain a 7-day writing streak',
        target: 7,
        current: streakDays,
        unit: 'days',
        isCompleted: streakDays >= 7,
        priority: 'medium'
      }
    ];

    return {
      overallProgress: completionRate,
      completedModules,
      totalModules,
      totalWordCount,
      targetWordCount,
      averageQuality,
      estimatedTimeRemaining,
      productivityScore,
      streakDays,
      milestones
    };
  }, [modules]);

  // Generate mock trend data (in real app, this would come from analytics)
  const trendData = useMemo<ProductivityTrend[]>(() => {
    const days = timeframe === 'day' ? 1 : timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
    const trends: ProductivityTrend[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      trends.push({
        date,
        wordsWritten: Math.floor(Math.random() * 500 + 100),
        timeSpent: Math.floor(Math.random() * 120 + 30),
        qualityScore: Math.floor(Math.random() * 30 + 70),
        moduleProgress: Math.random() * 20
      });
    }
    
    return trends;
  }, [timeframe]);

  // Handle analytics update
  const handleUpdateAnalytics = useCallback(async () => {
    setIsUpdating(true);
    try {
      await updateAnalytics();
    } catch (error) {
      console.error('Failed to update analytics:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [updateAnalytics]);

  // Get trend direction
  const getTrendDirection = (current: number, previous: number) => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  // Format time
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={`smart-progress-tracker ${className} ${compact ? 'compact' : ''}`}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Smart Progress Tracker
            </h3>
            {isUpdating && <LoadingSpinner size="small" />}
          </div>
          
          {!compact && (
            <div className="flex items-center space-x-2">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="px-3 py-1 text-sm border rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleUpdateAnalytics}
                disabled={isUpdating}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-green-600">
              {progressMetrics.completedModules}/{progressMetrics.totalModules}
            </div>
            <div className="text-xs text-gray-500">Modules</div>
            <div className="mt-1 bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: `${progressMetrics.overallProgress}%` }}
              />
            </div>
          </Card>
          
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-blue-600">
              {progressMetrics.totalWordCount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Words</div>
            <div className="mt-1 bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ 
                  width: `${Math.min((progressMetrics.totalWordCount / progressMetrics.targetWordCount) * 100, 100)}%` 
                }}
              />
            </div>
          </Card>
          
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-purple-600">
              {Math.round(progressMetrics.averageQuality)}%
            </div>
            <div className="text-xs text-gray-500">Quality</div>
            <div className="mt-1 bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-purple-500 h-1.5 rounded-full"
                style={{ width: `${progressMetrics.averageQuality}%` }}
              />
            </div>
          </Card>
          
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-yellow-600">
              {formatTime(progressMetrics.estimatedTimeRemaining)}
            </div>
            <div className="text-xs text-gray-500">Remaining</div>
            <div className="flex items-center justify-center mt-1">
              <Clock className="w-3 h-3 text-yellow-500" />
            </div>
          </Card>
        </div>

        {/* View Mode Toggle */}
        {!compact && (
          <div className="flex rounded-lg border p-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'detailed', label: 'Detailed', icon: Target },
              { id: 'trends', label: 'Trends', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`flex-1 flex items-center justify-center px-3 py-2 text-sm rounded-md transition-colors ${
                  viewMode === id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Main Content */}
        {viewMode === 'overview' && (
          <div className="space-y-4">
            {/* Productivity Score */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Productivity Score</h4>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-lg font-bold text-yellow-600">
                    {Math.round(progressMetrics.productivityScore)}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full"
                  style={{ width: `${progressMetrics.productivityScore}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Based on completion, quality, and consistency</span>
                <span>{progressMetrics.streakDays} day streak</span>
              </div>
            </Card>

            {/* Milestones */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Milestones</h4>
                <Award className="w-4 h-4 text-yellow-500" />
              </div>
              
              <div className="space-y-3">
                {progressMetrics.milestones.map((milestone) => (
                  <div 
                    key={milestone.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      milestone.isCompleted 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {milestone.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <h5 className="font-medium text-sm text-gray-900">
                          {milestone.title}
                        </h5>
                        <p className="text-xs text-gray-600">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {milestone.current}
                        {milestone.unit !== 'quality' && milestone.unit !== 'days' && (
                          <>/{milestone.target}</>
                        )}
                        {milestone.unit === 'words' && 'w'}
                        {milestone.unit === 'quality' && '%'}
                        {milestone.unit === 'days' && 'd'}
                      </div>
                      {!milestone.isCompleted && (
                        <div className="text-xs text-gray-500">
                          {milestone.unit === 'modules' && `${milestone.target - milestone.current} more`}
                          {milestone.unit === 'words' && `${(milestone.target - milestone.current).toLocaleString()} more`}
                          {milestone.unit === 'quality' && `${milestone.target - milestone.current}% more`}
                          {milestone.unit === 'days' && `${milestone.target - milestone.current} more days`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {viewMode === 'detailed' && (
          <div className="space-y-4">
            {/* Module Progress List */}
            <Card className="p-4">
              <h4 className="font-medium text-gray-900 mb-3">Module Progress</h4>
              
              <div className="space-y-3 max-h-96 overflow-auto">
                {modules.map((module) => (
                  <div 
                    key={module.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      focusModule?.id === module.id 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setFocusModule(module);
                      onModuleSelect?.(module);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      {module.completionLevel === 'complete' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : module.completionLevel === 'review' ? (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-gray-900">
                          {module.title}
                        </h5>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {module.wordCount} words
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            {Math.round(module.aiScore)}% quality
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {Math.round(module.progress)}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className={`h-1.5 rounded-full ${
                            module.completionLevel === 'complete' ? 'bg-green-500' :
                            module.completionLevel === 'review' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Focus Module Details */}
            {focusModule && (
              <Card className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  {focusModule.title} - Details
                </h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-600">Completion Level</label>
                    <div className={`mt-1 px-2 py-1 text-sm rounded-full inline-block ${
                      focusModule.completionLevel === 'complete' ? 'bg-green-100 text-green-800' :
                      focusModule.completionLevel === 'review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {focusModule.completionLevel}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Type</label>
                    <div className="mt-1 text-sm font-medium">
                      {focusModule.type}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Word Count</label>
                    <div className="mt-1 text-sm font-medium">
                      {focusModule.wordCount}
                      {focusModule.template?.wordCountTarget && (
                        <span className="text-gray-500">
                          / {focusModule.template.wordCountTarget.max} target
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Quality Score</label>
                    <div className="mt-1 text-sm font-medium">
                      {Math.round(focusModule.aiScore)}%
                    </div>
                  </div>
                </div>
                
                {focusModule.smartTags.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Tags</label>
                    <div className="flex flex-wrap gap-1">
                      {focusModule.smartTags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 text-xs rounded"
                          style={{ backgroundColor: tag.color + '20', color: tag.color }}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {viewMode === 'trends' && (
          <div className="space-y-4">
            {/* Trend Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  label: 'Words/Day',
                  current: Math.round(trendData.reduce((sum, d) => sum + d.wordsWritten, 0) / trendData.length),
                  previous: Math.round(trendData.slice(0, -1).reduce((sum, d) => sum + d.wordsWritten, 0) / (trendData.length - 1)),
                  icon: Target,
                  color: 'text-blue-600'
                },
                {
                  label: 'Time/Day',
                  current: Math.round(trendData.reduce((sum, d) => sum + d.timeSpent, 0) / trendData.length),
                  previous: Math.round(trendData.slice(0, -1).reduce((sum, d) => sum + d.timeSpent, 0) / (trendData.length - 1)),
                  icon: Clock,
                  color: 'text-green-600',
                  formatter: formatTime
                },
                {
                  label: 'Avg Quality',
                  current: Math.round(trendData.reduce((sum, d) => sum + d.qualityScore, 0) / trendData.length),
                  previous: Math.round(trendData.slice(0, -1).reduce((sum, d) => sum + d.qualityScore, 0) / (trendData.length - 1)),
                  icon: Award,
                  color: 'text-purple-600',
                  suffix: '%'
                },
                {
                  label: 'Progress',
                  current: Math.round(trendData.reduce((sum, d) => sum + d.moduleProgress, 0) / trendData.length),
                  previous: Math.round(trendData.slice(0, -1).reduce((sum, d) => sum + d.moduleProgress, 0) / (trendData.length - 1)),
                  icon: TrendingUp,
                  color: 'text-yellow-600',
                  suffix: '%'
                }
              ].map((metric, index) => {
                const direction = getTrendDirection(metric.current, metric.previous);
                const change = Math.abs(metric.current - metric.previous);
                
                return (
                  <Card key={index} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <metric.icon className={`w-4 h-4 ${metric.color}`} />
                      <div className="flex items-center space-x-1">
                        {direction === 'up' && <ArrowUp className="w-3 h-3 text-green-500" />}
                        {direction === 'down' && <ArrowDown className="w-3 h-3 text-red-500" />}
                        {direction === 'stable' && <Minus className="w-3 h-3 text-gray-500" />}
                        <span className={`text-xs ${
                          direction === 'up' ? 'text-green-600' :
                          direction === 'down' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {change}{metric.suffix || ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-lg font-bold">
                      {metric.formatter ? metric.formatter(metric.current) : metric.current}
                      {metric.suffix && !metric.formatter && metric.suffix}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {metric.label}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Simple Trend Chart */}
            <Card className="p-4">
              <h4 className="font-medium text-gray-900 mb-3">Activity Trend</h4>
              
              <div className="h-32 flex items-end space-x-1">
                {trendData.map((trend, index) => {
                  const maxWords = Math.max(...trendData.map(d => d.wordsWritten));
                  const height = (trend.wordsWritten / maxWords) * 100;
                  
                  return (
                    <div
                      key={index}
                      className="flex-1 bg-blue-500 rounded-t"
                      style={{ height: `${height}%` }}
                      title={`${trend.date.toLocaleDateString()}: ${trend.wordsWritten} words`}
                    />
                  );
                })}
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{trendData[0]?.date.toLocaleDateString()}</span>
                <span>Words Written</span>
                <span>{trendData[trendData.length - 1]?.date.toLocaleDateString()}</span>
              </div>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        {!compact && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Export progress report
                console.log('Exporting progress report...');
              }}
            >
              <Download className="w-4 h-4 mr-1" />
              Export Report
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Open settings
                console.log('Opening progress settings...');
              }}
            >
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartProgressTracker;