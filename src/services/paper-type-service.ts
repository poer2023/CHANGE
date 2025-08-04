import { 
  EnglishPaperType, 
  PaperTypeRecommendation, 
  RecommendationInput,
  PaperTypeDefinition,
  AcademicLevel
} from '@/types/paper-types';
import { GLMClient } from './glm-client';

// 论文类型关键词映射
const PAPER_TYPE_KEYWORDS: Record<EnglishPaperType, string[]> = {
  'literary-analysis': [
    'literature', 'literary', 'text', 'poetry', 'novel', 'drama', 'analysis', 'interpretation',
    'symbolism', 'theme', 'character', 'narrative', 'style', 'author', 'writing techniques',
    'close reading', 'textual analysis', 'literary criticism', 'motif', 'allegory'
  ],
  'comparative-analysis': [
    'compare', 'comparison', 'contrast', 'versus', 'similarities', 'differences', 'parallel',
    'both', 'whereas', 'unlike', 'similar', 'different', 'between', 'among', 'comparative',
    'relationship', 'connection', 'distinction', 'analogy'
  ],
  'cultural-analysis': [
    'culture', 'cultural', 'society', 'social', 'anthropology', 'ethnography', 'community',
    'tradition', 'customs', 'identity', 'values', 'beliefs', 'practices', 'ritual',
    'cultural studies', 'postcolonial', 'gender', 'race', 'class', 'power'
  ],
  'literature-review': [
    'review', 'literature', 'research', 'studies', 'findings', 'previous', 'existing',
    'scholars', 'academic', 'sources', 'synthesis', 'overview', 'survey', 'examination',
    'current state', 'gaps', 'trends', 'developments', 'publications'
  ],
  'critical-review': [
    'critical', 'critique', 'evaluation', 'assessment', 'judgment', 'analysis', 'review',
    'strengths', 'weaknesses', 'limitations', 'merits', 'flaws', 'effectiveness',
    'validity', 'reliability', 'bias', 'perspective', 'argument', 'position'
  ],
  'empirical-research': [
    'research', 'study', 'data', 'methodology', 'method', 'experiment', 'survey',
    'interview', 'questionnaire', 'analysis', 'results', 'findings', 'statistics',
    'quantitative', 'qualitative', 'evidence', 'investigation', 'empirical', 'observation'
  ],
  'case-study': [
    'case', 'study', 'specific', 'particular', 'individual', 'example', 'instance',
    'detailed', 'in-depth', 'comprehensive', 'examination', 'investigation', 'analysis',
    'real-world', 'practical', 'situation', 'context', 'application'
  ],
  'discourse-analysis': [
    'discourse', 'language', 'communication', 'speech', 'conversation', 'text', 'linguistic',
    'rhetoric', 'power', 'ideology', 'social construction', 'meaning', 'context',
    'pragmatics', 'semiotics', 'narrative', 'dialogue', 'verbal', 'non-verbal'
  ],
  'theoretical-discussion': [
    'theory', 'theoretical', 'concept', 'conceptual', 'framework', 'model', 'philosophy',
    'philosophical', 'abstract', 'principle', 'idea', 'notion', 'construct', 'paradigm',
    'hypothesis', 'assumption', 'proposition', 'speculation', 'reflection'
  ],
  'dissertation-thesis': [
    'dissertation', 'thesis', 'degree', 'phd', 'doctoral', 'master', 'graduate',
    'comprehensive', 'extensive', 'original', 'contribution', 'research', 'academic',
    'scholarship', 'investigation', 'detailed study', 'in-depth analysis'
  ]
};

// 学术层次关键词
const ACADEMIC_LEVEL_KEYWORDS: Record<AcademicLevel, string[]> = {
  undergraduate: [
    'basic', 'introduction', 'elementary', 'fundamental', 'overview', 'simple',
    'undergraduate', 'bachelor', 'beginner', 'first-year', 'sophomore'
  ],
  master: [
    'advanced', 'detailed', 'comprehensive', 'master', 'graduate', 'specialization',
    'in-depth', 'sophisticated', 'complex', 'professional', 'specialized'
  ],
  doctoral: [
    'original', 'innovative', 'cutting-edge', 'doctoral', 'phd', 'research',
    'contribution', 'novel', 'groundbreaking', 'expert', 'scholarly', 'theoretical'
  ]
};

// 字数范围权重
const WORD_COUNT_WEIGHTS: Record<EnglishPaperType, { min: number; max: number; optimal: number }> = {
  'literary-analysis': { min: 1500, max: 15000, optimal: 5000 },
  'comparative-analysis': { min: 2000, max: 12000, optimal: 6000 },
  'cultural-analysis': { min: 2500, max: 20000, optimal: 8000 },
  'literature-review': { min: 2000, max: 15000, optimal: 6000 },
  'critical-review': { min: 1500, max: 10000, optimal: 4000 },
  'empirical-research': { min: 3000, max: 25000, optimal: 10000 },
  'case-study': { min: 2500, max: 18000, optimal: 8000 },
  'discourse-analysis': { min: 3000, max: 20000, optimal: 10000 },
  'theoretical-discussion': { min: 4000, max: 30000, optimal: 15000 },
  'dissertation-thesis': { min: 8000, max: 100000, optimal: 40000 }
};

export class PaperTypeService {
  private glmClient: GLMClient;

  constructor() {
    this.glmClient = new GLMClient();
  }

  /**
   * 基于输入内容推荐论文类型
   */
  async recommendPaperTypes(input: RecommendationInput): Promise<PaperTypeRecommendation[]> {
    try {
      // 先进行基础关键词匹配
      const keywordRecommendations = this.analyzeByKeywords(input);
      
      // 使用AI进行深度分析
      const aiRecommendations = await this.analyzeWithAI(input);
      
      // 合并和权重计算
      const combinedRecommendations = this.combineRecommendations(
        keywordRecommendations,
        aiRecommendations,
        input
      );

      // 排序并返回前5个推荐
      return combinedRecommendations
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);
    } catch (error) {
      console.error('Error in paper type recommendation:', error);
      // 降级到基础关键词分析
      return this.analyzeByKeywords(input)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3);
    }
  }

  /**
   * 基于关键词的基础分析
   */
  private analyzeByKeywords(input: RecommendationInput): PaperTypeRecommendation[] {
    const recommendations: PaperTypeRecommendation[] = [];
    const combinedText = `${input.title || ''} ${input.abstract || ''} ${input.existingContent || ''}`.toLowerCase();
    const keywords = input.keywords || [];

    // 为每种论文类型计算匹配度
    Object.entries(PAPER_TYPE_KEYWORDS).forEach(([paperType, typeKeywords]) => {
      let matchScore = 0;
      const matchedKeywords: string[] = [];

      // 关键词匹配
      typeKeywords.forEach(keyword => {
        if (combinedText.includes(keyword.toLowerCase()) || 
            keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))) {
          matchScore += 1;
          matchedKeywords.push(keyword);
        }
      });

      // 字数匹配权重
      if (input.targetLength) {
        const range = WORD_COUNT_WEIGHTS[paperType as EnglishPaperType];
        if (input.targetLength >= range.min && input.targetLength <= range.max) {
          matchScore += 2;
        }
      }

      // 学术层次匹配
      if (input.academicLevel) {
        const levelKeywords = ACADEMIC_LEVEL_KEYWORDS[input.academicLevel];
        levelKeywords.forEach(keyword => {
          if (combinedText.includes(keyword)) {
            matchScore += 1;
          }
        });
      }

      // 生成推荐
      if (matchScore > 0) {
        const confidence = Math.min(matchScore / typeKeywords.length, 1);
        recommendations.push({
          paperType: paperType as EnglishPaperType,
          confidence,
          matchScore,
          reasons: [
            `匹配关键词: ${matchedKeywords.slice(0, 3).join(', ')}`,
            ...(input.targetLength ? [`字数范围适合 (${input.targetLength.toLocaleString()}字)`] : []),
            ...(input.academicLevel ? [`适合${input.academicLevel}层次`] : [])
          ],
          suggestedAcademicLevel: input.academicLevel || 'undergraduate'
        });
      }
    });

    return recommendations;
  }

  /**
   * 使用AI进行深度内容分析
   */
  private async analyzeWithAI(input: RecommendationInput): Promise<PaperTypeRecommendation[]> {
    const prompt = this.buildAIAnalysisPrompt(input);
    
    try {
      const response = await this.glmClient.chat([
        {
          role: 'system',
          content: `You are an expert academic writing advisor specializing in English literature and language studies. Analyze the given content and recommend the most suitable paper types from the 10 English academic paper types.

The 10 paper types are:
1. Literary Analysis Paper - Analysis of literary works, themes, and techniques
2. Comparative Analysis Paper - Systematic comparison of subjects, texts, or concepts  
3. Cultural Analysis Paper - Analysis of cultural phenomena and practices
4. Literature Review - Comprehensive review and synthesis of existing research
5. Critical Review - Critical evaluation and assessment of works or theories
6. Empirical Research Paper - Original research based on empirical evidence
7. Case Study Paper - In-depth analysis of specific cases or phenomena
8. Discourse Analysis Paper - Analysis of language use in social contexts
9. Theoretical Discussion Paper - Exploration of theoretical concepts and frameworks
10. Dissertation/Thesis - Comprehensive academic work for degree requirements

Respond with a JSON array of recommendations, each containing:
- paperType (one of the 10 types above, using kebab-case)
- confidence (0-1)
- reasons (array of strings explaining why this type fits)
- suggestedAcademicLevel (undergraduate/master/doctoral)
- matchScore (0-10)

Provide 3-5 recommendations ranked by confidence.`
        },
        {
          role: 'user',
          content: prompt
        }
      ], {
        temperature: 0.3,
        maxTokens: 1000
      });

      return this.parseAIResponse(response.content);
    } catch (error) {
      console.error('AI analysis failed:', error);
      return [];
    }
  }

  /**
   * 构建AI分析提示词
   */
  private buildAIAnalysisPrompt(input: RecommendationInput): string {
    let prompt = "Analyze the following academic content and recommend suitable paper types:\n\n";
    
    if (input.title) {
      prompt += `Title: "${input.title}"\n`;
    }
    
    if (input.abstract) {
      prompt += `Abstract: "${input.abstract}"\n`;
    }
    
    if (input.keywords && input.keywords.length > 0) {
      prompt += `Keywords: ${input.keywords.join(', ')}\n`;
    }
    
    if (input.subject) {
      prompt += `Subject Area: ${input.subject}\n`;
    }
    
    if (input.researchMethod) {
      prompt += `Research Method: ${input.researchMethod}\n`;
    }
    
    if (input.targetLength) {
      prompt += `Target Length: ${input.targetLength.toLocaleString()} words\n`;
    }
    
    if (input.academicLevel) {
      prompt += `Academic Level: ${input.academicLevel}\n`;
    }
    
    if (input.existingContent) {
      prompt += `Content Sample: "${input.existingContent.substring(0, 500)}..."\n`;
    }

    prompt += "\nBased on this information, recommend the most suitable paper types with reasoning.";
    
    return prompt;
  }

  /**
   * 解析AI响应
   */
  private parseAIResponse(response: string): PaperTypeRecommendation[] {
    try {
      // 尝试提取JSON
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.map((rec: any) => ({
        paperType: rec.paperType,
        confidence: Math.max(0, Math.min(1, rec.confidence || 0)),
        reasons: Array.isArray(rec.reasons) ? rec.reasons : [],
        suggestedAcademicLevel: rec.suggestedAcademicLevel || 'undergraduate',
        matchScore: rec.matchScore || 0
      }));
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return [];
    }
  }

  /**
   * 合并关键词和AI推荐结果
   */
  private combineRecommendations(
    keywordRecs: PaperTypeRecommendation[],
    aiRecs: PaperTypeRecommendation[],
    input: RecommendationInput
  ): PaperTypeRecommendation[] {
    const combined = new Map<EnglishPaperType, PaperTypeRecommendation>();

    // 处理关键词推荐
    keywordRecs.forEach(rec => {
      combined.set(rec.paperType, {
        ...rec,
        confidence: rec.confidence * 0.6 // 关键词权重60%
      });
    });

    // 处理AI推荐，合并或添加
    aiRecs.forEach(aiRec => {
      const existing = combined.get(aiRec.paperType);
      if (existing) {
        // 合并推荐
        combined.set(aiRec.paperType, {
          paperType: aiRec.paperType,
          confidence: Math.min(1, existing.confidence + aiRec.confidence * 0.4), // AI权重40%
          reasons: [...existing.reasons, ...aiRec.reasons],
          suggestedAcademicLevel: aiRec.suggestedAcademicLevel,
          matchScore: Math.max(existing.matchScore, aiRec.matchScore)
        });
      } else {
        // 新增推荐
        combined.set(aiRec.paperType, {
          ...aiRec,
          confidence: aiRec.confidence * 0.4
        });
      }
    });

    // 应用额外的上下文权重
    this.applyContextualWeights(Array.from(combined.values()), input);

    return Array.from(combined.values());
  }

  /**
   * 应用上下文权重调整
   */
  private applyContextualWeights(
    recommendations: PaperTypeRecommendation[],
    input: RecommendationInput
  ): void {
    recommendations.forEach(rec => {
      // 字数匹配加权
      if (input.targetLength) {
        const range = WORD_COUNT_WEIGHTS[rec.paperType];
        const deviation = Math.abs(input.targetLength - range.optimal) / range.optimal;
        if (deviation < 0.2) { // 偏差小于20%
          rec.confidence *= 1.2;
        } else if (deviation > 0.5) { // 偏差大于50%
          rec.confidence *= 0.8;
        }
      }

      // 学术层次匹配加权
      if (input.academicLevel && rec.suggestedAcademicLevel === input.academicLevel) {
        rec.confidence *= 1.1;
      }

      // 确保confidence在0-1范围内
      rec.confidence = Math.max(0, Math.min(1, rec.confidence));
    });
  }

  /**
   * 获取特定论文类型的详细信息
   */
  getPaperTypeDetails(paperType: EnglishPaperType): PaperTypeDefinition | null {
    // 这里应该从一个数据源获取论文类型定义
    // 为了演示，返回基础结构
    return null;
  }

  /**
   * 验证论文类型选择的合理性
   */
  validatePaperTypeSelection(
    paperType: EnglishPaperType,
    academicLevel: AcademicLevel,
    targetLength?: number
  ): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];
    let valid = true;

    // 检查字数合理性
    if (targetLength) {
      const range = WORD_COUNT_WEIGHTS[paperType];
      if (targetLength < range.min) {
        warnings.push(`目标字数(${targetLength.toLocaleString()})可能过少，建议至少${range.min.toLocaleString()}字`);
      } else if (targetLength > range.max) {
        warnings.push(`目标字数(${targetLength.toLocaleString()})可能过多，建议不超过${range.max.toLocaleString()}字`);
      }
    }

    // 检查学术层次匹配度
    const complexTypes: EnglishPaperType[] = ['theoretical-discussion', 'discourse-analysis', 'cultural-analysis'];
    if (complexTypes.includes(paperType) && academicLevel === 'undergraduate') {
      warnings.push('此论文类型对本科生来说可能较为复杂，建议选择更基础的类型');
    }

    return { valid, warnings };
  }
}