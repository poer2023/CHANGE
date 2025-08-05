import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSmartModuleStore } from '../store/smartModuleStore';
import { SmartModule, ModuleRecommendation, DependencyRelation } from '../types/modular';
import { useContentAnalysis } from '../hooks/useContentAnalysis';

interface SmartModuleContextValue {
  // State
  modules: SmartModule[];
  recommendations: ModuleRecommendation[];
  dependencies: DependencyRelation[];
  selectedModule: SmartModule | null;
  aiProcessing: boolean;
  smartMode: boolean;
  
  // Actions
  createModule: (moduleData: Omit<SmartModule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SmartModule>;
  updateModule: (id: string, updates: Partial<SmartModule>) => Promise<void>;
  deleteModule: (id: string) => Promise<void>;
  selectModule: (id: string | null) => void;
  
  // AI Actions
  generateContent: (moduleId: string, context?: any) => Promise<string>;
  optimizeContent: (moduleId: string) => Promise<void>;
  getRecommendations: (moduleId: string) => Promise<ModuleRecommendation[]>;
  applyRecommendation: (recommendationId: string) => Promise<void>;
  
  // Search & Discovery
  searchModules: (query: string) => SmartModule[];
  getRelatedModules: (moduleId: string) => SmartModule[];
  
  // Analytics
  getModuleAnalytics: (moduleId?: string) => any;
  updateAnalytics: () => Promise<void>;
}

const SmartModuleContext = createContext<SmartModuleContextValue | null>(null);

interface SmartModuleProviderProps {
  children: ReactNode;
  enableAutoSave?: boolean;
  autoSaveInterval?: number;
  enableAnalytics?: boolean;
  enableAI?: boolean;
}

export const SmartModuleProvider: React.FC<SmartModuleProviderProps> = ({
  children,
  enableAutoSave = true,
  autoSaveInterval = 5000,
  enableAnalytics = true,
  enableAI = true
}) => {
  const store = useSmartModuleStore();
  const { analyzeContent } = useContentAnalysis();
  
  // Auto-save functionality
  useEffect(() => {
    if (!enableAutoSave) return;
    
    const autoSaveTimer = setInterval(() => {
      // Auto-save logic here
      const hasUnsavedChanges = store.smartModules.some(module => 
        new Date().getTime() - module.updatedAt.getTime() < autoSaveInterval
      );
      
      if (hasUnsavedChanges) {
        console.log('Auto-saving modules...');
        // Implement auto-save to backend
      }
    }, autoSaveInterval);
    
    return () => clearInterval(autoSaveTimer);
  }, [enableAutoSave, autoSaveInterval, store.smartModules]);
  
  // Analytics updates
  useEffect(() => {
    if (!enableAnalytics) return;
    
    const analyticsTimer = setInterval(() => {
      store.updateAnalytics();
      store.generateInsights();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(analyticsTimer);
  }, [enableAnalytics, store]);
  
  // Dependency analysis
  useEffect(() => {
    const dependencyTimer = setTimeout(() => {
      store.analyzeDependencies();
    }, 2000);
    
    return () => clearTimeout(dependencyTimer);
  }, [store.smartModules, store]);
  
  // Enhanced create module with AI integration
  const createModule = async (moduleData: Omit<SmartModule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const module = await store.createSmartModule(moduleData);
    
    if (enableAI && module.content) {
      // Analyze content quality
      setTimeout(async () => {
        try {
          const analysis = await analyzeContent(module.content, module.type);
          await store.updateSmartModule(module.id, {
            aiScore: analysis.qualityScore || 0,
            contextualData: {
              ...module.contextualData,
              keyTerms: analysis.keyTerms || [],
              complexity: analysis.complexity || 'medium',
              readingLevel: analysis.readabilityScore || 0
            }
          });
        } catch (error) {
          console.error('Failed to analyze module content:', error);
        }
      }, 500);
    }
    
    return module;
  };
  
  // Enhanced update module with smart analysis
  const updateModule = async (id: string, updates: Partial<SmartModule>) => {
    await store.updateSmartModule(id, updates);
    
    // If content changed, trigger AI analysis
    if (enableAI && updates.content) {
      setTimeout(async () => {
        try {
          const module = store.smartModules.find(m => m.id === id);
          if (module) {
            const analysis = await analyzeContent(updates.content, module.type);
            await store.updateSmartModule(id, {
              aiScore: analysis.qualityScore || module.aiScore,
              relevanceScore: analysis.relevanceScore || module.relevanceScore,
              coherenceScore: analysis.coherenceScore || module.coherenceScore,
              contextualData: {
                ...module.contextualData,
                keyTerms: analysis.keyTerms || module.contextualData.keyTerms,
                complexity: analysis.complexity || module.contextualData.complexity,
                readingLevel: analysis.readabilityScore || module.contextualData.readingLevel
              }
            });
            
            // Get new recommendations
            store.getModuleRecommendations(id);
          }
        } catch (error) {
          console.error('Failed to analyze updated content:', error);
        }
      }, 1000);
    }
  };
  
  // Enhanced delete with dependency checking
  const deleteModule = async (id: string) => {
    const dependencies = store.dependencies.filter(
      dep => dep.sourceId === id || dep.targetId === id
    );
    
    if (dependencies.length > 0) {
      store.addNotification({
        type: 'warning',
        title: 'Module has dependencies',
        message: `This module is connected to ${dependencies.length} other modules. Deleting it may affect document structure.`,
        autoHide: false,
        duration: 0,
        action: {
          label: 'Delete anyway',
          handler: () => store.deleteSmartModule(id),
          style: 'danger'
        }
      });
    } else {
      await store.deleteSmartModule(id);
    }
  };
  
  // Smart content generation with context awareness  
  const generateContent = async (moduleId: string, context: any = {}) => {
    const module = store.smartModules.find(m => m.id === moduleId);
    if (!module) throw new Error('Module not found');
    
    // Get related modules for context
    const relatedModules = store.getRelatedModules(moduleId);
    const previousModules = store.smartModules
      .filter(m => m.order < module.order)
      .slice(-2); // Last 2 modules for context
    
    const enhancedContext = {
      ...context,
      moduleType: module.type,
      relatedContent: relatedModules.map(m => ({ title: m.title, content: m.content.slice(0, 200) })),
      previousContent: previousModules.map(m => ({ title: m.title, content: m.content.slice(0, 100) })),
      userPreferences: store.library.userPreferences,
      targetComplexity: module.contextualData.complexity
    };
    
    return store.generateModuleContent(moduleId, enhancedContext);
  };
  
  // Smart search with AI-powered relevance
  const searchModules = (query: string) => {
    const basicResults = store.searchModules(query);
    
    // Enhance with AI relevance scoring if enabled
    if (enableAI && basicResults.length > 0) {
      return basicResults.sort((a, b) => {
        // Simple relevance scoring based on multiple factors
        const aScore = a.relevanceScore + (a.aiScore * 0.3) + (a.smartTags.length * 5);
        const bScore = b.relevanceScore + (b.aiScore * 0.3) + (b.smartTags.length * 5);
        return bScore - aScore;
      });
    }
    
    return basicResults;
  };
  
  // Get analytics with caching
  const getModuleAnalytics = (moduleId?: string) => {
    if (moduleId) {
      return store.getProgressAnalytics(moduleId);
    }
    return store.analytics;
  };
  
  const contextValue: SmartModuleContextValue = {
    // State
    modules: store.smartModules,
    recommendations: store.recommendations,
    dependencies: store.dependencies,
    selectedModule: store.selectedModuleId 
      ? store.smartModules.find(m => m.id === store.selectedModuleId) || null
      : null,
    aiProcessing: store.aiProcessing,
    smartMode: store.smartMode,
    
    // Actions
    createModule,
    updateModule,
    deleteModule,
    selectModule: (id) => store.selectedModuleId = id,
    
    // AI Actions
    generateContent,
    optimizeContent: store.optimizeModuleContent,
    getRecommendations: store.getModuleRecommendations,
    applyRecommendation: store.applyRecommendation,
    
    // Search & Discovery
    searchModules,
    getRelatedModules: store.getRelatedModules,
    
    // Analytics
    getModuleAnalytics,
    updateAnalytics: store.updateAnalytics
  };
  
  return (
    <SmartModuleContext.Provider value={contextValue}>
      {children}
    </SmartModuleContext.Provider>
  );
};

export const useSmartModule = () => {
  const context = useContext(SmartModuleContext);
  if (!context) {
    throw new Error('useSmartModule must be used within a SmartModuleProvider');
  }
  return context;
};

// Hook for accessing the raw store when needed
export const useSmartModuleStore = () => {
  return useSmartModuleStore();
};

// Performance hook for large datasets
export const useSmartModulePerformance = () => {
  const store = useSmartModuleStore();
  
  const enableVirtualScrolling = (threshold: number = 50) => {
    if (store.smartModules.length > threshold) {
      store.enableVirtualScroll(true);
    }
  };
  
  const optimizeForLargeDatasets = () => {
    store.setLazyLoadingThreshold(100);
    store.optimizeRendering(true);
    enableVirtualScrolling();
  };
  
  return {
    enableVirtualScrolling,
    optimizeForLargeDatasets,
    moduleCount: store.smartModules.length,
    isOptimized: store.renderOptimization
  };
};