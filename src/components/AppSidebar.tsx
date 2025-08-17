import React from "react";
import { Plus, Library, History, User, Settings, CreditCard, Activity, Shield, Search, LogOut, ChevronRight, Bot } from "lucide-react";
import Logo from "@/components/ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCredit } from "@/contexts/CreditContext";

const AppSidebar = () => {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const { balance } = useCredit();

  const handleNewEssay = () => {
    navigate('/form');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getVipLevel = () => {
    const level = balance.vipLevel;
    const names = { 0: '普通', 1: '青铜', 2: '白银', 3: '黄金', 4: '钻石' };
    const colors = { 
      0: 'bg-gray-100 text-gray-700', 
      1: 'bg-amber-100 text-amber-700', 
      2: 'bg-blue-100 text-blue-700', 
      3: 'bg-purple-100 text-purple-700', 
      4: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
    };
    return { 
      name: names[level] || names[0], 
      color: colors[level] || colors[0] 
    };
  };


  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:px-3">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10">
              <Logo size="sm" className="group-data-[collapsible=icon]:!w-7 group-data-[collapsible=icon]:!h-7" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold">EssayPass</span>
            </div>
          </div>
          <SidebarTrigger className="h-7 w-7 group-data-[collapsible=icon]:mt-2" />
        </div>
      </SidebarHeader>

      <SidebarContent className="group-data-[collapsible=icon]:px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:!opacity-30 group-data-[collapsible=icon]:text-center group-data-[collapsible=icon]:!-mt-1 group-data-[collapsible=icon]:text-xs">导航</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="新建Essay" onClick={handleNewEssay}>
                  <Plus className="h-4 w-4" />
                  <span>新建</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="文库" onClick={() => navigate('/knowledge')}>
                  <Library className="h-4 w-4" />
                  <span>文库</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton tooltip="历史记录" onClick={() => navigate('/history')}>
                  <History className="h-4 w-4" />
                  <span>历史记录</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:!opacity-30 group-data-[collapsible=icon]:text-center group-data-[collapsible=icon]:!-mt-1 group-data-[collapsible=icon]:text-xs">工具</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="AI检测" onClick={() => navigate('/detect/ai')}>
                  <Bot className="h-4 w-4" />
                  <span>AI检测</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="抄袭检测" onClick={() => navigate('/detect/plagiarism')}>
                  <Search className="h-4 w-4" />
                  <span>抄袭检测</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:px-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-14">
                  <Avatar className="h-8 w-8 rounded-lg group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10">
                    <AvatarImage src={user?.avatar} alt={user?.name || '用户头像'} />
                    <AvatarFallback className="rounded-lg group-data-[collapsible=icon]:text-base">
                      {user?.name?.slice(0, 2) || '用户'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold">{user?.name || '用户名'}</span>
                      <Badge className={`text-xs ${getVipLevel().color}`}>
                        {getVipLevel().name}
                      </Badge>
                    </div>
                    <span className="truncate text-xs">{user?.email || 'user@example.com'}</span>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" side="top">
                <DropdownMenuLabel className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.name || '用户头像'} />
                      <AvatarFallback className="text-sm font-medium">
                        {user?.name?.slice(0, 2) || '用户'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left">
                      <span className="font-medium text-sm">{user?.name || '用户名'}</span>
                      <span className="text-xs text-muted-foreground">
                        余额: {balance.wordBalance.toLocaleString()} 字
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => navigate('/user-profile')} className="py-2.5">
                  <User className="mr-3 h-4 w-4" />
                  <span className="text-sm">管理账户</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate('/topup')} className="py-2.5">
                  <CreditCard className="mr-3 h-4 w-4" />
                  <span className="text-sm">充值余额</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate('/usage-history')} className="py-2.5">
                  <Activity className="mr-3 h-4 w-4" />
                  <span className="text-sm">使用记录</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="py-2.5">
                  <Settings className="mr-3 h-4 w-4" />
                  <span className="text-sm">设置</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout} className="py-2.5 text-red-600 focus:text-red-600">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="text-sm">登出</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;