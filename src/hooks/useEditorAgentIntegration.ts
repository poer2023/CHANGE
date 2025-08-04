import { useCallback, useEffect } from 'react';
import { useAgentStore } from '../store/agentStore';
import { usePaperStore } from '../store/paperStore';
import { AgentRole } from '../types';

/**
 * 编辑器与Agent系统集成Hook
 * 处理编辑器内容变化、Agent建议应用等跨组件状态同步
 */
export const useEditorAgentIntegration = () => {
  const {
    currentRole,
    selectedText,
    setSelectedText,
    setDocumentContext,
    updateDocumentContext,
    generateContextualSuggestions,
    addContextualMemory,
    currentAgent,
    suggestions,
    clearSuggestions
  } = useAgentStore();

  const {
    currentPaper,
    editorState,
    setEditorContent,
    updatePaper
  } = usePaperStore();

  // 同步文档上下文到Agent Store
  useEffect(() => {
    if (currentPaper) {
      const documentContext = {
        paperId: currentPaper.id,
        fullText: currentPaper.content,
        sections: currentPaper.sections?.map(section => ({
          id: section.id,
          title: section.title,
          content: section.content,
          level: section.level
        })) || [],
        outline: currentPaper.sections?.map(s => `${'  '.repeat(s.level - 1)}${s.title}`).join('\n') || '',
        wordCount: currentPaper.wordCount,
        lastModified: currentPaper.updatedAt || new Date()
      };
      
      setDocumentContext(documentContext);
    }
  }, [currentPaper, setDocumentContext]);

  // 处理选中文本变化
  const handleTextSelection = useCallback((text: string) => {
    setSelectedText(text);
    
    // 如果有选中文本且长度合适，添加到上下文记忆中
    if (text.length > 10 && text.length < 500) {
      addContextualMemory({
        sessionId: 'editor-selection',
        content: text,
        type: 'document',
        relevanceScore: 0.8,
        metadata: {
          paperId: currentPaper?.id,
          timestamp: new Date(),
          selectionLength: text.length
        }
      });
    }
  }, [setSelectedText, addContextualMemory, currentPaper?.id]);

  // 处理编辑器内容变化
  const handleContentChange = useCallback((content: string, moduleId?: string) => {
    // 更新编辑器状态
    setEditorContent(content);
    
    // 更新文档上下文
    if (currentPaper) {
      updateDocumentContext({
        fullText: content,
        wordCount: content.split(/\s+/).filter(w => w.length > 0).length,
        lastModified: new Date()
      });
      
      // 异步保存到后端
      setTimeout(() => {
        updatePaper(currentPaper.id, { content });
      }, 1000);
    }
    
    // 添加内容变化到上下文记忆
    if (content.length > editorState.content.length + 50) { // 只记录显著的内容增加
      addContextualMemory({
        sessionId: moduleId || 'editor-main',
        content: content.slice(-200), // 只记录最近的200字符
        type: 'document',
        relevanceScore: 0.7,
        metadata: {
          paperId: currentPaper?.id,
          changeType: 'content-addition',
          timestamp: new Date()
        }
      });
    }
  }, [setEditorContent, currentPaper, updateDocumentContext, updatePaper, addContextualMemory, editorState.content.length]);

  // 应用Agent建议到编辑器
  const applyAgentSuggestion = useCallback((suggestionText: string, targetText?: string) => {
    if (!currentPaper) return;

    let newContent = editorState.content;
    
    if (targetText && selectedText === targetText) {
      // 替换选中的文本
      newContent = editorState.content.replace(targetText, suggestionText);
    } else if (selectedText) {
      // 替换当前选中的文本
      newContent = editorState.content.replace(selectedText, suggestionText);
    } else {
      // 追加到内容末尾
      newContent = editorState.content + '\n\n' + suggestionText;
    }

    handleContentChange(newContent);
    
    // 记录应用建议的操作
    addContextualMemory({
      sessionId: `agent-${currentRole}`,
      content: `应用了${currentAgent.name}的建议: ${suggestionText.slice(0, 100)}...`,
      type: 'action',
      relevanceScore: 0.9,
      metadata: {
        paperId: currentPaper.id,
        agentRole: currentRole,
        originalText: targetText || selectedText,
        appliedSuggestion: suggestionText,
        timestamp: new Date()
      }
    });
    
    // 清除选中文本
    setSelectedText('');
  }, [currentPaper, editorState.content, selectedText, handleContentChange, addContextualMemory, currentRole, currentAgent.name, setSelectedText]);

  // 生成基于上下文的智能建议
  const generateSmartSuggestions = useCallback((input?: string) => {
    const text = input || selectedText || editorState.content.slice(-500);
    
    if (text.length < 10) return;

    // 清除旧建议
    clearSuggestions();
    
    // 生成新建议
    const newSuggestions = generateContextualSuggestions(text);
    
    // 建议会自动添加到store中
    return newSuggestions;
  }, [selectedText, editorState.content, clearSuggestions, generateContextualSuggestions]);

  // 切换Agent角色时的处理
  const handleAgentRoleChange = useCallback((role: AgentRole) => {
    // Agent role change is handled by the Agent store
    // 这里可以添加额外的逻辑，比如生成特定角色的建议
    if (selectedText || editorState.content) {
      setTimeout(() => {
        generateSmartSuggestions();
      }, 500);
    }
  }, [selectedText, editorState.content, generateSmartSuggestions]);

  // 获取当前编辑器状态摘要
  const getEditorSummary = useCallback(() => {
    if (!currentPaper) return null;

    return {
      paperId: currentPaper.id,
      title: currentPaper.title,
      wordCount: editorState.content.split(/\s+/).filter(w => w.length > 0).length,
      hasSelection: selectedText.length > 0,
      selectionLength: selectedText.length,
      isDirty: editorState.isDirty,
      lastSaved: editorState.lastSaved,
      currentAgent: currentAgent.name,
      suggestionsCount: suggestions.length
    };
  }, [currentPaper, editorState, selectedText, currentAgent.name, suggestions.length]);

  // 智能上下文提取
  const extractDocumentInsights = useCallback(() => {
    if (!currentPaper || !editorState.content) return null;

    const content = editorState.content;
    const sections = content.split(/\n#{1,3}\s+/).filter(section => section.trim().length > 0);
    
    return {
      sectionsCount: sections.length,
      averageSectionLength: sections.length > 0 ? Math.round(content.length / sections.length) : 0,
      keyPhrases: extractKeyPhrases(content),
      completionEstimate: estimateCompletion(content, currentPaper.wordCount || 5000),
      suggestedNextSteps: generateNextSteps(content, currentRole)
    };
  }, [currentPaper, editorState.content, currentRole]);

  return {
    // 状态
    currentPaper,
    editorState,
    selectedText,
    currentAgent,
    suggestions,
    
    // 操作方法
    handleTextSelection,
    handleContentChange,
    applyAgentSuggestion,
    generateSmartSuggestions,
    handleAgentRoleChange,
    
    // 辅助方法
    getEditorSummary,
    extractDocumentInsights
  };
};

// 辅助函数：提取关键短语
function extractKeyPhrases(content: string): string[] {
  const words = content.toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  const wordCounts = new Map<string, number>();
  words.forEach(word => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  });
  
  return Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

// 辅助函数：估算完成度
function estimateCompletion(content: string, targetWordCount: number): number {
  const currentWordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  return Math.min(100, Math.round((currentWordCount / targetWordCount) * 100));
}

// 辅助函数：生成下一步建议
function generateNextSteps(content: string, currentRole: AgentRole): string[] {
  const steps: string[] = [];
  
  switch (currentRole) {
    case 'academic-writing-expert':
      if (content.length < 500) {
        steps.push('扩展引言部分，提供更多背景信息');
      }
      if (!content.includes('参考文献') && !content.includes('References')) {
        steps.push('添加参考文献部分');
      }
      if (!content.includes('结论') && !content.includes('Conclusion')) {
        steps.push('撰写结论部分');
      }
      break;
      
    case 'research-assistant':
      if (!content.includes('方法') && !content.includes('Methodology')) {
        steps.push('添加研究方法部分');
      }
      if (!content.includes('数据') && !content.includes('Data')) {
        steps.push('补充数据分析内容');
      }
      break;
      
    case 'format-expert':
      steps.push('检查引用格式是否符合规范');
      steps.push('优化图表和表格格式');
      break;
      
    case 'content-advisor':
      steps.push('检查段落间的逻辑连接');
      steps.push('增强论证的说服力');
      break;
  }
  
  return steps;
}

export default useEditorAgentIntegration;