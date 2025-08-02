# AI助手系统 (Agent System)

## 概述

本项目实现了一个完整的AI助手系统，提供强化的Agent能力和智能对话面板。系统包含四个专业化的AI助手角色，每个都有特定的专业领域和功能。

## 功能特性

### 🤖 四个专业AI助手

1. **学术写作专家** (`academic-writing-expert`)
   - 学术语言润色
   - 论文结构优化
   - 写作风格指导
   - 语法检查
   - 逻辑连贯性分析

2. **研究助手** (`research-assistant`)
   - 文献检索建议
   - 研究方法指导
   - 数据分析协助
   - 实验设计建议
   - 统计分析指导

3. **格式专家** (`format-expert`)
   - 引用格式检查
   - 排版规范指导
   - 图表格式优化
   - 参考文献管理
   - 期刊投稿格式

4. **内容顾问** (`content-advisor`)
   - 内容结构分析
   - 论证逻辑检查
   - 观点强化建议
   - 创新性评估
   - 读者体验优化

### 💬 智能对话系统

- **双模式切换**: Chat模式（连续对话）和Agent模式（专业建议）
- **多轮对话记忆**: 保持对话上下文和历史记录
- **流式对话模拟**: 真实的AI响应体验
- **智能建议卡片**: 实时生成针对性建议
- **快捷操作工具栏**: 一键执行常用功能

### ⚡ 快捷操作

系统提供12种快捷操作，涵盖：
- 🔍 **搜索类**: 查找文献、验证引用
- ⚡ **优化类**: 优化结构、逻辑检查
- ✅ **检查类**: 检查格式、语法检查
- ✨ **增强类**: 润色语言、图表优化
- 📊 **分析类**: 数据分析、方法审查
- 🎯 **生成类**: 写作建议、创新评估

## 技术架构

### 文件结构

```
src/
├── components/Agent/
│   ├── AgentPanel.tsx              # 主面板组件
│   ├── AgentRoleSwitcher.tsx       # 角色切换器
│   ├── ChatInterface.tsx          # 聊天界面
│   ├── ChatMessage.tsx            # 消息组件
│   ├── QuickActionBar.tsx         # 快捷操作栏
│   ├── AgentSuggestionCard.tsx    # 建议卡片
│   └── Agents/
│       ├── AcademicWritingExpert.tsx
│       ├── ResearchAssistant.tsx
│       ├── FormatExpert.tsx
│       └── ContentAdvisor.tsx
├── data/
│   └── agents.ts                   # Agent配置和模拟数据
├── store/
│   └── agentStore.ts              # 状态管理
├── types/
│   └── index.ts                   # 类型定义
└── styles/
    └── agent.css                  # 专用样式
```

### 状态管理

使用Zustand实现响应式状态管理：

```typescript
interface AgentStore {
  // 当前状态
  currentRole: AgentRole;
  currentAgent: Agent;
  isAgentPanelOpen: boolean;
  panelMode: 'chat' | 'agent';
  
  // 会话管理
  chatSessions: ChatSession[];
  activeSessionId: string | null;
  
  // 交互状态
  isLoading: boolean;
  selectedText: string;
  suggestions: AgentSuggestion[];
  
  // 上下文管理
  context: AgentContext;
}
```

### 类型系统

完整的TypeScript类型定义：

```typescript
export type AgentRole = 
  | 'academic-writing-expert'
  | 'research-assistant'
  | 'format-expert'
  | 'content-advisor';

export interface Agent {
  id: string;
  role: AgentRole;
  name: string;
  description: string;
  avatar: string;
  capabilities: string[];
  expertise: string[];
  isActive: boolean;
}

export interface AgentMessage extends ChatMessage {
  agentRole?: AgentRole;
  messageType: 'text' | 'suggestion' | 'action' | 'analysis';
  actions?: AgentAction[];
  suggestions?: AgentSuggestion[];
  metadata?: Record<string, any>;
}
```

## 使用方法

### 基本使用

1. **导入组件**:
```typescript
import { AgentPanel } from '../components/Agent';
import { useAgentStore } from '../store/agentStore';
```

2. **基本设置**:
```typescript
const {
  currentRole,
  setCurrentRole,
  isAgentPanelOpen,
  toggleAgentPanel
} = useAgentStore();
```

3. **渲染面板**:
```jsx
<AgentPanel className="w-80 h-full" />
```

### 高级用法

#### 自定义Agent响应

```typescript
const customResponse = {
  suggestions: [
    {
      id: 'custom-1',
      type: 'improvement',
      title: '自定义建议',
      content: '这是一个自定义的改进建议',
      confidence: 0.85,
      action: {
        id: 'apply-suggestion',
        type: 'text-replace',
        label: '应用建议',
        description: '应用这个改进建议',
        icon: '✨'
      }
    }
  ]
};
```

#### 扩展快捷操作

```typescript
const customActions: QuickAction[] = [
  {
    id: 'custom-action',
    label: '自定义操作',
    icon: '🎯',
    agentRole: 'academic-writing-expert',
    description: '执行自定义的分析操作',
    category: 'analyze'
  }
];
```

### 与文档编辑器集成

```typescript
// 处理文本选择
const handleTextSelection = () => {
  const selection = window.getSelection();
  if (selection && selection.toString().trim()) {
    setSelectedText(selection.toString().trim());
  }
};

// 在编辑器中使用
<div 
  className="editor-content"
  onMouseUp={handleTextSelection}
  style={{ userSelect: 'text' }}
>
  {documentContent}
</div>
```

## 演示页面

访问 `/agent-demo` 页面可以体验完整的Agent系统功能：

- 实时角色切换
- 智能对话模拟
- 快捷操作演示
- 建议卡片展示
- 文本选择分析

## 自定义配置

### 添加新的Agent角色

1. **扩展类型定义**:
```typescript
export type AgentRole = 
  | 'academic-writing-expert'
  | 'research-assistant'
  | 'format-expert'
  | 'content-advisor'
  | 'your-new-role';  // 添加新角色
```

2. **配置Agent数据**:
```typescript
export const AGENTS: Record<AgentRole, Agent> = {
  // ... 现有agents
  'your-new-role': {
    id: 'agent-your-role',
    role: 'your-new-role',
    name: '您的新角色',
    description: '角色描述',
    avatar: '🎭',
    capabilities: ['能力1', '能力2'],
    expertise: ['专长1', '专长2'],
    isActive: true
  }
};
```

3. **创建专门组件**:
```typescript
const YourNewAgent: React.FC<AgentProps> = ({ onSuggestion }) => {
  // 实现您的Agent逻辑
  return (
    <div>
      {/* Agent界面 */}
    </div>
  );
};
```

### 自定义样式

修改 `src/styles/agent.css` 文件来自定义界面样式：

```css
/* 自定义消息气泡样式 */
.message-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 自定义动画效果 */
@keyframes customSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

## 性能优化

1. **懒加载**: Agent组件支持按需加载
2. **内存管理**: 自动清理过期的对话会话
3. **响应式设计**: 适配移动端和桌面端
4. **虚拟滚动**: 处理大量消息历史

## 最佳实践

1. **保持对话简洁**: 避免过长的单次对话
2. **合理使用建议**: 不要忽略高置信度的建议
3. **定期清理数据**: 使用 `clearAllData()` 清理存储
4. **善用快捷操作**: 提高工作效率
5. **关注用户体验**: 保持界面响应性

## 故障排除

### 常见问题

1. **Agent不响应**: 检查网络连接和模拟延迟设置
2. **建议不显示**: 确认 `onSuggestion` 回调正确绑定
3. **样式异常**: 检查CSS导入和Tailwind配置
4. **状态丢失**: 确认持久化存储配置正确

### 调试技巧

```typescript
// 启用调试模式
const debug = process.env.NODE_ENV === 'development';

// 监控状态变化
useEffect(() => {
  if (debug) {
    console.log('Agent状态更新:', { currentRole, suggestions });
  }
}, [currentRole, suggestions]);
```

## 扩展计划

- [ ] 语音对话支持
- [ ] 多语言界面
- [ ] 自定义Agent训练
- [ ] 云端同步功能
- [ ] 集成外部API
- [ ] 实时协作功能

## 贡献指南

欢迎提交Issue和Pull Request来改进Agent系统！

## 许可证

本项目遵循 MIT 许可证。