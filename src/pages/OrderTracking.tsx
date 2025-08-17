import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  CheckCircle, 
  RefreshCw,
  FileText,
  Search,
  PenTool,
  Shield,
  Download,
  User,
  Copy,
  AlertTriangle
} from 'lucide-react';
import AppSidebarEnhanced from '@/components/AppSidebarEnhanced';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

interface OrderStage {
  key: string;
  name: string;
  status: 'done' | 'running' | 'pending' | 'blocked';
  percent?: number;
  eta?: string;
  startedAt?: string;
  finishedAt?: string;
  durationMin?: number;
  reason?: string;
}

interface OrderSummary {
  client: string;
  orderId: string;
  title: string;
  type: string;
  dueAt: string;
  requiredChars: number;
  progress: {
    percent: number;
    currentStage: string;
    elapsed: number;
    eta: number;
  };
}

// 订单概要卡片
function OrderHeaderCard({ summary }: { summary: OrderSummary }) {
  const { toast } = useToast();
  
  const copyOrderId = () => {
    navigator.clipboard.writeText(summary.orderId);
    toast({ title: "已复制", description: "订单号已复制到剪贴板" });
  };

  const getRemainingTime = () => {
    const now = new Date();
    const deadline = new Date(summary.dueAt);
    const diffInHours = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60)));
    return diffInHours;
  };

  const remainingHours = getRemainingTime();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)] mb-6">
      <h2 className="text-lg font-medium text-slate-900 mb-4">订单概要</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-500" />
          <div>
            <div className="text-xs text-slate-500">客户名</div>
            <div className="font-medium text-slate-900">{summary.client}</div>
          </div>
        </div>
        
        <div>
          <div className="text-xs text-slate-500">订单号</div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-blue-600">{summary.orderId}</span>
            <button 
              onClick={copyOrderId}
              className="p-1 hover:bg-slate-100 rounded"
              aria-label="复制订单号"
            >
              <Copy className="h-3 w-3 text-slate-400" />
            </button>
          </div>
        </div>
        
        <div>
          <div className="text-xs text-slate-500">截止时间</div>
          <div className={`font-medium ${remainingHours < 24 ? 'text-red-600' : 'text-slate-900'}`}>
            剩余 {remainingHours} 小时
          </div>
        </div>
        
        <div>
          <div className="text-xs text-slate-500">字数要求</div>
          <div className="font-medium text-slate-900">{summary.requiredChars.toLocaleString()} 字</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500 mb-1">论文标题</div>
        <div className="font-medium text-slate-900">{summary.title}</div>
        <div className="text-sm text-slate-600 mt-1">{summary.type}</div>
      </div>
    </div>
  );
}

// 总体进度卡片
function OverallProgressCard({ summary }: { summary: OrderSummary }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)] mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-slate-900">总体进度</h2>
        <div className="text-3xl font-bold text-blue-600">{summary.progress.percent}%</div>
      </div>
      
      <div className="mb-4">
        <Progress value={summary.progress.percent} className="h-3" />
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-slate-500">当前阶段</div>
          <div className="font-medium text-slate-900">{summary.progress.currentStage}</div>
        </div>
        <div>
          <div className="text-slate-500">已耗时</div>
          <div className="font-medium text-slate-900">{summary.progress.elapsed} 分钟</div>
        </div>
        <div>
          <div className="text-slate-500">预计剩余</div>
          <div className="font-medium text-slate-900">{summary.progress.eta} 分钟</div>
        </div>
      </div>
    </div>
  );
}

// 阶段项目组件
function StageItem({ stage }: { stage: OrderStage }) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'done':
        return {
          icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
          label: '已完成',
          color: 'bg-emerald-100 text-emerald-700'
        };
      case 'running':
        return {
          icon: <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />,
          label: '进行中',
          color: 'bg-blue-100 text-blue-700'
        };
      case 'blocked':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
          label: '阻塞',
          color: 'bg-red-100 text-red-700'
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-slate-400" />,
          label: '待开始',
          color: 'bg-slate-100 text-slate-600'
        };
    }
  };

  const statusInfo = getStatusInfo(stage.status);

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)] ${
      stage.status === 'running' ? 'ring-2 ring-blue-200' : ''
    }`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {statusInfo.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-slate-900">{stage.name}</h3>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              {stage.status === 'done' && stage.durationMin && (
                <span className="text-sm text-slate-500">{stage.durationMin} 分钟</span>
              )}
              {stage.status === 'running' && stage.eta && (
                <span className="text-sm text-slate-500">预计 {stage.eta}</span>
              )}
            </div>
          </div>

          {stage.status === 'running' && stage.percent !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">完成进度</span>
                <span className="font-medium text-blue-600">{stage.percent}%</span>
              </div>
              <Progress value={stage.percent} className="h-2" />
            </div>
          )}

          {stage.status === 'done' && stage.finishedAt && (
            <div className="text-sm text-slate-500">
              完成时间: {new Date(stage.finishedAt).toLocaleString('zh-CN')}
            </div>
          )}

          {stage.status === 'blocked' && stage.reason && (
            <div className="mt-2 p-3 bg-red-50 rounded-lg">
              <div className="text-sm text-red-700">{stage.reason}</div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">重试</Button>
                <Button variant="outline" size="sm">联系支持</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 主组件
export default function OrderTracking() {
  const { orderId } = useParams();
  const [refreshing, setRefreshing] = useState(false);
  
  // 模拟数据
  const [summary] = useState<OrderSummary>({
    client: '张同学',
    orderId: orderId || 'EP-2024-001234',
    title: '人工智能在教育领域的应用与发展前景研究',
    type: '研究性论文',
    dueAt: '2024-12-25T23:59:00',
    requiredChars: 3000,
    progress: {
      percent: 65,
      currentStage: '内容写作',
      elapsed: 85,
      eta: 45
    }
  });

  const [stages] = useState<OrderStage[]>([
    {
      key: 'analysis',
      name: '需求分析',
      status: 'done',
      durationMin: 5,
      finishedAt: '2024-12-23T10:05:00'
    },
    {
      key: 'outline',
      name: '大纲制作',
      status: 'done',
      durationMin: 25,
      finishedAt: '2024-12-23T10:30:00'
    },
    {
      key: 'writing',
      name: '内容写作',
      status: 'running',
      percent: 65,
      eta: '45分钟'
    },
    {
      key: 'quality',
      name: 'AI质量检测',
      status: 'pending'
    },
    {
      key: 'format',
      name: '格式标准化',
      status: 'pending'
    },
    {
      key: 'delivery',
      name: '最终交付',
      status: 'pending'
    }
  ]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <SidebarProvider>
      <AppSidebarEnhanced />
      <SidebarInset>
        <div className="min-h-screen bg-slate-50">
          <div className="mx-auto max-w-[1100px] px-4 py-8">
            {/* 页面标题 */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">订单进度跟踪</h1>
                <p className="text-slate-500 mt-1">实时查看订单处理进度与状态</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleRefresh} 
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                刷新状态
              </Button>
            </div>

            {/* 订单概要 */}
            <OrderHeaderCard summary={summary} />
            
            {/* 总体进度 */}
            <OverallProgressCard summary={summary} />
            
            {/* 阶段时间线 */}
            <div className="space-y-4">
              {stages.map((stage) => (
                <StageItem key={stage.key} stage={stage} />
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}