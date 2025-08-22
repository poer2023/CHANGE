import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Copy, RefreshCw, BookOpen, ExternalLink } from 'lucide-react';
import { Reference, CitationStyle } from '@/types/writing-flow';

interface ReferenceSectionProps {
  references: Reference[];
  citationStyle: CitationStyle;
  onStyleChange: (style: CitationStyle) => void;
}

const citationStyles: { value: CitationStyle; label: string }[] = [
  { value: 'APA', label: 'APA (7th Edition)' },
  { value: 'MLA', label: 'MLA (9th Edition)' },
  { value: 'Chicago', label: 'Chicago (17th Edition)' },
  { value: 'IEEE', label: 'IEEE' },
  { value: 'GB/T 7714', label: 'GB/T 7714 (国标)' }
];

const formatReference = (ref: Reference, style: CitationStyle): string => {
  const authors = ref.authors.join(', ');
  const year = ref.year ? ` (${ref.year})` : '';
  
  switch (style) {
    case 'APA':
      return `${authors}${year}. ${ref.title}. ${ref.venue || 'Unknown'}.${ref.doi ? ` https://doi.org/${ref.doi}` : ''}`;
    case 'MLA':
      return `${authors}. "${ref.title}." ${ref.venue || 'Unknown'}, ${ref.year || 'n.d.'}.${ref.url ? ` Web.` : ''}`;
    case 'Chicago':
      return `${authors}. "${ref.title}." ${ref.venue || 'Unknown'}${year ? `, ${ref.year}` : ''}.${ref.doi ? ` https://doi.org/${ref.doi}.` : ''}`;
    case 'IEEE':
      return `${authors}, "${ref.title}," ${ref.venue || 'Unknown'}${year ? `, ${ref.year}` : ''}.${ref.doi ? ` doi: ${ref.doi}` : ''}`;
    case 'GB/T 7714':
      return `${authors}. ${ref.title}[J]. ${ref.venue || 'Unknown'}${year ? `, ${ref.year}` : ''}.${ref.doi ? ` DOI: ${ref.doi}` : ''}`;
    default:
      return `${authors}${year}. ${ref.title}. ${ref.venue || 'Unknown'}.`;
  }
};

const ReferencesSection: React.FC<ReferenceSectionProps> = ({
  references,
  citationStyle,
  onStyleChange
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopyReferences = async () => {
    const formattedRefs = references
      .map((ref, index) => `${index + 1}. ${formatReference(ref, citationStyle)}`)
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(formattedRefs);
      toast({
        title: "已复制到剪贴板",
        description: `已复制 ${references.length} 条参考文献`,
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板，请手动选择文本复制",
        variant: "destructive"
      });
    }
  };

  const handleRefreshNumbers = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "编号已更新",
        description: "参考文献编号已重新排序"
      });
    }, 1000);
  };

  if (references.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-2xl border border-[#EEF0F4] p-6 md:p-8" style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-[#6E5BFF]" />
          <h3 className="text-xl font-semibold text-[#2A3241]">参考文献</h3>
          <Badge variant="secondary" className="text-xs">
            {references.length} 条
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          {/* Citation Style Selector */}
          <Select value={citationStyle} onValueChange={onStyleChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {citationStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshNumbers}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            刷新编号
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyReferences}
          >
            <Copy className="h-4 w-4 mr-2" />
            复制全部
          </Button>
        </div>
      </div>

      {/* References List */}
      <div className="space-y-4">
        {references.map((reference, index) => (
          <div 
            key={reference.id} 
            className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors group"
          >
            <div className="flex items-start gap-4">
              {/* Reference Number */}
              <div className="flex-shrink-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-[#5B667A]">
                {index + 1}
              </div>

              {/* Reference Content */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono text-[#2A3241] leading-relaxed mb-2">
                  {formatReference(reference, citationStyle)}
                </div>
                
                {/* Reference Metadata */}
                <div className="flex items-center gap-4 text-xs text-[#5B667A]">
                  <span>作者: {reference.authors.join(', ')}</span>
                  {reference.year && <span>年份: {reference.year}</span>}
                  {reference.doi && (
                    <a 
                      href={`https://doi.org/${reference.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#6E5BFF] hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      DOI
                    </a>
                  )}
                </div>
              </div>

              {/* Copy Individual Reference */}
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(formatReference(reference, citationStyle));
                    toast({
                      title: "已复制",
                      description: "参考文献已复制到剪贴板"
                    });
                  } catch (error) {
                    toast({
                      title: "复制失败",
                      variant: "destructive"
                    });
                  }
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-[#5B667A]">
          <div className="flex items-center gap-4">
            <span>引用格式: {citationStyles.find(s => s.value === citationStyle)?.label}</span>
            <span>共 {references.length} 条文献</span>
          </div>
          <div className="text-xs">
            点击右上角按钮可复制全部引用或刷新编号顺序
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReferencesSection;