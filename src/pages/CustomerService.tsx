import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Phone, 
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  Edit3,
  Shield,
  Star,
  Users,
  Zap,
  ThumbsUp,
  Search,
  ChevronDown,
  ChevronRight,
  Send,
  ArrowLeft,
  ExternalLink,
  Gift,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  helpful: number;
  tags: string[];
}

interface ServiceGuarantee {
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

interface ContactOption {
  method: string;
  description: string;
  availability: string;
  responseTime: string;
  icon: React.ReactNode;
  action: () => void;
}

const CustomerService: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFAQ, setSelectedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  const faqs: FAQ[] = [
    {
      id: '1',
      category: '写作服务',
      question: '如何确保Essay的原创性？',
      answer: '我们使用多重检测系统确保原创性：1) 专业写手原创写作；2) AI检测工具验证；3) 查重软件检查；4) 人工审核确认。每篇文章都会提供详细的原创性报告。',
      helpful: 145,
      tags: ['原创性', 'AI检测', '质量保证']
    },
    {
      id: '2',
      category: '写作服务',
      question: '写作周期一般需要多长时间？',
      answer: '写作周期根据字数和复杂程度而定：1000字Essay通常2-4小时；2000字Essay需要4-8小时；3000字以上可能需要8-12小时。我们也提供加急服务。',
      helpful: 132,
      tags: ['写作时间', '加急服务', '交付周期']
    },
    {
      id: '3',
      category: '修改服务',
      question: '可以申请免费修改吗？',
      answer: '是的！我们提供30天免费修改保障。如果您对内容不满意，可以在交付后30天内申请免费修改。修改包括：内容调整、格式优化、引用修正等。',
      helpful: 189,
      tags: ['免费修改', '售后保障', '30天保证']
    },
    {
      id: '4',
      category: '付款相关',
      question: '支持哪些付款方式？',
      answer: '我们支持多种安全的付款方式：信用卡(Visa/MasterCard)、PayPal、支付宝、微信支付。所有交易都采用SSL加密保护。',
      helpful: 98,
      tags: ['付款方式', '安全支付', 'SSL加密']
    },
    {
      id: '5',
      category: '质量保证',
      question: '如何保证学术写作的质量？',
      answer: '我们的质量保证体系包括：1) 硕博学历写手团队；2) 多轮质量审核；3) 学术格式检查；4) 语言质量把控；5) 最终质量评估报告。',
      helpful: 156,
      tags: ['质量保证', '学术标准', '专业团队']
    },
    {
      id: '6',
      category: '技术支持',
      question: '网站使用过程中遇到问题怎么办？',
      answer: '如遇技术问题，请：1) 查看帮助文档；2) 联系在线客服；3) 发送邮件至support@essaypass.com；4) 电话联系400-xxx-xxxx。我们提供7×24小时技术支持。',
      helpful: 87,
      tags: ['技术支持', '在线客服', '联系方式']
    }
  ];

  const serviceGuarantees: ServiceGuarantee[] = [
    {
      title: '30天免费修改',
      description: '交付后30天内可申请无限次免费修改',
      icon: <Edit3 className="w-6 h-6 text-blue-500" />,
      details: [
        '内容结构调整',
        '论证逻辑优化',
        '语言表达改进',
        '格式规范修正'
      ]
    },
    {
      title: '100%原创保证',
      description: '确保每篇文章都是原创写作，通过AI检测',
      icon: <Shield className="w-6 h-6 text-green-500" />,
      details: [
        'AI原创性检测',
        '查重软件验证',
        '人工审核确认',
        '原创性证书'
      ]
    },
    {
      title: '7×24客服支持',
      description: '全天候客服团队，随时解答您的问题',
      icon: <MessageSquare className="w-6 h-6 text-purple-500" />,
      details: [
        '在线实时客服',
        '电话技术支持',
        '邮件详细解答',
        '社交媒体响应'
      ]
    },
    {
      title: '学术标准保证',
      description: '严格按照国际学术写作标准执行',
      icon: <Award className="w-6 h-6 text-orange-500" />,
      details: [
        'APA/MLA格式',
        '学术引用规范',
        '语言专业性',
        '逻辑严密性'
      ]
    }
  ];

  const contactOptions: ContactOption[] = [
    {
      method: '在线客服',
      description: '即时聊天，快速解决问题',
      availability: '7×24小时',
      responseTime: '< 2分钟',
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
      action: () => console.log('启动在线客服')
    },
    {
      method: '电话咨询',
      description: '直接通话，详细沟通',
      availability: '周一至周日 8:00-22:00',
      responseTime: '立即接听',
      icon: <Phone className="w-5 h-5 text-green-500" />,
      action: () => console.log('拨打客服电话')
    },
    {
      method: '邮件支持',
      description: '详细描述问题，获得专业解答',
      availability: '7×24小时',
      responseTime: '< 4小时',
      icon: <Mail className="w-5 h-5 text-purple-500" />,
      action: () => console.log('发送邮件')
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const faqCategories = [...new Set(faqs.map(faq => faq.category))];

  const handleFeedbackSubmit = () => {
    if (feedbackMessage.trim()) {
      console.log('提交反馈:', { rating: selectedRating, message: feedbackMessage });
      setFeedbackMessage('');
      setSelectedRating(0);
      // 显示成功提示
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
              <Users className="w-6 h-6 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900">客户服务中心</h1>
            </div>
          </div>
          <p className="text-gray-600">为您提供全方位的服务支持，确保最佳的使用体验</p>
        </div>

        {/* 快速联系卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {contactOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={option.action}>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{option.method}</h3>
                    <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{option.availability}</span>
                      <span className="font-medium text-blue-600">{option.responseTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">常见问题</TabsTrigger>
            <TabsTrigger value="revision">修改申请</TabsTrigger>
            <TabsTrigger value="guarantee">服务保障</TabsTrigger>
            <TabsTrigger value="feedback">用户反馈</TabsTrigger>
          </TabsList>

          {/* 常见问题标签页 */}
          <TabsContent value="faq" className="space-y-6">
            {/* 搜索框 */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="搜索问题或关键词..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ分类和内容 */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* 分类导航 */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">问题分类</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {faqCategories.map((category) => (
                      <button key={category} className="w-full text-left p-2 rounded hover:bg-gray-100 text-sm">
                        {category}
                        <span className="float-right text-gray-400">
                          {faqs.filter(faq => faq.category === category).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ内容 */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5" />
                    <span>常见问题解答</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredFAQs.map((faq) => (
                      <div key={faq.id} className="border rounded-lg">
                        <button
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                          onClick={() => setSelectedFAQ(selectedFAQ === faq.id ? null : faq.id)}
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{faq.question}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">{faq.category}</Badge>
                              <span className="text-xs text-gray-500">{faq.helpful} 人觉得有用</span>
                            </div>
                          </div>
                          {selectedFAQ === faq.id ? 
                            <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          }
                        </button>
                        
                        {selectedFAQ === faq.id && (
                          <div className="p-4 border-t bg-gray-50">
                            <p className="text-gray-700 mb-3">{faq.answer}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-2">
                                {faq.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <span className="text-gray-500">这个回答有用吗？</span>
                                <Button size="sm" variant="ghost">
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  有用
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 修改申请标签页 */}
          <TabsContent value="revision" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit3 className="w-5 h-5" />
                  <span>修改申请流程</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  {[
                    { step: 1, title: '提交申请', desc: '填写修改需求表单' },
                    { step: 2, title: '需求评估', desc: '客服确认修改范围' },
                    { step: 3, title: '安排修改', desc: '分配专业写手修改' },
                    { step: 4, title: '完成交付', desc: '修改完成后重新交付' }
                  ].map((item) => (
                    <div key={item.step} className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-blue-600 font-bold">{item.step}</span>
                      </div>
                      <h4 className="font-medium mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">订单编号</label>
                    <Input placeholder="请输入您的订单编号，如 #EP123456" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">修改类型</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['内容调整', '格式修正', '语言润色', '引用修改'].map((type) => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">详细说明</label>
                    <textarea 
                      className="w-full h-32 p-3 border rounded-lg resize-none"
                      placeholder="请详细描述您的修改需求..."
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">保存草稿</Button>
                    <Button>提交申请</Button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">修改说明</h4>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• 30天内可申请免费修改，超出期限将收取额外费用</li>
                        <li>• 修改申请会在24小时内得到响应</li>
                        <li>• 重大结构调整可能需要额外时间</li>
                        <li>• 修改完成后会重新进行质量检查</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 服务保障标签页 */}
          <TabsContent value="guarantee" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceGuarantees.map((guarantee, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {guarantee.icon}
                      <span>{guarantee.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{guarantee.description}</p>
                    <div className="space-y-2">
                      {guarantee.details.map((detail, i) => (
                        <div key={i} className="flex items-center space-x-2 text-sm">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="w-5 h-5" />
                  <span>额外保障服务</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">隐私保护</h4>
                    <p className="text-sm text-gray-600">严格保护客户信息，绝不泄露</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">加急服务</h4>
                    <p className="text-sm text-gray-600">紧急情况下提供加急处理</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">专业团队</h4>
                    <p className="text-sm text-gray-600">硕博学历的专业写手团队</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 用户反馈标签页 */}
          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>用户反馈系统</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">服务评分</h4>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setSelectedRating(rating)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Star className={`w-6 h-6 ${
                            rating <= selectedRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">详细反馈</label>
                    <textarea 
                      className="w-full h-32 p-3 border rounded-lg resize-none"
                      placeholder="请分享您的使用体验、建议或遇到的问题..."
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                    />
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">反馈类型</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['服务质量', '网站功能', '价格建议', '其他建议'].map((type) => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleFeedbackSubmit}>
                      <Send className="w-4 h-4 mr-2" />
                      提交反馈
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 用户评价展示 */}
            <Card>
              <CardHeader>
                <CardTitle>用户评价</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: '张同学', rating: 5, comment: '服务非常专业，Essay质量很高，按时交付。', time: '2天前' },
                    { name: '李同学', rating: 5, comment: '客服响应很快，修改服务很到位，推荐！', time: '1周前' },
                    { name: '王同学', rating: 4, comment: '整体满意，就是价格稍微有点贵。', time: '2周前' }
                  ].map((review, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.name}</span>
                          <div className="flex">
                            {Array.from({length: review.rating}).map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.time}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 联系信息卡片 */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">还有其他问题？</h3>
              <p className="text-gray-600 mb-4">我们的客服团队随时为您提供帮助</p>
              <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@essaypass.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>400-xxx-xxxx</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>7×24小时服务</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerService;