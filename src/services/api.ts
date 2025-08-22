import type {
  Step1Inputs,
  VerifyLevel,
  EstimateResponse,
  AutopilotStartResponse,
  AutopilotStreamData,
  PaymentIntentResponse,
  PaymentConfirmResponse,
  GenerationStartResponse,
  GenerationStreamData,
  ExportResponse
} from '@/state/types';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Error handling utility
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }

    throw new ApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData.code
    );
  }

  return response.json();
}

// Estimate API
export async function fetchEstimate(
  inputs: Step1Inputs,
  verifyLevel: VerifyLevel
): Promise<EstimateResponse> {
  return apiRequest<EstimateResponse>('/estimate', {
    method: 'POST',
    body: JSON.stringify({ ...inputs, verifyLevel }),
  });
}

// Autopilot API
export async function startAutopilot(
  inputs: Step1Inputs,
  config: {
    verifyLevel: VerifyLevel;
    allowPreprint: boolean;
    useStyle: boolean;
  }
): Promise<AutopilotStartResponse> {
  return apiRequest<AutopilotStartResponse>('/autopilot/start', {
    method: 'POST',
    body: JSON.stringify({ ...inputs, ...config }),
  });
}

export function createAutopilotStream(
  taskId: string,
  onData: (data: AutopilotStreamData) => void,
  onError: (error: Error) => void,
  onComplete: () => void,
  options?: {
    maxRetries?: number;
    retryDelay?: number;
    timeout?: number;
  }
): () => void {
  const maxRetries = options?.maxRetries ?? 3;
  const retryDelay = options?.retryDelay ?? 1000;
  const timeout = options?.timeout ?? 30000;
  
  let eventSource: EventSource | null = null;
  let retryCount = 0;
  let retryTimeout: NodeJS.Timeout | null = null;
  let connectionTimeout: NodeJS.Timeout | null = null;
  let isActive = true;

  const cleanup = () => {
    isActive = false;
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    if (retryTimeout) {
      clearTimeout(retryTimeout);
      retryTimeout = null;
    }
    if (connectionTimeout) {
      clearTimeout(connectionTimeout);
      connectionTimeout = null;
    }
  };

  const connect = () => {
    if (!isActive) return;
    
    try {
      eventSource = new EventSource(`${API_BASE_URL}/autopilot/stream?taskId=${taskId}`);
      
      // Connection timeout
      connectionTimeout = setTimeout(() => {
        if (eventSource && eventSource.readyState !== EventSource.OPEN) {
          console.warn('Autopilot stream connection timeout');
          onError(new Error('Connection timeout'));
          cleanup();
        }
      }, timeout);

      eventSource.onopen = () => {
        console.log('Autopilot stream connected');
        retryCount = 0; // Reset retry count on successful connection
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
      };

      eventSource.onmessage = (event) => {
        try {
          const data: AutopilotStreamData = JSON.parse(event.data);
          onData(data);
          
          if (data.step === 'done' || data.step === 'error') {
            onComplete();
            cleanup();
          }
        } catch (error) {
          console.error('Failed to parse autopilot stream data:', error);
          onError(new Error('Invalid stream data'));
        }
      };

      eventSource.onerror = (event) => {
        console.error('Autopilot stream error:', event);
        
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }

        if (isActive && retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying autopilot stream connection (${retryCount}/${maxRetries})`);
          
          retryTimeout = setTimeout(() => {
            if (isActive) {
              connect();
            }
          }, retryDelay * retryCount); // Exponential backoff
        } else if (isActive) {
          onError(new Error(`Stream connection failed after ${maxRetries} retries`));
          cleanup();
        }
      };
    } catch (error) {
      console.error('Failed to create autopilot stream:', error);
      onError(error as Error);
      cleanup();
    }
  };

  // Initial connection
  connect();

  // Return cleanup function
  return cleanup;
}

export async function stopAutopilot(taskId: string): Promise<void> {
  return apiRequest<void>(`/autopilot/stop/${taskId}`, {
    method: 'POST',
  });
}

export async function pauseAutopilot(taskId: string): Promise<void> {
  return apiRequest<void>(`/autopilot/pause/${taskId}`, {
    method: 'POST',
  });
}

export async function resumeAutopilot(taskId: string): Promise<void> {
  return apiRequest<void>(`/autopilot/resume/${taskId}`, {
    method: 'POST',
  });
}

// Payment API
export async function createGate1Payment(
  docId: string,
  lockedPrice: number
): Promise<PaymentIntentResponse> {
  return apiRequest<PaymentIntentResponse>('/payment/gate1/create', {
    method: 'POST',
    body: JSON.stringify({ docId, lockedPrice }),
  });
}

export async function createAddonPayment(
  docId: string,
  addons: string[]
): Promise<PaymentIntentResponse> {
  return apiRequest<PaymentIntentResponse>('/payment/addon/create', {
    method: 'POST',
    body: JSON.stringify({ docId, addons }),
  });
}

export async function confirmPayment(
  paymentIntentId: string
): Promise<PaymentConfirmResponse> {
  return apiRequest<PaymentConfirmResponse>('/payment/confirm', {
    method: 'POST',
    body: JSON.stringify({ paymentIntentId }),
  });
}

// Generation API
export async function startGeneration(docId: string): Promise<GenerationStartResponse> {
  return apiRequest<GenerationStartResponse>('/generation/start', {
    method: 'POST',
    body: JSON.stringify({ docId }),
  });
}

export function createGenerationStream(
  streamId: string,
  onData: (data: GenerationStreamData) => void,
  onError: (error: Error) => void,
  onComplete: () => void,
  options?: {
    maxRetries?: number;
    retryDelay?: number;
    timeout?: number;
  }
): () => void {
  const maxRetries = options?.maxRetries ?? 3;
  const retryDelay = options?.retryDelay ?? 1000;
  const timeout = options?.timeout ?? 30000;
  
  let eventSource: EventSource | null = null;
  let retryCount = 0;
  let retryTimeout: NodeJS.Timeout | null = null;
  let connectionTimeout: NodeJS.Timeout | null = null;
  let isActive = true;

  const cleanup = () => {
    isActive = false;
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    if (retryTimeout) {
      clearTimeout(retryTimeout);
      retryTimeout = null;
    }
    if (connectionTimeout) {
      clearTimeout(connectionTimeout);
      connectionTimeout = null;
    }
  };

  const connect = () => {
    if (!isActive) return;
    
    try {
      eventSource = new EventSource(`${API_BASE_URL}/generation/stream?streamId=${streamId}`);
      
      // Connection timeout
      connectionTimeout = setTimeout(() => {
        if (eventSource && eventSource.readyState !== EventSource.OPEN) {
          console.warn('Generation stream connection timeout');
          onError(new Error('Connection timeout'));
          cleanup();
        }
      }, timeout);

      eventSource.onopen = () => {
        console.log('Generation stream connected');
        retryCount = 0; // Reset retry count on successful connection
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
      };

      eventSource.onmessage = (event) => {
        try {
          const data: GenerationStreamData = JSON.parse(event.data);
          onData(data);
          
          if (data.done || data.error) {
            onComplete();
            cleanup();
          }
        } catch (error) {
          console.error('Failed to parse generation stream data:', error);
          onError(new Error('Invalid stream data'));
        }
      };

      eventSource.onerror = (event) => {
        console.error('Generation stream error:', event);
        
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }

        if (isActive && retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying generation stream connection (${retryCount}/${maxRetries})`);
          
          retryTimeout = setTimeout(() => {
            if (isActive) {
              connect();
            }
          }, retryDelay * retryCount); // Exponential backoff
        } else if (isActive) {
          onError(new Error(`Stream connection failed after ${maxRetries} retries`));
          cleanup();
        }
      };
    } catch (error) {
      console.error('Failed to create generation stream:', error);
      onError(error as Error);
      cleanup();
    }
  };

  // Initial connection
  connect();

  // Return cleanup function
  return cleanup;
}

// Export API
export async function exportDocument(
  docId: string,
  type: 'docx' | 'pdf' | 'evidence' | 'defense' | 'latex' | 'shareLink',
  addons?: string[]
): Promise<ExportResponse> {
  return apiRequest<ExportResponse>('/export', {
    method: 'POST',
    body: JSON.stringify({ docId, type, addons }),
  });
}

// Error types for component handling
export { ApiError };

// Type guards for API errors
export function isPaymentRequired(error: unknown): boolean {
  return error instanceof ApiError && error.status === 402;
}

export function isPriceExpired(error: unknown): boolean {
  return error instanceof ApiError && error.status === 409;
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof ApiError && error.status >= 500;
}