import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Download, 
  MessageCircle, 
  Calendar, 
  Clock, 
  FileText, 
  Star,
  Gift,
  ArrowRight,
  Phone,
  Mail,
  Copy,
  ExternalLink,
  Confetti
} from 'lucide-react';
import { formatPrice } from '@/lib/pricing';
import { useToast } from '@/hooks/use-toast';

interface PaymentSuccessState {
  serviceType: string;
  wordCount: number;
  totalCost: number;
  paymentMethod: string;
  originalCost: number;
  savings: number;
  orderId: string;
  timestamp: string;
  analysisResults?: any;
  requirements?: string;
}

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as PaymentSuccessState;

  const [showConfetti, setShowConfetti] = useState(true);
  const [estimatedTime, setEstimatedTime] = useState('2-6小时');
  
  // 如果没有订单信息，重定向
  if (!state?.orderId) {
    navigate('/essay-home');
    return null;
  }

  const { 
    serviceType, 
    wordCount, 
    totalCost, 
    paymentMethod, 
    originalCost, 
    savings, 
    orderId, 
    timestamp 
  } = state;

  const paymentDate = new Date(timestamp);
  const estimatedCompletion = new Date(paymentDate.getTime() + 6 * 60 * 60 * 1000); // 6小时后

  useEffect(() => {
    // 隐藏庆祝动画
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast({
      title: "已复制",
      description: "订单号已复制到剪贴板",
    });
  };

  const handleContactService = () => {
    // 模拟联系客服
    toast({
      title: "客服联系",
      description: "客服将在5分钟内主动联系您",
    });
  };

  const handleViewProgress = () => {
    navigate('/history');
  };

  const handleBackToHome = () => {
    navigate('/essay-home');
  };

  const nextSteps = [
    {
      icon: FileText,
      title: '等待处理',
      description: '我们的专业团队将在30分钟内开始处理您的订单',
      time: '30分钟内',
      status: 'pending'
    },
    {
      icon: Star,
      title: '内容生成',
      description: 'AI将根据您的要求生成高质量内容',
      time: '2-4小时',
      status: 'pending'
    },
    {
      icon: CheckCircle,
      title: '质量审核',
      description: '专业编辑团队进行内容审核和优化',
      time: '1-2小时',
      status: 'pending'
    },
    {
      icon: Download,
      title: '完成交付',
      description: '您将收到通知，可在订单页面下载成果',
      time: '完成',
      status: 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* 庆祝动画背景 */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 left-1/6 w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/5 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }} />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 成功头部 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">支付成功！</h1>
            <p className="text-xl text-gray-600">感谢您的信任，我们将为您提供优质服务</p>
            
            <div className="mt-6">
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-green-100 text-green-800">
                订单编号：{orderId}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyOrderId}
                  className="ml-2 h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：订单详情 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 订单信息 */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    订单详情
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">服务类型</label>
                      <p className="text-lg font-semibold text-gray-900">{serviceType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">字数要求</label>
                      <p className="text-lg font-semibold text-gray-900">{wordCount.toLocaleString()} 字</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">支付方式</label>
                      <p className="text-lg font-semibold text-gray-900">{paymentMethod}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">支付时间</label>
                      <p className="text-lg font-semibold text-gray-900">
                        {paymentDate.toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">原价</span>
                      <span className="line-through text-gray-500">{formatPrice(originalCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>优惠金额</span>
                      <span>-{formatPrice(savings)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>实付金额</span>
                      <span className="text-green-600">{formatPrice(totalCost)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 服务进度 */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    服务进度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <step.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{step.title}</h4>
                            <span className="text-sm text-gray-500">{step.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          {index === 0 && (
                            <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
                              进行中
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 特别提醒 */}
              <Card className="shadow-lg border-0 bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Gift className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-900 mb-1">新用户专享福利</h4>
                      <p className="text-sm text-orange-700">
                        作为新用户，您已享受9折优惠，节省 {formatPrice(savings)}！
                        下次购买还可享受会员积分优惠。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右侧：操作区域 */}
            <div className="space-y-6">
              {/* 预计完成时间 */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    预计完成
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {estimatedCompletion.toLocaleDateString('zh-CN')}
                  </div>
                  <div className="text-lg text-gray-600 mb-4">
                    {estimatedCompletion.toLocaleTimeString('zh-CN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {estimatedTime}内完成
                  </Badge>
                </CardContent>
              </Card>

              {/* 快捷操作 */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle>快捷操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={handleViewProgress}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    查看订单进度
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleContactService}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    联系专属客服
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={handleBackToHome}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    返回首页
                  </Button>
                </CardContent>
              </Card>

              {/* 客服联系方式 */}
              <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm">需要帮助？</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-600">客服热线：</span>
                    <span className="font-medium">400-888-8888</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-600">邮箱：</span>
                    <span className="font-medium">service@essaypass.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-600">在线客服：</span>
                    <span className="font-medium text-blue-600 cursor-pointer hover:underline">
                      立即咨询
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      客服工作时间：周一至周日 9:00-22:00
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 服务保障 */}
              <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900 mb-1">服务保障</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>• 7天内免费修改</p>
                    <p>• 100%原创保证</p>
                    <p>• 不满意全额退款</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 底部感谢信息 */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">感谢您选择我们的服务！</h3>
              <p className="text-blue-100 mb-4">
                我们将竭诚为您提供高质量的AI写作服务，让您的学术之路更加顺畅。
              </p>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-blue-100">98%客户满意度</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;