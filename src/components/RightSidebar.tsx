import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIChat from '@/components/AIChat';
import KnowledgeLibrarySidebar from '@/components/KnowledgeLibrarySidebar';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ 
  isOpen, 
  onClose, 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('knowledge');

  if (!isOpen) return null;

  return (
    <div className={`fixed top-0 right-0 h-full w-96 bg-white border-l shadow-lg z-50 ${className}`}>
      <Card className="h-full rounded-none border-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">助手面板</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              知识库
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              AI助手
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="knowledge" className="h-full m-0 p-4 data-[state=active]:flex data-[state=active]:flex-col">
              <KnowledgeLibrarySidebar />
            </TabsContent>

            <TabsContent value="chat" className="h-full m-0 p-4 data-[state=active]:flex data-[state=active]:flex-col">
              <AIChat className="h-full" />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default RightSidebar;