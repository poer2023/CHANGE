import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, FileText, Calendar, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  type: 'note' | 'reference' | 'template';
}

const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: '1',
    title: '学术写作规范',
    content: '学术写作应遵循客观、严谨、准确的原则。引用格式需要规范，避免抄袭...',
    tags: ['写作规范', '学术'],
    createdAt: '2024-01-15',
    type: 'reference'
  },
  {
    id: '2',
    title: '论文结构模板',
    content: '标准论文结构：摘要、引言、文献综述、研究方法、结果分析、结论...',
    tags: ['模板', '结构'],
    createdAt: '2024-01-14',
    type: 'template'
  },
  {
    id: '3',
    title: '引用格式指南',
    content: 'APA格式要求：作者姓名(年份)。标题。期刊名，卷(期)，页码...',
    tags: ['引用', 'APA', '格式'],
    createdAt: '2024-01-13',
    type: 'reference'
  }
];

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [items] = useState<KnowledgeItem[]>(mockKnowledgeItems);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddKnowledge = () => {
    toast({
      title: "功能开发中",
      description: "知识库添加功能正在开发中",
    });
  };

  const handleItemClick = (item: KnowledgeItem) => {
    setSelectedItem(item);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'note': return 'bg-blue-100 text-blue-800';
      case 'reference': return 'bg-green-100 text-green-800';
      case 'template': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'note': return '笔记';
      case 'reference': return '参考';
      case 'template': return '模板';
      default: return '其他';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/form')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
          <h1 className="text-2xl font-bold">知识库</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：知识项目列表 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">知识库</CardTitle>
                  <Button size="sm" onClick={handleAddKnowledge} className="gap-2">
                    <Plus className="h-4 w-4" />
                    添加
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索知识库..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 p-3">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                          selectedItem?.id === item.id ? 'bg-accent border-primary' : ''
                        }`}
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{item.title}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {item.content}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getTypeColor(item.type)}`}
                          >
                            {getTypeLabel(item.type)}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {item.createdAt}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：知识详情 */}
          <div className="lg:col-span-2">
            {selectedItem ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedItem.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="secondary"
                          className={getTypeColor(selectedItem.type)}
                        >
                          {getTypeLabel(selectedItem.type)}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {selectedItem.createdAt}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {selectedItem.content}
                    </p>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">标签</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-[400px]">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>选择一个知识项目查看详情</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}