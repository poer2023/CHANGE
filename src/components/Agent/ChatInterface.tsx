import React, { useState, useRef, useEffect } from 'react';
import { Agent, AgentMessage, ChatSession } from '../../types';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import ChatMessage from './ChatMessage';
import glmClient from '../../services/glmClient';

interface ChatInterfaceProps {
  session: ChatSession | undefined;
  agent: Agent;
  onSendMessage: (message: string, type?: AgentMessage['messageType']) => void;
  isLoading?: boolean;
  selectedText?: string;
  className?: string;
  enableStreaming?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  session,
  agent,
  onSendMessage,
  isLoading = false,
  selectedText = '',
  className = '',
  enableStreaming = true
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamingControllerRef = useRef<AbortController | null>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  // 聚焦输入框
  useEffect(() => {
    inputRef.current?.focus();
  }, [session]);

  // 清理流式控制器
  useEffect(() => {
    return () => {
      if (streamingControllerRef.current) {
        streamingControllerRef.current.abort();
      }
    };
  }, []);

  // 处理发送消息
  const handleSendMessage = async () => {
    if (inputValue.trim() && !isLoading && !isStreaming) {
      const message = inputValue.trim();
      setInputValue('');

      if (enableStreaming) {
        await handleStreamingMessage(message);
      } else {
        onSendMessage(message);
      }
    }
  };

  // 处理流式消息
  const handleStreamingMessage = async (message: string) => {
    if (!session) return;

    setIsStreaming(true);
    setStreamingMessage('');

    // 取消之前的流式请求
    if (streamingControllerRef.current) {
      streamingControllerRef.current.abort();
    }

    streamingControllerRef.current = new AbortController();

    try {
      // 添加用户消息
      const userMessage: AgentMessage = {
        id: `msg-${Date.now()}-user`,
        content: message,
        role: 'user',
        timestamp: new Date(),
        messageType: 'text',
        agentRole: agent.role
      };

      // 这里应该通过回调更新会话
      // 暂时先添加到本地状态，实际使用时需要通过props传递更新函数

      let accumulatedContent = '';
      
      // 调用流式API
      for await (const chunk of glmClient.agentChatStream(agent.role, message, selectedText)) {
        if (streamingControllerRef.current?.signal.aborted) {
          break;
        }
        
        accumulatedContent += chunk;
        setStreamingMessage(accumulatedContent);
        scrollToBottom();
      }

      // 流式完成后，通过正常渠道发送消息
      if (!streamingControllerRef.current?.signal.aborted) {
        onSendMessage(message);
      }

    } catch (error) {
      console.error('流式聊天失败:', error);
      // 降级到普通消息发送
      onSendMessage(message);
    } finally {
      setIsStreaming(false);
      setStreamingMessage('');
      streamingControllerRef.current = null;
    }
  };

  // 停止流式输出
  const stopStreaming = () => {
    if (streamingControllerRef.current) {
      streamingControllerRef.current.abort();
      setIsStreaming(false);
      setStreamingMessage('');
    }
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 快捷消息模板
  const quickMessages = [
    '请帮我检查这段文字',
    '如何改进这个章节的结构？',
    '这里的表达是否合适？',
    '请推荐相关文献'
  ];

  const handleQuickMessage = (message: string) => {
    setInputValue(message);
    inputRef.current?.focus();
  };

  if (!session) {
    return (
      <div className={`flex-1 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">{agent.avatar}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            与{agent.name}开始对话
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {agent.description}
          </p>
          <Button
            onClick={() => onSendMessage('你好，我需要一些帮助')}
            className="text-sm"
          >
            开始对话
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">{agent.avatar}</div>
            <p className="text-sm text-gray-600 mb-4">
              我是{agent.name}，很高兴为您服务！
            </p>
            <div className="space-y-2">
              <p className="text-xs text-gray-500 mb-2">您可以尝试问我：</p>
              <div className="grid grid-cols-1 gap-2 max-w-xs mx-auto">
                {quickMessages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickMessage(message)}
                    className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
                  >
                    {message}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {session.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                agent={agent}
              />
            ))}
            
            {/* 流式消息显示 */}
            {isStreaming && streamingMessage && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">{agent.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="bg-white border border-gray-200 rounded-lg p-3 relative">
                    <div className="prose prose-sm max-w-none">
                      {streamingMessage}
                      <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1"></span>
                    </div>
                    <button
                      onClick={stopStreaming}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xs"
                      title="停止生成"
                    >
                      ⏹️
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 ml-2">正在生成回复...</div>
                </div>
              </div>
            )}

            {/* 加载中指示器 */}
            {(isLoading || isStreaming) && !streamingMessage && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">{agent.avatar}</span>
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {isStreaming ? '正在连接...' : '正在思考...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 选中文本提示 */}
      {selectedText && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-blue-700 font-medium mb-1">已选中文本：</p>
              <p className="text-xs text-blue-600 truncate">
                {selectedText.length > 50 ? `${selectedText.substring(0, 50)}...` : selectedText}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleQuickMessage(`请帮我分析这段文字："${selectedText}"`)}
              className="text-xs ml-2"
            >
              分析
            </Button>
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(value) => setInputValue(value)}
              onKeyPress={handleKeyPress}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder={`向${agent.name}提问...`}
              disabled={isLoading || isStreaming}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || isStreaming}
            className="px-4"
          >
            {isLoading || isStreaming ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              '发送'
            )}
          </Button>
        </div>
        
        {/* 快捷操作按钮 */}
        <div className="flex space-x-2 mt-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleQuickMessage('请总结一下我们的对话要点')}
            className="text-xs"
          >
            📝 总结对话
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleQuickMessage('请给出具体的改进建议')}
            className="text-xs"
          >
            💡 改进建议
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleQuickMessage('还有其他需要注意的地方吗？')}
            className="text-xs"
          >
            🔍 深入分析
          </Button>
        </div>

        {/* 输入提示 */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>按 Enter 发送，Shift + Enter 换行</span>
          <span>{inputValue.length}/500</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;