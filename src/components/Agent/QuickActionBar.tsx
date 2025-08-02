import React from 'react';
import { QuickAction } from '../../types';
import { Button } from '../UI/Button';

interface QuickActionBarProps {
  actions: QuickAction[];
  onActionClick: (action: QuickAction) => void;
  isLoading?: boolean;
  className?: string;
}

const QuickActionBar: React.FC<QuickActionBarProps> = ({
  actions,
  onActionClick,
  isLoading = false,
  className = ''
}) => {
  const getCategoryColor = (category: QuickAction['category']) => {
    const colors = {
      search: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      optimize: 'bg-green-100 text-green-800 hover:bg-green-200',
      check: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      enhance: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      analyze: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
      generate: 'bg-pink-100 text-pink-800 hover:bg-pink-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  const getCategoryIcon = (category: QuickAction['category']) => {
    const icons = {
      search: '🔍',
      optimize: '⚡',
      check: '✅',
      enhance: '✨',
      analyze: '📊',
      generate: '🎯'
    };
    return icons[category] || '🔧';
  };

  if (actions.length === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-xs text-gray-500">暂无可用操作</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700">快捷操作</h4>
      
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            size="sm"
            onClick={() => onActionClick(action)}
            disabled={isLoading}
            className={`
              flex flex-col items-center p-3 h-auto text-center transition-all duration-200
              ${getCategoryColor(action.category)}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
            `}
          >
            <div className="text-lg mb-1">
              {action.icon || getCategoryIcon(action.category)}
            </div>
            <div className="text-xs font-medium leading-tight">
              {action.label}
            </div>
            <div className="text-xs opacity-75 mt-1 leading-tight">
              {action.description.length > 20 
                ? `${action.description.substring(0, 20)}...`
                : action.description
              }
            </div>
          </Button>
        ))}
      </div>

      {/* 加载状态指示器 */}
      {isLoading && (
        <div className="flex items-center justify-center space-x-2 py-2">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
          <span className="text-xs text-gray-600">处理中...</span>
        </div>
      )}

      {/* 操作提示 */}
      <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
        <div className="flex items-start space-x-2">
          <span className="text-blue-600 text-sm">💡</span>
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">使用提示：</p>
            <p>点击上方按钮可快速执行常用操作，AI会根据当前内容提供针对性建议。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionBar;