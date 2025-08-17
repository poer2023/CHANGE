import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  Copy
} from 'lucide-react';
import { useAIChat } from '@/hooks/useServiceConsumption';
import { useCredit } from '@/contexts/CreditContext';
import { formatWordCount } from '@/lib/pricing';
import { Alert, AlertDescription } from '@/components/ui/alert';
import RechargeDialog from '@/components/RechargeDialog';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  action?: string;
  isActionResult?: boolean;
}

interface AIChatProps {
  className?: string;
}


const AIChat: React.FC<AIChatProps> = ({ className = '' }) => {
  // 使用付费系统
  const { getBalance } = useCredit();
  const { 
    sendMessage, 
    canAffordService, 
    estimateWordsNeeded, 
    getServiceCost,
    isLoading 
  } = useAIChat({
    onInsufficientBalance: () => {
      // 余额不足时的处理逻辑已在Hook中处理
    }
  });
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '你好！我是您的AI写作助手。我可以帮您:\n\n✨ 改善写作质量\n🔧 修复语法错误\n🎭 调整文本语调\n🌍 翻译多种语言\n📝 总结和扩展内容\n💡 头脑风暴和大纲制作\n\n请直接输入文本让我帮您优化！',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // 模拟AI智能响应
  const simulateAIResponse = (userMessage: string): string => {
    const responses = [
      '我理解您的需求！作为您的AI写作助手，我可以为您提供专业的内容优化建议。',
      '收到您的消息！我可以帮您分析内容结构、优化表达方式，或者提供创意写作支持。',
      '明白了！让我为您提供智能化的写作协助，包括内容改进、风格调整和创意拓展等服务。',
      '基于您的输入，我发现了几个可以优化的要点，让我为您详细分析...',
      '这是一个很好的话题！我可以帮您从多个角度来完善这个内容。',
      '我已经分析了您的文本，可以为您提供改进建议和优化方案。'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };


  const handleSend = async () => {
    if (!input.trim() || isThinking || isLoading) return;

    const currentInput = input;
    
    // 检查是否能承担费用
    if (!canAffordService('ai_chat', estimateWordsNeeded(currentInput))) {
      return; // 余额不足，Hook会显示提示
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      // 扣费
      const success = await sendMessage(currentInput);
      
      if (success) {
        // 模拟AI思考时间
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: simulateAIResponse(currentInput),
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsThinking(false);
        }, 2000 + Math.random() * 2000);
      } else {
        setIsThinking(false);
      }
    } catch (error) {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">AI 助手</h3>
              <p className="text-xs text-gray-500">智能写作辅助</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-purple-600" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.isActionResult
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.action && (
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs mb-1">
                      {message.action}
                    </Badge>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                  {message.isActionResult && (
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      <Copy className="h-3 w-3 mr-1" />
                      复制
                    </Button>
                  )}
                </div>
              </div>
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isThinking && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-purple-600 animate-pulse" />
              </div>
              <div className="max-w-[80%] rounded-lg p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-purple-700">AI正在处理...</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="向AI助手提问..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isThinking}
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isThinking || isLoading || (input && !canAffordService('ai_chat', estimateWordsNeeded(input)))}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIChat;