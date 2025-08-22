import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Save, Check, FileText, Clock, CheckCircle, AlertCircle, Edit3, Plus, Trash2, ChevronUp, ChevronDown, Copy, MoreVertical, BookOpen, MessageSquare, Lightbulb, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useWritingFlow } from '@/contexts/WritingFlowContext';
import { toast } from 'sonner';

// 数据模型
type CitationStyle = 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'GBT';

type Citation = {
  id: string;
  index: number;
  label: string;
  refId: string;
};

type Section = {
  id: string;
  level: 2 | 3;
  title: string;
  html: string;
  state: 'queued' | 'generating' | 'done' | 'error';
  citations: Citation[];
  expectedCitations?: number;
};

type Reference = {
  id: string;
  title: string;
  authors: string[];
  year?: number;
  venue?: string;
  doi?: string;
  url?: string;
};

type DocumentData = {
  docTitle: string;
  createdAt: string;
  style: CitationStyle;
  sections: Section[];
  references: Reference[];
};

// 工具函数
const generateDocumentTitle = (topic: any): string => {
  return topic?.title || '未命名文档';
};

const formatCitation = (ref: Reference, style: CitationStyle, index: number): string => {
  const authors = ref.authors.join(', ');
  const year = ref.year || '无日期';
  
  switch (style) {
    case 'APA':
      return `${authors} (${year}). ${ref.title}. ${ref.venue || ''}`;
    case 'MLA':
      return `${authors}. "${ref.title}." ${ref.venue || ''}, ${year}.`;
    case 'Chicago':
      return `${authors}. "${ref.title}." ${ref.venue || ''} (${year}).`;
    case 'IEEE':
      return `[${index}] ${authors}, "${ref.title}," ${ref.venue || ''}, ${year}.`;
    case 'GBT':
      return `[${index}] ${authors}. ${ref.title}[J]. ${ref.venue || ''}, ${year}.`;
    default:
      return `${authors} (${year}). ${ref.title}.`;
  }
};

// 流式生成函数
const streamSections = async (
  sections: Section[],
  onSectionUpdate: (section: Section) => void,
  onComplete: () => void
) => {
  const queuedSections = sections.filter(s => s.state === 'queued');
  
  for (const section of queuedSections) {
    onSectionUpdate({ ...section, state: 'generating' });
    
    const mockContent = `
      <p>这是${section.title}部分的开始内容。本节将详细探讨相关主题和核心概念。</p>
      <p>通过深入分析现有研究，我们可以发现几个关键要点。首先，当前的理论框架为我们提供了坚实的基础。</p>
      <p>其次，实证研究表明了这些理论在实际应用中的有效性。这些发现对于我们理解整个领域的发展趋势具有重要意义。</p>
      <p>最后，我们需要考虑这些研究成果对未来发展的启示。通过综合分析，我们可以为后续研究提供有价值的方向建议。</p>
    `;
    
    const sentences = mockContent.split('。').filter(s => s.trim());
    let currentContent = '';
    
    for (let i = 0; i < sentences.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      currentContent += sentences[i] + (i < sentences.length - 1 ? '。' : '');
      
      onSectionUpdate({
        ...section,
        state: 'generating',
        html: currentContent
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    onSectionUpdate({
      ...section,
      state: 'done',
      html: currentContent,
      citations: section.expectedCitations ? 
        Array.from({ length: Math.min(section.expectedCitations, 2) }, (_, i) => ({
          id: `citation-${section.id}-${i}`,
          index: i + 1,
          label: `[${i + 1}]`,
          refId: sections[0]?.id || 'ref-1'
        })) : []
    });
  }
  
  onComplete();
};

// 本地存储 hook
const useLocalStorage = <T,>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prevValue => {
      const valueToStore = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prevValue)
        : newValue;
      
      try {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
      
      return valueToStore;
    });
  }, [key]);

  return [value, setStoredValue] as const;
};

// 文档头部组件
const DocumentHeader: React.FC<{
  title: string;
  docType: string;
  createdAt: string;
  style: CitationStyle;
  status: 'queued' | 'generating' | 'completed';
}> = ({ title, docType, createdAt, style, status }) => (
  <Card className="rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-6 md:p-8">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {docType}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {new Date(createdAt).toLocaleDateString()}
          </div>
          <Badge variant="secondary" className="bg-slate-100 text-slate-700">
            {style}
          </Badge>
        </div>
      </div>
      <Badge 
        variant="secondary"
        className={
          status === 'completed' ? 'bg-green-100 text-green-700' :
          status === 'generating' ? 'bg-blue-100 text-blue-700' :
          'bg-orange-100 text-orange-700'
        }
      >
        {status === 'completed' ? (
          <>
            <CheckCircle className="w-3 h-3 mr-1" />
            已完成
          </>
        ) : status === 'generating' ? (
          <>
            <AlertCircle className="w-3 h-3 mr-1 animate-pulse" />
            生成中
          </>
        ) : (
          <>
            <Clock className="w-3 h-3 mr-1" />
            排队中
          </>
        )}
      </Badge>
    </div>
  </Card>
);

// 段落组件
const SectionBlock: React.FC<{
  section: Section;
  index: number;
  isActive: boolean;
  references: Reference[];
  onUpdate: (updates: Partial<Section>) => void;
  onEdit: () => void;
  onAction: (action: string) => void;
  onMove: (direction: 'up' | 'down') => void;
}> = ({ section, index, isActive, references, onUpdate, onEdit, onAction, onMove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const handleEdit = () => {
    setEditContent(section.html.replace(/<[^>]*>/g, ''));
    setIsEditing(true);
    onEdit();
  };

  const handleSave = () => {
    if (editContent.trim()) {
      onUpdate({ html: `<p>${editContent.replace(/\n/g, '</p><p>')}</p>` });
      setIsEditing(false);
      
      // 3秒高亮效果
      setTimeout(() => {
        const element = document.querySelector(`[data-section-id="${section.id}"]`);
        if (element) {
          element.classList.add('bg-yellow-50');
          setTimeout(() => element.classList.remove('bg-yellow-50'), 3000);
        }
      }, 100);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent('');
  };

  return (
    <div
      data-section-id={section.id}
      className={`transition-all duration-200 ${
        isActive ? 'ring-2 ring-[#6E5BFF]/20 rounded-lg p-4 -m-4' : ''
      }`}
    >
      {/* 段落标题 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-bold text-slate-900 ${
          section.level === 2 ? 'text-xl' : 'text-lg'
        }`}>
          {index + 1}. {section.title}
        </h2>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200">
            {section.citations.length}/{section.expectedCitations || 0}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAction('agent-edit')}>
                <Zap className="w-4 h-4 mr-2 text-[#6E5BFF]" />
                用 Agent 改本段
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('rewrite')}>
                重写
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('expand')}>
                扩写
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('cite')}>
                插入引用
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit3 className="w-4 h-4 mr-2" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove('up')}>
                <ChevronUp className="w-4 h-4 mr-2" />
                上移
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove('down')}>
                <ChevronDown className="w-4 h-4 mr-2" />
                下移
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onAction('delete')}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 段落内容 */}
      <div className="prose prose-slate max-w-none">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[120px] resize-none"
              placeholder="编辑段落内容..."
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleSave}
                className="rounded-full bg-[#6E5BFF] hover:brightness-105 focus:ring-2 focus:ring-offset-2 focus:ring-[#6E5BFF]"
              >
                保存
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleCancel}
                className="rounded-full"
              >
                取消
              </Button>
            </div>
          </div>
        ) : section.state === 'generating' ? (
          <div className="space-y-4">
            {section.html && (
              <div dangerouslySetInnerHTML={{ __html: section.html }} />
            )}
            <div className="flex items-center gap-2 text-sm text-slate-500 animate-pulse">
              <div className="w-2 h-2 bg-[#6E5BFF] rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-[#6E5BFF] rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-[#6E5BFF] rounded-full animate-bounce delay-200" />
              <span className="ml-2">正在生成中...</span>
            </div>
          </div>
        ) : section.state === 'queued' ? (
          <div className="py-8 text-center text-slate-400">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>等待生成...</p>
          </div>
        ) : section.state === 'error' ? (
          <div className="py-8 text-center text-red-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>生成失败，请重试</p>
          </div>
        ) : (
          <div>
            <div dangerouslySetInnerHTML={{ __html: section.html || '<p>暂无内容</p>' }} />
            {/* 文中引用 */}
            {section.citations.map(citation => (
              <Popover key={citation.id}>
                <PopoverTrigger asChild>
                  <sup className="cursor-pointer text-[#6E5BFF] hover:underline ml-1">
                    {citation.label}
                  </sup>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  {(() => {
                    const ref = references.find(r => r.id === citation.refId);
                    return ref ? (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">{ref.title}</h4>
                        <p className="text-sm text-slate-600">
                          {ref.authors.join(', ')} ({ref.year || '无日期'})
                        </p>
                        <p className="text-xs text-slate-500">{ref.venue}</p>
                        <Button variant="outline" size="sm" className="text-xs">
                          在研究库中查看
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">引用信息未找到</p>
                    );
                  })()}
                </PopoverContent>
              </Popover>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 内容画布组件
const ContentCanvas: React.FC<{
  sections: Section[];
  activeSectionId: string;
  references: Reference[];
  onSectionUpdate: (sectionId: string, updates: Partial<Section>) => void;
  onSectionAction: (sectionId: string, action: string) => void;
  onSectionMove: (sectionId: string, direction: 'up' | 'down') => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}> = ({ sections, activeSectionId, references, onSectionUpdate, onSectionAction, onSectionMove, canvasRef }) => (
  <Card className="rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
    <div 
      ref={canvasRef}
      className="max-h-[calc(100vh-12rem)] overflow-auto p-6 md:p-8 pb-20 space-y-8"
    >
      {sections.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>正在从大纲生成内容结构...</p>
        </div>
      ) : (
        sections.map((section, index) => (
          <SectionBlock
            key={section.id}
            section={section}
            index={index}
            isActive={activeSectionId === section.id}
            references={references}
            onUpdate={(updates) => onSectionUpdate(section.id, updates)}
            onEdit={() => {}}
            onAction={(action) => onSectionAction(section.id, action)}
            onMove={(direction) => onSectionMove(section.id, direction)}
          />
        ))
      )}
    </div>
  </Card>
);

// 参考文献组件
const ReferencesSection: React.FC<{
  references: Reference[];
  citationStyle: CitationStyle;
  onStyleChange: (style: CitationStyle) => void;
}> = ({ references, citationStyle, onStyleChange }) => {
  if (references.length === 0) return null;

  const copyAllReferences = (style: CitationStyle) => {
    const allCitations = references.map((ref, index) => 
      formatCitation(ref, style, index + 1)
    ).join('\n');
    navigator.clipboard.writeText(allCitations);
    toast.success(`已复制${style}格式引用`);
  };

  const copyReference = (ref: Reference, style: CitationStyle, index: number) => {
    const citation = formatCitation(ref, style, index);
    navigator.clipboard.writeText(citation);
    toast.success('引用已复制到剪贴板');
  };

  return (
    <Card className="rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">参考文献</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full">
            刷新编号
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full">
                复制格式 ({citationStyle})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {(['APA', 'MLA', 'Chicago', 'IEEE', 'GBT'] as CitationStyle[]).map(style => (
                <DropdownMenuItem 
                  key={style}
                  onClick={() => copyAllReferences(style)}
                >
                  {style}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="space-y-3">
        {references.map((ref, index) => (
          <div key={ref.id} className="group flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
            <span className="text-xs text-slate-500 mt-1 min-w-[24px]">
              [{index + 1}]
            </span>
            <p className="flex-1 text-sm text-slate-700">
              {formatCitation(ref, citationStyle, index + 1)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyReference(ref, citationStyle, index + 1)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

// 底部操作条组件
const ActionBar: React.FC<{
  onBackToOutline: () => void;
  onSave: () => void;
  onContinue: () => void;
}> = ({ onBackToOutline, onSave, onContinue }) => (
  <div className="sticky bottom-0 z-30 bg-white border-t border-[#EEF0F4] rounded-b-2xl p-4 mt-6">
    <div className="flex items-center justify-between h-14">
      <Button
        variant="outline"
        onClick={onBackToOutline}
        className="flex items-center gap-2 rounded-full"
      >
        <ArrowLeft className="w-4 h-4" />
        返回大纲
      </Button>
      
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onSave}
          className="flex items-center gap-2 rounded-full"
        >
          <Save className="w-4 h-4" />
          保存草稿
        </Button>
        
        <Button
          onClick={onContinue}
          className="bg-[#6E5BFF] hover:brightness-105 focus:ring-2 focus:ring-offset-2 focus:ring-[#6E5BFF] flex items-center gap-2 rounded-full"
        >
          <Check className="w-4 h-4" />
          通过/继续
        </Button>
      </div>
    </div>
  </div>
);

// AI助手面板组件
const AssistantPanel: React.FC<{
  onCommand: (command: string) => void;
}> = ({ onCommand }) => (
  <div className="space-y-4">
    <h4 className="font-medium text-slate-900 mb-3">快捷命令</h4>
    <div className="grid gap-2">
      <Button variant="outline" size="sm" className="justify-start rounded-full" onClick={() => onCommand('rewrite')}>
        <Lightbulb className="w-4 h-4 mr-2" />
        重写当前段
      </Button>
      <Button variant="outline" size="sm" className="justify-start rounded-full" onClick={() => onCommand('expand')}>
        <Plus className="w-4 h-4 mr-2" />
        扩写下一段
      </Button>
      <Button variant="outline" size="sm" className="justify-start rounded-full" onClick={() => onCommand('cite')}>
        <BookOpen className="w-4 h-4 mr-2" />
        插入引用
      </Button>
      <Button variant="outline" size="sm" className="justify-start rounded-full" onClick={() => onCommand('chart')}>
        生成图表说明
      </Button>
      <Button variant="outline" size="sm" className="justify-start rounded-full" onClick={() => onCommand('summary')}>
        生成摘要
      </Button>
    </div>
    
    <div className="pt-4 border-t border-slate-100">
      <h5 className="text-sm font-medium text-slate-700 mb-2">AI 对话</h5>
      <div className="space-y-2">
        <Textarea 
          placeholder="向AI助手提问或描述需求..."
          className="min-h-[80px] resize-none"
        />
        <Button size="sm" className="w-full bg-[#6E5BFF] hover:brightness-105 rounded-full">
          <MessageSquare className="w-4 h-4 mr-2" />
          发送
        </Button>
      </div>
    </div>
  </div>
);

// 大纲面板组件
const OutlinePanel: React.FC<{
  sections: Section[];
  activeSectionId: string;
  onSectionClick: (sectionId: string) => void;
}> = ({ sections, activeSectionId, onSectionClick }) => (
  <div>
    <h4 className="font-medium text-slate-900 mb-3">文档大纲</h4>
    <div className="space-y-1">
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => onSectionClick(section.id)}
          className={`w-full text-left p-2 rounded text-sm transition-colors ${
            activeSectionId === section.id 
              ? 'bg-[#6E5BFF]/10 text-[#6E5BFF] font-medium' 
              : 'text-slate-600 hover:bg-slate-50'
          } ${section.level === 3 ? 'ml-4' : ''}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {index + 1}
            </span>
            <span className="flex-1 truncate">
              {section.title}
            </span>
            <div className={`w-2 h-2 rounded-full ${
              section.state === 'done' ? 'bg-green-400' :
              section.state === 'generating' ? 'bg-blue-400 animate-pulse' :
              section.state === 'error' ? 'bg-red-400' :
              'bg-slate-300'
            }`} />
          </div>
        </button>
      ))}
    </div>
  </div>
);

// 主组件
const ContentStep: React.FC = () => {
  const { project, updateContent, setCurrentStep } = useWritingFlow();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // 状态管理
  const [documentData, setDocumentData] = useLocalStorage<DocumentData>('writing-flow:content', {
    docTitle: project.topic?.title || generateDocumentTitle(project.topic),
    createdAt: new Date().toISOString(),
    style: (project.topic?.citationStyle as CitationStyle) || 'APA',
    sections: [],
    references: project.sources?.map(source => ({
      id: source.id,
      title: source.title,
      authors: source.authors || ['未知作者'],
      year: source.year,
      venue: source.publisher,
      doi: source.doi,
      url: source.url
    })) || []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  // 初始化：从大纲生成段落
  useEffect(() => {
    if (documentData.sections.length === 0 && project.outline && project.outline.length > 0) {
      const sectionsFromOutline: Section[] = project.outline.map((node, index) => ({
        id: `section-${node.id}`,
        level: node.parentId ? 3 : 2,
        title: node.title,
        html: '',
        state: 'queued',
        citations: [],
        expectedCitations: Math.max(1, Math.floor((node.expectedWords || 300) / 200))
      }));
      
      setDocumentData(prev => ({ ...prev, sections: sectionsFromOutline }));
    }
  }, [project.outline, documentData.sections.length, setDocumentData]);

  // 自动开始生成
  const handleStartGeneration = useCallback(async () => {
    if (isGenerating) return;
    
    const queuedSections = documentData.sections.filter(s => s.state === 'queued');
    if (queuedSections.length === 0) return;

    setIsGenerating(true);
    
    await streamSections(
      documentData.sections,
      (updatedSection) => {
        setDocumentData(prev => ({
          ...prev,
          sections: prev.sections.map(section =>
            section.id === updatedSection.id ? updatedSection : section
          )
        }));
        
        // 自动滚动到生成中的段落
        if (updatedSection.state === 'generating') {
          const element = canvasRef.current?.querySelector(`[data-section-id="${updatedSection.id}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      },
      () => {
        setIsGenerating(false);
        toast.success('文档生成完成');
      }
    );
  }, [isGenerating, documentData.sections, setDocumentData]);

  // 自动启动生成
  useEffect(() => {
    const queuedSections = documentData.sections.filter(s => s.state === 'queued');
    if (queuedSections.length > 0 && !isGenerating) {
      const timer = setTimeout(() => handleStartGeneration(), 1000);
      return () => clearTimeout(timer);
    }
  }, [documentData.sections, isGenerating, handleStartGeneration]);

  // 可视区域监听
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find(entry => entry.isIntersecting);
        if (visibleEntry) {
          setActiveSectionId(visibleEntry.target.getAttribute('data-section-id') || '');
        }
      },
      { threshold: 0.3, rootMargin: '-100px 0px' }
    );

    const sectionElements = canvasRef.current?.querySelectorAll('[data-section-id]');
    sectionElements?.forEach(element => observer.observe(element));

    return () => observer.disconnect();
  }, [documentData.sections]);

  // 自动保存
  useEffect(() => {
    const timer = setTimeout(() => {
      const content = documentData.sections.map(s => s.html).join('\n\n');
      const wordCount = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
      
      updateContent({
        title: documentData.docTitle,
        body: content,
        wordCount,
        citations: documentData.sections.flatMap(s => s.citations),
        lastModified: new Date(),
        version: 1
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [documentData, updateContent]);

  // TODO: 注册右侧面板内容 (需要上下文支持)
  // useEffect(() => {
  //   setRightPanel?.({
  //     tabs: [
  //       { id: 'assistant', label: 'AI 助手', element: <AssistantPanel onCommand={handleCommand} /> },
  //       { id: 'outline', label: '文档大纲', element: <OutlinePanel sections={documentData.sections} activeSectionId={activeSectionId} onSectionClick={scrollToSection} /> },
  //     ],
  //     floatingOutlineButton: true
  //   });
  //   return () => setRightPanel?.(null);
  // }, [documentData.sections, activeSectionId]);

  // 滚动到指定段落
  const scrollToSection = (sectionId: string) => {
    const element = canvasRef.current?.querySelector(`[data-section-id="${sectionId}"]`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // 段落更新
  const handleSectionUpdate = (sectionId: string, updates: Partial<Section>) => {
    setDocumentData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  // 段落操作
  const handleSectionAction = (sectionId: string, action: string) => {
    switch (action) {
      case 'agent-edit':
        // 切换到右侧 AI 助手面板并设置作用域为当前段落
        const section = documentData.sections.find(s => s.id === sectionId);
        if (section) {
          // 触发右侧面板切换到 Agent 并设置作用域
          window.dispatchEvent(new CustomEvent('openAgentForSection', {
            detail: {
              sectionId,
              sectionTitle: section.title,
              sectionContent: section.html
            }
          }));
          toast.success(`已打开 Agent 面板，作用域：${section.title}`);
        }
        break;
      case 'rewrite':
        setDocumentData(prev => ({
          ...prev,
          sections: prev.sections.map(section =>
            section.id === sectionId ? { ...section, state: 'queued', html: '' } : section
          )
        }));
        break;
      case 'expand':
        toast.info('扩写功能开发中...');
        break;
      case 'cite':
        toast.info('插入引用功能开发中...');
        break;
      case 'delete':
        setDocumentData(prev => ({
          ...prev,
          sections: prev.sections.filter(section => section.id !== sectionId)
        }));
        break;
      default:
        toast.info(`${action}功能开发中...`);
    }
  };

  // 段落移动
  const handleSectionMove = (sectionId: string, direction: 'up' | 'down') => {
    setDocumentData(prev => {
      const sections = [...prev.sections];
      const index = sections.findIndex(s => s.id === sectionId);
      
      if (direction === 'up' && index > 0) {
        [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
      } else if (direction === 'down' && index < sections.length - 1) {
        [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
      }
      
      return { ...prev, sections };
    });
  };

  // 保存草稿
  const saveDraft = () => {
    const content = documentData.sections.map(s => s.html).join('\n\n');
    updateContent({
      title: documentData.docTitle,
      body: content,
      wordCount: content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length,
      citations: documentData.sections.flatMap(s => s.citations),
      lastModified: new Date(),
      version: 1
    });
    toast.success('草稿已保存');
  };

  // 继续到下一步
  const handleContinue = () => {
    saveDraft();
    sessionStorage.setItem('writing-flow:content', JSON.stringify(documentData));
    toast.success('内容已保存，准备进入下一步');
  };

  // 返回大纲
  const backToOutline = () => {
    canvasRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    // 切换到右侧大纲Tab的逻辑需要上下文支持
  };

  // AI助手命令
  const handleCommand = (command: string) => {
    switch (command) {
      case 'rewrite':
        if (activeSectionId) {
          handleSectionAction(activeSectionId, 'rewrite');
        }
        break;
      case 'expand':
      case 'cite':
      case 'chart':
      case 'summary':
        toast.info(`${command}功能开发中...`);
        break;
    }
  };

  // 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === 'o' || e.key === 'O') {
        // 切换到大纲Tab - 需要上下文支持
      } else if (e.key === 'e' || e.key === 'E') {
        if (activeSectionId) {
          handleSectionAction(activeSectionId, 'edit');
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp' && activeSectionId) {
        e.preventDefault();
        handleSectionMove(activeSectionId, 'up');
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowDown' && activeSectionId) {
        e.preventDefault();
        handleSectionMove(activeSectionId, 'down');
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleStartGeneration();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSectionId, handleStartGeneration]);

  const documentStatus = isGenerating ? 'generating' : 
    documentData.sections.every(s => s.state === 'done') ? 'completed' : 'queued';

  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 space-y-6">
      <DocumentHeader
        title={documentData.docTitle}
        docType={project.topic?.assignmentType || '学术论文'}
        createdAt={documentData.createdAt}
        style={documentData.style}
        status={documentStatus}
      />
      
      <ContentCanvas
        sections={documentData.sections}
        activeSectionId={activeSectionId}
        references={documentData.references}
        onSectionUpdate={handleSectionUpdate}
        onSectionAction={handleSectionAction}
        onSectionMove={handleSectionMove}
        canvasRef={canvasRef}
      />
      
      <ReferencesSection
        references={documentData.references}
        citationStyle={documentData.style}
        onStyleChange={(style) => setDocumentData(prev => ({ ...prev, style }))}
      />
      
      <ActionBar
        onBackToOutline={backToOutline}
        onSave={saveDraft}
        onContinue={handleContinue}
      />
    </div>
  );
};

export default ContentStep;