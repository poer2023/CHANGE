import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  TrendingUp, 
  Activity, 
  DollarSign, 
  FileText,
  MessageSquare,
  Search,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  BookOpen,
  Globe,
  CheckCircle,
  Wallet,
  Crown
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { useCredit, TransactionRecord } from '@/contexts/CreditContext';
import { formatPrice, formatWordCount, ServiceType, PRICING_CONFIG } from '@/lib/pricing';

type FilterPeriod = 'all' | '7d' | '30d' | '90d' | '1y';
type FilterType = 'all' | TransactionRecord['type'];
type FilterService = 'all' | ServiceType;

const UsageHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState<FilterPeriod>('30d');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [serviceFilter, setServiceFilter] = useState<FilterService>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { toast } = useToast();
  const { 
    balance, 
    transactions, 
    usageStats, 
    getTransactionHistory, 
    getUsageByService, 
    refreshBalance,
    isLoading 
  } = useCredit();

  // 过滤交易记录
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query) ||
        (transaction.metadata?.essayTitle && transaction.metadata.essayTitle.toLowerCase().includes(query))
      );
    }

    // 类型过滤
    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }

    // 服务类型过滤
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.serviceType === serviceFilter);
    }

    // 时间过滤
    if (periodFilter !== 'all') {
      const now = new Date();
      const periodMap = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      };
      const days = periodMap[periodFilter];
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(transaction => transaction.createdAt >= cutoffDate);
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [transactions, searchQuery, typeFilter, serviceFilter, periodFilter]);

  // 分页
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 计算统计数据
  const periodStats = useMemo(() => {
    const periodTransactions = filteredTransactions.filter(t => t.type === 'usage');
    const totalSpent = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalWords = periodTransactions.reduce((sum, t) => sum + Math.abs(t.wordCount), 0);
    const avgPerTransaction = periodTransactions.length > 0 ? totalSpent / periodTransactions.length : 0;
    
    // 服务分布
    const serviceDistribution = Object.entries(PRICING_CONFIG).map(([key, config]) => {
      const usage = getUsageByService(key as ServiceType);
      return {
        service: config.name,
        words: usage.words,
        amount: usage.amount,
        count: usage.count,
        percentage: totalWords > 0 ? (usage.words / totalWords) * 100 : 0
      };
    });

    return {
      totalSpent,
      totalWords,
      totalTransactions: periodTransactions.length,
      avgPerTransaction,
      serviceDistribution: serviceDistribution.filter(s => s.count > 0)
    };
  }, [filteredTransactions, getUsageByService]);

  // 获取交易类型显示信息
  const getTransactionTypeInfo = (type: TransactionRecord['type']) => {
    const typeMap = {
      usage: { text: '消费', color: 'bg-red-100 text-red-800', icon: ArrowDownRight },
      recharge: { text: '充值', color: 'bg-green-100 text-green-800', icon: ArrowUpRight },
      bonus: { text: '赠送', color: 'bg-blue-100 text-blue-800', icon: ArrowUpRight },
      refund: { text: '退款', color: 'bg-yellow-100 text-yellow-800', icon: ArrowUpRight },
    };
    return typeMap[type] || typeMap.usage;
  };

  // 获取服务类型图标
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

  // 格式化时间
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 导出数据
  const handleExport = () => {
    toast({
      title: "导出数据",
      description: "使用记录导出功能正在开发中...",
    });
  };

  // 刷新数据
  const handleRefresh = async () => {
    await refreshBalance();
    toast({
      title: "数据已刷新",
      description: "使用记录和余额信息已更新",
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto p-6">
            {/* 页面标题 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold">使用记录</h1>
                  <p className="text-gray-600">查看你的AI服务使用详情和消费统计</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  刷新
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  导出
                </Button>
              </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{formatPrice(periodStats.totalSpent)}</p>
                    <p className="text-sm text-gray-600">总消费</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{formatWordCount(periodStats.totalWords)}</p>
                    <p className="text-sm text-gray-600">总字数</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{periodStats.totalTransactions}</p>
                    <p className="text-sm text-gray-600">交易次数</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{formatPrice(periodStats.avgPerTransaction)}</p>
                    <p className="text-sm text-gray-600">平均消费</p>
                  </div>
                </div>
              </Card>
            </div>

            <Tabs defaultValue="transactions" className="space-y-6">
              <TabsList>
                <TabsTrigger value="transactions">交易记录</TabsTrigger>
                <TabsTrigger value="statistics">统计分析</TabsTrigger>
              </TabsList>

              {/* 交易记录页面 */}
              <TabsContent value="transactions" className="space-y-6">
                {/* 搜索和过滤 */}
                <Card className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="搜索交易记录..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {filteredTransactions.length} / {transactions.length} 条记录
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <Select value={periodFilter} onValueChange={(value) => setPeriodFilter(value as FilterPeriod)}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="时间范围" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部时间</SelectItem>
                          <SelectItem value="7d">最近7天</SelectItem>
                          <SelectItem value="30d">最近30天</SelectItem>
                          <SelectItem value="90d">最近90天</SelectItem>
                          <SelectItem value="1y">最近一年</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as FilterType)}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="交易类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有类型</SelectItem>
                          <SelectItem value="usage">消费</SelectItem>
                          <SelectItem value="recharge">充值</SelectItem>
                          <SelectItem value="bonus">赠送</SelectItem>
                          <SelectItem value="refund">退款</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={serviceFilter} onValueChange={(value) => setServiceFilter(value as FilterService)}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="服务类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有服务</SelectItem>
                          <SelectItem value="essay_generation">论文生成</SelectItem>
                          <SelectItem value="ai_chat">AI对话</SelectItem>
                          <SelectItem value="document_analysis">文档分析</SelectItem>
                          <SelectItem value="translation">智能翻译</SelectItem>
                          <SelectItem value="ai_detection">AI检测</SelectItem>
                          <SelectItem value="plagiarism_detection">抄袭检测</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                {/* 交易记录表格 */}
                <Card>
                  <CardHeader>
                    <CardTitle>交易明细</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {paginatedTransactions.length > 0 ? (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>时间</TableHead>
                              <TableHead>类型</TableHead>
                              <TableHead>服务</TableHead>
                              <TableHead>描述</TableHead>
                              <TableHead>字数变动</TableHead>
                              <TableHead>金额</TableHead>
                              <TableHead>余额</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedTransactions.map((transaction) => {
                              const typeInfo = getTransactionTypeInfo(transaction.type);
                              const ServiceIcon = getServiceIcon(transaction.serviceType);
                              
                              return (
                                <TableRow key={transaction.id}>
                                  <TableCell className="text-sm">
                                    {formatDate(transaction.createdAt)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={typeInfo.color}>
                                      <typeInfo.icon className="h-3 w-3 mr-1" />
                                      {typeInfo.text}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {transaction.serviceType ? (
                                      <div className="flex items-center gap-2">
                                        <ServiceIcon className="h-4 w-4 text-gray-600" />
                                        <span className="text-sm">
                                          {PRICING_CONFIG[transaction.serviceType]?.name || '未知服务'}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-500">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <p className="text-sm font-medium">{transaction.description}</p>
                                      {transaction.metadata?.essayTitle && (
                                        <p className="text-xs text-gray-600">
                                          {transaction.metadata.essayTitle}
                                        </p>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className={`font-medium ${
                                      transaction.wordCount > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {transaction.wordCount > 0 ? '+' : ''}{formatWordCount(Math.abs(transaction.wordCount))}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <span className={`font-medium ${
                                      transaction.type === 'usage' ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                      {transaction.type === 'usage' ? '-' : '+'}
                                      {formatPrice(transaction.amount)}
                                    </span>
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {formatWordCount(transaction.balance)}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>

                        {/* 分页 */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-gray-600">
                              显示 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} 条，
                              共 {filteredTransactions.length} 条记录
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                              >
                                上一页
                              </Button>
                              <span className="text-sm">
                                {currentPage} / {totalPages}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                              >
                                下一页
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          {searchQuery || typeFilter !== 'all' || serviceFilter !== 'all' || periodFilter !== 'all'
                            ? '没有找到匹配的记录'
                            : '暂无使用记录'
                          }
                        </h3>
                        <p className="text-gray-600">
                          {searchQuery || typeFilter !== 'all' || serviceFilter !== 'all' || periodFilter !== 'all'
                            ? '尝试调整搜索条件或筛选器'
                            : '开始使用AI服务后，记录将在这里显示'
                          }
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 统计分析页面 */}
              <TabsContent value="statistics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 服务使用分布 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        服务使用分布
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {periodStats.serviceDistribution.length > 0 ? (
                        <div className="space-y-4">
                          {periodStats.serviceDistribution.map((service, index) => (
                            <div key={service.service} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{service.service}</span>
                                <span className="text-gray-600">
                                  {formatWordCount(service.words)} ({service.percentage.toFixed(1)}%)
                                </span>
                              </div>
                              <Progress value={service.percentage} className="h-2" />
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>{service.count} 次使用</span>
                                <span>{formatPrice(service.amount)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">暂无使用数据</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* 账户概览 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        账户概览
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {formatWordCount(balance.wordBalance)}
                          </p>
                          <p className="text-sm text-gray-600">当前余额</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {formatPrice(balance.totalRecharged)}
                          </p>
                          <p className="text-sm text-gray-600">累计充值</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">VIP等级</span>
                          <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium">{balance.vipLevel.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">专属折扣</span>
                          <span className="font-medium text-blue-600">{balance.vipLevel.discount}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">累计消费</span>
                          <span className="font-medium">{formatPrice(balance.totalSpent)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">最后更新</span>
                          <span className="text-sm text-gray-600">
                            {formatDate(balance.lastUpdated)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* VIP权益 */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-600" />
                        VIP权益说明
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">当前权益</h4>
                          <div className="space-y-2">
                            {balance.vipLevel.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">升级说明</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>• 青铜会员：累计消费满 ¥100</p>
                            <p>• 白银会员：累计消费满 ¥500</p>
                            <p>• 黄金会员：累计消费满 ¥1500</p>
                            <p>• 钻石会员：累计消费满 ¥5000</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default UsageHistory;