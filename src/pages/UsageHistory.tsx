import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Progress } from '@/components/ui/progress';
import { 
  Search,
  Download,
  FileText,
  MessageSquare,
  BookOpen,
  Globe,
  CheckCircle,
  Calendar,
  RotateCcw,
  DollarSign,
  TrendingUp,
  Activity,
  BarChart3,
  Wallet,
  CreditCard
} from 'lucide-react';
import AppSidebarEnhanced from '@/components/AppSidebarEnhanced';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { useCredit, TransactionRecord } from '@/contexts/CreditContext';
import { formatPrice, formatWordCount, ServiceType, PRICING_CONFIG } from '@/lib/pricing';

type FilterPeriod = 'all' | '7d' | '30d' | '90d';
type FilterType = 'all' | TransactionRecord['type'];
type FilterService = 'all' | ServiceType;

interface KpiItem {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

interface TransactionDetail {
  id: string;
  time: string;
  type: string;
  service: string;
  deltaMoneyFormatted: string;
  deltaCharsFormatted: string;
  balanceChars: number;
  note: string;
  metadata?: Record<string, any>;
}

// KPI行组件
function KpiRow({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid grid-cols-4 gap-6 mb-8 sm:grid-cols-2">
      {items.map((item, index) => (
        <div 
          key={index}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)]"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{item.value}</div>
              <div className="text-sm text-slate-600">{item.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 过滤工具栏组件
function RecordsToolbar({ 
  searchQuery, 
  setSearchQuery,
  periodFilter,
  setPeriodFilter,
  typeFilter,
  setTypeFilter,
  serviceFilter,
  setServiceFilter,
  filteredCount,
  totalCount,
  onReset
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  periodFilter: FilterPeriod;
  setPeriodFilter: (value: FilterPeriod) => void;
  typeFilter: FilterType;
  setTypeFilter: (value: FilterType) => void;
  serviceFilter: FilterService;
  setServiceFilter: (value: FilterService) => void;
  filteredCount: number;
  totalCount: number;
  onReset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)] mb-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="搜索交易ID/备注…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="bg-slate-100 px-3 py-2 rounded-lg text-sm text-slate-600">
            {filteredCount} 条结果
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={periodFilter} onValueChange={(value) => setPeriodFilter(value as FilterPeriod)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部时间</SelectItem>
              <SelectItem value="7d">最近7天</SelectItem>
              <SelectItem value="30d">最近30天</SelectItem>
              <SelectItem value="90d">最近90天</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as FilterType)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="usage">扣费</SelectItem>
              <SelectItem value="recharge">充值</SelectItem>
            </SelectContent>
          </Select>

          <Select value={serviceFilter} onValueChange={(value) => setServiceFilter(value as FilterService)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部服务</SelectItem>
              <SelectItem value="essay_generation">论文生成</SelectItem>
              <SelectItem value="ai_chat">AI对话</SelectItem>
              <SelectItem value="document_analysis">文档分析</SelectItem>
              <SelectItem value="translation">智能翻译</SelectItem>
              <SelectItem value="ai_detection">AI检测</SelectItem>
              <SelectItem value="plagiarism_detection">抄袭检测</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={onReset} size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            重置
          </Button>
        </div>
      </div>
    </div>
  );
}

// 数据表格组件
function DataTable({ 
  transactions, 
  onExport, 
  onRowClick 
}: { 
  transactions: TransactionRecord[]; 
  onExport: () => void;
  onRowClick: (transaction: TransactionRecord) => void;
}) {
  const getTransactionTypeInfo = (type: TransactionRecord['type']) => {
    const typeMap = {
      usage: { text: '扣费', color: 'bg-rose-100 text-rose-700' },
      recharge: { text: '充值', color: 'bg-emerald-100 text-emerald-700' },
      bonus: { text: '赠送', color: 'bg-blue-100 text-blue-700' },
      refund: { text: '退款', color: 'bg-amber-100 text-amber-700' },
    };
    return typeMap[type] || typeMap.usage;
  };

  const getServiceIcon = (serviceType?: ServiceType) => {
    const iconMap = {
      essay_generation: FileText,
      ai_chat: MessageSquare,
      document_analysis: BookOpen,
      translation: Globe,
      ai_detection: CheckCircle,
      plagiarism_detection: Search,
    };
    return serviceType ? iconMap[serviceType] : Activity;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <h3 className="text-lg font-medium text-slate-900">交易明细</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            导出 CSV
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            导出 PDF
          </Button>
        </div>
      </div>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>服务</TableHead>
                <TableHead>金额变动</TableHead>
                <TableHead>字数变动</TableHead>
                <TableHead>余额(字)</TableHead>
                <TableHead>备注</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const typeInfo = getTransactionTypeInfo(transaction.type);
                const ServiceIcon = getServiceIcon(transaction.serviceType);
                
                return (
                  <TableRow 
                    key={transaction.id} 
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => onRowClick(transaction)}
                  >
                    <TableCell className="text-sm text-slate-700">
                      {formatDate(transaction.createdAt)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${typeInfo.color}`}>
                        {typeInfo.text}
                      </span>
                    </TableCell>
                    <TableCell>
                      {transaction.serviceType ? (
                        <div className="flex items-center gap-2">
                          <ServiceIcon className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-700">
                            {PRICING_CONFIG[transaction.serviceType]?.name || '未知服务'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        transaction.type === 'usage' ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        {transaction.type === 'usage' ? '-' : '+'}
                        ¥{transaction.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        transaction.wordCount > 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {transaction.wordCount > 0 ? '+' : ''}
                        {formatWordCount(Math.abs(transaction.wordCount))}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      {formatWordCount(transaction.balance)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 max-w-xs truncate">
                      {transaction.description}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-base font-medium text-slate-900 mb-2">没有匹配的记录</h3>
          <p className="text-slate-500">调整搜索条件以查看更多结果</p>
        </div>
      )}

      <div className="px-6 py-4 border-t border-slate-200 text-sm text-slate-600">
        第 1–{Math.min(20, transactions.length)} 条/共 {transactions.length} 条
      </div>
    </div>
  );
}

// 服务分布组件
function ServiceBars({ distribution }: { distribution: any[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium text-slate-900 mb-4">服务使用分布</h3>
      {distribution.length > 0 ? (
        distribution.slice(0, 5).map((service, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{service.service}</span>
              <div className="text-right">
                <div className="font-medium text-slate-900">{formatWordCount(service.words)}</div>
                <div className="text-xs text-slate-500">¥{service.amount.toFixed(2)}</div>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${service.percentage}%` }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <BarChart3 className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-500">暂无使用数据</p>
        </div>
      )}
    </div>
  );
}

// 账户摘要组件
function AccountSnapshot({ balance }: { balance: any }) {
  return (
    <div className="space-y-6">
      <h3 className="text-base font-medium text-slate-900">账户摘要</h3>
      
      <div className="space-y-4">
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {formatWordCount(balance.wordBalance)}
          </div>
          <div className="text-sm text-slate-600">当前可用字数</div>
        </div>
        
        <div className="text-center p-4 bg-emerald-50 rounded-xl">
          <div className="text-3xl font-bold text-emerald-600 mb-1">
            ¥{balance.totalRecharged}
          </div>
          <div className="text-sm text-slate-600">累计充值(￥)</div>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">累计消费(￥)</span>
          <span className="font-medium text-slate-900">¥{balance.totalSpent.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">最后一次充值时间</span>
          <span className="text-slate-500">2天前</span>
        </div>
      </div>

      <Button variant="outline" className="w-full">
        <CreditCard className="h-4 w-4 mr-2" />
        去充值
      </Button>
    </div>
  );
}

// 使用趋势组件（占位）
function UsageTrends() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium text-slate-900">使用趋势</h3>
      <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-500">趋势图表开发中</p>
        </div>
      </div>
    </div>
  );
}

// 交易详情抽屉组件
function TransactionDetailDrawer({ 
  isOpen, 
  onClose, 
  transaction 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  transaction: TransactionRecord | null;
}) {
  if (!transaction) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>交易详情</DrawerTitle>
          <DrawerDescription>
            交易ID: {transaction.id}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">交易时间:</span>
                <div className="font-medium">{transaction.createdAt.toLocaleString('zh-CN')}</div>
              </div>
              <div>
                <span className="text-slate-600">交易类型:</span>
                <div className="font-medium">{transaction.type}</div>
              </div>
              <div>
                <span className="text-slate-600">金额变动:</span>
                <div className="font-medium">¥{transaction.amount.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-slate-600">字数变动:</span>
                <div className="font-medium">{formatWordCount(Math.abs(transaction.wordCount))}</div>
              </div>
            </div>
            
            <div>
              <span className="text-slate-600 text-sm">描述:</span>
              <div className="font-medium">{transaction.description}</div>
            </div>

            {transaction.metadata && (
              <div>
                <span className="text-slate-600 text-sm">原始数据:</span>
                <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(transaction.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">关闭</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// 主组件
export default function UsageHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState<FilterPeriod>('30d');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [serviceFilter, setServiceFilter] = useState<FilterService>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

  const { toast } = useToast();
  const { balance, transactions, getUsageByService } = useCredit();

  // 过滤交易记录
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query)
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }

    if (serviceFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.serviceType === serviceFilter);
    }

    if (periodFilter !== 'all') {
      const now = new Date();
      const periodMap = { '7d': 7, '30d': 30, '90d': 90 };
      const days = periodMap[periodFilter];
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(transaction => transaction.createdAt >= cutoffDate);
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [transactions, searchQuery, typeFilter, serviceFilter, periodFilter]);

  // 计算KPI数据
  const kpiData = useMemo(() => {
    const usageTransactions = filteredTransactions.filter(t => t.type === 'usage');
    const totalSpent = usageTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalWords = usageTransactions.reduce((sum, t) => sum + Math.abs(t.wordCount), 0);
    const last30Days = transactions.filter(t => {
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return t.createdAt >= cutoff && t.type === 'usage';
    });
    const last30Words = last30Days.reduce((sum, t) => sum + Math.abs(t.wordCount), 0);

    return [
      {
        label: '总消耗金额',
        value: `¥${totalSpent.toFixed(2)}`,
        icon: DollarSign,
        color: 'bg-rose-100 text-rose-600'
      },
      {
        label: '总字数',
        value: formatWordCount(totalWords),
        icon: Activity,
        color: 'bg-blue-100 text-blue-600'
      },
      {
        label: '交易次数',
        value: usageTransactions.length.toString(),
        icon: BarChart3,
        color: 'bg-purple-100 text-purple-600'
      },
      {
        label: '近30天字数',
        value: formatWordCount(last30Words),
        icon: TrendingUp,
        color: 'bg-emerald-100 text-emerald-600'
      }
    ];
  }, [filteredTransactions, transactions]);

  // 计算服务分布
  const serviceDistribution = useMemo(() => {
    const totalWords = filteredTransactions
      .filter(t => t.type === 'usage')
      .reduce((sum, t) => sum + Math.abs(t.wordCount), 0);

    return Object.entries(PRICING_CONFIG).map(([key, config]) => {
      const usage = getUsageByService(key as ServiceType);
      return {
        service: config.name,
        words: usage.words,
        amount: usage.amount,
        count: usage.count,
        percentage: totalWords > 0 ? (usage.words / totalWords) * 100 : 0
      };
    }).filter(s => s.count > 0).sort((a, b) => b.words - a.words);
  }, [filteredTransactions, getUsageByService]);

  const handleReset = () => {
    setSearchQuery('');
    setPeriodFilter('30d');
    setTypeFilter('all');
    setServiceFilter('all');
  };

  const handleExport = () => {
    toast({
      title: "导出任务已开始",
      description: "文件将在准备完成后自动下载"
    });
  };

  const handleRowClick = (transaction: TransactionRecord) => {
    setSelectedTransaction(transaction);
    setDetailDrawerOpen(true);
  };

  return (
    <SidebarProvider>
      <AppSidebarEnhanced />
      <SidebarInset>
        <div className="min-h-screen bg-slate-50">
          <div className="mx-auto max-w-[1100px] px-4 py-8">
            {/* 页面标题 */}
            <header className="mb-6">
              <h1 className="text-2xl font-semibold text-slate-900">使用记录</h1>
              <p className="text-slate-500 mt-1">查看你的消费与字数使用情况</p>
            </header>

            {/* KPI行 */}
            <KpiRow items={kpiData} />

            {/* Tabs */}
            <Tabs defaultValue="records" className="space-y-6">
              <TabsList className="grid w-fit grid-cols-2">
                <TabsTrigger value="records">交易记录</TabsTrigger>
                <TabsTrigger value="analytics">统计分析</TabsTrigger>
              </TabsList>

              {/* 交易记录Tab */}
              <TabsContent value="records" className="space-y-6">
                <RecordsToolbar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  periodFilter={periodFilter}
                  setPeriodFilter={setPeriodFilter}
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  serviceFilter={serviceFilter}
                  setServiceFilter={setServiceFilter}
                  filteredCount={filteredTransactions.length}
                  totalCount={transactions.length}
                  onReset={handleReset}
                />

                <DataTable
                  transactions={filteredTransactions.slice(0, 20)}
                  onExport={handleExport}
                  onRowClick={handleRowClick}
                />
              </TabsContent>

              {/* 统计分析Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
                    <ServiceBars distribution={serviceDistribution} />
                  </div>
                  
                  <div className="col-span-12 lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
                    <AccountSnapshot balance={balance} />
                  </div>
                  
                  <div className="col-span-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
                    <UsageTrends />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* 交易详情抽屉 */}
            <TransactionDetailDrawer
              isOpen={detailDrawerOpen}
              onClose={() => setDetailDrawerOpen(false)}
              transaction={selectedTransaction}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}