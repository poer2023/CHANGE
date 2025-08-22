import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle, Clock, FileText, Download, Share2, MoreVertical, ExternalLink, History,
  BarChart, Zap, BookOpen, Activity, Package, AlertCircle, Loader2, Play, QrCode,
  AlertTriangle, Search, Eye, Calendar, Globe, Book, FileTextIcon, Image, Copy,
  RotateCcw, Save, Target, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useWritingFlow } from '@/contexts/WritingFlowContext';
import { ResultProvider, useResult } from '@/contexts/ResultContext';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { DeliverableState } from '@/types/writing-flow';

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full px-2">
          <MoreVertical className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportDocx}>
          <Download className="w-4 h-4 mr-2" />
          导出 DOCX
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPdf}>
          <Download className="w-4 h-4 mr-2" />
          导出 PDF
        </DropdownMenuItem>
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
  );
};

// ArticleCard 组件 - 760px 宽度
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

  const handleSaveDraft = () => {
    toast.success('草稿已保存');
  };

  const handlePackage = () => {
    toast.success('开始打包所有交付物');
  };

  return (
    <div className="space-y-6">
      {/* 文档头部 */}
      <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#2A3241] mb-2">
              {documentData.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-[#5B667A]">
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
        <div className="p-6 space-y-8">
          {isGenerating ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[#2A3241]">1. 引言</h2>
                <div className="prose prose-slate max-w-none">
                  <p>本研究旨在深入探讨相关领域的核心问题。通过系统性的分析方法，我们将为这一领域提供新的理论视角和实践指导。</p>
                  <div className="flex items-center gap-2 text-sm text-[#5B667A] animate-pulse">
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
                <h2 className="text-xl font-bold text-[#2A3241] mb-4">1. 引言</h2>
                <div className="prose prose-slate max-w-none">
                  <p>本研究旨在深入探讨相关领域的核心问题。通过系统性的分析方法，我们将为这一领域提供新的理论视角和实践指导。<sup className="text-[#6E5BFF] ml-1 cursor-pointer hover:underline">[1]</sup></p>
                  <p>当前的研究背景表明，该领域存在诸多值得深入研究的问题。本文将通过严谨的学术方法，对这些问题进行全面的分析和讨论。<sup className="text-[#6E5BFF] ml-1 cursor-pointer hover:underline">[2]</sup></p>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2A3241] mb-4">2. 文献综述</h2>
                <div className="prose prose-slate max-w-none">
                  <p>通过对现有文献的系统性梳理，我们发现该研究领域在过去几年中取得了显著进展。主要的研究方向包括理论建构、实证研究和应用探索三个方面。<sup className="text-[#6E5BFF] ml-1 cursor-pointer hover:underline">[3]</sup></p>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2A3241] mb-4">3. 研究方法</h2>
                <div className="prose prose-slate max-w-none">
                  <p>本研究采用了混合研究方法，结合了定量分析和定性研究的优势。研究设计遵循严格的学术规范，确保研究结果的可靠性和有效性。</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-[#5B667A]">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>正在准备文档内容...</p>
            </div>
          )}
        </div>
        
        {/* 底部操作条 */}
        <div className="border-t border-[#EEF0F4] p-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleSaveDraft} className="rounded-full">
              <Save className="w-4 h-4 mr-2" />
              保存草稿
            </Button>
            <Button onClick={handlePackage} className="bg-[#6E5BFF] text-white rounded-full px-6 h-10 hover:brightness-105 focus:ring-2 ring-offset-2 ring-[#6E5BFF]">
              <Package className="w-4 h-4 mr-2" />
              打包交付
            </Button>
          </div>
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

// 一键打包卡片
const BundleCard: React.FC = () => {
  const { state: deliverables, generateDeliverable } = useResult();
  const state = deliverables.bundle.state;
  const progress = deliverables.bundle.progress;

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
          <span className="text-sm font-medium text-[#2A3241]">一键打包</span>
        </div>
        <Package className="w-4 h-4 text-[#5B667A]" />
      </div>
      
      {state === 'generating' ? (
        <div className="space-y-2">
          <Progress value={progress} className="h-1" />
          <div className="flex items-center gap-2 text-xs text-[#5B667A]">
            <Loader2 className="w-3 h-3 animate-spin" />
            打包中... {progress}%
          </div>
        </div>
      ) : state === 'ready' ? (
        <div className="space-y-3">
          <div className="text-xs text-[#5B667A]">
            {manifest.length} 个文件已准备
          </div>
          <Button size="sm" className="w-full text-xs bg-[#6E5BFF] hover:brightness-105" onClick={handleGenerateBundle}>
            <Download className="w-3 h-3 mr-1.5" />
            下载 ZIP
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-[#5B667A]">
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

// 质量评估卡片
const QualityCard: React.FC = () => {
  const { state: deliverables, generateDeliverable } = useResult();
  const state = deliverables.quality.state;
  
  const scores = [
    { name: '结构完整度', value: 85 },
    { name: '引用规范', value: 92 },
    { name: '语言一致性', value: 78 },
    { name: '可证据化', value: 88 }
  ];
  const overall = Math.round(scores.reduce((acc, s) => acc + s.value, 0) / scores.length);

  const handleGenerate = () => {
    generateDeliverable('quality');
    toast.success('开始生成质量评估报告');
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 animate-in fade-in slide-in-from-right-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StateIndicator state={state} />
          <span className="text-sm font-medium text-[#2A3241]">质量评估</span>
        </div>
        <BarChart className="w-4 h-4 text-[#5B667A]" />
      </div>
      
      {state === 'ready' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5B667A]">综合评分</span>
            <span className={`text-sm font-bold ${overall >= 80 ? 'text-green-600' : overall >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
              {overall}/100
            </span>
          </div>
          
          <div className="space-y-2">
            {scores.map((score, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5B667A]">{score.name}</span>
                  <span className={score.value >= 60 ? 'text-[#2A3241]' : 'text-red-600'}>{score.value}</span>
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
        <div className="flex items-center gap-2 text-xs text-[#5B667A]">
          <Loader2 className="w-3 h-3 animate-spin" />
          正在分析文档质量...
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-[#5B667A]">等待正文完成</div>
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
const ProcessSummaryCard: React.FC = () => {
  const { state: deliverables, generateDeliverable } = useResult();
  const state = deliverables.processPdf.state;
  
  const handleGenerate = () => {
    generateDeliverable('processPdf');
    toast.success('开始生成过程摘要PDF');
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 animate-in fade-in slide-in-from-right-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StateIndicator state={state} />
          <span className="text-sm font-medium text-[#2A3241]">过程摘要</span>
        </div>
        <FileText className="w-4 h-4 text-[#5B667A]" />
      </div>
      
      {state === 'ready' ? (
        <div className="space-y-3">
          <div className="text-xs text-[#5B667A] space-y-1">
            <div>会话时长: 2小时15分钟</div>
            <div>引用插入: 8次</div>
            <div>手工编辑: 3次</div>
          </div>
          <Button 
            size="sm" 
            className="w-full text-xs bg-[#6E5BFF] hover:brightness-105" 
            onClick={handleGenerate}
          >
            <Download className="w-3 h-3 mr-1.5" />
            下载 PDF
          </Button>
        </div>
      ) : state === 'generating' ? (
        <div className="space-y-2">
          <Progress value={45} className="h-1" />
          <div className="flex items-center gap-2 text-xs text-[#5B667A]">
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

// 引用与来源卡片
const ReferencesCard: React.FC = () => {
  const { state: deliverables } = useResult();
  const state = deliverables.refs.state;
  const stats = deliverables.refs;

  const handleExportCsv = () => {
    toast.success('CSV 导出已开始');
  };

  const handleExportBib = () => {
    toast.success('BIB 导出已开始');
  };

  const handleExportRis = () => {
    toast.success('RIS 导出已开始');
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 animate-in fade-in slide-in-from-right-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StateIndicator state={state} />
          <span className="text-sm font-medium text-[#2A3241]">引用与来源</span>
        </div>
        <BookOpen className="w-4 h-4 text-[#5B667A]" />
      </div>
      
      {state === 'ready' ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#5B667A]">已收集/目标</span>
              <span className="text-[#2A3241]">{stats.total}/{stats.target}</span>
            </div>
            <Progress value={(stats.total / stats.target) * 100} className="h-1" />
          </div>

          <div className="grid grid-cols-3 gap-1">
            <Button size="sm" variant="outline" className="text-xs" onClick={handleExportCsv}>
              CSV
            </Button>
            <Button size="sm" variant="outline" className="text-xs" onClick={handleExportBib}>
              BIB
            </Button>
            <Button size="sm" variant="outline" className="text-xs" onClick={handleExportRis}>
              RIS
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-xs text-[#5B667A]">正在收集引用来源...</div>
      )}
    </div>
  );
};

// 时间线与审计卡片
const TimelineCard: React.FC = () => {
  const { state: deliverables } = useResult();
  const state = deliverables.timeline.state;
  const events = deliverables.timeline.events.length > 0 ? deliverables.timeline.events : [
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
          <span className="text-sm font-medium text-[#2A3241]">时间线与审计</span>
        </div>
        <Activity className="w-4 h-4 text-[#5B667A]" />
      </div>
      
      {state === 'ready' ? (
        <div className="space-y-3">
          <div className="space-y-1.5">
            {events.slice(0, 3).map((event, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div className={`w-1.5 h-1.5 rounded-full ${event.actor === 'user' ? 'bg-green-500' : 'bg-blue-500'}`} />
                <span className="text-[#2A3241]">{event.label}</span>
                <span className="text-[#5B667A] ml-auto">{event.timestamp}</span>
              </div>
            ))}
          </div>
          <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleExportAudit}>
            <Download className="w-3 h-3 mr-1.5" />
            导出 JSON
          </Button>
        </div>
      ) : (
        <div className="text-xs text-[#5B667A]">记录操作时间线</div>
      )}
    </div>
  );
};

// 面谈速读卡片
const VivaCard: React.FC = () => {
  const { state: deliverables, generateDeliverable } = useResult();
  const state = deliverables.viva.state;
  
  const handleGenerate = () => {
    generateDeliverable('viva');
    toast.success('开始生成面谈速读卡');
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 animate-in fade-in slide-in-from-right-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StateIndicator state={state} />
          <span className="text-sm font-medium text-[#2A3241]">面谈速读卡</span>
        </div>
        <Users className="w-4 h-4 text-[#5B667A]" />
      </div>
      
      {state === 'ready' ? (
        <div className="space-y-3">
          <div className="text-xs text-[#5B667A]">
            老师口头核验要点总结
          </div>
          <Button size="sm" className="w-full text-xs bg-[#6E5BFF] hover:brightness-105" onClick={handleGenerate}>
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
const AssetsCard: React.FC = () => {
  const { state: deliverables, generateDeliverable } = useResult();
  const state = deliverables.assets.state;
  const assets = deliverables.assets.items;

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
          <span className="text-sm font-medium text-[#2A3241]">图表与素材</span>
        </div>
        <Image className="w-4 h-4 text-[#5B667A]" />
      </div>
      
      {state === 'ready' ? (
        <div className="space-y-3">
          <div className="text-xs text-[#5B667A]">
            {assets.length} 个素材文件
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="aspect-square bg-slate-100 rounded border flex items-center justify-center">
              <BarChart className="w-4 h-4 text-[#5B667A]" />
            </div>
            <div className="aspect-square bg-slate-100 rounded border flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#5B667A]" />
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleExportAssets}>
            <Package className="w-3 h-3 mr-1.5" />
            打包下载
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-[#5B667A]">收集图表素材</div>
          <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleGenerate}>
            <Play className="w-3 h-3 mr-1.5" />
            生成素材包
          </Button>
        </div>
      )}
    </div>
  );
};

// 只读链接分享卡片
const ShareLinkCard: React.FC = () => {
  const { state: deliverables, generateDeliverable } = useResult();
  const state = deliverables.share.state;

  const handleGenerate = () => {
    generateDeliverable('share');
    toast.success('生成只读链接');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://example.com/shared/abc123');
    toast.success('链接已复制到剪贴板');
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 animate-in fade-in slide-in-from-right-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StateIndicator state={state} />
          <span className="text-sm font-medium text-[#2A3241]">只读链接</span>
        </div>
        <Share2 className="w-4 h-4 text-[#5B667A]" />
      </div>
      
      {state === 'ready' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-center p-2 bg-slate-50 rounded">
            <QrCode className="w-12 h-12 text-[#5B667A]" />
          </div>
          <div className="text-xs text-[#5B667A] text-center">
            有效期：30天
          </div>
          <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleCopyLink}>
            <Copy className="w-3 h-3 mr-1.5" />
            复制链接
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleGenerate}>
          <Share2 className="w-3 h-3 mr-1.5" />
          生成链接
        </Button>
      )}
    </div>
  );
};

// 交付物卡片组
const DeliverablesDeck: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <BundleCard />
      <QualityCard />
      <ProcessSummaryCard />
      <ReferencesCard />
      <TimelineCard />
      <VivaCard />
      <AssetsCard />
      <ShareLinkCard />
    </div>
  );
};

// 命令输入卡片
const CommandInputCard: React.FC = () => {
  const [command, setCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const exampleCommands = [
    '优化引用格式为APA',
    '添加图表说明',
    '调整段落结构',
    '检查语法错误'
  ];

  const handleSubmit = () => {
    if (!command.trim()) return;
    setIsLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setIsLoading(false);
      toast.success('命令已提交');
      setCommand('');
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-[#6E5BFF]" />
        <span className="text-sm font-medium text-[#2A3241]">命令输入</span>
      </div>
      
      <Textarea
        placeholder="描述您想要的修改..."
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        className="min-h-20 resize-none"
      />
      
      <div className="flex flex-wrap gap-1">
        {exampleCommands.map((example, idx) => (
          <button
            key={idx}
            onClick={() => setCommand(example)}
            className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-[#5B667A] transition-colors"
          >
            {example}
          </button>
        ))}
      </div>
      
      <Button 
        onClick={handleSubmit} 
        disabled={!command.trim() || isLoading}
        className="w-full bg-[#6E5BFF] text-white rounded-full hover:brightness-105"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            解析中...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            执行命令
          </>
        )}
      </Button>
    </div>
  );
};

// 计划预览卡片
const PlanPreviewCard: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false);

  const mockPlan = {
    steps: [
      { type: 'structure', description: '调整章节结构' },
      { type: 'format', description: '格式化引用' },
      { type: 'content', description: '优化段落表述' }
    ],
    estimatedTime: '2分钟'
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#6E5BFF]" />
          <span className="text-sm font-medium text-[#2A3241]">计划预览</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs"
        >
          {showPreview ? '隐藏' : '显示'}
        </Button>
      </div>
      
      {showPreview && (
        <div className="space-y-3">
          <div className="text-xs text-[#5B667A]">预计用时: {mockPlan.estimatedTime}</div>
          <div className="space-y-2">
            {mockPlan.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2 bg-slate-50 rounded">
                <div className="flex items-center justify-center w-6 h-6 bg-slate-200 rounded-full flex-shrink-0">
                  <span className="text-xs font-medium text-[#5B667A]">{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {step.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#2A3241]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full bg-[#6E5BFF] text-white rounded-full hover:brightness-105">
            <CheckCircle className="w-4 h-4 mr-2" />
            应用修改
          </Button>
        </div>
      )}
    </div>
  );
};

// 常用配方卡片
const RecipeCard: React.FC = () => {
  const recipes = [
    '格式化引用',
    '优化语言',
    '结构调整',
    '添加图表'
  ];

  const handleSaveRecipe = () => {
    toast.success('配方已保存');
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#6E5BFF]" />
          <span className="text-sm font-medium text-[#2A3241]">常用配方</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSaveRecipe} className="text-xs">
          保存
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {recipes.map((recipe, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={() => toast.info(`应用配方: ${recipe}`)}
          >
            {recipe}
          </Button>
        ))}
      </div>
    </div>
  );
};

// AI助手卡片组
const AssistantDeck: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <CommandInputCard />
      <PlanPreviewCard />
      <RecipeCard />
    </div>
  );
};

// 审计事件流卡片
const AuditDeck: React.FC = () => {
  const { state: deliverables } = useResult();
  const events = deliverables.timeline.events;

  const allEvents = events.length > 0 ? events : [
    { label: '开始写作会话', timestamp: '14:30', actor: 'user' as const },
    { label: '插入引用 [Smith, 2023]', timestamp: '14:45', actor: 'agent' as const },
    { label: '调整段落结构', timestamp: '15:05', actor: 'agent' as const },
    { label: '格式化引用列表', timestamp: '15:20', actor: 'agent' as const },
    { label: '用户手工编辑', timestamp: '15:35', actor: 'user' as const },
    { label: '导出PDF版本', timestamp: '16:00', actor: 'user' as const },
    { label: '生成质量报告', timestamp: '16:15', actor: 'agent' as const },
    { label: '完成写作流程', timestamp: '16:45', actor: 'user' as const }
  ];

  const handleExportAudit = () => {
    toast.success('审计记录导出已开始');
  };

  const handleUndo = (eventId: number) => {
    toast.info(`撤销操作 #${eventId}`);
  };

  return (
    <div className="bg-white rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#6E5BFF]" />
          <span className="text-sm font-medium text-[#2A3241]">事件流</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportAudit} className="text-xs">
          <Download className="w-3 h-3 mr-1" />
          导出
        </Button>
      </div>
      
      <div className="relative">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-200"></div>
        <div className="space-y-3">
          {allEvents.map((event, idx) => (
            <div key={idx} className="relative flex items-start gap-3">
              <div className={`relative z-10 w-4 h-4 rounded-full border-2 border-white ${
                event.actor === 'user' ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#2A3241] truncate">{event.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5B667A]">{event.timestamp}</span>
                    {event.actor === 'agent' && idx < allEvents.length - 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUndo(idx)}
                        className="h-6 w-6 p-0"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-[#5B667A]">
                  {event.actor === 'user' ? '用户操作' : 'AI 助手'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// DeckTabs 主组件
const DeckTabs: React.FC = () => {
  return (
    <Tabs defaultValue="deliverables" className="space-y-4">
      <TabsList className="bg-white rounded-full p-1 w-full">
        <TabsTrigger value="deliverables" className="rounded-full flex-1">
          <Package className="w-4 h-4 mr-2" />
          交付物
        </TabsTrigger>
        <TabsTrigger value="assistant" className="rounded-full flex-1">
          <Zap className="w-4 h-4 mr-2" />
          AI 助手
        </TabsTrigger>
        <TabsTrigger value="audit" className="rounded-full flex-1">
          <Activity className="w-4 h-4 mr-2" />
          审计记录
        </TabsTrigger>
      </TabsList>

      <TabsContent value="deliverables">
        <DeliverablesDeck />
      </TabsContent>
      
      <TabsContent value="assistant">
        <AssistantDeck />
      </TabsContent>
      
      <TabsContent value="audit">
        <AuditDeck />
      </TabsContent>
    </Tabs>
  );
};

// 内部布局组件（使用 ResultProvider）
const ResultPageLayout: React.FC = () => {
  const { state: deliverables, setDeliverableState, updateRefsCount, addAuditEvent } = useResult();

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
    }, 4000);

    const timer2 = setTimeout(() => {
      setDeliverableState('quality', 'generating');
    }, 5000);

    const timer3 = setTimeout(() => {
      setDeliverableState('quality', 'ready');
      setDeliverableState('processPdf', 'ready');
      setDeliverableState('viva', 'ready');
      setDeliverableState('assets', 'ready');
      setDeliverableState('share', 'ready');
      setDeliverableState('bundle', 'ready');
      addAuditEvent({
        label: '所有交付物准备完成',
        timestamp: new Date().toLocaleTimeString(),
        actor: 'agent'
      });
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [setDeliverableState, updateRefsCount, addAuditEvent]);
  
  return (
    <div className="min-h-screen bg-[#F7F8FB]">
      <Helmet>
        <title>结果与交付 - 学术论文助手</title>
        <meta name="description" content="查看您的写作流程交付结果和完整文档" />
      </Helmet>
      
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 grid gap-6 xl:grid-cols-[minmax(720px,760px)_minmax(420px,520px)] lg:grid-cols-1">
        <ArticleCard />
        <DeckTabs />
      </div>
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