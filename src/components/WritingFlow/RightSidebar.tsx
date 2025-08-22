import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  FileText, 
  Send, 
  Sparkles,
  RotateCcw,
  Plus,
  Quote,
  BarChart3,
  FileDown,
  ChevronRight,
  ChevronDown,
  Dot
} from 'lucide-react';
import { Section } from '@/types/writing-flow';

interface RightSidebarProps {
  activeTab: 'assistant' | 'outline';
  onTabChange: (tab: 'assistant' | 'outline') => void;
  sections: Section[];
  currentVisibleSection: string | null;
  onSectionClick: (sectionId: string) => void;
  onSectionUpdate: (sectionId: string, updates: Partial<Section>) => void;
  className?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  activeTab,
  onTabChange,
  sections,
  currentVisibleSection,
  onSectionClick,
  onSectionUpdate,
  className
}) => {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '您好！我是 AI 写作助手。我可以帮助您：\\n\\n• 重写当前段落\\n• 扩写下一段\\n• 插入引用\\n• 生成图表说明\\n• 生成摘要\\n\\n有什么可以帮助您的吗？',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Quick commands for AI assistant
  const quickCommands = [
    { text: '重写当前段', icon: RotateCcw },
    { text: '扩写下一段', icon: Plus },
    { text: '插入引用', icon: Quote },
    { text: '生成图表说明', icon: BarChart3 },
    { text: '生成摘要', icon: FileDown }
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `我已收到您的请求："${chatInput}"。正在处理中...`,
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickCommand = (command: string) => {
    setChatInput(command);
  };

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Build outline tree structure
  const outlineItems = sections.map((section, index) => ({
    id: section.id,
    title: section.title,
    level: section.level,
    isVisible: currentVisibleSection === section.id,
    hasChildren: false, // Simplified for this implementation
    citationCount: section.citations.length,
    expectedCitations: section.expectedCitations || 0
  }));

  return (
    <aside className={cn('bg-white border-l border-[#EEF0F4] flex flex-col', className)}>
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'assistant' | 'outline')} className="flex flex-col h-full">
        {/* Tab Headers */}
        <div className="p-4 border-b border-[#EEF0F4]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assistant" className="flex items-center gap-2 text-xs">
              <MessageSquare className="h-3 w-3" />
              AI 助手
            </TabsTrigger>
            <TabsTrigger value="outline" className="flex items-center gap-2 text-xs">
              <FileText className="h-3 w-3" />
              文档大纲
            </TabsTrigger>
          </TabsList>
        </div>

        {/* AI Assistant Tab */}
        <TabsContent value="assistant" className="flex-1 flex flex-col p-0 m-0">
          {/* Quick Commands */}
          <div className="p-4 border-b border-[#EEF0F4]">
            <h4 className="text-sm font-medium text-[#2A3241] mb-3">快捷命令</h4>
            <div className="space-y-2">
              {quickCommands.map((command, index) => {
                const Icon = command.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickCommand(command.text)}
                    className="w-full justify-start text-xs h-8"
                  >
                    <Icon className="h-3 w-3 mr-2" />
                    {command.text}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.isUser ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] p-3 rounded-lg text-sm leading-relaxed',
                      message.isUser
                        ? 'bg-[#6E5BFF] text-white rounded-br-sm'
                        : 'bg-gray-100 text-[#2A3241] rounded-bl-sm'
                    )}
                  >
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    <div className={cn(
                      'text-xs mt-1',
                      message.isUser ? 'text-blue-200' : 'text-[#5B667A]'
                    )}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t border-[#EEF0F4]">
            <div className="flex gap-2">
              <Textarea
                placeholder="询问 AI 助手..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 min-h-[80px] text-sm resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="bg-[#6E5BFF] hover:brightness-105 text-white rounded-lg px-4 py-2 h-auto"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Document Outline Tab */}
        <TabsContent value="outline" className="flex-1 flex flex-col p-0 m-0">
          {/* Outline Header */}
          <div className="p-4 border-b border-[#EEF0F4]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-[#2A3241]">文档大纲</h4>
              <Badge variant="secondary" className="text-xs">
                {sections.length} 段
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs h-7">
                生成摘要
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7">
                导出目录
              </Button>
            </div>
          </div>

          {/* Outline Tree */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-1">
              {outlineItems.map((item, index) => (
                <div key={item.id}>
                  <div
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors group',
                      item.isVisible && 'bg-[#6E5BFF]/10 border border-[#6E5BFF]/20',
                      !item.isVisible && 'hover:bg-gray-50'
                    )}
                    onClick={() => onSectionClick(item.id)}
                  >
                    {/* Level Indicator */}
                    <div className={cn(
                      'flex items-center',
                      item.level === 2 ? 'pl-0' : 'pl-4'
                    )}>
                      {item.hasChildren ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-4 h-4 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSectionExpansion(item.id);
                          }}
                        >
                          {expandedSections.has(item.id) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                      ) : (
                        <Dot className="h-3 w-3 text-gray-400" />
                      )}
                    </div>

                    {/* Section Title */}
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        'font-medium truncate text-sm',
                        item.isVisible ? 'text-[#6E5BFF]' : 'text-[#2A3241]',
                        item.level === 2 ? 'font-semibold' : 'font-medium'
                      )}>
                        {item.title}
                      </div>
                      <div className="text-xs text-[#5B667A] truncate">
                        {item.level === 2 ? 'H2' : 'H3'} · {item.citationCount}/{item.expectedCitations} 引用
                      </div>
                    </div>

                    {/* Citation Status Indicator */}
                    <div className="flex-shrink-0">
                      {item.citationCount < item.expectedCitations ? (
                        <div className="w-2 h-2 rounded-full bg-red-500" title="引用不足" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-green-500" title="引用完整" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Outline Footer */}
          <div className="p-4 border-t border-[#EEF0F4]">
            <div className="text-xs text-[#5B667A] space-y-1">
              <div>点击项目可跳转到对应段落</div>
              <div>当前高亮显示可视区域内容</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default RightSidebar;