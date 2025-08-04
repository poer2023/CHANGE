import React, { useState } from 'react';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';

const SimpleModularEditorDemo: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('abstract');
  const [content, setContent] = useState({
    abstract: '本研究探讨了人工智能技术在医疗诊断领域的应用现状和发展前景。通过对相关文献的系统梳理和实证分析，我们发现AI技术在提高诊断准确性、降低医疗成本、改善患者体验等方面具有显著优势。',
    introduction: '随着人工智能技术的快速发展，其在医疗健康领域的应用日益广泛。医疗诊断作为医疗服务的核心环节，如何运用AI技术提升诊断效率和准确性，已成为当前研究的热点问题。',
    methodology: '本研究采用文献分析法和案例研究法，通过对国内外相关研究的系统梳理，分析AI在医疗诊断中的应用模式和发展趋势。',
    results: '研究结果显示，AI技术在影像诊断、疾病预测、个性化治疗等方面表现出色，准确率可达90%以上。',
    conclusion: 'AI技术在医疗诊断领域具有广阔的应用前景，但仍需解决数据隐私、算法透明度、医疗责任等关键问题。'
  });

  const modules = [
    { id: 'abstract', name: '摘要', icon: '📄', color: 'bg-blue-500' },
    { id: 'introduction', name: '引言', icon: '🌟', color: 'bg-green-500' },
    { id: 'methodology', name: '研究方法', icon: '🔬', color: 'bg-purple-500' },
    { id: 'results', name: '研究结果', icon: '📊', color: 'bg-orange-500' },
    { id: 'conclusion', name: '结论', icon: '🎯', color: 'bg-red-500' }
  ];

  const handleContentChange = (moduleId: string, newContent: string) => {
    setContent(prev => ({
      ...prev,
      [moduleId]: newContent
    }));
  };

  const getWordCount = (text: string) => {
    return text.length;
  };

  const getTotalWords = () => {
    return Object.values(content).reduce((total, text) => total + text.length, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">模块化编辑器演示</h1>
            <p className="text-sm text-gray-600 mt-1">
              AI在医疗诊断中的应用研究 • 总字数: {getTotalWords()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              导出
            </Button>
            <Button size="sm">
              保存
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* 左侧模块导航 */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900 mb-3">论文模块</h3>
            {modules.map((module, index) => (
              <div key={module.id} className="relative">
                <Button
                  variant={activeModule === module.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveModule(module.id)}
                  className="w-full justify-start"
                >
                  <span className="mr-2">{module.icon}</span>
                  <span className="flex-1 text-left">{module.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {getWordCount(content[module.id as keyof typeof content])}字
                  </span>
                </Button>
                
                {/* 连接线 */}
                {index < modules.length - 1 && (
                  <div className="absolute left-6 top-8 w-0.5 h-6 bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>

          {/* 编辑统计 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">编辑统计</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>完成模块</span>
                <span>{modules.length}/5</span>
              </div>
              <div className="flex justify-between">
                <span>总字数</span>
                <span>{getTotalWords()}</span>
              </div>
              <div className="flex justify-between">
                <span>平均模块字数</span>
                <span>{Math.round(getTotalWords() / modules.length)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 中间编辑区域 */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-2">
                  {modules.find(m => m.id === activeModule)?.icon}
                </span>
                <h2 className="text-lg font-semibold text-gray-900">
                  {modules.find(m => m.id === activeModule)?.name}
                </h2>
              </div>
              <div className="text-sm text-gray-500">
                {getWordCount(content[activeModule as keyof typeof content])} 字
              </div>
            </div>
          </div>

          <div className="flex-1 p-6">
            <Card className="h-full p-6">
              <textarea
                value={content[activeModule as keyof typeof content] || ''}
                onChange={(e) => handleContentChange(activeModule, e.target.value)}
                className="w-full h-full resize-none border-none outline-none text-gray-900 leading-relaxed"
                placeholder={`开始编写${modules.find(m => m.id === activeModule)?.name}...`}
                style={{ minHeight: '400px' }}
              />
            </Card>
          </div>
        </div>

        {/* 右侧工具面板 */}
        <div className="w-80 bg-white border-l border-gray-200 p-4">
          <div className="space-y-6">
            {/* 模块概览 */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">模块概览</h3>
              <div className="space-y-2">
                {modules.map((module) => (
                  <div key={module.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {module.icon} {module.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {getWordCount(content[module.id as keyof typeof content])}字
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${module.color}`}
                        style={{ 
                          width: `${Math.min(100, (getWordCount(content[module.id as keyof typeof content]) / 100) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 写作建议 */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">写作建议</h3>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-900">
                    💡 当前模块建议增加更多细节描述
                  </div>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm text-green-900">
                    ✅ 结构清晰，逻辑连贯
                  </div>
                </div>
              </div>
            </div>

            {/* 快捷操作 */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">快捷操作</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  🔍 语法检查
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  📊 字数统计
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  💾 自动保存
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleModularEditorDemo;