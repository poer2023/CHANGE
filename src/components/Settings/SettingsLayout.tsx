import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Shield, 
  Settings, 
  Bell, 
  CreditCard, 
  Database, 
  Puzzle 
} from 'lucide-react';

interface SettingsLayoutProps {
  children: React.ReactNode;
  defaultTab: string;
  onTabChange?: (value: string) => void;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ 
  children, 
  defaultTab,
  onTabChange 
}) => {
  const tabs = [
    { value: 'account', label: '账户信息', icon: User },
    { value: 'security', label: '安全与登录', icon: Shield },
    { value: 'preferences', label: '写作偏好', icon: Settings },
    { value: 'notifications', label: '通知', icon: Bell },
    { value: 'billing', label: '订单与发票', icon: CreditCard },
    { value: 'data', label: '数据与隐私', icon: Database },
    { value: 'integrations', label: '集成', icon: Puzzle }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1040px] mx-auto px-6 md:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">设置</h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理您的账户设置和偏好
          </p>
        </div>
        
        <Tabs 
          value={defaultTab} 
          onValueChange={onTabChange}
          orientation="horizontal"
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* 左侧标签列表 */}
          <div className="lg:w-64 flex-shrink-0">
            <TabsList className="flex lg:flex-col h-auto bg-card border rounded-2xl p-2 w-full lg:w-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="w-full lg:w-full justify-start gap-3 rounded-xl p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden lg:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          
          {/* 右侧内容区域 */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsLayout;