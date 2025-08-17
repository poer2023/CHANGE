import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

interface DocumentUploadProps {
  onUpload?: (files: File[]) => void;
  className?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUpload, className = '' }) => {
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const acceptedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const simulateUpload = useCallback((uploadFile: UploadFile) => {
    const interval = setInterval(() => {
      setUploads(prev => 
        prev.map(upload => {
          if (upload.id === uploadFile.id) {
            const newProgress = Math.min(upload.progress + Math.random() * 20, 100);
            if (newProgress >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setUploads(prev => prev.filter(u => u.id !== uploadFile.id));
                toast({
                  title: "上传成功",
                  description: `${uploadFile.file.name} 已成功上传到知识库`,
                });
              }, 1000);
              return { ...upload, progress: 100, status: 'completed' as const };
            }
            return { ...upload, progress: newProgress };
          }
          return upload;
        })
      );
    }, 200);
  }, [toast]);

  const handleFiles = useCallback((files: FileList) => {
    const validFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      if (acceptedTypes.includes(file.type)) {
        validFiles.push(file);
        const uploadFile: UploadFile = {
          id: Date.now().toString() + Math.random(),
          file,
          progress: 0,
          status: 'uploading'
        };
        setUploads(prev => [...prev, uploadFile]);
        simulateUpload(uploadFile);
      } else {
        toast({
          title: "文件格式不支持",
          description: `${file.name} 的格式不受支持。请上传 PDF、DOC、DOCX 或 TXT 文件。`,
          variant: "destructive"
        });
      }
    });

    if (validFiles.length > 0 && onUpload) {
      onUpload(validFiles);
    }
  }, [acceptedTypes, onUpload, simulateUpload, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeUpload = useCallback((id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  }, []);

  return (
    <div className={className}>
      <Card 
        className={`border-2 border-dashed transition-colors duration-200 ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="p-8 text-center">
          <Upload className={`mx-auto h-12 w-12 mb-4 ${
            isDragOver ? 'text-blue-500' : 'text-gray-400'
          }`} />
          <h3 className="text-lg font-medium mb-2">上传研究文档</h3>
          <p className="text-gray-600 mb-4">
            拖拽文件到此处，或点击选择文件
          </p>
          <Button variant="outline" className="mb-2">
            <label htmlFor="file-upload" className="cursor-pointer">
              选择文件
            </label>
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={handleFileInput}
          />
          <p className="text-sm text-gray-500">
            支持 PDF, DOC, DOCX, TXT 格式
          </p>
        </div>
      </Card>

      {uploads.length > 0 && (
        <div className="mt-4 space-y-3">
          {uploads.map(upload => (
            <Card key={upload.id} className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {upload.file.name}
                    </p>
                    <div className="flex items-center gap-2">
                      {upload.status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => removeUpload(upload.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={upload.progress} className="flex-1" />
                    <span className="text-xs text-gray-500 w-12">
                      {Math.round(upload.progress)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;