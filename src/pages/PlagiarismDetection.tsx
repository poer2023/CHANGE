import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  ExternalLink,
  FileText,
  Download,
  RefreshCw,
  Save,
  History,
  Globe,
  BarChart3,
  Copy,
  ChevronDown,
  Upload,
  Type,
  Edit3
} from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import DetectionInputV2, { DetectionFile, HistoryItem } from '@/components/DetectionInputV2';

type DetectionState = 'idle' | 'running' | 'done' | 'error';

interface PlagiarismSource {
  title: string;
  url: string;
  similarity: number;
  confidence: 'high' | 'medium' | 'low';
  matches: Array<{
    userOffset: number;
    length: number;
    sourceOffset: number;
    excerptUser: string;
    excerptSource: string;
  }>;
}

interface PlagiarismResult {
  similarity: number;
  risk: 'high' | 'medium' | 'low';
  sources: PlagiarismSource[];
  largestSingleSource: number;
  elapsedMs: number;
  indexVersion: string;
  historyId?: string;
}

const PlagiarismDetection: React.FC = () => {
  const [state, setState] = useState<DetectionState>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveToHistory, setSaveToHistory] = useState(true);
  const [selectedInput, setSelectedInput] = useState<string>('');
  const [ignoreCitations, setIgnoreCitations] = useState(false);
  const [ignoreShortPhrases, setIgnoreShortPhrases] = useState(true);
  const { toast } = useToast();

  const getRiskInfo = (risk: string) => {
    switch (risk) {
      case 'high':
        return { 
          text: '高风险', 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertTriangle
        };
      case 'medium':
        return { 
          text: '中风险', 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Shield
        };
      case 'low':
        return { 
          text: '低风险', 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle
        };
      default:
        return { 
          text: '未知', 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Search
        };
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const simulateDetection = async () => {
    setState('running');
    setProgress(0);
    setError(null);

    try {
      // 模拟检测过程
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      // 模拟结果
      const mockSources: PlagiarismSource[] = [
        {
          title: 'Large-Scale Pretraining for Neural Machine Translation',
          url: 'https://arxiv.org/abs/2021.12345',
          similarity: 0.12,
          confidence: 'high',
          matches: [
            {
              userOffset: 560,
              length: 120,
              sourceOffset: 2204,
              excerptUser: '深度学习模型在自然语言处理任务中展现出了卓越的性能，特别是在大规模预训练的基础上。',
              excerptSource: 'Deep learning models have shown remarkable performance in natural language processing tasks, especially with large-scale pretraining.'
            }
          ]
        },
        {
          title: 'Attention Is All You Need - Google Research',
          url: 'https://papers.nips.cc/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html',
          similarity: 0.08,
          confidence: 'medium',
          matches: [
            {
              userOffset: 1200,
              length: 85,
              sourceOffset: 890,
              excerptUser: 'Transformer架构通过自注意力机制彻底改变了序列建模的方法。',
              excerptSource: 'The Transformer architecture revolutionized sequence modeling through self-attention mechanisms.'
            }
          ]
        },
        {
          title: '中文自然语言处理技术综述 - 知网',
          url: 'https://kns.cnki.net/example-paper',
          similarity: 0.04,
          confidence: 'medium',
          matches: [
            {
              userOffset: 2100,
              length: 95,
              sourceOffset: 1500,
              excerptUser: '中文文本处理面临着分词、词性标注等独特挑战，需要专门的技术方案。',
              excerptSource: '中文文本处理面临分词、词性标注等挑战，需要专门技术方案。'
            }
          ]
        }
      ];

      const totalSimilarity = mockSources.reduce((sum, source) => sum + source.similarity, 0);
      
      const mockResult: PlagiarismResult = {
        similarity: totalSimilarity,
        risk: totalSimilarity >= 0.3 ? 'high' : totalSimilarity >= 0.1 ? 'medium' : 'low',
        sources: mockSources,
        largestSingleSource: Math.max(...mockSources.map(s => s.similarity)),
        elapsedMs: 4820 + Math.random() * 2000,
        indexVersion: 'corpus-2025.08'
      };

      setResult(mockResult);
      setState('done');

      if (saveToHistory) {
        toast({
          title: "检测完成",
          description: "结果已保存到历史记录",
        });
      }
    } catch (err) {
      setError('检测服务暂时不可用，请稍后重试');
      setState('error');
    }
  };

  const handleFileSelect = (file: DetectionFile) => {
    setSelectedInput(`已选择文件: ${file.name}`);
  };

  const handleTextInput = (text: string) => {
    setSelectedInput(text);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setSelectedInput(`来自历史: ${item.name}`);
  };

  const handleDetectionStart = () => {
    simulateDetection();
  };

  const handleRetry = () => {
    setState('idle');
    setProgress(0);
    setError(null);
    setResult(null);
  };

  const handleExport = (format: 'json' | 'pdf' | 'suggestions') => {
    toast({
      title: `导出${format === 'suggestions' ? '修改建议' : format.toUpperCase()}`,
      description: "导出功能演示",
    });
  };

  const handleSaveResult = () => {
    toast({
      title: "保存成功",
      description: "检测结果已保存到历史记录",
    });
  };

  const additionalOptions = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor="ignore-citations" className="text-sm font-medium">
          忽略引用与参考文献
        </label>
        <Switch
          id="ignore-citations"
          checked={ignoreCitations}
          onCheckedChange={setIgnoreCitations}
        />
      </div>
      <div className="flex items-center justify-between">
        <label htmlFor="ignore-short" className="text-sm font-medium">
          忽略短语 (&lt;8字)
        </label>
        <Switch
          id="ignore-short"
          checked={ignoreShortPhrases}
          onCheckedChange={setIgnoreShortPhrases}
        />
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto p-6" style={{ maxWidth: '960px' }}>
            {/* 顶部栏 */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">抄袭与相似度检测</h1>
                  <p className="text-gray-600">
                    比对范围：Web • 学术库 • 自有语料 • corpus-2025.08
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* 输入内容下拉菜单 - 仅在有结果时显示 */}
                  {state === 'done' && result && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4 mr-2" />
                          输入内容
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-80">
                        <div className="p-3">
                          <div className="text-sm font-medium mb-2">当前检测内容:</div>
                          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded max-h-32 overflow-auto">
                            {selectedInput || '无输入内容'}
                          </div>
                        </div>
                        <DropdownMenuItem onClick={() => {
                          setState('idle');
                          setResult(null);
                        }}>
                          <Type className="h-4 w-4 mr-2" />
                          重新输入文本
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setState('idle');
                          setResult(null);
                        }}>
                          <Upload className="h-4 w-4 mr-2" />
                          上传新文件
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Button variant="outline" onClick={() => window.history.back()}>
                    <History className="h-4 w-4 mr-2" />
                    历史记录
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* 输入区 - 使用新的 v2 组件 */}
              {state !== 'done' && (
                <DetectionInputV2
                  onFileSelect={handleFileSelect}
                  onTextInput={handleTextInput}
                  onHistorySelect={handleHistorySelect}
                  onDetectionStart={handleDetectionStart}
                  disabled={state === 'running'}
                  saveToHistory={saveToHistory}
                  onSaveToHistoryChange={setSaveToHistory}
                  detectionType="plagiarism"
                  additionalOptions={additionalOptions}
                />
              )}
              
              {/* 收缩后的输入提示 - 仅在有结果时显示 */}
              {state === 'done' && result && (
                <Card className="bg-gray-50 border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>检测内容: {selectedInput.length > 0 ? selectedInput.length : '未知'} 字符</span>
                        <span className="text-gray-400">•</span>
                        <span>命中来源: {result.sources.length} 个</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setState('idle');
                          setResult(null);
                        }}
                      >
                        重新检测
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 运行状态 */}
              {state === 'running' && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        <Search className="h-5 w-5 text-blue-600 animate-pulse" />
                        <span className="font-medium">正在比对文献库...</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                        <span>进度: {progress}%</span>
                        <span>•</span>
                        <span>预计耗时: 5-8秒</span>
                      </div>
                      <Button variant="outline" onClick={() => setState('idle')}>
                        取消检测
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 错误状态 */}
              {state === 'error' && (
                <Card className="border-red-200">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
                      <div>
                        <h3 className="font-medium text-red-800 mb-2">检测失败</h3>
                        <p className="text-red-600">{error}</p>
                      </div>
                      <Button onClick={handleRetry}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        重新检测
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 结果区 */}
              {state === 'done' && result && (
                <div className="space-y-4">
                  {/* 结果总览卡 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        检测结果
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-600 mb-2">
                            {(result.similarity * 100).toFixed(1)}%
                          </div>
                          <p className="text-gray-600">总体相似度</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            {React.createElement(getRiskInfo(result.risk).icon, {
                              className: "h-5 w-5"
                            })}
                            <Badge className={getRiskInfo(result.risk).color}>
                              {getRiskInfo(result.risk).text}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">命中来源: </span>
                              <span>{result.sources.length}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">最大单一来源: </span>
                              <span>{(result.largestSingleSource * 100).toFixed(1)}%</span>
                            </div>
                            <div>
                              <span className="text-gray-600">检测耗时: </span>
                              <span>{(result.elapsedMs / 1000).toFixed(1)}s</span>
                            </div>
                            <div>
                              <span className="text-gray-600">库版本: </span>
                              <span>{result.indexVersion}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 来源分布卡 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-green-600" />
                        来源分布
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {result.sources.map((source, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm mb-1">{source.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>{source.url}</span>
                                  <ExternalLink className="h-3 w-3" />
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge variant="outline">
                                  {(source.similarity * 100).toFixed(1)}%
                                </Badge>
                                <span className={`text-xs ${getConfidenceColor(source.confidence)}`}>
                                  {source.confidence === 'high' ? '高可信' : 
                                   source.confidence === 'medium' ? '中可信' : '低可信'}
                                </span>
                              </div>
                            </div>
                            
                            <Progress value={source.similarity * 100} className="h-2 mb-3" />
                            
                            {/* 匹配片段 */}
                            <div className="space-y-2">
                              {source.matches.map((match, matchIndex) => (
                                <div key={matchIndex} className="text-xs bg-gray-50 p-2 rounded">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                      <span className="font-medium text-gray-700">用户文本:</span>
                                      <p className="mt-1 text-gray-600">"{match.excerptUser}"</p>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">来源文本:</span>
                                      <p className="mt-1 text-gray-600">"{match.excerptSource}"</p>
                                    </div>
                                  </div>
                                  <div className="mt-2 text-gray-500">
                                    位置: {match.userOffset} | 长度: {match.length}字符
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 操作区 */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-wrap gap-3">
                        <Button onClick={() => handleExport('json')} variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          导出JSON
                        </Button>
                        <Button onClick={() => handleExport('pdf')} variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          导出PDF
                        </Button>
                        <Button onClick={() => handleExport('suggestions')} variant="outline">
                          <Copy className="h-4 w-4 mr-2" />
                          导出修改建议
                        </Button>
                        <Button onClick={handleRetry} variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          重新检测
                        </Button>
                        <Button onClick={handleSaveResult} variant="outline">
                          <Save className="h-4 w-4 mr-2" />
                          保存结果
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PlagiarismDetection;