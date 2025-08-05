import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  SmartModule, 
  SmartModuleEditorState, 
  ModuleRecommendation,
  DependencyRelation,
  SmartModuleLibrary,
  UserPreferences,
  ProgressAnalytics,
  EditorNotification,
  ModuleOperationHistory,
  CollaborationData,
  SmartModuleAnalytics
} from '../types/modular';

interface SmartModuleStore extends SmartModuleEditorState {
  // Core state
  smartModules: SmartModule[];
  recommendations: ModuleRecommendation[];
  dependencies: DependencyRelation[];
  library: SmartModuleLibrary;
  analytics: SmartModuleAnalytics;
  operationHistory: ModuleOperationHistory[];
  collaboration: CollaborationData;
  
  // AI & Intelligence
  aiProcessing: boolean;
  aiInsights: Map<string, any>;
  learningModel: Map<string, number>;
  contextualRecommendations: ModuleRecommendation[];
  
  // Performance & Optimization
  virtualScrollEnabled: boolean;
  lazyLoadingThreshold: number;
  renderOptimization: boolean;
  
  // Actions - Module Management
  createSmartModule: (module: Omit<SmartModule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SmartModule>;
  updateSmartModule: (id: string, updates: Partial<SmartModule>) => Promise<void>;
  deleteSmartModule: (id: string) => Promise<void>;
  duplicateSmartModule: (id: string) => Promise<SmartModule>;
  reorderModules: (moduleIds: string[]) => Promise<void>;
  
  // Actions - AI & Intelligence
  generateModuleContent: (moduleId: string, context?: any) => Promise<string>;
  optimizeModuleContent: (moduleId: string) => Promise<void>;
  analyzeModuleQuality: (moduleId: string) => Promise<number>;
  getModuleRecommendations: (moduleId: string) => Promise<ModuleRecommendation[]>;
  applyRecommendation: (recommendationId: string) => Promise<void>;
  
  // Actions - Dependencies
  analyzeDependencies: () => Promise<DependencyRelation[]>;
  addDependency: (dependency: Omit<DependencyRelation, 'id'>) => Promise<void>;
  removeDependency: (dependencyId: string) => Promise<void>;
  validateDependencies: () => Promise<{ valid: boolean; issues: string[] }>;
  
  // Actions - Search & Discovery
  searchModules: (query: string, filters?: any) => SmartModule[];
  getRelatedModules: (moduleId: string) => SmartModule[];
  getSuggestedModules: (context: any) => SmartModule[];
  
  // Actions - Analytics & Progress
  updateAnalytics: () => Promise<void>;
  getProgressAnalytics: (moduleId?: string) => ProgressAnalytics;
  generateInsights: () => Promise<void>;
  
  // Actions - Collaboration
  inviteCollaborator: (email: string, role: string) => Promise<void>;
  updateCollaborationStatus: (userId: string, status: any) => Promise<void>;
  syncChanges: () => Promise<void>;
  
  // Actions - History & Versioning
  recordOperation: (operation: Omit<ModuleOperationHistory, 'id' | 'timestamp'>) => void;
  undoOperation: () => Promise<void>;
  redoOperation: () => Promise<void>;
  clearHistory: () => void;
  
  // Actions - Notifications
  addNotification: (notification: Omit<EditorNotification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Actions - UI State
  setSmartMode: (enabled: boolean) => void;
  setFocusMode: (enabled: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setLayoutPreference: (layout: 'sidebar' | 'floating' | 'bottom') => void;
  toggleRecommendations: () => void;
  toggleAnalytics: () => void;
  
  // Actions - Performance
  enableVirtualScroll: (enabled: boolean) => void;
  setLazyLoadingThreshold: (threshold: number) => void;
  optimizeRendering: (enabled: boolean) => void;
}

const defaultLibrary: SmartModuleLibrary = {
  categories: [],
  searchIndex: {
    termFrequency: new Map(),
    concepts: new Map(),
    tags: new Map(),
    lastUpdated: new Date()
  },
  userPreferences: {
    favoriteTemplates: [],
    writingStyle: 'academic',
    complexityPreference: 'detailed',
    aiAssistanceLevel: 'moderate',
    preferredModuleTypes: [],
    customSettings: {}
  },
  recentlyUsed: [],
  favorites: []
};

const defaultAnalytics: SmartModuleAnalytics = {
  overview: {
    totalModules: 0,
    completedModules: 0,
    totalWordCount: 0,
    averageQualityScore: 0,
    productivityScore: 0,
    estimatedTimeToCompletion: 0
  },
  moduleMetrics: [],
  trends: [],
  recommendations: [],
  comparisons: []
};

const defaultCollaboration: CollaborationData = {
  activeUsers: [],
  comments: [],
  changes: [],
  permissions: {
    canEdit: true,
    canDelete: true,
    canAddModules: true,
    canManageStructure: true,
    canInviteUsers: false,
    canExport: true
  }
};

export const useSmartModuleStore = create<SmartModuleStore>()(
  persist(
    (set, get) => ({
      // Initial state
      modules: [],
      smartModules: [],
      recommendations: [],
      dependencies: [],
      library: defaultLibrary,
      analytics: defaultAnalytics,
      operationHistory: [],
      collaboration: defaultCollaboration,
      
      // UI State
      selectedModuleId: null,
      draggedModule: null,
      showTemplateLibrary: false,
      showDependencyView: false,
      bulkSelection: [],
      viewMode: 'card',
      sidebarTab: 'structure',
      smartMode: true,
      aiAssistEnabled: true,
      recommendationsVisible: true,
      analyticsVisible: false,
      collaborationMode: 'solo',
      focusMode: false,
      currentTheme: 'light',
      layoutPreference: 'sidebar',
      notifications: [],
      
      // AI & Intelligence
      aiProcessing: false,
      aiInsights: new Map(),
      learningModel: new Map(),
      contextualRecommendations: [],
      
      // Performance
      virtualScrollEnabled: false,
      lazyLoadingThreshold: 50,
      renderOptimization: true,
      
      // Module Management Actions
      createSmartModule: async (moduleData) => {
        const newModule: SmartModule = {
          ...moduleData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          aiScore: 0,
          relevanceScore: 0,
          coherenceScore: 0,
          completionLevel: 'draft',
          aiSuggestions: [],
          smartTags: [],
          contextualData: {
            relatedConcepts: [],
            keyTerms: [],
            readingLevel: 0,
            complexity: 'medium',
            domain: [],
            citations: []
          }
        };
        
        set(state => ({
          smartModules: [...state.smartModules, newModule]
        }));
        
        // Record operation
        get().recordOperation({
          operation: 'create',
          moduleId: newModule.id,
          user: 'current-user',
          details: { module: newModule },
          canUndo: true,
          canRedo: false
        });
        
        // Trigger AI analysis
        setTimeout(() => {
          get().analyzeModuleQuality(newModule.id);
        }, 100);
        
        return newModule;
      },
      
      updateSmartModule: async (id, updates) => {
        const currentModule = get().smartModules.find(m => m.id === id);
        if (!currentModule) return;
        
        const updatedModule = {
          ...currentModule,
          ...updates,
          updatedAt: new Date()
        };
        
        set(state => ({
          smartModules: state.smartModules.map(m => 
            m.id === id ? updatedModule : m
          )
        }));
        
        get().recordOperation({
          operation: 'update',
          moduleId: id,
          user: 'current-user',
          details: { before: currentModule, after: updatedModule },
          canUndo: true,
          canRedo: false
        });
        
        // Trigger quality re-analysis if content changed
        if (updates.content && updates.content !== currentModule.content) {
          setTimeout(() => {
            get().analyzeModuleQuality(id);
          }, 500);
        }
      },
      
      deleteSmartModule: async (id) => {
        const moduleToDelete = get().smartModules.find(m => m.id === id);
        if (!moduleToDelete) return;
        
        set(state => ({
          smartModules: state.smartModules.filter(m => m.id !== id),
          selectedModuleId: state.selectedModuleId === id ? null : state.selectedModuleId
        }));
        
        get().recordOperation({
          operation: 'delete',
          moduleId: id,
          user: 'current-user',
          details: { module: moduleToDelete },
          canUndo: true,
          canRedo: false
        });
      },
      
      duplicateSmartModule: async (id) => {
        const original = get().smartModules.find(m => m.id === id);
        if (!original) throw new Error('Module not found');
        
        return get().createSmartModule({
          ...original,
          title: `${original.title} (Copy)`,
          order: original.order + 0.1
        });
      },
      
      reorderModules: async (moduleIds) => {
        const modules = get().smartModules;
        const reorderedModules = moduleIds.map((id, index) => {
          const module = modules.find(m => m.id === id);
          return module ? { ...module, order: index } : null;
        }).filter(Boolean) as SmartModule[];
        
        set(state => ({
          smartModules: [
            ...reorderedModules,
            ...state.smartModules.filter(m => !moduleIds.includes(m.id))
          ]
        }));
      },
      
      // AI & Intelligence Actions
      generateModuleContent: async (moduleId, context = {}) => {
        set({ aiProcessing: true });
        
        try {
          // Simulate AI content generation
          const module = get().smartModules.find(m => m.id === moduleId);
          if (!module) throw new Error('Module not found');
          
          // This would integrate with your GLM client
          const generatedContent = `Generated content for ${module.title} based on context and requirements...`;
          
          await get().updateSmartModule(moduleId, {
            content: generatedContent,
            aiScore: Math.random() * 30 + 70 // Simulated AI score
          });
          
          return generatedContent;
        } finally {
          set({ aiProcessing: false });
        }
      },
      
      optimizeModuleContent: async (moduleId) => {
        const module = get().smartModules.find(m => m.id === moduleId);
        if (!module) return;
        
        // Simulate content optimization
        const optimizedContent = module.content; // Would use AI to optimize
        
        await get().updateSmartModule(moduleId, {
          content: optimizedContent,
          aiScore: Math.min(module.aiScore + 10, 100)
        });
      },
      
      analyzeModuleQuality: async (moduleId) => {
        const module = get().smartModules.find(m => m.id === moduleId);
        if (!module) return 0;
        
        // Simulate quality analysis
        const qualityScore = Math.random() * 40 + 60;
        const relevanceScore = Math.random() * 30 + 70;
        const coherenceScore = Math.random() * 25 + 75;
        
        await get().updateSmartModule(moduleId, {
          aiScore: qualityScore,
          relevanceScore,
          coherenceScore
        });
        
        return qualityScore;
      },
      
      getModuleRecommendations: async (moduleId) => {
        const module = get().smartModules.find(m => m.id === moduleId);
        if (!module) return [];
        
        // Generate contextual recommendations
        const recommendations: ModuleRecommendation[] = [
          {
            id: crypto.randomUUID(),
            moduleId,
            type: 'content',
            title: 'Enhance introduction clarity',
            description: 'Consider adding more context to improve reader understanding',
            rationale: 'Analysis shows the introduction could benefit from additional background information',
            confidence: 0.8,
            priority: 'medium',
            actionType: 'modify',
            estimatedImpact: 0.15
          }
        ];
        
        set(state => ({
          recommendations: [
            ...state.recommendations.filter(r => r.moduleId !== moduleId),
            ...recommendations
          ]
        }));
        
        return recommendations;
      },
      
      applyRecommendation: async (recommendationId) => {
        const recommendation = get().recommendations.find(r => r.id === recommendationId);
        if (!recommendation) return;
        
        // Apply the recommendation logic here
        // This would depend on the recommendation type and action
        
        set(state => ({
          recommendations: state.recommendations.filter(r => r.id !== recommendationId)
        }));
      },
      
      // Dependencies Actions
      analyzeDependencies: async () => {
        const modules = get().smartModules;
        const dependencies: DependencyRelation[] = [];
        
        // Analyze content for potential dependencies
        modules.forEach(module => {
          modules.forEach(otherModule => {
            if (module.id !== otherModule.id) {
              // Simple dependency detection based on content similarity
              const hasReference = module.content.toLowerCase().includes(otherModule.title.toLowerCase());
              if (hasReference) {
                dependencies.push({
                  id: crypto.randomUUID(),
                  sourceId: module.id,
                  targetId: otherModule.id,
                  type: 'reference',
                  strength: 0.7,
                  isAutoDetected: true,
                  reasoning: `Module "${module.title}" references "${otherModule.title}"`,
                  status: 'suggested'
                });
              }
            }
          });
        });
        
        set({ dependencies });
        return dependencies;
      },
      
      addDependency: async (dependency) => {
        const newDependency: DependencyRelation = {
          ...dependency,
          id: crypto.randomUUID()
        };
        
        set(state => ({
          dependencies: [...state.dependencies, newDependency]
        }));
      },
      
      removeDependency: async (dependencyId) => {
        set(state => ({
          dependencies: state.dependencies.filter(d => d.id !== dependencyId)
        }));
      },
      
      validateDependencies: async () => {
        const dependencies = get().dependencies;
        const modules = get().smartModules;
        const issues: string[] = [];
        
        dependencies.forEach(dep => {
          const sourceExists = modules.some(m => m.id === dep.sourceId);
          const targetExists = modules.some(m => m.id === dep.targetId);
          
          if (!sourceExists) issues.push(`Source module not found for dependency ${dep.id}`);
          if (!targetExists) issues.push(`Target module not found for dependency ${dep.id}`);
        });
        
        return { valid: issues.length === 0, issues };
      },
      
      // Search & Discovery Actions
      searchModules: (query, filters = {}) => {
        const modules = get().smartModules;
        const lowercaseQuery = query.toLowerCase();
        
        return modules.filter(module => {
          const matchesQuery = 
            module.title.toLowerCase().includes(lowercaseQuery) ||
            module.content.toLowerCase().includes(lowercaseQuery) ||
            module.smartTags.some(tag => tag.label.toLowerCase().includes(lowercaseQuery));
          
          // Apply filters if any
          return matchesQuery;
        });
      },
      
      getRelatedModules: (moduleId) => {
        const dependencies = get().dependencies;
        const modules = get().smartModules;
        
        const relatedIds = new Set([
          ...dependencies.filter(d => d.sourceId === moduleId).map(d => d.targetId),
          ...dependencies.filter(d => d.targetId === moduleId).map(d => d.sourceId)
        ]);
        
        return modules.filter(m => relatedIds.has(m.id));
      },
      
      getSuggestedModules: (context) => {
        // This would use AI to suggest relevant modules based on context
        return get().smartModules.slice(0, 5); // Simplified implementation
      },
      
      // Analytics Actions
      updateAnalytics: async () => {
        const modules = get().smartModules;
        const completedModules = modules.filter(m => m.completionLevel === 'complete');
        
        const analytics: SmartModuleAnalytics = {
          overview: {
            totalModules: modules.length,
            completedModules: completedModules.length,
            totalWordCount: modules.reduce((sum, m) => sum + m.wordCount, 0),
            averageQualityScore: modules.reduce((sum, m) => sum + m.aiScore, 0) / modules.length || 0,
            productivityScore: (completedModules.length / modules.length) * 100 || 0,
            estimatedTimeToCompletion: (modules.length - completedModules.length) * 30 // 30 min per module
          },
          moduleMetrics: modules.map(m => ({
            moduleId: m.id,
            wordCount: m.wordCount,
            qualityScore: m.aiScore,
            timeSpent: m.metadata.estimatedTime,
            revisionCount: m.metadata.revisionCount,
            aiInteractions: m.aiSuggestions.length,
            userEngagement: m.progress
          })),
          trends: [],
          recommendations: [],
          comparisons: []
        };
        
        set({ analytics });
      },
      
      getProgressAnalytics: (moduleId) => {
        // Return progress analytics for specific module or overall
        return {
          moduleId: moduleId || 'all',
          writingVelocity: 25, // words per minute
          editingRatio: 0.3,
          consistencyScore: 85,
          focusTime: 120, // minutes
          breakPattern: [15, 30, 45],
          productivityTrends: []
        };
      },
      
      generateInsights: async () => {
        // Generate AI-powered insights about the writing process
        const insights = new Map();
        insights.set('productivity', { score: 85, trend: 'up' });
        insights.set('quality', { score: 78, trend: 'stable' });
        
        set({ aiInsights: insights });
      },
      
      // History & Versioning
      recordOperation: (operation) => {
        const newOperation: ModuleOperationHistory = {
          ...operation,
          id: crypto.randomUUID(),
          timestamp: new Date()
        };
        
        set(state => ({
          operationHistory: [newOperation, ...state.operationHistory.slice(0, 49)] // Keep last 50
        }));
      },
      
      undoOperation: async () => {
        const history = get().operationHistory;
        const lastOperation = history.find(op => op.canUndo);
        if (!lastOperation) return;
        
        // Implement undo logic based on operation type
        // This is a simplified version
        console.log('Undoing operation:', lastOperation);
      },
      
      redoOperation: async () => {
        // Implement redo logic
        console.log('Redo operation');
      },
      
      clearHistory: () => {
        set({ operationHistory: [] });
      },
      
      // Collaboration Actions
      inviteCollaborator: async (email, role) => {
        // Implement collaboration invitation
        console.log('Inviting collaborator:', email, role);
      },
      
      updateCollaborationStatus: async (userId, status) => {
        // Update collaboration status
        console.log('Updating collaboration status:', userId, status);
      },
      
      syncChanges: async () => {
        // Sync changes with other collaborators
        console.log('Syncing changes');
      },
      
      // Notification Actions
      addNotification: (notificationData) => {
        const notification: EditorNotification = {
          ...notificationData,
          id: crypto.randomUUID(),
          createdAt: new Date()
        };
        
        set(state => ({
          notifications: [...state.notifications, notification]
        }));
        
        // Auto-hide if specified
        if (notification.autoHide) {
          setTimeout(() => {
            get().removeNotification(notification.id);
          }, notification.duration);
        }
      },
      
      removeNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },
      
      clearNotifications: () => {
        set({ notifications: [] });
      },
      
      // UI State Actions
      setSmartMode: (enabled) => set({ smartMode: enabled }),
      setFocusMode: (enabled) => set({ focusMode: enabled }),
      setTheme: (theme) => set({ currentTheme: theme }),
      setLayoutPreference: (layout) => set({ layoutPreference: layout }),
      toggleRecommendations: () => set(state => ({ recommendationsVisible: !state.recommendationsVisible })),
      toggleAnalytics: () => set(state => ({ analyticsVisible: !state.analyticsVisible })),
      
      // Performance Actions
      enableVirtualScroll: (enabled) => set({ virtualScrollEnabled: enabled }),
      setLazyLoadingThreshold: (threshold) => set({ lazyLoadingThreshold: threshold }),
      optimizeRendering: (enabled) => set({ renderOptimization: enabled })
    }),
    {
      name: 'smart-module-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        smartModules: state.smartModules,
        library: state.library,
        userPreferences: state.library.userPreferences,
        operationHistory: state.operationHistory.slice(0, 10), // Only persist recent history
        currentTheme: state.currentTheme,
        layoutPreference: state.layoutPreference,
        smartMode: state.smartMode,
        aiAssistEnabled: state.aiAssistEnabled
      })
    }
  )
);