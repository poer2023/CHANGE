import React, { useState } from 'react';
import PromoCodeInput from './PromoCodeInput';
import PaymentMethodSelector from './PaymentMethodSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description?: string;
}

export function PaymentDemo() {
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [originalAmount] = useState(99); // 原价99元

  const calculateDiscountedAmount = () => {
    if (!appliedPromoCode) return originalAmount;
    
    if (appliedPromoCode.type === 'percentage') {
      return originalAmount * (1 - appliedPromoCode.discount / 100);
    } else {
      return Math.max(0, originalAmount - appliedPromoCode.discount);
    }
  };

  const discountedAmount = calculateDiscountedAmount();
  const discountValue = originalAmount - discountedAmount;

  const handleApplyPromoCode = (code: PromoCode) => {
    setAppliedPromoCode(code);
  };

  const handleRemovePromoCode = () => {
    setAppliedPromoCode(null);
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert('请选择支付方式');
      return;
    }
    
    alert(`准备使用 ${selectedPaymentMethod} 支付 ¥${discountedAmount.toFixed(2)}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>支付演示</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 订单摘要 */}
          <div className="space-y-3">
            <h3 className="font-medium">订单摘要</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span>商品价格</span>
                <span>¥{originalAmount}</span>
              </div>
              {appliedPromoCode && (
                <div className="flex justify-between text-green-600">
                  <span>优惠券折扣 ({appliedPromoCode.code})</span>
                  <span>-¥{discountValue.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>实付金额</span>
                <span className="text-primary">¥{discountedAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* 优惠码输入 */}
          <div>
            <h3 className="font-medium mb-3">优惠码</h3>
            <PromoCodeInput
              onApplyPromoCode={handleApplyPromoCode}
              onRemovePromoCode={handleRemovePromoCode}
              appliedPromoCode={appliedPromoCode}
            />
          </div>

          {/* 支付方式选择 */}
          <div>
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onMethodSelect={handlePaymentMethodSelect}
            />
          </div>

          {/* 支付按钮 */}
          <Button 
            onClick={handlePayment} 
            className="w-full" 
            size="lg"
            disabled={!selectedPaymentMethod}
          >
            立即支付 ¥{discountedAmount.toFixed(2)}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}