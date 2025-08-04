import React, { useState } from 'react';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';

const SimpleContentAnalysisDemo: React.FC = () => {
  const [content, setContent] = useState(`人工智能技术在教育领域的应用研究

摘要
随着科技的发展，人工智能技术在教育领域的应用越来越广泛。我觉得这个技术很重要，可以改变传统的教学模式。本研究通过问卷调查和案例分析，探讨了AI在个性化学习、智能评估等方面的应用效果。

1. 引言
人工智能作为一项革命性技术，正在深刻改变着各个行业。在教育领域，AI技术的应用为解决传统教育中的诸多问题提供了新的思路和方法。

2. 研究方法
本研究采用混合研究方法，结合定量和定性分析，通过问卷调查收集数据，并进行深入的案例研究。

3. 结果与分析
研究结果显示，AI技术的应用显著提升了学习效率和教学质量。具体表现在：
- 学习效率提升30%
- 学生满意度提高25%
- 教师工作负担减轻40%

4. 结论
人工智能技术为教育改革提供了新的机遇。我们应该积极拥抱这项技术，同时注意规避潜在风险。`);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState({
    overall: { score: 78, grade: 'B' as const },
    academic: { score: 72, issues: 3 },
    language: { score: 85, errors: 2 },
    structure: { score: 80, suggestions: 2 },
    innovation: { score: 75, novelty: 70 }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('overview');

  const categories = [
    { id: 'overview', name: '总体评估', icon: '📊' },
    { id: 'academic', name: '学术标准', icon: '🎓' },
    { id: 'language', name: '语言质量', icon: '📝' },
    { id: 'structure', name: '结构完整性', icon: '🏗️' },
    { id: 'innovation', name: '创新性', icon: '💡' }
  ];

  const suggestions = [
    {
      id: '1',
      category: 'academic',
      priority: 'high' as const,
      title: '避免主观表达',
      description: '文中"我觉得"等主观表达不符合学术写作规范',
      position: { line: 4, text: '我觉得这个技术很重要' }
    },
    {
      id: '2',
      category: 'language',
      priority: 'medium' as const,
      title: '术语使用规范',
      description: '建议使用更专业的学术术语',
      position: { line: 12, text: '改变着各个行业' }
    },
    {
      id: '3',
      category: 'structure',
      priority: 'medium' as const,
      title: '文献综述缺失',
      description: '建议添加文献综述章节',
      position: { line: 8, text: '引言' }
    }
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // 模拟分析过程
    setTimeout(() => {
      setAnalysisResult({
        overall: { score: Math.floor(Math.random() * 20) + 70, grade: 'B' },
        academic: { score: Math.floor(Math.random() * 20) + 65, issues: Math.floor(Math.random() * 5) + 1 },
        language: { score: Math.floor(Math.random() * 15) + 80, errors: Math.floor(Math.random() * 3) + 1 },
        structure: { score: Math.floor(Math.random() * 20) + 70, suggestions: Math.floor(Math.random() * 4) + 1 },
        innovation: { score: Math.floor(Math.random() * 25) + 65, novelty: Math.floor(Math.random() * 30) + 60 }
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGradeColor = (grade: string) => {
    const colors = {
      'A': 'bg-green-500',
      'B': 'bg-blue-500',
      'C': 'bg-yellow-500',
      'D': 'bg-orange-500',
      'F': 'bg-red-500'
    };
    return colors[grade as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">内容分析演示</h1>
            <p className="text-sm text-gray-600 mt-1">
              字数: {content.length} • 总体评分: {analysisResult.overall.score}/100
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  分析中...
                </>
              ) : (
                <>
                  🔍 开始分析
                </>
              )}
            </Button>
            <Button variant="outline" size="sm">
              导出报告
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* 左侧内容输入区域 */}
        <div className="flex-1 p-6">
          <Card className="h-full p-6">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">待分析内容</h2>
                <div className="text-sm text-gray-500">
                  {content.length} 字
                </div>
              </div>
              
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 w-full resize-none border border-gray-200 rounded-lg p-4 text-gray-900 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="粘贴或输入要分析的内容..."
                style={{ minHeight: '500px' }}
              />
            </div>
          </Card>
        </div>

        {/* 右侧分析结果面板 */}
        <div className="w-96 bg-white border-l border-gray-200">
          {/* 分析类别选择 */}
          <div className="border-b border-gray-200 p-4">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="justify-start text-xs"
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-4 h-[calc(100%-100px)] overflow-y-auto">
            {selectedCategory === 'overview' && (
              <div className="space-y-4">
                {/* 总体评分 */}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold text-white ${getGradeColor(analysisResult.overall.grade)}`}>
                    {analysisResult.overall.grade}
                  </div>
                  <div className="mt-2">
                    <div className="text-lg font-semibold text-gray-900">
                      {analysisResult.overall.score}/100
                    </div>
                    <div className="text-sm text-gray-600">总体评分</div>
                  </div>
                </div>

                {/* 各维度评分 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">🎓 学术标准</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(analysisResult.academic.score)}`}>
                      {analysisResult.academic.score}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">📝 语言质量</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(analysisResult.language.score)}`}>
                      {analysisResult.language.score}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">🏗️ 结构完整性</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(analysisResult.structure.score)}`}>
                      {analysisResult.structure.score}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">💡 创新性</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(analysisResult.innovation.score)}`}>
                      {analysisResult.innovation.score}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedCategory !== 'overview' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  {categories.find(c => c.id === selectedCategory)?.icon} {categories.find(c => c.id === selectedCategory)?.name}
                </h3>
                
                {suggestions
                  .filter(s => s.category === selectedCategory)
                  .map((suggestion) => (
                    <div key={suggestion.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {suggestion.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {suggestion.description}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                          suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {suggestion.priority === 'high' ? '高' :
                           suggestion.priority === 'medium' ? '中' : '低'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mb-2">
                        第{suggestion.position.line}行: "{suggestion.position.text}"
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        应用建议
                      </Button>
                    </div>
                  ))}

                {suggestions.filter(s => s.category === selectedCategory).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">✅</div>
                    <div className="text-sm">该方面表现良好，暂无建议</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 分析进度提示 */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI分析中</h3>
              <p className="text-sm text-gray-600">
                正在分析文本的学术标准、语言质量、结构完整性和创新性...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleContentAnalysisDemo;