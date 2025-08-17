import React, { useState } from "react";
import { CreditCard, Zap, AlertCircle, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredCredits: number;
  currentBalance: number;
  onPaymentSuccess?: (newBalance: number) => void;
}

interface RechargeOption {
  id: string;
  credits: number;
  price: number;
  bonus?: number;
  popular?: boolean;
  description: string;
}

const rechargeOptions: RechargeOption[] = [
  {
    id: "basic",
    credits: 10000,
    price: 9.9,
    description: "适合轻度使用"
  },
  {
    id: "standard",
    credits: 30000,
    price: 19.9,
    bonus: 5000,
    popular: true,
    description: "最受欢迎，性价比高"
  },
  {
    id: "premium",
    credits: 50000,
    price: 29.9,
    bonus: 15000,
    description: "重度用户首选"
  },
  {
    id: "ultimate",
    credits: 100000,
    price: 49.9,
    bonus: 30000,
    description: "超值大容量包"
  }
];

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onOpenChange,
  requiredCredits,
  currentBalance,
  onPaymentSuccess
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("standard");
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedRechargeOption = rechargeOptions.find(option => option.id === selectedOption);
  const shortage = Math.max(0, requiredCredits - currentBalance);

  // 格式化数字显示
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toLocaleString();
  };

  // 处理支付
  const handlePayment = async () => {
    if (!selectedRechargeOption) return;

    setIsProcessing(true);
    
    // 模拟支付处理
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const totalCredits = selectedRechargeOption.credits + (selectedRechargeOption.bonus || 0);
      const newBalance = currentBalance + totalCredits;
      
      onPaymentSuccess?.(newBalance);
      onOpenChange(false);
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-100">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            字数不足，请充值
          </DialogTitle>
          <DialogDescription>
            选择充值套餐，继续您的创作之旅
          </DialogDescription>
        </DialogHeader>

        {/* 余额状态 */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-muted-foreground mb-1">当前余额</div>
                <div className="text-lg font-semibold">{formatNumber(currentBalance)} 字</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">所需字数</div>
                <div className="text-lg font-semibold text-orange-600">{formatNumber(requiredCredits)} 字</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">还需充值</div>
                <div className="text-lg font-semibold text-red-600">{formatNumber(shortage)} 字</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* 充值选项 */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            选择充值套餐
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rechargeOptions.map((option) => {
              const totalCredits = option.credits + (option.bonus || 0);
              const isSelected = selectedOption === option.id;
              
              return (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected 
                      ? "ring-2 ring-primary border-primary bg-primary/5" 
                      : "hover:border-primary/50"
                  } ${option.popular ? "relative" : ""}`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  {option.popular && (
                    <Badge className="absolute -top-2 left-4 bg-gradient-to-r from-orange-500 to-red-500">
                      最受欢迎
                    </Badge>
                  )}
                  
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-primary bg-primary" : "border-gray-300"
                        }`}>
                          {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                        </div>
                        <span className="font-semibold">{formatNumber(option.credits)} 字</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">¥{option.price}</div>
                      </div>
                    </div>
                    
                    {option.bonus && (
                      <div className="flex items-center gap-1 mb-2">
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          +{formatNumber(option.bonus)} 赠送
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          实得 {formatNumber(totalCredits)} 字
                        </span>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                    
                    {/* 性价比显示 */}
                    <div className="mt-2 text-xs text-muted-foreground">
                      约 {(option.price * 1000 / totalCredits).toFixed(2)} 元/千字
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 充值后余额预览 */}
        {selectedRechargeOption && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">充值后状态</span>
              </div>
              <div className="text-sm text-green-600">
                余额将达到 {formatNumber(currentBalance + selectedRechargeOption.credits + (selectedRechargeOption.bonus || 0))} 字，
                足够完成当前任务并支持后续创作
              </div>
            </CardContent>
          </Card>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            取消
          </Button>
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {isProcessing ? "处理中..." : `立即支付 ¥${selectedRechargeOption?.price}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;