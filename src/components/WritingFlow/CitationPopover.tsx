import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, BookOpen } from 'lucide-react';
import { Citation, Reference } from '@/types/writing-flow';

interface CitationPopoverProps {
  citation: Citation;
  reference?: Reference;
  children: React.ReactNode;
}

const CitationPopover: React.FC<CitationPopoverProps> = ({
  citation,
  reference,
  children
}) => {
  if (!reference) {
    return <>{children}</>;
  }

  const formatAuthors = (authors: string[]): string => {
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} 和 ${authors[1]}`;
    return `${authors[0]} 等`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          {/* Reference Header */}
          <div className="flex items-start gap-3 mb-3">
            <BookOpen className="h-4 w-4 text-[#6E5BFF] flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-[#2A3241] leading-tight">
                {reference.title}
              </h4>
              <p className="text-xs text-[#5B667A] mt-1">
                {formatAuthors(reference.authors)}
                {reference.year && ` (${reference.year})`}
              </p>
            </div>
          </div>

          {/* Reference Details */}
          <div className="space-y-2 mb-4">
            {reference.venue && (
              <div className="text-xs">
                <span className="font-medium text-[#5B667A]">来源: </span>
                <span className="text-[#2A3241]">{reference.venue}</span>
              </div>
            )}
            
            {reference.doi && (
              <div className="text-xs">
                <span className="font-medium text-[#5B667A]">DOI: </span>
                <span className="text-[#2A3241] font-mono">{reference.doi}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {citation.quotationType === 'direct' ? '直接引用' : '间接引用'}
              </Badge>
              {citation.pageNumber && (
                <Badge variant="secondary" className="text-xs">
                  第 {citation.pageNumber} 页
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[#6E5BFF] hover:text-[#6E5BFF] hover:bg-[#6E5BFF]/5"
            >
              在研究库中查看
            </Button>
            
            {(reference.url || reference.doi) && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => {
                  const link = reference.url || `https://doi.org/${reference.doi}`;
                  window.open(link, '_blank', 'noopener,noreferrer');
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                访问来源
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CitationPopover;