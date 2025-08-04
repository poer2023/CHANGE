import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';

interface TrendData {
  dailyProgress: Array<{
    date: string;
    words: number;
    quality: number;
    timeSpent: number;
  }>;
  weeklyTrends: {
    averageDaily: number;
    improvement: number;
    consistency: number;
  };
}

interface TrendAnalysisProps {
  data: TrendData;
  timeRange: '7d' | '30d' | '90d';
  detailed?: boolean;
  className?: string;
}

interface TrendMetric {
  label: string;
  value: number;
  change: number;
  unit: string;
  icon: string;
  color: string;
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
  data,
  timeRange,
  detailed = false,
  className = ''
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'words' | 'quality' | 'time'>('words');
  const [showInsights, setShowInsights] = useState(false);

  const getTimeRangeLabel = (range: string): string => {
    switch (range) {
      case '7d': return '最近7天';
      case '30d': return '最近30天';
      case '90d': return '最近90天';
      default: return '时间范围';
    }
  };

  const calculateTrends = (): TrendMetric[] => {
    const recentData = data.dailyProgress.slice(-7);
    const previousData = data.dailyProgress.slice(-14, -7);
    
    const recentAvgWords = recentData.reduce((sum, day) => sum + day.words, 0) / recentData.length;
    const previousAvgWords = previousData.length > 0 
      ? previousData.reduce((sum, day) => sum + day.words, 0) / previousData.length 
      : recentAvgWords;
    
    const recentAvgQuality = recentData.reduce((sum, day) => sum + day.quality, 0) / recentData.length;
    const previousAvgQuality = previousData.length > 0
      ? previousData.reduce((sum, day) => sum + day.quality, 0) / previousData.length
      : recentAvgQuality;
    
    const recentAvgTime = recentData.reduce((sum, day) => sum + day.timeSpent, 0) / recentData.length;
    const previousAvgTime = previousData.length > 0
      ? previousData.reduce((sum, day) => sum + day.timeSpent, 0) / previousData.length
      : recentAvgTime;

    return [
      {
        label: '日均字数',
        value: Math.round(recentAvgWords),
        change: ((recentAvgWords - previousAvgWords) / previousAvgWords) * 100,
        unit: '字',
        icon: '📝',
        color: 'blue'
      },
      {
        label: '平均质量',
        value: Math.round(recentAvgQuality),
        change: ((recentAvgQuality - previousAvgQuality) / previousAvgQuality) * 100,
        unit: '分',
        icon: '⭐',
        color: 'yellow'
      },
      {
        label: '日均时长',
        value: Math.round(recentAvgTime),
        change: ((recentAvgTime - previousAvgTime) / previousAvgTime) * 100,
        unit: '分钟',
        icon: '⏱️',
        color: 'green'
      }
    ];
  };

  const trends = calculateTrends();

  const generateInsights = () => {
    const insights = [];
    const consistencyScore = data.weeklyTrends.consistency;
    const improvementRate = data.weeklyTrends.improvement;
    
    // 一致性分析
    if (consistencyScore >= 80) {
      insights.push({
        type: 'positive',
        title: '写作习惯优秀',
        description: `您的写作一致性达到${consistencyScore.toFixed(1)}%，保持了良好的写作习惯。`,
        icon: '🎯'
      });
    } else if (consistencyScore >= 60) {
      insights.push({
        type: 'neutral',
        title: '写作习惯良好',
        description: `您的写作一致性为${consistencyScore.toFixed(1)}%，可以进一步提升规律性。`,
        icon: '📈'
      });
    } else {
      insights.push({
        type: 'negative',
        title: '写作习惯需改进',
        description: `您的写作一致性仅为${consistencyScore.toFixed(1)}%，建议制定固定的写作时间表。`,
        icon: '⚠️'
      });
    }
    
    // 改进趋势分析
    if (improvementRate > 10) {
      insights.push({
        type: 'positive',
        title: '进步显著',
        description: `您的写作效率提升了${improvementRate.toFixed(1)}%，继续保持这个势头！`,
        icon: '🚀'
      });
    } else if (improvementRate > 0) {
      insights.push({
        type: 'neutral',
        title: '稳步改进',
        description: `您的写作效率提升了${improvementRate.toFixed(1)}%，稳步前进。`,
        icon: '📊'
      });
    } else {
      insights.push({
        type: 'negative',
        title: '需要调整策略',
        description: `您的写作效率下降了${Math.abs(improvementRate).toFixed(1)}%，建议调整写作方法。`,
        icon: '🔄'
      });
    }
    
    // 趋势模式分析
    const recentWeek = data.dailyProgress.slice(-7);
    const weekdayWords = recentWeek.slice(0, 5).reduce((sum, day) => sum + day.words, 0) / 5;
    const weekendWords = recentWeek.slice(5, 7).reduce((sum, day) => sum + day.words, 0) / 2;
    
    if (weekdayWords > weekendWords * 1.2) {
      insights.push({
        type: 'neutral',
        title: '工作日写作模式',
        description: '您在工作日的写作效率更高，周末可以适当增加写作时间。',
        icon: '📅'
      });
    } else if (weekendWords > weekdayWords * 1.2) {
      insights.push({
        type: 'neutral',
        title: '周末写作模式',
        description: '您在周末的写作效率更高，这是很好的习惯！',
        icon: '🏖️'
      });
    }
    
    return insights;
  };

  const insights = generateInsights();

  const getMaxValue = (metric: 'words' | 'quality' | 'time'): number => {
    return Math.max(...data.dailyProgress.map(day => {
      if (metric === 'time') return day.timeSpent;
      return day[metric];
    }));
  };

  const getChangeColor = (change: number): string => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number): string => {
    if (change > 0) return '↗️';
    if (change < 0) return '↘️';
    return '➡️';
  };

  const formatChange = (change: number): string => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">写作趋势分析</h3>
          <p className="text-gray-600 text-sm">
            {getTimeRangeLabel(timeRange)}的写作表现趋势
          </p>
        </div>
        
        {detailed && (
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            {showInsights ? '隐藏洞察' : '显示洞察'}
          </button>
        )}
      </div>

      {/* 趋势指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {trends.map((trend, index) => (
          <div
            key={trend.label}
            className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
              selectedMetric === ['words', 'quality', 'time'][index]
                ? `border-${trend.color}-200 bg-${trend.color}-50`
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => setSelectedMetric(['words', 'quality', 'time'][index] as any)}
            style={{ cursor: 'pointer' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-lg mr-2">{trend.icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {trend.label}
                </span>
              </div>
              <span className={`text-xs font-medium ${getChangeColor(trend.change)}`}>
                {getChangeIcon(trend.change)} {formatChange(trend.change)}
              </span>
            </div>
            
            <div className="flex items-baseline">
              <span className={`text-2xl font-bold text-${trend.color}-600`}>
                {trend.value}
              </span>
              <span className="text-gray-500 text-sm ml-1">
                {trend.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 趋势图表 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">
            {selectedMetric === 'words' && '每日字数趋势'}
            {selectedMetric === 'quality' && '质量评分趋势'}
            {selectedMetric === 'time' && '写作时长趋势'}
          </h4>
          
          <div className="flex space-x-2">
            {(['words', 'quality', 'time'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedMetric === metric
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {metric === 'words' && '字数'}
                {metric === 'quality' && '质量'}
                {metric === 'time' && '时长'}
              </button>
            ))}
          </div>
        </div>

        {/* 简化的趋势图表 */}
        <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-end space-x-1">
          {data.dailyProgress.map((day, index) => {
            const value = selectedMetric === 'time' ? day.timeSpent : day[selectedMetric];
            const maxValue = getMaxValue(selectedMetric);
            const height = (value / maxValue) * 100;
            
            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center group"
              >
                <div
                  className={`w-full rounded-t transition-all duration-500 ${
                    selectedMetric === 'words' ? 'bg-blue-500 hover:bg-blue-600' :
                    selectedMetric === 'quality' ? 'bg-yellow-500 hover:bg-yellow-600' :
                    'bg-green-500 hover:bg-green-600'
                  }`}
                  style={{ 
                    height: `${height}%`,
                    transitionDelay: `${index * 50}ms`
                  }}
                />
                
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bg-gray-900 text-white text-xs rounded py-1 px-2 -mt-8 pointer-events-none">
                  {value}
                  {selectedMetric === 'words' && '字'}
                  {selectedMetric === 'quality' && '分'}
                  {selectedMetric === 'time' && '分钟'}
                  <div className="text-center text-gray-300 text-xs">
                    {new Date(day.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 日期标签 */}
        <div className="flex justify-around mt-2 text-xs text-gray-500">
          {data.dailyProgress.filter((_, index) => index % Math.ceil(data.dailyProgress.length / 7) === 0).map((day) => (
            <span key={day.date}>
              {new Date(day.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
            </span>
          ))}
        </div>
      </div>

      {/* 周趋势摘要 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">📊</span>
            <span className="text-blue-600 text-sm font-medium">日均产出</span>
          </div>
          <div className="text-blue-900 text-xl font-semibold">
            {data.weeklyTrends.averageDaily} 字
          </div>
          <div className="text-blue-700 text-xs mt-1">
            基于最近一周数据
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">📈</span>
            <span className="text-green-600 text-sm font-medium">改进幅度</span>
          </div>
          <div className={`text-xl font-semibold ${getChangeColor(data.weeklyTrends.improvement)}`}>
            {formatChange(data.weeklyTrends.improvement)}
          </div>
          <div className="text-green-700 text-xs mt-1">
            相比上周表现
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">🎯</span>
            <span className="text-purple-600 text-sm font-medium">一致性</span>
          </div>
          <div className="text-purple-900 text-xl font-semibold">
            {data.weeklyTrends.consistency.toFixed(1)}%
          </div>
          <div className="text-purple-700 text-xs mt-1">
            写作规律性评分
          </div>
        </div>
      </div>

      {/* 智能洞察 */}
      {detailed && showInsights && (
        <div className="border-t pt-6 animate-slide-in-down">
          <h4 className="font-medium text-gray-900 mb-4">智能洞察</h4>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'positive' ? 'border-green-400 bg-green-50' :
                  insight.type === 'negative' ? 'border-red-400 bg-red-50' :
                  'border-blue-400 bg-blue-50'
                }`}
              >
                <div className="flex items-start">
                  <span className="text-lg mr-3 mt-0.5">{insight.icon}</span>
                  <div>
                    <h5 className={`font-medium ${
                      insight.type === 'positive' ? 'text-green-900' :
                      insight.type === 'negative' ? 'text-red-900' :
                      'text-blue-900'
                    }`}>
                      {insight.title}
                    </h5>
                    <p className={`text-sm mt-1 ${
                      insight.type === 'positive' ? 'text-green-700' :
                      insight.type === 'negative' ? 'text-red-700' :
                      'text-blue-700'
                    }`}>
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 操作建议 */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-200">
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">💡</span>
          <span className="font-medium text-primary-900">基于趋势的建议</span>
        </div>
        <div className="text-primary-700 text-sm space-y-1">
          {data.weeklyTrends.improvement < 0 && (
            <p>• 考虑调整写作时间安排，选择您效率最高的时段</p>
          )}
          {data.weeklyTrends.consistency < 70 && (
            <p>• 建议设定固定的写作时间，培养规律的写作习惯</p>
          )}
          {(trends.find(t => t.label === '日均字数')?.change || 0) > 20 && (
            <p>• 您的写作效率在提升，可以考虑适当提高目标</p>
          )}
          <p>• 继续关注趋势变化，及时调整写作策略</p>
        </div>
      </div>
    </Card>
  );
};

export default TrendAnalysis;