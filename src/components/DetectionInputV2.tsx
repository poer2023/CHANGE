import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  FileText,
  History,
  Trash2,
  RefreshCw,
  Eye,
  Clock,
  ClipboardCopy,
  X,
  ChevronRight,
  AlertCircle,
  Check
} from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';

export interface DetectionFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  file?: File;
  pages?: number;
  uploadTime?: string;
}

export interface HistoryItem {
  id: string;
  name: string;
  type: 'ai' | 'plagiarism';
  result?: string;
  createdAt: string;
  source: 'file' | 'text' | 'history';
  charCount?: number;
}

type TabType = 'upload' | 'paste' | 'history';
type InputState = 'idle' | 'dragging' | 'selected' | 'running' | 'error';

interface DetectionInputV2Props {
  detectionType: 'ai' | 'plagiarism';
  onFileSelect?: (file: DetectionFile) => void;
  onTextInput?: (text: string) => void;
  onHistorySelect?: (item: HistoryItem) => void;
  onDetectionStart?: () => void;
  disabled?: boolean;
  saveToHistory?: boolean;
  onSaveToHistoryChange?: (checked: boolean) => void;
  additionalOptions?: React.ReactNode;
}

const DetectionInputV2: React.FC<DetectionInputV2Props> = ({
  detectionType,
  onFileSelect,
  onTextInput,
  onHistorySelect,
  onDetectionStart,
  disabled = false,
  saveToHistory = true,
  onSaveToHistoryChange,
  additionalOptions
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [inputState, setInputState] = useState<InputState>('idle');
  const [selectedFile, setSelectedFile] = useState<DetectionFile | null>(null);
  const [textContent, setTextContent] = useState('');
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 模拟历史记录数据
  const mockHistory: HistoryItem[] = [
    {
      id: '1',
      name: '学术论文检测报告.pdf',
      type: 'ai',
      result: '87%',
      createdAt: '2025-01-15 14:30',
      source: 'file',
      charCount: 5420
    },
    {
      id: '2', 
      name: '毕业论文第三章',
      type: 'plagiarism',
      result: '12%',
      createdAt: '2025-01-14 09:15',
      source: 'text',
      charCount: 8900
    },
    {
      id: '3',
      name: '课程作业提交版.docx',
      type: 'ai',
      result: '34%',
      createdAt: '2025-01-13 16:45',
      source: 'file',
      charCount: 3200
    }
  ];

  // 最近使用的文件
  const recentFiles = [
    { name: '论文草稿.docx', size: 124000 },
    { name: '文献综述.pdf', size: 892000 },
    { name: '研究报告.txt', size: 45000 }
  ];

  const canStartDetection = () => {
    if (disabled || inputState === 'running') return false;
    
    switch (activeTab) {
      case 'upload':
        return selectedFile !== null && inputState !== 'error';
      case 'paste':
        return textContent.trim().length > 0 && textContent.length <= 50000;
      case 'history':
        return selectedHistory !== null;
      default:
        return false;
    }
  };

  const handleStartDetection = () => {
    if (!canStartDetection()) return;
    
    setInputState('running');
    if (onDetectionStart) {
      onDetectionStart();
    }
  };

  // 文件处理
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setError(null);
    
    // 验证文件类型
    const allowedTypes = ['.docx', '.pdf', '.txt', '.md'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      setError(`不支持的文件格式。支持: ${allowedTypes.join(', ')}`);
      setInputState('error');
      return;
    }
    
    // 验证文件大小 (20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError('文件大小超过 20MB 限制');
      setInputState('error');
      return;
    }

    // 模拟上传过程
    setInputState('selected');
    setUploadProgress(0);
    
    const newFile: DetectionFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      file,
      pages: Math.floor(Math.random() * 50) + 1,
      uploadTime: new Date().toLocaleString('zh-CN')
    };

    // 模拟上传进度
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setSelectedFile(newFile);
          if (onFileSelect) onFileSelect(newFile);
          if (selectedFile) {
            toast({
              title: "文件已替换",
              description: `已替换为 ${file.name}`,
            });
          }
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setInputState('dragging');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setInputState(selectedFile ? 'selected' : 'idle');
  }, [selectedFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setInputState(selectedFile ? 'selected' : 'idle');
    handleFileSelect(e.dataTransfer.files);
  }, [selectedFile]);

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setError(null);
    setInputState('idle');
  };

  const handleReplaceFile = () => {
    fileInputRef.current?.click();
  };

  // 文本处理
  const handleTextChange = (value: string) => {
    setTextContent(value);
    if (onTextInput) onTextInput(value);
  };

  const handleClearText = () => {
    setTextContent('');
    if (onTextInput) onTextInput('');
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTextContent(text);
      if (onTextInput) onTextInput(text);
    } catch (err) {
      toast({
        title: "粘贴失败",
        description: "无法访问剪贴板，请手动粘贴",
        variant: "destructive"
      });
    }
  };

  // 历史记录处理
  const handleHistoryItemSelect = (item: HistoryItem) => {
    setSelectedHistory(item);
    setActiveTab('upload'); // 切换到上传标签页显示
    
    // 创建文件卡样式显示
    const mockFile: DetectionFile = {
      name: item.name,
      size: item.charCount || 0,
      type: 'history',
      lastModified: new Date(item.createdAt).getTime(),
      uploadTime: item.createdAt
    };
    
    setSelectedFile(mockFile);
    setInputState('selected');
    
    if (onHistorySelect) onHistorySelect(item);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatCharCount = (count: number) => {
    return count.toLocaleString();
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-sm bg-white rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-medium">输入内容</CardTitle>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm">
              <History className="h-4 w-4 mr-2" />
              历史记录
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader>
              <DrawerTitle>检测历史</DrawerTitle>
              <DrawerDescription>查看所有检测记录</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-2 overflow-y-auto">
              {mockHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    handleHistoryItemSelect(item);
                    setIsDrawerOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.createdAt}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {item.type === 'ai' ? 'AI' : '抄袭'}: {item.result}
                    </Badge>
                    <Button variant="ghost" size="sm">选择</Button>
                  </div>
                </div>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 分段控件 Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[
            { key: 'upload', label: '上传文件', icon: Upload },
            { key: 'paste', label: '粘贴文本', icon: FileText },
            { key: 'history', label: '历史记录', icon: History }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(key as TabType)}
              disabled={disabled}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab 内容区 */}
        <div className="min-h-[360px]">
          {/* Tab A: 上传文件 */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {!selectedFile ? (
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer min-h-[320px] flex flex-col items-center justify-center ${
                    inputState === 'dragging'
                      ? 'border-blue-500 bg-blue-50'
                      : inputState === 'error'
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  aria-describedby="file-requirements"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".docx,.pdf,.txt,.md"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    disabled={disabled}
                  />
                  
                  <Upload 
                    className={`h-12 w-12 mx-auto mb-4 transition-transform duration-200 ${
                      inputState === 'dragging' ? 'scale-110 text-blue-500' : 'text-gray-400'
                    }`} 
                  />
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    拖拽文件到这里
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    或{' '}
                    <span className="text-blue-600 font-medium">选择文件</span>
                  </p>
                  
                  <p id="file-requirements" className="text-sm text-gray-500">
                    支持 .docx .pdf .txt .md，最大 20MB
                  </p>

                  {error && (
                    <div className="absolute bottom-4 left-4 right-4 bg-red-100 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-700 text-sm">{error}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setError(null);
                          setInputState('idle');
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border rounded-xl p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{selectedFile.name}</h4>
                        <div className="text-sm text-gray-500 space-x-2">
                          <span>{formatFileSize(selectedFile.size)}</span>
                          {selectedFile.pages && <span>• {selectedFile.pages} 页</span>}
                          {selectedFile.uploadTime && <span>• {selectedFile.uploadTime}</span>}
                          {selectedFile.type === 'history' && (
                            <Badge variant="outline" className="ml-2">来源: 历史</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => {}}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleReplaceFile}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-3">
                      <Progress value={uploadProgress} className="h-1" />
                    </div>
                  )}
                </div>
              )}

              {/* 最近使用 */}
              {!selectedFile && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">最近使用</h4>
                  <div className="flex gap-2">
                    {recentFiles.map((file, index) => (
                      <button
                        key={index}
                        className="px-3 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                        onClick={() => {
                          // 模拟选择最近文件
                          const mockFile: DetectionFile = {
                            name: file.name,
                            size: file.size,
                            type: 'recent',
                            lastModified: Date.now(),
                            uploadTime: new Date().toLocaleString('zh-CN')
                          };
                          setSelectedFile(mockFile);
                          setInputState('selected');
                        }}
                      >
                        {file.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab B: 粘贴文本 */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              {/* 工具条 */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleClearText}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    清空
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handlePasteFromClipboard}>
                    <ClipboardCopy className="h-4 w-4 mr-1" />
                    从剪贴板粘贴
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${textContent.length > 50000 ? 'text-red-600' : 'text-gray-600'}`}>
                    {formatCharCount(textContent.length)} / 50,000
                  </span>
                </div>
              </div>

              {/* 文本输入区 */}
              <div className="relative">
                <Textarea
                  value={textContent}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="在此粘贴或输入文本…"
                  className="min-h-[280px] resize-y font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={disabled}
                  aria-live="polite"
                  aria-invalid={textContent.length > 50000}
                />
                
                {textContent.length > 2000 && textContent.length <= 50000 && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-700">建议先分段检测以获得更精确的结果</span>
                    </div>
                  </div>
                )}

                {textContent.length > 50000 && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-700">文本长度超过限制，请删减至 50,000 字符以内</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab C: 历史记录 */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">最近记录</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsDrawerOpen(true)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    查看全部
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                
                {mockHistory.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedHistory?.id === item.id
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleHistoryItemSelect(item)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium text-sm text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {item.createdAt}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.type === 'ai' ? 'AI' : '抄袭'}: {item.result}
                      </Badge>
                      <Button 
                        variant={selectedHistory?.id === item.id ? "default" : "outline"} 
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        {selectedHistory?.id === item.id ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            已选择
                          </>
                        ) : (
                          '选择'
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 附加选项 */}
        {additionalOptions && (
          <div className="p-4 bg-gray-50 rounded-xl">
            {additionalOptions}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Switch
              checked={saveToHistory}
              onCheckedChange={onSaveToHistoryChange}
              disabled={disabled}
              id="save-history"
            />
            <label 
              htmlFor="save-history" 
              className="text-sm text-gray-700 cursor-pointer"
              title="仅保存摘要与元数据，不保存原文"
            >
              保存到历史记录
            </label>
          </div>
          
          <Button
            onClick={handleStartDetection}
            disabled={!canStartDetection()}
            className="min-w-[120px]"
            size="lg"
          >
            {inputState === 'running' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                正在检测…
              </>
            ) : (
              '开始检测'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetectionInputV2;