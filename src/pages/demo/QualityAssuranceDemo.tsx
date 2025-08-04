/**
 * 质量保证和进度管理功能演示页面
 * 展示跨模块一致性分析、智能进度跟踪、质量评估和协作管理功能
 */

import React, { useState, useEffect } from 'react';
import { 
  ConsistencyAnalysisPanel,
  ProgressTrackingPanel,
  QualityAssessmentPanel,
  CollaborationPanel
} from '../../components/analysis';
import { 
  ConsistencyAnalyzer,
  ProgressTracker,
  createConsistencyAnalyzer,
  createProgressTracker,
  defaultGLMClient
} from '../../services';
import type { 
  Paper,
  User,
  ConsistencyAnalysisResult,
  ProgressTrackingResult
} from '../../types';

// 模拟数据
const mockPaper: Paper = {
  id: 'demo-paper-001',
  title: '基于深度学习的自然语言处理技术研究',
  content: '',
  abstract: '本研究探讨了深度学习技术在自然语言处理领域的应用...',
  keywords: ['深度学习', '自然语言处理', '机器学习', '人工智能'],
  status: 'writing',
  authorId: 'user-001',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  wordCount: 12500,
  sections: [
    {
      id: 'section-intro',
      title: '引言',
      content: '随着人工智能技术的快速发展，深度学习在自然语言处理领域取得了显著成果。本研究旨在深入分析深度学习技术在NLP中的应用现状、挑战和未来发展方向。通过对比分析多种深度学习模型，我们发现Transformer架构在处理长序列文本时具有明显优势。',
      order: 1,
      level: 1
    },
    {
      id: 'section-literature',
      title: '文献综述',
      content: '近年来，深度学习在NLP领域的研究主要集中在以下几个方面：词嵌入技术的发展、循环神经网络的应用、注意力机制的引入以及预训练语言模型的兴起。从Word2Vec、GloVe到BERT、GPT系列模型，每一次技术革新都推动了NLP任务性能的显著提升。',
      order: 2,
      level: 1
    },
    {
      id: 'section-methodology',
      title: '研究方法',
      content: '本研究采用了实验对比的方法，选择了三个代表性的NLP任务：文本分类、情感分析和机器翻译。我们实现了多种深度学习模型，包括CNN、LSTM、Transformer等，并在相同的数据集上进行训练和测试。',
      order: 3,
      level: 1
    },
    {
      id: 'section-results',
      title: '实验结果',
      content: '实验结果表明，基于Transformer的模型在所有三个任务上都取得了最佳性能。在文本分类任务中，BERT模型的F1分数达到了0.94，相比传统的CNN模型提升了8%。在情感分析任务中，RoBERTa模型的准确率达到了92.3%。',
      order: 4,
      level: 1
    },
    {
      id: 'section-discussion',
      title: '讨论与分析',
      content: '从实验结果可以看出，预训练语言模型的成功主要归因于其大规模的预训练数据和自监督学习机制。然而，这些模型也存在一些问题，如计算资源需求大、模型可解释性差等。未来的研究应该关注如何在保持性能的同时降低模型复杂度。',
      order: 5,
      level: 1
    },
    {
      id: 'section-conclusion',
      title: '结论',
      content: '本研究通过实验验证了深度学习技术在自然语言处理中的有效性，特别是Transformer架构的优越性。同时，我们也指出了当前技术的局限性和未来的发展方向。这些发现为NLP领域的进一步研究提供了有价值的参考。',
      order: 6,
      level: 1
    }
  ],
  paperType: 'empirical-research',
  field: '计算机科学',
  requirements: '学术期刊投稿要求',
  format: 'IEEE',
  specialRequirements: '需要包含实验验证',
  outlinePreference: '传统学术结构',
  detailLevel: '详细',
  citationStyle: 'IEEE'
};

const mockCurrentUser: User = {
  id: 'user-001',
  name: '张研究员',
  email: 'zhang@university.edu',
  avatar: '',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date()
};

const mockCollaborators: User[] = [
  {
    id: 'user-002',
    name: '李教授',
    email: 'li@university.edu',
    avatar: '',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'user-003',
    name: '王博士',
    email: 'wang@university.edu',
    avatar: '',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date()
  }
];

