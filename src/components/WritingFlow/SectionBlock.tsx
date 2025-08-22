import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Edit3, 
  RotateCcw, 
  Plus, 
  Quote, 
  Split, 
  Merge, 
  ArrowUp, 
  ArrowDown, 
  Trash2,
  BookOpen,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Section, Citation, Reference } from '@/types/writing-flow';
import { cn } from '@/lib/utils';
import CitationRenderer from './CitationRenderer';

interface SectionBlockProps {
  section: Section;
  index: number;
  isVisible: boolean;
  references?: Reference[];
  onUpdate: (updates: Partial<Section>) => void;
  onScrollTo: () => void;
}

const SectionBlock: React.FC<SectionBlockProps> = ({ 
  section, 
  index, 
  isVisible, 
  references = [],
  onUpdate, 
  onScrollTo 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(section.html);
  const [showHighlight, setShowHighlight] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Update content when section changes
  useEffect(() => {
    setEditedContent(section.html);
  }, [section.html]);

  // Show highlight after updates
  useEffect(() => {
    if (showHighlight) {
      const timer = setTimeout(() => setShowHighlight(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showHighlight]);

  // Handle content edit
  const handleEditToggle = () => {
    if (isEditing) {
      onUpdate({ html: editedContent });
      setShowHighlight(true);
    }
    setIsEditing(!isEditing);
  };

  // Handle section actions
  const handleRewrite = () => {
    onUpdate({ state: 'generating' });
    // Simulate rewrite
    setTimeout(() => {
      onUpdate({ 
        html: section.html + ' [已重写]',
        state: 'done'
      });
      setShowHighlight(true);
    }, 2000);
  };

  const handleExpand = () => {
    onUpdate({ state: 'generating' });
    // Simulate expansion
    setTimeout(() => {
      onUpdate({ 
        html: section.html + '\\n\\n[扩写内容] 这里添加了更多详细的论述和分析...',
        state: 'done'
      });
      setShowHighlight(true);
    }, 2000);
  };

  const handleInsertCitation = () => {
    const newCitation: Citation = {
      id: `citation-${Date.now()}`,
      sourceId: `source-${Math.random()}`,
      position: section.html.length,
      quotationType: 'indirect',
      formattedText: '[新引用]'
    };
    onUpdate({ 
      citations: [...section.citations, newCitation],
      html: section.html + ` ${newCitation.formattedText}`
    });
    setShowHighlight(true);
  };

  // Get section status
  const getStatusIcon = () => {
    switch (section.state) {
      case 'queued':
        return <div className="w-2 h-2 rounded-full bg-gray-400" />;
      case 'generating':
        return <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />;
      case 'done':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
    }
  };

  // Check citation status
  const citationStatus = section.expectedCitations 
    ? section.citations.length >= section.expectedCitations ? 'complete' : 'incomplete'
    : 'complete';

  return (
    <Card 
      data-section-id={section.id}
      className={cn(
        'rounded-2xl border border-[#EEF0F4] transition-all duration-300',
        isVisible && 'ring-2 ring-[#6E5BFF]/20',
        showHighlight && 'bg-yellow-50 border-yellow-200',
        'group'
      )}
      style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}
    >
      <div className="p-6 md:p-8">
        {/* Section Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#5B667A] bg-gray-100 px-2 py-1 rounded">
                {index + 1}
              </span>
              {getStatusIcon()}
            </div>
            <h2 className={cn(
              'font-semibold text-[#2A3241]',
              section.level === 2 ? 'text-xl' : 'text-lg'
            )}>
              {section.title}
            </h2>
          </div>

          {/* Tool Bar */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditToggle}
              className="h-8 w-8 p-0"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRewrite}
              disabled={section.state === 'generating'}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExpand}
              disabled={section.state === 'generating'}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleInsertCitation}
              className="h-8 w-8 p-0"
            >
              <Quote className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Section Content */}
        <div className="space-y-4">
          {section.state === 'generating' ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center gap-2 text-sm text-[#5B667A] mt-2">
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>正在生成中...</span>
              </div>
            </div>
          ) : (
            <div>
              {isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full min-h-[200px] p-4 border border-gray-200 rounded-lg resize-none text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#6E5BFF]/20"
                  placeholder="在此编辑段落内容..."
                />
              ) : (
                <div ref={contentRef}>
                  {section.html ? (
                    <CitationRenderer
                      html={section.html}
                      citations={section.citations}
                      references={references}
                    />
                  ) : (
                    <div className="prose max-w-none text-[#2A3241] leading-relaxed text-[#5B667A] italic">
                      等待生成内容...
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {/* Citation Status */}
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#5B667A]" />
              <span className="text-sm text-[#5B667A]">
                引用: {section.citations.length}
                {section.expectedCitations && (
                  <span>/{section.expectedCitations}</span>
                )}
              </span>
              {citationStatus === 'incomplete' && (
                <div className="w-2 h-2 rounded-full bg-red-500" />
              )}
            </div>
            
            {/* Word Count */}
            <div className="text-sm text-[#5B667A]">
              {section.html.replace(/<[^>]*>/g, '').split(/\\s+/).length} 词
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="text-xs"
              >
                取消
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditToggle}
              className="text-xs"
            >
              {isEditing ? '保存' : '编辑'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SectionBlock;