import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import OutcomePanel from '@/components/WritingFlow/OutcomePanel';
import Gate1Modal from '@/components/Gate1Modal';
import { useStep1, useEstimate, useAutopilot, useApp, useWritingFlow as useNewWritingFlow, usePayment } from '@/state/AppContext';
import { lockPrice, createPaymentIntent, confirmPayment, startAutopilot as apiStartAutopilot, streamAutopilotProgress, track } from '@/services/pricing';
import { useWritingFlow } from '@/contexts/WritingFlowContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, 
  Plus, 
  X,
  ArrowRight,
  Save,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  BookOpen,
  Zap,
  GripVertical,
  BarChart3,
  FileText,
  Brain,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 数据模型类型定义
interface EvidencePlan {
  id: string;
  sourceType: 'paper' | 'book' | 'web' | 'dataset' | 'report';
  keywords: string;
  expectedCitations: number;
  needFigure?: boolean;
}

interface Claim {
  id: string;
  title: string;
  strength: number;
  evidence: EvidencePlan[];
  risks?: string[];
}

interface Counter {
  id: string;
  viewpoint: string;
  rebuttal: string;
  asParagraph: boolean;
}

interface Structure {
  template: 'PEEL' | 'TOULMIN' | 'CONCEDE' | 'PROBLEM';
  allocation: {
    intro: number;
    body: number[];
    conclusion: number;
  };
  blueprint: Array<{
    idx: number;
    role: 'intro' | 'body' | 'conclusion';
    summary: string;
    claimRef?: string;
    expectedCitations?: number;
  }>;
}

interface Strategy {
  thesis: string;
  essayType: 'argument' | 'analysis' | 'expository' | 'compare' | 'review';
  audience: 'academic' | 'general' | 'decision';
  register: 'formal' | 'neutral' | 'explanatory';
  claims: Claim[];
  counters: Counter[];
  structure: Structure;
  citationStyle: 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'GBT';
  level: 'undergrad' | 'postgrad' | 'esl' | 'pro';
  allowedSources: Array<'any' | 'papers' | 'books' | 'web' | 'datasets' | 'report'>;
  expectedCitationRange?: [number, number];
}

// Zod 验证架构

const strategySchema = z.object({
  thesis: z.string()
    .min(1, '请填写主题句')
    .max(500, '主题句不能超过500个字符'),
  essayType: z.enum(['argument', 'analysis', 'expository', 'compare', 'review']),
  audience: z.enum(['academic', 'general', 'decision']),
  register: z.enum(['formal', 'neutral', 'explanatory']),
  claims: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, '请填写论点'),
    strength: z.number().min(0).max(100),
    evidence: z.array(z.object({
      id: z.string(),
      sourceType: z.enum(['paper', 'book', 'web', 'dataset', 'report']),
      keywords: z.string().min(1, '关键词不能为空'),
      expectedCitations: z.number().int().min(1).max(10),
      needFigure: z.boolean().optional()
    })).optional().default([]),
    risks: z.array(z.string()).optional()
  })).min(1, '至少需要1个论点').max(10, '最多10个论点'),
  counters: z.array(z.object({
    id: z.string(),
    viewpoint: z.string().min(1, '请填写反方观点'),
    rebuttal: z.string().min(1, '请填写反驳'),
    asParagraph: z.boolean()
  })).optional().default([]), // 改为可选
  structure: z.object({
    template: z.enum(['PEEL', 'TOULMIN', 'CONCEDE', 'PROBLEM']),
    allocation: z.object({
      intro: z.number().min(5).max(20),
      body: z.array(z.number().min(10).max(30)).optional().default([]),
      conclusion: z.number().min(5).max(20)
    }),
    blueprint: z.array(z.object({
      idx: z.number(),
      role: z.enum(['intro', 'body', 'conclusion']),
      summary: z.string(),
      claimRef: z.string().optional(),
      expectedCitations: z.number().int().min(0).max(6).optional()
    })).optional().default([])
  }),
  citationStyle: z.enum(['APA', 'MLA', 'Chicago', 'IEEE', 'GBT']),
  level: z.enum(['undergrad', 'postgrad', 'esl', 'pro']),
  allowedSources: z.array(z.enum(['any', 'papers', 'books', 'web', 'datasets', 'report'])).min(1),
  expectedCitationRange: z.tuple([z.number().int().min(0), z.number().int().min(0)]).optional()
});

// 质量评分计算函数
const calculateQualityScores = (data: Partial<Strategy>) => {
  const scores = {
    可辩驳性: 0,
    具体度: 0,
    一致性: 0,
    可证据化: 0
  };

  // 可辩驳性：主题句包含让步或对立结构 + 反方条数
  if (data.thesis) {
    const debatableKeywords = ['尽管', '虽然', '因为', '导致', '然而', '但是', '不过', '仍然'];
    const hasDebatableStructure = debatableKeywords.some(keyword => data.thesis!.includes(keyword));
    scores.可辩驳性 += hasDebatableStructure ? 50 : 0;
  }
  if (data.counters) {
    scores.可辩驳性 += Math.min(data.counters.length * 25, 50);
  }

  // 具体度：主题句长度与限定成分
  if (data.thesis) {
    scores.具体度 += Math.min((data.thesis.length - 20) / 180 * 60, 60);
    const limitingWords = ['在', '对于', '关于', '针对', '基于', '通过', '从'];
    const hasLimiting = limitingWords.some(word => data.thesis.includes(word));
    scores.具体度 += hasLimiting ? 40 : 0;
  }

  // 一致性：论点与主题句关键词重叠
  if (data.thesis && data.claims) {
    const thesisKeywords = data.thesis.split('').filter(char => /[\u4e00-\u9fff]/.test(char));
    const totalOverlap = data.claims.reduce((acc, claim) => {
      const claimKeywords = claim.title.split('').filter(char => /[\u4e00-\u9fff]/.test(char));
      const overlap = thesisKeywords.filter(word => claimKeywords.includes(word)).length;
      return acc + (overlap / Math.max(thesisKeywords.length, claimKeywords.length));
    }, 0);
    scores.一致性 = Math.min((totalOverlap / data.claims.length) * 100, 100);
  }

  // 可证据化：证据计划条目数量与类型多样性
  if (data.claims) {
    const totalEvidence = data.claims.reduce((acc, claim) => acc + claim.evidence.length, 0);
    const evidenceTypes = new Set(
      data.claims.flatMap(claim => claim.evidence.map(e => e.sourceType))
    );
    scores.可证据化 = Math.min((totalEvidence * 10) + (evidenceTypes.size * 10), 100);
  }

  return scores;
};

// 结构模板配置
const structureTemplates = {
  PEEL: {
    name: 'PEEL (论点-证据-解释-链接)',
    description: '每段包含论点、证据、解释和链接到下一段',
    example: '首先提出论点，然后提供证据支持，解释证据如何支持论点，最后链接到下一个论点。'
  },
  TOULMIN: {
    name: 'Toulmin (主张-数据-担保)',
    description: '基于逻辑推理的论证结构',
    example: '提出主张，提供数据支持，说明担保（数据如何支持主张），考虑限定条件。'
  },
  CONCEDE: {
    name: '让步-反驳 (承认-但是-因为)',
    description: '先承认对方观点的合理性，然后反驳',
    example: '虽然X观点有一定道理，但是基于Y证据，Z结论更加合理。'
  },
  PROBLEM: {
    name: '问题-分析-建议',
    description: '识别问题，分析原因，提出解决方案',
    example: '首先识别核心问题，分析问题的成因和影响，最后提出具体的解决建议。'
  }
};

const StrategyStep: React.FC = () => {
  const { project, updateStrategy, setCurrentStep, completeStep } = useWritingFlow();
  const { track: trackEvent } = useApp();
  const { step1 } = useStep1();
  const { estimate, setEstimate } = useEstimate();
  const { autopilot, startAutopilot, minimizeAutopilot, pauseAutopilot, resumeAutopilot, stopAutopilot } = useAutopilot();
  const { writingFlow, updateMetrics, toggleAddon, setError } = useNewWritingFlow();
  const { pay, lockPrice: lockPriceState } = usePayment();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [expandedClaims, setExpandedClaims] = useState<Set<string>>(new Set());
  const [isGeneratingEvidence, setIsGeneratingEvidence] = useState<string | null>(null);
  const [showGate1Modal, setShowGate1Modal] = useState(false);
  const [verificationLevel, setVerificationLevel] = useState<'Basic' | 'Standard' | 'Pro'>('Standard');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const form = useForm<Strategy>({
    resolver: zodResolver(strategySchema),
    defaultValues: {
      thesis: project.strategy?.thesis || '',
      essayType: 'argument',
      audience: 'academic',
      register: 'formal',
      claims: project.strategy?.claims || [],
      counters: project.strategy?.counters || [],
      structure: {
        template: 'PEEL',
        allocation: { intro: 10, body: [25, 25, 25], conclusion: 15 },
        blueprint: []
      },
      citationStyle: project.topic?.citationStyle || 'APA',
      level: project.topic?.languageLevel || 'undergrad',
      allowedSources: project.topic?.sources || ['any'],
      expectedCitationRange: [10, 20]
    }
  });

  const { control, handleSubmit, watch, setValue, formState: { errors, isValid } } = form;
  const { fields: claimFields, append: appendClaim, remove: removeClaim, move: moveClaim } = useFieldArray({
    control,
    name: 'claims'
  });
  const { fields: counterFields, append: appendCounter, remove: removeCounter } = useFieldArray({
    control,
    name: 'counters'
  });

  const watchedData = watch();
  const qualityScores = calculateQualityScores(watchedData);
  const averageScore = Object.values(qualityScores).reduce((a, b) => a + b, 0) / 4;

  // 自动保存
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('writing-flow:strategy', JSON.stringify(watchedData));
    }, 2000);

    return () => clearTimeout(timeout);
  }, [watchedData]);

  // 从localStorage恢复
  useEffect(() => {
    const saved = localStorage.getItem('writing-flow:strategy');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
          setValue(key as keyof Strategy, data[key]);
        });
      } catch (error) {
        console.error('恢复策略数据失败:', error);
      }
    }
  }, [setValue]);

  // 生成段落蓝图
  const generateBlueprint = (template: string, wordCount: number, claims: Claim[]) => {
    const allocation = watchedData.structure.allocation;
    const blueprint = [];
    
    // 引言
    blueprint.push({
      idx: 1,
      role: 'intro' as const,
      summary: '介绍主题背景，提出论题，预告主要论点',
      expectedCitations: 2
    });

    // 主体段落
    claims.forEach((claim, index) => {
      blueprint.push({
        idx: index + 2,
        role: 'body' as const,
        summary: `论述${claim.title}，提供证据支持`,
        claimRef: claim.id,
        expectedCitations: claim.evidence.reduce((sum, e) => sum + e.expectedCitations, 0)
      });
    });

    // 结论
    blueprint.push({
      idx: claims.length + 2,
      role: 'conclusion' as const,
      summary: '总结主要论点，重申论题，展望未来',
      expectedCitations: 1
    });

    return blueprint;
  };

  // AI生成证据计划（占位函数）
  const generateEvidenceForClaim = async (claimIndex: number) => {
    setIsGeneratingEvidence(`claim-${claimIndex}`);
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockEvidence: EvidencePlan[] = [
      {
        id: `evidence-${Date.now()}-1`,
        sourceType: 'paper',
        keywords: '学术研究 实证分析',
        expectedCitations: 2,
        needFigure: false
      },
      {
        id: `evidence-${Date.now()}-2`,
        sourceType: 'dataset',
        keywords: '统计数据 调查报告',
        expectedCitations: 1,
        needFigure: true
      }
    ];

    const currentClaims = form.getValues('claims');
    currentClaims[claimIndex].evidence = [...currentClaims[claimIndex].evidence, ...mockEvidence];
    setValue('claims', currentClaims);
    
    setIsGeneratingEvidence(null);
    toast({
      title: '证据计划生成完成',
      description: '已为该论点生成2个证据计划'
    });
  };

  // OutcomePanel handlers
  const handleShowPreview = () => {
    trackEvent('preview_sample_click', { context: 'strategy_step', sampleType: 'academic_writing' });
    toast({
      title: '功能开发中',
      description: '样例预览功能即将上线'
    });
  };

  const handlePayAndWrite = async () => {
    try {
      track('outcome_pay_and_write_click', { step: 'strategy' });
      
      let finalPrice = pay.lockedPrice;
      
      if (!finalPrice) {
        const priceLockResponse = await lockPrice({
          title: step1.title,
          wordCount: step1.wordCount,
          verifyLevel: verificationLevel
        });
        
        lockPriceState(priceLockResponse.value, priceLockResponse.expiresAt);
        finalPrice = priceLockResponse;
      }
      
      setShowGate1Modal(true);
      
    } catch (error) {
      console.error('Error in pay and write:', error);
      setError(error instanceof Error ? error.message : '价格锁定失败，请重试');
      
      toast({
        title: '错误',
        description: '价格锁定失败，请重试',
        variant: 'destructive'
      });
    }
  };

  const handleGate1Unlock = async () => {
    try {
      setIsProcessingPayment(true);
      
      if (!pay.lockedPrice) {
        throw new Error('No locked price available');
      }
      
      const paymentIntent = await createPaymentIntent({
        price: pay.lockedPrice.value
      });
      
      track('gate1_payment_intent_created', {
        paymentIntentId: paymentIntent.paymentIntentId,
        price: pay.lockedPrice.value
      });
      
      const confirmResponse = await confirmPayment(paymentIntent.paymentIntentId);
      
      if (confirmResponse.status === 'succeeded') {
        track('gate1_payment_success', {
          paymentIntentId: paymentIntent.paymentIntentId,
          price: pay.lockedPrice.value
        });
        
        setShowGate1Modal(false);
        await startAutopilotFlow();
        
        toast({
          title: '支付成功',
          description: '正在启动自动推进流程...'
        });
      } else {
        throw new Error('Payment failed');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : '支付失败，请重试');
      
      track('gate1_payment_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast({
        title: '支付失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleGate1PreviewOnly = () => {
    setShowGate1Modal(false);
    toast({
      title: '预览模式',
      description: '您可以继续浏览，稍后再解锁完整功能'
    });
  };

  const startAutopilotFlow = async () => {
    try {
      const config = {
        verifyLevel: verificationLevel,
        allowPreprint: true,
        useStyle: step1.styleSamples.length > 0
      };
      
      const response = await apiStartAutopilot({
        fromStep: 'outline' as any,
        config
      });
      
      await startAutopilot(config);
      
      const cancelStream = streamAutopilotProgress(
        response.taskId,
        (progressData) => {
          // Progress handling via existing autopilot system
        },
        (docId) => {
          navigate(`/result?from=autopilot&docId=${docId}`);
        },
        (error) => {
          setError(error);
          toast({
            title: '自动推进失败',
            description: error,
            variant: 'destructive'
          });
        }
      );
      
      track('autopilot_started_from_strategy', {
        taskId: response.taskId,
        config
      });
      
    } catch (error) {
      console.error('Failed to start autopilot:', error);
      setError(error instanceof Error ? error.message : '启动自动推进失败');
    }
  };

  const handleVerifyLevelChange = (level: 'Basic' | 'Standard' | 'Pro') => {
    setVerificationLevel(level);
    track('outcome_verify_change', { level, step: 'strategy' });
  };

  const handleToggleAddon = (key: string, enabled: boolean) => {
    toggleAddon(key, enabled);
    track('outcome_addon_toggle', { key, enabled, step: 'strategy' });
  };

  const handleRetry = () => {
    setError(undefined);
    toast({
      title: '重试',
      description: '请重新尝试操作'
    });
  };

  // Update metrics when strategy data changes
  useEffect(() => {
    const currentData = watch();
    if (currentData.claims) {
      updateMetrics({
        thesisCandidates: currentData.claims.length,
        pickedStructure: currentData.structure ? 1 : 0,
        claimCount: currentData.claims.filter(claim => claim.strength > 75).length
      });
    }
  }, [watch(), updateMetrics]);

  const onSubmit = async (data: Strategy) => {
    try {
      // 生成段落蓝图
      const blueprint = generateBlueprint(data.structure.template, project.topic.wordLimit, data.claims);
      data.structure.blueprint = blueprint;

      updateStrategy(data);
      sessionStorage.setItem('writing-flow:strategy', JSON.stringify(data));
      
      completeStep('strategy');
      setCurrentStep('outline');
      navigate('/writing-flow/outline');
      
      toast({
        title: '写作策略完成',
        description: '已保存策略设置，正在进入大纲编辑...'
      });
    } catch (error) {
      toast({
        title: '保存失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    }
  };

  const saveDraft = () => {
    const currentData = watch();
    localStorage.setItem('writing-flow:strategy', JSON.stringify(currentData));
    toast({
      title: '草稿已保存',
      description: '您的策略已保存到本地'
    });
  };

  const addNewClaim = () => {
    const newClaim: Claim = {
      id: `claim-${Date.now()}`,
      title: '',
      strength: 0,
      evidence: []
    };
    appendClaim(newClaim);
    setExpandedClaims(prev => new Set([...prev, newClaim.id]));
  };

  const addNewCounter = () => {
    const newCounter: Counter = {
      id: `counter-${Date.now()}`,
      viewpoint: '',
      rebuttal: '',
      asParagraph: true
    };
    appendCounter(newCounter);
  };

  const toggleClaimExpanded = (claimId: string) => {
    setExpandedClaims(prev => {
      const newSet = new Set(prev);
      if (newSet.has(claimId)) {
        newSet.delete(claimId);
      } else {
        newSet.add(claimId);
      }
      return newSet;
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    moveClaim(result.source.index, result.destination.index);
  };

  // 简化门槛检查 - 允许用户随时进入下一步
  const hasMinimumRequirements = true; // 常亮可交互
  const firstError = Object.entries(qualityScores).find(([_, score]) => score < 60);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#6E5BFF] text-white">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-4xl font-semibold leading-tight text-gray-900">写作策略</h1>
            <p className="text-[#5B667A] text-sm leading-6 mt-1">制定论文的核心论点和论证策略</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Main Form */}
        <div className="flex-1 lg:max-w-[680px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 质量建议提示 */}
        {averageScore < 60 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-medium text-blue-800">建议优化策略质量</h3>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p>• 可进一步完善论题表达（当前：{qualityScores.具体度.toFixed(0)}%）</p>
                    <p>• 建议添加更多论点支撑（当前：{watchedData.claims?.length || 0}个）</p>
                    <p>• 可补充证据来源规划（当前：{qualityScores.可证据化.toFixed(0)}%）</p>
                    <p className="text-xs opacity-75">💡 以上为可选建议，您可以直接进入下一步</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 质量评分仪表 */}
        <Card className="bg-white border-[#EEF0F4] rounded-2xl" style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-base font-semibold">
              <div className="w-2 h-2 rounded-full bg-[#6E5BFF]"></div>
              <BarChart3 className="h-5 w-5 text-[#6E5BFF]" />
              质量评分
            </CardTitle>
            <CardDescription className="text-sm text-[#5B667A]">
              评估写作策略的四个核心维度
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(qualityScores).map(([key, score]) => (
                <div key={key} className="text-center">
                  <div className={cn(
                    "relative w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-sm font-medium",
                    score >= 60 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {score.toFixed(0)}
                    {score < 60 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs text-[#5B667A]">{key}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1">
                <Progress value={averageScore} className="h-2" />
              </div>
              <span className="text-sm font-medium">{averageScore.toFixed(0)}%</span>
            </div>
          </CardContent>
        </Card>

        {/* 主题句 */}
        <Card className="bg-white border-[#EEF0F4] rounded-2xl" style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-base font-semibold">
              <div className="w-2 h-2 rounded-full bg-[#6E5BFF]"></div>
              <Lightbulb className="h-5 w-5 text-[#6E5BFF]" />
              主题句 Thesis
              {qualityScores.可辩驳性 < 60 && (
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </CardTitle>
            <CardDescription className="text-sm text-[#5B667A] leading-6">
              明确、具有争议性的核心观点，包含因果或对立结构
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3 space-y-2">
                <Label htmlFor="thesis" className="text-sm font-medium text-gray-900">
                  论文主题句 <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="thesis"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="thesis"
                      placeholder="输入您的论文主题句。建议包含让步或对立结构，如：虽然...但是...，尽管...然而..."
                      rows={4}
                      className={cn(
                        "rounded-xl border-[#EEF0F4] focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF] focus:ring-opacity-20 transition-all duration-200",
                        errors.thesis && "border-red-500 focus:border-red-500 focus:ring-red-200"
                      )}
                    />
                  )}
                />
                {errors.thesis && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.thesis.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">论文类型</Label>
                <Controller
                  name="essayType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-[#EEF0F4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="argument">论证性</SelectItem>
                        <SelectItem value="analysis">分析性</SelectItem>
                        <SelectItem value="expository">说明性</SelectItem>
                        <SelectItem value="compare">比较性</SelectItem>
                        <SelectItem value="review">评论性</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">目标读者</Label>
                <Controller
                  name="audience"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-[#EEF0F4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">学术界</SelectItem>
                        <SelectItem value="general">普通大众</SelectItem>
                        <SelectItem value="decision">决策者</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">语言风格</Label>
                <Controller
                  name="register"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-[#EEF0F4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">正式</SelectItem>
                        <SelectItem value="neutral">中性</SelectItem>
                        <SelectItem value="explanatory">解释性</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 论点清单 */}
        <Card className="bg-white border-[#EEF0F4] rounded-2xl" style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-base font-semibold">
                  <div className="w-2 h-2 rounded-full bg-[#6E5BFF]"></div>
                  <Zap className="h-5 w-5 text-[#6E5BFF]" />
                  论点清单
                  {qualityScores.一致性 < 60 && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </CardTitle>
                <CardDescription className="text-sm text-[#5B667A] leading-6">
                  支持主题句的具体论点，可拖拽排序
                </CardDescription>
              </div>
              <Button
                type="button"
                onClick={addNewClaim}
                className="rounded-full bg-[#6E5BFF] hover:bg-[#5B4FCC] text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加论点
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="claims">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {claimFields.map((claim, index) => (
                      <Draggable key={claim.id} draggableId={claim.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cn(
                              "border rounded-xl p-4 bg-white",
                              snapshot.isDragging && "shadow-lg rotate-1"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                {...provided.dragHandleProps}
                                className="mt-2 p-1 hover:bg-gray-100 rounded cursor-move"
                              >
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>
                              
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary" className="text-xs">
                                    论点 {index + 1}
                                  </Badge>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleClaimExpanded(claim.id)}
                                    >
                                      {expandedClaims.has(claim.id) ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeClaim(index)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                <Controller
                                  name={`claims.${index}.title`}
                                  control={control}
                                  render={({ field }) => (
                                    <Textarea
                                      {...field}
                                      placeholder="输入具体论点..."
                                      rows={2}
                                      className="rounded-xl border-[#EEF0F4]"
                                    />
                                  )}
                                />

                                {expandedClaims.has(claim.id) && (
                                  <div className="space-y-4 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm font-medium">证据计划</Label>
                                      <div className="flex gap-2">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => generateEvidenceForClaim(index)}
                                          disabled={isGeneratingEvidence === `claim-${index}`}
                                          className="text-xs"
                                        >
                                          {isGeneratingEvidence === `claim-${index}` ? (
                                            'AI生成中...'
                                          ) : (
                                            <>
                                              <Sparkles className="h-3 w-3 mr-1" />
                                              AI生成
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    {/* 证据计划编辑界面 */}
                                    <div className="space-y-3">
                                      {watchedData.claims?.[index]?.evidence?.map((evidence, evidenceIndex) => (
                                        <div key={evidence.id} className="border rounded-lg p-3 bg-gray-50">
                                          <div className="flex items-start gap-3">
                                            <div className="flex-1 space-y-2">
                                              <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                  <Label className="text-xs text-gray-600">来源类型</Label>
                                                  <Select
                                                    value={evidence.sourceType}
                                                    onValueChange={(value) => {
                                                      const claims = [...watchedData.claims];
                                                      claims[index].evidence[evidenceIndex].sourceType = value as any;
                                                      setValue('claims', claims);
                                                    }}
                                                  >
                                                    <SelectTrigger className="h-8 text-xs">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="paper">学术论文</SelectItem>
                                                      <SelectItem value="book">书籍</SelectItem>
                                                      <SelectItem value="web">网站</SelectItem>
                                                      <SelectItem value="dataset">数据集</SelectItem>
                                                      <SelectItem value="report">报告</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                
                                                <div className="space-y-1">
                                                  <Label className="text-xs text-gray-600">预估引用数</Label>
                                                  <Input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={evidence.expectedCitations}
                                                    onChange={(e) => {
                                                      const claims = [...watchedData.claims];
                                                      claims[index].evidence[evidenceIndex].expectedCitations = parseInt(e.target.value);
                                                      setValue('claims', claims);
                                                    }}
                                                    className="h-8 text-xs"
                                                  />
                                                </div>
                                              </div>
                                              
                                              <div className="space-y-1">
                                                <Label className="text-xs text-gray-600">检索关键词</Label>
                                                <Input
                                                  value={evidence.keywords}
                                                  onChange={(e) => {
                                                    const claims = [...watchedData.claims];
                                                    claims[index].evidence[evidenceIndex].keywords = e.target.value;
                                                    setValue('claims', claims);
                                                  }}
                                                  placeholder="关键词"
                                                  className="h-8 text-xs"
                                                />
                                              </div>
                                              
                                              <div className="flex items-center space-x-2">
                                                <Checkbox
                                                  checked={evidence.needFigure || false}
                                                  onCheckedChange={(checked) => {
                                                    const claims = [...watchedData.claims];
                                                    claims[index].evidence[evidenceIndex].needFigure = !!checked;
                                                    setValue('claims', claims);
                                                  }}
                                                  id={`evidence-figure-${evidence.id}`}
                                                />
                                                <Label htmlFor={`evidence-figure-${evidence.id}`} className="text-xs">
                                                  需要图/表
                                                </Label>
                                              </div>
                                            </div>
                                            
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => {
                                                const claims = [...watchedData.claims];
                                                claims[index].evidence = claims[index].evidence.filter((_, i) => i !== evidenceIndex);
                                                setValue('claims', claims);
                                              }}
                                              className="text-red-600 hover:text-red-700 p-1"
                                            >
                                              <X className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                      
                                      {(!watchedData.claims?.[index]?.evidence?.length) && (
                                        <div className="text-center py-4 text-gray-400 text-sm">
                                          暂无证据计划，点击上方AI生成按钮添加
                                        </div>
                                      )}
                                      
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newEvidence: EvidencePlan = {
                                            id: `evidence-${Date.now()}`,
                                            sourceType: 'paper',
                                            keywords: '',
                                            expectedCitations: 1,
                                            needFigure: false
                                          };
                                          const claims = [...watchedData.claims];
                                          if (!claims[index].evidence) claims[index].evidence = [];
                                          claims[index].evidence.push(newEvidence);
                                          setValue('claims', claims);
                                        }}
                                        className="w-full text-xs"
                                      >
                                        <Plus className="h-3 w-3 mr-1" />
                                        手动添加证据计划
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {claimFields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>还没有添加任何论点</p>
                <p className="text-sm">点击上方按钮添加支持主题句的论点</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 反方与反驳 */}
        <Card className="bg-white border-[#EEF0F4] rounded-2xl" style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-base font-semibold">
                  <div className="w-2 h-2 rounded-full bg-[#6E5BFF]"></div>
                  <TrendingUp className="h-5 w-5 text-[#6E5BFF]" />
                  反方与反驳
                </CardTitle>
                <CardDescription className="text-sm text-[#5B667A] leading-6">
                  考虑可能的反对观点并准备反驳
                </CardDescription>
              </div>
              <Button
                type="button"
                onClick={addNewCounter}
                className="rounded-full bg-[#6E5BFF] hover:bg-[#5B4FCC] text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加反方
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {counterFields.map((counter, index) => (
                <div key={counter.id} className="border rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      反方观点 {index + 1}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCounter(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">反方观点</Label>
                      <Controller
                        name={`counters.${index}.viewpoint`}
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            placeholder="可能的反对观点..."
                            rows={3}
                            className="rounded-xl border-[#EEF0F4]"
                          />
                        )}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">你的反驳</Label>
                      <Controller
                        name={`counters.${index}.rebuttal`}
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            placeholder="对反方观点的反驳..."
                            rows={3}
                            className="rounded-xl border-[#EEF0F4]"
                          />
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Controller
                      name={`counters.${index}.asParagraph`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id={`counter-paragraph-${index}`}
                          />
                          <Label htmlFor={`counter-paragraph-${index}`} className="text-sm">
                            作为独立段落处理
                          </Label>
                        </div>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 结构策略 */}
        <Card className="bg-white border-[#EEF0F4] rounded-2xl" style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-base font-semibold">
              <div className="w-2 h-2 rounded-full bg-[#6E5BFF]"></div>
              <FileText className="h-5 w-5 text-[#6E5BFF]" />
              结构策略
            </CardTitle>
            <CardDescription className="text-sm text-[#5B667A] leading-6">
              选择论证模板和段落结构
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">结构模板</Label>
                <Controller
                  name="structure.template"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-[#EEF0F4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(structureTemplates).map(([key, template]) => (
                          <SelectItem key={key} value={key}>
                            <div className="text-left">
                              <div className="font-medium">{template.name}</div>
                              <div className="text-xs text-gray-500">{template.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {watchedData.structure?.template && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <strong>示例：</strong>
                    {structureTemplates[watchedData.structure.template].example}
                  </div>
                )}
              </div>

              {/* 字数分配 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-900">字数分配</Label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">引言</Label>
                    <Controller
                      name="structure.allocation.intro"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="5"
                            max="20"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                            className="rounded-xl border-[#EEF0F4]"
                          />
                          <span className="text-xs text-gray-500">%</span>
                        </div>
                      )}
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-xs text-gray-600">主体段落</Label>
                    <div className="text-xs text-gray-500">
                      自动均分给 {watchedData.claims?.length || 3} 个论点
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">结论</Label>
                    <Controller
                      name="structure.allocation.conclusion"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="5"
                            max="20"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                            className="rounded-xl border-[#EEF0F4]"
                          />
                          <span className="text-xs text-gray-500">%</span>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* 段落蓝图预览 */}
              {watchedData.claims && watchedData.claims.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">段落蓝图预览</Label>
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">段号</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">段功能</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">建议内容要点</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">对应论点</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">预计引用</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* 引言 */}
                        <tr className="border-t">
                          <td className="px-4 py-2 text-sm">1</td>
                          <td className="px-4 py-2 text-sm">
                            <Badge variant="outline" className="text-xs">引言</Badge>
                          </td>
                          <td className="px-4 py-2 text-sm">介绍主题背景，提出论题，预告主要论点</td>
                          <td className="px-4 py-2 text-sm text-gray-500">-</td>
                          <td className="px-4 py-2 text-sm">2</td>
                        </tr>
                        
                        {/* 主体段落 */}
                        {watchedData.claims.map((claim, index) => (
                          <tr key={claim.id} className="border-t">
                            <td className="px-4 py-2 text-sm">{index + 2}</td>
                            <td className="px-4 py-2 text-sm">
                              <Badge variant="default" className="text-xs bg-[#6E5BFF] text-white">主体</Badge>
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {structureTemplates[watchedData.structure?.template || 'PEEL'].name.split('(')[0]} - 论述并支持论点
                            </td>
                            <td className="px-4 py-2 text-sm">
                              <div className="truncate max-w-[120px]" title={claim.title}>
                                {claim.title || `论点 ${index + 1}`}
                              </div>
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {claim.evidence?.reduce((sum, e) => sum + e.expectedCitations, 0) || 1}
                            </td>
                          </tr>
                        ))}
                        
                        {/* 结论 */}
                        <tr className="border-t">
                          <td className="px-4 py-2 text-sm">{watchedData.claims.length + 2}</td>
                          <td className="px-4 py-2 text-sm">
                            <Badge variant="secondary" className="text-xs">结论</Badge>
                          </td>
                          <td className="px-4 py-2 text-sm">总结主要论点，重申论题，展望未来</td>
                          <td className="px-4 py-2 text-sm text-gray-500">-</td>
                          <td className="px-4 py-2 text-sm">1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    总计：{watchedData.claims.length + 2} 个段落，预估引用 {
                      2 + 1 + (watchedData.claims?.reduce((sum, claim) => 
                        sum + (claim.evidence?.reduce((eSum, e) => eSum + e.expectedCitations, 0) || 1), 0
                      ) || 0)
                    } 个
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 引用与规范 */}
        <Card className="bg-gray-50 border-[#EEF0F4] rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-base font-semibold">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <BookOpen className="h-5 w-5 text-gray-600" />
              引用与规范
              <Badge variant="secondary" className="text-xs">只读</Badge>
            </CardTitle>
            <CardDescription className="text-sm text-[#5B667A] leading-6">
              从选题阶段继承的设置，可微调引用数量
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">引用格式</Label>
                <div className="p-2 bg-white rounded border text-sm">
                  {watchedData.citationStyle}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">语言水平</Label>
                <div className="p-2 bg-white rounded border text-sm">
                  {watchedData.level === 'undergrad' ? '本科' : 
                   watchedData.level === 'postgrad' ? '研究生' : 
                   watchedData.level === 'esl' ? '非母语' : '专业级'}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">预期引用数量</Label>
                <Controller
                  name="expectedCitationRange"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={field.value?.[0] || 10}
                        onChange={e => field.onChange([parseInt(e.target.value), field.value?.[1] || 20])}
                        className="rounded-xl border-[#EEF0F4]"
                        min="1"
                      />
                      <span className="text-xs">-</span>
                      <Input
                        type="number"
                        value={field.value?.[1] || 20}
                        onChange={e => field.onChange([field.value?.[0] || 10, parseInt(e.target.value)])}
                        className="rounded-xl border-[#EEF0F4]"
                        min="1"
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={saveDraft}
            className="flex items-center gap-2 rounded-full px-6 py-3 border-[#EEF0F4] text-[#5B667A] hover:border-[#6E5BFF] hover:text-[#6E5BFF] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#6E5BFF]"
          >
            <Save className="h-4 w-4" />
            保存草稿
          </Button>
          
          <Button
            type="submit"
            disabled={!hasMinimumRequirements}
            className="flex items-center gap-2 rounded-full px-8 py-3 bg-[#6E5BFF] hover:bg-[#5B4FCC] hover:shadow-lg hover:-translate-y-0.5 text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#6E5BFF] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            生成大纲/下一步
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
          </form>
        </div>

        {/* Right Column - Outcome Panel */}
        <div className="w-full lg:w-[360px] lg:flex-shrink-0">
          <OutcomePanel
            step="strategy"
            lockedPrice={pay.lockedPrice}
            estimate={{
              priceRange: estimate.priceRange,
              etaMinutes: estimate.etaMinutes,
              citesRange: estimate.citesRange,
              verifyLevel: verificationLevel
            }}
            metrics={writingFlow.metrics}
            addons={writingFlow.addons}
            autopilot={autopilot.running ? {
              running: autopilot.running,
              step: autopilot.step as any,
              progress: autopilot.progress,
              message: autopilot.logs[autopilot.logs.length - 1]?.msg
            } : undefined}
            error={writingFlow.error}
            onVerifyChange={handleVerifyLevelChange}
            onToggleAddon={handleToggleAddon}
            onPreviewSample={handleShowPreview}
            onPayAndWrite={handlePayAndWrite}
            onRetry={handleRetry}
          />
        </div>
      </div>

      {/* Gate1 Modal */}
      {pay.lockedPrice && (
        <Gate1Modal
          open={showGate1Modal}
          price={pay.lockedPrice}
          benefits={[
            '一次完整生成',
            '2 次局部重写',
            '全量引用核验'
          ]}
          onPreviewOnly={handleGate1PreviewOnly}
          onUnlock={handleGate1Unlock}
        />
      )}
    </div>
  );
};

export default StrategyStep;