/**
 * 论文模板管理系统 - 集成服务
 * 统一管理所有论文类型的模板和相关功能
 */

import { 
  EnglishPaperType, 
  AcademicLevel, 
  PaperStructureTemplate,
  PaperModuleTemplate,
  WritingGuidance,
  PaperTypeRecommendation,
  RecommendationInput
} from '@/types/paper-types';
import { PaperTemplateService } from './paper-templates';
import { PaperTypeService } from './paper-type-service';

/**
 * 集成的论文模板管理服务
 * 提供完整的模板管理、推荐和适配功能
 */
export class IntegratedPaperTemplateManager {
  private templateService: PaperTemplateService;
  private typeService: PaperTypeService;

  constructor() {
    this.templateService = new PaperTemplateService();
    this.typeService = new PaperTypeService();
  }

  /**
   * 获取指定论文类型和学术层次的模板
   */
  getTemplate(paperType: EnglishPaperType, academicLevel: AcademicLevel): PaperStructureTemplate | null {
    return this.templateService.getTemplate(paperType, academicLevel);
  }

  /**
   * 获取所有可用模板
   */
  getAllTemplates(): PaperStructureTemplate[] {
    return this.templateService.getAllTemplates();
  }

  /**
   * 获取特定论文类型的所有模板
   */
  getTemplatesByPaperType(paperType: EnglishPaperType): PaperStructureTemplate[] {
    return this.templateService.getTemplatesByPaperType(paperType);
  }

  /**
   * 基于用户输入推荐最适合的模板
   */
  async recommendTemplate(input: RecommendationInput): Promise<{
    recommendations: PaperTypeRecommendation[];
    suggestedTemplates: PaperStructureTemplate[];
  }> {
    // 获取论文类型推荐
    const recommendations = await this.typeService.recommendPaperTypes(input);
    
    // 为每个推荐的论文类型获取对应模板
    const suggestedTemplates: PaperStructureTemplate[] = [];
    
    recommendations.forEach(rec => {
      const template = this.templateService.getTemplate(rec.paperType, rec.suggestedAcademicLevel);
      if (template) {
        // 根据目标字数调整模板
        if (input.targetLength) {
          const adjustedTemplate = this.adjustTemplateForWordCount(template, input.targetLength);
          suggestedTemplates.push(adjustedTemplate);
        } else {
          suggestedTemplates.push(template);
        }
      }
    });

    return {
      recommendations,
      suggestedTemplates
    };
  }

  /**
   * 根据字数要求调整模板
   */
  adjustTemplateForWordCount(
    template: PaperStructureTemplate, 
    targetWordCount: number
  ): PaperStructureTemplate {
    const currentTotal = template.modules.reduce(
      (sum, module) => sum + module.estimatedWordCount.max, 
      0
    );
    const ratio = targetWordCount / currentTotal;

    return {
      ...template,
      modules: template.modules.map(module => ({
        ...module,
        estimatedWordCount: {
          min: Math.round(module.estimatedWordCount.min * ratio),
          max: Math.round(module.estimatedWordCount.max * ratio)
        }
      }))
    };
  }

  /**
   * 获取写作指导
   */
  getWritingGuidance(
    paperType: EnglishPaperType, 
    academicLevel: AcademicLevel, 
    moduleType?: string
  ): WritingGuidance | null {
    return this.templateService.getWritingGuidance(paperType, academicLevel, moduleType as any);
  }

  /**
   * 验证模板选择的适合性
   */
  validateTemplateSelection(
    paperType: EnglishPaperType,
    academicLevel: AcademicLevel,
    targetWordCount?: number,
    userExperience?: 'beginner' | 'intermediate' | 'advanced'
  ): {
    isRecommended: boolean;
    warnings: string[];
    suggestions: string[];
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // 使用 PaperTypeService 的验证功能
    const validation = this.typeService.validatePaperTypeSelection(
      paperType, 
      academicLevel, 
      targetWordCount
    );
    
    warnings.push(...validation.warnings);

    // 添加基于用户经验的建议
    if (userExperience) {
      const template = this.getTemplate(paperType, academicLevel);
      if (template) {
        const templateDifficulty = template.metadata.difficulty;
        
        if (userExperience === 'beginner' && templateDifficulty === 'advanced') {
          warnings.push('此模板对初学者来说可能较为复杂');
          suggestions.push('考虑先从较简单的论文类型开始练习');
        }
        
        if (userExperience === 'advanced' && templateDifficulty === 'beginner') {
          suggestions.push('您可能适合选择更具挑战性的论文类型');
        }
      }
    }

    return {
      isRecommended: validation.valid && warnings.length === 0,
      warnings,
      suggestions
    };
  }

  /**
   * 创建自定义模板
   */
  createCustomTemplate(
    baseTemplate: PaperStructureTemplate,
    customizations: {
      removedModules?: string[];
      addedModules?: PaperModuleTemplate[];
      modifiedModules?: Partial<PaperModuleTemplate>[];
      reorderedModules?: { moduleId: string; newOrder: number }[];
    }
  ): PaperStructureTemplate {
    let customTemplate = { ...baseTemplate };
    
    // 移除指定模块
    if (customizations.removedModules) {
      customTemplate.modules = customTemplate.modules.filter(
        module => !customizations.removedModules!.includes(module.id)
      );
    }

    // 添加新模块
    if (customizations.addedModules) {
      customTemplate.modules.push(...customizations.addedModules);
    }

    // 修改现有模块
    if (customizations.modifiedModules) {
      customizations.modifiedModules.forEach(modification => {
        const moduleIndex = customTemplate.modules.findIndex(m => m.id === modification.id);
        if (moduleIndex !== -1) {
          customTemplate.modules[moduleIndex] = {
            ...customTemplate.modules[moduleIndex],
            ...modification
          };
        }
      });
    }

    // 重新排序模块
    if (customizations.reorderedModules) {
      customizations.reorderedModules.forEach(reorder => {
        const module = customTemplate.modules.find(m => m.id === reorder.moduleId);
        if (module) {
          module.order = reorder.newOrder;
        }
      });
      
      // 按order排序
      customTemplate.modules.sort((a, b) => a.order - b.order);
    }

    // 更新模板ID和描述以表明这是自定义版本
    customTemplate.id = `${baseTemplate.id}-custom-${Date.now()}`;
    customTemplate.description = `Custom version of ${baseTemplate.description}`;

    return customTemplate;
  }

  /**
   * 获取模板统计信息
   */
  getTemplateStatistics(): {
    totalTemplates: number;
    templatesByType: Record<EnglishPaperType, number>;
    templatesByLevel: Record<AcademicLevel, number>;
    averageModulesPerTemplate: number;
    mostComplexTemplate: PaperStructureTemplate;
    simplestTemplate: PaperStructureTemplate;
  } {
    const allTemplates = this.getAllTemplates();
    const totalTemplates = allTemplates.length;
    
    // 按类型统计
    const templatesByType: Record<EnglishPaperType, number> = {} as any;
    allTemplates.forEach(template => {
      templatesByType[template.paperType] = (templatesByType[template.paperType] || 0) + 1;
    });

    // 按学术层次统计
    const templatesByLevel: Record<AcademicLevel, number> = {} as any;
    allTemplates.forEach(template => {
      templatesByLevel[template.academicLevel] = (templatesByLevel[template.academicLevel] || 0) + 1;
    });

    // 平均模块数
    const totalModules = allTemplates.reduce((sum, template) => sum + template.modules.length, 0);
    const averageModulesPerTemplate = totalModules / totalTemplates;

    // 找出最复杂和最简单的模板
    const sortedByComplexity = allTemplates.sort((a, b) => b.modules.length - a.modules.length);
    const mostComplexTemplate = sortedByComplexity[0];
    const simplestTemplate = sortedByComplexity[sortedByComplexity.length - 1];

    return {
      totalTemplates,
      templatesByType,
      templatesByLevel,
      averageModulesPerTemplate,
      mostComplexTemplate,
      simplestTemplate
    };
  }

  /**
   * 搜索模板
   */
  searchTemplates(query: {
    paperTypes?: EnglishPaperType[];
    academicLevels?: AcademicLevel[];
    tags?: string[];
    difficulty?: ('beginner' | 'intermediate' | 'advanced')[];
    maxEstimatedTime?: number;
    minWordCount?: number;
    maxWordCount?: number;
  }): PaperStructureTemplate[] {
    let results = this.getAllTemplates();

    // 按论文类型过滤
    if (query.paperTypes && query.paperTypes.length > 0) {
      results = results.filter(template => 
        query.paperTypes!.includes(template.paperType)
      );
    }

    // 按学术层次过滤
    if (query.academicLevels && query.academicLevels.length > 0) {
      results = results.filter(template => 
        query.academicLevels!.includes(template.academicLevel)
      );
    }

    // 按标签过滤
    if (query.tags && query.tags.length > 0) {
      results = results.filter(template =>
        query.tags!.some(tag => template.metadata.tags.includes(tag))
      );
    }

    // 按难度过滤
    if (query.difficulty && query.difficulty.length > 0) {
      results = results.filter(template =>
        query.difficulty!.includes(template.metadata.difficulty)
      );
    }

    // 按预计完成时间过滤
    if (query.maxEstimatedTime) {
      results = results.filter(template =>
        template.metadata.estimatedTime <= query.maxEstimatedTime!
      );
    }

    // 按字数范围过滤
    if (query.minWordCount || query.maxWordCount) {
      results = results.filter(template => {
        const totalWordCount = template.modules.reduce(
          (sum, module) => sum + module.estimatedWordCount.max, 
          0
        );
        
        const meetsMin = !query.minWordCount || totalWordCount >= query.minWordCount;
        const meetsMax = !query.maxWordCount || totalWordCount <= query.maxWordCount;
        
        return meetsMin && meetsMax;
      });
    }

    return results;
  }
}

/**
 * 导出集成的模板管理服务实例
 */
export const integratedPaperTemplateManager = new IntegratedPaperTemplateManager();

/**
 * 模板工具函数集合
 */
export class PaperTemplateUtils {
  /**
   * 计算模板的总字数范围
   */
  static calculateTotalWordCount(template: PaperStructureTemplate): { min: number; max: number } {
    return template.modules.reduce(
      (total, module) => ({
        min: total.min + module.estimatedWordCount.min,
        max: total.max + module.estimatedWordCount.max
      }),
      { min: 0, max: 0 }
    );
  }

  /**
   * 验证模板结构的完整性
   */
  static validateTemplateStructure(template: PaperStructureTemplate): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // 检查必需模块
    const hasIntroduction = template.modules.some(m => m.type === 'introduction');
    if (!hasIntroduction) {
      issues.push('模板缺少引言模块');
    }

    const hasConclusion = template.modules.some(m => m.type === 'conclusion');
    if (!hasConclusion) {
      issues.push('模板缺少结论模块');
    }

    // 检查模块顺序
    const orders = template.modules.map(m => m.order);
    const sortedOrders = [...orders].sort((a, b) => a - b);
    if (JSON.stringify(orders) !== JSON.stringify(sortedOrders)) {
      issues.push('模块顺序不正确');
    }

    // 检查依赖关系
    template.modules.forEach(module => {
      module.dependencies.forEach(depId => {
        const depExists = template.modules.some(m => m.id === depId);
        if (!depExists) {
          issues.push(`模块 ${module.id} 依赖的模块 ${depId} 不存在`);
        }
      });
    });

    // 检查重复ID
    const moduleIds = template.modules.map(m => m.id);
    const uniqueIds = new Set(moduleIds);
    if (moduleIds.length !== uniqueIds.size) {
      issues.push('存在重复的模块ID');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * 生成模板摘要
   */
  static generateTemplateSummary(template: PaperStructureTemplate): {
    overview: string;
    structure: string[];
    keyFeatures: string[];
    estimatedTime: string;
    difficulty: string;
  } {
    const wordCount = PaperTemplateUtils.calculateTotalWordCount(template);
    const moduleCount = template.modules.length;
    const requiredModules = template.modules.filter(m => m.isRequired).length;

    return {
      overview: `${template.name}: ${template.description}`,
      structure: template.modules.map(m => `${m.order}. ${m.title}${m.isRequired ? ' (必需)' : ' (可选)'}`),
      keyFeatures: [
        `${moduleCount} 个模块 (${requiredModules} 个必需)`,
        `预计字数: ${wordCount.min.toLocaleString()} - ${wordCount.max.toLocaleString()} 字`,
        `适合 ${template.academicLevel} 层次`,
        `难度: ${template.metadata.difficulty}`
      ],
      estimatedTime: `预计完成时间: ${template.metadata.estimatedTime} 小时`,
      difficulty: template.metadata.difficulty
    };
  }

  /**
   * 比较两个模板的差异
   */
  static compareTemplates(
    template1: PaperStructureTemplate, 
    template2: PaperStructureTemplate
  ): {
    similarities: string[];
    differences: string[];
    recommendation: string;
  } {
    const similarities: string[] = [];
    const differences: string[] = [];

    // 比较基本信息
    if (template1.paperType === template2.paperType) {
      similarities.push('相同的论文类型');
    } else {
      differences.push(`论文类型不同: ${template1.paperType} vs ${template2.paperType}`);
    }

    if (template1.academicLevel === template2.academicLevel) {
      similarities.push('相同的学术层次');
    } else {
      differences.push(`学术层次不同: ${template1.academicLevel} vs ${template2.academicLevel}`);
    }

    // 比较模块结构
    const modules1 = template1.modules.map(m => m.type);
    const modules2 = template2.modules.map(m => m.type);
    const commonModules = modules1.filter(m => modules2.includes(m));
    
    if (commonModules.length > 0) {
      similarities.push(`共同模块: ${commonModules.join(', ')}`);
    }

    const uniqueToTemplate1 = modules1.filter(m => !modules2.includes(m));
    const uniqueToTemplate2 = modules2.filter(m => !modules1.includes(m));
    
    if (uniqueToTemplate1.length > 0) {
      differences.push(`${template1.name} 独有模块: ${uniqueToTemplate1.join(', ')}`);
    }
    
    if (uniqueToTemplate2.length > 0) {
      differences.push(`${template2.name} 独有模块: ${uniqueToTemplate2.join(', ')}`);
    }

    // 比较难度和时间
    if (template1.metadata.difficulty === template2.metadata.difficulty) {
      similarities.push('相同的难度等级');
    } else {
      differences.push(`难度不同: ${template1.metadata.difficulty} vs ${template2.metadata.difficulty}`);
    }

    // 生成推荐
    let recommendation = '';
    if (template1.paperType === template2.paperType) {
      if (template1.academicLevel === 'undergraduate' && template2.academicLevel === 'master') {
        recommendation = '如果您是本科生，建议选择第一个模板；如果是研究生，选择第二个';
      } else if (template1.metadata.difficulty === 'beginner' && template2.metadata.difficulty === 'advanced') {
        recommendation = '初学者建议选择第一个模板，有经验者可选择第二个';
      }
    }

    return {
      similarities,
      differences,
      recommendation: recommendation || '两个模板各有特色，请根据具体需求选择'
    };
  }
}

// 导出所有相关服务和工具
export { PaperTemplateService } from './paper-templates';
export { PaperTypeService } from './paper-type-service';
export * from './paper-templates-extended';
export * from './paper-templates-complete';