import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  ArrowLeft, 
  FileText, 
  DollarSign, 
  Clock, 
  Shield,
  Award,
  CreditCard,
  Users,
  TrendingUp
} from 'lucide-react';

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state || {};
  const { requirement, analysisResult, selectedService, originalPlan } = orderData;

  if (!selectedService) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>订单信息缺失</CardTitle>
            <CardDescription>请从分析页面重新提交订单</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/essay-home')} className="w-full">
              返回首页
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            订单确认
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            请确认您的订单信息，我们将为您提供专业的Essay写作服务
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Summary */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-6 h-6 text-blue-600" />
                    <span>服务详情</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                      {selectedService.icon}
                      <div>
                        <h3 className="font-semibold text-lg">{selectedService.name}</h3>
                        <p className="text-gray-600">{selectedService.duration}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        ${selectedService.price}
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {selectedService.match}% 匹配
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-800">服务包含：</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {selectedService.valuePoints?.map((point: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Essay Requirements */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-6 h-6 text-gray-600" />
                    <span>Essay要求</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-gray-800 leading-relaxed">{requirement}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Summary */}
              {analysisResult && (
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-6 h-6 text-purple-600" />
                      <span>AI分析摘要</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">文档类型:</span>
                          <Badge variant="outline">{analysisResult.documentType}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">学科领域:</span>
                          <Badge variant="outline">{analysisResult.academicField}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">建议字数:</span>
                          <Badge variant="outline">{analysisResult.suggestedWordCount}</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">推荐格式:</span>
                          <Badge variant="outline">{analysisResult.recommendedFormat}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">复杂度:</span>
                          <Badge variant="outline">{analysisResult.complexity}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">预估时间:</span>
                          <Badge variant="outline">{analysisResult.estimatedTime}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Order Actions */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <span>费用明细</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">服务费用:</span>
                      <span className="font-medium">${selectedService.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI分析费用:</span>
                      <span className="font-medium text-green-600">免费</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>总计:</span>
                      <span className="text-blue-600">${selectedService.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-6 h-6 text-orange-600" />
                    <span>交付信息</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">交付时间:</span>
                      <span className="font-medium">{selectedService.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">质量保证:</span>
                      <span className="font-medium text-green-600">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">修订次数:</span>
                      <span className="font-medium">无限制</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button 
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  onClick={() => {
                    // 模拟支付成功，直接跳转到进度跟踪页面
                    navigate('/order-tracking', { 
                      state: { 
                        orderId: 'EP-2024-001234',
                        requirement,
                        selectedService 
                      } 
                    });
                  }}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  立即支付
                </Button>

                <Button 
                  variant="secondary"
                  className="w-full h-10 bg-blue-50 hover:bg-blue-100 text-blue-700"
                  onClick={() => navigate('/order-tracking')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  查看进度跟踪示例
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => navigate('/essay-analysis', { state: orderData })}
                  className="w-full flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>返回修改</span>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="text-center space-y-2 pt-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>安全支付保障</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>专业团队服务</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Award className="w-4 h-4" />
                  <span>质量满意保证</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;