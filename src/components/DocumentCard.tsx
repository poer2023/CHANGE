import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Quote,
  Calendar,
  User
} from 'lucide-react';

export interface Document {
  id: string;
  title: string;
  authors: string[];
  type: 'pdf' | 'note' | 'reference' | 'article';
  category: string;
  citedBy?: number;
  publishYear?: number;
  journal?: string;
  openAccess?: boolean;
  summary?: string;
  uploadDate: Date;
  fileSize?: string;
}

interface DocumentCardProps {
  document: Document;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCite?: (id: string) => void;
  onDownload?: (id: string) => void;
}

const getDocumentIcon = (type: Document['type']) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-600" />;
    case 'note':
      return <FileText className="h-5 w-5 text-blue-600" />;
    case 'reference':
      return <FileText className="h-5 w-5 text-green-600" />;
    case 'article':
      return <FileText className="h-5 w-5 text-purple-600" />;
    default:
      return <FileText className="h-5 w-5 text-gray-600" />;
  }
};

const getTypeColor = (type: Document['type']) => {
  switch (type) {
    case 'pdf':
      return 'bg-red-100 text-red-800';
    case 'note':
      return 'bg-blue-100 text-blue-800';
    case 'reference':
      return 'bg-green-100 text-green-800';
    case 'article':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onDelete,
  onCite,
  onDownload
}) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getDocumentIcon(document.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-blue-600 cursor-pointer">
              {document.title}
            </h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onView && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onView(document.id)}
                  title="查看文档"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onDownload(document.id)}
                  title="下载文档"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  onClick={() => onDelete(document.id)}
                  title="删除文档"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
            <User className="h-3 w-3" />
            <span className="truncate">{document.authors.join(', ')}</span>
          </div>

          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            {document.citedBy && (
              <div className="flex items-center gap-1">
                <Quote className="h-3 w-3" />
                <span>被引用 {document.citedBy} 次</span>
              </div>
            )}
            {document.publishYear && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{document.publishYear}</span>
              </div>
            )}
            {document.journal && (
              <span className="truncate">{document.journal}</span>
            )}
          </div>

          {document.summary && (
            <p className="text-xs text-gray-600 mt-2 line-clamp-2">
              {document.summary}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`text-xs ${getTypeColor(document.type)}`}>
                {document.type.toUpperCase()}
              </Badge>
              {document.openAccess && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                  开放获取
                </Badge>
              )}
              {document.fileSize && (
                <span className="text-xs text-gray-500">{document.fileSize}</span>
              )}
            </div>

            {onCite && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onCite(document.id)}
              >
                <Quote className="h-3 w-3 mr-1" />
                引用
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DocumentCard;