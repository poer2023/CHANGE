import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Plus, Trash2, Edit3, BookOpen, ExternalLink, FileText, Zap, Settings, Target } from 'lucide-react';
import { usePaperStore } from '@/store';
import OutlinePreference from '@/components/OutlinePreference';
import { FormValidationError, FormData } from '@/types/form';

const FormPage: React.FC = () => {
  const navigate = useNavigate();
  const { formState, setFormStep, setFormData, createPaperFromForm } = usePaperStore();
  const { currentStep, steps, data } = formState;
  const [errors, setErrors] = useState<FormValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = useCallback((stepIndex: number): boolean => {
    const newErrors: FormValidationError[] = [];
    
    switch (stepIndex) {
      case 0:
        if (!data.title) {
          newErrors.push({ field: 'title', message: '请输入论文标题' });
        }
        if (!data.category) {
          newErrors.push({ field: 'category', message: '请选择论文类别' });
        }
        break;
      case 1:
        if (!data.outlinePreference) {
          newErrors.push({ field: 'outlinePreference', message: '请选择大纲结构' });
        }
        break;
      case 2:
        // 参考文献验证逻辑
        break;
      case 3:
        // 生成论文验证逻辑
        break;
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [data]);

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      // 标记当前步骤为已完成
      const updatedSteps = formState.steps.map((s, index) => ({
        ...s,
        isCompleted: index <= currentStep
      }));
      
      if (currentStep < steps.length - 1) {
        setFormStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  }, [currentStep, validateStep, formState.steps]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setFormStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData: FormData = {
        title: data.title || '',
        paperType: data.paperType || '',
        field: data.field || '',
        requirements: data.requirements || '',
        wordCount: data.wordCount || 3000,
        format: data.format || 'academic',
        specialRequirements: data.specialRequirements || '',
        outlinePreference: data.outlinePreference || '',
        detailLevel: data.detailLevel || 'detailed',
        citationStyle: data.citationStyle || 'apa',
        abstract: data.abstract,
        keywords: data.keywords,
        category: data.category,
        targetLength: data.targetLength,
        language: data.language,
        style: data.style,
        references: data.references
      };
      
      const newPaper = await createPaperFromForm(formData);
      navigate(`/editor/${newPaper.id}`);
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // 只允许点击已完成的步骤或当前步骤
    if (stepIndex <= currentStep) {
      setFormStep(stepIndex);
    }
  };

  const renderStepContent = () => {
    const currentStepData = steps[currentStep];
    
    switch (currentStepData.component) {
      case 'basic':
        return <BasicInfoStep onNext={handleNext} onPrevious={handlePrevious} errors={errors} />;
      case 'content':
        return <ContentStructureStep onNext={handleNext} onPrevious={handlePrevious} errors={errors} />;
      case 'references':
        return <ReferencesStep onNext={handleNext} onPrevious={handlePrevious} errors={errors} />;
      case 'generate':
        return <GenerateStep onNext={handleNext} onPrevious={handlePrevious} errors={errors} isSubmitting={isSubmitting} />;
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
                            step.id + 1
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
const BasicInfoStep: React.FC<{
  onNext: () => void;
  onPrevious: () => void;
  errors: FormValidationError[];
}> = ({ onNext, onPrevious, errors }) => {
  const { formState, setFormData } = usePaperStore();
  const navigate = useNavigate();
  
  
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
          onClick={onNext}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          下一步
        </button>
      </div>
    </div>
  );
};

// 内容结构步骤组件
const ContentStructureStep: React.FC<{
  onNext: () => void;
  onPrevious: () => void;
  errors: FormValidationError[];
}> = ({ onNext, onPrevious, errors }) => {
  const { formState, setFormData } = usePaperStore();
  
  // 将 formState.data 转换为 OutlinePreference 期望的格式
  const formData = {
    title: formState.data.title || '',
    paperType: formState.data.paperType || '',
    field: formState.data.field || '',
    requirements: formState.data.requirements || '',
    wordCount: formState.data.wordCount || 3000,
    format: formState.data.format || 'academic',
    specialRequirements: formState.data.specialRequirements || '',
    outlinePreference: formState.data.outlinePreference || '',
    detailLevel: formState.data.detailLevel || 'detailed',
    citationStyle: formState.data.citationStyle || 'apa',
    abstract: formState.data.abstract,
    keywords: formState.data.keywords,
    category: formState.data.category,
    targetLength: formState.data.targetLength,
    language: formState.data.language,
    style: formState.data.style
  };
  
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(updates);
  };
  
  return (
    <div className="p-8">
      <OutlinePreference 
        formData={formData}
        updateFormData={updateFormData}
        errors={errors}
      />
      
      {/* 导航按钮 */}
      <div className="flex justify-between pt-8 border-t mt-8">
        <button
          onClick={onPrevious}
          className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <ChevronLeft size={20} className="mr-2" />
          上一步
        </button>
        <button
          onClick={onNext}
          className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          下一步
          <ChevronRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

const ReferencesStep: React.FC<{
  onNext: () => void;
  onPrevious: () => void;
  errors: FormValidationError[];
}> = ({ onNext, onPrevious, errors }) => {
  const { formState, setFormData } = usePaperStore();
  const [references, setReferences] = useState<string[]>(formState.data.references || []);
  const [newReference, setNewReference] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const citationFormats = [
    { id: 'apa', name: 'APA', example: 'Smith, J. (2023). Title of the article. Journal Name, 15(3), 123-145.' },
    { id: 'mla', name: 'MLA', example: 'Smith, John. "Title of the Article." Journal Name, vol. 15, no. 3, 2023, pp. 123-145.' },
    { id: 'chicago', name: 'Chicago', example: 'Smith, John. "Title of the Article." Journal Name 15, no. 3 (2023): 123-145.' }
  ];

  const selectedFormat = formState.data.citationStyle || 'apa';

  const addReference = () => {
    if (newReference.trim()) {
      const updatedReferences = [...references, newReference.trim()];
      setReferences(updatedReferences);
      setFormData({ references: updatedReferences });
      setNewReference('');
    }
  };

  const removeReference = (index: number) => {
    const updatedReferences = references.filter((_, i) => i !== index);
    setReferences(updatedReferences);
    setFormData({ references: updatedReferences });
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(references[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingText.trim()) {
      const updatedReferences = [...references];
      updatedReferences[editingIndex] = editingText.trim();
      setReferences(updatedReferences);
      setFormData({ references: updatedReferences });
      setEditingIndex(null);
      setEditingText('');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText('');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">参考文献管理</h2>
        <p className="text-gray-600">添加和管理您论文中使用的参考文献，系统将按照选定的引用格式进行处理。</p>
      </div>

      {/* 引用格式说明 */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center mb-3">
          <BookOpen className="text-blue-500 mr-2" size={20} />
          <h3 className="font-semibold text-blue-900">当前引用格式：{citationFormats.find(f => f.id === selectedFormat)?.name}</h3>
        </div>
        <p className="text-sm text-blue-700 mb-2">示例格式：</p>
        <p className="text-sm text-blue-800 italic">{citationFormats.find(f => f.id === selectedFormat)?.example}</p>
      </div>

      {/* 添加新参考文献 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          添加参考文献
        </label>
        <div className="flex gap-3">
          <textarea
            value={newReference}
            onChange={(e) => setNewReference(e.target.value)}
            placeholder="请输入完整的参考文献信息，建议按照上述格式..."
            rows={3}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
          <button
            onClick={addReference}
            disabled={!newReference.trim()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Plus size={20} className="mr-2" />
            添加
          </button>
        </div>
      </div>

      {/* 参考文献列表 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          已添加的参考文献 ({references.length})
        </h3>
        
        {references.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-3 text-gray-300" />
            <p>还没有添加参考文献</p>
            <p className="text-sm">请在上方添加您论文中使用的参考文献</p>
          </div>
        ) : (
          <div className="space-y-4">
            {references.map((ref, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-gray-500 mr-2">
                        [{index + 1}]
                      </span>
                      <span className="text-sm text-gray-600">
                        {citationFormats.find(f => f.id === selectedFormat)?.name} 格式
                      </span>
                    </div>
                    
                    {editingIndex === index ? (
                      <div>
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={saveEdit}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            保存
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-800 leading-relaxed">{ref}</p>
                    )}
                  </div>
                  
                  {editingIndex !== index && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(index)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="编辑"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => removeReference(index)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between pt-8 border-t mt-8">
        <button
          onClick={onPrevious}
          className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <ChevronLeft size={20} className="mr-2" />
          上一步
        </button>
        <button
          onClick={onNext}
          className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          下一步
          <ChevronRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

const GenerateStep: React.FC<{
  onNext: () => void;
  onPrevious: () => void;
  errors: FormValidationError[];
  isSubmitting: boolean;
}> = ({ onNext, onPrevious, errors, isSubmitting }) => {
  const { formState } = usePaperStore();
  const [selectedOptions, setSelectedOptions] = useState({
    includeOutline: true,
    includeDraft: true,
    includeReferences: true,
    generateImages: false
  });

  const formData = formState.data;
  const outlineOptions = [
    { id: 'traditional', name: '传统学术结构' },
    { id: 'imrad', name: 'IMRAD结构' },
    { id: 'progressive', name: '渐进式论证' },
    { id: 'case-study', name: '案例研究结构' },
    { id: 'comparative', name: '比较分析结构' },
    { id: 'chronological', name: '时间序列结构' }
  ];

  const citationStyles = [
    { id: 'apa', name: 'APA' },
    { id: 'mla', name: 'MLA' },
    { id: 'chicago', name: 'Chicago' },
    { id: 'ieee', name: 'IEEE' },
    { id: 'harvard', name: 'Harvard' },
    { id: 'vancouver', name: 'Vancouver' }
  ];

  const selectedOutline = outlineOptions.find(opt => opt.id === formData.outlinePreference);
  const selectedCitation = citationStyles.find(style => style.id === formData.citationStyle);

  const estimatedTime = () => {
    let time = 2; // 基础时间
    if (selectedOptions.includeDraft) time += 3;
    if (selectedOptions.includeReferences) time += 1;
    if (selectedOptions.generateImages) time += 2;
    return time;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">生成论文</h2>
        <p className="text-gray-600">确认您的设置并生成最终论文，AI将根据您的配置创建完整的学术论文。</p>
      </div>

      {/* 配置摘要 */}
      <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center mb-4">
          <Target className="text-green-500 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-green-800">论文配置摘要</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-700 mb-2">基本信息</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li><strong>标题：</strong> {formData.title || '未设置'}</li>
              <li><strong>类别：</strong> {formData.category || '未设置'}</li>
              <li><strong>字数：</strong> {formData.wordCount || 3000} 字</li>
              <li><strong>语言：</strong> {formData.language === 'en' ? '英文' : '中文'}</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-green-700 mb-2">结构与格式</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li><strong>大纲结构：</strong> {selectedOutline?.name || '未选择'}</li>
              <li><strong>详细程度：</strong> {formData.detailLevel === 'detailed' ? '详细' : formData.detailLevel === 'brief' ? '简要' : '全面'}</li>
              <li><strong>引用格式：</strong> {selectedCitation?.name || 'APA'}</li>
              <li><strong>参考文献：</strong> {formData.references?.length || 0} 条</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 生成选项 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">生成选项</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <FileText className="text-blue-500 mr-3" size={20} />
              <div>
                <h4 className="font-medium text-gray-900">生成详细大纲</h4>
                <p className="text-sm text-gray-600">创建完整的论文结构大纲</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={selectedOptions.includeOutline}
              onChange={(e) => setSelectedOptions(prev => ({...prev, includeOutline: e.target.checked}))}
              className="w-5 h-5 text-primary-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <Zap className="text-yellow-500 mr-3" size={20} />
              <div>
                <h4 className="font-medium text-gray-900">生成初稿内容</h4>
                <p className="text-sm text-gray-600">基于大纲生成每个部分的初稿内容</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={selectedOptions.includeDraft}
              onChange={(e) => setSelectedOptions(prev => ({...prev, includeDraft: e.target.checked}))}
              className="w-5 h-5 text-primary-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <BookOpen className="text-green-500 mr-3" size={20} />
              <div>
                <h4 className="font-medium text-gray-900">整合参考文献</h4>
                <p className="text-sm text-gray-600">将参考文献按格式整合到论文中</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={selectedOptions.includeReferences}
              onChange={(e) => setSelectedOptions(prev => ({...prev, includeReferences: e.target.checked}))}
              className="w-5 h-5 text-primary-600 rounded"
              disabled={!formData.references?.length}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <Settings className="text-purple-500 mr-3" size={20} />
              <div>
                <h4 className="font-medium text-gray-900">生成配图建议</h4>
                <p className="text-sm text-gray-600">为论文各部分提供图表和配图建议</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={selectedOptions.generateImages}
              onChange={(e) => setSelectedOptions(prev => ({...prev, generateImages: e.target.checked}))}
              className="w-5 h-5 text-primary-600 rounded"
            />
          </div>
        </div>
      </div>

      {/* 预计生成时间 */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900">预计生成时间</h4>
            <p className="text-sm text-blue-700">基于您选择的选项和论文复杂度</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-900">{estimatedTime()}</div>
            <div className="text-sm text-blue-700">分钟</div>
          </div>
        </div>
      </div>

      {/* 生成须知 */}
      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">生成须知</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• 生成过程中请勿关闭页面，系统正在处理您的论文</li>
          <li>• 生成完成后，您可以在编辑器中进一步完善内容</li>
          <li>• AI生成的内容仅供参考，请结合实际情况进行调整</li>
          <li>• 建议在生成后仔细检查引用格式和学术规范</li>
        </ul>
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between pt-8 border-t mt-8">
        <button
          onClick={onPrevious}
          disabled={isSubmitting}
          className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} className="mr-2" />
          上一步
        </button>
        <button
          onClick={onNext}
          disabled={isSubmitting}
          className="flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
              生成中...
            </>
          ) : (
            <>
              <Zap size={20} className="mr-2" />
              开始生成论文
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FormPage;