import { 
  EnglishPaperType, 
  PaperTypeRecommendation, 
  RecommendationInput,
  PaperTypeDefinition,
  AcademicLevel,
  PaperTypeValidation,
  ValidationIssue
} from '@/types/paper-types';
import { GLMClient } from './glm-client';
import { 
  PAPER_TYPE_DEFINITIONS, 
  getPaperTypeDefinition,
  getWordCountRange,
  validatePaperTypeLevel 
} from '@/data/paper-type-definitions';

// 增强的论文类型关键词映射 - 使用详细定义中的关键词
const PAPER_TYPE_KEYWORDS: Record<EnglishPaperType, string[]> = Object.fromEntries(
  Object.entries(PAPER_TYPE_DEFINITIONS).map(([type, def]) => [type, def.keywords])
) as Record<EnglishPaperType, string[]>;

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

// 增强的字数范围权重 - 使用详细定义中的数据
const WORD_COUNT_WEIGHTS: Record<EnglishPaperType, Record<AcademicLevel, { min: number; max: number; optimal: number }>> = 
  Object.fromEntries(
    Object.entries(PAPER_TYPE_DEFINITIONS).map(([type, def]) => [
      type,
      Object.fromEntries(
        Object.entries(def.typicalWordCount).map(([level, range]) => [
          level,
          {
            min: range.min,
            max: range.max,
            optimal: Math.floor((range.min + range.max) / 2)
          }
        ])
      )
    ])
  ) as Record<EnglishPaperType, Record<AcademicLevel, { min: number; max: number; optimal: number }>>;

// 论文结构特征权重
const STRUCTURE_FEATURES: Record<EnglishPaperType, string[]> = Object.fromEntries(
  Object.entries(PAPER_TYPE_DEFINITIONS).map(([type, def]) => [type, def.coreFeatures])
) as Record<EnglishPaperType, string[]>;

// 语言模式匹配
const LANGUAGE_PATTERNS: Record<EnglishPaperType, RegExp[]> = {
  'literary-analysis': [
    /\b(symbolizes?|represents?|suggests?|implies?|metaphor|imagery)\b/gi,
    /\b(the author|the text|the work|the poem|the novel)\b/gi,
    /\b(theme|motif|character development|narrative technique)\b/gi
  ],
  'comparative-analysis': [
    /\b(in contrast|however|whereas|while|both|similarly|unlike)\b/gi,
    /\b(compare[sd]?|comparison|differ[s]?|similar|contrast)\b/gi,
    /\b(on one hand|on the other hand|in comparison)\b/gi
  ],
  'cultural-analysis': [
    /\b(cultural|society|social|community|tradition|ritual)\b/gi,
    /\b(identity|representation|ideology|power|discourse)\b/gi,
    /\b(anthropological|ethnographic|postcolonial|gender)\b/gi
  ],
  'literature-review': [
    /\b(previous research|studies show|according to|researchers found)\b/gi,
    /\b(literature suggests|current research|existing studies)\b/gi,
    /\b(meta-analysis|systematic review|research gap)\b/gi
  ],
  'critical-review': [
    /\b(strengths?|weaknesses?|limitations?|advantages?|disadvantages?)\b/gi,
    /\b(effective|ineffective|successful|problematic|flawed)\b/gi,
    /\b(critique|evaluation|assessment|judgment)\b/gi
  ],
  'empirical-research': [
    /\b(methodology|data collection|statistical analysis|results)\b/gi,
    /\b(hypothesis|variables?|participants?|procedure)\b/gi,
    /\b(significant|correlation|regression|p-value)\b/gi
  ],
  'case-study': [
    /\b(case study|specific case|particular instance|real-world)\b/gi,
    /\b(in-depth|detailed analysis|comprehensive examination)\b/gi,
    /\b(triangulation|multiple sources|stakeholders?)\b/gi
  ],
  'discourse-analysis': [
    /\b(discourse|language use|communication|speech act)\b/gi,
    /\b(power relations|social construction|meaning making)\b/gi,
    /\b(linguistic|pragmatic|semantic|syntactic)\b/gi
  ],
  'theoretical-discussion': [
    /\b(theory|theoretical|framework|paradigm|concept)\b/gi,
    /\b(philosophical|abstract|principle|assumption)\b/gi,
    /\b(conceptual|model|proposition|speculation)\b/gi
  ],
  'dissertation-thesis': [
    /\b(dissertation|thesis|doctoral|comprehensive|extensive)\b/gi,
    /\b(original contribution|research question|methodology)\b/gi,
    /\b(literature review|theoretical framework|implications)\b/gi
  ]
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
   * 增强的基于关键词和模式的基础分析
   */
  private analyzeByKeywords(input: RecommendationInput): PaperTypeRecommendation[] {
    const recommendations: PaperTypeRecommendation[] = [];
    const combinedText = `${input.title || ''} ${input.abstract || ''} ${input.existingContent || ''}`.toLowerCase();
    const keywords = input.keywords || [];

    // 为每种论文类型计算匹配度
    Object.entries(PAPER_TYPE_KEYWORDS).forEach(([paperType, typeKeywords]) => {
      let matchScore = 0;
      const matchedKeywords: string[] = [];
      const reasons: string[] = [];

      // 1. 关键词匹配 (40%权重)
      typeKeywords.forEach(keyword => {
        if (combinedText.includes(keyword.toLowerCase()) || 
            keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))) {
          matchScore += 1;
          matchedKeywords.push(keyword);
        }
      });
      const keywordScore = Math.min(matchScore / typeKeywords.length, 1) * 0.4;

      // 2. 语言模式匹配 (25%权重)
      const patterns = LANGUAGE_PATTERNS[paperType as EnglishPaperType] || [];
      let patternMatches = 0;
      patterns.forEach(pattern => {
        const matches = combinedText.match(pattern);
        if (matches) {
          patternMatches += matches.length;
        }
      });
      const patternScore = Math.min(patternMatches / 10, 1) * 0.25;

      // 3. 字数匹配权重 (20%权重)
      let wordCountScore = 0;
      if (input.targetLength && input.academicLevel) {
        const range = WORD_COUNT_WEIGHTS[paperType as EnglishPaperType]?.[input.academicLevel];
        if (range && input.targetLength >= range.min && input.targetLength <= range.max) {
          const deviation = Math.abs(input.targetLength - range.optimal) / range.optimal;
          wordCountScore = Math.max(0, 1 - deviation) * 0.2;
          if (deviation < 0.1) {
            reasons.push(`字数范围完美匹配 (${input.targetLength.toLocaleString()}字)`);
          } else if (deviation < 0.3) {
            reasons.push(`字数范围良好匹配 (${input.targetLength.toLocaleString()}字)`);
          }
        }
      }

      // 4. 学术层次匹配 (10%权重)
      let levelScore = 0;
      if (input.academicLevel) {
        const definition = getPaperTypeDefinition(paperType as EnglishPaperType);
        if (definition.academicLevels.includes(input.academicLevel)) {
          levelScore = 0.1;
          reasons.push(`适合${input.academicLevel}层次`);
        }

        // 检查学术层次关键词
        const levelKeywords = ACADEMIC_LEVEL_KEYWORDS[input.academicLevel];
        levelKeywords.forEach(keyword => {
          if (combinedText.includes(keyword)) {
            levelScore += 0.01;
          }
        });
      }

      // 5. 结构特征匹配 (5%权重)
      let structureScore = 0;
      const structureFeatures = STRUCTURE_FEATURES[paperType as EnglishPaperType] || [];
      structureFeatures.forEach(feature => {
        if (combinedText.includes(feature.toLowerCase()) ||
            input.requirements?.toLowerCase().includes(feature.toLowerCase())) {
          structureScore += 0.01;
        }
      });
      structureScore = Math.min(structureScore, 0.05);

      // 计算总分
      const totalScore = keywordScore + patternScore + wordCountScore + levelScore + structureScore;
      const confidence = Math.min(totalScore, 1);

      // 生成推荐
      if (confidence > 0.1) { // 提高阈值，减少噪音
        if (matchedKeywords.length > 0) {
          reasons.unshift(`匹配关键词: ${matchedKeywords.slice(0, 5).join(', ')}`);
        }
        if (patternMatches > 0) {
          reasons.push(`发现${patternMatches}个相关语言模式`);
        }

        recommendations.push({
          paperType: paperType as EnglishPaperType,
          confidence,
          matchScore: Math.round(totalScore * 100),
          reasons: reasons.slice(0, 4), // 限制原因数量
          suggestedAcademicLevel: input.academicLevel || this.suggestAcademicLevel(
            paperType as EnglishPaperType, 
            input.targetLength
          )
        });
      }
    });

    return recommendations;
  }

  /**
   * 建议学术层次
   */
  private suggestAcademicLevel(paperType: EnglishPaperType, targetLength?: number): AcademicLevel {
    const definition = getPaperTypeDefinition(paperType);
    
    if (!targetLength) {
      return definition.academicLevels[0]; // 返回最低支持层次
    }

    // 根据字数建议层次
    for (const level of ['undergraduate', 'master', 'doctoral'] as AcademicLevel[]) {
      if (definition.academicLevels.includes(level)) {
        const range = definition.typicalWordCount[level];
        if (targetLength >= range.min && targetLength <= range.max) {
          return level;
        }
      }
    }

    return definition.academicLevels[0];
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