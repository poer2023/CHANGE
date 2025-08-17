import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Tag, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description?: string;
}

interface PromoCodeInputProps {
  onApplyPromoCode?: (code: PromoCode) => void;
  onRemovePromoCode?: () => void;
  appliedPromoCode?: PromoCode | null;
  disabled?: boolean;
  className?: string;
}

// 模拟优惠码验证API
const validatePromoCode = async (code: string): Promise<PromoCode | null> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟优惠码数据库
  const promoCodes: Record<string, PromoCode> = {
    'WELCOME10': {
      code: 'WELCOME10',
      discount: 10,
      type: 'percentage',
      description: '新用户专享10%折扣'
    },
    'SAVE20': {
      code: 'SAVE20',
      discount: 20,
      type: 'fixed',
      description: '立减20元'
    },
    'STUDENT15': {
      code: 'STUDENT15',
      discount: 15,
      type: 'percentage',
      description: '学生专享15%折扣'
    }
  };
  
  return promoCodes[code.toUpperCase()] || null;
};

function PromoCodeInput({
  onApplyPromoCode,
  onRemovePromoCode,
  appliedPromoCode,
  disabled = false,
  className
}: PromoCodeInputProps) {
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim() || isLoading || appliedPromoCode) return;

    setIsLoading(true);
    setValidationStatus('idle');

    try {
      const validatedCode = await validatePromoCode(promoCode.trim());
      
      if (validatedCode) {
        setValidationStatus('success');
        onApplyPromoCode?.(validatedCode);
        toast({
          title: '优惠码应用成功',
          description: `已应用优惠码：${validatedCode.code}`,
          duration: 3000,
        });
        setPromoCode('');
      } else {
        setValidationStatus('error');
        toast({
          title: '优惠码无效',
          description: '请检查优惠码是否正确或已过期',
          variant: 'destructive',
          duration: 3000,
        });
      }
    } catch (error) {
      setValidationStatus('error');
      toast({
        title: '验证失败',
        description: '网络错误，请稍后重试',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePromoCode = () => {
    onRemovePromoCode?.();
    setValidationStatus('idle');
    toast({
      title: '优惠码已移除',
      description: '优惠码已成功移除',
      duration: 2000,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyPromoCode();
    }
  };

  const getStatusIcon = () => {
    switch (validationStatus) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Tag className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatDiscount = (code: PromoCode) => {
    return code.type === 'percentage' 
      ? `-${code.discount}%` 
      : `-¥${code.discount}`;
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* 已应用的优惠码显示 */}
      {appliedPromoCode && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-green-800">
                      {appliedPromoCode.code}
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {formatDiscount(appliedPromoCode)}
                    </Badge>
                  </div>
                  {appliedPromoCode.description && (
                    <p className="text-sm text-green-600 mt-1">
                      {appliedPromoCode.description}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemovePromoCode}
                disabled={disabled}
                className="text-green-600 hover:text-green-800 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 优惠码输入 */}
      {!appliedPromoCode && (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="请输入优惠码"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={disabled || isLoading}
                className={cn(
                  'pr-10',
                  validationStatus === 'success' && 'border-green-500',
                  validationStatus === 'error' && 'border-red-500'
                )}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getStatusIcon()}
              </div>
            </div>
            <Button
              onClick={handleApplyPromoCode}
              disabled={!promoCode.trim() || disabled || isLoading}
              className="min-w-[80px]"
            >
              {isLoading ? '验证中...' : '应用'}
            </Button>
          </div>

          {/* 验证状态提示 */}
          {validationStatus === 'error' && (
            <p className="text-sm text-red-600">
              优惠码无效或已过期，请检查后重试
            </p>
          )}

          {/* 提示信息 */}
          <p className="text-xs text-muted-foreground">
            注意：每次只能使用一个优惠码，优惠码不可叠加使用
          </p>

          {/* 可用优惠码提示 */}
          <div className="text-xs text-muted-foreground">
            <p className="mb-1">可用优惠码示例：</p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">WELCOME10</Badge>
              <Badge variant="outline" className="text-xs">SAVE20</Badge>
              <Badge variant="outline" className="text-xs">STUDENT15</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PromoCodeInput;