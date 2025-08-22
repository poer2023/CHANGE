import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, CheckCircle, AlertCircle, FileText, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWritingFlow } from '@/contexts/WritingFlowContext';
import { CitationStyle, Section, Reference } from '@/types/writing-flow';

// 复用 ContentStep 的数据结构
type DocumentData = {
  docTitle: string;
  createdAt: string;
  style: CitationStyle;
  sections: Section[];
  references: Reference[];
};

// 复用 ContentStep 的工具函数
const generateDocumentTitle = (topic: any): string => {
  return topic?.title || '交付结果文档';
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
    case 'GB/T 7714':
      return `[${index}] ${authors}. ${ref.title}[J]. ${ref.venue || ''}, ${year}.`;
    default:
      return `${authors} (${year}). ${ref.title}.`;
  }
};

// 流式生成函数（复用并优化）
const streamSections = async (
  sections: Section[],
  onSectionUpdate: (section: Section) => void,
  onComplete: () => void
) => {
  const queuedSections = sections.filter(s => s.state === 'queued');
  
  for (const section of queuedSections) {
    onSectionUpdate({ ...section, state: 'generating' });
    
    // 根据不同章节生成不同内容
    let mockContent = '';
    switch (section.title.toLowerCase()) {
      case '引言':
      case 'introduction':
        mockContent = `
          <p>本研究旨在深入探讨${section.title}相关的核心问题。通过系统性的分析方法，我们将为这一领域提供新的理论视角和实践指导。</p>
          <p>当前的研究背景表明，该领域存在诸多值得深入研究的问题。本文将通过严谨的学术方法，对这些问题进行全面的分析和讨论。</p>
          <p>本研究的主要贡献在于提供了一个新的理论框架，并通过实证分析验证了其有效性。这一框架不仅具有重要的理论价值，同时也具有显著的实践意义。</p>
        `;
        break;
      case '文献综述':
      case 'literature review':
        mockContent = `
          <p>通过对现有文献的系统性梳理，我们发现该研究领域在过去几年中取得了显著进展。主要的研究方向包括理论建构、实证研究和应用探索三个方面。</p>
          <p>在理论建构方面，学者们提出了多种不同的理论模型和分析框架。这些理论为后续的实证研究提供了重要的指导。</p>
          <p>实证研究方面，研究者们运用了定量和定性相结合的方法，对相关问题进行了深入的探讨。这些研究成果为我们的分析提供了坚实的基础。</p>
        `;
        break;
      case '研究方法':
      case 'methodology':
        mockContent = `
          <p>本研究采用了混合研究方法，结合了定量分析和定性研究的优势。研究设计遵循严格的学术规范，确保研究结果的可靠性和有效性。</p>
          <p>数据收集过程中，我们采用了多元化的数据来源，包括问卷调查、深度访谈和文献分析。这种多重数据收集方法有助于提高研究结果的准确性。</p>
          <p>在数据分析阶段，我们运用了先进的统计分析方法和质性分析技术，对收集到的数据进行了全面而深入的分析。</p>
        `;
        break;
      default:
        mockContent = `
          <p>这是${section.title}部分的内容。本节将详细探讨相关主题的核心概念和关键要素。</p>
          <p>通过深入分析现有研究，我们可以发现几个重要的发现。首先，当前的理论框架为我们提供了坚实的分析基础。</p>
          <p>其次，实证研究结果表明了这些理论在实际应用中的有效性。这些发现对于理解整个领域的发展趋势具有重要意义。</p>
          <p>最后，我们需要考虑这些研究成果对未来发展的启示。通过综合分析，我们可以为后续研究提供有价值的方向建议。</p>
        `;
    }
    
    const sentences = mockContent.split('。').filter(s => s.trim());
    let currentContent = '';
    
    // 模拟打字机效果
    for (let i = 0; i < sentences.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      currentContent += sentences[i] + (i < sentences.length - 1 ? '。' : '');
      
      onSectionUpdate({
        ...section,
        state: 'generating',
        html: currentContent
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 600));
    onSectionUpdate({
      ...section,
      state: 'done',
      html: currentContent,
      citations: section.expectedCitations ? 
        Array.from({ length: Math.min(section.expectedCitations, 3) }, (_, i) => ({
          id: `citation-${section.id}-${i}`,
          sourceId: `source-${i + 1}`,
          position: i * 100,
          pageNumber: `${Math.floor(Math.random() * 50) + 1}`,
          quotationType: 'indirect' as const,
          formattedText: `[${i + 1}]`
        })) : []
    });
  }
  
  onComplete();
};

// 文档头部组件（复用 ContentStep 的样式）
const DocumentHeader: React.FC<{
  title: string;
  docType: string;
  createdAt: string;
  style: CitationStyle;
  status: 'queued' | 'generating' | 'completed';
  wordCount?: number;
}> = ({ title, docType, createdAt, style, status, wordCount }) => (
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
          {wordCount && (
            <div className="flex items-center gap-1">
              <Bookmark className="w-4 h-4" />
              约 {wordCount} 字
            </div>
          )}
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
            生成完成
          </>
        ) : status === 'generating' ? (
          <>
            <AlertCircle className="w-3 h-3 mr-1 animate-pulse" />
            生成中
          </>
        ) : (
          <>
            <Clock className="w-3 h-3 mr-1" />
            准备中
          </>
        )}
      </Badge>
    </div>
  </Card>
);

// 段落组件（简化版，专注于展示）
const SectionBlock: React.FC<{
  section: Section;
  index: number;
  references: Reference[];
  citationStyle: CitationStyle;
}> = ({ section, index, references, citationStyle }) => (
  <div className="transition-all duration-200">
    {/* 段落标题 */}
    <h2 className={`font-bold text-slate-900 mb-4 ${
      section.level === 2 ? 'text-xl' : 'text-lg'
    }`}>
      {index + 1}. {section.title}
    </h2>

    {/* 段落内容 */}
    <div className="prose prose-slate max-w-none">
      {section.state === 'generating' ? (
        <div className="space-y-4">
          {section.html && (
            <div dangerouslySetInnerHTML={{ __html: section.html }} />
          )}
          <div className="flex items-center gap-2 text-sm text-slate-500 animate-pulse">
            <div className="w-2 h-2 bg-[#6E5BFF] rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-[#6E5BFF] rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-[#6E5BFF] rounded-full animate-bounce delay-200" />
            <span className="ml-2">正在生成内容...</span>
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
          {section.citations?.map(citation => {
            const ref = references.find(r => r.id === citation.sourceId);
            return (
              <sup key={citation.id} className="text-[#6E5BFF] ml-1">
                {citation.formattedText}
              </sup>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

// 主组件
const StreamingContentPanel: React.FC = () => {
  const { project } = useWritingFlow();
  const [documentData, setDocumentData] = useState<DocumentData>({
    docTitle: generateDocumentTitle(project.topic),
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
  const [generationComplete, setGenerationComplete] = useState(false);

  // 从大纲生成内容结构
  useEffect(() => {
    if (project.outline && project.outline.length > 0) {
      const sectionsFromOutline: Section[] = project.outline.map((node, index) => ({
        id: `section-${node.id}`,
        level: node.parentId ? 3 : 2,
        title: node.title,
        html: '',
        state: 'queued',
        citations: [],
        expectedCitations: Math.max(1, Math.floor((node.expectedWords || 300) / 200))
      }));
      
      // 如果没有大纲，使用默认结构
      const defaultSections: Section[] = sectionsFromOutline.length > 0 ? sectionsFromOutline : [
        { id: 'intro', level: 2, title: '引言', html: '', state: 'queued', citations: [], expectedCitations: 2 },
        { id: 'literature', level: 2, title: '文献综述', html: '', state: 'queued', citations: [], expectedCitations: 3 },
        { id: 'methodology', level: 2, title: '研究方法', html: '', state: 'queued', citations: [], expectedCitations: 2 },
        { id: 'results', level: 2, title: '研究结果', html: '', state: 'queued', citations: [], expectedCitations: 3 },
        { id: 'conclusion', level: 2, title: '结论', html: '', state: 'queued', citations: [], expectedCitations: 1 }
      ];
      
      setDocumentData(prev => ({ ...prev, sections: defaultSections }));
    }
  }, [project.outline]);

  // 自动开始生成
  const handleStartGeneration = useCallback(async () => {
    if (isGenerating || generationComplete) return;
    
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
      },
      () => {
        setIsGenerating(false);
        setGenerationComplete(true);
      }
    );
  }, [isGenerating, generationComplete, documentData.sections]);

  // 自动启动生成
  useEffect(() => {
    if (documentData.sections.length > 0 && !isGenerating && !generationComplete) {
      const timer = setTimeout(() => handleStartGeneration(), 1500);
      return () => clearTimeout(timer);
    }
  }, [documentData.sections, isGenerating, generationComplete, handleStartGeneration]);

  const documentStatus = generationComplete ? 'completed' : 
    isGenerating ? 'generating' : 'queued';

  const totalWordCount = documentData.sections.reduce((acc, section) => {
    const wordCount = section.html.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    return acc + (wordCount > 1 ? wordCount : 0);
  }, 0);

  return (
    <div className="space-y-6">
      <DocumentHeader
        title={documentData.docTitle}
        docType={project.topic?.assignmentType || '学术论文'}
        createdAt={documentData.createdAt}
        style={documentData.style}
        status={documentStatus}
        wordCount={totalWordCount > 0 ? totalWordCount : undefined}
      />
      
      <Card className="rounded-2xl border-[#EEF0F4] shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
        <div className="max-h-[calc(100vh-12rem)] overflow-auto p-6 md:p-8 pb-20 space-y-8">
          {documentData.sections.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>正在准备文档结构...</p>
            </div>
          ) : (
            documentData.sections.map((section, index) => (
              <SectionBlock
                key={section.id}
                section={section}
                index={index}
                references={documentData.references}
                citationStyle={documentData.style}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default StreamingContentPanel;