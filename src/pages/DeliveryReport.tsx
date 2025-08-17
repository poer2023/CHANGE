import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Download, 
  FileText, 
  Package, 
  Copy,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  Eye,
  Archive,
  Shield,
  Timer,
  RotateCcw,
  Star,
  Clock,
  Hash,
  PlayCircle
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

// Mock data
const mockOrderData = {
  orderId: 'ORD-2025-001234',
  finishedAt: '2025-01-17 15:30:00',
  stats: {
    totalChars: 12485,
    writingDurationMin: 245,
    revisions: 3,
    qualityScore: 92
  }
};

const mockFiles = [
  {
    id: '1',
    name: '完整Essay文档',
    kind: 'essay',
    formats: ['PDF', 'Word'],
    size: '2.4 MB',
    url: '#',
    previewUrl: '#',
    status: 'ready',
    sha256: 'a1b2c3d4e5f6...',
    description: '12,485 字符 / 24 页',
    generatedAt: '2025-01-17 15:30'
  },
  {
    id: '2', 
    name: '参考文献列表',
    kind: 'refs',
    formats: ['BibTeX', 'EndNote', 'Plain Text'],
    size: '156 KB',
    url: '#',
    status: 'ready',
    sha256: 'b2c3d4e5f6g7...',
    description: '45 条引用 / 标准格式',
    generatedAt: '2025-01-17 15:28'
  },
  {
    id: '3',
    name: '附录素材',
    kind: 'appendix', 
    formats: ['PDF'],
    size: '890 KB',
    url: '#',
    status: 'ready',
    sha256: 'c3d4e5f6g7h8...',
    description: '图表数据 / 补充资料',
    generatedAt: '2025-01-17 15:32'
  },
  {
    id: '4',
    name: '原文讲解',
    kind: 'explanation',
    formats: ['MP4', 'MP3'],
    size: '45.2 MB', 
    url: '#',
    previewUrl: '#',
    status: 'ready',
    sha256: 'd4e5f6g7h8i9...',
    description: '音频视频讲解 / 15分钟',
    generatedAt: '2025-01-17 15:40'
  }
];

const mockQualityData = {
  overall: {
    score: 92,
    verdict: 'pass',
    summary: '该Essay整体质量优秀，在原创性、学术规范、逻辑连贯等方面均表现良好，满足高标准要求。'
  },
  metrics: [
    {
      key: 'originality',
      name: '原创性检测',
      score: 96,
      status: 'pass',
      desc: '文档重复率低于5%，满足原创性要求',
      advice: ['保持当前写作风格', '继续使用多元化词汇表达']
    },
    {
      key: 'academic',
      name: '学术规范',
      score: 94,
      status: 'pass', 
      desc: '引用格式规范，符合学术写作标准',
      advice: ['引用格式已标准化', '学术语言使用得当']
    },
    {
      key: 'logic',
      name: '逻辑连贯',
      score: 90,
      status: 'pass',
      desc: '文章结构清晰，论证逻辑连贯',
      advice: ['段落过渡自然', '论点支撑充分']
    },
    {
      key: 'language',
      name: '语言质量',
      score: 88,
      status: 'pass',
      desc: '语言表达准确，用词恰当',
      advice: ['句式多样化良好', '专业术语使用准确']
    },
    {
      key: 'citation',
      name: '引用格式',
      score: 95,
      status: 'pass',
      desc: '引用格式统一，符合APA标准',
      advice: ['格式一致性良好', '来源可靠性高']
    },
    {
      key: 'structure',
      name: '结构完整性',
      score: 91,
      status: 'pass',
      desc: '文章结构完整，各部分比例合理',
      advice: ['章节安排合理', '内容分布均衡']
    }
  ]
};

const DeliveryReport: React.FC = () => {
  const { orderId } = useParams();
  const { toast } = useToast();
  const [expandedMetrics, setExpandedMetrics] = useState<string[]>([]);

  const handleDownload = (file: any) => {
    toast({
      title: "开始下载",
      description: `正在下载 ${file.name}`,
    });
  };

  const handlePreview = (file: any) => {
    toast({
      title: "打开预览",
      description: `正在预览 ${file.name}`,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "复制成功",
      description: "内容已复制到剪贴板",
    });
  };

  const handleBundleDownload = () => {
    toast({
      title: "正在打包",
      description: "正在生成ZIP文件，预计耗时 10-15 秒",
    });
  };

  const handleExportReport = () => {
    toast({
      title: "导出报告",
      description: "正在生成PDF报告",
    });
  };

  const toggleMetricExpansion = (key: string) => {
    setExpandedMetrics(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800 border-green-200';
      case 'need_improve': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fail': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pass': return '通过';
      case 'need_improve': return '需改进';
      case 'fail': return '不通过';
      default: return '未知';
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Success */}
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">交付完成</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span>完成时间: {mockOrderData.finishedAt}</span>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <span>订单号: {orderId || mockOrderData.orderId}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={() => handleCopy(orderId || mockOrderData.orderId)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">总字数</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {mockOrderData.stats.totalChars.toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 mb-1">
                  <Timer className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">写作用时</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {Math.floor(mockOrderData.stats.writingDurationMin / 60)}h {mockOrderData.stats.writingDurationMin % 60}m
                </span>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 mb-1">
                  <RotateCcw className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-gray-600">修改次数</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {mockOrderData.stats.revisions}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">质量评分</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {mockOrderData.stats.qualityScore}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="files" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="files" className="rounded-lg">交付内容</TabsTrigger>
            <TabsTrigger value="quality" className="rounded-lg">质量报告</TabsTrigger>
          </TabsList>

          {/* Tab 1: Deliverables */}
          <TabsContent value="files" className="space-y-4">
            <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    可下载文件
                  </CardTitle>
                  <Button onClick={handleBundleDownload} className="bg-green-600 hover:bg-green-700">
                    <Archive className="h-4 w-4 mr-2" />
                    下载全部
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockFiles.map((file) => (
                  <div key={file.id} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {file.kind === 'explanation' ? (
                            <PlayCircle className="h-5 w-5 text-blue-600" />
                          ) : (
                            <FileText className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{file.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{file.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>文件大小: {file.size}</span>
                            <span>•</span>
                            <span>生成时间: {file.generatedAt}</span>
                            {file.sha256 && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Hash className="h-3 w-3" />
                                  <span className="font-mono">{file.sha256.slice(0, 8)}...</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0"
                                    onClick={() => handleCopy(file.sha256)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.previewUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(file)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            预览
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDownload(file)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          下载文件
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Quality Report */}
          <TabsContent value="quality" className="space-y-4">
            {/* Overall Quality */}
            <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    综合质量评估
                  </CardTitle>
                  <Button variant="outline" onClick={handleExportReport}>
                    <Download className="h-4 w-4 mr-2" />
                    导出PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-700 mb-3">{mockQualityData.overall.summary}</p>
                    <Badge className={getStatusColor(mockQualityData.overall.verdict)}>
                      {getStatusText(mockQualityData.overall.verdict)}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {mockQualityData.overall.score}
                    </div>
                    <div className="text-sm text-gray-500">总评分</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality Metrics */}
            <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>质量指标详情</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockQualityData.metrics.map((metric) => (
                  <div key={metric.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{metric.name}</h4>
                          <Badge className={getStatusColor(metric.status)} variant="outline">
                            {getStatusText(metric.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{metric.desc}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32">
                          <Progress value={metric.score} className="h-3" />
                        </div>
                        <span className="text-lg font-bold text-gray-900 w-12 text-right">
                          {metric.score}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleMetricExpansion(metric.key)}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Advice */}
                    {expandedMetrics.includes(metric.key) && (
                      <div className="ml-4 p-3 bg-gray-50 rounded-lg border">
                        <h5 className="font-medium text-sm text-gray-900 mb-2">改进建议:</h5>
                        <ul className="space-y-1">
                          {metric.advice.map((advice, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="mr-2">•</span>
                              <span>{advice}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-2"
                                onClick={() => handleCopy(advice)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
};

export default DeliveryReport;