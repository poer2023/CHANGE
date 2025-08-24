import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AcademicProofWriting from '@/pages/AcademicProofWriting';

/**
 * 智能首页组件 - 根据登录状态决定显示内容
 * 
 * 逻辑：
 * - 未登录用户：显示SEO落地页 (AcademicProofWriting)
 * - 登录用户：自动重定向到 /home 页面
 */
const SmartHomePage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 等待认证状态加载完成
    if (isLoading) return;
    
    // 如果用户已登录，重定向到 /home
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6E5BFF]"></div>
      </div>
    );
  }

  // 如果用户已登录，在重定向过程中显示空白（避免闪烁）
  if (isAuthenticated) {
    return null;
  }

  // 未登录用户显示SEO落地页
  return <AcademicProofWriting />;
};

export default SmartHomePage;