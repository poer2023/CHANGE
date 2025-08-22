import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/state/AppContext';
import ArticleCard from '@/components/Result/ArticleCard';
import DeckTabs from '@/components/Result/DeckTabs';
import Gate1Modal from '@/components/Gate1Modal';

const ResultPage: React.FC = () => {
  const { state, dispatch, track, trackTyped } = useApp();
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

    // If coming from autopilot and not unlocked, show Gate1Modal
    if (fromAutopilot && !state.payLocks.gate1Unlocked) {
      dispatch({
        type: 'SHOW_GATE1_MODAL',
        payload: {
          price: {
            value: 199,
            currency: 'CNY',
            expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
          },
          benefits: [
            '一次完整生成',
            '2 次局部重写', 
            '全量引用核验'
          ]
        }
      });
    }
  }, [fromAutopilot, state.payLocks.gate1Unlocked, state.result.generation, docId, dispatch, trackTyped]);

  const handleGate1PreviewOnly = () => {
    dispatch({ type: 'HIDE_GATE1_MODAL' });
    dispatch({ type: 'SET_PREVIEW_MODE', payload: true });
    
    trackTyped('gate1_preview_only', { 
      docId,
      price: 199,
      reason: 'user_choice'
    }, 'payment', 'gate1');
  };

  const handleGate1Unlock = async () => {
    const startTime = Date.now();
    
    dispatch({ type: 'HIDE_GATE1_MODAL' });
    dispatch({ type: 'UNLOCK_GATE1' });
    dispatch({ type: 'SET_PREVIEW_MODE', payload: false });
    dispatch({ type: 'SET_GENERATION_STATE', payload: 'starting' });
    
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
      dispatch({ type: 'SET_GENERATION_STATE', payload: 'streaming' });
      
      trackTyped('streaming_start', {
        docId,
        streamId: `stream_${Date.now()}`,
        streamType: 'generation'
      }, 'document', 'streaming');
    }, 1000);

    setTimeout(() => {
      dispatch({ type: 'SET_GENERATION_STATE', payload: 'ready' });
      
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

  return (
    <div className="min-h-screen bg-[#F7F8FB]">
      <Helmet>
        <title>结果与交付 - 学术论文助手</title>
        <meta name="description" content="查看您的写作流程交付结果和完整文档" />
      </Helmet>
      
      {/* Main Content Grid */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-6">
        <div className="flex gap-6 items-start">
          {/* Document Column - Fixed 760px */}
          <div className="flex-shrink-0">
            <ArticleCard 
              docId={docId} 
              disabled={!state.payLocks.gate1Unlocked}
            />
          </div>
          
          {/* Deck Column - Fixed 420-520px */}
          <div className="flex-shrink-0">
            <DeckTabs 
              docId={docId}
              disabled={!state.payLocks.gate1Unlocked}
            />
          </div>
        </div>
      </div>

      {/* Gate1Modal for initial payment gate */}
      <Gate1Modal
        open={state.ui.gate1ModalOpen}
        price={state.ui.gate1ModalData?.price}
        benefits={state.ui.gate1ModalData?.benefits || []}
        onPreviewOnly={handleGate1PreviewOnly}
        onUnlock={handleGate1Unlock}
      />
    </div>
  );
};

export default ResultPage;