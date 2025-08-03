import React, { useState, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Save,
  Download,
  Share2,
  Network,
  Lightbulb,
  BarChart3,
  X
} from 'lucide-react';
import StructureTree from './StructureTree';
import ModuleCard from './ModuleCard';
import ModuleDragDrop from './ModuleDragDrop';
import DependencyVisualization from './DependencyVisualization';
import TemplateLibrary from './TemplateLibrary';
import { PaperModule, ModularEditorState, ModuleType, ModuleTemplate } from '@/types/modular';
import { usePaperStore } from '@/store';

interface ModularEditorProps {
  paperId: string;
}

const ModularEditor: React.FC<ModularEditorProps> = ({ paperId }) => {
  const { currentPaper } = usePaperStore();
  
  const [editorState, setEditorState] = useState<ModularEditorState>({
    modules: [],
    selectedModuleId: null,
    draggedModule: null,
    showTemplateLibrary: false,
    showDependencyView: false,
    bulkSelection: [],
    viewMode: 'card',
    sidebarTab: 'structure'
  });

  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDependencyVisualization, setShowDependencyVisualization] = useState(false);

  // 初始化模块数据
  React.useEffect(() => {
    const defaultModules: PaperModule[] = [
      {
        id: 'abstract',
        type: 'abstract',
        title: '摘要',
        content: '',
        order: 1,
        isCollapsed: false,
        isCompleted: false,
        wordCount: 0,
        progress: 0,
        dependencies: [],
        metadata: {
          tags: ['required'],
          difficulty: 'medium',
          estimatedTime: 30,
          lastModified: new Date(),
          revisionCount: 0,
          notes: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'introduction',
        type: 'introduction',
        title: '引言',
        content: '',
        order: 2,
        isCollapsed: false,
        isCompleted: false,
        wordCount: 0,
        progress: 0,
        dependencies: ['abstract'],
        metadata: {
          tags: ['required'],
          difficulty: 'medium',
          estimatedTime: 60,
          lastModified: new Date(),
          revisionCount: 0,
          notes: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'methodology',
        type: 'methodology',
        title: '研究方法',
        content: '',
        order: 3,
        isCollapsed: false,
        isCompleted: false,
        wordCount: 0,
        progress: 0,
        dependencies: ['introduction'],
        metadata: {
          tags: ['required'],
          difficulty: 'hard',
          estimatedTime: 120,
          lastModified: new Date(),
          revisionCount: 0,
          notes: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'results',
        type: 'results',
        title: '研究结果',
        content: '',
        order: 4,
        isCollapsed: false,
        isCompleted: false,
        wordCount: 0,
        progress: 0,
        dependencies: ['methodology'],
        metadata: {
          tags: ['required'],
          difficulty: 'medium',
          estimatedTime: 90,
          lastModified: new Date(),
          revisionCount: 0,
          notes: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'discussion',
        type: 'discussion',
        title: '讨论',
        content: '',
        order: 5,
        isCollapsed: false,
        isCompleted: false,
        wordCount: 0,
        progress: 0,
        dependencies: ['results'],
        metadata: {
          tags: ['required'],
          difficulty: 'hard',
          estimatedTime: 100,
          lastModified: new Date(),
          revisionCount: 0,
          notes: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'conclusion',
        type: 'conclusion',
        title: '结论',
        content: '',
        order: 6,
        isCollapsed: false,
        isCompleted: false,
        wordCount: 0,
        progress: 0,
        dependencies: ['discussion'],
        metadata: {
          tags: ['required'],
          difficulty: 'medium',
          estimatedTime: 45,
          lastModified: new Date(),
          revisionCount: 0,
          notes: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    setEditorState(prev => ({ ...prev, modules: defaultModules }));
  }, []);

  const handleModuleUpdate = useCallback((moduleId: string, updates: Partial<PaperModule>) => {
    setEditorState(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? { 
              ...module, 
              ...updates, 
              updatedAt: new Date(),
              // 保持wordCount数据的一致性
              wordCount: updates.wordCount !== undefined ? updates.wordCount : module.wordCount
            }
          : module
      )
    }));
  }, []);

  const handleModuleReorder = useCallback((dragIndex: number, hoverIndex: number) => {
    setEditorState(prev => {
      const draggedModule = prev.modules[dragIndex];
      const newModules = [...prev.modules];
      newModules.splice(dragIndex, 1);
      newModules.splice(hoverIndex, 0, draggedModule);
      
      // 更新order字段
      return {
        ...prev,
        modules: newModules.map((module, index) => ({
          ...module,
          order: index + 1
        }))
      };
    });
  }, []);

  const handleModuleSelect = useCallback((moduleId: string) => {
    setEditorState(prev => ({
      ...prev,
      selectedModuleId: prev.selectedModuleId === moduleId ? null : moduleId
    }));
  }, []);

  const handleAddModule = useCallback((type: ModuleType) => {
    const newModule: PaperModule = {
      id: `module-${Date.now()}`,
      type: type,
      title: getModuleTypeLabel(type),
      content: '',
      order: editorState.modules.length + 1,
      isCollapsed: false,
      isCompleted: false,
      wordCount: 0,
      progress: 0,
      dependencies: [],
      metadata: {
        tags: [],
        difficulty: 'medium',
        estimatedTime: 60,
        lastModified: new Date(),
        revisionCount: 0,
        notes: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setEditorState(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
  }, [editorState.modules.length]);

  const handleBulkSelection = useCallback((moduleIds: string[]) => {
    setEditorState(prev => ({
      ...prev,
      bulkSelection: moduleIds
    }));
  }, []);

  // 应用模板
  const applyTemplate = useCallback((template: any) => {
    const newModules = template.structure.map((section: any, index: number) => ({
      id: `template-${section.id}-${Date.now()}`,
      type: getModuleTypeFromTitle(section.title),
      title: section.title,
      content: `# ${section.title}\n\n${section.description}\n\n<!-- 在这里开始编写内容 -->`,
      order: index + 1,
      isCollapsed: false,
      isCompleted: false,
      wordCount: 0,
      progress: 0,
      dependencies: index > 0 ? [`template-${template.structure[index - 1].id}-${Date.now()}`] : [],
      template: template,
      metadata: {
        tags: section.isRequired ? ['required'] : [],
        difficulty: 'medium',
        estimatedTime: template.wordCountTarget ? Math.round(template.wordCountTarget.min / template.structure.length / 10) : 60,
        lastModified: new Date(),
        revisionCount: 0,
        notes: template.prompts || []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    setEditorState(prev => ({
      ...prev,
      modules: newModules
    }));
  }, []);

  // 智能填充
  const applySmartFill = useCallback((template: any, userInput: any) => {
    const generateSmartContent = (section: any) => {
      const { researchField, topic, methodology, keywords, academicLevel } = userInput;
      
      let content = `# ${section.title}\n\n`;
      
      switch (section.title.toLowerCase()) {
        case '摘要':
        case 'abstract':
          content += `本研究聚焦于${researchField}领域的${topic}。采用${methodology}方法，探讨了...\n\n关键词：${keywords}`;
          break;
        case '引言':
        case 'introduction':
          content += `在${researchField}领域，${topic}一直是研究的热点问题。随着...的发展，本研究旨在...\n\n## 研究背景\n\n## 研究问题\n\n## 研究目标`;
          break;
        case '文献综述':
        case 'literature review':
          content += `关于${topic}的研究，学者们从不同角度进行了深入探讨。\n\n## 理论基础\n\n## 研究现状\n\n## 研究缺口`;
          break;
        case '研究方法':
        case 'methodology':
          content += `本研究采用${methodology}方法来探讨${topic}。\n\n## 研究设计\n\n## 数据收集\n\n## 分析方法`;
          break;
        default:
          content += `${section.description}\n\n<!-- 请根据您的研究内容填写此部分 -->`;
      }
      
      return content;
    };

    const newModules = template.structure.map((section: any, index: number) => ({
      id: `smart-${section.id}-${Date.now()}`,
      type: getModuleTypeFromTitle(section.title),
      title: section.title,
      content: generateSmartContent(section),
      order: index + 1,
      isCollapsed: false,
      isCompleted: false,
      wordCount: generateSmartContent(section).split(/\s+/).length,
      progress: 15, // 智能填充给初始进度
      dependencies: index > 0 ? [`smart-${template.structure[index - 1].id}`] : [],
      template: {
        ...template,
        wordCountTarget: userInput.targetLength ? 
          { min: parseInt(userInput.targetLength) / template.structure.length, max: parseInt(userInput.targetLength) / template.structure.length * 1.5 } 
          : template.wordCountTarget
      },
      metadata: {
        tags: section.isRequired ? ['required', 'smart-filled'] : ['smart-filled'],
        difficulty: userInput.academicLevel === 'doctoral' ? 'hard' : userInput.academicLevel === 'master' ? 'medium' : 'easy',
        estimatedTime: template.wordCountTarget ? Math.round(template.wordCountTarget.min / template.structure.length / 10) : 60,
        lastModified: new Date(),
        revisionCount: 0,
        notes: [
          `基于您的研究领域：${userInput.researchField}`,
          `研究主题：${userInput.topic}`,
          ...template.prompts || []
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    setEditorState(prev => ({
      ...prev,
      modules: newModules
    }));
  }, []);

  // 从标题映射模块类型
  const getModuleTypeFromTitle = (title: string) => {
    const mappings: Record<string, any> = {
      '摘要': 'abstract',
      'abstract': 'abstract',
      '引言': 'introduction', 
      'introduction': 'introduction',
      '文献综述': 'literature-review',
      'literature review': 'literature-review',
      '研究方法': 'methodology',
      'methodology': 'methodology',
      '结果': 'results',
      'results': 'results',
      '讨论': 'discussion',
      'discussion': 'discussion',
      '结论': 'conclusion',
      'conclusion': 'conclusion',
      '参考文献': 'references',
      'references': 'references'
    };
    
    return mappings[title.toLowerCase()] || 'custom';
  };

  const getModuleTypeLabel = (type: ModuleType): string => {
    const labels: Record<ModuleType, string> = {
      'abstract': '摘要',
      'introduction': '引言',
      'literature-review': '文献综述',
      'methodology': '研究方法',
      'results': '研究结果',
      'discussion': '讨论',
      'conclusion': '结论',
      'references': '参考文献',
      'appendix': '附录',
      'custom': '自定义模块'
    };
    return labels[type] || type;
  };

  const filteredModules = editorState.modules.filter(module =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProgress = editorState.modules.length > 0 
    ? Math.round(editorState.modules.reduce((sum, module) => sum + module.progress, 0) / editorState.modules.length)
    : 0;

  const totalWordCount = editorState.modules.reduce((sum, module) => sum + module.wordCount, 0);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部工具栏 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <h1 className="text-lg font-semibold text-gray-900">
                {currentPaper?.title || '模块化编辑器'}
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>进度: {totalProgress}%</span>
              <span>•</span>
              <span>字数: {totalWordCount.toLocaleString()}</span>
              <span>•</span>
              <span>模块: {editorState.modules.length}</span>
              <span>•</span>
              <span>已完成: {editorState.modules.filter(m => m.isCompleted).length}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Save className="h-4 w-4 mr-1" />
              保存
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-1" />
              导出
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Share2 className="h-4 w-4 mr-1" />
              分享
            </button>
          </div>
        </div>

        {/* 二级工具栏 */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索模块..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <Filter className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg border border-gray-300">
              <button
                onClick={() => setEditorState(prev => ({ ...prev, viewMode: 'card' }))}
                className={`p-2 ${editorState.viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                title="卡片视图"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setEditorState(prev => ({ ...prev, viewMode: 'list' }))}
                className={`p-2 ${editorState.viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                title="列表视图"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            
            <button
              onClick={() => setShowDependencyVisualization(!showDependencyVisualization)}
              className={`p-2 rounded-lg transition-colors ${
                showDependencyVisualization 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="依赖关系视图"
            >
              <Network className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => handleAddModule('custom')}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              添加模块
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧结构导航 */}
        <div className={`${isLeftSidebarCollapsed ? 'w-12' : 'w-80'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isLeftSidebarCollapsed && <h2 className="font-semibold text-gray-900">结构导航</h2>}
            <button
              onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
              className="p-1 text-gray-600 hover:text-gray-900 rounded"
            >
              {isLeftSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
          
          {!isLeftSidebarCollapsed && (
            <StructureTree
              modules={editorState.modules}
              selectedModuleId={editorState.selectedModuleId}
              onModuleSelect={handleModuleSelect}
              onModuleReorder={handleModuleReorder}
              onBulkSelection={handleBulkSelection}
              bulkSelection={editorState.bulkSelection}
            />
          )}
        </div>

        {/* 中间编辑区域 */}
        <main className="flex-1 overflow-hidden">
          {showDependencyVisualization ? (
            <DependencyVisualization
              modules={editorState.modules}
              selectedModuleId={editorState.selectedModuleId}
              onModuleSelect={handleModuleSelect}
              onModuleUpdate={handleModuleUpdate}
            />
          ) : (
            <ModuleDragDrop
              modules={filteredModules}
              viewMode={editorState.viewMode}
              selectedModuleId={editorState.selectedModuleId}
              onModuleUpdate={handleModuleUpdate}
              onModuleSelect={handleModuleSelect}
              onModuleReorder={handleModuleReorder}
              bulkSelection={editorState.bulkSelection}
              onBulkSelection={handleBulkSelection}
            />
          )}
        </main>

        {/* 右侧属性和AI面板 */}
        <div className={`${isRightSidebarCollapsed ? 'w-12' : 'w-96'} transition-all duration-300 bg-white border-l border-gray-200 flex flex-col`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button
              onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
              className="p-1 text-gray-600 hover:text-gray-900 rounded"
            >
              {isRightSidebarCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {!isRightSidebarCollapsed && <h2 className="font-semibold text-gray-900">属性面板</h2>}
          </div>

          {!isRightSidebarCollapsed && (
            <>
              {/* 标签导航 */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[
                    { key: 'properties', label: '属性' },
                    { key: 'ai', label: 'AI建议' },
                    { key: 'templates', label: '模板' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setEditorState(prev => ({ ...prev, sidebarTab: tab.key as any }))}
                      className={`flex-1 px-4 py-3 text-sm font-medium ${
                        editorState.sidebarTab === tab.key
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* 面板内容 */}
              <div className="flex-1 overflow-y-auto p-4">
                {editorState.sidebarTab === 'properties' && (
                  <div className="space-y-4">
                    {editorState.selectedModuleId ? (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">模块属性</h3>
                        {/* 模块属性编辑界面 */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">模块标题</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={editorState.modules.find(m => m.id === editorState.selectedModuleId)?.title || ''}
                              onChange={(e) => handleModuleUpdate(editorState.selectedModuleId!, { title: e.target.value })}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">进度</label>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${editorState.modules.find(m => m.id === editorState.selectedModuleId)?.progress || 0}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 min-w-12">
                                {editorState.modules.find(m => m.id === editorState.selectedModuleId)?.progress || 0}%
                              </span>
                            </div>
                          </div>
                          
                          {(() => {
                            const selectedModule = editorState.modules.find(m => m.id === editorState.selectedModuleId);
                            if (!selectedModule) return null;
                            
                            const getStats = (content: string) => {
                              const trimmed = content.trim();
                              const words = trimmed.split(/\s+/).filter(w => w.length > 0);
                              const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
                              const paragraphs = trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0);
                              return { words: words.length, sentences: sentences.length, paragraphs: paragraphs.length };
                            };
                            
                            const stats = getStats(selectedModule.content);
                            
                            return (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">内容统计</label>
                                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">字数:</span>
                                      <span className="font-medium">{stats.words}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">句子:</span>
                                      <span className="font-medium">{stats.sentences}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">段落:</span>
                                      <span className="font-medium">{stats.paragraphs}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">时间:</span>
                                      <span className="font-medium">{selectedModule.metadata.estimatedTime}min</span>
                                    </div>
                                  </div>
                                  
                                  {selectedModule.template?.wordCountTarget && (
                                    <div className="pt-2 border-t border-gray-200">
                                      <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                                        <span>目标进度</span>
                                        <span>{stats.words}/{selectedModule.template.wordCountTarget.min}</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div
                                          className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                                          style={{ width: `${Math.min(100, (stats.words / selectedModule.template.wordCountTarget.min) * 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">选择一个模块查看属性</p>
                    )}
                  </div>
                )}

                {editorState.sidebarTab === 'ai' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">AI建议</h3>
                      <button
                        onClick={() => setShowDependencyVisualization(true)}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <Lightbulb className="h-3 w-3" />
                        <span>查看依赖建议</span>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-900 font-medium mb-1">结构建议</p>
                        <p className="text-sm text-blue-700">建议在引言部分添加更多研究背景</p>
                        <button className="mt-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                          应用建议
                        </button>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-900 font-medium mb-1">内容检查</p>
                        <p className="text-sm text-green-700">方法论模块内容完整度良好</p>
                      </div>
                      
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-900 font-medium mb-1">依赖关系</p>
                        <p className="text-sm text-yellow-700">检测到缺少引言模块依赖</p>
                        <button className="mt-2 px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700">
                          修复依赖
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {editorState.sidebarTab === 'templates' && (
                  <TemplateLibrary
                    onTemplateSelect={(template) => {
                      // 应用模板逻辑
                      console.log('Selected template:', template);
                      applyTemplate(template);
                    }}
                    onSmartFill={(template: ModuleTemplate, userInput: any) => {
                      // 智能填充逻辑
                      console.log('Smart fill:', template, userInput);
                      applySmartFill(template, userInput);
                    }}
                    currentModules={editorState.modules}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModularEditor;