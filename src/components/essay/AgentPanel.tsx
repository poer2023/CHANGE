import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  RefreshCw, 
  Expand, 
  CheckCircle, 
  Quote, 
  List,
  Wand2
} from "lucide-react";
import KnowledgePanel from "@/components/KnowledgePanel";

interface AgentPanelProps {
  selectedText: string;
  selectedSection: string | null;
  onOperation: (tool: string, input: string, targetSectionId?: string) => void;
}

const AgentPanel = ({ selectedText, selectedSection, onOperation }: AgentPanelProps) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    
    setIsLoading(true);
    onOperation("custom", input, selectedSection || undefined);
    setInput("");
    
    setTimeout(() => setIsLoading(false), 1000);
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          AI 助手
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 输入框 */}
        <div className="space-y-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入指令或使用下方工具..."
            className="min-h-20 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSendMessage();
              }
            }}
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="flex-1"
            >
              <Send className="mr-2 h-4 w-4" />
              发送 (⌘/Ctrl+Enter)
            </Button>
            <KnowledgePanel onInsert={(content) => setInput(prev => prev + content)} />
          </div>
        </div>

        <Separator />

        {/* 工具按钮 */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground">快速工具</h4>
          <div className="grid grid-cols-2 gap-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const needsSelection = !["outline", "cite"].includes(tool.id);
              const disabled = needsSelection && !selectedText;
              
              return (
                <Button
                  key={tool.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleToolClick(tool.id)}
                  disabled={disabled || isLoading}
                  className="h-auto p-3 flex flex-col items-center gap-1"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{tool.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* 选中文本提示和快速操作 */}
        {selectedText && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  已选中 {selectedText.length} 个字符
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground p-2 bg-muted rounded border-l-2 border-primary">
                "{selectedText.slice(0, 100)}{selectedText.length > 100 ? "..." : ""}"
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">快速操作</h4>
                <div className="flex flex-wrap gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickAction("make_clearer")}
                    disabled={isLoading}
                    className="text-xs h-7"
                  >
                    更清晰
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickAction("make_concise")}
                    disabled={isLoading}
                    className="text-xs h-7"
                  >
                    更简洁
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickAction("add_examples")}
                    disabled={isLoading}
                    className="text-xs h-7"
                  >
                    加例子
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickAction("improve_flow")}
                    disabled={isLoading}
                    className="text-xs h-7"
                  >
                    改善逻辑
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 当前状态 */}
        {selectedSection && (
          <>
            <Separator />
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                编辑模式: {selectedSection}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentPanel;