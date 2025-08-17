import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, FileText, Database } from "lucide-react";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  type: 'note' | 'reference' | 'template';
}

const quickKnowledge: KnowledgeItem[] = [
  {
    id: '1',
    title: '引用格式',
    content: 'APA格式：作者(年份)。标题。期刊名，卷(期)，页码。',
    tags: ['引用', 'APA'],
    type: 'reference'
  },
  {
    id: '2',
    title: '论文结构',
    content: '摘要 → 引言 → 文献综述 → 方法 → 结果 → 讨论 → 结论',
    tags: ['结构', '模板'],
    type: 'template'
  },
  {
    id: '3',
    title: '写作技巧',
    content: '使用主动语态，避免冗余词汇，确保逻辑清晰。',
    tags: ['技巧', '写作'],
    type: 'note'
  }
];

interface KnowledgePanelProps {
  onInsert?: (content: string) => void;
}

export default function KnowledgePanel({ onInsert }: KnowledgePanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredKnowledge = quickKnowledge.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInsert = (content: string) => {
    if (onInsert) {
      onInsert(content);
    }
    setIsDialogOpen(false);
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Database className="h-4 w-4" />
          知识库
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            知识库
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索知识库..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {filteredKnowledge.map((item) => (
                <Card key={item.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getTypeColor(item.type)}`}
                      >
                        {getTypeLabel(item.type)}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleInsert(item.content)}
                      className="text-xs"
                    >
                      插入
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
              
              {filteredKnowledge.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>没有找到相关知识</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              添加新知识
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
            >
              关闭
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}