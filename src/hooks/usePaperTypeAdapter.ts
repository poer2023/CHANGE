import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  EnglishPaperType, 
  AcademicLevel, 
  PaperTypeRecommendation, 
  RecommendationInput,
  PaperStructureTemplate,
  PaperTypeContext,
  IntelligentSuggestion,
  PaperQualityAssessment,
  PaperTypeValidation
} from '@/types/paper-types';
import { PaperModule } from '@/types/modular';
import { PaperTypeService } from '@/services/paper-type-service';
import { ModuleStructureGenerator } from '@/services/module-structure-generator';
import { PaperStyleManager } from '@/services/paper-style-config';

// Hook状态接口
interface PaperTypeAdapterState {
  currentPaperType: EnglishPaperType | null;
  currentAcademicLevel: AcademicLevel;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  recommendations: PaperTypeRecommendation[];
  currentTemplate: PaperStructureTemplate | null;
  generatedModules: PaperModule[];
  intelligentSuggestions: IntelligentSuggestion[];
  qualityAssessment: PaperQualityAssessment | null;
  validation: PaperTypeValidation | null;
}

// Hook选项接口
interface PaperTypeAdapterOptions {
  enableAIRecommendations?: boolean;
  enableStyleAdaptation?: boolean;
  enableRealTimeValidation?: boolean;
  autoGenerateModules?: boolean;
  paperId?: string;
  initialPaperType?: EnglishPaperType;
  initialAcademicLevel?: AcademicLevel;
}

export function usePaperTypeAdapter(options: PaperTypeAdapterOptions = {}) {
  const {
    enableAIRecommendations = true,
    enableStyleAdaptation = true,
    enableRealTimeValidation = true,
    autoGenerateModules = true,
    paperId = 'default',
    initialPaperType,
    initialAcademicLevel = 'undergraduate'
  } = options;

  // 服务实例
  const paperTypeService = useMemo(() => new PaperTypeService(), []);
  const moduleGenerator = useMemo(() => new ModuleStructureGenerator(), []);
  const styleManager = useMemo(() => new PaperStyleManager(), []);

  // 状态管理
  const [state, setState] = useState<PaperTypeAdapterState>({
    currentPaperType: initialPaperType || null,
    currentAcademicLevel: initialAcademicLevel,
    isInitialized: false,
    isLoading: false,
    error: null,
    recommendations: [],
    currentTemplate: null,
    generatedModules: [],
    intelligentSuggestions: [],
    qualityAssessment: null,
    validation: null
  });

  /**
   * 初始化适配器
   */
  const initializeAdapter = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // 如果有初始论文类型，生成对应的模块结构
      if (initialPaperType) {
        const template = moduleGenerator.generateStructure(
          initialPaperType,
          initialAcademicLevel
        );
        
        const modules = autoGenerateModules 
          ? moduleGenerator.convertTemplateToModules(template, paperId)
          : [];

        setState(prev => ({
          ...prev,
          currentTemplate: template,
          generatedModules: modules,
          isInitialized: true,
          isLoading: false
        }));

        // 应用样式
        if (enableStyleAdaptation) {
          styleManager.applyStyles(initialPaperType);
        }
      } else {
        setState(prev => ({
          ...prev,
          isInitialized: true,
          isLoading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Initialization failed',
        isLoading: false
      }));
    }
  }, [initialPaperType, initialAcademicLevel, moduleGenerator, styleManager, paperId, autoGenerateModules, enableStyleAdaptation]);

  /**
   * 设置论文类型
   */
  const setPaperType = useCallback(async (
    paperType: EnglishPaperType,
    academicLevel?: AcademicLevel,
    customOptions?: {
      targetWordCount?: number;
      citationStyle?: string;
      includeOptionalSections?: boolean;
    }
  ) => {
    const level = academicLevel || state.currentAcademicLevel;
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // 生成新的模块结构
      const template = moduleGenerator.generateStructure(
        paperType,
        level,
        customOptions
      );

      const modules = autoGenerateModules
        ? moduleGenerator.convertTemplateToModules(template, paperId)
        : [];

      // 验证论文类型选择
      let validation: PaperTypeValidation | null = null;
      if (enableRealTimeValidation) {
        validation = paperTypeService.validatePaperTypeSelection(
          paperType,
          level,
          customOptions?.targetWordCount
        );
      }

      setState(prev => ({
        ...prev,
        currentPaperType: paperType,
        currentAcademicLevel: level,
        currentTemplate: template,
        generatedModules: modules,
        validation,
        isLoading: false
      }));

      // 应用样式
      if (enableStyleAdaptation) {
        styleManager.applyStyles(paperType);
      }

      return { template, modules, validation };
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to set paper type',
        isLoading: false
      }));
      throw error;
    }
  }, [state.currentAcademicLevel, moduleGenerator, styleManager, paperId, autoGenerateModules, enableStyleAdaptation, enableRealTimeValidation, paperTypeService]);

  /**
   * 获取AI推荐
   */
  const getRecommendations = useCallback(async (input: RecommendationInput) => {
    if (!enableAIRecommendations) {
      return [];
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const recommendations = await paperTypeService.recommendPaperTypes(input);
      setState(prev => ({
        ...prev,
        recommendations,
        isLoading: false
      }));
      return recommendations;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to get recommendations',
        isLoading: false
      }));
      return [];
    }
  }, [enableAIRecommendations, paperTypeService]);

  /**
   * 应用推荐的论文类型
   */
  const applyRecommendation = useCallback(async (recommendation: PaperTypeRecommendation) => {
    return setPaperType(recommendation.paperType, recommendation.suggestedAcademicLevel);
  }, [setPaperType]);

  /**
   * 更新学术层次
   */
  const setAcademicLevel = useCallback(async (level: AcademicLevel) => {
    if (state.currentPaperType) {
      return setPaperType(state.currentPaperType, level);
    } else {
      setState(prev => ({ ...prev, currentAcademicLevel: level }));
    }
  }, [state.currentPaperType, setPaperType]);

  /**
   * 重新生成模块结构
   */
  const regenerateModules = useCallback(async (customOptions?: {
    targetWordCount?: number;
    citationStyle?: string;
    includeOptionalSections?: boolean;
  }) => {
    if (!state.currentPaperType) {
      throw new Error('No paper type selected');
    }

    return setPaperType(state.currentPaperType, state.currentAcademicLevel, customOptions);
  }, [state.currentPaperType, state.currentAcademicLevel, setPaperType]);

  /**
   * 获取当前样式配置
   */
  const getStyleConfig = useCallback(() => {
    if (!state.currentPaperType) {
      return null;
    }
    return styleManager.getStyleConfig(state.currentPaperType);
  }, [state.currentPaperType, styleManager]);

  /**
   * 获取当前格式配置
   */
  const getFormatConfig = useCallback(() => {
    if (!state.currentPaperType) {
      return null;
    }
    return styleManager.getFormatConfig(state.currentPaperType, state.currentAcademicLevel);
  }, [state.currentPaperType, state.currentAcademicLevel, styleManager]);

  /**
   * 获取模块卡片样式类
   */
  const getModuleCardClasses = useCallback(() => {
    if (!state.currentPaperType) {
      return 'bg-gray-50 border-gray-200';
    }
    return styleManager.getModuleCardClasses(state.currentPaperType);
  }, [state.currentPaperType, styleManager]);

  /**
   * 获取写作区域样式类
   */
  const getWritingAreaClasses = useCallback(() => {
    if (!state.currentPaperType) {
      return 'bg-white border-gray-200';
    }
    return styleManager.getWritingAreaClasses(state.currentPaperType);
  }, [state.currentPaperType, styleManager]);

  /**
   * 验证当前配置
   */
  const validateCurrentConfiguration = useCallback(async () => {
    if (!state.currentPaperType) {
      return null;
    }

    const validation = paperTypeService.validatePaperTypeSelection(
      state.currentPaperType,
      state.currentAcademicLevel
    );

    setState(prev => ({ ...prev, validation }));
    return validation;
  }, [state.currentPaperType, state.currentAcademicLevel, paperTypeService]);

  /**
   * 重置适配器状态
   */
  const resetAdapter = useCallback(() => {
    setState({
      currentPaperType: null,
      currentAcademicLevel: 'undergraduate',
      isInitialized: false,
      isLoading: false,
      error: null,
      recommendations: [],
      currentTemplate: null,
      generatedModules: [],
      intelligentSuggestions: [],
      qualityAssessment: null,
      validation: null
    });
  }, []);

  /**
   * 导出当前配置
   */
  const exportConfiguration = useCallback(() => {
    return {
      paperType: state.currentPaperType,
      academicLevel: state.currentAcademicLevel,
      template: state.currentTemplate,
      modules: state.generatedModules,
      styleConfig: getStyleConfig(),
      formatConfig: getFormatConfig(),
      validation: state.validation
    };
  }, [state, getStyleConfig, getFormatConfig]);

  /**
   * 从配置导入
   */
  const importConfiguration = useCallback(async (config: {
    paperType: EnglishPaperType;
    academicLevel: AcademicLevel;
    customOptions?: any;
  }) => {
    return setPaperType(config.paperType, config.academicLevel, config.customOptions);
  }, [setPaperType]);

  // 计算衍生状态
  const isReady = state.isInitialized && !state.isLoading && !state.error;
  const hasValidConfiguration = state.currentPaperType && state.currentTemplate;
  const needsConfiguration = !state.currentPaperType;

  // 上下文对象（用于AI助手）
  const paperTypeContext: PaperTypeContext | null = useMemo(() => {
    if (!state.currentPaperType) return null;
    
    return {
      paperType: state.currentPaperType,
      academicLevel: state.currentAcademicLevel,
      completedModules: state.generatedModules
        .filter(m => m.isCompleted)
        .map(m => m.id),
      totalProgress: state.generatedModules.length > 0
        ? state.generatedModules.reduce((sum, m) => sum + m.progress, 0) / state.generatedModules.length
        : 0,
      userPreferences: {
        preferredCitationStyle: 'APA',
        writingStyle: 'formal',
        complexityLevel: state.currentAcademicLevel === 'undergraduate' ? 'simple' : 'moderate',
        feedbackFrequency: 'moderate',
        languageSupport: 'native'
      },
      documentMetadata: {
        wordCount: state.generatedModules.reduce((sum, m) => sum + m.wordCount, 0),
        pageCount: Math.ceil(state.generatedModules.reduce((sum, m) => sum + m.wordCount, 0) / 250),
        lastModified: new Date(),
        version: '1.0.0',
        collaborators: [],
        reviewStatus: 'draft'
      }
    };
  }, [state.currentPaperType, state.currentAcademicLevel, state.generatedModules]);

  // 初始化效果
  useEffect(() => {
    if (!state.isInitialized) {
      initializeAdapter();
    }
  }, [initializeAdapter, state.isInitialized]);

  // 返回Hook接口
  return {
    // 状态
    ...state,
    isReady,
    hasValidConfiguration,
    needsConfiguration,
    paperTypeContext,

    // 方法
    setPaperType,
    setAcademicLevel,
    getRecommendations,
    applyRecommendation,
    regenerateModules,
    validateCurrentConfiguration,
    resetAdapter,
    exportConfiguration,
    importConfiguration,

    // 样式方法
    getStyleConfig,
    getFormatConfig,
    getModuleCardClasses,
    getWritingAreaClasses,

    // 工具方法
    initializeAdapter
  };
}