import React, { useState } from 'react';
import { AgentSuggestion, AgentAction } from '../../types';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';

interface AgentSuggestionCardProps {
  suggestion: AgentSuggestion;
  onActionClick?: (action: AgentAction) => void;
  onDismiss?: (suggestionId: string) => void;
  className?: string;
}

const AgentSuggestionCard: React.FC<AgentSuggestionCardProps> = ({
  suggestion,
  onActionClick,
  onDismiss,
  className = ''
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'helpful' | 'not-helpful' | null>(null);

  if (isDismissed) {
    return null;
  }

  // 获取建议类型的样式和图标
  const getSuggestionStyle = () => {
    switch (suggestion.type) {
      case 'improvement':
        return {
          borderColor: 'border-blue-200',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-900',
          icon: '💡',
          label: '改进建议'
        };
      case 'correction':
        return {
          borderColor: 'border-red-200',
          bgColor: 'bg-red-50',
          textColor: 'text-red-900',
          icon: '❌',
          label: '需要修正'
        };
      case 'enhancement':
        return {
          borderColor: 'border-green-200',
          bgColor: 'bg-green-50',
          textColor: 'text-green-900',
          icon: '✨',
          label: '优化建议'
        };
      case 'warning':
        return {
          borderColor: 'border-yellow-200',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-900',
          icon: '⚠️',
          label: '注意事项'
        };
      default:
        return {
          borderColor: 'border-gray-200',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-900',
          icon: '📝',
          label: '建议'
        };
    }
  };

  const style = getSuggestionStyle();

  // 获取信心度颜色
  const getConfidenceColor = () => {
    if (suggestion.confidence >= 0.8) return 'text-green-600';
    if (suggestion.confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // 处理忽略建议
  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.(suggestion.id);
  };

  // 处理操作点击
  const handleActionClick = async () => {
    if (suggestion.action && !isActionLoading) {
      setIsActionLoading(true);
      try {
        await onActionClick?.(suggestion.action);
        // 模拟延迟，给用户反馈
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('执行操作失败:', error);
      } finally {
        setIsActionLoading(false);
      }
    }
  };
  
  // 处理反馈
  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedbackGiven(type);
    console.log(`用户反馈建议 ${suggestion.id} 为:`, type);
  };

  return (
    <Card className={`
      border transition-all duration-300 hover:shadow-md group relative overflow-hidden
      ${style.borderColor} ${style.bgColor} ${className}
      ${isExpanded ? 'shadow-lg' : 'shadow-sm'}
    `}>
      <div className="p-3">
        {/* 建议头部 */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{style.icon}</span>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-medium px-2 py-1 rounded ${style.bgColor} ${style.textColor}`}>
                  {style.label}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">置信度:</span>
                  <span className={`text-xs font-medium ${getConfidenceColor()}`}>
                    {Math.round(suggestion.confidence * 100)}%
                  </span>
                </div>
              </div>
              <h4 className={`text-sm font-medium mt-1 ${style.textColor}`}>
                {suggestion.title}
              </h4>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 h-auto text-xs hover:bg-white hover:bg-opacity-70 transition-all duration-200"
              title={isExpanded ? "收起" : "展开"}
            >
              <span className={`transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}>
                ▼
              </span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="p-1 h-auto text-xs hover:bg-red-100 hover:text-red-600 transition-all duration-200"
              title="忽略建议"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* 建议内容 */}
        <div className={`${style.textColor} transition-all duration-300`}>
          <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
            isExpanded ? '' : 'line-clamp-2'
          }`}>
            {suggestion.content}
          </div>
          
          {/* 显示更多按钮 */}
          {suggestion.content.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`mt-2 text-xs underline transition-colors duration-200 ${
                style.textColor.includes('blue') ? 'hover:text-blue-800' :
                style.textColor.includes('green') ? 'hover:text-green-800' :
                style.textColor.includes('red') ? 'hover:text-red-800' :
                'hover:text-gray-800'
              }`}
            >
              {isExpanded ? '收起' : '查看更多'}
            </button>
          )}
        </div>

        {/* 操作按钮 */}
        {suggestion.action && (
          <div className="mt-3 pt-3 border-t border-gray-200 border-opacity-50">
            <Button
              size="sm"
              onClick={handleActionClick}
              disabled={isActionLoading}
              className={`
                w-full text-sm transition-all duration-200 relative overflow-hidden
                ${style.textColor.includes('blue') ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400' : ''}
                ${style.textColor.includes('green') ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400' : ''}
                ${style.textColor.includes('red') ? 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400' : ''}
                ${style.textColor.includes('yellow') ? 'bg-yellow-600 hover:bg-yellow-700 text-white disabled:bg-yellow-400' : ''}
                ${isActionLoading ? 'cursor-not-allowed' : 'hover:shadow-md'}
              `}
            >
              {isActionLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>执行中...</span>
                </div>
              ) : (
                <>
                  <span className="mr-2">{suggestion.action.icon}</span>
                  {suggestion.action.label}
                </>
              )}
              
              {/* 按钮波纹动画 */}
              {!isActionLoading && (
                <span className="absolute inset-0 bg-white bg-opacity-20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              )}
            </Button>
          </div>
        )}

        {/* 展开状态下的额外信息 */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200 border-opacity-50">
            <div className="space-y-2">
              {/* 建议详情 */}
              <div className="text-xs text-gray-600">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">建议类型:</span> {style.label}
                  </div>
                  <div>
                    <span className="font-medium">置信度:</span> 
                    <span className={getConfidenceColor()}>
                      {Math.round(suggestion.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 快捷操作 */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(suggestion.content);
                  }}
                >
                  📋 复制
                </Button>
                <Button
                  size="sm"
                  variant={feedbackGiven === 'helpful' ? 'default' : 'outline'}
                  className={`flex-1 text-xs transition-colors ${
                    feedbackGiven === 'helpful' 
                      ? 'bg-green-100 border-green-300 text-green-700' 
                      : 'hover:bg-green-50 hover:border-green-300'
                  }`}
                  onClick={() => handleFeedback('helpful')}
                  disabled={feedbackGiven !== null}
                >
                  👍 {feedbackGiven === 'helpful' ? '已有用' : '有用'}
                </Button>
                <Button
                  size="sm"
                  variant={feedbackGiven === 'not-helpful' ? 'default' : 'outline'}
                  className={`flex-1 text-xs transition-colors ${
                    feedbackGiven === 'not-helpful' 
                      ? 'bg-red-100 border-red-300 text-red-700' 
                      : 'hover:bg-red-50 hover:border-red-300'
                  }`}
                  onClick={() => handleFeedback('not-helpful')}
                  disabled={feedbackGiven !== null}
                >
                  👎 {feedbackGiven === 'not-helpful' ? '已反馈' : '无用'}
                </Button>
              </div>
              
              {/* 反馈感谢 */}
              {feedbackGiven && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700 text-center animate-fade-in">
                  🙏 感谢您的反馈！这将帮助我们改进 AI 建议质量。
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AgentSuggestionCard;