import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Edit, 
  Eye, 
  Trash2, 
  Calendar,
  BookOpen,
  Newspaper,
  GraduationCap,
  Briefcase,
  Clock,
  MoreVertical,
  Copy
} from 'lucide-react';

// 文章状态类型
export type ArticleStatus = 'draft' | 'completed' | 'in-progress' | 'archived';

// 文章类型
export type ArticleType = 'essay' | 'research' | 'report' | 'thesis' | 'article' | 'other';

// 文章数据接口
export interface Article {
  id: string;
  title: string;
  type: ArticleType;
  status: ArticleStatus;
  wordCount: number;
  preview: string; // 前100字预览
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  estimatedReadTime?: number; // 预估阅读时间（分钟）
}

interface ArticleCardProps {
  article: Article;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  className?: string;
}

// 获取文章类型图标
const getArticleTypeIcon = (type: ArticleType) => {
  switch (type) {
    case 'essay':
      return <FileText className="h-5 w-5 text-blue-600" />;
    case 'research':
      return <BookOpen className="h-5 w-5 text-green-600" />;
    case 'report':
      return <Newspaper className="h-5 w-5 text-orange-600" />;
    case 'thesis':
      return <GraduationCap className="h-5 w-5 text-purple-600" />;
    case 'article':
      return <Briefcase className="h-5 w-5 text-indigo-600" />;
    case 'other':
    default:
      return <FileText className="h-5 w-5 text-gray-600" />;
  }
};

// 获取文章类型显示名称
const getArticleTypeName = (type: ArticleType) => {
  switch (type) {
    case 'essay':
      return '作文';
    case 'research':
      return '研究论文';
    case 'report':
      return '报告';
    case 'thesis':
      return '论文';
    case 'article':
      return '文章';
    case 'other':
    default:
      return '其他';
  }
};

// 获取状态徽章样式
const getStatusBadge = (status: ArticleStatus) => {
  switch (status) {
    case 'completed':
      return { variant: 'default' as const, text: '已完成', className: 'bg-green-100 text-green-800' };
    case 'in-progress':
      return { variant: 'secondary' as const, text: '进行中', className: 'bg-yellow-100 text-yellow-800' };
    case 'draft':
      return { variant: 'outline' as const, text: '草稿', className: 'bg-gray-100 text-gray-800' };
    case 'archived':
      return { variant: 'secondary' as const, text: '已归档', className: 'bg-slate-100 text-slate-800' };
    default:
      return { variant: 'outline' as const, text: '未知', className: 'bg-gray-100 text-gray-800' };
  }
};

// 格式化时间显示
const formatDate = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return '刚刚';
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);
    return `${days}天前`;
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

// 格式化字数
const formatWordCount = (count: number) => {
  if (count < 1000) {
    return `${count}字`;
  } else if (count < 10000) {
    return `${(count / 1000).toFixed(1)}k字`;
  } else {
    return `${(count / 10000).toFixed(1)}万字`;
  }
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  className
}) => {
  const statusBadge = getStatusBadge(article.status);
  
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 border-l-4 ${
      article.status === 'completed' ? 'border-l-green-500' :
      article.status === 'in-progress' ? 'border-l-yellow-500' :
      article.status === 'draft' ? 'border-l-gray-400' :
      'border-l-slate-400'
    } hover:border-l-blue-500 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              {getArticleTypeIcon(article.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 cursor-pointer transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span>{getArticleTypeName(article.type)}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 操作按钮 - 悬停时显示 */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onView(article.id)}
                title="查看文章"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onEdit(article.id)}
                title="编辑文章"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDuplicate && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onDuplicate(article.id)}
                title="复制文章"
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete(article.id)}
                title="删除文章"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-0">
        {/* 文章预览 */}
        {article.preview && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
            {article.preview}
          </p>
        )}

        {/* 标签 */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
              >
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between w-full">
          {/* 左侧信息 */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {/* 状态徽章 */}
            <Badge className={statusBadge.className} variant={statusBadge.variant}>
              {statusBadge.text}
            </Badge>
            
            {/* 字数统计 */}
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{formatWordCount(article.wordCount)}</span>
            </div>

            {/* 预估阅读时间 */}
            {article.estimatedReadTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{article.estimatedReadTime}分钟阅读</span>
              </div>
            )}
          </div>

          {/* 右侧主要操作按钮 */}
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700"
                onClick={() => onEdit(article.id)}
              >
                <Edit className="h-3 w-3 mr-1" />
                编辑
              </Button>
            )}
            {onView && (
              <Button
                variant="default"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onView(article.id)}
              >
                <Eye className="h-3 w-3 mr-1" />
                查看
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;