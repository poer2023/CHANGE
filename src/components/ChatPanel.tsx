import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";

interface CollapsibleInfoCard {
  id: string;
  title: string;
  summary: string;
  content: string;
  items?: string[];
  isDefaultOpen?: boolean;
}

interface ChatMessageType {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  infoCards?: CollapsibleInfoCard[];
}

const ChatPanel = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      content: '你好！我是你的AI论文助手。我可以帮助你进行学术写作，包括论文结构规划、内容优化、格式规范等。请告诉我你需要什么帮助？',
      type: 'assistant',
      timestamp: new Date(),
      infoCards: [
        {
          id: 'card1',
          title: '论文写作服务',
          summary: '提供全方位的学术写作支持',
          content: '我可以帮助你完成学术论文的各个环节，从选题到定稿。',
          items: [
            '论文大纲设计与结构规划',
            '文献综述和引用格式化',
            '内容优化和语言润色',
            '学术规范检查'
          ],
          isDefaultOpen: true
        },
        {
          id: 'card2',
          title: '支持的论文类型',
          summary: '涵盖多种学术论文类型',
          content: '支持不同类型和级别的学术写作需求。',
          items: [
            '研究论文 (Research Papers)',
            '文献综述 (Literature Reviews)',
            '案例分析 (Case Studies)',
            '毕业论文和学位论文'
          ]
        }
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const newUserMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: input,
      type: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    
    // 模拟AI回复
    setTimeout(() => {
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: `我正在处理你的请求: "${input}"，让我为你提供详细的建议和指导。`,
        type: 'assistant',
        timestamp: new Date(),
        infoCards: [
          {
            id: `card-${Date.now()}`,
            title: '处理结果',
            summary: '针对你的问题生成的建议',
            content: '基于你的输入，我已经分析了相关要素并准备了详细的建议。',
            items: [
              '分析了你的具体需求',
              '检索了相关的学术资源',
              '制定了个性化的写作策略',
              '准备了具体的实施步骤'
            ],
            isDefaultOpen: true
          }
        ]
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
    
    setInput("");
  };

  return (
    <div className="w-[410px] h-full bg-white border-l border-gray-200 flex flex-col">
      {/* 消息区域 */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 shadow-sm">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入你的问题..."
            className="flex-1 min-h-10 resize-none rounded-2xl border-gray-200 focus:border-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="h-10 px-3 rounded-2xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-[#6B7280] text-center mt-2">
          按 Enter 发送，Shift + Enter 换行
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;