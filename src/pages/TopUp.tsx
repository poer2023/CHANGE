import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CreditCard, 
  Wallet, 
  Gift, 
  Star, 
  CheckCircle, 
  Loader2,
  Crown,
  TrendingUp,
  Clock,
  Smartphone,
  Building,
  History as HistoryIcon,
  Search,
  Filter,
  ArrowUpCircle,
  Zap
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { useCredit } from '@/contexts/CreditContext';
import { CREDIT_PACKAGES, formatPrice, formatWordCount, getTotalWords, getPricePerWord } from '@/lib/pricing';
import type { CreditPackage } from '@/lib/pricing';

type PaymentMethod = 'alipay' | 'wechat' | 'bank';

const TopUp: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('alipay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | '7d' | '30d' | '90d'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');

  const { toast } = useToast();
  const { balance, rechargeHistory, recharge, isLoading } = useCredit();

  // 支付方式配置
  const paymentMethods = [
    { id: 'alipay', name: '支付宝', icon: Smartphone, description: '快速安全，即时到账' },
    { id: 'wechat', name: '微信支付', icon: Smartphone, description: '微信扫码，便捷支付' },
    { id: 'bank', name: '银行卡', icon: Building, description: '银行卡直接支付' },
  ];

  // 过滤充值历史
  const filteredHistory = useMemo(() => {
    let filtered = rechargeHistory;

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record =>
        record.packageName.toLowerCase().includes(query) ||
        record.paymentMethod.toLowerCase().includes(query) ||
        record.id.toLowerCase().includes(query)
      );
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    // 时间过滤
    if (dateFilter !== 'all') {
      const now = new Date();
      const days = { '7d': 7, '30d': 30, '90d': 90 }[dateFilter] || 0;
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(record => record.createdAt >= cutoffDate);
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [rechargeHistory, searchQuery, statusFilter, dateFilter]);

  // 获取状态显示信息
  const getStatusInfo = (status: 'pending' | 'success' | 'failed') => {
    const statusMap = {
      pending: { text: '处理中', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      success: { text: '成功', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      failed: { text: '失败', color: 'bg-red-100 text-red-800', icon: ArrowUpCircle },
    };
    return statusMap[status];
  };

  // 处理充值
  const handleRecharge = async () => {
    if (!selectedPackage) {
      toast({
        title: "请选择套餐",
        description: "请先选择一个充值套餐",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const success = await recharge(selectedPackage.id, paymentMethods.find(m => m.id === paymentMethod)?.name || '支付宝');
      
      if (success) {
        toast({
          title: "充值成功",
          description: `已成功充值${formatWordCount(getTotalWords(selectedPackage))}`,
        });
        setSelectedPackage(null);
      } else {
        toast({
          title: "充值失败",
          description: "支付失败，请重试",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "充值失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
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

  // 计算统计数据
  const stats = useMemo(() => {
    const successfulRecharges = rechargeHistory.filter(r => r.status === 'success');
    return {
      totalAmount: successfulRecharges.reduce((sum, r) => sum + r.amount, 0),
      totalWords: successfulRecharges.reduce((sum, r) => sum + r.wordCount + r.bonusWords, 0),
      totalTransactions: successfulRecharges.length,
      thisMonthAmount: successfulRecharges
        .filter(r => {
          const thisMonth = new Date();
          thisMonth.setDate(1);
          thisMonth.setHours(0, 0, 0, 0);
          return r.createdAt >= thisMonth;
        })
        .reduce((sum, r) => sum + r.amount, 0)
    };
  }, [rechargeHistory]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto p-6">
            {/* 页面标题 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold">字数充值</h1>
                  <p className="text-gray-600">选择合适的套餐，畅享AI写作服务</p>
                </div>
              </div>
              {/* 用户余额信息 */}
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{formatWordCount(balance.wordBalance)}</p>
                    <p className="text-sm text-gray-600">当前余额</p>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Crown className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm font-medium">{balance.vipLevel.name}</p>
                    </div>
                    <p className="text-xs text-gray-600">{balance.vipLevel.discount}%折扣</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{formatPrice(stats.totalAmount)}</p>
                    <p className="text-sm text-gray-600">累计充值</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{formatWordCount(stats.totalWords)}</p>
                    <p className="text-sm text-gray-600">累计字数</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalTransactions}</p>
                    <p className="text-sm text-gray-600">充值次数</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{formatPrice(stats.thisMonthAmount)}</p>
                    <p className="text-sm text-gray-600">本月充值</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 套餐选择 */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      选择充值套餐
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {CREDIT_PACKAGES.map((pkg) => (
                        <Card 
                          key={pkg.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedPackage?.id === pkg.id 
                              ? 'ring-2 ring-blue-500 bg-blue-50' 
                              : ''
                          } ${pkg.isPopular ? 'border-blue-500' : ''}`}
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {pkg.name}
                                  {pkg.isPopular && (
                                    <Badge className="bg-red-500 text-white">
                                      <Star className="h-3 w-3 mr-1" />
                                      热门
                                    </Badge>
                                  )}
                                </CardTitle>
                                <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                              </div>
                              {selectedPackage?.id === pkg.id && (
                                <CheckCircle className="h-5 w-5 text-blue-500" />
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              {/* 价格信息 */}
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-blue-600">
                                  {formatPrice(pkg.salePrice)}
                                </span>
                                {pkg.discount > 0 && (
                                  <>
                                    <span className="text-sm text-gray-500 line-through">
                                      {formatPrice(pkg.originalPrice)}
                                    </span>
                                    <Badge variant="destructive" className="text-xs">
                                      {pkg.discount}%折扣
                                    </Badge>
                                  </>
                                )}
                              </div>

                              {/* 字数信息 */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">基础字数</span>
                                  <span className="font-medium">{formatWordCount(pkg.words)}</span>
                                </div>
                                {pkg.bonusWords && pkg.bonusWords > 0 && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">赠送字数</span>
                                    <span className="font-medium text-green-600">+{formatWordCount(pkg.bonusWords)}</span>
                                  </div>
                                )}
                                <Separator />
                                <div className="flex items-center justify-between font-medium">
                                  <span>总字数</span>
                                  <span className="text-blue-600">{formatWordCount(getTotalWords(pkg))}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                  <span>单字价格</span>
                                  <span>{(getPricePerWord(pkg) * 1000).toFixed(2)}元/千字</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 支付方式和确认 */}
              <div className="space-y-6">
                {/* 支付方式选择 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      支付方式
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {paymentMethods.map((method) => (
                      <Card
                        key={method.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          paymentMethod === method.id 
                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <method.icon className="h-5 w-5 text-gray-600" />
                            <div className="flex-1">
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                            {paymentMethod === method.id && (
                              <CheckCircle className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>

                {/* 订单确认 */}
                {selectedPackage && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        订单确认
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">套餐</span>
                          <span className="font-medium">{selectedPackage.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">字数</span>
                          <span className="font-medium">{formatWordCount(getTotalWords(selectedPackage))}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">支付方式</span>
                          <span className="font-medium">
                            {paymentMethods.find(m => m.id === paymentMethod)?.name}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between text-lg font-semibold">
                          <span>支付金额</span>
                          <span className="text-blue-600">{formatPrice(selectedPackage.salePrice)}</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleRecharge}
                        disabled={isProcessing || isLoading}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            处理中...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            立即支付
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* 充值历史 */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <HistoryIcon className="h-5 w-5" />
                    充值历史
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="搜索记录..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-48"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="success">成功</SelectItem>
                        <SelectItem value="pending">处理中</SelectItem>
                        <SelectItem value="failed">失败</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as typeof dateFilter)}>
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredHistory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>订单号</TableHead>
                        <TableHead>套餐</TableHead>
                        <TableHead>字数</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>支付方式</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.map((record) => {
                        const statusInfo = getStatusInfo(record.status);
                        return (
                          <TableRow key={record.id}>
                            <TableCell className="font-mono text-sm">{record.id}</TableCell>
                            <TableCell className="font-medium">{record.packageName}</TableCell>
                            <TableCell>
                              <div>
                                <div>{formatWordCount(record.wordCount)}</div>
                                {record.bonusWords > 0 && (
                                  <div className="text-xs text-green-600">+{formatWordCount(record.bonusWords)}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{formatPrice(record.amount)}</TableCell>
                            <TableCell>{record.paymentMethod}</TableCell>
                            <TableCell>
                              <Badge className={statusInfo.color}>
                                <statusInfo.icon className="h-3 w-3 mr-1" />
                                {statusInfo.text}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(record.createdAt)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                        ? '没有找到匹配的记录'
                        : '暂无充值记录'
                      }
                    </h3>
                    <p className="text-gray-600">
                      {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                        ? '尝试调整搜索条件或筛选器'
                        : '选择合适的套餐开始充值吧'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TopUp;