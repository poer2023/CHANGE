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
import EstimateCard from '@/components/WritingFlow/EstimateCard';
import AutopilotBanner from '@/components/AutopilotBanner';
import { useStep1, useEstimate, useAutopilot, useApp } from '@/state/AppContext';
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

// Zod schema for form validation
const topicSchema = z.object({
  title: z.string().min(2, '请填写论文主题').max(120, '主题不能超过120字'),
  assignmentType: z.enum(['paper', 'report', 'review', 'commentary'], {
    required_error: '请选择作业类型'
  }),
  wordCount: z.number().int().min(300, '字数需在300-20000之间').max(20000, '字数需在300-20000之间'),
  format: z.enum(['APA', 'MLA', 'Chicago', 'IEEE', 'GBT'], {
    required_error: '请选择引用格式'
  }),
  level: z.enum(['UG', 'PG', 'ESL', 'Pro'], {
    required_error: '请选择语言水平'
  }),
  resources: z.array(z.enum(['paper', 'book', 'web', 'dataset', 'other'])).min(1, '请选择至少一种资源类型'),
  styleSamples: z.array(z.object({
    id: z.string(),
    name: z.string(),
    size: z.number()
  })).max(5, '最多上传5个文件'),
  notes: z.string().max(2000, '附加要求不能超过2000字').optional()
});

type TopicFormData = z.infer<typeof topicSchema>;

// Autopilot confirmation dialog
interface AutopilotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (config: { verifyLevel: VerifyLevel; allowPreprint: boolean; useStyle: boolean }) => void;
}

const AutopilotDialog: React.FC<AutopilotDialogProps> = ({ open, onOpenChange, onConfirm }) => {
  const [verifyLevel, setVerifyLevel] = useState<VerifyLevel>('Standard');
  const [allowPreprint, setAllowPreprint] = useState(true);
  const [useStyle, setUseStyle] = useState(false);
  const { step1 } = useStep1();

  const handleConfirm = () => {
    onConfirm({ verifyLevel, allowPreprint, useStyle });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#6E5BFF] to-[#8B7FFF] flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            自动推进
          </DialogTitle>
          <DialogDescription className="text-gray-600 leading-relaxed">
            将自动完成文献检索、写作策略与大纲构建。此过程不收费。完成后进入结果页，正文生成前需付费解锁。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Verification Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">核验等级</Label>
            <Select value={verifyLevel} onValueChange={(v: VerifyLevel) => setVerifyLevel(v)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basic">Basic - 基础核验</SelectItem>
                <SelectItem value="Standard">Standard - 标准核验</SelectItem>
                <SelectItem value="Pro">Pro - 专业核验</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">允许替代资源</Label>
                <p className="text-xs text-gray-600">包含预印本、二手引用等</p>
              </div>
              <Switch checked={allowPreprint} onCheckedChange={setAllowPreprint} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">使用文风样本对齐</Label>
                <p className="text-xs text-gray-600">
                  {step1.styleSamples.length > 0 ? `已上传 ${step1.styleSamples.length} 个样本` : '暂无样本文件'}
                </p>
              </div>
              <Switch 
                checked={useStyle} 
                onCheckedChange={setUseStyle}
                disabled={step1.styleSamples.length === 0}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
            取消
          </Button>
          <Button onClick={handleConfirm} className="rounded-full bg-gradient-to-r from-[#6E5BFF] to-[#8B7FFF]">
            开始自动推进
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


// Card Section Component
const CardSection: React.FC<{ 
  title: string; 
  description: string; 
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}> = ({ title, description, icon: Icon, children }) => (
  <Card className="bg-white border-[#EEF0F4] rounded-2xl" style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}>
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-3 text-base font-semibold">
        <div className="w-2 h-2 rounded-full bg-[#6E5BFF]"></div>
        <Icon className="h-5 w-5 text-[#6E5BFF]" />
        {title}
      </CardTitle>
      <CardDescription className="text-sm text-[#5B667A] leading-6">
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6 pt-0">
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

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: '文件格式不支持',
        description: '请上传 TXT、DOC、DOCX 或 PDF 格式文件',
        variant: 'destructive'
      });
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: '文件过大',
        description: '文件大小不能超过 10MB',
        variant: 'destructive'
      });
      return false;
    }
    
    if (files.length >= 5) {
      toast({
        title: '文件数量超限',
        description: '最多上传 5 个文件',
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
          isDragging ? 'border-[#6E5BFF] bg-[#6E5BFF]/5 transform scale-[1.01]' : 'border-[#EEF0F4] hover:border-[#6E5BFF]/50 hover:bg-gray-50'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-8 w-8 text-[#5B667A] mb-3" />
        <p className="text-sm text-gray-900 mb-2 font-medium">
          拖拽文件到这里，或点击选择文件
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
            className="rounded-full border-[#6E5BFF] text-[#6E5BFF] hover:bg-[#6E5BFF] hover:text-white transition-all duration-200 pointer-events-none"
          >
            选择文件
          </Button>
        </Label>
        <p className="text-xs text-[#5B667A] mt-3">
          支持 TXT、DOC、DOCX、PDF 格式，单个文件不超过 10MB，最多 5 个文件
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-[#EEF0F4]">
              <FileText className="h-4 w-4 text-[#6E5BFF] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-[#5B667A]">
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
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Track page load time for analytics
  const [pageLoadTime] = useState(() => Date.now());
  const [showAutopilotDialog, setShowAutopilotDialog] = useState(false);
  const [verificationLevel, setVerificationLevel] = useState<VerifyLevel>('Standard');
  
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
        title: '选题设置完成',
        description: '已保存您的设置，正在进入研究阶段...'
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
      title: '草稿已保存',
      description: '您的设置已保存',
      className: 'bg-green-50 border-green-200'
    });
  };

  const handleAutopilotStart = (config: { verifyLevel: VerifyLevel; allowPreprint: boolean; useStyle: boolean }) => {
    startAutopilot(config);
    toast({
      title: 'AI 自动推进已启动',
      description: '正在进行文献检索、策略制定和大纲构建'
    });
  };

  const handleShowPreview = () => {
    trackTyped('preview_sample_click', {
      context: 'topic_step',
      sampleType: 'academic_writing'
    }, 'user_action', 'preview');
    
    toast({
      title: '功能开发中',
      description: '样例预览功能即将上线'
    });
  };

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
    { value: 'paper' as const, label: '论文' },
    { value: 'report' as const, label: '报告' },
    { value: 'review' as const, label: '评论' },
    { value: 'commentary' as const, label: '综述' }
  ];

  const formatOptions = [
    { value: 'APA' as Format, label: 'APA' },
    { value: 'MLA' as Format, label: 'MLA' },
    { value: 'Chicago' as Format, label: 'Chicago' },
    { value: 'IEEE' as Format, label: 'IEEE' },
    { value: 'GBT' as Format, label: 'GB/T 7714' }
  ];

  const levelOptions = [
    { value: 'UG' as Level, label: '本科' },
    { value: 'PG' as Level, label: '研究生' },
    { value: 'ESL' as Level, label: '非母语' },
    { value: 'Pro' as Level, label: '专业级' }
  ];

  const resourceOptions = [
    { value: 'paper' as const, label: '学术论文' },
    { value: 'book' as const, label: '书籍' },
    { value: 'web' as const, label: '网站' },
    { value: 'dataset' as const, label: '数据集' },
    { value: 'other' as const, label: '其他' }
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
      
      <div className={cn("space-y-6", autopilot.running && !autopilot.minimized ? "mt-20" : autopilot.running ? "mt-12" : "")}>
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#6E5BFF] text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold leading-tight text-gray-900">选题设置</h1>
              <p className="text-[#5B667A] text-sm leading-6 mt-1">填写论文关键信息，便于精准生成写作策略</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Form */}
          <div className="flex-1 lg:max-w-[680px]">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <CardSection
              title="基本信息"
              description="填写论文关键信息，便于精准生成写作策略。"
              icon={FileText}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-900">
                    论文主题 <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="title"
                        placeholder="请输入论文题目/主题"
                        className={cn(
                          "rounded-xl border-[#EEF0F4] focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF] focus:ring-opacity-20 transition-all duration-200",
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
                    作业类型 <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="assignmentType"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-[#EEF0F4] focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF] focus:ring-opacity-20">
                          <SelectValue placeholder="请选择作业类型" />
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
                    字数要求 <span className="text-red-500">*</span>
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
                          placeholder="2000"
                          className={cn(
                            "rounded-xl border-[#EEF0F4] focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF] focus:ring-opacity-20 pr-8 transition-all duration-200",
                            errors.wordCount && "border-red-500 focus:border-red-500 focus:ring-red-200"
                          )}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      )}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#5B667A]">
                      字
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
              title="学术要求"
              description="限定引用与语言标准，确保符合学术规范。"
              icon={Target}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Format */}
                <div className="space-y-2">
                  <Label htmlFor="format" className="text-sm font-medium text-gray-900">
                    引用格式 <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="format"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-[#EEF0F4] focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF] focus:ring-opacity-20">
                          <SelectValue placeholder="请选择引用格式" />
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
                    语言水平 <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="level"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-[#EEF0F4] focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF] focus:ring-opacity-20">
                          <SelectValue placeholder="请选择语言水平" />
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
                  允许的资源类型 <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="resources"
                  control={form.control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                            className="border-[#EEF0F4] data-[state=checked]:bg-[#6E5BFF] data-[state=checked]:border-[#6E5BFF]"
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
              title="写作风格参考"
              description="上传示例文本，生成风格更贴近你的偏好。"
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
              title="附加要求"
              description="补充任何额外的细节与限制。"
              icon={FileText}
            >
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-900">额外要求</Label>
                <Controller
                  name="notes"
                  control={form.control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="notes"
                      placeholder="任何额外偏好、禁用点、引用数量、段落结构等"
                      rows={5}
                      className="rounded-xl border-[#EEF0F4] focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF] focus:ring-opacity-20 resize-none transition-all duration-200"
                    />
                  )}
                />
                <div className="flex items-center justify-between text-sm text-[#5B667A]">
                  <span>最多2000字</span>
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
                  className="flex items-center gap-2 rounded-full px-6 py-3 border-[#EEF0F4] text-[#5B667A] hover:border-[#6E5BFF] hover:text-[#6E5BFF] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#6E5BFF]"
                >
                  <Save className="h-4 w-4" />
                  保存草稿
                </Button>
                
              </div>
              
              <Button
                type="submit"
                disabled={!isValid}
                className="flex items-center gap-2 rounded-full px-8 py-3 bg-[#6E5BFF] hover:bg-[#5B4FCC] hover:shadow-lg hover:-translate-y-0.5 text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#6E5BFF] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                下一步
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            </form>
          </div>

          {/* Right Column - Estimate Card */}
          <div className="w-full lg:w-[360px] lg:flex-shrink-0">
            <EstimateCard
              estimate={estimate}
              onVerifyLevelChange={setVerificationLevel}
              onPreviewSample={handleShowPreview}
              onAutopilotClick={() => setShowAutopilotDialog(true)}
            />
          </div>
        </div>
      </div>

      {/* Autopilot Dialog */}
      <AutopilotDialog
        open={showAutopilotDialog}
        onOpenChange={setShowAutopilotDialog}
        onConfirm={handleAutopilotStart}
      />
    </>
  );
};

export default TopicStep;