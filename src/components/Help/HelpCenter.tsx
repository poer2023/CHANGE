import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  BookOpen,
  PlayCircle,
  MessageSquare,
  FileText,
  Target,
  Package,
  Bot,
  Download,
  Activity,
  ChevronRight,
  ExternalLink,
  Clock,
  Users,
  Video,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HelpCenterProps {
  onStartTour?: () => void;
  onClose?: () => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ onStartTour, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'getting-started', label: '快速开始', icon: PlayCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'writing-flow', label: '写作流程', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'ai-features', label: 'AI功能', icon: Bot, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'export-share', label: '导出分享', icon: Download, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'troubleshooting', label: '故障排除', icon: HelpCircle, color: 'text-red-600', bg: 'bg-red-50' }
  ];

  const helpItems = [
    {
      id: '1',
      category: 'getting-started',
      title: '如何开始第一篇论文？',
      description: '从话题选择到完成初稿的完整指南',
      type: 'guide',
      duration: '5 分钟',
      popular: true
    },
    {
      id: '2',
      category: 'getting-started',
      title: '界面功能导览',
      description: '了解各个功能区域和快捷操作',
      type: 'tour',
      duration: '3 分钟',
      popular: true
    },
    {
      id: '3',
      category: 'writing-flow',
      title: '文献检索技巧',
      description: '如何高效找到相关文献资源',
      type: 'guide',
      duration: '8 分钟',
      popular: false
    },
    {
      id: '4',
      category: 'writing-flow',
      title: '写作策略制定',
      description: '根据论文类型选择最佳写作方法',
      type: 'guide',
      duration: '10 分钟',
      popular: true
    },
    {
      id: '5',
      category: 'ai-features',
      title: 'AI 助手使用指南',
      description: '与AI助手有效沟通的技巧',
      type: 'video',
      duration: '7 分钟',
      popular: true
    },
    {
      id: '6',
      category: 'ai-features',
      title: '引用核验功能',
      description: '自动验证引用格式和来源',
      type: 'guide',
      duration: '5 分钟',
      popular: false
    },
    {
      id: '7',
      category: 'export-share',
      title: '多格式导出',
      description: '导出Word、PDF、LaTeX等格式',
      type: 'guide',
      duration: '4 分钟',
      popular: true
    },
    {
      id: '8',
      category: 'export-share',
      title: '协作和分享',
      description: '与导师和同学共享研究成果',
      type: 'guide',
      duration: '6 分钟',
      popular: false
    }
  ];

  const quickActions = [
    {
      title: '开始引导教程',
      description: '3分钟了解核心功能',
      icon: PlayCircle,
      action: onStartTour,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: '观看演示视频',
      description: '完整功能演示',
      icon: Video,
      action: () => {},
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: '查看示例论文',
      description: '学习最佳实践',
      icon: FileText,
      action: () => {},
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: '联系客服',
      description: '获取人工支持',
      icon: MessageSquare,
      action: () => {},
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  const filteredItems = helpItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return BookOpen;
      case 'video': return Video;
      case 'tour': return PlayCircle;
      default: return FileText;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">帮助中心</h2>
        <p className="text-gray-600">获取使用指南，快速上手所有功能</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Card
              key={index}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
              onClick={action.action}
            >
              <CardContent className="p-4 text-center space-y-3">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto", action.bg)}>
                  <IconComponent className={cn("h-6 w-6", action.color)} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{action.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索帮助内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="text-xs"
            >
              全部
            </Button>
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-xs"
                >
                  <IconComponent className="h-3 w-3 mr-1" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Help Items */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">未找到相关内容</h4>
              <p className="text-sm text-gray-600">尝试其他关键词或选择不同分类</p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <Card
                key={item.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-[#6E5BFF]/20"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <TypeIcon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                            {item.popular && (
                              <Badge variant="secondary" className="text-xs">
                                热门
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 ml-11">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {item.type === 'guide' ? '图文教程' : item.type === 'video' ? '视频教程' : '交互导览'}
                        </div>
                      </div>
                    </div>
                    
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Footer */}
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600 mb-3">
            没有找到您需要的帮助内容？
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              在线客服
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              用户手册
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpCenter;