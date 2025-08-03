'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  List, 
  FileText, 
  BookOpen, 
  Layers, 
  ChevronDown, 
  ChevronUp,
  Settings,
  Target,
  Clock,
  Zap
} from 'lucide-react';
import { FormData, OutlineOption, FormValidationError } from '@/types/form';

interface OutlinePreferenceProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: FormValidationError[];
}

const OutlinePreference: React.FC<OutlinePreferenceProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const [selectedDetails, setSelectedDetails] = useState({
    detailLevel: formData.detailLevel || 'detailed',
    citationStyle: formData.citationStyle || 'apa'
  });

  const outlineOptions: OutlineOption[] = [
    {
      id: 'traditional',
      name: '传统学术结构',
      description: '遵循经典的学术论文结构，适合大多数研究论文',
      structure: [
        '摘要 (Abstract)',
        '引言 (Introduction)', 
        '文献综述 (Literature Review)',
        '研究方法 (Methodology)',
        '结果与分析 (Results & Analysis)',
        '讨论 (Discussion)',
        '结论 (Conclusion)',
        '参考文献 (References)'
      ]
    },
    {
      id: 'imrad',
      name: 'IMRAD结构',
      description: '科学论文的标准格式：引言、方法、结果、讨论',
      structure: [
        '标题与摘要 (Title & Abstract)',
        '引言 (Introduction)',
        '材料与方法 (Materials & Methods)',
        '结果 (Results)',
        '讨论 (Discussion)',
        '致谢 (Acknowledgments)',
        '参考文献 (References)'
      ]
    },
    {
      id: 'progressive',
      name: '渐进式论证',
      description: '逐步建立论点，适合理论性较强的论文',
      structure: [
        '问题提出 (Problem Statement)',
        '理论基础 (Theoretical Foundation)',
        '核心概念分析 (Core Concept Analysis)',
        '论证过程 (Argumentation Process)',
        '反驳与回应 (Counter-arguments & Responses)',
        '综合讨论 (Comprehensive Discussion)',
        '结论与启示 (Conclusion & Implications)'
      ]
    },
    {
      id: 'case-study',
      name: '案例研究结构',
      description: '基于具体案例的分析框架',
      structure: [
        '案例背景 (Case Background)',
        '问题识别 (Problem Identification)',
        '理论框架 (Theoretical Framework)',
        '案例分析 (Case Analysis)',
        '解决方案 (Solutions)',
        '效果评估 (Evaluation)',
        '经验总结 (Lessons Learned)'
      ]
    },
    {
      id: 'comparative',
      name: '比较分析结构',
      description: '对比不同观点、方法或案例',
      structure: [
        '比较对象介绍 (Introduction of Subjects)',
        '比较维度确定 (Comparison Dimensions)',
        '相似性分析 (Similarity Analysis)',
        '差异性分析 (Difference Analysis)',
        '优劣势评估 (Pros & Cons Evaluation)',
        '综合评价 (Comprehensive Evaluation)',
        '建议与展望 (Recommendations & Outlook)'
      ]
    },
    {
      id: 'chronological',
      name: '时间序列结构',
      description: '按时间顺序梳理发展脉络',
      structure: [
        '历史背景 (Historical Background)',
        '发展阶段划分 (Development Phases)',
        '各阶段特征分析 (Phase Characteristics)',
        '转变原因探讨 (Transformation Causes)',
        '发展趋势分析 (Trend Analysis)',
        '未来预测 (Future Projections)',
        '总结与反思 (Summary & Reflection)'
      ]
    }
  ];

  const detailLevels = [
    {
      id: 'brief',
      name: '简要大纲',
      description: '只包含主要章节标题，适合快速起草',
      icon: Zap,
      features: ['1-2级标题', '核心要点', '快速生成']
    },
    {
      id: 'detailed',
      name: '详细大纲',
      description: '包含详细的子章节和要点说明',
      icon: List,
      features: ['多级标题', '详细要点', '结构完整']
    },
    {
      id: 'comprehensive',
      name: '全面大纲',
      description: '包含写作提示和参考建议',
      icon: BookOpen,
      features: ['完整结构', '写作指导', '参考建议']
    }
  ];

  const citationStyles = [
    { id: 'apa', name: 'APA', description: '美国心理学会格式，广泛用于社会科学' },
    { id: 'mla', name: 'MLA', description: '现代语言协会格式，常用于人文学科' },
    { id: 'chicago', name: 'Chicago', description: '芝加哥格式，适用于历史和文学' },
    { id: 'ieee', name: 'IEEE', description: '电气电子工程师协会格式，用于工程技术' },
    { id: 'harvard', name: 'Harvard', description: '哈佛格式，英式引用风格' },
    { id: 'vancouver', name: 'Vancouver', description: '温哥华格式，医学期刊常用' }
  ];

  const handleOutlineSelect = (optionId: string) => {
    updateFormData({ outlinePreference: optionId });
  };

  const handleDetailChange = (key: string, value: string) => {
    const newDetails = { ...selectedDetails, [key]: value };
    setSelectedDetails(newDetails);
    updateFormData({ [key]: value });
  };

  const toggleExpanded = (optionId: string) => {
    setExpandedOption(expandedOption === optionId ? null : optionId);
  };

  const hasError = errors.some(error => error.field === 'outlinePreference');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* 大纲结构选择 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">选择大纲结构</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outlineOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={`
                  border-2 rounded-lg cursor-pointer transition-all duration-300
                  ${
                    formData.outlinePreference === option.id
                      ? 'border-primary-500 bg-primary-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
                  }
                  ${hasError ? 'border-red-300' : ''}
                `}
              >
                {/* 头部 */}
                <div 
                  className="p-4"
                  onClick={() => handleOutlineSelect(option.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {option.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {option.description}
                      </p>
                      
                      {/* 预览前几个结构要素 */}
                      <div className="flex flex-wrap gap-1">
                        {option.structure.slice(0, 3).map((item, i) => (
                          <span
                            key={i}
                            className={`
                              px-2 py-1 text-xs rounded-full
                              ${
                                formData.outlinePreference === option.id
                                  ? 'bg-primary-200 text-primary-700'
                                  : 'bg-gray-100 text-gray-600'
                              }
                            `}
                          >
                            {item.split(' ')[0]}
                          </span>
                        ))}
                        {option.structure.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{option.structure.length - 3}更多
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 选中指示器 */}
                    {formData.outlinePreference === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center ml-3"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* 展开/收起按钮 */}
                <div className="px-4 pb-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(option.id);
                    }}
                    className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                  >
                    {expandedOption === option.id ? (
                      <>
                        收起结构 <ChevronUp size={16} className="ml-1" />
                      </>
                    ) : (
                      <>
                        查看完整结构 <ChevronDown size={16} className="ml-1" />
                      </>
                    )}
                  </button>
                </div>

                {/* 展开的结构详情 */}
                {expandedOption === option.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 p-4 bg-gray-50"
                  >
                    <h5 className="font-medium text-gray-900 mb-3">完整结构：</h5>
                    <ol className="space-y-2">
                      {option.structure.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {i + 1}
                          </span>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 详细程度选择 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">大纲详细程度</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {detailLevels.map((level, index) => {
            const IconComponent = level.icon;
            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleDetailChange('detailLevel', level.id)}
                className={`
                  p-4 border-2 rounded-lg cursor-pointer transition-all duration-300
                  ${
                    selectedDetails.detailLevel === level.id
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  }
                `}
              >
                <div className="flex items-center mb-3">
                  <div className={`
                    p-2 rounded-lg mr-3
                    ${
                      selectedDetails.detailLevel === level.id
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <IconComponent size={20} />
                  </div>
                  <h4 className="font-semibold text-gray-900">{level.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                <div className="flex flex-wrap gap-1">
                  {level.features.map((feature, i) => (
                    <span
                      key={i}
                      className={`
                        px-2 py-1 text-xs rounded-full
                        ${
                          selectedDetails.detailLevel === level.id
                            ? 'bg-primary-200 text-primary-700'
                            : 'bg-gray-100 text-gray-600'
                        }
                      `}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 引用格式选择 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">引用格式</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {citationStyles.map((style, index) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handleDetailChange('citationStyle', style.id)}
              className={`
                p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 text-center
                ${
                  selectedDetails.citationStyle === style.id
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-primary-300'
                }
              `}
            >
              <div className="font-semibold text-gray-900 mb-1">{style.name}</div>
              <div className="text-xs text-gray-600 leading-tight">{style.description}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 偏好总结 */}
      {formData.outlinePreference && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-6"
        >
          <div className="flex items-center mb-4">
            <Target className="text-green-500 mr-3" size={24} />
            <h3 className="text-lg font-semibold text-green-800">
              大纲偏好设置完成
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-green-700">选中结构</label>
              <p className="text-green-800">
                {outlineOptions.find(opt => opt.id === formData.outlinePreference)?.name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-green-700">详细程度</label>
              <p className="text-green-800">
                {detailLevels.find(level => level.id === selectedDetails.detailLevel)?.name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-green-700">引用格式</label>
              <p className="text-green-800">
                {citationStyles.find(style => style.id === selectedDetails.citationStyle)?.name}
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>预计生成时间：</strong> 2-3分钟 | 
              <strong> 章节数量：</strong> {outlineOptions.find(opt => opt.id === formData.outlinePreference)?.structure.length || 0}个 |
              <strong> 建议字数分配：</strong> 已优化
            </p>
          </div>
        </motion.div>
      )}

      {/* 使用提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Settings className="text-blue-500 mt-0.5" size={20} />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">
              大纲偏好说明
            </h4>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• 选择符合您学科和论文类型的大纲结构</li>
              <li>• 详细程度影响生成的大纲深度和写作指导</li>
              <li>• 引用格式将应用于参考文献和正文引用</li>
              <li>• 设置完成后，AI将生成个性化的论文大纲</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OutlinePreference;