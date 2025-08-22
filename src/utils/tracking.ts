// Comprehensive event tracking utilities and schema
// Provides structured tracking for analytics and user behavior analysis

export interface BaseTrackingEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: number;
  category: TrackingCategory;
  subcategory?: string;
  userId?: string;
  sessionId?: string;
}

export type TrackingCategory = 
  | 'page_view'           // Page navigation and views
  | 'user_action'         // User interactions and clicks
  | 'writing_flow'        // Writing flow progression
  | 'payment'             // Payment and pricing interactions
  | 'document'            // Document generation and management
  | 'ai_assistant'        // AI assistant interactions
  | 'export'              // Export and download actions
  | 'error'               // Error states and issues
  | 'performance'         // Performance and timing metrics
  | 'engagement';         // User engagement metrics

export interface TrackingSchema {
  // Page Views
  'page_view': {
    page: string;
    path: string;
    referrer?: string;
    fromAutopilot?: boolean;
    userAgent?: string;
  };

  // Writing Flow Events
  'step_enter': {
    step: 'topic' | 'research' | 'strategy' | 'outline' | 'content';
    previousStep?: string;
    timeSpent?: number;
  };
  
  'step_complete': {
    step: 'topic' | 'research' | 'strategy' | 'outline' | 'content';
    data: Record<string, any>;
    timeSpent: number;
    isAutosave?: boolean;
  };

  'form_field_change': {
    step: string;
    field: string;
    value: any;
    previousValue?: any;
    inputMethod?: 'typing' | 'selection' | 'upload';
  };

  'form_validation_error': {
    step: string;
    field: string;
    error: string;
    value: any;
  };

  'draft_save': {
    step: string;
    trigger: 'manual' | 'auto' | 'navigation';
    dataSize: number;
  };

  // Estimation and Pricing
  'estimate_request': {
    step1Data: Record<string, any>;
    requestId: string;
  };

  'estimate_received': {
    priceRange: [number, number];
    citesRange: [number, number];
    etaMinutes: [number, number];
    verifyLevel: string;
    assumptions: string[];
    requestId: string;
    responseTime: number;
  };

  'verify_level_change': {
    previousLevel: string;
    newLevel: string;
    priceImpact: number;
  };

  'preview_sample_click': {
    context: string;
    sampleType?: string;
  };

  // Autopilot Events
  'autopilot_start': {
    verifyLevel: string;
    allowPreprint: boolean;
    useStyle: boolean;
    taskId: string;
    estimatedPrice: number;
  };

  'autopilot_progress': {
    step: string;
    progress: number;
    stats?: {
      hits: number;
      verified: number;
      sections: number;
    };
    timeElapsed: number;
  };

  'autopilot_pause': {
    step: string;
    progress: number;
    reason?: 'user' | 'error' | 'system';
  };

  'autopilot_resume': {
    step: string;
    progress: number;
    pauseDuration: number;
  };

  'autopilot_stop': {
    step: string;
    progress: number;
    reason: 'user' | 'error' | 'completed';
    totalTime: number;
  };

  'autopilot_complete': {
    docId: string;
    totalTime: number;
    finalStats: {
      hits: number;
      verified: number;
      sections: number;
    };
  };

  'autopilot_error': {
    step: string;
    error: string;
    progress: number;
    timeElapsed: number;
  };

  'autopilot_minimize': {
    minimized: boolean;
    step: string;
  };

  // Payment Gates
  'gate1_triggered': {
    docId: string;
    price: number;
    expiresAt: number;
    benefits: string[];
  };

  'gate1_preview_only': {
    docId: string;
    price: number;
    reason?: string;
  };

  'gate1_unlock_attempt': {
    docId: string;
    price: number;
    paymentMethod?: string;
  };

  'gate1_unlock_success': {
    docId: string;
    price: number;
    paymentId: string;
    paymentTime: number;
  };

  'gate1_unlock_failed': {
    docId: string;
    price: number;
    error: string;
    retryAttempt: number;
  };

  'gate2_triggered': {
    docId: string;
    missingAddons: string[];
    totalPrice: number;
  };

  'gate2_addon_toggle': {
    addon: string;
    enabled: boolean;
    price: number;
  };

  'gate2_purchase_attempt': {
    docId: string;
    selectedAddons: string[];
    totalPrice: number;
  };

  'gate2_purchase_success': {
    docId: string;
    purchasedAddons: string[];
    totalPrice: number;
    paymentId: string;
  };

  'gate2_purchase_failed': {
    docId: string;
    selectedAddons: string[];
    error: string;
    retryAttempt: number;
  };

  'price_lock': {
    value: number;
    currency: string;
    expiresAt: number;
    context: string;
  };

  // Document Generation
  'generation_start': {
    docId: string;
    streamId?: string;
    trigger: 'manual' | 'autopilot' | 'auto';
    generationType: 'full' | 'section' | 'revision';
  };

  'generation_progress': {
    docId: string;
    streamId: string;
    progress: number;
    currentSection?: string;
    wordsGenerated: number;
    citesAdded: number;
  };

  'generation_complete': {
    docId: string;
    streamId: string;
    totalTime: number;
    wordsGenerated: number;
    citesAdded: number;
    sectionsGenerated: number;
  };

  'generation_error': {
    docId: string;
    streamId?: string;
    error: string;
    stage: string;
    retryable: boolean;
  };

  'generation_retry': {
    docId: string;
    previousError: string;
    retryAttempt: number;
  };

  'streaming_start': {
    docId: string;
    streamId: string;
    streamType: 'generation' | 'autopilot';
  };

  'streaming_chunk_received': {
    streamId: string;
    chunkSize: number;
    totalReceived: number;
    latency: number;
  };

  'streaming_complete': {
    streamId: string;
    totalChunks: number;
    totalBytes: number;
    duration: number;
    averageLatency: number;
  };

  'streaming_error': {
    streamId: string;
    error: string;
    chunksReceived: number;
    retryable: boolean;
  };

  // Export and Downloads
  'export_attempt': {
    docId: string;
    format: 'docx' | 'pdf' | 'latex';
    addons?: string[];
    fileSize?: number;
  };

  'export_success': {
    docId: string;
    format: 'docx' | 'pdf' | 'latex';
    fileSize: number;
    processingTime: number;
    downloadUrl?: string;
  };

  'export_error': {
    docId: string;
    format: 'docx' | 'pdf' | 'latex';
    error: string;
    retryable: boolean;
  };

  'download_click': {
    docId: string;
    format: string;
    fileSize: number;
    source: 'export_success' | 'deck_tabs' | 'result_card';
  };

  'share_link_copy': {
    docId: string;
    shareUrl: string;
    context: string;
  };

  // AI Assistant Events
  'ai_chat_start': {
    docId?: string;
    context: string;
    initialMessage?: string;
  };

  'ai_message_sent': {
    docId?: string;
    messageLength: number;
    messageType: 'text' | 'command' | 'question';
    hasAttachments: boolean;
  };

  'ai_response_received': {
    docId?: string;
    responseLength: number;
    responseTime: number;
    responseType: 'text' | 'suggestion' | 'edit' | 'error';
  };

  'ai_suggestion_accepted': {
    docId: string;
    suggestionType: 'edit' | 'addition' | 'revision';
    affectedSections: string[];
  };

  'ai_suggestion_rejected': {
    docId: string;
    suggestionType: string;
    reason?: string;
  };

  // Agent Panel Events  
  'agent_command_submit': {
    docId?: string;
    command: string;
    commandLength: number;
    scope: string;
  };

  'agent_plan_generated': {
    docId?: string;
    planId: string;
    stepsCount: number;
    estimatedTime: string;
    commandType: string;
  };

  'agent_plan_apply': {
    docId?: string;
    planId: string;
    stepsCount: number;
    executionTime: number;
  };

  'agent_operation_success': {
    docId?: string;
    operationId: string;
    operationType: string;
    executionTime: number;
    changedFiles: number;
  };

  'agent_operation_failed': {
    docId?: string;
    operationId: string;
    error: string;
    partialSuccess: boolean;
    failedSteps: number;
  };

  'agent_undo': {
    operationId: string;
    undoTime: number;
    success: boolean;
  };

  'agent_recipe_save': {
    recipeName: string;
    command: string;
    stepsCount: number;
  };

  // Navigation and UI Events
  'navigation': {
    from: string;
    to: string;
    method: 'click' | 'programmatic' | 'browser';
    timeOnPage: number;
  };

  'tab_change': {
    tabGroup: string;
    previousTab: string;
    newTab: string;
    context: string;
  };

  'modal_open': {
    modalType: string;
    trigger: string;
    context?: string;
  };

  'modal_close': {
    modalType: string;
    method: 'button' | 'overlay' | 'escape' | 'programmatic';
    timeOpen: number;
  };

  'tooltip_show': {
    tooltipId: string;
    trigger: 'hover' | 'click' | 'focus';
    context: string;
  };

  'help_section_view': {
    section: string;
    step: string;
    method: 'click' | 'scroll';
  };

  // Error and Performance Events
  'error_occurred': {
    errorType: 'network' | 'validation' | 'server' | 'client' | 'permission';
    errorCode?: string;
    errorMessage: string;
    context: string;
    userAgent: string;
    stack?: string;
  };

  'error_recovery': {
    originalError: string;
    recoveryMethod: 'retry' | 'fallback' | 'user_action';
    recoveryTime: number;
    success: boolean;
  };

  'performance_metric': {
    metric: 'page_load' | 'api_response' | 'render_time' | 'bundle_size';
    value: number;
    context: string;
    threshold?: number;
  };

  'slow_operation': {
    operation: string;
    duration: number;
    expectedDuration: number;
    context: string;
  };

  // Engagement and Session Events
  'session_start': {
    sessionId: string;
    userAgent: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };

  'session_activity': {
    sessionId: string;
    activityType: 'click' | 'scroll' | 'type' | 'focus' | 'idle';
    timestamp: number;
  };

  'session_end': {
    sessionId: string;
    duration: number;
    pageViews: number;
    interactions: number;
    completedSteps: number;
    exitPage: string;
  };

  'user_idle': {
    idleDuration: number;
    lastActivity: string;
    context: string;
  };

  'user_return': {
    idleDuration: number;
    returnTrigger: 'mouse' | 'keyboard' | 'focus';
    context: string;
  };

  'feature_discovery': {
    feature: string;
    discoveryMethod: 'tooltip' | 'guide' | 'exploration';
    timeToDiscover: number;
  };

  'feature_usage': {
    feature: string;
    usageCount: number;
    lastUsed: number;
    proficiency: 'beginner' | 'intermediate' | 'advanced';
  };
}

// Type-safe tracking event creator
export function createTrackingEvent<T extends keyof TrackingSchema>(
  event: T,
  properties: TrackingSchema[T],
  category: TrackingCategory,
  subcategory?: string
): BaseTrackingEvent {
  return {
    event,
    properties,
    category,
    subcategory,
    timestamp: Date.now()
  };
}

// Tracking helper functions
export class TrackingUtils {
  private static sessionId: string = Math.random().toString(36).substr(2, 9);
  private static sessionStartTime: number = Date.now();
  private static pageLoadTime: number = Date.now();
  private static lastActivityTime: number = Date.now();
  private static interactionCount: number = 0;

  // Session management
  static getSessionId(): string {
    return this.sessionId;
  }

  static getSessionDuration(): number {
    return Date.now() - this.sessionStartTime;
  }

  static updateActivity(): void {
    this.lastActivityTime = Date.now();
    this.interactionCount++;
  }

  static getTimeSinceLastActivity(): number {
    return Date.now() - this.lastActivityTime;
  }

  static getInteractionCount(): number {
    return this.interactionCount;
  }

  // Common property enrichers
  static enrichWithSession(properties: Record<string, any>): Record<string, any> {
    return {
      ...properties,
      sessionId: this.getSessionId(),
      sessionDuration: this.getSessionDuration(),
      interactionCount: this.getInteractionCount()
    };
  }

  static enrichWithUserAgent(properties: Record<string, any>): Record<string, any> {
    return {
      ...properties,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  static enrichWithPerformance(properties: Record<string, any>): Record<string, any> {
    const performance = window.performance;
    return {
      ...properties,
      pageLoadTime: this.pageLoadTime,
      connectionType: (navigator as any).connection?.effectiveType,
      memoryUsage: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : undefined
    };
  }

  // Error tracking helpers
  static captureError(error: Error, context: string): BaseTrackingEvent {
    return createTrackingEvent('error_occurred', {
      errorType: 'client',
      errorMessage: error.message,
      context,
      userAgent: navigator.userAgent,
      stack: error.stack
    }, 'error');
  }

  // Performance tracking helpers
  static trackPageLoad(page: string): BaseTrackingEvent {
    const loadTime = Date.now() - this.pageLoadTime;
    return createTrackingEvent('performance_metric', {
      metric: 'page_load',
      value: loadTime,
      context: page
    }, 'performance');
  }

  static trackApiResponse(endpoint: string, duration: number): BaseTrackingEvent {
    return createTrackingEvent('performance_metric', {
      metric: 'api_response',
      value: duration,
      context: endpoint,
      threshold: 2000 // 2 second threshold
    }, 'performance');
  }

  // Form tracking helpers
  static trackFormFieldChange<T extends keyof TrackingSchema>(
    step: string,
    field: string,
    value: any,
    previousValue?: any
  ): BaseTrackingEvent {
    return createTrackingEvent('form_field_change', {
      step,
      field,
      value,
      previousValue,
      inputMethod: 'typing'
    }, 'writing_flow', 'form_interaction');
  }

  // Navigation tracking helpers
  static trackNavigation(from: string, to: string, timeOnPage: number): BaseTrackingEvent {
    return createTrackingEvent('navigation', {
      from,
      to,
      method: 'click',
      timeOnPage
    }, 'page_view', 'navigation');
  }
}

// Event batch manager for efficient tracking
export class TrackingBatch {
  private static events: BaseTrackingEvent[] = [];
  private static flushTimer: NodeJS.Timeout | null = null;
  private static readonly BATCH_SIZE = 10;
  private static readonly FLUSH_INTERVAL = 5000; // 5 seconds

  static addEvent(event: BaseTrackingEvent): void {
    this.events.push(event);
    
    if (this.events.length >= this.BATCH_SIZE) {
      this.flush();
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), this.FLUSH_INTERVAL);
    }
  }

  static flush(): void {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];
    
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    // Send events to analytics service
    this.sendEvents(eventsToSend);
  }

  private static sendEvents(events: BaseTrackingEvent[]): void {
    // In development, log events
    if (import.meta.env.DEV) {
      console.group('📊 Analytics Batch:', events.length, 'events');
      events.forEach(event => {
        console.log(`[${event.category}] ${event.event}:`, event.properties);
      });
      console.groupEnd();
    }

    // TODO: Send to actual analytics service
    // Example: fetch('/api/analytics/batch', { method: 'POST', body: JSON.stringify(events) })
  }

  static forceFlush(): void {
    this.flush();
  }
}

// Initialize session tracking
if (typeof window !== 'undefined') {
  // Track session start
  TrackingBatch.addEvent(createTrackingEvent('session_start', {
    sessionId: TrackingUtils.getSessionId(),
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    // Extract UTM parameters if present
    utmSource: new URLSearchParams(window.location.search).get('utm_source') || undefined,
    utmMedium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
    utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined
  }, 'engagement'));

  // Track user activity
  ['click', 'scroll', 'keydown', 'focus'].forEach(eventType => {
    document.addEventListener(eventType, () => {
      TrackingUtils.updateActivity();
    }, { passive: true });
  });

  // Track session end on page unload
  window.addEventListener('beforeunload', () => {
    TrackingBatch.addEvent(createTrackingEvent('session_end', {
      sessionId: TrackingUtils.getSessionId(),
      duration: TrackingUtils.getSessionDuration(),
      pageViews: 1, // This should be tracked properly
      interactions: TrackingUtils.getInteractionCount(),
      completedSteps: 0, // This should be tracked properly
      exitPage: window.location.pathname
    }, 'engagement'));
    
    TrackingBatch.forceFlush();
  });

  // Track idle/return behavior
  let idleTimer: NodeJS.Timeout;
  const IDLE_THRESHOLD = 30000; // 30 seconds

  const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      TrackingBatch.addEvent(createTrackingEvent('user_idle', {
        idleDuration: IDLE_THRESHOLD,
        lastActivity: 'unknown',
        context: window.location.pathname
      }, 'engagement'));
    }, IDLE_THRESHOLD);
  };

  document.addEventListener('mousemove', resetIdleTimer, { passive: true });
  document.addEventListener('keypress', resetIdleTimer, { passive: true });
  resetIdleTimer();
}