import React, { useState, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Save,
  Download,
  Share2
} from 'lucide-react';
import StructureTree from './StructureTree';
import ModuleCard from './ModuleCard';
import ModuleDragDrop from './ModuleDragDrop';
import TemplateLibrary from './TemplateLibrary';
import { PaperModule, ModularEditorState, ModuleType } from '@/types/modular';
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
              wordCount: updates.content ? updates.content.split(/\s+/).length : module.wordCount
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
              <span>字数: {totalWordCount}</span>
              <span>•</span>
              <span>模块: {editorState.modules.length}</span>
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
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setEditorState(prev => ({ ...prev, viewMode: 'list' }))}
                className={`p-2 ${editorState.viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => handleAddModule('custom')}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              value={editorState.modules.find(m => m.id === editorState.selectedModuleId)?.title || ''}
                              onChange={(e) => handleModuleUpdate(editorState.selectedModuleId!, { title: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">进度</label>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${editorState.modules.find(m => m.id === editorState.selectedModuleId)?.progress || 0}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">
                                {editorState.modules.find(m => m.id === editorState.selectedModuleId)?.progress || 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">选择一个模块查看属性</p>
                    )}
                  </div>
                )}

                {editorState.sidebarTab === 'ai' && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">AI建议</h3>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-900 font-medium mb-1">结构建议</p>
                      <p className="text-sm text-blue-700">建议在引言部分添加更多研究背景</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-900 font-medium mb-1">内容检查</p>
                      <p className="text-sm text-green-700">方法论模块内容完整度良好</p>
                    </div>
                  </div>
                )}

                {editorState.sidebarTab === 'templates' && (
                  <TemplateLibrary
                    onTemplateSelect={(template) => {
                      // 应用模板逻辑
                      console.log('Selected template:', template);
                    }}
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