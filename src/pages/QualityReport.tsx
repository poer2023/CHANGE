import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle,
  FileText, 
  BarChart3,
  Eye,
  Brain,
  Award,
  Download,
  TrendingUp,
  Target,
  Zap,
  Search,
  Clock,
  Users,
  Star,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AIDetectionResult {
  overallScore: number;
  confidence: number;
  details: {
    humanWritten: number;
    aiGenerated: number;
    mixed: number;
  };
  segments: Array<{
    text: string;
    probability: number;
    classification: 'human' | 'ai' | 'uncertain';
  }>;
}

interface PlagiarismResult {
  similarityIndex: number;
  uniqueContent: number;
  sourcesFound: number;
  matches: Array<{
    source: string;
    similarity: number;
    matchedText: string;
    url?: string;
  }>;
}

interface FormatCheck {
  category: string;
  score: number;
  status: 'pass' | 'warning' | 'fail';
  details: string[];
  recommendations?: string[];
}

interface AcademicStandard {
  criterion: string;
  score: number;
  level: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement';
  description: string;
  evidence: string[];
}

const QualityReport: React.FC = () => {
  const navigate = useNavigate();
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  // AI检测结果数据
  const aiDetection: AIDetectionResult = {
    overallScore: 87.2,
    confidence: 94.8,
    details: {
      humanWritten: 87.2,
      aiGenerated: 8.3,
      mixed: 4.5
    },
    segments: [
      { text: "The rapid advancement of artificial intelligence...", probability: 12.3, classification: 'ai' },
      { text: "In contemporary academic discourse, the integration...", probability: 91.7, classification: 'human' },
      { text: "Furthermore, empirical studies demonstrate that...", probability: 88.4, classification: 'human' },
      { text: "The methodology employed in this research follows...", probability: 15.6, classification: 'ai' },
      { text: "These findings suggest significant implications...", probability: 93.2, classification: 'human' }
    ]
  };

  // 查重检测结果
  const plagiarismResult: PlagiarismResult = {
    similarityIndex: 12.8,
    uniqueContent: 87.2,
    sourcesFound: 3,
    matches: [
      {
        source: "Smith, J. (2023). Modern AI Applications",
        similarity: 5.2,
        matchedText: "artificial intelligence has transformed various sectors",
        url: "https://example.com/smith-2023"
      },
      {
        source: "Academic Database - IEEE",
        similarity: 4.1,
        matchedText: "machine learning algorithms demonstrate significant",
        url: "https://ieeexplore.ieee.org/example"
      },
      {
        source: "Johnson, M. & Lee, K. (2022)",
        similarity: 3.5,
        matchedText: "empirical evidence suggests that implementation"
      }
    ]
  };

  // 格式检查结果
  const formatChecks: FormatCheck[] = [
    {
      category: 'APA引用格式',
      score: 100,
      status: 'pass',
      details: [
        '所有文内引用格式正确',
        '参考文献列表符合APA第7版标准',
        '引用年份和页码格式规范'
      ]
    },
    {
      category: '文档结构',
      score: 98,
      status: 'pass',
      details: [
        '标题层级结构清晰',
        '段落间距和缩进一致',
        '页眉页脚格式标准'
      ]
    },
    {
      category: '语言规范',
      score: 94,
      status: 'pass',
      details: [
        '学术语言使用得当',
        '语法和拼写检查通过',
        '术语使用一致性良好'
      ],
      recommendations: [
        '建议在第三段使用更正式的学术表达',
        '考虑统一部分专业术语的翻译'
      ]
    },
    {
      category: '图表格式',
      score: 92,
      status: 'pass',
      details: [
        '图表编号和标题规范',
        '数据来源标注完整'
      ],
      recommendations: [
        '建议调整表格1的字体大小以提高可读性'
      ]
    }
  ];

  // 学术标准符合性
  const academicStandards: AcademicStandard[] = [
    {
      criterion: '论证逻辑性',
      score: 92,
      level: 'excellent',
      description: '论文逻辑结构清晰，论证过程严密',
      evidence: [
        '引言部分明确提出研究问题',
        '文献综述全面且相关性强',
        '结论与论证过程高度一致'
      ]
    },
    {
      criterion: '研究方法科学性',
      score: 89,
      level: 'good',
      description: '研究方法选择合适，执行规范',
      evidence: [
        '方法论部分详细描述研究设计',
        '数据收集和分析方法适当',
        '考虑了研究局限性'
      ]
    },
    {
      criterion: '文献引用质量',
      score: 95,
      level: 'excellent',
      description: '引用文献权威且时效性强',
      evidence: [
        '75%的引用来自近5年的学术期刊',
        '引用来源多样化，包含核心期刊文章',
        '引用与论点高度相关'
      ]
    },
    {
      criterion: '学术写作规范',
      score: 91,
      level: 'excellent',
      description: '符合高等教育学术写作标准',
      evidence: [
        '使用第三人称客观表述',
        '避免主观性和情感化语言',
        '保持学术语调的一致性'
      ]
    },
    {
      criterion: '创新性与贡献',
      score: 87,
      level: 'good',
      description: '在现有研究基础上提出新见解',
      evidence: [
        '识别了研究领域的空白',
        '提出了新的分析角度',
        '对实践具有指导意义'
      ]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">通过</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">警告</Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-800">不通过</Badge>;
      default:
        return <Badge variant="outline">待检查</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">优秀</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800">良好</Badge>;
      case 'satisfactory':
        return <Badge className="bg-yellow-100 text-yellow-800">合格</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">需改进</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900">质量检测报告</h1>
            </div>
          </div>
          <p className="text-gray-600">全面的AI检测、查重分析和学术质量评估报告</p>
          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>生成时间: {new Date().toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>文档: Academic_Essay_Final.docx</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>检测引擎: GPT-4 + Turnitin</span>
            </div>
          </div>
        </div>

        {/* 总体质量概览 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>质量概览</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{aiDetection.overallScore}%</div>
                <div className="text-sm text-gray-600">原创性评分</div>
                <div className="text-xs text-gray-500 mt-1">AI检测通过</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{plagiarismResult.uniqueContent}%</div>
                <div className="text-sm text-gray-600">内容独特性</div>
                <div className="text-xs text-gray-500 mt-1">查重检测通过</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">98%</div>
                <div className="text-sm text-gray-600">格式规范</div>
                <div className="text-xs text-gray-500 mt-1">APA标准符合</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">91</div>
                <div className="text-sm text-gray-600">学术质量</div>
                <div className="text-xs text-gray-500 mt-1">高等教育标准</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="ai-detection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai-detection">AI检测</TabsTrigger>
            <TabsTrigger value="plagiarism">查重检测</TabsTrigger>
            <TabsTrigger value="format">格式检查</TabsTrigger>
            <TabsTrigger value="academic">学术标准</TabsTrigger>
          </TabsList>

          {/* AI检测详情 */}
          <TabsContent value="ai-detection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI生成内容检测结果</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {aiDetection.details.humanWritten}%
                    </div>
                    <div className="text-sm text-gray-600">人类写作</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {aiDetection.details.aiGenerated}%
                    </div>
                    <div className="text-sm text-gray-600">AI生成</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                      {aiDetection.details.mixed}%
                    </div>
                    <div className="text-sm text-gray-600">混合内容</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">分段检测结果</h4>
                  {aiDetection.segments.map((segment, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        activeSegment === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setActiveSegment(activeSegment === index ? null : index)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">段落 {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          <Badge className={`
                            ${segment.classification === 'human' ? 'bg-green-100 text-green-800' :
                              segment.classification === 'ai' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}
                          `}>
                            {segment.classification === 'human' ? '人类写作' : 
                             segment.classification === 'ai' ? 'AI生成' : '不确定'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {segment.probability.toFixed(1)}% 人类
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{segment.text}</p>
                      <Progress 
                        value={segment.probability} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">检测结论</h4>
                      <p className="text-sm text-blue-700">
                        本文档显示出高度的人类写作特征，AI生成内容比例在可接受范围内。
                        检测置信度为 {aiDetection.confidence}%，符合学术原创性要求。
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 查重检测详情 */}
          <TabsContent value="plagiarism" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>相似度检测结果</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {plagiarismResult.uniqueContent}%
                    </div>
                    <div className="text-sm text-gray-600">独特内容</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                      {plagiarismResult.similarityIndex}%
                    </div>
                    <div className="text-sm text-gray-600">相似度指数</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {plagiarismResult.sourcesFound}
                    </div>
                    <div className="text-sm text-gray-600">匹配来源</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">相似内容详情</h4>
                  {plagiarismResult.matches.map((match, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">{match.source}</h5>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{match.similarity}% 相似</Badge>
                          {match.url && (
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">
                        "{match.matchedText}"
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">检测结论</h4>
                      <p className="text-sm text-green-700">
                        相似度指数 {plagiarismResult.similarityIndex}% 在可接受范围内（&lt;15%）。
                        检测到的相似内容主要为学术引用和常见表述，符合学术写作规范。
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 格式检查详情 */}
          <TabsContent value="format" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>格式规范检查</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {formatChecks.map((check, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{check.category}</h4>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(check.status)}
                          <span className={`font-bold ${getScoreColor(check.score)}`}>
                            {check.score}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <Progress value={check.score} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-green-700">✓ 检查通过项目</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {check.details.map((detail, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {check.recommendations && (
                        <div className="mt-3 space-y-2">
                          <h5 className="text-sm font-medium text-yellow-700">⚠ 优化建议</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {check.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-center space-x-2">
                                <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 学术标准评估 */}
          <TabsContent value="academic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>学术标准符合性评估</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {academicStandards.map((standard, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{standard.criterion}</h4>
                        <div className="flex items-center space-x-2">
                          {getLevelBadge(standard.level)}
                          <span className={`font-bold ${getScoreColor(standard.score)}`}>
                            {standard.score}/100
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <Progress value={standard.score} className="h-2" />
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{standard.description}</p>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-blue-700">📋 评估依据</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {standard.evidence.map((evidence, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <Star className="w-3 h-3 text-blue-500" />
                              <span>{evidence}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">综合评估结论</h4>
                      <p className="text-sm text-blue-700 mb-2">
                        本论文在所有学术标准维度上均达到良好以上水平，整体符合高等教育学术写作要求。
                        特别在文献引用质量和学术写作规范方面表现优秀。
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div className="text-center">
                          <div className="font-medium text-blue-900">平均分</div>
                          <div className="text-lg font-bold text-blue-600">90.8</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-blue-900">等级</div>
                          <div className="text-lg font-bold text-blue-600">优秀</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-blue-900">通过率</div>
                          <div className="text-lg font-bold text-blue-600">100%</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-blue-900">建议</div>
                          <div className="text-lg font-bold text-blue-600">发表</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 操作按钮 */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div>
                <h3 className="font-medium mb-1">质量检测完成</h3>
                <p className="text-sm text-gray-600">您的文档已通过所有质量检查，可以安心使用</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  下载报告
                </Button>
                <Button onClick={() => navigate('/delivery-complete')}>
                  <Eye className="w-4 h-4 mr-2" />
                  查看交付内容
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QualityReport;