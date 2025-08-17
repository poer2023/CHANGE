import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  History, 
  X, 
  Clock,
  File
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface DetectionFile {
  name: string;
  size: number;
  type: string;
  pages?: number;
  content?: string;
}

export interface HistoryItem {
  id: string;
  name: string;
  time: string;
  result: string;
  type: 'ai' | 'plagiarism';
}

interface DetectionInputProps {
  onFileSelect: (file: DetectionFile) => void;
  onTextInput: (text: string) => void;
  onHistorySelect: (item: HistoryItem) => void;
  onDetectionStart: () => void;
  disabled?: boolean;
  saveToHistory?: boolean;
  onSaveToHistoryChange?: (save: boolean) => void;
  detectionType: 'ai' | 'plagiarism';
  additionalOptions?: React.ReactNode;
}

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    name: 'research_paper.pdf',
    time: '2024-08-17 10:30',
    result: 'AI: 87%',
    type: 'ai'
  },
  {
    id: '2', 
    name: 'essay_draft.docx',
    time: '2024-08-17 09:15',
    result: '相似度: 24%',
    type: 'plagiarism'
  },
  {
    id: '3',
    name: '粘贴文本',
    time: '2024-08-16 16:20',
    result: 'AI: 45%',
    type: 'ai'
  }
];

const DetectionInput: React.FC<DetectionInputProps> = ({
  onFileSelect,
  onTextInput,
  onHistorySelect,
  onDetectionStart,
  disabled = false,
  saveToHistory = true,
  onSaveToHistoryChange,
  detectionType,
  additionalOptions
}) => {
  const [selectedFile, setSelectedFile] = useState<DetectionFile | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const { toast } = useToast();

  const hasInput = selectedFile || textInput.trim().length > 0;

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const maxSize = 20 * 1024 * 1024; // 20MB
    const supportedTypes = ['.docx', '.pdf', '.txt', '.md'];
    
    if (file.size > maxSize) {
      toast({
        title: "文件过大",
        description: "文件大小不能超过20MB",
        variant: "destructive"
      });
      return;
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!supportedTypes.includes(extension)) {
      toast({
        title: "格式不支持",
        description: `支持的格式：${supportedTypes.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    const detectionFile: DetectionFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      pages: Math.floor(Math.random() * 10) + 1 // 模拟页数
    };

    setSelectedFile(detectionFile);
    onFileSelect(detectionFile);
    setTextInput('');
  }, [onFileSelect, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleTextChange = (value: string) => {
    if (value.length > 50000) {
      toast({
        title: "文本过长",
        description: "文本长度不能超过50,000字符",
        variant: "destructive"
      });
      return;
    }
    setTextInput(value);
    onTextInput(value);
    setSelectedFile(null);
  };

  const handleHistoryItemSelect = (item: HistoryItem) => {
    onHistorySelect(item);
    setShowHistory(false);
    setSelectedFile({ name: item.name, size: 0, type: 'history' });
    setTextInput('');
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setTextInput('');
    onTextInput('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const filteredHistory = mockHistory.filter(item => item.type === detectionType);

  return (
    <Card>
      <CardHeader>
        <CardTitle>输入内容</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">上传文件</TabsTrigger>
            <TabsTrigger value="text">粘贴文本</TabsTrigger>
            <TabsTrigger value="history">历史记录</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">拖拽文件到这里</p>
              <p className="text-gray-500 mb-4">或者</p>
              <Input
                type="file"
                accept=".docx,.pdf,.txt,.md"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer">
                  选择文件
                </label>
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                支持 .docx .pdf .txt .md，最大20MB
              </p>
            </div>

            {selectedFile && selectedFile.type !== 'history' && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)}
                      {selectedFile.pages && ` • ${selectedFile.pages} 页`}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div>
              <Textarea
                placeholder="在此粘贴或输入文本..."
                value={textInput}
                onChange={(e) => handleTextChange(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {textInput.length.toLocaleString()} / 50,000 字符
                </span>
                {textInput.length > 45000 && (
                  <Badge variant="outline" className="text-orange-600">
                    接近限制
                  </Badge>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="space-y-3">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">暂无历史记录</p>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleHistoryItemSelect(item)}
                  >
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {item.time}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{item.result}</Badge>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-4">
          {additionalOptions}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-history"
                checked={saveToHistory}
                onCheckedChange={onSaveToHistoryChange}
              />
              <label
                htmlFor="save-history"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                保存到历史记录
              </label>
            </div>

            <Button
              onClick={onDetectionStart}
              disabled={!hasInput || disabled}
              className="min-w-[120px]"
            >
              开始检测
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetectionInput;