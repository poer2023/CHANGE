/**
 * 引用和参考文献管理系统
 * 提供完整的文献管理、引用插入、格式化和检索功能
 */

import { GLMClient } from './glm-client';

// 文献类型枚举
export enum ReferenceType {
  JOURNAL = 'journal',
  CONFERENCE = 'conference',
  BOOK = 'book',
  CHAPTER = 'chapter',
  THESIS = 'thesis',
  WEBSITE = 'website',
  REPORT = 'report',
  PATENT = 'patent'
}

// 引用格式枚举
export enum CitationStyle {
  APA = 'apa',
  MLA = 'mla',
  CHICAGO = 'chicago',
  IEEE = 'ieee',
  HARVARD = 'harvard',
  VANCOUVER = 'vancouver',
  GB7714 = 'gb7714' // 国标
}

// 文献信息接口
export interface Reference {
  id: string;
  type: ReferenceType;
  title: string;
  authors: string[];
  year: number;
  // 期刊文章特有字段
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  // 会议论文特有字段
  conference?: string;
  location?: string;
  // 书籍特有字段
  publisher?: string;
  edition?: string;
  isbn?: string;
  // 网页特有字段
  url?: string;
  accessDate?: string;
  // 其他字段
  abstract?: string;
  keywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 引用信息接口
export interface Citation {
  id: string;
  referenceId: string;
  position: number; // 在文档中的位置
  citationType: 'in-text' | 'footnote';
  pageNumber?: string;
  context?: string; // 引用上下文
}

// 引用格式化结果
export interface FormattedCitation {
  inText: string; // 行内引用
  bibliography: string; // 参考文献列表项
}

// 文献搜索结果
export interface SearchResult {
  references: Reference[];
  total: number;
  suggestions: string[];
}

// 重复检测结果
export interface DuplicationResult {
  duplicates: Array<{
    original: Reference;
    duplicates: Reference[];
    similarity: number;
  }>;
  totalDuplicates: number;
}

// 引用统计信息
export interface CitationStatistics {
  totalReferences: number;
  totalCitations: number;
  citationsByType: Record<ReferenceType, number>;
  unusedReferences: Reference[];
  missingCitations: Citation[];
  averageCitationsPerReference: number;
}

/**
 * 引用和参考文献管理器类
 */
export class ReferenceManager {
  private references: Map<string, Reference> = new Map();
  private citations: Map<string, Citation> = new Map();
  private glmClient: GLMClient;

  constructor(glmClient: GLMClient) {
    this.glmClient = glmClient;
  }

  // =========================
  // 文献信息管理
  // =========================

  /**
   * 添加新文献
   */
  addReference(reference: Omit<Reference, 'id' | 'createdAt' | 'updatedAt'>): Reference {
    const now = new Date();
    const newReference: Reference = {
      ...reference,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    };

    this.references.set(newReference.id, newReference);
    return newReference;
  }

  /**
   * 更新文献信息
   */
  updateReference(id: string, updates: Partial<Reference>): Reference | null {
    const reference = this.references.get(id);
    if (!reference) return null;

    const updatedReference = {
      ...reference,
      ...updates,
      id, // 确保ID不被覆盖
      updatedAt: new Date()
    };

    this.references.set(id, updatedReference);
    return updatedReference;
  }

  /**
   * 删除文献
   */
  deleteReference(id: string): boolean {
    // 检查是否有引用
    const hasCitations = Array.from(this.citations.values())
      .some(citation => citation.referenceId === id);
    
    if (hasCitations) {
      throw new Error('无法删除已被引用的文献');
    }

    return this.references.delete(id);
  }

  /**
   * 获取文献信息
   */
  getReference(id: string): Reference | null {
    return this.references.get(id) || null;
  }

  /**
   * 获取所有文献
   */
  getAllReferences(): Reference[] {
    return Array.from(this.references.values());
  }

  // =========================
  // 引用插入与管理
  // =========================

  /**
   * 插入引用
   */
  insertCitation(
    referenceId: string,
    position: number,
    options: {
      citationType?: 'in-text' | 'footnote';
      pageNumber?: string;
      context?: string;
    } = {}
  ): Citation {
    const reference = this.references.get(referenceId);
    if (!reference) {
      throw new Error('文献不存在');
    }

    const citation: Citation = {
      id: this.generateId(),
      referenceId,
      position,
      citationType: options.citationType || 'in-text',
      pageNumber: options.pageNumber,
      context: options.context
    };

    this.citations.set(citation.id, citation);
    return citation;
  }

