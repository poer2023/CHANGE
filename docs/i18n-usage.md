# 双语切换功能使用指南

## 功能概述

已经实现了轻量级的双语切换功能，支持中文（zh）和英文（en）之间的即时切换。

## 已完成的功能

✅ 语言管理系统（LanguageContext + useTranslation Hook）  
✅ 语言切换组件（LanguageToggle）  
✅ 翻译文件系统（locales/index.ts）  
✅ NavBar导航栏双语支持  
✅ 本地存储语言偏好设置  
✅ 浏览器语言自动检测  

## 快速使用

### 1. 在组件中使用翻译

```tsx
import { useTranslation } from '@/hooks/useTranslation';

const MyComponent = () => {
  const { t, isZh, isEn } = useTranslation();
  
  return (
    <div>
      <h1>{t('nav.pricing')}</h1>
      <button>{t('common.save')}</button>
      
      {/* 条件渲染不同语言的特殊内容 */}
      {isZh ? <div>中文特有内容</div> : <div>English specific content</div>}
    </div>
  );
};
```

### 2. 添加语言切换按钮

```tsx
import LanguageToggle from '@/components/LanguageToggle';

// 基础使用
<LanguageToggle />

// 自定义样式
<LanguageToggle variant="outline" size="sm" showIcon={false} />
```

## 迁移其他组件

### 步骤1：添加翻译项

在 `src/locales/index.ts` 中添加新的翻译键：

```typescript
export type TranslationKey = 
  // ... 现有的keys
  | 'your.new.key'
  | 'another.key';

export const translations: Record<TranslationKey, Translation> = {
  // ... 现有翻译
  'your.new.key': { zh: '你的中文', en: 'Your English' },
  'another.key': { zh: '另一个中文', en: 'Another English' },
};
```

### 步骤2：在组件中替换硬编码文案

**替换前：**
```tsx
<button>保存</button>
<h1>设置页面</h1>
```

**替换后：**
```tsx
const { t } = useTranslation();

<button>{t('common.save')}</button>
<h1>{t('settings.title')}</h1>
```

## 已提供的翻译项

### 通用词汇
- `common.save`, `common.cancel`, `common.submit`
- `common.delete`, `common.edit`, `common.close`
- `common.back`, `common.next`, `common.confirm`

### 导航相关
- `nav.pricing`, `nav.about`, `nav.cases`, `nav.blog`
- `nav.login`, `nav.dashboard`, `nav.settings`

### 写作流程
- `flow.topic.title`, `flow.research.title`, `flow.strategy.title`
- `outcome.verification_level`, `outcome.instant_writing`

### 表单相关
- `form.title`, `form.assignment_type`, `form.word_count`
- `form.paper`, `form.report`, `form.review`

完整列表请查看 `src/locales/index.ts` 文件。

## 性能优化

- ✅ **零依赖** - 没有增加额外的包体积
- ✅ **即时切换** - 纯内存操作，无网络请求
- ✅ **类型安全** - TypeScript 支持，IDE 智能提示
- ✅ **本地持久化** - 语言偏好自动保存

## 扩展建议

### 优先迁移顺序
1. **主要导航和按钮** - 用户最常见的界面元素
2. **表单标签和提示** - 用户交互频繁的部分  
3. **结果页面和设置** - 功能性页面
4. **错误提示和说明** - 用户体验相关

### 命名规范
- 使用点分隔的层级结构：`category.subcategory.item`
- 通用词汇使用 `common.` 前缀
- 页面专用词汇使用页面名前缀：`nav.`, `form.`, `settings.`

### 最佳实践
- 翻译key保持语义化，便于理解和维护
- 对于较长的句子，考虑拆分成多个key便于复用
- 使用 `isZh` / `isEn` 处理两种语言差异较大的内容

## 文件结构

```
src/
├── contexts/
│   └── LanguageContext.tsx    # 语言上下文管理
├── hooks/
│   └── useTranslation.ts      # 翻译Hook
├── locales/
│   └── index.ts              # 翻译文件（所有翻译内容）
└── components/
    └── LanguageToggle.tsx    # 语言切换组件
```

现在你可以开始逐步将其他组件的文案迁移到这个双语系统中了！