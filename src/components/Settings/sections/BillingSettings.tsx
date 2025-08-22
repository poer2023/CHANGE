import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Download, 
  Eye, 
  FileText, 
  Package, 
  Receipt,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { Order, Invoice } from '@/lib/types';
import { generateMockOrders, generateMockInvoices } from '@/lib/mockData';

const BillingSettings: React.FC = () => {
  const [orders] = useState<Order[]>(generateMockOrders(12));
  const [invoices] = useState<Invoice[]>(generateMockInvoices(8));
  const [showWordPackageDialog, setShowWordPackageDialog] = useState(false);

  // 模拟字数包余额（可选功能）
  const [wordPackageBalance] = useState(15000);
  const [hasWordPackage] = useState(true);

  const handleViewOrder = (orderId: string) => {
    toast.info(`查看订单详情：${orderId}`);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    if (invoice.url) {
      toast.success(`开始下载发票：${invoice.id}`);
      // TODO: 实际下载逻辑
    } else {
      toast.error('发票尚未生成');
    }
  };

  const handleRequestInvoice = () => {
    toast.success('补开发票申请已提交，我们将在3个工作日内处理');
  };

  const handleBuyWordPackage = () => {
    setShowWordPackageDialog(true);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatCurrency = (amount: number): string => {
    return `¥${amount.toFixed(2)}`;
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusMap = {
      paid: { label: '已付费', className: 'bg-green-100 text-green-800' },
      refunded: { label: '已退款', className: 'bg-gray-100 text-gray-800' },
      failed: { label: '支付失败', className: 'bg-red-100 text-red-800' }
    };

    const config = statusMap[status];
    return (
      <Badge variant="secondary" className={`text-xs ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const getInvoiceStatusBadge = (status: Invoice['status']) => {
    const statusMap = {
      issued: { label: '已开具', className: 'bg-green-100 text-green-800' },
      pending: { label: '处理中', className: 'bg-amber-100 text-amber-800' }
    };

    const config = statusMap[status];
    return (
      <Badge variant="secondary" className={`text-xs ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  // 按月份分组发票
  const invoicesByMonth = invoices.reduce((acc, invoice) => {
    if (!acc[invoice.month]) {
      acc[invoice.month] = [];
    }
    acc[invoice.month].push(invoice);
    return acc;
  }, {} as Record<string, Invoice[]>);

  return (
    <div className="space-y-6">
      {/* 字数包余额（可选） */}
      {hasWordPackage && (
        <Card className="rounded-2xl border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-[16px] font-semibold flex items-center gap-2">
              <Package className="h-4 w-4" />
              字数包余额
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-foreground">
                  {wordPackageBalance.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">剩余字数</p>
              </div>
              <Button 
                variant="outline"
                className="rounded-xl"
                onClick={handleBuyWordPackage}
              >
                <Plus className="h-4 w-4 mr-2" />
                购买字数包
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 订单记录 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            订单记录
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单时间</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>标题</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {order.type === 'gate1' ? '基础解锁' : '附加服务'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {order.title}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(order.amount)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        详情
                      </Button>
                      {order.invoiceId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => {
                            const invoice = invoices.find(inv => inv.id === order.invoiceId);
                            if (invoice) handleDownloadInvoice(invoice);
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          发票
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 发票列表 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              发票管理
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={handleRequestInvoice}
            >
              <FileText className="h-3 w-3 mr-1" />
              申请补开
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(invoicesByMonth)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([month, monthInvoices]) => (
              <div key={month}>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-medium text-sm">{month}</h4>
                  <Separator className="flex-1" />
                </div>
                
                <div className="space-y-2">
                  {monthInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-xl">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            发票 #{invoice.id.slice(-8)}
                          </span>
                          {getInvoiceStatusBadge(invoice.status)}
                        </div>
                        <div className="text-xs text-muted-foreground space-x-4">
                          <span>金额: {formatCurrency(invoice.amount)}</span>
                          <span>税额: {formatCurrency(invoice.tax)}</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => handleDownloadInvoice(invoice)}
                        disabled={invoice.status === 'pending'}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        下载 PDF
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* 字数包购买对话框 */}
      <Dialog open={showWordPackageDialog} onOpenChange={setShowWordPackageDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              购买字数包
            </DialogTitle>
            <DialogDescription>
              选择适合您需求的字数包，一次购买，多次使用
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="border rounded-xl p-4 cursor-pointer hover:border-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">基础包</p>
                    <p className="text-sm text-muted-foreground">50,000 字</p>
                  </div>
                  <p className="text-lg font-semibold">¥99</p>
                </div>
              </div>
              
              <div className="border rounded-xl p-4 cursor-pointer hover:border-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">标准包</p>
                    <p className="text-sm text-muted-foreground">150,000 字</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">¥269</p>
                    <p className="text-xs text-green-600">节省 ¥28</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-xl p-4 cursor-pointer hover:border-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">专业包</p>
                    <p className="text-sm text-muted-foreground">500,000 字</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">¥799</p>
                    <p className="text-xs text-green-600">节省 ¥191</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              字数包永不过期，可用于任何写作项目
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl"
                onClick={() => setShowWordPackageDialog(false)}
              >
                取消
              </Button>
              <Button 
                className="flex-1 rounded-xl"
                onClick={() => {
                  toast.success('字数包购买功能开发中');
                  setShowWordPackageDialog(false);
                }}
              >
                立即购买
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingSettings;