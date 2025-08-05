import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SmartModularEditor } from '../../components/intelligent-editor/SmartModularEditor';
import { DependencyVisualizer } from '../../components/intelligent-editor/DependencyVisualizer';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { 
  SmartDocument, 
  SmartModule, 
  ModuleRelationship,
  SmartEditorState 
} from '../../types/intelligent-modules';

/**
 * 智能模块化编辑器页面
 * 集成所有智能化功能的主编辑页面
 */
export const IntelligentModularEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [document, setDocument] = useState<SmartDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'dependencies' | 'hybrid'>('hybrid');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 初始化文档数据
  useEffect(() => {
    const initializeDocument = async () => {
      setLoading(true);
      
      try {
        // 模拟加载文档数据
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 创建示例智能文档
        const sampleDocument: SmartDocument = {
          id: id || 'sample-doc-1',
          title: '人工智能在教育领域的应用研究',
          description: '探讨AI技术在现代教育中的创新应用和发展前景',
          type: 'academic-paper',
          
          modules: [
            {
              id: 'module-1',
              type: 'abstract',
              title: '摘要',
              description: '研究摘要',
              children: [],
              level: 1,
              position: { order: 0, path: ['abstract'] },
              blocks: [
                {
                  id: 'block-1',
                  type: 'paragraph',
                  content: '本研究探讨了人工智能技术在教育领域的创新应用...',
                  position: 0,
                  aiGenerated: false,
                  lastModified: new Date(),
                  wordCount: 156
                }
              ],
              status: 'completed',
              dependencies: [],
              dependents: ['module-2'],
              aiContext: {
                documentType: 'academic-paper',
                subject: 'artificial-intelligence',
                writingStyle: 'academic',
                targetAudience: 'researchers',
                complexity: 7,
                previousModules: [],
                relatedConcepts: ['AI', 'education', 'technology']
              },
              suggestions: [],
              quality: {
                completeness: 0.95,
                clarity: 0.88,
                coherence: 0.92,
                academicRigor: 0.85,
                readability: 0.78,
                overallScore: 0.88,
                lastEvaluated: new Date(),
                suggestions: []
              },
              progress: {
                wordCount: 156,
                targetWordCount: 200,
                timeSpent: 45,
                estimatedTimeRemaining: 10,
                editingSessions: 3,
                averageWordsPerSession: 52,
                productivityScore: 0.85,
                lastUpdated: new Date()
              },
              collaboration: {
                authorId: 'user-1',
                contributors: [],
                comments: [],
                lastModifiedBy: 'user-1'
              },
              metadata: {
                createdAt: new Date(Date.now() - 86400000),
                updatedAt: new Date(),
                version: 3,
                tags: ['AI', 'education'],
                category: 'abstract',
                importance: 9
              }
            },
            {
              id: 'module-2',
              type: 'introduction',
              title: '引言',
              description: '研究背景和意义',
              children: [],
              level: 1,
              position: { order: 1, path: ['introduction'] },
              blocks: [],
              status: 'draft',
              dependencies: [
                {
                  id: 'dep-1',
                  targetModuleId: 'module-1',
                  type: 'structural',
                  strength: 'strong',
                  description: '引言需要呼应摘要中提出的研究问题',
                  autoDetected: true,
                  validation: {
                    isValid: true,
                    reason: '结构依赖关系正常'
                  }
                }
              ],
              dependents: ['module-3'],
              aiContext: {
                documentType: 'academic-paper',
                subject: 'artificial-intelligence',
                writingStyle: 'academic',
                targetAudience: 'researchers',
                complexity: 6,
                previousModules: ['module-1'],
                relatedConcepts: ['background', 'research-problem', 'significance']
              },
              suggestions: [
                {
                  id: 'sugg-1',
                  type: 'content',
                  priority: 'high',
                  title: '添加研究背景',
                  description: '建议添加AI在教育领域的发展历程和现状',
                  actionText: '生成内容',
                  confidence: 0.85,
                  reasoning: '引言部分缺少必要的背景介绍',
                  context: {
                    documentType: 'academic-paper',
                    subject: 'artificial-intelligence',
                    writingStyle: 'academic',
                    targetAudience: 'researchers',
                    complexity: 6,
                    previousModules: ['module-1'],
                    relatedConcepts: ['background']
                  },
                  autoApplicable: true
                }
              ],
              quality: {
                completeness: 0.25,
                clarity: 0.6,
                coherence: 0.5,
                academicRigor: 0.7,
                readability: 0.65,
                overallScore: 0.54,
                lastEvaluated: new Date(),
                suggestions: []
              },
              progress: {
                wordCount: 89,
                targetWordCount: 800,
                timeSpent: 30,
                estimatedTimeRemaining: 120,
                editingSessions: 2,
                averageWordsPerSession: 45,
                productivityScore: 0.65,
                lastUpdated: new Date()
              },
              collaboration: {
                authorId: 'user-1',
                contributors: [],
                comments: [],
                lastModifiedBy: 'user-1'
              },
              metadata: {
                createdAt: new Date(Date.now() - 72000000),
                updatedAt: new Date(Date.now() - 3600000),
                version: 2,
                tags: ['introduction', 'background'],
                category: 'introduction',
                importance: 8
              }
            },
            {
              id: 'module-3',
              type: 'methodology',
              title: '研究方法',
              description: '研究设计和方法论',
              children: [],
              level: 1,
              position: { order: 2, path: ['methodology'] },
              blocks: [],
              status: 'empty',
              dependencies: [
                {
                  id: 'dep-2',
                  targetModuleId: 'module-2',
                  type: 'content',
                  strength: 'medium',
                  description: '研究方法需要与引言中提出的研究问题保持一致',
                  autoDetected: true,
                  validation: {
                    isValid: true,
                    reason: '内容依赖关系正常'
                  }
                }
              ],
              dependents: [],
              aiContext: {
                documentType: 'academic-paper',
                subject: 'artificial-intelligence',
                writingStyle: 'academic',
                targetAudience: 'researchers',
                complexity: 8,
                previousModules: ['module-1', 'module-2'],
                relatedConcepts: ['methodology', 'research-design', 'data-collection']
              },
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
                targetWordCount: 1200,
                timeSpent: 0,
                estimatedTimeRemaining: 180,
                editingSessions: 0,
                averageWordsPerSession: 0,
                productivityScore: 0,
                lastUpdated: new Date()
              },
              collaboration: {
                authorId: 'user-1',
                contributors: [],
                comments: [],
                lastModifiedBy: 'user-1'
              },
              metadata: {
                createdAt: new Date(Date.now() - 36000000),
                updatedAt: new Date(Date.now() - 36000000),
                version: 1,
                tags: ['methodology'],
                category: 'methodology',
                importance: 7
              }
            }
          ],
          moduleOrder: ['module-1', 'module-2', 'module-3'],
          relationships: [
            {
              sourceId: 'module-2',
              targetId: 'module-1',
              type: 'structural',
              strength: 'strong',
              description: '引言依赖摘要的研究问题',
              position: { x: 0, y: 0 }
            },
            {
              sourceId: 'module-3',
              targetId: 'module-2',
              type: 'content',
              strength: 'medium',
              description: '方法论与研究问题保持一致',
              position: { x: 0, y: 0 }
            }
          ],
          globalContext: {
            documentType: 'academic-paper',
            subject: 'artificial-intelligence',
            writingStyle: 'academic',
            targetAudience: 'researchers',
            complexity: 7,
            previousModules: [],
            relatedConcepts: ['AI', 'education', 'technology', 'innovation']
          },
          globalMetrics: {
            totalWordCount: 245,
            targetWordCount: 2200,
            overallQuality: {
              completeness: 0.4,
              clarity: 0.66,
              coherence: 0.64,
              academicRigor: 0.7,
              readability: 0.68,
              overallScore: 0.66,
              lastEvaluated: new Date(),
              suggestions: []
            },
            completionRate: 0.11,
            estimatedCompletionTime: 310
          },
          settings: {
            autoSave: true,
            aiAssistanceLevel: 'moderate',
            collaborationMode: false,
            templatePreferences: []
          },
          metadata: {
            createdAt: new Date(Date.now() - 86400000),
            updatedAt: new Date(),
            version: 1,
            authorId: 'user-1',
            collaborators: [],
            lastSavedAt: new Date()
          }
        };
        
        setDocument(sampleDocument);
        setSelectedModuleId(sampleDocument.modules[0]?.id || null);
      } catch (error) {
        console.error('Failed to load document:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDocument();
  }, [id]);

  // 处理文档更新
  const handleDocumentChange = useCallback((updatedDocument: SmartDocument) => {
    setDocument(updatedDocument);
    // 这里可以添加自动保存逻辑
  }, []);

  // 处理模块选择
  const handleModuleSelect = useCallback((moduleId: string) => {
    setSelectedModuleId(moduleId);
  }, []);

  // 处理依赖关系编辑
  const handleRelationshipEdit = useCallback((relationship: ModuleRelationship) => {
    console.log('Edit relationship:', relationship);
    // 这里可以打开编辑对话框
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">加载智能编辑器中...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">文档未找到</h2>
          <p className="text-gray-600 mb-4">请检查文档ID是否正确</p>
          <Button onClick={() => navigate('/create')}>
            返回创建页面
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="intelligent-modular-editor-page min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/create')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← 返回
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{document.title}</h1>
              <p className="text-sm text-gray-500">
                {document.globalMetrics.totalWordCount} words • {Math.round(document.globalMetrics.completionRate * 100)}% complete
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 视图模式切换 */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('editor')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'editor' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                编辑器
              </button>
              <button
                onClick={() => setViewMode('dependencies')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'dependencies' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                依赖图
              </button>
              <button
                onClick={() => setViewMode('hybrid')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'hybrid' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                混合视图
              </button>
            </div>

            <Button variant="outline" size="sm">
              分享
            </Button>
            <Button size="sm">
              导出
            </Button>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* 编辑器视图 */}
        {(viewMode === 'editor' || viewMode === 'hybrid') && (
          <div className={viewMode === 'hybrid' ? 'w-2/3' : 'w-full'}>
            <SmartModularEditor
              document={document}
              onDocumentChange={handleDocumentChange}
              onModuleSelect={handleModuleSelect}
              className="h-full"
            />
          </div>
        )}

        {/* 依赖关系视图 */}
        {(viewMode === 'dependencies' || viewMode === 'hybrid') && (
          <div className={`${viewMode === 'hybrid' ? 'w-1/3 border-l border-gray-200' : 'w-full'}`}>
            <Card className="h-full m-4">
              <DependencyVisualizer
                modules={document.modules}
                relationships={document.relationships}
                selectedModuleId={selectedModuleId}
                onModuleSelect={handleModuleSelect}
                onRelationshipEdit={handleRelationshipEdit}
                className="h-full"
              />
            </Card>
          </div>
        )}
      </div>

      {/* 浮动操作按钮 */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
        <Button
          className="rounded-full w-12 h-12 shadow-lg"
          onClick={() => {
            // 触发AI分析
            console.log('AI analysis triggered');
          }}
          title="AI分析"
        >
          🤖
        </Button>
        <Button
          variant="outline"
          className="rounded-full w-12 h-12 shadow-lg bg-white"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title="切换侧边栏"
        >
          📊
        </Button>
      </div>
    </div>
  );
};