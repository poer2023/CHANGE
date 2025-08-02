import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  ArrowRight, 
  FileText, 
  Edit3, 
  Sparkles, 
  Check, 
  Download,
  Users,
  BookOpen,
  Zap,
  PenTool,
  Target,
  Clock,
  Star,
  ChevronRight,
  Home,
  Monitor,
  Smartphone
} from 'lucide-react';

const ComprehensiveDemo: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const demoSteps = [
    {
      id: 'landing',
      title: '智能论文助手首页',
      description: '用户首次访问，了解产品功能',
      component: 'HomePage',
      highlights: ['功能介绍', 'CTA按钮', '用户引导'],
      duration: 3000
    },
    {
      id: 'create',
      title: '创建论文选择',
      description: '选择创建方式：从零开始或上传文档',
      component: 'CreatePage',
      highlights: ['创建方式选择', '输入论文标题', '开始创建'],
      duration: 4000
    },
    {
      id: 'form-step1',
      title: '论文类型选择',
      description: '第一步：选择论文类型和学科领域',
      component: 'FormPage',
      highlights: ['论文类型', '进度指示', '表单验证'],
      duration: 3000
    },
    {
      id: 'form-step2',
      title: 'AI需求分析',
      description: '与AI助手交流具体需求',
      component: 'FormPage',
      highlights: ['AI对话', '需求解析', '智能建议'],
      duration: 5000
    },
    {
      id: 'form-step3',
      title: '大纲偏好设置',
      description: '设置大纲生成的详细偏好',
      component: 'FormPage',
      highlights: ['大纲选择', '个性化设置', '完成表单'],
      duration: 3000
    },
    {
      id: 'editor',
      title: '论文编辑器',
      description: '进入编辑器，开始写作',
      component: 'EditorPage',
      highlights: ['富文本编辑', 'AI助手', '实时保存'],
      duration: 6000
    },
    {
      id: 'agent-help',
      title: 'AI助手协作',
      description: 'AI助手提供写作建议和优化',
      component: 'AgentPanel',
      highlights: ['智能建议', '语言润色', '结构优化'],
      duration: 4000
    },
    {
      id: 'export',
      title: '导出和分享',
      description: '完成写作，导出和分享论文',
      component: 'ExportModal',
      highlights: ['多种格式', '一键分享', '版本管理'],
      duration: 3000
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: '渐进式表单',
      description: '智能引导论文创建流程',
      color: 'blue'
    },
    {
      icon: Sparkles,
      title: 'AI智能生成',
      description: '自动生成高质量内容',
      color: 'purple'
    },
    {
      icon: Edit3,
      title: '实时编辑助手',
      description: '写作过程中的智能建议',
      color: 'green'
    },
    {
      icon: Users,
      title: '多人协作',
      description: '团队协作编辑功能',
      color: 'orange'
    }
  ];

  const stats = [
    { label: '用户数量', value: '10,000+', icon: Users },
    { label: '论文完成', value: '5,000+', icon: FileText },
    { label: '节省时间', value: '80%', icon: Clock },
    { label: '满意度', value: '4.9/5', icon: Star }
  ];

  useEffect(() => {
    if (autoPlay && currentStep < demoSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, demoSteps[currentStep].duration);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, currentStep, demoSteps]);

  const handleStartDemo = () => {
    setCurrentStep(0);
    setAutoPlay(true);
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setAutoPlay(false);
  };

  const handleTryNow = () => {
    navigate('/create');
  };

  const renderDemoStep = () => {
    const step = demoSteps[currentStep];
    
    return (
      <motion.div
        key={step.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {/* Demo Header */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Demo Content */}
        <div className={`${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
          <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {step.component === 'HomePage' && '🏠'}
                {step.component === 'CreatePage' && '📝'}
                {step.component === 'FormPage' && '📋'}
                {step.component === 'EditorPage' && '✍️'}
                {step.component === 'AgentPanel' && '🤖'}
                {step.component === 'ExportModal' && '📤'}
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                {step.title}
              </h4>
              <p className="text-gray-600 max-w-md">
                {step.description}
              </p>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="px-6 py-4 bg-gray-50">
          <h5 className="text-sm font-medium text-gray-700 mb-2">核心功能：</h5>
          <div className="flex flex-wrap gap-2">
            {step.highlights.map((highlight, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <PenTool className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">AI论文助手 - 完整演示</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <Home className="h-4 w-4 mr-1" />
                返回首页
              </button>
              <button
                onClick={handleTryNow}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                立即试用
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            体验完整的AI论文写作流程
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            从需求分析到最终发布，AI全程协助您创建高质量的学术论文
          </p>
          <button
            onClick={handleStartDemo}
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold text-lg"
          >
            <Play className="h-5 w-5 mr-2" />
            开始演示
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">演示流程</h3>
              
              {/* Auto Play Control */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoPlay}
                    onChange={(e) => setAutoPlay(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">自动播放</span>
                </label>
              </div>

              <div className="space-y-3">
                {demoSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      currentStep === index
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : currentStep > index
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        currentStep === index
                          ? 'bg-blue-500 text-white'
                          : currentStep > index
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {currentStep > index ? <Check className="h-3 w-3" /> : index + 1}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium">{step.title}</div>
                        <div className="text-xs opacity-75">{step.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Demo Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {renderDemoStep()}
            </AnimatePresence>

            {/* Demo Controls */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                上一步
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {currentStep + 1} / {demoSteps.length}
                </span>
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(Math.min(demoSteps.length - 1, currentStep + 1))}
                disabled={currentStep === demoSteps.length - 1}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                下一步
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">核心功能特性</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${feature.color}-100 mb-4`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">用户数据统计</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white text-center py-12">
          <h3 className="text-3xl font-bold mb-4">准备开始您的论文写作之旅？</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            体验完整的AI论文写作流程，让您的学术写作更加高效
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleTryNow}
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold"
            >
              <Target className="h-5 w-5 mr-2" />
              立即开始
            </button>
            <button
              onClick={() => navigate('/demo')}
              className="inline-flex items-center px-8 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 font-semibold"
            >
              <FileText className="h-5 w-5 mr-2" />
              查看编辑器演示
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ComprehensiveDemo;