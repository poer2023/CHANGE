# Claude Code 项目记忆文档

本文档记录了 AI 论文写作工具项目的关键技术问题、解决方案和最佳实践，为后续开发提供指导。

## ⚠️ 关键问题解决记录

### 1. 空白页面问题（浏览器兼容性）

**问题症状：**
- 开发模式(3000端口)显示空白页面，但页面标题正常
- 预览模式(4173端口)工作正常
- 控制台出现 `ReferenceError: process is not defined` 错误

**根本原因：**
多个文件中直接访问 `process.env`，但在浏览器环境中 `process` 对象未定义，导致整个React应用无法渲染。

**修复方案：**
将所有 `process.env` 访问替换为安全的浏览器兼容版本：

```typescript
// ❌ 错误写法 - 在浏览器中会报错
if (process.env.NODE_ENV === 'development') {
  console.log('开发模式');
}

// ✅ 正确写法 - 浏览器兼容
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
  console.log('开发模式');
}

// 对于环境变量获取
const apiKey = (typeof process !== 'undefined' ? process.env?.REACT_APP_GLM_API_KEY : '') || 
               import.meta.env?.VITE_GLM_API_KEY || '';
```

**已修复的文件：**
1. `src/components/ErrorBoundary.tsx`
2. `src/services/glm-client.ts`
3. `src/services/glmClient.ts`
4. `src/services/content-analyzer.ts`
5. `src/components/UI/ErrorBoundary.tsx`
6. `src/utils/validateImports.ts`
7. `src/utils/lazyLoading.tsx`
8. `src/utils/performance.ts`

### 2. 诊断方法总结

**系统性问题排查流程：**

1. **创建最小化测试组件**
   ```typescript
   // 用最简单的组件测试React渲染是否正常
   function App() {
     return <div>测试页面 - 当前时间: {new Date().toLocaleString()}</div>;
   }
   ```

2. **逐步恢复组件功能**
   - 先测试基础路由
   - 再添加ErrorBoundary
   - 逐个导入复杂组件
   - 通过二分法定位问题组件

3. **检查控制台错误**
   - 使用浏览器开发者工具
   - 关注模块加载时的同步错误
   - 特别注意 `ReferenceError` 类型错误

4. **验证服务器响应**
   ```bash
   curl -s "http://localhost:3000" | grep -A 10 -B 5 "root"
   ```

## 🛠️ 开发最佳实践

### 环境变量处理

**推荐模式：**
```typescript
// 创建环境变量获取工具函数
const getEnvVar = (key: string, fallback: string = ''): string => {
  // Vite 环境变量（优先）
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || fallback;
  }
  
  // Node.js 环境变量（服务端渲染）
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  
  return fallback;
};

// 使用示例
const apiKey = getEnvVar('VITE_GLM_API_KEY');
const isDev = getEnvVar('NODE_ENV') === 'development';
```

### ErrorBoundary 最佳实践

```typescript
// 在开发环境中提供详细错误信息
{(typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') && 
  this.state.error && (
    <details>
      <summary>错误详情</summary>
      <pre>{this.state.error.toString()}</pre>
    </details>
  )
}
```

### 组件导入策略

1. **基础组件优先** - 先确保简单组件能正常工作
2. **错误边界保护** - 为复杂组件添加ErrorBoundary
3. **懒加载复杂组件** - 避免初始化时的同步错误
4. **模块化导入** - 便于问题定位和修复

## 🔧 调试工具和命令

### 常用调试命令

```bash
# 检查端口占用
lsof -i :3000
lsof -i :4173

# 测试服务器响应
curl -s http://localhost:3000

# 搜索代码中的问题模式
grep -r "process\.env" src/
grep -r "import.*from.*components" src/
```

### 浏览器调试

1. **控制台检查** - 关注模块加载错误
2. **网络面板** - 检查资源加载状态
3. **React开发者工具** - 检查组件渲染状态

## 📁 项目架构要点

### 组件组织结构

```
src/
├── components/          # 可复用组件
│   ├── UI/             # 基础UI组件
│   ├── analysis/       # 内容分析组件
│   ├── test/           # 测试组件（GLM等）
│   └── index.ts        # 统一导出
├── pages/              # 页面组件
├── services/           # 服务层（API客户端等）
├── hooks/              # 自定义Hooks
└── utils/              # 工具函数
```

### 关键依赖说明

- **React Router** - 路由管理，需要ErrorBoundary保护
- **GLM API客户端** - 需要环境变量配置，注意浏览器兼容性
- **内容分析服务** - 依赖GLM客户端，同样需要兼容性处理

## 🚀 部署注意事项

### 环境变量配置

```bash
# 开发环境 (.env.local)
VITE_GLM_API_KEY=your_api_key_here
VITE_GLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4

# 生产环境
# 确保所有VITE_前缀的环境变量都已正确配置
```

### 构建验证

```bash
# 开发模式测试
npm run dev

# 预览模式测试  
npm run build
npm run preview

# 确保两种模式都能正常工作
```

## 📝 经验教训

1. **环境兼容性是关键** - 永远不要假设浏览器环境有Node.js对象
2. **逐步调试法最有效** - 从简单到复杂，二分法定位问题
3. **错误边界是必需的** - 特别是对于复杂的第三方依赖组件
4. **文档记录很重要** - 记录问题和解决方案，避免重复踩坑

---

**更新时间：** 2025-08-04  
**更新原因：** 修复开发模式空白页面问题，添加浏览器兼容性最佳实践