import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  Download, 
  FileText, 
  Shield, 
  Star,
  Award,
  Clock,
  Users,
  ThumbsUp,
  Eye,
  BarChart3,
  Heart,
  Sparkles,
  Trophy,
  Gift,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DeliveryItem {
  id: string;
  title: string;
  description: string;
  fileSize: string;
  icon: React.ReactNode;
  downloadUrl: string;
  status: 'completed' | 'processing';
}

interface QualityMetric {
  label: string;
  value: number;
  status: 'excellent' | 'good' | 'acceptable';
  description: string;
}

const DeliveryComplete: React.FC = () => {
  const navigate = useNavigate();
  const [celebrationVisible, setCelebrationVisible] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});

  const deliveryItems: DeliveryItem[] = [
    {
      id: 'main-essay',
      title: '完整Essay文档',
      description: '高质量学术论文，包含完整结构和学术引用',
      fileSize: '2,487字 • 8页 • PDF/Word',
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      downloadUrl: '#',
      status: 'completed'
    },
    {
      id: 'ai-report',
      title: 'AI检测报告',
      description: '详细的AI原创性检测分析报告',
      fileSize: '原创度87.2% • 详细分析',
      icon: <Shield className="w-6 h-6 text-green-500" />,
      downloadUrl: '#',
      status: 'completed'
    },
    {
      id: 'format-report',
      title: '格式检查报告',
      description: 'APA引用格式和学术规范检查结果',
      fileSize: '100%符合 • APA标准',
      icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
      downloadUrl: '#',
      status: 'completed'
    },
    {
      id: 'references',
      title: '参考文献列表',
      description: '完整的学术资源引用清单',
      fileSize: '5篇学术资源 • 标准格式',
      icon: <Award className="w-6 h-6 text-orange-500" />,
      downloadUrl: '#',
      status: 'completed'
    }
  ];

  const qualityMetrics: QualityMetric[] = [
    { label: '原创性检测', value: 87.2, status: 'excellent', description: '优秀的原创性，超过行业标准' },
    { label: '学术质量', value: 94.1, status: 'excellent', description: '学术写作水平卓越' },
    { label: '格式规范', value: 100, status: 'excellent', description: '完全符合APA引用标准' },
    { label: '语言质量', value: 91.7, status: 'excellent', description: '语言表达清晰专业' },
    { label: '逻辑结构', value: 89.3, status: 'good', description: '论证逻辑清晰连贯' }
  ];

  const projectStats = {
    totalWords: 2487,
    writingTime: '2小时15分钟',
    revisions: 3,
    qualityScore: 92.5,
    aiConfidence: 98.2,
    clientSatisfaction: 97.8
  };

  // 庆祝动画效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setCelebrationVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // 模拟下载进度
  const handleDownload = (itemId: string) => {
    setDownloadProgress(prev => ({ ...prev, [itemId]: 0 }));
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const currentProgress = prev[itemId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          // 模拟下载完成
          setTimeout(() => {
            setDownloadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[itemId];
              return newProgress;
            });
          }, 1000);
          return prev;
        }
        return { ...prev, [itemId]: currentProgress + 10 };
      });
    }, 200);
  };

  const getQualityColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 庆祝横幅 */}
      {celebrationVisible && (
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="w-8 h-8 text-yellow-300" />
              <h2 className="text-2xl font-bold">🎉 恭喜！您的Essay已完美交付！</h2>
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </div>
            <p className="text-lg opacity-90">高质量学术论文已准备就绪，感谢您选择我们的专业服务</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">交付完成</h1>
          <p className="text-xl text-gray-600">您的Essay已成功完成并通过所有质量检查</p>
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>完成时间: {new Date().toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>订单编号: #EP{Date.now().toString().slice(-6)}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="delivery" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="delivery">交付内容</TabsTrigger>
            <TabsTrigger value="quality">质量报告</TabsTrigger>
            <TabsTrigger value="satisfaction">满意度调查</TabsTrigger>
            <TabsTrigger value="support">后续服务</TabsTrigger>
          </TabsList>

          {/* 交付内容标签页 */}
          <TabsContent value="delivery" className="space-y-6">
            {/* 项目统计概览 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {[
                { label: '总字数', value: projectStats.totalWords.toLocaleString(), icon: FileText, color: 'blue' },
                { label: '写作用时', value: projectStats.writingTime, icon: Clock, color: 'green' },
                { label: '修改次数', value: projectStats.revisions, icon: Eye, color: 'purple' },
                { label: '质量评分', value: projectStats.qualityScore, icon: Award, color: 'orange' },
                { label: 'AI信心', value: `${projectStats.aiConfidence}%`, icon: Shield, color: 'red' },
                { label: '满意度', value: `${projectStats.clientSatisfaction}%`, icon: Heart, color: 'pink' }
              ].map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-4 pb-4">
                    <stat.icon className={`w-6 h-6 text-${stat.color}-500 mx-auto mb-2`} />
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 下载文件区域 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>下载您的交付内容</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deliveryItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <p className="text-xs text-gray-500 mb-3">{item.fileSize}</p>
                          
                          {downloadProgress[item.id] !== undefined ? (
                            <div className="space-y-2">
                              <Progress value={downloadProgress[item.id]} className="h-2" />
                              <p className="text-xs text-blue-600">下载中... {downloadProgress[item.id]}%</p>
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => handleDownload(item.id)}
                              className="w-full"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              下载文件
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Gift className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">打包下载</h4>
                      <p className="text-sm text-blue-700 mb-3">一键下载所有交付文件，包含完整的项目材料</p>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        下载全部文件 (ZIP)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 质量报告标签页 */}
          <TabsContent value="quality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>综合质量评估</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {qualityMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{metric.label}</h4>
                          <Badge className={getQualityColor(metric.status)}>
                            {metric.status === 'excellent' ? '优秀' : metric.status === 'good' ? '良好' : '合格'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{metric.description}</p>
                        <div className="mt-2">
                          <Progress value={metric.value} className="h-2" />
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`text-2xl font-bold ${
                          metric.status === 'excellent' ? 'text-green-600' : 
                          metric.status === 'good' ? 'text-blue-600' : 'text-yellow-600'
                        }`}>
                          {metric.value}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-900">质量保证认证</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    您的Essay已通过我们的多重质量检查体系，包括AI检测、格式审查、学术标准验证等环节。
                    我们保证内容的原创性和学术规范性。
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 满意度调查标签页 */}
          <TabsContent value="satisfaction" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>用户满意度调查</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-4">请为本次服务体验评分</h3>
                    <div className="flex justify-center space-x-2 mb-6">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button key={rating} className="p-2 hover:bg-gray-100 rounded">
                          <Star className="w-8 h-8 text-yellow-400 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">服务质量评价</h4>
                      <div className="space-y-3">
                        {[
                          '内容质量',
                          '交付及时性',
                          '客服响应',
                          '整体体验'
                        ].map((item) => (
                          <div key={item} className="flex items-center justify-between">
                            <span className="text-sm">{item}</span>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <Star key={rating} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">意见反馈</h4>
                      <textarea 
                        className="w-full h-32 p-3 border rounded-lg resize-none"
                        placeholder="请分享您的使用体验和建议..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button variant="outline">
                      稍后填写
                    </Button>
                    <Button>
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      提交评价
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 后续服务标签页 */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>客户服务</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    联系客服
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    修改申请
                  </Button>
                  <Button className="w-full justify-start" variant="outline" 
                    onClick={() => navigate('/quality-report')}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    查看详细报告
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-5 h-5" />
                    <span>服务保障</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>30天免费修改保障</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>100%原创性保证</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>7×24小时客服支持</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>学术格式规范保证</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">感谢您选择我们的服务！</h3>
                  <p className="text-gray-600 mb-4">
                    如有任何问题或需要进一步帮助，请随时联系我们的客服团队
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button onClick={() => navigate('/')}>
                      返回首页
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/customer-service')}>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      访问客服中心
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeliveryComplete;