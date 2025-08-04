/**
 * AI写作助手服务 - 基于GLM-4.5的上下文感知智能写作助手
 * 提供续写、润色、扩展、总结等多种写作辅助功能
 */

import { GLMClient } from './glm-client';
import { Paper, PaperSection, GLMMessage, AIServiceOptions } from '../types';

// 写作助手模式定义
export type WritingAssistantMode = 
  | 'continue'    // 续写模式
  | 'polish'      // 润色模式  
  | 'expand'      // 扩展模式
  | 'summarize'   // 总结模式
  | 'rewrite'     // 重写模式
  | 'translate'   // 翻译模式
  | 'outline'     // 大纲生成
  | 'reference';  // 参考文献生成

// 写作上下文信息
export interface WritingContext {
  // 当前论文信息
  paper: Paper;
  // 当前编辑的章节
  currentSection?: PaperSection;
  // 当前光标位置
  cursorPosition: number;
  // 选中的文本
  selectedText?: string;
  // 前后文内容（用于上下文理解）
  precedingText: string;
  followingText: string;
  // 用户意图
  userIntent?: string;
  // 最近的编辑历史
  recentEdits: EditHistory[];
}

// 编辑历史
export interface EditHistory {
  timestamp: Date;
  action: 'insert' | 'delete' | 'replace';
  position: number;
  content: string;
  length: number;
}

// AI建议结果
export interface WritingSuggestion {
  id: string;
  mode: WritingAssistantMode;
  title: string;
  content: string;
  originalText?: string;
  position?: { start: number; end: number };
  confidence: number; // 0-1
  reasoning: string;
  category: 'structure' | 'content' | 'style' | 'grammar' | 'format';
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: number; // 0-100
  alternatives?: string[];
  timestamp: Date;
}

// 实时写作建议
export interface RealTimeSuggestion {
  id: string;
  type: 'grammar' | 'style' | 'flow' | 'citation' | 'structure';
  message: string;
  suggestion: string;
  position: { start: number; end: number };
  severity: 'info' | 'warning' | 'error';
  autoApply?: boolean;
}

// 写作会话状态
export interface WritingSession {
  id: string;
  startTime: Date;
  lastActivity: Date;
  suggestions: WritingSuggestion[];
  appliedSuggestions: string[];
  rejectedSuggestions: string[];
  context: WritingContext;
  preferences: WritingPreferences;
}

// 写作偏好设置
export interface WritingPreferences {
  language: 'zh' | 'en';
  writingStyle: 'academic' | 'professional' | 'casual';
  detailLevel: 'concise' | 'detailed' | 'comprehensive';
  creativityLevel: number; // 0-1
  formalityLevel: number; // 0-1
  enableRealTimeSuggestions: boolean;
  autoApplyGrammarFixes: boolean;
  showAlternatives: boolean;
  maxSuggestions: number;
}

// 论文类型配置
export interface PaperTypeConfig {
  type: string;
  sections: string[];
  requirements: {
    minWords: number;
    maxWords: number;
    citationStyle: string;
    requiredSections: string[];
  };
  writingGuidelines: {
    tone: string;
    perspective: string;
    structure: string;
    keyPoints: string[];
  };
  templates: {
    [section: string]: string;
  };
}

/**
 * AI写作助手核心服务类
 */
export class AIWritingAssistant {
  private glmClient: GLMClient;
  private currentSession?: WritingSession;
  private paperTypeConfigs: Map<string, PaperTypeConfig> = new Map();
  private realTimeSuggestionQueue: RealTimeSuggestion[] = [];

  constructor(glmClient: GLMClient) {
    this.glmClient = glmClient;
    this.initializePaperTypeConfigs();
  }

  /**
   * 初始化论文类型配置
   */
  private initializePaperTypeConfigs(): void {
    // 研究论文配置
    this.paperTypeConfigs.set('research', {
      type: 'research',
      sections: ['摘要', '引言', '文献综述', '方法论', '结果', '讨论', '结论', '参考文献'],
      requirements: {
        minWords: 5000,
        maxWords: 15000,
        citationStyle: 'APA',
        requiredSections: ['摘要', '引言', '方法论', '结果', '讨论', '结论']
      },
      writingGuidelines: {
        tone: '客观、严谨',
        perspective: '第三人称',
        structure: '逻辑严密、层次分明',
        keyPoints: ['问题陈述', '研究方法', '数据分析', '结论验证']
      },
      templates: {
        '摘要': '本研究旨在...',
        '引言': '随着...的发展...',
        '方法论': '本研究采用...方法...'
      }
    });

    // 学位论文配置
    this.paperTypeConfigs.set('thesis', {
      type: 'thesis',
      sections: ['摘要', '目录', '引言', '文献综述', '理论基础', '研究设计', '实证分析', '结论', '参考文献', '致谢'],
      requirements: {
        minWords: 20000,
        maxWords: 80000,
        citationStyle: 'APA',
        requiredSections: ['摘要', '引言', '文献综述', '研究设计', '实证分析', '结论']
      },
      writingGuidelines: {
        tone: '学术、正式',
        perspective: '第一人称和第三人称结合',
        structure: '完整的研究体系',
        keyPoints: ['研究意义', '理论贡献', '实践价值', '创新点']
      },
      templates: {}
    });

    // 综述论文配置
    this.paperTypeConfigs.set('review', {
      type: 'review',
      sections: ['摘要', '引言', '主体综述', '总结与展望', '参考文献'],
      requirements: {
        minWords: 8000,
        maxWords: 25000,
        citationStyle: 'APA',
        requiredSections: ['摘要', '引言', '主体综述', '总结与展望']
      },
      writingGuidelines: {
        tone: '综合、分析性',
        perspective: '第三人称',
        structure: '主题式或时间式组织',
        keyPoints: ['文献梳理', '观点对比', '发展趋势', '研究空白']
      },
      templates: {}
    });
  }

  /**
   * 开始写作会话
   */
  async startWritingSession(
    paper: Paper,
    preferences: Partial<WritingPreferences> = {}
  ): Promise<WritingSession> {
    const defaultPreferences: WritingPreferences = {
      language: 'zh',
      writingStyle: 'academic',
      detailLevel: 'detailed',
      creativityLevel: 0.3,
      formalityLevel: 0.8,
      enableRealTimeSuggestions: true,
      autoApplyGrammarFixes: false,
      showAlternatives: true,
      maxSuggestions: 5
    };

    this.currentSession = {
      id: `session_${Date.now()}`,
      startTime: new Date(),
      lastActivity: new Date(),
      suggestions: [],
      appliedSuggestions: [],
      rejectedSuggestions: [],
      context: {
        paper,
        cursorPosition: 0,
        precedingText: '',
        followingText: '',
        recentEdits: []
      },
      preferences: { ...defaultPreferences, ...preferences }
    };

    return this.currentSession;
  }

  /**
   * 更新写作上下文
   */
  updateContext(context: Partial<WritingContext>): void {
    if (!this.currentSession) return;

    this.currentSession.context = {
      ...this.currentSession.context,
      ...context
    };
    this.currentSession.lastActivity = new Date();
  }

  /**
   * 获取写作建议
   */
  async getWritingSuggestion(
    mode: WritingAssistantMode,
    options: {
      targetText?: string;
      userPrompt?: string;
      context?: Partial<WritingContext>;
    } = {}
  ): Promise<WritingSuggestion> {
    if (!this.currentSession) {
      throw new Error('请先开始写作会话');
    }

    // 更新上下文
    if (options.context) {
      this.updateContext(options.context);
    }

    const context = this.currentSession.context;
    const preferences = this.currentSession.preferences;
    
    // 构建AI提示
    const prompt = this.buildPrompt(mode, context, preferences, options);
    
    try {
      // 调用GLM API获取建议
      const response = await this.glmClient.simpleChat(
        prompt,
        this.getSystemMessage(mode, context.paper.paperType),
        {
          temperature: preferences.creativityLevel,
          maxTokens: 2000
        }
      );

      // 解析响应并创建建议
      const suggestion = this.parseSuggestionResponse(
        mode,
        response,
        options.targetText,
        context
      );

      // 添加到会话历史
      this.currentSession.suggestions.push(suggestion);

      return suggestion;

    } catch (error) {
      console.error('获取写作建议失败:', error);
      throw new Error('AI写作助手暂时不可用，请稍后重试');
    }
  }

  /**
   * 获取实时写作建议
   */
  async getRealTimeSuggestions(
    text: string,
    cursorPosition: number
  ): Promise<RealTimeSuggestion[]> {
    if (!this.currentSession?.preferences.enableRealTimeSuggestions) {
      return [];
    }

    // 更新上下文
    this.updateContext({
      cursorPosition,
      precedingText: text.slice(0, cursorPosition),
      followingText: text.slice(cursorPosition)
    });

    const suggestions: RealTimeSuggestion[] = [];

    // 基本语法检查
    const grammarSuggestions = await this.checkGrammar(text);
    suggestions.push(...grammarSuggestions);

    // 写作流畅性检查
    const flowSuggestions = await this.checkWritingFlow(text, cursorPosition);
    suggestions.push(...flowSuggestions);

    // 引用格式检查
    const citationSuggestions = await this.checkCitations(text);
    suggestions.push(...citationSuggestions);

    // 限制建议数量
    return suggestions.slice(0, this.currentSession.preferences.maxSuggestions);
  }

  /**
   * 应用写作建议
   */
  applySuggestion(suggestionId: string): boolean {
    if (!this.currentSession) return false;

    const suggestion = this.currentSession.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return false;

    // 添加到已应用列表
    this.currentSession.appliedSuggestions.push(suggestionId);
    
    // 记录编辑历史
    this.currentSession.context.recentEdits.push({
      timestamp: new Date(),
      action: 'replace',
      position: suggestion.position?.start || 0,
      content: suggestion.content,
      length: suggestion.content.length
    });

    return true;
  }

  /**
   * 拒绝写作建议
   */
  rejectSuggestion(suggestionId: string, reason?: string): boolean {
    if (!this.currentSession) return false;

    const suggestion = this.currentSession.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return false;

    // 添加到已拒绝列表
    this.currentSession.rejectedSuggestions.push(suggestionId);

    return true;
  }

  /**
   * 获取批量写作建议
   */
  async getBatchSuggestions(
    text: string,
    modes: WritingAssistantMode[]
  ): Promise<WritingSuggestion[]> {
    const suggestions: WritingSuggestion[] = [];

    for (const mode of modes) {
      try {
        const suggestion = await this.getWritingSuggestion(mode, {
          targetText: text
        });
        suggestions.push(suggestion);
      } catch (error) {
        console.warn(`获取${mode}模式建议失败:`, error);
      }
    }

    // 按优先级和影响度排序
    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.estimatedImpact - a.estimatedImpact;
    });
  }

  /**
   * 构建AI提示
   */
  private buildPrompt(
    mode: WritingAssistantMode,
    context: WritingContext,
    preferences: WritingPreferences,
    options: any
  ): string {
    const { paper, currentSection, precedingText, followingText, selectedText } = context;
    const paperConfig = this.paperTypeConfigs.get(paper.paperType || 'research');

    let prompt = '';

    // 基础上下文信息
    prompt += `论文类型: ${paper.paperType || '研究论文'}\n`;
    prompt += `论文标题: ${paper.title}\n`;
    if (paper.abstract) {
      prompt += `论文摘要: ${paper.abstract}\n`;
    }
    if (currentSection) {
      prompt += `当前章节: ${currentSection.title}\n`;
    }

    // 前后文上下文
    if (precedingText) {
      prompt += `前文内容: ${precedingText.slice(-500)}\n`;
    }
    if (followingText) {
      prompt += `后文内容: ${followingText.slice(0, 500)}\n`;
    }

    // 目标文本
    if (options.targetText) {
      prompt += `目标文本: ${options.targetText}\n`;
    }
    if (selectedText) {
      prompt += `选中文本: ${selectedText}\n`;
    }

    // 用户指定的提示
    if (options.userPrompt) {
      prompt += `用户要求: ${options.userPrompt}\n`;
    }

    // 写作风格要求
    prompt += `写作风格: ${preferences.writingStyle}\n`;
    prompt += `详细程度: ${preferences.detailLevel}\n`;
    prompt += `正式程度: ${Math.round(preferences.formalityLevel * 100)}%\n`;

    // 根据模式添加特定指令
    prompt += this.getModeSpecificPrompt(mode, paperConfig);

    return prompt;
  }

  /**
   * 获取模式特定的提示
   */
  private getModeSpecificPrompt(mode: WritingAssistantMode, paperConfig?: PaperTypeConfig): string {
    switch (mode) {
      case 'continue':
        return '\n请基于上下文继续写作，保持逻辑连贯和风格一致。生成的内容应该自然衔接前文，推进论述进展。';
      
      case 'polish':
        return '\n请润色目标文本，改进表达的准确性、流畅性和学术性。保持原意不变，提升语言质量。';
      
      case 'expand':
        return '\n请扩展目标文本，增加具体细节、例证或深入分析。丰富内容的同时保持结构清晰。';
      
      case 'summarize':
        return '\n请总结目标文本的核心要点，提炼关键信息。保持简洁明了，突出重点。';
      
      case 'rewrite':
        return '\n请重新组织和表达目标文本，改善结构和逻辑。使内容更加清晰有力。';
      
      case 'translate':
        return '\n请提供准确的学术翻译，保持专业术语的准确性和文本的学术性。';
      
      case 'outline':
        return '\n请基于当前内容生成详细的写作大纲，包括主要论点和支撑材料。';
      
      case 'reference':
        return '\n请建议相关的参考文献，并提供正确的引用格式。';
      
      default:
        return '\n请提供有帮助的写作建议。';
    }
  }

  /**
   * 获取系统消息
   */
  private getSystemMessage(mode: WritingAssistantMode, paperType?: string): string {
    const baseSystem = '你是一个专业的学术写作助手，精通各种论文写作规范和技巧。';
    
    const paperConfig = this.paperTypeConfigs.get(paperType || 'research');
    if (paperConfig) {
      return `${baseSystem}当前协助撰写${paperConfig.type}类型论文，要求${paperConfig.writingGuidelines.tone}的语调，采用${paperConfig.writingGuidelines.perspective}视角。`;
    }

    return baseSystem;
  }

  /**
   * 解析建议响应
   */
  private parseSuggestionResponse(
    mode: WritingAssistantMode,
    response: string,
    targetText?: string,
    context?: WritingContext
  ): WritingSuggestion {
    // 简单解析，实际项目中可能需要更复杂的解析逻辑
    const lines = response.split('\n').filter(line => line.trim());
    
    return {
      id: `suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mode,
      title: this.getModeName(mode),
      content: response.trim(),
      originalText: targetText,
      position: targetText && context ? {
        start: context.cursorPosition,
        end: context.cursorPosition + targetText.length
      } : undefined,
      confidence: 0.8,
      reasoning: `基于${mode}模式的AI分析建议`,
      category: this.getModeCategory(mode),
      priority: 'medium',
      estimatedImpact: 75,
      alternatives: [],
      timestamp: new Date()
    };
  }

  /**
   * 获取模式名称
   */
  private getModeName(mode: WritingAssistantMode): string {
    const names = {
      continue: '内容续写',
      polish: '内容润色',
      expand: '内容扩展',
      summarize: '内容总结',
      rewrite: '内容重写',
      translate: '内容翻译',
      outline: '大纲生成',
      reference: '参考文献'
    };
    return names[mode] || mode;
  }

  /**
   * 获取模式分类
   */
  private getModeCategory(mode: WritingAssistantMode): WritingSuggestion['category'] {
    const categories = {
      continue: 'content',
      polish: 'style',
      expand: 'content',
      summarize: 'structure',
      rewrite: 'structure',
      translate: 'content',
      outline: 'structure',
      reference: 'format'
    };
    return categories[mode] || 'content';
  }

  /**
   * 语法检查
   */
  private async checkGrammar(text: string): Promise<RealTimeSuggestion[]> {
    // 简单的语法检查实现
    const suggestions: RealTimeSuggestion[] = [];
    
    // 这里应该集成更专业的语法检查工具
    // 现在提供一些基本的检查
    
    return suggestions;
  }

  /**
   * 写作流畅性检查
   */
  private async checkWritingFlow(text: string, cursorPosition: number): Promise<RealTimeSuggestion[]> {
    const suggestions: RealTimeSuggestion[] = [];
    
    // 检查段落连接
    // 检查句子长度
    // 检查重复用词
    
    return suggestions;
  }

  /**
   * 引用格式检查
   */
  private async checkCitations(text: string): Promise<RealTimeSuggestion[]> {
    const suggestions: RealTimeSuggestion[] = [];
    
    // 检查引用格式
    // 检查参考文献完整性
    
    return suggestions;
  }

  /**
   * 获取当前会话状态
   */
  getCurrentSession(): WritingSession | undefined {
    return this.currentSession;
  }

  /**
   * 结束写作会话
   */
  endSession(): void {
    if (this.currentSession) {
      // 可以在这里保存会话数据
      this.currentSession = undefined;
    }
  }

  /**
   * 获取会话统计信息
   */
  getSessionStats(): {
    duration: number;
    suggestionsGenerated: number;
    suggestionsApplied: number;
    suggestionsRejected: number;
    productivity: number;
  } | null {
    if (!this.currentSession) return null;

    const duration = Date.now() - this.currentSession.startTime.getTime();
    const applied = this.currentSession.appliedSuggestions.length;
    const generated = this.currentSession.suggestions.length;
    const rejected = this.currentSession.rejectedSuggestions.length;

    return {
      duration,
      suggestionsGenerated: generated,
      suggestionsApplied: applied,
      suggestionsRejected: rejected,
      productivity: generated > 0 ? (applied / generated) * 100 : 0
    };
  }
}

// 创建默认实例
export const createAIWritingAssistant = (glmClient: GLMClient): AIWritingAssistant => {
  return new AIWritingAssistant(glmClient);
};

export default AIWritingAssistant;