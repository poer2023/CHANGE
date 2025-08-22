import type { VerifyLevel, WritingStep } from '@/state/types';

// API response types
export interface PriceLockResponse {
  value: number;
  currency: 'CNY';
  expiresAt: number;
}

export interface PaymentIntentResponse {
  paymentIntentId: string;
  payUrl?: string;
}

export interface PaymentConfirmResponse {
  status: 'succeeded' | 'failed';
}

export interface AutopilotStartResponse {
  taskId: string;
}

export interface AutopilotStreamData {
  step: 'search' | 'strategy' | 'outline' | 'done' | 'error';
  progress: number;
  message?: string;
  docId?: string;
}

// Mock implementation for development
const MOCK_DELAY = (min: number, max: number) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

// Price locking service
export const lockPrice = async (inputs: {
  title: string;
  wordCount: number;
  verifyLevel: VerifyLevel;
}): Promise<PriceLockResponse> => {
  await MOCK_DELAY(800, 1500);
  
  // Simulate price calculation based on inputs
  const basePrice = Math.floor(inputs.wordCount / 100) * 8;
  const levelMultiplier = inputs.verifyLevel === 'Pro' ? 1.5 : inputs.verifyLevel === 'Standard' ? 1.2 : 1.0;
  const finalPrice = Math.round(basePrice * levelMultiplier);
  
  return {
    value: finalPrice,
    currency: 'CNY',
    expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
  };
};

// Payment intent creation
export const createPaymentIntent = async (params: {
  docId?: string;
  price: number;
}): Promise<PaymentIntentResponse> => {
  await MOCK_DELAY(500, 1000);
  
  return {
    paymentIntentId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    payUrl: `https://pay.example.com/intent/${Date.now()}`
  };
};

// Payment confirmation
export const confirmPayment = async (paymentIntentId: string): Promise<PaymentConfirmResponse> => {
  await MOCK_DELAY(2000, 4000);
  
  // 90% success rate for testing
  const success = Math.random() > 0.1;
  
  return {
    status: success ? 'succeeded' : 'failed'
  };
};

// Autopilot service
export const startAutopilot = async (params: {
  docId?: string;
  fromStep: WritingStep;
  config: {
    verifyLevel: VerifyLevel;
    allowPreprint: boolean;
    useStyle: boolean;
  };
}): Promise<AutopilotStartResponse> => {
  await MOCK_DELAY(300, 800);
  
  return {
    taskId: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
};

// Autopilot progress streaming (mock with setTimeout)
export const streamAutopilotProgress = (
  taskId: string,
  onProgress: (data: AutopilotStreamData) => void,
  onComplete: (docId: string) => void,
  onError: (error: string) => void
): (() => void) => {
  let cancelled = false;
  
  const steps: Array<{ step: AutopilotStreamData['step']; duration: number }> = [
    { step: 'search', duration: 8000 },
    { step: 'strategy', duration: 6000 },
    { step: 'outline', duration: 5000 }
  ];
  
  let currentStepIndex = 0;
  let stepProgress = 0;
  
  const updateProgress = () => {
    if (cancelled) return;
    
    const currentStep = steps[currentStepIndex];
    if (!currentStep) {
      // All steps completed
      onProgress({
        step: 'done',
        progress: 100,
        message: '自动推进完成',
        docId: `doc_${Date.now()}`
      });
      onComplete(`doc_${Date.now()}`);
      return;
    }
    
    stepProgress += Math.random() * 15 + 5; // 5-20% progress each update
    
    if (stepProgress >= 100) {
      // Current step completed
      const totalProgress = ((currentStepIndex + 1) / steps.length) * 100;
      onProgress({
        step: currentStep.step,
        progress: Math.round(totalProgress),
        message: `${getStepName(currentStep.step)}完成`
      });
      
      currentStepIndex++;
      stepProgress = 0;
      
      // Start next step after a brief pause
      setTimeout(updateProgress, 1000);
    } else {
      // Continue current step
      const stepWeightedProgress = (currentStepIndex / steps.length) * 100 + 
                                   (stepProgress / 100) * (100 / steps.length);
      
      onProgress({
        step: currentStep.step,
        progress: Math.round(stepWeightedProgress),
        message: `正在${getStepName(currentStep.step)}...`
      });
      
      // Random delay between updates
      setTimeout(updateProgress, Math.random() * 2000 + 1000);
    }
  };
  
  // Start the process
  setTimeout(updateProgress, 1000);
  
  // Return cancellation function
  return () => {
    cancelled = true;
  };
};

const getStepName = (step: string): string => {
  switch (step) {
    case 'search': return '文献检索';
    case 'strategy': return '策略制定';
    case 'outline': return '大纲构建';
    default: return step;
  }
};

// Error simulation
export const simulateError = (chance: number = 0.1): boolean => {
  return Math.random() < chance;
};

// Console tracking (埋点)
export const track = (event: string, properties?: Record<string, any>) => {
  console.log(`[TRACK] ${event}`, properties);
  
  // In production, this would send to your analytics service
  // analytics.track(event, properties);
};