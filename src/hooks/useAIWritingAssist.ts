import { useState, useCallback, useRef, useEffect } from 'react';
import { PaperModule } from '@/types/modular';

// AI建议类型
export interface AISuggestion {
  id: string;
  type: 'content' | 'structure' | 'grammar' | 'style' | 'citation';
  title: string;
  description: string;
  confidence: number; // 0-1的置信度
  moduleId?: string;
  position?: { start: number; end: number };
  suggestion: string;
  originalText?: string;
  isApplied?: boolean;
  timestamp: Date;
}

// 内容分析结果
export interface ContentAnalysis {
  wordCount: number;
  paragraphCount: number;
  sentenceCount: number;
  readabilityScore: number;
  coherenceScore: number;
  academicLevel: 'basic' | 'intermediate' | 'advanced';
  missingElements: string[];
  strengths: string[];
  improvements: string[];
}

// 智能补全建议
export interface SmartCompletion {
  id: string;
  text: string;
  type: 'continuation' | 'expansion' | 'explanation' | 'example';
  confidence: number;
  context: string;
}

// Hook状态
interface AIWritingState {
  suggestions: AISuggestion[];
  currentAnalysis: ContentAnalysis | null;
  smartCompletions: SmartCompletion[];
  isAnalyzing: boolean;
  isGenerating: boolean;
  error: string | null;
}

export const useAIWritingAssist = () => {
  const [state, setState] = useState<AIWritingState>({
    suggestions: [],
    currentAnalysis: null,
    smartCompletions: [],
    isAnalyzing: false,
    isGenerating: false,
    error: null
  });

  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 实时内容分析
  const analyzeContent = useCallback(async (content: string, moduleType?: string): Promise<ContentAnalysis> => {
    // 基础文本分析
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    // 计算可读性分数（简化版Flesch Reading Ease）
    const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
    const avgSyllablesPerWord = words.reduce((acc, word) => {
      // 简单的音节计算
      const syllables = word.toLowerCase().replace(/[^a-z]/g, '').length / 3;
      return acc + Math.max(1, Math.floor(syllables));
    }, 0) / words.length || 0;

    const readabilityScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    ));

    // 连贯性分析（基于关键词重复和过渡词）
    const transitionWords = ['因此', '然而', '此外', '首先', '其次', '最后', '总而言之', '另外'];
    const transitionCount = transitionWords.reduce((count, word) => 
      count + (content.match(new RegExp(word, 'g')) || []).length, 0
    );
    const coherenceScore = Math.min(100, (transitionCount / paragraphs.length) * 50 + 30);

    // 学术水平评估
    const academicWords = ['研究', '分析', '理论', '方法', '结果', '讨论', '结论', '假设', '验证'];
    const academicWordCount = academicWords.reduce((count, word) => 
      count + (content.match(new RegExp(word, 'g')) || []).length, 0
    );
    const academicLevel: 'basic' | 'intermediate' | 'advanced' = 
      academicWordCount > words.length * 0.1 ? 'advanced' :
      academicWordCount > words.length * 0.05 ? 'intermediate' : 'basic';

    // 缺失元素检测
    const missingElements: string[] = [];
    if (!content.includes('参考文献') && moduleType !== 'abstract') {
      missingElements.push('参考文献');
    }
    if (sentences.length < 3 && moduleType !== 'title') {
      missingElements.push('内容太少');
    }
    if (!content.match(/图\s*\d+|表\s*\d+/) && ['methodology', 'results'].includes(moduleType || '')) {
      missingElements.push('图表');
    }

    // 优势识别
    const strengths: string[] = [];
    if (readabilityScore > 60) strengths.push('文本可读性良好');
    if (coherenceScore > 70) strengths.push('逻辑连贯性强');
    if (paragraphs.length >= 3) strengths.push('结构层次清晰');

    // 改进建议
    const improvements: string[] = [];
    if (readabilityScore < 40) improvements.push('简化句子结构，提高可读性');
    if (coherenceScore < 50) improvements.push('增加过渡词，改善段落连接');
    if (words.length < 100 && moduleType !== 'abstract') improvements.push('扩展内容，增加详细说明');

    return {
      wordCount: words.length,
      paragraphCount: paragraphs.length,
      sentenceCount: sentences.length,
      readabilityScore: Math.round(readabilityScore),
      coherenceScore: Math.round(coherenceScore),
      academicLevel,
      missingElements,
      strengths,
      improvements
    };
  }, []);

  // 生成AI建议
  const generateSuggestions = useCallback(async (
    content: string, 
    moduleType: string,
    moduleId: string
  ): Promise<AISuggestion[]> => {
    const suggestions: AISuggestion[] = [];

    // 结构建议
    if (moduleType === 'introduction' && !content.includes('研究背景')) {
      suggestions.push({
        id: `struct-${Date.now()}`,
        type: 'structure',
        title: '添加研究背景',
        description: '引言部分建议包含研究背景的详细介绍',
        confidence: 0.9,
        moduleId,
        suggestion: '建议在开头添加一段研究背景，说明该研究领域的现状和重要性。',
        timestamp: new Date()
      });
    }

    // 内容建议
    if (content.length < 200 && moduleType !== 'abstract') {
      suggestions.push({
        id: `content-${Date.now()}`,
        type: 'content',
        title: '扩展内容',
        description: '当前内容较少，建议增加更多详细说明',
        confidence: 0.8,
        moduleId,
        suggestion: '建议增加具体的例子、数据支撑或更详细的分析来丰富内容。',
        timestamp: new Date()
      });
    }

    // 语法建议
    const grammarIssues = [
      { pattern: /，，+/g, suggestion: '检测到重复逗号，建议修正' },
      { pattern: /。。+/g, suggestion: '检测到重复句号，建议修正' },
      { pattern: /\s{2,}/g, suggestion: '检测到多余空格，建议清理' }
    ];

    grammarIssues.forEach(issue => {
      const matches = content.match(issue.pattern);
      if (matches) {
        suggestions.push({
          id: `grammar-${Date.now()}-${Math.random()}`,
          type: 'grammar',
          title: '语法检查',
          description: issue.suggestion,
          confidence: 0.95,
          moduleId,
          suggestion: issue.suggestion,
          timestamp: new Date()
        });
      }
    });

    // 引用建议
    if (['literature-review', 'methodology', 'discussion'].includes(moduleType) && 
        !content.match(/\[\d+\]|\(\d{4}\)/)) {
      suggestions.push({
        id: `citation-${Date.now()}`,
        type: 'citation',
        title: '添加引用',
        description: '该部分建议添加相关文献引用',
        confidence: 0.85,
        moduleId,
        suggestion: '建议在关键论点处添加权威文献引用，增强论述的可信度。',
        timestamp: new Date()
      });
    }

    return suggestions;
  }, []);

  // 智能补全建议
  const generateCompletions = useCallback(async (
    context: string,
    cursorPosition: number
  ): Promise<SmartCompletion[]> => {
    const beforeCursor = context.substring(0, cursorPosition);
    const lastSentence = beforeCursor.split(/[.!?]/).pop()?.trim() || '';

    const completions: SmartCompletion[] = [];

    // 基于上下文生成续写建议
    if (lastSentence.includes('研究表明')) {
      completions.push({
        id: `comp-${Date.now()}-1`,
        text: '，该方法在提高效率方面具有显著优势。',
        type: 'continuation',
        confidence: 0.8,
        context: '研究结果续写'
      });
    }

    if (lastSentence.includes('因此')) {
      completions.push({
        id: `comp-${Date.now()}-2`,
        text: '，我们可以得出结论，这种方法是可行的。',
        type: 'continuation',
        confidence: 0.75,
        context: '结论性陈述'
      });
    }

    if (lastSentence.includes('例如')) {
      completions.push({
        id: `comp-${Date.now()}-3`,
        text: '，在实际应用中，这种技术已经在多个领域得到验证。',
        type: 'example',
        confidence: 0.7,
        context: '举例说明'
      });
    }

    // 段落扩展建议
    if (beforeCursor.endsWith('。') || beforeCursor.endsWith('\n\n')) {
      completions.push({
        id: `comp-${Date.now()}-4`,
        text: '\n\n此外，我们还需要考虑以下几个方面：\n\n1. ',
        type: 'expansion',
        confidence: 0.6,
        context: '段落扩展'
      });
    }

    return completions;
  }, []);

  // 实时分析（防抖）
  const performRealTimeAnalysis = useCallback((
    content: string,
    moduleType: string,
    moduleId: string
  ) => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    analysisTimeoutRef.current = setTimeout(async () => {
      setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

      try {
        const [analysis, suggestions] = await Promise.all([
          analyzeContent(content, moduleType),
          generateSuggestions(content, moduleType, moduleId)
        ]);

        setState(prev => ({
          ...prev,
          currentAnalysis: analysis,
          suggestions: suggestions,
          isAnalyzing: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          error: error instanceof Error ? error.message : '分析失败'
        }));
      }
    }, 1000); // 1秒防抖
  }, [analyzeContent, generateSuggestions]);

  // 智能续写
  const generateContinuation = useCallback(async (
    content: string,
    context: { moduleType: string; targetLength?: number }
  ): Promise<string> => {
    setState(prev => ({ ...prev, isGenerating: true }));

    try {
      // 模拟AI续写
      const continuations = {
        'abstract': '本研究通过实证分析，验证了理论假设的有效性，为相关领域的实践应用提供了重要参考。',
        'introduction': '随着技术的不断发展，这一领域面临着新的机遇和挑战。深入研究其机制和应用前景，对于推动行业进步具有重要意义。',
        'methodology': '为确保研究结果的可靠性，本研究采用了严格的质量控制措施，包括数据验证、结果交叉检验等步骤。',
        'results': '进一步分析显示，这一趋势在不同条件下都保持一致，说明所观察到的现象具有普遍性。',
        'discussion': '这些发现与之前的研究结果基本一致，但也揭示了一些新的规律。这为我们深入理解该现象提供了新的视角。',
        'conclusion': '综上所述，本研究在理论和实践两个层面都取得了重要进展，为后续研究奠定了坚实基础。'
      };

      const continuation = continuations[context.moduleType as keyof typeof continuations] || 
        '基于当前内容的分析，建议从以下几个维度进行进一步探讨和完善。';

      setState(prev => ({ ...prev, isGenerating: false }));
      return continuation;

    } catch (error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : '生成失败'
      }));
      throw error;
    }
  }, []);

  // 应用建议
  const applySuggestion = useCallback((suggestionId: string, targetContent: string): string => {
    const suggestion = state.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return targetContent;

    // 标记建议为已应用
    setState(prev => ({
      ...prev,
      suggestions: prev.suggestions.map(s =>
        s.id === suggestionId ? { ...s, isApplied: true } : s
      )
    }));

    // 根据建议类型应用修改
    switch (suggestion.type) {
      case 'grammar':
        if (suggestion.originalText) {
          return targetContent.replace(suggestion.originalText, suggestion.suggestion);
        }
        break;
      case 'content':
        return targetContent + '\n\n' + suggestion.suggestion;
      default:
        return targetContent;
    }

    return targetContent;
  }, [state.suggestions]);

  // 清理
  useEffect(() => {
    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, []);

  return {
    // 状态
    suggestions: state.suggestions,
    currentAnalysis: state.currentAnalysis,
    smartCompletions: state.smartCompletions,
    isAnalyzing: state.isAnalyzing,
    isGenerating: state.isGenerating,
    error: state.error,

    // 方法
    performRealTimeAnalysis,
    generateCompletions,
    generateContinuation,
    applySuggestion,
    analyzeContent,

    // 辅助方法
    clearError: () => setState(prev => ({ ...prev, error: null })),
    clearSuggestions: () => setState(prev => ({ ...prev, suggestions: [] })),
    dismissSuggestion: (id: string) => setState(prev => ({
      ...prev,
      suggestions: prev.suggestions.filter(s => s.id !== id)
    }))
  };
};