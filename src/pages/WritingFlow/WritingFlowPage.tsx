import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { WritingFlowProvider, useWritingFlow } from '../../contexts/WritingFlowContext';
import { Loader2, CheckCircle, BookOpen, Target, FileText } from 'lucide-react';
import StepNavigation from '../../components/WritingFlow/StepNav';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageToggle from '@/components/LanguageToggle';

// Lazy load step components for better performance
const TopicStep = React.lazy(() => import('./TopicStep'));
const ResearchStep = React.lazy(() => import('./ResearchStep'));
const StrategyStep = React.lazy(() => import('./StrategyStep'));
const OutlineStep = React.lazy(() => import('./OutlineStep'));

// Loading component for suspense
const StepLoader = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
        <p className="text-gray-600">{t('writingflow.loading')}</p>
      </div>
    </div>
  );
};

// Auto-save indicator component
const AutoSaveIndicator = () => {
  const { project } = useWritingFlow();
  const { t } = useTranslation();
  const lastSaved = project?.metadata?.updatedAt;
  
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg border border-green-200">
      <CheckCircle className="w-4 h-4 text-green-600" />
      <span className="text-sm text-green-700">
        {lastSaved ? `${t('writingflow.saved')} ${new Date(lastSaved).toLocaleTimeString()}` : t('writingflow.saved')}
      </span>
    </div>
  );
};


// Main content area with routing
const MainContent = () => {
  return (
    <main className="flex-1 bg-gray-50">
      <Suspense fallback={<StepLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/writing-flow/topic" replace />} />
          <Route path="/topic" element={<TopicStep />} />
          <Route path="/research" element={<ResearchStep />} />
          <Route path="/strategy" element={<StrategyStep />} />
          <Route path="/outline" element={<OutlineStep />} />
          <Route path="*" element={<Navigate to="/writing-flow/topic" replace />} />
        </Routes>
      </Suspense>
    </main>
  );
};

// Layout component (inside provider)
const WritingFlowLayout = () => {
  const { project } = useWritingFlow();
  const { t } = useTranslation();
  const location = useLocation();

  // Step configuration for dynamic header
  const stepConfig = {
    '/topic': { 
      icon: BookOpen, 
      title: 'topic.page_title', 
      description: '填写论文关键信息，便于精准生成写作策略'
    },
    '/research': { 
      icon: BookOpen, 
      title: 'research.header.title', 
      description: t('research.header.description')
    },
    '/strategy': { 
      icon: Target, 
      title: 'strategy.header.title', 
      description: '制定论文的核心论点和论证策略'
    },
    '/outline': { 
      icon: FileText, 
      title: 'outline.header.title', 
      description: t('outline.header.description')
    }
  };

  // Get current step info
  const currentPath = location.pathname.split('/').pop() || 'topic';
  const currentStep = stepConfig[`/${currentPath}`] || stepConfig['/topic'];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('writingflow.meta_title')}</title>
        <meta name="description" content={t('writingflow.meta_description')} />
      </Helmet>
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#6E5BFF] text-white">
              <currentStep.icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t(currentStep.title)}</h1>
              <p className="text-sm text-gray-600">
                {currentStep.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AutoSaveIndicator />
            <LanguageToggle />
            <div className="text-sm text-gray-500">
              {t('writingflow.project_id')}: {project?.id?.slice(0, 8) || 'N/A'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Full Width */}
      <MainContent />
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