import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  X, 
  Clock, 
  Loader2, 
  Eye, 
  RefreshCw,
  Expand,
  CheckCircle,
  Quote,
  List,
  Wand2,
  Activity
} from "lucide-react";
import type { AgentOperation } from "@/pages/EssayEditor";

interface OperationFlowProps {
  operations: AgentOperation[];
  onApply: (operationId: string) => void;
  onRevert: (operationId: string) => void;
}

const OperationFlow = ({ operations, onApply, onRevert }: OperationFlowProps) => {
  const getToolIcon = (tool: string) => {
    switch (tool) {
      case "rewrite": return RefreshCw;
      case "expand": return Expand;
      case "proofread": return CheckCircle;
      case "outline": return List;
      case "cite": return Quote;
      default: return Wand2;
    }
  };

  const getStatusIcon = (status: AgentOperation["status"]) => {
    switch (status) {
      case "queued": return Clock;
      case "generating": return Loader2;
      case "proposed_diff": return Eye;
      case "applied": return Check;
      case "reverted": return X;
      default: return Clock;
    }
  };

  const getStatusColor = (status: AgentOperation["status"]) => {
    switch (status) {
      case "queued": return "text-yellow-600 bg-yellow-50";
      case "generating": return "text-blue-600 bg-blue-50";
      case "proposed_diff": return "text-orange-600 bg-orange-50";
      case "applied": return "text-green-600 bg-green-50";
      case "reverted": return "text-gray-600 bg-gray-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: AgentOperation["status"]) => {
    switch (status) {
      case "queued": return "排队中";
      case "generating": return "生成中";
      case "proposed_diff": return "待确认";
      case "applied": return "已应用";
      case "reverted": return "已撤销";
      default: return "未知";
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return "";
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('zh-CN', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" />
          操作流
          {operations.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {operations.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {operations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground text-sm">
              暂无操作记录
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              使用右侧工具开始编辑
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {operations
              .slice()
              .reverse() // 最新的在顶部
              .map((operation) => {
                const ToolIcon = getToolIcon(operation.tool);
                const StatusIcon = getStatusIcon(operation.status);
                
                return (
                  <div 
                    key={operation.id}
                    className="border rounded-lg p-3 space-y-3"
                  >
                    {/* 操作头部 */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/10">
                          <ToolIcon className="h-3 w-3 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm capitalize">
                            {operation.tool === "rewrite" ? "改写" :
                             operation.tool === "expand" ? "扩写" :
                             operation.tool === "proofread" ? "校对" :
                             operation.tool === "outline" ? "大纲" :
                             operation.tool === "cite" ? "引用" :
                             operation.tool}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTimestamp(operation.timestamp)}
                          </div>
                        </div>
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(operation.status)}`}
                      >
                        <StatusIcon className={`h-3 w-3 mr-1 ${
                          operation.status === "generating" ? "animate-spin" : ""
                        }`} />
                        {getStatusText(operation.status)}
                      </Badge>
                    </div>

                    {/* 操作输入 */}
                    <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                      {operation.input.length > 80 
                        ? `${operation.input.slice(0, 80)}...`
                        : operation.input
                      }
                    </div>

                    {/* 操作结果 */}
                    {operation.output && (
                      <div className="text-xs p-2 bg-primary/5 rounded border-l-2 border-primary">
                        {operation.output}
                      </div>
                    )}

                    {/* 性能指标 */}
                    {(operation.duration || operation.tokens) && (
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {operation.duration && (
                          <span>耗时: {formatDuration(operation.duration)}</span>
                        )}
                        {operation.tokens && (
                          <span>Token: {operation.tokens}</span>
                        )}
                      </div>
                    )}

                    {/* 操作按钮 */}
                    {operation.status === "proposed_diff" && (
                      <>
                        <Separator />
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => onApply(operation.id)}
                            className="flex-1"
                          >
                            <Check className="mr-2 h-3 w-3" />
                            应用
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRevert(operation.id)}
                            className="flex-1"
                          >
                            <X className="mr-2 h-3 w-3" />
                            撤销
                          </Button>
                        </div>
                      </>
                    )}

                    {operation.status === "applied" && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRevert(operation.id)}
                            className="text-xs"
                          >
                            <X className="mr-2 h-3 w-3" />
                            撤销此更改
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OperationFlow;