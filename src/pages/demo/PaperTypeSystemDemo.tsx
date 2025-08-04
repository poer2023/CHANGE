import React, { useState } from 'react';
import { PaperTypeSelector } from '@/components/editor';
import { usePaperTypeAdapter } from '@/hooks';
import { EnglishPaperType, AcademicLevel, PaperTypeRecommendation } from '@/types/paper-types';
import { FormData, FormValidationError } from '@/types/form';

const PaperTypeSystemDemo: React.FC = () => {
  // 表单数据状态
  const [formData, setFormData] = useState<FormData>({
    paperType: '',
    field: '',
    requirements: '',
    wordCount: 0,
    format: '',
    specialRequirements: '',
    outlinePreference: '',
    detailLevel: '',
    citationStyle: '',
    title: '分析《了不起的盖茨比》中的象征主义手法',
    abstract: '本文分析菲茨杰拉德小说中的象征主义运用',
    keywords: ['象征主义', '美国文学', '现代主义', 'F. Scott Fitzgerald']
  });

  const [errors, setErrors] = useState<FormValidationError[]>([]);

  // 使用论文类型适配器
  const {
    currentPaperType,
    currentAcademicLevel,
    currentTemplate,
    generatedModules,
    recommendations,
    isLoading,
    error,
    isReady,
    hasValidConfiguration,
    setPaperType,
    setAcademicLevel,
    getRecommendations,
    applyRecommendation,
    getStyleConfig,
    getFormatConfig,
    getModuleCardClasses,
    getWritingAreaClasses
  } = usePaperTypeAdapter({
    enableAIRecommendations: true,
    enableStyleAdaptation: true,
    enableRealTimeValidation: true,
    autoGenerateModules: true,
    paperId: 'demo-paper'
  });

  // 更新表单数据
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // 处理AI推荐请求
  const handleRecommendationRequest = async (input: string): Promise<PaperTypeRecommendation[]> => {
    try {
      const recommendations = await getRecommendations({
        title: formData.title,
        abstract: formData.abstract,
        keywords: formData.keywords,
        academicLevel: currentAcademicLevel,
        targetLength: formData.wordCount || undefined,
        existingContent: input.slice(0, 500)
      });
      return recommendations;
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return [];
    }
  };

  // 应用论文类型选择
  const handlePaperTypeSelect = async (paperType: string) => {
    try {
      await setPaperType(paperType as EnglishPaperType, currentAcademicLevel);
      updateFormData({ paperType });
    } catch (error) {
      console.error('Failed to set paper type:', error);
    }
  };

  // 处理学术层次变更
  const handleAcademicLevelChange = async (level: AcademicLevel) => {
    try {
      await setAcademicLevel(level);
    } catch (error) {
      console.error('Failed to set academic level:', error);
    }
  };

  const styleConfig = getStyleConfig();
  const formatConfig = getFormatConfig();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            论文类型智能识别与适配系统演示
          </h1>
          <p className="text-lg text-gray-600">
            体验AI驱动的论文类型推荐和动态模块结构生成
          </p>
        </div>

        {/* 系统状态显示 */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">系统状态</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">当前论文类型:</span>
              <span className="ml-2 text-blue-600">
                {currentPaperType || '未选择'}
              </span>
            </div>
            <div>
              <span className="font-medium">学术层次:</span>
              <span className="ml-2 text-green-600">
                {currentAcademicLevel === 'undergraduate' && '本科'}
                {currentAcademicLevel === 'master' && '硕士'}
                {currentAcademicLevel === 'doctoral' && '博士'}
              </span>
            </div>
            <div>
              <span className="font-medium">系统状态:</span>
              <span className={`ml-2 ${isReady ? 'text-green-600' : 'text-yellow-600'}`}>
                {isReady ? '就绪' : isLoading ? '加载中...' : '未就绪'}
              </span>
            </div>
          </div>
          {error && (
            <div className="mt-2 text-red-600 text-sm">
              错误: {error}
            </div>
          )}
        </div>

        {/* 学术层次选择器 */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">学术层次选择</h2>
          <div className="flex gap-2">
            {(['undergraduate', 'master', 'doctoral'] as AcademicLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => handleAcademicLevelChange(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentAcademicLevel === level
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {level === 'undergraduate' && '本科'}
                {level === 'master' && '硕士'}
                {level === 'doctoral' && '博士'}
              </button>
            ))}
          </div>
        </div>

        {/* 论文类型选择器 */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">论文类型选择</h2>
          <PaperTypeSelector
            formData={{
              ...formData,
              paperType: currentPaperType || formData.paperType
            }}
            updateFormData={(updates) => {
              updateFormData(updates);
              if (updates.paperType) {
                handlePaperTypeSelect(updates.paperType);
              }
            }}
            errors={errors}
            onRecommendationRequest={handleRecommendationRequest}
          />
        </div>

        {/* 当前配置展示 */}
        {hasValidConfiguration && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* 样式配置 */}
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">样式配置</h2>
              {styleConfig && (
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">主色调:</span>
                    <span 
                      className="ml-2 inline-block w-4 h-4 rounded"
                      style={{ backgroundColor: styleConfig.colors.primary }}
                    ></span>
                    <span className="ml-2">{styleConfig.colors.primary}</span>
                  </div>
                  <div>
                    <span className="font-medium">标题字体:</span>
                    <span className="ml-2">{styleConfig.typography.headingFont}</span>
                  </div>
                  <div>
                    <span className="font-medium">正文字体:</span>
                    <span className="ml-2">{styleConfig.typography.bodyFont}</span>
                  </div>
                  <div className={`p-3 rounded-lg ${getModuleCardClasses()}`}>
                    模块卡片样式预览
                  </div>
                </div>
              )}
            </div>

            {/* 格式配置 */}
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">格式配置</h2>
              {formatConfig && (
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">引用格式:</span>
                    <span className="ml-2">{formatConfig.citation.style}</span>
                  </div>
                  <div>
                    <span className="font-medium">字体大小:</span>
                    <span className="ml-2">{formatConfig.formatting.fontSize}</span>
                  </div>
                  <div>
                    <span className="font-medium">行间距:</span>
                    <span className="ml-2">{formatConfig.formatting.lineSpacing}</span>
                  </div>
                  <div>
                    <span className="font-medium">页码:</span>
                    <span className="ml-2">{formatConfig.structure.pageNumbers ? '是' : '否'}</span>
                  </div>
                  <div>
                    <span className="font-medium">目录:</span>
                    <span className="ml-2">{formatConfig.structure.tableOfContents ? '是' : '否'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 生成的模块结构 */}
        {generatedModules.length > 0 && (
          <div className="p-6 bg-white rounded-lg shadow-sm border mb-8">
            <h2 className="text-lg font-semibold mb-4">
              生成的模块结构 ({generatedModules.length} 个模块)
            </h2>
            <div className="space-y-4">
              {generatedModules.map((module, index) => (
                <div 
                  key={module.id}
                  className={`p-4 rounded-lg border-2 ${getModuleCardClasses()}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">
                      {index + 1}. {module.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {module.type}
                    </span>
                  </div>
                  {module.template && (
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>{module.template.description}</p>
                      {module.template.wordCountTarget && (
                        <p>
                          预计字数: {module.template.wordCountTarget.min} - {module.template.wordCountTarget.max} 字
                        </p>
                      )}
                      {module.template.prompts.length > 0 && (
                        <div>
                          <span className="font-medium">写作提示:</span>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            {module.template.prompts.slice(0, 2).map((prompt, i) => (
                              <li key={i}>{prompt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 模板信息 */}
        {currentTemplate && (
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">模板信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">模板名称:</span>
                <span className="ml-2">{currentTemplate.name}</span>
              </div>
              <div>
                <span className="font-medium">描述:</span>
                <span className="ml-2">{currentTemplate.description}</span>
              </div>
              <div>
                <span className="font-medium">难度:</span>
                <span className="ml-2">{currentTemplate.metadata.difficulty}</span>
              </div>
              <div>
                <span className="font-medium">预计时间:</span>
                <span className="ml-2">{currentTemplate.metadata.estimatedTime} 小时</span>
              </div>
            </div>
            {currentTemplate.metadata.tags.length > 0 && (
              <div className="mt-4">
                <span className="font-medium text-sm">标签:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentTemplate.metadata.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperTypeSystemDemo;