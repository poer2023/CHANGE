import { PaperTypeService } from '@/services/paper-type-service';
import { ModuleStructureGenerator } from '@/services/module-structure-generator';
import { PaperStyleManager } from '@/services/paper-style-config';
import { EnglishPaperType, AcademicLevel } from '@/types/paper-types';

// 简单的测试函数
export async function testPaperTypeSystem() {
  console.log('🧪 开始测试论文类型智能识别与适配系统...');

  // 测试论文类型服务
  console.log('\n📝 测试论文类型推荐服务...');
  const paperTypeService = new PaperTypeService();
  
  try {
    const recommendations = await paperTypeService.recommendPaperTypes({
      title: '分析莎士比亚《哈姆雷特》中的复仇主题',
      abstract: '本文通过文本分析方法探讨莎士比亚悲剧中复仇主题的表现',
      keywords: ['莎士比亚', '哈姆雷特', '复仇', '悲剧', '文学分析'],
      academicLevel: 'undergraduate',
      targetLength: 3000
    });
    
    console.log('✅ 推荐结果:', recommendations.map(r => ({
      type: r.paperType,
      confidence: Math.round(r.confidence * 100) + '%',
      reasons: r.reasons.slice(0, 2)
    })));
  } catch (error) {
    console.log('❌ 推荐服务测试失败:', error);
  }

  // 测试模块结构生成器
  console.log('\n🏗️ 测试动态模块结构生成...');
  const moduleGenerator = new ModuleStructureGenerator();
  
  const paperTypes: EnglishPaperType[] = ['literary-analysis', 'comparative-analysis', 'literature-review'];
  const academicLevels: AcademicLevel[] = ['undergraduate', 'master'];

  for (const paperType of paperTypes) {
    for (const level of academicLevels) {
      try {
        const template = moduleGenerator.generateStructure(paperType, level);
        console.log(`✅ ${paperType} (${level}): ${template.modules.length} 个模块`);
        
        // 转换为实际模块
        const modules = moduleGenerator.convertTemplateToModules(template, 'test-paper');
        console.log(`   📄 生成了 ${modules.length} 个可用模块`);
      } catch (error) {
        console.log(`❌ ${paperType} (${level}) 生成失败:`, error);
      }
    }
  }

  // 测试样式管理器
  console.log('\n🎨 测试样式配置管理...');
  const styleManager = new PaperStyleManager();

  for (const paperType of paperTypes) {
    try {
      const styleConfig = styleManager.getStyleConfig(paperType);
      const formatConfig = styleManager.getFormatConfig(paperType, 'undergraduate');
      
      console.log(`✅ ${paperType}:`);
      console.log(`   🎨 主色调: ${styleConfig.colors.primary}`);
      console.log(`   📝 引用格式: ${formatConfig.citation.style}`);
      console.log(`   📐 字体大小: ${formatConfig.formatting.fontSize}`);
      
      // 测试CSS变量生成
      const cssVars = styleManager.generateCSSVariables(paperType);
      console.log(`   🔧 生成了 ${Object.keys(cssVars).length} 个CSS变量`);
    } catch (error) {
      console.log(`❌ ${paperType} 样式配置失败:`, error);
    }
  }

  // 测试论文类型验证
  console.log('\n✅ 测试论文类型验证...');
  try {
    const validation = paperTypeService.validatePaperTypeSelection(
      'literary-analysis',
      'undergraduate',
      3000
    );
    console.log('✅ 验证结果:', {
      valid: validation.valid,
      warnings: validation.warnings.length
    });
  } catch (error) {
    console.log('❌ 验证测试失败:', error);
  }

  console.log('\n🎉 测试完成！');
  return true;
}

// 如果在Node.js环境中运行
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
  // 在开发环境中可以直接运行测试
  console.log('开发环境检测到，可以运行 testPaperTypeSystem() 进行测试');
}

// 导出测试函数
export default testPaperTypeSystem;