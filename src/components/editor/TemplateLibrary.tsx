import React, { useState } from 'react';
import {
  Search,
  Filter,
  Star,
  Download,
  Eye,
  FileText,
  BookOpen,
  GraduationCap,
  Briefcase,
  Users,
  ChevronRight,
  Check,
  X,
  Wand2,
  Lightbulb,
  Zap
} from 'lucide-react';
import { ModuleTemplate, TemplateCategory } from '@/types/modular';

interface TemplateLibraryProps {
  onTemplateSelect: (template: ModuleTemplate) => void;
  onSmartFill?: (template: ModuleTemplate, userInput: any) => void;
  currentModules?: any[];
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onTemplateSelect, onSmartFill, currentModules }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<ModuleTemplate | null>(null);
  const [showSmartFillDialog, setShowSmartFillDialog] = useState<ModuleTemplate | null>(null);
  const [smartFillData, setSmartFillData] = useState({
    researchField: '',
    topic: '',
    methodology: '',
    keywords: '',
    academicLevel: 'master',
    targetLength: ''
  });

  // 模拟模板数据
  const templateCategories: TemplateCategory[] = [
    {
      id: 'research',
      name: '研究论文',
      description: '适用于学术研究论文的模板',
      icon: 'BookOpen',
      color: 'blue',
      modules: [
        {
          id: 'research-basic',
          name: '基础研究论文',
          description: '标准的学术研究论文结构',
          structure: [
            { id: '1', title: '摘要', description: '论文摘要和关键词', isRequired: true, order: 1 },
            { id: '2', title: '引言', description: '研究背景和问题陈述', isRequired: true, order: 2 },
            { id: '3', title: '文献综述', description: '相关研究回顾', isRequired: true, order: 3 },
            { id: '4', title: '研究方法', description: '研究设计和方法论', isRequired: true, order: 4 },
            { id: '5', title: '结果', description: '研究发现和数据分析', isRequired: true, order: 5 },
            { id: '6', title: '讨论', description: '结果解释和意义', isRequired: true, order: 6 },
            { id: '7', title: '结论', description: '总结和未来方向', isRequired: true, order: 7 }
          ],
          prompts: [
            '明确阐述研究问题和假设',
            '提供充分的文献支持',
            '详细描述研究方法和样本',
            '客观报告研究结果',
            '深入讨论研究意义和局限性'
          ],
          guidelines: [
            '遵循APA格式标准',
            '确保逻辑结构清晰',
            '提供充分的数据支持',
            '保持学术写作风格'
          ],
          wordCountTarget: { min: 8000, max: 12000 }
        },
        {
          id: 'experimental',
          name: '实验研究',
          description: '实验设计和结果报告模板',
          structure: [
            { id: '1', title: '摘要', description: '实验摘要', isRequired: true, order: 1 },
            { id: '2', title: '引言', description: '实验背景', isRequired: true, order: 2 },
            { id: '3', title: '实验设计', description: '实验方案和流程', isRequired: true, order: 3 },
            { id: '4', title: '材料与方法', description: '实验材料和具体方法', isRequired: true, order: 4 },
            { id: '5', title: '结果', description: '实验数据和分析', isRequired: true, order: 5 },
            { id: '6', title: '讨论', description: '结果解释', isRequired: true, order: 6 }
          ],
          prompts: [
            '详细描述实验设计',
            '列出所有实验材料',
            '提供可重复的方法步骤',
            '展示原始数据和统计分析'
          ],
          guidelines: [
            '确保实验可重复性',
            '提供详细的材料清单',
            '包含适当的对照组',
            '使用标准的统计方法'
          ],
          wordCountTarget: { min: 6000, max: 10000 }
        }
      ]
    },
    {
      id: 'thesis',
      name: '学位论文',
      description: '硕士和博士学位论文模板',
      icon: 'GraduationCap',
      color: 'green',
      modules: [
        {
          id: 'master-thesis',
          name: '硕士学位论文',
          description: '硕士研究生学位论文标准结构',
          structure: [
            { id: '1', title: '中文摘要', description: '中文摘要和关键词', isRequired: true, order: 1 },
            { id: '2', title: '英文摘要', description: '英文摘要和关键词', isRequired: true, order: 2 },
            { id: '3', title: '绪论', description: '研究背景和意义', isRequired: true, order: 3 },
            { id: '4', title: '文献综述', description: '国内外研究现状', isRequired: true, order: 4 },
            { id: '5', title: '理论基础', description: '相关理论和概念', isRequired: true, order: 5 },
            { id: '6', title: '研究方法', description: '研究设计和方法', isRequired: true, order: 6 },
            { id: '7', title: '实证分析', description: '数据分析和结果', isRequired: true, order: 7 },
            { id: '8', title: '结论与建议', description: '研究结论和政策建议', isRequired: true, order: 8 }
          ],
          prompts: [
            '阐述研究的理论意义和实践价值',
            '全面梳理相关领域研究文献',
            '构建清晰的理论分析框架',
            '采用科学的研究方法',
            '提出有价值的政策建议'
          ],
          guidelines: [
            '符合学校学位论文规范',
            '保持学术性和创新性',
            '注重理论与实践结合',
            '确保数据的真实可靠'
          ],
          wordCountTarget: { min: 25000, max: 40000 }
        }
      ]
    },
    {
      id: 'conference',
      name: '会议论文',
      description: '学术会议投稿论文模板',
      icon: 'Users',
      color: 'purple',
      modules: [
        {
          id: 'conference-short',
          name: '会议短文',
          description: '4-6页会议论文格式',
          structure: [
            { id: '1', title: 'Abstract', description: '英文摘要', isRequired: true, order: 1 },
            { id: '2', title: 'Introduction', description: '问题介绍', isRequired: true, order: 2 },
            { id: '3', title: 'Related Work', description: '相关工作', isRequired: true, order: 3 },
            { id: '4', title: 'Methodology', description: '方法论', isRequired: true, order: 4 },
            { id: '5', title: 'Experiments', description: '实验结果', isRequired: true, order: 5 },
            { id: '6', title: 'Conclusion', description: '结论', isRequired: true, order: 6 }
          ],
          prompts: [
            '突出研究的新颖性',
            '简洁明了地描述方法',
            '提供有说服力的实验结果',
            '强调贡献和影响'
          ],
          guidelines: [
            '遵循会议格式要求',
            '控制篇幅长度',
            '使用清晰的图表',
            '突出核心贡献'
          ],
          wordCountTarget: { min: 3000, max: 4500 }
        }
      ]
    }
  ];

  const allTemplates = templateCategories.flatMap(category => 
    category.modules.map(template => ({ ...template, categoryId: category.id, categoryName: category.name }))
  );

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      'BookOpen': <BookOpen className="h-5 w-5" />,
      'GraduationCap': <GraduationCap className="h-5 w-5" />,
      'Users': <Users className="h-5 w-5" />,
      'Briefcase': <Briefcase className="h-5 w-5" />
    };
    return icons[iconName] || <FileText className="h-5 w-5" />;
  };

  const getCategoryColor = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      'blue': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      'green': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      'purple': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      'orange': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' }
    };
    return colors[color] || colors['blue'];
  };

  return (
    <div className="space-y-4">
      {/* 搜索和筛选 */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索模板..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-100 text-blue-700 border-blue-300'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            全部
          </button>
          {templateCategories.map((category) => {
            const colorClasses = getCategoryColor(category.color);
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors flex items-center space-x-1 ${
                  selectedCategory === category.id
                    ? `${colorClasses.bg} ${colorClasses.text} ${colorClasses.border}`
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {getIconComponent(category.icon)}
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 模板列表 */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {template.categoryName}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{template.structure.length} 模块</span>
                  {template.wordCountTarget && (
                    <span>
                      {template.wordCountTarget.min}-{template.wordCountTarget.max} 词
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                  title="预览"
                >
                  <Eye className="h-4 w-4" />
                </button>
                {onSmartFill && (
                  <button
                    onClick={() => setShowSmartFillDialog(template)}
                    className="p-2 text-purple-600 hover:text-purple-700 rounded-lg hover:bg-purple-50"
                    title="智能填充"
                  >
                    <Wand2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => onTemplateSelect(template)}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  使用模板
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>未找到匹配的模板</p>
          <p className="text-sm">请尝试调整搜索条件</p>
        </div>
      )}

      {/* 模板预览弹窗 */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">{previewTemplate.name}</h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <p className="text-gray-600 mb-4">{previewTemplate.description}</p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">论文结构</h4>
                  <div className="space-y-2">
                    {previewTemplate.structure.map((section, index) => (
                      <div key={section.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 text-sm font-medium rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{section.title}</span>
                            {section.isRequired && (
                              <span className="text-xs text-red-600">*必需</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">写作指导</h4>
                  <ul className="space-y-1">
                    {previewTemplate.prompts.map((prompt, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{prompt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">格式要求</h4>
                  <ul className="space-y-1">
                    {previewTemplate.guidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                        <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onTemplateSelect(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                使用此模板
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 智能填充对话框 */}
      {showSmartFillDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">智能填充模板</h3>
              </div>
              <button
                onClick={() => setShowSmartFillDialog(null)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Lightbulb className="h-4 w-4 inline mr-1" />
                  提供以下信息，AI将为您智能生成论文大纲和内容框架
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">研究领域</label>
                  <input
                    type="text"
                    value={smartFillData.researchField}
                    onChange={(e) => setSmartFillData(prev => ({ ...prev, researchField: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="如：计算机科学、心理学、经济学等"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">研究主题</label>
                  <input
                    type="text"
                    value={smartFillData.topic}
                    onChange={(e) => setSmartFillData(prev => ({ ...prev, topic: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="简要描述您的研究主题"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">研究方法</label>
                  <select
                    value={smartFillData.methodology}
                    onChange={(e) => setSmartFillData(prev => ({ ...prev, methodology: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">选择研究方法</option>
                    <option value="quantitative">定量研究</option>
                    <option value="qualitative">定性研究</option>
                    <option value="mixed">混合方法</option>
                    <option value="experimental">实验研究</option>
                    <option value="survey">调查研究</option>
                    <option value="case_study">案例研究</option>
                    <option value="literature_review">文献综述</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">关键词</label>
                  <input
                    type="text"
                    value={smartFillData.keywords}
                    onChange={(e) => setSmartFillData(prev => ({ ...prev, keywords: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="用逗号分隔关键词"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">学术水平</label>
                    <select
                      value={smartFillData.academicLevel}
                      onChange={(e) => setSmartFillData(prev => ({ ...prev, academicLevel: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="undergraduate">本科</option>
                      <option value="master">硕士</option>
                      <option value="doctoral">博士</option>
                      <option value="postdoc">博士后</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">目标字数</label>
                    <input
                      type="text"
                      value={smartFillData.targetLength}
                      onChange={(e) => setSmartFillData(prev => ({ ...prev, targetLength: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="如：8000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowSmartFillDialog(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (onSmartFill && showSmartFillDialog) {
                    onSmartFill(showSmartFillDialog, smartFillData);
                    setShowSmartFillDialog(null);
                  }
                }}
                disabled={!smartFillData.researchField || !smartFillData.topic}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="h-4 w-4 mr-1" />
                开始智能填充
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;