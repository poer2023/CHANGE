import React, { useState } from 'react';
import { Card } from '../../UI/Card';
import { Button } from '../../UI/Button';
import { AgentSuggestion } from '../../../types';

interface ResearchAssistantProps {
  researchTopic?: string;
  onSuggestion?: (suggestion: AgentSuggestion) => void;
  className?: string;
}

const ResearchAssistant: React.FC<ResearchAssistantProps> = ({
  researchTopic = '',
  onSuggestion,
  className = ''
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // 模拟文献检索
  const searchLiterature = async (topic: string) => {
    setIsSearching(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      const mockResults = generateMockLiterature(topic);
      setSearchResults(mockResults);
      
      // 生成文献推荐建议
      const suggestion: AgentSuggestion = {
        id: 'literature-search-' + Date.now(),
        type: 'enhancement',
        title: '相关文献推荐',
        content: `基于关键词"${topic}"，为您找到了${mockResults.length}篇相关文献：\n\n${mockResults.slice(0, 3).map((lit, idx) => 
          `${idx + 1}. ${lit.title} (${lit.year})\n   - 引用量: ${lit.citations}\n   - 相关度: ${lit.relevance}%`
        ).join('\n\n')}`,
        confidence: 0.88,
        action: {
          id: 'add-literature',
          type: 'add-reference',
          label: '添加到参考文献',
          description: '将推荐文献添加到当前研究',
          icon: '📚'
        }
      };
      
      onSuggestion?.(suggestion);
      setIsSearching(false);
    }, 2000);
  };

  // 生成模拟文献数据
  const generateMockLiterature = (topic: string) => {
    const authors = ['Smith, J.', 'Zhang, L.', 'Johnson, M.', 'Chen, W.', 'Brown, K.', 'Davis, R.'];
    const journals = ['Nature', 'Science', 'Cell', 'PNAS', 'Journal of Research', 'Academic Review'];
    
    return Array.from({ length: 8 }, (_, i) => ({
      id: `lit-${i + 1}`,
      title: `${topic}相关研究：方法与应用 ${i + 1}`,
      authors: authors.slice(0, Math.floor(Math.random() * 3) + 1),
      journal: journals[Math.floor(Math.random() * journals.length)],
      year: 2020 + Math.floor(Math.random() * 4),
      citations: Math.floor(Math.random() * 500) + 10,
      relevance: Math.floor(Math.random() * 30) + 70,
      doi: `10.1000/journal.${Math.random().toString(36).substr(2, 9)}`,
      abstract: `这是一篇关于${topic}的重要研究论文，探讨了相关理论和实践应用...`
    }));
  };

  // 研究工具
  const researchTools = [
    {
      id: 'literature-search',
      title: '文献检索',
      description: '智能搜索相关学术文献',
      icon: '🔍',
      action: () => searchLiterature(researchTopic || '机器学习')
    },
    {
      id: 'methodology-suggest',
      title: '方法论建议',
      description: '推荐适合的研究方法',
      icon: '🔬',
      action: () => {
        const suggestion: AgentSuggestion = {
          id: 'methodology-' + Date.now(),
          type: 'improvement',
          title: '研究方法建议',
          content: '基于您的研究问题，建议采用以下方法：\n\n1. 定量研究：问卷调查、实验设计\n2. 定性研究：深度访谈、案例分析\n3. 混合方法：结合定量与定性分析\n\n建议先进行文献综述，确定理论框架，再选择具体方法。',
          confidence: 0.85
        };
        onSuggestion?.(suggestion);
      }
    },
    {
      id: 'data-analysis',
      title: '数据分析指导',
      description: '统计分析方法推荐',
      icon: '📊',
      action: () => {
        const suggestion: AgentSuggestion = {
          id: 'data-analysis-' + Date.now(),
          type: 'enhancement',
          title: '数据分析建议',
          content: '根据您的数据类型，推荐以下分析方法：\n\n描述性统计：\n- 均值、标准差、分布特征\n- 相关性分析\n\n推断性统计：\n- t检验（比较均值差异）\n- 回归分析（预测关系）\n- 方差分析（多组比较）\n\n建议使用SPSS、R或Python进行分析。',
          confidence: 0.90
        };
        onSuggestion?.(suggestion);
      }
    },
    {
      id: 'ethics-check',
      title: '研究伦理审查',
      description: '研究伦理要点检查',
      icon: '⚖️',
      action: () => {
        const suggestion: AgentSuggestion = {
          id: 'ethics-' + Date.now(),
          type: 'warning',
          title: '研究伦理提醒',
          content: '请确保您的研究符合伦理要求：\n\n1. 知情同意：参与者充分了解研究目的\n2. 隐私保护：确保数据匿名和保密\n3. 风险评估：最小化对参与者的潜在伤害\n4. 公正性：公平选择研究对象\n\n如涉及人体研究，需要获得伦理委员会批准。',
          confidence: 0.95
        };
        onSuggestion?.(suggestion);
      }
    }
  ];

  // 研究数据库推荐
  const databases = [
    { name: 'Google Scholar', description: '免费学术搜索引擎', url: '#' },
    { name: 'PubMed', description: '生物医学文献数据库', url: '#' },
    { name: 'IEEE Xplore', description: '工程技术文献', url: '#' },
    { name: 'JSTOR', description: '学术期刊归档', url: '#' },
    { name: 'Web of Science', description: '科学引文索引', url: '#' },
    { name: 'CNKI', description: '中国知网', url: '#' }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 助手介绍 */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">🔬</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">研究助手</h3>
            <p className="text-sm text-gray-600">
              协助文献检索、研究方法选择和数据分析指导
            </p>
          </div>
        </div>
      </Card>

      {/* 研究工具 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">研究工具箱</h4>
        <div className="grid grid-cols-2 gap-2">
          {researchTools.map((tool) => (
            <Button
              key={tool.id}
              variant="outline"
              size="sm"
              onClick={tool.action}
              disabled={isSearching}
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

      {/* 文献检索结果 */}
      {searchResults.length > 0 && (
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            检索结果 ({searchResults.length}篇)
          </h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {searchResults.slice(0, 5).map((result) => (
              <div key={result.id} className="border border-gray-200 rounded p-3">
                <h5 className="text-sm font-medium text-gray-900 mb-1">
                  {result.title}
                </h5>
                <p className="text-xs text-gray-600 mb-2">
                  {result.authors.join(', ')} ({result.year})
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{result.journal}</span>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      相关度: {result.relevance}%
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      引用: {result.citations}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex space-x-2">
                  <Button size="sm" variant="ghost" className="text-xs">
                    📖 查看摘要
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs">
                    📚 添加引用
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs">
                    🔗 访问链接
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 数据库推荐 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">推荐数据库</h4>
        <div className="grid grid-cols-2 gap-2">
          {databases.map((db) => (
            <button
              key={db.name}
              className="text-left p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              <div className="text-sm font-medium text-gray-900">{db.name}</div>
              <div className="text-xs text-gray-500">{db.description}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* 研究进度追踪 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">研究进度</h4>
        <div className="space-y-2">
          {[
            { phase: '文献综述', progress: 75, status: 'in-progress' },
            { phase: '理论框架', progress: 45, status: 'in-progress' },
            { phase: '研究设计', progress: 20, status: 'pending' },
            { phase: '数据收集', progress: 0, status: 'pending' }
          ].map((item) => (
            <div key={item.phase} className="flex items-center space-x-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">
                    {item.phase}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.status === 'in-progress' 
                        ? 'bg-blue-600' 
                        : item.status === 'completed'
                        ? 'bg-green-600'
                        : 'bg-gray-300'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 研究提示 */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-2">
          <span className="text-blue-600 text-sm">💡</span>
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">研究建议：</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>定期更新文献检索，关注最新研究进展</li>
              <li>建立系统的文献管理体系</li>
              <li>注意研究方法的适用性和局限性</li>
              <li>保持研究伦理的高度敏感性</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResearchAssistant;