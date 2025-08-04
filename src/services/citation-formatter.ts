/**
 * 引用格式化服务
 * 支持多种学术引用格式的生成和管理
 */

import {
  Reference,
  Author,
  CitationStyle,
  CitationInText,
  Bibliography,
  BibliographyEntry,
  BibliographySettings
} from '../types';

/**
 * 引用格式化器
 */
export class CitationFormatter {
  private formatters: Map<CitationStyle, CitationStyleFormatter>;

  constructor() {
    this.formatters = new Map([
      ['APA', new APAFormatter()],
      ['MLA', new MLAFormatter()],
      ['Chicago', new ChicagoFormatter()],
      ['IEEE', new IEEEFormatter()],
      ['Harvard', new HarvardFormatter()],
      ['Vancouver', new VancouverFormatter()],
      ['AMA', new AMAFormatter()],
      ['ASA', new ASAFormatter()],
      ['APSA', new APSAFormatter()],
      ['CSE', new CSEFormatter()],
      ['GB7714', new GB7714Formatter()]
    ]);
  }

  /**
   * 格式化行内引用
   */
  formatInTextCitation(
    reference: Reference,
    citation: CitationInText,
    style: CitationStyle
  ): string {
    const formatter = this.formatters.get(style);
    if (!formatter) {
      throw new Error(`Unsupported citation style: ${style}`);
    }

    return formatter.formatInText(reference, citation);
  }

  /**
   * 格式化参考文献条目
   */
  formatBibliographyEntry(reference: Reference, style: CitationStyle): string {
    const formatter = this.formatters.get(style);
    if (!formatter) {
      throw new Error(`Unsupported citation style: ${style}`);
    }

    return formatter.formatBibliography(reference);
  }

  /**
   * 生成完整的参考文献列表
   */
  generateBibliography(
    references: Reference[],
    citations: CitationInText[],
    style: CitationStyle,
    settings: BibliographySettings
  ): Bibliography {
    // 过滤出被引用的文献
    const citedReferenceIds = new Set(citations.map(c => c.referenceId));
    const citedReferences = references.filter(ref => citedReferenceIds.has(ref.id));

    // 格式化条目
    const entries: BibliographyEntry[] = citedReferences.map((ref, index) => ({
      referenceId: ref.id,
      formattedText: this.formatBibliographyEntry(ref, style),
      sortKey: this.generateSortKey(ref, settings.sortBy),
      order: index
    }));

    // 排序
    this.sortBibliographyEntries(entries, settings.sortBy);

    // 重新编号
    entries.forEach((entry, index) => {
      entry.order = index + 1;
    });

    const bibliography: Bibliography = {
      id: `bib_${Date.now()}`,
      paperId: '', // 需要从外部传入
      style,
      entries,
      settings,
      generatedAt: new Date()
    };

    return bibliography;
  }

  /**
   * 获取支持的引用格式列表
   */
  getSupportedStyles(): CitationStyle[] {
    return Array.from(this.formatters.keys());
  }

  /**
   * 获取引用格式的示例
   */
  getStyleExample(style: CitationStyle): {
    inText: string;
    bibliography: string;
  } {
    const formatter = this.formatters.get(style);
    if (!formatter) {
      throw new Error(`Unsupported citation style: ${style}`);
    }

    return formatter.getExample();
  }

  /**
   * 验证引用格式
   */
  validateCitation(citation: string, style: CitationStyle): {
    isValid: boolean;
    errors: string[];
    suggestions: string[];
  } {
    const formatter = this.formatters.get(style);
    if (!formatter) {
      return {
        isValid: false,
        errors: [`Unsupported citation style: ${style}`],
        suggestions: []
      };
    }

    return formatter.validate(citation);
  }

  private generateSortKey(reference: Reference, sortBy: string): string {
    switch (sortBy) {
      case 'author':
        return reference.authors[0] 
          ? `${reference.authors[0].lastName}, ${reference.authors[0].firstName}`
          : reference.title;
      case 'year':
        return reference.year.toString().padStart(4, '0');
      case 'title':
        return reference.title.toLowerCase();
      case 'type':
        return reference.type;
      default:
        return reference.title.toLowerCase();
    }
  }

  private sortBibliographyEntries(entries: BibliographyEntry[], sortBy: string): void {
    entries.sort((a, b) => {
      if (sortBy === 'citation-order') {
        return a.order - b.order;
      }
      return a.sortKey.localeCompare(b.sortKey);
    });
  }
}

/**
 * 抽象引用格式化器基类
 */
abstract class CitationStyleFormatter {
  abstract formatInText(reference: Reference, citation: CitationInText): string;
  abstract formatBibliography(reference: Reference): string;
  abstract getExample(): { inText: string; bibliography: string };
  abstract validate(citation: string): { isValid: boolean; errors: string[]; suggestions: string[] };

  protected formatAuthors(authors: Author[], maxAuthors?: number, useEtAl?: boolean): string {
    if (authors.length === 0) return '';

    const shouldTruncate = maxAuthors && authors.length > maxAuthors;
    const authorsToShow = shouldTruncate ? authors.slice(0, maxAuthors) : authors;

    const formattedAuthors = authorsToShow.map(author => 
      `${author.lastName}, ${author.firstName}${author.middleName ? ` ${author.middleName[0]}.` : ''}`
    );

    let result = '';
    if (formattedAuthors.length === 1) {
      result = formattedAuthors[0];
    } else if (formattedAuthors.length === 2) {
      result = `${formattedAuthors[0]} & ${formattedAuthors[1]}`;
    } else {
      result = `${formattedAuthors.slice(0, -1).join(', ')}, & ${formattedAuthors[formattedAuthors.length - 1]}`;
    }

    if (shouldTruncate && useEtAl) {
      result += ', et al.';
    }

    return result;
  }

  protected formatTitle(title: string, isJournal: boolean = false): string {
    if (isJournal) {
      return `<em>${title}</em>`;
    }
    return title;
  }

  protected formatYear(year: number): string {
    return `(${year})`;
  }

  protected formatPages(pages?: string): string {
    if (!pages) return '';
    
    if (pages.includes('-')) {
      return `pp. ${pages}`;
    }
    return `p. ${pages}`;
  }

  protected cleanDOI(doi?: string): string {
    if (!doi) return '';
    
    // 移除DOI前缀
    return doi.replace(/^(doi:|DOI:|https?:\/\/(dx\.)?doi\.org\/)/i, '');
  }
}

/**
 * APA格式化器
 */
class APAFormatter extends CitationStyleFormatter {
  formatInText(reference: Reference, citation: CitationInText): string {
    const authors = reference.authors;
    let authorText = '';

    if (authors.length === 0) {
      authorText = reference.title.split(' ').slice(0, 2).join(' ');
    } else if (authors.length === 1) {
      authorText = authors[0].lastName;
    } else if (authors.length === 2) {
      authorText = `${authors[0].lastName} & ${authors[1].lastName}`;
    } else {
      authorText = `${authors[0].lastName} et al.`;
    }

    let result = '';
    
    if (citation.type === 'narrative') {
      result = `${authorText} (${reference.year})`;
    } else {
      result = `(${authorText}, ${reference.year}`;
      
      if (citation.pageNumbers) {
        result += `, p. ${citation.pageNumbers}`;
      }
      
      result += ')';
    }

    if (citation.prefix) {
      result = `${citation.prefix} ${result}`;
    }
    
    if (citation.suffix) {
      result = `${result} ${citation.suffix}`;
    }

    return result;
  }

  formatBibliography(reference: Reference): string {
    const authors = this.formatAuthors(reference.authors);
    const year = reference.year;
    const title = reference.title;

    let result = `${authors} (${year}). ${title}.`;

    switch (reference.type) {
      case 'journal':
        if (reference.journal) {
          result += ` <em>${reference.journal}</em>`;
          if (reference.volume) {
            result += `, <em>${reference.volume}</em>`;
            if (reference.issue) {
              result += `(${reference.issue})`;
            }
            if (reference.pages) {
              result += `, ${reference.pages}`;
            }
          }
        }
        break;

      case 'book':
        if (reference.publisher) {
          result += ` ${reference.publisher}`;
        }
        break;

      case 'conference':
        if (reference.conferenceName) {
          result += ` <em>${reference.conferenceName}</em>`;
          if (reference.pages) {
            result += `, ${reference.pages}`;
          }
        }
        break;

      case 'webpage':
        if (reference.url) {
          result += ` Retrieved from ${reference.url}`;
        }
        break;
    }

    if (reference.doi) {
      result += ` https://doi.org/${this.cleanDOI(reference.doi)}`;
    }

    return result;
  }

  getExample(): { inText: string; bibliography: string } {
    return {
      inText: '(Smith, 2023)',
      bibliography: 'Smith, J. (2023). Example article title. <em>Journal Name</em>, <em>10</em>(2), 123-135. https://doi.org/10.1000/example'
    };
  }

  validate(citation: string): { isValid: boolean; errors: string[]; suggestions: string[] } {
    const errors: string[] = [];
    const suggestions: string[] = [];

    // 基本的APA格式验证
    if (!citation.includes('(') || !citation.includes(')')) {
      errors.push('APA in-text citations should be enclosed in parentheses');
      suggestions.push('Use format: (Author, Year)');
    }

    // 检查年份格式
    const yearMatch = citation.match(/\b(19|20)\d{2}\b/);
    if (!yearMatch) {
      errors.push('Year should be a 4-digit number');
      suggestions.push('Include publication year in format: (Author, 2023)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions
    };
  }
}

/**
 * MLA格式化器
 */
class MLAFormatter extends CitationStyleFormatter {
  formatInText(reference: Reference, citation: CitationInText): string {
    const authors = reference.authors;
    let authorText = '';

    if (authors.length === 0) {
      authorText = reference.title.split(' ').slice(0, 2).join(' ');
    } else if (authors.length === 1) {
      authorText = authors[0].lastName;
    } else if (authors.length === 2) {
      authorText = `${authors[0].lastName} and ${authors[1].lastName}`;
    } else {
      authorText = `${authors[0].lastName} et al.`;
    }

    let result = `(${authorText}`;
    
    if (citation.pageNumbers) {
      result += ` ${citation.pageNumbers}`;
    }
    
    result += ')';

    return result;
  }

  formatBibliography(reference: Reference): string {
    const authors = reference.authors;
    let authorText = '';

    if (authors.length === 0) {
      authorText = reference.title;
    } else if (authors.length === 1) {
      authorText = `${authors[0].lastName}, ${authors[0].firstName}`;
    } else {
      const firstAuthor = `${authors[0].lastName}, ${authors[0].firstName}`;
      const otherAuthors = authors.slice(1).map(a => `${a.firstName} ${a.lastName}`).join(', ');
      authorText = `${firstAuthor}, and ${otherAuthors}`;
    }

    const title = `"${reference.title}"`;
    let result = `${authorText}. ${title}.`;

    switch (reference.type) {
      case 'journal':
        if (reference.journal) {
          result += ` <em>${reference.journal}</em>`;
          if (reference.volume) {
            result += `, vol. ${reference.volume}`;
            if (reference.issue) {
              result += `, no. ${reference.issue}`;
            }
          }
          result += `, ${reference.year}`;
          if (reference.pages) {
            result += `, pp. ${reference.pages}`;
          }
        }
        break;

      case 'book':
        if (reference.publisher) {
          result += ` ${reference.publisher}, ${reference.year}`;
        }
        break;

      case 'webpage':
        if (reference.url) {
          result += ` Web. ${new Date().toLocaleDateString('en-US')}. <${reference.url}>`;
        }
        break;
    }

    return result;
  }

  getExample(): { inText: string; bibliography: string } {
    return {
      inText: '(Smith 123)',
      bibliography: 'Smith, John. "Example Article Title." <em>Journal Name</em>, vol. 10, no. 2, 2023, pp. 123-135.'
    };
  }

  validate(citation: string): { isValid: boolean; errors: string[]; suggestions: string[] } {
    const errors: string[] = [];
    const suggestions: string[] = [];

    if (!citation.includes('(') || !citation.includes(')')) {
      errors.push('MLA in-text citations should be enclosed in parentheses');
      suggestions.push('Use format: (Author Page)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions
    };
  }
}

/**
 * Chicago格式化器
 */
class ChicagoFormatter extends CitationStyleFormatter {
  formatInText(reference: Reference, citation: CitationInText): string {
    // Chicago注脚格式
    const authors = reference.authors;
    let authorText = '';

    if (authors.length === 0) {
      authorText = reference.title;
    } else if (authors.length === 1) {
      authorText = `${authors[0].firstName} ${authors[0].lastName}`;
    } else if (authors.length <= 3) {
      const authorNames = authors.map(a => `${a.firstName} ${a.lastName}`);
      authorText = authorNames.slice(0, -1).join(', ') + ', and ' + authorNames[authorNames.length - 1];
    } else {
      authorText = `${authors[0].firstName} ${authors[0].lastName} et al.`;
    }

    let result = `${authorText}, "${reference.title}"`;

    if (reference.journal) {
      result += `, <em>${reference.journal}</em>`;
    }

    if (citation.pageNumbers) {
      result += `, ${citation.pageNumbers}`;
    }

    return result;
  }

  formatBibliography(reference: Reference): string {
    const authors = reference.authors;
    let authorText = '';

    if (authors.length === 0) {
      authorText = reference.title;
    } else if (authors.length === 1) {
      authorText = `${authors[0].lastName}, ${authors[0].firstName}`;
    } else {
      const firstAuthor = `${authors[0].lastName}, ${authors[0].firstName}`;
      const otherAuthors = authors.slice(1).map(a => `${a.firstName} ${a.lastName}`).join(', ');
      authorText = `${firstAuthor}, and ${otherAuthors}`;
    }

    let result = `${authorText}. "${reference.title}."`;

    switch (reference.type) {
      case 'journal':
        if (reference.journal) {
          result += ` <em>${reference.journal}</em>`;
          if (reference.volume) {
            result += ` ${reference.volume}`;
            if (reference.issue) {
              result += `, no. ${reference.issue}`;
            }
          }
          result += ` (${reference.year})`;
          if (reference.pages) {
            result += `: ${reference.pages}`;
          }
        }
        break;

      case 'book':
        if (reference.publisher) {
          result += ` ${reference.publisher}, ${reference.year}`;
        }
        break;
    }

    if (reference.doi) {
      result += ` https://doi.org/${this.cleanDOI(reference.doi)}`;
    }

    return result;
  }

  getExample(): { inText: string; bibliography: string } {
    return {
      inText: 'John Smith, "Example Article Title," Journal Name, 123',
      bibliography: 'Smith, John. "Example Article Title." <em>Journal Name</em> 10, no. 2 (2023): 123-135. https://doi.org/10.1000/example'
    };
  }

  validate(citation: string): { isValid: boolean; errors: string[]; suggestions: string[] } {
    return {
      isValid: true,
      errors: [],
      suggestions: []
    };
  }
}

/**
 * IEEE格式化器
 */
class IEEEFormatter extends CitationStyleFormatter {
  private citationNumbers: Map<string, number> = new Map();
  private nextNumber = 1;

  formatInText(reference: Reference, citation: CitationInText): string {
    // IEEE使用数字引用
    let number = this.citationNumbers.get(reference.id);
    if (!number) {
      number = this.nextNumber++;
      this.citationNumbers.set(reference.id, number);
    }

    return `[${number}]`;
  }

  formatBibliography(reference: Reference): string {
    const number = this.citationNumbers.get(reference.id) || 1;
    const authors = reference.authors.map(a => `${a.firstName[0]}. ${a.lastName}`).join(', ');
    
    let result = `[${number}] ${authors}, "${reference.title},"`;

    switch (reference.type) {
      case 'journal':
        if (reference.journal) {
          result += ` <em>${reference.journal}</em>`;
          if (reference.volume) {
            result += `, vol. ${reference.volume}`;
            if (reference.issue) {
              result += `, no. ${reference.issue}`;
            }
          }
          if (reference.pages) {
            result += `, pp. ${reference.pages}`;
          }
          result += `, ${reference.year}`;
        }
        break;

      case 'conference':
        if (reference.conferenceName) {
          result += ` in <em>${reference.conferenceName}</em>`;
          if (reference.pages) {
            result += `, pp. ${reference.pages}`;
          }
          result += `, ${reference.year}`;
        }
        break;
    }

    if (reference.doi) {
      result += `, doi: ${this.cleanDOI(reference.doi)}`;
    }

    return result + '.';
  }

  getExample(): { inText: string; bibliography: string } {
    return {
      inText: '[1]',
      bibliography: '[1] J. Smith, "Example article title," <em>Journal Name</em>, vol. 10, no. 2, pp. 123-135, 2023, doi: 10.1000/example.'
    };
  }

  validate(citation: string): { isValid: boolean; errors: string[]; suggestions: string[] } {
    const errors: string[] = [];
    const suggestions: string[] = [];

    if (!citation.match(/^\[\d+\]$/)) {
      errors.push('IEEE citations should be in the format [number]');
      suggestions.push('Use format: [1]');
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions
    };
  }
}

/**
 * Harvard格式化器
 */
class HarvardFormatter extends CitationStyleFormatter {
  formatInText(reference: Reference, citation: CitationInText): string {
    const authors = reference.authors;
    let authorText = '';

    if (authors.length === 0) {
      authorText = reference.title.split(' ').slice(0, 2).join(' ');
    } else if (authors.length === 1) {
      authorText = authors[0].lastName;
    } else if (authors.length === 2) {
      authorText = `${authors[0].lastName} and ${authors[1].lastName}`;
    } else {
      authorText = `${authors[0].lastName} et al.`;
    }

    let result = `(${authorText} ${reference.year}`;
    
    if (citation.pageNumbers) {
      result += `, p.${citation.pageNumbers}`;
    }
    
    result += ')';

    return result;
  }

  formatBibliography(reference: Reference): string {
    const authors = this.formatAuthors(reference.authors);
    let result = `${authors} (${reference.year}) ${reference.title}.`;

    switch (reference.type) {
      case 'journal':
        if (reference.journal) {
          result += ` <em>${reference.journal}</em>`;
          if (reference.volume) {
            result += `, ${reference.volume}`;
            if (reference.issue) {
              result += `(${reference.issue})`;
            }
          }
          if (reference.pages) {
            result += `, pp.${reference.pages}`;
          }
        }
        break;

      case 'book':
        if (reference.publisher) {
          result += ` ${reference.publisher}`;
        }
        break;
    }

    return result;
  }

  getExample(): { inText: string; bibliography: string } {
    return {
      inText: '(Smith 2023, p.123)',
      bibliography: 'Smith, J. (2023) Example article title. <em>Journal Name</em>, 10(2), pp.123-135.'
    };
  }

  validate(citation: string): { isValid: boolean; errors: string[]; suggestions: string[] } {
    const errors: string[] = [];
    const suggestions: string[] = [];

    if (!citation.includes('(') || !citation.includes(')')) {
      errors.push('Harvard citations should be enclosed in parentheses');
      suggestions.push('Use format: (Author Year)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions
    };
  }
}

/**
 * Vancouver格式化器
 */
class VancouverFormatter extends CitationStyleFormatter {
  private citationNumbers: Map<string, number> = new Map();
  private nextNumber = 1;

  formatInText(reference: Reference, citation: CitationInText): string {
    let number = this.citationNumbers.get(reference.id);
    if (!number) {
      number = this.nextNumber++;
      this.citationNumbers.set(reference.id, number);
    }

    return `(${number})`;
  }

  formatBibliography(reference: Reference): string {
    const number = this.citationNumbers.get(reference.id) || 1;
    const authors = reference.authors.map(a => `${a.lastName} ${a.firstName[0]}`).join(', ');
    
    let result = `${number}. ${authors}. ${reference.title}.`;

    switch (reference.type) {
      case 'journal':
        if (reference.journal) {
          result += ` ${reference.journal}`;
          if (reference.year) {
            result += ` ${reference.year}`;
          }
          if (reference.volume) {
            result += `;${reference.volume}`;
            if (reference.issue) {
              result += `(${reference.issue})`;
            }
          }
          if (reference.pages) {
            result += `:${reference.pages}`;
          }
        }
        break;
    }

    return result + '.';
  }

  getExample(): { inText: string; bibliography: string } {
    return {
      inText: '(1)',
      bibliography: '1. Smith J. Example article title. Journal Name 2023;10(2):123-135.'
    };
  }

  validate(citation: string): { isValid: boolean; errors: string[]; suggestions: string[] } {
    const errors: string[] = [];
    const suggestions: string[] = [];

    if (!citation.match(/^\(\d+\)$/)) {
      errors.push('Vancouver citations should be in the format (number)');
      suggestions.push('Use format: (1)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions
    };
  }
}

// 其他格式化器的基础实现
class AMAFormatter extends CitationStyleFormatter {
  formatInText(reference: Reference, citation: CitationInText): string {
    // AMA格式类似于Vancouver
    return `(${reference.year})`;
  }

  formatBibliography(reference: Reference): string {
    return `${this.formatAuthors(reference.authors)}. ${reference.title}. ${reference.journal || ''}. ${reference.year};${reference.volume}(${reference.issue}):${reference.pages}.`;
  }

  getExample(): { inText: string; bibliography: string } {
    return {
      inText: '(2023)',
      bibliography: 'Smith J. Example article title. Journal Name. 2023;10(2):123-135.'
    };
  }

  validate(citation: string): { isValid: boolean; errors: string[]; suggestions: string[] } {
    return { isValid: true, errors: [], suggestions: [] };
  }
}

class ASAFormatter extends CitationStyleFormatter {
  formatInText(reference: Reference, citation: CitationInText): string {
    const authors = reference.authors;
    let authorText = authors.length > 0 ? authors[0].lastName : 'Unknown';
    return `(${authorText} ${reference.year})`;
  }

  formatBibliography(reference: Reference): string {
    return `${this.formatAuthors(reference.authors)}. ${reference.year}. "${reference.title}." ${reference.journal} ${reference.volume}:${reference.pages}.`;
  }

  getExample(): { inText: string; bibliography: string } {
    return {
      inText: '(Smith 2023)',
      bibliography: 'Smith, John. 2023. "Example Article Title." Journal Name 10:123-135.'
    };
  }

  validate(citation: string): { isValid: boolean; errors: string[]; suggestions: string[] } {
    return { isValid: true, errors: [], suggestions: [] };
  }
}

class APSAFormatter extends CitationStyleFormatter {
  formatInText(reference: Reference, citation: CitationInText): string {
    const authors = reference.authors;
    let authorText = authors.length > 0 ? authors[0].lastName : 'Unknown';
    return `(${authorText} ${reference.year})`;
  }

  formatBibliography(reference: Reference): string {
    return `${this.formatAuthors(reference.authors)}. ${reference.year}. "${reference.title}." <em>${reference.journal}</em> ${reference.volume} (${reference.issue}): ${reference.pages}.`;
  }

  getExample(): { inText: string; bibliography: string } {
    return {
      inText: '(Smith 2023)',
      bibliography: 'Smith, John. 2023. "Example Article Title." <em>Journal Name</em> 10 (2): 123-135.'
    };
  }

  validate(citation: string): { isValid: boolean; errors: string[]; suggestions: string[] } {
    return { isValid: true, errors: [], suggestions: [] };
  }
}

class CSEFormatter extends CitationStyleFormatter {
  private citationNumbers: Map<string, number> = new Map();
  private nextNumber = 1;

  formatInText(reference: Reference, citation: CitationInText): string {
    let number = this.citationNumbers.get(reference.id);
    if (!number) {
      number = this.nextNumber++;
      this.citationNumbers.set(reference.id, number);
    }
    return `${number}`;
  }

  formatBibliography(reference: Reference): string {
    const number = this.citationNumbers.get(reference.id) || 1;
    const authors = reference.authors.map(a => `${a.lastName} ${a.firstName[0]}`).join(', ');
    return `${number}. ${authors}. ${reference.title}. ${reference.journal}. ${reference.year};${reference.volume}(${reference.issue}):${reference.pages}.`;
  }

  getExample(): { inText: string; bibliography: string } {
    return {
      inText: '1',
      bibliography: '1. Smith J. Example article title. Journal Name. 2023;10(2):123-135.'
    };
  }

  validate(citation: string): { isValid: boolean; errors: string[]; suggestions: string[] } {
    return { isValid: true, errors: [], suggestions: [] };
  }
}

class GB7714Formatter extends CitationStyleFormatter {
  formatInText(reference: Reference, citation: CitationInText): string {
    const authors = reference.authors;
    let authorText = '';

    if (authors.length === 0) {
      authorText = '佚名';
    } else if (authors.length === 1) {
      authorText = authors[0].lastName;
    } else if (authors.length <= 3) {
      authorText = authors.map(a => a.lastName).join('，');
    } else {
      authorText = `${authors[0].lastName}等`;
    }

    return `[${authorText}，${reference.year}]`;
  }

  formatBibliography(reference: Reference): string {
    const authors = reference.authors.map(a => `${a.lastName} ${a.firstName[0]}`).join('，');
    let result = `${authors}. ${reference.title}[J].`;

    if (reference.journal) {
      result += ` ${reference.journal}，${reference.year}`;
      if (reference.volume) {
        result += `，${reference.volume}`;
        if (reference.issue) {
          result += `(${reference.issue})`;
        }
      }
      if (reference.pages) {
        result += `：${reference.pages}`;
      }
    }

    return result + '.';
  }

  getExample(): { inText: string; bibliography: string } {
    return {
      inText: '[张三，2023]',
      bibliography: '张三，李四. 示例文章标题[J]. 期刊名称，2023，10(2)：123-135.'
    };
  }

  validate(citation: string): { isValid: boolean; errors: string[]; suggestions: string[] } {
    const errors: string[] = [];
    const suggestions: string[] = [];

    if (!citation.includes('[') || !citation.includes(']')) {
      errors.push('GB/T 7714引用格式应使用方括号');
      suggestions.push('使用格式：[作者，年份]');
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions
    };
  }
}

// 默认实例
export const defaultCitationFormatter = new CitationFormatter();