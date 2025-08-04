import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  AIWritingAssistant, 
  WritingAssistantMode, 
  WritingSuggestion,
  WritingSession 
} from '../../services/ai-writing-assistant';
import { RealTimeWritingCollaborator, WritingEvent } from '../../services/real-time-collaborator';
import { Paper } from '../../types';

// 组件属性
interface AIWritingAssistantPanelProps {
  paper: Paper;
  assistant: AIWritingAssistant;
  collaborator: RealTimeWritingCollaborator;
  onSuggestionApply: (suggestion: WritingSuggestion) => void;
  onTextChange?: (text: string) => void;
  className?: string;
}

// 建议卡片组件属性
interface SuggestionCardProps {
  suggestion: WritingSuggestion;
  onApply: () => void;
  onReject: () => void;
  onShowAlternatives?: () => void;
  isLoading?: boolean;
}

// 快速操作按钮属性
interface QuickActionProps {
  mode: WritingAssistantMode;
  icon: string;
  label: string;
  description: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

/**
 * 建议卡片组件
 */
const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onApply,
  onReject,
  onShowAlternatives,
  isLoading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReason, setShowReason] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'content': return '📝';
      case 'style': return '✨';
      case 'structure': return '🏗️';
      case 'grammar': return '📖';
      case 'format': return '📐';
      default: return '💡';
    }
  };

  return (
    <div className={`border-l-4 rounded-lg p-4 mb-3 transition-all duration-200 ${getPriorityColor(suggestion.priority)}`}>
      {/* 建议头部 */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getCategoryIcon(suggestion.category)}</span>
          <div>
            <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className="capitalize">{suggestion.mode}</span>
              <span>•</span>
              <span>置信度: {Math.round(suggestion.confidence * 100)}%</span>
              <span>•</span>
              <span>影响度: {suggestion.estimatedImpact}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowReason(!showReason)}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="查看建议原因"
          >
            ❓
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 p-1"
            title={isExpanded ? '收起' : '展开'}
          >
            {isExpanded ? '🔼' : '🔽'}
          </button>
        </div>
      </div>

      {/* 建议内容预览 */}
      <div className="mb-3">
        <div className={`text-sm text-gray-700 ${isExpanded ? '' : 'line-clamp-2'}`}>
          {suggestion.content}
        </div>
        
        {showReason && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
            <strong>建议原因：</strong> {suggestion.reasoning}
          </div>
        )}
      </div>

      {/* 原文对比（如果有） */}
      {suggestion.originalText && isExpanded && (
        <div className="mb-3 text-xs">
          <div className="mb-1 font-medium text-gray-600">原文：</div>
          <div className="p-2 bg-gray-100 border rounded italic">
            {suggestion.originalText}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={onApply}
            disabled={isLoading}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '应用中...' : '应用建议'}
          </button>
          <button
            onClick={onReject}
            disabled={isLoading}
            className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 disabled:opacity-50"
          >
            拒绝
          </button>
          {suggestion.alternatives && suggestion.alternatives.length > 0 && onShowAlternatives && (
            <button
              onClick={onShowAlternatives}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              查看替代方案
            </button>
          )}
        </div>
        
        <div className="text-xs text-gray-400">
          {suggestion.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

/**
 * 快速操作按钮组件
 */
const QuickAction: React.FC<QuickActionProps> = ({
  mode,
  icon,
  label,
  description,
  onClick,
  isActive = false,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center p-3 rounded-lg border transition-all duration-200
        ${isActive 
          ? 'border-blue-500 bg-blue-50 text-blue-700' 
          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={description}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

/**
 * AI写作助手面板主组件
 */
const AIWritingAssistantPanel: React.FC<AIWritingAssistantPanelProps> = ({
  paper,
  assistant,
  collaborator,
  onSuggestionApply,
  onTextChange,
  className = ''
}) => {
  // 状态管理
  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([]);
  const [currentSession, setCurrentSession] = useState<WritingSession | undefined>();
  const [selectedMode, setSelectedMode] = useState<WritingAssistantMode>('continue');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [realTimeSuggestions, setRealTimeSuggestions] = useState<any[]>([]);
  
  // 引用
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  // 快速操作配置
  const quickActions: Array<{
    mode: WritingAssistantMode;
    icon: string;
    label: string;
    description: string;
  }> = [
    { mode: 'continue', icon: '✍️', label: '续写', description: '基于上下文继续写作' },
    { mode: 'polish', icon: '✨', label: '润色', description: '改进语言表达' },
    { mode: 'expand', icon: '📈', label: '扩展', description: '增加内容细节' },
    { mode: 'summarize', icon: '📋', label: '总结', description: '提炼核心要点' },
    { mode: 'rewrite', icon: '🔄', label: '重写', description: '重新组织表达' },
    { mode: 'outline', icon: '📝', label: '大纲', description: '生成写作大纲' },
    { mode: 'reference', icon: '📚', label: '文献', description: '推荐参考文献' },
    { mode: 'translate', icon: '🌐', label: '翻译', description: '专业学术翻译' }
  ];

  // 初始化会话
  useEffect(() => {
    const initSession = async () => {
      try {
        const session = await assistant.startWritingSession(paper, {
          language: 'zh',
          writingStyle: 'academic',
          detailLevel: 'detailed'
        });
        setCurrentSession(session);
      } catch (error) {
        console.error('初始化写作会话失败:', error);
      }
    };

    initSession();

    // 清理函数
    return () => {
      assistant.endSession();
    };
  }, [paper, assistant]);

  // 监听协作器事件
  useEffect(() => {
    const handleSuggestionsUpdated = (data: { suggestions: any[] }) => {
      setRealTimeSuggestions(data.suggestions);
    };

    const handleSuggestionApplied = (data: { suggestion: any }) => {
      // 从实时建议中移除已应用的建议
      setRealTimeSuggestions(prev => prev.filter(s => s.id !== data.suggestion.id));
    };

    collaborator.on('suggestions:updated', handleSuggestionsUpdated);
    collaborator.on('suggestion:applied', handleSuggestionApplied);

    return () => {
      collaborator.off('suggestions:updated', handleSuggestionsUpdated);
      collaborator.off('suggestion:applied', handleSuggestionApplied);
    };
  }, [collaborator]);

  // 获取写作建议
  const getSuggestion = useCallback(async (mode: WritingAssistantMode) => {
    if (!currentSession) return;

    setIsLoading(true);
    try {
      const suggestion = await assistant.getWritingSuggestion(mode, {
        targetText: selectedText,
        userPrompt: userPrompt || undefined
      });

      setSuggestions(prev => [suggestion, ...prev.slice(0, 4)]); // 保持最多5个建议
      
      // 清空用户提示
      setUserPrompt('');
    } catch (error) {
      console.error('获取建议失败:', error);
      // 这里可以显示错误通知
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, assistant, selectedText, userPrompt]);

  // 应用建议
  const applySuggestion = useCallback(async (suggestion: WritingSuggestion) => {
    try {
      const success = assistant.applySuggestion(suggestion.id);
      if (success) {
        onSuggestionApply(suggestion);
        // 从建议列表中移除
        setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      }
    } catch (error) {
      console.error('应用建议失败:', error);
    }
  }, [assistant, onSuggestionApply]);

  // 拒绝建议
  const rejectSuggestion = useCallback((suggestionId: string) => {
    assistant.rejectSuggestion(suggestionId);
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, [assistant]);

  // 应用实时建议
  const applyRealTimeSuggestion = useCallback(async (suggestionId: string) => {
    try {
      await collaborator.applySuggestion(suggestionId);
    } catch (error) {
      console.error('应用实时建议失败:', error);
    }
  }, [collaborator]);

  // 拒绝实时建议
  const rejectRealTimeSuggestion = useCallback((suggestionId: string) => {
    collaborator.rejectSuggestion(suggestionId);
    setRealTimeSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, [collaborator]);

  // 获取批量建议
  const getBatchSuggestions = useCallback(async () => {
    if (!selectedText) return;

    setIsLoading(true);
    try {
      const batchSuggestions = await assistant.getBatchSuggestions(
        selectedText,
        ['polish', 'expand', 'summarize']
      );
      setSuggestions(prev => [...batchSuggestions, ...prev.slice(0, 2)]);
    } catch (error) {
      console.error('获取批量建议失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [assistant, selectedText]);

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* 面板头部 */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">AI写作助手</h3>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs ${
              currentSession ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {currentSession ? '已连接' : '未连接'}
            </span>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-gray-400 hover:text-gray-600"
              title="高级设置"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* 快速操作栏 */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {quickActions.slice(0, 8).map((action) => (
            <QuickAction
              key={action.mode}
              mode={action.mode}
              icon={action.icon}
              label={action.label}
              description={action.description}
              onClick={() => {
                setSelectedMode(action.mode);
                getSuggestion(action.mode);
              }}
              isActive={selectedMode === action.mode}
              disabled={isLoading}
            />
          ))}
        </div>

        {/* 用户提示输入 */}
        <div className="mb-3">
          <div className="flex space-x-2">
            <textarea
              ref={promptInputRef}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="输入具体要求或问题..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => getSuggestion(selectedMode)}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? '处理中...' : '获取建议'}
              </button>
              {selectedText && (
                <button
                  onClick={getBatchSuggestions}
                  disabled={isLoading}
                  className="px-4 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                  title="一键获取多种建议"
                >
                  批量建议
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 选中文本显示 */}
        {selectedText && (
          <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
            <div className="text-xs text-blue-600 mb-1">选中文本：</div>
            <div className="text-blue-800 italic">{selectedText.slice(0, 100)}...</div>
          </div>
        )}
      </div>

      {/* 建议列表 */}
      <div className="max-h-96 overflow-y-auto p-4">
        {/* 实时建议 */}
        {realTimeSuggestions.length > 0 && (
          <>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-orange-600">🔄 实时建议</span>
              <span className="text-xs text-gray-500">({realTimeSuggestions.length})</span>
            </div>
            {realTimeSuggestions.slice(0, 3).map((suggestion) => (
              <div key={suggestion.id} className="mb-2 p-3 bg-orange-50 border border-orange-200 rounded">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-orange-800">{suggestion.message}</div>
                    <div className="text-xs text-orange-600 mt-1">{suggestion.suggestion}</div>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => applyRealTimeSuggestion(suggestion.id)}
                      className="px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700"
                    >
                      应用
                    </button>
                    <button
                      onClick={() => rejectRealTimeSuggestion(suggestion.id)}
                      className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500"
                    >
                      忽略
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* 主要建议 */}
        {suggestions.length > 0 && (
          <>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-gray-700">💡 AI建议</span>
              <span className="text-xs text-gray-500">({suggestions.length})</span>
            </div>
            {suggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onApply={() => applySuggestion(suggestion)}
                onReject={() => rejectSuggestion(suggestion.id)}
                isLoading={isLoading}
              />
            ))}
          </>
        )}

        {/* 空状态 */}
        {suggestions.length === 0 && realTimeSuggestions.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🤖</div>
            <div className="text-sm">选择文本并点击上方按钮获取AI写作建议</div>
          </div>
        )}

        {/* 加载状态 */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">AI正在分析...</span>
            </div>
          </div>
        )}
      </div>

      {/* 高级设置面板 */}
      {showAdvanced && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-3">高级设置</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">创造性水平</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.3"
                className="w-24"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">正式程度</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.8"
                className="w-24"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">实时建议</label>
              <input
                type="checkbox"
                defaultChecked
                className="rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWritingAssistantPanel;