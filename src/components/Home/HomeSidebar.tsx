import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/ui/logo';
import {
  Home,
  FileText,
  PenTool,
  BookTemplate,
  Library,
  FileCheck,
  Receipt,
  FlaskConical,
  Settings,
  LogOut,
  User,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';


interface MenuItem {
  id: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string | number;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    labelKey: 'sidebar.dashboard',
    icon: Home,
    href: '/home'
  },
  {
    id: 'documents',
    labelKey: 'sidebar.documents',
    icon: FileText,
    href: '/documents'
  },
  {
    id: 'library',
    labelKey: 'sidebar.library',
    icon: Library,
    href: '/library'
  }
];

const HomeSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const { t } = useTranslation();

  const getPlanBadge = (plan: string = 'Free') => {
    switch (plan.toLowerCase()) {
      case 'pro':
        return <Badge variant="default" className="bg-gradient-to-r from-[#6E5BFF] to-[#8B7FFF] text-white text-xs">Pro</Badge>;
      case 'standard':
        return <Badge variant="secondary" className="text-xs">Standard</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Free</Badge>;
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <Logo className="h-8 w-8" />
          {state === 'expanded' && (
            <span className="text-[17px] font-semibold text-foreground">
              AcademicGPT
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                const label = t(item.labelKey);
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={label}
                    >
                      <Link to={item.href} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-muted data-[active=true]:bg-muted">
                        <Icon className="size-5" />
                        <span>{label}</span>
                        {item.badge && state === 'expanded' && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton 
                  size="lg" 
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="text-xs">
                        {user?.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {state === 'expanded' && (
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium truncate">
                            {user?.name}
                          </p>
                          {getPlanBadge(user?.plan || 'Free')}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    )}
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                className="w-56" 
                align="end" 
                side={state === 'collapsed' ? 'right' : 'top'}
                sideOffset={4}
              >
                <div className="px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="text-xs">
                        {user?.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="size-4" />
                    {t('sidebar.profile')}
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="size-4" />
                    {t('sidebar.settings')}
                  </Link>
                </DropdownMenuItem>

                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  {t('sidebar.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default HomeSidebar;