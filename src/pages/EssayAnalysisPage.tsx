import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  FileText, 
  Clock, 
  Target, 
  BookOpen, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Zap,
  Shield,
  Star,
  TrendingUp,
  AlertCircle,
  Award,
  DollarSign,
  Calendar,
  Edit,
  RefreshCw,
  Lightbulb,
  BarChart3,
  Users,
  Globe
} from 'lucide-react';

interface AnalysisResult {
  documentType: string;
  academicField: string;
  suggestedWordCount: string;
  recommendedFormat: string;
  difficultyLevel: number;
  estimatedTime: string;
  complexity: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  keyTopics: string[];
  requirements: string[];
  recommendations: string[];
}

interface ServiceRecommendation {
  id: string;
  name: string;
  match: number;
  price: number;
  duration: string;
  icon: React.ReactNode;
  reasons: string[];
  valuePoints: string[];
  badge?: string;
  popular?: boolean;
}

interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
}

const EssayAnalysisPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedService, setSelectedService] = useState<string>('');
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Extract data from navigation state (from home page)
  const requirementData = location.state || {
    requirement: "商业伦理分析，2500字，APA格式，需要5个参考文献。主要分析现代企业在全球化背景下面临的伦理挑战，包括环境责任、劳工权益、消费者保护等方面。",
    selectedPlan: "express",
    wordCount: 45
  };

  const analysisSteps: AnalysisStep[] = [
    {
      id: 'parse',
      title: '解析要求',
      description: '分析Essay要求和关键信息',
      completed: false,
      progress: 0
    },
    {
      id: 'classify',
      title: '文档分类',
      description: '识别文档类型和学科领域',
      completed: false,
      progress: 0
    },
    {
      id: 'evaluate',
      title: '难度评估',
      description: '评估写作难度和复杂度',
      completed: false,
      progress: 0
    },
    {
      id: 'recommend',
      title: '服务匹配',
      description: '推荐最适合的服务方案',
      completed: false,
      progress: 0
    }
  ];

  const [steps, setSteps] = useState(analysisSteps);

  // Simulate AI analysis process
  useEffect(() => {
    if (!isAnalyzing) return;

    const runAnalysis = async () => {
      for (let i = 0; i < steps.length; i++) {
        // Update current step
        setCurrentStep(i);
        
        // Simulate processing time for each step
        const stepDuration = 1500 + Math.random() * 1000;
        const progressInterval = setInterval(() => {
          setSteps(prev => prev.map((step, index) => {
            if (index === i) {
              const newProgress = Math.min(step.progress + 10, 100);
              return { ...step, progress: newProgress };
            }
            return step;
          }));
        }, stepDuration / 10);

        await new Promise(resolve => setTimeout(resolve, stepDuration));
        
        clearInterval(progressInterval);
        
        // Mark step as completed
        setSteps(prev => prev.map((step, index) => {
          if (index === i) {
            return { ...step, completed: true, progress: 100 };
          }
          return step;
        }));
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Generate analysis results
      setTimeout(() => {
        setAnalysisResult(generateAnalysisResult(requirementData.requirement));
        setIsAnalyzing(false);
        setShowRecommendations(true);
      }, 800);
    };

    runAnalysis();
  }, []);

  const generateAnalysisResult = (requirement: string): AnalysisResult => {
    // Simple AI simulation based on keywords
    const text = requirement.toLowerCase();
    
    let documentType = 'Research Paper';
    if (text.includes('analysis') || text.includes('分析')) documentType = 'Analytical Essay';
    if (text.includes('compare') || text.includes('对比')) documentType = 'Comparative Essay';
    if (text.includes('case study') || text.includes('案例')) documentType = 'Case Study';
    
    let academicField = 'General Studies';
    if (text.includes('business') || text.includes('商业') || text.includes('管理')) academicField = 'Business Studies';
    if (text.includes('ethics') || text.includes('伦理')) academicField = 'Ethics & Philosophy';
    if (text.includes('environment') || text.includes('环境')) academicField = 'Environmental Studies';
    if (text.includes('marketing') || text.includes('市场')) academicField = 'Marketing';
    if (text.includes('psychology') || text.includes('心理')) academicField = 'Psychology';
    
    const wordCountMatch = text.match(/(\d+)\s*字|(\d+)\s*words?/);
    const suggestedWordCount = wordCountMatch ? `${wordCountMatch[1] || wordCountMatch[2]} words` : '2500-3000 words';
    
    let recommendedFormat = 'APA';
    if (text.includes('harvard')) recommendedFormat = 'Harvard';
    if (text.includes('mla')) recommendedFormat = 'MLA';
    if (text.includes('chicago')) recommendedFormat = 'Chicago';
    
    const difficultyLevel = text.length > 200 ? 85 : text.length > 100 ? 70 : 55;
    const complexity = difficultyLevel > 80 ? 'Expert' : difficultyLevel > 65 ? 'Advanced' : difficultyLevel > 50 ? 'Intermediate' : 'Basic';
    
    return {
      documentType,
      academicField,
      suggestedWordCount,
      recommendedFormat,
      difficultyLevel,
      estimatedTime: complexity === 'Expert' ? '36-48 hours' : complexity === 'Advanced' ? '24-36 hours' : '12-24 hours',
      complexity,
      keyTopics: ['Business Ethics', 'Corporate Responsibility', 'Globalization Impact', 'Stakeholder Theory'],
      requirements: ['APA Format', '5+ References', 'Case Studies', 'Critical Analysis'],
      recommendations: ['Include real-world examples', 'Use recent academic sources', 'Apply ethical frameworks', 'Consider multiple perspectives']
    };
  };

  const serviceRecommendations: ServiceRecommendation[] = [
    {
      id: 'premium',
      name: '专家级定制',
      match: 95,
      price: 149,
      duration: '24-36小时',
      icon: <Award className="w-6 h-6" />,
      popular: true,
      badge: 'AI+专家',
      reasons: [
        '复杂度匹配度95%',
        '需要深度研究分析',
        '多重质量保证',
        '专业格式要求'
      ],
      valuePoints: [
        '资深学术写手',
        'AI智能检测报告',
        '多轮质量审核',
        '无限次修订',
        '格式标准化',
        '参考文献管理'
      ]
    },
    {
      id: 'standard',
      name: '标准专业',
      match: 78,
      price: 89,
      duration: '48小时',
      icon: <Star className="w-6 h-6" />,
      badge: '推荐',
      reasons: [
        '适合标准要求',
        '性价比最优',
        '质量有保障',
        '交付及时'
      ],
      valuePoints: [
        '专业写作团队',
        'AI检测报告',
        '标准格式处理',
        '一次免费修订',
        '准时交付保证'
      ]
    },
    {
      id: 'basic',
      name: '基础服务',
      match: 62,
      price: 59,
      duration: '72小时',
      icon: <FileText className="w-6 h-6" />,
      badge: '经济',
      reasons: [
        '基础需求满足',
        '预算友好',
        '质量保证',
        '适合简单要求'
      ],
      valuePoints: [
        '基础写作支持',
        '格式标准化',
        '基础质量检查',
        '标准交付时间'
      ]
    }
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleConfirmOrder = () => {
    if (!selectedService) {
      alert('请选择服务方案');
      return;
    }
    
    const selectedServiceDetails = serviceRecommendations.find(service => service.id === selectedService);
    
    // Navigate to service confirmation with all data
    navigate('/service-confirmation', {
      state: {
        serviceType: selectedService as any, // 'essay_generation', 'ai_chat', etc.
        wordCount: parseInt(analysisResult.suggestedWordCount.replace(/[^\d]/g, '')) || 3000,
        analysisResults: analysisResult,
        requirements: requirementData.requirement,
        originalPlan: requirementData.selectedPlan
      }
    });
  };

  const handleModifyRequirement = () => {
    navigate('/essay-home', {
      state: {
        requirement: requirementData.requirement,
        returnFromAnalysis: true
      }
    });
  };

  const getDifficultyColor = (level: number) => {
    if (level >= 80) return 'text-red-600 bg-red-100';
    if (level >= 65) return 'text-orange-600 bg-orange-100';
    if (level >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'Expert': return <Brain className="w-5 h-5 text-red-600" />;
      case 'Advanced': return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case 'Intermediate': return <BarChart3 className="w-5 h-5 text-yellow-600" />;
      default: return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI智能需求分析
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            正在使用先进AI技术分析您的Essay要求，为您推荐最适合的服务方案
          </p>
        </div>

        {/* Analysis Process */}
        {isAnalyzing && (
          <Card className="max-w-4xl mx-auto mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-blue-600" />
                <span>AI分析进行中...</span>
              </CardTitle>
              <CardDescription>
                系统正在深度分析您的要求，请稍候
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={step.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-green-100 text-green-600' 
                            : index === currentStep 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-400'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : index === currentStep ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{step.title}</h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                      {step.completed ? (
                        <Badge className="bg-green-100 text-green-700">完成</Badge>
                      ) : index === currentStep ? (
                        <Badge className="bg-blue-100 text-blue-700">处理中</Badge>
                      ) : (
                        <Badge variant="outline">等待</Badge>
                      )}
                    </div>
                    <Progress 
                      value={step.progress} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {!isAnalyzing && analysisResult && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Original Requirement Display */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-gray-600" />
                  <span>您的Essay要求</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-800 leading-relaxed">{requirementData.requirement}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={handleModifyRequirement} className="flex items-center space-x-2">
                    <Edit className="w-4 h-4" />
                    <span>修改要求</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Analysis Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-6 h-6 text-green-600" />
                      <span>AI分析结果</span>
                    </CardTitle>
                    <CardDescription>
                      基于您的要求，我们的AI系统进行了全面分析
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium text-gray-700">文档类型</span>
                          <Badge className="bg-blue-100 text-blue-800">{analysisResult.documentType}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="font-medium text-gray-700">学科领域</span>
                          <Badge className="bg-green-100 text-green-800">{analysisResult.academicField}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <span className="font-medium text-gray-700">建议字数</span>
                          <Badge className="bg-purple-100 text-purple-800">{analysisResult.suggestedWordCount}</Badge>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <span className="font-medium text-gray-700">推荐格式</span>
                          <Badge className="bg-orange-100 text-orange-800">{analysisResult.recommendedFormat}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700">预估时间</span>
                          <Badge variant="outline">{analysisResult.estimatedTime}</Badge>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-700">难度评级</span>
                            <div className="flex items-center space-x-2">
                              {getComplexityIcon(analysisResult.complexity)}
                              <Badge className={getDifficultyColor(analysisResult.difficultyLevel)}>
                                {analysisResult.complexity}
                              </Badge>
                            </div>
                          </div>
                          <Progress value={analysisResult.difficultyLevel} className="h-2" />
                          <p className="text-sm text-gray-600 mt-1">{analysisResult.difficultyLevel}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Topics & Requirements */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        <span>关键主题</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.keyTopics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>基本要求</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisResult.requirements.map((req, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Recommendations */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-6 h-6 text-purple-600" />
                      <span>AI智能建议</span>
                    </CardTitle>
                    <CardDescription>
                      基于分析结果，我们为您提供以下专业建议
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisResult.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                          <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Service Recommendations */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">个性化服务推荐</h3>
                  <p className="text-gray-600">基于AI分析为您推荐最适合的服务方案</p>
                </div>

                {serviceRecommendations.map((service) => (
                  <Card 
                    key={service.id}
                    className={`cursor-pointer transition-all duration-300 shadow-lg border-2 ${
                      selectedService === service.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : service.popular 
                          ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50' 
                          : 'border-gray-200 bg-white/80'
                    } hover:shadow-xl hover:scale-105`}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <CardHeader className="relative">
                      {service.popular && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          AI推荐
                        </Badge>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            service.popular ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {service.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                            <CardDescription>{service.duration}</CardDescription>
                          </div>
                        </div>
                        {selectedService === service.id && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-3xl font-bold text-gray-800">
                          ${service.price}
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800 mb-1">
                            {service.match}% 匹配
                          </Badge>
                          <br />
                          <Badge variant="secondary" className="text-xs">
                            {service.badge}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">推荐理由:</h5>
                          <ul className="space-y-1">
                            {service.reasons.map((reason, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm">
                                <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Separator />
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">服务内容:</h5>
                          <ul className="space-y-1">
                            {service.valuePoints.map((point, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Separator className="my-6" />

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button 
                    onClick={handleConfirmOrder}
                    disabled={!selectedService}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!selectedService 
                      ? '请选择服务方案' 
                      : (
                        <div className="flex items-center space-x-2">
                          <span>确认订单</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )
                    }
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/essay-home')}
                    className="w-full flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>返回修改要求</span>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="text-center space-y-2 pt-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>AI智能分析保证</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Award className="w-4 h-4" />
                    <span>100%个性化匹配</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State for Analysis Results */}
        {isAnalyzing && (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="shadow-lg border-0 bg-white/80 backdrop-blur">
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-32 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EssayAnalysisPage;