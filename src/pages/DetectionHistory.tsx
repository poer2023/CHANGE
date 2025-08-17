import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Search, 
  Calendar,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  Bot,
  Shield,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DetectionHistoryItem {
  id: string;
  name: string;
  type: 'ai' | 'plagiarism';
  timestamp: string;
  result: {
    score: number;
    verdict: string;
    status: 'completed' | 'failed' | 'processing';
  };
  fileSize?: number;
  charCount?: number;
}

const mockHistory: DetectionHistoryItem[] = [
  {
    id: '1',
    name: 'research_paper.pdf',
    type: 'ai',
    timestamp: '2024-08-17 14:30:25',
    result: {
      score: 87.3,
      verdict: '高疑似AI生成',
      status: 'completed'
    },
    fileSize: 245760,
    charCount: 8420
  },
  {
    id: '2',
    name: 'essay_draft.docx',
    type: 'plagiarism',
    timestamp: '2024-08-17 13:15:12',
    result: {
      score: 24.1,
      verdict: '中风险',
      status: 'completed'
    },
    fileSize: 156872,
    charCount: 5630
  },
  {
    id: '3',
    name: '粘贴文本_论文草稿',
    type: 'ai',
    timestamp: '2024-08-17 10:45:08',
    result: {
      score: 45.2,
      verdict: '可能为人类创作',
      status: 'completed'
    },
    charCount: 3240
  },
  {
    id: '4',
    name: 'academic_article.txt',
    type: 'plagiarism',
    timestamp: '2024-08-16 16:20:33',
    result: {
      score: 8.7,
      verdict: '低风险',
      status: 'completed'
    },
    fileSize: 98432,
    charCount: 4120
  },
  {
    id: '5',
    name: 'thesis_chapter.pdf',
    type: 'ai',
    timestamp: '2024-08-16 14:10:15',
    result: {
      score: 0,
      verdict: '检测失败',
      status: 'failed'
    },
    fileSize: 512000,
    charCount: 12540
  }
];

const DetectionHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'ai' | 'plagiarism'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'failed'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const filteredHistory = mockHistory.filter(item => {
    // 搜索过滤
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // 类型过滤
    if (typeFilter !== 'all' && item.type !== typeFilter) {
      return false;
    }
    
    // 状态过滤
    if (statusFilter !== 'all' && item.result.status !== statusFilter) {
      return false;
    }
    
    // 时间过滤
    if (timeFilter !== 'all') {
      const itemDate = new Date(item.timestamp);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (timeFilter) {
        case 'today':
          if (diffDays > 0) return false;
          break;
        case 'week':
          if (diffDays > 7) return false;
          break;
        case 'month':
          if (diffDays > 30) return false;
          break;
      }
    }
    
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">已完成</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">失败</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">处理中</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'ai':
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <Bot className="h-3 w-3 mr-1" />
            AI检测
          </Badge>
        );
      case 'plagiarism':
        return (
          <Badge variant="outline" className="text-purple-600 border-purple-200">
            <Shield className="h-3 w-3 mr-1" />
            抄袭检测
          </Badge>
        );
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleAction = (action: string, item: DetectionHistoryItem) => {
    switch (action) {
      case 'view':
        toast({
          title: "查看详情",
          description: `正在查看: ${item.name}`,
        });
        break;
      case 'retest':
        toast({
          title: "重新检测",
          description: `正在重新检测: ${item.name}`,
        });
        break;
      case 'download':
        toast({
          title: "下载报告",
          description: `正在下载: ${item.name} 的检测报告`,
        });
        break;
      case 'delete':
        toast({
          title: "删除记录",
          description: `已删除: ${item.name}`,
          variant: "destructive"
        });
        break;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto p-6" style={{ maxWidth: '960px' }}>
            {/* 顶部栏 */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">检测历史</h1>
              <p className="text-gray-600">查看和管理您的AI检测与抄袭检测记录</p>
            </div>

            <div className="space-y-6">
              {/* 筛选器 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    筛选条件
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">搜索</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="搜索文件名..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">检测类型</label>
                      <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有类型</SelectItem>
                          <SelectItem value="ai">AI检测</SelectItem>
                          <SelectItem value="plagiarism">抄袭检测</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">状态</label>
                      <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有状态</SelectItem>
                          <SelectItem value="completed">已完成</SelectItem>
                          <SelectItem value="failed">失败</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">时间范围</label>
                      <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择时间" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有时间</SelectItem>
                          <SelectItem value="today">今天</SelectItem>
                          <SelectItem value="week">最近一周</SelectItem>
                          <SelectItem value="month">最近一月</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">总检测次数</p>
                        <p className="text-2xl font-bold">{mockHistory.length}</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">AI检测</p>
                        <p className="text-2xl font-bold">{mockHistory.filter(i => i.type === 'ai').length}</p>
                      </div>
                      <Bot className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">抄袭检测</p>
                        <p className="text-2xl font-bold">{mockHistory.filter(i => i.type === 'plagiarism').length}</p>
                      </div>
                      <Shield className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 历史记录列表 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>检测记录</span>
                    <Badge variant="outline">{filteredHistory.length} 条记录</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">暂无记录</h3>
                      <p className="text-gray-500">
                        {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' || timeFilter !== 'all'
                          ? '没有找到符合条件的记录'
                          : '还没有检测记录，开始您的第一次检测吧'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredHistory.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-medium">{item.name}</h3>
                                {getTypeBadge(item.type)}
                                {getStatusBadge(item.result.status)}
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                                <div>
                                  <span className="font-medium">检测时间:</span>
                                  <p>{item.timestamp}</p>
                                </div>
                                <div>
                                  <span className="font-medium">结果:</span>
                                  <p className={
                                    item.result.status === 'completed' 
                                      ? item.type === 'ai' 
                                        ? (item.result.score > 70 ? 'text-red-600' : item.result.score > 40 ? 'text-yellow-600' : 'text-green-600')
                                        : (item.result.score > 30 ? 'text-red-600' : item.result.score > 10 ? 'text-yellow-600' : 'text-green-600')
                                      : 'text-gray-500'
                                  }>
                                    {item.result.status === 'completed' 
                                      ? `${item.result.score}% - ${item.result.verdict}`
                                      : item.result.verdict
                                    }
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium">字符数:</span>
                                  <p>{item.charCount?.toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="font-medium">文件大小:</span>
                                  <p>{item.fileSize ? formatFileSize(item.fileSize) : '文本输入'}</p>
                                </div>
                              </div>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleAction('view', item)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  查看详情
                                </DropdownMenuItem>
                                {item.result.status === 'completed' && (
                                  <DropdownMenuItem onClick={() => handleAction('retest', item)}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    重新检测
                                  </DropdownMenuItem>
                                )}
                                {item.result.status === 'completed' && (
                                  <DropdownMenuItem onClick={() => handleAction('download', item)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    下载报告
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  onClick={() => handleAction('delete', item)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  删除记录
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DetectionHistory;