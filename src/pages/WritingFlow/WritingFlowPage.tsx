import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { WritingFlowProvider, useWritingFlow } from '../../contexts/WritingFlowContext';
import StepNavigation from '../../components/WritingFlow/StepNavigation';
import HelpAside from '@/components/HelpAside';
import { Loader2, CheckCircle } from 'lucide-react';

// Lazy load step components for better performance
const TopicStep = React.lazy(() => import('./TopicStep'));
const ResearchStep = React.lazy(() => import('./ResearchStep'));
const StrategyStep = React.lazy(() => import('./StrategyStep'));
const OutlineStep = React.lazy(() => import('./OutlineStep'));
const ContentStep = React.lazy(() => import('./ContentStep'));

// Loading component for suspense
const StepLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
      <p className="text-gray-600">加载中...</p>
    </div>
  </div>
);

// Auto-save indicator component
const AutoSaveIndicator = () => {
  const { project } = useWritingFlow();
  const lastSaved = project?.metadata?.updatedAt;
  
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg border border-green-200">
      <CheckCircle className="w-4 h-4 text-green-600" />
      <span className="text-sm text-green-700">
        {lastSaved ? `已保存 ${new Date(lastSaved).toLocaleTimeString()}` : '已保存'}
      </span>
    </div>
  );
};

// Right sidebar component with help only
const RightSidebar = () => {
  const { project } = useWritingFlow();
  const location = useLocation();
  const currentStep = project?.currentStep || 'topic';
  
  // Extract step from pathname
  const getStepFromPath = () => {
    const path = location.pathname;
    if (path.includes('/topic')) return 'topic';
    if (path.includes('/research')) return 'research';
    if (path.includes('/strategy')) return 'strategy';
    if (path.includes('/outline')) return 'outline';
    if (path.includes('/content')) return 'content';
    return currentStep;
  };

  return <HelpAside step={getStepFromPath()} />;
};

// Main content area with routing
const MainContent = () => {
  return (
    <main className="flex-1 bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<StepLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/writing-flow/topic" replace />} />
            <Route path="/topic" element={<TopicStep />} />
            <Route path="/research" element={<ResearchStep />} />
            <Route path="/strategy" element={<StrategyStep />} />
            <Route path="/outline" element={<OutlineStep />} />
            <Route path="/content" element={<ContentStep />} />
            <Route path="*" element={<Navigate to="/writing-flow/topic" replace />} />
          </Routes>
        </Suspense>
      </div>
    </main>
  );
};

// Layout component (inside provider)
const WritingFlowLayout = () => {
  const { project } = useWritingFlow();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>AI 写作流程 - 学术论文助手</title>
        <meta name="description" content="五步写作流程：选题、检索、策略、大纲、正文" />
      </Helmet>
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">学术写作助手</h1>
            <p className="text-sm text-gray-600">
              {project?.topic?.title || '请从选题开始您的写作之旅'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <AutoSaveIndicator />
            <div className="text-sm text-gray-500">
              项目ID: {project?.id?.slice(0, 8) || 'N/A'}
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Sidebar - Step Navigation */}
        <aside className="w-80 bg-white border-r border-gray-200 hidden lg:block">
          <div className="p-6">
            <StepNavigation className="sticky top-0" />
          </div>
        </aside>

        {/* Main Content Area */}
        <MainContent />

        {/* Right Sidebar - Help & AI Assistant */}
        <RightSidebar />
      </div>
    </div>
  );
};

// Main component with provider
const WritingFlowPage: React.FC = () => {
  return (
    <WritingFlowProvider>
      <WritingFlowLayout />
    </WritingFlowProvider>
  );
};

export default WritingFlowPage;