import React from 'react';
import { SmartInputData, AnalysisProgress } from './SmartInputForm';

export type ExtractedFormData = {
  essayType?: string;
  topic?: string;
  essayLength?: string;
  lengthType?: string;
  essayLevel?: string;
  citationStyle?: string;
  language?: string;
  audience?: string;
  thesis?: string;
  structure?: string;
  materials?: string;
};

export type AnalysisResult = {
  extractedData: ExtractedFormData;
  confidence: Record<keyof ExtractedFormData, number>;
  extractedFields: (keyof ExtractedFormData)[];
  remainingFields: (keyof ExtractedFormData)[];
  analysisLog: string[];
};

class FormAnalyzer {
  private static instance: FormAnalyzer;
  private analysisPatterns: Record<string, RegExp[]> = {
    essayType: [
      /argumentative\s+essay/i,
      /analytical\s+essay/i,
      /research\s+paper/i,
      /literature\s+review/i,
      /case\s+study/i,
      /discussion\s+post/i,
      /personal\s+statement/i,
      /critical\s+essay/i,
      /compare.*contrast/i,
      /标准学术论文|学术论文/i,
      /论证型论文|论证文/i,
      /分析型论文|分析文/i,
      /研究论文|研究报告/i,
      /文献综述|综述/i,
      /案例分析|案例研究/i,
      /课堂讨论|讨论帖/i,
      /个人陈述|申请文书/i,
      /批评性论文|评论文/i,
      /对比论文|比较分析/i,
    ],
    topic: [
      /topic\s*:?\s*(.+)/i,
      /title\s*:?\s*(.+)/i,
      /主题\s*[:：]?\s*(.+)/i,
      /题目\s*[:：]?\s*(.+)/i,
      /论文题目\s*[:：]?\s*(.+)/i,
      /essay\s+on\s+(.+)/i,
      /about\s+(.+)/i,
      /关于\s*(.+)/i,
    ],
    essayLength: [
      /(\d+)\s*[-~到]\s*(\d+)\s*(words?|字|页|pages?)/i,
      /(\d+)\s*(words?|字|页|pages?)/i,
      /length\s*:?\s*(\d+)/i,
      /字数\s*[:：]?\s*(\d+)/i,
      /页数\s*[:：]?\s*(\d+)/i,
      /要求\s*(\d+)\s*(字|页)/i,
    ],
    essayLevel: [
      /undergraduate|本科|学士/i,
      /graduate|master|硕士/i,
      /phd|doctoral|博士/i,
      /high\s+school|高中/i,
      /college|大学/i,
    ],
    citationStyle: [
      /apa\s+style|apa\s+format|apa引用/i,
      /mla\s+style|mla\s+format|mla引用/i,
      /chicago\s+style|chicago引用/i,
      /harvard\s+style|harvard引用/i,
      /ieee\s+style|ieee引用/i,
    ],
    language: [
      /中文|chinese|中国话/i,
      /english|英文|英语/i,
      /american\s+english|美式英语/i,
      /british\s+english|英式英语/i,
    ],
    audience: [
      /academic\s+audience|学术读者|学术人员/i,
      /general\s+audience|一般读者|普通读者/i,
      /professionals?|专业人士|专业同行/i,
      /students?|学生/i,
      /admissions?\s+officer|招生官/i,
    ],
  };

  public static getInstance(): FormAnalyzer {
    if (!FormAnalyzer.instance) {
      FormAnalyzer.instance = new FormAnalyzer();
    }
    return FormAnalyzer.instance;
  }

  private extractFromText(text: string): { data: Partial<ExtractedFormData>; confidence: Record<string, number>; log: string[] } {
    const extractedData: Partial<ExtractedFormData> = {};
    const confidence: Record<string, number> = {};
    const log: string[] = [];

    // 提取essay类型
    const essayTypeKeywords = {
      'Argumentative Essay': ['argumentative', 'argument', '论证', '辩论'],
      'Analytical Essay': ['analytical', 'analysis', '分析'],
      'Research Paper': ['research', 'study', '研究'],
      'Literature Review': ['literature review', 'review', '文献综述', '综述'],
      'Case Study': ['case study', '案例分析', '案例研究'],
      'Standard Academic Essay': ['academic', 'essay', '学术论文', '论文'],
    };

    for (const [type, keywords] of Object.entries(essayTypeKeywords)) {
      const matches = keywords.filter(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
      );
      if (matches.length > 0) {
        extractedData.essayType = type;
        confidence.essayType = Math.min(0.9, matches.length * 0.3);
        log.push(`检测到论文类型: ${type} (关键词: ${matches.join(', ')})`);
        break;
      }
    }

    // 提取主题
    const topicPatterns = [
      /(?:主题|题目|topic|title)\s*[:：]?\s*([^\n\r.。]+)/i,
      /(?:关于|about|on)\s+([^\n\r.。]+)/i,
      /essay\s+(?:on|about)\s+([^\n\r.。]+)/i,
    ];

    for (const pattern of topicPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        extractedData.topic = match[1].trim();
        confidence.topic = 0.8;
        log.push(`提取主题: ${match[1].trim()}`);
        break;
      }
    }

    // 提取字数要求
    const lengthPatterns = [
      /(\d+)\s*[-~到]\s*(\d+)\s*(words?|字|页|pages?)/i,
      /(\d+)\s*(words?|字|页|pages?)/i,
      /(?:字数|页数|length)\s*[:：]?\s*(\d+)/i,
    ];

    for (const pattern of lengthPatterns) {
      const match = text.match(pattern);
      if (match) {
        if (match[2] && match[3]) {
          // 范围格式
          extractedData.essayLength = `${match[1]}-${match[2]}`;
          extractedData.lengthType = match[3].includes('page') || match[3].includes('页') ? '页' : 
                                   match[3].includes('word') || match[3].includes('字') ? '字' : '字';
        } else if (match[2]) {
          // 单一数值
          extractedData.essayLength = match[1];
          extractedData.lengthType = match[2].includes('page') || match[2].includes('页') ? '页' : 
                                   match[2].includes('word') || match[2].includes('字') ? '字' : '字';
        } else {
          extractedData.essayLength = match[3] || match[1];
          extractedData.lengthType = '字';
        }
        confidence.essayLength = 0.9;
        log.push(`提取字数要求: ${extractedData.essayLength} ${extractedData.lengthType}`);
        break;
      }
    }

    // 提取学术水平
    const levelKeywords = {
      '高中': ['high school', 'secondary', '高中'],
      '本科': ['undergraduate', 'bachelor', '本科', '学士'],
      '硕士': ['master', 'graduate', '硕士', '研究生'],
      '博士': ['phd', 'doctoral', 'doctorate', '博士'],
    };

