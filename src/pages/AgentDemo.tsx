import React, { useState } from 'react';
import { 
  AgentPanel, 
  AcademicWritingExpert, 
  ResearchAssistant, 
  FormatExpert, 
  ContentAdvisor 
} from '../components/Agent';
import { useAgentStore } from '../store/agentStore';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';

const AgentDemo: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    isAgentPanelOpen,
    toggleAgentPanel,
    panelMode,
    setPanelMode,
    suggestions,
    addSuggestion,
    selectedText,
    setSelectedText
  } = useAgentStore();

  const [demoContent, setDemoContent] = useState(`
人工智能技术在教育领域的应用研究

摘要
随着科技的发展，人工智能技术在教育领域的应用越来越广泛。我觉得这个技术很重要，可以改变传统的教学模式。本研究通过问卷调查和案例分析，探讨了AI在个性化学习、智能评估等方面的应用效果。

1. 引言
人工智能作为一项革命性技术，正在深刻改变着各个行业。在教育领域，AI技术的应用为解决传统教育中的诸多问题提供了新的思路和方法。

2. 文献综述
相关研究表明，AI技术在教育中的应用主要集中在以下几个方面：个性化学习路径推荐、智能评估与反馈、教学内容生成等。

3. 研究方法
本研究采用混合研究方法，结合定量和定性分析，通过问卷调查收集数据，并进行深入的案例研究。

4. 结果与分析
研究结果显示，AI技术的应用显著提升了学习效率和教学质量。具体表现在：
- 学习效率提升30%
- 学生满意度提高25%
- 教师工作负担减轻40%

5. 讨论
这些发现表明AI技术在教育领域具有巨大潜力。然而，也需要注意技术应用中的挑战和问题。

6. 结论
人工智能技术为教育改革提供了新的机遇。我们应该积极拥抱这项技术，同时注意规避潜在风险。
  `);

  const [selectedDemo, setSelectedDemo] = useState<string>('panel');

  // 处理文本选择
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };

  // 演示组件渲染器
  const renderDemoComponent = () => {
    switch (selectedDemo) {
      case 'panel':
        return (
          <div className="h-full">
            <AgentPanel className="h-full" />
          </div>
        );
      case 'writing':
        return (
          <AcademicWritingExpert
            selectedText={selectedText}
            onSuggestion={addSuggestion}
          />
        );
      case 'research':
        return (
          <ResearchAssistant
            researchTopic="人工智能在教育中的应用"
            onSuggestion={addSuggestion}
          />
        );
      case 'format':
        return (
          <FormatExpert
            documentContent={demoContent}
            onSuggestion={addSuggestion}
          />
        );
      case 'content':
        return (
          <ContentAdvisor
            onSuggestion={addSuggestion}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI助手系统演示</h1>
            <p className="text-sm text-gray-600 mt-1">
              体验强化的Agent能力和智能对话系统
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={isAgentPanelOpen ? 'default' : 'outline'}
              onClick={toggleAgentPanel}
              className="flex items-center space-x-2"
            >
              <span>🤖</span>
              <span>{isAgentPanelOpen ? '关闭' : '打开'}AI助手</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">模式:</span>
              <Button
                variant={panelMode === 'chat' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPanelMode('chat')}
              >
                Chat
              </Button>
              <Button
                variant={panelMode === 'agent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPanelMode('agent')}
              >
                Agent
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* 左侧演示选择 */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">演示组件</h3>
              <div className="space-y-1">
                {[
                  { id: 'panel', name: 'Agent面板', icon: '🤖' },
                  { id: 'writing', name: '学术写作专家', icon: '👨‍🎓' },
                  { id: 'research', name: '研究助手', icon: '🔬' },
                  { id: 'format', name: '格式专家', icon: '📝' },
                  { id: 'content', name: '内容顾问', icon: '💡' }
                ].map((item) => (
                  <Button
                    key={item.id}
                    variant={selectedDemo === item.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedDemo(item.id)}
                    className="w-full justify-start"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Agent角色切换 */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">当前Agent</h3>
              <div className="space-y-1">
                {[
                  { role: 'academic-writing-expert', name: '学术写作专家', icon: '👨‍🎓' },
                  { role: 'research-assistant', name: '研究助手', icon: '🔬' },
                  { role: 'format-expert', name: '格式专家', icon: '📝' },
                  { role: 'content-advisor', name: '内容顾问', icon: '💡' }
                ].map((item) => (
                  <Button
                    key={item.role}
                    variant={currentRole === item.role ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentRole(item.role as any)}
                    className="w-full justify-start text-xs"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* 演示说明 */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">功能特点</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 智能角色切换</li>
                <li>• 专业对话系统</li>
                <li>• 快捷操作工具</li>
                <li>• 实时建议卡片</li>
                <li>• 上下文感知</li>
                <li>• 多轮对话记忆</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 中间内容区域 */}
        <div className="flex-1 flex">
          {/* 主要内容 */}
          <div className="flex-1 p-6">
            {selectedDemo === 'panel' ? (
              <div className="h-full">
                {/* 模拟文档编辑器 */}
                <Card className="h-full p-6">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        论文编辑器 (演示)
                      </h2>
                      <div className="text-sm text-gray-500">
                        选中文本可触发AI分析
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-auto">
                      <div
                        className="prose max-w-none whitespace-pre-line text-sm leading-relaxed"
                        onMouseUp={handleTextSelection}
                        style={{ userSelect: 'text' }}
                      >
                        {demoContent}
                      </div>
                    </div>
                    
                    {selectedText && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <div className="text-sm">
                          <span className="font-medium text-blue-900">已选中文本：</span>
                          <span className="text-blue-700">
                            {selectedText.length > 100 
                              ? `${selectedText.substring(0, 100)}...` 
                              : selectedText
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ) : (
              <div className="h-full overflow-auto">
                {renderDemoComponent()}
              </div>
            )}
          </div>

          {/* 右侧Agent面板 */}
          {isAgentPanelOpen && (
            <div className="w-80 border-l border-gray-200">
              <AgentPanel className="h-full" />
            </div>
          )}
        </div>
      </div>

      {/* 建议浮层 */}
      {suggestions.length > 0 && (
        <div className="fixed bottom-4 right-4 w-80 max-h-96 overflow-auto">
          <div className="space-y-2">
            {suggestions.slice(-3).map((suggestion) => (
              <Card key={suggestion.id} className="p-3 bg-white shadow-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    {suggestion.title}
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => useAgentStore.getState().removeSuggestion(suggestion.id)}
                    className="p-1 h-auto text-xs"
                  >
                    ✕
                  </Button>
                </div>
                <p className="text-xs text-gray-600 line-clamp-3">
                  {suggestion.content}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    置信度: {Math.round(suggestion.confidence * 100)}%
                  </span>
                  {suggestion.action && (
                    <Button size="sm" className="text-xs">
                      {suggestion.action.label}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDemo;