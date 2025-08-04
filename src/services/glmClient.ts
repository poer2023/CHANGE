/**
 * GLM-4.5 API客户端服务
 * 基于nnpp项目的GLM客户端，为CHANGE项目提供AI功能
 */

import { AgentRole, AgentMessage, QuickAction } from '../types';

// GLM模型类型
export type GLMModel = 'glm-4.5' | 'glm-4.5-flash' | 'glm-4.5-x' | 'glm-4' | 'glm-4-plus';

// GLM消息类型
export interface GLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// GLM请求配置
export interface GLMRequestConfig {
  model?: GLMModel;
  messages: GLMMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

// GLM响应类型
export interface GLMResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// 流式响应chunk
export interface GLMStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: 'assistant';
      content?: string;
    };
    finish_reason?: string;
  }>;
}

// Agent系统提示模板
export const AGENT_SYSTEM_PROMPTS: Record<AgentRole, string> = {
  'academic-writing-expert': `你是一位专业的学术写作专家，具有以下专长：
- 学术论文写作规范和语言表达优化
- 论文结构设计和逻辑组织
- 科学表达和批判性思维指导
- 语法检查和写作风格改进
- 文献综述和引用规范

请以专业、准确、建设性的方式提供建议。回复应该：
1. 具体明确，提供可操作的改进建议
2. 符合学术写作标准和规范
3. 保持专业且友好的语调
4. 提供具体的例子和替换建议`,

  'research-assistant': `你是一位经验丰富的研究助手，专精于：
- 文献检索和管理
- 研究方法论指导
- 数据分析和统计方法
- 实验设计和实证研究
- 研究趋势和前沿跟踪

请以科学、客观、实用的方式协助研究工作。回复应该：
1. 基于实证和最佳实践
2. 提供具体的方法和工具建议
3. 包含相关的资源和参考
4. 考虑研究的可行性和效率`,

  'format-expert': `你是一位格式规范专家，专门处理：
- 学术引用格式（APA、MLA、Chicago、IEEE等）
- 论文排版和格式标准
- 图表设计和编号规范
- 参考文献管理
- 期刊投稿格式要求

请以精确、详细、标准化的方式提供格式指导。回复应该：
1. 严格遵循格式标准
2. 提供具体的格式示例
3. 指出常见错误和注意事项
4. 提供格式检查清单`,

  'content-advisor': `你是一位内容策略顾问，专注于：
- 内容结构和逻辑分析
- 论证强度和说服力评估
- 创新性和贡献度评价
- 读者体验和传播效果
- 学术影响力优化

请以战略性、全局性、创新性的角度提供内容建议。回复应该：
1. 从整体结构角度分析
2. 提供逻辑改进建议
3. 评估内容的影响力潜力
4. 建议创新点和亮点`
};

// 快捷操作的专业提示模板
export const QUICK_ACTION_PROMPTS: Record<string, (context: string) => string> = {
  'search-literature': (context: string) => `
作为研究助手，请基于以下内容推荐相关的高质量文献：

内容：${context}

请提供：
1. 3-5篇高相关性的学术论文（包含作者、标题、期刊、年份）
2. 简要说明每篇文献与当前研究的相关性
3. 建议的阅读顺序和重点关注内容
4. 可能的引用点和应用方式

要求：
- 优先推荐近5年的高影响因子文献
- 包含方法论和实证研究
- 提供具体的检索建议`,

  'verify-citations': (context: string) => `
作为格式专家，请检查以下内容的引用格式和完整性：

内容：${context}

请检查并报告：
1. 引用格式是否符合标准（请指明检测到的格式标准）
2. 引用信息的完整性（缺失的必要信息）
3. 文内引用与参考文献的对应关系
4. 格式统一性问题

如发现问题，请提供：
- 具体的错误位置
- 正确的格式示例
- 修改建议`,

  'optimize-structure': (context: string) => `
作为内容顾问，请分析以下内容的结构并提供优化建议：

内容：${context}

请分析：
1. 当前结构的逻辑性和连贯性
2. 段落间的过渡和衔接
3. 信息层次和重点突出
4. 论证的完整性和说服力

请提供：
- 具体的结构调整建议
- 内容重组方案
- 逻辑优化策略
- 改进后的大纲建议`,

  'check-logic': (context: string) => `
作为内容顾问，请检查以下内容的逻辑性和论证质量：

内容：${context}

请分析：
1. 论证的逻辑链条是否完整
2. 证据与结论的支撑关系
3. 推理过程的严密性
4. 可能的逻辑漏洞或薄弱环节

请指出：
- 逻辑不一致的地方
- 需要补充的论证环节
- 证据不足的论点
- 改进建议`,

  'format-check': (context: string) => `
作为格式专家，请全面检查以下内容的格式规范：

内容：${context}

请检查：
1. 标题层级和编号格式
2. 段落格式和间距
3. 图表标题和编号
4. 引用和参考文献格式
5. 整体排版规范

请报告：
- 发现的格式问题清单
- 具体的修改建议
- 标准格式示例
- 格式优化建议`,

  'table-charts': (context: string) => `
作为格式专家，请分析以下图表内容并提供优化建议：

内容：${context}

请评估：
1. 图表类型的适当性
2. 数据呈现的清晰度
3. 标题和标注的完整性
4. 视觉设计的专业性
5. 学术规范的符合性

请提供：
- 图表设计改进建议
- 标题和说明优化方案
- 数据呈现最佳实践
- 专业格式要求`,

  'polish-language': (context: string) => `
作为学术写作专家，请对以下文本进行语言润色：

原文：${context}

请提供：
1. 改进后的文本版本
2. 具体的修改说明
3. 学术表达的替代方案
4. 语言质量提升建议

重点关注：
- 学术语言的准确性和正式性
- 表达的简洁和清晰
- 专业术语的恰当使用
- 语法和句式的优化`,

  'grammar-check': (context: string) => `
作为学术写作专家，请检查以下文本的语法和表达问题：

文本：${context}

请检查：
1. 语法错误（时态、语态、主谓一致等）
2. 拼写和标点问题
3. 句式结构问题
4. 用词准确性

请提供：
- 错误位置的具体标注
- 正确的表达方式
- 改进建议和解释
- 预防类似错误的建议`,

  'data-analysis': (context: string) => `
作为研究助手，请基于以下内容提供数据分析建议：

内容：${context}

请分析：
1. 适合的统计分析方法
2. 数据收集和处理策略
3. 可能的分析工具和软件
4. 结果解释和呈现方式

请提供：
- 具体的分析步骤
- 方法选择的理由
- 注意事项和限制
- 结果验证建议`,

  'methodology-review': (context: string) => `
作为研究助手，请评估以下研究方法的适当性：

方法描述：${context}

请评估：
1. 方法论的科学性和严谨性
2. 与研究目标的匹配度
3. 实施的可行性
4. 潜在的局限性和偏差

请提供：
- 方法改进建议
- 替代方案比较
- 质量控制措施
- 结果信度和效度保障`,

  'writing-suggestions': (context: string) => `
作为学术写作专家，请针对以下内容提供写作改进建议：

内容：${context}

请从以下方面提供建议：
1. 写作结构和组织
2. 语言表达和风格
3. 论证逻辑和说服力
4. 学术规范和专业性

请提供：
- 具体的改写示例
- 表达技巧和策略
- 常见问题的解决方案
- 写作质量提升路径`,

  'innovation-assessment': (context: string) => `
作为内容顾问，请评估以下内容的创新性和学术贡献：

内容：${context}

请评估：
1. 创新点和独特性
2. 学术贡献和价值
3. 理论和实践意义
4. 与现有研究的差异

请提供：
- 创新性分析报告
- 贡献度评估
- 影响力预测
- 提升创新性的建议`
};

class GLMClientService {
  private apiKey: string;
  private baseURL: string;
  private defaultModel: GLMModel;

  constructor() {
    // 这里应该从环境变量或配置中获取
    this.apiKey = process.env.REACT_APP_GLM_API_KEY || '';
    this.baseURL = process.env.REACT_APP_GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';
    this.defaultModel = 'glm-4.5-flash'; // 使用免费版本作为默认
  }

  /**
   * 发送聊天请求
   */
  async chat(config: GLMRequestConfig): Promise<GLMResponse> {
    const requestConfig = {
      model: this.defaultModel,
      temperature: 0.7,
      max_tokens: 4096,
      stream: false,
      ...config,
    };

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestConfig),
      });

      if (!response.ok) {
        throw new Error(`GLM API错误: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GLM API调用失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 发送流式聊天请求
   */
  async *chatStream(config: GLMRequestConfig): AsyncGenerator<GLMStreamChunk, void, unknown> {
    const requestConfig = {
      model: this.defaultModel,
      temperature: 0.7,
      max_tokens: 4096,
      stream: true,
      ...config,
    };

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestConfig),
      });

      if (!response.ok) {
        throw new Error(`GLM API错误: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法创建流读取器');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              const chunk: GLMStreamChunk = JSON.parse(data);
              yield chunk;
            } catch (e) {
              console.warn('解析流数据失败:', data);
            }
          }
        }
      }
    } catch (error) {
      console.error('GLM流式API调用失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Agent聊天功能
   */
  async agentChat(
    agentRole: AgentRole,
    userMessage: string,
    context?: string
  ): Promise<string> {
    const systemPrompt = AGENT_SYSTEM_PROMPTS[agentRole];
    
    const messages: GLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: context ? `${context}\n\n${userMessage}` : userMessage }
    ];

    const response = await this.chat({
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    });

    return response.choices[0]?.message?.content || '抱歉，我无法处理您的请求。';
  }

  /**
   * Agent流式聊天功能
   */
  async *agentChatStream(
    agentRole: AgentRole,
    userMessage: string,
    context?: string
  ): AsyncGenerator<string, void, unknown> {
    const systemPrompt = AGENT_SYSTEM_PROMPTS[agentRole];
    
    const messages: GLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: context ? `${context}\n\n${userMessage}` : userMessage }
    ];

    for await (const chunk of this.chatStream({
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    })) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }

  /**
   * 执行快捷操作
   */
  async executeQuickAction(
    action: QuickAction,
    context: string,
    selectedText?: string
  ): Promise<string> {
    const promptTemplate = QUICK_ACTION_PROMPTS[action.id];
    if (!promptTemplate) {
      throw new Error(`未找到操作 ${action.id} 的提示模板`);
    }

    const fullContext = selectedText ? `选中文本：${selectedText}\n\n完整内容：${context}` : context;
    const prompt = promptTemplate(fullContext);

    return await this.agentChat(action.agentRole, prompt);
  }

  /**
   * 流式执行快捷操作
   */
  async *executeQuickActionStream(
    action: QuickAction,
    context: string,
    selectedText?: string
  ): AsyncGenerator<string, void, unknown> {
    const promptTemplate = QUICK_ACTION_PROMPTS[action.id];
    if (!promptTemplate) {
      throw new Error(`未找到操作 ${action.id} 的提示模板`);
    }

    const fullContext = selectedText ? `选中文本：${selectedText}\n\n完整内容：${context}` : context;
    const prompt = promptTemplate(fullContext);

    for await (const content of this.agentChatStream(action.agentRole, prompt)) {
      yield content;
    }
  }

  /**
   * 测试连接
   */
  async testConnection(): Promise<{
    success: boolean;
    model: string;
    latency: number;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      const response = await this.chat({
        messages: [{ role: 'user', content: '你好，请回复"连接成功"' }],
        max_tokens: 10,
      });

      const latency = Date.now() - startTime;

      return {
        success: true,
        model: response.model,
        latency,
      };
    } catch (error) {
      return {
        success: false,
        model: 'unknown',
        latency: Date.now() - startTime,
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    if (typeof error === 'string') {
      return new Error(error);
    }
    return new Error('GLM API调用发生未知错误');
  }
}

// 创建单例实例
export const glmClient = new GLMClientService();

// 导出类型和实例
export default glmClient;