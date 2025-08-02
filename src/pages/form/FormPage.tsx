import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { usePaperStore } from '@/store';

const FormPage: React.FC = () => {
  const navigate = useNavigate();
  const { formState, setFormStep } = usePaperStore();
  const { currentStep, steps, data } = formState;

  const handleStepClick = (stepIndex: number) => {
    // 只允许点击已完成的步骤或当前步骤
    if (stepIndex <= currentStep || steps[stepIndex].isCompleted) {
      setFormStep(stepIndex);
    }
  };

  const renderStepContent = () => {
    const currentStepData = steps[currentStep];
    
    switch (currentStepData.id) {
      case 'basic':
        return <BasicInfoStep />;
      case 'content':
        return <ContentStructureStep />;
      case 'references':
        return <ReferencesStep />;
      case 'generate':
        return <GenerateStep />;
      default:
        return <div>未知步骤</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/create')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">论文创建向导</h1>
            </div>
            <div className="text-sm text-gray-600">
              步骤 {currentStep + 1} / {steps.length}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* 步骤导航 */}
          <div className="lg:col-span-1">
            <nav className="sticky top-8">
              <ol className="space-y-4">
                {steps.map((step, index) => (
                  <li key={step.id}>
                    <button
                      onClick={() => handleStepClick(index)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        step.isActive
                          ? 'border-primary-500 bg-primary-50'
                          : step.isCompleted
                          ? 'border-green-500 bg-green-50 hover:bg-green-100'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      } ${
                        index > currentStep && !step.isCompleted
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                      disabled={index > currentStep && !step.isCompleted}
                    >
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            step.isCompleted
                              ? 'bg-green-500 text-white'
                              : step.isActive
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {step.isCompleted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="ml-3">
                          <p
                            className={`text-sm font-medium ${
                              step.isActive
                                ? 'text-primary-900'
                                : step.isCompleted
                                ? 'text-green-900'
                                : 'text-gray-900'
                            }`}
                          >
                            {step.title}
                          </p>
                          <p
                            className={`text-xs ${
                              step.isActive
                                ? 'text-primary-600'
                                : step.isCompleted
                                ? 'text-green-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ol>
              
              {/* 进度显示 */}
              <div className="mt-8 p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>完成进度</span>
                  <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </nav>
          </div>

          {/* 主要内容区域 */}
          <div className="mt-8 lg:mt-0 lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              {renderStepContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 基本信息步骤组件
const BasicInfoStep: React.FC = () => {
  const { formState, setFormData, setFormStep } = usePaperStore();
  const navigate = useNavigate();
  
  const handleNext = () => {
    // TODO: 验证表单数据
    setFormStep(1);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">基本信息</h2>
        <p className="text-gray-600">请填写论文的基本信息，这将帮助AI更好地理解你的需求。</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            论文标题 *
          </label>
          <input
            type="text"
            value={formState.data.title || ''}
            onChange={(e) => setFormData({ title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="请输入论文标题"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            论文摘要
          </label>
          <textarea
            value={formState.data.abstract || ''}
            onChange={(e) => setFormData({ abstract: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="简要描述论文的研究内容和主要观点（可选）"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              论文类别 *
            </label>
            <select
              value={formState.data.category || ''}
              onChange={(e) => setFormData({ category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">请选择类别</option>
              <option value="computer-science">计算机科学</option>
              <option value="engineering">工程技术</option>
              <option value="medicine">医学</option>
              <option value="economics">经济学</option>
              <option value="education">教育学</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标字数
            </label>
            <input
              type="number"
              value={formState.data.targetLength || ''}
              onChange={(e) => setFormData({ targetLength: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="例如：8000"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              语言
            </label>
            <select
              value={formState.data.language || 'zh'}
              onChange={(e) => setFormData({ language: e.target.value as 'zh' | 'en' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="zh">中文</option>
              <option value="en">英文</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              写作风格
            </label>
            <select
              value={formState.data.style || 'academic'}
              onChange={(e) => setFormData({ style: e.target.value as 'academic' | 'technical' | 'review' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="academic">学术论文</option>
              <option value="technical">技术报告</option>
              <option value="review">综述文章</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t mt-8">
        <button
          onClick={() => navigate('/create')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          返回
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          下一步
        </button>
      </div>
    </div>
  );
};

// 其他步骤组件的占位符
const ContentStructureStep: React.FC = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">内容结构</h2>
    <p className="text-gray-600">这里将是内容结构设置页面...</p>
  </div>
);

const ReferencesStep: React.FC = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">参考文献</h2>
    <p className="text-gray-600">这里将是参考文献管理页面...</p>
  </div>
);

const GenerateStep: React.FC = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">生成论文</h2>
    <p className="text-gray-600">这里将是论文生成页面...</p>
  </div>
);

export default FormPage;