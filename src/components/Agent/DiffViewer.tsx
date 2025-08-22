import React, { useState } from 'react';
import { DiffItem } from '@/types/agent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  BarChart, 
  RefreshCw, 
  Bookmark,
  Filter
} from 'lucide-react';

interface DiffViewerProps {
  diffs: DiffItem[];
  className?: string;
  onCategoryFilter?: (categories: Set<DiffItem['category']>) => void;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ 
  diffs, 
  className = '', 
  onCategoryFilter 
}) => {
  const [selectedCategories, setSelectedCategories] = useState<Set<DiffItem['category']>>(
    new Set(['structure', 'content', 'format', 'reference', 'figure'])
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // 获取分类信息
  const categoryInfo = {
    structure: { label: '结构', icon: FileText, color: 'bg-blue-100 text-blue-700' },
    content: { label: '内容', icon: FileText, color: 'bg-green-100 text-green-700' },
    format: { label: '格式', icon: RefreshCw, color: 'bg-purple-100 text-purple-700' },
    reference: { label: '引用', icon: Bookmark, color: 'bg-orange-100 text-orange-700' },
    figure: { label: '图表', icon: BarChart, color: 'bg-red-100 text-red-700' }
  };

  // 获取操作类型显示
  const getKindDisplay = (kind: DiffItem['kind']) => {
    switch (kind) {
      case 'ins': return { label: '新增', color: 'text-green-600', bgColor: 'bg-green-50' };
      case 'del': return { label: '删除', color: 'text-red-600', bgColor: 'bg-red-50' };
      case 'mod': return { label: '修改', color: 'text-blue-600', bgColor: 'bg-blue-50' };
      case 'move': return { label: '移动', color: 'text-purple-600', bgColor: 'bg-purple-50' };
      default: return { label: '变更', color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  // 过滤差异项
  const filteredDiffs = diffs.filter(diff => selectedCategories.has(diff.category));

  // 分组统计
  const stats = diffs.reduce((acc, diff) => {
    acc[diff.category] = (acc[diff.category] || 0) + 1;
    return acc;
  }, {} as Record<DiffItem['category'], number>);

  // 处理分类过滤
  const handleCategoryToggle = (category: DiffItem['category']) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
    onCategoryFilter?.(newCategories);
  };

  // 切换展开状态
  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedItems(newExpanded);
  };

  if (diffs.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p>没有检测到变更</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 分类过滤器 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">过滤变更类型</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryInfo).map(([category, info]) => {
            const count = stats[category as DiffItem['category']] || 0;
            const isSelected = selectedCategories.has(category as DiffItem['category']);
            const Icon = info.icon;
            
            return (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category as DiffItem['category'])}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected 
                    ? info.color 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                disabled={count === 0}
              >
                <Icon className="w-3 h-3" />
                {info.label}
                {count > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 text-xs px-1">
                    {count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 差异列表 */}
      <div className="space-y-2" role="region" aria-label="变更差异列表">
        {filteredDiffs.map((diff, index) => {
          const kindDisplay = getKindDisplay(diff.kind);
          const categoryInfo_ = categoryInfo[diff.category];
          const isExpanded = expandedItems.has(diff.path);
          const Icon = categoryInfo_.icon;
          
          return (
            <div
              key={`${diff.path}-${index}`}
              className={`border rounded-lg transition-all duration-300 hover:shadow-md ${kindDisplay.bgColor} border-opacity-50`}
            >
              {/* 差异项头部 */}
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-1.5 rounded ${categoryInfo_.color} flex-shrink-0`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${kindDisplay.color} border-current`}
                        >
                          {kindDisplay.label}
                        </Badge>
                        <span className="text-xs text-slate-500 truncate">
                          {diff.path}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-700 mb-2">
                        {diff.description}
                      </p>
                    </div>
                  </div>
                  
                  {(diff.before || diff.after) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 flex-shrink-0"
                      onClick={() => toggleExpanded(diff.path)}
                      aria-label={isExpanded ? "收起详情" : "展开详情"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* 展开的差异内容 */}
              {isExpanded && (diff.before || diff.after) && (
                <div className="border-t border-slate-200 border-opacity-50 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-slate-200">
                    {/* 修改前 */}
                    {diff.before && (
                      <div className="p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-600">修改前</span>
                          <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                            原内容
                          </Badge>
                        </div>
                        <pre className="text-xs text-slate-700 whitespace-pre-wrap bg-red-50 p-2 rounded border-l-2 border-red-200">
                          {diff.before}
                        </pre>
                      </div>
                    )}
                    
                    {/* 修改后 */}
                    {diff.after && (
                      <div className="p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-600">修改后</span>
                          <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                            新内容
                          </Badge>
                        </div>
                        <pre className="text-xs text-slate-700 whitespace-pre-wrap bg-green-50 p-2 rounded border-l-2 border-green-200">
                          {diff.after}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredDiffs.length === 0 && diffs.length > 0 && (
        <div className="text-center py-8 text-slate-500 text-sm">
          <Filter className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>当前过滤条件下没有变更</p>
          <p className="text-xs mt-1">尝试选择其他变更类型</p>
        </div>
      )}

      {/* 统计信息 */}
      <div 
        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs text-slate-600"
        aria-live="polite"
      >
        <span>
          显示 {filteredDiffs.length} 项变更（共 {diffs.length} 项）
        </span>
        <span>
          {Object.entries(stats).map(([cat, count]) => `${categoryInfo[cat as DiffItem['category']].label}: ${count}`).join('，')}
        </span>
      </div>
    </div>
  );
};

export default DiffViewer;