import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  Upload,
  BookOpen,
  FileText,
  Quote,
  Settings,
  Search,
  Plus,
  FolderPlus,
  MessageCircle,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Copy
} from 'lucide-react';
import AIChat from '@/components/AIChat';
import DocumentUpload from '@/components/DocumentUpload';
import AppShell from '@/components/AppShell';
import ResearchAssistantPanel from '@/components/ResearchAssistantPanel';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 文件夹类型
type Folder = {
  id: string;
  name: string;
  count: number;
  color: string;
};

// 文档类型
type Document = {
  id: string;
  title: string;
  authors: string[];
  source: string;
  year: number;
  abstract: string;
  category: string;
  tags: string[];
  fileType: 'pdf' | 'doc' | 'note' | 'reference';
  citedBy?: number;
  openAccess?: boolean;
};

// 模拟数据
const mockFolders: Folder[] = [
  { id: 'all', name: 'All', count: 7, color: 'bg-blue-500' },
  { id: 'uncategorized', name: 'Uncategorized', count: 3, color: 'bg-gray-500' },
  { id: 'ai-research', name: 'AI Research', count: 2, color: 'bg-purple-500' },
  { id: 'medical', name: 'Medical', count: 2, color: 'bg-green-500' },
];

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'PRECISION AGRICULTURE AND PIG FARMING.',
    authors: ['PI MIRCEA', 'BF DANIEL', 'et al.'],
    source: 'Agricultural ...',
    year: 2024,
    abstract: 'Abstract: Precision Agriculture in pig farming is about ..., precision livestock farming technologies, smart pig farming, using ... neural network, and vision-based Artificial Intelligence – among ...',
    category: 'Agriculture',
    tags: ['Agriculture', 'AI', 'Farming'],
    fileType: 'pdf',
    citedBy: 15
  },
  {
    id: '2',
    title: 'Application Prospect of Blockchain in Medical Industry',
    authors: ['Huang Jianhua', 'Jiang Yahui', 'Li Zhongcheng', 'and Fan Li'],
    source: 'JOURNAL OF MEDICAL INFORMATICS',
    year: 2018,
    abstract: 'The paper introduces the concept of blockchain and its impact on the development of medical industry, solves problems including medical data management, sharing and privacy based on decentralization, non tampering and traceability of blockchain, points out problems and ...',
    category: 'Medical',
    tags: ['Blockchain', 'Medical', 'Healthcare'],
    fileType: 'pdf',
    citedBy: 89,
    openAccess: true
  },
  {
    id: '3',
    title: 'Design of Standard System for Artificial Intelligence Medical Device',
    authors: ['Wang Hao', 'Tang Qiaohong', 'Hao Ye', 'Meng Xiangfeng', 'Li Jiage', 'and ...'],
    source: 'HUIZHI 2021.48',
    year: 2021,
    abstract: 'Objective To analyze the need for quality evaluation of artificial intelligence AI medical device and design the standard system. Methods This artical conducted literature study on the update of regulation policy and standardization of AI medical device in China ...',
    category: 'Medical AI',
    tags: ['AI', 'Medical Device', 'Standards'],
    fileType: 'pdf',
    citedBy: 34
  },
  {
    id: '4',
    title: 'Relationship between urban heat island and landscape patterns: From city size and landscape composition to spatial configuration',
    authors: ['Liu Yanxu', 'Peng Jian', 'and Wang Yanglin'],
    source: 'Landscape and Urban Planning',
    year: 2022,
    abstract: 'Urban heat island (UHI) effect has become a significant environmental issue in urban areas. This study analyzes the relationship between UHI intensity and landscape patterns ...',
    category: 'Environmental',
    tags: ['Urban Planning', 'Environment', 'Heat Island'],
    fileType: 'pdf',
    citedBy: 156
  },
  {
    id: '5',
    title: '人工智能决策的道德缺失效应及其机制',
    authors: ['胡小勇', '李娜娜', '王雷雷', 'and 鄢岩'],
    source: '科学通报',
    year: 2023,
    abstract: '人工智能技术在决策过程中的应用越来越广泛，但其道德缺失问题也日益凸显。本研究探讨了AI决策中的道德缺失效应及其产生机制...',
    category: '伦理学',
    tags: ['人工智能', '伦理', '决策'],
    fileType: 'pdf',
    citedBy: 23
  }
];

const KnowledgeBase: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const { toast } = useToast();

  // 过滤文档
  const filteredDocuments = useMemo(() => {
    let filtered = mockDocuments;

    if (selectedFolder !== 'all') {
      // 这里可以根据folder实现真正的过滤逻辑
      filtered = mockDocuments.filter(doc => 
        selectedFolder === 'uncategorized' ? !doc.category :
        doc.category.toLowerCase().includes(selectedFolder.replace('-', ' '))
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(query) ||
        doc.authors.some(author => author.toLowerCase().includes(query)) ||
        doc.abstract.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [selectedFolder, searchQuery]);

  const handleUpload = (files: File[]) => {
    toast({
      title: "上传成功",
      description: `${files.length} 个文件已添加到知识库`,
    });
    setShowUpload(false);
  };

  const handleDocumentAction = (action: string, docId: string) => {
    const doc = mockDocuments.find(d => d.id === docId);
    switch (action) {
      case 'view':
        toast({ title: "预览文档", description: `正在预览: ${doc?.title}` });
        break;
      case 'edit':
        toast({ title: "编辑文档", description: `正在编辑: ${doc?.title}` });
        break;
      case 'download':
        toast({ title: "下载文档", description: `正在下载: ${doc?.title}` });
        break;
      case 'delete':
        toast({ title: "删除文档", description: `已删除: ${doc?.title}` });
        break;
      case 'cite':
        toast({ title: "复制引用", description: "引用格式已复制到剪贴板" });
        break;
    }
  };

  return (
    <AppShell rightRail={<ResearchAssistantPanel />}>
      <div className="h-[calc(100vh-120px)] bg-background flex rounded-xl border overflow-hidden">
        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col min-w-0">
            {/* 顶部标题栏 */}
            <div className="border-b bg-background px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-blue-600" />
                  <div>
                    <h1 className="text-xl font-semibold">Library - All sources</h1>
                    <span className="text-sm text-gray-500">{filteredDocuments.length}</span>
                  </div>
                </div>
                <Button onClick={() => setShowUpload(true)} className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sources
                </Button>
              </div>
            </div>

            {/* 文件夹标签 */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center gap-4 mb-4">
                <Button variant="outline" size="sm">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New folder
                </Button>
                {mockFolders.map((folder) => (
                  <Button
                    key={folder.id}
                    variant={selectedFolder === folder.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFolder(folder.id)}
                    className="flex items-center gap-2"
                  >
                    <div className={`w-3 h-3 rounded ${folder.color}`} />
                    {folder.name}
                    <Badge variant="secondary" className="ml-1">
                      {folder.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* 上传组件 */}
            {showUpload && (
              <div className="px-6 py-4 border-b bg-gray-50">
                <DocumentUpload onUpload={handleUpload} />
              </div>
            )}

            {/* 文档标题和搜索 */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">
                  All <span className="text-gray-500">{filteredDocuments.length}</span>
                </h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 文档列表 */}
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          {doc.openAccess && (
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              Open Access
                            </Badge>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDocumentAction('view', doc.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDocumentAction('edit', doc.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDocumentAction('download', doc.id)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDocumentAction('cite', doc.id)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Cite
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDocumentAction('delete', doc.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight">
                        {doc.title}
                      </h3>
                      
                      <div className="text-xs text-gray-600 mb-2">
                        <div className="mb-1">{doc.authors.join(', ')}</div>
                        <div>Source: {doc.source}</div>
                        <div>Year: {doc.year}</div>
                      </div>
                      
                      <p className="text-xs text-gray-500 line-clamp-3 mb-3">
                        {doc.abstract}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {doc.citedBy && (
                          <span className="text-gray-500">
                            {doc.citedBy} citations
                          </span>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
                
                {filteredDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No documents found</h3>
                    <p className="text-gray-500">
                      {searchQuery 
                        ? 'Try adjusting your search terms' 
                        : 'Start by adding your first document'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
    </AppShell>
  );
};

export default KnowledgeBase;