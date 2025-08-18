import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Calendar, 
  DollarSign, 
  Check, 
  Zap, 
  Shield, 
  FileText, 
  BookOpen,
  Star,
  Users,
  Award,
  PlayCircle,
  Brain
} from 'lucide-react';

interface ServicePlan {
  id: string;
  name: string;
  duration: string;
  price: number;
  icon: React.ReactNode;
  features: string[];
  popular?: boolean;
  badge?: string;
}

const EssayHomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [requirement, setRequirement] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [wordCount, setWordCount] = useState(0);

  // Handle return from analysis page
  useEffect(() => {
    if (location.state?.requirement) {
      setRequirement(location.state.requirement);
      const text = location.state.requirement;
      setWordCount(text.trim().split(/\s+/).filter((word: string) => word.length > 0).length);
    }
    if (location.state?.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan);
    }
  }, [location.state]);

  const servicePlans: ServicePlan[] = [
    {
      id: 'express',
      name: '24小时交付',
      duration: '24小时',
      price: 89,
      icon: <Zap className="w-6 h-6" />,
      badge: 'AI检测报告',
      popular: true,
      features: [
        '快速响应，24小时内完成',
        '专业AI检测报告',
        '格式标准化处理',
        '参考文献整理',
        '一次免费修订',
        '质量保证承诺'
      ]
    },
    {
      id: 'standard',
      name: '48小时交付',
      duration: '48小时',
      price: 59,
      icon: <Calendar className="w-6 h-6" />,
      badge: '格式检查',
      features: [
        '48小时内高质量完成',
        '专业格式检查',
        '参考文献整理',
        '一次免费修订',
        '质量保证承诺'
      ]
    },
    {
      id: 'economy',
      name: '7天交付',
      duration: '7天',
      price: 39,
      icon: <DollarSign className="w-6 h-6" />,
      badge: '基础服务',
      features: [
        '7天内完成',
        '基础质量保证',
        '标准格式处理',
        '参考文献整理',
        '一次免费修订'
      ]
    }
  ];

  const serviceFeatures = [
    { icon: <FileText className="w-5 h-5" />, text: '原创内容生成' },
    { icon: <Shield className="w-5 h-5" />, text: 'AI检测报告' },
    { icon: <BookOpen className="w-5 h-5" />, text: '格式标准化' },
    { icon: <Star className="w-5 h-5" />, text: '参考文献整理' },
    { icon: <Users className="w-5 h-5" />, text: '一次免费修订' },
    { icon: <Award className="w-5 h-5" />, text: '质量保证' }
  ];

  const handleRequirementChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRequirement(text);
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubmit = () => {
    if (!requirement.trim()) {
      alert('请详细描述您的Essay要求');
      return;
    }
    
    if (wordCount < 10) {
      alert('请提供更详细的要求描述（建议至少10个字）');
      return;
    }
    
    if (!selectedPlan) {
      alert('请选择服务方案');
      return;
    }
    
    // Navigate to AI analysis page with the form data
    navigate('/essay-analysis', {
      state: {
        requirement,
        selectedPlan,
        wordCount
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            智能Essay写作助手
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            AI驱动的学术写作工具，提升效率保证质量
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>100%原创保证</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>AI智能检测</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>专业格式规范</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Left Column - Requirement Input */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">描述您的Essay要求</CardTitle>
                <CardDescription>
                  请详细描述您的Essay要求，包括题目、课程、字数、格式等信息
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="例如：商业伦理分析，2500字，APA格式，需要5个参考文献。主要分析现代企业在全球化背景下面临的伦理挑战，包括环境责任、劳工权益、消费者保护等方面..."
                    value={requirement}
                    onChange={handleRequirementChange}
                    className="min-h-[160px] text-base leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span className={wordCount < 10 ? 'text-orange-500' : wordCount < 50 ? 'text-blue-500' : 'text-green-500'}>
                      字数统计: {wordCount} 字
                      {wordCount < 10 && ' (建议至少10字)'}
                      {wordCount >= 10 && wordCount < 50 && ' (建议50字以上)'}
                      {wordCount >= 50 && ' ✓'}
                    </span>
                    <span className="text-gray-500">描述越详细，效果越好</span>
                  </div>
                </div>

                {/* Input Examples */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">输入示例：</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• 市场营销策略分析，3000字，Harvard格式，8个参考文献</p>
                    <p>• 人工智能伦理问题研究，2500字，APA格式，包含案例分析</p>
                    <p>• 可持续发展商业模式，4000字，MLA格式，需要图表分析</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Features */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">服务包含内容</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {serviceFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-green-50">
                      <div className="text-green-600">{feature.icon}</div>
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                      <Check className="w-4 h-4 text-green-500 ml-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Service Plans */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">选择服务方案</h3>
              <p className="text-gray-600">根据您的时间需求选择合适的服务</p>
            </div>

            {servicePlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`cursor-pointer transition-all duration-300 shadow-lg border-2 ${
                  selectedPlan === plan.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : plan.popular 
                      ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50' 
                      : 'border-gray-200 bg-white/80'
                } hover:shadow-xl hover:scale-105`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                <CardHeader className="relative">
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      最受欢迎
                    </Badge>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        plan.popular ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {plan.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <CardDescription>{plan.duration}</CardDescription>
                      </div>
                    </div>
                    {selectedPlan === plan.id && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-3xl font-bold text-gray-800">
                      ${plan.price}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {plan.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            <Separator className="my-6" />

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit}
              disabled={!requirement.trim() || !selectedPlan}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!requirement.trim() || !selectedPlan 
                ? '请填写要求并选择方案' 
                : 'AI智能分析'
              }
            </Button>

            {/* Trust Indicators */}
            <div className="text-center space-y-2 pt-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>100%安全支付</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Award className="w-4 h-4" />
                <span>质量不满意全额退款</span>
              </div>
            </div>
          </div>
        </div>
          </div>
      </section>

      {/* Features Section - Modern Grid */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-slate-900 mb-4">为什么选择EssayPass？</h3>
              <p className="text-xl text-slate-600">专业AI技术，确保每一份作品都达到最高标准</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-blue-200 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Brain className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">AI智能写作</h4>
                  <p className="text-slate-600 leading-relaxed">先进的AI技术结合专业写作团队，确保内容质量和学术规范</p>
                </div>
              </div>
              
              <div className="group">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-emerald-200 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Shield className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">原创保证</h4>
                  <p className="text-slate-600 leading-relaxed">100%原创内容，通过多重AI检测，确保学术诚信和质量标准</p>
                </div>
              </div>
              
              <div className="group">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-purple-200 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Clock className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">快速交付</h4>
                  <p className="text-slate-600 leading-relaxed">最快24小时交付，严格按照约定时间完成，绝不延误您的学习进度</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bottom CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold text-white mb-6">开始您的学术写作之旅</h3>
            <p className="text-xl text-blue-100 mb-8">让AI助力您的学术成功，从第一份Essay开始</p>
            <Button 
              size="lg"
              className="h-14 px-8 bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onClick={() => {
                const input = document.querySelector('input');
                if (input) {
                  input.focus();
                  input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
            >
              <PlayCircle className="w-6 h-6 mr-3" />
              立即开始写作
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EssayHomePage;