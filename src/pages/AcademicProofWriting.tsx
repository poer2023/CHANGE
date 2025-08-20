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
import NavBar from '@/components/NavBar';

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
                "name": "这是'过检神器'吗？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "不是。我们提供可校验证据与整改建议。"
                }
              },
              {
                "@type": "Question", 
                "name": "支持哪些引用格式？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "APA/MLA/GB/T 7714，校验 DOI/ISBN/PMID。"
                }
              },
              {
                "@type": "Question",
                "name": "非母语会不会被修过头？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "润色强度可调，保留自然错误率。"
                }
              },
              {
                "@type": "Question",
                "name": "二次 AI Agent 会乱改吗？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "所有操作可撤销并留痕；无法验证的来源标'需核验'。"
                }
              },
              {
                "@type": "Question",
                "name": "图表的数据来源怎么保证？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "生成时写入来源与参数元数据，可追溯。"
                }
              },
              {
                "@type": "Question",
                "name": "数据会被拿去训练吗？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "默认不用于训练，支持本地优先与自托管。"
                }
              },
              {
                "@type": "Question",
                "name": "老师要看写作过程怎么办？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "导出证据包与口头核验提纲即可。"
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
              真引用，像你写，留痕可证
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              引用核验、个人文风对齐、全流程留痕，配合二次 AI Agent 编辑，提交更稳。
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
              真实文献引用 · 个人文风基线 · 证据包可导出 · AI agent文稿编辑
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
          id="reasons" 
          data-section
          className={`py-16 px-4 transition-all duration-700 ${
            visibleSections.has('reasons') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
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
                     <h3 className="font-semibold mb-2 text-gray-900">假引文/过时结论，抽查即暴露</h3>
                     <p className="text-gray-600">DOI 失效、期刊信息错误，面谈时无法自圆其说</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#EF4444' }}>
                     <X className="w-4 h-4 text-white" />
                   </div>
                   <div>
                     <h3 className="font-semibold mb-2 text-gray-900">文风突变像"机器腔"，与过往作品断层</h3>
                     <p className="text-gray-600">句式突变、词汇跃升，容易被怀疑非本人作品</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#EF4444' }}>
                     <X className="w-4 h-4 text-white" />
                   </div>
                   <div>
                     <h3 className="font-semibold mb-2 text-gray-900">检测工具存在误伤，非母语更易中招</h3>
                     <p className="text-gray-600">AI检测工具无法区分"润色"与"生成"</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#EF4444' }}>
                     <X className="w-4 h-4 text-white" />
                   </div>
                   <div>
                     <h3 className="font-semibold mb-2 text-gray-900">面谈要讲检索路径与改动理由，说不清就被追问</h3>
                     <p className="text-gray-600">无法提供写作过程证据，缺乏口头核验准备</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#EF4444' }}>
                     <X className="w-4 h-4 text-white" />
                   </div>
                   <div>
                     <h3 className="font-semibold mb-2 text-gray-900">临近提交还要排版、插图、编号、格式统一，人工耗时</h3>
                     <p className="text-gray-600">排版工作量大，容易出错，影响提交进度</p>
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
          id="loop" 
          data-section
          className={`py-16 px-4 transition-all duration-700 ${
            visibleSections.has('loop') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
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
                 <p className="text-gray-600 text-sm leading-relaxed">DOI/PMID/ISBN 实时核验，卷期页码一致性检查；APA/MLA/GB/T 一键规范，假引文标红并给替代建议。</p>
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
                 <p className="text-gray-600 text-sm leading-relaxed">建立个人基线；句长/词汇复杂度/突发度可视化；非母语友好润色，保留自然错误率。</p>
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
                 <p className="text-gray-600 text-sm leading-relaxed">写作时间线、段落 diff、来源快照一键打包证据包；附口头核验速答卡。</p>
               </Card>
               <Card 
                 className="p-6 text-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                 data-event="feature_card_view"
               >
                 <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                      style={{ background: 'linear-gradient(135deg, #FDF2F8, #FCE7F3)' }}>
                   <Zap className="w-8 h-8" style={{ color: '#EC4899' }} />
                 </div>
                 <h3 className="text-xl font-semibold mb-3 text-gray-900">二次 AI Agent 编辑</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">用自然语言完成结构化重写、格式排版、图表生成与交叉引用，保证来源与参数可追溯。</p>
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
            {/* 真实引用（左文右图｜新版） */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">真实引用</h3>
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">我们做的事（说人话）</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">写作时<strong>自动检索</strong>相关论文/书籍/权威网页，给出可引用的候选来源</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">生成后，用户可用 <strong>Cite 工具/Agent</strong> 一键<strong>插入或替换</strong>引用</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700"><strong>一键格式化</strong>正文引注与参考文献（APA/MLA/GB/T）</span>
                    </li>
                  </ul>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">页面会怎么显示</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 绿色提示：<code className="bg-gray-100 px-2 py-1 rounded">已插入到第 3 段</code></li>
                    <li>• 列表项：标题 + 年份 + 来源域名/出版社 + <code className="bg-gray-100 px-2 py-1 rounded">[插入] [替换]</code></li>
                    <li>• 按钮：<code className="bg-gray-100 px-2 py-1 rounded">一键规范（APA 7）</code></li>
                  </ul>
                </div>
                <p className="text-sm text-gray-500 mb-4">样例：一键格式命中率 ≥ 95%（小样本）*</p>
                <Button 
                  variant="outline" 
                  onClick={handleFreeTrial}
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  试跑检索与插入
                </Button>
              </div>
              <div>
                <img 
                  src={citationPanel} 
                  alt="Cite search panel showing three sources with Insert and Replace actions, and a style dropdown APA/MLA/GB/T"
                  className="w-full rounded-2xl shadow-lg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  图像生成提示词：Clean UI mockup of a "Cite" side panel. A search box on top, below a list of three sources: each row shows Title, Year, Source domain/publisher, action buttons "Insert" and "Replace", a small green label "Inserted to paragraph 3" on one row. At the bottom, a dropdown "Format: APA / MLA / GB/T" and a primary button "Auto format". Light warm-white background, soft shadows, academic, no devices, 16:9.
                </p>
              </div>
            </div>

            {/* 文风锁（右文左图｜仅需一篇历史作业） */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">文风锁（仅需一篇历史作业）</h3>
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">我们做的事</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">你<strong>上传一篇</strong>历史作业，系统据此建立<strong>个人基线</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">显示 0–100 的<strong>风格距离</strong>，并可视化：句长、词汇复杂度、突发度</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700"><strong>润色强度</strong>可调，保留自然错误率，不把你的语言习惯抹平</span>
                    </li>
                  </ul>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">页面会怎么显示</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 指标：<code className="bg-gray-100 px-2 py-1 rounded">风格距离 28（目标 &lt;30）</code></li>
                    <li>• 控件：<code className="bg-gray-100 px-2 py-1 rounded">对齐到个人基线</code> <code className="bg-gray-100 px-2 py-1 rounded">润色强度：轻 / 中 / 重</code></li>
                  </ul>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleFreeTrial}
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  上传历史作业建基线
                </Button>
              </div>
              <div className="md:order-1">
                <img 
                  src={citationPanel} 
                  alt="Style distance gauge 54→28 with three chips Sentence length, Lexical variety, Burstiness"
                  className="w-full rounded-2xl shadow-lg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  图像生成提示词：Minimal dashboard card titled "Style Alignment (1 past essay)". Large circular gauge where a pointer moves from 54 to 28. Below, three small chips: "Sentence length", "Lexical variety", "Burstiness". On the right, a slider "Polish strength: Light | Medium | Strong" and a button "Align to baseline". Soft shadows, academic, youthful but restrained, 4:3.
                </p>
              </div>
            </div>

            {/* 可证据的写作过程（左文右图｜降级为"过程摘要"，不做段落 diff） */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">可证据的写作过程</h3>
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">我们做的事</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">轻量留痕：记录<strong>会话开始/结束时间</strong>、主要<strong>检索关键词</strong>、<strong>插入/替换了哪些引用</strong>、使用过的<strong>Agent 指令</strong>和<strong>用户手动编辑次数</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">一键导出<strong>写作过程摘要</strong>（PDF 一页）与<strong>引用清单</strong>（CSV），用于老师快速查看</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">可生成<strong>只读链接</strong>，设置有效期与可见范围</span>
                    </li>
                  </ul>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">页面会怎么显示</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 时间线 3–4 个节点：<code className="bg-gray-100 px-2 py-1 rounded">开始写作 → 插入 2 个引用 → Agent 排版 → 完成</code></li>
                    <li>• 导出卡片：<code className="bg-gray-100 px-2 py-1 rounded">writing-summary.pdf</code> 与 <code className="bg-gray-100 px-2 py-1 rounded">sources.csv</code></li>
                    <li>• 按钮：<code className="bg-gray-100 px-2 py-1 rounded">导出过程摘要</code> <code className="bg-gray-100 px-2 py-1 rounded">复制只读链接</code></li>
                  </ul>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleDownloadSample}
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                  data-event="download_sample"
                >
                  <Download className="mr-2 h-4 w-4" />
                  下载示例过程摘要
                </Button>
              </div>
              <div>
                <img 
                  src={evidencePackage} 
                  alt="Light timeline with four events and an export card listing writing-summary.pdf and sources.csv"
                  className="w-full rounded-2xl shadow-lg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  图像生成提示词：Simple timeline card with four events: "Start session", "Inserted 2 citations", "Agent formatting", "Finished". Each event has a small timestamp. On the right, an export box showing two files: "writing-summary.pdf" and "sources.csv" with a primary button "Export". No paragraph-level diff. Clean, white background, soft shadows, 16:9.
                </p>
              </div>
            </div>

            {/* 口头核验演练（右文左图｜保持） */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">口头核验演练</h3>
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">我们做的事</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">自动生成<strong>速答卡片 + 讲解提纲</strong>：包含"用到的来源""为什么这样改""结论依据"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">提供"<strong>当场小改</strong>"模式：点选段落，给出保留结论的改写方案并指向来源</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <span className="text-gray-700">一键导出 1 页提纲，<strong>10 分钟走一遍</strong></span>
                    </li>
                  </ul>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleFreeTrial}
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  生成口头核验卡片
                </Button>
              </div>
              <div className="md:order-1">
                <img 
                  src={evidencePackage} 
                  alt="Two flash cards: What is your source? and Why this rewrite? with short answers and a source badge"
                  className="w-full rounded-2xl shadow-lg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  图像生成提示词：Two gray flash cards side by side for viva practice. Card 1: Q "What is your source?" A shows a short line plus a small badge "Source: 2021 journal". Card 2: Q "Why this rewrite?" A explains brevity and keeps key data. Minimal UI, soft shadows, 3:2, no people.
                </p>
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
                <p className="text-gray-600">扫描引用与风格，给出风险分与 3 条高优先整改</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white" 
                     style={{ backgroundColor: '#4F46E5' }}>2</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">对齐与修复</h3>
                <p className="text-gray-600">对齐个人文风，批量纠正引文与格式</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white" 
                     style={{ backgroundColor: '#4F46E5' }}>3</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Agent 整理与导出</h3>
                <p className="text-gray-600">一条指令完成排版/图表/交叉引用，导出证据包并跑一遍口头核验</p>
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
                <p className="text-gray-600">"引用合规从 12 条报错修到 0，面谈用速答卡顺利通过。"</p>
              </Card>
              <Card className="p-6 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full mr-3" style={{ backgroundColor: '#10B981' }}></div>
                  <div>
                    <p className="font-semibold text-gray-900">硕士｜海外</p>
                    <div className="flex text-yellow-500 mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"风格偏移从 58 降到 27，老师认可'像本人写'。"</p>
              </Card>
              <Card className="p-6 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full mr-3" style={{ backgroundColor: '#EC4899' }}></div>
                  <div>
                    <p className="font-semibold text-gray-900">博士｜理工科</p>
                    <div className="flex text-yellow-500 mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"Agent 完成图表与编号，LaTeX 导出一次过版。"</p>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 text-center bg-white rounded-2xl shadow-lg">
                <h3 className="text-4xl font-bold mb-2" style={{ color: '#4F46E5' }}>96%</h3>
                <p className="text-gray-600 font-medium">引用合规度提升</p>
              </Card>
              <Card className="p-8 text-center bg-white rounded-2xl shadow-lg">
                <h3 className="text-4xl font-bold mb-2" style={{ color: '#4F46E5' }}>-68%</h3>
                <p className="text-gray-600 font-medium">AI率 下降</p>
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
                  这是"过检神器"吗？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  不是。我们提供可校验证据与整改建议。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  支持哪些引用格式？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  APA/MLA/GB/T 7714，校验 DOI/ISBN/PMID。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  非母语会不会被修过头？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  润色强度可调，保留自然错误率。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  二次 AI Agent 会乱改吗？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  所有操作可撤销并留痕；无法验证的来源标"需核验"。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  图表的数据来源怎么保证？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  生成时写入来源与参数元数据，可追溯。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  数据会被拿去训练吗？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  默认不用于训练，支持本地优先与自托管。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7" className="bg-white rounded-2xl px-6" data-event="faq_toggle">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  老师要看写作过程怎么办？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  导出证据包与口头核验提纲即可。
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
                <p className="text-gray-600 mb-4">最小化采集，上传即处理即弃可选；敏感场景可自托管</p>
              </Card>
              <Card className="p-6 text-center bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                     style={{ background: 'linear-gradient(135deg, #FFF7ED, #FED7AA)' }}>
                  <Award className="w-8 h-8" style={{ color: '#EA580C' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">教育用途声明</h3>
                <p className="text-gray-600 mb-4">不提供代写与"包过"承诺；定位为合规辅助</p>
              </Card>
              <Card className="p-6 text-center bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                     style={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)' }}>
                  <GraduationCap className="w-8 h-8" style={{ color: '#10B981' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">教师合作</h3>
                <p className="text-gray-600 mb-4">申请教育试用与 API</p>
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
                <p className="text-gray-600 mb-4 text-sm">5 分钟读懂学术标识</p>
                <Button variant="outline" size="sm" asChild className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl">
                  <a href="/resources/what-is-doi" target="_blank">
                    阅读文章 <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
              <Card className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <Target className="w-8 h-8 mb-4" style={{ color: '#10B981' }} />
                <h3 className="text-lg font-semibold mb-3 text-gray-900">非母语如何避免 AI 误判</h3>
                <p className="text-gray-600 mb-4 text-sm">保持个人写作风格的同时提升学术表达质量的实用技巧</p>
                <Button variant="outline" size="sm" asChild className="border-green-600 text-green-600 hover:bg-green-50 rounded-xl">
                  <a href="/resources/avoid-misjudge" target="_blank">
                    阅读文章 <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
              <Card className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <TrendingUp className="w-8 h-8 mb-4" style={{ color: '#0EA5E9' }} />
                <h3 className="text-lg font-semibold mb-3 text-gray-900">用自然语言做学术图表</h3>
                <p className="text-gray-600 mb-4 text-sm">从数据到图，如何保证可追溯</p>
                <Button variant="outline" size="sm" asChild className="border-sky-600 text-sky-600 hover:bg-sky-50 rounded-xl">
                  <a href="/resources/academic-charts" target="_blank">
                    阅读文章 <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
              <Card className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <MessageSquare className="w-8 h-8 mb-4" style={{ color: '#EC4899' }} />
                <h3 className="text-lg font-semibold mb-3 text-gray-900">口头核验提问 20 例</h3>
                <p className="text-gray-600 mb-4 text-sm">与回答框架</p>
                <Button variant="outline" size="sm" asChild className="border-pink-600 text-pink-600 hover:bg-pink-50 rounded-xl">
                  <a href="/resources/viva-qa-20" target="_blank">
                    阅读文章 <ExternalLink className="ml-2 h-4 w-4" />
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
        </main>
      </div>
    </>
  );
};

export default AcademicProofWriting;