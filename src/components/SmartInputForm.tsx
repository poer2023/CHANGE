import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, Image, Wand2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';

export type SmartInputData = {
  text?: string;
  images?: File[];
};

export type AnalysisProgress = {
  stage: 'uploading' | 'analyzing' | 'extracting' | 'completed';
  progress: number;
  message: string;
};

type SmartInputFormProps = {
  onAnalysisStart: (data: SmartInputData) => void;
  onAnalysisProgress?: (progress: AnalysisProgress) => void;
  isAnalyzing?: boolean;
  disabled?: boolean;
};

const SmartInputForm: React.FC<SmartInputFormProps> = ({
  onAnalysisStart,
  onAnalysisProgress,
  isAnalyzing = false,
  disabled = false,
}) => {
  const { toast } = useToast();
  const [textInput, setTextInput] = useState('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (imageFiles.length !== acceptedFiles.length) {
      toast({
        title: "文件类型限制",
        description: "只支持图片文件和PDF文件",
        variant: "destructive"
      });
    }
    
    setUploadedImages(prev => [...prev, ...imageFiles]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'application/pdf': ['.pdf']
    },
    disabled: disabled || isAnalyzing
  });

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    if (!textInput.trim() && uploadedImages.length === 0) {
      toast({
        title: "内容为空",
        description: "请输入文本或上传图片后再进行分析",
        variant: "destructive"
      });
      return;
    }

    const data: SmartInputData = {
      text: textInput.trim() || undefined,
      images: uploadedImages.length > 0 ? uploadedImages : undefined
    };

    onAnalysisStart(data);
  };

  const clearAll = () => {
    setTextInput('');
    setUploadedImages([]);
    setAnalysisProgress(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-blue-600" />
          智能表单分析
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          粘贴文本内容或上传图片，AI将自动分析并填写表单信息
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 文本输入区域 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">文本内容</label>
          <Textarea
            placeholder="在此粘贴您的文本内容，例如：论文要求、课程说明、作业描述等..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="min-h-32 resize-none"
            disabled={disabled || isAnalyzing}
          />
          {textInput && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>{textInput.length} 字符</span>
            </div>
          )}
        </div>

        <Separator />

        {/* 图片上传区域 */}
        <div className="space-y-3">
          <label className="text-sm font-medium">图片上传</label>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${disabled || isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            {isDragActive ? (
              <p className="text-blue-600">释放文件到此处...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-1">拖拽文件到此处，或点击选择文件</p>
                <p className="text-xs text-gray-500">支持 PNG, JPG, PDF 格式</p>
              </div>
            )}
          </div>

          {/* 已上传文件列表 */}
          {uploadedImages.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">已上传文件 ({uploadedImages.length})</p>
              <div className="space-y-2">
                {uploadedImages.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-blue-600" />
                      <span className="text-sm truncate max-w-48">{file.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {formatFileSize(file.size)}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      disabled={disabled || isAnalyzing}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 分析进度 */}
        {isAnalyzing && analysisProgress && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              <span className="text-sm font-medium">AI分析中...</span>
            </div>
            <Progress value={analysisProgress.progress} className="w-full" />
            <p className="text-xs text-muted-foreground">{analysisProgress.message}</p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={clearAll}
            disabled={disabled || isAnalyzing || (!textInput && uploadedImages.length === 0)}
          >
            清空内容
          </Button>
          
          <Button
            onClick={handleAnalyze}
            disabled={disabled || isAnalyzing || (!textInput.trim() && uploadedImages.length === 0)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                分析中...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                立即智能填写要点
              </>
            )}
          </Button>
        </div>

        {/* 提示信息 */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-700">
            <p className="font-medium mb-1">智能分析提示：</p>
            <ul className="space-y-0.5 list-disc list-inside">
              <li>AI将从您的内容中提取论文主题、类型、要求等信息</li>
              <li>分析结果会自动填充到对应的表单字段中</li>
              <li>未能识别的字段需要您手动补充完成</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartInputForm;