import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useWritingFlow } from '@/contexts/WritingFlowContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
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
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssignmentType, CitationStyle, SourceType, FileMeta } from '@/types/writing-flow';

// Zod schema for form validation
const topicSchema = z.object({
  title: z.string().min(2, '请填写论文主题').max(120, '主题不能超过120字'),
  courseName: z.string().max(80, '课程名称不能超过80字').optional(),
  workType: z.enum(['paper', 'report', 'review', 'comment'], {
    required_error: '请选择作业类型'
  }),
  wordCount: z.number().int().min(300, '字数需在300-20000之间').max(20000, '字数需在300-20000之间'),
  citation: z.enum(['APA', 'MLA', 'Chicago', 'IEEE', 'GBT'], {
    required_error: '请选择引用格式'
  }),
  languageLevel: z.enum(['undergrad', 'postgrad', 'esl', 'pro'], {
    required_error: '请选择语言水平'
  }),
  sources: z.array(z.enum(['any', 'papers', 'books', 'web', 'datasets', 'other'])).min(1, '请选择至少一种资源类型'),
  sourceOther: z.string().max(60, '其他资源描述不能超过60字').optional(),
  styleFiles: z.array(z.object({
    id: z.string(),
    name: z.string(),
    size: z.number(),
    type: z.string()
  })).max(5, '最多上传5个文件'),
  extra: z.string().max(2000, '附加要求不能超过2000字').optional()
});

type TopicFormData = z.infer<typeof topicSchema>;


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
  files: FileMeta[];
  onFilesChange: (files: FileMeta[]) => void;
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
    const newFiles: FileMeta[] = [];
    
    Array.from(selectedFiles).forEach(file => {
      if (validateFile(file)) {
        newFiles.push({
          id: `${Date.now()}_${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type
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
  const { project, updateTopic, setCurrentStep, completeStep } = useWritingFlow();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: project.topic.title || '',
      courseName: project.topic.course || '',
      workType: project.topic.assignmentType || 'paper',
      wordCount: project.topic.wordLimit || 2000,
      citation: project.topic.citationStyle || 'APA',
      languageLevel: project.topic.languageLevel || 'undergrad',
      sources: project.topic.sources || ['any'],
      sourceOther: project.topic.sourceOther || '',
      styleFiles: project.topic.styleFiles || [],
      extra: project.topic.extraRequirements || ''
    }
  });

  const { handleSubmit, watch, setValue, formState: { errors, isValid } } = form;
  
  // 调试表单状态
  const formValues = watch();
  console.log('表单状态:', {
    isValid,
    errors,
    formValues,
    errorsCount: Object.keys(errors).length
  });
  const watchedExtra = watch('extra') || '';
  const watchedSources = watch('sources') || [];

  // Auto-save to localStorage
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const subscription = watch((value) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        localStorage.setItem('writing-flow-topic', JSON.stringify(value));
      }, 2000);
    });
    
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [watch]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('writing-flow-topic');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
          setValue(key as keyof TopicFormData, data[key]);
        });
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: TopicFormData) => {
    try {
      updateTopic({
        title: data.title,
        course: data.courseName,
        assignmentType: data.workType,
        wordLimit: data.wordCount,
        citationStyle: data.citation === 'GBT' ? 'GB/T 7714' : data.citation,
        languageLevel: data.languageLevel,
        sources: data.sources,
        sourceOther: data.sourceOther,
        styleFiles: data.styleFiles,
        extraRequirements: data.extra
      });

      sessionStorage.setItem('writing-flow:topic', JSON.stringify(data));
      
      completeStep('topic');
      setCurrentStep('research');
      
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
    localStorage.setItem('writing-flow-topic', JSON.stringify(currentData));
    toast({
      title: '草稿已保存',
      description: '您的设置已保存到本地',
      className: 'bg-green-50 border-green-200'
    });
  };

  const workTypeOptions = [
    { value: 'paper' as AssignmentType, label: '论文' },
    { value: 'report' as AssignmentType, label: '报告' },
    { value: 'review' as AssignmentType, label: '评论' },
    { value: 'comment' as AssignmentType, label: '综述' }
  ];

  const citationOptions = [
    { value: 'APA' as CitationStyle, label: 'APA' },
    { value: 'MLA' as CitationStyle, label: 'MLA' },
    { value: 'Chicago' as CitationStyle, label: 'Chicago' },
    { value: 'IEEE' as CitationStyle, label: 'IEEE' },
    { value: 'GBT' as CitationStyle, label: 'GB/T 7714' }
  ];

  const languageOptions = [
    { value: 'undergrad', label: '本科' },
    { value: 'postgrad', label: '研究生' },
    { value: 'esl', label: '非母语' },
    { value: 'pro', label: '专业级' }
  ];

  const sourceOptions = [
    { value: 'any' as SourceType, label: '不限' },
    { value: 'papers' as SourceType, label: '学术论文' },
    { value: 'books' as SourceType, label: '书籍' },
    { value: 'web' as SourceType, label: '网站' },
    { value: 'datasets' as SourceType, label: '数据集' },
    { value: 'other' as SourceType, label: '其他' }
  ];

  return (
    <div className="space-y-6">
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

                {/* Course Name */}
                <div className="space-y-2">
                  <Label htmlFor="courseName" className="text-sm font-medium text-gray-900">课程名称</Label>
                  <Controller
                    name="courseName"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="courseName"
                        placeholder="例如：学术写作"
                        className="rounded-xl border-[#EEF0F4] focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF] focus:ring-opacity-20 transition-all duration-200"
                      />
                    )}
                  />
                </div>

                {/* Work Type */}
                <div className="space-y-2">
                  <Label htmlFor="workType" className="text-sm font-medium text-gray-900">
                    作业类型 <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="workType"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-[#EEF0F4] focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF] focus:ring-opacity-20">
                          <SelectValue placeholder="请选择作业类型" />
                        </SelectTrigger>
                        <SelectContent>
                          {workTypeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.workType && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.workType.message}
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
                {/* Citation Format */}
                <div className="space-y-2">
                  <Label htmlFor="citation" className="text-sm font-medium text-gray-900">
                    引用格式 <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="citation"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-[#EEF0F4] focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF] focus:ring-opacity-20">
                          <SelectValue placeholder="请选择引用格式" />
                        </SelectTrigger>
                        <SelectContent>
                          {citationOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.citation && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.citation.message}
                    </p>
                  )}
                </div>

                {/* Language Level */}
                <div className="space-y-2">
                  <Label htmlFor="languageLevel" className="text-sm font-medium text-gray-900">
                    语言水平 <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="languageLevel"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-[#EEF0F4] focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF] focus:ring-opacity-20">
                          <SelectValue placeholder="请选择语言水平" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.languageLevel && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.languageLevel.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Allowed Sources */}
              <div className="space-y-4 mt-6">
                <Label className="text-sm font-medium text-gray-900">
                  允许的资源类型 <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="sources"
                  control={form.control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {sourceOptions.map(option => (
                        <div key={option.value} className="flex items-center space-x-3">
                          <Checkbox
                            id={`source-${option.value}`}
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
                            htmlFor={`source-${option.value}`}
                            className="text-sm font-normal cursor-pointer text-gray-700"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                />
                {errors.sources && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.sources.message}
                  </p>
                )}

                {/* Other Source Input */}
                {watchedSources.includes('other') && (
                  <div className="space-y-2">
                    <Label htmlFor="sourceOther" className="text-sm font-medium text-gray-900">
                      其他资源描述 <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="sourceOther"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="sourceOther"
                          placeholder="请描述其他资源类型"
                          className={cn(
                            "rounded-xl border-[#EEF0F4] focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF] focus:ring-opacity-20 transition-all duration-200",
                            errors.sourceOther && "border-red-500 focus:border-red-500 focus:ring-red-200"
                          )}
                        />
                      )}
                    />
                    {errors.sourceOther && (
                      <p className="text-sm text-red-600 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.sourceOther.message}
                      </p>
                    )}
                  </div>
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
                name="styleFiles"
                control={form.control}
                render={({ field }) => (
                  <StyleUpload
                    files={field.value}
                    onFilesChange={field.onChange}
                  />
                )}
              />
              {errors.styleFiles && (
                <p className="text-sm text-red-600 flex items-center gap-2 mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.styleFiles.message}
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
                <Label htmlFor="extra" className="text-sm font-medium text-gray-900">额外要求</Label>
                <Controller
                  name="extra"
                  control={form.control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="extra"
                      placeholder="任何额外偏好、禁用点、引用数量、段落结构等"
                      rows={5}
                      className="rounded-xl border-[#EEF0F4] focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF] focus:ring-opacity-20 resize-none transition-all duration-200"
                    />
                  )}
                />
                <div className="flex items-center justify-between text-sm text-[#5B667A]">
                  <span>最多2000字</span>
                  <span className="whitespace-nowrap">{watchedExtra.length}/2000</span>
                </div>
                {errors.extra && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.extra.message}
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
                
                {/* 调试按钮 */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    console.log('=== 调试信息 ===');
                    console.log('表单错误:', errors);
                    console.log('表单值:', formValues);
                    console.log('isValid:', isValid);
                    alert(`表单验证状态: ${isValid ? '有效' : '无效'}\n错误数量: ${Object.keys(errors).length}\n错误详情请查看控制台`);
                  }}
                  className="text-xs px-3 py-2"
                >
                  调试
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
  );
};

export default TopicStep;