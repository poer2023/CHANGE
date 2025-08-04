import React, { useState, useMemo } from 'react';
import {
  Lightbulb,
  CheckCircle,
  X,
  Filter,
  Search,
  TrendingUp,
  AlertTriangle,
  FileText,
  Zap,
  Clock,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { AISuggestion } from '@/hooks/useAIWritingAssist';

interface ContentSuggestionsProps {
  suggestions: AISuggestion[];
  onApplySuggestion: (suggestion: AISuggestion) => void;
  onDismissSuggestion: (suggestionId: string) => void;
  isCompact?: boolean;
}

type SuggestionFilter = 'all' | 'content' | 'structure' | 'grammar' | 'style' | 'citation';
type SortOption = 'confidence' | 'type' | 'recent';

const ContentSuggestions: React.FC<ContentSuggestionsProps> = ({
  suggestions,
  onApplySuggestion,
  onDismissSuggestion,
  isCompact = false
}) => {
  const [filter, setFilter] = useState<SuggestionFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('confidence');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<string>>(new Set());

  // 过滤和排序建议
  const filteredAndSortedSuggestions = useMemo(() => {
    let filtered = suggestions.filter(suggestion => {
      // 过滤器
      if (filter !== 'all' && suggestion.type !== filter) return false;
      
      // 搜索
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          suggestion.title.toLowerCase().includes(query) ||
          suggestion.description.toLowerCase().includes(query) ||
          suggestion.suggestion.toLowerCase().includes(query)
        );
      }
      
      return true;
    });

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'type':
          return a.type.localeCompare(b.type);
        case 'recent':
          return b.timestamp.getTime() - a.timestamp.getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [suggestions, filter, sortBy, searchQuery]);

  // 统计各类型建议数量
  const suggestionStats = useMemo(() => {
    const stats = suggestions.reduce((acc, suggestion) => {
      acc[suggestion.type] = (acc[suggestion.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: suggestions.length,
      content: stats.content || 0,
      structure: stats.structure || 0,
      grammar: stats.grammar || 0,
      style: stats.style || 0,
      citation: stats.citation || 0,
      ...stats
    };
  }, [suggestions]);

  // 获取建议优先级
  const getSuggestionPriority = (suggestion: AISuggestion) => {
    if (suggestion.confidence >= 0.9) return 'high';
    if (suggestion.confidence >= 0.7) return 'medium';
    return 'low';
  };

  // 获取建议图标
  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'content':
        return { icon: FileText, color: 'text-blue-600 bg-blue-100' };
      case 'structure':
        return { icon: TrendingUp, color: 'text-purple-600 bg-purple-100' };
      case 'grammar':
        return { icon: CheckCircle, color: 'text-green-600 bg-green-100' };
      case 'style':
        return { icon: Star, color: 'text-yellow-600 bg-yellow-100' };
      case 'citation':
        return { icon: FileText, color: 'text-red-600 bg-red-100' };
      default:
        return { icon: Lightbulb, color: 'text-gray-600 bg-gray-100' };
    }
  };

  // 获取优先级样式
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-400 bg-red-50';
      case 'medium':
        return 'border-l-4 border-yellow-400 bg-yellow-50';
      case 'low':
        return 'border-l-4 border-blue-400 bg-blue-50';
      default:
        return 'border-l-4 border-gray-400 bg-gray-50';
    }
  };

  // 切换建议展开状态
  const toggleSuggestionExpanded = (suggestionId: string) => {
    const newExpanded = new Set(expandedSuggestions);
    if (newExpanded.has(suggestionId)) {
      newExpanded.delete(suggestionId);
    } else {
      newExpanded.add(suggestionId);
    }
    setExpandedSuggestions(newExpanded);
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`;
    return date.toLocaleDateString();
  };

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8">
        <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无内容建议</h3>
        <p className="text-gray-500 text-sm">
          继续编写内容，AI会为您提供实时的改进建议
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 标题和统计 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>内容建议</span>
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {suggestionStats.total}
            </span>
          </h3>
        </div>

        {/* 统计卡片 */}
        {!isCompact && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-red-50 p-2 rounded text-center">
              <div className="text-xs text-red-600">高优先级</div>
              <div className="text-sm font-semibold text-red-900">
                {suggestions.filter(s => getSuggestionPriority(s) === 'high').length}
              </div>
            </div>
            <div className="bg-yellow-50 p-2 rounded text-center">
              <div className="text-xs text-yellow-600">中优先级</div>
              <div className="text-sm font-semibold text-yellow-900">
                {suggestions.filter(s => getSuggestionPriority(s) === 'medium').length}
              </div>
            </div>
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="text-xs text-blue-600">低优先级</div>
              <div className="text-sm font-semibold text-blue-900">
                {suggestions.filter(s => getSuggestionPriority(s) === 'low').length}
              </div>
            </div>
          </div>
        )}

        {/* 搜索和过滤 */}
        <div className="space-y-2">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索建议..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 过滤器和排序 */}
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as SuggestionFilter)}
              className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有类型 ({suggestionStats.total})</option>
              <option value="content">内容 ({suggestionStats.content})</option>
              <option value="structure">结构 ({suggestionStats.structure})</option>
              <option value="grammar">语法 ({suggestionStats.grammar})</option>
              <option value="style">风格 ({suggestionStats.style})</option>
              <option value="citation">引用 ({suggestionStats.citation})</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
            >
              <option value="confidence">按置信度</option>
              <option value="type">按类型</option>
              <option value="recent">按时间</option>
            </select>
          </div>
        </div>
      </div>

      {/* 建议列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredAndSortedSuggestions.map((suggestion) => {
          const { icon: Icon, color } = getSuggestionIcon(suggestion.type);
          const priority = getSuggestionPriority(suggestion);
          const isExpanded = expandedSuggestions.has(suggestion.id);

          return (
            <div
              key={suggestion.id}
              className={`rounded-lg border transition-all duration-200 ${
                suggestion.isApplied 
                  ? 'bg-green-50 border-green-200' 
                  : `bg-white border-gray-200 hover:border-gray-300 ${getPriorityStyle(priority)}`
              }`}
            >
              <div className="p-3">
                {/* 建议头部 */}
                <div className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-full ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 text-sm">{suggestion.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          priority === 'high' ? 'bg-red-100 text-red-700' :
                          priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {Math.round(suggestion.confidence * 100)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => toggleSuggestionExpanded(suggestion.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {isExpanded ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                        </button>
                        <button
                          onClick={() => onDismissSuggestion(suggestion.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {suggestion.description}
                    </p>
                    
                    {/* 展开的详细内容 */}
                    {isExpanded && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">详细建议：</h5>
                        <p className="text-sm text-gray-700 mb-3">{suggestion.suggestion}</p>
                        
                        {suggestion.originalText && (
                          <div className="mb-3">
                            <h6 className="text-xs font-medium text-gray-600 mb-1">原文：</h6>
                            <div className="bg-red-50 p-2 rounded text-sm text-gray-700 border-l-2 border-red-300">
                              {suggestion.originalText}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* 底部操作栏 */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(suggestion.timestamp)}</span>
                        <span className="capitalize">{suggestion.type}</span>
                      </div>
                      
                      {!suggestion.isApplied ? (
                        <button
                          onClick={() => onApplySuggestion(suggestion)}
                          className="flex items-center space-x-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
                        >
                          <Zap className="h-3 w-3" />
                          <span>应用</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-1 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          <span>已应用</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAndSortedSuggestions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">没有找到匹配的建议</p>
            <p className="text-xs text-gray-400 mt-1">
              尝试调整搜索条件或过滤器
            </p>
          </div>
        )}
      </div>

      {/* 快捷操作 */}
      {!isCompact && filteredAndSortedSuggestions.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                filteredAndSortedSuggestions
                  .filter(s => !s.isApplied && getSuggestionPriority(s) === 'high')
                  .forEach(s => onApplySuggestion(s));
              }}
              className="flex-1 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
            >
              应用高优先级
            </button>
            <button
              onClick={() => {
                filteredAndSortedSuggestions.forEach(s => onDismissSuggestion(s.id));
              }}
              className="flex-1 text-xs border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded transition-colors"
            >
              全部忽略
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentSuggestions;