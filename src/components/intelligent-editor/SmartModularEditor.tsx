import React, { useState, useEffect, useCallback, useMemo } from 'react';
// 暂时移除react-beautiful-dnd依赖，使用简化版拖拽
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { 
  SmartDocument, 
  SmartModule, 
  SmartEditorState, 
  AISuggestion,
  ModuleTemplate 
} from '../../types/intelligent-modules';

interface SmartModularEditorProps {
  document: SmartDocument;
  onDocumentChange: (document: SmartDocument) => void;
  onModuleSelect: (moduleId: string) => void;
  className?: string;
}

/**
 * 智能模块化编辑器主组件
 * 实现真正智能化的模块管理和编辑体验
 */
export const SmartModularEditor: React.FC<SmartModularEditorProps> = ({
  document,
  onDocumentChange,
  onModuleSelect,
  className = ''
}) => {
  const [editorState, setEditorState] = useState<SmartEditorState>({
    currentDocument: document,
    selectedModuleId: null,
    selectedBlockId: null,
    viewMode: 'modules',
    sidebarCollapsed: false,
    showAISuggestions: true,
    isEditing: false,
    hasUnsavedChanges: false,
    lastSavedAt: null,
    aiProcessing: false,
    recommendationsLoading: false,
    qualityAnalyzing: false,
    userBehavior: {
      userId: 'current-user',
      writingStyle: {
        averageWordsPerSession: 500,
        preferredModuleTypes: ['introduction', 'methodology'],
        writingSpeed: 25,
        editingIntensity: 0.3
      },
      preferences: {
        interfaceLayout: 'three-column',
        aiAssistanceLevel: 'moderate',
        autoSaveInterval: 30000,
        preferredTemplates: []
      },
      patterns: {
        activeHours: [9, 10, 11, 14, 15, 16],
        sessionDuration: 90,
        breakPatterns: [30, 60],
        productivityCurve: [0.6, 0.8, 1.0, 0.9, 0.7]
      },
      performance: {
        averageQualityScore: 0.75,
        completionRate: 0.85,
        improvementTrend: [0.7, 0.72, 0.75, 0.77, 0.8]
      }
    },
    realTimeStats: {
      currentWordCount: 0,
      todayWordCount: 0,
      sessionStartTime: new Date(),
      keystrokeCount: 0
    }
  });

  // 智能模块推荐
  const [recommendations, setRecommendations] = useState<AISuggestion[]>([]);

  // 计算模块依赖关系
  const dependencyGraph = useMemo(() => {
    const graph = new Map<string, string[]>();
    document.modules.forEach(module => {
      graph.set(module.id, module.dependencies.map(dep => dep.targetModuleId));
    });
    return graph;
  }, [document.modules]);

  // 智能排序模块
  const sortedModules = useMemo(() => {
    const modules = [...document.modules];
    
    // 按照依赖关系和重要性进行智能排序
    modules.sort((a, b) => {
      // 首先按层级排序
      if (a.level !== b.level) return a.level - b.level;
      
      // 然后按位置排序
      if (a.position.order !== b.position.order) return a.position.order - b.position.order;
      
      // 最后按重要性排序
      return b.metadata.importance - a.metadata.importance;
    });
    
    return modules;
  }, [document.modules]);

  // 简化的拖拽处理（暂时禁用）
  const handleDragEnd = useCallback((result: any) => {
    // 暂时禁用拖拽功能
    console.log('Drag functionality temporarily disabled');
  }, []);

  // 验证模块移动的有效性
  const validateModuleMove = (module: SmartModule, newIndex: number): boolean => {
    // 实现智能验证逻辑
    const dependencies = module.dependencies;
    
    // 检查结构依赖
    for (const dep of dependencies) {
      if (dep.type === 'structural') {
        const depModule = document.modules.find(m => m.id === dep.targetModuleId);
        if (depModule && depModule.position.order >= newIndex) {
          return false;
        }
      }
    }
    
    return true;
  };

  // 智能重排序
  const reorderModulesIntelligently = (modules: SmartModule[], fromIndex: number, toIndex: number): SmartModule[] => {
    const result = Array.from(modules);
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    
    // 更新位置信息
    return result.map((module, index) => ({
      ...module,
      position: {
        ...module.position,
        order: index
      },
      metadata: {
        ...module.metadata,
        updatedAt: new Date()
      }
    }));
  };

  // 显示智能反馈
  const showIntelligentFeedback = (type: string, data: any) => {
    // 实现智能反馈系统
    console.log('Smart feedback:', type, data);
  };

  // 生成智能建议
  const generateSmartSuggestions = useCallback(async () => {
    setEditorState(prev => ({ ...prev, recommendationsLoading: true }));
    
    try {
      // 模拟AI分析和建议生成
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const suggestions: AISuggestion[] = [
        {
          id: 'suggest-1',
          type: 'structure',
          priority: 'high',
          title: '建议添加方法论模块',
          description: '基于您的研究内容，建议在引言后添加详细的方法论描述',
          actionText: '添加方法论模块',
          confidence: 0.85,
          reasoning: '当前文档缺少对研究方法的详细说明，这对学术论文至关重要',
          context: document.globalContext,
          autoApplicable: true
        },
        {
          id: 'suggest-2',
          type: 'content',
          priority: 'medium',
          title: '优化引言内容',
          description: '引言部分可以更好地阐述研究背景和意义',
          actionText: '查看建议',
          confidence: 0.75,
          reasoning: '引言的学术规范性可以进一步提升',
          context: document.globalContext,
          autoApplicable: false
        }
      ];
      
      setRecommendations(suggestions);
    } finally {
      setEditorState(prev => ({ ...prev, recommendationsLoading: false }));
    }
  }, [document]);

  // 应用AI建议
  const applySuggestion = useCallback((suggestion: AISuggestion) => {
    if (suggestion.autoApplicable) {
      // 自动应用建议
      if (suggestion.type === 'structure' && suggestion.title.includes('方法论')) {
        // 创建方法论模块
        const newModule: SmartModule = createIntelligentModule({
          type: 'methodology',
          title: '研究方法',
          position: 2 // 在引言后
        });
        
        const updatedModules = [...document.modules, newModule];
        onDocumentChange({
          ...document,
          modules: updatedModules
        });
      }
    }
    
    // 标记建议为已应用
    const updatedSuggestions = recommendations.map(r => 
      r.id === suggestion.id 
        ? { ...r, appliedAt: new Date() }
        : r
    );
    setRecommendations(updatedSuggestions);
  }, [document, recommendations, onDocumentChange]);

  // 创建智能模块
  const createIntelligentModule = (config: {
    type: string;
    title: string;
    position: number;
  }): SmartModule => {
    const id = `module_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id,
      type: config.type,
      title: config.title,
      description: '',
      parentId: undefined,
      children: [],
      level: 1,
      position: {
        order: config.position,
        path: [config.type]
      },
      blocks: [],
      status: 'empty',
      dependencies: [],
      dependents: [],
      aiContext: document.globalContext,
      suggestions: [],
      quality: {
        completeness: 0,
        clarity: 0,
        coherence: 0,
        academicRigor: 0,
        readability: 0,
        overallScore: 0,
        lastEvaluated: new Date(),
        suggestions: []
      },
      progress: {
        wordCount: 0,
        targetWordCount: 500,
        timeSpent: 0,
        estimatedTimeRemaining: 60,
        editingSessions: 0,
        averageWordsPerSession: 0,
        productivityScore: 0,
        lastUpdated: new Date()
      },
      collaboration: {
        authorId: 'current-user',
        contributors: [],
        comments: [],
        lastModifiedBy: 'current-user'
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        tags: [],
        category: config.type,
        importance: 5
      }
    };
  };

  // 初始化时生成建议
  useEffect(() => {
    generateSmartSuggestions();
  }, [generateSmartSuggestions]);

  return (
    <div className={`smart-modular-editor ${className}`}>
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">{document.title}</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{document.globalMetrics.totalWordCount} words</span>
            <span>•</span>
            <span>{Math.round(document.globalMetrics.completionRate * 100)}% complete</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {editorState.aiProcessing && <LoadingSpinner size="sm" />}
          <Button
            variant="outline"
            size="sm"
            onClick={generateSmartSuggestions}
            disabled={editorState.recommendationsLoading}
          >
            {editorState.recommendationsLoading ? '分析中...' : 'AI建议'}
          </Button>
          <Button size="sm">保存</Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* 左侧模块列表 */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">智能模块</h2>
              <Button size="sm" variant="outline">
                + 添加模块
              </Button>
            </div>
            
            {/* AI建议面板 */}
            {recommendations.length > 0 && (
              <Card className="mb-4 p-3 bg-blue-50 border-blue-200">
                <h3 className="text-sm font-medium text-blue-900 mb-2">🤖 AI建议</h3>
                <div className="space-y-2">
                  {recommendations.slice(0, 2).map(suggestion => (
                    <div key={suggestion.id} className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-blue-800 font-medium">{suggestion.title}</p>
                        <p className="text-xs text-blue-600 mt-1">{suggestion.description}</p>
                      </div>
                      <Button
                        size="xs"
                        className="ml-2 flex-shrink-0"
                        onClick={() => applySuggestion(suggestion)}
                      >
                        应用
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 模块列表 */}
            <div className="space-y-2">
              {sortedModules.map((module, index) => (
                <div
                  key={module.id}
                  className={`p-3 bg-white rounded-lg border shadow-sm transition-shadow hover:shadow-md cursor-pointer ${
                    editorState.selectedModuleId === module.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => {
                    setEditorState(prev => ({ ...prev, selectedModuleId: module.id }));
                    onModuleSelect(module.id);
                  }}
                >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  module.status === 'completed' ? 'bg-green-500' :
                                  module.status === 'review' ? 'bg-yellow-500' :
                                  module.status === 'draft' ? 'bg-blue-500' : 'bg-gray-300'
                                }`} />
                                <h3 className="text-sm font-medium text-gray-900">{module.title}</h3>
                              </div>
                              <div className="flex items-center space-x-1">
                                {module.suggestions.length > 0 && (
                                  <div className="w-2 h-2 bg-orange-400 rounded-full" title="有AI建议" />
                                )}
                                <span className="text-xs text-gray-500">{module.progress.wordCount}w</span>
                              </div>
                            </div>
                            
                            {/* 进度条 */}
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div 
                                  className="bg-blue-600 h-1 rounded-full transition-all"
                                  style={{ width: `${module.quality.completeness * 100}%` }}
                                />
                              </div>
                            </div>
                            
                            {/* 依赖关系指示器 */}
                            {module.dependencies.length > 0 && (
                              <div className="mt-2 flex items-center space-x-1">
                                <span className="text-xs text-gray-400">依赖:</span>
                                {module.dependencies.slice(0, 2).map(dep => (
                                  <span key={dep.id} className="text-xs bg-gray-100 px-1 rounded">
                                    {document.modules.find(m => m.id === dep.targetModuleId)?.title?.slice(0, 8) || 'Unknown'}
                                  </span>
                                ))}
                                {module.dependencies.length > 2 && (
                                  <span className="text-xs text-gray-400">+{module.dependencies.length - 2}</span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
          </div>
        </div>

        {/* 中间编辑区域 */}
        <div className="flex-1 bg-white">
          <div className="p-6">
            {editorState.selectedModuleId ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {sortedModules.find(m => m.id === editorState.selectedModuleId)?.title}
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600">
                    智能模块编辑器内容区域...
                  </p>
                  {/* 这里将集成富文本编辑器 */}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">选择一个模块开始编辑</h3>
                <p className="text-gray-500">点击左侧的模块或使用AI建议来开始写作</p>
              </div>
            )}
          </div>
        </div>

        {/* 右侧属性面板 */}
        <div className="w-1/4 border-l border-gray-200 bg-gray-50">
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">智能助手</h2>
            
            {/* 文档统计 */}
            <Card className="mb-4 p-3">
              <h3 className="text-sm font-medium text-gray-900 mb-2">文档统计</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">总字数</span>
                  <span className="font-medium">{document.globalMetrics.totalWordCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">完成度</span>
                  <span className="font-medium">{Math.round(document.globalMetrics.completionRate * 100)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">质量评分</span>
                  <span className="font-medium">{Math.round(document.globalMetrics.overallQuality.overallScore * 100)}</span>
                </div>
              </div>
            </Card>

            {/* 实时建议 */}
            <Card className="mb-4 p-3">
              <h3 className="text-sm font-medium text-gray-900 mb-2">实时建议</h3>
              <div className="space-y-2">
                <div className="text-xs bg-blue-50 p-2 rounded border-l-2 border-blue-300">
                  <p className="text-blue-800 font-medium">结构建议</p>
                  <p className="text-blue-600 mt-1">考虑在当前位置添加过渡段落</p>
                </div>
                <div className="text-xs bg-green-50 p-2 rounded border-l-2 border-green-300">
                  <p className="text-green-800 font-medium">语言优化</p>
                  <p className="text-green-600 mt-1">当前段落表达清晰，保持风格</p>
                </div>
              </div>
            </Card>

            {/* 模板推荐 */}
            <Card className="p-3">
              <h3 className="text-sm font-medium text-gray-900 mb-2">推荐模板</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-xs bg-white rounded border hover:bg-gray-50">
                  <div className="font-medium text-gray-900">数据分析模块</div>
                  <div className="text-gray-600 mt-1">适合展示研究数据和分析结果</div>
                </button>
                <button className="w-full text-left p-2 text-xs bg-white rounded border hover:bg-gray-50">
                  <div className="font-medium text-gray-900">讨论与启示</div>
                  <div className="text-gray-600 mt-1">总结研究发现和实践意义</div>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};