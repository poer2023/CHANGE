# 智能内容分析引擎

基于GLM-4.5的智能内容分析引擎，提供全方位的学术写作质量评估和改进建议。

## 🚀 核心功能

### 1. 学术规范检查
- **引用格式验证**：支持APA、MLA、Chicago、IEEE、Harvard等多种引用标准
- **学术术语检查**：验证专业术语使用的准确性
- **格式规范性**：检查文档结构、标题层级、段落格式等
- **结构完整性**：评估各章节的完整性和平衡性

### 2. 语言质量分析
- **语法检查**：识别语法错误并提供修正建议
- **拼写检查**：发现拼写错误并推荐正确拼写
- **写作风格**：分析表达方式，提供风格优化建议
- **可读性评估**：计算可读性指标，评估文本难度

### 3. 结构完整性检查
- **章节分析**：评估各章节的完整性和内容质量
- **逻辑流程**：检查段落间的逻辑连接和过渡
- **内容连贯性**：分析整体结构的合理性

### 4. 创新性评估
- **新颖性分析**：评估研究问题和方法的新颖程度
- **学术贡献**：分析研究的学术价值和影响
- **原创性检查**：检测潜在的相似内容

## 📦 组件架构

```
src/
├── services/
│   └── content-analyzer.ts       # 核心分析服务
├── hooks/
│   └── useContentAnalysis.ts     # 分析功能Hook
├── components/
│   └── analysis/
│       ├── ContentAnalysisPanel.tsx  # 主分析面板
│       ├── QualityIndicator.tsx       # 质量指示器
│       └── SuggestionCard.tsx         # 建议卡片
└── types/
    └── index.ts                   # 类型定义
```

## 🛠 安装和配置

### 1. 环境变量配置

在 `.env` 文件中添加GLM-4.5 API配置：

```env
VITE_GLM_API_KEY=your-glm-api-key
VITE_GLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4  # 可选
```

### 2. 依赖项

确保已安装以下依赖：

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "lucide-react": "^0.263.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^3.3.1",
    "framer-motion": "^10.16.0"
  }
}
```

## 📖 使用指南

### 基本使用

```tsx
import React, { useState } from 'react';
import { useContentAnalysis, ContentAnalysisPanel } from '@/components/analysis';

const MyEditor = () => {
  const [content, setContent] = useState('');
  
  const {
    result,
    isAnalyzing,
    error,
    analyze
  } = useContentAnalysis(content, {
    enableRealTimeAnalysis: true,
    enableCache: true,
    debounceDelay: 1000
  });

  return (
    <div className="flex">
      {/* 编辑器 */}
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-96 p-4 border rounded"
          placeholder="输入您的学术内容..."
        />
      </div>
      
      {/* 分析面板 */}
      <div className="w-96">
        <ContentAnalysisPanel
          content={content}
          options={{
            citationStyle: 'APA',
            paperType: '学术论文',
            field: '计算机科学'
          }}
        />
      </div>
    </div>
  );
};
```

### 高级配置

```tsx
// 自定义分析配置
const analysisOptions = {
  citationStyle: 'APA' as const,
  paperType: '学术论文',
  field: '计算机科学',
  enableRealTimeAnalysis: true,
  showQuickResults: true
};

// 使用分析Hook
const {
  result,
  quickResult,
  isAnalyzing,
  analyze,
  reanalyze,
  clearAnalysis
} = useContentAnalysis(content, {
  enableRealTimeAnalysis: true,
  enableCache: true,
  debounceDelay: 1000,
  autoAnalyze: true
});

// 手动触发分析
const handleAnalyze = () => {
  analyze(content, {
    citationStyle: 'MLA',
    paperType: '研究报告',
    field: '教育学',
    force: true // 强制重新分析
  });
};
```

### 质量指示器

```tsx
import { QualityIndicator } from '@/components/analysis';

// 不同尺寸的质量指示器
<QualityIndicator score={85} size="small" />
<QualityIndicator score={85} size="medium" />
<QualityIndicator score={85} size="large" />

// 带趋势的质量指示器
<QualityIndicator
  score={88}
  size="large"
  showTrend={true}
  trend={{
    value: 12,
    direction: 'up',
    isImprovement: true
  }}
/>
```

### 建议卡片

```tsx
import { SuggestionCard, SuggestionList } from '@/components/analysis';

// 单个建议卡片
<SuggestionCard
  insight={insight}
  onClick={handleInsightClick}
  onApply={handleApplyInsight}
  showActions={true}
/>

// 建议列表
<SuggestionList
  insights={insights}
  groupByPriority={true}
  maxVisible={5}
  onInsightClick={handleInsightClick}
/>
```

## 🎯 API参考

### ContentAnalyzer类

```typescript
class ContentAnalyzer {
  constructor(config: GLMConfig)
  
  // 主要分析方法
  async analyzeContent(
    content: string,
    options?: {
      citationStyle?: CitationStyle;
      paperType?: string;
      field?: string;
    }
  ): Promise<ContentAnalysisResult>
  
  // 学术规范检查
  private async analyzeAcademicStandards(
    content: string,
    citationStyle: CitationStyle
  ): Promise<AcademicStandardsResult>
  
  // 语言质量分析
  private async analyzeLanguageQuality(
    content: string
  ): Promise<LanguageQualityResult>
  
  // 结构完整性分析
  private async analyzeStructuralIntegrity(
    content: string
  ): Promise<StructuralIntegrityResult>
  
  // 创新性评估
  private async analyzeInnovation(
    content: string,
    field?: string
  ): Promise<InnovationResult>
}
```

### useContentAnalysis Hook

```typescript
const {
  // 状态
  result: ContentAnalysisResult | null,
  quickResult: QuickResult | null,
  isAnalyzing: boolean,
  error: string | null,
  progress: number,
  
  // 操作
  analyze: (content: string, options?: AnalysisOptions) => Promise<ContentAnalysisResult | null>,
  quickAnalyze: (content: string) => Promise<void>,
  reanalyze: (options?: AnalysisOptions) => Promise<ContentAnalysisResult | null>,
  clearAnalysis: () => void,
  clearCache: () => void,
  
  // 工具
  getCacheStats: () => CacheStats,
  
  // 状态检查
  hasResult: boolean,
  hasError: boolean,
  isContentChanged: boolean,
  shouldShowQuickResult: boolean
} = useContentAnalysis(content, options);
```

## 🎨 样式定制

### Tailwind CSS类

组件使用Tailwind CSS构建，支持自定义样式：

```tsx
// 自定义质量指示器颜色
<QualityIndicator 
  score={85}
  className="bg-custom-blue text-white"
/>

// 自定义分析面板样式
<ContentAnalysisPanel
  content={content}
  className="border-2 border-blue-500 rounded-xl shadow-lg"
/>
```

### 主题配置

```css
/* 自定义CSS变量 */
:root {
  --analysis-primary: #3b82f6;
  --analysis-success: #10b981;
  --analysis-warning: #f59e0b;
  --analysis-error: #ef4444;
}
```

## 📊 分析结果结构

```typescript
interface ContentAnalysisResult {
  overall: {
    score: number;           // 总体评分 (0-100)
    grade: 'A' | 'B' | 'C' | 'D' | 'F';  // 等级
    summary: string;         // 总结
  };
  academics: AcademicStandardsResult;    // 学术规范
  language: LanguageQualityResult;       // 语言质量
  structure: StructuralIntegrityResult;  // 结构完整性
  innovation: InnovationResult;          // 创新性
  statistics: ContentStatistics;         // 统计信息
  actionableInsights: ActionableInsight[]; // 可操作建议
  timestamp: Date;                       // 分析时间
}
```

## 🔧 配置选项

### 分析配置

```typescript
interface AnalysisOptions {
  citationStyle?: 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'Harvard';
  paperType?: string;        // 论文类型
  field?: string;           // 学科领域
  force?: boolean;          // 强制重新分析
}
```

### Hook配置

```typescript
interface UseContentAnalysisOptions {
  debounceDelay?: number;           // 防抖延迟 (默认: 1000ms)
  enableRealTimeAnalysis?: boolean; // 实时分析 (默认: true)
  enableCache?: boolean;            // 启用缓存 (默认: true)
  autoAnalyze?: boolean;           // 自动分析 (默认: true)
}
```

## 📈 性能优化

### 1. 缓存机制
- 自动缓存分析结果，避免重复分析
- 缓存有效期30分钟
- 智能缓存清理机制

### 2. 防抖处理
- 用户输入防抖，避免频繁API调用
- 可配置防抖延迟时间
- 区分快速检查和完整分析

### 3. 分批处理
- 支持批量内容分析
- 异步处理，不阻塞UI
- 进度跟踪和错误处理

## 🐛 故障排除

### 常见问题

1. **API密钥配置错误**
   ```
   错误: GLM API error: Unauthorized
   解决: 检查VITE_GLM_API_KEY环境变量是否正确配置
   ```

2. **分析超时**
   ```
   错误: Request timeout
   解决: 检查网络连接，或增加超时时间
   ```

3. **类型错误**
   ```
   错误: Type 'undefined' is not assignable
   解决: 确保正确导入类型定义
   ```

### 调试模式

```typescript
// 启用调试模式
const { getCacheStats } = useContentAnalysis(content);

// 查看缓存统计
console.log('Cache stats:', getCacheStats());
```

## 🤝 集成示例

### 与现有编辑器集成

```tsx
// 在ModularEditor中集成
import { ContentAnalysisPanel } from '@/components/analysis';

const ModularEditor = ({ paperId }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentContent, setCurrentContent] = useState('');
  
  return (
    <div className="flex">
      <div className="flex-1">
        {/* 编辑器内容 */}
        <RichTextEditor 
          content={currentContent}
          onChange={setCurrentContent}
        />
      </div>
      
      {showAnalysis && (
        <div className="w-96 border-l">
          <ContentAnalysisPanel 
            content={currentContent}
            onInsightClick={handleApplyInsight}
          />
        </div>
      )}
    </div>
  );
};
```

### 与Agent系统集成

```tsx
// 在Agent面板中显示分析结果
const AgentPanel = () => {
  const { result } = useContentAnalysis(content);
  
  const generateAgentSuggestions = () => {
    if (result?.actionableInsights) {
      return result.actionableInsights.map(insight => ({
        type: 'suggestion',
        title: insight.title,
        content: insight.description,
        action: insight.action,
        priority: insight.priority
      }));
    }
    return [];
  };
  
  return (
    <div>
      <AgentSuggestionCards suggestions={generateAgentSuggestions()} />
    </div>
  );
};
```

## 📝 更新日志

### v1.0.0 (2024-01-XX)
- ✅ 初始版本发布
- ✅ 支持GLM-4.5集成
- ✅ 学术规范检查
- ✅ 语言质量分析
- ✅ 结构完整性检查
- ✅ 创新性评估
- ✅ 实时分析功能
- ✅ 缓存机制
- ✅ 响应式UI组件

## 🔮 未来计划

- [ ] 支持更多AI模型 (GPT-4, Claude等)
- [ ] 多语言支持
- [ ] 自定义分析规则
- [ ] 分析历史管理
- [ ] 团队协作功能
- [ ] API文档生成
- [ ] 性能监控仪表板

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📞 支持

- 📧 Email: support@example.com
- 💬 Discord: [加入我们的Discord](https://discord.gg/example)
- 📚 文档: [在线文档](https://docs.example.com)
- 🐛 问题反馈: [GitHub Issues](https://github.com/example/repo/issues)

---

**享受智能写作的乐趣！** 🎉