const mockVersions = [
  {
    id: 'v1.3',
    version: 'v1.3',
    description: '完成实验结果章节，修正数据分析',
    createdBy: mockCurrentUser,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    wordCount: 12500,
    changes: [
      {
        type: 'modification' as const,
        section: '实验结果',
        content: '更新了实验数据',
        position: 100,
        author: mockCurrentUser
      },
      {
        type: 'addition' as const,
        section: '讨论与分析',
        content: '添加了对比分析',
        position: 200,
        author: mockCurrentUser
      }
    ],
    isAutoSave: false,
    tags: ['实验', '数据分析']
  },
  {
    id: 'v1.2',
    version: 'v1.2',
    description: '完善文献综述，添加最新研究',
    createdBy: mockCollaborators[0],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    wordCount: 11200,
    changes: [
      {
        type: 'addition' as const,
        section: '文献综述',
        content: '添加了2024年的最新研究',
        position: 50,
        author: mockCollaborators[0]
      }
    ],
    isAutoSave: false,
    tags: ['文献综述']
  },
  {
    id: 'v1.1',
    version: 'v1.1',
    description: '自动保存版本',
    createdBy: mockCurrentUser,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    wordCount: 10800,
    changes: [],
    isAutoSave: true,
    tags: []
  }
];

const mockComments = [
  {
    id: 'comment-001',
    content: '引言部分的研究背景阐述很清晰，但建议添加更多关于技术挑战的描述。',
    author: mockCollaborators[0],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    resolved: false,
    replies: [
      {
        id: 'reply-001',
        content: '已经在最新版本中补充了技术挑战的内容。',
        author: mockCurrentUser,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ],
    type: 'suggestion' as const,
    priority: 'medium' as const,
    tags: ['引言', '背景'],
    section: '引言'
  },
  {
    id: 'comment-002',
    content: '实验结果中的数据表格格式需要统一，建议使用IEEE标准格式。',
    author: mockCollaborators[1],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    resolved: false,
    replies: [],
    type: 'comment' as const,
    priority: 'high' as const,
    tags: ['格式', '表格'],
    section: '实验结果'
  },
  {
    id: 'comment-003',
    content: '文献综述部分内容丰富，覆盖面广，很好地总结了相关工作。',
    author: mockCollaborators[0],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    resolved: true,
    replies: [],
    type: 'approval' as const,
    priority: 'low' as const,
    tags: ['文献综述'],
    section: '文献综述'
  }
];

const QualityAssuranceDemo: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'consistency' | 'progress' | 'quality' | 'collaboration'>('consistency');
  const [consistencyResult, setConsistencyResult] = useState<ConsistencyAnalysisResult | null>(null);
  const [progressResult, setProgressResult] = useState<ProgressTrackingResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 初始化分析器
  const [consistencyAnalyzer] = useState(() => 
    createConsistencyAnalyzer(defaultGLMClient, {
      paperType: 'empirical-research',
      academicLevel: 'master',
      citationStyle: 'IEEE',
      analysisDepth: 'detailed',
      enableAIAnalysis: true
    })
  );

  const [progressTracker] = useState(() =>
    createProgressTracker(defaultGLMClient, {
      paperType: 'empirical-research',
      academicLevel: 'master',
      targetWordCount: 15000,
      trackingGranularity: 'detailed',
      enableAIInsights: true,
      autoMilestones: true
    })
  );

  // 执行一致性分析
  const handleConsistencyAnalysis = async () => {
    if (!consistencyAnalyzer) return;
    
    setIsAnalyzing(true);
    try {
      const result = await consistencyAnalyzer.analyzePaper(mockPaper);
      setConsistencyResult(result);
    } catch (error) {
      console.error('一致性分析失败:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 执行进度跟踪
  const handleProgressTracking = async () => {
    if (!progressTracker) return;
    
    setIsAnalyzing(true);
    try {
      const result = await progressTracker.getProgressAnalysis(mockPaper);
      setProgressResult(result);
    } catch (error) {
      console.error('进度跟踪失败:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 生成模拟的写作会话数据
  useEffect(() => {
    if (progressTracker) {
      // 模拟一些写作会话
      const sessions = [
        {
          id: 'session-001',
          paperId: mockPaper.id,
          startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
          endTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
          wordsWritten: 500,
          sectionsWorkedOn: ['section-results'],
          productivity: 85,
          mood: 'good' as const,
          distractions: 2
        },
        {
          id: 'session-002',
          paperId: mockPaper.id,
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() - 22 * 60 * 60 * 1000),
          wordsWritten: 800,
          sectionsWorkedOn: ['section-methodology', 'section-results'],
          productivity: 92,
          mood: 'excellent' as const,
          distractions: 1
        }
      ];

      sessions.forEach(session => {
        progressTracker.recordWritingSession(session);
      });
    }
  }, [progressTracker]);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'consistency':
        return (
          <ConsistencyAnalysisPanel
            paper={mockPaper}
            analysisResult={consistencyResult}
            onAnalyze={handleConsistencyAnalysis}
            onApplyRecommendation={(recommendation) => {
              console.log('应用建议:', recommendation);
            }}
            isLoading={isAnalyzing}
          />
        );
      
      case 'progress':
        return (
          <ProgressTrackingPanel
            paper={mockPaper}
            progressResult={progressResult}
            onTrack={handleProgressTracking}
            onUpdateMilestone={(milestoneId, updates) => {
              console.log('更新里程碑:', milestoneId, updates);
              if (progressTracker) {
                progressTracker.updateMilestone(mockPaper.id, milestoneId, updates);
              }
            }}
            onApplyRecommendation={(recommendation) => {
              console.log('应用建议:', recommendation);
            }}
            isLoading={isAnalyzing}
          />
        );
      
      case 'quality':
        return (
          <QualityAssessmentPanel
            paper={mockPaper}
            consistencyResult={consistencyResult}
            progressResult={progressResult}
            onGenerateReport={(format) => {
              console.log('生成报告:', format);
              // 这里会调用报告生成服务
            }}
            onExportPaper={(config) => {
              console.log('导出论文:', config);
              // 这里会调用论文导出服务
            }}
            isLoading={isAnalyzing}
          />
        );
      
      case 'collaboration':
        return (
          <CollaborationPanel
            paper={mockPaper}
            currentUser={mockCurrentUser}
            collaborators={mockCollaborators}
            versions={mockVersions}
            comments={mockComments}
            onInviteCollaborator={(email, role) => {
              console.log('邀请协作者:', email, role);
            }}
            onCreateVersion={(description) => {
              console.log('创建版本:', description);
            }}
            onRestoreVersion={(versionId) => {
              console.log('恢复版本:', versionId);
            }}
            onAddComment={(comment) => {
              console.log('添加评论:', comment);
            }}
            onResolveComment={(commentId) => {
              console.log('解决评论:', commentId);
            }}
            isLoading={isAnalyzing}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* 页面头部 */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">质量保证与进度管理</h1>
                <p className="mt-2 text-gray-600">
                  展示跨模块一致性分析、智能进度跟踪、质量评估和协作管理功能
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  演示模式
                </span>
                <span className="text-sm text-gray-500">
                  最后更新: {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 功能导航 */}
        <div className="bg-white border-b">
          <div className="px-6">
            <nav className="flex space-x-8">
              {[
                { key: 'consistency', label: '一致性分析', icon: '🔍' },
                { key: 'progress', label: '进度跟踪', icon: '📊' },
                { key: 'quality', label: '质量评估', icon: '⭐' },
                { key: 'collaboration', label: '协作管理', icon: '👥' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    selectedTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 功能说明面板 */}
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-blue-500 text-xl">💡</span>
              </div>
              <div>
                <h3 className="text-blue-900 font-medium mb-1">功能演示说明</h3>
                <p className="text-blue-800 text-sm">
                  {selectedTab === 'consistency' && '一致性分析功能可以检查论文各章节之间的逻辑一致性、引用完整性和结构合理性，帮助发现内容矛盾和结构问题。'}
                  {selectedTab === 'progress' && '进度跟踪功能提供论文写作进度的可视化分析，包括章节完成度、时间统计、里程碑管理和生产力分析。'}
                  {selectedTab === 'quality' && '质量评估功能综合多个维度对论文质量进行评分，提供详细的改进建议和合规性检查。'}
                  {selectedTab === 'collaboration' && '协作管理功能支持多人协作写作，包括协作者管理、版本控制、评论批注和活动跟踪。'}
                </p>
              </div>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="bg-transparent">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityAssuranceDemo;