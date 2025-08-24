import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import OutcomePanel from '@/components/WritingFlow/OutcomePanel';
import StepNav from '@/components/WritingFlow/StepNav';
import AutopilotBanner from '@/components/AutopilotBanner';
import Gate1Modal from '@/components/Gate1Modal';
import DemoModeToggle from '@/components/DemoModeToggle';
import { useStep1, useEstimate, useAutopilot, useApp, useWritingFlow, usePayment, useDemoMode } from '@/state/AppContext';
import { lockPrice, createPaymentIntent, confirmPayment, startAutopilot as apiStartAutopilot, streamAutopilotProgress, track } from '@/services/pricing';
import { debouncedEstimate, validateStep1ForEstimate } from '@/services/estimate';
import { 
  BookOpen, 
  FileText, 
  Target, 
  Upload, 
  X, 
  AlertTriangle,
  Save,
  ArrowRight,
  HelpCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VerifyLevel, Level, Format } from '@/state/types';
import { useTranslation } from '@/hooks/useTranslation';

// Create schema factory with translations
const createTopicSchema = (t: (key: string) => string) => z.object({
  title: z.string().min(2, t('topic.form.title.validation.min')).max(120, t('topic.form.title.validation.max')),
  assignmentType: z.enum(['paper', 'report', 'review', 'commentary'], {
    required_error: t('topic.form.type.required')
  }),
  wordCount: z.number().int().min(300, t('topic.form.words.validation.min')).max(20000, t('topic.form.words.validation.max')),
  format: z.enum(['APA', 'MLA', 'Chicago', 'IEEE', 'GBT'], {
    required_error: t('topic.form.format.required')
  }),
  level: z.enum(['UG', 'PG', 'ESL', 'Pro'], {
    required_error: t('topic.form.level.required')
  }),
  resources: z.array(z.enum(['paper', 'book', 'web', 'dataset', 'other'])).min(1, t('topic.form.resources.required')),
  styleSamples: z.array(z.object({
    id: z.string(),
    name: z.string(),
    size: z.number()
  })).max(5, t('topic.form.files.max')),
  notes: z.string().max(2000, t('topic.form.requirements.max')).optional()
});

type TopicFormData = z.infer<ReturnType<typeof createTopicSchema>>;



// Card Section Component
const CardSection: React.FC<{ 
  title: string; 
  description: string; 
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}> = ({ title, description, icon: Icon, children }) => (
  <Card className="bg-white border-[#E7EAF3] rounded-[20px] shadow-[0_6px_18px_rgba(17,24,39,0.06)] hover:shadow-[0_10px_24px_rgba(17,24,39,0.10)] transition-shadow duration-200">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-3 text-base font-semibold">
        <div className="w-2 h-2 rounded-full bg-[#6A5AF9]"></div>
        <Icon className="h-5 w-5 text-[#6A5AF9]" />
        {title}
      </CardTitle>
      <CardDescription className="text-sm text-slate-600 leading-6">
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent className="px-4 md:px-6 xl:px-8 py-6 pt-0">
      {children}
    </CardContent>
  </Card>
);

// File Upload Component
const StyleUpload: React.FC<{
  files: Array<{ id: string; name: string; size: number }>;
  onFilesChange: (files: Array<{ id: string; name: string; size: number }>) => void;
}> = ({ files, onFilesChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: t('topic.form.files.error.format'),
        description: t('topic.form.files.supported'),
        variant: 'destructive'
      });
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: t('topic.form.files.error.size'),
        description: t('topic.form.files.supported'),
        variant: 'destructive'
      });
      return false;
    }
    
    if (files.length >= 5) {
      toast({
        title: t('topic.form.files.error.count'),
        description: t('topic.form.files.max'),
        variant: 'destructive'
      });
      return false;
    }
    
    return true;
  };

  const handleFileSelect = (selectedFiles: FileList) => {
    const newFiles: Array<{ id: string; name: string; size: number }> = [];
    
    Array.from(selectedFiles).forEach(file => {
      if (validateFile(file)) {
        newFiles.push({
          id: `${Date.now()}_${Math.random()}`,
          name: file.name,
          size: file.size
        });
      }
    });
    
    if (newFiles.length > 0) {
      onFilesChange([...files, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeFile = (fileId: string) => {
    onFilesChange(files.filter(f => f.id !== fileId));
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200',
          isDragging ? 'border-[#6A5AF9] bg-[#6A5AF9]/5 transform scale-[1.01]' : 'border-[#E7EAF3] hover:border-[#6A5AF9]/50 hover:bg-gray-50'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-8 w-8 text-slate-600 mb-3" />
        <p className="text-sm text-gray-900 mb-2 font-medium">
          {t('topic.form.files.drag_drop')}
        </p>
        <Input
          type="file"
          multiple
          accept=".txt,.doc,.docx,.pdf"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <Label htmlFor="file-upload" className="cursor-pointer">
          <Button 
            type="button" 
            variant="outline" 
            className="rounded-full border-[#6A5AF9] text-[#6A5AF9] hover:bg-[#6A5AF9] hover:text-white transition-all duration-200 pointer-events-none"
          >
            {t('topic.form.files.choose')}
          </Button>
        </Label>
        <p className="text-xs text-slate-600 mt-3">
          {t('topic.form.files.supported')}
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-[#E7EAF3]">
              <FileText className="h-4 w-4 text-[#6A5AF9] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-slate-600">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file.id)}
                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 rounded-full flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// Main Topic Step Component
const TopicStep: React.FC = () => {
  const { track, trackTyped } = useApp();
  const { step1, updateStep1 } = useStep1();
  const { estimate, setEstimate } = useEstimate();
  const { autopilot, startAutopilot, minimizeAutopilot, pauseAutopilot, resumeAutopilot, stopAutopilot } = useAutopilot();
  const { writingFlow, updateMetrics, toggleAddon, setError } = useWritingFlow();
  const { pay, lockPrice: lockPriceState } = usePayment();
  const { demoMode } = useDemoMode();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Track page load time for analytics
  const [pageLoadTime] = useState(() => Date.now());
  const [showGate1Modal, setShowGate1Modal] = useState(false);
  const [verificationLevel, setVerificationLevel] = useState<VerifyLevel>('Standard');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Track page entry
  useEffect(() => {
    trackTyped('step_enter', {
      step: 'topic',
      previousStep: undefined, // Could be tracked from navigation state
      timeSpent: undefined
    }, 'writing_flow', 'step_navigation');
    
    trackTyped('page_view', {
      page: 'TopicStep',
      path: '/writing-flow/topic',
      referrer: document.referrer,
      fromAutopilot: false
    }, 'page_view');
  }, [trackTyped]);

  const topicSchema = createTopicSchema(t);
  
  const form = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: step1.title,
      assignmentType: step1.assignmentType,
      wordCount: step1.wordCount,
      format: step1.format,
      level: step1.level,
      resources: step1.resources,
      styleSamples: step1.styleSamples,
      notes: step1.notes
    }
  });

  const { handleSubmit, watch, setValue, formState: { errors, isValid } } = form;
  
  const formValues = watch();
  const watchedNotes = watch('notes') || '';
  const watchedResources = watch('resources') || [];
  const watchedWordCount = watch('wordCount') || 0;
  const watchedLevel = watch('level') || 'UG';

  // Track form validation errors
  useEffect(() => {
    Object.keys(errors).forEach(field => {
      const error = errors[field as keyof typeof errors];
      if (error?.message) {
        trackTyped('form_validation_error', {
          step: 'topic',
          field,
          error: error.message,
          value: form.getValues(field as keyof TopicFormData)
        }, 'error', 'form_validation');
      }
    });
  }, [errors, trackTyped, form]);
  const watchedFormat = watch('format') || 'APA';
  const watchedAssignmentType = watch('assignmentType') || 'paper';
  const watchedTitle = watch('title') || '';
  const watchedStyleSamples = watch('styleSamples') || [];

  // Auto-save to state
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const subscription = watch((value) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateStep1({
          title: value.title || '',
          assignmentType: value.assignmentType || 'paper',
          wordCount: value.wordCount || 2000,
          format: value.format || 'APA',
          level: value.level || 'UG',
          resources: value.resources || ['paper'],
          styleSamples: value.styleSamples || [],
          notes: value.notes || ''
        });
      }, 300);
    });
    
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [watch, updateStep1]);

  // Load from state on mount
  useEffect(() => {
    setValue('title', step1.title);
    setValue('assignmentType', step1.assignmentType);
    setValue('wordCount', step1.wordCount);
    setValue('format', step1.format);
    setValue('level', step1.level);
    setValue('resources', step1.resources);
    setValue('styleSamples', step1.styleSamples);
    setValue('notes', step1.notes);
  }, [setValue, step1]);

  const onSubmit = async (data: TopicFormData) => {
    try {
      updateStep1({
        title: data.title,
        assignmentType: data.assignmentType,
        wordCount: data.wordCount,
        format: data.format,
        level: data.level,
        resources: data.resources,
        styleSamples: data.styleSamples,
        notes: data.notes || ''
      });
      
      // Track step completion with comprehensive data
      trackTyped('step_complete', {
        step: 'topic',
        data,
        timeSpent: Date.now() - pageLoadTime, // Approximate time spent
        isAutosave: false
      }, 'writing_flow', 'step_completion');
      
      // Track navigation
      trackTyped('navigation', {
        from: '/writing-flow/topic',
        to: '/writing-flow/research',
        method: 'click',
        timeOnPage: Date.now() - pageLoadTime
      }, 'page_view', 'navigation');
      
      // Navigate to research step
      navigate('/writing-flow/research');
      
      toast({
        title: t('topic.validation.success'),
        description: t('topic.toast.success_desc')
      });
    } catch (error) {
      toast({
        title: t('topic.toast.save_failed'),
        description: t('topic.toast.save_failed_desc'),
        variant: 'destructive'
      });
    }
  };

  const saveDraft = () => {
    const currentData = watch();
    updateStep1({
      title: currentData.title || '',
      assignmentType: currentData.assignmentType || 'paper',
      wordCount: currentData.wordCount || 2000,
      format: currentData.format || 'APA',
      level: currentData.level || 'UG',
      resources: currentData.resources || ['paper'],
      styleSamples: currentData.styleSamples || [],
      notes: currentData.notes || ''
    });
    // Track draft save with enhanced data
    trackTyped('draft_save', {
      step: 'topic',
      trigger: 'manual',
      dataSize: JSON.stringify(currentData).length
    }, 'writing_flow', 'draft_management');
    
    toast({
      title: t('topic.toast.draft_saved'),
      description: t('topic.toast.draft_saved_desc'),
      className: 'bg-green-50 border-green-200'
    });
  };

  const handleShowPreview = () => {
    trackTyped('preview_sample_click', {
      context: 'topic_step',
      sampleType: 'academic_writing'
    }, 'user_action', 'preview');
    
    toast({
      title: t('topic.toast.feature_developing'),
      description: t('topic.toast.feature_developing_desc')
    });
  };

  const handlePayAndWrite = async () => {
    try {
      track('outcome_pay_and_write_click', { step: 'topic' });
      
      let finalPrice = pay.lockedPrice;
      
      // Step 1: Lock price if not already locked
      if (!finalPrice) {
        const priceLockResponse = await lockPrice({
          title: step1.title,
          wordCount: step1.wordCount,
          verifyLevel: verificationLevel
        });
        
        lockPriceState(priceLockResponse.value, priceLockResponse.expiresAt);
        finalPrice = priceLockResponse;
      }
      
      // Step 2: Show Gate1 modal for payment
      setShowGate1Modal(true);
      
    } catch (error) {
      console.error('Error in pay and write:', error);
      setError(error instanceof Error ? error.message : t('topic.toast.lock_price_failed'));
      
      toast({
        title: t('topic.toast.error_title'),
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
      
      // Create payment intent
      const paymentIntent = await createPaymentIntent({
        price: pay.lockedPrice.value
      });
      
      track('gate1_payment_intent_created', {
        paymentIntentId: paymentIntent.paymentIntentId,
        price: pay.lockedPrice.value
      });
      
      // Simulate payment confirmation
      const confirmResponse = await confirmPayment(paymentIntent.paymentIntentId);
      
      if (confirmResponse.status === 'succeeded') {
        track('gate1_payment_success', {
          paymentIntentId: paymentIntent.paymentIntentId,
          price: pay.lockedPrice.value
        });
        
        setShowGate1Modal(false);
        
        // Start autopilot after successful payment
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
      
      // Start autopilot via API
      const response = await apiStartAutopilot({
        fromStep: 'research' as any, // Continue from research since topic is done
        config
      });
      
      // Start local autopilot state
      await startAutopilot(config);
      
      // Set up progress streaming
      const cancelStream = streamAutopilotProgress(
        response.taskId,
        (progressData) => {
          // Update autopilot progress
          // This would be handled by the existing autopilot system
        },
        (docId) => {
          // Navigate to result page when complete
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
      
      track('autopilot_started_from_topic', {
        taskId: response.taskId,
        config
      });
      
    } catch (error) {
      console.error('Failed to start autopilot:', error);
      setError(error instanceof Error ? error.message : t('topic.toast.autopilot_failed'));
    }
  };

  const handleVerifyLevelChange = (level: VerifyLevel) => {
    setVerificationLevel(level);
    track('outcome_verify_change', { level, step: 'topic' });
    
    // Show confirmation feedback
    toast({
      title: `${t('topic.toast.verification_updated')} ${level}`,
      description: `${t('topic.toast.verification_rate')}${level === 'Pro' ? '100%' : level === 'Standard' ? '95%' : '85%'}`,
      duration: 2000
    });
    
    // Re-calculate estimate with new verification level
    if (validateStep1ForEstimate({
      title: watchedTitle,
      assignmentType: watchedAssignmentType,
      wordCount: watchedWordCount,
      format: watchedFormat,
      level: watchedLevel,
      resources: watchedResources,
      styleSamples: watchedStyleSamples,
      notes: watchedNotes
    })) {
      debouncedEstimate(
        {
          title: watchedTitle,
          assignmentType: watchedAssignmentType,
          wordCount: watchedWordCount,
          format: watchedFormat,
          level: watchedLevel,
          resources: watchedResources,
          styleSamples: watchedStyleSamples,
          notes: watchedNotes
        },
        level, // Use the new verification level
        updateEstimate
      );
    }
  };

  const handleToggleAddon = (key: string, enabled: boolean) => {
    toggleAddon(key, enabled);
    track('outcome_addon_toggle', { key, enabled, step: 'topic' });
  };

  const handleRetry = () => {
    setError(undefined);
    // Could retry the last failed operation
    toast({
      title: t('topic.toast.retry_title'),
      description: t('topic.toast.retry_desc')
    });
  };

  // Update metrics when style samples change
  useEffect(() => {
    updateMetrics({
      styleSamples: step1.styleSamples.length
    });
  }, [step1.styleSamples.length, updateMetrics]);

  // Update pricing estimation when form values change
  useEffect(() => {
    if (validateStep1ForEstimate({
      title: watchedTitle,
      assignmentType: watchedAssignmentType,
      wordCount: watchedWordCount,
      format: watchedFormat,
      level: watchedLevel,
      resources: watchedResources,
      styleSamples: watchedStyleSamples,
      notes: watchedNotes
    })) {
      debouncedEstimate(
        {
          title: watchedTitle,
          assignmentType: watchedAssignmentType,
          wordCount: watchedWordCount,
          format: watchedFormat,
          level: watchedLevel,
          resources: watchedResources,
          styleSamples: watchedStyleSamples,
          notes: watchedNotes
        },
        verificationLevel,
        setEstimate
      );
    }
  }, [
    watchedTitle,
    watchedAssignmentType,
    watchedWordCount,
    watchedFormat,
    watchedLevel,
    watchedResources,
    watchedStyleSamples,
    watchedNotes,
    verificationLevel,
    setEstimate
  ]);

  const assignmentTypeOptions = [
    { value: 'paper' as const, label: t('topic.options.assignment.paper') },
    { value: 'report' as const, label: t('topic.options.assignment.report') },
    { value: 'review' as const, label: t('topic.options.assignment.review') },
    { value: 'commentary' as const, label: t('topic.options.assignment.commentary') }
  ];

  const formatOptions = [
    { value: 'APA' as Format, label: 'APA' },
    { value: 'MLA' as Format, label: 'MLA' },
    { value: 'Chicago' as Format, label: 'Chicago' },
    { value: 'IEEE' as Format, label: 'IEEE' },
    { value: 'GBT' as Format, label: 'GB/T 7714' }
  ];

  const levelOptions = [
    { value: 'UG' as Level, label: t('topic.options.level.undergraduate') },
    { value: 'PG' as Level, label: t('topic.options.level.graduate') },
    { value: 'ESL' as Level, label: t('topic.options.level.esl') },
    { value: 'Pro' as Level, label: t('topic.options.level.professional') }
  ];

  const resourceOptions = [
    { value: 'paper' as const, label: t('topic.options.resources.paper') },
    { value: 'book' as const, label: t('topic.options.resources.book') },
    { value: 'web' as const, label: t('topic.options.resources.web') },
    { value: 'dataset' as const, label: t('topic.options.resources.dataset') },
    { value: 'other' as const, label: t('topic.options.resources.other') }
  ];

  return (
    <>
      {/* Autopilot Banner */}
      <AutopilotBanner
        state={autopilot}
        onMinimize={minimizeAutopilot}
        onPause={pauseAutopilot}
        onResume={resumeAutopilot}
        onStop={stopAutopilot}
      />
      
      <div className={cn("min-h-screen bg-[#F7F8FB]", autopilot.running && !autopilot.minimized ? "pt-20" : autopilot.running ? "pt-12" : "pt-6")}>
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
            {/* Basic Information */}
            <CardSection
              title={t('topic.cards.basic_info')}
              description={t('topic.page_description')}
              icon={FileText}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
                {/* Title */}
                <div className="md:col-span-3 space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-900">
                    {t('topic.form.title.label')} <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="title"
                        placeholder={t('topic.form.title.placeholder')}
                        className={cn(
                          "rounded-xl border-[#E7EAF3] focus:border-[#6A5AF9] focus:ring-2 focus:ring-[#6A5AF9] focus:ring-opacity-20 transition-all duration-200",
                          errors.title && "border-red-500 focus:border-red-500 focus:ring-red-200"
                        )}
                        aria-describedby={errors.title ? "title-error" : undefined}
                      />
                    )}
                  />
                  {errors.title && (
                    <p id="title-error" className="text-sm text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.title.message}
                    </p>
                  )}
                </div>


                {/* Assignment Type */}
                <div className="space-y-2">
                  <Label htmlFor="assignmentType" className="text-sm font-medium text-gray-900">
                    {t('topic.form.type.label')} <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="assignmentType"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-[#E7EAF3] focus:border-[#6A5AF9] focus:ring-2 focus:ring-[#6A5AF9] focus:ring-opacity-20">
                          <SelectValue placeholder={t('topic.form.type.placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {assignmentTypeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.assignmentType && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.assignmentType.message}
                    </p>
                  )}
                </div>

                {/* Word Count */}
                <div className="space-y-2">
                  <Label htmlFor="wordCount" className="text-sm font-medium text-gray-900">
                    {t('topic.form.words.label')} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Controller
                      name="wordCount"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="wordCount"
                          type="number"
                          min="300"
                          max="20000"
                          placeholder={t('topic.form.words.placeholder')}
                          className={cn(
                            "rounded-xl border-[#E7EAF3] focus:border-[#6A5AF9] focus:ring-2 focus:ring-[#6A5AF9] focus:ring-opacity-20 pr-8 transition-all duration-200",
                            errors.wordCount && "border-red-500 focus:border-red-500 focus:ring-red-200"
                          )}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      )}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-600">
                      {t('topic.form.words.unit')}
                    </span>
                  </div>
                  {errors.wordCount && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.wordCount.message}
                    </p>
                  )}
                </div>
              </div>
            </CardSection>

            {/* Academic Requirements */}
            <CardSection
              title={t('topic.cards.academic_requirements')}
              description={t('topic.cards.academic_requirements')}
              icon={Target}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
                {/* Format */}
                <div className="space-y-2">
                  <Label htmlFor="format" className="text-sm font-medium text-gray-900">
                    {t('topic.form.format.label')} <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="format"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-[#E7EAF3] focus:border-[#6A5AF9] focus:ring-2 focus:ring-[#6A5AF9] focus:ring-opacity-20">
                          <SelectValue placeholder={t('topic.form.format.placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {formatOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.format && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.format.message}
                    </p>
                  )}
                </div>

                {/* Level */}
                <div className="space-y-2">
                  <Label htmlFor="level" className="text-sm font-medium text-gray-900">
                    {t('topic.form.level.label')} <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="level"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-[#E7EAF3] focus:border-[#6A5AF9] focus:ring-2 focus:ring-[#6A5AF9] focus:ring-opacity-20">
                          <SelectValue placeholder={t('topic.form.level.placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {levelOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.level && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.level.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-4 mt-6">
                <Label className="text-sm font-medium text-gray-900">
                  {t('topic.form.resources.label')} <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="resources"
                  control={form.control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 xl:gap-4">
                      {resourceOptions.map(option => (
                        <div key={option.value} className="flex items-center space-x-3">
                          <Checkbox
                            id={`resource-${option.value}`}
                            checked={field.value.includes(option.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, option.value]);
                              } else {
                                field.onChange(field.value.filter(v => v !== option.value));
                              }
                            }}
                            className="border-[#E7EAF3] data-[state=checked]:bg-[#6A5AF9] data-[state=checked]:border-[#6A5AF9]"
                          />
                          <Label
                            htmlFor={`resource-${option.value}`}
                            className="text-sm font-normal cursor-pointer text-gray-700"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                />
                {errors.resources && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.resources.message}
                  </p>
                )}

              </div>
            </CardSection>

            {/* Writing Style Reference */}
            <CardSection
              title={t('topic.form.files.title')}
              description={t('topic.form.files.description')}
              icon={Upload}
            >
              <Controller
                name="styleSamples"
                control={form.control}
                render={({ field }) => (
                  <StyleUpload
                    files={field.value}
                    onFilesChange={field.onChange}
                  />
                )}
              />
              {errors.styleSamples && (
                <p className="text-sm text-red-600 flex items-center gap-2 mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.styleSamples.message}
                </p>
              )}
            </CardSection>

            {/* Additional Requirements */}
            <CardSection
              title={t('topic.cards.additional_requirements')}
              description={t('topic.cards.additional_requirements')}
              icon={FileText}
            >
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-900">{t('topic.form.requirements.label')}</Label>
                <Controller
                  name="notes"
                  control={form.control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="notes"
                      placeholder={t('topic.form.requirements.placeholder')}
                      rows={5}
                      className="rounded-xl border-[#E7EAF3] focus:border-[#6A5AF9] focus:ring-2 focus:ring-[#6A5AF9] focus:ring-opacity-20 resize-none transition-all duration-200"
                    />
                  )}
                />
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>{t('topic.form.requirements.counter')}</span>
                  <span className="whitespace-nowrap">{(watchedNotes || '').length}/2000</span>
                </div>
                {errors.notes && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.notes.message}
                  </p>
                )}
              </div>
            </CardSection>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-8">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={saveDraft}
                  className="flex items-center gap-2 rounded-full px-6 py-3 border-[#E7EAF3] text-slate-600 hover:border-[#6A5AF9] hover:text-[#6A5AF9] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#6A5AF9]"
                >
                  <Save className="h-4 w-4" />
                  {t('topic.buttons.save')}
                </Button>
                
              </div>
              
              <Button
                type="submit"
                disabled={!demoMode && !isValid}
                className="flex items-center gap-2 rounded-full px-8 py-3 bg-[#6A5AF9] hover:bg-[#5A4ACF] hover:shadow-lg hover:-translate-y-0.5 text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#6A5AF9] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {t('topic.buttons.continue')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            </form>
            </main>

            {/* Right Column - Outcome Panel */}
            <aside className="hidden xl:block">
              <div className="sticky top-6 -mr-6 md:-mr-8">
                <OutcomePanel
                step="topic"
                lockedPrice={pay.lockedPrice}
                estimate={{
                  priceRange: estimate.priceRange,
                  etaMinutes: estimate.etaMinutes,
                  citesRange: estimate.citesRange,
                  verifyLevel: verificationLevel
                }}
                metrics={{
                  styleSamples: step1.styleSamples?.length || 0
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
    </>
  );
};

export default TopicStep;