# 模块化编辑系统文档

## 概述

模块化编辑系统是一个先进的论文写作工具，采用模块化架构设计，支持拖拽排序、模板应用、AI建议等功能，为学术写作提供全方位支持。

## 核心功能

### 1. 模块化架构
- **论文章节模块**：支持摘要、引言、方法、结果、讨论、结论等标准学术论文结构
- **自定义模块**：用户可创建自定义模块以满足特殊需求
- **模块依赖关系**：可视化展示模块间的逻辑依赖关系
- **进度跟踪**：实时跟踪每个模块的完成进度和字数统计

### 2. 三栏式布局
- **左侧结构导航树**：
  - 可拖拽重新排序
  - 支持多选批量操作
  - 实时进度显示
  - 模块状态指示

- **中间编辑区域**：
  - 卡片式/列表式/大纲式视图切换
  - 模块内容直接编辑
  - 拖拽重新排序
  - 模块展开/折叠

- **右侧属性面板**：
  - 模块属性编辑
  - AI写作建议
  - 模板库浏览
  - 智能内容分析

### 3. 拖拽交互
- **流畅拖拽体验**：支持模块间拖拽重新排序
- **视觉反馈**：拖拽过程中提供清晰的视觉指示
- **自动保存**：拖拽完成后自动保存结构变更
- **撤销重做**：支持操作历史记录和撤销功能

### 4. 模板系统
- **丰富模板库**：
  - 研究论文模板
  - 学位论文模板
  - 会议论文模板
  - 期刊论文模板

- **模板特性**：
  - 预定义结构和章节
  - 写作指导和提示
  - 字数目标设定
  - 格式规范要求

### 5. 智能特性
- **AI结构建议**：基于论文类型智能推荐章节结构
- **内容一致性检查**：检测模块间内容的逻辑一致性
- **自动交叉引用**：智能识别和管理模块间的引用关系
- **智能模板推荐**：根据写作内容推荐合适的模板

## 技术架构

### 组件结构
```
components/editor/
├── ModularEditor.tsx          # 主编辑器组件
├── StructureTree.tsx          # 结构导航树
├── ModuleCard.tsx            # 模块卡片
├── ModuleDragDrop.tsx        # 拖拽容器
└── TemplateLibrary.tsx       # 模板库
```

### 数据类型
```typescript
interface PaperModule {
  id: string;
  type: ModuleType;
  title: string;
  content: string;
  order: number;
  isCollapsed: boolean;
  isCompleted: boolean;
  wordCount: number;
  progress: number;
  dependencies: string[];
  template?: ModuleTemplate;
  metadata: ModuleMetadata;
}
```

### 状态管理
- 使用 Zustand 进行状态管理
- 支持持久化存储
- 实时同步多个组件状态

## 使用指南

### 基本操作

1. **创建模块**
   ```typescript
   // 添加新模块
   const newModule = {
     type: 'introduction',
     title: '引言',
     content: '',
     // ...其他属性
   };
   ```

2. **编辑模块内容**
   - 点击模块卡片进入编辑模式
   - 支持实时保存和自动调整高度
   - 提供字数统计和进度跟踪

3. **重新排序模块**
   - 拖拽模块卡片或结构树项目
   - 自动更新order字段
   - 检查依赖关系冲突

4. **应用模板**
   - 从模板库选择合适模板
   - 自动创建预定义模块结构
   - 提供写作指导和格式要求

### 高级功能

1. **批量操作**
   - Ctrl/Cmd + 点击多选模块
   - 支持批量复制、移动、删除
   - 批量应用模板或格式

2. **模块依赖**
   - 设置模块间的逻辑依赖关系
   - 可视化依赖图显示
   - 防止循环依赖

3. **AI辅助**
   - 实时写作建议
   - 结构优化提示
   - 内容质量评估

## 自定义配置

### 模块类型扩展
```typescript
// 添加新的模块类型
type CustomModuleType = 
  | 'methodology' 
  | 'case-study' 
  | 'survey-analysis'
  | 'custom';
```

### 模板定制
```typescript
// 创建自定义模板
const customTemplate: ModuleTemplate = {
  name: '实验研究模板',
  structure: [
    { title: '实验设计', isRequired: true },
    { title: '数据收集', isRequired: true },
    { title: '结果分析', isRequired: true }
  ],
  guidelines: ['详述实验流程', '提供原始数据']
};
```

### 样式定制
```css
/* 自定义模块卡片样式 */
.module-card.custom-theme {
  border-color: #your-color;
  background: linear-gradient(to-right, #start, #end);
}
```

## 性能优化

### 虚拟化渲染
- 大量模块时使用虚拟滚动
- 按需加载模块内容
- 优化拖拽性能

### 状态优化
- 使用 React.memo 优化组件渲染
- 防抖处理用户输入
- 批量更新状态变更

### 内存管理
- 及时清理无用的事件监听器
- 优化大文件的处理
- 实现智能缓存策略

## 扩展开发

### 插件系统
```typescript
interface EditorPlugin {
  name: string;
  version: string;
  activate: (editor: ModularEditor) => void;
  deactivate: () => void;
}
```

### API 集成
```typescript
// 与后端 API 集成
const moduleAPI = {
  save: (modules: PaperModule[]) => Promise<void>,
  load: (paperId: string) => Promise<PaperModule[]>,
  sync: (changes: ModuleChange[]) => Promise<void>
};
```

## 故障排除

### 常见问题

1. **拖拽不工作**
   - 检查浏览器兼容性
   - 确认事件处理器正确绑定
   - 验证拖拽权限设置

2. **模块内容丢失**
   - 检查自动保存功能
   - 验证本地存储空间
   - 确认网络连接状态

3. **性能问题**
   - 减少同时打开的模块数量
   - 清理浏览器缓存
   - 检查内存使用情况

### 调试工具
- 开发者控制台日志
- 状态调试面板
- 性能监控工具

## 更新日志

### v1.0.0 (Current)
- ✅ 基础模块化编辑功能
- ✅ 三栏式布局设计
- ✅ 拖拽重新排序
- ✅ 模板库系统
- ✅ AI写作建议
- ✅ 进度跟踪功能

### 计划功能
- 🔄 协作编辑支持
- 🔄 版本控制系统
- 🔄 云端同步
- 🔄 移动端适配
- 🔄 插件生态系统

## 贡献指南

欢迎贡献代码和建议！请遵循以下步骤：

1. Fork 仓库
2. 创建功能分支
3. 提交代码变更
4. 编写测试用例
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证。详见 LICENSE 文件。