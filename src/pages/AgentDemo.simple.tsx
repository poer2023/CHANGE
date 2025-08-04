import React, { useState } from 'react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';

const AgentDemoSimple: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('writing');
  const [demoContent, setDemoContent] = useState(`
人工智能技术在教育领域的应用研究

摘要
随着科技的发展，人工智能技术在教育领域的应用越来越广泛。我觉得这个技术很重要，可以改变传统的教学模式。本研究通过问卷调查和案例分析，探讨了AI在个性化学习、智能评估等方面的应用效果。

1. 引言
人工智能作为一项革命性技术，正在深刻改变着各个行业。在教育领域，AI技术的应用为解决传统教育中的诸多问题提供了新的思路和方法。
  `);

  const agents = [
    { id: 'writing', name: '学术写作专家', icon: '👨‍🎓', color: 'bg-blue-500' },
    { id: 'research', name: '研究助手', icon: '🔬', color: 'bg-green-500' },
    { id: 'format', name: '格式专家', icon: '📝', color: 'bg-purple-500' },
    { id: 'content', name: '内容顾问', icon: '💡', color: 'bg-orange-500' }
  ];

  const getSuggestions = (agentId: string) => {
    switch (agentId) {
      case 'writing':
        return {
          title: '学术写作建议',
          suggestions: [
            '建议将"我觉得"改为"研究表明"',
            '增加更多客观性表达',
            '完善论证逻辑链条'
          ]
        };
      case 'research':
        return {
          title: '研究方法建议',
          suggestions: [
            '考虑添加定量分析方法',
            '扩大样本规模',
            '增加控制变量'
          ]
        };
      case 'format':
        return {
          title: '格式检查',
          suggestions: [
            '标题格式需要调整',
            '参考文献格式不统一',
            '图表编号需要规范'
          ]
        };
      case 'content':
        return {
          title: '内容结构优化',
          suggestions: [
            '增加理论框架章节',
            '完善文献综述部分',
            '加强结论的实用性'
          ]
        };
      default:
        return { title: '', suggestions: [] };
    }
  };

  const currentSuggestions = getSuggestions(selectedAgent);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI助手系统演示</h1>
            <p className="text-sm text-gray-600 mt-1">
              体验不同AI助手的专业能力
            </p>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* 左侧Agent选择 */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">选择AI助手</h3>
              <div className="space-y-2">
                {agents.map((agent) => (
                  <Button
                    key={agent.id}
                    variant={selectedAgent === agent.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedAgent(agent.id)}
                    className="w-full justify-start"
                  >
                    <span className="mr-2">{agent.icon}</span>
                    {agent.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* 功能特点 */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">功能特点</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 智能内容分析</li>
                <li>• 专业建议推荐</li>
                <li>• 实时写作辅助</li>
                <li>• 多维度评估</li>
                <li>• 个性化指导</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 中间内容区域 */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* 文档编辑器模拟 */}
            <Card className="p-6">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    论文编辑器 (演示)
                  </h2>
                  <div className="text-sm text-gray-500">
                    模拟文档内容
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto">
                  <div
                    className="prose max-w-none whitespace-pre-line text-sm leading-relaxed bg-gray-50 p-4 rounded border"
                    style={{ minHeight: '400px' }}
                  >
                    {demoContent}
                  </div>
                </div>
              </div>
            </Card>

            {/* AI助手建议面板 */}
            <Card className="p-6">
              <div className="h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">
                      {agents.find(a => a.id === selectedAgent)?.icon}
                    </span>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {agents.find(a => a.id === selectedAgent)?.name}
                    </h2>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-md font-medium text-gray-900 mb-3">
                    {currentSuggestions.title}
                  </h3>
                  
                  <div className="space-y-3">
                    {currentSuggestions.suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-blue-900">
                              {suggestion}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="ml-2 text-xs"
                          >
                            应用
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        分析全文
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        生成报告
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDemoSimple;