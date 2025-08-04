import { useState, useCallback, useRef } from 'react';
import { PaperModule, ModuleType } from '@/types/modular';

// 智能功能类型定义
export interface SmartOutlineNode {
  id: string;
  title: string;
  level: number;
  content?: string;
  children: SmartOutlineNode[];
  isExpanded?: boolean;
  suggestedContent?: string;
  wordTarget?: number;
  status: 'pending' | 'partial' | 'completed';
}

export interface ParagraphSuggestion {
  id: string;
  type: 'introduction' | 'body' | 'transition' | 'conclusion';
  content: string;
  position: number;
  confidence: number;
  reasoning: string;
}

export interface ContinuationOptions {
  style: 'academic' | 'casual' | 'technical' | 'creative';
  length: 'short' | 'medium' | 'long';
  focus: 'expansion' | 'evidence' | 'analysis' | 'summary';
  tone: 'formal' | 'conversational' | 'persuasive' | 'neutral';
}

export interface CoherenceCheck {
  score: number;
  issues: CoherenceIssue[];
  suggestions: string[];
}

export interface CoherenceIssue {
  id: string;
  type: 'logical_gap' | 'weak_transition' | 'repetition' | 'inconsistency';
  severity: 'low' | 'medium' | 'high';
  position: { start: number; end: number };
  description: string;
  suggestion: string;
}

export const useSmartFeatures = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOutline, setCurrentOutline] = useState<SmartOutlineNode[]>([]);
  const [lastCoherenceCheck, setLastCoherenceCheck] = useState<CoherenceCheck | null>(null);
  
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 智能续写功能
  const generateSmartContinuation = useCallback(async (
    currentText: string,
    options: Partial<ContinuationOptions> = {}
  ): Promise<string> => {
    setIsProcessing(true);

    try {
      const defaultOptions: ContinuationOptions = {
        style: 'academic',
        length: 'medium',
        focus: 'expansion',
        tone: 'formal',
        ...options
      };

      // 分析当前文本上下文
      const context = analyzeTextContext(currentText);
      
      // 根据选项生成续写内容
      const continuation = await generateContextualContinuation(context, defaultOptions);
      
      return continuation;

    } catch (error) {
      console.error('智能续写失败:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // 自动段落生成
  const generateParagraphs = useCallback(async (
    outline: string[],
    context: string,
    targetLength: number = 200
  ): Promise<ParagraphSuggestion[]> => {
    setIsProcessing(true);

    try {
      const suggestions: ParagraphSuggestion[] = [];

      for (let i = 0; i < outline.length; i++) {
        const point = outline[i];
        const paragraphType = determineParagraphType(point, i, outline.length);
        
        const content = await generateParagraphContent(point, context, paragraphType, targetLength);
        
        suggestions.push({
          id: `para-${i}-${Date.now()}`,
          type: paragraphType,
          content,
          position: i,
          confidence: calculateConfidence(content, point),
          reasoning: `基于大纲要点"${point}"生成的${paragraphType}段落`
        });
      }

      return suggestions;

    } catch (error) {
      console.error('段落生成失败:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // 智能大纲扩展
  const expandOutline = useCallback(async (
    baseOutline: SmartOutlineNode[],
    targetDepth: number = 3,
    moduleType?: string
  ): Promise<SmartOutlineNode[]> => {
    setIsProcessing(true);

    try {
      const expandedOutline = await processOutlineNodes(baseOutline, targetDepth, moduleType);
      setCurrentOutline(expandedOutline);
      return expandedOutline;

    } catch (error) {
      console.error('大纲扩展失败:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // 模块间连贯性检查
  const checkModuleCoherence = useCallback(async (
    modules: PaperModule[]
  ): Promise<CoherenceCheck> => {
    setIsProcessing(true);

    try {
      const issues: CoherenceIssue[] = [];
      const suggestions: string[] = [];

      // 检查模块之间的逻辑连接
      for (let i = 0; i < modules.length - 1; i++) {
        const currentModule = modules[i];
        const nextModule = modules[i + 1];
        
        const coherenceIssues = await analyzeModuleConnection(currentModule, nextModule);
        issues.push(...coherenceIssues);
      }

      // 检查整体逻辑流程
      const overallIssues = await analyzeOverallFlow(modules);
      issues.push(...overallIssues);

      // 生成改进建议
      const improvementSuggestions = generateCoherenceSuggestions(issues);
      suggestions.push(...improvementSuggestions);

      const coherenceScore = calculateCoherenceScore(issues);
      
      const result: CoherenceCheck = {
        score: coherenceScore,
        issues,
        suggestions
      };

      setLastCoherenceCheck(result);
      return result;

    } catch (error) {
      console.error('连贯性检查失败:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // 智能结构建议
  const suggestStructureImprovements = useCallback(async (
    modules: PaperModule[]
  ): Promise<{
    reorderSuggestions: { moduleId: string; newPosition: number; reason: string }[];
    missingElements: { type: string; position: number; description: string }[];
    redundantElements: { moduleId: string; reason: string }[];
  }> => {
    setIsProcessing(true);

    try {
      const analysis = await analyzeStructure(modules);
      return analysis;

    } catch (error) {
      console.error('结构分析失败:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    // 状态
    isProcessing,
    currentOutline,
    lastCoherenceCheck,

    // 智能功能
    generateSmartContinuation,
    generateParagraphs,
    expandOutline,
    checkModuleCoherence,
    suggestStructureImprovements,

    // 辅助方法
    setCurrentOutline,
    clearCoherenceCheck: () => setLastCoherenceCheck(null)
  };
};

// 辅助函数实现

function analyzeTextContext(text: string) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const lastSentence = sentences[sentences.length - 1]?.trim() || '';
  const wordCount = text.split(/\s+/).length;
  
  // 分析写作风格
  const academicKeywords = ['研究', '分析', '表明', '证实', '假设', '理论'];
  const styleScore = academicKeywords.reduce((score, keyword) => 
    score + (text.includes(keyword) ? 1 : 0), 0
  );

  return {
    lastSentence,
    wordCount,
    isAcademic: styleScore > 2,
    sentences: sentences.length,
    avgSentenceLength: wordCount / sentences.length || 0
  };
}

async function generateContextualContinuation(
  context: any,
  options: ContinuationOptions
): Promise<string> {
  // 模拟AI生成逻辑
  const continuations = {
    academic: {
      expansion: '进一步分析表明，这一现象在不同条件下都表现出相似的特征。研究数据显示...',
      evidence: '相关研究证据支持了这一观点。例如，Smith等人(2023)的研究发现...',
      analysis: '深入分析这些结果，我们可以发现其中的内在规律。从理论角度来看...',
      summary: '综合以上分析，可以得出以下结论：首先，该现象具有普遍性；其次...'
    },
    technical: {
      expansion: '系统实现过程中需要考虑以下技术要点：性能优化、安全性保障和可扩展性设计...',
      evidence: '基准测试结果表明该方法的有效性。在多个测试环境中...',
      analysis: '从技术架构角度分析，该解决方案采用了模块化设计，具有以下优势...',
      summary: '技术实现总结：该方案成功解决了现有系统的瓶颈问题...'
    },
    casual: {
      expansion: '说到这个话题，我觉得还有很多有趣的地方可以深入探讨。比如说...',
      evidence: '从实际经验来看，这种做法确实挺有效的。举个例子...',
      analysis: '仔细想想，这背后的逻辑其实很简单。主要原因是...',
      summary: '总的来说，我认为这个方法还是很不错的，主要优点包括...'
    },
    creative: {
      expansion: '想象一下，如果我们换个角度思考这个问题，会发现更多可能性...',
      evidence: '创新往往来源于跨界的思考。就像艺术与科学的结合...',
      analysis: '让我们用一种全新的视角来审视这个现象，或许能发现隐藏的规律...',
      summary: '综合各种创新思路，我们可以构建一个更富想象力的解决方案...'
    }
  };

  const styleContent = continuations[options.style] || continuations.academic;
  let continuation = styleContent[options.focus];

  // 根据长度调整
  if (options.length === 'short') {
    continuation = continuation.substring(0, continuation.length / 2) + '...';
  } else if (options.length === 'long') {
    continuation += ' 此外，还需要考虑更多相关因素，包括实施过程中可能遇到的挑战和应对策略。';
  }

  return continuation;
}

function determineParagraphType(
  point: string,
  index: number,
  totalPoints: number
): ParagraphSuggestion['type'] {
  if (index === 0) return 'introduction';
  if (index === totalPoints - 1) return 'conclusion';
  if (point.includes('过渡') || point.includes('因此') || point.includes('然而')) {
    return 'transition';
  }
  return 'body';
}

async function generateParagraphContent(
  point: string,
  context: string,
  type: ParagraphSuggestion['type'],
  targetLength: number
): Promise<string> {
  const templates = {
    introduction: `关于${point}，需要首先明确其基本概念和重要性。`,
    body: `${point}的具体表现可以从多个维度来分析。首先...`,
    transition: `在讨论了前述内容后，接下来需要关注${point}。`,
    conclusion: `综合以上对${point}的分析，可以得出以下结论...`
  };

  let content = templates[type];
  
  // 根据目标长度扩展内容
  const currentLength = content.split('').length;
  if (currentLength < targetLength) {
    const expansion = '这一观点得到了广泛的理论支持和实证验证。相关研究表明，这种方法在实际应用中具有显著的优势。';
    content += expansion;
  }

  return content;
}

function calculateConfidence(content: string, point: string): number {
  // 简单的置信度计算
  const relevanceScore = point.split('').filter(char => content.includes(char)).length / point.length;
  const lengthScore = Math.min(1, content.length / 100);
  return Math.round((relevanceScore * 0.6 + lengthScore * 0.4) * 100) / 100;
}

async function processOutlineNodes(
  nodes: SmartOutlineNode[],
  targetDepth: number,
  moduleType?: string
): Promise<SmartOutlineNode[]> {
  const expandedNodes: SmartOutlineNode[] = [];

  for (const node of nodes) {
    const expandedNode = { ...node };
    
    if (node.level < targetDepth) {
      // 为当前节点生成子节点
      const subPoints = await generateSubPoints(node.title, moduleType);
      expandedNode.children = subPoints.map((point, index) => ({
        id: `${node.id}-${index}`,
        title: point,
        level: node.level + 1,
        children: [],
        status: 'pending' as const,
        wordTarget: Math.floor((node.wordTarget || 300) / subPoints.length)
      }));
    }

    // 递归处理子节点
    if (expandedNode.children.length > 0) {
      expandedNode.children = await processOutlineNodes(
        expandedNode.children,
        targetDepth,
        moduleType
      );
    }

    expandedNodes.push(expandedNode);
  }

  return expandedNodes;
}

async function generateSubPoints(title: string, moduleType?: string): Promise<string[]> {
  // 根据标题和模块类型生成子要点
  const subPointsMap: Record<string, string[]> = {
    '研究背景': ['理论基础', '现状分析', '问题识别'],
    '研究方法': ['研究设计', '数据收集', '分析方法'],
    '研究结果': ['主要发现', '数据分析', '结果解释'],
    '讨论': ['结果讨论', '理论意义', '实践价值'],
    '结论': ['主要结论', '研究贡献', '未来方向']
  };

  return subPointsMap[title] || ['要点一', '要点二', '要点三'];
}

async function analyzeModuleConnection(
  currentModule: PaperModule,
  nextModule: PaperModule
): Promise<CoherenceIssue[]> {
  const issues: CoherenceIssue[] = [];

  // 检查模块间的逻辑连接
  const currentEnd = currentModule.content.split('.').pop()?.trim() || '';
  const nextStart = nextModule.content.split('.')[0]?.trim() || '';

  if (!currentEnd || !nextStart) {
    issues.push({
      id: `connection-${currentModule.id}-${nextModule.id}`,
      type: 'logical_gap',
      severity: 'medium',
      position: { start: 0, end: 0 },
      description: `${currentModule.title}和${nextModule.title}之间缺少过渡`,
      suggestion: '添加过渡句或段落来连接两个模块的内容'
    });
  }

  return issues;
}

async function analyzeOverallFlow(modules: PaperModule[]): Promise<CoherenceIssue[]> {
  const issues: CoherenceIssue[] = [];

  // 检查模块顺序的逻辑性
  const expectedOrder: ModuleType[] = ['abstract', 'introduction', 'methodology', 'results', 'discussion', 'conclusion'];
  const actualOrder = modules.map(m => m.type);

  for (let i = 0; i < expectedOrder.length; i++) {
    const expectedType = expectedOrder[i];
    const actualIndex = actualOrder.indexOf(expectedType);
    
    if (actualIndex !== -1 && actualIndex !== i) {
      issues.push({
        id: `order-${expectedType}`,
        type: 'inconsistency',
        severity: 'low',
        position: { start: 0, end: 0 },
        description: `${expectedType}模块的位置可能不是最佳的`,
        suggestion: `考虑将${expectedType}模块移动到更合适的位置`
      });
    }
  }

  return issues;
}

function generateCoherenceSuggestions(issues: CoherenceIssue[]): string[] {
  const suggestions: string[] = [];

  const highSeverityIssues = issues.filter(issue => issue.severity === 'high');
  if (highSeverityIssues.length > 0) {
    suggestions.push('优先解决高严重性的连贯性问题');
  }

  const logicalGaps = issues.filter(issue => issue.type === 'logical_gap');
  if (logicalGaps.length > 0) {
    suggestions.push('增加过渡句和连接词来改善逻辑流程');
  }

  return suggestions;
}

function calculateCoherenceScore(issues: CoherenceIssue[]): number {
  const severityWeights = { low: 1, medium: 3, high: 5 };
  const totalPenalty = issues.reduce((sum, issue) => sum + severityWeights[issue.severity], 0);
  
  // 基础分100，根据问题扣分
  const score = Math.max(0, 100 - totalPenalty * 2);
  return Math.round(score);
}

async function analyzeStructure(modules: PaperModule[]) {
  // 分析结构并返回改进建议
  return {
    reorderSuggestions: [],
    missingElements: [],
    redundantElements: []
  };
}