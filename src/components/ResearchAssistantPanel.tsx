import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  User, 
  MoreVertical, 
  Trash2, 
  Copy,
  RefreshCw,
  Minimize2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ResearchAssistantPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是您的研究助手，可以帮助您：\n\n• 分析文档内容\n• 提供写作建议\n• 解答学术问题\n• 协助文献查找\n\n有什么我可以帮助您的吗？',
      timestamp: '14:30'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // 模拟 AI 回复
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '这是一个模拟的 AI 助手回复。在实际应用中，这里会调用真实的 AI API 来生成智能回复。',
        timestamp: new Date().toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: '您好！我是您的研究助手，可以帮助您：\n\n• 分析文档内容\n• 提供写作建议\n• 解答学术问题\n• 协助文献查找\n\n有什么我可以帮助您的吗？',
        timestamp: new Date().toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
    ]);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100svh-64px)] rounded-xl border bg-background overflow-hidden flex flex-col shadow-sm">
      {/* Header */}
      <CardHeader className="p-3 border-b bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">AI 研究助手</CardTitle>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">在线</span>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleClearChat}>
                <Trash2 className="h-4 w-4 mr-2" />
                清空对话
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="h-4 w-4 mr-2" />
                重新开始
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Minimize2 className="h-4 w-4 mr-2" />
                最小化
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="p-1.5 bg-blue-100 rounded-lg shrink-0 mt-0.5">
                <Bot className="h-3 w-3 text-blue-600" />
              </div>
            )}
            
            <div className={`max-w-[85%] group ${message.role === 'user' ? 'order-1' : ''}`}>
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
              
              <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}>
                <span>{message.timestamp}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCopyMessage(message.content)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {message.role === 'user' && (
              <div className="p-1.5 bg-gray-200 rounded-lg shrink-0 mt-0.5">
                <User className="h-3 w-3 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="p-1.5 bg-blue-100 rounded-lg shrink-0 mt-0.5">
              <Bot className="h-3 w-3 text-blue-600" />
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-gray-50/50">
        <div className="flex gap-2">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Ctrl+Enter 发送)"
            className="min-h-[40px] max-h-[120px] resize-none text-sm border-gray-200 focus:border-blue-500"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            size="sm"
            className="shrink-0 h-[40px] w-[40px] p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Ctrl+Enter 快速发送</span>
          <Badge variant="outline" className="text-xs">
            演示模式
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ResearchAssistantPanel;