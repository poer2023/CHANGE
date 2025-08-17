import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  Smartphone, 
  Wallet, 
  CreditCard,
  QrCode,
  Timer,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { formatPrice } from '@/lib/pricing';

interface PaymentDemoState {
  serviceType: string;
  wordCount: number;
  totalCost: number;
  paymentMethod: string;
  originalCost: number;
  savings: number;
  analysisResults?: any;
  requirements?: string;
}

const PaymentDemo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentDemoState;

  const [paymentStep, setPaymentStep] = useState<'input' | 'processing' | 'verifying'>('input');
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5分钟倒计时
  const [showPassword, setShowPassword] = useState(false);
  const [paymentCode, setPaymentCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 使用useEffect来处理重定向
  useEffect(() => {
    if (!state?.totalCost) {
      navigate('/essay-home');
    }
  }, [state, navigate]);

  // 如果没有支付信息，显示加载状态
  if (!state?.totalCost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">跳转中...</p>
        </div>
      </div>
    );
  }

  const { serviceType, wordCount, totalCost, paymentMethod, originalCost, savings } = state;

  // 倒计时逻辑
  useEffect(() => {
    if (paymentStep === 'input' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentStep, timeLeft]);

  // 支付处理进度模拟
  useEffect(() => {
    if (paymentStep === 'processing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setPaymentStep('verifying');
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [paymentStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPaymentMethodInfo = () => {
    switch (paymentMethod) {
      case 'alipay':
        return {
          name: '支付宝',
          icon: Wallet,
          color: 'from-blue-500 to-blue-600',
          inputLabel: '支付密码',
          inputPlaceholder: '请输入支付密码',
          qrText: '打开支付宝扫一扫'
        };
      case 'wechat':
        return {
          name: '微信支付',
          icon: Smartphone,
          color: 'from-green-500 to-green-600',
          inputLabel: '支付密码',
          inputPlaceholder: '请输入微信支付密码',
          qrText: '打开微信扫一扫'
        };
      case 'credit':
        return {
          name: '信用卡支付',
          icon: CreditCard,
          color: 'from-purple-500 to-purple-600',
          inputLabel: '信用卡密码',
          inputPlaceholder: '请输入信用卡密码',
          qrText: '验证信用卡信息'
        };
      default:
        return {
          name: '支付宝',
          icon: Wallet,
          color: 'from-blue-500 to-blue-600',
          inputLabel: '支付密码',
          inputPlaceholder: '请输入支付密码',
          qrText: '打开支付宝扫一扫'
        };
    }
  };

  const paymentInfo = getPaymentMethodInfo();
  const PaymentIcon = paymentInfo.icon;

  const handlePayment = () => {
    if (!paymentCode || paymentCode.length < 6) {
      return;
    }

    setIsProcessing(true);
    setPaymentStep('processing');
    setProgress(0);

    // 模拟支付处理，3-5秒后跳转到成功页面
    setTimeout(() => {
      navigate('/payment-success', {
        state: {
          ...state,
          paymentMethod: paymentInfo.name,
          orderId: `ORDER${Date.now()}`,
          timestamp: new Date().toISOString()
        }
      });
    }, 3500);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const renderInputStep = () => (
    <div className="space-y-6">
      {/* 支付方式头部 */}
      <div className={`bg-gradient-to-r ${paymentInfo.color} text-white p-6 rounded-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PaymentIcon className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-bold">{paymentInfo.name}</h2>
              <p className="text-blue-100">安全支付保障</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-100">支付金额</p>
            <p className="text-2xl font-bold">{formatPrice(totalCost)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：支付表单 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                安全支付
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 二维码支付选项 */}
              <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-3" />
                <p className="font-medium text-gray-700">{paymentInfo.qrText}</p>
                <p className="text-sm text-gray-500 mt-1">或在下方输入密码完成支付</p>
              </div>

              {/* 密码输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {paymentInfo.inputLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={paymentCode}
                    onChange={(e) => setPaymentCode(e.target.value)}
                    placeholder={paymentInfo.inputPlaceholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  为了您的资金安全，请输入6位数字支付密码（演示：输入任意6位数字）
                </p>
              </div>

              <Button
                onClick={handlePayment}
                disabled={!paymentCode || paymentCode.length < 6 || isProcessing}
                className={`w-full h-12 bg-gradient-to-r ${paymentInfo.color} hover:opacity-90 font-semibold text-lg`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    处理中...
                  </div>
                ) : (
                  `确认支付 ${formatPrice(totalCost)}`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：订单信息 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>订单信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">服务类型</span>
                <span className="font-medium">{serviceType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">字数</span>
                <span className="font-medium">{wordCount.toLocaleString()} 字</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">原价</span>
                <span className="line-through text-gray-500">{formatPrice(originalCost)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>优惠金额</span>
                <span>-{formatPrice(savings)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>实付金额</span>
                <span className="text-blue-600">{formatPrice(totalCost)}</span>
              </div>
            </CardContent>
          </Card>

          {/* 剩余时间 */}
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-600">
                <Timer className="h-4 w-4" />
                <span className="text-sm font-medium">
                  订单剩余时间：{formatTime(timeLeft)}
                </span>
              </div>
              <Progress value={(300 - timeLeft) / 300 * 100} className="mt-2 h-2" />
              <p className="text-xs text-orange-600 mt-1">
                超时后订单将自动取消
              </p>
            </CardContent>
          </Card>

          {/* 安全提示 */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-700">
                  <p className="font-medium mb-1">支付安全保障</p>
                  <ul className="space-y-1">
                    <li>• 银行级SSL加密技术</li>
                    <li>• 资金安全100%保障</li>
                    <li>• 支持7天无理由退款</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="text-center space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg">
        <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin" />
        <h2 className="text-2xl font-bold mb-2">正在处理支付</h2>
        <p className="text-blue-100">请稍候，正在与银行通信验证...</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>支付进度</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>验证支付信息</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>连接银行系统</span>
              </div>
              <div className="flex items-center gap-2">
                {progress > 50 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                )}
                <span>处理支付请求</span>
              </div>
              <div className="flex items-center gap-2">
                {progress > 80 ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                )}
                <span>确认交易结果</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <AlertCircle className="h-4 w-4" />
        <span>请不要关闭页面，支付处理中...</span>
      </div>
    </div>
  );

  const renderVerifyingStep = () => (
    <div className="text-center space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-8 rounded-lg">
        <CheckCircle className="h-16 w-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">支付验证中</h2>
        <p className="text-green-100">正在确认交易结果，即将完成...</p>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="flex items-center gap-2"
              disabled={paymentStep !== 'input'}
            >
              <ArrowLeft className="h-4 w-4" />
              返回
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {paymentStep === 'input' && '确认支付'}
                {paymentStep === 'processing' && '支付处理中'}
                {paymentStep === 'verifying' && '支付验证中'}
              </h1>
              <p className="text-gray-600">
                {paymentStep === 'input' && '请完成支付以开始服务'}
                {paymentStep === 'processing' && '正在安全处理您的支付'}
                {paymentStep === 'verifying' && '即将完成支付流程'}
              </p>
            </div>
          </div>

          {/* 支付步骤指示器 */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  paymentStep === 'input' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm">确认支付</span>
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded">
                <div className={`h-full bg-blue-600 rounded transition-all duration-500 ${
                  paymentStep !== 'input' ? 'w-full' : 'w-0'
                }`} />
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  paymentStep === 'processing' ? 'bg-blue-600 text-white' : 
                  paymentStep === 'verifying' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm">处理中</span>
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded">
                <div className={`h-full bg-blue-600 rounded transition-all duration-500 ${
                  paymentStep === 'verifying' ? 'w-full' : 'w-0'
                }`} />
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  paymentStep === 'verifying' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  3
                </div>
                <span className="ml-2 text-sm">完成</span>
              </div>
            </div>
          </div>

          {/* 支付内容 */}
          {paymentStep === 'input' && renderInputStep()}
          {paymentStep === 'processing' && renderProcessingStep()}
          {paymentStep === 'verifying' && renderVerifyingStep()}
        </div>
      </div>
    </div>
  );
};

export default PaymentDemo;