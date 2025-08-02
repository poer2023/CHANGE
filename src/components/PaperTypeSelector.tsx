'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, GraduationCap, Briefcase, Users, TrendingUp } from 'lucide-react';
import { FormData, PaperType, ValidationError } from '@/types/form';

interface PaperTypeSelectorProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: ValidationError[];
}

const PaperTypeSelector: React.FC<PaperTypeSelectorProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const paperTypes: PaperType[] = [
    {
      id: 'research',
      name: '学术研究论文',
      description: '基于原创研究的学术论文，包含完整的研究方法和数据分析',
      icon: 'BookOpen',
      features: ['文献综述', '研究方法', '数据分析', '结论讨论']
    },
    {
      id: 'review',
      name: '综述论文',
      description: '对特定领域现有研究的系统性回顾和分析',
      icon: 'FileText',
      features: ['文献搜索', '系统分析', '趋势总结', '未来展望']
    },
    {
      id: 'thesis',
      name: '学位论文',
      description: '本科、硕士或博士学位论文，具有完整的学术结构',
      icon: 'GraduationCap',
      features: ['开题报告', '研究设计', '深度分析', '创新贡献']
    },
    {
      id: 'case',
      name: '案例分析',
      description: '基于具体案例的深入分析和讨论',
      icon: 'Briefcase',
      features: ['案例背景', '问题识别', '解决方案', '启示总结']
    },
    {
      id: 'conference',
      name: '会议论文',
      description: '适用于学术会议投稿的短篇研究论文',
      icon: 'Users',
      features: ['简洁结构', '核心观点', '创新亮点', '快速发表']
    },
    {
      id: 'survey',
      name: '调研报告',
      description: '基于调查数据的分析报告',
      icon: 'TrendingUp',
      features: ['数据收集', '统计分析', '图表展示', '洞察结论']
    }
  ];

  const getIcon = (iconName: string) => {
    const icons = {
      BookOpen,
      FileText,
      GraduationCap,
      Briefcase,
      Users,
      TrendingUp
    };
    const IconComponent = icons[iconName as keyof typeof icons];
    return IconComponent ? <IconComponent size={32} /> : <BookOpen size={32} />;
  };

  const handleSelect = (paperTypeId: string) => {
    updateFormData({ paperType: paperTypeId });
  };

  const hasError = errors.some(error => error.field === 'paperType');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paperTypes.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => handleSelect(type.id)}
            className={`
              relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300
              ${
                formData.paperType === type.id
                  ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
              }
              ${hasError ? 'border-red-300' : ''}
            `}
          >
            {/* 选中指示器 */}
            {formData.paperType === type.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              </motion.div>
            )}

            {/* 图标 */}
            <div className={`
              mb-4 p-3 rounded-lg inline-flex
              ${
                formData.paperType === type.id
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-100 text-gray-600'
              }
            `}>
              {getIcon(type.icon)}
            </div>

            {/* 标题和描述 */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {type.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {type.description}
            </p>

            {/* 特性标签 */}
            <div className="flex flex-wrap gap-2">
              {type.features.map((feature, featureIndex) => (
                <span
                  key={featureIndex}
                  className={`
                    px-2 py-1 text-xs rounded-full
                    ${
                      formData.paperType === type.id
                        ? 'bg-primary-200 text-primary-700'
                        : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* 选中时的动画效果 */}
            {formData.paperType === type.id && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 border-2 border-primary-400 rounded-xl pointer-events-none"
                style={{
                  background: 'linear-gradient(45deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)'
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* 选择提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">?</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">
              如何选择论文类型？
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              选择最符合您写作目标的论文类型。不同类型的论文具有不同的结构和要求，
              AI助手将根据您的选择提供相应的写作指导和模板。
            </p>
          </div>
        </div>
      </motion.div>

      {/* 当前选择显示 */}
      {formData.paperType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                ✓
              </motion.div>
            </div>
            <div className="ml-3">
              <p className="text-green-800 font-medium">
                已选择：{paperTypes.find(type => type.id === formData.paperType)?.name}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PaperTypeSelector;