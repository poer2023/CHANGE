import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Plus, 
  Upload,
  FileText,
  BookOpen,
  Quote,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Document } from '@/components/DocumentCard';
import { useToast } from '@/components/ui/use-toast';

// 使用相同的模拟数据
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Exploring the Role of Neural Networks in Natural Language Processing',
    authors: ['Bahr LS', 'Bock M', 'Liebscher D'],
    type: 'pdf',
    category: 'AI Research',
    citedBy: 89,
    publishYear: 2023,
    journal: 'Nature Science',
    openAccess: true,
    summary: 'Interactions between the ribosomal exit tunnel and the nascent peptide...',
    uploadDate: new Date('2024-01-15'),
    fileSize: '2.3 MB'
  },
  {
    id: '2',
    title: 'A Multiclassifier-based Near-Real-Time Face Detection System',
    authors: ['H. Wu', 'J. Zelek'],
    type: 'article',
    category: 'Computer Vision',
    citedBy: 45,
    publishYear: 2023,
    journal: 'International Journal of Robotics and Automation',
    summary: 'This paper presents a comprehensive approach to real-time face detection...',
    uploadDate: new Date('2024-01-10'),
    fileSize: '1.8 MB'
  },
  {
    id: '3',
    title: '深度学习在自然语言处理中的应用研究',
    authors: ['张三', '李四'],
    type: 'note',
    category: '研究笔记',
    summary: '本文档总结了深度学习技术在自然语言处理领域的最新进展...',
    uploadDate: new Date('2024-01-08'),
    fileSize: '0.5 MB'
  },
  {
    id: '4',
    title: 'Machine Learning Fundamentals Reference',
    authors: ['Various Authors'],
    type: 'reference',
    category: '参考资料',
    summary: '机器学习基础概念和算法的参考手册...',
    uploadDate: new Date('2024-01-05'),
    fileSize: '4.2 MB'
  },
  {
    id: '5',
    title: 'Climate Change Impact on Agricultural Systems',
    authors: ['Smith J', 'Johnson A', 'Brown K'],
    type: 'pdf',
    category: 'Environmental Science',
    citedBy: 156,
    publishYear: 2022,
    journal: 'Environmental Research Letters',
    openAccess: true,
    summary: 'A comprehensive analysis of how climate change affects agricultural productivity...',
    uploadDate: new Date('2024-01-01'),
    fileSize: '3.1 MB'
  }
];

type DocumentType = 'all' | 'pdf' | 'note' | 'reference' | 'article';

const documentTypes = [
  { value: 'all' as const, label: '全部', icon: FileText, count: 0 },
  { value: 'pdf' as const, label: 'PDF', icon: FileText, count: 0 },
  { value: 'note' as const, label: '笔记', icon: BookOpen, count: 0 },
  { value: 'reference' as const, label: '参考', icon: Quote, count: 0 },
  { value: 'article' as const, label: '文章', icon: FileText, count: 0 }
];

const getDocumentIcon = (type: Document['type']) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-4 w-4 text-red-600" />;
    case 'note':
      return <BookOpen className="h-4 w-4 text-blue-600" />;
    case 'reference':
      return <Quote className="h-4 w-4 text-green-600" />;
    case 'article':
      return <FileText className="h-4 w-4 text-purple-600" />;
    default:
      return <FileText className="h-4 w-4 text-gray-600" />;
  }
};

const KnowledgeLibrarySidebar: React.FC = () => {
  const [documents] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentType>('all');
  const { toast } = useToast();

  // 计算每种类型的文档数量
  const typeCounts = useMemo(() => {
    return {
      all: documents.length,
      pdf: documents.filter(d => d.type === 'pdf').length,
      note: documents.filter(d => d.type === 'note').length,
      reference: documents.filter(d => d.type === 'reference').length,
      article: documents.filter(d => d.type === 'article').length,
    };
  }, [documents]);

  // 过滤文档
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // 按类型过滤
    if (selectedType !== 'all') {
      filtered = filtered.filter(doc => doc.type === selectedType);
    }

    // 按搜索查询过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(query) ||
        doc.authors.some(author => author.toLowerCase().includes(query)) ||
        doc.summary?.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
  }, [documents, searchQuery, selectedType]);

  const handleAction = (action: string, docId: string) => {
    const doc = documents.find(d => d.id === docId);
    switch (action) {
      case 'view':
        toast({ title: "查看文档", description: `正在打开 ${doc?.title}` });
        break;
      case 'download':
        toast({ title: "下载文档", description: `正在下载 ${doc?.title}` });
        break;
      case 'delete':
        toast({ title: "删除文档", description: `已删除 ${doc?.title}` });
        break;
      case 'cite':
        toast({ title: "引用已复制", description: `${doc?.title} 的引用格式已复制到剪贴板` });
        break;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 搜索栏 */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="搜索文档..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-sm"
        />
      </div>

      {/* 快速操作 */}
      <div className="flex gap-2 mb-4">
        <Button size="sm" className="flex-1">
          <Plus className="h-4 w-4 mr-1" />
          新建
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          <Upload className="h-4 w-4 mr-1" />
          上传
        </Button>
      </div>

      {/* 文档类型过滤 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">分类</span>
        </div>
        <div className="space-y-1">
          {documentTypes.map((type) => {
            const Icon = type.icon;
            const count = typeCounts[type.value];
            return (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedType(type.value)}
                className="w-full justify-between text-xs h-8"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-3 w-3" />
                  {type.label}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>

      <Separator className="mb-4" />

      {/* 文档列表 */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            文档 ({filteredDocuments.length})
          </span>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="text-xs h-6 px-2"
            >
              清除
            </Button>
          )}
        </div>

        <ScrollArea className="h-full">
          <div className="space-y-2">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <Card key={doc.id} className="p-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2 mb-1">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-1 mb-1">
                        {doc.authors.join(', ')}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {doc.citedBy && (
                            <Badge variant="outline" className="text-xs px-1">
                              引用{doc.citedBy}
                            </Badge>
                          )}
                          {doc.openAccess && (
                            <Badge variant="outline" className="text-xs px-1 text-green-600">
                              开放
                            </Badge>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={() => handleAction('view', doc.id)}>
                              <Eye className="h-3 w-3 mr-2" />
                              查看
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('cite', doc.id)}>
                              <Quote className="h-3 w-3 mr-2" />
                              引用
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('download', doc.id)}>
                              <Download className="h-3 w-3 mr-2" />
                              下载
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAction('delete', doc.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-3 w-3 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">没有找到文档</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default KnowledgeLibrarySidebar;