import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Search,
  Users,
  TrendingUp,
  MessageSquare,
  Brain,
  Layers,
  Award,
  ChevronRight,
  Star,
  Clock,
  Target,
  Info
} from 'lucide-react';
import { 
  EnglishPaperType, 
  PaperTypeDefinition, 
  AcademicLevel,
  PaperTypeRecommendation 
} from '@/types/paper-types';
import { FormData, FormValidationError } from '@/types/form';

interface PaperTypeSelectorProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: FormValidationError[];
  onRecommendationRequest?: (input: string) => Promise<PaperTypeRecommendation[]>;
}

// 10种英语系论文类型定义
const ENGLISH_PAPER_TYPES: PaperTypeDefinition[] = [
  {
    id: 'literary-analysis',
    name: { en: 'Literary Analysis Paper', zh: '文学分析论文' },
    description: { 
      en: 'In-depth analysis of literary works, themes, and techniques',
      zh: '深入分析文学作品、主题和写作技巧'
    },
    icon: 'BookOpen',
    color: 'indigo',
    academicLevels: ['undergraduate', 'master', 'doctoral'],
    complexity: 'intermediate',
    typicalWordCount: {
      undergraduate: { min: 1500, max: 3000 },
      master: { min: 3000, max: 6000 },
      doctoral: { min: 8000, max: 15000 }
    },
    coreFeatures: ['Close Reading', 'Textual Evidence', 'Literary Theory', 'Critical Interpretation'],
    requiredSections: ['Introduction', 'Analysis', 'Evidence', 'Conclusion'],
    optionalSections: ['Historical Context', 'Comparative Analysis'],
    citationStyles: ['MLA', 'Chicago'],
    keywords: ['literature', 'analysis', 'interpretation', 'symbolism', 'theme'],
    relatedTypes: ['comparative-analysis', 'critical-review']
  },
  {
    id: 'comparative-analysis',
    name: { en: 'Comparative Analysis Paper', zh: '比较分析论文' },
    description: { 
      en: 'Systematic comparison of two or more subjects, texts, or concepts',
      zh: '对两个或多个主题、文本或概念进行系统比较'
    },
    icon: 'Layers',
    color: 'blue',
    academicLevels: ['undergraduate', 'master'],
    complexity: 'intermediate',
    typicalWordCount: {
      undergraduate: { min: 2000, max: 4000 },
      master: { min: 4000, max: 8000 },
      doctoral: { min: 8000, max: 12000 }
    },
    coreFeatures: ['Comparative Framework', 'Structured Comparison', 'Analytical Synthesis'],
    requiredSections: ['Introduction', 'Comparison Framework', 'Analysis', 'Synthesis'],
    optionalSections: ['Individual Analysis', 'Historical Context'],
    citationStyles: ['MLA', 'APA', 'Chicago'],
    keywords: ['comparison', 'contrast', 'analysis', 'similarities', 'differences'],
    relatedTypes: ['literary-analysis', 'cultural-analysis']
  },
  {
    id: 'cultural-analysis',
    name: { en: 'Cultural Analysis Paper', zh: '文化分析论文' },
    description: { 
      en: 'Analysis of cultural phenomena, practices, and their meanings',
      zh: '分析文化现象、实践及其意义'
    },
    icon: 'Users',
    color: 'purple',
    academicLevels: ['master', 'doctoral'],
    complexity: 'advanced',
    typicalWordCount: {
      undergraduate: { min: 2500, max: 4000 },
      master: { min: 5000, max: 10000 },
      doctoral: { min: 10000, max: 20000 }
    },
    coreFeatures: ['Cultural Theory', 'Ethnographic Methods', 'Social Context', 'Critical Analysis'],
    requiredSections: ['Introduction', 'Theoretical Framework', 'Cultural Analysis', 'Implications'],
    optionalSections: ['Methodology', 'Case Studies', 'Comparative Elements'],
    citationStyles: ['APA', 'Chicago', 'Harvard'],
    keywords: ['culture', 'society', 'anthropology', 'ethnography', 'social analysis'],
    relatedTypes: ['case-study', 'discourse-analysis']
  },
  {
    id: 'literature-review',
    name: { en: 'Literature Review', zh: '文献综述' },
    description: { 
      en: 'Comprehensive review and synthesis of existing research',
      zh: '全面回顾和综合现有研究'
    },
    icon: 'Search',
    color: 'green',
    academicLevels: ['undergraduate', 'master', 'doctoral'],
    complexity: 'basic',
    typicalWordCount: {
      undergraduate: { min: 2000, max: 4000 },
      master: { min: 4000, max: 8000 },
      doctoral: { min: 8000, max: 15000 }
    },
    coreFeatures: ['Source Evaluation', 'Synthesis', 'Gap Identification', 'Research Trends'],
    requiredSections: ['Introduction', 'Literature Review', 'Analysis', 'Conclusion'],
    optionalSections: ['Methodology', 'Chronological Overview', 'Future Directions'],
    citationStyles: ['APA', 'MLA', 'Chicago', 'Harvard'],
    keywords: ['review', 'synthesis', 'research', 'literature', 'analysis'],
    relatedTypes: ['empirical-research', 'theoretical-discussion']
  },
  {
    id: 'critical-review',
    name: { en: 'Critical Review', zh: '批判性评述' },
    description: { 
      en: 'Critical evaluation and assessment of works, theories, or arguments',
      zh: '对作品、理论或论点进行批判性评价和评估'
    },
    icon: 'MessageSquare',
    color: 'red',
    academicLevels: ['undergraduate', 'master'],
    complexity: 'intermediate',
    typicalWordCount: {
      undergraduate: { min: 1500, max: 3000 },
      master: { min: 3000, max: 6000 },
      doctoral: { min: 6000, max: 10000 }
    },
    coreFeatures: ['Critical Thinking', 'Evaluation Framework', 'Evidence-based Arguments'],
    requiredSections: ['Introduction', 'Summary', 'Critical Analysis', 'Evaluation'],
    optionalSections: ['Comparison', 'Recommendations', 'Implications'],
    citationStyles: ['MLA', 'APA', 'Chicago'],
    keywords: ['critical', 'evaluation', 'assessment', 'critique', 'analysis'],
    relatedTypes: ['literary-analysis', 'comparative-analysis']
  },
  {
    id: 'empirical-research',
    name: { en: 'Empirical Research Paper', zh: '实证研究论文' },
    description: { 
      en: 'Original research based on empirical evidence and data analysis',
      zh: '基于实证证据和数据分析的原创研究'
    },
    icon: 'TrendingUp',
    color: 'cyan',
    academicLevels: ['master', 'doctoral'],
    complexity: 'advanced',
    typicalWordCount: {
      undergraduate: { min: 3000, max: 5000 },
      master: { min: 6000, max: 12000 },
      doctoral: { min: 12000, max: 25000 }
    },
    coreFeatures: ['Research Design', 'Data Collection', 'Statistical Analysis', 'Results Interpretation'],
    requiredSections: ['Introduction', 'Literature Review', 'Methodology', 'Results', 'Discussion'],
    optionalSections: ['Theoretical Framework', 'Limitations', 'Future Research'],
    citationStyles: ['APA', 'IEEE', 'Harvard'],
    keywords: ['empirical', 'research', 'data', 'methodology', 'analysis'],
    relatedTypes: ['case-study', 'literature-review']
  },
  {
    id: 'case-study',
    name: { en: 'Case Study Paper', zh: '个案研究论文' },
    description: { 
      en: 'In-depth analysis of specific cases, individuals, or phenomena',
      zh: '对特定案例、个体或现象进行深入分析'
    },
    icon: 'Target',
    color: 'orange',
    academicLevels: ['master', 'doctoral'],
    complexity: 'advanced',
    typicalWordCount: {
      undergraduate: { min: 2500, max: 4000 },
      master: { min: 5000, max: 10000 },
      doctoral: { min: 10000, max: 18000 }
    },
    coreFeatures: ['Case Selection', 'Detailed Analysis', 'Multiple Perspectives', 'Practical Implications'],
    requiredSections: ['Introduction', 'Case Background', 'Analysis', 'Findings', 'Implications'],
    optionalSections: ['Methodology', 'Theoretical Framework', 'Recommendations'],
    citationStyles: ['APA', 'Chicago', 'Harvard'],
    keywords: ['case study', 'analysis', 'qualitative', 'investigation', 'specific'],
    relatedTypes: ['empirical-research', 'cultural-analysis']
  },
  {
    id: 'discourse-analysis',
    name: { en: 'Discourse Analysis Paper', zh: '话语分析论文' },
    description: { 
      en: 'Analysis of language use in social contexts and communication',
      zh: '分析社会语境中的语言使用和交流'
    },
    icon: 'MessageSquare',
    color: 'teal',
    academicLevels: ['master', 'doctoral'],
    complexity: 'advanced',
    typicalWordCount: {
      undergraduate: { min: 3000, max: 5000 },
      master: { min: 6000, max: 10000 },
      doctoral: { min: 10000, max: 20000 }
    },
    coreFeatures: ['Linguistic Analysis', 'Social Context', 'Power Relations', 'Critical Discourse'],
    requiredSections: ['Introduction', 'Theoretical Framework', 'Methodology', 'Analysis', 'Discussion'],
    optionalSections: ['Historical Context', 'Comparative Analysis', 'Implications'],
    citationStyles: ['APA', 'MLA', 'Chicago'],
    keywords: ['discourse', 'language', 'communication', 'social', 'linguistic'],
    relatedTypes: ['cultural-analysis', 'theoretical-discussion']
  },
  {
    id: 'theoretical-discussion',
    name: { en: 'Theoretical Discussion Paper', zh: '理论探讨论文' },
    description: { 
      en: 'Exploration and development of theoretical concepts and frameworks',
      zh: '探索和发展理论概念和框架'
    },
    icon: 'Brain',
    color: 'violet',
    academicLevels: ['doctoral'],
    complexity: 'advanced',
    typicalWordCount: {
      undergraduate: { min: 4000, max: 6000 },
      master: { min: 8000, max: 12000 },
      doctoral: { min: 15000, max: 30000 }
    },
    coreFeatures: ['Theoretical Framework', 'Conceptual Development', 'Philosophical Analysis', 'Innovation'],
    requiredSections: ['Introduction', 'Theoretical Background', 'Discussion', 'Implications', 'Conclusion'],
    optionalSections: ['Historical Overview', 'Comparative Theories', 'Applications'],
    citationStyles: ['APA', 'Chicago', 'Harvard'],
    keywords: ['theory', 'conceptual', 'philosophical', 'framework', 'discussion'],
    relatedTypes: ['literature-review', 'discourse-analysis']
  },
  {
    id: 'dissertation-thesis',
    name: { en: 'Dissertation/Thesis', zh: '学位论文' },
    description: { 
      en: 'Comprehensive academic work for degree requirements',
      zh: '满足学位要求的综合性学术作品'
    },
    icon: 'GraduationCap',
    color: 'amber',
    academicLevels: ['master', 'doctoral'],
    complexity: 'advanced',
    typicalWordCount: {
      undergraduate: { min: 8000, max: 15000 },
      master: { min: 15000, max: 30000 },
      doctoral: { min: 50000, max: 100000 }
    },
    coreFeatures: ['Comprehensive Research', 'Original Contribution', 'Rigorous Methodology', 'Extensive Analysis'],
    requiredSections: ['Abstract', 'Introduction', 'Literature Review', 'Methodology', 'Results', 'Discussion', 'Conclusion'],
    optionalSections: ['Acknowledgments', 'Appendices', 'Glossary', 'Index'],
    citationStyles: ['APA', 'MLA', 'Chicago', 'Harvard', 'IEEE'],
    keywords: ['dissertation', 'thesis', 'research', 'comprehensive', 'academic'],
    relatedTypes: ['empirical-research', 'literature-review', 'theoretical-discussion']
  }
];

const PaperTypeSelector: React.FC<PaperTypeSelectorProps> = ({
  formData,
  updateFormData,
  errors,
  onRecommendationRequest
}) => {
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState<AcademicLevel>('undergraduate');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<PaperTypeRecommendation[]>([]);
  const [expandedType, setExpandedType] = useState<EnglishPaperType | null>(null);

  // 过滤论文类型
  const filteredTypes = ENGLISH_PAPER_TYPES.filter(type => {
    const matchesLevel = type.academicLevels.includes(selectedAcademicLevel);
    const matchesSearch = searchQuery === '' || 
      type.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.name.zh.includes(searchQuery) ||
      type.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesLevel && matchesSearch;
  });

  // 获取图标组件
  const getIcon = (iconName: string) => {
    const icons = {
      BookOpen, FileText, GraduationCap, Search, Users, TrendingUp,
      MessageSquare, Brain, Layers, Target, Award
    };
    const IconComponent = icons[iconName as keyof typeof icons];
    return IconComponent ? <IconComponent size={24} /> : <BookOpen size={24} />;
  };

  // 获取颜色类
  const getColorClass = (color: string, selected: boolean = false) => {
    const colors = {
      indigo: selected ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-600 border-indigo-200',
      blue: selected ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600 border-blue-200',
      purple: selected ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-600 border-purple-200',
      green: selected ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 border-green-200',
      red: selected ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 border-red-200',
      cyan: selected ? 'bg-cyan-500 text-white' : 'bg-cyan-50 text-cyan-600 border-cyan-200',
      orange: selected ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600 border-orange-200',
      teal: selected ? 'bg-teal-500 text-white' : 'bg-teal-50 text-teal-600 border-teal-200',
      violet: selected ? 'bg-violet-500 text-white' : 'bg-violet-50 text-violet-600 border-violet-200',
      amber: selected ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 border-amber-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  // 处理类型选择
  const handleTypeSelect = (paperType: EnglishPaperType) => {
    updateFormData({ 
      paperType: paperType,
      // 可以根据论文类型设置其他默认值
    });
  };

  // 处理智能推荐请求
  const handleRecommendationRequest = async () => {
    if (onRecommendationRequest && (formData.title || formData.requirements)) {
      try {
        const input = `${formData.title || ''} ${formData.requirements || ''}`.trim();
        const recs = await onRecommendationRequest(input);
        setRecommendations(recs);
        setShowRecommendations(true);
      } catch (error) {
        console.error('Failed to get recommendations:', error);
      }
    }
  };

  const hasError = errors.some(error => error.field === 'paperType');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* 顶部控制区域 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* 学术层次选择 */}
        <div className="flex gap-2">
          {(['undergraduate', 'master', 'doctoral'] as AcademicLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedAcademicLevel(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedAcademicLevel === level
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

        {/* 搜索和推荐 */}
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="搜索论文类型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {onRecommendationRequest && (
            <button
              onClick={handleRecommendationRequest}
              disabled={!(formData.title || formData.requirements)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Star size={16} />
              <span className="hidden sm:inline">智能推荐</span>
            </button>
          )}
        </div>
      </div>

      {/* 智能推荐结果 */}
      <AnimatePresence>
        {showRecommendations && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-purple-50 border border-purple-200 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Star className="text-purple-600" size={20} />
              <h3 className="font-semibold text-purple-900">AI推荐结果</h3>
              <button
                onClick={() => setShowRecommendations(false)}
                className="ml-auto text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div
                  key={index}
                  onClick={() => handleTypeSelect(rec.paperType)}
                  className="bg-white p-3 rounded-lg border border-purple-200 cursor-pointer hover:border-purple-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-purple-900">
                        {ENGLISH_PAPER_TYPES.find(t => t.id === rec.paperType)?.name.zh}
                      </div>
                      <div className="text-sm text-purple-600">
                        匹配度: {Math.round(rec.confidence * 100)}%
                      </div>
                    </div>
                    <div className="text-purple-400">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 论文类型网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTypes.map((type, index) => {
          const isSelected = formData.paperType === type.id;
          const isExpanded = expandedType === type.id;
          
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                isSelected
                  ? `${getColorClass(type.color, true)} shadow-lg scale-105`
                  : `${getColorClass(type.color)} hover:shadow-md hover:scale-102`
              } ${hasError ? 'border-red-300' : ''}`}
            >
              {/* 主要内容区域 */}
              <div
                onClick={() => handleTypeSelect(type.id)}
                className="p-6"
              >
                {/* 选中指示器 */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                  </motion.div>
                )}

                {/* 图标和复杂度 */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    isSelected ? 'bg-white bg-opacity-20' : ''
                  }`}>
                    {getIcon(type.icon)}
                  </div>
                  <div className="flex items-center gap-1">
                    {type.complexity === 'basic' && <Clock size={16} />}
                    {type.complexity === 'intermediate' && <Target size={16} />}
                    {type.complexity === 'advanced' && <Award size={16} />}
                    <span className="text-xs font-medium">
                      {type.complexity === 'basic' && '基础'}
                      {type.complexity === 'intermediate' && '中级'}
                      {type.complexity === 'advanced' && '高级'}
                    </span>
                  </div>
                </div>

                {/* 标题和描述 */}
                <h3 className="text-lg font-semibold mb-2">
                  {type.name.zh}
                </h3>
                <p className="text-sm mb-4 opacity-90 leading-relaxed">
                  {type.description.zh}
                </p>

                {/* 字数范围 */}
                <div className="flex items-center gap-2 text-xs mb-4">
                  <FileText size={14} />
                  <span>
                    {type.typicalWordCount[selectedAcademicLevel].min.toLocaleString()} - {' '}
                    {type.typicalWordCount[selectedAcademicLevel].max.toLocaleString()} 字
                  </span>
                </div>

                {/* 核心特性标签 */}
                <div className="flex flex-wrap gap-2">
                  {type.coreFeatures.slice(0, 3).map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      className={`px-2 py-1 text-xs rounded-full ${
                        isSelected
                          ? 'bg-white bg-opacity-20'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
                  {type.coreFeatures.length > 3 && (
                    <span className="text-xs opacity-75">
                      +{type.coreFeatures.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* 展开按钮 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedType(isExpanded ? null : type.id);
                }}
                className={`w-full p-3 border-t ${
                  isSelected ? 'border-white border-opacity-20' : 'border-gray-200'
                } flex items-center justify-center gap-2 text-sm font-medium transition-colors`}
              >
                <Info size={16} />
                详细信息
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={16} />
                </motion.div>
              </button>

              {/* 详细信息展开区域 */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`border-t ${
                      isSelected ? 'border-white border-opacity-20' : 'border-gray-200'
                    } p-4 text-sm space-y-3`}
                  >
                    <div>
                      <div className="font-medium mb-1">必需章节:</div>
                      <div className="text-xs opacity-90">
                        {type.requiredSections.join(', ')}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">推荐引用格式:</div>
                      <div className="text-xs opacity-90">
                        {type.citationStyles.join(', ')}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">关键词:</div>
                      <div className="text-xs opacity-90">
                        {type.keywords.join(', ')}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* 空状态 */}
      {filteredTypes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            未找到匹配的论文类型
          </h3>
          <p className="text-gray-500">
            请尝试调整搜索条件或选择不同的学术层次
          </p>
        </motion.div>
      )}

      {/* 当前选择显示 */}
      {formData.paperType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white font-bold"
              >
                ✓
              </motion.div>
            </div>
            <div className="ml-3">
              <p className="text-green-800 font-medium">
                已选择：{ENGLISH_PAPER_TYPES.find(type => type.id === formData.paperType)?.name.zh}
              </p>
              <p className="text-green-600 text-sm">
                学术层次：{selectedAcademicLevel === 'undergraduate' && '本科'}
                {selectedAcademicLevel === 'master' && '硕士'}
                {selectedAcademicLevel === 'doctoral' && '博士'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 选择提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
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
              根据您的研究目标和学术层次选择最合适的论文类型。每种类型都有特定的结构要求和写作指导，
              AI助手将为您提供专业化的写作建议和模板支持。
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaperTypeSelector;