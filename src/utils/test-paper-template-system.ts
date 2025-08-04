/**
 * 论文模板系统测试和演示
 * 展示10种论文类型的专业化模块模板功能
 */

import { 
  integratedPaperTemplateManager, 
  PaperTemplateUtils 
} from '@/services/paper-template-manager';
import { 
  EnglishPaperType, 
  AcademicLevel,
  RecommendationInput 
} from '@/types/paper-types';

/**
 * 论文模板系统演示类
 */
export class PaperTemplateSystemDemo {
  
  /**
   * 演示所有论文类型的模板
   */
  static demonstrateAllTemplates(): void {
    console.log('=== 论文模板系统演示 ===\n');
    
    const paperTypes: EnglishPaperType[] = [
      'literary-analysis',
      'comparative-analysis', 
      'cultural-analysis',
      'literature-review',
      'critical-review',
      'empirical-research',
      'case-study',
      'discourse-analysis',
      'theoretical-discussion',
      'dissertation-thesis'
    ];

    const academicLevels: AcademicLevel[] = ['undergraduate', 'master', 'doctoral'];

    console.log('📋 可用模板概览:');
    paperTypes.forEach((paperType, index) => {
      console.log(`\n${index + 1}. ${paperType.replace('-', ' ').toUpperCase()}`);
      
      academicLevels.forEach(level => {
        const template = integratedPaperTemplateManager.getTemplate(paperType, level);
        if (template) {
          const wordCount = PaperTemplateUtils.calculateTotalWordCount(template);
          console.log(`   - ${level}: ${template.modules.length} 模块, ${wordCount.min}-${wordCount.max} 字, ${template.metadata.difficulty} 难度`);
        }
      });
    });
  }

  /**
   * 演示模板推荐功能
   */
  static async demonstrateTemplateRecommendation(): Promise<void> {
    console.log('\n=== 模板推荐演示 ===\n');

    const testCases: { description: string; input: RecommendationInput }[] = [
      {
        description: '本科生文学分析作业',
        input: {
          title: 'Analysis of Symbolism in The Great Gatsby',
          abstract: 'This paper analyzes the use of symbolism in F. Scott Fitzgerald\'s The Great Gatsby, focusing on the green light and the eyes of Doctor T.J. Eckleburg.',
          keywords: ['symbolism', 'literature', 'Gatsby', 'American Dream'],
          academicLevel: 'undergraduate',
          targetLength: 3000,
          subject: 'English Literature'
        }
      },
      {
        description: '研究生实证研究项目',
        input: {
          title: 'The Impact of Social Media on Academic Performance: An Empirical Study',
          keywords: ['social media', 'academic performance', 'students', 'empirical research'],
          academicLevel: 'master',
          targetLength: 8000,
          researchMethod: 'quantitative survey'
        }
      },
      {
        description: '博士论文文化研究',
        input: {
          title: 'Postcolonial Identity Construction in Contemporary Caribbean Literature',
          abstract: 'This dissertation examines how contemporary Caribbean authors construct postcolonial identity through narrative techniques and cultural symbolism.',
          keywords: ['postcolonial', 'identity', 'Caribbean literature', 'cultural studies'],
          academicLevel: 'doctoral',
          targetLength: 80000,
          subject: 'Cultural Studies'
        }
      }
    ];

    for (const testCase of testCases) {
      console.log(`🎯 测试案例: ${testCase.description}`);
      
      try {
        const result = await integratedPaperTemplateManager.recommendTemplate(testCase.input);
        
        console.log('\n📊 推荐结果:');
        result.recommendations.forEach((rec, index) => {
          console.log(`${index + 1}. ${rec.paperType} (置信度: ${(rec.confidence * 100).toFixed(1)}%)`);
          console.log(`   推荐学术层次: ${rec.suggestedAcademicLevel}`);
          console.log(`   理由: ${rec.reasons.join(', ')}`);
        });

        if (result.suggestedTemplates.length > 0) {
          const bestTemplate = result.suggestedTemplates[0];
          console.log('\n📝 推荐模板详情:');
          const summary = PaperTemplateUtils.generateTemplateSummary(bestTemplate);
          console.log(`模板: ${summary.overview}`);
          console.log(`结构: ${summary.keyFeatures.join(', ')}`);
          console.log(`预计时间: ${summary.estimatedTime}`);
        }
        
      } catch (error) {
        console.error('推荐失败:', error);
      }
      
      console.log('\n' + '='.repeat(50) + '\n');
    }
  }

  /**
   * 演示模板搜索功能
   */
  static demonstrateTemplateSearch(): void {
    console.log('=== 模板搜索演示 ===\n');

    const searchQueries = [
      {
        description: '适合初学者的短篇论文模板',
        query: {
          difficulty: ['beginner' as const],
          maxEstimatedTime: 25,
          maxWordCount: 5000
        }
      },
      {
        description: '高级研究类论文模板',
        query: {
          paperTypes: ['empirical-research' as const, 'discourse-analysis' as const],
          academicLevels: ['master' as const, 'doctoral' as const],
          difficulty: ['advanced' as const]
        }
      },
      {
        description: '包含文化或理论标签的模板',
        query: {
          tags: ['culture', 'theory', 'analysis']
        }
      }
    ];

    searchQueries.forEach((searchCase, index) => {
      console.log(`🔍 搜索案例 ${index + 1}: ${searchCase.description}`);
      
      const results = integratedPaperTemplateManager.searchTemplates(searchCase.query);
      
      console.log(`找到 ${results.length} 个匹配的模板:`);
      results.forEach((template, i) => {
        const wordCount = PaperTemplateUtils.calculateTotalWordCount(template);
        console.log(`${i + 1}. ${template.name}`);
        console.log(`   类型: ${template.paperType}, 层次: ${template.academicLevel}`);
        console.log(`   字数: ${wordCount.min}-${wordCount.max}, 难度: ${template.metadata.difficulty}`);
        console.log(`   标签: ${template.metadata.tags.join(', ')}`);
      });
      
      console.log('\n' + '-'.repeat(40) + '\n');
    });
  }

  /**
   * 演示模板验证功能
   */
  static demonstrateTemplateValidation(): void {
    console.log('=== 模板验证演示 ===\n');

    const validationCases = [
      {
        paperType: 'literary-analysis' as const,
        academicLevel: 'undergraduate' as const,
        targetWordCount: 3000,
        userExperience: 'beginner' as const
      },
      {
        paperType: 'theoretical-discussion' as const,
        academicLevel: 'undergraduate' as const,
        targetWordCount: 15000,
        userExperience: 'beginner' as const
      },
      {
        paperType: 'empirical-research' as const,
        academicLevel: 'doctoral' as const,
        targetWordCount: 12000,
        userExperience: 'advanced' as const
      }
    ];

    validationCases.forEach((testCase, index) => {
      console.log(`✅ 验证案例 ${index + 1}:`);
      console.log(`论文类型: ${testCase.paperType}, 学术层次: ${testCase.academicLevel}`);
      console.log(`目标字数: ${testCase.targetWordCount}, 用户经验: ${testCase.userExperience}`);
      
      const validation = integratedPaperTemplateManager.validateTemplateSelection(
        testCase.paperType,
        testCase.academicLevel,
        testCase.targetWordCount,
        testCase.userExperience
      );
      
      console.log(`推荐度: ${validation.isRecommended ? '✅ 推荐' : '⚠️ 需要注意'}`);
      
      if (validation.warnings.length > 0) {
        console.log('警告:');
        validation.warnings.forEach(warning => console.log(`  - ${warning}`));
      }
      
      if (validation.suggestions.length > 0) {
        console.log('建议:');
        validation.suggestions.forEach(suggestion => console.log(`  - ${suggestion}`));
      }
      
      console.log('\n' + '-'.repeat(40) + '\n');
    });
  }

  /**
   * 演示模板比较功能
   */
  static demonstrateTemplateComparison(): void {
    console.log('=== 模板比较演示 ===\n');

    const comparisons = [
      {
        description: '比较不同学术层次的文学分析模板',
        template1: { paperType: 'literary-analysis' as const, level: 'undergraduate' as const },
        template2: { paperType: 'literary-analysis' as const, level: 'master' as const }
      },
      {
        description: '比较文献综述与批判性评述模板',
        template1: { paperType: 'literature-review' as const, level: 'master' as const },
        template2: { paperType: 'critical-review' as const, level: 'master' as const }
      }
    ];

    comparisons.forEach((comparison, index) => {
      console.log(`🔄 比较案例 ${index + 1}: ${comparison.description}`);
      
      const template1 = integratedPaperTemplateManager.getTemplate(
        comparison.template1.paperType, 
        comparison.template1.level
      );
      const template2 = integratedPaperTemplateManager.getTemplate(
        comparison.template2.paperType, 
        comparison.template2.level
      );

      if (template1 && template2) {
        const comparisonResult = PaperTemplateUtils.compareTemplates(template1, template2);
        
        console.log('相似之处:');
        comparisonResult.similarities.forEach(sim => console.log(`  + ${sim}`));
        
        console.log('差异之处:');
        comparisonResult.differences.forEach(diff => console.log(`  - ${diff}`));
        
        console.log(`推荐: ${comparisonResult.recommendation}`);
      }
      
      console.log('\n' + '-'.repeat(40) + '\n');
    });
  }

  /**
   * 生成系统统计报告
   */
  static generateSystemReport(): void {
    console.log('=== 论文模板系统统计报告 ===\n');

    const stats = integratedPaperTemplateManager.getTemplateStatistics();
    
    console.log(`📊 系统概览:`);
    console.log(`总模板数: ${stats.totalTemplates}`);
    console.log(`平均模块数: ${stats.averageModulesPerTemplate.toFixed(1)}`);
    
    console.log('\n📈 按论文类型分布:');
    Object.entries(stats.templatesByType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} 个模板`);
    });
    
    console.log('\n🎓 按学术层次分布:');
    Object.entries(stats.templatesByLevel).forEach(([level, count]) => {
      console.log(`  ${level}: ${count} 个模板`);
    });
    
    console.log('\n🏆 复杂度极值:');
    console.log(`最复杂模板: ${stats.mostComplexTemplate.name} (${stats.mostComplexTemplate.modules.length} 模块)`);
    console.log(`最简单模板: ${stats.simplestTemplate.name} (${stats.simplestTemplate.modules.length} 模块)`);

    // 验证所有模板的结构完整性
    console.log('\n🔍 模板完整性检查:');
    const allTemplates = integratedPaperTemplateManager.getAllTemplates();
    let validTemplates = 0;
    let issuesFound = 0;

    allTemplates.forEach(template => {
      const validation = PaperTemplateUtils.validateTemplateStructure(template);
      if (validation.isValid) {
        validTemplates++;
      } else {
        issuesFound += validation.issues.length;
        console.log(`  ⚠️ ${template.name}: ${validation.issues.join(', ')}`);
      }
    });

    console.log(`✅ 有效模板: ${validTemplates}/${allTemplates.length}`);
    if (issuesFound === 0) {
      console.log('🎉 所有模板结构完整，无问题发现！');
    } else {
      console.log(`⚠️ 发现 ${issuesFound} 个结构问题需要修复`);
    }
  }

  /**
   * 运行完整演示
   */
  static async runFullDemo(): Promise<void> {
    console.log('🚀 启动论文模板系统完整演示...\n');
    
    try {
      // 1. 展示所有模板
      this.demonstrateAllTemplates();
      
      // 2. 演示推荐功能
      await this.demonstrateTemplateRecommendation();
      
      // 3. 演示搜索功能
      this.demonstrateTemplateSearch();
      
      // 4. 演示验证功能
      this.demonstrateTemplateValidation();
      
      // 5. 演示比较功能
      this.demonstrateTemplateComparison();
      
      // 6. 生成统计报告
      this.generateSystemReport();
      
      console.log('\n✨ 论文模板系统演示完成！');
      console.log('该系统提供了10种专业化论文类型的完整模板支持，');
      console.log('包括智能推荐、模板搜索、验证和比较等高级功能。');
      
    } catch (error) {
      console.error('演示过程中发生错误:', error);
    }
  }
}

/**
 * 快速测试函数 - 用于基本功能验证
 */
export function quickTestPaperTemplateSystem(): void {
  console.log('🧪 论文模板系统快速测试\n');
  
  // 测试模板获取
  const literaryTemplate = integratedPaperTemplateManager.getTemplate('literary-analysis', 'undergraduate');
  if (literaryTemplate) {
    console.log('✅ 模板获取功能正常');
    console.log(`获取到模板: ${literaryTemplate.name}`);
    console.log(`包含 ${literaryTemplate.modules.length} 个模块`);
  } else {
    console.log('❌ 模板获取失败');
  }
  
  // 测试模板搜索
  const searchResults = integratedPaperTemplateManager.searchTemplates({
    difficulty: ['beginner'],
    maxEstimatedTime: 30
  });
  console.log(`✅ 模板搜索功能正常，找到 ${searchResults.length} 个匹配结果`);
  
  // 测试统计功能
  const stats = integratedPaperTemplateManager.getTemplateStatistics();
  console.log(`✅ 统计功能正常，系统总共有 ${stats.totalTemplates} 个模板`);
  
  console.log('\n🎉 快速测试完成，系统运行正常！');
}

// 导出演示类和测试函数
export default PaperTemplateSystemDemo;