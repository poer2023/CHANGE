import { 
  DocumentProcessingResult, 
  DocumentMetadata, 
  DocumentContent, 
  DocumentStatistics,
  DocumentSection,
  AcademicAnalysis,
  LanguageAnalysis,
  StructureAnalysis,
  InnovationAnalysis,
  DocumentSuggestion,
  GrammarIssue,
  StyleSuggestion,
  CitationIssue,
  ProcessingSettings
} from '../types/document';

// 环境变量获取工具函数（兼容浏览器）
const getEnvVar = (key: string, fallback: string = ''): string => {
  // Vite 环境变量（优先）
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || fallback;
  }
  
  // Node.js 环境变量（服务端渲染）
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  
  return fallback;
};

class DocumentProcessor {
  private settings: ProcessingSettings;

  constructor() {
    this.settings = {
      analysisDepth: 'standard',
      enableGrammarCheck: true,
      enableStyleCheck: true,
      enablePlagiarismCheck: false, // 暂时禁用
      citationStyle: 'APA',
      language: 'auto',
    };
  }

  /**
   * 处理文档的主要方法
   */
  async processDocument(file: File): Promise<DocumentProcessingResult> {
    try {
      // 1. 提取文本内容
      const text = await this.extractText(file);
      
      // 2. 生成基础元数据
      const metadata = await this.extractMetadata(file, text);
      
      // 3. 分析文档结构和内容
      const content = await this.analyzeContent(text);
      
      // 4. 计算统计信息
      const statistics = this.calculateStatistics(text, content);
      
      // 5. 执行各项分析
      const [academics, language, structure, innovation] = await Promise.all([
        this.analyzeAcademicStandards(text, content),
        this.analyzeLanguageQuality(text),
        this.analyzeStructure(content),
        this.analyzeInnovation(text, content)
      ]);

      // 6. 计算整体评分
      const overall = this.calculateOverallScore(academics, language, structure, innovation);
      
      // 7. 生成改进建议
      const suggestions = this.generateSuggestions(academics, language, structure, innovation);

      return {
        metadata,
        content,
        statistics,
        overall,
        academics,
        language,
        structure,
        innovation,
        suggestions,
        processedAt: new Date()
      };

    } catch (error) {
      console.error('文档处理错误:', error);
      throw new Error(`文档处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 从文件中提取文本内容
   */
  private async extractText(file: File): Promise<string> {
    const fileType = file.type;
    
    if (fileType === 'text/plain' || fileType === 'text/markdown') {
      return await file.text();
    }
    
    if (fileType === 'application/pdf') {
      return await this.extractPdfText(file);
    }
    
    if (fileType.includes('word') || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await this.extractWordText(file);
    }
    
    if (fileType === 'application/rtf') {
      return await this.extractRtfText(file);
    }
    
    // 默认尝试作为文本文件读取
    return await file.text();
  }

  /**
   * 提取PDF文本（简化版实现）
   */
  private async extractPdfText(file: File): Promise<string> {
    // 注意：这里使用简化实现，实际项目中需要使用 pdf-lib 或 pdfjs-dist
    // 暂时返回模拟文本
    return `这是从PDF文件 "${file.name}" 提取的模拟文本内容。

论文摘要：
本文主要研究了人工智能在学术写作中的应用。通过分析现有技术和方法，我们提出了一种新的智能写作辅助系统。

1. 引言
学术写作是研究工作的重要环节，传统的写作方式存在效率低、质量不稳定等问题。随着人工智能技术的发展，智能写作辅助系统成为了可能。

2. 相关工作
近年来，许多研究者在智能写作领域进行了探索。Smith等人(2023)提出了基于深度学习的文本生成方法，Johnson和Lee(2022)研究了自然语言处理在学术写作中的应用。

3. 方法
我们的方法主要包括以下几个步骤：
- 文档结构分析
- 内容质量评估
- 智能建议生成
- 实时反馈机制

4. 实验结果
通过对比实验，我们的系统在写作质量和效率方面都取得了显著提升。具体数据显示，写作效率提高了45%，文档质量评分提升了38%。

5. 结论
本文提出的智能写作辅助系统能够有效提升学术写作的质量和效率。未来工作将进一步优化算法，扩展应用领域。

参考文献：
[1] Smith, A., Brown, B., & Davis, C. (2023). Deep Learning Approaches to Academic Writing. Journal of AI Research, 15(3), 123-145.
[2] Johnson, M., & Lee, K. (2022). Natural Language Processing in Academic Writing Systems. Computational Linguistics, 48(2), 67-89.`;
  }

  /**
   * 提取Word文档文本（简化版实现）
   */
  private async extractWordText(file: File): Promise<string> {
    // 注意：这里使用简化实现，实际项目中需要使用 mammoth.js 或类似库
    // 暂时返回模拟文本
    return `这是从Word文档 "${file.name}" 提取的模拟文本内容。

# 人工智能在教育中的应用研究

## 摘要
本研究探讨了人工智能技术在现代教育中的应用前景和挑战。通过文献综述和实证分析，我们发现AI技术能够显著提升教学效果和学习体验。

## 1. 研究背景
随着人工智能技术的快速发展，教育行业正经历着前所未有的变革。个性化学习、智能评估、自动化教学等新概念不断涌现。

### 1.1 研究问题
- AI如何改善传统教学模式？
- 个性化学习系统的有效性如何？
- AI在教育中的应用面临哪些挑战？

### 1.2 研究意义
本研究有助于理解AI在教育中的实际应用价值，为相关政策制定和技术开发提供参考。

## 2. 文献综述
Zhang et al. (2023) 在其研究中指出，AI驱动的个性化学习系统能够根据学生的学习特点调整教学内容。Wang和Liu (2022) 则强调了AI在学习评估中的重要作用。

## 3. 研究方法
本研究采用混合研究方法，结合问卷调查和实验研究。

### 3.1 数据收集
- 问卷调查：收集了500名师生对AI教育应用的看法
- 实验研究：在3所学校进行为期6个月的AI教学试点

### 3.2 数据分析
使用SPSS进行统计分析，采用t检验和方差分析等方法。

## 4. 结果与讨论
研究结果显示，AI教育应用在提升学习效果方面表现积极，但也存在一些挑战。

### 4.1 积极影响
- 学习效率提升32%
- 学生满意度提高28%
- 教师工作负担减轻40%

### 4.2 面临挑战
- 技术接受度需要提升
- 隐私保护问题需要重视
- 成本效益需要平衡

## 5. 结论与建议
AI在教育中的应用前景广阔，但需要在技术、政策、伦理等多个层面协调发展。

## 参考文献
Zhang, L., Chen, M., & Wu, P. (2023). Personalized Learning Systems Powered by AI. Educational Technology Research, 41(2), 156-172.

Wang, H., & Liu, S. (2022). AI-Based Assessment in Modern Education. Journal of Educational Innovation, 18(4), 89-104.`;
  }

  /**
   * 提取RTF文本（简化版实现）
   */
  private async extractRtfText(file: File): Promise<string> {
    const rtfContent = await file.text();
    // 简单的RTF文本提取（移除RTF格式标记）
    return rtfContent
      .replace(/\\[a-z]+\d*\s?/g, '') // 移除RTF控制字符
      .replace(/[{}]/g, '') // 移除大括号
      .replace(/\s+/g, ' ') // 规范化空白字符
      .trim();
  }

  /**
   * 提取文档元数据
   */
  private async extractMetadata(file: File, text: string): Promise<DocumentMetadata> {
    // 尝试从文本中提取标题（通常是第一行或最大的文本）
    const lines = text.split('\n').filter(line => line.trim());
    const title = lines[0]?.trim() || file.name.replace(/\.[^/.]+$/, "");
    
    // 尝试检测语言
    const language = this.detectLanguage(text);
    
    // 检测是否包含图表等
    const hasImages = /图\s*\d+|Figure\s*\d+|图像|Image/gi.test(text);
    const hasTables = /表\s*\d+|Table\s*\d+|表格|数据表/gi.test(text);
    const hasCharts = /图表|Chart|Graph|柱状图|饼图|折线图/gi.test(text);
    
    // 简单的关键词提取
    const keywords = this.extractKeywords(text);
    
    return {
      title,
      createdDate: new Date(file.lastModified),
      modifiedDate: new Date(file.lastModified),
      language,
      hasImages,
      hasTables,
      hasCharts,
      keywords
    };
  }

  /**
   * 分析文档内容结构
   */
  private async analyzeContent(text: string): Promise<DocumentContent> {
    const sections = this.extractSections(text);
    const abstract = this.extractAbstract(text);
    const introduction = this.extractIntroduction(text);
    const conclusion = this.extractConclusion(text);
    const references = this.extractReferences(text);
    
    return {
      text,
      sections,
      abstract,
      introduction,
      conclusion,
      references
    };
  }

  /**
   * 提取文档章节结构
   */
  private extractSections(text: string): DocumentSection[] {
    const sections: DocumentSection[] = [];
    const lines = text.split('\n');
    let currentSection: DocumentSection | null = null;
    let sectionCounter = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 检测标题模式
      const titlePatterns = [
        /^#+\s+(.+)$/, // Markdown标题
        /^(\d+\.?\s+.+)$/, // 数字标题
        /^([一二三四五六七八九十]+[、．]\s*.+)$/, // 中文数字标题
        /^(第[一二三四五六七八九十]+章.*)$/, // 章节标题
        /^([A-Z][^.!?]*[.:]?)$/, // 全大写标题
        /^(摘要|引言|结论|参考文献|Abstract|Introduction|Conclusion|References)$/i // 标准学术章节
      ];
      
      let isTitle = false;
      let titleText = '';
      let level = 1;
      
      for (const pattern of titlePatterns) {
        const match = line.match(pattern);
        if (match) {
          isTitle = true;
          titleText = match[1] || line;
          
          // 判断标题级别
          if (line.startsWith('#')) {
            level = (line.match(/^#+/) || [''])[0].length;
          } else if (line.match(/^\d+\./)) {
            level = 1;
          } else if (line.match(/^\d+\.\d+/)) {
            level = 2;
          } else {
            level = 1;
          }
          break;
        }
      }
      
      if (isTitle) {
        // 保存之前的章节
        if (currentSection) {
          currentSection.wordCount = this.countWords(currentSection.content);
          sections.push(currentSection);
        }
        
        // 创建新章节
        currentSection = {
          id: `section_${++sectionCounter}`,
          title: titleText,
          content: '',
          level,
          order: sectionCounter,
          wordCount: 0,
          startPosition: text.indexOf(line),
          endPosition: 0
        };
      } else if (currentSection && line) {
        // 添加内容到当前章节
        currentSection.content += line + '\n';
      }
    }
    
    // 添加最后一个章节
    if (currentSection) {
      currentSection.wordCount = this.countWords(currentSection.content);
      currentSection.endPosition = text.length;
      sections.push(currentSection);
    }
    
    return sections;
  }

  /**
   * 计算文档统计信息
   */
  private calculateStatistics(text: string, content: DocumentContent): DocumentStatistics {
    const wordCount = this.countWords(text);
    const characterCount = text.length;
    const characterCountNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    const paragraphCount = paragraphs.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const sentenceCount = sentences.length;
    
    const averageWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const averageSentencesPerParagraph = paragraphCount > 0 ? sentenceCount / paragraphCount : 0;
    const readingTimeMinutes = Math.ceil(wordCount / 200); // 假设每分钟200字
    
    // 计算语言复杂度
    const complexWords = this.countComplexWords(text);
    const languageComplexity = complexWords / wordCount > 0.3 ? 'complex' : 
                              complexWords / wordCount > 0.15 ? 'moderate' : 'simple';
    
    // 计算词汇多样性
    const words = this.extractWords(text);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const vocabularyDiversity = words.length > 0 ? uniqueWords.size / words.length : 0;
    
    // 计算正式程度
    const formalityScore = this.calculateFormality(text);
    
    return {
      wordCount,
      characterCount,
      characterCountNoSpaces,
      paragraphCount,
      sentenceCount,
      averageWordsPerSentence,
      averageSentencesPerParagraph,
      readingTimeMinutes,
      languageComplexity,
      vocabularyDiversity,
      formalityScore
    };
  }

  /**
   * 分析学术规范
   */
  private async analyzeAcademicStandards(text: string, content: DocumentContent): Promise<AcademicAnalysis> {
    // 分析引用格式
    const citationFormat = this.analyzeCitationFormat(text);
    
    // 分析文档结构
    const structure = this.analyzeAcademicStructure(content);
    
    // 分析学术术语
    const terminology = this.analyzeTerminology(text);
    
    // 计算总分
    const score = Math.round((citationFormat.score + structure.score + terminology.score) / 3);
    
    const recommendations = [
      '建议统一引用格式，遵循学术规范',
      '完善文档结构，确保包含必要章节',
      '使用更多专业术语，提升学术性',
      '检查引用的完整性和准确性'
    ];
    
    return {
      score,
      citationFormat,
      structure,
      terminology,
      recommendations
    };
  }

  /**
   * 分析语言质量
   */
  private async analyzeLanguageQuality(text: string): Promise<LanguageAnalysis> {
    // 语法分析
    const grammar = this.analyzeGrammar(text);
    
    // 风格分析
    const style = this.analyzeStyle(text);
    
    // 可读性分析
    const readability = this.analyzeReadability(text);
    
    // 词汇分析
    const vocabulary = this.analyzeVocabulary(text);
    
    // 计算总分
    const score = Math.round((grammar.score + style.score + readability.score + vocabulary.score) / 4);
    
    return {
      score,
      grammar,
      style,
      readability,
      vocabulary
    };
  }

  /**
   * 分析文档结构
   */
  private analyzeStructure(content: DocumentContent): StructureAnalysis {
    const sections = content.sections;
    const totalWords = this.countWords(content.text);
    
    // 分析组织结构
    const organization = this.analyzeOrganization(sections, totalWords);
    
    // 分析连贯性
    const coherence = this.analyzeCoherence(content);
    
    // 计算总分
    const score = Math.round((organization.score + coherence.score) / 2);
    
    return {
      score,
      organization,
      coherence,
      sections: sections.map(section => ({
        title: section.title,
        wordCount: section.wordCount,
        paragraphCount: (section.content.match(/\n\s*\n/g) || []).length + 1,
        isWellDeveloped: section.wordCount > 100,
        purpose: this.identifyPurpose(section.title),
        issues: [],
        suggestions: []
      }))
    };
  }

  /**
   * 分析创新性
   */
  private async analyzeInnovation(text: string, content: DocumentContent): Promise<InnovationAnalysis> {
    // 新颖性分析
    const novelty = this.analyzeNovelty(text);
    
    // 贡献分析
    const contribution = this.analyzeContribution(text);
    
    // 原创性分析
    const originality = this.analyzeOriginality(text);
    
    // 计算总分
    const score = Math.round((novelty.score + contribution.score + originality.score) / 3);
    
    return {
      score,
      novelty,
      contribution,
      originality
    };
  }

  // ===== 辅助方法 =====

  /**
   * 计算单词数
   */
  private countWords(text: string): number {
    return this.extractWords(text).length;
  }

  /**
   * 提取单词
   */
  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff]/g, ' ') // 保留中英文字符
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * 检测语言
   */
  private detectLanguage(text: string): string {
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const totalChars = text.replace(/\s/g, '').length;
    const chineseRatio = totalChars > 0 ? chineseChars / totalChars : 0;
    
    return chineseRatio > 0.3 ? 'zh' : 'en';
  }

  /**
   * 提取关键词
   */
  private extractKeywords(text: string): string[] {
    const words = this.extractWords(text);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 
                               '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这']);
    
    // 计算词频
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      if (word.length > 2 && !stopWords.has(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });
    
    // 返回高频词作为关键词
    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * 提取摘要
   */
  private extractAbstract(text: string): string | undefined {
    const abstractPattern = /(摘要|Abstract)[\s:：]*([^]*?)(?=\n\s*(?:关键词|Keywords|引言|Introduction|\d+[.\s]|$))/i;
    const match = text.match(abstractPattern);
    return match ? match[2].trim() : undefined;
  }

  /**
   * 提取引言
   */
  private extractIntroduction(text: string): string | undefined {
    const introPattern = /(引言|Introduction|1[.\s]*引言|1[.\s]*Introduction)[\s:：]*([^]*?)(?=\n\s*(?:\d+[.\s]|$))/i;
    const match = text.match(introPattern);
    return match ? match[2].trim() : undefined;
  }

  /**
   * 提取结论
   */
  private extractConclusion(text: string): string | undefined {
    const conclusionPattern = /(结论|Conclusion|总结|Summary)[\s:：]*([^]*?)(?=\n\s*(?:参考文献|References|$))/i;
    const match = text.match(conclusionPattern);
    return match ? match[2].trim() : undefined;
  }

  /**
   * 提取参考文献
   */
  private extractReferences(text: string): string[] {
    const refPattern = /(参考文献|References)[\s:：]*([^]*?)$/i;
    const match = text.match(refPattern);
    if (!match) return [];
    
    return match[2]
      .split('\n')
      .map(ref => ref.trim())
      .filter(ref => ref.length > 0);
  }

  /**
   * 计算复杂词汇数量
   */
  private countComplexWords(text: string): number {
    const words = this.extractWords(text);
    let complexCount = 0;
    
    words.forEach(word => {
      // 英文：超过3个音节的词认为是复杂词
      // 中文：超过4个字符的词认为是复杂词
      if (/[\u4e00-\u9fff]/.test(word)) {
        if (word.length > 4) complexCount++;
      } else {
        if (word.length > 6) complexCount++; // 简化的音节判断
      }
    });
    
    return complexCount;
  }

  /**
   * 计算正式程度
   */
  private calculateFormality(text: string): number {
    const formalIndicators = [
      '因此', '然而', '此外', '综上所述', '根据', '表明', '显示', '证明',
      'therefore', 'however', 'furthermore', 'consequently', 'according', 'indicate', 'demonstrate', 'prove'
    ];
    
    const informalIndicators = [
      '很', '非常', '特别', '真的', '好的', '不错', '挺', '蛮',
      'very', 'really', 'pretty', 'quite', 'good', 'nice', 'great', 'awesome'
    ];
    
    let formalCount = 0;
    let informalCount = 0;
    
    const lowerText = text.toLowerCase();
    
    formalIndicators.forEach(indicator => {
      const matches = lowerText.match(new RegExp(indicator, 'g'));
      if (matches) formalCount += matches.length;
    });
    
    informalIndicators.forEach(indicator => {
      const matches = lowerText.match(new RegExp(indicator, 'g'));
      if (matches) informalCount += matches.length;
    });
    
    const totalIndicators = formalCount + informalCount;
    return totalIndicators > 0 ? Math.round((formalCount / totalIndicators) * 100) : 50;
  }

  /**
   * 分析引用格式
   */
  private analyzeCitationFormat(text: string): any {
    const citations = [];
    const issues: CitationIssue[] = [];
    
    // 检测各种引用格式
    const apaPattern = /\([^)]*\d{4}[^)]*\)/g;
    const mlaPattern = /\([^)]*\d+[^)]*\)/g;
    const chicagoPattern = /\[\d+\]/g;
    
    const apaMatches = text.match(apaPattern) || [];
    const mlaMatches = text.match(mlaPattern) || [];
    const chicagoMatches = text.match(chicagoPattern) || [];
    
    let detectedStyle = 'Unknown';
    let score = 70;
    
    if (apaMatches.length > mlaMatches.length && apaMatches.length > chicagoMatches.length) {
      detectedStyle = 'APA';
    } else if (chicagoMatches.length > 0) {
      detectedStyle = 'Chicago';
    } else if (mlaMatches.length > 0) {
      detectedStyle = 'MLA';
    }
    
    // 如果检测到多种格式，降低分数
    if (apaMatches.length > 0 && chicagoMatches.length > 0) {
      score = 40;
      detectedStyle = 'Mixed';
      issues.push({
        type: 'inconsistent',
        severity: 'high',
        position: { start: 0, end: 0 },
        message: '检测到多种引用格式混用',
        suggestion: '建议统一使用一种引用格式'
      });
    }
    
    return {
      score,
      style: detectedStyle,
      issues
    };
  }

  /**
   * 分析学术结构
   */
  private analyzeAcademicStructure(content: DocumentContent): any {
    const sections = content.sections.map(s => s.title.toLowerCase());
    
    const hasAbstract = content.abstract !== undefined || 
                       sections.some(s => s.includes('摘要') || s.includes('abstract'));
    const hasIntroduction = content.introduction !== undefined || 
                           sections.some(s => s.includes('引言') || s.includes('introduction'));
    const hasMethodology = sections.some(s => s.includes('方法') || s.includes('methodology') || s.includes('method'));
    const hasResults = sections.some(s => s.includes('结果') || s.includes('result'));
    const hasDiscussion = sections.some(s => s.includes('讨论') || s.includes('discussion'));
    const hasConclusion = content.conclusion !== undefined || 
                         sections.some(s => s.includes('结论') || s.includes('conclusion'));
    const hasReferences = content.references && content.references.length > 0;
    
    const requiredSections = [hasAbstract, hasIntroduction, hasConclusion, hasReferences];
    const optionalSections = [hasMethodology, hasResults, hasDiscussion];
    
    const score = Math.round(
      (requiredSections.filter(Boolean).length / requiredSections.length * 60) +
      (optionalSections.filter(Boolean).length / optionalSections.length * 40)
    );
    
    const missingSection = [];
    if (!hasAbstract) missingSection.push('摘要/Abstract');
    if (!hasIntroduction) missingSection.push('引言/Introduction');
    if (!hasConclusion) missingSection.push('结论/Conclusion');
    if (!hasReferences) missingSection.push('参考文献/References');
    
    return {
      score,
      hasAbstract,
      hasIntroduction,
      hasMethodology,
      hasResults,
      hasDiscussion,
      hasConclusion,
      hasReferences,
      missingSection
    };
  }

  /**
   * 分析术语使用
   */
  private analyzeTerminology(text: string): any {
    const academicTerms = [
      '研究', '分析', '方法', '结果', '结论', '假设', '理论', '实验', '数据', '模型',
      'research', 'analysis', 'method', 'result', 'conclusion', 'hypothesis', 'theory', 'experiment', 'data', 'model'
    ];
    
    let termCount = 0;
    academicTerms.forEach(term => {
      const matches = text.toLowerCase().match(new RegExp(term, 'g'));
      if (matches) termCount += matches.length;
    });
    
    const totalWords = this.countWords(text);
    const termRatio = totalWords > 0 ? termCount / totalWords : 0;
    const score = Math.min(100, Math.round(termRatio * 1000));
    
    return {
      score,
      academicTerms: termCount,
      fieldSpecificTerms: [],
      inconsistentTerms: []
    };
  }

  /**
   * 分析语法
   */
  private analyzeGrammar(text: string): any {
    const errors: GrammarIssue[] = [];
    
    // 简单的语法检查规则
    const grammarRules = [
      {
        pattern: /\s+[,。]|\s+[,.]/g,
        type: 'punctuation' as const,
        message: '标点前不应有空格'
      },
      {
        pattern: /[。！？][a-zA-Z]/g,
        type: 'punctuation' as const,
        message: '中文标点后接英文应有空格'
      }
    ];
    
    grammarRules.forEach(rule => {
      let match;
      while ((match = rule.pattern.exec(text)) !== null) {
        errors.push({
          type: rule.type,
          severity: 'low',
          position: { start: match.index, end: match.index + match[0].length },
          text: match[0],
          message: rule.message,
          suggestions: []
        });
      }
    });
    
    const score = Math.max(0, 100 - errors.length * 5);
    
    return {
      score,
      errors,
      commonMistakes: []
    };
  }

  /**
   * 分析写作风格
   */
  private analyzeStyle(text: string): any {
    const suggestions: StyleSuggestion[] = [];
    
    // 检查句子长度
    const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim());
    let longSentences = 0;
    
    sentences.forEach(sentence => {
      const words = this.extractWords(sentence);
      if (words.length > 25) {
        longSentences++;
        suggestions.push({
          type: 'sentence-structure',
          position: { start: text.indexOf(sentence), end: text.indexOf(sentence) + sentence.length },
          text: sentence.substring(0, 50) + '...',
          message: '句子过长，建议拆分',
          suggestion: '考虑将长句拆分为多个短句',
          impact: 'medium'
        });
      }
    });
    
    const clarity = Math.max(0, 100 - longSentences * 10);
    const conciseness = 80; // 简化实现
    const formality = this.calculateFormality(text);
    const consistency = 85; // 简化实现
    
    const score = Math.round((clarity + conciseness + formality + consistency) / 4);
    
    return {
      score,
      clarity,
      conciseness,
      formality,
      consistency,
      suggestions
    };
  }

  /**
   * 分析可读性
   */
  private analyzeReadability(text: string): any {
    const words = this.extractWords(text);
    const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim());
    
    const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
    
    // 简化的可读性评分
    let level: 'elementary' | 'middle-school' | 'high-school' | 'college' | 'graduate' = 'college';
    let score = 70;
    
    if (avgWordsPerSentence < 10) {
      level = 'elementary';
      score = 90;
    } else if (avgWordsPerSentence < 15) {
      level = 'middle-school';
      score = 85;
    } else if (avgWordsPerSentence < 20) {
      level = 'high-school';
      score = 80;
    } else if (avgWordsPerSentence < 25) {
      level = 'college';
      score = 70;
    } else {
      level = 'graduate';
      score = 60;
    }
    
    return {
      score,
      level,
      fleschKincaidGrade: avgWordsPerSentence,
      fleschReadingEase: score,
      averageWordsPerSentence: avgWordsPerSentence
    };
  }

  /**
   * 分析词汇
   */
  private analyzeVocabulary(text: string): any {
    const words = this.extractWords(text);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    
    const diversity = words.length > 0 ? uniqueWords.size / words.length : 0;
    const complexity = this.countComplexWords(text) / words.length;
    const academicWords = this.countAcademicWords(text);
    
    const score = Math.round((diversity + complexity + academicWords / words.length) * 100 / 3);
    
    return {
      score,
      diversity,
      complexity,
      academicWords,
      repeatWords: [],
      suggestions: []
    };
  }

  /**
   * 计算学术词汇数量
   */
  private countAcademicWords(text: string): number {
    const academicWords = [
      'analysis', 'research', 'study', 'method', 'approach', 'theory', 'concept', 'framework',
      'hypothesis', 'evidence', 'significant', 'demonstrate', 'investigate', 'examine',
      '分析', '研究', '方法', '理论', '概念', '假设', '证据', '显著', '证明', '调查', '检验'
    ];
    
    let count = 0;
    const lowerText = text.toLowerCase();
    
    academicWords.forEach(word => {
      const matches = lowerText.match(new RegExp(word, 'g'));
      if (matches) count += matches.length;
    });
    
    return count;
  }

  /**
   * 分析组织结构
   */
  private analyzeOrganization(sections: DocumentSection[], totalWords: number): any {
    let logicalFlow = 85;
    let sectionBalance = 80;
    let transitionQuality = 75;
    
    // 检查章节平衡
    if (sections.length > 0) {
      const avgWordsPerSection = totalWords / sections.length;
      const unbalancedSections = sections.filter(s => 
        s.wordCount < avgWordsPerSection * 0.3 || s.wordCount > avgWordsPerSection * 3
      );
      sectionBalance = Math.max(0, 100 - unbalancedSections.length * 20);
    }
    
    const score = Math.round((logicalFlow + sectionBalance + transitionQuality) / 3);
    
    return {
      score,
      logicalFlow,
      sectionBalance,
      transitionQuality,
      issues: []
    };
  }

  /**
   * 分析连贯性
   */
  private analyzeCoherence(content: DocumentContent): any {
    const topicConsistency = 80;
    const argumentFlow = 75;
    const evidenceSupport = 70;
    
    const score = Math.round((topicConsistency + argumentFlow + evidenceSupport) / 3);
    
    return {
      score,
      topicConsistency,
      argumentFlow,
      evidenceSupport,
      suggestions: [
        '加强段落间的逻辑连接',
        '确保论点与证据的对应关系',
        '保持全文主题的一致性'
      ]
    };
  }

  /**
   * 识别章节用途
   */
  private identifyPurpose(title: string): string {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('摘要') || lowerTitle.includes('abstract')) return '概述研究内容和结论';
    if (lowerTitle.includes('引言') || lowerTitle.includes('introduction')) return '介绍研究背景和目的';
    if (lowerTitle.includes('方法') || lowerTitle.includes('method')) return '描述研究方法和过程';
    if (lowerTitle.includes('结果') || lowerTitle.includes('result')) return '展示研究结果和数据';
    if (lowerTitle.includes('讨论') || lowerTitle.includes('discussion')) return '分析和解释研究结果';
    if (lowerTitle.includes('结论') || lowerTitle.includes('conclusion')) return '总结研究贡献和意义';
    if (lowerTitle.includes('参考') || lowerTitle.includes('reference')) return '列出引用的文献资料';
    
    return '支撑整体论述结构';
  }

  /**
   * 分析新颖性
   */
  private analyzeNovelty(text: string): any {
    const noveltyIndicators = [
      '新', '创新', '首次', '独特', '原创', '突破',
      'new', 'novel', 'innovative', 'unique', 'original', 'breakthrough'
    ];
    
    let indicatorCount = 0;
    noveltyIndicators.forEach(indicator => {
      const matches = text.toLowerCase().match(new RegExp(indicator, 'g'));
      if (matches) indicatorCount += matches.length;
    });
    
    const score = Math.min(100, indicatorCount * 10);
    
    return {
      score,
      originalIdeas: indicatorCount,
      uniqueApproach: score > 50,
      creativeElements: []
    };
  }

  /**
   * 分析贡献度
   */
  private analyzeContribution(text: string): any {
    const contributionIndicators = [
      '贡献', '意义', '价值', '影响', '推进', '改善',
      'contribution', 'significance', 'value', 'impact', 'advance', 'improve'
    ];
    
    let indicatorCount = 0;
    contributionIndicators.forEach(indicator => {
      const matches = text.toLowerCase().match(new RegExp(indicator, 'g'));
      if (matches) indicatorCount += matches.length;
    });
    
    const score = Math.min(100, indicatorCount * 15);
    
    return {
      score,
      theoreticalContribution: score * 0.3,
      practicalContribution: score * 0.4,
      methodologicalContribution: score * 0.3,
      significance: score > 70 ? 'high' : score > 40 ? 'medium' : 'low',
      analysis: '文档展现了一定的学术贡献价值'
    };
  }

  /**
   * 分析原创性
   */
  private analyzeOriginality(text: string): any {
    // 简化的原创性检查
    const score = 85; // 假设原创性良好
    
    return {
      score,
      similarityLevel: 15,
      potentialPlagiarism: false,
      overlappingConcepts: []
    };
  }

  /**
   * 计算整体评分
   */
  private calculateOverallScore(academics: AcademicAnalysis, language: LanguageAnalysis, 
                               structure: StructureAnalysis, innovation: InnovationAnalysis): any {
    const score = Math.round((academics.score + language.score + structure.score + innovation.score) / 4);
    
    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';
    else grade = 'F';
    
    const summary = `该文档整体质量${grade === 'A' ? '优秀' : grade === 'B' ? '良好' : grade === 'C' ? '中等' : '需要改进'}，在学术规范、语言质量、结构完整性和创新性方面${score >= 80 ? '表现出色' : '有待提升'}。`;
    
    return {
      score,
      grade,
      summary
    };
  }

  /**
   * 生成改进建议
   */
  private generateSuggestions(academics: AcademicAnalysis, language: LanguageAnalysis, 
                             structure: StructureAnalysis, innovation: InnovationAnalysis): DocumentSuggestion[] {
    const suggestions: DocumentSuggestion[] = [];
    
    if (academics.score < 80) {
      suggestions.push({
        id: 'academic_1',
        type: 'improvement',
        priority: 'high',
        category: 'academic',
        title: '提升学术规范性',
        description: '文档在学术规范方面存在改进空间',
        action: '统一引用格式，完善文档结构，使用更多专业术语',
        estimatedImpact: 15,
        estimatedEffort: 'medium'
      });
    }
    
    if (language.score < 80) {
      suggestions.push({
        id: 'language_1',
        type: 'improvement',
        priority: 'medium',
        category: 'language',
        title: '提升语言质量',
        description: '语言表达可以更加准确和流畅',
        action: '检查语法错误，优化句式结构，提高词汇多样性',
        estimatedImpact: 12,
        estimatedEffort: 'medium'
      });
    }
    
    if (structure.score < 80) {
      suggestions.push({
        id: 'structure_1',
        type: 'improvement',
        priority: 'high',
        category: 'structure',
        title: '优化文档结构',
        description: '文档结构可以更加清晰和逻辑化',
        action: '调整章节安排，加强段落间的逻辑连接，确保内容的连贯性',
        estimatedImpact: 18,
        estimatedEffort: 'high'
      });
    }
    
    if (innovation.score < 70) {
      suggestions.push({
        id: 'innovation_1',
        type: 'enhancement',
        priority: 'medium',
        category: 'innovation',
        title: '增强创新性',
        description: '可以进一步突出研究的新颖性和贡献',
        action: '明确研究的独特之处，强调理论或实践贡献，展示创新要素',
        estimatedImpact: 20,
        estimatedEffort: 'high'
      });
    }
    
    return suggestions;
  }
}

// 创建单例实例
export const documentProcessor = new DocumentProcessor();