    for (const [level, keywords] of Object.entries(levelKeywords)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()))) {
        extractedData.essayLevel = level;
        confidence.essayLevel = 0.8;
        log.push(`检测到学术水平: ${level}`);
        break;
      }
    }

    // 提取引用格式
    const citationKeywords = {
      'APA': ['apa'],
      'MLA': ['mla'],
      'Chicago': ['chicago'],
      'Harvard': ['harvard'],
    };

    for (const [style, keywords] of Object.entries(citationKeywords)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        extractedData.citationStyle = style;
        confidence.citationStyle = 0.9;
        log.push(`检测到引用格式: ${style}`);
        break;
      }
    }

    // 提取语言
    if (text.includes('中文') || text.includes('Chinese') || /[\u4e00-\u9fff]/.test(text)) {
      extractedData.language = '中文';
      confidence.language = 0.7;
      log.push('检测语言: 中文');
    } else if (text.includes('English') || text.includes('英文')) {
      extractedData.language = '英语（美式）';
      confidence.language = 0.8;
      log.push('检测语言: 英语');
    }

    // 提取目标读者
    const audienceKeywords = {
      '学术读者': ['academic', 'scholar', '学术', '学者'],
      '招生官': ['admission', 'admissions officer', '招生'],
      '一般读者': ['general audience', 'general public', '一般'],
      '专业同行': ['professional', 'peer', '专业', '同行'],
    };

    for (const [audience, keywords] of Object.entries(audienceKeywords)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()))) {
        extractedData.audience = audience;
        confidence.audience = 0.7;
        log.push(`检测到目标读者: ${audience}`);
        break;
      }
    }

    // 提取补充材料信息
    const materialIndicators = ['参考', 'reference', '文献', '材料', 'source', '要求'];
    if (materialIndicators.some(indicator => text.toLowerCase().includes(indicator))) {
      // 提取相关段落作为补充信息
      const sentences = text.split(/[.。\n]/);
      const relevantSentences = sentences.filter(sentence => 
        materialIndicators.some(indicator => sentence.toLowerCase().includes(indicator))
      );
      
      if (relevantSentences.length > 0) {
        extractedData.materials = relevantSentences.slice(0, 3).join('。').substring(0, 200);
        confidence.materials = 0.6;
        log.push('提取补充材料信息');
      }
    }

    return { data: extractedData, confidence, log };
  }

  private simulateImageAnalysis(images: File[]): { data: Partial<ExtractedFormData>; confidence: Record<string, number>; log: string[] } {
    // 模拟图片分析结果
    const extractedData: Partial<ExtractedFormData> = {};
    const confidence: Record<string, number> = {};
    const log: string[] = [];

    // 模拟OCR识别结果
    if (images.length > 0) {
      log.push(`分析 ${images.length} 个图片文件`);
      
      // 模拟从图片中识别文字
      const hasAssignmentSheet = images.some(img => 
        img.name.toLowerCase().includes('assignment') || 
        img.name.toLowerCase().includes('homework') ||
        img.name.toLowerCase().includes('作业')
      );

      if (hasAssignmentSheet) {
        extractedData.essayType = 'Assignment';
        confidence.essayType = 0.7;
        log.push('从图片识别出作业类型');
      }

      // 模拟识别课程级别
      const isUniversityDocument = images.some(img => 
        img.name.toLowerCase().includes('university') ||
        img.name.toLowerCase().includes('college') ||
        img.name.toLowerCase().includes('大学')
      );

      if (isUniversityDocument) {
        extractedData.essayLevel = '本科';
        confidence.essayLevel = 0.6;
        log.push('从图片识别出学术水平');
      }
    }

    return { data: extractedData, confidence, log };
  }

  public async analyzeContent(
    data: SmartInputData,
    onProgress?: (progress: AnalysisProgress) => void
  ): Promise<AnalysisResult> {
    const allExtractedData: Partial<ExtractedFormData> = {};
    const allConfidence: Record<string, number> = {};
    const allLogs: string[] = [];

    // 阶段1: 上传处理
    onProgress?.({
      stage: 'uploading',
      progress: 20,
      message: '正在处理上传的内容...'
    });
    await new Promise(resolve => setTimeout(resolve, 500));

    // 阶段2: 文本分析
    if (data.text) {
      onProgress?.({
        stage: 'analyzing',
        progress: 40,
        message: '正在分析文本内容...'
      });
      await new Promise(resolve => setTimeout(resolve, 1000));

      const textResult = this.extractFromText(data.text);
      Object.assign(allExtractedData, textResult.data);
      Object.assign(allConfidence, textResult.confidence);
      allLogs.push(...textResult.log);
    }

    // 阶段3: 图片分析
    if (data.images && data.images.length > 0) {
      onProgress?.({
        stage: 'analyzing',
        progress: 60,
        message: '正在分析图片内容...'
      });
      await new Promise(resolve => setTimeout(resolve, 1500));

      const imageResult = this.simulateImageAnalysis(data.images);
      // 合并数据，文本分析优先级更高
      Object.keys(imageResult.data).forEach(key => {
        if (!allExtractedData[key as keyof ExtractedFormData]) {
          allExtractedData[key as keyof ExtractedFormData] = imageResult.data[key as keyof ExtractedFormData];
          allConfidence[key] = imageResult.confidence[key];
        }
      });
      allLogs.push(...imageResult.log);
    }

    // 阶段4: 数据整理
    onProgress?.({
      stage: 'extracting',
      progress: 80,
      message: '正在整理提取的信息...'
    });
    await new Promise(resolve => setTimeout(resolve, 800));

    // 确定已提取和未提取的字段
    const allFields: (keyof ExtractedFormData)[] = [
      'essayType', 'topic', 'essayLength', 'lengthType', 'essayLevel', 
      'citationStyle', 'language', 'audience', 'thesis', 'structure', 'materials'
    ];

    const extractedFields = allFields.filter(field => 
      allExtractedData[field] !== undefined && allExtractedData[field] !== ''
    );

    const remainingFields = allFields.filter(field => 
      !extractedFields.includes(field)
    );

    // 完成
    onProgress?.({
      stage: 'completed',
      progress: 100,
      message: `分析完成！已提取 ${extractedFields.length} 个字段信息`
    });

    return {
      extractedData: allExtractedData,
      confidence: allConfidence,
      extractedFields,
      remainingFields,
      analysisLog: allLogs
    };
  }
}

export default FormAnalyzer;