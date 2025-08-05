import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Brain, 
  Lightbulb, 
  BarChart3, 
  Settings, 
  Plus, 
  Search,
  Filter,
  Eye,
  EyeOff,
  Zap,
  Target,
  TrendingUp,
  GitBranch
} from 'lucide-react';

import { useSmartModule } from '../../contexts/SmartModuleContext';
import { SmartModule, ModuleRecommendation } from '../../types/modular';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Card } from '../UI/Card';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { Toast } from '../UI/Toast';
import ModuleLibrary from './ModuleLibrary';
import DependencyVisualizer from './DependencyVisualizer';
import ProgressTracker from './ProgressTracker';

interface SmartModuleEditorProps {
  className?: string;
  onModuleSelect?: (module: SmartModule | null) => void;
  onSave?: (modules: SmartModule[]) => void;
  enableCollaboration?: boolean;
  enableAIAssist?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

const SmartModuleEditor: React.FC<SmartModuleEditorProps> = ({
  className = '',
  onModuleSelect,
  onSave,
  enableCollaboration = true,
  enableAIAssist = true,
  theme = 'light'
}) => {
  const {
    modules,
    recommendations,
    selectedModule,
    aiProcessing,
    smartMode,
    createModule,
    updateModule,
    deleteModule,
    selectModule,
    generateContent,
    optimizeContent,
    getRecommendations,
    searchModules,
    getRelatedModules,
    updateAnalytics
  } = useSmartModule();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'draft' | 'review' | 'complete'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [sidebarTab, setSidebarTab] = useState<'library' | 'dependencies' | 'progress' | 'recommendations'>('library');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'error' | 'info'}>>([]);

  // Filtered and sorted modules
  const filteredModules = useMemo(() => {
    let filtered = modules;
    
    // Apply search filter
    if (searchQuery) {
      filtered = searchModules(searchQuery);
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(module => module.completionLevel === filterType);
    }
    
    // Sort by order
    return filtered.sort((a, b) => a.order - b.order);
  }, [modules, searchQuery, filterType, searchModules]);

  // Module recommendations for selected module
  const selectedModuleRecommendations = useMemo(() => {
    return selectedModule 
      ? recommendations.filter(r => r.moduleId === selectedModule.id)
      : [];
  }, [recommendations, selectedModule]);

  // Handle module creation
  const handleCreateModule = useCallback(async (type: string, template?: any) => {
    try {
      const newModule = await createModule({
        type: type as any,
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        content: template?.defaultContent || '',
        order: modules.length,
        isCollapsed: false,
        isCompleted: false,
        wordCount: 0,
        progress: 0,
        dependencies: [],
        metadata: {
          tags: [],
          difficulty: 'medium',
          estimatedTime: 30,
          lastModified: new Date(),
          revisionCount: 0,
          notes: []
        },
        template,
        aiScore: 0,
        relevanceScore: 0,
        coherenceScore: 0,
        completionLevel: 'draft',
        aiSuggestions: [],
        smartTags: [],
        contextualData: {
          relatedConcepts: [],
          keyTerms: [],
          readingLevel: 0,
          complexity: 'medium',
          domain: [],
          citations: []
        }
      });
      
      selectModule(newModule.id);
      onModuleSelect?.(newModule);
      
      addNotification('Module created successfully', 'success');
    } catch (error) {
      console.error('Failed to create module:', error);
      addNotification('Failed to create module', 'error');
    }
  }, [createModule, modules.length, selectModule, onModuleSelect]);

  // Handle AI content generation
  const handleGenerateContent = useCallback(async (moduleId: string) => {
    if (!enableAIAssist) return;
    
    try {
      const content = await generateContent(moduleId, {
        includeRelatedModules: true,
        optimizeForReadability: true,
        targetAudience: 'academic'
      });
      
      addNotification('Content generated successfully', 'success');
    } catch (error) {
      console.error('Failed to generate content:', error);
      addNotification('Failed to generate content', 'error');
    }
  }, [generateContent, enableAIAssist]);

  // Handle content optimization
  const handleOptimizeContent = useCallback(async (moduleId: string) => {
    if (!enableAIAssist) return;
    
    try {
      await optimizeContent(moduleId);
      addNotification('Content optimized successfully', 'success');
    } catch (error) {
      console.error('Failed to optimize content:', error);
      addNotification('Failed to optimize content', 'error');
    }
  }, [optimizeContent, enableAIAssist]);

  // Add notification helper
  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // Save handler
  const handleSave = useCallback(() => {
    onSave?.(modules);
    updateAnalytics();
    addNotification('Document saved successfully', 'success');
  }, [modules, onSave, updateAnalytics]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'n':
            e.preventDefault();
            handleCreateModule('custom');
            break;
          case 'f':
            e.preventDefault();
            document.getElementById('search-input')?.focus();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleCreateModule]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`smart-module-editor ${className}`} data-theme={theme}>
        {/* Header */}
        <div className="editor-header flex items-center justify-between p-4 border-b bg-white dark:bg-gray-900">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Smart Module Editor
            </h1>
            <div className="flex items-center space-x-2">
              {smartMode && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center">
                  <Brain className="w-3 h-3 mr-1" />
                  Smart Mode
                </span>
              )}
              {aiProcessing && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center">
                  <LoadingSpinner size="small" />
                  AI Processing
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search-input"
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="all">All Modules</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="complete">Complete</option>
            </select>
            
            {/* View Mode */}
            <div className="flex rounded-lg border">
              {['grid', 'list', 'kanban'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`px-3 py-2 text-sm capitalize ${
                    viewMode === mode 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            
            {/* Actions */}
            <Button onClick={() => handleCreateModule('custom')} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>
            
            <Button onClick={handleSave} variant="primary">
              Save
            </Button>
            
            <Button 
              onClick={() => setShowSidebar(!showSidebar)}
              variant="outline"
              size="sm"
            >
              {showSidebar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="editor-content flex flex-1 overflow-hidden">
          {/* Main Content Area */}
          <div className="main-content flex-1 overflow-auto">
            <div className="p-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Modules</p>
                      <p className="text-2xl font-bold">{modules.length}</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-500" />
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold">
                        {modules.filter(m => m.completionLevel === 'complete').length}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Word Count</p>
                      <p className="text-2xl font-bold">
                        {modules.reduce((sum, m) => sum + m.wordCount, 0).toLocaleString()}
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-500" />
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Quality</p>
                      <p className="text-2xl font-bold">
                        {Math.round(modules.reduce((sum, m) => sum + m.aiScore, 0) / modules.length || 0)}%
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-500" />
                  </div>
                </Card>
              </div>

              {/* Modules Display */}
              <div className={`modules-container ${viewMode}`}>
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredModules.map((module) => (
                      <SmartModuleCard
                        key={module.id}
                        module={module}
                        isSelected={selectedModule?.id === module.id}
                        onSelect={() => {
                          selectModule(module.id);
                          onModuleSelect?.(module);
                        }}
                        onEdit={updateModule}
                        onDelete={() => deleteModule(module.id)}
                        onGenerateContent={() => handleGenerateContent(module.id)}
                        onOptimizeContent={() => handleOptimizeContent(module.id)}
                        enableAI={enableAIAssist}
                        recommendations={selectedModuleRecommendations}
                      />
                    ))}
                  </div>
                )}
                
                {viewMode === 'list' && (
                  <div className="space-y-4">
                    {filteredModules.map((module) => (
                      <SmartModuleListItem
                        key={module.id}
                        module={module}
                        isSelected={selectedModule?.id === module.id}
                        onSelect={() => {
                          selectModule(module.id);
                          onModuleSelect?.(module);
                        }}
                        onEdit={updateModule}
                        enableAI={enableAIAssist}
                      />
                    ))}
                  </div>
                )}
                
                {viewMode === 'kanban' && (
                  <SmartModuleKanban
                    modules={filteredModules}
                    selectedModule={selectedModule}
                    onModuleSelect={(module) => {
                      selectModule(module?.id || null);
                      onModuleSelect?.(module);
                    }}
                    onModuleUpdate={updateModule}
                    enableAI={enableAIAssist}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {showSidebar && (
            <div className="sidebar w-80 border-l bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
              {/* Sidebar Tabs */}
              <div className="flex border-b">
                {[
                  { id: 'library', label: 'Library', icon: Brain },
                  { id: 'dependencies', label: 'Dependencies', icon: GitBranch },
                  { id: 'progress', label: 'Progress', icon: BarChart3 },
                  { id: 'recommendations', label: 'AI Tips', icon: Lightbulb }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSidebarTab(id as any)}
                    className={`flex-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                      sidebarTab === id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    <div className="hidden lg:block">{label}</div>
                  </button>
                ))}
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-auto">
                {sidebarTab === 'library' && (
                  <ModuleLibrary
                    onModuleAdd={handleCreateModule}
                    searchQuery={searchQuery}
                  />
                )}
                
                {sidebarTab === 'dependencies' && (
                  <DependencyVisualizer
                    modules={modules}
                    selectedModule={selectedModule}
                    onModuleSelect={(module) => {
                      selectModule(module?.id || null);
                      onModuleSelect?.(module);
                    }}
                  />
                )}
                
                {sidebarTab === 'progress' && (
                  <ProgressTracker
                    modules={modules}
                    onModuleSelect={(module) => {
                      selectModule(module?.id || null);
                      onModuleSelect?.(module);
                    }}
                  />
                )}
                
                {sidebarTab === 'recommendations' && (
                  <div className="p-4">
                    <h3 className="font-medium mb-4">AI Recommendations</h3>
                    {selectedModuleRecommendations.length > 0 ? (
                      <div className="space-y-3">
                        {selectedModuleRecommendations.map((rec) => (
                          <RecommendationCard
                            key={rec.id}
                            recommendation={rec}
                            onApply={() => {
                              // Handle recommendation application
                              addNotification('Recommendation applied', 'success');
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Select a module to see AI recommendations
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {notifications.map((notification) => (
            <Toast
              key={notification.id}
              message={notification.message}
              type={notification.type}
              onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

// Smart Module Card Component
interface SmartModuleCardProps {
  module: SmartModule;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: (id: string, updates: Partial<SmartModule>) => void;
  onDelete: () => void;
  onGenerateContent: () => void;
  onOptimizeContent: () => void;
  enableAI: boolean;
  recommendations: ModuleRecommendation[];
}

const SmartModuleCard: React.FC<SmartModuleCardProps> = ({
  module,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onGenerateContent,
  onOptimizeContent,
  enableAI,
  recommendations
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'module',
    item: { id: module.id, type: 'module' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const getCompletionColor = (level: string) => {
    switch (level) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card
      ref={drag}
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={onSelect}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              {module.title}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getCompletionColor(module.completionLevel)}`}>
                {module.completionLevel}
              </span>
              <span className="text-xs text-gray-500">
                {module.wordCount} words
              </span>
            </div>
          </div>
          
          {recommendations.length > 0 && (
            <div className="flex items-center text-blue-500">
              <Lightbulb className="w-4 h-4" />
              <span className="text-xs ml-1">{recommendations.length}</span>
            </div>
          )}
        </div>

        {/* Content Preview */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {module.content || 'No content yet...'}
        </p>

        {/* Scores */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className={`text-lg font-semibold ${getQualityColor(module.aiScore)}`}>
              {Math.round(module.aiScore)}%
            </div>
            <div className="text-xs text-gray-500">AI Score</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${getQualityColor(module.relevanceScore)}`}>
              {Math.round(module.relevanceScore)}%
            </div>
            <div className="text-xs text-gray-500">Relevance</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${getQualityColor(module.coherenceScore)}`}>
              {Math.round(module.coherenceScore)}%
            </div>
            <div className="text-xs text-gray-500">Coherence</div>
          </div>
        </div>

        {/* Tags */}
        {module.smartTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {module.smartTags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 text-xs rounded"
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.label}
              </span>
            ))}
            {module.smartTags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{module.smartTags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        {enableAI && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onGenerateContent();
              }}
              className="flex-1"
            >
              <Brain className="w-3 h-3 mr-1" />
              Generate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onOptimizeContent();
              }}
              className="flex-1"
            >
              <Zap className="w-3 h-3 mr-1" />
              Optimize
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

// Smart Module List Item Component
interface SmartModuleListItemProps {
  module: SmartModule;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: (id: string, updates: Partial<SmartModule>) => void;
  enableAI: boolean;
}

const SmartModuleListItem: React.FC<SmartModuleListItemProps> = ({
  module,
  isSelected,
  onSelect,
  onEdit,
  enableAI
}) => {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onSelect}
    >
      <div className="p-4 flex items-center space-x-4">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {module.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {module.content.slice(0, 100)}...
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-sm font-semibold">{Math.round(module.aiScore)}%</div>
            <div className="text-xs text-gray-500">Quality</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-semibold">{module.wordCount}</div>
            <div className="text-xs text-gray-500">Words</div>
          </div>
          
          <span className={`px-2 py-1 text-xs rounded-full ${
            module.completionLevel === 'complete' ? 'bg-green-100 text-green-800' :
            module.completionLevel === 'review' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {module.completionLevel}
          </span>
        </div>
      </div>
    </Card>
  );
};

// Smart Module Kanban Component
interface SmartModuleKanbanProps {
  modules: SmartModule[];
  selectedModule: SmartModule | null;
  onModuleSelect: (module: SmartModule | null) => void;
  onModuleUpdate: (id: string, updates: Partial<SmartModule>) => void;
  enableAI: boolean;
}

const SmartModuleKanban: React.FC<SmartModuleKanbanProps> = ({
  modules,
  selectedModule,
  onModuleSelect,
  onModuleUpdate,
  enableAI
}) => {
  const columns = [
    { id: 'draft', title: 'Draft', color: 'bg-gray-100' },
    { id: 'review', title: 'Review', color: 'bg-yellow-100' },
    { id: 'complete', title: 'Complete', color: 'bg-green-100' }
  ];

  const modulesByStatus = modules.reduce((acc, module) => {
    const status = module.completionLevel;
    if (!acc[status]) acc[status] = [];
    acc[status].push(module);
    return acc;
  }, {} as Record<string, SmartModule[]>);

  return (
    <div className="grid grid-cols-3 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className={`p-3 rounded-lg ${column.color}`}>
            <h3 className="font-medium text-gray-900">{column.title}</h3>
            <span className="text-sm text-gray-600">
              {modulesByStatus[column.id]?.length || 0} modules
            </span>
          </div>
          
          <div className="space-y-3">
            {(modulesByStatus[column.id] || []).map((module) => (
              <Card
                key={module.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedModule?.id === module.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => onModuleSelect(module)}
              >
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-2">{module.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {module.content.slice(0, 80)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {module.wordCount} words
                    </span>
                    <span className="text-xs font-medium text-blue-600">
                      {Math.round(module.aiScore)}%
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Recommendation Card Component
interface RecommendationCardProps {
  recommendation: ModuleRecommendation;
  onApply: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onApply
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <Card className={`border ${getPriorityColor(recommendation.priority)}`}>
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm">{recommendation.title}</h4>
          <span className="text-xs bg-white px-2 py-1 rounded">
            {Math.round(recommendation.confidence * 100)}%
          </span>
        </div>
        
        <p className="text-xs text-gray-600 mb-3">
          {recommendation.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded ${
            recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
            recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {recommendation.priority} priority
          </span>
          
          <Button size="sm" onClick={onApply}>
            Apply
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SmartModuleEditor;