  /**
   * 更新引用
   */
  updateCitation(id: string, updates: Partial<Citation>): Citation | null {
    const citation = this.citations.get(id);
    if (!citation) return null;

    const updatedCitation = { ...citation, ...updates, id };
    this.citations.set(id, updatedCitation);
    return updatedCitation;
  }

  /**
   * 删除引用
   */
  deleteCitation(id: string): boolean {
    return this.citations.delete(id);
  }

  /**
   * 获取所有引用
   */
  getAllCitations(): Citation[] {
    return Array.from(this.citations.values())
      .sort((a, b) => a.position - b.position);
  }

  // =========================
  // 引用格式化
  // =========================

  /**
   * 格式化单个引用
   */
  formatCitation(referenceId: string, style: CitationStyle): FormattedCitation {
    const reference = this.references.get(referenceId);
    if (!reference) {
      throw new Error('文献不存在');
    }

    return this.formatReferenceByStyle(reference, style);
  }

  /**
   * 生成参考文献列表
   */
  generateBibliography(style: CitationStyle): string[] {
    const usedReferences = this.getUsedReferences();
    return usedReferences
      .sort(this.getSortingFunction(style))
      .map(ref => this.formatReferenceByStyle(ref, style).bibliography);
  }

  /**
   * 获取已使用的文献
   */
  private getUsedReferences(): Reference[] {
    const usedIds = new Set(
      Array.from(this.citations.values()).map(c => c.referenceId)
    );
    
    return Array.from(this.references.values())
      .filter(ref => usedIds.has(ref.id));
  }

  /**
   * 根据样式格式化文献
   */
  private formatReferenceByStyle(reference: Reference, style: CitationStyle): FormattedCitation {
    switch (style) {
      case CitationStyle.APA:
        return this.formatAPA(reference);
      case CitationStyle.MLA:
        return this.formatMLA(reference);
      case CitationStyle.CHICAGO:
        return this.formatChicago(reference);
      case CitationStyle.IEEE:
        return this.formatIEEE(reference);
      case CitationStyle.GB7714:
        return this.formatGB7714(reference);
      default:
        return this.formatAPA(reference);
    }
  }

  /**
   * APA格式化
   */
  private formatAPA(ref: Reference): FormattedCitation {
    const authors = ref.authors.length > 0 ? ref.authors[0] : 'Anonymous';
    const year = ref.year;
    
    let inText = `(${authors}, ${year})`;
    let bibliography = '';

    switch (ref.type) {
      case ReferenceType.JOURNAL:
        bibliography = `${ref.authors.join(', ')} (${year}). ${ref.title}. *${ref.journal}*, *${ref.volume}*(${ref.issue}), ${ref.pages}.`;
        break;
      case ReferenceType.BOOK:
        bibliography = `${ref.authors.join(', ')} (${year}). *${ref.title}*. ${ref.publisher}.`;
        break;
      default:
        bibliography = `${ref.authors.join(', ')} (${year}). ${ref.title}.`;
    }

    return { inText, bibliography };
  }

  /**
   * MLA格式化
   */
  private formatMLA(ref: Reference): FormattedCitation {
    const authors = ref.authors.length > 0 ? ref.authors[0].split(' ').pop() : 'Anonymous';
    
    const inText = `(${authors} ${ref.pages ? ref.pages : ''})`.trim();
    let bibliography = '';

    switch (ref.type) {
      case ReferenceType.JOURNAL:
        bibliography = `${ref.authors.join(', ')}. "${ref.title}." *${ref.journal}*, vol. ${ref.volume}, no. ${ref.issue}, ${ref.year}, pp. ${ref.pages}.`;
        break;
      case ReferenceType.BOOK:
        bibliography = `${ref.authors.join(', ')}. *${ref.title}*. ${ref.publisher}, ${ref.year}.`;
        break;
      default:
        bibliography = `${ref.authors.join(', ')}. "${ref.title}." ${ref.year}.`;
    }

    return { inText, bibliography };
  }

  /**
   * Chicago格式化
   */
  private formatChicago(ref: Reference): FormattedCitation {
    const authors = ref.authors.length > 0 ? ref.authors[0] : 'Anonymous';
    
    const inText = `(${authors} ${ref.year})`;
    let bibliography = '';

    switch (ref.type) {
      case ReferenceType.JOURNAL:
        bibliography = `${ref.authors.join(', ')}. "${ref.title}." ${ref.journal} ${ref.volume}, no. ${ref.issue} (${ref.year}): ${ref.pages}.`;
        break;
      case ReferenceType.BOOK:
        bibliography = `${ref.authors.join(', ')}. ${ref.title}. ${ref.publisher}, ${ref.year}.`;
        break;
      default:
        bibliography = `${ref.authors.join(', ')}. "${ref.title}." ${ref.year}.`;
    }

    return { inText, bibliography };
  }

  /**
   * IEEE格式化
   */
  private formatIEEE(ref: Reference): FormattedCitation {
    const citationNumber = this.getCitationNumber(ref.id);
    
    const inText = `[${citationNumber}]`;
    let bibliography = '';

    switch (ref.type) {
      case ReferenceType.JOURNAL:
        bibliography = `[${citationNumber}] ${ref.authors.join(', ')}, "${ref.title}," *${ref.journal}*, vol. ${ref.volume}, no. ${ref.issue}, pp. ${ref.pages}, ${ref.year}.`;
        break;
      case ReferenceType.CONFERENCE:
        bibliography = `[${citationNumber}] ${ref.authors.join(', ')}, "${ref.title}," in *${ref.conference}*, ${ref.location}, ${ref.year}, pp. ${ref.pages}.`;
        break;
      default:
        bibliography = `[${citationNumber}] ${ref.authors.join(', ')}, "${ref.title}," ${ref.year}.`;
    }

    return { inText, bibliography };
  }

  /**
   * GB7714格式化（中国国标）
   */
  private formatGB7714(ref: Reference): FormattedCitation {
    const authors = ref.authors.length > 0 ? ref.authors[0] : '佚名';
    
    const inText = `[${authors}, ${ref.year}]`;
    let bibliography = '';

    switch (ref.type) {
      case ReferenceType.JOURNAL:
        bibliography = `${ref.authors.join(', ')}. ${ref.title}[J]. ${ref.journal}, ${ref.year}, ${ref.volume}(${ref.issue}): ${ref.pages}.`;
        break;
      case ReferenceType.BOOK:
        bibliography = `${ref.authors.join(', ')}. ${ref.title}[M]. ${ref.publisher}, ${ref.year}.`;
        break;
      default:
        bibliography = `${ref.authors.join(', ')}. ${ref.title}. ${ref.year}.`;
    }

    return { inText, bibliography };
  }

  /**
   * 获取引用编号
   */
  private getCitationNumber(referenceId: string): number {
    const usedReferences = this.getUsedReferences();
    return usedReferences.findIndex(ref => ref.id === referenceId) + 1;
  }

  /**
   * 获取排序函数
   */
  private getSortingFunction(style: CitationStyle) {
    switch (style) {
      case CitationStyle.IEEE:
        return (a: Reference, b: Reference) => {
          const aFirstCitation = Array.from(this.citations.values())
            .find(c => c.referenceId === a.id)?.position || 0;
          const bFirstCitation = Array.from(this.citations.values())
            .find(c => c.referenceId === b.id)?.position || 0;
          return aFirstCitation - bFirstCitation;
        };
      default:
        return (a: Reference, b: Reference) => {
          const aAuthor = a.authors[0] || '';
          const bAuthor = b.authors[0] || '';
          return aAuthor.localeCompare(bAuthor);
        };
    }
  }

  // =========================
  // 文献搜索与推荐
  // =========================

  /**
   * 搜索文献
   */
  searchReferences(query: string, filters?: {
    type?: ReferenceType;
    year?: number;
    author?: string;
  }): SearchResult {
    let results = Array.from(this.references.values());

    // 应用过滤器
    if (filters?.type) {
      results = results.filter(ref => ref.type === filters.type);
    }
    if (filters?.year) {
      results = results.filter(ref => ref.year === filters.year);
    }
    if (filters?.author) {
      results = results.filter(ref => 
        ref.authors.some(author => 
          author.toLowerCase().includes(filters.author!.toLowerCase())
        )
      );
    }

    // 文本搜索
    if (query.trim()) {
      const queryLower = query.toLowerCase();
      results = results.filter(ref =>
        ref.title.toLowerCase().includes(queryLower) ||
        ref.authors.some(author => author.toLowerCase().includes(queryLower)) ||
        ref.abstract?.toLowerCase().includes(queryLower) ||
        ref.keywords?.some(keyword => keyword.toLowerCase().includes(queryLower))
      );
    }

    // 生成搜索建议
    const suggestions = this.generateSearchSuggestions(query);

    return {
      references: results,
      total: results.length,
      suggestions
    };
  }

  /**
   * 基于内容推荐文献
   */
  async recommendReferences(content: string, count: number = 5): Promise<Reference[]> {
    try {
      // 使用GLM客户端分析内容并推荐相关文献
      const prompt = `
        基于以下内容，从已有文献中推荐最相关的${count}篇文献：
        
        内容：${content}
        
        已有文献：
        ${Array.from(this.references.values()).map(ref => 
          `${ref.title} - ${ref.authors.join(', ')} (${ref.year})`
        ).join('\n')}
        
        请返回推荐的文献ID列表，按相关性排序。
      `;

      const response = await this.glmClient.generateText(prompt);
      // 解析推荐结果（这里需要根据实际返回格式调整）
      const recommendedIds = this.parseRecommendationResponse(response.content);
      
      return recommendedIds
        .map(id => this.references.get(id))
        .filter(Boolean) as Reference[];
    } catch (error) {
      console.error('文献推荐失败:', error);
      return [];
    }
  }

  /**
   * 生成搜索建议
   */
  private generateSearchSuggestions(query: string): string[] {
    const allWords = new Set<string>();
    
    Array.from(this.references.values()).forEach(ref => {
      ref.title.split(/\s+/).forEach(word => allWords.add(word.toLowerCase()));
      ref.authors.forEach(author => 
        author.split(/\s+/).forEach(word => allWords.add(word.toLowerCase()))
      );
      ref.keywords?.forEach(keyword => allWords.add(keyword.toLowerCase()));
    });

    const queryWords = query.toLowerCase().split(/\s+/);
    const suggestions: string[] = [];

    Array.from(allWords).forEach(word => {
      if (queryWords.some(qWord => word.includes(qWord) && word !== qWord)) {
        suggestions.push(word);
      }
    });

    return suggestions.slice(0, 10);
  }

  /**
   * 解析推荐响应
   */
  private parseRecommendationResponse(response: string): string[] {
    // 简化的解析逻辑，实际应用中需要更复杂的处理
    const matches = response.match(/[a-f0-9-]{36}/g) || [];
    return matches.slice(0, 5);
  }

  // =========================
  // 文献导入导出
  // =========================

  /**
   * 从BibTeX导入
   */
  importFromBibTeX(bibtexContent: string): Reference[] {
    const entries = this.parseBibTeX(bibtexContent);
    const importedReferences: Reference[] = [];

    entries.forEach(entry => {
      try {
        const reference = this.convertBibTeXToReference(entry);
        const addedRef = this.addReference(reference);
        importedReferences.push(addedRef);
      } catch (error) {
        console.error('导入BibTeX条目失败:', entry, error);
      }
    });

    return importedReferences;
  }

  /**
   * 导出为BibTeX
   */
  exportToBibTeX(): string {
    const references = Array.from(this.references.values());
    return references.map(ref => this.convertReferenceToBibTeX(ref)).join('\n\n');
  }

  /**
   * 解析BibTeX内容
   */
  private parseBibTeX(content: string): any[] {
    // 简化的BibTeX解析，实际应用中需要更完整的解析器
    const entries: any[] = [];
    const entryRegex = /@(\w+)\{([^,]+),\s*([\s\S]*?)\n\}/g;
    
    let match;
    while ((match = entryRegex.exec(content)) !== null) {
      const [, type, key, content] = match;
      const fields: any = { type, key };
      
      const fieldRegex = /(\w+)\s*=\s*\{([^}]*)\}/g;
      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(content)) !== null) {
        const [, fieldName, fieldValue] = fieldMatch;
        fields[fieldName] = fieldValue;
      }
      
      entries.push(fields);
    }
    
    return entries;
  }

  /**
   * 转换BibTeX条目为Reference
   */
  private convertBibTeXToReference(entry: any): Omit<Reference, 'id' | 'createdAt' | 'updatedAt'> {
    const type = this.mapBibTeXTypeToReferenceType(entry.type);
    
    return {
      type,
      title: entry.title || '',
      authors: entry.author ? entry.author.split(' and ') : [],
      year: parseInt(entry.year) || new Date().getFullYear(),
      journal: entry.journal,
      volume: entry.volume,
      issue: entry.number,
      pages: entry.pages,
      doi: entry.doi,
      publisher: entry.publisher,
      url: entry.url,
      abstract: entry.abstract,
      keywords: entry.keywords ? entry.keywords.split(',').map((k: string) => k.trim()) : []
    };
  }

  /**
   * 转换Reference为BibTeX
   */
  private convertReferenceToBibTeX(ref: Reference): string {
    const type = this.mapReferenceTypeToBibTeX(ref.type);
    const key = this.generateBibTeXKey(ref);
    
    let bibtex = `@${type}{${key},\n`;
    bibtex += `  title={${ref.title}},\n`;
    bibtex += `  author={${ref.authors.join(' and ')}},\n`;
    bibtex += `  year={${ref.year}},\n`;
    
    if (ref.journal) bibtex += `  journal={${ref.journal}},\n`;
    if (ref.volume) bibtex += `  volume={${ref.volume}},\n`;
    if (ref.issue) bibtex += `  number={${ref.issue}},\n`;
    if (ref.pages) bibtex += `  pages={${ref.pages}},\n`;
    if (ref.doi) bibtex += `  doi={${ref.doi}},\n`;
    if (ref.publisher) bibtex += `  publisher={${ref.publisher}},\n`;
    if (ref.url) bibtex += `  url={${ref.url}},\n`;
    
    bibtex = bibtex.replace(/,\n$/, '\n'); // 移除最后的逗号
    bibtex += '}';
    
    return bibtex;
  }

  /**
   * 映射BibTeX类型到Reference类型
   */
  private mapBibTeXTypeToReferenceType(bibtexType: string): ReferenceType {
    const mapping: Record<string, ReferenceType> = {
      'article': ReferenceType.JOURNAL,
      'inproceedings': ReferenceType.CONFERENCE,
      'book': ReferenceType.BOOK,
      'inbook': ReferenceType.CHAPTER,
      'phdthesis': ReferenceType.THESIS,
      'mastersthesis': ReferenceType.THESIS,
      'misc': ReferenceType.WEBSITE,
      'techreport': ReferenceType.REPORT
    };
    
    return mapping[bibtexType.toLowerCase()] || ReferenceType.JOURNAL;
  }

  /**
   * 映射Reference类型到BibTeX类型
   */
  private mapReferenceTypeToBibTeX(refType: ReferenceType): string {
    const mapping: Record<ReferenceType, string> = {
      [ReferenceType.JOURNAL]: 'article',
      [ReferenceType.CONFERENCE]: 'inproceedings',
      [ReferenceType.BOOK]: 'book',
      [ReferenceType.CHAPTER]: 'inbook',
      [ReferenceType.THESIS]: 'phdthesis',
      [ReferenceType.WEBSITE]: 'misc',
      [ReferenceType.REPORT]: 'techreport',
      [ReferenceType.PATENT]: 'misc'
    };
    
    return mapping[refType] || 'misc';
  }

  /**
   * 生成BibTeX键
   */
  private generateBibTeXKey(ref: Reference): string {
    const firstAuthor = ref.authors[0] || 'Anonymous';
    const lastName = firstAuthor.split(' ').pop() || 'Unknown';
    return `${lastName}${ref.year}${ref.title.split(' ')[0]}`;
  }

  // =========================
  // 质量检查和统计
  // =========================

  /**
   * 检测重复文献
   */
  detectDuplicates(): DuplicationResult {
    const references = Array.from(this.references.values());
    const duplicates: DuplicationResult['duplicates'] = [];
    const processed = new Set<string>();

    references.forEach(ref => {
      if (processed.has(ref.id)) return;
      
      const similarRefs = references.filter(other => 
        other.id !== ref.id && 
        !processed.has(other.id) &&
        this.calculateSimilarity(ref, other) > 0.8
      );

      if (similarRefs.length > 0) {
        duplicates.push({
          original: ref,
          duplicates: similarRefs,
          similarity: Math.max(...similarRefs.map(s => this.calculateSimilarity(ref, s)))
        });
        
        processed.add(ref.id);
        similarRefs.forEach(s => processed.add(s.id));
      }
    });

    return {
      duplicates,
      totalDuplicates: duplicates.reduce((sum, d) => sum + d.duplicates.length, 0)
    };
  }

  /**
   * 获取引用统计
   */
  getCitationStatistics(): CitationStatistics {
    const allReferences = Array.from(this.references.values());
    const allCitations = Array.from(this.citations.values());
    
    // 按类型统计
    const citationsByType: Record<ReferenceType, number> = {
      [ReferenceType.JOURNAL]: 0,
      [ReferenceType.CONFERENCE]: 0,
      [ReferenceType.BOOK]: 0,
      [ReferenceType.CHAPTER]: 0,
      [ReferenceType.THESIS]: 0,
      [ReferenceType.WEBSITE]: 0,
      [ReferenceType.REPORT]: 0,
      [ReferenceType.PATENT]: 0
    };

    const usedReferenceIds = new Set(allCitations.map(c => c.referenceId));
    
    allReferences.forEach(ref => {
      if (usedReferenceIds.has(ref.id)) {
        citationsByType[ref.type]++;
      }
    });

    // 未使用的文献
    const unusedReferences = allReferences.filter(ref => !usedReferenceIds.has(ref.id));
    
    // 缺失的引用（引用了不存在的文献）
    const missingCitations = allCitations.filter(citation => 
      !this.references.has(citation.referenceId)
    );

    return {
      totalReferences: allReferences.length,
      totalCitations: allCitations.length,
      citationsByType,
      unusedReferences,
      missingCitations,
      averageCitationsPerReference: allReferences.length > 0 
        ? allCitations.length / allReferences.length 
        : 0
    };
  }

  /**
   * 计算文献相似度
   */
  private calculateSimilarity(ref1: Reference, ref2: Reference): number {
    let score = 0;
    let factors = 0;

    // 标题相似度
    const titleSimilarity = this.stringSimilarity(ref1.title, ref2.title);
    score += titleSimilarity * 0.4;
    factors += 0.4;

    // 作者相似度
    const authorSimilarity = this.arrayOverlap(ref1.authors, ref2.authors);
    score += authorSimilarity * 0.3;
    factors += 0.3;

    // 年份匹配
    if (ref1.year === ref2.year) {
      score += 0.2;
    }
    factors += 0.2;

    // DOI匹配
    if (ref1.doi && ref2.doi && ref1.doi === ref2.doi) {
      score += 0.1;
    }
    factors += 0.1;

    return factors > 0 ? score / factors : 0;
  }

  /**
   * 字符串相似度计算
   */
  private stringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * 计算编辑距离
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * 数组重叠度计算
   */
  private arrayOverlap(arr1: string[], arr2: string[]): number {
    if (arr1.length === 0 && arr2.length === 0) return 1;
    if (arr1.length === 0 || arr2.length === 0) return 0;
    
    const set1 = new Set(arr1.map(s => s.toLowerCase()));
    const set2 = new Set(arr2.map(s => s.toLowerCase()));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  // =========================
  // 工具方法
  // =========================

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 导入文献数据
   */
  importData(data: { references: Reference[]; citations: Citation[] }): void {
    data.references.forEach(ref => {
      this.references.set(ref.id, ref);
    });
    
    data.citations.forEach(citation => {
      this.citations.set(citation.id, citation);
    });
  }

  /**
   * 导出文献数据
   */
  exportData(): { references: Reference[]; citations: Citation[] } {
    return {
      references: Array.from(this.references.values()),
      citations: Array.from(this.citations.values())
    };
  }

  /**
   * 清空所有数据
   */
  clear(): void {
    this.references.clear();
    this.citations.clear();
  }
}

/**
 * 创建引用管理器实例
 */
export function createReferenceManager(glmClient: GLMClient): ReferenceManager {
  return new ReferenceManager(glmClient);
}

/**
 * 默认配置
 */
export const DEFAULT_CITATION_STYLES = {
  [CitationStyle.APA]: 'APA 第7版',
  [CitationStyle.MLA]: 'MLA 第8版', 
  [CitationStyle.CHICAGO]: 'Chicago 第17版',
  [CitationStyle.IEEE]: 'IEEE 标准',
  [CitationStyle.HARVARD]: 'Harvard 系统',
  [CitationStyle.VANCOUVER]: 'Vancouver 系统',
  [CitationStyle.GB7714]: 'GB/T 7714-2015'
};

export const REFERENCE_TYPE_LABELS = {
  [ReferenceType.JOURNAL]: '期刊文章',
  [ReferenceType.CONFERENCE]: '会议论文',
  [ReferenceType.BOOK]: '图书',
  [ReferenceType.CHAPTER]: '图书章节',
  [ReferenceType.THESIS]: '学位论文',
  [ReferenceType.WEBSITE]: '网页',
  [ReferenceType.REPORT]: '技术报告',
  [ReferenceType.PATENT]: '专利'
};