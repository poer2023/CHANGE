import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  File,
  FileImage,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (files: File[]) => void;
}

interface FileItem {
  file: File;
  id: string;
  status: 'pending' | 'valid' | 'invalid';
  error?: string;
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  open,
  onOpenChange,
  onConfirm
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'image/png',
    'image/jpeg',
    'image/jpg'
  ];

  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: '不支持的文件格式' };
    }
    
    if (file.size > maxFileSize) {
      return { valid: false, error: '文件大小超过50MB限制' };
    }

    return { valid: true };
  };

  const processFiles = (fileList: FileList) => {
    const newFiles: FileItem[] = [];
    
    Array.from(fileList).forEach((file) => {
      const validation = validateFile(file);
      const fileItem: FileItem = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        status: validation.valid ? 'valid' : 'invalid',
        error: validation.error
      };
      
      newFiles.push(fileItem);
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      processFiles(fileList);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const fileList = e.dataTransfer.files;
    if (fileList) {
      processFiles(fileList);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const getFileTypeLabel = (file: File) => {
    switch (file.type) {
      case 'application/pdf':
        return 'PDF';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        return 'Word';
      case 'image/png':
        return 'PNG';
      case 'image/jpeg':
      case 'image/jpg':
        return 'JPG';
      default:
        return '未知';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validFiles = files.filter(f => f.status === 'valid');
  const hasInvalidFiles = files.some(f => f.status === 'invalid');

  const handleConfirm = () => {
    const validFileList = validFiles.map(f => f.file);
    if (validFileList.length > 0) {
      onConfirm(validFileList);
      // Reset state
      setFiles([]);
    }
  };

  const handleCancel = () => {
    setFiles([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <Upload className="h-4 w-4 text-white" />
            </div>
            上传资料
          </DialogTitle>
          <DialogDescription className="text-gray-600 leading-relaxed">
            支持上传 PDF、DOCX 或图片文件，AI 会自动抽取要求与参考内容
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer",
              isDragOver 
                ? "border-blue-400 bg-blue-50" 
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                <Upload className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  点击选择文件或拖拽到此处
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  支持 PDF、DOCX、PNG、JPG，最大 50MB
                </p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-900">
                已选择的文件 ({files.length})
              </h4>
              
              {files.map((fileItem) => (
                <div
                  key={fileItem.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    fileItem.status === 'valid' 
                      ? "border-green-200 bg-green-50" 
                      : "border-red-200 bg-red-50"
                  )}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      fileItem.status === 'valid' 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    )}>
                      {fileItem.status === 'valid' ? (
                        getFileIcon(fileItem.file)
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {fileItem.file.name}
                        </p>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {getFileTypeLabel(fileItem.file)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-600">
                          {formatFileSize(fileItem.file.size)}
                        </p>
                        {fileItem.status === 'valid' ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <span className="text-xs text-red-600">
                            {fileItem.error}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(fileItem.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Validation summary */}
          {files.length > 0 && (
            <div className="text-xs text-gray-600 space-y-1">
              {validFiles.length > 0 && (
                <p className="text-green-600">
                  ✓ {validFiles.length} 个文件准备就绪
                </p>
              )}
              {hasInvalidFiles && (
                <p className="text-red-600">
                  ✗ 部分文件格式不支持或过大
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={validFiles.length === 0}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            确认上传 ({validFiles.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;