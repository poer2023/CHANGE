import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WritingDashboard from '../../components/analytics/WritingDashboard';
import { usePaperStore } from '../../store/paperStore';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';

interface AnalyticsPageProps {
  className?: string;
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ className = '' }) => {
  const { paperId } = useParams<{ paperId?: string }>();
  const navigate = useNavigate();
  const { papers, currentPaper, fetchPaper, setCurrentPaper } = usePaperStore();
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);
  const [analysisMode, setAnalysisMode] = useState<'single' | 'comparative' | 'overview'>('single');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paperId) {
      loadPaperData(paperId);
      setAnalysisMode('single');
    } else {
      setAnalysisMode('overview');
    }
  }, [paperId]);

  const loadPaperData = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchPaper(id);
    } catch (err) {
      setError('加载论文数据失败');
      console.error('Error loading paper:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaperSelect = (paperId: string) => {
    if (analysisMode === 'single') {
      navigate(`/analytics/${paperId}`);
    } else if (analysisMode === 'comparative') {
      setSelectedPaperIds(prev => {
        if (prev.includes(paperId)) {
          return prev.filter(id => id !== paperId);
        } else if (prev.length < 3) {
          return [...prev, paperId];
        }
        return prev;
      });
    }
  };

  const getAnalyticsSummary = () => {
    if (!papers.length) return null;

    const totalWords = papers.reduce((sum, paper) => sum + (paper.wordCount || 0), 0);
    const completedPapers = papers.filter(paper => paper.status === 'completed').length;
    const averageQuality = papers.length > 0 ? 75 : 0; // 模拟质量分数

    return {
      totalWords,
      completedPapers,
      totalPapers: papers.length,
      averageQuality,
      productivityTrend: '+12%' // 模拟趋势
    };
  };

  const summary = getAnalyticsSummary();

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <span className="ml-4 text-gray-600">加载分析数据中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">加载失败</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-3">
              <Button onClick={() => window.location.reload()}>
                重新加载
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                返回首页
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">写作分析中心</h1>
              <p className="text-gray-600 mt-2">
                深度分析您的写作表现，提供个性化的改进建议
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* 分析模式切换 */}
              <div className="flex bg-white rounded-lg border p-1">
                {[
                  { key: 'overview', label: '总览', icon: '📊' },
                  { key: 'single', label: '单篇', icon: '📄' },
                  { key: 'comparative', label: '对比', icon: '⚖️' }
                ].map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => setAnalysisMode(mode.key as any)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      analysisMode === mode.key
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{mode.icon}</span>
                    {mode.label}
                  </button>
                ))}
              </div>
              
              <Button
                onClick={() => navigate('/papers')}
                variant="outline"
                size="sm"
              >
                管理论文
              </Button>
            </div>
          </div>
        </div>

        {/* 总览仪表板 */}
        {analysisMode === 'overview' && summary && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">总字数</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {summary.totalWords.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-blue-500 text-3xl">📝</div>
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">完成论文</p>
                    <p className="text-2xl font-bold text-green-900">
                      {summary.completedPapers}/{summary.totalPapers}
                    </p>
                  </div>
                  <div className="text-green-500 text-3xl">✅</div>
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">平均质量</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {summary.averageQuality}分
                    </p>
                  </div>
                  <div className="text-yellow-500 text-3xl">⭐</div>
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">效率趋势</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {summary.productivityTrend}
                    </p>
                  </div>
                  <div className="text-purple-500 text-3xl">📈</div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* 论文选择器 */}
        {analysisMode !== 'overview' && papers.length > 0 && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {analysisMode === 'single' ? '选择要分析的论文' : '选择要对比的论文 (最多3篇)'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {papers.map((paper) => (
                <div
                  key={paper.id}
                  onClick={() => handlePaperSelect(paper.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    (analysisMode === 'single' && currentPaper?.id === paper.id) ||
                    (analysisMode === 'comparative' && selectedPaperIds.includes(paper.id))
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 line-clamp-2 flex-1">
                      {paper.title}
                    </h4>
                    {analysisMode === 'comparative' && selectedPaperIds.includes(paper.id) && (
                      <div className="ml-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{paper.wordCount?.toLocaleString() || 0} 字</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      paper.status === 'completed' ? 'bg-green-100 text-green-800' :
                      paper.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {paper.status === 'completed' ? '已完成' :
                       paper.status === 'draft' ? '草稿' : '未知'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {analysisMode === 'comparative' && selectedPaperIds.length > 0 && (
              <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-700 text-sm">
                  已选择 {selectedPaperIds.length} 篇论文进行对比分析
                </span>
                <Button
                  size="sm"
                  disabled={selectedPaperIds.length < 2}
                  onClick={() => {
                    // 这里可以实现对比分析逻辑
                    console.log('开始对比分析:', selectedPaperIds);
                  }}
                >
                  开始对比
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* 空状态 */}
        {papers.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无论文数据</h3>
            <p className="text-gray-600 mb-6">
              您还没有创建任何论文。创建您的第一篇论文来开始分析吧！
            </p>
            <div className="space-x-3">
              <Button onClick={() => navigate('/create')}>
                创建论文
              </Button>
              <Button variant="outline" onClick={() => navigate('/form')}>
                使用表单创建
              </Button>
            </div>
          </Card>
        )}

        {/* 主要分析区域 */}
        {((analysisMode === 'single' && currentPaper) || analysisMode === 'overview') && (
          <div className="space-y-8">
            <WritingDashboard 
              paperId={analysisMode === 'single' ? currentPaper?.id : undefined}
              className="animate-fade-in"
            />
          </div>
        )}

        {/* 对比分析区域 */}
        {analysisMode === 'comparative' && selectedPaperIds.length >= 2 && (
          <Card className="p-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">对比分析结果</h3>
            <div className="text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">🔄</div>
              <p>对比分析功能正在开发中...</p>
              <p className="text-sm mt-2">将支持多篇论文的质量、进度、风格等维度对比</p>
            </div>
          </Card>
        )}

        {/* 快速操作面板 */}
        <Card className="p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
          <h3 className="font-semibold text-primary-900 mb-3">快速操作</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/create')}
              className="justify-start"
            >
              <span className="mr-2">📝</span>
              创建新论文
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                // 导出分析报告的逻辑
                console.log('导出分析报告');
              }}
              className="justify-start"
            >
              <span className="mr-2">📊</span>
              导出报告
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/papers')}
              className="justify-start"
            >
              <span className="mr-2">📋</span>
              管理论文
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;