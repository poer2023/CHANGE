import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Search,
  ExternalLink,
  PieChart
} from 'lucide-react';

interface PlagiarismMatch {
  id: string;
  sourceTitle: string;
  sourceUrl: string;
  similarity: number;
  matchedText: string;
  sourceType: 'academic' | 'web' | 'journal' | 'book';
}

interface PlagiarismResult {
  overallSimilarity: number;
  confidence: number;
  matches: PlagiarismMatch[];
  analysis: {
    totalSources: number;
    highRiskMatches: number;
    uniqueContent: number;
    recommendations: string[];
  };
  processingTime: number;
}

interface PlagiarismVisualizationProps {
  result: PlagiarismResult;
  documentWordCount: number;
}

const PlagiarismVisualization: React.FC<PlagiarismVisualizationProps> = ({ 
  result, 
  documentWordCount 
}) => {
  // 生成模拟的段落相似度数据
  const paragraphSimilarity = [
    { id: 1, similarity: 8, content: "引言部分", sources: 2 },
    { id: 2, similarity: 15, content: "文献综述", sources: 4 },
    { id: 3, similarity: 28, content: "理论分析", sources: 3 },
    { id: 4, similarity: 22, content: "实证研究", sources: 2 },
    { id: 5, similarity: 12, content: "结论讨论", sources: 1 },
  ];

  // 生成模拟的检测过程时间线
  const detectionSteps = [
    { step: "文档预处理", time: 0.8, progress: 100, description: "分析文档结构和格式" },
    { step: "语义分割", time: 1.5, progress: 100, description: "将文本分割为语义单元" },
    { step: "数据库检索", time: 2.1, progress: 100, description: "搜索学术数据库和网络资源" },
    { step: "相似度计算", time: 1.3, progress: 100, description: "计算文本相似度和匹配度" },
    { step: "结果分析", time: 0.5, progress: 100, description: "生成检测报告和建议" },
  ];

  const getSimilarityColor = (similarity: number) => {
    if (similarity < 15) return 'bg-green-500';
    if (similarity < 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSimilarityLevel = (similarity: number) => {
    if (similarity < 15) return { label: '低相似度', color: 'text-green-600 bg-green-100' };
    if (similarity < 25) return { label: '中等相似度', color: 'text-yellow-600 bg-yellow-100' };
    return { label: '高相似度', color: 'text-red-600 bg-red-100' };
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return '🎓';
      case 'journal': return '📑';
      case 'book': return '📚';
      case 'web': return '🌐';
      default: return '📄';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 段落相似度热力图 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            段落相似度分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paragraphSimilarity.map((paragraph) => {
              const level = getSimilarityLevel(paragraph.similarity);
              return (
                <div key={paragraph.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{paragraph.content}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={level.color}>
                        {level.label}
                      </Badge>
                      <span className="text-xs text-gray-500">{paragraph.sources} 个来源</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={paragraph.similarity} className="flex-1 h-3" />
                    <span className="text-sm font-medium text-gray-600 min-w-[3rem]">
                      {paragraph.similarity}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                重点关注：理论分析和实证研究部分相似度较高
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 检测过程时间线 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            检测流程时间线
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {detectionSteps.map((step, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{step.step}</span>
                      <span className="text-sm text-gray-600">{step.time}s</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{step.description}</p>
                    <Progress value={step.progress} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                总耗时: {result.processingTime}s | 
                检索速度: {Math.round(documentWordCount / result.processingTime).toLocaleString()} 字/秒
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 来源类型分布饼图 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            来源类型分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              {['academic', 'journal', 'web', 'book'].map((type) => {
                const count = result.matches.filter(m => m.sourceType === type).length;
                const percentage = result.matches.length > 0 ? (count / result.matches.length * 100) : 0;
                const typeNames = {
                  academic: '学术论文',
                  journal: '期刊文章', 
                  web: '网络资源',
                  book: '书籍文献'
                };
                return (
                  <div key={type} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">{getSourceTypeIcon(type)}</div>
                    <div className="text-lg font-bold text-purple-600 mb-1">
                      {count}
                    </div>
                    <div className="text-sm text-purple-800 font-medium">{typeNames[type]}</div>
                    <div className="text-xs text-purple-600 mt-1">{percentage.toFixed(0)}%</div>
                  </div>
                );
              })}
            </div>
            
            {/* 详细分布 */}
            <div className="space-y-3">
              {['academic', 'journal', 'web', 'book'].map((type) => {
                const count = result.matches.filter(m => m.sourceType === type).length;
                const percentage = result.matches.length > 0 ? (count / result.matches.length * 100) : 0;
                const typeNames = {
                  academic: '学术论文',
                  journal: '期刊文章', 
                  web: '网络资源',
                  book: '书籍文献'
                };
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm flex items-center gap-2">
                        <span>{getSourceTypeIcon(type)}</span>
                        {typeNames[type]}
                      </span>
                      <span className="text-sm font-semibold">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 检测统计概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            检测统计概览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 主要指标 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-600 mb-1">
                  {(result.overallSimilarity * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-red-800">总相似度</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600 mb-1">
                  {result.analysis.uniqueContent}%
                </div>
                <div className="text-sm text-green-800">原创内容</div>
              </div>
              
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600 mb-1">
                  {result.analysis.totalSources}
                </div>
                <div className="text-sm text-blue-800">检测源</div>
              </div>
              
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-600 mb-1">
                  {result.analysis.highRiskMatches}
                </div>
                <div className="text-sm text-yellow-800">高风险</div>
              </div>
            </div>
            
            {/* 风险等级分布 */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">风险等级分布</h4>
              {[
                { label: '高风险 (>20%)', count: result.matches.filter(m => m.similarity > 0.2).length, color: 'bg-red-500' },
                { label: '中风险 (15-20%)', count: result.matches.filter(m => m.similarity > 0.15 && m.similarity <= 0.2).length, color: 'bg-yellow-500' },
                { label: '低风险 (<15%)', count: result.matches.filter(m => m.similarity <= 0.15).length, color: 'bg-green-500' }
              ].map((risk) => {
                const percentage = result.matches.length > 0 ? (risk.count / result.matches.length * 100) : 0;
                return (
                  <div key={risk.label} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{risk.label}</span>
                      <span className="text-sm font-semibold">{risk.count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${risk.color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-800">
                检测置信度 {(result.confidence * 100).toFixed(1)}%，结果高度可信
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlagiarismVisualization;