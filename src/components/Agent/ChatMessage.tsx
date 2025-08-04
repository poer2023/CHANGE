import React, { useState } from 'react';
import { Agent, AgentMessage } from '../../types';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import AgentSuggestionCard from './AgentSuggestionCard';

interface ChatMessageProps {
  message: AgentMessage;
  agent: Agent;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  agent,
  className = ''
}) => {
  const [showActions, setShowActions] = useState(false);
  const [copiedActionId, setCopiedActionId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);

  const isUser = message.role === 'user';
  const isAction = message.messageType === 'action';
  const isAnalysis = message.messageType === 'analysis';

  // 复制到剪贴板
  const copyToClipboard = async (text: string, actionId?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (actionId) {
        setCopiedActionId(actionId);
        setTimeout(() => setCopiedActionId(null), 2000);
      }
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 格式化时间
  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  // 获取消息类型图标
  const getMessageTypeIcon = () => {
    switch (message.messageType) {
      case 'action':
        return '⚡';
      case 'analysis':
        return '🔍';
      case 'suggestion':
        return '💡';
      default:
        return agent.avatar;
    }
  };

  // 获取消息样式类
  const getMessageClasses = () => {
    if (isUser) {
      return 'bg-blue-600 text-white ml-12';
    }
    if (isAction) {
      return 'bg-green-50 border border-green-200 text-green-900';
    }
    if (isAnalysis) {
      return 'bg-purple-50 border border-purple-200 text-purple-900';
    }
    return 'bg-gray-100 text-gray-900';
  };

  // 检查消息是否过长
  const isLongMessage = message.content.length > 200;
  const shouldTruncate = isLongMessage && !showFullMessage;

  return (
    <div className={`group flex ${isUser ? 'justify-end' : 'items-start space-x-3'} ${className} animate-fade-in`}>
      {/* Agent头像 */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-sm">{getMessageTypeIcon()}</span>
        </div>
      )}

      {/* 消息内容 */}
      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
        <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl ${isUser ? 'mr-0' : ''}`}>
          {/* 消息气泡 */}
          <div
            className={`
              rounded-lg p-3 break-words
              ${getMessageClasses()}
              ${isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}
            `}
          >
            <div className="prose prose-sm max-w-none">
              {/* 消息文本 */}
              <div className={`whitespace-pre-wrap text-sm leading-relaxed ${
                shouldTruncate ? 'line-clamp-3' : ''
              }`}>
                {message.content}
              </div>
              
              {/* 展开/收起按钮 */}
              {isLongMessage && (
                <button
                  onClick={() => setShowFullMessage(!showFullMessage)}
                  className={`mt-2 text-xs underline transition-colors ${
                    isUser 
                      ? 'text-blue-200 hover:text-white' 
                      : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  {showFullMessage ? '收起' : '展开全文'}
                </button>
              )}

              {/* 操作按钮 */}
              {message.actions && message.actions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-opacity-20 border-gray-300">
                  <div className="space-y-2">
                    {message.actions.map((action) => (
                      <Button
                        key={action.id}
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          console.log('执行操作:', action);
                          // 这里可以添加具体的操作逻辑
                        }}
                        className={`
                          w-full text-left justify-start text-xs
                          ${isUser 
                            ? 'text-blue-100 hover:text-white hover:bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-200'
                          }
                        `}
                      >
                        <span className="mr-2">{action.icon}</span>
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 建议卡片 */}
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.suggestions.map((suggestion) => (
                <AgentSuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onActionClick={(action) => {
                    console.log('执行建议操作:', action);
                    // 这里可以添加具体的操作逻辑
                  }}
                />
              ))}
            </div>
          )}

          {/* 消息元信息 */}
          <div className={`flex items-center space-x-2 mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isUser ? 'justify-end' : ''}`}>
            <span>{formatTime(message.timestamp)}</span>
            
            {/* 消息操作 */}
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(message.content, message.id)}
                className="p-1 h-auto text-xs hover:bg-gray-200"
                title="复制消息"
              >
                {copiedActionId === message.id ? '✅' : '📋'}
              </Button>
              
              {!isUser && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowActions(!showActions)}
                    className="p-1 h-auto text-xs hover:bg-gray-200"
                    title="更多操作"
                  >
                    ⋯
                  </Button>
                  
                  {/* 反馈按钮 */}
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsLiked(!isLiked);
                        if (isDisliked) setIsDisliked(false);
                      }}
                      className={`p-1 h-auto text-xs transition-all duration-200 ${
                        isLiked 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                          : 'hover:bg-gray-200'
                      }`}
                      title="有用"
                    >
                      {isLiked ? '👍' : '👍'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsDisliked(!isDisliked);
                        if (isLiked) setIsLiked(false);
                      }}
                      className={`p-1 h-auto text-xs transition-all duration-200 ${
                        isDisliked 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'hover:bg-gray-200'
                      }`}
                      title="无用"
                    >
                      {isDisliked ? '👎' : '👎'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 展开的操作菜单 */}
          {showActions && !isUser && (
            <Card className="mt-2 p-2 animate-slide-up">
              <div className="space-y-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full text-left justify-start text-xs hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  onClick={() => {
                    // 重新生成回答
                    console.log('重新生成回答');
                    setShowActions(false);
                  }}
                >
                  🔄 重新生成
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full text-left justify-start text-xs hover:bg-green-50 hover:text-green-700 transition-colors"
                  onClick={() => {
                    // 详细解释
                    console.log('详细解释');
                    setShowActions(false);
                  }}
                >
                  📖 详细解释
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full text-left justify-start text-xs hover:bg-purple-50 hover:text-purple-700 transition-colors"
                  onClick={() => {
                    // 提供替代方案
                    console.log('提供替代方案');
                    setShowActions(false);
                  }}
                >
                  🔀 替代方案
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full text-left justify-start text-xs hover:bg-orange-50 hover:text-orange-700 transition-colors"
                  onClick={() => {
                    // 应用到编辑器
                    console.log('应用到编辑器');
                    setShowActions(false);
                  }}
                >
                  ✏️ 应用到编辑器
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* 用户头像占位 */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white text-sm">👤</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;