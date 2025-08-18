import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Image, 
  FileText, 
  X,
  Loader2,
  File,
  Check
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface FormOptions {
  references: boolean;
  appendix: boolean;
  explainOriginal: boolean;
  aiCheck: boolean;
  plagiarismCheck: boolean;
}

const optionsList = [
  { key: 'references' as keyof FormOptions, label: '参考文献' },
  { key: 'appendix' as keyof FormOptions, label: '附录素材' },
  { key: 'explainOriginal' as keyof FormOptions, label: '原文讲解' },
  { key: 'aiCheck' as keyof FormOptions, label: 'AI检测' },
  { key: 'plagiarismCheck' as keyof FormOptions, label: '抄袭检测' }
];

const EssayForm: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<FormOptions>({
    references: false,
    appendix: false,
    explainOriginal: false,
    aiCheck: false,
    plagiarismCheck: false
  });
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileValidation = (file: File): boolean => {
    const allowedTypes = ['.pdf', '.docx', '.txt', '.md', '.png', '.jpg', '.jpeg'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const maxSize = 20 * 1024 * 1024; // 20MB

    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "文件格式不支持",
        description: `支持的格式: ${allowedTypes.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "文件过大",
        description: "单个文件不能超过 20MB",
        variant: "destructive"
      });
      return false;
    }

    if (attachedFiles.length >= 5) {
      toast({
        title: "文件数量限制",
        description: "最多只能上传 5 个文件",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleFileAdd = (files: File[]) => {
    const validFiles = files.filter(handleFileValidation);
    const newFiles: AttachedFile[] = validFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file
    }));

    setAttachedFiles(prev => [...prev, ...newFiles]);
    setShowUploadMenu(false);
  };

  const handleFileRemove = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragActive(false);
    handleFileAdd(acceptedFiles);
  }, [attachedFiles.length]);

  const onDragEnter = useCallback(() => {
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md']
    },
    noClick: true,
    noKeyboard: true
  });

  const handleImageUpload = () => {
    imageInputRef.current?.click();
    setShowUploadMenu(false);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
    setShowUploadMenu(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileAdd(files);
    e.target.value = '';
  };

  const handleOptionToggle = (key: keyof FormOptions) => {
    setOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "请输入写作要求",
        description: "请在输入框中描述您的写作需求",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 模拟文件上传
      const uploadedFiles = await Promise.all(
        attachedFiles.map(async (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          url: `https://example.com/uploads/${file.id}`
        }))
      );

      // 模拟 API 请求
      const response = {
        orderId: 'ORD-' + Date.now().toString(),
        success: true
      };

      toast({
        title: "提交成功",
        description: "正在生成您的文档，请稍候...",
      });

      // 跳转到订单跟踪页面
      if (response.orderId) {
        navigate(`/order-tracking/${response.orderId}`);
      } else {
        navigate('/writing-status/temp-' + Date.now());
      }

    } catch (error) {
      toast({
        title: "提交失败",
        description: "请检查网络连接后重试",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setShowUploadMenu(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const canSubmit = prompt.trim().length > 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-[1100px] px-4 py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">开始写作</h1>
          <p className="text-slate-500 mt-1">粘贴你的需求，或添加图片/文件</p>
        </header>

        {/* Main Card */}
        <div 
          {...getRootProps()}
          className={`rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 ${
            isDragActive 
              ? 'border-dashed border-blue-500 bg-blue-50' 
              : 'border-slate-200'
          }`}
        >
          <input {...getInputProps()} />
          
          {/* Text Input Area */}
          <div className="relative">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-slate-900">写作需求</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-sm"
                onClick={() => navigate('/progressive-form')}
              >
                填写表单
              </Button>
            </div>
            
            <Textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="在此粘贴论文/作业要求、要点或素材…"
              className="w-full min-h-[220px] resize-y rounded-xl border border-slate-200 p-4 pr-20 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
              style={{ minHeight: '200px' }}
              aria-describedby="upload-help"
              disabled={isSubmitting}
            />
            
            {/* Upload Buttons - Two separate buttons */}
            <div className="absolute bottom-2 right-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs rounded-lg border border-slate-200 bg-white shadow hover:bg-slate-50"
                onClick={handleImageUpload}
                aria-label="上传图片"
                disabled={isSubmitting}
              >
                <Image className="h-3 w-3 mr-1" />
                图片
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs rounded-lg border border-slate-200 bg-white shadow hover:bg-slate-50"
                onClick={handleFileUpload}
                aria-label="上传文件"
                disabled={isSubmitting}
              >
                <FileText className="h-3 w-3 mr-1" />
                文件
              </Button>
            </div>

            {/* Character Count */}
            <span className="absolute bottom-2 left-4 text-xs text-slate-400">
              {prompt.length} 字
            </span>
          </div>

          {/* Options Chips - Checkbox Style */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {optionsList.map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleOptionToggle(option.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    options[option.key]
                      ? 'bg-blue-100 text-blue-800 border-blue-200 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    options[option.key]
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-slate-300 bg-white'
                  }`}>
                    {options[option.key] && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Attachment List */}
          {attachedFiles.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file) => (
                  <Badge
                    key={file.id}
                    variant="outline"
                    className="flex items-center gap-2 py-1 px-3 bg-slate-50"
                  >
                    <File className="h-3 w-3" />
                    <span className="text-xs">
                      {file.name} · {formatFileSize(file.size)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-red-100"
                      onClick={() => handleFileRemove(file.id)}
                      disabled={isSubmitting}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="h-11 rounded-xl bg-blue-600 px-5 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  正在生成...
                </>
              ) : (
                '开始智能生成'
              )}
            </Button>
          </div>

          {/* Drag Active Overlay */}
          {isDragActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 rounded-2xl border-2 border-dashed border-blue-500">
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-blue-600 font-medium">释放文件到此处上传</p>
              </div>
            </div>
          )}
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileInputChange}
          className="hidden"
        />
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Accessibility Helper */}
        <div id="upload-help" className="sr-only">
          支持拖拽上传文件到输入框，或使用右下角上传按钮
        </div>
      </div>
    </AppShell>
  );
};

export default EssayForm;