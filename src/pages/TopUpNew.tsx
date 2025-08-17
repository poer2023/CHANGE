import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Wallet, 
  Crown,
  Check,
  Zap,
  Star,
  ExternalLink,
  Coins
} from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { WORD_PACKAGES, type WordPackage, formatPrice, formatWordCount } from '@/data/wordPackages';

const TopUpNew: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<WordPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { toast } = useToast();

  // 处理Stripe支付
  const handleStripePayment = async (pkg: WordPackage) => {
    setIsProcessing(true);
    setSelectedPackage(pkg);

    try {
      // 模拟支付跳转到Stripe
      toast({
        title: "正在跳转到Stripe支付",
        description: `即将为您处理 ${formatPrice(pkg.price)} 的支付`,
      });

      // 模拟跳转延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟Stripe跳转（这里只是样式展示）
      window.open(`https://checkout.stripe.com/pay/test-${pkg.id}#fidkdWxOYHwnPyd1blpxYHZxWjA0TEFOQnF1YGZhZzJVdXdgfHNKQlFfT0xMTGh2N19tSUY3NGtQMmpQdlE9VlU9ZEp9Mkh9ZENgZk1dZDNAV01MZU1LdGZAQGtsUHBPV0pNNEJAUldtZCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPydocGlxbFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl`, '_blank');
      
      toast({
        title: "支付页面已打开",
        description: "请在新页面完成支付流程",
      });

    } catch (error) {
      toast({
        title: "跳转失败",
        description: "无法打开支付页面，请稍后重试",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto p-6 max-w-6xl">
            {/* 页面标题 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Word Credits</h1>
              <p className="text-xl text-gray-600">Choose the perfect plan for your needs</p>
            </div>

            {/* 套餐卡片 - 横向展示 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {WORD_PACKAGES.map((pkg) => {
                const isPopular = pkg.tags.includes('HOT');
                const isBestValue = pkg.tags.includes('BEST_VALUE');
                const isProcessingThis = isProcessing && selectedPackage?.id === pkg.id;
                
                return (
                  <Card 
                    key={pkg.id} 
                    className={`relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      isPopular ? 'border-orange-300 bg-orange-50/50' : 
                      isBestValue ? 'border-green-300 bg-green-50/50' : 
                      'border-gray-200'
                    }`}
                  >
                    {/* 标签 */}
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-orange-500 text-white px-4 py-1 text-sm font-bold">
                          <Zap className="h-3 w-3 mr-1" />
                          HOT
                        </Badge>
                      </div>
                    )}
                    
                    {isBestValue && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-green-500 text-white px-4 py-1 text-sm font-bold">
                          <Star className="h-3 w-3 mr-1" />
                          BEST VALUE
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pt-8">
                      <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                      <p className="text-gray-600">{pkg.description}</p>
                      
                      {/* 字数显示 */}
                      <div className="mt-4">
                        <p className="text-4xl font-bold text-blue-600">
                          {formatWordCount(pkg.words)}
                        </p>
                        <p className="text-sm text-gray-500">words</p>
                      </div>
                      
                      {/* 价格显示 */}
                      <div className="mt-4">
                        <p className="text-3xl font-bold">
                          {formatPrice(pkg.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${pkg.pricePerThousandWords.toFixed(2)}/1k words
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* 权益列表 */}
                      <div className="space-y-3 mb-6">
                        {pkg.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{benefit.title}</span>
                          </div>
                        ))}
                      </div>

                      {/* 支付按钮 */}
                      <Button
                        onClick={() => handleStripePayment(pkg)}
                        disabled={isProcessing}
                        className={`w-full h-12 text-base font-semibold transition-all ${
                          isPopular ? 'bg-orange-500 hover:bg-orange-600' :
                          isBestValue ? 'bg-green-500 hover:bg-green-600' :
                          'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        {isProcessingThis ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Pay with Stripe
                            <ExternalLink className="h-4 w-4" />
                          </div>
                        )}
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center mt-3">
                        Secure payment powered by Stripe
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* 底部信息 */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <Wallet className="h-8 w-8 text-blue-600 mb-2" />
                    <h3 className="font-medium text-blue-900">Secure Payment</h3>
                    <p className="text-sm text-blue-700">SSL encrypted transactions</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Coins className="h-8 w-8 text-blue-600 mb-2" />
                    <h3 className="font-medium text-blue-900">No Expiration</h3>
                    <p className="text-sm text-blue-700">Words never expire</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Crown className="h-8 w-8 text-blue-600 mb-2" />
                    <h3 className="font-medium text-blue-900">Priority Support</h3>
                    <p className="text-sm text-blue-700">24/7 customer service</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TopUpNew;