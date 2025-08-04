import { 
  PaperTypeDefinition, 
  EnglishPaperType, 
  AcademicLevel 
} from '@/types/paper-types';

/**
 * 完整的10种英语系论文类型定义配置
 * 包含详细的特征、要求、指导等信息
 */
export const PAPER_TYPE_DEFINITIONS: Record<EnglishPaperType, PaperTypeDefinition> = {
  'literary-analysis': {
    id: 'literary-analysis',
    name: { 
      en: 'Literary Analysis Paper', 
      zh: '文学分析论文' 
    },
    description: { 
      en: 'In-depth critical analysis of literary works focusing on themes, techniques, and interpretations',
      zh: '深入分析文学作品的主题、技巧和阐释的批判性论文'
    },
    icon: 'BookOpen',
    color: 'indigo',
    academicLevels: ['undergraduate', 'master', 'doctoral'],
    complexity: 'intermediate',
    typicalWordCount: {
      undergraduate: { min: 1500, max: 3500 },
      master: { min: 3500, max: 7000 },
      doctoral: { min: 8000, max: 15000 }
    },
    coreFeatures: [
      'Close Reading Analysis',
      'Textual Evidence Integration', 
      'Literary Theory Application',
      'Critical Interpretation',
      'Thematic Exploration',
      'Stylistic Analysis'
    ],
    requiredSections: [
      'Introduction with Thesis',
      'Literary Context (optional for undergrad)',
      'Analytical Body Paragraphs',
      'Textual Evidence Support',
      'Conclusion with Synthesis',
      'Works Cited/Bibliography'
    ],
    optionalSections: [
      'Historical Context',
      'Biographical Information',
      'Comparative Elements',
      'Theoretical Framework',
      'Secondary Source Integration'
    ],
    citationStyles: ['MLA', 'Chicago', 'Harvard'],
    keywords: [
      'literature', 'literary', 'analysis', 'interpretation', 'symbolism', 
      'theme', 'character', 'narrative', 'style', 'author', 'writing techniques',
      'close reading', 'textual analysis', 'literary criticism', 'motif', 
      'allegory', 'metaphor', 'imagery', 'tone', 'genre'
    ],
    relatedTypes: ['comparative-analysis', 'critical-review', 'cultural-analysis']
  },

  'comparative-analysis': {
    id: 'comparative-analysis',
    name: { 
      en: 'Comparative Analysis Paper', 
      zh: '比较分析论文' 
    },
    description: { 
      en: 'Systematic comparison and contrast of two or more subjects, texts, theories, or concepts',
      zh: '系统比较和对比两个或多个主题、文本、理论或概念的论文'
    },
    icon: 'Layers',
    color: 'blue',
    academicLevels: ['undergraduate', 'master', 'doctoral'],
    complexity: 'intermediate',
    typicalWordCount: {
      undergraduate: { min: 2000, max: 4000 },
      master: { min: 4000, max: 8000 },
      doctoral: { min: 8000, max: 12000 }
    },
    coreFeatures: [
      'Comparative Framework',
      'Structured Comparison',
      'Similarity Analysis',
      'Difference Identification',
      'Analytical Synthesis',
      'Evaluative Judgment'
    ],
    requiredSections: [
      'Introduction with Comparative Thesis',
      'Background/Context for Subjects',
      'Point-by-Point Comparison',
      'Analytical Synthesis',
      'Evaluative Conclusion',
      'References/Bibliography'
    ],
    optionalSections: [
      'Individual Subject Analysis',
      'Historical Context',
      'Methodological Framework',
      'Theoretical Perspective',
      'Implications and Applications'
    ],
    citationStyles: ['MLA', 'APA', 'Chicago', 'Harvard'],
    keywords: [
      'compare', 'comparison', 'contrast', 'versus', 'similarities', 'differences',
      'parallel', 'both', 'whereas', 'unlike', 'similar', 'different', 'between',
      'among', 'comparative', 'relationship', 'connection', 'distinction', 'analogy',
      'juxtaposition', 'correlation', 'evaluation'
    ],
    relatedTypes: ['literary-analysis', 'cultural-analysis', 'critical-review']
  },

  'cultural-analysis': {
    id: 'cultural-analysis',
    name: { 
      en: 'Cultural Analysis Paper', 
      zh: '文化分析论文' 
    },
    description: { 
      en: 'Critical examination of cultural phenomena, practices, representations, and their social meanings',
      zh: '批判性审视文化现象、实践、表征及其社会意义的论文'
    },
    icon: 'Users',
    color: 'purple',
    academicLevels: ['undergraduate', 'master', 'doctoral'],
    complexity: 'advanced',
    typicalWordCount: {
      undergraduate: { min: 2500, max: 4500 },
      master: { min: 5000, max: 10000 },
      doctoral: { min: 10000, max: 20000 }
    },
    coreFeatures: [
      'Cultural Theory Application',
      'Ethnographic Methods',
      'Social Context Analysis',
      'Power Relations Examination',
      'Identity Construction Study',
      'Critical Cultural Perspective'
    ],
    requiredSections: [
      'Introduction with Cultural Focus',
      'Theoretical Framework',
      'Cultural Context Analysis',
      'Critical Examination',
      'Social Implications',
      'Conclusion with Broader Significance',
      'References/Bibliography'
    ],
    optionalSections: [
      'Methodology Section',
      'Case Studies',
      'Comparative Cultural Elements',
      'Historical Development',
      'Contemporary Relevance'
    ],
    citationStyles: ['APA', 'Chicago', 'Harvard', 'AAA'],
    keywords: [
      'culture', 'cultural', 'society', 'social', 'anthropology', 'ethnography',
      'community', 'tradition', 'customs', 'identity', 'values', 'beliefs',
      'practices', 'ritual', 'cultural studies', 'postcolonial', 'gender',
      'race', 'class', 'power', 'ideology', 'representation', 'discourse'
    ],
    relatedTypes: ['case-study', 'discourse-analysis', 'theoretical-discussion']
  },

  'literature-review': {
    id: 'literature-review',
    name: { 
      en: 'Literature Review', 
      zh: '文献综述' 
    },
    description: { 
      en: 'Comprehensive synthesis and critical evaluation of existing research on a specific topic',
      zh: '对特定主题现有研究的全面综合和批判性评价'
    },
    icon: 'Search',
    color: 'green',
    academicLevels: ['undergraduate', 'master', 'doctoral'],
    complexity: 'basic',
    typicalWordCount: {
      undergraduate: { min: 2000, max: 4000 },
      master: { min: 4000, max: 8000 },
      doctoral: { min: 8000, max: 15000 }
    },
    coreFeatures: [
      'Source Evaluation',
      'Research Synthesis',
      'Gap Identification',
      'Trend Analysis',
      'Methodological Review',
      'Theoretical Integration'
    ],
    requiredSections: [
      'Introduction with Scope Definition',
      'Search Methodology (graduate level)',
      'Thematic Literature Review',
      'Critical Analysis and Synthesis',
      'Research Gaps and Limitations',
      'Conclusion with Future Directions',
      'Comprehensive Bibliography'
    ],
    optionalSections: [
      'Historical Overview',
      'Methodological Comparison',
      'Theoretical Framework Analysis',
      'Practical Applications',
      'Policy Implications'
    ],
    citationStyles: ['APA', 'MLA', 'Chicago', 'Harvard', 'IEEE'],
    keywords: [
      'review', 'literature', 'research', 'studies', 'findings', 'previous',
      'existing', 'scholars', 'academic', 'sources', 'synthesis', 'overview',
      'survey', 'examination', 'current state', 'gaps', 'trends', 'developments',
      'publications', 'meta-analysis', 'systematic review'
    ],
    relatedTypes: ['empirical-research', 'theoretical-discussion', 'critical-review']
  },

  'critical-review': {
    id: 'critical-review',
    name: { 
      en: 'Critical Review', 
      zh: '批判性评述' 
    },
    description: { 
      en: 'Critical evaluation and assessment of specific works, theories, arguments, or scholarly contributions',
      zh: '对特定作品、理论、论点或学术贡献的批判性评价和评估'
    },
    icon: 'MessageSquare',
    color: 'red',
    academicLevels: ['undergraduate', 'master', 'doctoral'],
    complexity: 'intermediate',
    typicalWordCount: {
      undergraduate: { min: 1500, max: 3000 },
      master: { min: 3000, max: 6000 },
      doctoral: { min: 6000, max: 10000 }
    },
    coreFeatures: [
      'Critical Thinking Application',
      'Evaluation Framework',
      'Evidence-based Arguments',
      'Strength-Weakness Analysis',
      'Scholarly Assessment',
      'Constructive Critique'
    ],
    requiredSections: [
      'Introduction with Evaluation Focus',
      'Summary of Work(s) Reviewed',
      'Critical Analysis Framework',
      'Detailed Evaluation',
      'Comparative Assessment (if applicable)',
      'Conclusion with Overall Judgment',
      'References'
    ],
    optionalSections: [
      'Methodological Critique',
      'Alternative Perspectives',
      'Recommendations for Improvement',
      'Broader Implications',
      'Future Research Suggestions'
    ],
    citationStyles: ['MLA', 'APA', 'Chicago', 'Harvard'],
    keywords: [
      'critical', 'critique', 'evaluation', 'assessment', 'judgment', 'analysis',
      'review', 'strengths', 'weaknesses', 'limitations', 'merits', 'flaws',
      'effectiveness', 'validity', 'reliability', 'bias', 'perspective',
      'argument', 'position', 'scholarly', 'academic'
    ],
    relatedTypes: ['literary-analysis', 'comparative-analysis', 'literature-review']
  },

  'empirical-research': {
    id: 'empirical-research',
    name: { 
      en: 'Empirical Research Paper', 
      zh: '实证研究论文' 
    },
    description: { 
      en: 'Original research based on systematic data collection, analysis, and evidence-based conclusions',
      zh: '基于系统数据收集、分析和实证结论的原创性研究论文'
    },
    icon: 'TrendingUp',
    color: 'cyan',
    academicLevels: ['master', 'doctoral'],
    complexity: 'advanced',
    typicalWordCount: {
      undergraduate: { min: 3000, max: 6000 },
      master: { min: 6000, max: 12000 },
      doctoral: { min: 12000, max: 25000 }
    },
    coreFeatures: [
      'Research Design',
      'Data Collection Methods',
      'Statistical Analysis',
      'Results Interpretation',
      'Hypothesis Testing',
      'Evidence-based Conclusions'
    ],
    requiredSections: [
      'Abstract',
      'Introduction with Research Questions',
      'Literature Review',
      'Methodology and Design',
      'Data Collection Procedures',
      'Results and Findings',
      'Discussion and Analysis',
      'Conclusion and Implications',
      'References',
      'Appendices (if applicable)'
    ],
    optionalSections: [
      'Theoretical Framework',
      'Pilot Study Results',
      'Limitations and Delimitations',
      'Future Research Directions',
      'Practical Applications',
      'Policy Recommendations'
    ],
    citationStyles: ['APA', 'IEEE', 'Harvard', 'Chicago'],
    keywords: [
      'empirical', 'research', 'data', 'methodology', 'method', 'experiment',
      'survey', 'interview', 'questionnaire', 'analysis', 'results', 'findings',
      'statistics', 'quantitative', 'qualitative', 'evidence', 'investigation',
      'observation', 'measurement', 'hypothesis', 'variables'
    ],
    relatedTypes: ['case-study', 'literature-review', 'dissertation-thesis']
  },

  'case-study': {
    id: 'case-study',
    name: { 
      en: 'Case Study Paper', 
      zh: '个案研究论文' 
    },
    description: { 
      en: 'In-depth qualitative analysis of specific cases, individuals, organizations, or phenomena',
      zh: '对特定案例、个体、组织或现象的深入定性分析'
    },
    icon: 'Target',
    color: 'orange',
    academicLevels: ['undergraduate', 'master', 'doctoral'],
    complexity: 'advanced',
    typicalWordCount: {
      undergraduate: { min: 2500, max: 4500 },
      master: { min: 5000, max: 10000 },
      doctoral: { min: 10000, max: 18000 }
    },
    coreFeatures: [
      'Case Selection Justification',
      'Detailed Contextual Analysis',
      'Multiple Data Sources',
      'Triangulation Methods',
      'Practical Implications',
      'Transferability Assessment'
    ],
    requiredSections: [
      'Introduction with Case Overview',
      'Case Selection and Rationale',
      'Background and Context',
      'Methodology and Data Sources',
      'Detailed Case Analysis',
      'Findings and Patterns',
      'Discussion and Implications',
      'Conclusion with Transferability',
      'References'
    ],
    optionalSections: [
      'Theoretical Framework',
      'Comparative Case Elements',
      'Stakeholder Perspectives',
      'Recommendations',
      'Lessons Learned',
      'Future Research Needs'
    ],
    citationStyles: ['APA', 'Chicago', 'Harvard', 'MLA'],
    keywords: [
      'case study', 'case', 'analysis', 'qualitative', 'investigation', 'specific',
      'particular', 'individual', 'organization', 'phenomenon', 'detailed',
      'in-depth', 'comprehensive', 'examination', 'real-world', 'practical',
      'situation', 'context', 'application', 'triangulation'
    ],
    relatedTypes: ['empirical-research', 'cultural-analysis', 'ethnographic-study']
  },

  'discourse-analysis': {
    id: 'discourse-analysis',
    name: { 
      en: 'Discourse Analysis Paper', 
      zh: '话语分析论文' 
    },
    description: { 
      en: 'Critical examination of language use in social contexts, focusing on power, ideology, and meaning construction',
      zh: '批判性审视社会语境中的语言使用，关注权力、意识形态和意义建构'
    },
    icon: 'MessageSquare',
    color: 'teal',
    academicLevels: ['master', 'doctoral'],
    complexity: 'advanced',
    typicalWordCount: {
      undergraduate: { min: 3000, max: 5500 },
      master: { min: 6000, max: 12000 },
      doctoral: { min: 12000, max: 20000 }
    },
    coreFeatures: [
      'Linguistic Analysis',
      'Social Context Examination',
      'Power Relations Study',
      'Ideological Critique',
      'Meaning Construction Analysis',
      'Critical Discourse Methods'
    ],
    requiredSections: [
      'Introduction with Discourse Focus',
      'Theoretical Framework',
      'Methodology and Analytical Approach',
      'Context and Data Description',
      'Detailed Discourse Analysis',
      'Critical Interpretation',
      'Discussion of Findings',
      'Conclusion with Broader Implications',
      'References'
    ],
    optionalSections: [
      'Historical Context',
      'Comparative Discourse Analysis',
      'Multimodal Analysis',
      'Participant Perspectives',
      'Policy Implications',
      'Methodological Reflections'
    ],
    citationStyles: ['APA', 'MLA', 'Chicago', 'Harvard'],
    keywords: [
      'discourse', 'language', 'communication', 'speech', 'conversation', 'text',
      'linguistic', 'rhetoric', 'power', 'ideology', 'social construction',
      'meaning', 'context', 'pragmatics', 'semiotics', 'narrative', 'dialogue',
      'verbal', 'non-verbal', 'critical discourse analysis', 'CDA'
    ],
    relatedTypes: ['cultural-analysis', 'theoretical-discussion', 'linguistic-study']
  },

  'theoretical-discussion': {
    id: 'theoretical-discussion',
    name: { 
      en: 'Theoretical Discussion Paper', 
      zh: '理论探讨论文' 
    },
    description: { 
      en: 'Exploration, development, and critical examination of theoretical concepts, frameworks, and philosophical ideas',
      zh: '探索、发展和批判性审视理论概念、框架和哲学思想的论文'
    },
    icon: 'Brain',
    color: 'violet',
    academicLevels: ['master', 'doctoral'],
    complexity: 'advanced',
    typicalWordCount: {
      undergraduate: { min: 4000, max: 7000 },
      master: { min: 8000, max: 15000 },
      doctoral: { min: 15000, max: 30000 }
    },
    coreFeatures: [
      'Theoretical Framework Development',
      'Conceptual Analysis',
      'Philosophical Examination',
      'Abstract Reasoning',
      'Intellectual Innovation',
      'Paradigmatic Thinking'
    ],
    requiredSections: [
      'Introduction with Theoretical Focus',
      'Literature Review of Theoretical Background',
      'Conceptual Framework Development',
      'Theoretical Analysis and Discussion',
      'Critical Examination of Concepts',
      'Implications and Applications',
      'Conclusion with Theoretical Contributions',
      'References'
    ],
    optionalSections: [
      'Historical Development of Theory',
      'Comparative Theoretical Analysis',
      'Philosophical Foundations',
      'Empirical Applications',
      'Future Theoretical Directions',
      'Methodological Considerations'
    ],
    citationStyles: ['APA', 'Chicago', 'Harvard', 'MLA'],
    keywords: [
      'theory', 'theoretical', 'concept', 'conceptual', 'framework', 'model',
      'philosophy', 'philosophical', 'abstract', 'principle', 'idea', 'notion',
      'construct', 'paradigm', 'hypothesis', 'assumption', 'proposition',
      'speculation', 'reflection', 'intellectual', 'scholarly'
    ],
    relatedTypes: ['literature-review', 'discourse-analysis', 'philosophical-inquiry']
  },

  'dissertation-thesis': {
    id: 'dissertation-thesis',
    name: { 
      en: 'Dissertation/Thesis', 
      zh: '学位论文' 
    },
    description: { 
      en: 'Comprehensive academic work demonstrating mastery of field and original scholarly contribution',
      zh: '展示专业领域掌握程度和原创学术贡献的综合性学术作品'
    },
    icon: 'GraduationCap',
    color: 'amber',
    academicLevels: ['master', 'doctoral'],
    complexity: 'advanced',
    typicalWordCount: {
      undergraduate: { min: 10000, max: 20000 },
      master: { min: 20000, max: 40000 },
      doctoral: { min: 60000, max: 120000 }
    },
    coreFeatures: [
      'Comprehensive Research',
      'Original Contribution',
      'Rigorous Methodology',
      'Extensive Literature Review',
      'Systematic Analysis',
      'Scholarly Writing Excellence'
    ],
    requiredSections: [
      'Title Page and Abstract',
      'Table of Contents',
      'Introduction with Research Questions',
      'Comprehensive Literature Review',
      'Theoretical Framework',
      'Methodology and Research Design',
      'Data Analysis and Results',
      'Discussion and Interpretation',
      'Conclusion and Contributions',
      'References/Bibliography',
      'Appendices'
    ],
    optionalSections: [
      'Acknowledgments',
      'List of Figures and Tables',
      'Glossary of Terms',
      'Index',
      'Supplementary Materials',
      'Ethics Approval Documentation'
    ],
    citationStyles: ['APA', 'MLA', 'Chicago', 'Harvard', 'IEEE', 'Institutional Style'],
    keywords: [
      'dissertation', 'thesis', 'degree', 'phd', 'doctoral', 'master', 'graduate',
      'comprehensive', 'extensive', 'original', 'contribution', 'research',
      'academic', 'scholarship', 'investigation', 'detailed study', 'in-depth analysis',
      'doctoral thesis', 'master\'s thesis', 'graduate research'
    ],
    relatedTypes: ['empirical-research', 'literature-review', 'theoretical-discussion']
  }
};

/**
 * 获取论文类型定义
 */
export function getPaperTypeDefinition(paperType: EnglishPaperType): PaperTypeDefinition {
  return PAPER_TYPE_DEFINITIONS[paperType];
}

/**
 * 获取所有论文类型定义
 */
export function getAllPaperTypeDefinitions(): PaperTypeDefinition[] {
  return Object.values(PAPER_TYPE_DEFINITIONS);
}

/**
 * 根据学术层次过滤论文类型
 */
export function getPaperTypesByLevel(level: AcademicLevel): PaperTypeDefinition[] {
  return getAllPaperTypeDefinitions().filter(def => 
    def.academicLevels.includes(level)
  );
}

/**
 * 根据复杂度过滤论文类型
 */
export function getPaperTypesByComplexity(complexity: 'basic' | 'intermediate' | 'advanced'): PaperTypeDefinition[] {
  return getAllPaperTypeDefinitions().filter(def => 
    def.complexity === complexity
  );
}

/**
 * 搜索论文类型
 */
export function searchPaperTypes(query: string): PaperTypeDefinition[] {
  const lowercaseQuery = query.toLowerCase();
  return getAllPaperTypeDefinitions().filter(def => 
    def.name.en.toLowerCase().includes(lowercaseQuery) ||
    def.name.zh.includes(query) ||
    def.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery)) ||
    def.description.en.toLowerCase().includes(lowercaseQuery) ||
    def.description.zh.includes(query)
  );
}

/**
 * 获取相关论文类型
 */
export function getRelatedPaperTypes(paperType: EnglishPaperType): PaperTypeDefinition[] {
  const definition = getPaperTypeDefinition(paperType);
  return definition.relatedTypes.map(type => getPaperTypeDefinition(type));
}

/**
 * 验证论文类型和学术层次的匹配
 */
export function validatePaperTypeLevel(paperType: EnglishPaperType, level: AcademicLevel): boolean {
  const definition = getPaperTypeDefinition(paperType);
  return definition.academicLevels.includes(level);
}

/**
 * 获取论文类型的推荐字数范围
 */
export function getWordCountRange(paperType: EnglishPaperType, level: AcademicLevel): { min: number; max: number } {
  const definition = getPaperTypeDefinition(paperType);
  return definition.typicalWordCount[level];
}

/**
 * 获取论文类型的推荐引用格式
 */
export function getRecommendedCitationStyles(paperType: EnglishPaperType): string[] {
  const definition = getPaperTypeDefinition(paperType);
  return definition.citationStyles;
}