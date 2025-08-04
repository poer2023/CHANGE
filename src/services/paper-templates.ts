/**
 * 论文模板系统 - 10种专业化论文类型模块模板
 * 为不同类型的英语学术论文提供标准化的模块结构和写作指导
 */

import { 
  EnglishPaperType, 
  AcademicLevel, 
  PaperStructureTemplate,
  PaperModuleTemplate,
  TemplateMetadata,
  WritingGuidance,
  WritingExample,
  SubSectionTemplate
} from '@/types/paper-types';
import { ModuleType } from '@/types/modular';

/**
 * 论文模板管理服务
 */
export class PaperTemplateService {
  private templates: Map<string, PaperStructureTemplate> = new Map();
  private guidanceMap: Map<string, WritingGuidance> = new Map();

  constructor() {
    this.initializeTemplates();
    this.initializeWritingGuidance();
  }

  /**
   * 获取指定论文类型和学术层次的模板
   */
  getTemplate(paperType: EnglishPaperType, academicLevel: AcademicLevel): PaperStructureTemplate | null {
    const key = `${paperType}-${academicLevel}`;
    return this.templates.get(key) || null;
  }

  /**
   * 获取所有可用模板
   */
  getAllTemplates(): PaperStructureTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * 获取特定论文类型的所有学术层次模板
   */
  getTemplatesByPaperType(paperType: EnglishPaperType): PaperStructureTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => template.paperType === paperType);
  }

  /**
   * 获取写作指导
   */
  getWritingGuidance(paperType: EnglishPaperType, academicLevel: AcademicLevel, moduleType?: ModuleType): WritingGuidance | null {
    const key = moduleType 
      ? `${paperType}-${academicLevel}-${moduleType}`
      : `${paperType}-${academicLevel}`;
    return this.guidanceMap.get(key) || null;
  }

  /**
   * 根据内容推荐最适合的模板
   */
  recommendTemplate(
    paperType: EnglishPaperType,
    academicLevel: AcademicLevel,
    targetWordCount?: number,
    researchMethod?: string
  ): PaperStructureTemplate | null {
    const template = this.getTemplate(paperType, academicLevel);
    if (!template) return null;

    // 基于字数和研究方法调整模板
    if (targetWordCount || researchMethod) {
      return this.customizeTemplate(template, { targetWordCount, researchMethod });
    }

    return template;
  }

  /**
   * 自定义模板
   */
  private customizeTemplate(
    baseTemplate: PaperStructureTemplate, 
    options: { targetWordCount?: number; researchMethod?: string }
  ): PaperStructureTemplate {
    const customized = { ...baseTemplate };
    
    if (options.targetWordCount) {
      // 根据目标字数调整模块字数分配
      customized.modules = customized.modules.map(module => ({
        ...module,
        estimatedWordCount: this.adjustWordCount(module.estimatedWordCount, options.targetWordCount!)
      }));
    }

    return customized;
  }

  /**
   * 调整字数分配
   */
  private adjustWordCount(
    originalRange: { min: number; max: number },
    targetTotal: number
  ): { min: number; max: number } {
    const ratio = targetTotal / 8000; // 假设基础模板为8000字
    return {
      min: Math.round(originalRange.min * ratio),
      max: Math.round(originalRange.max * ratio)
    };
  }

  /**
   * 初始化所有模板
   */
  private initializeTemplates(): void {
    // 为每种论文类型和学术层次创建模板
    const paperTypes: EnglishPaperType[] = [
      'literary-analysis',
      'comparative-analysis', 
      'cultural-analysis',
      'literature-review',
      'critical-review',
      'empirical-research',
      'case-study',
      'discourse-analysis',
      'theoretical-discussion',
      'dissertation-thesis'
    ];

    const academicLevels: AcademicLevel[] = ['undergraduate', 'master', 'doctoral'];

    paperTypes.forEach(paperType => {
      academicLevels.forEach(level => {
        const template = this.createTemplateForType(paperType, level);
        if (template) {
          this.templates.set(`${paperType}-${level}`, template);
        }
      });
    });
  }

  /**
   * 为特定类型创建模板
   */
  private createTemplateForType(paperType: EnglishPaperType, academicLevel: AcademicLevel): PaperStructureTemplate {
    const templateId = `${paperType}-${academicLevel}-template`;
    
    switch (paperType) {
      case 'literary-analysis':
        return this.createLiteraryAnalysisTemplate(templateId, academicLevel);
      case 'comparative-analysis':
        return this.createComparativeAnalysisTemplate(templateId, academicLevel);
      case 'cultural-analysis':
        return this.createCulturalAnalysisTemplate(templateId, academicLevel);
      case 'literature-review':
        return this.createLiteratureReviewTemplate(templateId, academicLevel);
      case 'critical-review':
        return this.createCriticalReviewTemplate(templateId, academicLevel);
      case 'empirical-research':
        return this.createEmpiricalResearchTemplate(templateId, academicLevel);
      case 'case-study':
        return this.createCaseStudyTemplate(templateId, academicLevel);
      case 'discourse-analysis':
        return this.createDiscourseAnalysisTemplate(templateId, academicLevel);
      case 'theoretical-discussion':
        return this.createTheoreticalDiscussionTemplate(templateId, academicLevel);
      case 'dissertation-thesis':
        return this.createDissertationTemplate(templateId, academicLevel);
      default:
        throw new Error(`Unknown paper type: ${paperType}`);
    }
  }

  /**
   * 文学分析论文模板
   */
  private createLiteraryAnalysisTemplate(id: string, level: AcademicLevel): PaperStructureTemplate {
    const wordCounts = this.getWordCountByLevel(level, { base: 5000, undergraduate: 0.6, master: 1.0, doctoral: 1.8 });
    
    return {
      id,
      paperType: 'literary-analysis',
      academicLevel: level,
      name: `Literary Analysis Paper - ${level.charAt(0).toUpperCase() + level.slice(1)}`,
      description: 'Template for analyzing literary works, focusing on themes, techniques, and interpretations',
      modules: [
        {
          id: 'intro-la',
          type: 'introduction',
          title: 'Introduction',
          description: 'Introduce the literary work and present your thesis statement',
          isRequired: true,
          order: 1,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What is the central theme or question you will explore?',
            'What is your thesis statement about the literary work?',
            'How will you approach your analysis?'
          ],
          guidelines: [
            'Start with a compelling hook related to the literary work',
            'Provide necessary background information about the author and work',
            'Present a clear, arguable thesis statement',
            'Outline the structure of your analysis'
          ],
          dependencies: [],
          subSections: [
            {
              id: 'hook',
              title: 'Opening Hook',
              description: 'Engaging opening that draws reader into your analysis',
              isRequired: true,
              order: 1,
              writingPrompts: ['What makes this literary work significant or intriguing?']
            },
            {
              id: 'background',
              title: 'Background Information',
              description: 'Context about the author, work, and historical period',
              isRequired: true,
              order: 2,
              writingPrompts: ['What context do readers need to understand your analysis?']
            },
            {
              id: 'thesis',
              title: 'Thesis Statement',
              description: 'Clear statement of your main argument',
              isRequired: true,
              order: 3,
              writingPrompts: ['What is your main claim about the literary work?']
            }
          ]
        },
        {
          id: 'textual-analysis',
          type: 'custom',
          title: 'Textual Analysis',
          description: 'Detailed analysis of literary elements and techniques',
          isRequired: true,
          order: 2,
          estimatedWordCount: { min: Math.round(wordCounts * 0.4), max: Math.round(wordCounts * 0.5) },
          writingPrompts: [
            'What specific literary techniques does the author use?',
            'How do these techniques support your thesis?',
            'What textual evidence best supports your interpretation?'
          ],
          guidelines: [
            'Use close reading techniques to analyze specific passages',
            'Connect literary devices to larger themes',
            'Provide direct quotations with proper citations',
            'Explain how evidence supports your thesis'
          ],
          dependencies: ['intro-la'],
          subSections: [
            {
              id: 'literary-devices',
              title: 'Literary Devices and Techniques',
              description: 'Analysis of metaphors, symbols, imagery, etc.',
              isRequired: true,
              order: 1,
              writingPrompts: ['What literary devices are most prominent in the work?']
            },
            {
              id: 'themes',
              title: 'Thematic Analysis',
              description: 'Exploration of major themes and their development',
              isRequired: true,
              order: 2,
              writingPrompts: ['How do the themes develop throughout the work?']
            },
            {
              id: 'character-analysis',
              title: 'Character Analysis',
              description: 'Analysis of character development and significance',
              isRequired: false,
              order: 3,
              writingPrompts: ['How do characters embody or challenge the themes?']
            }
          ]
        },
        {
          id: 'critical-interpretation',
          type: 'discussion',
          title: 'Critical Interpretation',
          description: 'Deeper interpretation and critical perspectives',
          isRequired: level !== 'undergraduate',
          order: 3,
          estimatedWordCount: { min: Math.round(wordCounts * 0.2), max: Math.round(wordCounts * 0.25) },
          writingPrompts: [
            'How does your interpretation contribute to literary scholarship?',
            'What alternative interpretations might exist?',
            'How does this work relate to broader literary movements?'
          ],
          guidelines: [
            'Engage with existing literary criticism',
            'Consider multiple interpretative approaches',
            'Address potential counter-arguments',
            'Connect to broader literary or cultural contexts'
          ],
          dependencies: ['textual-analysis']
        },
        {
          id: 'conclusion-la',
          type: 'conclusion',
          title: 'Conclusion',
          description: 'Synthesize your analysis and reflect on broader implications',
          isRequired: true,
          order: 4,
          estimatedWordCount: { min: Math.round(wordCounts * 0.1), max: Math.round(wordCounts * 0.15) },
          writingPrompts: [
            'How does your analysis enhance understanding of the work?',
            'What broader implications does your interpretation have?',
            'What questions for future research emerge from your analysis?'
          ],
          guidelines: [
            'Restate thesis in new language',
            'Synthesize key insights from your analysis',
            'Discuss broader significance or implications',
            'End with a memorable closing thought'
          ],
          dependencies: ['textual-analysis', 'critical-interpretation']
        },
        {
          id: 'references-la',
          type: 'references',
          title: 'Works Cited',
          description: 'Properly formatted citations of all sources used',
          isRequired: true,
          order: 5,
          estimatedWordCount: { min: 50, max: 200 },
          writingPrompts: [
            'Have you cited all sources used in your analysis?'
          ],
          guidelines: [
            'Use appropriate citation style (MLA, APA, etc.)',
            'Include primary and secondary sources',
            'Ensure all in-text citations have corresponding entries',
            'Format according to academic standards'
          ],
          dependencies: []
        }
      ],
      metadata: {
        difficulty: level === 'undergraduate' ? 'beginner' : level === 'master' ? 'intermediate' : 'advanced',
        estimatedTime: level === 'undergraduate' ? 20 : level === 'master' ? 35 : 60,
        tags: ['literature', 'analysis', 'close-reading', 'interpretation'],
        lastUpdated: new Date(),
        version: '1.0',
        author: 'Paper Template System'
      }
    };
  }

  /**
   * 比较分析论文模板
   */
  private createComparativeAnalysisTemplate(id: string, level: AcademicLevel): PaperStructureTemplate {
    const wordCounts = this.getWordCountByLevel(level, { base: 6000, undergraduate: 0.7, master: 1.0, doctoral: 1.6 });
    
    return {
      id,
      paperType: 'comparative-analysis',
      academicLevel: level,
      name: `Comparative Analysis Paper - ${level.charAt(0).toUpperCase() + level.slice(1)}`,
      description: 'Template for systematic comparison of texts, concepts, or phenomena',
      modules: [
        {
          id: 'intro-comp',
          type: 'introduction',
          title: 'Introduction',
          description: 'Introduce the subjects of comparison and your comparative thesis',
          isRequired: true,
          order: 1,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What are you comparing and why?',
            'What is your comparative thesis?',
            'What criteria will guide your comparison?'
          ],
          guidelines: [
            'Clearly identify the subjects being compared',
            'Establish the basis for comparison',
            'Present a thesis that makes a claim about the comparison',
            'Preview your comparative framework'
          ],
          dependencies: []
        },
        {
          id: 'comparative-framework',
          type: 'methodology',
          title: 'Comparative Framework',
          description: 'Establish criteria and methodology for comparison',
          isRequired: level !== 'undergraduate',
          order: 2,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What criteria will you use for comparison?',
            'What theoretical framework guides your analysis?',
            'How will you ensure fair and systematic comparison?'
          ],
          guidelines: [
            'Define clear criteria for comparison',
            'Explain your analytical approach',
            'Address potential limitations of your framework',
            'Justify your methodological choices'
          ],
          dependencies: ['intro-comp']
        },
        {
          id: 'point-by-point-analysis',
          type: 'custom',
          title: 'Point-by-Point Analysis',
          description: 'Systematic comparison across identified criteria',
          isRequired: true,
          order: 3,
          estimatedWordCount: { min: Math.round(wordCounts * 0.4), max: Math.round(wordCounts * 0.5) },
          writingPrompts: [
            'How do the subjects compare on each criterion?',
            'What similarities and differences emerge?',
            'What evidence supports your comparative claims?'
          ],
          guidelines: [
            'Address each comparative criterion systematically',
            'Provide balanced analysis of both subjects',
            'Use specific evidence to support comparisons',
            'Maintain focus on your thesis throughout'
          ],
          dependencies: ['comparative-framework'],
          subSections: [
            {
              id: 'similarities',
              title: 'Key Similarities',
              description: 'Analysis of common features or characteristics',
              isRequired: true,
              order: 1,
              writingPrompts: ['What significant similarities exist between the subjects?']
            },
            {
              id: 'differences',
              title: 'Key Differences',
              description: 'Analysis of contrasting features or characteristics',
              isRequired: true,
              order: 2,
              writingPrompts: ['What important differences distinguish the subjects?']
            },
            {
              id: 'significance',
              title: 'Significance of Comparisons',
              description: 'Analysis of what the comparisons reveal',
              isRequired: true,
              order: 3,
              writingPrompts: ['What do these similarities and differences tell us?']
            }
          ]
        },
        {
          id: 'synthesis',
          type: 'discussion',
          title: 'Synthesis and Implications',
          description: 'Synthesize comparative findings and discuss broader implications',
          isRequired: true,
          order: 4,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What overall patterns emerge from your comparison?',
            'What broader implications do your findings have?',
            'How does this comparison contribute to understanding?'
          ],
          guidelines: [
            'Synthesize key comparative findings',
            'Discuss broader significance of the comparison',
            'Connect findings to larger contexts or debates',
            'Address limitations of your analysis'
          ],
          dependencies: ['point-by-point-analysis']
        },
        {
          id: 'conclusion-comp',
          type: 'conclusion',
          title: 'Conclusion',
          description: 'Conclude with the significance of your comparative analysis',
          isRequired: true,
          order: 5,
          estimatedWordCount: { min: Math.round(wordCounts * 0.1), max: Math.round(wordCounts * 0.15) },
          writingPrompts: [
            'What has your comparative analysis revealed?',
            'Why is this comparison valuable?',
            'What questions remain for further investigation?'
          ],
          guidelines: [
            'Reaffirm your comparative thesis',
            'Highlight key insights from the analysis',
            'Discuss the value of the comparison',
            'Suggest directions for future research'
          ],
          dependencies: ['synthesis']
        },
        {
          id: 'references-comp',
          type: 'references',
          title: 'References',
          description: 'Citations for all sources used in the comparative analysis',
          isRequired: true,
          order: 6,
          estimatedWordCount: { min: 100, max: 300 },
          writingPrompts: ['Have you properly cited all comparative sources?'],
          guidelines: [
            'Include all primary sources being compared',
            'Cite secondary sources that inform your analysis',
            'Use consistent citation style throughout',
            'Ensure accuracy of all bibliographic information'
          ],
          dependencies: []
        }
      ],
      metadata: {
        difficulty: level === 'undergraduate' ? 'intermediate' : level === 'master' ? 'intermediate' : 'advanced',
        estimatedTime: level === 'undergraduate' ? 25 : level === 'master' ? 40 : 70,
        tags: ['comparison', 'analysis', 'systematic', 'evaluation'],
        lastUpdated: new Date(),
        version: '1.0',
        author: 'Paper Template System'
      }
    };
  }

  /**
   * 根据学术层次计算字数
   */
  private getWordCountByLevel(
    level: AcademicLevel, 
    config: { base: number; undergraduate: number; master: number; doctoral: number }
  ): number {
    const multiplier = config[level];
    return Math.round(config.base * multiplier);
  }

  /**
   * 初始化写作指导
   */
  private initializeWritingGuidance(): void {
    // 这里可以添加详细的写作指导内容
    // 由于篇幅限制，此处省略具体实现
  }

  /**
   * 文化分析论文模板
   */
  private createCulturalAnalysisTemplate(id: string, level: AcademicLevel): PaperStructureTemplate {
    const wordCounts = this.getWordCountByLevel(level, { base: 8000, undergraduate: 0.6, master: 1.0, doctoral: 2.0 });
    
    return {
      id,
      paperType: 'cultural-analysis',
      academicLevel: level,
      name: `Cultural Analysis Paper - ${level.charAt(0).toUpperCase() + level.slice(1)}`,
      description: 'Template for analyzing cultural phenomena, practices, and representations',
      modules: [
        {
          id: 'intro-cultural',
          type: 'introduction',
          title: 'Introduction',
          description: 'Introduce the cultural phenomenon and research focus',
          isRequired: true,
          order: 1,
          estimatedWordCount: { min: Math.round(wordCounts * 0.12), max: Math.round(wordCounts * 0.15) },
          writingPrompts: [
            'What cultural phenomenon are you analyzing?',
            'Why is this cultural analysis significant?',
            'What theoretical framework will guide your analysis?'
          ],
          guidelines: [
            'Define the cultural phenomenon clearly',
            'Establish the significance of the analysis',
            'Present your analytical framework',
            'Outline your approach to cultural interpretation'
          ],
          dependencies: []
        },
        {
          id: 'cultural-analysis',
          type: 'custom',
          title: 'Cultural Analysis',
          description: 'In-depth analysis of cultural meanings and practices',
          isRequired: true,
          order: 2,
          estimatedWordCount: { min: Math.round(wordCounts * 0.5), max: Math.round(wordCounts * 0.6) },
          writingPrompts: [
            'What cultural meanings are embedded in this phenomenon?',
            'How do power relations manifest in this cultural context?',
            'What contradictions exist within the culture?'
          ],
          guidelines: [
            'Analyze cultural symbols and meanings',
            'Examine power dynamics and relationships',
            'Consider multiple interpretations',
            'Use specific cultural evidence'
          ],
          dependencies: ['intro-cultural']
        },
        {
          id: 'conclusion-cultural',
          type: 'conclusion',
          title: 'Conclusion',
          description: 'Synthesize cultural insights and broader significance',
          isRequired: true,
          order: 3,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What key insights emerge from your cultural analysis?',
            'How does this analysis contribute to cultural understanding?'
          ],
          guidelines: [
            'Synthesize major cultural insights',
            'Reflect on broader cultural significance',
            'Suggest directions for further research'
          ],
          dependencies: ['cultural-analysis']
        },
        {
          id: 'references-cultural',
          type: 'references',
          title: 'References',
          description: 'Citations for cultural sources and theoretical works',
          isRequired: true,
          order: 4,
          estimatedWordCount: { min: 100, max: 400 },
          writingPrompts: ['Have you cited all cultural sources?'],
          guidelines: [
            'Include diverse cultural sources',
            'Use appropriate citation style',
            'Ensure cultural sensitivity in sources'
          ],
          dependencies: []
        }
      ],
      metadata: {
        difficulty: level === 'undergraduate' ? 'intermediate' : 'advanced',
        estimatedTime: level === 'undergraduate' ? 30 : level === 'master' ? 50 : 80,
        tags: ['culture', 'analysis', 'theory', 'society'],
        lastUpdated: new Date(),
        version: '1.0',
        author: 'Paper Template System'
      }
    };
  }

  /**
   * 文献综述模板
   */
  private createLiteratureReviewTemplate(id: string, level: AcademicLevel): PaperStructureTemplate {
    const wordCounts = this.getWordCountByLevel(level, { base: 6000, undergraduate: 0.7, master: 1.2, doctoral: 2.0 });
    
    return {
      id,
      paperType: 'literature-review',
      academicLevel: level,
      name: `Literature Review - ${level.charAt(0).toUpperCase() + level.slice(1)}`,
      description: 'Template for comprehensive review and synthesis of existing research',
      modules: [
        {
          id: 'intro-lit',
          type: 'introduction',
          title: 'Introduction',
          description: 'Define scope and purpose of literature review',
          isRequired: true,
          order: 1,
          estimatedWordCount: { min: Math.round(wordCounts * 0.1), max: Math.round(wordCounts * 0.15) },
          writingPrompts: [
            'What research area are you reviewing?',
            'What is the purpose of your review?'
          ],
          guidelines: [
            'Define the research area clearly',
            'Establish the purpose of the review',
            'Present guiding research questions'
          ],
          dependencies: []
        },
        {
          id: 'thematic-synthesis',
          type: 'custom',
          title: 'Thematic Synthesis',
          description: 'Organize and synthesize literature by themes',
          isRequired: true,
          order: 2,
          estimatedWordCount: { min: Math.round(wordCounts * 0.6), max: Math.round(wordCounts * 0.7) },
          writingPrompts: [
            'What major themes emerge from the literature?',
            'How do different studies address these themes?'
          ],
          guidelines: [
            'Organize literature thematically',
            'Synthesize rather than summarize',
            'Identify patterns and relationships'
          ],
          dependencies: ['intro-lit']
        },
        {
          id: 'conclusion-lit',
          type: 'conclusion',
          title: 'Conclusion',
          description: 'Summarize findings and suggest future directions',
          isRequired: true,
          order: 3,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What are the key findings from your review?',
            'What directions should future research take?'
          ],
          guidelines: [
            'Synthesize major findings',
            'Propose research directions',
            'Highlight contribution of review'
          ],
          dependencies: ['thematic-synthesis']
        },
        {
          id: 'references-lit',
          type: 'references',
          title: 'References',
          description: 'Comprehensive list of reviewed literature',
          isRequired: true,
          order: 4,
          estimatedWordCount: { min: 200, max: 800 },
          writingPrompts: ['Have you included all reviewed sources?'],
          guidelines: [
            'Include all sources discussed',
            'Use consistent citation format',
            'Ensure accuracy of citations'
          ],
          dependencies: []
        }
      ],
      metadata: {
        difficulty: level === 'undergraduate' ? 'intermediate' : 'advanced',
        estimatedTime: level === 'undergraduate' ? 25 : level === 'master' ? 45 : 75,
        tags: ['literature', 'review', 'synthesis', 'research'],
        lastUpdated: new Date(),
        version: '1.0',
        author: 'Paper Template System'
      }
    };
  }

  /**
   * 批判性评述模板
   */
  private createCriticalReviewTemplate(id: string, level: AcademicLevel): PaperStructureTemplate {
    const wordCounts = this.getWordCountByLevel(level, { base: 4000, undergraduate: 0.8, master: 1.0, doctoral: 1.5 });
    
    return {
      id,
      paperType: 'critical-review',
      academicLevel: level,
      name: `Critical Review - ${level.charAt(0).toUpperCase() + level.slice(1)}`,
      description: 'Template for critical evaluation of works or theories',
      modules: [
        {
          id: 'intro-critical',
          type: 'introduction',
          title: 'Introduction',
          description: 'Introduce work being reviewed and evaluative stance',
          isRequired: true,
          order: 1,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What work are you reviewing?',
            'What is your evaluative thesis?'
          ],
          guidelines: [
            'Identify the work being reviewed',
            'Present your critical thesis',
            'Establish evaluation criteria'
          ],
          dependencies: []
        },
        {
          id: 'critical-evaluation',
          type: 'custom',
          title: 'Critical Evaluation',
          description: 'Detailed assessment of strengths and weaknesses',
          isRequired: true,
          order: 2,
          estimatedWordCount: { min: Math.round(wordCounts * 0.5), max: Math.round(wordCounts * 0.6) },
          writingPrompts: [
            'What are the major strengths?',
            'What weaknesses do you identify?'
          ],
          guidelines: [
            'Provide balanced assessment',
            'Support evaluations with evidence',
            'Address both strengths and weaknesses'
          ],
          dependencies: ['intro-critical']
        },
        {
          id: 'conclusion-critical',
          type: 'conclusion',
          title: 'Conclusion',
          description: 'Overall assessment and recommendation',
          isRequired: true,
          order: 3,
          estimatedWordCount: { min: Math.round(wordCounts * 0.2), max: Math.round(wordCounts * 0.25) },
          writingPrompts: [
            'What is your overall assessment?',
            'Would you recommend this work?'
          ],
          guidelines: [
            'Provide clear overall judgment',
            'Make specific recommendations',
            'Justify final assessment'
          ],
          dependencies: ['critical-evaluation']
        },
        {
          id: 'references-critical',
          type: 'references',
          title: 'References',
          description: 'Citations for reviewed work and sources',
          isRequired: true,
          order: 4,
          estimatedWordCount: { min: 50, max: 200 },
          writingPrompts: ['Have you cited all sources?'],
          guidelines: [
            'Include complete citation for reviewed work',
            'Use appropriate citation style'
          ],
          dependencies: []
        }
      ],
      metadata: {
        difficulty: level === 'undergraduate' ? 'intermediate' : 'advanced',
        estimatedTime: level === 'undergraduate' ? 15 : level === 'master' ? 25 : 40,
        tags: ['critical', 'evaluation', 'assessment', 'review'],
        lastUpdated: new Date(),
        version: '1.0',
        author: 'Paper Template System'
      }
    };
  }

  /**
   * 实证研究模板
   */
  private createEmpiricalResearchTemplate(id: string, level: AcademicLevel): PaperStructureTemplate {
    const wordCounts = this.getWordCountByLevel(level, { base: 10000, undergraduate: 0.6, master: 1.0, doctoral: 1.8 });
    
    return {
      id,
      paperType: 'empirical-research',
      academicLevel: level,
      name: `Empirical Research Paper - ${level.charAt(0).toUpperCase() + level.slice(1)}`,
      description: 'Template for original research based on empirical evidence',
      modules: [
        {
          id: 'intro-empirical',
          type: 'introduction',
          title: 'Introduction',
          description: 'Introduce research problem and questions',
          isRequired: true,
          order: 1,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What is your research problem?',
            'What are your research questions?'
          ],
          guidelines: [
            'Establish research problem clearly',
            'Present specific research questions',
            'Justify significance of research'
          ],
          dependencies: []
        },
        {
          id: 'methodology-empirical',
          type: 'methodology',
          title: 'Methodology',
          description: 'Research design and procedures',
          isRequired: true,
          order: 2,
          estimatedWordCount: { min: Math.round(wordCounts * 0.2), max: Math.round(wordCounts * 0.25) },
          writingPrompts: [
            'What research design did you use?',
            'What procedures did you follow?'
          ],
          guidelines: [
            'Describe research design and rationale',
            'Explain data collection procedures',
            'Detail analysis methods'
          ],
          dependencies: ['intro-empirical']
        },
        {
          id: 'results-empirical',
          type: 'results',
          title: 'Results',
          description: 'Presentation of research findings',
          isRequired: true,
          order: 3,
          estimatedWordCount: { min: Math.round(wordCounts * 0.25), max: Math.round(wordCounts * 0.3) },
          writingPrompts: [
            'What did you find in your analysis?',
            'What patterns emerged?'
          ],
          guidelines: [
            'Present findings objectively',
            'Use appropriate statistical measures',
            'Include relevant visualizations'
          ],
          dependencies: ['methodology-empirical']
        },
        {
          id: 'discussion-empirical',
          type: 'discussion',
          title: 'Discussion',
          description: 'Interpretation and implications',
          isRequired: true,
          order: 4,
          estimatedWordCount: { min: Math.round(wordCounts * 0.2), max: Math.round(wordCounts * 0.25) },
          writingPrompts: [
            'What do your results mean?',
            'What are the implications?'
          ],
          guidelines: [
            'Interpret results in context',
            'Discuss implications',
            'Address limitations'
          ],
          dependencies: ['results-empirical']
        },
        {
          id: 'references-empirical',
          type: 'references',
          title: 'References',
          description: 'Citations for all sources',
          isRequired: true,
          order: 5,
          estimatedWordCount: { min: 200, max: 600 },
          writingPrompts: ['Have you cited all sources?'],
          guidelines: [
            'Include all cited sources',
            'Use appropriate citation style'
          ],
          dependencies: []
        }
      ],
      metadata: {
        difficulty: 'advanced',
        estimatedTime: level === 'undergraduate' ? 40 : level === 'master' ? 60 : 100,
        tags: ['empirical', 'research', 'data', 'methodology'],
        lastUpdated: new Date(),
        version: '1.0',
        author: 'Paper Template System'
      }
    };
  }

  /**
   * 案例研究模板
   */
  private createCaseStudyTemplate(id: string, level: AcademicLevel): PaperStructureTemplate {
    const wordCounts = this.getWordCountByLevel(level, { base: 8000, undergraduate: 0.6, master: 1.0, doctoral: 1.5 });
    
    return {
      id,
      paperType: 'case-study',
      academicLevel: level,
      name: `Case Study Paper - ${level.charAt(0).toUpperCase() + level.slice(1)}`,
      description: 'Template for in-depth analysis of specific cases',
      modules: [
        {
          id: 'intro-case',
          type: 'introduction',
          title: 'Introduction',
          description: 'Introduce the case and analysis purpose',
          isRequired: true,
          order: 1,
          estimatedWordCount: { min: Math.round(wordCounts * 0.1), max: Math.round(wordCounts * 0.15) },
          writingPrompts: [
            'What case are you studying?',
            'Why is this case significant?'
          ],
          guidelines: [
            'Clearly identify the case',
            'Establish significance',
            'Present research questions'
          ],
          dependencies: []
        },
        {
          id: 'case-analysis',
          type: 'custom',
          title: 'Case Analysis',
          description: 'Detailed analysis of the case',
          isRequired: true,
          order: 2,
          estimatedWordCount: { min: Math.round(wordCounts * 0.6), max: Math.round(wordCounts * 0.7) },
          writingPrompts: [
            'What key issues emerge?',
            'How do factors interact?'
          ],
          guidelines: [
            'Apply framework systematically',
            'Use specific case evidence',
            'Maintain objectivity'
          ],
          dependencies: ['intro-case']
        },
        {
          id: 'conclusion-case',
          type: 'conclusion',
          title: 'Conclusion',
          description: 'Synthesize insights and significance',
          isRequired: true,
          order: 3,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What insights emerge?',
            'What is the broader significance?'
          ],
          guidelines: [
            'Synthesize main insights',
            'Reflect on contribution',
            'Suggest further research'
          ],
          dependencies: ['case-analysis']
        },
        {
          id: 'references-case',
          type: 'references',
          title: 'References',
          description: 'Citations for case materials and sources',
          isRequired: true,
          order: 4,
          estimatedWordCount: { min: 100, max: 300 },
          writingPrompts: ['Have you cited all sources?'],
          guidelines: [
            'Include case materials',
            'Use appropriate citation style'
          ],
          dependencies: []
        }
      ],
      metadata: {
        difficulty: level === 'undergraduate' ? 'intermediate' : 'advanced',
        estimatedTime: level === 'undergraduate' ? 30 : level === 'master' ? 45 : 65,
        tags: ['case-study', 'analysis', 'practical'],
        lastUpdated: new Date(),
        version: '1.0',
        author: 'Paper Template System'
      }
    };
  }

  /**
   * 话语分析模板
   */
  private createDiscourseAnalysisTemplate(id: string, level: AcademicLevel): PaperStructureTemplate {
    const wordCounts = this.getWordCountByLevel(level, { base: 10000, undergraduate: 0.6, master: 1.0, doctoral: 1.8 });
    
    return {
      id,
      paperType: 'discourse-analysis',
      academicLevel: level,
      name: `Discourse Analysis Paper - ${level.charAt(0).toUpperCase() + level.slice(1)}`,
      description: 'Template for analyzing language use in social contexts',
      modules: [
        {
          id: 'intro-discourse',
          type: 'introduction',
          title: 'Introduction',
          description: 'Introduce discourse phenomenon and approach',
          isRequired: true,
          order: 1,
          estimatedWordCount: { min: Math.round(wordCounts * 0.1), max: Math.round(wordCounts * 0.15) },
          writingPrompts: [
            'What discourse are you analyzing?',
            'Why is this discourse significant?'
          ],
          guidelines: [
            'Define the discourse clearly',
            'Establish significance',
            'Introduce theoretical framework'
          ],
          dependencies: []
        },
        {
          id: 'discourse-analysis-detailed',
          type: 'custom',
          title: 'Discourse Analysis',
          description: 'Systematic analysis of linguistic features',
          isRequired: true,
          order: 2,
          estimatedWordCount: { min: Math.round(wordCounts * 0.6), max: Math.round(wordCounts * 0.7) },
          writingPrompts: [
            'What linguistic patterns do you observe?',
            'What discursive strategies are used?'
          ],
          guidelines: [
            'Analyze linguistic features systematically',
            'Identify discursive strategies',
            'Use specific examples from corpus'
          ],
          dependencies: ['intro-discourse']
        },
        {
          id: 'conclusion-discourse',
          type: 'conclusion',
          title: 'Conclusion',
          description: 'Synthesize insights about discourse functions',
          isRequired: true,
          order: 3,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What key insights emerge?',
            'What social functions does discourse serve?'
          ],
          guidelines: [
            'Synthesize key findings',
            'Discuss social significance',
            'Suggest further research'
          ],
          dependencies: ['discourse-analysis-detailed']
        },
        {
          id: 'references-discourse',
          type: 'references',
          title: 'References',
          description: 'Citations for materials and sources',
          isRequired: true,
          order: 4,
          estimatedWordCount: { min: 150, max: 400 },
          writingPrompts: ['Have you cited all sources?'],
          guidelines: [
            'Include discourse materials',
            'Cite theoretical sources'
          ],
          dependencies: []
        }
      ],
      metadata: {
        difficulty: 'advanced',
        estimatedTime: level === 'undergraduate' ? 40 : level === 'master' ? 60 : 90,
        tags: ['discourse', 'language', 'power', 'society'],
        lastUpdated: new Date(),
        version: '1.0',
        author: 'Paper Template System'
      }
    };
  }

  /**
   * 理论探讨模板
   */
  private createTheoreticalDiscussionTemplate(id: string, level: AcademicLevel): PaperStructureTemplate {
    const wordCounts = this.getWordCountByLevel(level, { base: 15000, undergraduate: 0.5, master: 0.8, doctoral: 1.2 });
    
    return {
      id,
      paperType: 'theoretical-discussion',
      academicLevel: level,
      name: `Theoretical Discussion Paper - ${level.charAt(0).toUpperCase() + level.slice(1)}`,
      description: 'Template for exploring theoretical concepts and frameworks',
      modules: [
        {
          id: 'intro-theoretical',
          type: 'introduction',
          title: 'Introduction',
          description: 'Introduce theoretical question being explored',
          isRequired: true,
          order: 1,
          estimatedWordCount: { min: Math.round(wordCounts * 0.1), max: Math.round(wordCounts * 0.15) },
          writingPrompts: [
            'What theoretical question are you exploring?',
            'Why is this exploration important?'
          ],
          guidelines: [
            'Define theoretical focus clearly',
            'Establish importance',
            'Present guiding questions'
          ],
          dependencies: []
        },
        {
          id: 'theoretical-analysis',
          type: 'custom',
          title: 'Theoretical Analysis',
          description: 'Detailed exploration of theoretical concepts',
          isRequired: true,
          order: 2,
          estimatedWordCount: { min: Math.round(wordCounts * 0.6), max: Math.round(wordCounts * 0.7) },
          writingPrompts: [
            'How do you analyze these concepts?',
            'What insights can you offer?'
          ],
          guidelines: [
            'Engage deeply with concepts',
            'Offer original analysis',
            'Compare different perspectives'
          ],
          dependencies: ['intro-theoretical']
        },
        {
          id: 'conclusion-theoretical',
          type: 'conclusion',
          title: 'Conclusion',
          description: 'Synthesize theoretical insights',
          isRequired: true,
          order: 3,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What theoretical insights emerge?',
            'How do you contribute to understanding?'
          ],
          guidelines: [
            'Synthesize main insights',
            'Reflect on contributions',
            'Suggest theoretical directions'
          ],
          dependencies: ['theoretical-analysis']
        },
        {
          id: 'references-theoretical',
          type: 'references',
          title: 'References',
          description: 'Citations for theoretical works',
          isRequired: true,
          order: 4,
          estimatedWordCount: { min: 200, max: 600 },
          writingPrompts: ['Have you cited all theoretical sources?'],
          guidelines: [
            'Include comprehensive theoretical sources',
            'Use appropriate citation style'
          ],
          dependencies: []
        }
      ],
      metadata: {
        difficulty: 'advanced',
        estimatedTime: level === 'undergraduate' ? 50 : level === 'master' ? 70 : 100,
        tags: ['theory', 'philosophy', 'concepts', 'abstract'],
        lastUpdated: new Date(),
        version: '1.0',
        author: 'Paper Template System'
      }
    };
  }

  /**
   * 学位论文模板
   */
  private createDissertationTemplate(id: string, level: AcademicLevel): PaperStructureTemplate {
    const wordCounts = this.getWordCountByLevel(level, { base: 40000, undergraduate: 0.2, master: 0.6, doctoral: 1.0 });
    
    return {
      id,
      paperType: 'dissertation-thesis',
      academicLevel: level,
      name: `${level === 'doctoral' ? 'Dissertation' : level === 'master' ? 'Master\'s Thesis' : 'Honors Thesis'}`,
      description: 'Template for comprehensive academic work',
      modules: [
        {
          id: 'intro-dissertation',
          type: 'introduction',
          title: 'Introduction',
          description: 'Comprehensive introduction to research',
          isRequired: true,
          order: 1,
          estimatedWordCount: { min: Math.round(wordCounts * 0.1), max: Math.round(wordCounts * 0.15) },
          writingPrompts: [
            'What is your research problem?',
            'Why is it important?'
          ],
          guidelines: [
            'Establish research problem',
            'Justify significance',
            'Present research questions'
          ],
          dependencies: []
        },
        {
          id: 'lit-review-dissertation',
          type: 'literature-review',
          title: 'Literature Review',
          description: 'Comprehensive review of relevant literature',
          isRequired: true,
          order: 2,
          estimatedWordCount: { min: Math.round(wordCounts * 0.25), max: Math.round(wordCounts * 0.3) },
          writingPrompts: [
            'What does existing research tell us?',
            'What gaps exist?'
          ],
          guidelines: [
            'Provide comprehensive review',
            'Identify research gaps',
            'Establish theoretical framework'
          ],
          dependencies: ['intro-dissertation']
        },
        {
          id: 'methodology-dissertation',
          type: 'methodology',
          title: 'Methodology',
          description: 'Detailed research design and methods',
          isRequired: true,
          order: 3,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What research design did you use?',
            'How did you collect data?'
          ],
          guidelines: [
            'Justify research design',
            'Explain methods in detail',
            'Address ethical considerations'
          ],
          dependencies: ['lit-review-dissertation']
        },
        {
          id: 'findings-dissertation',
          type: 'results',
          title: 'Findings',
          description: 'Comprehensive presentation of results',
          isRequired: true,
          order: 4,
          estimatedWordCount: { min: Math.round(wordCounts * 0.25), max: Math.round(wordCounts * 0.3) },
          writingPrompts: [
            'What did your research reveal?',
            'How do findings relate to questions?'
          ],
          guidelines: [
            'Present findings systematically',
            'Use appropriate visualizations',
            'Address all research questions'
          ],
          dependencies: ['methodology-dissertation']
        },
        {
          id: 'discussion-dissertation',
          type: 'discussion',
          title: 'Discussion',
          description: 'Interpretation and implications',
          isRequired: true,
          order: 5,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What do findings mean?',
            'What are the implications?'
          ],
          guidelines: [
            'Interpret in context of literature',
            'Discuss implications',
            'Address limitations'
          ],
          dependencies: ['findings-dissertation']
        },
        {
          id: 'references-dissertation',
          type: 'references',
          title: 'References',
          description: 'Comprehensive bibliography',
          isRequired: true,
          order: 6,
          estimatedWordCount: { min: 500, max: 2000 },
          writingPrompts: ['Have you included all sources?'],
          guidelines: [
            'Include all cited sources',
            'Use consistent style',
            'Ensure accuracy'
          ],
          dependencies: []
        }
      ],
      metadata: {
        difficulty: 'advanced',
        estimatedTime: level === 'undergraduate' ? 200 : level === 'master' ? 400 : 800,
        tags: ['dissertation', 'thesis', 'comprehensive', 'research'],
        lastUpdated: new Date(),
        version: '1.0',
        author: 'Paper Template System'
      }
    };
  }

  /**
   * 初始化写作指导 - 扩展实现
   */
  private initializeWritingGuidance(): void {
    // 为每种论文类型和学术层次创建写作指导
    const paperTypes: EnglishPaperType[] = [
      'literary-analysis', 'comparative-analysis', 'cultural-analysis',
      'literature-review', 'critical-review', 'empirical-research',
      'case-study', 'discourse-analysis', 'theoretical-discussion',
      'dissertation-thesis'
    ];

    const academicLevels: AcademicLevel[] = ['undergraduate', 'master', 'doctoral'];

    paperTypes.forEach(paperType => {
      academicLevels.forEach(level => {
        const guidance = this.createWritingGuidanceForType(paperType, level);
        this.guidanceMap.set(`${paperType}-${level}`, guidance);
      });
    });
  }

  /**
   * 创建特定类型的写作指导
   */
  private createWritingGuidanceForType(paperType: EnglishPaperType, level: AcademicLevel): WritingGuidance {
    // 基础写作指导结构
    const baseGuidance = {
      overview: `Guidelines for writing a ${paperType.replace('-', ' ')} paper at ${level} level`,
      structure: this.getStructureGuidance(paperType),
      writingTips: this.getWritingTips(paperType, level),
      commonMistakes: this.getCommonMistakes(paperType, level),
      examples: this.getExamples(paperType, level)
    };

    return {
      paperType,
      academicLevel: level,
      moduleType: 'introduction', // 默认模块类型
      guidance: baseGuidance
    };
  }

  /**
   * 获取结构指导
   */
  private getStructureGuidance(paperType: EnglishPaperType): string[] {
    const structureMap: Record<EnglishPaperType, string[]> = {
      'literary-analysis': [
        'Start with engaging introduction and clear thesis',
        'Organize analysis around key literary elements',
        'Use textual evidence to support interpretations',
        'Conclude with synthesis of insights'
      ],
      'comparative-analysis': [
        'Establish clear basis for comparison',
        'Use point-by-point or block comparison structure',
        'Maintain balance between subjects',
        'Draw meaningful conclusions from comparisons'
      ],
      'cultural-analysis': [
        'Provide cultural context and background',
        'Apply theoretical framework consistently',
        'Analyze multiple dimensions of culture',
        'Consider power relations and social dynamics'
      ],
      'literature-review': [
        'Organize thematically rather than chronologically',
        'Synthesize rather than merely summarize',
        'Identify patterns and gaps in research',
        'Conclude with research implications'
      ],
      'critical-review': [
        'Provide objective summary first',
        'Present balanced critical evaluation',
        'Support judgments with specific evidence',
        'Conclude with clear recommendation'
      ],
      'empirical-research': [
        'Follow standard scientific structure (IMRAD)',
        'Clearly state research questions/hypotheses',
        'Detail methodology for replication',
        'Present results objectively before interpretation'
      ],
      'case-study': [
        'Provide comprehensive case background',
        'Apply analytical framework systematically',
        'Use specific case evidence throughout',
        'Extract generalizable lessons'
      ],
      'discourse-analysis': [
        'Establish theoretical framework clearly',
        'Describe data corpus and selection criteria',
        'Analyze linguistic features systematically',
        'Connect findings to broader social context'
      ],
      'theoretical-discussion': [
        'Begin with clear theoretical focus',
        'Trace historical development of concepts',
        'Engage critically with different perspectives',
        'Contribute original theoretical insights'
      ],
      'dissertation-thesis': [
        'Provide comprehensive literature review',
        'Justify methodology thoroughly',
        'Present findings systematically',
        'Discuss implications and limitations fully'
      ]
    };

    return structureMap[paperType] || ['Follow standard academic paper structure'];
  }

  /**
   * 获取写作技巧
   */
  private getWritingTips(paperType: EnglishPaperType, level: AcademicLevel): string[] {
    const baseTips = [
      'Use clear, concise academic language',
      'Support all claims with evidence',
      'Maintain consistent citation style',
      'Proofread carefully for grammar and clarity'
    ];

    const levelSpecificTips: Record<AcademicLevel, string[]> = {
      undergraduate: [
        'Focus on clear argument development',
        'Use reliable academic sources',
        'Avoid overgeneralization'
      ],
      master: [
        'Engage with current scholarly debates',
        'Demonstrate critical thinking skills',
        'Show methodological awareness'
      ],
      doctoral: [
        'Contribute original insights to field',
        'Engage with theoretical complexity',
        'Demonstrate scholarly independence'
      ]
    };

    return [...baseTips, ...levelSpecificTips[level]];
  }

  /**
   * 获取常见错误
   */
  private getCommonMistakes(paperType: EnglishPaperType, level: AcademicLevel): string[] {
    const commonMistakes: Record<EnglishPaperType, string[]> = {
      'literary-analysis': [
        'Summarizing plot instead of analyzing',
        'Making claims without textual evidence',
        'Ignoring literary context and background'
      ],
      'comparative-analysis': [
        'Comparing superficial similarities only',
        'Lacking clear comparative framework',
        'Unbalanced treatment of subjects'
      ],
      'cultural-analysis': [
        'Oversimplifying complex cultural phenomena',
        'Ignoring power dynamics and context',
        'Applying Western-centric perspectives inappropriately'
      ],
      'literature-review': [
        'Simply summarizing sources without synthesis',
        'Lacking thematic organization',
        'Failing to identify research gaps'
      ],
      'critical-review': [
        'Being too harsh or too lenient in evaluation',
        'Lacking specific evidence for claims',
        'Confusing summary with critical analysis'
      ],
      'empirical-research': [
        'Insufficient sample sizes',
        'Confusing correlation with causation',
        'Overgeneralizing from limited data'
      ],
      'case-study': [
        'Insufficient case context and background',
        'Lack of theoretical framework',
        'Overgeneralizing from single case'
      ],
      'discourse-analysis': [
        'Insufficient theoretical grounding',
        'Cherry-picking examples',
        'Ignoring social and political context'
      ],
      'theoretical-discussion': [
        'Lack of original contribution',
        'Insufficient engagement with existing theory',
        'Abstract discussion without concrete examples'
      ],
      'dissertation-thesis': [
        'Insufficient literature review scope',
        'Methodological weaknesses',
        'Conclusions not supported by findings'
      ]
    };

    return commonMistakes[paperType] || ['Follow basic academic writing principles'];
  }

  /**
   * 获取示例
   */
  private getExamples(paperType: EnglishPaperType, level: AcademicLevel): WritingExample[] {
    // 返回基础示例结构
    return [
      {
        title: `Sample ${paperType} opening`,
        content: `Example of effective opening for ${paperType} at ${level} level...`,
        annotation: 'Notice the clear thesis statement and engaging hook',
        quality: 'good'
      }
    ];
  }
}

/**
 * 导出默认的模板服务实例
 */
export const paperTemplateService = new PaperTemplateService();

/**
 * 模板工具函数
 */
export class TemplateUtils {
  /**
   * 根据字数要求调整模板
   */
  static adjustTemplateForWordCount(
    template: PaperStructureTemplate, 
    targetWordCount: number
  ): PaperStructureTemplate {
    const currentTotal = template.modules.reduce(
      (sum, module) => sum + module.estimatedWordCount.max, 
      0
    );
    const ratio = targetWordCount / currentTotal;

    return {
      ...template,
      modules: template.modules.map(module => ({
        ...module,
        estimatedWordCount: {
          min: Math.round(module.estimatedWordCount.min * ratio),
          max: Math.round(module.estimatedWordCount.max * ratio)
        }
      }))
    };
  }

  /**
   * 验证模板结构的完整性
   */
  static validateTemplate(template: PaperStructureTemplate): { 
    isValid: boolean; 
    issues: string[] 
  } {
    const issues: string[] = [];

    // 检查必需模块
    const hasIntroduction = template.modules.some(m => m.type === 'introduction');
    if (!hasIntroduction) {
      issues.push('模板缺少引言模块');
    }

    const hasConclusion = template.modules.some(m => m.type === 'conclusion');
    if (!hasConclusion) {
      issues.push('模板缺少结论模块');
    }

    // 检查模块顺序
    const orders = template.modules.map(m => m.order);
    const sortedOrders = [...orders].sort((a, b) => a - b);
    if (JSON.stringify(orders) !== JSON.stringify(sortedOrders)) {
      issues.push('模块顺序不正确');
    }

    // 检查依赖关系
    template.modules.forEach(module => {
      module.dependencies.forEach(depId => {
        const depExists = template.modules.some(m => m.id === depId);
        if (!depExists) {
          issues.push(`模块 ${module.id} 依赖的模块 ${depId} 不存在`);
        }
      });
    });

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * 生成模板使用统计
   */
  static generateTemplateStats(template: PaperStructureTemplate): {
    totalModules: number;
    requiredModules: number;
    optionalModules: number;
    estimatedWordCount: { min: number; max: number };
    complexity: 'simple' | 'moderate' | 'complex';
  } {
    const totalModules = template.modules.length;
    const requiredModules = template.modules.filter(m => m.isRequired).length;
    const optionalModules = totalModules - requiredModules;
    
    const wordCount = template.modules.reduce(
      (acc, module) => ({
        min: acc.min + module.estimatedWordCount.min,
        max: acc.max + module.estimatedWordCount.max
      }),
      { min: 0, max: 0 }
    );

    const complexity = totalModules <= 4 ? 'simple' : 
                      totalModules <= 7 ? 'moderate' : 'complex';

    return {
      totalModules,
      requiredModules,
      optionalModules,
      estimatedWordCount: wordCount,
      complexity
    };
  }
}