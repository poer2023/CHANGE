import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  Download, 
  Trash2, 
  Undo2, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  FileText,
  Activity
} from 'lucide-react';
import { getAgentHistory, undoOperation, exportAuditLog, clearHistory } from '@/services/agentApi';
import { AgentHistoryItem } from '@/types/agent';
import { useToast } from '@/hooks/use-toast';

interface AuditPanelProps {
  className?: string;
}

const AuditPanel: React.FC<AuditPanelProps> = ({ className = '' }) => {
  const [history, setHistory] = useState<AgentHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [undoingOps, setUndoingOps] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // 加载历史记录
  const loadHistory = async () => {
    setLoading(true);
    try {
      const historyData = await getAgentHistory();
      setHistory(historyData);
    } catch (error) {
      toast({
        title: "加载失败",
        description: "无法加载操作历史",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 撤销操作
  const handleUndo = async (operationId: string) => {
    setUndoingOps(prev => new Set([...prev, operationId]));
    try {
      const response = await undoOperation({ operationId });
      if (response.success) {
        toast({
          title: "撤销成功",
          description: "操作已成功撤销"
        });
        // 重新加载历史记录
        await loadHistory();
      }
    } catch (error) {
      toast({
        title: "撤销失败",
        description: error instanceof Error ? error.message : "撤销操作时发生错误",
        variant: "destructive"
      });
    } finally {
      setUndoingOps(prev => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
    }
  };

  // 导出审计日志
  const handleExport = () => {
    try {
      const auditLog = exportAuditLog();
      const blob = new Blob([auditLog], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agent-audit-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "导出成功",
        description: "审计日志已下载到本地"
      });
    } catch (error) {
      toast({
        title: "导出失败",
        description: "无法导出审计日志",
        variant: "destructive"
      });
    }
  };

  // 清空历史
  const handleClearHistory = async () => {
    if (confirm('确定要清空所有历史记录吗？此操作不可撤销。')) {
      try {
        clearHistory();
        setHistory([]);
        toast({
          title: "清空成功",
          description: "所有历史记录已清空"
        });
      } catch (error) {
        toast({
          title: "清空失败",
          description: "无法清空历史记录",
          variant: "destructive"
        });
      }
    }
  };

  // 获取状态样式
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success':
        return { color: 'bg-green-500', label: '成功', variant: 'success' as const };
      case 'partial':
        return { color: 'bg-yellow-500', label: '部分成功', variant: 'warning' as const };
      case 'failed':
        return { color: 'bg-red-500', label: '失败', variant: 'destructive' as const };
      default:
        return { color: 'bg-gray-500', label: '未知', variant: 'secondary' as const };
    }
  };

  // 格式化时间
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 格式化作用域
  const formatScope = (scope: any) => {
    if (scope.kind === 'document') return '整个文档';
    if (scope.kind === 'chapter') return `第${scope.title}章`;
    if (scope.kind === 'section') return `${scope.title}段落`;
    if (scope.kind === 'selection') return '选中内容';
    return scope.kind || '未知范围';
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-[#6E5BFF]" />
            <div>
              <CardTitle className="text-base font-semibold">操作审计</CardTitle>
              <p className="text-sm text-[#5B667A] mt-1">查看和管理所有 Agent 操作历史</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadHistory}
            disabled={loading}
            className="rounded-full"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* 操作栏 */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="rounded-full text-xs"
          >
            <Download className="h-3 w-3 mr-1.5" />
            导出日志
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
            className="rounded-full text-xs text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3 mr-1.5" />
            清空历史
          </Button>
        </div>

        {/* 统计信息 */}
        {history.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-[#F7F8FB] rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{history.length}</div>
              <div className="text-xs text-gray-600">总操作数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {history.filter(h => h.status === 'success').length}
              </div>
              <div className="text-xs text-gray-600">成功操作</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {history.reduce((sum, h) => sum + h.stepsCount, 0)}
              </div>
              <div className="text-xs text-gray-600">总步骤数</div>
            </div>
          </div>
        )}

        {/* 历史记录列表 */}
        <ScrollArea className="max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">加载中...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">暂无操作历史</h3>
              <p className="text-sm text-gray-500">当您使用 Agent 功能时，操作记录会显示在这里</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const statusConfig = getStatusConfig(item.status);
                const isUndoing = undoingOps.has(item.operationId);
                
                return (
                  <div
                    key={item.operationId}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* 操作头部 */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
                          <Badge variant={statusConfig.variant} className="text-xs">
                            {statusConfig.label}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {item.stepsCount} 步骤
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {item.command}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {formatScope(item.scope)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(item.timestamp)}
                          </div>
                        </div>
                      </div>
                      
                      {/* 撤销按钮 */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUndo(item.operationId)}
                        disabled={isUndoing || item.status === 'failed'}
                        className="h-8 w-8 p-0 ml-2"
                        title="撤销此操作"
                      >
                        {isUndoing ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Undo2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AuditPanel;