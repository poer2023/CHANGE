import React, { useState } from 'react';
import { MessageSquare, RefreshCw, Copy, ChevronDown, ChevronUp, Lightbulb, BookOpen, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Topic, Claim, Source } from '@/types/writing-flow';
import { toast } from 'sonner';

interface InterviewQACardProps {
  thesis?: string;
  claims?: Claim[];
  sources?: Source[];
  topic?: Topic;
  className?: string;
}

interface QAItem {
  id: string;
  category: 'core' | 'evidence' | 'methodology' | 'implications';
  question: string;
  answer: string;
  tips?: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

const InterviewQACard: React.FC<InterviewQACardProps> = ({ 
  thesis, 
  claims = [], 
  sources = [], 
  topic,
  className = '' 
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['qa-1']); // 默认展开第一项
  const [selectedCategory, setSelectedCategory] = useState<'all' | QAItem['category']>('all');

  // 生成问答内容
  const generateQAItems = (): QAItem[] => {
    const qaItems: QAItem[] = [];
    
    // 核心论点问题
    if (thesis) {
      qaItems.push(
        {
          id: 'qa-1',
          category: 'core',
          question: '您的研究的核心论点是什么？',
          answer: thesis,
          tips: '简洁明了地表达主要观点，避免过于复杂的表述',
          difficulty: 'basic'
        },
        {
          id: 'qa-2',
          category: 'core',
          question: '为什么选择这个研究主题？',
          answer: `这个研究主题具有重要的理论价值和实践意义。通过对${topic?.title || '相关问题'}的深入研究，可以为该领域提供新的见解和解决方案。`,
          tips: '强调研究的价值和意义，可以从理论贡献和实践应用两个角度回答',
          difficulty: 'basic'
        }
      );
    }

    // 论证和证据问题
    if (claims.length > 0) {
      qaItems.push(
        {
          id: 'qa-3',
          category: 'evidence',
          question: '您的主要论点有哪些？',
          answer: claims.map((claim, index) => `${index + 1}. ${claim.text}`).join('\n'),
          tips: '按逻辑顺序列举各个分论点，展现论证结构的清晰性',
          difficulty: 'intermediate'
        },
        {
          id: 'qa-4',
          category: 'evidence',
          question: '您如何支撑这些论点？',
          answer: `本研究基于${sources.length}篇高质量文献的证据支持，通过${claims.length}个主要论点的系统论证，形成了完整的理论框架。每个论点都有相应的实证证据和理论支撑。`,
          tips: '具体说明证据来源和论证方法，体现研究的严谨性',
          difficulty: 'intermediate'
        }
      );
    }

    // 研究方法问题
    qaItems.push(
      {
        id: 'qa-5',
        category: 'methodology',
        question: '您采用了什么研究方法？',
        answer: '本研究采用了文献分析法和理论分析法相结合的研究方法。通过系统性的文献梳理，构建了理论分析框架，并运用逻辑推理的方法进行论证。',
        tips: '说明方法选择的合理性和适用性',
        difficulty: 'intermediate'
      },
      {
        id: 'qa-6',
        category: 'methodology',
        question: '研究过程中遇到了什么困难？',
        answer: '主要困难包括相关文献的搜集和筛选、理论框架的构建以及论证逻辑的完善。通过系统的文献检索和多轮修改完善，最终形成了较为完整的研究成果。',
        tips: '展示解决问题的能力和学习成长过程',
        difficulty: 'advanced'
      }
    );

    // 意义和影响问题
    qaItems.push(
      {
        id: 'qa-7',
        category: 'implications',
        question: '这项研究有什么理论贡献？',
        answer: `本研究的主要理论贡献在于：1) 构建了新的分析框架；2) 丰富了相关理论内容；3) 为后续研究提供了新的思路和方向。`,
        tips: '从理论创新角度阐述研究价值',
        difficulty: 'advanced'
      },
      {
        id: 'qa-8',
        category: 'implications',
        question: '研究结果有什么实践意义？',
        answer: '研究结果可以为相关实践提供理论指导，帮助解决实际问题，对政策制定和实践改进具有重要的参考价值。',
        tips: '结合具体应用场景说明实践价值',
        difficulty: 'advanced'
      },
      {
        id: 'qa-9',
        category: 'implications',
        question: '未来还需要进一步研究什么？',
        answer: '未来可以从以下几个方面深化研究：1) 扩大研究样本和范围；2) 运用更多元的研究方法；3) 加强实证研究验证；4) 关注新兴问题和发展趋势。',
        tips: '展示对研究领域的深入理解和发展前瞻',
        difficulty: 'advanced'
      }
    );

    return qaItems;
  };

  const qaItems = generateQAItems();
  
  const filteredItems = selectedCategory === 'all' 
    ? qaItems 
    : qaItems.filter(item => item.category === selectedCategory);

  // 分类标签
  const categories = [
    { id: 'all', label: '全部', icon: MessageSquare, count: qaItems.length },
    { id: 'core', label: '核心论点', icon: Target, count: qaItems.filter(item => item.category === 'core').length },
    { id: 'evidence', label: '证据论证', icon: BookOpen, count: qaItems.filter(item => item.category === 'evidence').length },
    { id: 'methodology', label: '研究方法', icon: RefreshCw, count: qaItems.filter(item => item.category === 'methodology').length },
    { id: 'implications', label: '意义影响', icon: Lightbulb, count: qaItems.filter(item => item.category === 'implications').length }
  ];

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const copyQA = async (question: string, answer: string) => {
    try {
      const content = `Q: ${question}\n\nA: ${answer}`;
      await navigator.clipboard.writeText(content);
      toast.success('问答已复制到剪贴板');
    } catch (error) {
      toast.error('复制失败，请重试');
    }
  };

  const copyAllQA = async () => {
    try {
      const content = filteredItems.map(item => 
        `Q: ${item.question}\n\nA: ${item.answer}${item.tips ? `\n\n💡 提示：${item.tips}` : ''}`
      ).join('\n\n---\n\n');
      
      await navigator.clipboard.writeText(content);
      toast.success(`已复制 ${filteredItems.length} 个问答`);
    } catch (error) {
      toast.error('复制失败，请重试');
    }
  };

  const getDifficultyBadge = (difficulty: QAItem['difficulty']) => {
    const configs = {
      basic: { label: '基础', className: 'bg-green-100 text-green-700' },
      intermediate: { label: '中等', className: 'bg-yellow-100 text-yellow-700' },
      advanced: { label: '高级', className: 'bg-red-100 text-red-700' }
    };
    
    const config = configs[difficulty];
    return (
      <Badge variant="secondary" className={`text-xs ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  if (qaItems.length === 0) {
    return (
      <Card className={`bg-card border rounded-2xl p-6 shadow-sm ${className}`}>
        <CardContent className="text-center py-8">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500 mb-2">暂无面谈问答内容</p>
          <p className="text-xs text-slate-400">完善写作策略后将自动生成</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-card border rounded-2xl p-6 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">面谈速答</CardTitle>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {filteredItems.length} 题
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-colors ${
                  isActive 
                    ? 'bg-[#6E5BFF]/10 text-[#6E5BFF] font-medium' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                {category.label}
                <span className="text-xs opacity-75">({category.count})</span>
              </button>
            );
          })}
        </div>

        {/* 问答列表 */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {filteredItems.map((item) => {
            const isExpanded = expandedItems.includes(item.id);
            
            return (
              <Collapsible key={item.id} open={isExpanded} onOpenChange={() => toggleExpand(item.id)}>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <CollapsibleTrigger className="w-full p-4 text-left hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 mb-1">
                          {item.question}
                        </p>
                        <div className="flex items-center gap-2">
                          {getDifficultyBadge(item.difficulty)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyQA(item.question, item.answer);
                          }}
                          className="h-7 w-7 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 border-t border-slate-100">
                      <div className="pt-3">
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {item.answer}
                        </p>
                        {item.tips && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-blue-800">
                                <span className="font-medium">提示：</span>
                                {item.tips}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>

        {/* 操作按钮 */}
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 rounded-full text-xs"
              onClick={copyAllQA}
            >
              <Copy className="w-3 h-3 mr-1" />
              复制全部
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 rounded-full text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              重新生成
            </Button>
          </div>
          
          <p className="text-xs text-center text-slate-500">
            共 {filteredItems.length} 个问答 · 基于您的写作内容生成
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewQACard;