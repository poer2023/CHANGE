import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle, Clock, FileText, Download, Share2, MoreVertical, ExternalLink, History,
  BarChart, Zap, BookOpen, Activity, Users, Image, Package, 
  AlertCircle, Loader2, Play, RotateCcw, AlertTriangle, Search, Eye, ChevronDown,
  ChevronUp, Filter, Grid, List, Calendar, Globe, Book, FileTextIcon, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWritingFlow } from '@/contexts/WritingFlowContext';
import { ResultProvider, useResult } from '@/contexts/ResultContext';
import { useResultShortcuts } from '@/hooks/useKeyboardShortcuts';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Deliverables, DeliverableState } from '@/types/writing-flow';
import AgentPanel from '@/components/Agent/AgentPanel';
import AuditPanel from '@/components/Agent/AuditPanel';
import { Scope } from '@/types/agent';

// 文档工具条组件
const DocumentToolbar: React.FC = () => {
  const handleExportDocx = () => {
    toast.success('DOCX 导出已开始');
  };

  const handleExportPdf = () => {
    toast.success('PDF 导出已开始');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('链接已复制到剪贴板');
  };

  const handleViewAudit = () => {
    toast.info('打开审计日志');
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleExportDocx} className="rounded-full text-xs">
        <Download className="w-3 h-3 mr-1.5" />
        DOCX
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportPdf} className="rounded-full text-xs">
        <Download className="w-3 h-3 mr-1.5" />
        PDF
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-full px-2">
            <MoreVertical className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyLink}>
            <ExternalLink className="w-4 h-4 mr-2" />
            复制只读链接
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleViewAudit}>
            <History className="w-4 h-4 mr-2" />
            查看审计日志
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};


// ArticleCard 组件 - 基于现有 StreamingContentPanel 改造
const ArticleCard: React.FC = () => {
  const { project } = useWritingFlow();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  
  // 模拟文档数据
  const documentData = {
    title: project?.topic?.title || '学术论文写作',
    docType: project?.topic?.assignmentType || '学术论文',
    createdAt: new Date().toLocaleDateString(),
    style: project?.topic?.citationStyle || 'APA',
    status: generationComplete ? 'completed' : isGenerating ? 'generating' : 'queued',
    wordCount: 3500
  };

  // 模拟内容生成
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationComplete(true);
      }, 3000);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* 文档头部 */}
      <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {documentData.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {documentData.docType}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {documentData.createdAt}
              </div>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                {documentData.style}
              </Badge>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                约 {documentData.wordCount} 字
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary"
              className={
                documentData.status === 'completed' ? 'bg-green-100 text-green-700' :
                documentData.status === 'generating' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }
            >
              {documentData.status === 'completed' ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  已完成
                </>
              ) : documentData.status === 'generating' ? (
                <>
                  <Clock className="w-3 h-3 mr-1 animate-pulse" />
                  生成中
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  排队中
                </>
              )}
            </Badge>
            <DocumentToolbar />
          </div>
        </div>
      </div>

      {/* 文档内容 */}
      <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
        <div className="max-h-[calc(100vh-12rem)] overflow-auto p-6 pb-20 space-y-8">
          {isGenerating ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">1. 引言</h2>
                <div className="prose prose-slate max-w-none">
                  <p>本研究旨在深入探讨相关领域的核心问题。通过系统性的分析方法，我们将为这一领域提供新的理论视角和实践指导。</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500 animate-pulse">
                    <div className="w-2 h-2 bg-[#6E5BFF] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#6E5BFF] rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-[#6E5BFF] rounded-full animate-bounce delay-200" />
                    <span className="ml-2">正在生成内容...</span>
                  </div>
                </div>
              </div>
            </div>
          ) : generationComplete ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">1. 引言</h2>
                <div className="prose prose-slate max-w-none">
                  <p>本研究旨在深入探讨相关领域的核心问题。通过系统性的分析方法，我们将为这一领域提供新的理论视角和实践指导。<sup className="text-[#6E5BFF] ml-1">[1]</sup></p>
                  <p>当前的研究背景表明，该领域存在诸多值得深入研究的问题。本文将通过严谨的学术方法，对这些问题进行全面的分析和讨论。<sup className="text-[#6E5BFF] ml-1">[2]</sup></p>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">2. 文献综述</h2>
                <div className="prose prose-slate max-w-none">
                  <p>通过对现有文献的系统性梳理，我们发现该研究领域在过去几年中取得了显著进展。主要的研究方向包括理论建构、实证研究和应用探索三个方面。<sup className="text-[#6E5BFF] ml-1">[3]</sup></p>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">3. 研究方法</h2>
                <div className="prose prose-slate max-w-none">
                  <p>本研究采用了混合研究方法，结合了定量分析和定性研究的优势。研究设计遵循严格的学术规范，确保研究结果的可靠性和有效性。</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>正在准备文档内容...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 状态指示器组件
const StateIndicator: React.FC<{ state: DeliverableState }> = ({ state }) => {
  const getStateConfig = (state: DeliverableState) => {
    switch (state) {
      case 'ready': return { color: 'bg-green-500', label: '就绪' };
      case 'generating': return { color: 'bg-blue-500 animate-pulse', label: '生成中' };
      case 'error': return { color: 'bg-red-500', label: '出错' };
      case 'missing-deps': return { color: 'bg-amber-500', label: '等待依赖' };
      default: return { color: 'bg-gray-400', label: '空闲' };
    }
  };
  
  const config = getStateConfig(state);
  return <div className={`w-2 h-2 rounded-full ${config.color}`} title={config.label} />;
};

// 质量评估卡片
const QualityCard: React.FC<{ state: DeliverableState }> = ({ state }) => {
  const { generateDeliverable } = useResult();
  const scores = [
    { name: '结构完整度', value: 85 },
    { name: '引用规范', value: 92 },
    { name: '语言一致性', value: 78 },
    { name: '可证据化', value: 88 }
  ];
  const overall = Math.round(scores.reduce((acc, s) => acc + s.value, 0) / scores.length);

  const handleOpenAgent = () => {
    window.dispatchEvent(new CustomEvent('openAgentForDeliverable', {
      detail: { 
        deliverableType: 'quality',
        deliverableTitle: '质量评估报告',
        context: `当前评分：${overall}/100，语言一致性需要优化`
      }
    }));
  };

  const handleGenerate = () => {
    generateDeliverable('quality');
    toast.success('开始生成质量评估报告');
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 animate-in fade-in slide-in-from-right-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StateIndicator state={state} />
          <span className="text-sm font-medium text-slate-900">质量评估</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="w-4 h-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleOpenAgent}>
              <Zap className="w-4 h-4 mr-2" />
              用 Agent 优化
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {state === 'ready' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">综合评分</span>
            <span className={`text-sm font-bold ${overall >= 80 ? 'text-green-600' : overall >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
              {overall}/100
            </span>
          </div>
          
          <div className="space-y-2">
            {scores.map((score, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">{score.name}</span>
                  <span className={score.value >= 60 ? 'text-slate-900' : 'text-red-600'}>{score.value}</span>
                </div>
                <Progress value={score.value} className="h-1" />
              </div>
            ))}
          </div>
          
          {scores.some(s => s.value < 60) && (
            <div className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              语言一致性需要优化
            </div>
          )}
        </div>
      ) : state === 'generating' ? (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Loader2 className="w-3 h-3 animate-spin" />
          正在分析文档质量...
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-slate-400">等待正文完成</div>
          <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleGenerate}>
            <Play className="w-3 h-3 mr-1.5" />
            生成质量报告
          </Button>
        </div>
      )}
    </div>
  );
};

// 过程摘要卡片
const ProcessSummaryCard: React.FC<{ state: DeliverableState }> = ({ state }) => {
  const { generateDeliverable } = useResult();
  
  const handleGenerate = () => {
    generateDeliverable('processPdf');
    toast.success('开始生成过程摘要PDF');
  };

  const handleOpenAgent = () => {
    window.dispatchEvent(new CustomEvent('openAgentForDeliverable', {
      detail: { 
        deliverableType: 'process',
        deliverableTitle: '过程摘要',
        context: '会话时长: 2小时15分钟，引用插入: 8次，手工编辑: 3次'
      }
    }));
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 animate-in fade-in slide-in-from-right-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StateIndicator state={state} />
          <span className="text-sm font-medium text-slate-900">过程摘要</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="w-4 h-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleOpenAgent}>
              <Zap className="w-4 h-4 mr-2" />
              用 Agent 优化
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {state === 'ready' ? (
        <div className="space-y-3">
          <div className="text-xs text-slate-600 space-y-1">
            <div>会话时长: 2小时15分钟</div>
            <div>引用插入: 8次</div>
            <div>手工编辑: 3次</div>
          </div>
          <Button 
            size="sm" 
            className="w-full text-xs bg-[#6E5BFF] hover:bg-[#5A4ACF]" 
            onClick={handleGenerate}
            aria-label="下载过程摘要PDF文件"
          >
            <Download className="w-3 h-3 mr-1.5" />
            下载 PDF
          </Button>
        </div>
      ) : state === 'generating' ? (
        <div className="space-y-2">
          <Progress value={45} className="h-1" />
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="w-3 h-3 animate-spin" />
            生成中... 45%
          </div>
        </div>
      ) : (
        <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleGenerate}>
          <Play className="w-3 h-3 mr-1.5" />
          生成摘要
        </Button>
      )}
    </div>
  );
};

// 文献条目组件
const ReferenceItem: React.FC<{ 
  reference: Reference; 
  onView: (ref: Reference) => void;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ reference, onView, isExpanded, onToggle }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'paper': return <FileTextIcon className="w-3 h-3" />;
      case 'book': return <Book className="w-3 h-3" />;
      case 'web': return <Globe className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'paper': return 'bg-blue-100 text-blue-700';
      case 'book': return 'bg-green-100 text-green-700';
      case 'web': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
      {/* 文献头部 */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`p-1 rounded ${getTypeColor(reference.sourceType)}`}>
            {getTypeIcon(reference.sourceType)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-medium text-slate-900 truncate" title={reference.title}>
              {reference.title}
            </h4>
            <p className="text-xs text-slate-600 truncate">
              {reference.authors.slice(0, 2).join(', ')}
              {reference.authors.length > 2 && ' 等'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
            onClick={() => onView(reference)}
            title="预览文献"
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
            onClick={onToggle}
          >
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>
        </div>
      </div>

      {/* 基本信息 */}
      <div className="flex items-center gap-3 mb-2 text-xs text-slate-600">
        {reference.year && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {reference.year}
          </div>
        )}
        {reference.venue && (
          <div className="truncate flex-1" title={reference.venue}>
            {reference.venue}
          </div>
        )}
        {reference.citationCount && (
          <div className="text-slate-500">
            被引 {reference.citationCount}
          </div>
        )}
      </div>

      {/* PDF 缩略图和预览 */}
      {reference.pdfUrl && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-10 bg-red-100 border border-red-200 rounded flex items-center justify-center">
            <FileText className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1 text-xs text-slate-600">
            <div className="font-medium">PDF 文档</div>
            <div className="text-slate-500">
              {reference.fileSize || '2.4 MB'} • {reference.lastAccessed || '2天前访问'}
            </div>
          </div>
        </div>
      )}

      {/* 展开的详细信息 */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
          {reference.abstract && (
            <div>
              <div className="text-xs font-medium text-slate-700 mb-1">摘要</div>
              <p className="text-xs text-slate-600 line-clamp-3">{reference.abstract}</p>
            </div>
          )}
          
          {reference.doi && (
            <div>
              <div className="text-xs font-medium text-slate-700 mb-1">DOI</div>
              <div className="text-xs text-blue-600 break-all">{reference.doi}</div>
            </div>
          )}

          {reference.tags && reference.tags.length > 0 && (
            <div>
              <div className="text-xs font-medium text-slate-700 mb-1">标签</div>
              <div className="flex flex-wrap gap-1">
                {reference.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 引用与来源卡片
const ReferencesCard: React.FC<{ state: DeliverableState }> = ({ state }) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedRefs, setExpandedRefs] = useState<Set<string>>(new Set());

  // 模拟文献数据
  const mockReferences: Reference[] = [
    {
      id: '1',
      title: 'Deep Learning for Natural Language Processing: A Comprehensive Survey',
      authors: ['Zhang, L.', 'Wang, H.', 'Li, M.'],
      year: 2023,
      venue: 'IEEE Transactions on Neural Networks and Learning Systems',
      doi: '10.1109/TNNLS.2023.1234567',
      sourceType: 'paper',
      pdfUrl: '/papers/zhang2023deep.pdf',
      fileSize: '2.4 MB',
      lastAccessed: '2天前',
      citationCount: 156,
      abstract: '本文对自然语言处理中的深度学习方法进行了全面综述，涵盖了从基础模型架构到最新的变换器网络的发展历程...',
      tags: ['深度学习', '自然语言处理', '变换器', '神经网络']
    },
    {
      id: '2',
      title: 'Artificial Intelligence: A Modern Approach',
      authors: ['Russell, S.', 'Norvig, P.'],
      year: 2021,
      venue: 'Pearson Education',
      sourceType: 'book',
      pdfUrl: '/books/russell2021ai.pdf',
      fileSize: '15.2 MB',
      lastAccessed: '5天前',
      citationCount: 12543,
      abstract: '这是人工智能领域最权威的教科书，提供了AI的全面概述，从搜索算法到机器学习，再到知识表示和推理...',
      tags: ['人工智能', '机器学习', '搜索算法', '知识表示']
    },
    {
      id: '3',
      title: 'The State of AI Research in 2023',
      authors: ['Smith, J.'],
      year: 2023,
      venue: 'AI Research Blog',
      url: 'https://ai-research.com/state-2023',
      sourceType: 'web',
      lastAccessed: '1天前',
      abstract: '本文分析了2023年人工智能研究的最新趋势，包括大语言模型、多模态AI和边缘计算等热点领域...',
      tags: ['AI趋势', '大语言模型', '多模态', '边缘计算']
    },
    {
      id: '4',
      title: 'Transformer Networks for Computer Vision Tasks',
      authors: ['Chen, Y.', 'Liu, X.', 'Brown, A.'],
      year: 2022,
      venue: 'Computer Vision and Pattern Recognition (CVPR)',
      doi: '10.1109/CVPR.2022.9876543',
      sourceType: 'paper',
      pdfUrl: '/papers/chen2022transformer.pdf',
      fileSize: '3.1 MB',
      lastAccessed: '3天前',
      citationCount: 234,
      abstract: '本文探讨了变换器网络在计算机视觉任务中的应用，提出了一种新的视觉变换器架构，在图像分类和目标检测任务上取得了优异性能...',
      tags: ['变换器', '计算机视觉', '图像分类', '目标检测']
    }
  ];

  const stats = {
    total: mockReferences.length,
    target: 10,
    byType: mockReferences.reduce((acc, ref) => {
      acc[ref.sourceType] = (acc[ref.sourceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  const filteredReferences = mockReferences.filter(ref => {
    const matchesSearch = ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ref.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || ref.sourceType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleToggleExpanded = (refId: string) => {
    setExpandedRefs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(refId)) {
        newSet.delete(refId);
      } else {
        newSet.add(refId);
      }
      return newSet;
    });
  };

  const handleViewReference = (ref: Reference) => {
    toast.success(`正在打开: ${ref.title.slice(0, 30)}...`);
  };

  const handleCopyFormat = (format: string) => {
    toast.success(`${format} 格式已复制到剪贴板`);
  };

  const handleExportReferences = () => {
    toast.success('文献列表导出已开始');
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 animate-in fade-in slide-in-from-right-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StateIndicator state={state} />
          <span className="text-sm font-medium text-slate-900">引用与来源</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="w-4 h-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportReferences}>
              <Download className="w-4 h-4 mr-2" />
              导出文献列表
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {state === 'ready' ? (
        <div className="space-y-3">
          {/* 统计信息 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">已收集/目标</span>
              <span className="text-slate-900">{stats.total}/{stats.target}</span>
            </div>
            <Progress value={(stats.total / stats.target) * 100} className="h-1" />
          </div>

          {/* 搜索和筛选 */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-1.5 w-3 h-3 text-slate-400" />
              <input
                type="text"
                placeholder="搜索文献..."
                className="w-full text-xs pl-7 pr-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-[#6E5BFF]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <select 
                className="text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-[#6E5BFF]"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">全部类型</option>
                <option value="paper">学术论文</option>
                <option value="book">专著</option>
                <option value="web">网页</option>
              </select>
              
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  className="h-6 w-6 p-0"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  className="h-6 w-6 p-0"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* 文献列表 */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredReferences.map(ref => (
              <ReferenceItem
                key={ref.id}
                reference={ref}
                onView={handleViewReference}
                isExpanded={expandedRefs.has(ref.id)}
                onToggle={() => handleToggleExpanded(ref.id)}
              />
            ))}
            
            {filteredReferences.length === 0 && (
              <div className="text-center py-4 text-slate-400 text-xs">
                没有找到匹配的文献
              </div>
            )}
          </div>

          {/* 格式导出按钮 */}
          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-200">
            <Button size="sm" variant="outline" className="text-xs" onClick={() => handleCopyFormat('APA')}>
              APA
            </Button>
            <Button size="sm" variant="outline" className="text-xs" onClick={() => handleCopyFormat('MLA')}>
              MLA
            </Button>
            <Button size="sm" variant="outline" className="text-xs" onClick={() => handleCopyFormat('Chicago')}>
              Chicago
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-400">正在收集引用来源...</div>
      )}
    </div>
  );
};

// 时间线与审计卡片
const TimelineCard: React.FC<{ state: DeliverableState }> = ({ state }) => {
  const { state: resultState } = useResult();
  const events = resultState.timeline.events.length > 0 ? resultState.timeline.events : [
    { label: '开始会话', timestamp: '14:30', actor: 'user' as const },
    { label: '插入引用', timestamp: '14:45', actor: 'agent' as const },
    { label: '格式化', timestamp: '15:20', actor: 'agent' as const },
    { label: '完成', timestamp: '16:45', actor: 'user' as const }
  ];

  const handleExportAudit = () => {
    toast.success('审计日志导出已开始');
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 animate-in fade-in slide-in-from-right-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StateIndicator state={state} />
          <span className="text-sm font-medium text-slate-900">时间线与审计</span>
        </div>
        <Activity className="w-4 h-4 text-slate-400" />
      </div>
      
      {state === 'ready' ? (
        <div className="space-y-3">
          <div className="space-y-1.5">
            {events.slice(0, 3).map((event, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div className={`w-1.5 h-1.5 rounded-full ${event.actor === 'user' ? 'bg-green-500' : 'bg-blue-500'}`} />
                <span className="text-slate-900">{event.label}</span>
                <span className="text-slate-500 ml-auto">{event.timestamp}</span>
              </div>
            ))}
          </div>
          <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleExportAudit}>
            <Download className="w-3 h-3 mr-1.5" />
            导出 JSON
          </Button>
        </div>
      ) : (
        <div className="text-xs text-slate-400">记录操作时间线</div>
      )}
    </div>
  );
};

// 面谈速读卡片
const VivaCard: React.FC<{ state: DeliverableState }> = ({ state }) => {
  const { generateDeliverable } = useResult();
  
  const handleGenerate = () => {
    generateDeliverable('viva');
    toast.success('开始生成面谈速读卡');
  };

  const handleOpenAgent = () => {
    window.dispatchEvent(new CustomEvent('openAgentForDeliverable', {
      detail: { 
        deliverableType: 'viva',
        deliverableTitle: '面谈速读卡',
        context: '老师口头核验要点总结'
      }
    }));
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 animate-in fade-in slide-in-from-right-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StateIndicator state={state} />
          <span className="text-sm font-medium text-slate-900">面谈速读卡</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="w-4 h-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleOpenAgent}>
              <Zap className="w-4 h-4 mr-2" />
              用 Agent 优化
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {state === 'ready' ? (
        <div className="space-y-3">
          <div className="text-xs text-slate-600">
            老师口头核验要点总结
          </div>
          <Button size="sm" className="w-full text-xs bg-[#6E5BFF] hover:bg-[#5A4ACF]" onClick={handleGenerate}>
            <Download className="w-3 h-3 mr-1.5" />
            下载 PDF
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleGenerate}>
          <Play className="w-3 h-3 mr-1.5" />
          生成速读卡
        </Button>
      )}
    </div>
  );
};

// 图表与素材包卡片
const AssetsCard: React.FC<{ state: DeliverableState }> = ({ state }) => {
  const { generateDeliverable } = useResult();
  const assets = [
    { id: '1', name: '统计图表', type: 'chart' as const, thumbnail: '' },
    { id: '2', name: '数据表格', type: 'table' as const, thumbnail: '' }
  ];

  const handleGenerate = () => {
    generateDeliverable('assets');
    toast.success('开始生成素材包');
  };

  const handleExportAssets = () => {
    toast.success('素材包导出已开始');
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 animate-in fade-in slide-in-from-right-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StateIndicator state={state} />
          <span className="text-sm font-medium text-slate-900">图表与素材</span>
        </div>
        <Image className="w-4 h-4 text-slate-400" />
      </div>
      
      {state === 'ready' ? (
        <div className="space-y-3">
          <div className="text-xs text-slate-600">
            {assets.length} 个素材文件
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="aspect-square bg-slate-100 rounded border flex items-center justify-center">
              <BarChart className="w-4 h-4 text-slate-400" />
            </div>
            <div className="aspect-square bg-slate-100 rounded border flex items-center justify-center">
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleExportAssets}>
            <Package className="w-3 h-3 mr-1.5" />
            打包下载
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-slate-400">收集图表素材</div>
          <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleGenerate}>
            <Play className="w-3 h-3 mr-1.5" />
            生成素材包
          </Button>
        </div>
      )}
    </div>
  );
};


// 一键打包卡片
const BundleCard: React.FC<{ state: DeliverableState; progress: number }> = ({ state, progress }) => {
  const { generateDeliverable } = useResult();
  
  const handleGenerateBundle = () => {
    generateDeliverable('bundle');
    toast.success('开始打包所有交付物');
  };

  const manifest = [
    'paper.pdf', 'paper.docx', 'process.pdf', 'sources.csv', 
    'references.bib', 'viva.pdf', 'audit.json', 'assets/'
  ];

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 animate-in fade-in slide-in-from-right-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StateIndicator state={state} />
          <span className="text-sm font-medium text-slate-900">一键打包</span>
        </div>
        <Package className="w-4 h-4 text-slate-400" />
      </div>
      
      {state === 'generating' ? (
        <div className="space-y-2">
          <Progress value={progress} className="h-1" />
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="w-3 h-3 animate-spin" />
            打包中... {progress}%
          </div>
        </div>
      ) : state === 'ready' ? (
        <div className="space-y-3">
          <div className="text-xs text-slate-600">
            {manifest.length} 个文件已准备
          </div>
          <Button size="sm" className="w-full text-xs bg-[#6E5BFF] hover:bg-[#5A4ACF]" onClick={handleGenerateBundle}>
            <Download className="w-3 h-3 mr-1.5" />
            下载 ZIP
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-slate-600">
            包含清单: {manifest.slice(0, 3).join(', ')}...
          </div>
          <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleGenerateBundle}>
            <Package className="w-3 h-3 mr-1.5" />
            生成交付包
          </Button>
        </div>
      )}
    </div>
  );
};

// DeliverablesBoard 主组件
const DeliverablesBoard: React.FC = () => {
  const { state: deliverables, setDeliverableState, updateRefsCount, addAuditEvent } = useResult();
  const [statusMessage, setStatusMessage] = useState<string>('');

  // 模拟状态流：正文完成 → 逐卡自动补全
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setDeliverableState('refs', 'ready');
      setDeliverableState('timeline', 'ready');
      updateRefsCount(8, { paper: 4, book: 2, web: 2, dataset: 0, report: 0 });
      addAuditEvent({
        label: '引用收集完成',
        timestamp: new Date().toLocaleTimeString(),
        actor: 'agent'
      });
      setStatusMessage('引用统计和时间线已准备就绪');
    }, 4000);

    const timer2 = setTimeout(() => {
      setDeliverableState('quality', 'generating');
      setStatusMessage('正在生成质量评估报告');
    }, 5000);

    const timer3 = setTimeout(() => {
      setDeliverableState('quality', 'ready');
      setDeliverableState('processPdf', 'ready');
      setDeliverableState('viva', 'ready');
      setDeliverableState('assets', 'ready');
      setDeliverableState('bundle', 'ready');
      addAuditEvent({
        label: '所有交付物准备完成',
        timestamp: new Date().toLocaleTimeString(),
        actor: 'agent'
      });
      setStatusMessage('所有交付物已准备完成');
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [setDeliverableState, updateRefsCount, addAuditEvent]);

  return (
    <div className="xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-auto space-y-4">
      <div className="text-sm font-medium text-slate-700 mb-4">交付物清单</div>
      
      {/* 无障碍访问状态播报 */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {statusMessage}
      </div>
      
      {/* 响应式网格：小屏单列，中屏两列，大屏单列（因为在右侧栏） */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4"
        role="region"
        aria-label="交付物生成状态"
      >
        <BundleCard state={deliverables.bundle.state} progress={deliverables.bundle.progress} />
        <QualityCard state={deliverables.quality.state} />
        <ProcessSummaryCard state={deliverables.processPdf.state} />
        <ReferencesCard state={deliverables.refs.state} />
        <TimelineCard state={deliverables.timeline.state} />
        <VivaCard state={deliverables.viva.state} />
        <AssetsCard state={deliverables.assets.state} />
      </div>
    </div>
  );
};

// Right sidebar component with tabs
const RightSidebar = () => {
  const { project } = useWritingFlow();
  const [activeTab, setActiveTab] = useState<'deliverables' | 'assistant' | 'audit'>('deliverables');
  const [agentScope, setAgentScope] = useState<Scope>({ kind: 'document', title: '结果页面交付物' });
  const assistantInputRef = useRef<HTMLTextAreaElement>(null);

  // 键盘快捷键
  useResultShortcuts({
    onFocusAssistant: () => {
      setActiveTab('assistant');
      setTimeout(() => {
        assistantInputRef.current?.focus();
      }, 100);
    },
    onSwitchToDeliverables: () => setActiveTab('deliverables'),
    onSwitchToAssistant: () => setActiveTab('assistant'),
    onSwitchToAudit: () => setActiveTab('audit')
  });

  // 监听交付物级 Agent 操作事件
  useEffect(() => {
    const handleOpenAgentForDeliverable = (event: CustomEvent) => {
      const { deliverableType, deliverableTitle, context } = event.detail;
      setAgentScope({
        kind: 'selection',
        id: deliverableType,
        title: deliverableTitle
      });
      setActiveTab('assistant');
    };

    window.addEventListener('openAgentForDeliverable', handleOpenAgentForDeliverable as EventListener);
    return () => {
      window.removeEventListener('openAgentForDeliverable', handleOpenAgentForDeliverable as EventListener);
    };
  }, []);

  return (
    <div className="w-96 bg-white border-l border-[#EEF0F4] hidden xl:block">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'deliverables' | 'assistant' | 'audit')} className="h-full flex flex-col">
        <TabsList className="rounded-full bg-white/60 px-1 py-1 m-4 mb-0">
          <TabsTrigger value="deliverables" className="rounded-full text-xs">
            <Package className="w-3 h-3 mr-1" />
            交付物
          </TabsTrigger>
          <TabsTrigger value="assistant" className="rounded-full text-xs">
            <Zap className="w-3 h-3 mr-1" />
            AI 助手
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-full text-xs">
            <Activity className="w-3 h-3 mr-1" />
            审计记录
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 sticky top-20 max-h-[calc(100vh-6rem)] overflow-auto">
          <TabsContent value="deliverables" className="h-full m-0 p-4">
            <DeliverablesBoard />
          </TabsContent>
          
          <TabsContent value="assistant" className="h-full m-0 p-4">
            <AgentPanel 
              scope={agentScope}
              onScopeChange={setAgentScope}
              className="h-full"
            />
          </TabsContent>
          
          <TabsContent value="audit" className="h-full m-0 p-4">
            <AuditPanel className="h-full" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

// 内部布局组件（使用 ResultProvider）
const ResultPageLayout: React.FC = () => {
  const { project } = useWritingFlow();
  
  return (
    <div className="min-h-screen bg-[#F7F8FB] flex">
      <Helmet>
        <title>结果与交付 - 学术论文助手</title>
        <meta name="description" content="查看您的写作流程交付结果和完整文档" />
      </Helmet>
      
      {/* 主内容区 */}
      <div className="flex-1 max-w-[1280px] mx-auto px-4 md:px-6 py-6">
        <ArticleCard />
        
        {/* 移动端：右侧内容下沉到文章卡片下方 */}
        <div className="xl:hidden mt-8">
          <Tabs defaultValue="deliverables" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-full bg-white/60 px-1 py-1">
              <TabsTrigger value="deliverables" className="rounded-full text-xs">
                <Package className="w-3 h-3 mr-1" />
                交付物
              </TabsTrigger>
              <TabsTrigger value="assistant" className="rounded-full text-xs">
                <Zap className="w-3 h-3 mr-1" />
                AI 助手
              </TabsTrigger>
              <TabsTrigger value="audit" className="rounded-full text-xs">
                <Activity className="w-3 h-3 mr-1" />
                审计记录
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="deliverables" className="mt-4">
              <DeliverablesBoard />
            </TabsContent>
            
            <TabsContent value="assistant" className="mt-4">
              <AgentPanel 
                scope={{ kind: 'document', title: '结果页面交付物' }}
                className=""
              />
            </TabsContent>
            
            <TabsContent value="audit" className="mt-4">
              <AuditPanel className="" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* 右侧栏（仅桌面端） */}
      <RightSidebar />
    </div>
  );
};

// 主页面组件（提供 ResultProvider）
const ResultPage: React.FC = () => {
  return (
    <ResultProvider>
      <ResultPageLayout />
    </ResultProvider>
  );
};

export default ResultPage;