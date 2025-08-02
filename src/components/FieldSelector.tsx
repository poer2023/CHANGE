'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Microscope, 
  Calculator, 
  Globe, 
  Heart, 
  Cpu, 
  BookOpen,
  Briefcase,
  Palette,
  Scale,
  Users,
  Leaf,
  Building,
  Search,
  X
} from 'lucide-react';
import { FormData, Field, ValidationError } from '@/types/form';

interface FieldSelectorProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: ValidationError[];
}

const FieldSelector: React.FC<FieldSelectorProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fields: Field[] = [
    // 理工科
    { id: 'computer-science', name: '计算机科学', description: '软件工程、人工智能、算法', icon: 'Cpu', color: 'blue' },
    { id: 'mathematics', name: '数学', description: '应用数学、统计学、数据分析', icon: 'Calculator', color: 'purple' },
    { id: 'physics', name: '物理学', description: '理论物理、实验物理、应用物理', icon: 'Microscope', color: 'cyan' },
    { id: 'chemistry', name: '化学', description: '有机化学、无机化学、分析化学', icon: 'Microscope', color: 'green' },
    { id: 'biology', name: '生物学', description: '分子生物学、生态学、遗传学', icon: 'Leaf', color: 'emerald' },
    { id: 'engineering', name: '工程学', description: '机械工程、电气工程、土木工程', icon: 'Building', color: 'orange' },
    
    // 社会科学
    { id: 'psychology', name: '心理学', description: '认知心理学、社会心理学、发展心理学', icon: 'Users', color: 'pink' },
    { id: 'sociology', name: '社会学', description: '社会理论、社会研究、社会政策', icon: 'Users', color: 'indigo' },
    { id: 'economics', name: '经济学', description: '宏观经济学、微观经济学、计量经济学', icon: 'Briefcase', color: 'yellow' },
    { id: 'political-science', name: '政治学', description: '政治理论、国际关系、公共政策', icon: 'Scale', color: 'red' },
    { id: 'geography', name: '地理学', description: '人文地理、自然地理、地理信息系统', icon: 'Globe', color: 'teal' },
    
    // 人文学科
    { id: 'literature', name: '文学', description: '比较文学、文学批评、创作研究', icon: 'BookOpen', color: 'amber' },
    { id: 'history', name: '历史学', description: '古代史、近现代史、史学理论', icon: 'BookOpen', color: 'stone' },
    { id: 'philosophy', name: '哲学', description: '西方哲学、中国哲学、逻辑学', icon: 'BookOpen', color: 'slate' },
    { id: 'linguistics', name: '语言学', description: '应用语言学、比较语言学、语言教学', icon: 'BookOpen', color: 'violet' },
    
    // 医学健康
    { id: 'medicine', name: '医学', description: '临床医学、基础医学、预防医学', icon: 'Heart', color: 'rose' },
    { id: 'nursing', name: '护理学', description: '临床护理、护理管理、护理教育', icon: 'Heart', color: 'pink' },
    { id: 'public-health', name: '公共卫生', description: '流行病学、卫生政策、健康促进', icon: 'Heart', color: 'red' },
    
    // 艺术设计
    { id: 'art', name: '艺术学', description: '美术、设计、艺术史', icon: 'Palette', color: 'fuchsia' },
    { id: 'music', name: '音乐学', description: '音乐理论、音乐教育、音乐表演', icon: 'Palette', color: 'purple' },
  ];

  const categories = [
    { id: 'stem', name: '理工科', color: 'blue' },
    { id: 'social', name: '社会科学', color: 'green' },
    { id: 'humanities', name: '人文学科', color: 'yellow' },
    { id: 'health', name: '医学健康', color: 'red' },
    { id: 'arts', name: '艺术设计', color: 'purple' }
  ];

  const getCategoryFields = (categoryId: string) => {
    switch (categoryId) {
      case 'stem':
        return fields.filter(f => ['computer-science', 'mathematics', 'physics', 'chemistry', 'biology', 'engineering'].includes(f.id));
      case 'social':
        return fields.filter(f => ['psychology', 'sociology', 'economics', 'political-science', 'geography'].includes(f.id));
      case 'humanities':
        return fields.filter(f => ['literature', 'history', 'philosophy', 'linguistics'].includes(f.id));
      case 'health':
        return fields.filter(f => ['medicine', 'nursing', 'public-health'].includes(f.id));
      case 'arts':
        return fields.filter(f => ['art', 'music'].includes(f.id));
      default:
        return fields;
    }
  };

  const getIcon = (iconName: string) => {
    const icons = {
      Microscope, Calculator, Globe, Heart, Cpu, BookOpen,
      Briefcase, Palette, Scale, Users, Leaf, Building
    };
    const IconComponent = icons[iconName as keyof typeof icons];
    return IconComponent ? <IconComponent size={24} /> : <BookOpen size={24} />;
  };

  const getColorClasses = (color: string, isSelected: boolean = false) => {
    const colorMap = {
      blue: isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      purple: isSelected ? 'bg-purple-500 text-white border-purple-500' : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      cyan: isSelected ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100',
      green: isSelected ? 'bg-green-500 text-white border-green-500' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      emerald: isSelected ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
      orange: isSelected ? 'bg-orange-500 text-white border-orange-500' : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
      pink: isSelected ? 'bg-pink-500 text-white border-pink-500' : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
      indigo: isSelected ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
      yellow: isSelected ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
      red: isSelected ? 'bg-red-500 text-white border-red-500' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
      teal: isSelected ? 'bg-teal-500 text-white border-teal-500' : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
      amber: isSelected ? 'bg-amber-500 text-white border-amber-500' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
      stone: isSelected ? 'bg-stone-500 text-white border-stone-500' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100',
      slate: isSelected ? 'bg-slate-500 text-white border-slate-500' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
      violet: isSelected ? 'bg-violet-500 text-white border-violet-500' : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100',
      rose: isSelected ? 'bg-rose-500 text-white border-rose-500' : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
      fuchsia: isSelected ? 'bg-fuchsia-500 text-white border-fuchsia-500' : 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-100',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const filteredFields = selectedCategory 
    ? getCategoryFields(selectedCategory).filter(field =>
        field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : fields.filter(field =>
        field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleSelect = (fieldId: string) => {
    updateFormData({ field: fieldId });
  };

  const hasError = errors.some(error => error.field === 'field');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 搜索栏 */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜索学科领域..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">按分类筛选：</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory === null
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category.id
                  ? getColorClasses(category.color, true)
                  : getColorClasses(category.color, false)
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 学科网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => handleSelect(field.id)}
            className={`
              relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-300
              ${
                formData.field === field.id
                  ? getColorClasses(field.color, true) + ' shadow-lg scale-105'
                  : getColorClasses(field.color, false) + ' hover:shadow-md'
              }
              ${hasError ? 'border-red-300' : ''}
            `}
          >
            {/* 选中指示器 */}
            {formData.field === field.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-current rounded-full" />
              </motion.div>
            )}

            {/* 图标和内容 */}
            <div className="flex items-start space-x-3">
              <div className={`
                p-2 rounded-lg
                ${formData.field === field.id ? 'bg-white bg-opacity-20' : 'bg-current bg-opacity-10'}
              `}>
                {getIcon(field.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1">
                  {field.name}
                </h3>
                <p className={`text-xs leading-relaxed ${
                  formData.field === field.id ? 'text-white text-opacity-90' : 'text-current text-opacity-70'
                }`}>
                  {field.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 无搜索结果 */}
      {filteredFields.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-2">
            <Search size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500">未找到匹配的学科领域</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory(null);
            }}
            className="mt-2 text-primary-600 hover:text-primary-700 text-sm"
          >
            清除筛选条件
          </button>
        </motion.div>
      )}

      {/* 当前选择显示 */}
      {formData.field && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
              ✓
            </div>
            <div className="ml-3">
              <p className="text-green-800 font-medium">
                已选择：{fields.find(field => field.id === formData.field)?.name}
              </p>
              <p className="text-green-600 text-sm">
                {fields.find(field => field.id === formData.field)?.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 提示信息 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">i</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">
              学科领域选择指南
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              选择您论文所属的学科领域。AI助手将根据不同学科的特点和规范，
              为您提供相应的写作建议、参考文献格式和论文结构指导。
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FieldSelector;