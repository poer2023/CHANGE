import React, { useState } from 'react';
import { QuickAction } from '../../types';
import { Button } from '../UI/Button';
import glmClient from '../../services/glmClient';

interface QuickActionBarProps {
  actions: QuickAction[];
  onActionClick: (action: QuickAction) => void;
  isLoading?: boolean;
  className?: string;
  selectedText?: string;
  documentContext?: string;
  enableStreamingResults?: boolean;
}

const QuickActionBar: React.FC<QuickActionBarProps> = ({
  actions,
  onActionClick,
  isLoading = false,
  className = '',
  selectedText = '',
  documentContext = '',
  enableStreamingResults = true
}) => {
  const [executingAction, setExecutingAction] = useState<string | null>(null);
  const [actionResults, setActionResults] = useState<Record<string, string>>({});
  const [collapsedResults, setCollapsedResults] = useState<Set<string>>(new Set());
  const [showAllActions, setShowAllActions] = useState(false);

  // 执行真实的快捷操作
  const handleActionClick = async (action: QuickAction) => {
    if (executingAction || isLoading) return;

    setExecutingAction(action.id);

    try {
      if (enableStreamingResults) {
        // 流式执行
        let result = '';
        setActionResults(prev => ({ ...prev, [action.id]: '' }));

        for await (const chunk of glmClient.executeQuickActionStream(
          action,
          documentContext,
          selectedText
        )) {
          result += chunk;
          setActionResults(prev => ({ ...prev, [action.id]: result }));
        }
      } else {
        // 普通执行
        const result = await glmClient.executeQuickAction(
          action,
          documentContext,
          selectedText
        );
        setActionResults(prev => ({ ...prev, [action.id]: result }));
      }

      // 调用原有的点击处理器
      onActionClick(action);

    } catch (error) {
      console.error(`执行快捷操作失败: ${action.label}`, error);
      setActionResults(prev => ({ 
        ...prev, 
        [action.id]: `执行失败: ${error instanceof Error ? error.message : '未知错误'}` 
      }));
    } finally {
      setExecutingAction(null);
    }
  };

  // 清除操作结果
  const clearActionResult = (actionId: string) => {
    setActionResults(prev => {
      const newResults = { ...prev };
      delete newResults[actionId];
      return newResults;
    });
  };

  // 切换结果折叠状态
  const toggleResultCollapse = (actionId: string) => {
    const newCollapsed = new Set(collapsedResults);
    if (newCollapsed.has(actionId)) {
      newCollapsed.delete(actionId);
    } else {
      newCollapsed.add(actionId);
    }
    setCollapsedResults(newCollapsed);
  };

  // 获取显示的操作列表
  const visibleActions = showAllActions ? actions : actions.slice(0, 6);
  const hasMoreActions = actions.length > 6;

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
      <div className={`text-center py-6 ${className}`}>
        <div className="text-gray-400 text-4xl mb-2">🛠️</div>
        <p className="text-sm text-gray-500">暂无可用操作</p>
        <p className="text-xs text-gray-400 mt-1">输入内容或选中文本后将显示智能建议</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
          <span>⚡</span>
          <span>快捷操作</span>
          {executingAction && (
            <div className="flex items-center space-x-1 text-blue-600">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              <span className="text-xs">执行中</span>
            </div>
          )}
        </h4>
        
        {hasMoreActions && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAllActions(!showAllActions)}
            className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            {showAllActions ? '收起' : `查看全部 ${actions.length} 个`}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {visibleActions.map((action, index) => {
          const isExecuting = executingAction === action.id;
          const hasResult = actionResults[action.id];
          
          return (
            <div key={action.id} className="relative group">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleActionClick(action)}
                disabled={isLoading || !!executingAction}
                className={`
                  flex flex-col items-center p-4 h-auto text-center transition-all duration-300 w-full relative
                  ${getCategoryColor(action.category)}
                  ${isLoading || executingAction ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'}
                  ${hasResult ? 'ring-2 ring-green-300 shadow-md' : ''}
                  ${isExecuting ? 'animate-pulse' : ''}
                `}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="text-xl mb-2 transition-transform duration-200 group-hover:scale-110">
                  {isExecuting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                  ) : (
                    action.icon || getCategoryIcon(action.category)
                  )}
                </div>
                
                <div className="text-xs font-medium leading-tight mb-1">
                  {isExecuting ? '执行中...' : action.label}
                </div>
                
                <div className="text-xs opacity-75 leading-tight text-center">
                  {isExecuting ? '请稍候' : (
                    action.description.length > 24
                      ? `${action.description.substring(0, 24)}...`
                      : action.description
                  )}
                </div>
                
                {/* 成功指示器 */}
                {hasResult && !isExecuting && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg animate-bounce">
                    ✓
                  </div>
                )}
                
                {/* 加载指示器 */}
                {isExecuting && (
                  <div className="absolute inset-0 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                  </div>
                )}
              </Button>
            </div>
          );
        })}
      </div>

      {/* 操作结果显示 */}
      {Object.entries(actionResults).length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <h5 className="text-sm font-medium text-gray-700">📊 执行结果</h5>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          
          {Object.entries(actionResults).map(([actionId, result]) => {
            if (!result) return null;
            
            const action = actions.find(a => a.id === actionId);
            if (!action) return null;
            
            const isCollapsed = collapsedResults.has(actionId);
            const isCurrentlyExecuting = executingAction === actionId;

            return (
              <div key={actionId} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        getCategoryColor(action.category).replace('100', '200').replace('800', '700')
                      }`}>
                        <span className="text-lg">{action.icon || getCategoryIcon(action.category)}</span>
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-gray-900">{action.label}</h6>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleResultCollapse(actionId)}
                        className="p-1 h-auto text-xs hover:bg-gray-100"
                        title={isCollapsed ? "展开" : "收起"}
                      >
                        <span className={`transition-transform duration-200 ${
                          isCollapsed ? '' : 'rotate-180'
                        }`}>
                          ▼
                        </span>
                      </Button>
                      <Button
                        onClick={() => clearActionResult(actionId)}
                        size="sm"
                        variant="ghost"
                        className="p-1 h-auto text-xs hover:bg-red-50 hover:text-red-600"
                        title="关闭结果"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                  
                  {!isCollapsed && (
                    <div className="space-y-3">
                      <div className={`text-sm text-gray-700 bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto ${
                        isCurrentlyExecuting ? 'animate-pulse' : ''
                      }`}>
                        {isCurrentlyExecuting ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>正在分析中...</span>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap leading-relaxed">{result}</div>
                        )}
                      </div>
                      
                      {result && !isCurrentlyExecuting && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs hover:bg-blue-50 hover:border-blue-300"
                            onClick={() => {
                              console.log('应用建议:', result);
                            }}
                          >
                            ✏️ 应用建议
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs hover:bg-green-50 hover:border-green-300"
                            onClick={() => {
                              navigator.clipboard.writeText(result);
                            }}
                          >
                            📋 复制结果
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs hover:bg-purple-50 hover:border-purple-300"
                            onClick={() => {
                              console.log('分享结果:', result);
                            }}
                          >
                            🔗 分享
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 加载状态指示器 */}
      {(isLoading || executingAction) && (
        <div className="flex items-center justify-center space-x-2 py-2">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
          <span className="text-xs text-gray-600">
            {executingAction ? '正在执行操作...' : '处理中...'}
          </span>
        </div>
      )}

      {/* 选中文本提示 */}
      {selectedText && (
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-sm">📝</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-yellow-800 mb-1">已选中文本：</p>
              <p className="text-sm text-yellow-700 bg-white bg-opacity-50 rounded-lg p-2 line-clamp-2">
                {selectedText}
              </p>
              <p className="text-xs text-yellow-600 mt-2 flex items-center space-x-1">
                <span>⚡</span>
                <span>AI 将基于此文本提供更精准的分析建议</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 操作提示 */}
      {!selectedText && actions.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">💡</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">🎆 使用提示：</p>
              <ul className="space-y-1 text-xs">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  <span>点击上方按钮可快速执行常用操作</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  <span>选中文本可获得更精准的分析</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  <span>AI 会根据当前内容提供针对性建议</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionBar;