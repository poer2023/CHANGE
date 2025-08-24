import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/state/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import ArticleCard from '@/components/Result/ArticleCard';
import DeckTabs from '@/components/Result/DeckTabs';
import Gate1Modal from '@/components/Gate1Modal';
import LanguageToggle from '@/components/LanguageToggle';
import { FileText, CheckCircle } from 'lucide-react';

const ResultPage: React.FC = () => {
  const { state, dispatch, track, trackTyped } = useApp();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const fromAutopilot = searchParams.get('from') === 'autopilot';

  // Generate a mock document ID for demonstration
  const docId = 'doc_12345678';

  useEffect(() => {
    // Enhanced page view tracking
    trackTyped('page_view', { 
      page: 'ResultPage',
      path: '/result',
      referrer: document.referrer,
      fromAutopilot,
      userAgent: navigator.userAgent
    }, 'page_view');

    // If coming from autopilot and gate1 should be shown, show Gate1Modal
    if (fromAutopilot && state.pay.gate1Ready) {
      dispatch({
        type: 'SHOW_GATE1_MODAL',
        payload: {
          price: {
            value: 199,
            currency: 'CNY',
            expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
          },
          benefits: [
            t('result.gate1.benefit.complete_generation'),
            t('result.gate1.benefit.partial_rewrites'), 
            t('result.gate1.benefit.full_verification')
          ]
        }
      });
    }
  }, [fromAutopilot, state.pay.gate1Ready, state.result.generation, docId, dispatch, trackTyped]);

  const handleGate1PreviewOnly = () => {
    dispatch({ type: 'HIDE_GATE1_MODAL' });
    dispatch({ type: 'PREVIEW_MODE_SET', payload: true });
    
    trackTyped('gate1_preview_only', { 
      docId,
      price: 199,
      reason: 'user_choice'
    }, 'payment', 'gate1');
  };

  const handleGate1Unlock = async () => {
    const startTime = Date.now();
    
    dispatch({ type: 'HIDE_GATE1_MODAL' });
    dispatch({ type: 'PAY_GATE1_READY', payload: true });
    dispatch({ type: 'PREVIEW_MODE_SET', payload: false });
    dispatch({ type: 'GENERATION_STATE', payload: 'starting' });
    
    trackTyped('gate1_unlock_success', { 
      docId,
      price: 199,
      paymentId: `pay_${Date.now()}`,
      paymentTime: Date.now() - startTime
    }, 'payment', 'gate1');

    trackTyped('generation_start', {
      docId,
      trigger: 'gate1_unlock',
      generationType: 'full'
    }, 'document', 'generation');

    // Simulate generation process
    setTimeout(() => {
      dispatch({ type: 'GENERATION_STATE', payload: 'streaming' });
      
      trackTyped('streaming_start', {
        docId,
        streamId: `stream_${Date.now()}`,
        streamType: 'generation'
      }, 'document', 'streaming');
    }, 1000);

    setTimeout(() => {
      dispatch({ type: 'GENERATION_STATE', payload: 'ready' });
      
      trackTyped('generation_complete', {
        docId,
        streamId: `stream_${Date.now()}`,
        totalTime: 5000,
        wordsGenerated: 2500,
        citesAdded: 15,
        sectionsGenerated: 6
      }, 'document', 'generation');
    }, 5000);
  };

  // Status indicator component
  const StatusIndicator = () => {
    const getStatusInfo = () => {
      switch (state.result.generation) {
        case 'streaming':
          return { text: t('result.status.generating'), color: 'text-blue-600' };
        case 'ready':
          return { text: t('result.status.ready'), color: 'text-green-600' };
        default:
          return { text: t('result.status.preview'), color: 'text-yellow-600' };
      }
    };
    
    const statusInfo = getStatusInfo();
    
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-200">
        <CheckCircle className="w-4 h-4 text-blue-600" />
        <span className={`text-sm ${statusInfo.color}`}>
          {statusInfo.text}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('result.meta.title')}</title>
        <meta name="description" content={t('result.meta.description')} />
      </Helmet>
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#6E5BFF] text-white">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('result.header.title')}</h1>
              <p className="text-sm text-gray-600">
                {t('result.header.description')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StatusIndicator />
            <LanguageToggle />
            <div className="text-sm text-gray-500">
              {t('result.document.id')}: {docId.slice(0, 12)}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content Grid */}
      <div className="bg-[#F7F8FB] pt-6">
        <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-6">
          <div className="flex gap-6 items-start">
            {/* Document Column - Fixed 760px */}
            <div className="flex-shrink-0">
              <ArticleCard 
                docId={docId} 
                disabled={state.pay.previewMode}
              />
            </div>
            
            {/* Deck Column - Fixed 420-520px */}
            <div className="flex-shrink-0">
              <DeckTabs 
                docId={docId}
                disabled={state.pay.previewMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gate1Modal for initial payment gate */}
      {state.ui.gate1ModalOpen && (
        <Gate1Modal
          open={state.ui.gate1ModalOpen}
          price={state.ui.gate1ModalData?.price}
          benefits={state.ui.gate1ModalData?.benefits || []}
          onPreviewOnly={handleGate1PreviewOnly}
          onUnlock={handleGate1Unlock}
        />
      )}
    </div>
  );
};

export default ResultPage;