import React, { useState } from 'react';
import { ActionableInsight } from '../../services/content-analyzer';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { ProgressBar } from '../UI/Progress';
import { cn } from '../../utils/cn';
import { 
  AlertCircle, 
  CheckCircle, 
  Lightbulb, 
  TrendingUp, 
  ChevronRight, 
  ChevronDown,
  Target,
  Zap,
  ArrowRight,
  Clock,
  Star,
  BookOpen,
  Wand2
} from 'lucide-react';

interface SuggestionCardProps {
  insight: ActionableInsight;
  onClick?: (insight: ActionableInsight) => void;
  onApply?: (insight: ActionableInsight) => void;
  onDismiss?: (insight: ActionableInsight) => void;
  showActions?: boolean;
  showProgress?: boolean;
  expanded?: boolean;
  className?: string;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  insight,
  onClick,
  onApply,
  onDismiss,
  showActions = true,
  showProgress = true,
  expanded = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isApplying, setIsApplying] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // 根据优先级获取配置
  const getPriorityConfig = (priority: ActionableInsight['priority']) => {
    switch (priority) {
      case 'high':
        return {
          color: 'red',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          icon: AlertCircle,
          label: '高优先级',
          urgency: '建议立即处理'
        };
      case 'medium':
        return {
          color: 'yellow',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          icon: TrendingUp,
          label: '中优先级',
          urgency: '建议及时处理'
        };
      case 'low':
        return {
          color: 'blue',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          icon: Lightbulb,
          label: '低优先级',
          urgency: '可以稍后处理'
        };
      default:
        return {
          color: 'gray',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          icon: CheckCircle,
          label: '一般',
          urgency: '按需处理'
        };
    }
  };

  // 根据类别获取配置
  const getCategoryConfig = (category: ActionableInsight['category']) => {
    switch (category) {
      case 'correction':
        return {
          icon: Target,
          label: '错误修正',
          color: 'red',
          description: '需要修正的问题'
        };
      case 'improvement':
        return {
          icon: TrendingUp,
          label: '质量提升',
          color: 'blue',
          description: '可以改进的方面'
        };
      case 'enhancement':
        return {
          icon: Star,
          label: '功能增强',
          color: 'purple',
          description: '可以增强的特性'
        };
      default:
        return {
          icon: Lightbulb,
          label: '一般建议',
          color: 'gray',
          description: '通用建议'
        };
    }
  };

  const priorityConfig = getPriorityConfig(insight.priority);
  const categoryConfig = getCategoryConfig(insight.category);
  const PriorityIcon = priorityConfig.icon;
  const CategoryIcon = categoryConfig.icon;

  // 处理应用建议
  const handleApply = async () => {
    if (isApplying) return;
    
    setIsApplying(true);
    try {
      await onApply?.(insight);
      // 模拟应用过程
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
    } finally {
      setIsApplying(false);
    }
  };

  // 处理忽略建议
  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.(insight);
  };

  // 处理点击
  const handleClick = () => {
    if (onClick) {
      onClick(insight);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  // 获取影响级别的显示
  const getImpactDisplay = (impact: number) => {
    if (impact >= 80) return { label: '高影响', color: 'green' };
    if (impact >= 60) return { label: '中影响', color: 'yellow' };
    if (impact >= 40) return { label: '低影响', color: 'blue' };
    return { label: '微影响', color: 'gray' };
  };

  const impactDisplay = getImpactDisplay(insight.estimatedImpact);

  if (isDismissed) {
    return null;
  }

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        priorityConfig.borderColor,
        'border-l-4',
        className
      )}
    >
      <div className="p-4">
        {/* 头部信息 */}
        <div 
          className="flex items-start justify-between cursor-pointer"
          onClick={handleClick}
        >
          <div className="flex items-start space-x-3 flex-1">
            {/* 优先级图标 */}
            <div className={cn('p-2 rounded-lg', priorityConfig.bgColor)}>
              <PriorityIcon className={cn('w-4 h-4', priorityConfig.iconColor)} />
            </div>

            {/* 主要内容 */}
            <div className="flex-1 min-w-0">
              {/* 标题和标签 */}
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {insight.title}
                </h4>
                
                {/* 优先级标签 */}
                <span className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  priorityConfig.bgColor,
                  priorityConfig.textColor
                )}>
                  {priorityConfig.label}
                </span>

                {/* 类别标签 */}
                <span className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  `bg-${categoryConfig.color}-100 text-${categoryConfig.color}-800`
                )}>
                  <CategoryIcon className="w-3 h-3 mr-1" />
                  {categoryConfig.label}
                </span>
              </div>

              {/* 描述 */}
              <p className="text-sm text-gray-600 mb-2">
                {insight.description}
              </p>

              {/* 预期影响 */}
              {showProgress && (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs text-gray-500">预期影响:</span>
                  <div className="flex-1 max-w-24">
                    <ProgressBar 
                      value={insight.estimatedImpact} 
                      className="h-1" 
                    />
                  </div>
                  <span className={cn(
                    'text-xs font-medium',
                    `text-${impactDisplay.color}-600`
                  )}>
                    {impactDisplay.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 展开/收起图标 */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* 展开内容 */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {/* 详细说明 */}
            <div className={cn('p-3 rounded-lg', priorityConfig.bgColor)}>
              <h5 className="text-xs font-semibold text-gray-700 mb-2">
                具体建议：
              </h5>
              <p className="text-sm text-gray-700">
                {insight.action}
              </p>
            </div>

            {/* 影响分析 */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">处理紧急度:</span>
                <p className="font-medium">{priorityConfig.urgency}</p>
              </div>
              <div>
                <span className="text-gray-500">改进效果:</span>
                <p className="font-medium">{insight.estimatedImpact}% 提升</p>
              </div>
            </div>

            {/* 操作按钮 */}
            {showActions && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={handleApply}
                    disabled={isApplying}
                    className="flex items-center space-x-1"
                  >
                    {isApplying ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                        <span>应用中...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3 h-3" />
                        <span>应用建议</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="flex items-center space-x-1 text-gray-600"
                  >
                    <span>忽略</span>
                  </Button>
                </div>

                {/* 了解更多 */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-blue-600"
                  onClick={() => onClick?.(insight)}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>了解更多</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 简化视图的快速操作 */}
        {!isExpanded && showActions && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleApply}
                disabled={isApplying}
                className="text-xs flex items-center space-x-1"
              >
                <Zap className="w-3 h-3" />
                <span>快速应用</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>预计影响 +{insight.estimatedImpact}%</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// 建议列表组件
interface SuggestionListProps {
  insights: ActionableInsight[];
  onInsightClick?: (insight: ActionableInsight) => void;
  onApplyInsight?: (insight: ActionableInsight) => void;
  onDismissInsight?: (insight: ActionableInsight) => void;
  groupByPriority?: boolean;
  maxVisible?: number;
  className?: string;
}

export const SuggestionList: React.FC<SuggestionListProps> = ({
  insights,
  onInsightClick,
  onApplyInsight,
  onDismissInsight,
  groupByPriority = true,
  maxVisible,
  className = ''
}) => {
  const [showAll, setShowAll] = useState(false);

  const visibleInsights = maxVisible && !showAll 
    ? insights.slice(0, maxVisible) 
    : insights;

  if (groupByPriority) {
    const groupedInsights = {
      high: insights.filter(insight => insight.priority === 'high'),
      medium: insights.filter(insight => insight.priority === 'medium'),
      low: insights.filter(insight => insight.priority === 'low')
    };

    return (
      <div className={cn('space-y-6', className)}>
        {groupedInsights.high.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-red-800 mb-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              高优先级建议 ({groupedInsights.high.length})
            </h3>
            <div className="space-y-3">
              {groupedInsights.high.map((insight, index) => (
                <SuggestionCard
                  key={`high-${index}`}
                  insight={insight}
                  onClick={onInsightClick}
                  onApply={onApplyInsight}
                  onDismiss={onDismissInsight}
                />
              ))}
            </div>
          </div>
        )}

        {groupedInsights.medium.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-yellow-800 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              中优先级建议 ({groupedInsights.medium.length})
            </h3>
            <div className="space-y-3">
              {groupedInsights.medium.map((insight, index) => (
                <SuggestionCard
                  key={`medium-${index}`}
                  insight={insight}
                  onClick={onInsightClick}
                  onApply={onApplyInsight}
                  onDismiss={onDismissInsight}
                />
              ))}
            </div>
          </div>
        )}

        {groupedInsights.low.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 mr-1" />
              低优先级建议 ({groupedInsights.low.length})
            </h3>
            <div className="space-y-3">
              {groupedInsights.low.map((insight, index) => (
                <SuggestionCard
                  key={`low-${index}`}
                  insight={insight}
                  onClick={onInsightClick}
                  onApply={onApplyInsight}
                  onDismiss={onDismissInsight}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {visibleInsights.map((insight, index) => (
        <SuggestionCard
          key={index}
          insight={insight}
          onClick={onInsightClick}
          onApply={onApplyInsight}
          onDismiss={onDismissInsight}
        />
      ))}
      
      {maxVisible && insights.length > maxVisible && (
        <div className="text-center pt-4">
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600"
          >
            {showAll ? '收起' : `查看全部 ${insights.length} 条建议`}
            <ChevronDown className={cn('w-4 h-4 ml-1 transition-transform', showAll ? 'rotate-180' : '')} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SuggestionCard;