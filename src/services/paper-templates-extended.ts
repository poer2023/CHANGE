/**
 * 论文模板详细实现 - 扩展版本
 * 包含所有10种论文类型的完整模板定义
 */

import { 
  EnglishPaperType, 
  AcademicLevel, 
  PaperStructureTemplate,
  PaperModuleTemplate,
  TemplateMetadata,
  SubSectionTemplate
} from '@/types/paper-types';

/**
 * 扩展的论文模板服务 - 包含所有论文类型的完整实现
 */
export class ComprehensivePaperTemplateService {
  private templates: Map<string, PaperStructureTemplate> = new Map();

  constructor() {
    this.initializeAllTemplates();
  }

  /**
   * 初始化所有模板
   */
  private initializeAllTemplates(): void {
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
        this.templates.set(`${paperType}-${level}`, template);
      });
    });
  }

  /**
   * 获取模板
   */
  getTemplate(paperType: EnglishPaperType, academicLevel: AcademicLevel): PaperStructureTemplate | null {
    return this.templates.get(`${paperType}-${academicLevel}`) || null;
  }

  /**
   * 创建特定类型的模板
   */
  private createTemplateForType(paperType: EnglishPaperType, academicLevel: AcademicLevel): PaperStructureTemplate {
    const templateId = `${paperType}-${academicLevel}-template`;
    
    switch (paperType) {
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
        throw new Error(`Template not implemented for type: ${paperType}`);
    }
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
          id: 'theoretical-framework',
          type: 'methodology',
          title: 'Theoretical Framework',
          description: 'Establish the theoretical lens for cultural analysis',
          isRequired: level !== 'undergraduate',
          order: 2,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What cultural theories inform your analysis?',
            'How do these theories apply to your subject?',
            'What methodological approach will you use?'
          ],
          guidelines: [
            'Explain relevant cultural theories',
            'Justify your theoretical choices',
            'Define key concepts and terms',
            'Address potential theoretical limitations'
          ],
          dependencies: ['intro-cultural']
        },
        {
          id: 'cultural-context',
          type: 'custom',
          title: 'Cultural Context and Background',
          description: 'Provide historical and social context for the cultural phenomenon',
          isRequired: true,
          order: 3,
          estimatedWordCount: { min: Math.round(wordCounts * 0.2), max: Math.round(wordCounts * 0.25) },
          writingPrompts: [
            'What is the historical context of this cultural phenomenon?',
            'What social, political, or economic factors are relevant?',
            'How has this phenomenon evolved over time?'
          ],
          guidelines: [
            'Provide comprehensive cultural context',
            'Address historical development',
            'Consider multiple cultural perspectives',
            'Use credible cultural sources'
          ],
          dependencies: ['theoretical-framework'],
          subSections: [
            {
              id: 'historical-context',
              title: 'Historical Development',
              description: 'Trace the historical evolution of the cultural phenomenon',
              isRequired: true,
              order: 1,
              writingPrompts: ['How has this cultural phenomenon developed historically?']
            },
            {
              id: 'social-context',
              title: 'Social and Political Context',
              description: 'Analyze the broader social environment',
              isRequired: true,
              order: 2,
              writingPrompts: ['What social forces shape this cultural phenomenon?']
            }
          ]
        },
        {
          id: 'cultural-analysis',
          type: 'custom',
          title: 'Cultural Analysis',
          description: 'In-depth analysis of cultural meanings, practices, and representations',
          isRequired: true,
          order: 4,
          estimatedWordCount: { min: Math.round(wordCounts * 0.3), max: Math.round(wordCounts * 0.35) },
          writingPrompts: [
            'What cultural meanings are embedded in this phenomenon?',
            'How do power relations manifest in this cultural context?',
            'What contradictions or tensions exist within the culture?'
          ],
          guidelines: [
            'Analyze cultural symbols and meanings',
            'Examine power dynamics and relationships',
            'Consider multiple interpretations',
            'Use specific cultural evidence'
          ],
          dependencies: ['cultural-context'],
          subSections: [
            {
              id: 'symbolic-analysis',
              title: 'Symbolic and Representational Analysis',
              description: 'Analysis of cultural symbols and representations',
              isRequired: true,
              order: 1,
              writingPrompts: ['What symbols and representations are significant?']
            },
            {
              id: 'practice-analysis',
              title: 'Cultural Practices and Rituals',
              description: 'Analysis of cultural behaviors and practices',
              isRequired: true,
              order: 2,
              writingPrompts: ['How do cultural practices reflect underlying values?']
            },
            {
              id: 'identity-analysis',
              title: 'Identity and Community Formation',
              description: 'Analysis of how culture shapes identity',
              isRequired: level !== 'undergraduate',
              order: 3,
              writingPrompts: ['How does this culture construct identity and community?']
            }
          ]
        },
        {
          id: 'critical-evaluation',
          type: 'discussion',
          title: 'Critical Evaluation',
          description: 'Critical assessment of cultural implications and contemporary relevance',
          isRequired: true,
          order: 5,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What are the broader implications of your cultural analysis?',
            'How does this analysis contribute to cultural understanding?',
            'What contemporary relevance does this cultural phenomenon have?'
          ],
          guidelines: [
            'Evaluate the significance of your findings',
            'Discuss contemporary implications',
            'Address limitations of your analysis',
            'Consider alternative perspectives'
          ],
          dependencies: ['cultural-analysis']
        },
        {
          id: 'conclusion-cultural',
          type: 'conclusion',
          title: 'Conclusion',
          description: 'Synthesize cultural insights and reflect on broader significance',
          isRequired: true,
          order: 6,
          estimatedWordCount: { min: Math.round(wordCounts * 0.08), max: Math.round(wordCounts * 0.12) },
          writingPrompts: [
            'What key insights emerge from your cultural analysis?',
            'How does this analysis contribute to cultural studies?',
            'What questions remain for future cultural research?'
          ],
          guidelines: [
            'Synthesize major cultural insights',
            'Reflect on the contribution to cultural understanding',
            'Suggest directions for further research',
            'End with broader cultural significance'
          ],
          dependencies: ['critical-evaluation']
        },
        {
          id: 'references-cultural',
          type: 'references',
          title: 'References',
          description: 'Citations for cultural sources and theoretical works',
          isRequired: true,
          order: 7,
          estimatedWordCount: { min: 100, max: 400 },
          writingPrompts: ['Have you cited all cultural sources and theoretical works?'],
          guidelines: [
            'Include diverse cultural sources',
            'Cite theoretical and methodological works',
            'Use appropriate citation style',
            'Ensure cultural sensitivity in source selection'
          ],
          dependencies: []
        }
      ],
      metadata: {
        difficulty: level === 'undergraduate' ? 'intermediate' : level === 'master' ? 'advanced' : 'advanced',
        estimatedTime: level === 'undergraduate' ? 30 : level === 'master' ? 50 : 80,
        tags: ['culture', 'analysis', 'theory', 'society', 'interpretation'],
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
          id: 'intro-lit-review',
          type: 'introduction',
          title: 'Introduction',
          description: 'Define the scope and purpose of the literature review',
          isRequired: true,
          order: 1,
          estimatedWordCount: { min: Math.round(wordCounts * 0.1), max: Math.round(wordCounts * 0.15) },
          writingPrompts: [
            'What research area are you reviewing?',
            'What is the purpose and scope of your review?',
            'What research questions guide your review?'
          ],
          guidelines: [
            'Define the research area clearly',
            'Establish the purpose of the review',
            'Outline the scope and limitations',
            'Present guiding research questions'
          ],
          dependencies: []
        },
        {
          id: 'search-methodology',
          type: 'methodology',
          title: 'Search Strategy and Methodology',
          description: 'Describe how you identified and selected literature',
          isRequired: level !== 'undergraduate',
          order: 2,
          estimatedWordCount: { min: Math.round(wordCounts * 0.1), max: Math.round(wordCounts * 0.15) },
          writingPrompts: [
            'What databases and sources did you search?',
            'What search terms and criteria did you use?',
            'How did you select relevant literature?'
          ],
          guidelines: [
            'Document search databases and strategies',
            'Explain inclusion and exclusion criteria',
            'Describe selection process',
            'Address potential search limitations'
          ],
          dependencies: ['intro-lit-review']
        },
        {
          id: 'thematic-synthesis',
          type: 'custom',
          title: 'Thematic Synthesis of Literature',
          description: 'Organize and synthesize literature by themes or topics',
          isRequired: true,
          order: 3,
          estimatedWordCount: { min: Math.round(wordCounts * 0.5), max: Math.round(wordCounts * 0.6) },
          writingPrompts: [
            'What major themes emerge from the literature?',
            'How do different studies address these themes?',
            'What consensus or disagreements exist in the field?'
          ],
          guidelines: [
            'Organize literature thematically',
            'Synthesize rather than just summarize',
            'Identify patterns and relationships',
            'Highlight agreements and contradictions'
          ],
          dependencies: ['search-methodology'],
          subSections: [
            {
              id: 'theme-1',
              title: 'Major Theme 1',
              description: 'Analysis of the first major theme in the literature',
              isRequired: true,
              order: 1,
              writingPrompts: ['What does the literature reveal about this theme?']
            },
            {
              id: 'theme-2',
              title: 'Major Theme 2',
              description: 'Analysis of the second major theme in the literature',
              isRequired: true,
              order: 2,
              writingPrompts: ['How do studies approach this second theme?']
            },
            {
              id: 'additional-themes',
              title: 'Additional Themes',
              description: 'Analysis of other significant themes',
              isRequired: false,
              order: 3,
              writingPrompts: ['What other important themes emerge?']
            }
          ]
        },
        {
          id: 'gaps-limitations',
          type: 'discussion',
          title: 'Research Gaps and Limitations',
          description: 'Identify gaps in current research and methodological limitations',
          isRequired: true,
          order: 4,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What gaps exist in the current literature?',
            'What methodological limitations are common?',
            'What areas need further research?'
          ],
          guidelines: [
            'Identify specific research gaps',
            'Discuss methodological limitations',
            'Suggest areas for future research',
            'Consider practical implications'
          ],
          dependencies: ['thematic-synthesis']
        },
        {
          id: 'conclusion-lit-review',
          type: 'conclusion',
          title: 'Conclusion and Future Directions',
          description: 'Summarize key findings and suggest future research directions',
          isRequired: true,
          order: 5,
          estimatedWordCount: { min: Math.round(wordCounts * 0.1), max: Math.round(wordCounts * 0.15) },
          writingPrompts: [
            'What are the key findings from your literature review?',
            'What directions should future research take?',
            'What practical implications emerge from the literature?'
          ],
          guidelines: [
            'Synthesize major findings',
            'Propose specific research directions',
            'Discuss practical applications',
            'Highlight the contribution of your review'
          ],
          dependencies: ['gaps-limitations']
        },
        {
          id: 'references-lit-review',
          type: 'references',
          title: 'References',
          description: 'Comprehensive list of all reviewed literature',
          isRequired: true,
          order: 6,
          estimatedWordCount: { min: 200, max: 800 },
          writingPrompts: ['Have you included all sources reviewed in your analysis?'],
          guidelines: [
            'Include all sources discussed in the review',
            'Use consistent citation format',
            'Organize alphabetically or by theme',
            'Ensure accuracy of all citations'
          ],
          dependencies: []
        }
      ],
      metadata: {
        difficulty: level === 'undergraduate' ? 'intermediate' : level === 'master' ? 'intermediate' : 'advanced',
        estimatedTime: level === 'undergraduate' ? 25 : level === 'master' ? 45 : 75,
        tags: ['literature', 'review', 'synthesis', 'research', 'analysis'],
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
      description: 'Template for critical evaluation and assessment of works, theories, or arguments',
      modules: [
        {
          id: 'intro-critical',
          type: 'introduction',
          title: 'Introduction',
          description: 'Introduce the work being reviewed and your evaluative stance',
          isRequired: true,
          order: 1,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What work are you critically reviewing?',
            'What is your overall evaluative thesis?',
            'What criteria will guide your critical assessment?'
          ],
          guidelines: [
            'Identify the work being reviewed',
            'Present your critical thesis',
            'Establish evaluation criteria',
            'Provide necessary context'
          ],
          dependencies: []
        },
        {
          id: 'summary-overview',
          type: 'custom',
          title: 'Summary and Overview',
          description: 'Provide objective summary of the work under review',
          isRequired: true,
          order: 2,
          estimatedWordCount: { min: Math.round(wordCounts * 0.2), max: Math.round(wordCounts * 0.25) },
          writingPrompts: [
            'What are the main arguments or findings of the work?',
            'What methodology or approach does the author use?',
            'What are the key claims or contributions?'
          ],
          guidelines: [
            'Provide fair and objective summary',
            'Focus on main arguments and evidence',
            'Avoid evaluative language in this section',
            'Ensure accuracy in representation'
          ],
          dependencies: ['intro-critical']
        },
        {
          id: 'critical-evaluation',
          type: 'custom',
          title: 'Critical Evaluation',
          description: 'Detailed critical assessment of strengths and weaknesses',
          isRequired: true,
          order: 3,
          estimatedWordCount: { min: Math.round(wordCounts * 0.4), max: Math.round(wordCounts * 0.45) },
          writingPrompts: [
            'What are the major strengths of this work?',
            'What weaknesses or limitations do you identify?',
            'How convincing are the arguments and evidence?'
          ],
          guidelines: [
            'Provide balanced critical assessment',
            'Support evaluations with specific evidence',
            'Address both strengths and weaknesses',
            'Consider alternative perspectives'
          ],
          dependencies: ['summary-overview'],
          subSections: [
            {
              id: 'strengths',
              title: 'Strengths and Contributions',
              description: 'Analysis of the work\'s positive aspects and contributions',
              isRequired: true,
              order: 1,
              writingPrompts: ['What does this work contribute to the field?']
            },
            {
              id: 'weaknesses',
              title: 'Weaknesses and Limitations',
              description: 'Critical analysis of problems or limitations',
              isRequired: true,
              order: 2,
              writingPrompts: ['What limitations or problems do you identify?']
            },
            {
              id: 'methodology-critique',
              title: 'Methodological Assessment',
              description: 'Evaluation of the author\'s approach and methodology',
              isRequired: level !== 'undergraduate',
              order: 3,
              writingPrompts: ['How appropriate and effective is the methodology?']
            }
          ]
        },
        {
          id: 'comparative-context',
          type: 'discussion',
          title: 'Comparative Context',
          description: 'Place the work in broader academic or practical context',
          isRequired: level !== 'undergraduate',
          order: 4,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'How does this work compare to others in the field?',
            'What is its significance within broader debates?',
            'How does it advance or challenge existing knowledge?'
          ],
          guidelines: [
            'Compare to related works in the field',
            'Assess contribution to broader debates',
            'Consider practical implications',
            'Evaluate innovation and originality'
          ],
          dependencies: ['critical-evaluation']
        },
        {
          id: 'conclusion-critical',
          type: 'conclusion',
          title: 'Conclusion and Recommendation',
          description: 'Conclude with overall assessment and recommendation',
          isRequired: true,
          order: 5,
          estimatedWordCount: { min: Math.round(wordCounts * 0.1), max: Math.round(wordCounts * 0.15) },
          writingPrompts: [
            'What is your overall assessment of the work?',
            'Would you recommend this work and to whom?',
            'What is the lasting value or impact of this work?'
          ],
          guidelines: [
            'Provide clear overall judgment',
            'Make specific recommendations',
            'Justify your final assessment',
            'Consider audience and purpose'
          ],
          dependencies: ['critical-evaluation', 'comparative-context']
        },
        {
          id: 'references-critical',
          type: 'references',
          title: 'References',
          description: 'Citations for the reviewed work and supporting sources',
          isRequired: true,
          order: 6,
          estimatedWordCount: { min: 50, max: 200 },
          writingPrompts: ['Have you properly cited the reviewed work and supporting sources?'],
          guidelines: [
            'Include complete citation for reviewed work',
            'Cite supporting sources for your evaluation',
            'Use appropriate citation style',
            'Ensure accuracy of all bibliographic information'
          ],
          dependencies: []
        }
      ],
      metadata: {
        difficulty: level === 'undergraduate' ? 'intermediate' : level === 'master' ? 'intermediate' : 'advanced',
        estimatedTime: level === 'undergraduate' ? 15 : level === 'master' ? 25 : 40,
        tags: ['critical', 'evaluation', 'assessment', 'review', 'analysis'],
        lastUpdated: new Date(),
        version: '1.0',
        author: 'Paper Template System'
      }
    };
  }

  /**
   * 实证研究论文模板
   */
  private createEmpiricalResearchTemplate(id: string, level: AcademicLevel): PaperStructureTemplate {
    const wordCounts = this.getWordCountByLevel(level, { base: 10000, undergraduate: 0.6, master: 1.0, doctoral: 1.8 });
    
    return {
      id,
      paperType: 'empirical-research',
      academicLevel: level,
      name: `Empirical Research Paper - ${level.charAt(0).toUpperCase() + level.slice(1)}`,
      description: 'Template for original research based on empirical evidence and data analysis',
      modules: [
        {
          id: 'abstract-empirical',
          type: 'abstract',
          title: 'Abstract',
          description: 'Concise summary of research purpose, methods, findings, and implications',
          isRequired: level !== 'undergraduate',
          order: 1,
          estimatedWordCount: { min: 150, max: 300 },
          writingPrompts: [
            'What was the purpose of your research?',
            'What methods did you use?',
            'What were your main findings?',
            'What are the implications of your results?'
          ],
          guidelines: [
            'Summarize all major sections briefly',
            'Include key quantitative results if applicable',
            'Highlight significance of findings',
            'Stay within word limit'
          ],
          dependencies: []
        },
        {
          id: 'intro-empirical',
          type: 'introduction',
          title: 'Introduction',
          description: 'Introduce research problem and establish research questions/hypotheses',
          isRequired: true,
          order: 2,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What is your research problem or question?',
            'Why is this research important?',
            'What are your hypotheses or research questions?'
          ],
          guidelines: [
            'Establish the research problem clearly',
            'Justify the significance of the research',
            'Present specific research questions or hypotheses',
            'Provide overview of your approach'
          ],
          dependencies: [],
          subSections: [
            {
              id: 'research-problem',
              title: 'Research Problem',
              description: 'Clear statement of the problem being investigated',
              isRequired: true,
              order: 1,
              writingPrompts: ['What specific problem does your research address?']
            },
            {
              id: 'research-questions',
              title: 'Research Questions/Hypotheses',
              description: 'Specific questions or hypotheses guiding the research',
              isRequired: true,
              order: 2,
              writingPrompts: ['What specific questions or hypotheses guide your research?']
            }
          ]
        },
        {
          id: 'lit-review-empirical',
          type: 'literature-review',
          title: 'Literature Review',
          description: 'Review relevant research and establish theoretical foundation',
          isRequired: true,
          order: 3,
          estimatedWordCount: { min: Math.round(wordCounts * 0.2), max: Math.round(wordCounts * 0.25) },
          writingPrompts: [
            'What previous research relates to your study?',
            'What theoretical framework guides your research?',
            'What gaps in knowledge does your research address?'
          ],
          guidelines: [
            'Review relevant empirical studies',
            'Establish theoretical framework',
            'Identify research gaps',
            'Connect literature to your research questions'
          ],
          dependencies: ['intro-empirical']
        },
        {
          id: 'methodology-empirical',
          type: 'methodology',
          title: 'Methodology',
          description: 'Detailed description of research design, participants, and procedures',
          isRequired: true,
          order: 4,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What research design did you use?',
            'Who were your participants?',
            'What procedures did you follow?',
            'How did you analyze your data?'
          ],
          guidelines: [
            'Describe research design and rationale',
            'Detail participant selection and characteristics',
            'Explain data collection procedures',
            'Describe data analysis methods'
          ],
          dependencies: ['lit-review-empirical'],
          subSections: [
            {
              id: 'research-design',
              title: 'Research Design',
              description: 'Overall design and approach of the study',
              isRequired: true,
              order: 1,
              writingPrompts: ['What research design best addresses your questions?']
            },
            {
              id: 'participants',
              title: 'Participants',
              description: 'Description of study participants and sampling',
              isRequired: true,
              order: 2,
              writingPrompts: ['Who participated in your study and how were they selected?']
            },
            {
              id: 'data-collection',
              title: 'Data Collection',
              description: 'Procedures for gathering data',
              isRequired: true,
              order: 3,
              writingPrompts: ['How did you collect your data?']
            },
            {
              id: 'data-analysis',
              title: 'Data Analysis',
              description: 'Methods used to analyze the collected data',
              isRequired: true,
              order: 4,
              writingPrompts: ['How did you analyze your data?']
            }
          ]
        },
        {
          id: 'results-empirical',
          type: 'results',
          title: 'Results',
          description: 'Presentation of research findings without interpretation',
          isRequired: true,
          order: 5,
          estimatedWordCount: { min: Math.round(wordCounts * 0.15), max: Math.round(wordCounts * 0.2) },
          writingPrompts: [
            'What did you find in your data analysis?',
            'What patterns or relationships emerged?',
            'How do your findings relate to your research questions?'
          ],
          guidelines: [
            'Present findings objectively without interpretation',
            'Use appropriate statistical tests and measures',
            'Include relevant tables, figures, and charts',
            'Address all research questions systematically'
          ],
          dependencies: ['methodology-empirical']
        },
        {
          id: 'discussion-empirical',
          type: 'discussion',
          title: 'Discussion',
          description: 'Interpretation of results and implications for theory and practice',
          isRequired: true,
          order: 6,
          estimatedWordCount: { min: Math.round(wordCounts * 0.2), max: Math.round(wordCounts * 0.25) },
          writingPrompts: [
            'What do your results mean?',
            'How do your findings relate to previous research?',
            'What are the implications of your findings?',
            'What limitations should be acknowledged?'
          ],
          guidelines: [
            'Interpret results in context of literature',
            'Discuss theoretical and practical implications',
            'Address study limitations honestly',
            'Suggest directions for future research'
          ],
          dependencies: ['results-empirical'],
          subSections: [
            {
              id: 'interpretation',
              title: 'Interpretation of Findings',
              description: 'What the results mean in context',
              isRequired: true,
              order: 1,
              writingPrompts: ['How do you interpret your main findings?']
            },
            {
              id: 'implications',
              title: 'Theoretical and Practical Implications',
              description: 'Broader significance of the findings',
              isRequired: true,
              order: 2,
              writingPrompts: ['What are the broader implications of your findings?']
            },
            {
              id: 'limitations',
              title: 'Limitations',
              description: 'Acknowledgment of study limitations',
              isRequired: true,
              order: 3,
              writingPrompts: ['What limitations should readers consider?']
            }
          ]
        },
        {
          id: 'conclusion-empirical',
          type: 'conclusion',
          title: 'Conclusion',
          description: 'Summary of key findings and their significance',
          isRequired: true,
          order: 7,
          estimatedWordCount: { min: Math.round(wordCounts * 0.08), max: Math.round(wordCounts * 0.12) },
          writingPrompts: [
            'What are your key findings?',
            'What is the significance of your research?',
            'What future research is needed?'
          ],
          guidelines: [
            'Summarize main findings concisely',
            'Emphasize significance and contributions',
            'Suggest specific future research directions',
            'End with broader impact statement'
          ],
          dependencies: ['discussion-empirical']
        },
        {
          id: 'references-empirical',
          type: 'references',
          title: 'References',
          description: 'Citations for all sources used in the research',
          isRequired: true,
          order: 8,
          estimatedWordCount: { min: 200, max: 600 },
          writingPrompts: ['Have you cited all sources appropriately?'],
          guidelines: [
            'Include all sources cited in the paper',
            'Use appropriate academic citation style',
            'Ensure accuracy of all citations',
            'Include both theoretical and empirical sources'
          ],
          dependencies: []
        }
      ],
      metadata: {
        difficulty: level === 'undergraduate' ? 'advanced' : level === 'master' ? 'advanced' : 'advanced',
        estimatedTime: level === 'undergraduate' ? 40 : level === 'master' ? 60 : 100,
        tags: ['empirical', 'research', 'data', 'analysis', 'methodology'],
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

  // 其他模板方法将在下一个文件中继续实现...
}

export default ComprehensivePaperTemplateService;