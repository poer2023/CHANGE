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
  const handleActionClick = () => {
    if (suggestion.action) {
      onActionClick?.(suggestion.action);
    }
  };

  return (
    <Card className={`
      border transition-all duration-200 hover:shadow-sm
      ${style.borderColor} ${style.bgColor} ${className}
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
              className="p-1 h-auto text-xs hover:bg-gray-200"
              title={isExpanded ? "收起" : "展开"}
            >
              {isExpanded ? '▲' : '▼'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="p-1 h-auto text-xs hover:bg-gray-200"
              title="忽略建议"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* 建议内容 */}
        <div className={`${style.textColor} ${isExpanded ? '' : 'line-clamp-2'}`}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {suggestion.content}
          </div>
        </div>

        {/* 操作按钮 */}
        {suggestion.action && (
          <div className="mt-3 pt-3 border-t border-gray-200 border-opacity-50">
            <Button
              size="sm"
              onClick={handleActionClick}
              className={`
                w-full text-sm transition-colors
                ${style.textColor.includes('blue') ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                ${style.textColor.includes('green') ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                ${style.textColor.includes('red') ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                ${style.textColor.includes('yellow') ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : ''}
              `}
            >
              <span className="mr-2">{suggestion.action.icon}</span>
              {suggestion.action.label}
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
                  className="flex-1 text-xs"
                  onClick={() => {
                    // 复制建议内容
                    navigator.clipboard.writeText(suggestion.content);
                  }}
                >
                  📋 复制
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => {
                    // 标记为有用
                    console.log('标记建议为有用:', suggestion.id);
                  }}
                >
                  👍 有用
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => {
                    // 请求更详细的解释
                    console.log('请求详细解释:', suggestion.id);
                  }}
                >
                  📖 详细
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AgentSuggestionCard;