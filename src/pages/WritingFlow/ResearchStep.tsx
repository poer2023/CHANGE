import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import OutcomePanel from '@/components/WritingFlow/OutcomePanel';
import StepNav from '@/components/WritingFlow/StepNav';
import Gate1Modal from '@/components/Gate1Modal';
import DemoModeToggle from '@/components/DemoModeToggle';
import { useStep1, useEstimate, useAutopilot, useApp, useWritingFlow as useNewWritingFlow, usePayment, useDemoMode } from '@/state/AppContext';
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
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Search,
  Plus,
  Upload,
  Download,
  Copy,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Save,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  FileText,
  Globe,
  Database,
  BarChart3,
  Star,
  ExternalLink,
  Filter,
  SortAsc,
  Users,
  Calendar,
  Quote,
  Sparkles,
  GripVertical,
  MoreVertical,
  X,
  Eye,
  Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// 数据模型类型定义
type SourceType = 'paper' | 'book' | 'web' | 'dataset' | 'report';

interface ReferenceItem {
  id: string;
  title: string;
  authors: string[];
  year?: number;
  venue?: string;
  type: SourceType;
  doi?: string;
  isbn?: string;
  url?: string;
  abstract?: string;
  keywords?: string[];
  citedCount?: number;
  peerReviewed?: boolean;
  openAccess?: boolean;
  qualityScore?: number;
  expectedCitations?: number;
  notes?: string;
  dedupKey?: string;
  fromUpload?: boolean;
}

interface ResearchFilters {
  years?: [number, number];
  types: SourceType[];
  peerReviewed?: boolean;
  openAccess?: boolean;
  sortBy: 'relevance' | 'year' | 'citations';
}

interface ResearchState {
  query: string;
  filters: ResearchFilters;
  results: ReferenceItem[];
  library: ReferenceItem[];
  bgInfos: ReferenceItem[];
  stats: {
    total: number;
    dedupRemoved: number;
    libraryCount: number;
    avgQuality: number;
  };
}

// Zod 验证架构工厂函数
const createReferenceSchema = (t: (key: string) => string) => z.object({
  id: z.string(),
  title: z.string().min(5, t('research.validation.title_min')),
  authors: z.array(z.string()).min(1, t('research.validation.authors_min')),
  year: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  venue: z.string().optional(),
  type: z.enum(['paper', 'book', 'web', 'dataset', 'report']),
  doi: z.string().optional(),
  isbn: z.string().optional(),
  url: z.string().url().optional(),
  abstract: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  citedCount: z.number().int().min(0).optional(),
  peerReviewed: z.boolean().optional(),
  openAccess: z.boolean().optional(),
  qualityScore: z.number().min(0).max(100).optional(),
  expectedCitations: z.number().int().min(0).max(6).optional(),
  notes: z.string().optional(),
  dedupKey: z.string().optional(),
  fromUpload: z.boolean().optional()
});

const createResearchSchema = (t: (key: string) => string) => z.object({
  query: z.string(),
  filters: z.object({
    years: z.tuple([z.number(), z.number()]).optional(),
    types: z.array(z.enum(['paper', 'book', 'web', 'dataset', 'report'])),
    peerReviewed: z.boolean().optional(),
    openAccess: z.boolean().optional(),
    sortBy: z.enum(['relevance', 'year', 'citations'])
  }),
  library: z.array(createReferenceSchema(t))
});

// Mock 数据生成函数
const generateMockReferences = (query: string, filters: ResearchFilters): ReferenceItem[] => {
  // 基础文献模板
  const baseReferences = [
    {
      titleTemplate: `${query} in Modern Research: A Comprehensive Survey`,
      authors: ['Smith, J.', 'Johnson, M.', 'Brown, K.'],
      venue: 'Nature Scientific Reports',
      type: 'paper',
      doi: '10.1038/s41598-023-12345-6',
      citedCount: 145,
      peerReviewed: true,
      openAccess: true
    },
    {
      titleTemplate: `Understanding ${query}: Theory and Practice`,
      authors: ['Davis, A.', 'Wilson, R.'],
      venue: 'Academic Press',
      type: 'book',
      isbn: '978-0123456789',
      citedCount: 89,
      peerReviewed: false,
      openAccess: false
    },
    {
      titleTemplate: `${query} Dataset Collection 2023`,
      authors: ['Research Consortium'],
      venue: 'Data Repository',
      type: 'dataset',
      url: 'https://data.repository.org/dataset-2023',
      citedCount: 234,
      peerReviewed: false,
      openAccess: true
    },
    {
      titleTemplate: `Advanced ${query} Techniques and Applications`,
      authors: ['Chen, L.', 'Wang, X.', 'Liu, Y.'],
      venue: 'IEEE Transactions on Knowledge and Data Engineering',
      type: 'paper',
      doi: '10.1109/TKDE.2023.3234567',
      citedCount: 178,
      peerReviewed: true,
      openAccess: true
    },
    {
      titleTemplate: `${query} in Practice: Case Studies and Lessons Learned`,
      authors: ['Anderson, P.', 'Taylor, S.'],
      venue: 'Springer-Verlag',
      type: 'book',
      isbn: '978-3540123456',
      citedCount: 67,
      peerReviewed: false,
      openAccess: false
    },
    {
      titleTemplate: `A Survey of ${query} Methods and Their Effectiveness`,
      authors: ['Martinez, R.', 'Garcia, M.', 'Lopez, J.', 'Rodriguez, A.'],
      venue: 'Journal of Computer Science Research',
      type: 'paper',
      doi: '10.1016/j.jcsr.2023.108901',
      citedCount: 201,
      peerReviewed: true,
      openAccess: false
    },
    {
      titleTemplate: `${query} Technical Report 2023`,
      authors: ['International Standards Organization'],
      venue: 'ISO Technical Reports',
      type: 'report',
      url: 'https://iso.org/reports/2023/tr-${query.toLowerCase().replace(/\s+/g, "-")}',
      citedCount: 45,
      peerReviewed: false,
      openAccess: true
    },
    {
      titleTemplate: `Computational Methods for ${query}: An Implementation Guide`,
      authors: ['Thompson, K.', 'White, D.', 'Clark, N.'],
      venue: 'ACM Computing Surveys',
      type: 'paper',
      doi: '10.1145/3234567.3234568',
      citedCount: 156,
      peerReviewed: true,
      openAccess: true
    },
    {
      titleTemplate: `${query} Web Resource Collection`,
      authors: ['Digital Library Consortium'],
      venue: 'Web Archive',
      type: 'web',
      url: `https://archive.org/${query.toLowerCase().replace(/\s+/g, "-")}-collection`,
      citedCount: 23,
      peerReviewed: false,
      openAccess: true
    },
    {
      titleTemplate: `Foundations of ${query}: Mathematical Models and Analysis`,
      authors: ['Kumar, S.', 'Patel, V.', 'Shah, R.'],
      venue: 'Mathematical Foundations of Computing',
      type: 'paper',
      doi: '10.1007/s10994-023-06234-x',
      citedCount: 132,
      peerReviewed: true,
      openAccess: false
    }
  ];

  // 生成10条文献
  const mockData: ReferenceItem[] = baseReferences.map((ref, index) => {
    const year = 2024 - Math.floor(index / 2); // 从2024递减到2019
    const qualityScore = calculateQualityScore({
      type: ref.type as SourceType,
      citedCount: ref.citedCount,
      year,
      peerReviewed: ref.peerReviewed,
      openAccess: ref.openAccess,
      hasIdentifier: !!(ref.doi || ref.isbn || ref.url)
    });

    return {
      id: (index + 1).toString(),
      title: ref.titleTemplate,
      authors: ref.authors,
      year,
      venue: ref.venue,
      type: ref.type as SourceType,
      doi: ref.doi,
      isbn: ref.isbn,
      url: ref.url,
      abstract: `This research focuses on ${query} and presents comprehensive analysis of current methodologies, challenges, and future directions in the field...`,
      keywords: [query.toLowerCase(), 'research', 'analysis', 'methodology'],
      citedCount: ref.citedCount,
      peerReviewed: ref.peerReviewed,
      openAccess: ref.openAccess,
      qualityScore
    };
  });

  // 应用筛选
  return mockData.filter(item => {
    if (filters.types.length > 0 && !filters.types.includes(item.type)) return false;
    if (filters.peerReviewed !== undefined && item.peerReviewed !== filters.peerReviewed) return false;
    if (filters.openAccess !== undefined && item.openAccess !== filters.openAccess) return false;
    if (filters.years && item.year) {
      if (item.year < filters.years[0] || item.year > filters.years[1]) return false;
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'year':
        return (b.year || 0) - (a.year || 0);
      case 'citations':
        return (b.citedCount || 0) - (a.citedCount || 0);
      default:
        return (b.qualityScore || 0) - (a.qualityScore || 0);
    }
  });
};

// 去重函数
const generateDedupKey = (item: ReferenceItem): string => {
  if (item.doi) return `doi:${item.doi}`;
  if (item.isbn) return `isbn:${item.isbn}`;
  
  const normalizedTitle = item.title.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  const authorKey = item.authors[0]?.split(',')[0]?.toLowerCase() || '';
  const yearKey = item.year || '';
  
  return `title:${normalizedTitle}-${authorKey}-${yearKey}`;
};

const deduplicate = (items: ReferenceItem[]): ReferenceItem[] => {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = generateDedupKey(item);
    item.dedupKey = key;
    
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// 引用格式化函数
const formatCitation = (item: ReferenceItem, style: string): string => {
  const authors = item.authors.join(', ');
  const year = item.year || 'n.d.';
  const title = item.title;
  const venue = item.venue || '';

  switch (style) {
    case 'APA':
      return `${authors} (${year}). ${title}. ${venue}.`;
    case 'MLA':
      return `${authors}. "${title}." ${venue}, ${year}.`;
    case 'Chicago':
      return `${authors}. "${title}." ${venue} (${year}).`;
    case 'IEEE':
      return `${authors}, "${title}," ${venue}, ${year}.`;
    case 'GBT':
      return `${authors}. ${title}[J]. ${venue}, ${year}.`;
    default:
      return `${authors} (${year}). ${title}. ${venue}.`;
  }
};

// 质量评分计算
const calculateQualityScore = (item: ReferenceItem): number => {
  let score = 0;
  
  // 来源权威度
  if (item.type === 'paper' && item.peerReviewed) score += 30;
  else if (item.type === 'book') score += 25;
  else if (item.type === 'report') score += 20;
  else if (item.type === 'dataset') score += 15;
  else score += 10;
  
  // 被引数
  const citedCount = item.citedCount || 0;
  if (citedCount >= 100) score += 25;
  else if (citedCount >= 50) score += 20;
  else if (citedCount >= 20) score += 15;
  else if (citedCount >= 5) score += 10;
  else score += 5;
  
  // 年份衰减
  const currentYear = new Date().getFullYear();
  const age = item.year ? currentYear - item.year : 10;
  if (age <= 2) score += 25;
  else if (age <= 5) score += 20;
  else if (age <= 10) score += 15;
  else score += 5;
  
  // 开放获取
  if (item.openAccess) score += 10;
  
  // DOI/ISBN
  if (item.doi || item.isbn) score += 10;
  
  return Math.min(score, 100);
};

const ResearchStep: React.FC = () => {
  const { t } = useTranslation();
  const { project, updateStrategy, setCurrentStep, completeStep } = useWritingFlow();
  const { track: trackEvent } = useApp();
  const { step1 } = useStep1();
  const { estimate, setEstimate } = useEstimate();
  const { autopilot, startAutopilot, minimizeAutopilot, pauseAutopilot, resumeAutopilot, stopAutopilot } = useAutopilot();
  const { writingFlow, updateMetrics, toggleAddon, setError } = useNewWritingFlow();
  const { pay, lockPrice: lockPriceState } = usePayment();
  const { demoMode } = useDemoMode();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'academic' | 'background'>('academic');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ReferenceItem>>({});
  const [showGate1Modal, setShowGate1Modal] = useState(false);
  const [verificationLevel, setVerificationLevel] = useState<'Basic' | 'Standard' | 'Pro'>('Standard');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const researchSchema = createResearchSchema(t);
  
  const form = useForm<ResearchState>({
    resolver: zodResolver(researchSchema),
    defaultValues: {
      query: '',
      filters: {
        types: ['paper', 'book'],
        sortBy: 'relevance',
        years: [2020, new Date().getFullYear()]
      },
      library: []
    }
  });

  const { control, handleSubmit, watch, setValue, getValues } = form;
  const watchedData = watch();

  // 计算统计信息
  const stats = useMemo(() => {
    const library = watchedData.library || [];
    const total = library.length;
    const avgQuality = total > 0 
      ? library.reduce((sum, item) => sum + (item.qualityScore || calculateQualityScore(item)), 0) / total 
      : 0;
    
    const verifiableRatio = total > 0 
      ? library.filter(item => item.peerReviewed || item.doi).length / total * 100 
      : 0;
    
    const recent5yRatio = total > 0 
      ? library.filter(item => item.year && item.year >= new Date().getFullYear() - 5).length / total * 100 
      : 0;
    
    return {
      total,
      dedupRemoved: 0,
      libraryCount: total,
      avgQuality: Math.round(avgQuality),
      verifiableRatio: Math.round(verifiableRatio),
      recent5yRatio: Math.round(recent5yRatio)
    };
  }, [watchedData.library]);

  // 门槛检查 - 简化为只需要3条文献即可
  const qualityThreshold = useMemo(() => {
    const library = watchedData.library || [];
    const totalCount = library.length;
    
    const noDuplicates = new Set(library.map(generateDedupKey)).size === library.length;
    
    return {
      hasMinimumSources: totalCount >= 3,
      hasIdentifiers: true, // 简化条件，不再要求所有文献都有标识符
      noDuplicates,
      canProceed: totalCount >= 3 && noDuplicates
    };
  }, [watchedData.library]);

  // Update metrics when research data changes
  useEffect(() => {
    if (watchedData.library && watchedData.results) {
      updateMetrics({
        sourcesHit: watchedData.results.length,
        verifiableRatio: watchedData.library.filter(item => item.peerReviewed || item.doi).length / Math.max(watchedData.library.length, 1) * 100,
        recent5yRatio: watchedData.library.filter(item => item.year && item.year >= new Date().getFullYear() - 5).length / Math.max(watchedData.library.length, 1) * 100
      });
    }
  }, [watchedData, updateMetrics]);

  // 自动保存
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('writing-flow:research', JSON.stringify(watchedData));
    }, 2000);

    return () => clearTimeout(timeout);
  }, [watchedData]);

  // 从localStorage恢复
  useEffect(() => {
    const saved = localStorage.getItem('writing-flow:research');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
          setValue(key as keyof ResearchState, data[key]);
        });
      } catch (error) {
        console.error(t('research.error.recovery_failed') + ':', error);
      }
    }
  }, [setValue]);

  // OutcomePanel handlers
  const handleShowPreview = () => {
    trackEvent('preview_sample_click', { context: 'research_step', sampleType: 'academic_writing' });
    toast({
      title: t('topic.toast.feature_developing'),
      description: t('topic.toast.feature_developing_desc')
    });
  };

  const handlePayAndWrite = async () => {
    try {
      track('outcome_pay_and_write_click', { step: 'research' });
      
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
      setError(error instanceof Error ? error.message : t('topic.toast.lock_price_failed'));
      
      toast({
        title: t('common.error'),
        description: t('topic.toast.lock_price_failed'),
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
          title: t('topic.toast.payment_success'),
          description: t('topic.toast.payment_success_desc')
        });
      } else {
        throw new Error('Payment failed');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : t('topic.toast.payment_failed'));
      
      track('gate1_payment_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast({
        title: t('topic.toast.payment_failed'),
        description: t('topic.toast.payment_failed_desc'),
        variant: 'destructive'
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleGate1PreviewOnly = () => {
    setShowGate1Modal(false);
    toast({
      title: t('topic.toast.preview_mode'),
      description: t('topic.toast.preview_mode_desc')
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
        fromStep: 'strategy' as any,
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
            title: t('topic.toast.autopilot_failed'),
            description: error,
            variant: 'destructive'
          });
        }
      );
      
      track('autopilot_started_from_research', {
        taskId: response.taskId,
        config
      });
      
    } catch (error) {
      console.error('Failed to start autopilot:', error);
      setError(error instanceof Error ? error.message : t('research.error.autopilot_start_failed'));
    }
  };

  const handleVerifyLevelChange = (level: 'Basic' | 'Standard' | 'Pro') => {
    setVerificationLevel(level);
    track('outcome_verify_change', { level, step: 'research' });
    
    // Show confirmation feedback
    toast({
      title: `${t('research.toast.verification_updated')} ${level}`,
      description: `${t('research.toast.verification_rate')}${level === 'Pro' ? '100%' : level === 'Standard' ? '95%' : '85%'}`,
      duration: 2000
    });
    
    // Update estimate with new verification level
    setEstimate({
      ...estimate,
      verifyLevel: level,
      updatedAt: Date.now()
    });
  };

  const handleToggleAddon = (key: string, enabled: boolean) => {
    toggleAddon(key, enabled);
    track('outcome_addon_toggle', { key, enabled, step: 'research' });
  };

  const handleRetry = () => {
    setError(undefined);
    toast({
      title: t('topic.toast.retry_title'),
      description: t('topic.toast.retry_desc')
    });
  };

  // 搜索处理
  const handleSearch = useCallback(async () => {
    const { query, filters } = getValues();
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const results = generateMockReferences(query, filters);
      const dedupResults = deduplicate(results);
      
      setValue('results', dedupResults.map(item => ({
        ...item,
        qualityScore: calculateQualityScore(item)
      })));
      
      toast({
        title: t('research.toast.search_complete'),
        description: t('research.toast.found_references', { count: dedupResults.length })
      });
    } catch (error) {
      toast({
        title: t('research.toast.search_failed'),
        description: t('research.toast.search_failed'),
        variant: 'destructive'
      });
    } finally {
      setIsSearching(false);
    }
  }, [getValues, setValue, toast]);

  // 添加到文献库
  const addToLibrary = useCallback((item: ReferenceItem) => {
    const currentLibrary = getValues('library');
    const exists = currentLibrary.some(existing => existing.id === item.id);
    
    if (exists) {
      toast({
        title: t('research.toast.already_exists'),
        description: t('research.toast.reference_exists'),
        variant: 'destructive'
      });
      return;
    }
    
    setValue('library', [...currentLibrary, {
      ...item,
      qualityScore: calculateQualityScore(item)
    }]);
    
    toast({
      title: t('research.toast.added_to_library'),
      description: t('research.toast.reference_added')
    });
  }, [getValues, setValue, toast]);

  // 从文献库移除
  const removeFromLibrary = useCallback((itemId: string) => {
    const currentLibrary = getValues('library');
    setValue('library', currentLibrary.filter(item => item.id !== itemId));
    
    toast({
      title: t('research.toast.removed_from_library'),
      description: t('research.toast.reference_removed')
    });
  }, [getValues, setValue, toast]);

  // 复制引用
  const copyCitation = useCallback((item: ReferenceItem, style: string) => {
    const citation = formatCitation(item, style);
    navigator.clipboard.writeText(citation).then(() => {
      toast({
        title: t('research.toast.citation_copied'),
        description: t('research.toast.citation_copied_format', { format: style })
      });
    });
  }, [toast]);

  // 拖拽排序
  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    
    const currentLibrary = getValues('library');
    const newLibrary = Array.from(currentLibrary);
    const [reorderedItem] = newLibrary.splice(result.source.index, 1);
    newLibrary.splice(result.destination.index, 0, reorderedItem);
    
    setValue('library', newLibrary);
  }, [getValues, setValue]);

  // 提交处理
  const onSubmit = async (data: ResearchState) => {
    try {
      sessionStorage.setItem('writing-flow:library', JSON.stringify(data.library));
      
      completeStep('research');
      setCurrentStep('strategy');
      navigate('/writing-flow/strategy');
      
      toast({
        title: t('research.toast.completed'),
        description: t('research.toast.entering_strategy')
      });
    } catch (error) {
      toast({
        title: t('research.toast.search_failed'),
        description: t('research.toast.search_failed'),
        variant: 'destructive'
      });
    }
  };

  const saveDraft = () => {
    const currentData = getValues();
    localStorage.setItem('writing-flow:research', JSON.stringify(currentData));
    toast({
      title: t('research.toast.draft_saved'),
      description: t('research.toast.progress_saved')
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FB] pt-6">
      <div className="container max-w-[1660px] mx-auto px-6 md:px-8">
        {/* Grid Layout */}
        <div className="max-w-[1660px] mx-auto px-6 md:px-8">
          <div className="grid gap-6 grid-cols-1 xl:grid-cols-[280px_minmax(900px,1fr)_360px] xl:gap-8">
          {/* Left Column - Step Navigation */}
          <aside className="hidden xl:block">
            <div className="sticky top-6 -ml-6 md:-ml-8">
              <StepNav />
            </div>
          </aside>

          {/* Main Column - Form Content */}
          <main className="max-w-none mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 门槛告警 */}
        {!qualityThreshold.canProceed && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-medium text-yellow-800">{t('research.warning.title')}</h3>
                  <div className="space-y-1 text-sm text-yellow-700">
                    {!qualityThreshold.hasMinimumSources && (
                      <p>• {t('research.warning.min_sources')}</p>
                    )}
                    {!qualityThreshold.noDuplicates && (
                      <p>• {t('research.warning.no_duplicates')}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 进度和标签 */}
        <Card className="bg-white border-[#E7EAF3] rounded-2xl" style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}>
          <CardContent className="px-4 md:px-6 xl:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={activeTab === 'academic' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('academic')}
                  className="rounded-full"
                >
                  {t('research.tabs.academic')}
                  <Badge variant="secondary" className="ml-2">
                    {watchedData.library?.filter(item => ['paper', 'book'].includes(item.type)).length || 0}
                  </Badge>
                </Button>
                <Button
                  type="button"
                  variant={activeTab === 'background' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('background')}
                  className="rounded-full"
                  disabled
                >
                  {t('research.tabs.background')}
                  <Badge variant="secondary" className="ml-2">
                    {watchedData.bgInfos?.length || 0}
                  </Badge>
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sm text-[#5B667A]">{t('research.quality_score')}: {stats.avgQuality}%</div>
                <Progress value={stats.avgQuality} className="w-24 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 搜索卡片 */}
        <Card className="bg-white border-[#E7EAF3] rounded-2xl" style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-base font-semibold">
              <div className="w-2 h-2 rounded-full bg-[#6E5BFF]"></div>
              <Search className="h-5 w-5 text-[#6E5BFF]" />
              {t('research.search.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6 xl:px-8 py-6 pt-0">
            {/* 搜索框 */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Controller
                    name="query"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder={t('research.search.placeholder')}
                        className="rounded-xl border-[#E7EAF3]"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearch();
                          }
                        }}
                      />
                    )}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="rounded-full bg-[#6E5BFF] hover:bg-[#5B4FCC] text-white"
                >
                  {isSearching ? t('research.search.searching') : t('research.search.button')}
                </Button>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(true)}
                  className="rounded-full"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('research.search.add_manual')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  size="sm"
                  disabled
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('research.search.import_bibtex')}
                </Button>
              </div>

              {/* 筛选条 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                {/* 年份范围 */}
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">{t('research.filters.year_range')}</Label>
                  <Controller
                    name="filters.years"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-1">
                        <Slider
                          value={field.value || [2020, new Date().getFullYear()]}
                          onValueChange={field.onChange}
                          min={2000}
                          max={new Date().getFullYear()}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{field.value?.[0] || 2020}</span>
                          <span>{field.value?.[1] || new Date().getFullYear()}</span>
                        </div>
                      </div>
                    )}
                  />
                </div>

                {/* 来源类型 */}
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">{t('research.filters.source_types')}</Label>
                  <Controller
                    name="filters.types"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-1">
                        {[
                          { value: 'paper', label: t('research.type.paper') },
                          { value: 'book', label: t('research.type.book') },
                          { value: 'web', label: t('research.type.web') },
                          { value: 'dataset', label: t('research.type.dataset') },
                          { value: 'report', label: t('research.type.report') }
                        ].map((type) => (
                          <Button
                            key={type.value}
                            type="button"
                            variant={field.value.includes(type.value as SourceType) ? 'default' : 'outline'}
                            size="sm"
                            className="text-xs h-6"
                            onClick={() => {
                              const currentTypes = field.value;
                              if (currentTypes.includes(type.value as SourceType)) {
                                field.onChange(currentTypes.filter(t => t !== type.value));
                              } else {
                                field.onChange([...currentTypes, type.value]);
                              }
                            }}
                          >
                            {type.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                {/* 排序 */}
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">{t('research.filters.sort_by')}</Label>
                  <Controller
                    name="filters.sortBy"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">{t('research.filters.relevance')}</SelectItem>
                          <SelectItem value="year">{t('research.filters.year')}</SelectItem>
                          <SelectItem value="citations">{t('research.filters.citations')}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 搜索结果 */}
        {watchedData.results && watchedData.results.length > 0 && (
          <Card className="bg-white border-[#E7EAF3] rounded-2xl" style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-base font-semibold">
                <div className="w-2 h-2 rounded-full bg-[#6E5BFF]"></div>
                <FileText className="h-5 w-5 text-[#6E5BFF]" />
                {t('research.results.title')}
                <Badge variant="secondary">{watchedData.results.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 md:px-6 xl:px-8 py-6 pt-0">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {watchedData.results.map((item) => {
                  const isInLibrary = watchedData.library?.some(lib => lib.id === item.id) || false;
                  
                  return (
                    <div key={item.id} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-2">
                          {/* 标题 */}
                          <h3 className="font-medium text-gray-900 leading-tight">
                            {item.title}
                          </h3>
                          
                          {/* 作者·年份·来源 */}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{item.authors.join(', ')}</span>
                            {item.year && (
                              <>
                                <span>·</span>
                                <span>{item.year}</span>
                              </>
                            )}
                            {item.venue && (
                              <>
                                <span>·</span>
                                <span>{item.venue}</span>
                              </>
                            )}
                          </div>
                          
                          {/* 徽章 */}
                          <div className="flex items-center gap-2">
                            {item.citedCount && (
                              <Badge variant="outline" className="text-xs">
                                <BarChart3 className="h-3 w-3 mr-1" />
                                {item.citedCount}{t('research.results.citations_count')}
                              </Badge>
                            )}
                            {item.peerReviewed && (
                              <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {t('research.results.peer_reviewed')}
                              </Badge>
                            )}
                            {item.openAccess && (
                              <Badge variant="default" className="text-xs bg-blue-100 text-blue-700">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                {t('research.results.open_access')}
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {t('research.results.quality')}: {item.qualityScore}%
                            </Badge>
                          </div>
                          
                          {/* 摘要片段 */}
                          {item.abstract && (
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {item.abstract.slice(0, 150)}...
                            </p>
                          )}
                          
                          {/* 关键词 */}
                          {item.keywords && item.keywords.length > 0 && (
                            <div className="flex items-center gap-1">
                              {item.keywords.slice(0, 3).map((keyword, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* 操作区 */}
                        <div className="flex flex-col gap-2">
                          {isInLibrary ? (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {t('research.results.added')}
                            </Badge>
                          ) : (
                            <Button
                              type="button"
                              onClick={() => addToLibrary(item)}
                              className="rounded-full bg-[#6E5BFF] hover:bg-[#5B4FCC] text-white text-xs px-3 py-1 h-auto"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {t('research.results.add_to_library')}
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-auto p-1">
                                <Quote className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => copyCitation(item, 'APA')}>
                                {t('research.results.copy_apa')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyCitation(item, 'MLA')}>
                                {t('research.results.copy_mla')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyCitation(item, 'Chicago')}>
                                {t('research.results.copy_chicago')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyCitation(item, 'IEEE')}>
                                {t('research.results.copy_ieee')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyCitation(item, 'GBT')}>
                                {t('research.results.copy_gbt')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-auto p-1">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Eye className="h-3 w-3 mr-2" />
                                {t('research.results.view_details')}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Bookmark className="h-3 w-3 mr-2" />
                                {t('research.results.bookmark')}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="h-3 w-3 mr-2" />
                                {t('research.results.view_original')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 文献库 */}
        <Card className="bg-white border-[#E7EAF3] rounded-2xl" style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-base font-semibold">
                <div className="w-2 h-2 rounded-full bg-[#6E5BFF]"></div>
                <Database className="h-5 w-5 text-[#6E5BFF]" />
                {t('research.library.title')}
              </CardTitle>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#5B667A]">
                  {t('research.library.selected_count', { count: stats.libraryCount })}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled
                  className="rounded-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('research.library.export')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 md:px-6 xl:px-8 py-6 pt-0">
            {watchedData.library && watchedData.library.length > 0 ? (
              <div className="space-y-4">
                {/* 统计信息 */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-[#6E5BFF]">{stats.libraryCount}</div>
                    <div className="text-xs text-gray-600">{t('research.library.stats.total')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-[#6E5BFF]">{stats.avgQuality}%</div>
                    <div className="text-xs text-gray-600">{t('research.library.stats.average_quality')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-[#6E5BFF]">
                      {watchedData.library.reduce((sum, item) => sum + (item.expectedCitations || 1), 0)}
                    </div>
                    <div className="text-xs text-gray-600">{t('research.library.stats.expected_citations')}</div>
                  </div>
                </div>

                {/* 文献列表 */}
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="library">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {watchedData.library.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
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
                                    className="mt-1 p-1 hover:bg-gray-100 rounded cursor-move"
                                  >
                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                  </div>
                                  
                                  <div className="flex-1 space-y-2">
                                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                                    <div className="text-sm text-gray-600">
                                      {item.authors.join(', ')} · {item.year} · {item.venue}
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        {item.type === 'paper' ? t('research.type.paper') : 
                                         item.type === 'book' ? t('research.type.book') :
                                         item.type === 'web' ? t('research.type.web') :
                                         item.type === 'dataset' ? t('research.type.dataset') : t('research.type.report')}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {t('research.results.quality')}: {item.qualityScore}%
                                      </Badge>
                                      {(item.doi || item.isbn || item.url) && (
                                        <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                          {t('research.library.item.has_identifier')}
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    {item.notes && (
                                      <p className="text-sm text-gray-600 italic">{item.notes}</p>
                                    )}
                                  </div>
                                  
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => removeFromLibrary(item.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
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
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('research.library.empty_title')}</p>
                <p className="text-sm">{t('research.library.empty_description')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setCurrentStep('topic');
              navigate('/writing-flow/topic');
            }}
            className="flex items-center gap-2 rounded-full px-6 py-3 border-[#E7EAF3] text-[#5B667A] hover:border-[#6E5BFF] hover:text-[#6E5BFF] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('research.buttons.back_to_topic')}
          </Button>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={saveDraft}
              className="flex items-center gap-2 rounded-full px-6 py-3 border-[#E7EAF3] text-[#5B667A] hover:border-[#6E5BFF] hover:text-[#6E5BFF] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <Save className="h-4 w-4" />
              {t('research.buttons.save_draft')}
            </Button>
            
            <Button
              type="submit"
              disabled={!demoMode && !qualityThreshold.canProceed}
              className="flex items-center gap-2 rounded-full px-8 py-3 bg-[#6E5BFF] hover:bg-[#5B4FCC] hover:shadow-lg hover:-translate-y-0.5 text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#6E5BFF] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {t('research.buttons.continue_to_strategy')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
          </form>
          </main>

          {/* Right Column - Ghost Outcome Panel */}
          <aside className="hidden xl:block">
            <div className="sticky top-6 -mr-6 md:-mr-8">
              <OutcomePanel
              step="research"
              lockedPrice={pay.lockedPrice}
              estimate={{
                priceRange: estimate.priceRange,
                etaMinutes: estimate.etaMinutes,
                citesRange: estimate.citesRange,
                verifyLevel: verificationLevel
              }}
              metrics={{
                sourcesHit: stats.libraryCount,
                verifiableRatio: stats.verifiableRatio,
                recent5yRatio: stats.recent5yRatio
              }}
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
          </aside>
          </div>
        </div>
      </div>

      {/* Gate1 Modal */}
      {pay.lockedPrice && (
        <Gate1Modal
          open={showGate1Modal}
          price={pay.lockedPrice}
          benefits={[
            t('topic.gate1.benefit1'),
            t('topic.gate1.benefit2'),
            t('topic.gate1.benefit3')
          ]}
          onPreviewOnly={handleGate1PreviewOnly}
          onUnlock={handleGate1Unlock}
        />
      )}
      
      {/* Demo Mode Toggle */}
      <DemoModeToggle />
    </div>
  );
};

export default ResearchStep;