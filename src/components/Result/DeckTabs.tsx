import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Bot, 
  Activity,
  CheckCircle,
  Clock,
  Download,
  BarChart,
  BookOpen,
  FileText,
  AlertTriangle,
  Share2,
  MessageSquare,
  Edit3,
  Search,
  Zap,
  Users,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DeckTabsProps } from '@/state/types';
import { useApp } from '@/state/AppContext';

const DeckTabs: React.FC<DeckTabsProps> = ({ disabled, docId }) => {
  const { track, trackTyped } = useApp();
  const [activeTab, setActiveTab] = useState('deliverables');

  const handleTabChange = (tab: string) => {
    const previousTab = activeTab;
    setActiveTab(tab);
    
    trackTyped('tab_change', {
      tabGroup: 'deck_tabs',
      previousTab,
      newTab: tab,
      context: 'result_page'
    }, 'user_action', 'ui_interaction');
  };

  // Deliverables Cards
  const DeliverablesGrid = () => {
    const deliverables = [
      {
        id: 'quality',
        title: '质量评分',
        description: '综合评价文档质量',
        icon: BarChart,
        status: 'ready' as const,
        value: '85/100',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        id: 'process',
        title: '流程文档',
        description: 'PDF 摘要报告',
        icon: FileText,
        status: 'ready' as const,
        value: '2.3 MB',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        id: 'references',
        title: '文献列表',
        description: 'CSV/BIB/RIS 格式',
        icon: BookOpen,
        status: 'ready' as const,
        value: '24 条',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      {
        id: 'timeline',
        title: '时间线',
        description: '操作审计日志',
        icon: Activity,
        status: 'ready' as const,
        value: 'JSON',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      },
      {
        id: 'viva',
        title: '答辩卡',
        description: 'PPT + 答辩要点',
        icon: Users,
        status: disabled ? 'locked' : 'ready' as const,
        value: 'PDF',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50'
      },
      {
        id: 'assets',
        title: '媒体资源',
        description: '图表和素材包',
        icon: Package,
        status: disabled ? 'locked' : 'ready' as const,
        value: 'ZIP',
        color: 'text-teal-600',
        bgColor: 'bg-teal-50'
      },
      {
        id: 'share',
        title: '分享链接',
        description: '7天只读访问',
        icon: Share2,
        status: disabled ? 'locked' : 'ready' as const,
        value: 'URL',
        color: 'text-pink-600',
        bgColor: 'bg-pink-50'
      },
      {
        id: 'bundle',
        title: '完整包',
        description: '全部文件打包',
        icon: Download,
        status: disabled ? 'locked' : 'generating' as const,
        value: '进行中',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deliverables.map((item) => {
          const IconComponent = item.icon;
          const isLocked = item.status === 'locked';
          const isGenerating = item.status === 'generating';
          
          return (
            <Card 
              key={item.id}
              className={cn(
                "transition-all duration-200",
                isLocked ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg cursor-pointer"
              )}
              onClick={() => {
                if (!isLocked) {
                  trackTyped('download_click', {
                    docId,
                    format: item.id,
                    fileSize: 150000, // Mock file size
                    source: 'deck_tabs'
                  }, 'export', 'download');
                }
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.bgColor)}>
                      <IconComponent className={cn("h-4 w-4", item.color)} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  {isLocked && (
                    <Badge variant="secondary" className="text-xs">
                      需解锁
                    </Badge>
                  )}
                  
                  {isGenerating && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  
                  {item.status === 'ready' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {isGenerating ? '生成中...' : item.value}
                  </span>
                  {!isLocked && !isGenerating && (
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      下载
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Assistant Cards
  const AssistantGrid = () => {
    const assistantCards = [
      {
        id: 'chat',
        title: 'AI 助手',
        description: '智能问答和编辑建议',
        icon: Bot,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        content: (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                您可以询问关于文档的任何问题，或请求编辑建议。
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                <MessageSquare className="h-3 w-3 mr-1" />
                开始对话
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                <Edit3 className="h-3 w-3 mr-1" />
                编辑建议
              </Button>
            </div>
          </div>
        )
      },
      {
        id: 'search',
        title: '文档搜索',
        description: '快速定位内容和引用',
        icon: Search,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        content: (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                搜索文档中的特定内容、引用或关键词。
              </p>
            </div>
            <Button size="sm" variant="outline" className="text-xs w-full">
              <Search className="h-3 w-3 mr-1" />
              开始搜索
            </Button>
          </div>
        )
      },
      {
        id: 'enhancement',
        title: '智能增强',
        description: '自动优化和格式化',
        icon: Zap,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        content: (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                使用 AI 自动改进文档结构、语言和格式。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                语言润色
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                结构优化
              </Button>
            </div>
          </div>
        )
      }
    ];

    return (
      <div className="space-y-4">
        {assistantCards.map((card) => {
          const IconComponent = card.icon;
          
          return (
            <Card key={card.id} className={cn("transition-all duration-200", disabled ? "opacity-50" : "hover:shadow-lg")}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", card.bgColor)}>
                    <IconComponent className={cn("h-4 w-4", card.color)} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{card.title}</h4>
                    <p className="text-xs text-gray-600">{card.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {card.content}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Audit Card
  const AuditCard = () => (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-base">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <Activity className="h-4 w-4 text-gray-600" />
          </div>
          操作审计
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <div className="text-xs text-gray-700">
              <div className="font-medium">文档已生成</div>
              <div className="text-gray-500">2 分钟前</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <div className="text-xs text-gray-700">
              <div className="font-medium">引用核验完成</div>
              <div className="text-gray-500">5 分钟前</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <div className="text-xs text-gray-700">
              <div className="font-medium">开始内容生成</div>
              <div className="text-gray-500">8 分钟前</div>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full text-xs">
          <ExternalLink className="h-3 w-3 mr-1" />
          查看完整日志
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full min-w-[420px] max-w-[520px] flex-shrink-0">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="deliverables" className="text-xs">
            <Package className="h-3 w-3 mr-1" />
            Deliverables
          </TabsTrigger>
          <TabsTrigger value="assistant" className="text-xs">
            <Bot className="h-3 w-3 mr-1" />
            Assistant
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            Audit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deliverables" className="mt-6">
          <DeliverablesGrid />
        </TabsContent>

        <TabsContent value="assistant" className="mt-6">
          <AssistantGrid />
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <AuditCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeckTabs;