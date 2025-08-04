/**
 * GLM内容生成测试组件
 * 测试各种内容生成场景，如写作建议、语法检查、内容扩展等
 */

import React, { useState } from 'react';
import { FileText, Zap, Check, RefreshCw, BookOpen, AlertTriangle } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { useStreamingAI } from '../../hooks/useStreamingAI';

interface TestScenario {
  id: string;
  name: string;
  icon: React.ElementType;
  prompt: string;
  systemMessage: string;
  description: string;
}

const testScenarios: TestScenario[] = [
  {
    id: 'writing-advice',
    name: '写作建议',
    icon: FileText,
    prompt: '请帮我改进这篇文章的写作质量：\n\n近年来，人工智能技术飞速发展。这个技术很重要。它改变了我们的生活。我们需要更好地理解它。',
    systemMessage: '你是一位专业的写作顾问，请提供具体的写作改进建议。',
    description: '测试AI对写作内容的分析和改进建议'
  },
  {
    id: 'grammar-check',
    name: '语法检查',
    icon: Check,
    prompt: '请检查以下文本的语法错误：\n\n我们公司在去年已经完成了重要的项目，这些项目对于公司的发展有很大的帮助，我们希望在今年能够继续保持这种好的势头。',
    systemMessage: '你是一位语言专家，专门检查和纠正语法错误。',
    description: '测试AI的语法检查和纠错能力'
  },
  {
    id: 'content-expansion',
    name: '内容扩展',
    icon: BookOpen,
    prompt: '请扩展以下内容，使其更加详细和深入：\n\n机器学习是人工智能的一个重要分支。',
    systemMessage: '你是一位知识渊博的教育专家，请详细扩展给定的内容。',
    description: '测试AI的内容扩展和知识补充能力'
  },
  {
    id: 'structure-optimization',
    name: '结构优化',
    icon: RefreshCw,
    prompt: '请优化以下文档的结构和逻辑：\n\n介绍：本文讨论AI。应用：AI在医疗、教育、金融等领域有应用。结论：AI很重要。挑战：AI也有一些问题需要解决。',
    systemMessage: '你是一位文档结构专家，请优化内容的逻辑结构。',
    description: '测试AI的文档结构优化能力'
  },
  {
    id: 'creative-writing',
    name: '创意写作',
    icon: Zap,
    prompt: '以"未来的智能城市"为主题，写一篇引人入胜的短文。',
    systemMessage: '你是一位富有创意的作家，请写出引人入胜的内容。',
    description: '测试AI的创意写作和想象力'
  },
  {
    id: 'academic-writing',
    name: '学术写作',
    icon: AlertTriangle,
    prompt: '请将以下内容改写为学术论文的语言风格：\n\n现在很多人都在用手机，手机对人们的影响很大，有好处也有坏处。',
    systemMessage: '你是一位学术写作专家，请使用严谨的学术语言进行写作。',
    description: '测试AI的学术写作能力'
  }
];

const GLMContentTest: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<TestScenario | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});
  
  const {
    content,
    isStreaming,
    error,
    startStreaming,
    stopStreaming,
    reset,
    isReady
  } = useStreamingAI({
    temperature: 0.7,
    maxTokens: 2000
  });

  const handleTestScenario = async (scenario: TestScenario) => {
    if (isStreaming) return;

    setSelectedScenario(scenario);
    reset();

    try {
      await startStreaming(
        scenario.prompt, 
        undefined, // 不需要chunk回调
        true // 使用真实API
      );
    } catch (error) {
      console.error('测试场景失败:', error);
    }
  };

  const handleSaveResult = () => {
    if (selectedScenario && content) {
      setResults(prev => ({
        ...prev,
        [selectedScenario.id]: content
      }));
    }
  };

  const handleClearResults = () => {
    setResults({});
    reset();
    setSelectedScenario(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GLM内容生成测试</h1>
        <p className="text-gray-600">测试各种内容生成场景和AI能力</p>
      </div>

      {!isReady && (
        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-center space-x-2 text-yellow-800">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-medium">GLM客户端未配置</p>
          </div>
          <p className="text-yellow-700 mt-1 text-sm">
            请配置 .env.local 文件中的 VITE_GLM_API_KEY 以使用真实API
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 测试场景列表 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">测试场景</h2>
          
          {testScenarios.map((scenario) => {
            const Icon = scenario.icon;
            const hasResult = !!results[scenario.id];
            const isCurrentScenario = selectedScenario?.id === scenario.id;
            
            return (
              <div
                key={scenario.id} 
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 border rounded-lg ${
                  isCurrentScenario ? 'ring-2 ring-blue-500' : 'border-gray-200'
                }`}
                onClick={() => !isStreaming && handleTestScenario(scenario)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    hasResult ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{scenario.name}</h3>
                      {hasResult && (
                        <span className="text-xs text-green-600 font-medium">已完成</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                  </div>
                </div>
                
                {isCurrentScenario && isStreaming && (
                  <div className="mt-3 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-sm text-blue-600">正在生成...</span>
                    <Button 
                      onClick={stopStreaming}
                      size="sm"
                      variant="outline"
                      className="ml-auto"
                    >
                      停止
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 结果展示区域 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">生成结果</h2>
            <div className="space-x-2">
              {selectedScenario && content && !isStreaming && (
                <Button onClick={handleSaveResult} size="sm">
                  保存结果
                </Button>
              )}
              <Button onClick={handleClearResults} variant="outline" size="sm">
                清空
              </Button>
            </div>
          </div>

          {/* 当前生成的内容 */}
          {selectedScenario && (
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">{selectedScenario.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  系统提示: {selectedScenario.systemMessage}
                </p>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">测试提示:</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedScenario.prompt}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">错误: {error}</p>
                </div>
              )}

              <div className="min-h-32 p-3 border rounded-lg bg-white">
                {content ? (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm">{content}</pre>
                    {isStreaming && (
                      <div className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1" />
                    )}
                  </div>
                ) : isStreaming ? (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                    <span className="text-sm">AI正在思考...</span>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">选择一个测试场景开始生成内容</p>
                )}
              </div>
            </Card>
          )}

          {/* 已保存的结果 */}
          {Object.keys(results).length > 0 && (
            <Card className="p-6">
              <h3 className="font-medium text-gray-900 mb-4">已保存的结果</h3>
              <div className="space-y-3">
                {Object.entries(results).map(([scenarioId, result]) => {
                  const scenario = testScenarios.find(s => s.id === scenarioId);
                  if (!scenario) return null;

                  return (
                    <details key={scenarioId} className="group">
                      <summary className="cursor-pointer p-2 bg-gray-50 rounded-lg">
                        <span className="font-medium">{scenario.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({result.length} 字符)
                        </span>
                      </summary>
                      <div className="mt-2 p-3 border rounded-lg bg-white">
                        <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                      </div>
                    </details>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* 测试统计 */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">测试统计</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{testScenarios.length}</div>
            <div className="text-sm text-gray-600">总场景数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{Object.keys(results).length}</div>
            <div className="text-sm text-gray-600">已完成</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {testScenarios.length - Object.keys(results).length}
            </div>
            <div className="text-sm text-gray-600">待测试</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {Object.values(results).reduce((sum, result) => sum + result.length, 0)}
            </div>
            <div className="text-sm text-gray-600">总字符数</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GLMContentTest;