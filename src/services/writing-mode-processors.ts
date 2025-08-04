/**
 * AI写作助手模式处理器 - 实现各种写作辅助模式的具体逻辑
 */

import { GLMClient } from './glm-client';
import { 
  WritingAssistantMode, 
  WritingContext, 
  WritingPreferences, 
  WritingSuggestion,
  PaperTypeConfig 
} from './ai-writing-assistant';

export interface ModeProcessor {
  processRequest(
    context: WritingContext,
    preferences: WritingPreferences,
    options: any
  ): Promise<WritingSuggestion>;
}

/**
 * 续写模式处理器
 */
export class ContinueWritingProcessor implements ModeProcessor {
  constructor(private glmClient: GLMClient) {}

  async processRequest(
    context: WritingContext,
    preferences: WritingPreferences,
    options: any
  ): Promise<WritingSuggestion> {
    const { paper, precedingText, currentSection } = context;
    
    const prompt = `
请基于以下上下文继续写作：

论文类型：${paper.paperType || '研究论文'}
当前章节：${currentSection?.title || '正文'}
前文内容：${precedingText.slice(-800)}

写作要求：
- 保持与前文的逻辑连贯性
- 符合${preferences.writingStyle}写作风格
- 详细程度：${preferences.detailLevel}
- 语言正式程度：${Math.round(preferences.formalityLevel * 100)}%

请生成200-400字的续写内容，确保内容与前文自然衔接并推进论述发展。
${options.userPrompt ? `\n用户特殊要求：${options.userPrompt}` : ''}
`;

    const systemMessage = `你是专业的学术写作助手，擅长根据上下文进行逻辑连贯的续写。请确保生成的内容符合学术写作规范，语言准确流畅。`;

    try {
      const response = await this.glmClient.simpleChat(prompt, systemMessage, {
        temperature: preferences.creativityLevel,
        maxTokens: 1000
      });

      return {
        id: `continue_${Date.now()}`,
        mode: 'continue',
        title: '内容续写建议',
        content: response.trim(),
        confidence: 0.85,
        reasoning: '基于前文上下文和论文结构的续写建议',
        category: 'content',
        priority: 'high',
        estimatedImpact: 90,
        alternatives: [],
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error('续写建议生成失败：' + error);
    }
  }
}

/**
 * 润色模式处理器
 */
export class PolishProcessor implements ModeProcessor {
  constructor(private glmClient: GLMClient) {}

  async processRequest(
    context: WritingContext,
    preferences: WritingPreferences,
    options: any
  ): Promise<WritingSuggestion> {
    const targetText = options.targetText || context.selectedText;
    if (!targetText) {
      throw new Error('润色模式需要指定目标文本');
    }

    const prompt = `
请润色以下学术文本，改进其表达质量：

原文：
${targetText}

润色要求：
- 保持原意不变
- 提升语言的准确性和流畅性
- 符合${preferences.writingStyle}写作风格
- 增强学术性表达
- 正式程度：${Math.round(preferences.formalityLevel * 100)}%

请提供润色后的文本，并简要说明主要改进点。
${options.userPrompt ? `\n特殊要求：${options.userPrompt}` : ''}
`;

    const systemMessage = `你是专业的学术文本润色专家，精通各种学术写作规范。请在保持原意的基础上，显著提升文本的表达质量。`;

    try {
      const response = await this.glmClient.simpleChat(prompt, systemMessage, {
        temperature: 0.3, // 润色需要相对保守
        maxTokens: 1500
      });

      return {
        id: `polish_${Date.now()}`,
        mode: 'polish',
        title: '文本润色建议',
        content: response.trim(),
        originalText: targetText,
        position: this.getTextPosition(context, targetText),
        confidence: 0.9,
        reasoning: '基于学术写作规范的语言润色建议',
        category: 'style',
        priority: 'high',
        estimatedImpact: 85,
        alternatives: [],
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error('润色建议生成失败：' + error);
    }
  }

  private getTextPosition(context: WritingContext, text: string): { start: number; end: number } | undefined {
    const fullText = context.precedingText + context.followingText;
    const start = fullText.indexOf(text);
    if (start !== -1) {
      return { start, end: start + text.length };
    }
    return undefined;
  }
}

/**
 * 扩展模式处理器
 */
export class ExpandProcessor implements ModeProcessor {
  constructor(private glmClient: GLMClient) {}

  async processRequest(
    context: WritingContext,
    preferences: WritingPreferences,
    options: any
  ): Promise<WritingSuggestion> {
    const targetText = options.targetText || context.selectedText;
    if (!targetText) {
      throw new Error('扩展模式需要指定目标文本');
    }

    const { paper, currentSection } = context;

    const prompt = `
请扩展以下文本，增加更多细节和深度：

原文：
${targetText}

扩展要求：
- 增加具体的例证和数据支撑
- 提供更深入的分析和解释
- 保持逻辑结构清晰
- 符合${paper.paperType || '研究论文'}的写作规范
- 详细程度：${preferences.detailLevel}
- 当前章节：${currentSection?.title || '正文'}

请生成扩展内容，包含原文的完整改写版本。
${options.userPrompt ? `\n用户要求：${options.userPrompt}` : ''}
`;

    const systemMessage = `你是学术写作专家，擅长深化和扩展学术内容。请确保扩展的内容有实质意义，不是简单的词汇堆砌。`;

    try {
      const response = await this.glmClient.simpleChat(prompt, systemMessage, {
        temperature: preferences.creativityLevel,
        maxTokens: 2000
      });

      return {
        id: `expand_${Date.now()}`,
        mode: 'expand',
        title: '内容扩展建议',
        content: response.trim(),
        originalText: targetText,
        confidence: 0.8,
        reasoning: '基于原文核心观点的深度扩展建议',
        category: 'content',
        priority: 'medium',
        estimatedImpact: 80,
        alternatives: [],
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error('扩展建议生成失败：' + error);
    }
  }
}

/**
 * 总结模式处理器
 */
export class SummarizeProcessor implements ModeProcessor {
  constructor(private glmClient: GLMClient) {}

  async processRequest(
    context: WritingContext,
    preferences: WritingPreferences,
    options: any
  ): Promise<WritingSuggestion> {
    const targetText = options.targetText || context.selectedText;
    if (!targetText) {
      throw new Error('总结模式需要指定目标文本');
    }

    const prompt = `
请总结以下文本的核心要点：

原文：
${targetText}

总结要求：
- 提炼最重要的观点和结论
- 保持逻辑层次清晰
- 语言简洁明了
- 突出关键信息
- 适合作为摘要或结论使用

请生成简洁的总结版本。
${options.userPrompt ? `\n特殊要求：${options.userPrompt}` : ''}
`;

    const systemMessage = `你是专业的学术文本总结专家，能够准确识别和提炼文本的核心内容。`;

    try {
      const response = await this.glmClient.simpleChat(prompt, systemMessage, {
        temperature: 0.2, // 总结需要相对保守和准确
        maxTokens: 800
      });

      return {
        id: `summarize_${Date.now()}`,
        mode: 'summarize',
        title: '内容总结建议',
        content: response.trim(),
        originalText: targetText,
        confidence: 0.9,
        reasoning: '基于原文核心观点的精炼总结',
        category: 'structure',
        priority: 'medium',
        estimatedImpact: 75,
        alternatives: [],
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error('总结建议生成失败：' + error);
    }
  }
}

/**
 * 重写模式处理器
 */
export class RewriteProcessor implements ModeProcessor {
  constructor(private glmClient: GLMClient) {}

  async processRequest(
    context: WritingContext,
    preferences: WritingPreferences,
    options: any
  ): Promise<WritingSuggestion> {
    const targetText = options.targetText || context.selectedText;
    if (!targetText) {
      throw new Error('重写模式需要指定目标文本');
    }

    const prompt = `
请重新组织和表达以下文本，改善其结构和逻辑：

原文：
${targetText}

重写要求：
- 保持核心观点和信息完整
- 改善逻辑结构和表达方式
- 提升可读性和说服力
- 符合${preferences.writingStyle}风格
- 确保学术规范性

请提供重写版本，并说明主要改进。
${options.userPrompt ? `\n用户要求：${options.userPrompt}` : ''}
`;

    const systemMessage = `你是学术写作专家，擅长重构和优化学术文本的结构和表达。`;

    try {
      const response = await this.glmClient.simpleChat(prompt, systemMessage, {
        temperature: preferences.creativityLevel * 0.8,
        maxTokens: 1500
      });

      return {
        id: `rewrite_${Date.now()}`,
        mode: 'rewrite',
        title: '内容重写建议',
        content: response.trim(),
        originalText: targetText,
        confidence: 0.8,
        reasoning: '基于结构优化的重写建议',
        category: 'structure',
        priority: 'medium',
        estimatedImpact: 85,
        alternatives: [],
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error('重写建议生成失败：' + error);
    }
  }
}

/**
 * 大纲生成处理器
 */
export class OutlineProcessor implements ModeProcessor {
  constructor(private glmClient: GLMClient) {}

  async processRequest(
    context: WritingContext,
    preferences: WritingPreferences,
    options: any
  ): Promise<WritingSuggestion> {
    const { paper, currentSection } = context;
    const targetText = options.targetText || context.precedingText;

    const prompt = `
请为以下内容生成详细的写作大纲：

论文信息：
- 标题：${paper.title}
- 类型：${paper.paperType || '研究论文'}
- 当前章节：${currentSection?.title || '未指定'}

已有内容：
${targetText.slice(-1000)}

大纲要求：
- 层次分明，结构清晰
- 包含主要论点和支撑材料
- 符合${paper.paperType || '研究论文'}的标准结构
- 突出逻辑关系和论证路径
- 适合${preferences.detailLevel}详细程度

请生成详细的章节大纲。
${options.userPrompt ? `\n特殊要求：${options.userPrompt}` : ''}
`;

    const systemMessage = `你是专业的学术写作顾问，精通各类学术论文的结构设计和大纲规划。`;

    try {
      const response = await this.glmClient.simpleChat(prompt, systemMessage, {
        temperature: 0.4,
        maxTokens: 1500
      });

      return {
        id: `outline_${Date.now()}`,
        mode: 'outline',
        title: '写作大纲建议',
        content: response.trim(),
        confidence: 0.85,
        reasoning: '基于论文类型和现有内容的结构规划建议',
        category: 'structure',
        priority: 'high',
        estimatedImpact: 95,
        alternatives: [],
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error('大纲生成失败：' + error);
    }
  }
}

/**
 * 参考文献处理器
 */
export class ReferenceProcessor implements ModeProcessor {
  constructor(private glmClient: GLMClient) {}

  async processRequest(
    context: WritingContext,
    preferences: WritingPreferences,
    options: any
  ): Promise<WritingSuggestion> {
    const { paper } = context;
    const topic = options.topic || paper.title;
    const citationStyle = paper.citationStyle || 'APA';

    const prompt = `
请为以下研究主题推荐相关的参考文献：

研究主题：${topic}
论文类型：${paper.paperType || '研究论文'}
引用格式：${citationStyle}

要求：
- 推荐10-15篇高质量的学术文献
- 包含近5年的最新研究
- 覆盖该领域的经典文献
- 提供正确的${citationStyle}引用格式
- 包含简短的文献相关性说明

请按重要性排序推荐文献。
${options.userPrompt ? `\n特殊要求：${options.userPrompt}` : ''}
`;

    const systemMessage = `你是学术研究专家，熟悉各个领域的重要文献和引用规范。请推荐真实存在的高质量学术文献。`;

    try {
      const response = await this.glmClient.simpleChat(prompt, systemMessage, {
        temperature: 0.3,
        maxTokens: 2000
      });

      return {
        id: `reference_${Date.now()}`,
        mode: 'reference',
        title: '参考文献建议',
        content: response.trim(),
        confidence: 0.75,
        reasoning: '基于研究主题的相关文献推荐',
        category: 'format',
        priority: 'medium',
        estimatedImpact: 70,
        alternatives: [],
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error('参考文献推荐失败：' + error);
    }
  }
}

/**
 * 翻译处理器
 */
export class TranslateProcessor implements ModeProcessor {
  constructor(private glmClient: GLMClient) {}

  async processRequest(
    context: WritingContext,
    preferences: WritingPreferences,
    options: any
  ): Promise<WritingSuggestion> {
    const targetText = options.targetText || context.selectedText;
    if (!targetText) {
      throw new Error('翻译模式需要指定目标文本');
    }

    const targetLanguage = options.targetLanguage || (preferences.language === 'zh' ? 'en' : 'zh');
    const sourceLanguage = preferences.language;

    const prompt = `
请将以下学术文本进行专业翻译：

原文（${sourceLanguage}）：
${targetText}

翻译要求：
- 目标语言：${targetLanguage}
- 保持学术术语的准确性
- 符合目标语言的学术写作规范
- 保持原文的逻辑结构和语气
- 确保翻译的自然流畅

请提供高质量的学术翻译。
${options.userPrompt ? `\n特殊要求：${options.userPrompt}` : ''}
`;

    const systemMessage = `你是专业的学术翻译专家，精通中英文学术写作规范和专业术语。`;

    try {
      const response = await this.glmClient.simpleChat(prompt, systemMessage, {
        temperature: 0.3,
        maxTokens: Math.max(1000, targetText.length * 2)
      });

      return {
        id: `translate_${Date.now()}`,
        mode: 'translate',
        title: `翻译建议（${sourceLanguage} → ${targetLanguage}）`,
        content: response.trim(),
        originalText: targetText,
        confidence: 0.8,
        reasoning: `专业学术翻译（${sourceLanguage}到${targetLanguage}）`,
        category: 'content',
        priority: 'medium',
        estimatedImpact: 80,
        alternatives: [],
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error('翻译失败：' + error);
    }
  }
}

/**
 * 模式处理器工厂
 */
export class ModeProcessorFactory {
  private processors: Map<WritingAssistantMode, ModeProcessor> = new Map();

  constructor(glmClient: GLMClient) {
    this.processors.set('continue', new ContinueWritingProcessor(glmClient));
    this.processors.set('polish', new PolishProcessor(glmClient));
    this.processors.set('expand', new ExpandProcessor(glmClient));
    this.processors.set('summarize', new SummarizeProcessor(glmClient));
    this.processors.set('rewrite', new RewriteProcessor(glmClient));
    this.processors.set('outline', new OutlineProcessor(glmClient));
    this.processors.set('reference', new ReferenceProcessor(glmClient));
    this.processors.set('translate', new TranslateProcessor(glmClient));
  }

  getProcessor(mode: WritingAssistantMode): ModeProcessor {
    const processor = this.processors.get(mode);
    if (!processor) {
      throw new Error(`不支持的写作助手模式: ${mode}`);
    }
    return processor;
  }

  getSupportedModes(): WritingAssistantMode[] {
    return Array.from(this.processors.keys());
  }
}

export default ModeProcessorFactory;