import React from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface AppShellProps {
  children: React.ReactNode;
  rightRail?: React.ReactNode; // 仅在需要右侧对话的页面传入
}

const AppShell: React.FC<AppShellProps> = ({ children, rightRail }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-svh bg-muted/30 text-foreground">
          {/* 主区域：用"3列网格"把内容钉在中间 */}
          <main 
            className="flex-1 px-[var(--gutter)]" 
            style={{ ['--gutter' as any]: 'clamp(16px,4vw,24px)' }}
          >
            <div 
              className="grid grid-cols-[1fr_minmax(0,var(--content))_1fr] gap-0"
              style={{ ['--content' as any]: '1100px' }}
            >
              {/* 中央主内容（永远占中间那列） */}
              <section className="col-start-2 py-6">
                {children}
              </section>

              {/* 可选右侧对话栏：放在第3列，宽度固定，sticky */}
              {rightRail && (
                <aside className="hidden xl:block col-start-3 pl-6">
                  <div className="sticky top-[64px] w-[360px]">
                    {rightRail}
                  </div>
                </aside>
              )}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppShell;