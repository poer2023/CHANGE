import { EnglishPaperType, AcademicLevel, FormatPreferences } from '@/types/paper-types';

// 论文类型样式配置
export interface PaperTypeStyleConfig {
  id: EnglishPaperType;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    codeFont: string;
    fontSize: {
      base: string;
      sm: string;
      lg: string;
      xl: string;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
  spacing: {
    section: string;
    paragraph: string;
    list: string;
  };
  components: {
    moduleCard: string;
    writingArea: string;
    sidebar: string;
    toolbar: string;
  };
  icons: {
    primary: string;
    secondary: string[];
  };
}

// 格式配置
export interface PaperFormatConfig {
  paperType: EnglishPaperType;
  academicLevel: AcademicLevel;
  citation: {
    style: string;
    inText: {
      format: string;
      examples: string[];
    };
    bibliography: {
      format: string;
      examples: string[];
    };
  };
  structure: {
    headerLevels: number;
    numbering: boolean;
    pageNumbers: boolean;
    tableOfContents: boolean;
  };
  formatting: {
    margins: string;
    lineSpacing: string;
    fontFamily: string;
    fontSize: string;
    indent: string;
  };
  requirements: {
    abstract: boolean;
    keywords: boolean;
    acknowledgments: boolean;
    appendices: boolean;
  };
}

// 论文类型样式配置
export const PAPER_TYPE_STYLES: Record<EnglishPaperType, PaperTypeStyleConfig> = {
  'literary-analysis': {
    id: 'literary-analysis',
    name: 'Literary Analysis',
    colors: {
      primary: '#6366f1', // indigo-500
      secondary: '#a5b4fc', // indigo-300
      accent: '#312e81', // indigo-900
      background: '#f8fafc', // slate-50
      text: '#1e293b', // slate-800
      border: '#e2e8f0' // slate-200
    },
    typography: {
      headingFont: 'ui-serif, Georgia, serif',
      bodyFont: 'ui-serif, Georgia, serif',
      codeFont: 'ui-monospace, monospace',
      fontSize: {
        base: '16px',
        sm: '14px',
        lg: '18px',
        xl: '20px'
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.6',
        relaxed: '1.8'
      }
    },
    spacing: {
      section: '2rem',
      paragraph: '1.25rem',
      list: '0.75rem'
    },
    components: {
      moduleCard: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300',
      writingArea: 'bg-white border-indigo-100 focus:border-indigo-300',
      sidebar: 'bg-indigo-50',
      toolbar: 'bg-indigo-100 border-indigo-200'
    },
    icons: {
      primary: 'BookOpen',
      secondary: ['FileText', 'Quote', 'Search']
    }
  },

  'comparative-analysis': {
    id: 'comparative-analysis',
    name: 'Comparative Analysis',
    colors: {
      primary: '#3b82f6', // blue-500
      secondary: '#93c5fd', // blue-300
      accent: '#1e40af', // blue-800
      background: '#f8fafc',
      text: '#1e293b',
      border: '#e2e8f0'
    },
    typography: {
      headingFont: 'ui-sans-serif, system-ui, sans-serif',
      bodyFont: 'ui-sans-serif, system-ui, sans-serif',
      codeFont: 'ui-monospace, monospace',
      fontSize: {
        base: '16px',
        sm: '14px',
        lg: '18px',
        xl: '20px'
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75'
      }
    },
    spacing: {
      section: '2rem',
      paragraph: '1rem',
      list: '0.5rem'
    },
    components: {
      moduleCard: 'bg-blue-50 border-blue-200 hover:border-blue-300',
      writingArea: 'bg-white border-blue-100 focus:border-blue-300',
      sidebar: 'bg-blue-50',
      toolbar: 'bg-blue-100 border-blue-200'
    },
    icons: {
      primary: 'Layers',
      secondary: ['BarChart3', 'ArrowLeftRight', 'Scale']
    }
  },

  'cultural-analysis': {
    id: 'cultural-analysis',
    name: 'Cultural Analysis',
    colors: {
      primary: '#8b5cf6', // violet-500
      secondary: '#c4b5fd', // violet-300
      accent: '#5b21b6', // violet-800
      background: '#fefbff',
      text: '#1e1b4b',
      border: '#e7e5e4'
    },
    typography: {
      headingFont: 'ui-serif, Georgia, serif',
      bodyFont: 'ui-serif, Georgia, serif',
      codeFont: 'ui-monospace, monospace',
      fontSize: {
        base: '16px',
        sm: '14px',
        lg: '18px',
        xl: '20px'
      },
      lineHeight: {
        tight: '1.3',
        normal: '1.6',
        relaxed: '1.8'
      }
    },
    spacing: {
      section: '2.5rem',
      paragraph: '1.5rem',
      list: '1rem'
    },
    components: {
      moduleCard: 'bg-violet-50 border-violet-200 hover:border-violet-300',
      writingArea: 'bg-white border-violet-100 focus:border-violet-300',
      sidebar: 'bg-violet-50',
      toolbar: 'bg-violet-100 border-violet-200'
    },
    icons: {
      primary: 'Users',
      secondary: ['Globe', 'Heart', 'Eye']
    }
  },

  'literature-review': {
    id: 'literature-review',
    name: 'Literature Review',
    colors: {
      primary: '#10b981', // emerald-500
      secondary: '#6ee7b7', // emerald-300
      accent: '#047857', // emerald-700
      background: '#f0fdf4',
      text: '#064e3b',
      border: '#d1fae5'
    },
    typography: {
      headingFont: 'ui-sans-serif, system-ui, sans-serif',
      bodyFont: 'ui-sans-serif, system-ui, sans-serif',
      codeFont: 'ui-monospace, monospace',
      fontSize: {
        base: '15px',
        sm: '13px',
        lg: '17px',
        xl: '19px'
      },
      lineHeight: {
        tight: '1.4',
        normal: '1.6',
        relaxed: '1.8'
      }
    },
    spacing: {
      section: '1.5rem',
      paragraph: '1rem',
      list: '0.5rem'
    },
    components: {
      moduleCard: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300',
      writingArea: 'bg-white border-emerald-100 focus:border-emerald-300',
      sidebar: 'bg-emerald-50',
      toolbar: 'bg-emerald-100 border-emerald-200'
    },
    icons: {
      primary: 'Search',
      secondary: ['Library', 'BookStack', 'Filter']
    }
  },

  'critical-review': {
    id: 'critical-review',
    name: 'Critical Review',
    colors: {
      primary: '#ef4444', // red-500
      secondary: '#fca5a5', // red-300
      accent: '#b91c1c', // red-700
      background: '#fefefe',
      text: '#7f1d1d',
      border: '#fed7d7'
    },
    typography: {
      headingFont: 'ui-serif, Georgia, serif',
      bodyFont: 'ui-serif, Georgia, serif',
      codeFont: 'ui-monospace, monospace',
      fontSize: {
        base: '16px',
        sm: '14px',
        lg: '18px',
        xl: '20px'
      },
      lineHeight: {
        tight: '1.3',
        normal: '1.5',
        relaxed: '1.7'
      }
    },
    spacing: {
      section: '2rem',
      paragraph: '1.25rem',
      list: '0.75rem'
    },
    components: {
      moduleCard: 'bg-red-50 border-red-200 hover:border-red-300',
      writingArea: 'bg-white border-red-100 focus:border-red-300',
      sidebar: 'bg-red-50',
      toolbar: 'bg-red-100 border-red-200'
    },
    icons: {
      primary: 'MessageSquare',
      secondary: ['AlertTriangle', 'CheckCircle', 'XCircle']
    }
  },

  'empirical-research': {
    id: 'empirical-research',
    name: 'Empirical Research',
    colors: {
      primary: '#06b6d4', // cyan-500
      secondary: '#67e8f9', // cyan-300
      accent: '#0e7490', // cyan-700
      background: '#f0fdff',
      text: '#083344',
      border: '#cffafe'
    },
    typography: {
      headingFont: 'ui-sans-serif, system-ui, sans-serif',
      bodyFont: 'ui-sans-serif, system-ui, sans-serif',
      codeFont: 'ui-monospace, monospace',
      fontSize: {
        base: '15px',
        sm: '13px',
        lg: '17px',
        xl: '19px'
      },
      lineHeight: {
        tight: '1.4',
        normal: '1.5',
        relaxed: '1.7'
      }
    },
    spacing: {
      section: '2rem',
      paragraph: '1rem',
      list: '0.5rem'
    },
    components: {
      moduleCard: 'bg-cyan-50 border-cyan-200 hover:border-cyan-300',
      writingArea: 'bg-white border-cyan-100 focus:border-cyan-300',
      sidebar: 'bg-cyan-50',
      toolbar: 'bg-cyan-100 border-cyan-200'
    },
    icons: {
      primary: 'TrendingUp',
      secondary: ['BarChart', 'PieChart', 'Activity']
    }
  },

  'case-study': {
    id: 'case-study',
    name: 'Case Study',
    colors: {
      primary: '#f97316', // orange-500
      secondary: '#fdba74', // orange-300
      accent: '#c2410c', // orange-700
      background: '#fffbeb',
      text: '#9a3412',
      border: '#fed7aa'
    },
    typography: {
      headingFont: 'ui-sans-serif, system-ui, sans-serif',
      bodyFont: 'ui-sans-serif, system-ui, sans-serif',
      codeFont: 'ui-monospace, monospace',
      fontSize: {
        base: '16px',
        sm: '14px',
        lg: '18px',
        xl: '20px'
      },
      lineHeight: {
        tight: '1.3',
        normal: '1.6',
        relaxed: '1.8'
      }
    },
    spacing: {
      section: '2rem',
      paragraph: '1.5rem',
      list: '1rem'
    },
    components: {
      moduleCard: 'bg-orange-50 border-orange-200 hover:border-orange-300',
      writingArea: 'bg-white border-orange-100 focus:border-orange-300',
      sidebar: 'bg-orange-50',
      toolbar: 'bg-orange-100 border-orange-200'
    },
    icons: {
      primary: 'Target',
      secondary: ['Microscope', 'Focus', 'Zoom']
    }
  },

  'discourse-analysis': {
    id: 'discourse-analysis',
    name: 'Discourse Analysis',
    colors: {
      primary: '#14b8a6', // teal-500
      secondary: '#5eead4', // teal-300
      accent: '#0f766e', // teal-700
      background: '#f0fdfa',
      text: '#134e4a',
      border: '#ccfbf1'
    },
    typography: {
      headingFont: 'ui-serif, Georgia, serif',
      bodyFont: 'ui-serif, Georgia, serif',
      codeFont: 'ui-monospace, monospace',
      fontSize: {
        base: '16px',
        sm: '14px',
        lg: '18px',
        xl: '20px'
      },
      lineHeight: {
        tight: '1.4',
        normal: '1.6',
        relaxed: '1.8'
      }
    },
    spacing: {
      section: '2rem',
      paragraph: '1.25rem',
      list: '0.75rem'
    },
    components: {
      moduleCard: 'bg-teal-50 border-teal-200 hover:border-teal-300',
      writingArea: 'bg-white border-teal-100 focus:border-teal-300',
      sidebar: 'bg-teal-50',
      toolbar: 'bg-teal-100 border-teal-200'
    },
    icons: {
      primary: 'MessageSquare',
      secondary: ['Mic', 'Volume2', 'Type']
    }
  },

  'theoretical-discussion': {
    id: 'theoretical-discussion',
    name: 'Theoretical Discussion',
    colors: {
      primary: '#7c3aed', // violet-600
      secondary: '#c4b5fd', // violet-300
      accent: '#4c1d95', // violet-900
      background: '#faf7ff',
      text: '#3c1361',
      border: '#e9d5ff'
    },
    typography: {
      headingFont: 'ui-serif, Georgia, serif',
      bodyFont: 'ui-serif, Georgia, serif',
      codeFont: 'ui-monospace, monospace',
      fontSize: {
        base: '17px',
        sm: '15px',
        lg: '19px',
        xl: '21px'
      },
      lineHeight: {
        tight: '1.4',
        normal: '1.7',
        relaxed: '1.9'
      }
    },
    spacing: {
      section: '2.5rem',
      paragraph: '1.5rem',
      list: '1rem'
    },
    components: {
      moduleCard: 'bg-violet-50 border-violet-200 hover:border-violet-300',
      writingArea: 'bg-white border-violet-100 focus:border-violet-300',
      sidebar: 'bg-violet-50',
      toolbar: 'bg-violet-100 border-violet-200'
    },
    icons: {
      primary: 'Brain',
      secondary: ['Lightbulb', 'Puzzle', 'Atom']
    }
  },

  'dissertation-thesis': {
    id: 'dissertation-thesis',
    name: 'Dissertation/Thesis',
    colors: {
      primary: '#d97706', // amber-600
      secondary: '#fcd34d', // amber-300
      accent: '#92400e', // amber-800
      background: '#fffbeb',
      text: '#78350f',
      border: '#fed7aa'
    },
    typography: {
      headingFont: 'ui-serif, Georgia, serif',
      bodyFont: 'ui-serif, Georgia, serif',
      codeFont: 'ui-monospace, monospace',
      fontSize: {
        base: '16px',
        sm: '14px',
        lg: '18px',
        xl: '20px'
      },
      lineHeight: {
        tight: '1.5',
        normal: '1.7',
        relaxed: '1.9'
      }
    },
    spacing: {
      section: '3rem',
      paragraph: '1.5rem',
      list: '1rem'
    },
    components: {
      moduleCard: 'bg-amber-50 border-amber-200 hover:border-amber-300',
      writingArea: 'bg-white border-amber-100 focus:border-amber-300',
      sidebar: 'bg-amber-50',
      toolbar: 'bg-amber-100 border-amber-200'
    },
    icons: {
      primary: 'GraduationCap',
      secondary: ['Award', 'Trophy', 'Star']
    }
  }
};

// 格式配置
export const PAPER_FORMAT_CONFIGS: Record<string, PaperFormatConfig> = {
  // 文学分析论文 - 本科
  'literary-analysis-undergraduate': {
    paperType: 'literary-analysis',
    academicLevel: 'undergraduate',
    citation: {
      style: 'MLA',
      inText: {
        format: '(Author Page)',
        examples: ['(Smith 42)', '(Johnson and Brown 15)']
      },
      bibliography: {
        format: 'Works Cited',
        examples: [
          'Smith, John. "Title of Essay." Title of Book, Publisher, Year, pp. 42-58.',
          'Author, Name. Title of Book. Publisher, Year.'
        ]
      }
    },
    structure: {
      headerLevels: 2,
      numbering: false,
      pageNumbers: true,
      tableOfContents: false
    },
    formatting: {
      margins: '1 inch',
      lineSpacing: 'double',
      fontFamily: 'Times New Roman',
      fontSize: '12pt',
      indent: '0.5 inch'
    },
    requirements: {
      abstract: false,
      keywords: false,
      acknowledgments: false,
      appendices: false
    }
  },

  // 文学分析论文 - 硕士
  'literary-analysis-master': {
    paperType: 'literary-analysis',
    academicLevel: 'master',
    citation: {
      style: 'MLA',
      inText: {
        format: '(Author Page)',
        examples: ['(Smith 42)', '(Johnson and Brown 15)']
      },
      bibliography: {
        format: 'Works Cited',
        examples: [
          'Smith, John. "Title of Essay." Title of Book, Publisher, Year, pp. 42-58.',
          'Author, Name. Title of Book. Publisher, Year.'
        ]
      }
    },
    structure: {
      headerLevels: 3,
      numbering: true,
      pageNumbers: true,
      tableOfContents: true
    },
    formatting: {
      margins: '1 inch',
      lineSpacing: 'double',
      fontFamily: 'Times New Roman',
      fontSize: '12pt',
      indent: '0.5 inch'
    },
    requirements: {
      abstract: true,
      keywords: true,
      acknowledgments: false,
      appendices: false
    }
  },

  // 实证研究论文 - 硕士
  'empirical-research-master': {
    paperType: 'empirical-research',
    academicLevel: 'master',
    citation: {
      style: 'APA',
      inText: {
        format: '(Author, Year)',
        examples: ['(Smith, 2023)', '(Johnson & Brown, 2022)']
      },
      bibliography: {
        format: 'References',
        examples: [
          'Smith, J. (2023). Title of article. Journal Name, 15(3), 42-58.',
          'Johnson, M., & Brown, L. (2022). Book title. Publisher.'
        ]
      }
    },
    structure: {
      headerLevels: 4,
      numbering: true,
      pageNumbers: true,
      tableOfContents: true
    },
    formatting: {
      margins: '1 inch',
      lineSpacing: 'double',
      fontFamily: 'Times New Roman',
      fontSize: '12pt',
      indent: '0.5 inch'
    },
    requirements: {
      abstract: true,
      keywords: true,
      acknowledgments: true,
      appendices: true
    }
  },

  // 学位论文 - 博士
  'dissertation-thesis-doctoral': {
    paperType: 'dissertation-thesis',
    academicLevel: 'doctoral',
    citation: {
      style: 'APA',
      inText: {
        format: '(Author, Year)',
        examples: ['(Smith, 2023)', '(Johnson & Brown, 2022)']
      },
      bibliography: {
        format: 'References',
        examples: [
          'Smith, J. (2023). Title of article. Journal Name, 15(3), 42-58.',
          'Johnson, M., & Brown, L. (2022). Book title. Publisher.'
        ]
      }
    },
    structure: {
      headerLevels: 5,
      numbering: true,
      pageNumbers: true,
      tableOfContents: true
    },
    formatting: {
      margins: '1.5 inch left, 1 inch others',
      lineSpacing: 'double',
      fontFamily: 'Times New Roman',
      fontSize: '12pt',
      indent: '0.5 inch'
    },
    requirements: {
      abstract: true,
      keywords: true,
      acknowledgments: true,
      appendices: true
    }
  }
};

// 样式配置管理器
export class PaperStyleManager {
  /**
   * 获取论文类型的样式配置
   */
  getStyleConfig(paperType: EnglishPaperType): PaperTypeStyleConfig {
    return PAPER_TYPE_STYLES[paperType] || PAPER_TYPE_STYLES['literary-analysis'];
  }

  /**
   * 获取格式配置
   */
  getFormatConfig(paperType: EnglishPaperType, academicLevel: AcademicLevel): PaperFormatConfig {
    const key = `${paperType}-${academicLevel}`;
    return PAPER_FORMAT_CONFIGS[key] || this.getDefaultFormatConfig(paperType, academicLevel);
  }

  /**
   * 生成CSS变量
   */
  generateCSSVariables(paperType: EnglishPaperType): Record<string, string> {
    const config = this.getStyleConfig(paperType);
    
    return {
      '--paper-primary-color': config.colors.primary,
      '--paper-secondary-color': config.colors.secondary,
      '--paper-accent-color': config.colors.accent,
      '--paper-background-color': config.colors.background,
      '--paper-text-color': config.colors.text,
      '--paper-border-color': config.colors.border,
      '--paper-heading-font': config.typography.headingFont,
      '--paper-body-font': config.typography.bodyFont,
      '--paper-code-font': config.typography.codeFont,
      '--paper-font-size-base': config.typography.fontSize.base,
      '--paper-line-height-normal': config.typography.lineHeight.normal,
      '--paper-section-spacing': config.spacing.section,
      '--paper-paragraph-spacing': config.spacing.paragraph
    };
  }

  /**
   * 应用样式到文档
   */
  applyStyles(paperType: EnglishPaperType): void {
    const variables = this.generateCSSVariables(paperType);
    const root = document.documentElement;
    
    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  /**
   * 获取模块卡片样式类
   */
  getModuleCardClasses(paperType: EnglishPaperType): string {
    const config = this.getStyleConfig(paperType);
    return config.components.moduleCard;
  }

  /**
   * 获取写作区域样式类
   */
  getWritingAreaClasses(paperType: EnglishPaperType): string {
    const config = this.getStyleConfig(paperType);
    return config.components.writingArea;
  }

  /**
   * 获取侧边栏样式类
   */
  getSidebarClasses(paperType: EnglishPaperType): string {
    const config = this.getStyleConfig(paperType);
    return config.components.sidebar;
  }

  /**
   * 获取工具栏样式类
   */
  getToolbarClasses(paperType: EnglishPaperType): string {
    const config = this.getStyleConfig(paperType);
    return config.components.toolbar;
  }

  /**
   * 获取默认格式配置
   */
  private getDefaultFormatConfig(paperType: EnglishPaperType, academicLevel: AcademicLevel): PaperFormatConfig {
    return {
      paperType,
      academicLevel,
      citation: {
        style: 'APA',
        inText: {
          format: '(Author, Year)',
          examples: ['(Smith, 2023)']
        },
        bibliography: {
          format: 'References',
          examples: ['Smith, J. (2023). Title. Journal, 1(1), 1-10.']
        }
      },
      structure: {
        headerLevels: 3,
        numbering: true,
        pageNumbers: true,
        tableOfContents: academicLevel !== 'undergraduate'
      },
      formatting: {
        margins: '1 inch',
        lineSpacing: 'double',
        fontFamily: 'Times New Roman',
        fontSize: '12pt',
        indent: '0.5 inch'
      },
      requirements: {
        abstract: academicLevel !== 'undergraduate',
        keywords: academicLevel !== 'undergraduate',
        acknowledgments: academicLevel === 'doctoral',
        appendices: false
      }
    };
  }

  /**
   * 导出格式配置为JSON
   */
  exportFormatConfig(paperType: EnglishPaperType, academicLevel: AcademicLevel): string {
    const config = this.getFormatConfig(paperType, academicLevel);
    return JSON.stringify(config, null, 2);
  }

  /**
   * 从用户偏好创建自定义格式配置
   */
  createCustomFormatConfig(
    paperType: EnglishPaperType,
    academicLevel: AcademicLevel,
    preferences: Partial<FormatPreferences>
  ): PaperFormatConfig {
    const baseConfig = this.getFormatConfig(paperType, academicLevel);
    
    return {
      ...baseConfig,
      formatting: {
        ...baseConfig.formatting,
        fontSize: preferences.fontSize ? `${preferences.fontSize}pt` : baseConfig.formatting.fontSize,
        lineSpacing: preferences.lineSpacing ? this.convertLineSpacing(preferences.lineSpacing) : baseConfig.formatting.lineSpacing,
        margins: preferences.marginSize ? `${preferences.marginSize} inch` : baseConfig.formatting.margins
      },
      structure: {
        ...baseConfig.structure,
        pageNumbers: preferences.pageNumbering ?? baseConfig.structure.pageNumbers,
        tableOfContents: preferences.tocGeneration ?? baseConfig.structure.tableOfContents
      },
      citation: {
        ...baseConfig.citation,
        style: preferences.headerStyle || baseConfig.citation.style
      }
    };
  }

  /**
   * 转换行间距格式
   */
  private convertLineSpacing(spacing: number): string {
    if (spacing === 1) return 'single';
    if (spacing === 1.5) return '1.5';
    if (spacing === 2) return 'double';
    return spacing.toString();
  }

  /**
   * 验证格式配置
   */
  validateFormatConfig(config: PaperFormatConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config.citation.style) {
      errors.push('Citation style is required');
    }
    
    if (!config.formatting.fontFamily) {
      errors.push('Font family is required');
    }
    
    if (!config.formatting.fontSize) {
      errors.push('Font size is required');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}