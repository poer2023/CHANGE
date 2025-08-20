import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Shield, CheckCircle, FileText, MessageSquare, Download, ExternalLink, 
  Star, Users, Award, BookOpen, Target, Clock, TrendingUp, Eye, 
  Zap, Lock, Database, GraduationCap, AlertTriangle, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import existing images
import heroImage from '@/assets/hero-proof-of-authorship-dashboard.webp';
import citationPanel from '@/assets/citation-verification-panel.webp';
import painPointsSolutions from '@/assets/pain-points-solutions.webp';
import evidencePackage from '@/assets/evidence-package-thumbnails.webp';
import threeStepProcess from '@/assets/three-step-process.webp';
import HeroCarousel from '@/components/HeroCarousel';

const AcademicProofWriting = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-section]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleFreeTrial = () => {
    // Analytics tracking
    document.dispatchEvent(new CustomEvent('analytics', {
      detail: { event: 'cta_primary_click', section: 'hero' }
    }));
    navigate('/form');
  };

  const handleDownloadSample = () => {
    // Analytics tracking
    document.dispatchEvent(new CustomEvent('analytics', {
      detail: { event: 'cta_secondary_click', section: 'hero' }
    }));
    // Download sample
    const link = document.createElement('a');
    link.href = '/sample-evidence-package.pdf';
    link.download = 'evidence-package-sample.pdf';
    link.click();
  };

  const handleEducationTrial = () => {
    window.open('mailto:education@example.com?subject=申请教育试用', '_blank');
  };

  return (
    <>
      <Helmet>
        <title>真引用，像你写，留痕可证 - 可校验学术写作工具</title>
        <meta name="description" content="DOI/ISBN实时校验，个人文风基线对齐，全流程留痕证据包。避免AI误判与假引用翻车，支持APA/MLA/GB/T格式，提交更稳。" />
        <meta name="keywords" content="学术写作, AI检测, 引用校验, DOI验证, 文风分析, 学术诚信, 写作证明" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yoursite.com/" />
        
        {/* Open Graph */}
        <meta property="og:title" content="真引用，像你写，留痕可证 - 可校验学术写作工具" />
        <meta property="og:description" content="DOI/ISBN实时校验，个人文风基线对齐，全流程留痕证据包。避免AI误判与假引用翻车，支持APA/MLA/GB/T格式，提交更稳。" />
        <meta property="og:image" content={heroImage} />
        <meta property="og:url" content="https://yoursite.com/" />
        <meta property="og:type" content="website" />

        {/* FAQ Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "这是'AI过检神器'吗？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "不是。我们不承诺'过检'，而是提供可校验的证据与整改建议，帮你建立可信的写作记录。"
                }
              },
              {
                "@type": "Question", 
                "name": "支持哪些引用格式？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "支持APA、MLA、GB/T 7714等主流格式，DOI/ISBN实时核验，一键格式化。"
                }
              },
              {
                "@type": "Question",
                "name": "非母语会被修过头吗？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "润色强度可调，并保留自然错误率，避免风格突变被质疑。"
                }
              },
              {
                "@type": "Question",
                "name": "数据会被训练吗？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "默认不用于训练，支持本地处理与自托管部署。"
                }
              },
              {
                "@type": "Question",
                "name": "老师要看写作过程怎么办？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "证据包包含完整时间线、段落diff与来源快照，可导出展示。"
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen" style={{ backgroundColor: '#F7FAFC' }}>
        {/* 1. 首屏 Hero Section */}
        <section 
          id="hero" 
          data-section 
          className={`relative py-24 px-4 text-center transition-all duration-700 ${
            visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#4F46E5' }}>
              真引用，像你写，留痕可证
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              引用核验、文风对齐、全流程留痕，提交更稳。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                onClick={handleFreeTrial} 
                className="text-lg px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl"
                data-event="cta_primary_click"
              >
                无风险体验
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleDownloadSample} 
                className="text-lg px-8 py-4 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-2xl"
                data-event="cta_secondary_click"
              >
                <Download className="mr-2 h-5 w-5" />
                下载全套示例
              </Button>
            </div>

            {/* 卖点条目 */}
            <div className="text-gray-600 mb-12">
              DOI/ISBN 实时校验 · 个人文风基线 · 证据包可导出
            </div>

            <div className="relative max-w-4xl mx-auto">
              <HeroCarousel />
              <p className="text-sm text-gray-500 mt-4 text-center">
                不承诺"过检"。我们提供可校验的证据与整改建议。
              </p>
            </div>
          </div>
        </section>

        {/* 2. 痛点区 Pain Points Section */}
        <section 
          id="pain-points" 
          data-section 
          className={`py-16 px-4 transition-all duration-700 ${
            visibleSections.has('pain-points') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#1F2937' }}>
              为什么"能写出来"不等于"敢提交"
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#EF4444' }}>
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">假引用/过时结论，一查就穿帮</h3>
                    <p className="text-gray-600">DOI 失效、期刊信息错误，面谈时无法自圆其说</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#EF4444' }}>
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">文风突变像机器腔</h3>
                    <p className="text-gray-600">句式突变、词汇跃升，容易被怀疑非本人作品</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#EF4444' }}>
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">检测易误伤</h3>
                    <p className="text-gray-600">AI检测工具无法区分"润色"与"生成"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#EF4444' }}>
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">面谈要讲检索路径与改动理由</h3>
                    <p className="text-gray-600">无法提供写作过程证据，缺乏口头核验准备</p>
                  </div>
                </div>
                <div className="pt-4">
                  <a href="#faq" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    阅读更多 →
                  </a>
                </div>
              </div>
              <div>
                <img 
                  src={painPointsSolutions} 
                  alt="痛点分析与解决方案对比图"
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. 闭环四卡 Solutions Overview */}
        <section 
          id="solutions" 
          data-section 
          className={`py-16 px-4 transition-all duration-700 ${
            visibleSections.has('solutions') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#1F2937' }}>
              一套闭环，从"生成"到"可证"
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card 
                className="p-6 text-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                data-event="feature_card_view"
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                     style={{ background: 'linear-gradient(135deg, #EBF4FF, #DBEAFE)' }}>
                  <Shield className="w-8 h-8" style={{ color: '#4F46E5' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">真实引用</h3>
                <p className="text-gray-600 text-sm leading-relaxed">DOI/PMID/ISBN 实时核验<br />格式一键规范化</p>
              </Card>
              <Card 
                className="p-6 text-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                data-event="feature_card_view"
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                     style={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)' }}>
                  <Target className="w-8 h-8" style={{ color: '#10B981' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">个人文风</h3>
                <p className="text-gray-600 text-sm leading-relaxed">基于历史作业建基线<br />避免风格漂移</p>
              </Card>
              <Card 
                className="p-6 text-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                data-event="feature_card_view"
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                     style={{ background: 'linear-gradient(135deg, #FFF7ED, #FED7AA)' }}>
                  <FileText className="w-8 h-8" style={{ color: '#EA580C' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">全程留痕</h3>
                <p className="text-gray-600 text-sm leading-relaxed">时间线 + 段落 diff + 来源快照<br />一键导出证据包</p>
              </Card>
              <Card 
                className="p-6 text-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                data-event="feature_card_view"
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                     style={{ background: 'linear-gradient(135deg, #FDF2F8, #FCE7F3)' }}>
                  <MessageSquare className="w-8 h-8" style={{ color: '#EC4899' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">口头核验</h3>
                <p className="text-gray-600 text-sm leading-relaxed">速答卡片 + 当场小改<br />面谈演练</p>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. 功能深描 Detailed Features */}
        <section 
          id="features" 
          data-section 
          className={`py-16 px-4 transition-all duration-700 ${
            visibleSections.has('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        >
          <div className="max-w-6xl mx-auto space-y-16">
            {/* 引用护盾 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">引用护盾</h3>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                    <span className="text-gray-700">DOI/PMID/ISBN 实时核验，卷期页码一致性检查</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                    <span className="text-gray-700">过时结论预警、可替换权威来源建议</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                    <span className="text-gray-700">APA/MLA/GB/T 一键格式化，批量纠错</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mb-4">平均提升 96% 引用合规度</p>
                <Button 
                  variant="outline" 
                  onClick={handleFreeTrial}
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  试跑 3 条引用
                </Button>
              </div>
              <div>
                <img 
                  src={citationPanel} 
                  alt="DOI验证与APA格式化面板截图"
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>
            </div>

            {/* 文风锁 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">文风锁</h3>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                    <span className="text-gray-700">基于你过往 3–5 篇作业建立个人基线</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                    <span className="text-gray-700">句长/词汇复杂度/突发度偏移可视化</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                    <span className="text-gray-700">非母语润色强度滑杆，保留"自然错误率"</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mb-4">平均降低 68% 风格检测风险</p>
                <Button 
                  variant="outline" 
                  onClick={handleFreeTrial}
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  上传历史样本文本
                </Button>
              </div>
              <div className="md:order-1">
                <div className="bg-white p-8 rounded-2xl shadow-lg border">
                  <div className="text-center mb-4">
                    <h4 className="font-semibold mb-4 text-gray-900">风格仪表 + 滑杆调节</h4>
                    <div className="w-32 h-32 mx-auto border-8 rounded-full flex items-center justify-center mb-4" 
                         style={{ borderColor: '#4F46E5' }}>
                      <span className="text-3xl font-bold" style={{ color: '#4F46E5' }}>28</span>
                    </div>
                    <p className="text-sm text-gray-500">偏移度（目标：≤30）</p>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ backgroundColor: '#4F46E5', width: '30%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">润色强度：轻度</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 证据包 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">证据包</h3>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                    <span className="text-gray-700">记录"检索→生成→改写→人工编辑"的时间线</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                    <span className="text-gray-700">段落级 diff 与时间戳，来源快照随包带走</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                    <span className="text-gray-700">一键导出：timeline.json、diff.pdf、sources.csv</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mb-4">完整可验证的写作证据链</p>
                <Button 
                  variant="outline" 
                  onClick={handleDownloadSample}
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                  data-event="download_sample"
                >
                  <Download className="mr-2 h-4 w-4" />
                  下载示例证据包
                </Button>
              </div>
              <div>
                <img 
                  src={evidencePackage} 
                  alt="可导出证据包三页缩略图"
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>
            </div>

            {/* 口头核验演练 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">口头核验演练</h3>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                    <span className="text-gray-700">自动生成"检索路径讲稿 + 速答卡片"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                    <span className="text-gray-700">"当场小改"模式：对任意段落给出改动理由与证据指向</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                    <span className="text-gray-700">导出 1 页提纲，10 分钟速练</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mb-4">提升 90% 面谈通过率</p>
                <Button 
                  variant="outline" 
                  onClick={handleFreeTrial}
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  开启 3 分钟快速演练
                </Button>
              </div>
              <div className="md:order-1">
                <Card className="p-6 bg-white rounded-2xl shadow-lg">
                  <h4 className="font-semibold mb-4 text-gray-900">Q&A 卡片演练</h4>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                      <p className="font-medium text-gray-900">Q: 你的检索关键词是什么？</p>
                      <p className="text-sm text-gray-600 mt-2">A: 我使用了"climate change adaptation"和"urban planning"...</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                      <p className="font-medium text-gray-900">Q: 这个段落为什么这样改写？</p>
                      <p className="text-sm text-gray-600 mt-2">A: 原文过于复杂，我简化了句式但保留了核心观点...</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 三步走 Process Steps */}
        <section 
          id="process" 
          data-section 
          className={`py-16 px-4 transition-all duration-700 ${
            visibleSections.has('process') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#1F2937' }}>
              三步走，提交更稳
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white" 
                     style={{ backgroundColor: '#4F46E5' }}>1</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">上传与体检</h3>
                <p className="text-gray-600">上传与体检</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white" 
                     style={{ backgroundColor: '#4F46E5' }}>2</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">对齐与修复</h3>
                <p className="text-gray-600">对齐与修复</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white" 
                     style={{ backgroundColor: '#4F46E5' }}>3</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">导出与演练</h3>
                <p className="text-gray-600">导出与演练</p>
              </div>
            </div>
            <img 
              src={threeStepProcess} 
              alt="三步走流程：上传、对齐、导出"
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg"
            />
          </div>
        </section>

        {/* 6. 用户见证 + 指标 Testimonials */}
        <section 
          id="testimonials" 
          data-section 
          className={`py-16 px-4 transition-all duration-700 ${
            visibleSections.has('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#1F2937' }}>
              用户见证
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="p-6 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full mr-3" style={{ backgroundColor: '#4F46E5' }}></div>
                  <div>
                    <p className="font-semibold text-gray-900">本科生 / 某985高校</p>
                    <div className="flex text-yellow-500 mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"引用从 12 处报错纠正到全部通过，面谈时口头核验练习派上大用场，提交更安心了。"</p>
              </Card>
              <Card className="p-6 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full mr-3" style={{ backgroundColor: '#10B981' }}></div>
                  <div>
                    <p className="font-semibold text-gray-900">硕士生 / 海外留学</p>
                    <div className="flex text-yellow-500 mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"文风偏移从85降到28，避免了风格断层的尴尬，证据包让导师看到我的写作过程。"</p>
              </Card>
              <Card className="p-6 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full mr-3" style={{ backgroundColor: '#EC4899' }}></div>
                  <div>
                    <p className="font-semibold text-gray-900">博士生 / 理工科</p>
                    <div className="flex text-yellow-500 mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"DOI自动校验发现了3个失效链接，APA格式一键修复，节省大量时间。"</p>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 text-center bg-white rounded-2xl shadow-lg">
                <h3 className="text-4xl font-bold mb-2" style={{ color: '#4F46E5' }}>96%</h3>
                <p className="text-gray-600 font-medium">引用合规度提升</p>
              </Card>
              <Card className="p-8 text-center bg-white rounded-2xl shadow-lg">
                <h3 className="text-4xl font-bold mb-2" style={{ color: '#4F46E5' }}>-68%</h3>
                <p className="text-gray-600 font-medium">风险分下降幅度</p>
              </Card>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              指标为样例说明，实际效果随文本而异
            </p>
          </div>
        </section>

        {/* 7. FAQ Section */}
        <section 
          id="faq" 
          data-section 
          className={`py-16 px-4 transition-all duration-700 ${
            visibleSections.has('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#1F2937' }}>
              常见问题
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  这是"AI 过检神器"吗？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  不是。我们不承诺"过检"，而是提供可校验的证据与整改建议，帮你建立可信的写作记录。我们的目标是让你的学术写作经得起质疑。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  支持哪些引用格式？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  支持APA、MLA、GB/T 7714等主流格式，DOI/ISBN/PMID实时核验，一键格式化。还会持续增加其他国际期刊常用格式。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  非母语会被修过头吗？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  润色强度可调，并保留自然错误率，避免风格突变被质疑。系统会基于你的历史作业建立个人基线，确保修改后的文风仍然像你本人的作品。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  数据会被训练吗？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  默认不用于训练，支持本地处理与自托管部署。你的学术文档完全属于你，我们严格遵守隐私保护原则。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  老师要看写作过程怎么办？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  证据包包含完整时间线、段落diff与来源快照，可导出展示。还附带口头核验速答卡，帮你准备可能的面谈问题。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* 8. 可信与合规 Trust & Compliance */}
        <section 
          id="compliance" 
          data-section 
          className={`py-16 px-4 transition-all duration-700 ${
            visibleSections.has('compliance') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#1F2937' }}>
              可信与合规
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                     style={{ background: 'linear-gradient(135deg, #EBF4FF, #DBEAFE)' }}>
                  <Shield className="w-8 h-8" style={{ color: '#4F46E5' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">数据与隐私</h3>
                <p className="text-gray-600 mb-4">默认最小化采集，上传即处理即弃模式可选</p>
              </Card>
              <Card className="p-6 text-center bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                     style={{ background: 'linear-gradient(135deg, #FFF7ED, #FED7AA)' }}>
                  <Award className="w-8 h-8" style={{ color: '#EA580C' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">教育用途声明</h3>
                <p className="text-gray-600 mb-4">产品仅作教学示例，不提供代写与过检承诺</p>
              </Card>
              <Card className="p-6 text-center bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                     style={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)' }}>
                  <Users className="w-8 h-8" style={{ color: '#10B981' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">真实文献来源</h3>
                <p className="text-gray-600 mb-4">所有参考文献可提供原文及出处</p>
              </Card>
            </div>
          </div>
        </section>

        {/* 9. 相关文章内链 Blog Resources */}
        <section 
          id="resources" 
          data-section 
          className={`py-16 px-4 transition-all duration-700 ${
            visibleSections.has('resources') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#1F2937' }}>
              相关文章
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <BookOpen className="w-8 h-8 mb-4" style={{ color: '#4F46E5' }} />
                <h3 className="text-lg font-semibold mb-3 text-gray-900">DOI 是什么</h3>
                <p className="text-gray-600 mb-4 text-sm">5分钟读懂学术标识符，了解DOI系统如何确保引用的准确性和可追溯性</p>
                <Button variant="outline" size="sm" asChild className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl">
                  <a href="/blog/understanding-doi" target="_blank">
                    阅读文章 <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
              <Card className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <Target className="w-8 h-8 mb-4" style={{ color: '#10B981' }} />
                <h3 className="text-lg font-semibold mb-3 text-gray-900">非母语避免 AI 误判</h3>
                <p className="text-gray-600 mb-4 text-sm">保持个人写作风格的同时提升学术表达质量的实用技巧</p>
                <Button variant="outline" size="sm" asChild className="border-green-600 text-green-600 hover:bg-green-50 rounded-xl">
                  <a href="/blog/avoid-ai-detection" target="_blank">
                    阅读文章 <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
              <Card className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <MessageSquare className="w-8 h-8 mb-4" style={{ color: '#EC4899' }} />
                <h3 className="text-lg font-semibold mb-3 text-gray-900">口头核验 20 例</h3>
                <p className="text-gray-600 mb-4 text-sm">准备常见的学术诚信面谈问题和应答策略，提升面谈通过率</p>
                <Button variant="outline" size="sm" asChild className="border-pink-600 text-pink-600 hover:bg-pink-50 rounded-xl">
                  <a href="/blog/oral-verification-guide" target="_blank">
                    阅读文章 <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-16 px-4 text-center text-white" style={{ backgroundColor: '#4F46E5' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              开始你的学术合规之旅
            </h2>
            <p className="text-xl mb-8 opacity-90">
              让每一篇论文都经得起质疑，每一次提交都充满信心
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleFreeTrial}
                className="bg-white text-indigo-600 hover:bg-gray-100 rounded-2xl"
              >
                立即开始
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleDownloadSample}
                className="border-white text-white hover:bg-white hover:text-indigo-600 rounded-2xl"
              >
                下载示例
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AcademicProofWriting;