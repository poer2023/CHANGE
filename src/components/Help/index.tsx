export { default as OnboardingTooltip } from './OnboardingTooltip';
export { default as HelpCenter } from './HelpCenter';
export { default as OnboardingManager, WRITING_FLOW_TOUR, RESULT_PAGE_TOUR } from './OnboardingManager';
export { default as HelpButton } from './HelpButton';

// Hook for managing onboarding state
import { useState, useEffect } from 'react';

export const useOnboarding = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem('hasSeenOnboarding') === 'true';
  });
  
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [activeOnboarding, setActiveOnboarding] = useState<string | null>(null);

  const startOnboarding = (type: 'writing-flow' | 'result-page') => {
    setActiveOnboarding(type);
  };

  const completeOnboarding = () => {
    setActiveOnboarding(null);
    setHasSeenOnboarding(true);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const skipOnboarding = () => {
    setActiveOnboarding(null);
    setHasSeenOnboarding(true);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const resetOnboarding = () => {
    setHasSeenOnboarding(false);
    localStorage.removeItem('hasSeenOnboarding');
  };

  return {
    hasSeenOnboarding,
    showHelpCenter,
    activeOnboarding,
    setShowHelpCenter,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding
  };
};

// Usage example components
export const WithHelpSystem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    hasSeenOnboarding,
    showHelpCenter,
    activeOnboarding,
    setShowHelpCenter,
    startOnboarding,
    completeOnboarding,
    skipOnboarding
  } = useOnboarding();

  // Auto-start onboarding for new users
  useEffect(() => {
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => {
        startOnboarding('writing-flow');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenOnboarding, startOnboarding]);

  return (
    <>
      {children}
      
      {/* Floating help button */}
      <HelpButton
        variant="floating"
        onShowHelpCenter={() => setShowHelpCenter(true)}
        onStartTour={() => startOnboarding('writing-flow')}
      />

      {/* Help center modal/overlay */}
      {showHelpCenter && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-end">
              <button
                onClick={() => setShowHelpCenter(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <HelpCenter
                onStartTour={() => {
                  setShowHelpCenter(false);
                  startOnboarding('writing-flow');
                }}
                onClose={() => setShowHelpCenter(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Active onboarding */}
      {activeOnboarding && (
        <OnboardingManager
          isActive={true}
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
          steps={activeOnboarding === 'writing-flow' ? WRITING_FLOW_TOUR : RESULT_PAGE_TOUR}
        />
      )}
    </>
  );
};