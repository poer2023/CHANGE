import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Trash2,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Sparkles,
  PenTool,
  Search,
  RefreshCw,
  Square
} from 'lucide-react';
import { useStreamingAI } from '@/hooks';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  metadata?: {
    suggestion?: boolean;
    action?: string;
    rating?: 'positive' | 'negative';
  };
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  prompt: string;
  category: 'writing' | 'editing' | 'research' | 'formatting';
}

interface AgentPanelProps {
  content: string;
  onContentChange?: (content: string) => void;
  onInsertText?: (text: string, position?: number) => void;
  className?: string;
}

const AgentPanel: React.FC<AgentPanelProps> = ({
  content,
  onContentChange,
  onInsertText,
  className = ""
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '你好！我是你的AI写作助手。我可以帮助你改进文档结构、优化语言表达、检查语法错误，或者回答任何关于写作的问题。有什么我可以帮助你的吗？',
      timestamp: new Date(),
      status: 'sent'
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestions' | 'actions'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 使用流式AI hook
  const { 
    content: streamingContent, 
    isStreaming, 
    isComplete,
    error: streamingError,
    startStreaming, 
    stopStreaming,
    reset: resetStreaming 
  } = useStreamingAI({ delay: 30, chunkSize: 1 });

  // 快捷操作
  const quickActions: QuickAction[] = [
    {
      id: 'improve-writing',
      label: '改进写作',
      icon: PenTool,
      prompt: '请帮我改进这段文字的表达：',
      category: 'writing'
    },
    {
      id: 'grammar-check',
      label: '语法检查',
      icon: CheckCircle,
      prompt: '请检查这段文字的语法错误：',
      category: 'editing'
    },
    {
      id: 'expand-content',
      label: '扩展内容',
      icon: Sparkles,
      prompt: '请帮我扩展这个主题的内容：',
      category: 'writing'
    },
    {
      id: 'summarize',
      label: '总结内容',
      icon: FileText,
      prompt: '请帮我总结这段内容：',
      category: 'editing'
    },
    {
      id: 'research-help',
      label: '研究建议',
      icon: Search,
      prompt: '关于这个主题，我需要进行哪些研究：',
      category: 'research'
    },
    {
      id: 'structure-improve',
      label: '结构优化',
      icon: RefreshCw,
      prompt: '请帮我优化这部分内容的结构：',
      category: 'formatting'
    }
  ];

  // AI建议
  const [suggestions] = useState([
    {
      id: '1',
      type: 'improvement',
      title: '写作建议',
      content: '建议在引言部分添加更多背景信息，以便读者更好地理解研究背景。',
      action: '应用建议',
      icon: Lightbulb,
      color: 'blue'
    },
    {
      id: '2',
      type: 'grammar',
      title: '语法检查',
      content: '发现3处语法问题，点击查看详细建议。',
      action: '查看详情',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: '3',
      type: 'structure',
      title: '结构优化',
      content: '建议调整第二章和第三章的顺序，以提高逻辑连贯性。',
      action: '优化结构',
      icon: AlertCircle,
      color: 'yellow'
    }
  ]);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 更新流式消息内容
  useEffect(() => {
    if (currentStreamingMessageId && streamingContent) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === currentStreamingMessageId
            ? { ...msg, content: streamingContent }
            : msg
        )
      );
    }
  }, [currentStreamingMessageId, streamingContent]);

  // 流式完成时更新消息状态
  useEffect(() => {
    if (currentStreamingMessageId && isComplete) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === currentStreamingMessageId
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );
      setCurrentStreamingMessageId(null);
      resetStreaming();
    }
  }, [currentStreamingMessageId, isComplete, resetStreaming]);

  // 流式错误处理
  useEffect(() => {
    if (currentStreamingMessageId && streamingError) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === currentStreamingMessageId
            ? {
                ...msg,
                content: streamingError,
                status: 'error' as const
              }
            : msg
        )
      );
      setCurrentStreamingMessageId(null);
    }
  }, [currentStreamingMessageId, streamingError]);

  // 当前流式消息的ID
  const [currentStreamingMessageId, setCurrentStreamingMessageId] = useState<string | null>(null);

  // 发送消息
  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    const prompt = inputValue.trim();
    setInputValue('');

    // 创建AI回复消息
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, assistantMessage]);
    setCurrentStreamingMessageId(assistantMessageId);

    // 开始流式生成
    try {
      await startStreaming(prompt);
    } catch (error) {
      // 处理错误
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: '抱歉，我遇到了一些问题。请稍后再试。',
                status: 'error' as const
              }
            : msg
        )
      );
      setCurrentStreamingMessageId(null);
    }
  }, [inputValue, isStreaming, startStreaming]);

  // 快捷操作点击
  const handleQuickAction = useCallback((action: QuickAction) => {
    const selectedText = window.getSelection()?.toString() || '';
    const prompt = selectedText 
      ? `${action.prompt}\n\n"${selectedText}"`
      : action.prompt;
    
    setInputValue(prompt);
    setActiveTab('chat');
    inputRef.current?.focus();
  }, []);

  // 键盘事件处理
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // 消息操作
  const copyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  const rateMessage = useCallback((messageId: string, rating: 'positive' | 'negative') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, metadata: { ...msg.metadata, rating } }
          : msg
      )
    );
  }, []);

  // 清空对话
  const clearMessages = useCallback(() => {
    setMessages([messages[0]]); // 保留欢迎消息
  }, []);

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.type === 'user';
    const isCurrentStreaming = message.id === currentStreamingMessageId && isStreaming;
    const isMessageStreaming = message.status === 'sending' && !isCurrentStreaming;

    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* 头像 */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-500 ml-2' : 'bg-gray-100 mr-2'
          }`}>
            {isUser ? (
              <User className="h-4 w-4 text-white" />
            ) : (
              <Bot className="h-4 w-4 text-gray-600" />
            )}
          </div>

          {/* 消息内容 */}
          <div className={`rounded-lg px-3 py-2 ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-900'
          }`}>
            {isMessageStreaming ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">正在思考...</span>
              </div>
            ) : (
              <>
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                  {isCurrentStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
                  )}
                </div>
                
                {/* 流式控制按钮 */}
                {isCurrentStreaming && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={stopStreaming}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      <Square className="h-3 w-3" />
                      <span>停止生成</span>
                    </button>
                  </div>
                )}
                
                {/* 消息操作 */}
                {!isUser && !isCurrentStreaming && message.content && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="复制"
                      >
                        <Copy className="h-3 w-3 text-gray-500" />
                      </button>
                      <button
                        onClick={() => onInsertText?.(message.content)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="插入到文档"
                      >
                        <FileText className="h-3 w-3 text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => rateMessage(message.id, 'positive')}
                        className={`p-1 hover:bg-gray-200 rounded transition-colors ${
                          message.metadata?.rating === 'positive' ? 'text-green-600' : 'text-gray-500'
                        }`}
                        title="有帮助"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => rateMessage(message.id, 'negative')}
                        className={`p-1 hover:bg-gray-200 rounded transition-colors ${
                          message.metadata?.rating === 'negative' ? 'text-red-600' : 'text-gray-500'
                        }`}
                        title="没有帮助"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="flex flex-col h-full">
            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex flex-col space-y-2">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入消息... (Shift+Enter 换行)"
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  disabled={isStreaming}
                />
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={clearMessages}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>清空对话</span>
                  </button>
                  
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isStreaming}
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isStreaming ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        生成中
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        发送
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'suggestions':
        return (
          <div className="p-4 space-y-4">
            {suggestions.map(suggestion => (
              <div key={suggestion.id} className={`p-4 rounded-lg border-l-4 bg-${suggestion.color}-50 border-${suggestion.color}-400`}>
                <div className="flex items-start space-x-3">
                  <suggestion.icon className={`h-5 w-5 text-${suggestion.color}-600 mt-0.5`} />
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium text-${suggestion.color}-900 mb-1`}>
                      {suggestion.title}
                    </h4>
                    <p className={`text-sm text-${suggestion.color}-700 mb-3`}>
                      {suggestion.content}
                    </p>
                    <button className={`text-xs bg-${suggestion.color}-100 text-${suggestion.color}-800 px-2 py-1 rounded hover:bg-${suggestion.color}-200 transition-colors`}>
                      {suggestion.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'actions':
        return (
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="flex items-center p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors group"
                >
                  <action.icon className="h-5 w-5 text-gray-600 mr-3 group-hover:text-blue-600 transition-colors" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
                      {action.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {action.category === 'writing' && '写作辅助'}
                      {action.category === 'editing' && '编辑优化'}
                      {action.category === 'research' && '研究建议'}
                      {action.category === 'formatting' && '格式调整'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* 标签栏 */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'chat'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            对话
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'suggestions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Lightbulb className="h-4 w-4 inline mr-2" />
            建议
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'actions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Zap className="h-4 w-4 inline mr-2" />
            快捷
          </button>
        </nav>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AgentPanel;