import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HomeSidebar from '@/components/Home/HomeSidebar';
import InlineSearch from '@/components/Home/InlineSearch';
import { 
  BookOpen, 
  Star, 
  Download, 
  ExternalLink, 
  Search,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';

interface LibraryItem {
  id: string;
  title: string;
  type: 'reference' | 'template' | 'example';
  category: string;
  description: string;
  author?: string;
  rating?: number;
  downloads?: number;
  updatedAt: string;
}

const LibraryPage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Mock library items
  const libraryItems: LibraryItem[] = [
    {
      id: '1',
      title: '学术论文标准模板',
      type: 'template',
      category: '论文模板',
      description: '符合国际期刊标准的学术论文模板，包含完整的章节结构和格式规范。',
      rating: 4.8,
      downloads: 1250,
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      title: '人工智能研究方法综述',
      type: 'reference',
      category: '参考文献',
      description: '最新的人工智能研究方法和趋势分析，涵盖深度学习、强化学习等前沿技术。',
      author: '张教授',
      rating: 4.9,
      downloads: 856,
      updatedAt: '2024-01-10'
    },
    {
      id: '3',
      title: '优秀毕业论文范例',
      type: 'example',
      category: '论文示例',
      description: '计算机科学专业优秀毕业论文示例，展示规范的写作结构和研究方法。',
      rating: 4.7,
      downloads: 432,
      updatedAt: '2024-01-08'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'template':
        return 'ready'; // Green
      case 'reference':
        return 'running'; // Indigo  
      case 'example':
        return 'draft'; // Slate
      default:
        return 'draft';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'template':
        return '模板';
      case 'reference':
        return '参考';
      case 'example':
        return '示例';
      default:
        return type;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <HomeSidebar />
        
        <SidebarInset className="flex-1">
          {/* Main content with surface-alt background */}
          <main className="min-h-screen px-6 md:px-8 py-6 bg-surface-alt">
            <div className="mx-auto max-w-[1200px] space-y-6">
              {/* Header section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-h1 text-text">
                    图书馆
                  </h1>
                  <p className="text-body text-text-muted mt-1">
                    学术资源和模板库
                  </p>
                </div>
                
                {/* Inline search */}
                <div className="flex-shrink-0">
                  <InlineSearch placeholder="搜索模板、参考资料…" />
                </div>
              </div>

              {/* Filters and view controls */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="size-4" />
                    筛选
                  </Button>
                  <Badge variant="secondary">全部 {libraryItems.length} 项</Badge>
                </div>
                
                <div className="flex items-center border border-[hsl(var(--border))] rounded-btn p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Library items */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {libraryItems.map((item) => (
                    <Card key={item.id} className="group cursor-pointer bg-surface border-[hsl(var(--border))] hover:border-[color-mix(in_oklab,hsl(var(--brand-500))_25%,hsl(var(--border)))]">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-surface-alt border border-[hsl(var(--border))] flex items-center justify-center relative">
                              <div className="absolute inset-[1px] rounded-full bg-gradient-to-br from-white/12 to-transparent" />
                              <BookOpen className="size-4 text-text-muted relative z-10" />
                            </div>
                            <Badge variant={getTypeColor(item.type)} className="text-xs">
                              {getTypeLabel(item.type)}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ExternalLink className="size-3" />
                          </Button>
                        </div>
                        
                        <div>
                          <CardTitle className="text-base font-semibold text-text line-clamp-2">
                            {item.title}
                          </CardTitle>
                          <CardDescription className="text-body text-text-muted mt-1">
                            {item.category}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-body text-text-muted line-clamp-3">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-text-muted">
                          <div className="flex items-center gap-4">
                            {item.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="size-3 fill-current text-amber-500" />
                                <span>{item.rating}</span>
                              </div>
                            )}
                            {item.downloads && (
                              <div className="flex items-center gap-1">
                                <Download className="size-3" />
                                <span>{item.downloads.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                          <span>{new Date(item.updatedAt).toLocaleDateString('zh-CN')}</span>
                        </div>
                        
                        <Button className="w-full">
                          下载使用
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // List view - similar to RecentDocuments table
                <Card>
                  <div className="p-4">
                    <div className="space-y-3">
                      {libraryItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-3 border-b border-[hsl(var(--border))] last:border-b-0">
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="size-8 rounded-full bg-surface-alt border border-[hsl(var(--border))] flex items-center justify-center">
                              <BookOpen className="size-4 text-text-muted" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-text truncate">{item.title}</h3>
                                <Badge variant={getTypeColor(item.type)} className="text-xs flex-shrink-0">
                                  {getTypeLabel(item.type)}
                                </Badge>
                              </div>
                              <p className="text-body text-text-muted line-clamp-1">{item.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 ml-4">
                            <div className="text-xs text-text-muted text-right">
                              {item.rating && (
                                <div className="flex items-center gap-1 mb-1">
                                  <Star className="size-3 fill-current text-amber-500" />
                                  <span>{item.rating}</span>
                                </div>
                              )}
                              <div>{new Date(item.updatedAt).toLocaleDateString('zh-CN')}</div>
                            </div>
                            <Button size="sm">
                              下载
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default LibraryPage;