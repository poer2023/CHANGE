import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { FileText, Calendar, Type, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { AssignmentType, CitationStyle } from '@/types/writing-flow';

interface DocumentHeaderProps {
  title: string;
  docType: AssignmentType;
  createdAt: string;
  style: CitationStyle;
  status: 'queued' | 'generating' | 'completed';
}

const docTypeLabels: Record<AssignmentType, string> = {
  paper: '学术论文',
  report: '研究报告',
  review: '文献综述',
  comment: '评论文章'
};

const statusLabels = {
  queued: { label: '队列中', icon: Clock, className: 'bg-gray-100 text-gray-700' },
  generating: { label: '生成中', icon: AlertCircle, className: 'bg-blue-100 text-blue-700' },
  completed: { label: '已完成', icon: CheckCircle, className: 'bg-green-100 text-green-700' }
};

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  title,
  docType,
  createdAt,
  style,
  status
}) => {
  const statusConfig = statusLabels[status];
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="rounded-2xl border border-[#EEF0F4] p-6 md:p-8" style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Document Title */}
          <div className="flex items-center gap-3 mb-3">
            <FileText className="h-6 w-6 text-[#6E5BFF] flex-shrink-0" />
            <h1 className="text-2xl md:text-3xl font-semibold text-[#2A3241] leading-tight">
              {title}
            </h1>
          </div>

          {/* Document Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#5B667A]">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span>{docTypeLabels[docType]}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(createdAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            
            <Badge variant="outline" className="text-xs">
              {style} 引用格式
            </Badge>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          <Badge className={`${statusConfig.className} gap-2 px-3 py-1.5`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {statusConfig.label}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default DocumentHeader;