import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CreditCard, Smartphone, Building2, CheckCircle } from 'lucide-react';

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isRecommended?: boolean;
  isAvailable?: boolean;
  processingTime?: string;
  fees?: string;
}

interface PaymentMethodSelectorProps {
  selectedMethod?: string;
  onMethodSelect: (methodId: string) => void;
  disabled?: boolean;
  className?: string;
  customMethods?: PaymentMethod[];
}

// 中国市场主要支付方式配置（按优先级排序）
const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: 'wechat',
    name: '微信支付',
    description: '使用微信扫码支付，安全便捷',
    icon: (
      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
        <Smartphone className="h-5 w-5 text-white" />
      </div>
    ),
    isRecommended: true,
    isAvailable: true,
    processingTime: '即时到账',
    fees: '免手续费'
  },
  {
    id: 'alipay',
    name: '支付宝',
    description: '使用支付宝扫码支付，快速安全',
    icon: (
      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
        <Smartphone className="h-5 w-5 text-white" />
      </div>
    ),
    isRecommended: true,
    isAvailable: true,
    processingTime: '即时到账',
    fees: '免手续费'
  },
  {
    id: 'bankcard',
    name: '银行卡',
    description: '支持储蓄卡和信用卡，覆盖全国主要银行',
    icon: (
      <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
        <CreditCard className="h-5 w-5 text-white" />
      </div>
    ),
    isRecommended: false,
    isAvailable: true,
    processingTime: '1-3个工作日',
    fees: '可能收取手续费'
  },
  {
    id: 'unionpay',
    name: '银联在线',
    description: '中国银联官方在线支付平台',
    icon: (
      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
        <Building2 className="h-5 w-5 text-white" />
      </div>
    ),
    isRecommended: false,
    isAvailable: true,
    processingTime: '即时到账',
    fees: '免手续费'
  },
];

function PaymentMethodSelector({
  selectedMethod,
  onMethodSelect,
  disabled = false,
  className,
  customMethods
}: PaymentMethodSelectorProps) {
  const paymentMethods = customMethods || defaultPaymentMethods;
  const availableMethods = paymentMethods.filter(method => method.isAvailable);

  const handleMethodSelect = (methodId: string) => {
    if (disabled) return;
    onMethodSelect(methodId);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">选择支付方式</h3>
        <Badge variant="outline" className="text-xs">
          支持 {availableMethods.length} 种支付方式
        </Badge>
      </div>

      <div className="grid gap-3">
        {availableMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          
          return (
            <Card
              key={method.id}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:shadow-md',
                isSelected && 'ring-2 ring-primary ring-offset-2 border-primary',
                disabled && 'cursor-not-allowed opacity-50',
                !method.isAvailable && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => method.isAvailable && handleMethodSelect(method.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  {/* 支付方式图标 */}
                  <div className="flex-shrink-0">
                    {method.icon}
                  </div>

                  {/* 支付方式信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-base">
                        {method.name}
                      </h4>
                      {method.isRecommended && (
                        <Badge variant="default" className="text-xs">
                          推荐
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {method.description}
                    </p>

                    {/* 支付详情 */}
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      {method.processingTime && (
                        <span>⏱️ {method.processingTime}</span>
                      )}
                      {method.fees && (
                        <span>💰 {method.fees}</span>
                      )}
                    </div>
                  </div>

                  {/* 选中状态指示器 */}
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <CheckCircle className="h-6 w-6 text-primary" />
                    ) : (
                      <div className="h-6 w-6 border-2 border-muted-foreground rounded-full" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 支付安全提示 */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
            <CheckCircle className="h-3 w-3 text-white" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-muted-foreground mb-1">安全保障</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 所有支付信息均经过SSL加密处理</li>
              <li>• 支持7天无理由退款保障</li>
              <li>• 24小时客服支持，有问题随时联系</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 支付方式说明 */}
      {selectedMethod && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-900 mb-2">
            {availableMethods.find(m => m.id === selectedMethod)?.name} 支付说明
          </h4>
          <div className="text-sm text-blue-800">
            {selectedMethod === 'wechat' && (
              <div>
                <p>1. 点击"立即支付"后将显示微信支付二维码</p>
                <p>2. 使用微信扫一扫功能扫描二维码</p>
                <p>3. 在微信中确认支付金额并完成支付</p>
                <p>4. 支付成功后页面将自动跳转</p>
              </div>
            )}
            {selectedMethod === 'alipay' && (
              <div>
                <p>1. 点击"立即支付"后将显示支付宝付款二维码</p>
                <p>2. 打开支付宝扫一扫功能扫描二维码</p>
                <p>3. 在支付宝中确认支付金额并完成支付</p>
                <p>4. 支付成功后页面将自动跳转</p>
              </div>
            )}
            {selectedMethod === 'bankcard' && (
              <div>
                <p>1. 点击"立即支付"后跳转到银行卡支付页面</p>
                <p>2. 输入银行卡号、有效期、CVV等信息</p>
                <p>3. 输入手机验证码完成身份验证</p>
                <p>4. 确认支付信息并完成支付</p>
              </div>
            )}
            {selectedMethod === 'unionpay' && (
              <div>
                <p>1. 点击"立即支付"后跳转到银联支付页面</p>
                <p>2. 选择您的银行并输入银行卡信息</p>
                <p>3. 通过手机短信验证码确认支付</p>
                <p>4. 支付成功后自动返回商户页面</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentMethodSelector;