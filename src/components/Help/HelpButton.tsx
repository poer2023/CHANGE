import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  HelpCircle, 
  BookOpen, 
  PlayCircle, 
  MessageSquare, 
  ExternalLink,
  Lightbulb,
  Video,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HelpButtonProps {
  onShowHelpCenter?: () => void;
  onStartTour?: () => void;
  onShowTips?: () => void;
  variant?: 'default' | 'floating' | 'icon';
  className?: string;
}

const HelpButton: React.FC<HelpButtonProps> = ({
  onShowHelpCenter,
  onStartTour,
  onShowTips,
  variant = 'default',
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      icon: PlayCircle,
      label: '功能导览',
      description: '3分钟快速上手',
      action: onStartTour,
      color: 'text-green-600'
    },
    {
      icon: BookOpen,
      label: '帮助中心',
      description: '查看详细教程',
      action: onShowHelpCenter,
      color: 'text-blue-600'
    },
    {
      icon: Lightbulb,
      label: '使用技巧',
      description: '提高效率的小贴士',
      action: onShowTips,
      color: 'text-yellow-600'
    },
    {
      icon: Video,
      label: '视频教程',
      description: '观看演示视频',
      action: () => {},
      color: 'text-purple-600'
    },
    {
      icon: FileText,
      label: '用户手册',
      description: '完整功能说明',
      action: () => {},
      color: 'text-orange-600'
    },
    {
      icon: MessageSquare,
      label: '在线客服',
      description: '获取人工帮助',
      action: () => {},
      color: 'text-red-600'
    }
  ];

  if (variant === 'floating') {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="w-14 h-14 rounded-full bg-[#6E5BFF] hover:bg-[#5A4AD4] shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <HelpCircle className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-64 p-2"
            sideOffset={8}
          >
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={item.action}
                  className="p-3 cursor-pointer rounded-lg"
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <IconComponent className={cn("h-4 w-4", item.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900">
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
            
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem className="p-3 cursor-pointer rounded-lg">
              <div className="flex items-center gap-3 w-full text-sm text-gray-600">
                <ExternalLink className="h-4 w-4" />
                访问官方网站
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn("w-8 h-8 p-0", className)}
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 p-2"
        >
          {menuItems.slice(0, 3).map((item, index) => {
            const IconComponent = item.icon;
            return (
              <DropdownMenuItem
                key={index}
                onClick={item.action}
                className="p-2 cursor-pointer rounded-lg"
              >
                <div className="flex items-center gap-2 w-full">
                  <IconComponent className={cn("h-4 w-4", item.color)} />
                  <span className="text-sm">{item.label}</span>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2", className)}
        >
          <HelpCircle className="h-4 w-4" />
          帮助
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 p-2"
      >
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <DropdownMenuItem
              key={index}
              onClick={item.action}
              className="p-3 cursor-pointer rounded-lg"
            >
              <div className="flex items-start gap-3 w-full">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <IconComponent className={cn("h-4 w-4", item.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HelpButton;