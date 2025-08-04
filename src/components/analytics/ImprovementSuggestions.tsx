import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

interface Suggestion {
  id: string;
  type: 'quality' | 'productivity' | 'structure' | 'style';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  estimatedTime?: string;
  impact?: 'high' | 'medium' | 'low';
  difficulty?: 'easy' | 'moderate' | 'hard';
}

interface ImprovementSuggestionsProps {
  suggestions: Suggestion[];
  showAll?: boolean;
  className?: string;
  onApplySuggestion?: (suggestionId: string) => void;
  onDismissSuggestion?: (suggestionId: string) => void;
}

const ImprovementSuggestions: React.FC<ImprovementSuggestionsProps> = ({
  suggestions,
  showAll = false,
  className = '',
  onApplySuggestion,
  onDismissSuggestion
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'quality' | 'productivity' | 'structure' | 'style'>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<string>>(new Set());

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'quality': return '⭐';
      case 'productivity': return '⚡';
      case 'structure': return '🏗️';
      case 'style': return '✍️';
      default: return '💡';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'quality': return 'yellow';
      case 'productivity': return 'green';
      case 'structure': return 'blue';
      case 'style': return 'purple';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'high': return '高优先级';
      case 'medium': return '中优先级';
      case 'low': return '低优先级';
      default: return '未知';
    }
  };

  const getImpactColor = (impact?: string): string => {
    switch (impact) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-500';
    }
  };

  const getDifficultyColor = (difficulty?: string): string => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    const typeMatch = selectedFilter === 'all' || suggestion.type === selectedFilter;
    const priorityMatch = selectedPriority === 'all' || suggestion.priority === selectedPriority;
    return typeMatch && priorityMatch;
  });

  const displaySuggestions = showAll ? filteredSuggestions : filteredSuggestions.slice(0, 3);

  const toggleExpanded = (suggestionId: string) => {
    const newExpanded = new Set(expandedSuggestions);
    if (newExpanded.has(suggestionId)) {
      newExpanded.delete(suggestionId);
    } else {
      newExpanded.add(suggestionId);
    }
    setExpandedSuggestions(newExpanded);
  };

  const handleApplySuggestion = (suggestionId: string) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestionId);
    }
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    if (onDismissSuggestion) {
      onDismissSuggestion(suggestionId);
    }
  };

  const generateActionPlan = (suggestion: Suggestion) => {
    const actionPlans: { [key: string]: string[] } = {
      quality: [
        '1. 检查论文结构的完整性和逻辑性',
        '2. 增加支撑论据和相关研究引用',
        '3. 完善每个章节的详细内容',
        '4. 进行同行评议或专家咨询'
      ],
      productivity: [
        '1. 分析当前写作时间分布',
        '2. 制定每日写作计划和目标',
        '3. 消除写作环境中的干扰因素',
        '4. 使用番茄工作法提高专注度'
      ],
      structure: [
        '1. 重新审视论文大纲结构',
        '2. 确保章节间的逻辑连接',
        '3. 添加过渡段落增强连贯性',
        '4. 优化段落内部结构'
      ],
      style: [
        '1. 使用多样化的词汇和表达',
        '2. 检查语法和拼写错误',
        '3. 确保学术写作规范性',
        '4. 进行语言润色和校对'
      ]
    };

    return actionPlans[suggestion.type] || ['1. 分析具体问题', '2. 制定改进计划', '3. 逐步实施改进', '4. 评估改进效果'];
  };

  if (!suggestions.length) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <div className="text-gray-500 mb-4">
          <span className="text-4xl mb-4 block">🎉</span>
          <h3 className="text-lg font-medium">暂无改进建议</h3>
          <p className="text-sm mt-2">您的写作表现很优秀，继续保持！</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">改进建议</h3>
          <p className="text-gray-600 text-sm">
            基于分析结果的个性化建议 ({filteredSuggestions.length} 条)
          </p>
        </div>
        
        {showAll && (
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              生成改进计划
            </Button>
          </div>
        )}
      </div>

      {/* 筛选器 */}
      {showAll && (
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">类型:</span>
            <div className="flex space-x-1">
              {(['all', 'quality', 'productivity', 'structure', 'style'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filter === 'all' ? '全部' :
                   filter === 'quality' ? '质量' :
                   filter === 'productivity' ? '效率' :
                   filter === 'structure' ? '结构' : '风格'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">优先级:</span>
            <div className="flex space-x-1">
              {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
                <button
                  key={priority}
                  onClick={() => setSelectedPriority(priority)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedPriority === priority
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {priority === 'all' ? '全部' :
                   priority === 'high' ? '高' :
                   priority === 'medium' ? '中' : '低'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 建议列表 */}
      <div className="space-y-4">
        {displaySuggestions.map((suggestion, index) => {
          const isExpanded = expandedSuggestions.has(suggestion.id);
          const typeColor = getTypeColor(suggestion.type);
          
          return (
            <div
              key={suggestion.id}
              className={`border rounded-lg transition-all duration-300 hover:shadow-md ${
                isExpanded ? 'border-primary-200 bg-primary-50' : 'border-gray-200 bg-white'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">{getTypeIcon(suggestion.type)}</span>
                      <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                      
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                        {getPriorityLabel(suggestion.priority)}
                      </span>
                      
                      {suggestion.actionable && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          可执行
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{suggestion.description}</p>
                    
                    {/* 元信息 */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {suggestion.estimatedTime && (
                        <div className="flex items-center">
                          <span className="mr-1">⏱️</span>
                          <span>预计时间: {suggestion.estimatedTime}</span>
                        </div>
                      )}
                      
                      {suggestion.impact && (
                        <div className="flex items-center">
                          <span className="mr-1">📊</span>
                          <span className={getImpactColor(suggestion.impact)}>
                            影响: {suggestion.impact === 'high' ? '高' : suggestion.impact === 'medium' ? '中' : '低'}
                          </span>
                        </div>
                      )}
                      
                      {suggestion.difficulty && (
                        <div className="flex items-center">
                          <span className="mr-1">🎯</span>
                          <span className={getDifficultyColor(suggestion.difficulty)}>
                            难度: {suggestion.difficulty === 'easy' ? '简单' : suggestion.difficulty === 'moderate' ? '中等' : '困难'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleExpanded(suggestion.id)}
                    className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-2">
                    {suggestion.actionable && (
                      <Button
                        size="sm"
                        onClick={() => handleApplySuggestion(suggestion.id)}
                        className="text-xs"
                      >
                        应用建议
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleExpanded(suggestion.id)}
                      className="text-xs"
                    >
                      {isExpanded ? '收起详情' : '查看详情'}
                    </Button>
                  </div>
                  
                  <button
                    onClick={() => handleDismissSuggestion(suggestion.id)}
                    className="text-gray-400 hover:text-gray-600 text-xs transition-colors"
                  >
                    忽略
                  </button>
                </div>
              </div>

              {/* 展开的详细信息 */}
              {isExpanded && (
                <div className="border-t bg-white p-4 animate-slide-in-down">
                  <div className="space-y-4">
                    {/* 行动计划 */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">行动计划</h5>
                      <div className="space-y-2">
                        {generateActionPlan(suggestion).map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start text-sm text-gray-600">
                            <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0 mt-0.5">
                              {stepIndex + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* 预期效果 */}
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-900 mb-1">预期效果</h5>
                      <p className="text-sm text-green-700">
                        {suggestion.type === 'quality' && '提升论文的整体质量和学术价值，增强论文的说服力和可信度。'}
                        {suggestion.type === 'productivity' && '提高写作效率，缩短写作周期，让您能够更快地完成高质量的论文。'}
                        {suggestion.type === 'structure' && '优化论文结构，增强逻辑性和可读性，让读者更容易理解您的观点。'}
                        {suggestion.type === 'style' && '提升写作风格和语言表达，让论文更加专业和流畅。'}
                      </p>
                    </div>
                    
                    {/* 注意事项 */}
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h5 className="font-medium text-yellow-900 mb-1">注意事项</h5>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• 实施改进时请保持原有内容的完整性</li>
                        <li>• 建议逐步进行，避免一次性大幅修改</li>
                        <li>• 完成后可以寻求同行或导师的反馈</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 显示更多按钮 */}
      {!showAll && filteredSuggestions.length > 3 && (
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm">
            查看全部 {filteredSuggestions.length} 条建议
          </Button>
        </div>
      )}

      {/* 总结和建议 */}
      {showAll && (
        <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-200">
          <h4 className="font-medium text-primary-900 mb-2">改进建议总结</h4>
          <div className="text-primary-700 text-sm space-y-2">
            <p>
              共有 <span className="font-semibold">{suggestions.length}</span> 条改进建议，
              其中 <span className="font-semibold">{suggestions.filter(s => s.priority === 'high').length}</span> 条高优先级建议。
            </p>
            <p>
              建议优先处理 <span className="font-semibold text-red-600">高优先级</span> 和 
              <span className="font-semibold text-blue-600"> 可执行</span> 的建议，这将带来最明显的改进效果。
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ImprovementSuggestions;