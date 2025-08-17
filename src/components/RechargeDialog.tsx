import React, { useState } from 'react';
import { useCredit } from '@/contexts/CreditContext';
import { 
  CREDIT_PACKAGES, 
  formatPrice, 
  formatWordCount, 
  getTotalWords 
} from '@/lib/pricing';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Star, Gift, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RechargeDialogProps {
  children: React.ReactNode;
  onRechargeSuccess?: () => void;
}

export function RechargeDialog({ children, onRechargeSuccess }: RechargeDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { getBalance, balance, recharge } = useCredit();

  // 获取VIP等级信息
  const getVipLevel = () => {
    const level = balance.vipLevel;
    const names = { 0: '普通', 1: '青铜', 2: '白银', 3: '黄金', 4: '钻石' };
    const colors = { 
      0: 'bg-gray-100 text-gray-700', 
      1: 'bg-amber-100 text-amber-700', 
      2: 'bg-blue-100 text-blue-700', 
      3: 'bg-purple-100 text-purple-700', 
      4: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
    };
    return { 
      name: names[level] || names[0], 
      color: colors[level] || colors[0],
      discount: level * 5 // 简单的折扣计算
    };
  };

  const vipLevel = getVipLevel();

  const handlePurchase = async (packageId: string) => {
    const packageData = CREDIT_PACKAGES.find(pkg => pkg.id === packageId);
    if (!packageData) return;

    setIsProcessing(true);
    setSelectedPackage(packageId);

    try {
      // 使用 context 的 recharge 方法
      const success = await recharge(packageData.id, 'alipay');
      
      if (success) {
        toast({
          title: "充值成功！",
          description: `已成功充值 ${formatWordCount(getTotalWords(packageData))}，当前余额 ${formatWordCount(getBalance())} 字`,
        });

        onRechargeSuccess?.();
        setIsOpen(false);
      } else {
        throw new Error('充值失败');
      }
    } catch (error) {
      toast({
        title: "充值失败",
        description: "支付过程中出现错误，请重试",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            字数充值
          </DialogTitle>
          <DialogDescription>
            选择适合的套餐，享受更多AI服务。当前VIP等级：{vipLevel.name}
            {vipLevel.discount > 0 && ` (享受${vipLevel.discount}%折扣)`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {CREDIT_PACKAGES.map((pkg) => {
            const totalWords = getTotalWords(pkg);
            const isSelected = selectedPackage === pkg.id;
            const isProcessingThis = isProcessing && isSelected;

            return (
              <Card 
                key={pkg.id} 
                className={`relative cursor-pointer transition-all duration-200 ${
                  pkg.isPopular 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'hover:border-primary/50'
                } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                onClick={() => !isProcessing && handlePurchase(pkg.id)}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      最受欢迎
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(pkg.salePrice)}
                    </div>
                    {pkg.discount > 0 && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(pkg.originalPrice)}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          -{pkg.discount}%
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-semibold">
                      {formatWordCount(totalWords)}
                    </div>
                    <div className="text-sm text-muted-foreground">总字数</div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>基础字数</span>
                      <span>{formatWordCount(pkg.words)}</span>
                    </div>
                    {pkg.bonusWords && (
                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center gap-1">
                          <Gift className="h-3 w-3" />
                          赠送字数
                        </span>
                        <span>+{formatWordCount(pkg.bonusWords)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>单字价格</span>
                      <span>{formatPrice(pkg.salePrice / totalWords)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-xs text-muted-foreground text-center">
                    {pkg.description}
                  </div>

                  <Button 
                    className="w-full" 
                    disabled={isProcessing}
                    variant={pkg.isPopular ? "default" : "outline"}
                  >
                    {isProcessingThis ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        处理中...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        立即购买
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">购买说明</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 字数永久有效，不设过期时间</li>
            <li>• 支持多种AI服务，包括论文生成、对话咨询等</li>
            <li>• VIP会员享受额外折扣和专属服务</li>
            <li>• 7天内无条件退款保障</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RechargeDialog;