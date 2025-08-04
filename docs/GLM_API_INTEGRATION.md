# GLM-4.5 API 集成文档

## 概述

本文档描述了CHANGE项目中GLM-4.5 API的完整集成方案，包括客户端配置、API使用方法、测试指南等。

## 功能特性

### ✅ 已完成功能

1. **完整的GLM API客户端** (`src/services/glm-client.ts`)
   - 支持流式和非流式响应
   - 完整的错误处理和重试机制
   - TypeScript类型定义
   - 连接测试和状态监控

2. **流式AI Hook** (`src/hooks/useStreamingAI.ts`)
   - 处理SSE流式数据
   - 管理连接状态
   - 实现打字机效果
   - 支持真实API和模拟数据切换

3. **环境变量配置** (`.env.example`)
   - API密钥管理
   - 配置模板和使用说明
   - 安全性指导

4. **测试组件**
   - 聊天对话测试 (`/test/glm-chat`)
   - 内容生成测试 (`/test/glm-content`)
   - 完整的UI界面和功能验证

## 快速开始

### 1. 配置API密钥

1. 复制环境变量模板：
   ```bash
   cp .env.example .env.local
   ```

2. 在 [智谱AI开放平台](https://open.bigmodel.cn/) 注册账号并获取API密钥

3. 编辑 `.env.local` 文件，替换API密钥：
   ```env
   VITE_GLM_API_KEY=your_actual_api_key_here
   ```

4. 重启开发服务器：
   ```bash
   npm run dev
   ```

### 2. 访问测试页面

开发服务器启动后，访问以下URL进行测试：

- **聊天对话测试**: http://localhost:3001/test/glm-chat
- **内容生成测试**: http://localhost:3001/test/glm-content

## API使用方法

### 基础客户端使用

```typescript
import { defaultGLMClient } from '@/services/glm-client';

// 简单聊天
const response = await defaultGLMClient.simpleChat(
  "你好，请介绍一下自己",
  "你是一个友好的AI助手"
);

// 流式聊天
const streamResponse = await defaultGLMClient.simpleChatStream(
  "写一篇关于AI的文章",
  "你是一个专业的技术写作者",
  {
    onStream: (chunk) => console.log(chunk),
    onComplete: (content) => console.log('完成:', content),
    onError: (error) => console.error('错误:', error)
  }
);

// 测试连接
const status = await defaultGLMClient.testConnection();
console.log('连接状态:', status);
```

### Hook使用

```typescript
import { useStreamingAI } from '@/hooks/useStreamingAI';

function MyComponent() {
  const {
    content,
    isStreaming,
    error,
    startStreaming,
    generateContent,
    isReady
  } = useStreamingAI({
    temperature: 0.7,
    maxTokens: 1000,
    systemMessage: "你是一个专业的写作助手"
  });

  const handleGenerate = async () => {
    // 流式生成
    await startStreaming("请帮我写一篇文章");
    
    // 或者直接生成
    const result = await generateContent("请帮我写一篇文章");
  };

  return (
    <div>
      {isReady ? (
        <button onClick={handleGenerate} disabled={isStreaming}>
          {isStreaming ? '生成中...' : '开始生成'}
        </button>
      ) : (
        <p>请配置GLM API密钥</p>
      )}
      
      {error && <div className="error">{error}</div>}
      {content && <div className="content">{content}</div>}
    </div>
  );
}
```

## 测试指南

### 聊天对话测试

访问 `/test/glm-chat` 页面，可以测试：

1. **连接状态检查**
   - 客户端配置状态
   - API连接测试
   - 延迟监控

2. **对话功能**
   - 流式聊天（推荐）
   - 直接聊天
   - 多轮对话
   - 停止生成

3. **界面功能**
   - 实时打字效果
   - 消息历史
   - 错误处理

### 内容生成测试

访问 `/test/glm-content` 页面，可以测试：

1. **写作场景**
   - 写作建议
   - 语法检查
   - 内容扩展
   - 结构优化
   - 创意写作
   - 学术写作

2. **功能验证**
   - 不同系统提示
   - 生成质量评估
   - 结果保存
   - 统计信息

## 技术架构

### 核心组件

```
src/
├── services/
│   └── glm-client.ts          # GLM API客户端
├── hooks/
│   └── useStreamingAI.ts      # 流式AI Hook
├── types/
│   └── index.ts               # TypeScript类型定义
└── components/
    └── test/
        ├── GLMChatTest.tsx    # 聊天测试组件
        └── GLMContentTest.tsx # 内容生成测试组件
```

### 数据流

```
用户输入 → useStreamingAI Hook → GLMClient → GLM API
                ↓
        组件状态更新 ← 流式响应处理 ← SSE数据流
```

## 配置选项

### 环境变量

| 变量名 | 描述 | 默认值 | 必需 |
|--------|------|--------|------|
| `VITE_GLM_API_KEY` | GLM API密钥 | - | ✅ |
| `VITE_GLM_BASE_URL` | API基础URL | `https://open.bigmodel.cn/api/paas/v4` | ❌ |
| `VITE_GLM_DEFAULT_MODEL` | 默认模型 | `glm-4-flash` | ❌ |
| `VITE_GLM_TIMEOUT` | 请求超时时间(ms) | `30000` | ❌ |
| `VITE_GLM_MAX_RETRIES` | 最大重试次数 | `3` | ❌ |

### 模型选择

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| `glm-4-flash` | 免费，快速 | 开发测试 |
| `glm-4` | 平衡性能 | 生产环境 |
| `glm-4-plus` | 最佳性能 | 高质量需求 |

## 错误处理

### 常见错误

1. **API密钥未配置**
   ```
   GLM客户端未配置，请检查API密钥设置
   ```
   **解决方案**: 配置 `VITE_GLM_API_KEY` 环境变量

2. **网络连接失败**
   ```
   HTTP 500: Internal Server Error
   ```
   **解决方案**: 检查网络连接，确认API服务状态

3. **请求频率限制**
   ```
   Rate limit exceeded
   ```
   **解决方案**: 降低请求频率，考虑升级付费版本

4. **Token限制**
   ```
   Maximum context length exceeded
   ```
   **解决方案**: 减少输入内容长度或调整 `maxTokens` 参数

### 错误监控

系统提供完整的错误处理机制：

- 自动重试机制
- 详细错误信息
- 连接状态监控
- 降级策略（模拟数据）

## 性能优化

### 最佳实践

1. **合理设置参数**
   ```typescript
   {
     temperature: 0.7,      // 平衡创意和准确性
     maxTokens: 1000,       // 根据需求设置
     stream: true           // 优先使用流式响应
   }
   ```

2. **错误处理**
   ```typescript
   try {
     const result = await client.simpleChat(prompt);
   } catch (error) {
     // 实现降级策略
     return fallbackResponse;
   }
   ```

3. **资源管理**
   ```typescript
   // 组件卸载时清理资源
   useEffect(() => {
     return () => {
       stopStreaming();
     };
   }, []);
   ```

## 安全性

### API密钥安全

1. **环境变量**: 使用 `.env.local` 存储密钥
2. **Git忽略**: `.env.local` 已添加到 `.gitignore`
3. **前缀要求**: 必须使用 `VITE_` 前缀
4. **定期轮换**: 定期更换API密钥

### 请求安全

1. **输入验证**: 验证用户输入内容
2. **内容过滤**: 实施内容审核机制
3. **频率限制**: 防止API滥用
4. **错误日志**: 记录但不暴露敏感信息

## 故障排除

### 检查清单

- [ ] API密钥已正确配置
- [ ] 网络连接正常
- [ ] 环境变量格式正确
- [ ] 开发服务器已重启
- [ ] 浏览器控制台无错误

### 调试方法

1. **连接测试**: 访问测试页面验证连接
2. **控制台日志**: 查看详细错误信息
3. **网络面板**: 检查API请求状态
4. **模拟模式**: 使用模拟数据验证功能

## 后续开发

### 扩展计划

1. **Agent系统集成**: 将GLM API集成到现有Agent系统
2. **缓存机制**: 实现响应缓存优化性能
3. **多模型支持**: 支持其他AI模型
4. **批量处理**: 支持批量内容生成
5. **用户偏好**: 记住用户的生成偏好

### 贡献指南

1. 遵循现有代码风格
2. 完善TypeScript类型定义
3. 添加单元测试
4. 更新文档

---

## 联系支持

如有问题或需要支持，请：

1. 查看 [智谱AI官方文档](https://open.bigmodel.cn/dev/api)
2. 检查项目的GitHub Issues
3. 联系项目维护者

---

**最后更新**: 2025-08-03
**版本**: 1.0.0