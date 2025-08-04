# 论文类型智能识别与模板系统

基于PRD文档要求，本系统实现了支持10种英语学术论文类型的智能识别、专业化模块模板和智能适配功能，为不同学术层次的用户提供专业化的写作指导和AI辅助。

## 🎯 核心功能

### 1. 论文类型智能识别
- **10种英语学术论文类型支持**：
  - Literary Analysis Paper (文学分析论文)
  - Comparative Analysis Paper (比较分析论文)  
  - Cultural Analysis Paper (文化分析论文)
  - Literature Review (文献综述)
  - Critical Review (批判性评述)
  - Empirical Research Paper (实证研究论文)
  - Case Study Paper (案例研究论文)
  - Discourse Analysis Paper (话语分析论文)
  - Theoretical Discussion Paper (理论探讨论文)
  - Dissertation/Thesis (学位论文)

### 2. 专业化模块模板系统
- **标准化模块结构**：每种论文类型都有专门设计的标准模块
- **学术层次差异化**：本科、硕士、博士三个层次的专门模板
- **写作指导集成**：每个模块包含详细的写作提示和指导原则
- **智能字数分配**：根据论文类型和学术层次自动计算字数分配

### 3. 智能推荐算法
- **多维度分析**：结合关键词匹配、AI深度分析、字数匹配等
- **学术层次适配**：支持本科、硕士、博士不同层次需求
- **实时推荐**：基于用户输入的标题、摘要、关键词等信息
- **置信度评分**：为每个推荐提供详细的置信度和理由

### 4. 模板管理与适配
- **模板搜索与筛选**：支持多维度搜索和灵活筛选
- **模板验证系统**：评估模板选择的适合性
- **自定义模板创建**：支持基于现有模板创建个性化版本
- **模板比较分析**：对比不同模板的特征和适用场景

### 5. 类型特定样式配置
- **视觉主题系统**：每种论文类型都有独特的色彩方案和视觉风格
- **格式规范**：内置APA、MLA、Chicago等引用格式
- **响应式样式**：CSS变量驱动的动态样式切换

## 📁 文件结构

```
src/
├── types/
│   └── paper-types.ts                    # 论文类型定义和接口
├── components/
│   └── editor/
│       └── PaperTypeSelector.tsx         # 论文类型选择器组件
├── services/
│   ├── paper-type-service.ts             # 智能推荐算法服务
│   ├── paper-templates.ts                # 核心模板服务
│   ├── paper-templates-extended.ts       # 扩展模板实现
│   ├── paper-templates-complete.ts       # 完整模板系统
│   ├── paper-template-manager.ts         # 集成模板管理器
│   ├── module-structure-generator.ts     # 动态模块结构生成
│   └── paper-style-config.ts             # 样式和格式配置管理
├── hooks/
│   └── usePaperTypeAdapter.ts            # 论文类型适配Hook
├── pages/demo/
│   └── PaperTypeSystemDemo.tsx           # 系统演示页面
├── utils/
│   └── test-paper-template-system.ts     # 模板系统测试工具
└── docs/features/
    └── PAPER_TYPE_SYSTEM.md              # 系统功能文档
```

## 🚀 使用方法

### 1. 集成模板管理器 - 推荐方式

```typescript
import { integratedPaperTemplateManager } from '@/services';

// 获取智能推荐
const result = await integratedPaperTemplateManager.recommendTemplate({
  title: 'Analysis of Symbolism in The Great Gatsby',
  academicLevel: 'undergraduate',
  targetLength: 3000,
  keywords: ['symbolism', 'literature', 'Gatsby']
});

// 获取推荐的模板
const template = result.suggestedTemplates[0];
console.log(`推荐模板: ${template.name}`);
console.log(`包含 ${template.modules.length} 个模块`);
```

### 2. 基础模板获取

```typescript
import { integratedPaperTemplateManager } from '@/services';

// 获取特定类型和层次的模板
const template = integratedPaperTemplateManager.getTemplate(
  'literary-analysis', 
  'undergraduate'
);

if (template) {
  console.log(`模板名称: ${template.name}`);
  console.log(`模块数量: ${template.modules.length}`);
  
  // 显示模块结构
  template.modules.forEach(module => {
    console.log(`- ${module.title}: ${module.description}`);
    console.log(`  字数范围: ${module.estimatedWordCount.min}-${module.estimatedWordCount.max}`);
    console.log(`  写作提示: ${module.writingPrompts.join(', ')}`);
  });
}
```

### 3. 模板搜索与筛选

```typescript
// 搜索适合初学者的短篇论文模板
const templates = integratedPaperTemplateManager.searchTemplates({
  difficulty: ['beginner'],
  maxEstimatedTime: 25,
  maxWordCount: 5000,
  academicLevels: ['undergraduate']
});

console.log(`找到 ${templates.length} 个匹配的模板`);
```

### 4. 模板验证与建议

```typescript
// 验证模板选择的适合性
const validation = integratedPaperTemplateManager.validateTemplateSelection(
  'theoretical-discussion',
  'undergraduate',
  15000,
  'beginner'
);

if (!validation.isRecommended) {
  console.log('注意事项:');
  validation.warnings.forEach(warning => console.log(`- ${warning}`));
  
  console.log('建议:');
  validation.suggestions.forEach(suggestion => console.log(`- ${suggestion}`));
}
```

### 5. 完整功能 - 论文类型适配器

```typescript
import { usePaperTypeAdapter } from '@/hooks';

function PaperEditor() {
  const {
    currentPaperType,
    currentTemplate,
    generatedModules,
    setPaperType,
    getRecommendations,
    getStyleConfig,
    isReady
  } = usePaperTypeAdapter({
    enableAIRecommendations: true,
    enableStyleAdaptation: true,
    autoGenerateModules: true,
    paperId: 'my-paper'
  });

  // 设置论文类型
  const handleTypeChange = async (type, level) => {
    await setPaperType(type, level, {
      targetWordCount: 5000,
      citationStyle: 'APA'
    });
  };

  return (
    <div>
      {/* 使用生成的模块和样式 */}
      {generatedModules.map(module => (
        <div key={module.id}>
          <h3>{module.title}</h3>
          <p>{module.description}</p>
          <ul>
            {module.writingPrompts.map(prompt => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

## 📋 支持的论文类型详细说明

### 1. 文学分析论文 (Literary Analysis)
- **适用场景**: 分析文学作品的主题、技巧和意义
- **核心模块**: 引言、文本分析、批判性解读、结论、参考文献
- **字数范围**: 本科(3000字) / 硕士(5000字) / 博士(9000字)
- **特色**: 文本分析技巧、引用格式指导、文学术语运用

### 2. 比较分析论文 (Comparative Analysis)
- **适用场景**: 系统性比较两个或多个主题、文本或概念
- **核心模块**: 引言、比较框架、逐点分析、综合讨论、结论
- **字数范围**: 本科(4200字) / 硕士(6000字) / 博士(9600字)
- **特色**: 比较框架设计、平衡性分析指导、系统性对比方法

### 3. 文化分析论文 (Cultural Analysis)
- **适用场景**: 分析文化现象、实践和表征
- **核心模块**: 引言、理论框架、文化背景、深度分析、批判性评估、结论
- **字数范围**: 本科(4800字) / 硕士(8000字) / 博士(16000字)
- **特色**: 理论框架应用、权力关系分析、多元文化视角

### 4. 文献综述 (Literature Review)
- **适用场景**: 系统性回顾和综合现有研究
- **核心模块**: 引言、搜索方法、主题综合、研究空白、结论
- **字数范围**: 本科(4200字) / 硕士(7200字) / 博士(12000字)
- **特色**: 搜索策略指导、主题组织、空白识别、综合分析

### 5. 批判性评述 (Critical Review)
- **适用场景**: 批判性评估作品、理论或论证
- **核心模块**: 引言、概述、批判性评估、比较语境、结论
- **字数范围**: 本科(3200字) / 硕士(4000字) / 博士(6000字)
- **特色**: 平衡性评估、证据支持、推荐建议、批判性思维

### 6. 实证研究论文 (Empirical Research)
- **适用场景**: 基于实证证据的原创研究
- **核心模块**: 引言、方法论、结果、讨论、结论、参考文献
- **字数范围**: 本科(6000字) / 硕士(10000字) / 博士(18000字)
- **特色**: 研究设计指导、数据分析方法、结果呈现、科学写作

### 7. 案例研究论文 (Case Study)
- **适用场景**: 深入分析特定案例或现象
- **核心模块**: 引言、案例背景、理论框架、深度分析、经验教训、结论
- **字数范围**: 本科(4800字) / 硕士(8000字) / 博士(12000字)
- **特色**: 案例选择指导、分析框架应用、普遍性思考

### 8. 话语分析论文 (Discourse Analysis)
- **适用场景**: 分析社会语境中的语言使用
- **核心模块**: 引言、理论框架、语境分析、详细话语分析、批判性解读、结论
- **字数范围**: 本科(6000字) / 硕士(10000字) / 博士(18000字)
- **特色**: 理论框架选择、语言特征分析、权力关系揭示

### 9. 理论探讨论文 (Theoretical Discussion)
- **适用场景**: 探讨理论概念、框架和哲学问题
- **核心模块**: 引言、理论背景、理论分析、应用与含义、结论
- **字数范围**: 本科(7500字) / 硕士(12000字) / 博士(18000字)
- **特色**: 概念分析、理论综合、原创贡献、抽象思维

### 10. 学位论文 (Dissertation/Thesis)
- **适用场景**: 综合性学术研究，展示领域掌握程度
- **核心模块**: 摘要、引言、文献综述、方法论、研究发现、讨论、结论
- **字数范围**: 荣誉学士(8000字) / 硕士(24000字) / 博士(40000字)
- **特色**: 全面研究指导、原创性要求、学术贡献评估

## 🧪 测试和演示

### 运行完整系统演示

```typescript
import PaperTemplateSystemDemo, { quickTestPaperTemplateSystem } from '@/utils/test-paper-template-system';

// 运行完整演示 - 包含所有功能展示
await PaperTemplateSystemDemo.runFullDemo();

// 快速功能测试 - 验证基本功能
quickTestPaperTemplateSystem();
```

### 演示功能包括
1. **模板概览展示** - 显示所有可用模板
2. **智能推荐演示** - 测试不同场景的推荐功能
3. **模板搜索演示** - 展示多维度搜索功能
4. **验证功能演示** - 测试模板适合性验证
5. **比较分析演示** - 对比不同模板的特征
6. **统计报告生成** - 系统使用统计和完整性检查

## 🔧 配置选项

### 论文类型适配器选项

```typescript
interface PaperTypeAdapterOptions {
  enableAIRecommendations?: boolean;      // 启用AI推荐
  enableStyleAdaptation?: boolean;        // 启用样式适配
  enableRealTimeValidation?: boolean;     // 启用实时验证
  autoGenerateModules?: boolean;          // 自动生成模块
  paperId?: string;                       // 论文ID
  initialPaperType?: EnglishPaperType;    // 初始论文类型
  initialAcademicLevel?: AcademicLevel;   // 初始学术层次
}
```

### 模板推荐输入参数

```typescript
interface RecommendationInput {
  title?: string;                         // 论文标题
  abstract?: string;                      // 摘要
  keywords?: string[];                    // 关键词
  academicLevel?: AcademicLevel;          // 学术层次
  subject?: string;                       // 学科领域
  researchMethod?: string;                // 研究方法
  targetLength?: number;                  // 目标字数
  existingContent?: string;               // 现有内容
}
```

### 模板搜索参数

```typescript
interface TemplateSearchQuery {
  paperTypes?: EnglishPaperType[];        // 论文类型筛选
  academicLevels?: AcademicLevel[];       // 学术层次筛选
  tags?: string[];                        // 标签筛选
  difficulty?: ('beginner' | 'intermediate' | 'advanced')[]; // 难度筛选
  maxEstimatedTime?: number;              // 最大预计时间
  minWordCount?: number;                  // 最小字数
  maxWordCount?: number;                  // 最大字数
}
```

## 🎨 样式系统

### 支持的论文类型主题色彩

- **Literary Analysis**: Indigo (#6366f1) - 深邃的文学分析色调
- **Comparative Analysis**: Blue (#3b82f6) - 理性的比较分析蓝色
- **Cultural Analysis**: Violet (#8b5cf6) - 多元文化的紫色系
- **Literature Review**: Emerald (#10b981) - 学术综述的绿色
- **Critical Review**: Red (#ef4444) - 批判性的红色调
- **Empirical Research**: Cyan (#06b6d4) - 科学研究的青色
- **Case Study**: Orange (#f97316) - 实践案例的橙色
- **Discourse Analysis**: Teal (#14b8a6) - 话语分析的蓝绿色
- **Theoretical Discussion**: Violet (#7c3aed) - 理论探讨的深紫色
- **Dissertation/Thesis**: Amber (#d97706) - 学位论文的琥珀色

### CSS变量自动生成

系统会自动生成对应的CSS变量：

```css
:root {
  --paper-primary-color: #6366f1;
  --paper-secondary-color: #a5b4fc;
  --paper-background-color: #f8fafc;
  --paper-accent-color: #4f46e5;
  --paper-text-color: #1e293b;
  /* ... 更多变量 */
}
```

## 📋 支持的引用格式

- **APA**: American Psychological Association - 适用于心理学、教育学
- **MLA**: Modern Language Association - 适用于文学、语言学
- **Chicago**: Chicago Manual of Style - 适用于历史、文学
- **IEEE**: Institute of Electrical and Electronics Engineers - 适用于工程技术
- **Harvard**: Harvard Referencing System - 通用学术引用格式

## 📈 系统特性

### 性能优化
- **智能缓存**: AI推荐结果和模板结构缓存
- **懒加载**: 按需加载论文类型配置
- **类型安全**: 完整的TypeScript类型定义
- **响应式**: 支持桌面和平板设备
- **浏览器兼容**: 遵循项目的浏览器兼容性要求

### 扩展性设计
- **模块化架构**: 易于添加新的论文类型和功能
- **插件式模板**: 支持第三方模板扩展
- **配置驱动**: 基于配置文件的灵活定制
- **API集成**: 与GLM等AI服务无缝集成

## 🛠️ 扩展指南

### 添加新论文类型

1. **类型定义** - 在 `paper-types.ts` 中添加新类型
```typescript
export type EnglishPaperType = 
  | 'existing-types'
  | 'new-paper-type';  // 添加新类型
```

2. **模板实现** - 在模板服务中添加创建方法
```typescript
private createNewPaperTypeTemplate(id: string, level: AcademicLevel): PaperStructureTemplate {
  // 实现新类型的模板结构
}
```

3. **样式配置** - 在样式配置中添加主题
```typescript
'new-paper-type': {
  primary: '#your-color',
  // ... 其他样式配置
}
```

4. **关键词映射** - 在推荐服务中添加关键词
```typescript
const PAPER_TYPE_KEYWORDS = {
  'new-paper-type': ['keyword1', 'keyword2', ...]
};
```

### 自定义模块模板

```typescript
const customModule: PaperModuleTemplate = {
  id: 'custom-methodology',
  type: 'methodology',
  title: '研究方法论',
  description: '详细描述研究采用的方法和理论框架',
  isRequired: true,
  order: 3,
  estimatedWordCount: { min: 800, max: 1200 },
  writingPrompts: [
    '你采用了什么研究方法？',
    '为什么选择这种方法？',
    '有哪些潜在的局限性？'
  ],
  guidelines: [
    '清楚描述研究设计',
    '解释方法选择的理由',
    '讨论方法的适用性和局限性'
  ],
  dependencies: ['intro-section'],
  subSections: [
    {
      id: 'research-design',
      title: '研究设计',
      description: '总体研究框架和方法',
      isRequired: true,
      order: 1,
      writingPrompts: ['采用什么研究设计？']
    }
  ]
};
```

## 🎯 未来发展规划

### 短期目标 (1-3个月)
- [ ] 完善所有10种论文类型的子模块细化
- [ ] 增加更多写作示例和模板变体
- [ ] 优化AI推荐算法的准确性
- [ ] 添加模板导出功能 (PDF, DOCX)

### 中期目标 (3-6个月)
- [ ] 多语言支持 (中文学术论文类型)
- [ ] 协作功能集成 (多人编辑同一模板)
- [ ] 高级AI分析功能 (内容质量评估)
- [ ] 模板市场和分享功能

### 长期目标 (6-12个月)
- [ ] 学科专门化模板 (如医学、法学、工程等)
- [ ] 个性化学习系统 (根据用户习惯优化推荐)
- [ ] 跨平台支持 (移动端适配)
- [ ] 与学术数据库集成 (自动文献检索)

## 💡 使用建议

### 最佳实践
1. **选择合适的学术层次** - 确保选择与自己水平匹配的模板
2. **仔细阅读写作指导** - 每个模块都包含详细的写作提示
3. **合理安排字数分配** - 参考模板建议的字数范围
4. **循序渐进** - 从简单的论文类型开始练习

### 常见问题
- **如何选择论文类型？** 使用智能推荐功能，输入标题和关键词获取建议
- **模板字数如何调整？** 系统会根据目标字数自动调整各模块分配
- **可以混合使用不同模板吗？** 可以创建自定义模板，融合不同类型的优势

---

**注意**: 此系统需要配置GLM API密钥才能使用AI推荐功能。请确保在环境变量中设置 `VITE_GLM_API_KEY`。完整的模板系统现已实现，包含所有10种论文类型的专业化模块支持、智能推荐、模板管理和使用指导功能。

## 📁 文件结构

```
src/
├── types/
│   └── paper-types.ts          # 论文类型定义和接口
├── components/
│   └── editor/
│       └── PaperTypeSelector.tsx  # 论文类型选择器组件
├── services/
│   ├── paper-type-service.ts      # 智能推荐算法服务
│   ├── module-structure-generator.ts  # 动态模块结构生成
│   └── paper-style-config.ts      # 样式和格式配置管理
├── hooks/
│   └── usePaperTypeAdapter.ts     # 论文类型适配Hook
├── pages/demo/
│   └── PaperTypeSystemDemo.tsx    # 系统演示页面
└── utils/
    └── test-paper-type-system.ts  # 测试工具
```

## 🚀 使用方法

### 1. 基础使用 - 论文类型选择器

```typescript
import { PaperTypeSelector } from '@/components/editor';
import { useState } from 'react';

function MyComponent() {
  const [formData, setFormData] = useState({
    paperType: '',
    // ... 其他表单字段
  });

  return (
    <PaperTypeSelector
      formData={formData}
      updateFormData={setFormData}
      errors={[]}
      onRecommendationRequest={async (input) => {
        // 处理AI推荐请求
        return recommendations;
      }}
    />
  );
}
```

### 2. 完整功能 - 论文类型适配器

```typescript
import { usePaperTypeAdapter } from '@/hooks';

function PaperEditor() {
  const {
    currentPaperType,
    currentTemplate,
    generatedModules,
    setPaperType,
    getRecommendations,
    getStyleConfig,
    isReady
  } = usePaperTypeAdapter({
    enableAIRecommendations: true,
    enableStyleAdaptation: true,
    autoGenerateModules: true,
    paperId: 'my-paper'
  });

  // 设置论文类型
  const handleTypeChange = async (type, level) => {
    await setPaperType(type, level, {
      targetWordCount: 5000,
      citationStyle: 'APA'
    });
  };

  return (
    <div>
      {/* 使用生成的模块和样式 */}
    </div>
  );
}
```

### 3. 服务层直接使用

```typescript
import { 
  PaperTypeService, 
  ModuleStructureGenerator, 
  PaperStyleManager 
} from '@/services';

// 获取推荐
const service = new PaperTypeService();
const recommendations = await service.recommendPaperTypes({
  title: '论文标题',
  academicLevel: 'undergraduate'
});

// 生成模块结构
const generator = new ModuleStructureGenerator();
const template = generator.generateStructure('literary-analysis', 'master');

// 管理样式
const styleManager = new PaperStyleManager();
styleManager.applyStyles('literary-analysis');
```

## 🔧 配置选项

### 论文类型适配器选项

```typescript
interface PaperTypeAdapterOptions {
  enableAIRecommendations?: boolean;      // 启用AI推荐
  enableStyleAdaptation?: boolean;        // 启用样式适配
  enableRealTimeValidation?: boolean;     // 启用实时验证
  autoGenerateModules?: boolean;          // 自动生成模块
  paperId?: string;                       // 论文ID
  initialPaperType?: EnglishPaperType;    // 初始论文类型
  initialAcademicLevel?: AcademicLevel;   // 初始学术层次
}
```

### 模块生成自定义选项

```typescript
const customOptions = {
  targetWordCount: 5000,              // 目标字数
  citationStyle: 'APA',              // 引用格式
  includeOptionalSections: true,      // 包含可选章节
  specializationArea: 'modernism'     // 专业领域
};
```

## 🎨 样式系统

### 支持的论文类型主题色彩

- **Literary Analysis**: Indigo (#6366f1)
- **Comparative Analysis**: Blue (#3b82f6)
- **Cultural Analysis**: Violet (#8b5cf6)
- **Literature Review**: Emerald (#10b981)
- **Critical Review**: Red (#ef4444)
- **Empirical Research**: Cyan (#06b6d4)
- **Case Study**: Orange (#f97316)
- **Discourse Analysis**: Teal (#14b8a6)
- **Theoretical Discussion**: Violet (#7c3aed)
- **Dissertation/Thesis**: Amber (#d97706)

### CSS变量自动生成

系统会自动生成对应的CSS变量：

```css
:root {
  --paper-primary-color: #6366f1;
  --paper-secondary-color: #a5b4fc;
  --paper-background-color: #f8fafc;
  /* ... 更多变量 */
}
```

## 📋 支持的引用格式

- **APA**: American Psychological Association
- **MLA**: Modern Language Association  
- **Chicago**: Chicago Manual of Style
- **IEEE**: Institute of Electrical and Electronics Engineers
- **Harvard**: Harvard Referencing System

## 🧪 测试

运行测试工具验证系统功能：

```typescript
import { testPaperTypeSystem } from '@/utils/test-paper-type-system';

// 运行完整测试
await testPaperTypeSystem();
```

## 🔍 演示页面

查看完整功能演示：

```typescript
import PaperTypeSystemDemo from '@/pages/demo/PaperTypeSystemDemo';

// 在路由中使用
<Route path="/demo/paper-types" component={PaperTypeSystemDemo} />
```

## 📈 性能特性

- **智能缓存**: AI推荐结果和模板结构缓存
- **懒加载**: 按需加载论文类型配置
- **类型安全**: 完整的TypeScript类型定义
- **响应式**: 支持桌面和平板设备
- **浏览器兼容**: 遵循项目的浏览器兼容性要求

## 🛠️ 扩展性

### 添加新的论文类型

1. 在 `paper-types.ts` 中添加新的类型定义
2. 在 `module-structure-generator.ts` 中实现对应的模板生成方法
3. 在 `paper-style-config.ts` 中添加样式配置
4. 在 `paper-type-service.ts` 中添加关键词映射

### 自定义模块模板

```typescript
const customTemplate: PaperModuleTemplate = {
  id: 'custom-section',
  type: 'custom',
  title: '自定义章节',
  description: '用户自定义的特殊章节',
  isRequired: false,
  order: 5,
  estimatedWordCount: { min: 500, max: 1000 },
  writingPrompts: ['自定义提示1', '自定义提示2'],
  guidelines: ['自定义指导1', '自定义指导2'],
  dependencies: []
};
```

## 🎯 未来规划

- [ ] 多语言支持 (中文、英文)
- [ ] 更多引用格式支持
- [ ] 协作功能集成
- [ ] 高级AI分析功能
- [ ] 模板市场和分享功能
- [ ] 导出功能增强 (PDF, DOCX, LaTeX)

---

**注意**: 此系统需要配置GLM-4.5 API密钥才能使用AI推荐功能。请确保在环境变量中设置 `VITE_GLM_API_KEY`。