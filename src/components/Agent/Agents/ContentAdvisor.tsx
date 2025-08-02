import React, { useState } from 'react';
import { Card } from '../../UI/Card';
import { Button } from '../../UI/Button';
import { AgentSuggestion } from '../../../types';

interface ContentAdvisorProps {
  documentStructure?: any;
  contentAnalysis?: any;
  onSuggestion?: (suggestion: AgentSuggestion) => void;
  className?: string;
}

const ContentAdvisor: React.FC<ContentAdvisorProps> = ({
  documentStructure,
  contentAnalysis,
  onSuggestion,
  className = ''
}) => {
  const [analysisType, setAnalysisType] = useState<string>('structure');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 内容分析功能
  const analyzeContent = async (type: string) => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      let suggestion: AgentSuggestion;
      
      switch (type) {
        case 'structure':
          suggestion = {
            id: 'structure-analysis-' + Date.now(),
            type: 'improvement',
            title: '论文结构分析',
            content: '结构分析结果：\n\n优点：\n✓ 逻辑层次清晰\n✓ 章节安排合理\n\n改进建议：\n• 建议在第二章增加理论框架小节\n• 第四章数据分析可以细分为定量和定性分析\n• 结论部分建议增加政策建议子章节\n\n整体结构完整度：85%',
            confidence: 0.88,
            action: {
              id: 'optimize-structure',
              type: 'restructure',
              label: '优化结构',
              description: '应用结构优化建议',
              icon: '🏗️'
            }
          };
          break;
        case 'logic':
          suggestion = {
            id: 'logic-analysis-' + Date.now(),
            type: 'enhancement',
            title: '逻辑连贯性分析',
            content: '逻辑分析结果：\n\n强项：\n✓ 论证主线清晰\n✓ 证据支撑充分\n\n需要加强：\n• 第3段到第4段的逻辑跳跃较大\n• 建议添加过渡句：\"基于上述分析，进一步探讨...\"\n• 反驳论证可以更加深入\n\n逻辑连贯度：82%',
            confidence: 0.85
          };
          break;
        case 'innovation':
          suggestion = {
            id: 'innovation-analysis-' + Date.now(),
            type: 'enhancement',
            title: '创新性评估',
            content: '创新性评估：\n\n创新亮点：\n✓ 研究视角新颖\n✓ 方法论有所突破\n✓ 实证数据丰富\n\n提升建议：\n• 突出与现有研究的差异性\n• 强调理论贡献的独特性\n• 明确实践应用的创新价值\n\n创新性评分：78%',
            confidence: 0.80
          };
          break;
        default:
          suggestion = {
            id: 'general-analysis-' + Date.now(),
            type: 'improvement',
            title: '综合内容分析',
            content: '内容质量总体较好，建议关注逻辑连贯性和创新性表达。',
            confidence: 0.75
          };
      }
      
      onSuggestion?.(suggestion);
      setIsAnalyzing(false);
    }, 2000);
  };

  // 分析工具
  const analysisTools = [
    {
      id: 'structure',
      title: '结构分析',
      description: '分析论文整体结构',
      icon: '🏗️',
      action: () => analyzeContent('structure')
    },
    {
      id: 'logic',
      title: '逻辑检查',
      description: '检查论证逻辑连贯性',
      icon: '🧠',
      action: () => analyzeContent('logic')
    },
    {
      id: 'innovation',
      title: '创新性评估',
      description: '评估研究创新程度',
      icon: '🌟',
      action: () => analyzeContent('innovation')
    },
    {
      id: 'readability',
      title: '可读性分析',
      description: '分析文本可读性',
      icon: '👁️',
      action: () => {
        const suggestion: AgentSuggestion = {
          id: 'readability-' + Date.now(),
          type: 'improvement',
          title: '可读性分析报告',
          content: '可读性分析：\n\n文本特征：\n• 平均句长：18词\n• 复杂句比例：35%\n• 专业术语密度：适中\n\n改进建议：\n• 适当简化长句\n• 增加过渡词使用\n• 保持术语解释的一致性\n\n可读性评分：76%',
          confidence: 0.83
        };
        onSuggestion?.(suggestion);
      }
    }
  ];

  // 内容策略建议
  const contentStrategies = [
    {
      category: '论证策略',
      strategies: [
        '演绎推理：从一般到特殊',
        '归纳推理：从特殊到一般',
        '类比推理：通过相似性论证',
        '对比分析：突出差异性'
      ]
    },
    {
      category: '结构模式',
      strategies: [
        '问题-分析-解决模式',
        '时间顺序模式',
        '重要性递进模式',
        '对比对照模式'
      ]
    },
    {
      category: '表达技巧',
      strategies: [
        '数据可视化',
        '案例分析',
        '引用权威',
        '逻辑递进'
      ]
    }
  ];

  // 内容评估指标
  const evaluationMetrics = [
    { metric: '逻辑连贯性', score: 85, color: 'green' },
    { metric: '论证充分性', score: 78, color: 'yellow' },
    { metric: '创新性', score: 82, color: 'green' },
    { metric: '可读性', score: 76, color: 'yellow' },
    { metric: '结构完整性', score: 88, color: 'green' },
    { metric: '语言规范性', score: 80, color: 'green' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 顾问介绍 */}
      <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">内容顾问</h3>
            <p className="text-sm text-gray-600">
              提供内容策略、逻辑架构和论证强化专业建议
            </p>
          </div>
        </div>
      </Card>

      {/* 内容分析工具 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">内容分析工具</h4>
        <div className="grid grid-cols-2 gap-2">
          {analysisTools.map((tool) => (
            <Button
              key={tool.id}
              variant="outline"
              size="sm"
              onClick={tool.action}
              disabled={isAnalyzing}
              className="flex flex-col items-center p-3 h-auto text-center"
            >
              <div className="text-lg mb-1">{tool.icon}</div>
              <div className="text-xs font-medium">{tool.title}</div>
              <div className="text-xs text-gray-500 mt-1">
                {tool.description}
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* 内容质量评估 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">内容质量评估</h4>
        <div className="space-y-3">
          {evaluationMetrics.map((metric) => (
            <div key={metric.metric} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{metric.metric}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metric.score >= 85 ? 'bg-green-500' :
                      metric.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${metric.score}%` }}
                  ></div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getScoreColor(metric.score)}`}>
                  {metric.score}%
                </span>
              </div>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">📊</span>
              <span className="text-sm font-medium text-blue-900">
                综合评分：{Math.round(evaluationMetrics.reduce((sum, m) => sum + m.score, 0) / evaluationMetrics.length)}%
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 内容策略建议 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">内容策略建议</h4>
        <div className="space-y-3">
          {contentStrategies.map((category) => (
            <div key={category.category}>
              <h5 className="text-sm font-medium text-gray-800 mb-2">
                {category.category}
              </h5>
              <div className="grid grid-cols-2 gap-1">
                {category.strategies.map((strategy, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const suggestion: AgentSuggestion = {
                        id: 'strategy-' + Date.now(),
                        type: 'enhancement',
                        title: `${category.category}：${strategy}`,
                        content: `建议在当前部分应用"${strategy}"策略，以增强论证效果和逻辑说服力。`,
                        confidence: 0.80
                      };
                      onSuggestion?.(suggestion);
                    }}
                    className="text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                  >
                    {strategy}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 论证强化工具 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">论证强化工具</h4>
        <div className="space-y-2">
          {[
            {
              tool: '论据补强',
              description: '识别薄弱论据，建议补充支撑材料',
              icon: '🔍'
            },
            {
              tool: '反驳处理',
              description: '识别潜在反驳，提供应对策略',
              icon: '⚖️'
            },
            {
              tool: '逻辑检验',
              description: '检查推理过程的逻辑严密性',
              icon: '🧠'
            },
            {
              tool: '证据评估',
              description: '评估证据的可信度和说服力',
              icon: '📊'
            }
          ].map((item) => (
            <Button
              key={item.tool}
              variant="outline"
              size="sm"
              onClick={() => {
                const suggestion: AgentSuggestion = {
                  id: 'argument-' + Date.now(),
                  type: 'improvement',
                  title: item.tool,
                  content: `${item.description}\n\n建议：\n1. 仔细审查当前论证链条\n2. 识别逻辑薄弱环节\n3. 补充相关证据材料\n4. 加强论证的说服力`,
                  confidence: 0.82
                };
                onSuggestion?.(suggestion);
              }}
              className="w-full flex items-center justify-start space-x-3 p-3"
            >
              <span className="text-lg">{item.icon}</span>
              <div className="text-left">
                <div className="text-sm font-medium">{item.tool}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* 读者体验优化 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">读者体验优化</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <div className="text-sm font-medium text-blue-900 mb-1">
                📖 可读性
              </div>
              <div className="text-xs text-blue-700">
                • 句子长度适中<br/>
                • 段落结构清晰<br/>
                • 术语解释充分
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <div className="text-sm font-medium text-green-900 mb-1">
                🎯 针对性
              </div>
              <div className="text-xs text-green-700">
                • 明确目标读者<br/>
                • 调整表达深度<br/>
                • 突出核心观点
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const suggestion: AgentSuggestion = {
                id: 'reader-experience-' + Date.now(),
                type: 'enhancement',
                title: '读者体验优化建议',
                content: '优化建议：\n\n1. 增加导读性内容\n2. 使用更多示例说明\n3. 完善图表辅助理解\n4. 优化章节间的连接\n\n这些改进将显著提升读者的阅读体验。',
                confidence: 0.86
              };
              onSuggestion?.(suggestion);
            }}
            className="w-full"
          >
            🚀 生成优化建议
          </Button>
        </div>
      </Card>

      {/* 分析状态 */}
      {isAnalyzing && (
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            <span className="text-sm text-purple-800">正在深度分析内容结构和逻辑...</span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContentAdvisor;