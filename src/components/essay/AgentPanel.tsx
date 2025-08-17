import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  RefreshCw, 
  Expand, 
  CheckCircle, 
  Quote, 
  List,
  Wand2,
  MessageCircle,
  User,
  Bot
} from "lucide-react";
import KnowledgePanel from "@/components/KnowledgePanel";

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
}

interface AgentPanelProps {
  selectedText: string;
  selectedSection: string | null;
  onOperation: (tool: string, input: string, targetSectionId?: string) => void;
}

const AgentPanel = ({ selectedText, selectedSection, onOperation }: AgentPanelProps) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: '你好！我是你的AI论文助手。我可以帮助你改写、扩写、校对文章内容。请告诉我需要什么帮助？',
      type: 'assistant',
      timestamp: new Date()
    }
  ]);

  const tools = [
    {
      id: "rewrite",
      name: "改写",
      icon: RefreshCw,
      description: "改写选中内容，提高清晰度",
      color: "bg-blue-500"
    },
    {
      id: "expand", 
      name: "扩写",
      icon: Expand,
      description: "扩展段落内容，添加细节",
      color: "bg-green-500"
    },
    {
      id: "proofread",
      name: "校对",
      icon: CheckCircle, 
      description: "检查语法和表达",
      color: "bg-yellow-500"
    },
    {
      id: "outline",
      name: "大纲",
      icon: List,
      description: "重新整理大纲结构",
      color: "bg-purple-500"
    },
    {
      id: "cite",
      name: "引用",
      icon: Quote,
      description: "格式化引用和参考文献",
      color: "bg-orange-500"
    }
  ];

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      type: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    onOperation("custom", input, selectedSection || undefined);
    
    // 模拟AI回复
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `我正在处理你的请求: "${input}"，稍后将在编辑器中显示结果。`,
        type: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
    
    setInput("");
  };

  const handleToolClick = (toolId: string) => {
    if (!selectedText && toolId !== "outline" && toolId !== "cite") {
      return; // 需要选中文本的工具
    }
    
    setIsLoading(true);
    
    let operationInput = "";
    switch (toolId) {
      case "rewrite":
        operationInput = `改写以下内容: "${selectedText}"`;
        break;
      case "expand":
        operationInput = `扩写以下段落: "${selectedText}"`;
        break;
      case "proofread":
        operationInput = `校对以下文本: "${selectedText}"`;
        break;
      case "outline":
        operationInput = "重新整理文章大纲结构";
        break;
      case "cite":
        operationInput = "格式化文章中的引用和参考文献";
        break;
    }
    
    onOperation(toolId, operationInput, selectedSection || undefined);
    
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleQuickAction = (action: string) => {
    if (!selectedText) return;
    
    const quickActions = {
      "make_clearer": `让这段话更清晰: "${selectedText}"`,
      "make_concise": `让这段话更简洁: "${selectedText}"`,
      "add_examples": `为这段话添加例子: "${selectedText}"`,
      "improve_flow": `改善这段话的逻辑流程: "${selectedText}"`
    };
    
    const actionInput = quickActions[action as keyof typeof quickActions];
    if (actionInput) {
      setIsLoading(true);
      onOperation("rewrite", actionInput, selectedSection || undefined);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            AI 助手
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-2">
          <div className="text-xs text-muted-foreground">对话记录</div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-3">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex gap-2 max-w-[85%] ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {message.type === 'user' ? (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <User className="h-3 w-3 text-primary-foreground" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <Bot className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="mt-4 space-y-3">
            {/* Selected Text Indicator */}
            {selectedText && (
              <div className="p-2 bg-muted rounded-md border-l-2 border-primary">
                <div className="text-xs text-muted-foreground mb-1">
                  已选中文本 ({selectedText.length} 字符)
                </div>
                <div className="text-xs text-foreground line-clamp-2">
                  "{selectedText.slice(0, 100)}{selectedText.length > 100 ? "..." : ""}"
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {selectedText && (
              <div className="flex flex-wrap gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction("make_clearer")}
                  disabled={isLoading}
                  className="text-xs h-7"
                >
                  更清晰
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction("make_concise")}
                  disabled={isLoading}
                  className="text-xs h-7"
                >
                  更简洁
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction("add_examples")}
                  disabled={isLoading}
                  className="text-xs h-7"
                >
                  加例子
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction("improve_flow")}
                  disabled={isLoading}
                  className="text-xs h-7"
                >
                  改善逻辑
                </Button>
              </div>
            )}

            {/* Quick Tools */}
            <div className="grid grid-cols-3 gap-1">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const needsSelection = !["outline", "cite"].includes(tool.id);
                const disabled = needsSelection && !selectedText;
                
                return (
                  <Button
                    key={tool.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolClick(tool.id)}
                    disabled={disabled || isLoading}
                    className="h-8 text-xs"
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {tool.name}
                  </Button>
                );
              })}
            </div>

            {/* Input and Send */}
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="请输入问题或指令..."
                className="min-h-10 resize-none flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="flex flex-col gap-1">
                <Button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="h-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <KnowledgePanel onInsert={(content) => setInput(prev => prev + content)} />
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              按 Enter 发送，Shift + Enter 换行
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentPanel;