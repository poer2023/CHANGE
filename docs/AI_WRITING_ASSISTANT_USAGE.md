# AI写作助手系统 - 使用示例

这个文档展示了如何在项目中使用AI写作助手系统。

## 基本使用

### 1. 创建AI写作助手系统

```typescript
import { createDefaultAIWritingSystem } from '../services/ai-writing-assistant-system';

// 创建默认配置的AI系统
const aiSystem = createDefaultAIWritingSystem();

// 或者使用自定义配置
const customSystem = createAIWritingAssistantSystem({
  glmConfig: {
    apiKey: 'your-api-key',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    timeout: 30000
  },
  collaborationConfig: {
    enabled: true,
    debounceMs: 500,
    maxSuggestions: 3
  }
});
```

### 2. 基本写作助手功能

```typescript
import { Paper } from '../types';

// 示例论文数据
const paper: Paper = {
  id: 'paper-1',
  title: '深度学习研究',
  content: '这是论文内容...',
  paperType: 'research',
  field: 'computer_science',
  // ... 其他属性
};

// 开始写作会话
const session = await aiSystem.assistant.startWritingSession(paper, {
  language: 'zh',
  writingStyle: 'academic',
  detailLevel: 'detailed'
});

// 获取续写建议
const continueSuggestion = await aiSystem.assistant.getWritingSuggestion('continue', {
  targetText: '当前文本内容',
  userPrompt: '请继续写关于深度学习的内容'
});

// 获取润色建议
const polishSuggestion = await aiSystem.assistant.getWritingSuggestion('polish', {
  targetText: '需要润色的文本'
});
```

### 3. 实时协作功能

```typescript
// 启动实时协作
aiSystem.collaborator.startCollaboration();

// 监听建议更新
aiSystem.collaborator.on('suggestions:updated', (data) => {
  console.log('收到新建议:', data.suggestions);
});

// 处理文本变化事件
aiSystem.collaborator.handleWritingEvent({
  type: 'text_insert',
  timestamp: new Date(),
  position: 100,
  content: '新插入的文本'
});

// 获取实时建议
const realTimeSuggestions = await aiSystem.collaborator.getRealTimeSuggestions(
  '完整文本内容',
  100 // 光标位置
);
```

### 4. 论文类型适配

```typescript
import { PaperType, AcademicField } from '../services/paper-type-adapter';

// 获取论文配置
const paperConfig = aiSystem.typeAdapter.getPaperConfig(
  PaperType.RESEARCH,
  AcademicField.COMPUTER_SCIENCE
);

// 获取写作指导
const guidance = aiSystem.typeAdapter.getWritingGuidance({
  paperType: PaperType.RESEARCH,
  field: AcademicField.COMPUTER_SCIENCE,
  wordCount: 5000,
  targetAudience: 'academic',
  language: 'zh'
});

// 验证论文结构
const validation = aiSystem.typeAdapter.validatePaperStructure(paper);
console.log('论文结构验证结果:', validation);
```

## React组件使用

### 1. AI写作助手面板

```typescript
import React from 'react';
import { AIWritingAssistantPanel } from '../components/ai-assistant';

const MyEditor: React.FC = () => {
  const [aiSystem] = useState(() => createDefaultAIWritingSystem());
  const [currentPaper] = useState<Paper>(/* 论文数据 */);

  const handleSuggestionApply = (suggestion: WritingSuggestion) => {
    // 处理建议应用
    console.log('应用建议:', suggestion);
  };

  return (
    <div className="flex">
      <div className="flex-1">
        {/* 编辑器内容 */}
      </div>
      <div className="w-80">
        <AIWritingAssistantPanel
          paper={currentPaper}
          assistant={aiSystem.assistant}
          collaborator={aiSystem.collaborator}
          onSuggestionApply={handleSuggestionApply}
        />
      </div>
    </div>
  );
};
```

### 2. 建议操作面板

```typescript
import { SuggestionActionPanel } from '../components/ai-assistant';

const MySuggestionHandler: React.FC<{ suggestion: WritingSuggestion }> = ({ suggestion }) => {
  const handleAction = (result: SuggestionActionResult) => {
    switch (result.action) {
      case 'accept':
        // 接受建议
        break;
      case 'reject':
        console.log('拒绝原因:', result.reason);
        break;
      case 'modify':
        console.log('修改内容:', result.modifiedContent);
        break;
    }
  };

  return (
    <SuggestionActionPanel
      suggestion={suggestion}
      onAction={handleAction}
      onClose={() => {}}
    />
  );
};
```

## 工具函数使用

### 1. 快速获取建议

```typescript
import { AIWritingAssistantUtils } from '../services/ai-writing-assistant-system';

// 快速获取论文建议
const quickSuggestions = await AIWritingAssistantUtils.getQuickSuggestions(
  aiSystem,
  paper,
  '选中的文本'
);

console.log('指导建议:', quickSuggestions.guidance);
console.log('写作建议:', quickSuggestions.suggestions);
```

### 2. 验证论文质量

```typescript
// 验证论文质量
const qualityCheck = AIWritingAssistantUtils.validatePaperQuality(aiSystem, paper);

console.log('论文有效性:', qualityCheck.isValid);
console.log('缺失章节:', qualityCheck.missingRequired);
console.log('改进建议:', qualityCheck.suggestions);
console.log('常见错误:', qualityCheck.commonMistakes);
```

### 3. 获取写作统计

```typescript
// 获取写作统计信息
const stats = AIWritingAssistantUtils.getWritingStats(aiSystem);

console.log('会话统计:', stats.session);
console.log('协作统计:', stats.collaboration);
console.log('整体效率:', stats.overall.efficiency);
```

## 预设配置

```typescript
import { AIWritingAssistantPresets } from '../services/ai-writing-assistant-system';

// 使用研究论文预设
const researchSystem = createAIWritingAssistantSystem(
  AIWritingAssistantPresets.research
);

// 使用学位论文预设
const thesisSystem = createAIWritingAssistantSystem(
  AIWritingAssistantPresets.thesis
);

// 使用快速写作预设
const quickSystem = createAIWritingAssistantSystem(
  AIWritingAssistantPresets.quick
);
```

## 错误处理

```typescript
import { AIWritingAssistantError, ErrorCodes } from '../services/ai-writing-assistant-system';

try {
  const suggestion = await aiSystem.assistant.getWritingSuggestion('continue');
} catch (error) {
  if (error instanceof AIWritingAssistantError) {
    switch (error.code) {
      case ErrorCodes.API_KEY_MISSING:
        console.error('API密钥未配置');
        break;
      case ErrorCodes.SESSION_NOT_STARTED:
        console.error('请先开始写作会话');
        break;
      default:
        console.error('AI助手错误:', error.message);
    }
  }
}
```

## 环境变量配置

```bash
# .env.local
VITE_GLM_API_KEY=your_glm_api_key_here
VITE_GLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
VITE_GLM_TIMEOUT=30000
VITE_GLM_MAX_RETRIES=3
```

## 注意事项

1. **API密钥安全**: 确保GLM API密钥安全存储，不要提交到代码仓库
2. **错误处理**: 始终包含适当的错误处理逻辑
3. **资源清理**: 在组件卸载时调用相应的清理方法
4. **性能优化**: 合理使用防抖和缓存机制
5. **用户体验**: 提供加载状态和错误反馈

## 演示页面

查看完整的演示实现：`src/pages/demo/AIWritingAssistantDemo.tsx`

这个演示展示了：
- 完整的AI写作助手系统初始化
- 实时文本编辑和建议获取
- 论文质量验证
- 写作统计信息
- 用户交互界面