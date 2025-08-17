import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Bot, 
  User, 
  Clock, 
  FileText,
  Download,
  RefreshCw,
  Save,
  AlertTriangle,
  CheckCircle,
  History,
  Zap,
  Target,
  BarChart3,
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

interface AIDetectionResult {
  aiProbability: number;
  verdict: 'high_suspected_ai' | 'suspicious' | 'likely_human';
  confidence: 'low' | 'medium' | 'high';
  metrics: {
    perplexity: number;
    burstiness: number;
    templatePhraseRate: number;
    repetition: number;
  };
  highlights: Array<{
    excerpt: string;
    offset: number;
    reason: string;
  }>;
  chars: number;
  elapsedMs: number;
  model: string;
  historyId?: string;
}

const AIDetection: React.FC = () => {
  const [state, setState] = useState<DetectionState>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AIDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveToHistory, setSaveToHistory] = useState(true);
  const [selectedInput, setSelectedInput] = useState<string>('');
  const [showInputDropdown, setShowInputDropdown] = useState(false);
  const { toast } = useToast();

  const getVerdictInfo = (verdict: string) => {
    switch (verdict) {
      case 'high_suspected_ai':
        return { 
          text: '高疑似AI生成', 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: Bot
        };
      case 'suspicious':
        return { 
          text: '可疑', 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: AlertTriangle
        };
      case 'likely_human':
        return { 
          text: '可能为人类创作', 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: User
        };
      default:
        return { 
          text: '未知', 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: CheckCircle
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
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // 模拟结果
      const mockResult: AIDetectionResult = {
        aiProbability: Math.random() * 100,
        verdict: Math.random() > 0.5 ? 'high_suspected_ai' : Math.random() > 0.3 ? 'suspicious' : 'likely_human',
        confidence: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        metrics: {
          perplexity: 15 + Math.random() * 10,
          burstiness: Math.random() * 0.5,
          templatePhraseRate: Math.random() * 0.4,
          repetition: Math.random() * 0.3
        },
        highlights: [
          {
            excerpt: "这种表达方式显示出明显的模板化特征，缺乏人类写作中常见的自然变化。",
            offset: 1023,
            reason: "模板化短语"
          },
          {
            excerpt: "此段落的困惑度异常低，表明可能来自AI生成的内容。",
            offset: 2450,
            reason: "低变异性"
          }
        ],
        chars: selectedInput.length || Math.floor(Math.random() * 5000) + 1000,
        elapsedMs: 1420 + Math.random() * 1000,
        model: 'ai-detector-v1.3'
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

  const handleExport = (format: 'json' | 'pdf') => {
    toast({
      title: `导出${format.toUpperCase()}`,
      description: "导出功能演示",
    });
  };

  const handleSaveResult = () => {
    toast({
      title: "保存成功",
      description: "检测结果已保存到历史记录",
    });
  };

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
                  <h1 className="text-2xl font-bold mb-2">AI 生成可能性检测</h1>
                  <p className="text-gray-600">
                    基于先进算法分析文本的AI生成特征 • Model: v1.3
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
                  detectionType="ai"
                />
              )}
              
              {/* 收缩后的输入提示 - 仅在有结果时显示 */}
              {state === 'done' && result && (
                <Card className="bg-gray-50 border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>检测内容: {result.chars.toLocaleString()} 字符</span>
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
                        <Bot className="h-5 w-5 text-blue-600 animate-pulse" />
                        <span className="font-medium">正在分析文本特征...</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                        <span>进度: {progress}%</span>
                        <span>•</span>
                        <span>预计耗时: 2-3秒</span>
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
                        <Target className="h-5 w-5 text-blue-600" />
                        检测结果
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-600 mb-2">
                            {result.aiProbability.toFixed(1)}%
                          </div>
                          <p className="text-gray-600">AI生成概率</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            {React.createElement(getVerdictInfo(result.verdict).icon, {
                              className: "h-5 w-5"
                            })}
                            <Badge className={getVerdictInfo(result.verdict).color}>
                              {getVerdictInfo(result.verdict).text}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">置信度: </span>
                              <span className={getConfidenceColor(result.confidence)}>
                                {result.confidence === 'high' ? '高' : 
                                 result.confidence === 'medium' ? '中' : '低'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">字符数: </span>
                              <span>{result.chars.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">检测耗时: </span>
                              <span>{(result.elapsedMs / 1000).toFixed(1)}s</span>
                            </div>
                            <div>
                              <span className="text-gray-600">模型版本: </span>
                              <span>{result.model}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 证据/特征卡 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        写作特征分析
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* 特征得分 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">困惑度</span>
                              <span className="text-sm">{result.metrics.perplexity.toFixed(1)}</span>
                            </div>
                            <Progress value={result.metrics.perplexity * 4} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">突发度</span>
                              <span className="text-sm">{(result.metrics.burstiness * 100).toFixed(1)}%</span>
                            </div>
                            <Progress value={result.metrics.burstiness * 100} className="h-2" />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">模板化短语密度</span>
                              <span className="text-sm">{(result.metrics.templatePhraseRate * 100).toFixed(1)}%</span>
                            </div>
                            <Progress value={result.metrics.templatePhraseRate * 100} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">重复率</span>
                              <span className="text-sm">{(result.metrics.repetition * 100).toFixed(1)}%</span>
                            </div>
                            <Progress value={result.metrics.repetition * 100} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* 高亮片段 */}
                      <div>
                        <h4 className="font-medium mb-3">疑似AI片段</h4>
                        <div className="space-y-3">
                          {result.highlights.map((highlight, index) => (
                            <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                                  {highlight.reason}
                                </Badge>
                                <span className="text-xs text-gray-500">位置: {highlight.offset}</span>
                              </div>
                              <p className="text-sm italic">"{highlight.excerpt}"</p>
                            </div>
                          ))}
                        </div>
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

export default AIDetection;