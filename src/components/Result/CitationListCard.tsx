import React, { useState } from 'react';
import { Copy, Download, RefreshCw, ExternalLink, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Source, CitationStyle } from '@/types/writing-flow';
import { toast } from 'sonner';

interface CitationListCardProps {
  sources: Source[];
  citationStyle: CitationStyle;
  className?: string;
}

// 格式化引用函数（复用 ContentStep 的逻辑）
const formatCitation = (source: Source, style: CitationStyle, index: number): string => {
  const authors = source.authors?.join(', ') || '未知作者';
  const year = source.year || '无日期';
  const title = source.title || '无标题';
  const venue = source.publisher || source.url || '';
  
  switch (style) {
    case 'APA':
      return `${authors} (${year}). ${title}. ${venue}`;
    case 'MLA':
      return `${authors}. "${title}." ${venue}, ${year}.`;
    case 'Chicago':
      return `${authors}. "${title}." ${venue} (${year}).`;
    case 'IEEE':
      return `[${index}] ${authors}, "${title}," ${venue}, ${year}.`;
    case 'GB/T 7714':
      return `[${index}] ${authors}. ${title}[J]. ${venue}, ${year}.`;
    default:
      return `${authors} (${year}). ${title}. ${venue}`;
  }
};

const CitationListCard: React.FC<CitationListCardProps> = ({ 
  sources, 
  citationStyle, 
  className = '' 
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // 只显示已选中的文献
  const selectedSources = sources.filter(source => source.selected);
  
  // 复制单个引用
  const copyReference = async (source: Source, style: CitationStyle, index: number) => {
    try {
      const citation = formatCitation(source, style, index + 1);
      await navigator.clipboard.writeText(citation);
      setCopiedIndex(index);
      toast.success('引用已复制到剪贴板');
      
      // 2秒后清除复制状态
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error('复制失败，请重试');
    }
  };

  // 复制所有引用
  const copyAllReferences = async (style: CitationStyle) => {
    try {
      const allCitations = selectedSources.map((source, index) => 
        formatCitation(source, style, index + 1)
      ).join('\n\n');
      
      await navigator.clipboard.writeText(allCitations);
      toast.success(`已复制 ${selectedSources.length} 条 ${style} 格式引用`);
    } catch (error) {
      toast.error('复制失败，请重试');
    }
  };

  // 导出引用列表
  const exportReferences = async (format: 'txt' | 'bib' | 'ris') => {
    setIsExporting(true);
    
    try {
      let content = '';
      let filename = '';
      let mimeType = '';
      
      switch (format) {
        case 'txt':
          content = selectedSources.map((source, index) => 
            formatCitation(source, citationStyle, index + 1)
          ).join('\n\n');
          filename = `references_${citationStyle.toLowerCase()}.txt`;
          mimeType = 'text/plain';
          break;
          
        case 'bib':
          content = selectedSources.map((source, index) => {
            const id = source.id.replace(/[^a-zA-Z0-9]/g, '');
            const authors = source.authors?.join(' and ') || 'Unknown';
            return `@article{${id},
  title={${source.title}},
  author={${authors}},
  year={${source.year || 'n.d.'}},
  publisher={${source.publisher || ''}},
  doi={${source.doi || ''}},
  url={${source.url || ''}}
}`;
          }).join('\n\n');
          filename = 'references.bib';
          mimeType = 'text/plain';
          break;
          
        case 'ris':
          content = selectedSources.map(source => {
            return `TY  - JOUR
TI  - ${source.title}
AU  - ${source.authors?.join('\nAU  - ') || 'Unknown'}
PY  - ${source.year || ''}
PB  - ${source.publisher || ''}
DO  - ${source.doi || ''}
UR  - ${source.url || ''}
ER  - 

`;
          }).join('');
          filename = 'references.ris';
          mimeType = 'application/x-research-info-systems';
          break;
      }
      
      // 创建并下载文件
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`已导出 ${format.toUpperCase()} 格式文件`);
    } catch (error) {
      toast.error('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  // 获取引用类型统计
  const citationStats = {
    journals: selectedSources.filter(s => s.sourceType === 'papers').length,
    books: selectedSources.filter(s => s.sourceType === 'books').length,
    web: selectedSources.filter(s => s.sourceType === 'web').length,
    other: selectedSources.filter(s => !['papers', 'books', 'web'].includes(s.sourceType)).length
  };

  if (selectedSources.length === 0) {
    return (
      <Card className={`bg-card border rounded-2xl p-6 shadow-sm ${className}`}>
        <CardContent className="text-center py-8">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500 mb-2">暂无选中的参考文献</p>
          <p className="text-xs text-slate-400">请先在文献检索步骤中选择文献</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-card border rounded-2xl p-6 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">参考文献</CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {selectedSources.length} 篇
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 引用类型统计 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">期刊论文</div>
            <div className="text-lg font-semibold text-gray-900">{citationStats.journals}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">图书</div>
            <div className="text-lg font-semibold text-gray-900">{citationStats.books}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">网页</div>
            <div className="text-lg font-semibold text-gray-900">{citationStats.web}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">其他</div>
            <div className="text-lg font-semibold text-gray-900">{citationStats.other}</div>
          </div>
        </div>

        {/* 格式化引用列表 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">
              {citationStyle} 格式引用
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  复制格式
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {(['APA', 'MLA', 'Chicago', 'IEEE', 'GB/T 7714'] as CitationStyle[]).map(style => (
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
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {selectedSources.map((source, index) => (
              <div 
                key={source.id} 
                className="group flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-xs text-slate-500 mt-1 min-w-[20px] font-mono">
                  [{index + 1}]
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {formatCitation(source, citationStyle, index + 1)}
                  </p>
                  {source.doi && (
                    <div className="flex items-center gap-2 mt-2">
                      <a
                        href={`https://doi.org/${source.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        DOI: {source.doi}
                      </a>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyReference(source, citationStyle, index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
                  disabled={copiedIndex === index}
                >
                  {copiedIndex === index ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* 导出操作 */}
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 rounded-full text-xs"
              onClick={() => copyAllReferences(citationStyle)}
            >
              <Copy className="w-3 h-3 mr-1" />
              复制全部
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 rounded-full text-xs"
                  disabled={isExporting}
                >
                  <Download className="w-3 h-3 mr-1" />
                  {isExporting ? '导出中...' : '导出文件'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => exportReferences('txt')}>
                  文本文件 (.txt)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportReferences('bib')}>
                  BibTeX (.bib)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportReferences('ris')}>
                  RIS (.ris)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="text-xs text-center text-slate-500">
            共 {selectedSources.length} 条引用 · {citationStyle} 格式
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CitationListCard;