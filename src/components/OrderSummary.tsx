import React, { useState } from "react";
import { CreditCard, Loader2, Shield, AlertCircle, CheckCircle2, Gift } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { 
  CreditPackage, 
  formatPrice, 
  formatWordCount, 
  getTotalWords,
  getPricePerWord 
} from "@/lib/pricing";

export interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
}

export interface OrderSummaryProps {
  /** 选中的套餐信息 */
  selectedPackage: CreditPackage;
  /** 支付方式列表 */
  paymentMethods: PaymentMethod[];
  /** 选中的支付方式ID */
  selectedPaymentMethod: string;
  /** 支付方式选择回调 */
  onPaymentMethodChange: (methodId: string) => void;
  /** 支付按钮点击回调 */
  onPayment: () => Promise<void>;
  /** 是否正在处理支付 */
  isProcessing?: boolean;
  /** 错误信息 */
  error?: string;
  /** 是否禁用支付按钮 */
  disabled?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** VIP折扣率 (0-100) */
  vipDiscountRate?: number;
  /** 是否显示新用户优惠 */
  showNewUserDiscount?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedPackage,
  paymentMethods,
  selectedPaymentMethod,
  onPaymentMethodChange,
  onPayment,
  isProcessing = false,
  error,
  disabled = false,
  className,
  vipDiscountRate = 0,
  showNewUserDiscount = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 计算总字数（包含赠送）
  const totalWords = getTotalWords(selectedPackage);
  
  // 计算各种价格
  const originalPrice = selectedPackage.originalPrice;
  const salePrice = selectedPackage.salePrice;
  const packageDiscount = originalPrice - salePrice;
  
  // VIP折扣
  const vipDiscount = salePrice * (vipDiscountRate / 100);
  
  // 新用户折扣 (假设新用户额外9折)
  const newUserDiscountRate = showNewUserDiscount ? 10 : 0;
  const newUserDiscount = showNewUserDiscount ? (salePrice - vipDiscount) * 0.1 : 0;
  
  // 最终实付金额
  const finalPrice = salePrice - vipDiscount - newUserDiscount;
  
  // 总节省金额
  const totalSavings = packageDiscount + vipDiscount + newUserDiscount;
  
  // 获取选中的支付方式
  const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);

  // 处理支付
  const handlePayment = async () => {
    if (isSubmitting || isProcessing || disabled || !selectedMethod?.enabled) return;
    
    setIsSubmitting(true);
    try {
      await onPayment();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isProcessing;

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-100">
            <CreditCard className="h-5 w-5 text-blue-600" />
          </div>
          订单摘要
        </CardTitle>
        <CardDescription>
          确认您的套餐选择和支付信息
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 套餐详情 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{selectedPackage.name}</span>
            {selectedPackage.isPopular && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                热门
              </Badge>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">基础字数</span>
              <span className="font-mono font-medium">{formatWordCount(selectedPackage.words)}</span>
            </div>
            
            {selectedPackage.bonusWords && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Gift className="h-3 w-3" />
                  赠送字数
                </span>
                <span className="font-mono font-medium text-green-600">
                  +{formatWordCount(selectedPackage.bonusWords)}
                </span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex items-center justify-between font-medium">
              <span>总字数</span>
              <span className="font-mono text-primary">{formatWordCount(totalWords)}</span>
            </div>
          </div>
        </div>

        {/* 价格明细 */}
        <div className="space-y-3">
          <h4 className="font-medium">价格明细</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">原价</span>
              <span className="font-mono line-through text-muted-foreground">
                {formatPrice(originalPrice)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">套餐优惠</span>
              <span className="font-mono text-green-600">
                -{formatPrice(packageDiscount)}
              </span>
            </div>
            
            {vipDiscountRate > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  VIP折扣 ({vipDiscountRate}%)
                </span>
                <span className="font-mono text-green-600">
                  -{formatPrice(vipDiscount)}
                </span>
              </div>
            )}
            
            {showNewUserDiscount && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  新用户专享 ({newUserDiscountRate}%)
                </span>
                <span className="font-mono text-green-600">
                  -{formatPrice(newUserDiscount)}
                </span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>实付金额</span>
              <span className="font-mono text-primary">{formatPrice(finalPrice)}</span>
            </div>
            
            {totalSavings > 0 && (
              <div className="text-center">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  已为您节省 {formatPrice(totalSavings)}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* 支付方式 */}
        <div className="space-y-3">
          <h4 className="font-medium">支付方式</h4>
          
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  selectedPaymentMethod === method.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-gray-200 hover:border-gray-300",
                  !method.enabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => method.enabled && onPaymentMethodChange(method.id)}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                  selectedPaymentMethod === method.id
                    ? "border-primary bg-primary"
                    : "border-gray-300"
                )}>
                  {selectedPaymentMethod === method.id && (
                    <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 flex-1">
                  {method.icon}
                  <div>
                    <div className="font-medium text-sm">{method.name}</div>
                    <div className="text-xs text-muted-foreground">{method.description}</div>
                  </div>
                </div>
                
                {!method.enabled && (
                  <Badge variant="outline" className="text-xs">
                    暂不可用
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 安全提示 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-green-500" />
          <span>安全支付 · 7天无条件退款</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handlePayment}
          disabled={disabled || isLoading || !selectedMethod?.enabled}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>处理中...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>立即支付 {formatPrice(finalPrice)}</span>
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;