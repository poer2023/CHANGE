import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  Calendar,
  FileText,
  Quote
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

export type DocumentType = 'all' | 'pdf' | 'note' | 'reference' | 'article';
export type SortOption = 'date' | 'title' | 'relevance' | 'citations';
export type SortDirection = 'asc' | 'desc';

interface DocumentFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: DocumentType;
  onTypeChange: (type: DocumentType) => void;
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (sortBy: SortOption, direction: SortDirection) => void;
  totalCount: number;
  filteredCount: number;
}

const documentTypes = [
  { value: 'all' as const, label: '全部', icon: FileText },
  { value: 'pdf' as const, label: 'PDF文档', icon: FileText },
  { value: 'note' as const, label: '笔记', icon: FileText },
  { value: 'reference' as const, label: '参考文献', icon: Quote },
  { value: 'article' as const, label: '文章', icon: FileText }
];

const sortOptions = [
  { value: 'date' as const, label: '按时间排序', icon: Calendar },
  { value: 'title' as const, label: '按标题排序', icon: FileText },
  { value: 'relevance' as const, label: '按相关性排序', icon: Search },
  { value: 'citations' as const, label: '按引用数排序', icon: Quote }
];

const DocumentFilter: React.FC<DocumentFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortBy,
  sortDirection,
  onSortChange,
  totalCount,
  filteredCount
}) => {
  const handleSortChange = (newSortBy: SortOption) => {
    if (newSortBy === sortBy) {
      // 如果选择的是当前排序字段，则切换排序方向
      onSortChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 如果选择的是新的排序字段，默认使用降序
      onSortChange(newSortBy, 'desc');
    }
  };

  const getSortIcon = () => {
    return sortDirection === 'asc' ? SortAsc : SortDesc;
  };

  const SortIcon = getSortIcon();

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="搜索文档标题、作者或内容..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 过滤和排序控制 */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* 文档类型过滤 */}
          <div className="flex items-center gap-2">
            {documentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onTypeChange(type.value)}
                  className="text-xs"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {type.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* 排序控制 */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                <SortIcon className="h-4 w-4" />
                {sortOptions.find(opt => opt.value === sortBy)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>排序方式</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className="cursor-pointer"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {option.label}
                    {sortBy === option.value && (
                      <SortIcon className="h-4 w-4 ml-auto" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 结果统计 */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>
            显示 {filteredCount} / {totalCount} 个文档
          </span>
          {searchQuery && (
            <Badge variant="secondary" className="text-xs">
              搜索: "{searchQuery}"
            </Badge>
          )}
          {selectedType !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              类型: {documentTypes.find(t => t.value === selectedType)?.label}
            </Badge>
          )}
        </div>
        
        {(searchQuery || selectedType !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange('');
              onTypeChange('all');
            }}
            className="text-xs h-6 px-2"
          >
            清除筛选
          </Button>
        )}
      </div>
    </div>
  );
};

export default DocumentFilter;