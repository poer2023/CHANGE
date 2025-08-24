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
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

// Import existing images
import heroImage from '@/assets/hero-proof-of-authorship-dashboard.webp';
import citationPanel from '@/assets/citation-verification-panel.webp';
import painPointsSolutions from '@/assets/pain-points-solutions.webp';
import evidencePackage from '@/assets/evidence-package-thumbnails.webp';
import threeStepProcess from '@/assets/three-step-process.webp';
import HeroCarousel from '@/components/HeroCarousel';
import NavBar from '@/components/NavBar';
import LoginDialog from '@/components/LoginDialog';

const AcademicProofWriting = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

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
    
    if (isAuthenticated) {
      navigate('/writing-flow');
    } else {
      setIsLoginDialogOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    navigate('/writing-flow');
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
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
        <meta name="keywords" content={t('seo.keywords')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yoursite.com/" />
        
        {/* Open Graph */}
        <meta property="og:title" content={t('seo.og_title')} />
        <meta property="og:description" content={t('seo.og_description')} />
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
                "name": "这是'过检神器'吗？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "{t('faq.a1')}"
                }
              },
              {
                "@type": "Question", 
                "name": "{t('faq.q2')}",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "{t('faq.a2')}"
                }
              },
              {
                "@type": "Question",
                "name": "{t('faq.q3')}",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "{t('faq.a3')}"
                }
              },
              {
                "@type": "Question",
                "name": "{t('faq.q4')}",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "{t('faq.a4')}"
                }
              },
              {
                "@type": "Question",
                "name": "{t('faq.q5')}",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "{t('faq.a5')}"
                }
              },
              {
                "@type": "Question",
                "name": "{t('faq.q6')}",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "{t('faq.a6')}"
                }
              },
              {
                "@type": "Question",
                "name": "{t('faq.q7')}",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "{t('faq.a7')}"
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <NavBar />
      <div className="min-h-screen" style={{ backgroundColor: '#F7FAFC' }}>
        {/* 1. 首屏 Hero Section */}
        <section 
          id="hero" 
          data-section 
          className={`relative pt-24 pb-16 px-4 text-center transition-all duration-700 ${
            visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ marginTop: '64px' }}
        >
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#4F46E5' }}>
              {t('hero.main_title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                onClick={handleFreeTrial} 
                className="text-lg px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl"
                data-event="cta_primary_click"
              >
                {t('hero.cta_trial')}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleDownloadSample} 
                className="text-lg px-8 py-4 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-2xl"
                data-event="cta_secondary_click"
              >
                <Download className="mr-2 h-5 w-5" />
                {t('hero.cta_download')}
              </Button>
            </div>

            {/* 卖点条目 */}
            <div className="text-gray-600 mb-12">
              {t('hero.selling_points')}
            </div>

            <div className="relative max-w-4xl mx-auto">
              <HeroCarousel />
              <p className="text-sm text-gray-500 mt-4 text-center">
                {t('hero.disclaimer')}
              </p>
            </div>
          </div>
        </section>

        {/* 2. 痛点区 Pain Points Section */}
        <section 
          id="reasons" 
          data-section
          className={`py-16 px-4 transition-all duration-700 ${
            visibleSections.has('reasons') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#1F2937' }}>
              {t('painpoints.section_title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#EF4444' }}>
                     <X className="w-4 h-4 text-white" />
                   </div>
                   <div>
                     <h3 className="font-semibold mb-2 text-gray-900">{t('painpoints.fake_citations.title')}</h3>
                     <p className="text-gray-600">{t('painpoints.fake_citations.desc')}</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#EF4444' }}>
                     <X className="w-4 h-4 text-white" />
                   </div>
                   <div>
                     <h3 className="font-semibold mb-2 text-gray-900">{t('painpoints.style_change.title')}</h3>
                     <p className="text-gray-600">{t('painpoints.style_change.desc')}</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#EF4444' }}>
                     <X className="w-4 h-4 text-white" />
                   </div>
                   <div>
                     <h3 className="font-semibold mb-2 text-gray-900">{t('painpoints.ai_detection.title')}</h3>
                     <p className="text-gray-600">{t('painpoints.ai_detection.desc')}</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#EF4444' }}>
                     <X className="w-4 h-4 text-white" />
                   </div>
                   <div>
                     <h3 className="font-semibold mb-2 text-gray-900">{t('painpoints.interview_questions.title')}</h3>
                     <p className="text-gray-600">{t('painpoints.interview_questions.desc')}</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#EF4444' }}>
                     <X className="w-4 h-4 text-white" />
                   </div>
                   <div>
                     <h3 className="font-semibold mb-2 text-gray-900">{t('painpoints.formatting_work.title')}</h3>
                     <p className="text-gray-600">{t('painpoints.formatting_work.desc')}</p>
                   </div>
                 </div>
                <div className="pt-4">
                  <a href="#faq" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    {t('painpoints.read_more')}
                  </a>
                </div>
              </div>
              <div>
                <img 
                  src={painPointsSolutions} 
                  alt={t('painpoints.alt_text')}
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. 闭环四卡 Solutions Overview */}
        <section 
          id="loop" 
          data-section
          className={`py-16 px-4 transition-all duration-700 ${
            visibleSections.has('loop') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#1F2937' }}>
              {t('features.section_title')}
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
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('features.real_citations.title')}</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">{t('features.real_citations.desc')}</p>
               </Card>
               <Card 
                 className="p-6 text-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                 data-event="feature_card_view"
               >
                 <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                      style={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)' }}>
                   <Target className="w-8 h-8" style={{ color: '#10B981' }} />
                 </div>
                 <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('features.personal_style.title')}</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">{t('features.personal_style.desc')}</p>
               </Card>
               <Card 
                 className="p-6 text-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                 data-event="feature_card_view"
               >
                 <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                      style={{ background: 'linear-gradient(135deg, #FFF7ED, #FED7AA)' }}>
                   <FileText className="w-8 h-8" style={{ color: '#EA580C' }} />
                 </div>
                 <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('features.full_trace.title')}</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">{t('features.full_trace.desc')}</p>
               </Card>
               <Card 
                 className="p-6 text-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                 data-event="feature_card_view"
               >
                 <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                      style={{ background: 'linear-gradient(135deg, #FDF2F8, #FCE7F3)' }}>
                   <Zap className="w-8 h-8" style={{ color: '#EC4899' }} />
                 </div>
                 <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('features.ai_agent.title')}</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">{t('features.ai_agent.desc')}</p>
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
            {/* 3.1 真实引用与零幻觉校验（左文右图） */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">真实引用与零幻觉校验</h3>
                <div className="mb-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700"><strong>写作时自动检索</strong>相关论文/书籍/权威网页，给出可引用候选。</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">生成后，支持用 <strong>Cite 工具/Agent</strong> 一句话<strong>插入或替换</strong>引用。</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700"><strong>一键规范</strong>正文引注与参考文献（APA/MLA/GB/T）。</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">找不到可靠来源时，<strong>明确提示未检得</strong>，不会硬凑。</span>
                    </li>
                  </ul>
                </div>


                <Button 
                  variant="outline" 
                  onClick={handleFreeTrial}
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  试跑 Cite 工具
                </Button>
              </div>
              <div>
                <div className="bg-white p-8 rounded-2xl shadow-lg border">
                  <h4 className="font-semibold mb-4 text-gray-900">Cite 面板预览</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="text-sm">
                        <div className="font-medium">Machine Learning in Academia</div>
                        <div className="text-gray-500">2021 · nature.com</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">插入</Button>
                        <Button size="sm" variant="outline" className="text-xs">替换</Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-green-50">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">已插入到第 3 段</span>
                    </div>
                    <div className="flex items-center gap-3 pt-3">
                      <select className="text-sm border rounded px-2 py-1">
                        <option>APA</option>
                        <option>MLA</option>
                        <option>GB/T</option>
                      </select>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                        一键规范
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3.2 个人文风对齐（非母语友好）（右文左图） */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">个人文风对齐（非母语友好）</h3>
                
                <div className="mb-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">你<strong>上传一篇</strong>历史作业，建立<strong>个人文风基线</strong>。</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">给出 0–100 的<strong>风格距离</strong>，并可视化句长/词汇复杂度/突发度。</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700"><strong>润色强度可控</strong>，保留"自然错误率"，避免"AI 味"。</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  variant="outline" 
                  onClick={handleFreeTrial}
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  上传历史样本
                </Button>
              </div>
              <div className="md:order-1">
                <div className="bg-white p-8 rounded-2xl shadow-lg border">
                  <h4 className="font-semibold mb-4 text-gray-900 text-center">Style Alignment (1 past essay)</h4>
                  <div className="text-center mb-4">
                    <div className="w-32 h-32 mx-auto border-8 rounded-full flex items-center justify-center mb-4" 
                         style={{ borderColor: '#4F46E5' }}>
                      <div>
                        <span className="text-3xl font-bold" style={{ color: '#4F46E5' }}>28</span>
                        <div className="text-xs text-gray-500">从 54</div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center mb-4">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Sentence length</span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Lexical variety</span>
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">Burstiness</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Polish strength:</span>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 text-xs bg-gray-100 rounded">Light</span>
                          <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded">Medium</span>
                          <span className="px-2 py-1 text-xs bg-gray-100 rounded">Strong</span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                        Align to baseline
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3.3 可证据的写作过程：留痕 + 证据包 + 口头核验（左文右图） */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">可证据的写作过程：留痕 + 证据包 + 口头核验</h3>
                
                <div className="mb-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">轻量留痕：记录<strong>会话开始/结束时间</strong>、核心<strong>检索关键词</strong>、<strong>插入/替换的引用</strong>、主要<strong>Agent 指令</strong>、以及<strong>用户手动编辑次数</strong>。</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">一键导出<strong>写作过程摘要</strong>（PDF 一页）与<strong>引用清单</strong>（CSV）；用于老师快速查看与面谈备份。</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">生成<strong>面谈速答卡</strong>（1 页 PDF）：来源、改动理由、结论依据。</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">可创建<strong>只读链接</strong>，设置有效期与可见范围。</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  variant="outline" 
                  onClick={handleDownloadSample}
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                  data-event="download_sample"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t('detailed.process.cta')}
                </Button>
              </div>
              <div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border">
                  <h4 className="font-semibold mb-4 text-gray-900">Timeline & Export</h4>
                  
                  {/* Timeline */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Start session</span>
                      <span className="text-gray-400">14:32</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Inserted 2 citations</span>
                      <span className="text-gray-400">14:45</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Agent formatting</span>
                      <span className="text-gray-400">14:52</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Finished</span>
                      <span className="text-gray-400">15:08</span>
                    </div>
                  </div>

                  {/* Export files */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>writing-summary.pdf</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Database className="w-4 h-4" />
                      <span>sources.csv</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MessageSquare className="w-4 h-4" />
                      <span>viva-qa.pdf</span>
                    </div>
                  </div>

                  <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* 3.4 专业二次 AI Agent 审查编辑（右文左图） */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">专业二次 AI Agent 审查编辑</h3>
                
                <div className="mb-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700"><strong>结构化重写</strong>：按你给的提纲重排章节并生成变更说明。</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700"><strong>格式排版</strong>：题注、脚注、交叉引用、目录自动更新；参考文献批量规范。</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700"><strong>插表插图</strong>：从段落/表格数据生成柱/折/散点图，<strong>图注写清来源</strong>；流程图按描述生成并自动编号。</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700"><strong>自然语言操控</strong>：一句话做复杂操作；常用步骤可保存为"配方"。</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700"><strong>护栏</strong>：不伪造引用/数据；无法验证会标注"待核验"；全部操作可撤销并留痕。</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  variant="outline" 
                  onClick={handleFreeTrial}
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  体验 Agent 编辑
                </Button>
              </div>
              <div className="md:order-1">
                <div className="bg-white p-6 rounded-2xl shadow-lg border">
                  <h4 className="font-semibold mb-4 text-gray-900">Agent 命令界面</h4>
                  
                  {/* Command input */}
                  <div className="mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg text-sm border">
                      <span className="text-gray-600 font-medium">输入：</span>
                      <div className="mt-1 text-gray-800">
                        "把第 2 节拆成 related work 和 method，并统一 APA 7，插入统计图。"
                      </div>
                    </div>
                  </div>

                  {/* Document preview */}
                  <div className="mb-4 p-3 border rounded-lg">
                    <div className="text-xs text-gray-500 mb-2">文档更新预览：</div>
                    <div className="space-y-1 text-sm">
                      <div className="font-medium">2.1 Related Work</div>
                      <div className="font-medium">2.2 Method</div>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-gray-600">Figure 1: Statistics (Source: Table 2)</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                      应用修改
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      撤销
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      保存为配方
                    </Button>
                  </div>
                </div>
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
              {t('process.section_title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white" 
                     style={{ backgroundColor: '#4F46E5' }}>1</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('process.step1.title')}</h3>
                <p className="text-gray-600">{t('process.step1.desc')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white" 
                     style={{ backgroundColor: '#4F46E5' }}>2</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('process.step2.title')}</h3>
                <p className="text-gray-600">{t('process.step2.desc')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white" 
                     style={{ backgroundColor: '#4F46E5' }}>3</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('process.step3.title')}</h3>
                <p className="text-gray-600">{t('process.step3.desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. 用户见证 + 指标 Testimonials */}
        <section 
          id="pricing" 
          data-section
          className={`py-16 px-4 transition-all duration-700 ${
            visibleSections.has('pricing') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#1F2937' }}>
              {t('testimonials.section_title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="p-6 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full mr-3" style={{ backgroundColor: '#4F46E5' }}></div>
                  <div>
                    <p className="font-semibold text-gray-900">{t('testimonials.student_title')}</p>
                    <div className="flex text-yellow-500 mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{t('testimonials.student_quote')}</p>
              </Card>
              <Card className="p-6 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full mr-3" style={{ backgroundColor: '#10B981' }}></div>
                  <div>
                    <p className="font-semibold text-gray-900">{t('testimonials.master_title')}</p>
                    <div className="flex text-yellow-500 mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{t('testimonials.master_quote')}</p>
              </Card>
              <Card className="p-6 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full mr-3" style={{ backgroundColor: '#EC4899' }}></div>
                  <div>
                    <p className="font-semibold text-gray-900">{t('testimonials.phd_title')}</p>
                    <div className="flex text-yellow-500 mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{t('testimonials.phd_quote')}</p>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 text-center bg-white rounded-2xl shadow-lg">
                <h3 className="text-4xl font-bold mb-2" style={{ color: '#4F46E5' }}>{t('testimonials.metric1')}</h3>
                <p className="text-gray-600 font-medium">{t('testimonials.metric1_desc')}</p>
              </Card>
              <Card className="p-8 text-center bg-white rounded-2xl shadow-lg">
                <h3 className="text-4xl font-bold mb-2" style={{ color: '#4F46E5' }}>{t('testimonials.metric2')}</h3>
                <p className="text-gray-600 font-medium">{t('testimonials.metric2_desc')}</p>
              </Card>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              {t('testimonials.disclaimer')}
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
              {t('faq.section_title')}
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  {t('faq.q1')}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  {t('faq.a1')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  {t('faq.q2')}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  {t('faq.a2')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  {t('faq.q3')}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  {t('faq.a3')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  {t('faq.q4')}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  所有操作可撤销并留痕；无法验证的来源标"需核验"。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  {t('faq.q5')}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  {t('faq.a5')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  {t('faq.q6')}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  {t('faq.a6')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  {t('faq.q7')}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  {t('faq.a7')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* 8. {t('compliance.section_title')} Trust & Compliance */}
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
              {t('compliance.section_title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                     style={{ background: 'linear-gradient(135deg, #EBF4FF, #DBEAFE)' }}>
                  <Shield className="w-8 h-8" style={{ color: '#4F46E5' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('compliance.data_privacy.title')}</h3>
                <p className="text-gray-600 mb-4">{t('compliance.data_privacy.desc')}</p>
              </Card>
              <Card className="p-6 text-center bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                     style={{ background: 'linear-gradient(135deg, #FFF7ED, #FED7AA)' }}>
                  <Award className="w-8 h-8" style={{ color: '#EA580C' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('compliance.education.title')}</h3>
                <p className="text-gray-600 mb-4">{t('compliance.education.desc')}</p>
              </Card>
              <Card className="p-6 text-center bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                     style={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)' }}>
                  <GraduationCap className="w-8 h-8" style={{ color: '#10B981' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('compliance.teacher_cooperation.title')}</h3>
                <p className="text-gray-600 mb-4">{t('compliance.teacher_cooperation.desc')}</p>
              </Card>
            </div>
          </div>
        </section>

        {/* 9. {t('resources.section_title')}内链 Blog Resources */}
        <section 
          id="resources" 
          data-section
          className={`py-16 px-4 transition-all duration-700 ${
            visibleSections.has('resources') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#1F2937' }}>
              {t('resources.section_title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <Target className="w-8 h-8 mb-4" style={{ color: '#10B981' }} />
                <h3 className="text-lg font-semibold mb-3 text-gray-900">{t('resources.avoid_misjudge.title')}</h3>
                <p className="text-gray-600 mb-4 text-sm">{t('resources.avoid_misjudge.desc')}</p>
                <Button variant="outline" size="sm" asChild className="border-green-600 text-green-600 hover:bg-green-50 rounded-xl">
                  <a href="/resources/avoid-misjudge" target="_blank">
                    {t('resources.avoid_misjudge.cta')} <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
              <Card className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <TrendingUp className="w-8 h-8 mb-4" style={{ color: '#0EA5E9' }} />
                <h3 className="text-lg font-semibold mb-3 text-gray-900">{t('resources.academic_charts.title')}</h3>
                <p className="text-gray-600 mb-4 text-sm">{t('resources.academic_charts.desc')}</p>
                <Button variant="outline" size="sm" asChild className="border-sky-600 text-sky-600 hover:bg-sky-50 rounded-xl">
                  <a href="/resources/academic-charts" target="_blank">
                    {t('resources.academic_charts.cta')} <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
              <Card className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <MessageSquare className="w-8 h-8 mb-4" style={{ color: '#EC4899' }} />
                <h3 className="text-lg font-semibold mb-3 text-gray-900">{t('resources.viva_qa.title')}</h3>
                <p className="text-gray-600 mb-4 text-sm">{t('resources.viva_qa.desc')}</p>
                <Button variant="outline" size="sm" asChild className="border-pink-600 text-pink-600 hover:bg-pink-50 rounded-xl">
                  <a href="/resources/viva-qa-20" target="_blank">
                    {t('resources.viva_qa.cta')} <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <main id="main">
        <section className="py-16 px-4 text-center text-white" style={{ backgroundColor: '#4F46E5' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('footer_cta.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('footer_cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleFreeTrial}
                className="bg-white text-indigo-600 hover:bg-gray-100 rounded-2xl"
              >
                {t('footer_cta.start_btn')}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleDownloadSample}
                className="border-white text-white hover:bg-white hover:text-indigo-600 rounded-2xl"
              >
                {t('footer_cta.download_btn')}
              </Button>
            </div>
          </div>
        </section>
        </main>
      </div>

      {/* Login Dialog */}
      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default AcademicProofWriting;