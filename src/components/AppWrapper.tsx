import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorBoundary, ToastProvider } from '@/components/UI';
import { useAriaLiveRegion, useSkipLinks } from '@/hooks';

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { announce } = useAriaLiveRegion();
  const { addSkipLinks } = useSkipLinks();

  // 初始化跳过链接
  useEffect(() => {
    addSkipLinks([
      { target: 'main-content', label: '跳转到主要内容' },
      { target: 'navigation', label: '跳转到导航' },
      { target: 'search', label: '跳转到搜索' }
    ]);
  }, [addSkipLinks]);

  // 页面加载完成时的公告
  useEffect(() => {
    announce('页面已加载完成');
  }, [announce]);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // 在生产环境中，这里可以发送错误到监控服务
        console.error('Global error:', error, errorInfo);
        announce('页面出现错误，请刷新重试', 'assertive');
      }}
    >
      <ToastProvider maxToasts={5} defaultDuration={5000}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* 主要内容区域 */}
            <main id="main-content" className="outline-none" tabIndex={-1}>
              {children}
            </main>
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
};