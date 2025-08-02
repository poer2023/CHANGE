import React, { useMemo, useState, useCallback } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Hash, 
  List,
  Eye,
  EyeOff,
  Search,
  X
} from 'lucide-react';

interface OutlineItem {
  id: string;
  level: number;
  title: string;
  content: string;
  startIndex: number;
  endIndex: number;
  children?: OutlineItem[];
}

interface DocumentOutlineProps {
  content: string;
  onNavigate?: (startIndex: number, endIndex: number) => void;
  onToggleSection?: (id: string) => void;
  className?: string;
}

const DocumentOutline: React.FC<DocumentOutlineProps> = ({
  content,
  onNavigate,
  onToggleSection,
  className = ""
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  // 解析Markdown标题生成大纲
  const outline = useMemo(() => {
    const lines = content.split('\n');
    const items: OutlineItem[] = [];
    let currentIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      
      if (match) {
        const level = match[1].length;
        const title = match[2].trim();
        const id = `heading-${i}-${title.toLowerCase().replace(/\s+/g, '-')}`;
        
        // 查找下一个标题或文档结尾
        let endIndex = currentIndex + line.length;
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].match(/^#{1,6}\s+/)) {
            break;
          }
          endIndex += lines[j].length + 1; // +1 for newline
        }

        const item: OutlineItem = {
          id,
          level,
          title,
          content: lines.slice(i + 1, lines.findIndex((l, idx) => idx > i && l.match(/^#{1,6}\s+/))).join('\n').trim(),
          startIndex: currentIndex,
          endIndex
        };

        items.push(item);
      }
      
      currentIndex += line.length + 1; // +1 for newline
    }

    // 构建层级结构
    const buildHierarchy = (items: OutlineItem[]): OutlineItem[] => {
      const result: OutlineItem[] = [];
      const stack: OutlineItem[] = [];

      for (const item of items) {
        // 清理栈中层级大于等于当前项的元素
        while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
          stack.pop();
        }

        if (stack.length === 0) {
          result.push(item);
        } else {
          const parent = stack[stack.length - 1];
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(item);
        }

        stack.push(item);
      }

      return result;
    };

    return buildHierarchy(items);
  }, [content]);

  // 过滤大纲项目
  const filteredOutline = useMemo(() => {
    if (!searchTerm) return outline;

    const filterItems = (items: OutlineItem[]): OutlineItem[] => {
      return items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.content.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (matchesSearch) return true;
        
        if (item.children) {
          const filteredChildren = filterItems(item.children);
          if (filteredChildren.length > 0) {
            return true;
          }
        }
        
        return false;
      }).map(item => ({
        ...item,
        children: item.children ? filterItems(item.children) : undefined
      }));
    };

    return filterItems(outline);
  }, [outline, searchTerm]);

  // 切换展开状态
  const toggleExpanded = useCallback((id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // 导航到指定位置
  const handleNavigate = useCallback((item: OutlineItem) => {
    onNavigate?.(item.startIndex, item.endIndex);
  }, [onNavigate]);

  // 渲染大纲项目
  const renderOutlineItem = useCallback((item: OutlineItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const indentClass = `ml-${Math.min(depth * 3, 12)}`;

    return (
      <div key={item.id} className="outline-item">
        <div
          className={`flex items-center group hover:bg-gray-50 rounded-lg px-2 py-1.5 cursor-pointer transition-colors ${indentClass}`}
          onClick={() => handleNavigate(item)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(item.id);
              }}
              className="p-0.5 mr-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-gray-500" />
              ) : (
                <ChevronRight className="h-3 w-3 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-4 mr-1" />
          )}

          <div className="flex items-center min-w-0 flex-1">
            <Hash className={`h-3 w-3 mr-2 flex-shrink-0 ${
              item.level === 1 ? 'text-blue-600' :
              item.level === 2 ? 'text-green-600' :
              item.level === 3 ? 'text-orange-600' :
              'text-gray-500'
            }`} />
            <span className={`truncate text-sm ${
              item.level === 1 ? 'font-semibold text-gray-900' :
              item.level === 2 ? 'font-medium text-gray-800' :
              'text-gray-700'
            }`}>
              {item.title}
            </span>
          </div>

          {showPreview && item.content && (
            <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-gray-400 truncate max-w-20">
                {item.content.substring(0, 30)}...
              </span>
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map(child => renderOutlineItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }, [expandedItems, handleNavigate, toggleExpanded, showPreview]);

  // 统计信息
  const stats = useMemo(() => {
    const countItems = (items: OutlineItem[]): { total: number; byLevel: Record<number, number> } => {
      let total = 0;
      const byLevel: Record<number, number> = {};

      for (const item of items) {
        total++;
        byLevel[item.level] = (byLevel[item.level] || 0) + 1;
        
        if (item.children) {
          const childStats = countItems(item.children);
          total += childStats.total;
          Object.entries(childStats.byLevel).forEach(([level, count]) => {
            byLevel[parseInt(level)] = (byLevel[parseInt(level)] || 0) + count;
          });
        }
      }

      return { total, byLevel };
    };

    return countItems(outline);
  }, [outline]);

  if (outline.length === 0) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          暂无大纲内容
        </p>
        <p className="text-xs text-gray-400 mt-1">
          使用 # ## ### 标题来创建文档大纲
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* 头部工具栏 */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <List className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">文档大纲</span>
          <span className="text-xs text-gray-500">({stats.total})</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title={showPreview ? '隐藏预览' : '显示预览'}
          >
            {showPreview ? (
              <EyeOff className="h-3 w-3 text-gray-500" />
            ) : (
              <Eye className="h-3 w-3 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
          <input
            type="text"
            placeholder="搜索大纲..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* 大纲列表 */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredOutline.length > 0 ? (
          <div className="space-y-0.5">
            {filteredOutline.map(item => renderOutlineItem(item))}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">没有找到匹配的内容</p>
          </div>
        )}
      </div>

      {/* 统计信息 */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>总标题数:</span>
            <span>{stats.total}</span>
          </div>
          {Object.entries(stats.byLevel).map(([level, count]) => (
            <div key={level} className="flex justify-between">
              <span>H{level}:</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentOutline;