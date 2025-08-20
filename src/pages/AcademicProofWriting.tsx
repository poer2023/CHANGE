import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, CheckCircle, FileText, MessageSquare, Download, ExternalLink, Star, Users, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import images
import heroImage from '@/assets/hero-proof-of-authorship-dashboard.webp';
import citationPanel from '@/assets/citation-verification-panel.webp';
import painPointsSolutions from '@/assets/pain-points-solutions.webp';
import evidencePackage from '@/assets/evidence-package-thumbnails.webp';
import threeStepProcess from '@/assets/three-step-process.webp';
const AcademicProofWriting = () => {
  const navigate = useNavigate();
  const [showRiskScan, setShowRiskScan] = useState(false);
  const handleFreeScan = () => {
    setShowRiskScan(true);
  };
  const handleDownloadSample = () => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '/sample-evidence-package.pdf';
    link.download = 'evidence-package-sample.pdf';
    link.click();
  };
  const handleStartTrial = () => {
    navigate('/form');
  };
  return <>
      <Helmet>
        <title>引用真、文风稳、过程可证｜提交前的最后一道保险</title>
        <meta name="description" content="一键引用校验、个人文风锁定、全流程存证与口头核验演练。生成证据包，提交前做风险体检，避免 AI 误判与假引用翻车。支持 APA/MLA/GB/T。" />
        <meta name="keywords" content="学术写作合规, AI 写作检测误判, 引用校验 DOI, 论文文风一致性, proof of authorship, citation checker, stylometry, academic integrity tools" />
        <link rel="canonical" href="https://yoursite.com/academic-proofwriting" />
        
        {/* Open Graph */}
        <meta property="og:title" content="引用真、文风稳、过程可证｜提交前的最后一道保险" />
        <meta property="og:description" content="一键引用校验、个人文风锁定、全流程存证与口头核验演练。生成证据包，提交前做风险体检，避免 AI 误判与假引用翻车。支持 APA/MLA/GB/T。" />
        <meta property="og:image" content={heroImage} />
        <meta property="og:url" content="https://yoursite.com/academic-proofwriting" />
        <meta property="og:type" content="website" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["SoftwareApplication", "Product"],
          "name": "Academic ProofWriting Tool",
          "description": "一键引用校验、个人文风锁定、全流程存证与口头核验演练工具",
          "applicationCategory": "EducationApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "priceRange": "$29-$99",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127"
          }
        })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-24 px-4 text-center">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              真引用、像你写、可存证<br />
              <span className="text-primary"></span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">引用核验、文风对齐、全流程留痕，提交更稳</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" onClick={handleFreeScan} className="text-lg px-8 py-4">
                免费风险体检
              </Button>
              <Button variant="outline" size="lg" onClick={handleDownloadSample} className="text-lg px-8 py-4">
                <Download className="mr-2 h-5 w-5" />
                下载全套示例
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">校内邮箱 9 折</Badge>
              <Badge variant="secondary">覆盖 APA/MLA/GB/T</Badge>
              <Badge variant="secondary">支持本地与自托管</Badge>
            </div>

            <div className="mt-12">
              <img src={heroImage} alt="Proof-of-authorship dashboard with citation verification and risk meter" className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl" />
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              为什么"能写出来"不等于"敢提交"
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img src={painPointsSolutions} alt="Pain points and solutions comparison" className="w-full rounded-lg" />
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-destructive-foreground text-sm">✕</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">假引用/过时结论，一查就穿帮</h3>
                    <p className="text-muted-foreground">DOI 失效、期刊信息错误，面谈时无法自圆其说</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-destructive-foreground text-sm">✕</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">全文流畅却"机器腔"，与以往作业风格断层</h3>
                    <p className="text-muted-foreground">句式突变、词汇跃升，容易被怀疑非本人作品</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-destructive-foreground text-sm">✕</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">AI 检测有误伤，非母语更容易中枪</h3>
                    <p className="text-muted-foreground">检测工具无法区分"润色"与"生成"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-destructive-foreground text-sm">✕</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">面谈问检索路径和改动理由，说不清就凉</h3>
                    <p className="text-muted-foreground">无法提供写作过程证据，缺乏口头核验准备</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Overview */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              一套闭环，从"生成"到"可证"
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">引用护盾</h3>
                <p className="text-muted-foreground">DOI/ISBN 实时校验与格式一键规范</p>
              </Card>
              <Card className="p-6 text-center">
                <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">文风锁</h3>
                <p className="text-muted-foreground">对齐个人写作基线，避免风格漂移</p>
              </Card>
              <Card className="p-6 text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">证据包</h3>
                <p className="text-muted-foreground">时间线 + 段落 diff + 来源快照，一键导出</p>
              </Card>
              <Card className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">口头核验演练</h3>
                <p className="text-muted-foreground">速答卡片与当场小改</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Detailed Features */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Citation Shield */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">引用护盾</h3>
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    DOI/PMID/ISBN 实时核验，卷期页码一致性检查
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    过时结论预警、可替换权威来源建议
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    APA/MLA/GB/T 一键格式化，批量纠错
                  </li>
                </ul>
                <Button variant="outline" onClick={handleStartTrial}>
                  试跑 3 条引用
                </Button>
              </div>
              <div>
                <img src={citationPanel} alt="DOI verification and APA formatting panel" className="w-full rounded-lg shadow-lg" />
              </div>
            </div>

            {/* Style Lock */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="md:order-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">文风锁</h3>
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    基于你过往 3–5 篇作业建立个人基线
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    句长/词汇复杂度/突发度偏移可视化
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    非母语润色强度滑杆，保留"自然错误率"
                  </li>
                </ul>
                <Button variant="outline" onClick={handleStartTrial}>
                  上传历史样本文本
                </Button>
              </div>
              <div className="md:order-1">
                <div className="bg-card p-8 rounded-lg border">
                  <div className="text-center mb-4">
                    <h4 className="font-semibold mb-2">风格偏移指标</h4>
                    <div className="w-32 h-32 mx-auto border-8 border-primary rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">28</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">偏移度（目标：≤30）</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Package */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">证据包</h3>
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    记录"检索→生成→改写→人工编辑"的时间线
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    段落级 diff 与时间戳，来源快照随包带走
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    一键导出：timeline.json、diff.pdf、sources.csv
                  </li>
                </ul>
                <Button variant="outline" onClick={handleDownloadSample}>
                  <Download className="mr-2 h-4 w-4" />
                  下载示例证据包
                </Button>
              </div>
              <div>
                <img src={evidencePackage} alt="Exportable evidence package with timeline, diff, sources" className="w-full rounded-lg shadow-lg" />
              </div>
            </div>

            {/* Oral Verification */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="md:order-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">口头核验演练</h3>
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    自动生成"检索路径讲稿 + 速答卡片"
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    "当场小改"模式：对任意段落给出改动理由与证据指向
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    导出 1 页提纲，10 分钟速练
                  </li>
                </ul>
                <Button variant="outline" onClick={handleStartTrial}>
                  开启 3 分钟快速演练
                </Button>
              </div>
              <div className="md:order-1">
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">模拟问答卡片</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded">
                      <p className="font-medium">Q: 你的检索关键词是什么？</p>
                      <p className="text-sm text-muted-foreground mt-1">A: 我使用了"climate change adaptation"和"urban planning"...</p>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <p className="font-medium">Q: 这个段落为什么这样改写？</p>
                      <p className="text-sm text-muted-foreground mt-1">A: 原文过于复杂，我简化了句式但保留了核心观点...</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              三步走，提交更稳
            </h2>
            <img src={threeStepProcess} alt="Three-step process: Upload, Align, Export" className="w-full max-w-4xl mx-auto mb-8" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-xl font-semibold mb-3">上传与体检</h3>
                <p className="text-muted-foreground">一键扫描风险与引用</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-xl font-semibold mb-3">对齐与修复</h3>
                <p className="text-muted-foreground">风格回到个人基线，引用自动纠错</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-xl font-semibold mb-3">导出与演练</h3>
                <p className="text-muted-foreground">生成证据包，跑一遍口头问答</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              用户见证
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">本科生 / 某985高校</p>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">"引用从 12 处报错纠正到全部通过，面谈时口头核验练习派上大用场，提交更安心了。"</p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">硕士生 / 海外留学</p>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">"文风偏移从85降到28，避免了风格断层的尴尬，证据包让导师看到我的写作过程。"</p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">博士生 / 理工科</p>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">"DOI自动校验发现了3个失效链接，APA格式一键修复，节省大量时间。"</p>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card className="p-6 text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">96%</h3>
                <p className="text-muted-foreground">引用合规度提升</p>
              </Card>
              <Card className="p-6 text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">-68%</h3>
                <p className="text-muted-foreground">风险分下降幅度</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              价格与方案
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">学期包</h3>
                <p className="text-3xl font-bold mb-4">$99<span className="text-sm font-normal text-muted-foreground">/学期</span></p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• 不限次体检</li>
                  <li>• 证据包导出</li>
                  <li>• 1 次人工引用复核</li>
                </ul>
                <Button className="w-full" onClick={handleStartTrial}>立即开通</Button>
              </Card>
              <Card className="p-6 border-primary relative">
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">推荐</Badge>
                <h3 className="text-xl font-semibold mb-4">按量包</h3>
                <p className="text-3xl font-bold mb-4">$0.05<span className="text-sm font-normal text-muted-foreground">/字</span></p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• 按字数/篇数计费</li>
                  <li>• 超出自动阶梯价</li>
                  <li>• 灵活使用</li>
                </ul>
                <Button className="w-full" onClick={handleStartTrial}>立即开通</Button>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">校园码</h3>
                <p className="text-3xl font-bold mb-4">定制<span className="text-sm font-normal text-muted-foreground">/班级</span></p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• 班级/学院批量采购</li>
                  <li>• 送口头核验模板库</li>
                  <li>• 专属技术支持</li>
                </ul>
                <Button variant="outline" className="w-full">联系采购</Button>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              常见问题
            </h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>这是不是"AI 过检神器"？</AccordionTrigger>
                <AccordionContent>
                  不是。我们提供"可校验写作"的工具与证据包，帮助你在被问责时自证作者身份，并把引用和风格问题提前修好。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>支持哪些引用格式？</AccordionTrigger>
                <AccordionContent>
                  APA、MLA、GB/T 7714，支持 DOI/ISBN/PMID 校验与批量纠错。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>非母语写作者会被"修得太像母语"吗？</AccordionTrigger>
                <AccordionContent>
                  可调节润色强度，并保留自然错误率，避免风格断层。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>如何保护隐私和合规？</AccordionTrigger>
                <AccordionContent>
                  支持本地优先与自托管；证据包可脱敏导出，外链可设有效期与可见范围。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>老师要求展示写作过程怎么办？</AccordionTrigger>
                <AccordionContent>
                  时间线、段落 diff、来源快照都在证据包里，另附口头核验速答卡与讲稿。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Trust & Compliance */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              可信与合规
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">数据与隐私</h3>
                <p className="text-muted-foreground">默认最小化采集，上传即处理即弃模式可选</p>
              </Card>
              <Card className="p-6 text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">教育用途声明</h3>
                <p className="text-muted-foreground">不提供代写与"过检承诺"；产品定位为合规辅助</p>
              </Card>
              <Card className="p-6 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">教师合作</h3>
                <p className="text-muted-foreground">申请教育试用与 API</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Blog Resources */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              相关资源
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3">DOI 是什么：5 分钟读懂学术标识</h3>
                <p className="text-muted-foreground mb-4">了解 DOI 系统如何确保引用的准确性和可追溯性</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/blog/understanding-doi">
                    阅读文章 <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3">非母语写作者如何避免 AI 误判</h3>
                <p className="text-muted-foreground mb-4">保持个人写作风格的同时提升学术表达质量</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/blog/avoid-ai-detection">
                    阅读文章 <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3">口头核验提问 20 例与回答框架</h3>
                <p className="text-muted-foreground mb-4">准备常见的学术诚信面谈问题和应答策略</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/blog/oral-verification-guide">
                    阅读文章 <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Risk Scan Modal */}
        {showRiskScan && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">提交前做一次"风险体检"</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">粘贴文本或上传文档（≤2MB）</label>
                  <textarea className="w-full h-32 p-3 border rounded-md resize-none" placeholder="粘贴 800-1200 字的文本..." />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">或</p>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    上传文档
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => {
                setShowRiskScan(false);
                handleStartTrial();
              }}>
                    开始体检
                  </Button>
                  <Button variant="outline" onClick={() => setShowRiskScan(false)}>
                    取消
                  </Button>
                </div>
              </div>
            </Card>
          </div>}

        {/* Footer CTA */}
        <section className="py-16 px-4 text-center bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              开始你的学术合规之旅
            </h2>
            <p className="text-xl mb-8 opacity-90">
              让每一篇论文都经得起质疑，每一次提交都充满信心
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={handleFreeScan}>
                免费风险体检
              </Button>
              <Button size="lg" variant="outline" onClick={handleStartTrial}>
                立即开始
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>;
};
export default AcademicProofWriting;