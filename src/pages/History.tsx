import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Search, 
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Upload
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppShell from '@/components/AppShell';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { historyData } from '@/data/historyData';
import type { Article } from '@/data/historyData';

const History: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤文章
  const filteredArticles = useMemo(() => {
    if (!searchQuery) return historyData;
    
    const query = searchQuery.toLowerCase();
    return historyData.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.abstract.toLowerCase().includes(query) ||
      article.type.toLowerCase().includes(query) ||
      article.metadata.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleNewDoc = () => {
    navigate('/form');
  };

  const handleUploadFile = () => {
    toast({
      title: "文件上传",
      description: "文件上传功能正在开发中...",
    });
  };

  const handleViewArticle = (articleId: string) => {
    navigate(`/essay-editor/${articleId}`);
  };

  const handleDownload = (article: Article) => {
    toast({
      title: "下载文档",
      description: `正在下载: ${article.title}`,
    });
  };

  const handleDelete = (article: Article) => {
    toast({
      title: "删除文档",
      description: `已删除: ${article.title}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">已完成</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">进行中</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">草稿</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <AppShell>
      <div className="min-h-[calc(100vh-120px)] bg-background flex flex-col rounded-xl border overflow-hidden">
          {/* 顶部标题栏 */}
          <div className="border-b bg-background px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-xl font-semibold">历史记录</h1>
                  <span className="text-sm text-muted-foreground">{filteredArticles.length} 篇文档</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleUploadFile}>
                  <Upload className="h-4 w-4 mr-2" />
                  上传文件
                </Button>
                <Button onClick={handleNewDoc}>
                  <Plus className="h-4 w-4 mr-2" />
                  新建文档
                </Button>
              </div>
            </div>
          </div>

          {/* 搜索栏 */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">
                全部文档 <span className="text-muted-foreground">{filteredArticles.length}</span>
              </h2>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索文档..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* 文档列表 */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <Card 
                      key={article.id} 
                      className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                      onClick={() => handleViewArticle(article.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          {getStatusBadge(article.status)}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewArticle(article.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              查看
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(article)}>
                              <Download className="h-4 w-4 mr-2" />
                              下载
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(article)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight">
                        {article.title}
                      </h3>
                      
                      <p className="text-xs text-muted-foreground line-clamp-3 mb-4">
                        {article.abstract}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>{article.metadata.wordCount} 字</span>
                          <span>•</span>
                          <span>{article.type}</span>
                        </div>
                        <span>{formatDate(article.updatedAt)}</span>
                      </div>
                      
                      {article.metadata.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {article.metadata.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {article.metadata.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{article.metadata.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    {searchQuery ? '未找到匹配的文档' : '还没有文档'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? '尝试调整搜索词或清除搜索' 
                      : '开始创建您的第一篇文档'
                    }
                  </p>
                  {!searchQuery && (
                    <div className="flex items-center justify-center gap-3">
                      <Button onClick={handleNewDoc}>
                        <Plus className="h-4 w-4 mr-2" />
                        新建文档
                      </Button>
                      <Button variant="outline" onClick={handleUploadFile}>
                        <Upload className="h-4 w-4 mr-2" />
                        上传文件
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
      </div>
    </AppShell>
  );
};

export default History;