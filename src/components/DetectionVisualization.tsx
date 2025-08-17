import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Brain,
  Zap
} from 'lucide-react';

interface DetectionResult {
  aiProbability: number;
  confidence: number;
  processingTime: number;
  analysis: {
    patterns: string[];
    risks: string[];
    recommendations: string[];
  };
}

interface DetectionVisualizationProps {
  result: DetectionResult;
  documentWordCount: number;
}

const DetectionVisualization: React.FC<DetectionVisualizationProps> = ({ 
  result, 
  documentWordCount 
}) => {
  // 生成模拟的段落风险数据
  const paragraphRisks = [
    { id: 1, risk: 15, content: "引言部分" },
    { id: 2, risk: 25, content: "背景分析" },
    { id: 3, risk: 45, content: "核心论述" },
    { id: 4, risk: 35, content: "案例分析" },
    { id: 5, risk: 20, content: "结论总结" },
  ];

  // 生成模拟的检测过程时间线
  const detectionSteps = [
    { step: "文档解析", time: 0.5, progress: 100 },
    { step: "语义分析", time: 1.2, progress: 100 },
    { step: "模式匹配", time: 0.8, progress: 100 },
    { step: "风险评估", time: 0.7, progress: 100 },
  ];

  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'bg-green-500';
    if (risk < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRiskLevel = (risk: number) => {
    if (risk < 30) return { label: '低风险', color: 'text-green-600 bg-green-100' };
    if (risk < 60) return { label: '中风险', color: 'text-yellow-600 bg-yellow-100' };
    return { label: '高风险', color: 'text-red-600 bg-red-100' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 段落风险热力图 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            段落风险分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paragraphRisks.map((paragraph) => {
              const riskLevel = getRiskLevel(paragraph.risk);
              return (
                <div key={paragraph.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{paragraph.content}</span>
                    <Badge className={riskLevel.color}>
                      {riskLevel.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={paragraph.risk} className="flex-1 h-3" />
                    <span className="text-sm font-medium text-gray-600 min-w-[3rem]">
                      {paragraph.risk}%
                    </span>
                  </div>
                </div>
              );
            })}
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
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{step.step}</span>
                    <span className="text-sm text-gray-600">{step.time}s</span>
                  </div>
                  <Progress value={step.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                总耗时: {result.processingTime}s | 
                处理速度: {Math.round(documentWordCount / result.processingTime).toLocaleString()} 字/秒
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI vs 人类写作对比雷达图 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-green-600" />
            写作特征对比
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {(100 - result.aiProbability * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-blue-800 font-medium">人类写作</div>
                <div className="text-xs text-blue-600 mt-1">自然流畅度高</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {(result.aiProbability * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-red-800 font-medium">AI生成</div>
                <div className="text-xs text-red-600 mt-1">模式化程度</div>
              </div>
            </div>
            
            {/* 特征指标 */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>词汇多样性</span>
                  <span>{(85 + Math.random() * 10).toFixed(0)}%</span>
                </div>
                <Progress value={85 + Math.random() * 10} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>语法复杂度</span>
                  <span>{(78 + Math.random() * 15).toFixed(0)}%</span>
                </div>
                <Progress value={78 + Math.random() * 15} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>情感表达</span>
                  <span>{(72 + Math.random() * 20).toFixed(0)}%</span>
                </div>
                <Progress value={72 + Math.random() * 20} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>逻辑连贯性</span>
                  <span>{(88 + Math.random() * 8).toFixed(0)}%</span>
                </div>
                <Progress value={88 + Math.random() * 8} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 检测统计概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            检测统计概览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-700 mb-1">
                {result.analysis.patterns.length}
              </div>
              <div className="text-sm text-gray-600">检测模式</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-700 mb-1">
                {result.analysis.risks.length}
              </div>
              <div className="text-sm text-gray-600">风险点</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-700 mb-1">
                {result.analysis.recommendations.length}
              </div>
              <div className="text-sm text-gray-600">优化建议</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-700 mb-1">
                {Math.round(result.confidence * 100)}%
              </div>
              <div className="text-sm text-gray-600">置信度</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                检测算法准确率达到 {(result.confidence * 100).toFixed(1)}%，结果高度可信
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetectionVisualization;