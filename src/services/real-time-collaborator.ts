/**
 * 实时写作协作服务 - 提供实时写作建议和协作功能
 */

import { GLMClient } from './glm-client';
import { AIWritingAssistant, WritingContext, RealTimeSuggestion } from './ai-writing-assistant';

// 实时协作配置
export interface RealTimeConfig {
  enabled: boolean;
  debounceMs: number;           // 防抖延迟
  maxSuggestions: number;       // 最大建议数量
  confidenceThreshold: number; // 建议置信度阈值
  autoApplyThreshold: number;  // 自动应用阈值
  categories: {
    grammar: boolean;
    style: boolean;
    flow: boolean;
    citation: boolean;
    structure: boolean;
  };
}

// 写作事件类型
export type WritingEventType = 
  | 'text_insert'
  | 'text_delete'
  | 'text_select'
  | 'cursor_move'
  | 'section_change'
  | 'pause'
  | 'resume';

// 写作事件
export interface WritingEvent {
  type: WritingEventType;
  timestamp: Date;
  position: number;
  content?: string;
  length?: number;
  metadata?: Record<string, any>;
}

// 协作状态
export interface CollaborationState {
  isActive: boolean;
  lastActivity: Date;
  currentFocus: {
    section?: string;
    position: number;
    selectedText?: string;
  };
  pendingSuggestions: RealTimeSuggestion[];
  appliedSuggestions: string[];
  userPreferences: {
    autoAcceptGrammar: boolean;
    showInlineHints: boolean;
    highlightIssues: boolean;
    pauseOnError: boolean;
  };
}

// 建议缓存
interface SuggestionCache {
  textHash: string;
  suggestions: RealTimeSuggestion[];
  timestamp: Date;
  expiresAt: Date;
}

/**
 * 实时写作协作服务
 */
export class RealTimeWritingCollaborator {
  private assistant: AIWritingAssistant;
  private config: RealTimeConfig;
  private eventQueue: WritingEvent[] = [];
  private suggestionCache: Map<string, SuggestionCache> = new Map();
  private debounceTimer?: NodeJS.Timeout;
  private isProcessing = false;
  private collaborationState: CollaborationState;

  // 事件监听器
  private eventListeners: Map<string, ((data: any) => void)[]> = new Map();

  constructor(assistant: AIWritingAssistant, config: Partial<RealTimeConfig> = {}) {
    this.assistant = assistant;
    this.config = {
      enabled: true,
      debounceMs: 500,
      maxSuggestions: 3,
      confidenceThreshold: 0.7,
      autoApplyThreshold: 0.9,
      categories: {
        grammar: true,
        style: true,
        flow: true,
        citation: true,
        structure: false // 结构建议可能较重，默认关闭
      },
      ...config
    };

    this.collaborationState = {
      isActive: false,
      lastActivity: new Date(),
      currentFocus: { position: 0 },
      pendingSuggestions: [],
      appliedSuggestions: [],
      userPreferences: {
        autoAcceptGrammar: false,
        showInlineHints: true,
        highlightIssues: true,
        pauseOnError: false
      }
    };

    // 定期清理缓存
    setInterval(() => this.cleanupCache(), 60000); // 每分钟清理一次
  }

  /**
   * 启动实时协作
   */
  startCollaboration(): void {
    if (!this.config.enabled) return;

    this.collaborationState.isActive = true;
    this.collaborationState.lastActivity = new Date();
    this.emit('collaboration:started', {});
  }

  /**
   * 停止实时协作
   */
  stopCollaboration(): void {
    this.collaborationState.isActive = false;
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = undefined;
    }

    this.emit('collaboration:stopped', {});
  }

  /**
   * 处理写作事件
   */
  handleWritingEvent(event: WritingEvent): void {
    if (!this.collaborationState.isActive) return;

    this.eventQueue.push(event);
    this.collaborationState.lastActivity = new Date();

    // 更新焦点状态
    this.updateFocusState(event);

    // 根据事件类型决定处理策略
    switch (event.type) {
      case 'text_insert':
      case 'text_delete':
        this.debounceTextChange();
        break;
      
      case 'text_select':
        this.handleTextSelection(event);
        break;
      
      case 'cursor_move':
        this.handleCursorMove(event);
        break;
      
      case 'section_change':
        this.handleSectionChange(event);
        break;
      
      case 'pause':
        this.handleWritingPause();
        break;
      
      case 'resume':
        this.handleWritingResume();
        break;
    }
  }

  /**
   * 获取实时建议
   */
  async getRealTimeSuggestions(
    text: string,
    cursorPosition: number,
    context?: Partial<WritingContext>
  ): Promise<RealTimeSuggestion[]> {
    if (!this.collaborationState.isActive || this.isProcessing) {
      return [];
    }

    // 检查缓存
    const textHash = this.generateTextHash(text, cursorPosition);
    const cached = this.suggestionCache.get(textHash);
    
    if (cached && cached.expiresAt > new Date()) {
      return cached.suggestions;
    }

    this.isProcessing = true;

    try {
      // 更新助手上下文
      if (context) {
        this.assistant.updateContext({
          cursorPosition,
          precedingText: text.slice(0, cursorPosition),
          followingText: text.slice(cursorPosition),
          ...context
        });
      }

      // 获取建议
      const suggestions = await this.assistant.getRealTimeSuggestions(text, cursorPosition);
      
      // 过滤和优化建议
      const filteredSuggestions = this.filterSuggestions(suggestions);
      
      // 缓存结果
      this.cacheSuggestions(textHash, filteredSuggestions);
      
      // 更新协作状态
      this.collaborationState.pendingSuggestions = filteredSuggestions;
      
      // 触发事件
      this.emit('suggestions:updated', { suggestions: filteredSuggestions });
      
      // 自动应用高置信度建议
      await this.autoApplySuggestions(filteredSuggestions);
      
      return filteredSuggestions;

    } catch (error) {
      console.error('获取实时建议失败:', error);
      return [];
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * 应用建议
   */
  async applySuggestion(suggestionId: string): Promise<boolean> {
    const suggestion = this.collaborationState.pendingSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) return false;

    try {
      // 记录应用的建议
      this.collaborationState.appliedSuggestions.push(suggestionId);
      
      // 从待处理列表中移除
      this.collaborationState.pendingSuggestions = 
        this.collaborationState.pendingSuggestions.filter(s => s.id !== suggestionId);

      // 触发事件
      this.emit('suggestion:applied', { suggestion });
      
      return true;
    } catch (error) {
      console.error('应用建议失败:', error);
      return false;
    }
  }

  /**
   * 拒绝建议
   */
  rejectSuggestion(suggestionId: string, reason?: string): boolean {
    const suggestionIndex = this.collaborationState.pendingSuggestions.findIndex(s => s.id === suggestionId);
    if (suggestionIndex === -1) return false;

    const suggestion = this.collaborationState.pendingSuggestions[suggestionIndex];
    
    // 从待处理列表中移除
    this.collaborationState.pendingSuggestions.splice(suggestionIndex, 1);

    // 触发事件
    this.emit('suggestion:rejected', { suggestion, reason });
    
    return true;
  }

  /**
   * 获取写作统计
   */
  getWritingStats(): {
    eventsCount: number;
    suggestionsGenerated: number;
    suggestionsApplied: number;
    lastActivity: Date;
    sessionDuration: number;
  } {
    const sessionStart = this.collaborationState.lastActivity;
    const now = new Date();

    return {
      eventsCount: this.eventQueue.length,
      suggestionsGenerated: this.collaborationState.pendingSuggestions.length + 
                           this.collaborationState.appliedSuggestions.length,
      suggestionsApplied: this.collaborationState.appliedSuggestions.length,
      lastActivity: this.collaborationState.lastActivity,
      sessionDuration: now.getTime() - sessionStart.getTime()
    };
  }

  /**
   * 配置实时协作
   */
  configure(config: Partial<RealTimeConfig>): void {
    this.config = { ...this.config, ...config };
    this.emit('config:updated', { config: this.config });
  }

  /**
   * 添加事件监听器
   */
  on(event: string, listener: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  /**
   * 移除事件监听器
   */
  off(event: string, listener: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`事件监听器错误 (${event}):`, error);
        }
      });
    }
  }

  /**
   * 防抖文本变化
   */
  private debounceTextChange(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.processTextChange();
    }, this.config.debounceMs);
  }

  /**
   * 处理文本变化
   */
  private async processTextChange(): Promise<void> {
    const recentEvents = this.getRecentTextEvents();
    if (recentEvents.length === 0) return;

    // 构建当前文本状态
    const currentText = this.reconstructText(recentEvents);
    const cursorPosition = this.collaborationState.currentFocus.position;

    // 获取实时建议
    await this.getRealTimeSuggestions(currentText, cursorPosition);
  }

  /**
   * 更新焦点状态
   */
  private updateFocusState(event: WritingEvent): void {
    switch (event.type) {
      case 'cursor_move':
        this.collaborationState.currentFocus.position = event.position;
        break;
      
      case 'text_select':
        this.collaborationState.currentFocus.selectedText = event.content;
        break;
      
      case 'section_change':
        this.collaborationState.currentFocus.section = event.metadata?.section;
        break;
    }
  }

  /**
   * 处理文本选择
   */
  private handleTextSelection(event: WritingEvent): void {
    this.emit('text:selected', {
      position: event.position,
      length: event.length,
      content: event.content
    });
  }

  /**
   * 处理光标移动
   */
  private handleCursorMove(event: WritingEvent): void {
    // 可以在这里触发上下文相关的建议
    this.emit('cursor:moved', { position: event.position });
  }

  /**
   * 处理章节变化
   */
  private handleSectionChange(event: WritingEvent): void {
    // 清理相关缓存
    this.clearSectionCache(event.metadata?.section);
    
    this.emit('section:changed', {
      section: event.metadata?.section,
      position: event.position
    });
  }

  /**
   * 处理写作暂停
   */
  private handleWritingPause(): void {
    // 写作暂停时可以提供更全面的分析
    this.emit('writing:paused', {});
  }

  /**
   * 处理写作恢复
   */
  private handleWritingResume(): void {
    this.emit('writing:resumed', {});
  }

  /**
   * 过滤建议
   */
  private filterSuggestions(suggestions: RealTimeSuggestion[]): RealTimeSuggestion[] {
    return suggestions
      .filter(s => {
        // 置信度过滤
        if (s.severity === 'error') return true; // 错误总是显示
        return true; // 简化版本，实际可以添加更多过滤逻辑
      })
      .filter(s => this.config.categories[s.type] !== false)
      .slice(0, this.config.maxSuggestions);
  }

  /**
   * 自动应用建议
   */
  private async autoApplySuggestions(suggestions: RealTimeSuggestion[]): Promise<void> {
    if (!this.collaborationState.userPreferences.autoAcceptGrammar) return;

    for (const suggestion of suggestions) {
      if (suggestion.autoApply && suggestion.type === 'grammar' && suggestion.severity === 'error') {
        await this.applySuggestion(suggestion.id);
      }
    }
  }

  /**
   * 生成文本哈希
   */
  private generateTextHash(text: string, position: number): string {
    const context = text.slice(Math.max(0, position - 100), position + 100);
    return btoa(context).slice(0, 16);
  }

  /**
   * 缓存建议
   */
  private cacheSuggestions(hash: string, suggestions: RealTimeSuggestion[]): void {
    const expiresAt = new Date(Date.now() + 300000); // 5分钟后过期
    
    this.suggestionCache.set(hash, {
      textHash: hash,
      suggestions,
      timestamp: new Date(),
      expiresAt
    });
  }

  /**
   * 清理缓存
   */
  private cleanupCache(): void {
    const now = new Date();
    
    for (const [key, cache] of this.suggestionCache.entries()) {
      if (cache.expiresAt < now) {
        this.suggestionCache.delete(key);
      }
    }
  }

  /**
   * 清理章节缓存
   */
  private clearSectionCache(section?: string): void {
    // 简化实现，清理所有缓存
    this.suggestionCache.clear();
  }

  /**
   * 获取最近的文本事件
   */
  private getRecentTextEvents(): WritingEvent[] {
    const recentTime = Date.now() - 5000; // 最近5秒
    return this.eventQueue.filter(event => 
      event.timestamp.getTime() > recentTime &&
      (event.type === 'text_insert' || event.type === 'text_delete')
    );
  }

  /**
   * 重构文本（简化实现）
   */
  private reconstructText(events: WritingEvent[]): string {
    // 这里应该根据事件重构当前文本状态
    // 简化实现，返回空字符串
    return '';
  }

  /**
   * 获取协作状态
   */
  getCollaborationState(): CollaborationState {
    return { ...this.collaborationState };
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.stopCollaboration();
    this.suggestionCache.clear();
    this.eventQueue.length = 0;
    this.eventListeners.clear();
  }
}

// 创建工厂函数
export const createRealTimeCollaborator = (
  assistant: AIWritingAssistant,
  config?: Partial<RealTimeConfig>
): RealTimeWritingCollaborator => {
  return new RealTimeWritingCollaborator(assistant, config);
};

export default RealTimeWritingCollaborator;