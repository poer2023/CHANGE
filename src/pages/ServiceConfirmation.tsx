import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  CheckCircle, 
  Star, 
  Clock, 
  FileText, 
  CreditCard,
  Wallet,
  Smartphone,
  ArrowRight,
  Info
} from 'lucide-react';
import { PRICING_CONFIG, formatPrice, calculateServiceCost, type ServiceType } from '@/lib/pricing';

interface ServiceConfirmationState {
  serviceType: ServiceType;
  wordCount: number;
  analysisResults?: any;
  requirements?: string;
}

const ServiceConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ServiceConfirmationState;
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('alipay');
  const [isLoading, setIsLoading] = useState(false);

  // 使用useEffect来处理重定向
  useEffect(() => {
    if (!state?.serviceType || !state?.wordCount) {
      navigate('/essay-home');
    }
  }, [state, navigate]);

  // 如果没有服务信息，显示加载状态
  if (!state?.serviceType || !state?.wordCount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">跳转中...</p>
        </div>
      </div>
    );
  }

  const { serviceType, wordCount, analysisResults, requirements } = state;
  const serviceConfig = PRICING_CONFIG[serviceType];
  const totalCost = calculateServiceCost(serviceType, wordCount);
  const discountedPrice = totalCost * 0.9; // 9折优惠
  const savings = totalCost - discountedPrice;

  const paymentMethods = [
    { id: 'alipay', name: '支付宝', icon: Wallet, description: '支持花呗分期' },
    { id: 'wechat', name: '微信支付', icon: Smartphone, description: '微信钱包支付' },
    { id: 'credit', name: '信用卡', icon: CreditCard, description: '支持Visa/Mastercard' },
  ];

  const serviceFeatures = [
    '专业AI模型生成',
    '多轮优化调整',
    '原创性保证',
    '7天内免费修改',
    '专属客服支持'
  ];

  const handleConfirmPayment = () => {
    setIsLoading(true);
    
    // 模拟处理延迟
    setTimeout(() => {
      navigate('/payment-demo', {
        state: {
          serviceType,
          wordCount,
          totalCost: discountedPrice,
          paymentMethod: selectedPaymentMethod,
          originalCost: totalCost,
          savings,
          analysisResults,
          requirements
        }
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">服务确认</h1>
            <p className="text-gray-600">请仔细核对服务内容和价格信息</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：服务详情 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 服务信息卡片 */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    服务详情
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">服务类型</Label>
                      <p className="text-lg font-semibold text-gray-900">{serviceConfig.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">预计字数</Label>
                      <p className="text-lg font-semibold text-gray-900">{wordCount.toLocaleString()} 字</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">服务描述</Label>
                    <p className="text-gray-700">{serviceConfig.description}</p>
                  </div>

                  {requirements && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">特殊要求</Label>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{requirements}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 服务保障 */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    服务保障
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">质量承诺</p>
                        <p className="text-sm text-blue-700">
                          我们承诺提供高质量的AI生成内容，如您不满意可在7天内申请免费修改或退款。
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 支付方式选择 */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    选择支付方式
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <method.icon className="h-5 w-5 text-gray-600" />
                          <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{method.name}</span>
                              <span className="text-sm text-gray-500">{method.description}</span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* 右侧：价格信息和确认按钮 */}
            <div className="space-y-6">
              {/* 价格明细 */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur sticky top-4">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    价格明细
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">基础费用</span>
                      <span>{formatPrice(totalCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>新用户优惠 (9折)</span>
                      <span>-{formatPrice(savings)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>实付金额</span>
                      <span className="text-blue-600">{formatPrice(discountedPrice)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-500">
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      预计完成时间：2-6小时
                    </p>
                    <p>• 支持7天内无理由退款</p>
                    <p>• 100%原创内容保证</p>
                    <p>• 专业客服24小时在线</p>
                  </div>

                  <Badge variant="secondary" className="w-full justify-center py-2">
                    限时优惠，立省 {formatPrice(savings)}
                  </Badge>

                  <Button 
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={handleConfirmPayment}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        处理中...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        确认支付 {formatPrice(discountedPrice)}
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    点击确认支付即表示您同意我们的
                    <span className="text-blue-600 hover:underline cursor-pointer">服务条款</span>
                    和
                    <span className="text-blue-600 hover:underline cursor-pointer">隐私政策</span>
                  </p>
                </CardContent>
              </Card>

              {/* 安全保障 */}
              <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900 mb-1">安全支付保障</p>
                  <p className="text-xs text-gray-600">
                    采用银行级SSL加密技术
                    <br />
                    您的支付信息完全安全
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceConfirmation;