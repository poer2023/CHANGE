import { 
  EnglishPaperType, 
  AcademicLevel, 
  PaperStructureTemplate,
  PaperModuleTemplate,
  SubSectionTemplate,
  TemplateMetadata 
} from '@/types/paper-types';
import { ModuleType, PaperModule } from '@/types/modular';

// 基础模块类型映射
const MODULE_TYPE_MAPPING: Record<string, ModuleType> = {
  'abstract': 'abstract',
  'introduction': 'introduction',
  'literature-review': 'literature-review',
  'methodology': 'methodology',
  'results': 'results',
  'discussion': 'discussion',
  'conclusion': 'conclusion',
  'references': 'references',
  'appendix': 'appendix',
  'custom': 'custom'
};

export class ModuleStructureGenerator {
  /**
   * 根据论文类型和学术层次生成动态模块结构
   */
  generateStructure(
    paperType: EnglishPaperType,
    academicLevel: AcademicLevel,
    customOptions?: {
      targetWordCount?: number;
      citationStyle?: string;
      includeOptionalSections?: boolean;
      specializationArea?: string;
    }
  ): PaperStructureTemplate {
    const template = this.getBaseTemplate(paperType, academicLevel);
    
    // 根据选项调整结构
    if (customOptions) {
      this.adjustTemplateStructure(template, customOptions);
    }

    return template;
  }

  /**
   * 获取基础模板结构
   */
  private getBaseTemplate(
    paperType: EnglishPaperType,
    academicLevel: AcademicLevel
  ): PaperStructureTemplate {
    const templateId = `${paperType}-${academicLevel}`;
    
    const baseMetadata: TemplateMetadata = {
      difficulty: this.getDifficultyLevel(paperType, academicLevel),
      estimatedTime: this.getEstimatedTime(paperType, academicLevel),
      tags: this.getTemplateTags(paperType, academicLevel),
      lastUpdated: new Date(),
      version: '1.0.0',
      author: 'AI Paper Writing System'
    };

    switch (paperType) {
      case 'literary-analysis':
        return this.generateLiteraryAnalysisTemplate(templateId, academicLevel, baseMetadata);
      
      case 'comparative-analysis':
        return this.generateComparativeAnalysisTemplate(templateId, academicLevel, baseMetadata);
      
      case 'cultural-analysis':
        return this.generateCulturalAnalysisTemplate(templateId, academicLevel, baseMetadata);
      
      case 'literature-review':
        return this.generateLiteratureReviewTemplate(templateId, academicLevel, baseMetadata);
      
      case 'critical-review':
        return this.generateCriticalReviewTemplate(templateId, academicLevel, baseMetadata);
      
      case 'empirical-research':
        return this.generateEmpiricalResearchTemplate(templateId, academicLevel, baseMetadata);
      
      case 'case-study':
        return this.generateCaseStudyTemplate(templateId, academicLevel, baseMetadata);
      
      case 'discourse-analysis':
        return this.generateDiscourseAnalysisTemplate(templateId, academicLevel, baseMetadata);
      
      case 'theoretical-discussion':
        return this.generateTheoreticalDiscussionTemplate(templateId, academicLevel, baseMetadata);
      
      case 'dissertation-thesis':
        return this.generateDissertationTemplate(templateId, academicLevel, baseMetadata);
      
      default:
        return this.generateDefaultTemplate(templateId, academicLevel, baseMetadata);
    }
  }

  /**
   * 文学分析论文模板
   */
  private generateLiteraryAnalysisTemplate(
    id: string,
    level: AcademicLevel,
    metadata: TemplateMetadata
  ): PaperStructureTemplate {
    const modules: PaperModuleTemplate[] = [
      {
        id: 'intro',
        type: 'introduction',
        title: 'Introduction',
        description: 'Introduce the literary work and establish your thesis',
        isRequired: true,
        order: 1,
        estimatedWordCount: level === 'undergraduate' ? { min: 200, max: 400 } : { min: 400, max: 800 },
        writingPrompts: [
          'Introduce the author and literary work',
          'Provide brief context about the work',
          'Present your thesis statement clearly',
          'Outline your analytical approach'
        ],
        guidelines: [
          'Hook the reader with an engaging opening',
          'Provide necessary background information',
          'End with a clear, debatable thesis statement',
          'Avoid plot summary in the introduction'
        ],
        dependencies: [],
        subSections: [
          {
            id: 'context',
            title: 'Literary Context',
            description: 'Historical and literary background',
            isRequired: level !== 'undergraduate',
            order: 1,
            writingPrompts: ['What historical context is relevant?', 'How does this work fit into the literary tradition?']
          },
          {
            id: 'thesis',
            title: 'Thesis Statement',
            description: 'Central argument of your analysis',
            isRequired: true,
            order: 2,
            writingPrompts: ['What is your main argument about the text?', 'How will you support this argument?']
          }
        ]
      },
      {
        id: 'analysis1',
        type: 'custom',
        title: 'First Analytical Point',
        description: 'Develop your first major analytical argument',
        isRequired: true,
        order: 2,
        estimatedWordCount: level === 'undergraduate' ? { min: 300, max: 600 } : { min: 600, max: 1200 },
        writingPrompts: [
          'What is your first major point?',
          'What textual evidence supports this point?',
          'How does this evidence support your thesis?',
          'What literary techniques are at work here?'
        ],
        guidelines: [
          'Start with a clear topic sentence',
          'Provide specific textual evidence',
          'Analyze the evidence thoroughly',
          'Connect back to your thesis'
        ],
        dependencies: ['intro']
      },
      {
        id: 'analysis2',
        type: 'custom',
        title: 'Second Analytical Point',
        description: 'Develop your second major analytical argument',
        isRequired: true,
        order: 3,
        estimatedWordCount: level === 'undergraduate' ? { min: 300, max: 600 } : { min: 600, max: 1200 },
        writingPrompts: [
          'What is your second major point?',
          'How does this point relate to your first point?',
          'What new evidence can you present?',
          'How does this deepen your analysis?'
        ],
        guidelines: [
          'Build upon your previous analysis',
          'Introduce new textual evidence',
          'Show progression in your argument',
          'Maintain focus on your thesis'
        ],
        dependencies: ['analysis1']
      }
    ];

    // 高级学术层次添加更多分析点
    if (level !== 'undergraduate') {
      modules.push({
        id: 'analysis3',
        type: 'custom',
        title: 'Third Analytical Point',
        description: 'Develop your third major analytical argument',
        isRequired: false,
        order: 4,
        estimatedWordCount: { min: 600, max: 1200 },
        writingPrompts: [
          'What additional complexity can you explore?',
          'How do multiple interpretations interact?',
          'What broader implications emerge?'
        ],
        guidelines: [
          'Explore nuanced interpretations',
          'Consider alternative viewpoints',
          'Demonstrate sophisticated analysis'
        ],
        dependencies: ['analysis2']
      });
    }

    // 添加结论
    modules.push({
      id: 'conclusion',
      type: 'conclusion',
      title: 'Conclusion',
      description: 'Synthesize your analysis and reflect on broader implications',
      isRequired: true,
      order: modules.length + 1,
      estimatedWordCount: level === 'undergraduate' ? { min: 150, max: 300 } : { min: 300, max: 600 },
      writingPrompts: [
        'How do your analytical points work together?',
        'What new understanding of the text emerges?',
        'What are the broader implications of your analysis?',
        'What questions remain for future consideration?'
      ],
      guidelines: [
        'Synthesize rather than merely summarize',
        'Reflect on the significance of your findings',
        'Consider broader literary or cultural implications',
        'End with a thought-provoking insight'
      ],
      dependencies: modules.map(m => m.id)
    });

    // 添加参考文献
    modules.push({
      id: 'references',
      type: 'references',
      title: 'Works Cited / References',
      description: 'List all sources used in your analysis',
      isRequired: true,
      order: modules.length + 1,
      estimatedWordCount: { min: 50, max: 200 },
      writingPrompts: [
        'Include all primary and secondary sources',
        'Follow appropriate citation format (MLA, Chicago, etc.)',
        'Ensure all in-text citations have corresponding entries'
      ],
      guidelines: [
        'Use appropriate citation style',
        'Include page numbers for literary works',
        'Double-check formatting consistency'
      ],
      dependencies: []
    });

    return {
      id,
      paperType: 'literary-analysis',
      academicLevel: level,
      name: `Literary Analysis Paper - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
      description: 'A structured template for analyzing literary works with close reading and textual evidence',
      modules,
      metadata
    };
  }

  /**
   * 比较分析论文模板
   */
  private generateComparativeAnalysisTemplate(
    id: string,
    level: AcademicLevel,
    metadata: TemplateMetadata
  ): PaperStructureTemplate {
    const modules: PaperModuleTemplate[] = [
      {
        id: 'intro',
        type: 'introduction',
        title: 'Introduction',
        description: 'Introduce the subjects being compared and your comparative thesis',
        isRequired: true,
        order: 1,
        estimatedWordCount: level === 'undergraduate' ? { min: 250, max: 450 } : { min: 450, max: 900 },
        writingPrompts: [
          'What subjects are you comparing?',
          'Why is this comparison meaningful?',
          'What is your comparative thesis?',
          'How will you structure your comparison?'
        ],
        guidelines: [
          'Introduce both subjects clearly',
          'Establish the basis for comparison',
          'Present a clear comparative thesis',
          'Preview your analytical framework'
        ],
        dependencies: []
      },
      {
        id: 'background',
        type: 'custom',
        title: 'Background Information',
        description: 'Provide necessary context for both subjects',
        isRequired: level !== 'undergraduate',
        order: 2,
        estimatedWordCount: { min: 400, max: 800 },
        writingPrompts: [
          'What background information is essential?',
          'How do the contexts of your subjects differ?',
          'What historical or cultural factors are relevant?'
        ],
        guidelines: [
          'Provide balanced coverage of both subjects',
          'Focus on information relevant to your comparison',
          'Establish clear criteria for comparison'
        ],
        dependencies: ['intro']
      },
      {
        id: 'comparison1',
        type: 'custom',
        title: 'First Point of Comparison',
        description: 'Analyze your first comparative criterion',
        isRequired: true,
        order: 3,
        estimatedWordCount: level === 'undergraduate' ? { min: 400, max: 700 } : { min: 700, max: 1400 },
        writingPrompts: [
          'What is your first point of comparison?',
          'How do your subjects differ on this point?',
          'What similarities can you identify?',
          'What evidence supports your analysis?'
        ],
        guidelines: [
          'Use a clear organizational structure',
          'Provide equal attention to both subjects',
          'Support claims with specific evidence',
          'Show both similarities and differences'
        ],
        dependencies: ['intro', 'background']
      }
    ];

    // 添加更多比较点
    for (let i = 2; i <= (level === 'undergraduate' ? 3 : 4); i++) {
      modules.push({
        id: `comparison${i}`,
        type: 'custom',
        title: `${i === 2 ? 'Second' : i === 3 ? 'Third' : 'Fourth'} Point of Comparison`,
        description: `Analyze your ${i === 2 ? 'second' : i === 3 ? 'third' : 'fourth'} comparative criterion`,
        isRequired: i <= 3,
        order: i + 2,
        estimatedWordCount: level === 'undergraduate' ? { min: 400, max: 700 } : { min: 700, max: 1400 },
        writingPrompts: [
          `What is your ${i === 2 ? 'second' : i === 3 ? 'third' : 'fourth'} point of comparison?`,
          'How does this point relate to your previous analysis?',
          'What new insights emerge from this comparison?'
        ],
        guidelines: [
          'Build upon previous comparisons',
          'Maintain analytical depth',
          'Connect to your overall thesis'
        ],
        dependencies: [`comparison${i-1}`]
      });
    }

    // 添加综合分析（高级层次）
    if (level !== 'undergraduate') {
      modules.push({
        id: 'synthesis',
        type: 'custom',
        title: 'Synthesis and Evaluation',
        description: 'Synthesize your comparative findings and evaluate their significance',
        isRequired: true,
        order: modules.length + 1,
        estimatedWordCount: { min: 600, max: 1000 },
        writingPrompts: [
          'How do your comparative points work together?',
          'What overall patterns emerge?',
          'Which subject is more effective/significant and why?',
          'What are the broader implications of your comparison?'
        ],
        guidelines: [
          'Synthesize rather than summarize',
          'Make evaluative judgments based on evidence',
          'Consider broader significance',
          'Acknowledge complexity and nuance'
        ],
        dependencies: modules.map(m => m.id)
      });
    }

    // 添加结论和参考文献
    modules.push(
      {
        id: 'conclusion',
        type: 'conclusion',
        title: 'Conclusion',
        description: 'Summarize findings and reflect on the value of your comparative analysis',
        isRequired: true,
        order: modules.length + 1,
        estimatedWordCount: level === 'undergraduate' ? { min: 200, max: 400 } : { min: 400, max: 700 },
        writingPrompts: [
          'What has your comparison revealed?',
          'Why is this comparative analysis valuable?',
          'What questions remain for future research?'
        ],
        guidelines: [
          'Emphasize the value of comparison',
          'Reflect on broader implications',
          'Suggest areas for further study'
        ],
        dependencies: modules.map(m => m.id)
      },
      {
        id: 'references',
        type: 'references',
        title: 'References',
        description: 'List all sources used in your comparative analysis',
        isRequired: true,
        order: modules.length + 2,
        estimatedWordCount: { min: 100, max: 300 },
        writingPrompts: ['Include all primary and secondary sources'],
        guidelines: ['Use appropriate citation style', 'Ensure consistency'],
        dependencies: []
      }
    );

    return {
      id,
      paperType: 'comparative-analysis',
      academicLevel: level,
      name: `Comparative Analysis Paper - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
      description: 'A structured template for systematic comparison of subjects, texts, or concepts',
      modules,
      metadata
    };
  }

  /**
   * 文献综述模板
   */
  private generateLiteratureReviewTemplate(
    id: string,
    level: AcademicLevel,
    metadata: TemplateMetadata
  ): PaperStructureTemplate {
    const modules: PaperModuleTemplate[] = [
      {
        id: 'intro',
        type: 'introduction',
        title: 'Introduction',
        description: 'Define scope and objectives of the literature review',
        isRequired: true,
        order: 1,
        estimatedWordCount: level === 'undergraduate' ? { min: 300, max: 500 } : { min: 500, max: 1000 },
        writingPrompts: [
          'What is the focus of your literature review?',
          'Why is this topic important?',
          'What are your research questions?',
          'How did you search for and select sources?'
        ],
        guidelines: [
          'Clearly define the scope of your review',
          'Justify the importance of the topic',
          'Outline your methodology for source selection',
          'Preview the structure of your review'
        ],
        dependencies: []
      },
      {
        id: 'methodology',
        type: 'methodology',
        title: 'Search Strategy and Methodology',
        description: 'Explain how you identified and selected sources',
        isRequired: level !== 'undergraduate',
        order: 2,
        estimatedWordCount: { min: 400, max: 800 },
        writingPrompts: [
          'What databases did you search?',
          'What keywords and search terms did you use?',
          'What were your inclusion/exclusion criteria?',
          'How many sources did you identify and review?'
        ],
        guidelines: [
          'Be transparent about your search process',
          'Justify your selection criteria',
          'Include search terms and databases',
          'Report the number of sources reviewed'
        ],
        dependencies: ['intro']
      }
    ];

    // 添加主题性章节
    const reviewSections = level === 'undergraduate' ? 3 : 4;
    for (let i = 1; i <= reviewSections; i++) {
      modules.push({
        id: `theme${i}`,
        type: 'literature-review',
        title: `Theme ${i}: [Your Theme Title]`,
        description: `Review literature related to your ${i === 1 ? 'first' : i === 2 ? 'second' : i === 3 ? 'third' : 'fourth'} major theme`,
        isRequired: true,
        order: modules.length + 1,
        estimatedWordCount: level === 'undergraduate' ? { min: 500, max: 800 } : { min: 800, max: 1500 },
        writingPrompts: [
          `What is the main theme of this section?`,
          'What do the key studies say about this theme?',
          'Where do researchers agree or disagree?',
          'What gaps or limitations exist in this area?'
        ],
        guidelines: [
          'Organize by theme, not chronologically by source',
          'Synthesize findings across multiple sources',
          'Identify areas of consensus and debate',
          'Note methodological strengths and limitations'
        ],
        dependencies: modules.map(m => m.id)
      });
    }

    // 添加分析和综合
    modules.push({
      id: 'synthesis',
      type: 'discussion',
      title: 'Synthesis and Analysis',
      description: 'Synthesize findings across themes and identify patterns',
      isRequired: true,
      order: modules.length + 1,
      estimatedWordCount: level === 'undergraduate' ? { min: 400, max: 700 } : { min: 700, max: 1200 },
      writingPrompts: [
        'What patterns emerge across the literature?',
        'How do the themes relate to each other?',
        'What are the major debates in the field?',
        'What theoretical frameworks are being used?'
      ],
      guidelines: [
        'Look for connections between themes',
        'Identify overarching patterns and trends',
        'Discuss theoretical and methodological approaches',
        'Highlight areas of controversy or debate'
      ],
      dependencies: modules.filter(m => m.id.startsWith('theme')).map(m => m.id)
    });

    // 添加研究空白和未来方向
    modules.push({
      id: 'gaps',
      type: 'discussion',
      title: 'Research Gaps and Future Directions',
      description: 'Identify limitations in current research and suggest future studies',
      isRequired: true,
      order: modules.length + 1,
      estimatedWordCount: level === 'undergraduate' ? { min: 300, max: 600 } : { min: 600, max: 1000 },
      writingPrompts: [
        'What questions remain unanswered?',
        'What methodological limitations exist?',
        'What populations or contexts are understudied?',
        'What future research directions are needed?'
      ],
      guidelines: [
        'Be specific about identified gaps',
        'Suggest concrete future research directions',
        'Consider methodological improvements',
        'Think about practical implications'
      ],
      dependencies: ['synthesis']
    });

    // 添加结论和参考文献
    modules.push(
      {
        id: 'conclusion',
        type: 'conclusion',
        title: 'Conclusion',
        description: 'Summarize key findings and their implications',
        isRequired: true,
        order: modules.length + 1,
        estimatedWordCount: level === 'undergraduate' ? { min: 250, max: 500 } : { min: 500, max: 800 },
        writingPrompts: [
          'What are the key takeaways from this review?',
          'How does this review contribute to understanding?',
          'What are the practical implications?'
        ],
        guidelines: [
          'Summarize main findings concisely',
          'Emphasize the contribution of your review',
          'Consider practical applications'
        ],
        dependencies: modules.map(m => m.id)
      },
      {
        id: 'references',
        type: 'references',
        title: 'References',
        description: 'Comprehensive list of all reviewed sources',
        isRequired: true,
        order: modules.length + 2,
        estimatedWordCount: { min: 200, max: 1000 },
        writingPrompts: ['Include all sources mentioned in your review'],
        guidelines: [
          'Use appropriate citation style',
          'Ensure all sources are properly formatted',
          'Include DOIs where available'
        ],
        dependencies: []
      }
    );

    return {
      id,
      paperType: 'literature-review',
      academicLevel: level,
      name: `Literature Review - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
      description: 'A comprehensive template for systematic literature review and synthesis',
      modules,
      metadata
    };
  }

  // 简化版本的其他模板生成方法
  private generateCulturalAnalysisTemplate(id: string, level: AcademicLevel, metadata: TemplateMetadata): PaperStructureTemplate {
    return this.createBasicTemplate(id, 'cultural-analysis', level, metadata, 'Cultural Analysis Paper');
  }

  private generateCriticalReviewTemplate(id: string, level: AcademicLevel, metadata: TemplateMetadata): PaperStructureTemplate {
    return this.createBasicTemplate(id, 'critical-review', level, metadata, 'Critical Review');
  }

  private generateEmpiricalResearchTemplate(id: string, level: AcademicLevel, metadata: TemplateMetadata): PaperStructureTemplate {
    return this.createResearchTemplate(id, 'empirical-research', level, metadata, 'Empirical Research Paper');
  }

  private generateCaseStudyTemplate(id: string, level: AcademicLevel, metadata: TemplateMetadata): PaperStructureTemplate {
    return this.createBasicTemplate(id, 'case-study', level, metadata, 'Case Study Paper');
  }

  private generateDiscourseAnalysisTemplate(id: string, level: AcademicLevel, metadata: TemplateMetadata): PaperStructureTemplate {
    return this.createBasicTemplate(id, 'discourse-analysis', level, metadata, 'Discourse Analysis Paper');
  }

  private generateTheoreticalDiscussionTemplate(id: string, level: AcademicLevel, metadata: TemplateMetadata): PaperStructureTemplate {
    return this.createBasicTemplate(id, 'theoretical-discussion', level, metadata, 'Theoretical Discussion Paper');
  }

  private generateDissertationTemplate(id: string, level: AcademicLevel, metadata: TemplateMetadata): PaperStructureTemplate {
    return this.createResearchTemplate(id, 'dissertation-thesis', level, metadata, 'Dissertation/Thesis');
  }

  private generateDefaultTemplate(id: string, level: AcademicLevel, metadata: TemplateMetadata): PaperStructureTemplate {
    return this.createBasicTemplate(id, 'literary-analysis', level, metadata, 'Academic Paper');
  }

  /**
   * 创建基础模板结构
   */
  private createBasicTemplate(
    id: string,
    paperType: EnglishPaperType,
    level: AcademicLevel,
    metadata: TemplateMetadata,
    name: string
  ): PaperStructureTemplate {
    const modules: PaperModuleTemplate[] = [
      {
        id: 'intro',
        type: 'introduction',
        title: 'Introduction',
        description: 'Introduce your topic and establish your thesis',
        isRequired: true,
        order: 1,
        estimatedWordCount: level === 'undergraduate' ? { min: 250, max: 500 } : { min: 500, max: 1000 },
        writingPrompts: ['What is your main topic?', 'Why is it important?', 'What is your thesis?'],
        guidelines: ['Hook the reader', 'Provide context', 'State your thesis clearly'],
        dependencies: []
      },
      {
        id: 'body1',
        type: 'custom',
        title: 'Main Analysis/Argument',
        description: 'Develop your primary analytical points',
        isRequired: true,
        order: 2,
        estimatedWordCount: level === 'undergraduate' ? { min: 500, max: 1000 } : { min: 1000, max: 2000 },
        writingPrompts: ['What are your main points?', 'What evidence supports them?'],
        guidelines: ['Use clear topic sentences', 'Provide evidence', 'Analyze thoroughly'],
        dependencies: ['intro']
      },
      {
        id: 'conclusion',
        type: 'conclusion',
        title: 'Conclusion',
        description: 'Synthesize your analysis and reflect on implications',
        isRequired: true,
        order: 3,
        estimatedWordCount: level === 'undergraduate' ? { min: 200, max: 400 } : { min: 400, max: 800 },
        writingPrompts: ['What have you discovered?', 'What are the implications?'],
        guidelines: ['Synthesize findings', 'Reflect on significance', 'End thoughtfully'],
        dependencies: ['body1']
      },
      {
        id: 'references',
        type: 'references',
        title: 'References',
        description: 'List all sources used',
        isRequired: true,
        order: 4,
        estimatedWordCount: { min: 50, max: 300 },
        writingPrompts: ['Include all sources'],
        guidelines: ['Use proper citation format'],
        dependencies: []
      }
    ];

    return {
      id,
      paperType,
      academicLevel: level,
      name: `${name} - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
      description: `A structured template for ${name.toLowerCase()}`,
      modules,
      metadata
    };
  }

  /**
   * 创建研究型论文模板
   */
  private createResearchTemplate(
    id: string,
    paperType: EnglishPaperType,
    level: AcademicLevel,
    metadata: TemplateMetadata,
    name: string
  ): PaperStructureTemplate {
    const modules: PaperModuleTemplate[] = [
      {
        id: 'abstract',
        type: 'abstract',
        title: 'Abstract',
        description: 'Concise summary of your research',
        isRequired: level !== 'undergraduate',
        order: 1,
        estimatedWordCount: { min: 150, max: 300 },
        writingPrompts: ['What is your research about?', 'What did you find?'],
        guidelines: ['Be concise', 'Include key findings', 'Write last'],
        dependencies: []
      },
      {
        id: 'intro',
        type: 'introduction',
        title: 'Introduction',
        description: 'Introduce your research topic and questions',
        isRequired: true,
        order: 2,
        estimatedWordCount: level === 'undergraduate' ? { min: 500, max: 1000 } : { min: 1000, max: 2000 },
        writingPrompts: ['What is your research question?', 'Why is it important?'],
        guidelines: ['Establish context', 'Justify importance', 'State research questions'],
        dependencies: []
      },
      {
        id: 'literature',
        type: 'literature-review',
        title: 'Literature Review',
        description: 'Review relevant previous research',
        isRequired: true,
        order: 3,
        estimatedWordCount: level === 'undergraduate' ? { min: 1000, max: 2000 } : { min: 2000, max: 4000 },
        writingPrompts: ['What has been studied before?', 'What gaps exist?'],
        guidelines: ['Synthesize sources', 'Identify gaps', 'Connect to your research'],
        dependencies: ['intro']
      },
      {
        id: 'methodology',
        type: 'methodology',
        title: 'Methodology',
        description: 'Explain your research methods',
        isRequired: true,
        order: 4,
        estimatedWordCount: { min: 500, max: 1500 },
        writingPrompts: ['How did you conduct your research?', 'Why these methods?'],
        guidelines: ['Be detailed and replicable', 'Justify choices', 'Address limitations'],
        dependencies: ['literature']
      },
      {
        id: 'results',
        type: 'results',
        title: 'Results/Findings',
        description: 'Present your research findings',
        isRequired: true,
        order: 5,
        estimatedWordCount: level === 'undergraduate' ? { min: 1000, max: 2000 } : { min: 2000, max: 4000 },
        writingPrompts: ['What did you find?', 'How do you present this clearly?'],
        guidelines: ['Present objectively', 'Use visuals when helpful', 'Organize logically'],
        dependencies: ['methodology']
      },
      {
        id: 'discussion',
        type: 'discussion',
        title: 'Discussion',
        description: 'Interpret and discuss your findings',
        isRequired: true,
        order: 6,
        estimatedWordCount: level === 'undergraduate' ? { min: 1000, max: 2000 } : { min: 2000, max: 3000 },
        writingPrompts: ['What do your findings mean?', 'How do they relate to previous research?'],
        guidelines: ['Interpret findings', 'Connect to literature', 'Acknowledge limitations'],
        dependencies: ['results']
      },
      {
        id: 'conclusion',
        type: 'conclusion',
        title: 'Conclusion',
        description: 'Summarize findings and implications',
        isRequired: true,
        order: 7,
        estimatedWordCount: { min: 300, max: 800 },
        writingPrompts: ['What are the key takeaways?', 'What are the implications?'],
        guidelines: ['Summarize key findings', 'Discuss implications', 'Suggest future research'],
        dependencies: ['discussion']
      },
      {
        id: 'references',
        type: 'references',
        title: 'References',
        description: 'List all sources cited',
        isRequired: true,
        order: 8,
        estimatedWordCount: { min: 200, max: 1000 },
        writingPrompts: ['Include all cited sources'],
        guidelines: ['Use proper format', 'Check completeness', 'Ensure accuracy'],
        dependencies: []
      }
    ];

    return {
      id,
      paperType,
      academicLevel: level,
      name: `${name} - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
      description: `A comprehensive template for ${name.toLowerCase()}`,
      modules,
      metadata
    };
  }

  /**
   * 调整模板结构
   */
  private adjustTemplateStructure(
    template: PaperStructureTemplate,
    options: {
      targetWordCount?: number;
      citationStyle?: string;
      includeOptionalSections?: boolean;
      specializationArea?: string;
    }
  ): void {
    // 根据目标字数调整模块字数分配
    if (options.targetWordCount) {
      this.adjustWordCountDistribution(template, options.targetWordCount);
    }

    // 根据引用格式调整指导
    if (options.citationStyle) {
      this.adjustCitationGuidelines(template, options.citationStyle);
    }

    // 根据是否包含可选章节调整结构
    if (options.includeOptionalSections === false) {
      template.modules = template.modules.filter(m => m.isRequired);
    }

    // 根据专业领域添加特定指导
    if (options.specializationArea) {
      this.addSpecializationGuidance(template, options.specializationArea);
    }
  }

  /**
   * 调整字数分配
   */
  private adjustWordCountDistribution(template: PaperStructureTemplate, targetWordCount: number): void {
    const totalModules = template.modules.filter(m => m.type !== 'references').length;
    const referencesWordCount = 200; // 参考文献固定字数
    const availableWordCount = targetWordCount - referencesWordCount;
    
    template.modules.forEach(module => {
      if (module.type !== 'references') {
        const proportion = availableWordCount / totalModules;
        module.estimatedWordCount = {
          min: Math.floor(proportion * 0.7),
          max: Math.floor(proportion * 1.3)
        };
      }
    });
  }

  /**
   * 调整引用格式指导
   */
  private adjustCitationGuidelines(template: PaperStructureTemplate, citationStyle: string): void {
    template.modules.forEach(module => {
      if (module.type === 'references') {
        module.guidelines = [
          `Use ${citationStyle} citation format`,
          'Ensure consistency throughout',
          'Include all necessary publication details'
        ];
      }
    });
  }

  /**
   * 添加专业领域指导
   */
  private addSpecializationGuidance(template: PaperStructureTemplate, area: string): void {
    // 根据专业领域添加特定的写作提示和指导
    template.modules.forEach(module => {
      module.writingPrompts.push(`Consider ${area}-specific perspectives and approaches`);
    });
  }

  /**
   * 获取难度级别
   */
  private getDifficultyLevel(paperType: EnglishPaperType, level: AcademicLevel): 'beginner' | 'intermediate' | 'advanced' {
    const complexTypes: EnglishPaperType[] = ['theoretical-discussion', 'discourse-analysis', 'cultural-analysis'];
    
    if (level === 'doctoral' || complexTypes.includes(paperType)) {
      return 'advanced';
    } else if (level === 'master') {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  }

  /**
   * 获取预计完成时间
   */
  private getEstimatedTime(paperType: EnglishPaperType, level: AcademicLevel): number {
    const baseHours = {
      'undergraduate': 20,
      'master': 40,
      'doctoral': 80
    };
    
    const complexTypes: EnglishPaperType[] = ['dissertation-thesis', 'empirical-research', 'theoretical-discussion'];
    const multiplier = complexTypes.includes(paperType) ? 1.5 : 1;
    
    return Math.floor(baseHours[level] * multiplier);
  }

  /**
   * 获取模板标签
   */
  private getTemplateTags(paperType: EnglishPaperType, level: AcademicLevel): string[] {
    const baseTags = [paperType.replace('-', ' '), level, 'academic writing'];
    
    const typeSpecificTags: Record<EnglishPaperType, string[]> = {
      'literary-analysis': ['literature', 'textual analysis', 'close reading'],
      'comparative-analysis': ['comparison', 'contrast', 'synthesis'],
      'cultural-analysis': ['culture', 'society', 'anthropology'],
      'literature-review': ['research', 'synthesis', 'scholarly sources'],
      'critical-review': ['evaluation', 'critique', 'assessment'],
      'empirical-research': ['data', 'methodology', 'research design'],
      'case-study': ['qualitative', 'in-depth analysis', 'real-world'],
      'discourse-analysis': ['language', 'communication', 'linguistics'],
      'theoretical-discussion': ['theory', 'conceptual', 'philosophical'],
      'dissertation-thesis': ['comprehensive', 'original research', 'degree requirement']
    };

    return [...baseTags, ...typeSpecificTags[paperType]];
  }

  /**
   * 将模板转换为可用的模块列表
   */
  convertTemplateToModules(
    template: PaperStructureTemplate,
    paperId: string
  ): PaperModule[] {
    return template.modules.map((moduleTemplate, index) => ({
      id: `${paperId}-${moduleTemplate.id}`,
      type: moduleTemplate.type,
      title: moduleTemplate.title,
      content: '',
      order: moduleTemplate.order,
      isCollapsed: false,
      isCompleted: false,
      wordCount: 0,
      progress: 0,
      dependencies: moduleTemplate.dependencies.map(dep => `${paperId}-${dep}`),
      template: {
        id: moduleTemplate.id,
        name: moduleTemplate.title,
        description: moduleTemplate.description,
        structure: moduleTemplate.subSections?.map(sub => ({
          id: sub.id,
          title: sub.title,
          description: sub.description,
          isRequired: sub.isRequired,
          order: sub.order
        })) || [],
        prompts: moduleTemplate.writingPrompts,
        guidelines: moduleTemplate.guidelines,
        wordCountTarget: moduleTemplate.estimatedWordCount
      },
      metadata: {
        tags: template.metadata.tags,
        difficulty: template.metadata.difficulty as 'easy' | 'medium' | 'hard',
        estimatedTime: Math.floor(template.metadata.estimatedTime / template.modules.length),
        lastModified: new Date(),
        revisionCount: 0,
        notes: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }
}