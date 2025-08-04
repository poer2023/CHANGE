import React, { useState, useEffect } from 'react';
import { WritingSuggestion } from '../../services/ai-writing-assistant';

// 建议操作类型
export type SuggestionAction = 'accept' | 'reject' | 'modify' | 'later';

// 建议操作结果
export interface SuggestionActionResult {
  suggestionId: string;
  action: SuggestionAction;
  modifiedContent?: string;
  reason?: string;
  timestamp: Date;
}

// 组件属性
interface SuggestionActionPanelProps {
  suggestion: WritingSuggestion;
  onAction: (result: SuggestionActionResult) => void;
  onClose: () => void;
  showRejectReason?: boolean;
  showModifyOption?: boolean;
  position?: { x: number; y: number };
  className?: string;
}

// 快速拒绝原因选项
const QUICK_REJECT_REASONS = [
  '不符合写作风格',
  '内容不够准确',
  '逻辑不够清晰',
  '过于复杂',
  '过于简单',
  '偏离主题',
  '其他原因'
];

/**
 * 建议操作面板 - 提供接受/拒绝/修改建议的界面
 */
const SuggestionActionPanel: React.FC<SuggestionActionPanelProps> = ({
  suggestion,
  onAction,
  onClose,
  showRejectReason = true,
  showModifyOption = true,
  position,
  className = ''
}) => {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [modifiedContent, setModifiedContent] = useState(suggestion.content);
  const [selectedQuickReason, setSelectedQuickReason] = useState('');

  // 处理动作
  const handleAction = (action: SuggestionAction) => {
    const result: SuggestionActionResult = {
      suggestionId: suggestion.id,
      action,
      timestamp: new Date()
    };

    switch (action) {
      case 'accept':
        onAction(result);
        onClose();
        break;
      
      case 'reject':
        if (showRejectReason) {
          setShowRejectDialog(true);
        } else {
          onAction(result);
          onClose();
        }
        break;
      
      case 'modify':
        if (showModifyOption) {
          setShowModifyDialog(true);
        }
        break;
      
      case 'later':
        onAction(result);
        onClose();
        break;
    }
  };

  // 确认拒绝
  const confirmReject = () => {
    const reason = selectedQuickReason || rejectReason || '用户拒绝';
    onAction({
      suggestionId: suggestion.id,
      action: 'reject',
      reason,
      timestamp: new Date()
    });
    onClose();
  };

  // 确认修改
  const confirmModify = () => {
    onAction({
      suggestionId: suggestion.id,
      action: 'modify',
      modifiedContent,
      timestamp: new Date()
    });
    onClose();
  };

  // 获取优先级颜色
  const getPriorityColor = () => {
    switch (suggestion.priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  // 获取模式图标
  const getModeIcon = () => {
    const icons = {
      continue: '✍️',
      polish: '✨',
      expand: '📈',
      summarize: '📋',
      rewrite: '🔄',
      outline: '📝',
      reference: '📚',
      translate: '🌐'
    };
    return icons[suggestion.mode] || '💡';
  };

  const panelStyle = position ? {
    position: 'absolute' as const,
    left: position.x,
    top: position.y,
    zIndex: 1000
  } : {};

  if (showRejectDialog) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">拒绝建议</h3>
          <p className="text-sm text-gray-600 mb-4">请选择拒绝这个建议的原因：</p>
          
          {/* 快速选择原因 */}
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              {QUICK_REJECT_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedQuickReason(reason)}
                  className={`p-2 text-sm border rounded text-left ${
                    selectedQuickReason === reason
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          {/* 自定义原因 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              自定义原因（可选）：
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请详细说明拒绝原因..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowRejectDialog(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={confirmReject}
              disabled={!selectedQuickReason && !rejectReason.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认拒绝
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showModifyDialog) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">修改建议</h3>
          
          {/* 原始建议 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              原始建议：
            </label>
            <div className="p-3 bg-gray-50 border rounded text-sm text-gray-700">
              {suggestion.content}
            </div>
          </div>

          {/* 修改内容 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              修改后的内容：
            </label>
            <textarea
              value={modifiedContent}
              onChange={(e) => setModifiedContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={8}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowModifyDialog(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={confirmModify}
              disabled={!modifiedContent.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认修改
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white border-2 ${getPriorityColor()} rounded-lg shadow-lg p-4 ${className}`}
      style={panelStyle}
    >
      {/* 建议头部 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getModeIcon()}</span>
          <div>
            <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
            <div className="text-xs text-gray-500">
              置信度: {Math.round(suggestion.confidence * 100)}% • 
              影响度: {suggestion.estimatedImpact}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1"
          title="关闭"
        >
          ✕
        </button>
      </div>

      {/* 建议内容 */}
      <div className="mb-4">
        <div className="text-sm text-gray-700 max-h-32 overflow-y-auto">
          {suggestion.content}
        </div>
      </div>

      {/* 建议原因 */}
      {suggestion.reasoning && (
        <div className="mb-4 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <strong>建议原因：</strong> {suggestion.reasoning}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleAction('accept')}
          className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
        >
          ✓ 接受建议
        </button>
        
        <button
          onClick={() => handleAction('reject')}
          className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
        >
          ✗ 拒绝建议
        </button>

        {showModifyOption && (
          <button
            onClick={() => handleAction('modify')}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            ✏️ 修改建议
          </button>
        )}

        <button
          onClick={() => handleAction('later')}
          className="px-4 py-2 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 transition-colors"
        >
          ⏰ 稍后处理
        </button>
      </div>

      {/* 替代方案（如果有） */}
      {suggestion.alternatives && suggestion.alternatives.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-700 mb-2">替代方案：</div>
          <div className="space-y-1">
            {suggestion.alternatives.slice(0, 2).map((alternative, index) => (
              <div 
                key={index}
                className="text-xs text-gray-600 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setModifiedContent(alternative);
                  setShowModifyDialog(true);
                }}
              >
                {alternative.slice(0, 100)}...
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 建议通知组件 - 用于显示轻量级的建议通知
 */
interface SuggestionNotificationProps {
  suggestion: WritingSuggestion;
  onAccept: () => void;
  onReject: () => void;
  autoHideMs?: number;
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
}

export const SuggestionNotification: React.FC<SuggestionNotificationProps> = ({
  suggestion,
  onAccept,
  onReject,
  autoHideMs = 8000,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  // 自动隐藏计时器
  useEffect(() => {
    if (autoHideMs > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (autoHideMs / 100));
          if (newProgress <= 0) {
            setIsVisible(false);
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [autoHideMs]);

  // 获取位置样式
  const getPositionClass = () => {
    switch (position) {
      case 'top-right': return 'top-4 right-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-left': return 'top-4 left-4';
      default: return 'top-4 right-4';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed ${getPositionClass()} z-50 w-80 transform transition-all duration-300`}>
      <div className="bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-4">
        {/* 进度条 */}
        {autoHideMs > 0 && (
          <div className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-100 ease-linear"
               style={{ width: `${progress}%` }} />
        )}

        {/* 通知内容 */}
        <div className="flex items-start space-x-3">
          <div className="text-blue-500 text-lg">💡</div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm">{suggestion.title}</h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{suggestion.content}</p>
            
            {/* 快速操作 */}
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => {
                  onAccept();
                  setIsVisible(false);
                }}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                接受
              </button>
              <button
                onClick={() => {
                  onReject();
                  setIsVisible(false);
                }}
                className="px-3 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500"
              >
                拒绝
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 text-xs"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionActionPanel;