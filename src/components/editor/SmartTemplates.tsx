import React, { useState, useMemo } from 'react';
import {
  FileText,
  Zap,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  BookOpen,
  Lightbulb,
  Target,
  Award,
  TrendingUp,
  Settings,
  ChevronRight,
  Plus,
  Download,
  Eye,
  Check
} from 'lucide-react';

// 智能模板类型
interface SmartTemplate {
  id: string;
  name: string;
  description: string;
  category: 'academic' | 'business' | 'technical' | 'creative';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // 分钟
  wordCount: { min: number; max: number };
  sections: TemplateSection[];
  tags: string[];
  rating: number;
  usageCount: number;
  lastUpdated: Date;
  aiEnhanced: boolean;
  preview?: string;
}

interface TemplateSection {
  id: string;
  title: string;
  description: string;
  type: 'required' | 'optional' | 'conditional';
  placeholder: string;
  aiSuggestions?: string[];
  wordTarget?: number;
}

interface SmartTemplatesProps {
  onTemplateSelect: (template: SmartTemplate) => void;
  onTemplatePreview: (template: SmartTemplate) => void;
  selectedCategory?: string;
  compactMode?: boolean;
}

const SmartTemplates: React.FC<SmartTemplatesProps> = ({
  onTemplateSelect,
  onTemplatePreview,
  selectedCategory,
  compactMode = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>(selectedCategory || 'all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'recent' | 'time'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 模拟模板数据
  const templates: SmartTemplate[] = useMemo(() => [
    {
      id: 'academic-research-paper',
      name: '学术研究论文',
      description: '标准学术研究论文模板，包含完整的研究结构和规范格式',
      category: 'academic',
      difficulty: 'advanced',
      estimatedTime: 180,
      wordCount: { min: 5000, max: 8000 },
      rating: 4.8,
      usageCount: 1250,
      lastUpdated: new Date('2024-01-15'),
      aiEnhanced: true,
      tags: ['研究', '学术', '论文', 'APA格式'],
      sections: [
        {
          id: 'title',
          title: '标题页',
          description: '论文标题、作者信息和摘要',
          type: 'required',
          placeholder: '请输入论文标题...',
          wordTarget: 50
        },
        {
          id: 'abstract',
          title: '摘要',
          description: '研究概要和关键发现',
          type: 'required',
          placeholder: '本研究旨在...',
          aiSuggestions: ['研究背景', '方法概述', '主要发现', '结论意义'],
          wordTarget: 250
        },
        {
          id: 'introduction',
          title: '引言',
          description: '研究背景、问题陈述和假设',
          type: 'required',
          placeholder: '在当前的研究背景下...',
          aiSuggestions: ['文献回顾', '研究缺口', '研究问题', '假设提出'],
          wordTarget: 800
        },
        {
          id: 'methodology',
          title: '研究方法',
          description: '研究设计、数据收集和分析方法',
          type: 'required',
          placeholder: '本研究采用...',
          wordTarget: 1000
        },
        {
          id: 'results',
          title: '研究结果',
          description: '数据分析结果和发现',
          type: 'required',
          placeholder: '研究结果显示...',
          wordTarget: 1200
        },
        {
          id: 'discussion',
          title: '讨论',
          description: '结果解释和理论意义',
          type: 'required',
          placeholder: '基于研究结果...',
          wordTarget: 1000
        },
        {
          id: 'conclusion',
          title: '结论',
          description: '研究总结和未来方向',
          type: 'required',
          placeholder: '综上所述...',
          wordTarget: 400
        },
        {
          id: 'references',
          title: '参考文献',
          description: '引用文献列表',
          type: 'required',
          placeholder: '[1] ...',
          wordTarget: 300
        }
      ],
      preview: '这是一个专业的学术研究论文模板，遵循国际学术写作标准...'
    },
    {
      id: 'business-proposal',
      name: '商业提案',
      description: '专业商业提案模板，适用于项目申请和商业计划',
      category: 'business',
      difficulty: 'intermediate',
      estimatedTime: 120,
      wordCount: { min: 3000, max: 5000 },
      rating: 4.6,
      usageCount: 890,
      lastUpdated: new Date('2024-02-01'),
      aiEnhanced: true,
      tags: ['商业', '提案', '项目', '计划书'],
      sections: [
        {
          id: 'executive-summary',
          title: '执行摘要',
          description: '提案核心内容概述',
          type: 'required',
          placeholder: '本提案旨在...',
          wordTarget: 300
        },
        {
          id: 'problem-statement',
          title: '问题陈述',
          description: '识别和定义待解决的问题',
          type: 'required',
          placeholder: '当前市场面临的主要挑战是...',
          wordTarget: 500
        },
        {
          id: 'solution',
          title: '解决方案',
          description: '提出的解决方案和方法',
          type: 'required',
          placeholder: '我们提出的解决方案包括...',
          wordTarget: 800
        },
        {
          id: 'implementation',
          title: '实施计划',
          description: '详细的实施步骤和时间表',
          type: 'required',
          placeholder: '实施将分为以下阶段...',
          wordTarget: 600
        },
        {
          id: 'budget',
          title: '预算分析',
          description: '成本估算和资源需求',
          type: 'required',
          placeholder: '项目总预算为...',
          wordTarget: 400
        }
      ],
      preview: '专业的商业提案模板，帮助您清晰地表达商业想法和计划...'
    },
    {
      id: 'technical-documentation',
      name: '技术文档',
      description: '标准技术文档模板，适用于软件和技术项目文档',
      category: 'technical',
      difficulty: 'intermediate',
      estimatedTime: 90,
      wordCount: { min: 2000, max: 4000 },
      rating: 4.5,
      usageCount: 650,
      lastUpdated: new Date('2024-01-20'),
      aiEnhanced: false,
      tags: ['技术', '文档', '软件', 'API'],
      sections: [
        {
          id: 'overview',
          title: '概述',
          description: '技术项目的总体介绍',
          type: 'required',
          placeholder: '本文档描述了...',
          wordTarget: 200
        },
        {
          id: 'architecture',
          title: '系统架构',
          description: '技术架构和设计模式',
          type: 'required',
          placeholder: '系统采用...',
          wordTarget: 600
        },
        {
          id: 'api-reference',
          title: 'API参考',
          description: 'API接口文档和使用说明',
          type: 'optional',
          placeholder: '接口列表：...',
          wordTarget: 800
        },
        {
          id: 'deployment',
          title: '部署指南',
          description: '安装和部署说明',
          type: 'required',
          placeholder: '部署步骤：...',
          wordTarget: 400
        }
      ],
      preview: '清晰的技术文档模板，帮助开发者快速理解和使用技术项目...'
    },
    {
      id: 'creative-essay',
      name: '创意文章',
      description: '创意写作模板，适用于散文、评论和创意内容',
      category: 'creative',
      difficulty: 'beginner',
      estimatedTime: 60,
      wordCount: { min: 1000, max: 2500 },
      rating: 4.3,
      usageCount: 420,
      lastUpdated: new Date('2024-02-10'),
      aiEnhanced: true,
      tags: ['创意', '散文', '评论', '文学'],
      sections: [
        {
          id: 'hook',
          title: '引人入胜的开头',
          description: '吸引读者注意力的开头',
          type: 'required',
          placeholder: '你有没有想过...',
          aiSuggestions: ['问题开头', '故事开头', '引用开头', '对比开头'],
          wordTarget: 150
        },
        {
          id: 'main-content',
          title: '主体内容',
          description: '文章的核心内容和观点',
          type: 'required',
          placeholder: '让我们深入探讨...',
          wordTarget: 800
        },
        {
          id: 'conclusion',
          title: '有力的结尾',
          description: '总结和升华的结尾',
          type: 'required',
          placeholder: '最终，我们可以看到...',
          wordTarget: 200
        }
      ],
      preview: '灵活的创意写作模板，激发您的创作灵感...'
    }
  ], []);

  // 过滤和排序模板
  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = templates.filter(template => {
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      return true;
    }).filter(template => {
      // 类别过滤
      if (categoryFilter !== 'all' && template.category !== categoryFilter) return false;
      // 难度过滤
      if (difficultyFilter !== 'all' && template.difficulty !== difficultyFilter) return false;
      return true;
    });

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.usageCount - a.usageCount;
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
          return b.lastUpdated.getTime() - a.lastUpdated.getTime();
        case 'time':
          return a.estimatedTime - b.estimatedTime;
        default:
          return 0;
      }
    });

    return filtered;
  }, [templates, searchQuery, categoryFilter, difficultyFilter, sortBy]);

  // 获取类别图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return <BookOpen className="h-4 w-4" />;
      case 'business':
        return <TrendingUp className="h-4 w-4" />;
      case 'technical':
        return <Settings className="h-4 w-4" />;
      case 'creative':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // 格式化时间
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Zap className="h-5 w-5 text-purple-500" />
            <span>智能模板</span>
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
              {filteredAndSortedTemplates.length}
            </span>
          </h3>
          
          {!compactMode && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 hover:text-gray-900 rounded"
                title={viewMode === 'grid' ? '列表视图' : '网格视图'}
              >
                {viewMode === 'grid' ? <Eye className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>

        {/* 搜索和过滤 */}
        <div className="space-y-3">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索模板..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 过滤器 */}
          <div className="grid grid-cols-3 gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">所有类别</option>
              <option value="academic">学术</option>
              <option value="business">商业</option>
              <option value="technical">技术</option>
              <option value="creative">创意</option>
            </select>
            
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">所有难度</option>
              <option value="beginner">初级</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500"
            >
              <option value="popular">热门</option>
              <option value="rating">评分</option>
              <option value="recent">最新</option>
              <option value="time">时长</option>
            </select>
          </div>
        </div>
      </div>

      {/* 模板列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredAndSortedTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的模板</h3>
            <p className="text-gray-500 text-sm">尝试调整搜索条件或过滤器</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' && !compactMode
              ? 'grid grid-cols-1 lg:grid-cols-2 gap-4'
              : 'space-y-3'
          }>
            {filteredAndSortedTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className="p-4">
                  {/* 模板头部 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        template.category === 'academic' ? 'bg-blue-100 text-blue-600' :
                        template.category === 'business' ? 'bg-green-100 text-green-600' :
                        template.category === 'technical' ? 'bg-purple-100 text-purple-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {getCategoryIcon(template.category)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          {template.aiEnhanced && (
                            <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                              <Zap className="h-3 w-3" />
                              <span>AI增强</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {template.description}
                        </p>
                        
                        {/* 标签 */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {template.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {template.tags.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{template.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 模板信息 */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{template.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{template.usageCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(template.estimatedTime)}</span>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty === 'beginner' ? '初级' :
                       template.difficulty === 'intermediate' ? '中级' : '高级'}
                    </span>
                  </div>

                  {/* 字数范围 */}
                  <div className="text-xs text-gray-500 mb-3">
                    目标字数: {template.wordCount.min.toLocaleString()} - {template.wordCount.max.toLocaleString()}
                  </div>

                  {/* 章节预览 */}
                  {!compactMode && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-600 mb-1">包含章节:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.sections.slice(0, 4).map((section) => (
                          <span
                            key={section.id}
                            className={`text-xs px-2 py-0.5 rounded ${
                              section.type === 'required' 
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {section.title}
                          </span>
                        ))}
                        {template.sections.length > 4 && (
                          <span className="text-xs text-gray-400">
                            +{template.sections.length - 4}个
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onTemplateSelect(template)}
                      className="flex-1 flex items-center justify-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-2 rounded transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      <span>使用模板</span>
                    </button>
                    
                    <button
                      onClick={() => onTemplatePreview(template)}
                      className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded text-sm transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 快捷操作 */}
      {!compactMode && filteredAndSortedTemplates.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              找到 {filteredAndSortedTemplates.length} 个模板
            </span>
            <div className="flex space-x-2">
              <button className="text-purple-600 hover:text-purple-700 flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>导出收藏</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartTemplates;