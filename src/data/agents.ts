import { Agent, AgentRole, QuickAction, AgentMessage, AgentSuggestion } from '../types';

// Agent 配置数据
export const AGENTS: Record<AgentRole, Agent> = {
  'academic-writing-expert': {
    id: 'agent-writing-expert',
    role: 'academic-writing-expert',
    name: '学术写作专家',
    description: '专注于学术写作规范、语言表达和论文结构优化',
    avatar: '👨‍🎓',
    capabilities: [
      '学术语言润色',
      '论文结构优化',
      '写作风格指导',
      '语法检查',
      '逻辑连贯性分析'
    ],
    expertise: [
      '学术写作规范',
      '论文结构设计',
      '科学表达',
      '批判性思维',
      '文献综述写作'
    ],
    isActive: true
  },
  'research-assistant': {
    id: 'agent-research-assistant',
    role: 'research-assistant',
    name: '研究助手',
    description: '协助文献检索、数据分析和研究方法指导',
    avatar: '🔬',
    capabilities: [
      '文献检索建议',
      '研究方法指导',
      '数据分析协助',
      '实验设计建议',
      '统计分析指导'
    ],
    expertise: [
      '文献管理',
      '研究方法论',
      '数据收集',
      '统计分析',
      '实证研究'
    ],
    isActive: true
  },
  'format-expert': {
    id: 'agent-format-expert',
    role: 'format-expert',
    name: '格式专家',
    description: '专门处理引用格式、排版规范和学术标准',
    avatar: '📝',
    capabilities: [
      '引用格式检查',
      '排版规范指导',
      '图表格式优化',
      '参考文献管理',
      '期刊投稿格式'
    ],
    expertise: [
      'APA格式',
      'MLA格式',
      'Chicago格式',
      'IEEE格式',
      '图表设计规范'
    ],
    isActive: true
  },
  'content-advisor': {
    id: 'agent-content-advisor',
    role: 'content-advisor',
    name: '内容顾问',
    description: '提供内容策略、逻辑架构和论证强化建议',
    avatar: '💡',
    capabilities: [
      '内容结构分析',
      '论证逻辑检查',
      '观点强化建议',
      '创新性评估',
      '读者体验优化'
    ],
    expertise: [
      '逻辑推理',
      '内容策略',
      '论证结构',
      '创新思维',
      '学术传播'
    ],
    isActive: true
  }
};

// 快捷操作配置
export const QUICK_ACTIONS: QuickAction[] = [
  // 文献检索相关
  {
    id: 'search-literature',
    label: '查找文献',
    icon: '🔍',
    agentRole: 'research-assistant',
    description: '基于当前内容推荐相关文献',
    category: 'search'
  },
  {
    id: 'verify-citations',
    label: '验证引用',
    icon: '✅',
    agentRole: 'format-expert',
    description: '检查引用格式和完整性',
    category: 'check'
  },
  
  // 结构优化相关
  {
    id: 'optimize-structure',
    label: '优化结构',
    icon: '🏗️',
    agentRole: 'content-advisor',
    description: '分析并建议改进论文结构',
    category: 'optimize'
  },
  {
    id: 'check-logic',
    label: '逻辑检查',
    icon: '🧠',
    agentRole: 'content-advisor',
    description: '检查论证逻辑和连贯性',
    category: 'check'
  },
  
  // 格式检查相关
  {
    id: 'format-check',
    label: '检查格式',
    icon: '📋',
    agentRole: 'format-expert',
    description: '全面检查文档格式规范',
    category: 'check'
  },
  {
    id: 'table-charts',
    label: '图表优化',
    icon: '📊',
    agentRole: 'format-expert',
    description: '优化图表格式和设计',
    category: 'enhance'
  },
  
  // 语言润色相关
  {
    id: 'polish-language',
    label: '润色语言',
    icon: '✨',
    agentRole: 'academic-writing-expert',
    description: '提升学术表达的准确性和流畅性',
    category: 'enhance'
  },
  {
    id: 'grammar-check',
    label: '语法检查',
    icon: '📝',
    agentRole: 'academic-writing-expert',
    description: '检查语法错误和表达问题',
    category: 'check'
  },
  
  // 数据分析相关
  {
    id: 'data-analysis',
    label: '数据分析',
    icon: '📈',
    agentRole: 'research-assistant',
    description: '协助数据分析和统计检验',
    category: 'analyze'
  },
  {
    id: 'methodology-review',
    label: '方法审查',
    icon: '🔬',
    agentRole: 'research-assistant',
    description: '评估研究方法的适当性',
    category: 'analyze'
  },
  
  // 写作建议相关
  {
    id: 'writing-suggestions',
    label: '写作建议',
    icon: '💭',
    agentRole: 'academic-writing-expert',
    description: '提供针对性写作改进建议',
    category: 'enhance'
  },
  {
    id: 'innovation-assessment',
    label: '创新评估',
    icon: '🌟',
    agentRole: 'content-advisor',
    description: '评估内容的创新性和贡献',
    category: 'analyze'
  }
];

// 模拟AI响应数据
export const MOCK_RESPONSES = {
  'search-literature': {
    suggestions: [
      {
        id: 'lit-1',
        type: 'enhancement' as const,
        title: '相关文献推荐',
        content: '基于您当前的研究内容，我推荐以下几篇高质量文献：\n\n1. Smith, J. (2023). "Deep Learning Applications in Academic Research" - 引用量较高，方法论先进\n\n2. Chen, L. et al. (2022). "Systematic Review Methodologies" - 与您的研究方法相关\n\n3. Brown, M. (2023). "Statistical Analysis in Social Sciences" - 数据分析方法参考',
        confidence: 0.85
      }
    ],
    actions: [
      {
        id: 'add-citations',
        type: 'add-reference',
        label: '添加到参考文献',
        description: '将推荐文献添加到当前论文',
        icon: '📚'
      }
    ]
  },
  
  'optimize-structure': {
    suggestions: [
      {
        id: 'struct-1',
        type: 'improvement' as const,
        title: '结构优化建议',
        content: '您的论文结构总体良好，建议以下改进：\n\n1. 在第二章添加理论框架小节，加强理论基础\n2. 第三章的方法论部分可以细分为数据收集和分析两个子章节\n3. 结论部分建议增加研究局限性和未来研究方向的讨论',
        confidence: 0.90
      }
    ],
    actions: [
      {
        id: 'apply-structure',
        type: 'restructure',
        label: '应用结构建议',
        description: '自动调整论文章节结构',
        icon: '🔧'
      }
    ]
  },
  
  'polish-language': {
    suggestions: [
      {
        id: 'lang-1',
        type: 'correction' as const,
        title: '语言表达优化',
        content: '以下是针对所选段落的语言改进建议：\n\n原文："这个研究很重要"\n建议改为："本研究具有重要的理论意义和实践价值"\n\n原文："我们发现了"\n建议改为："研究结果表明"或"数据分析显示"',
        confidence: 0.92
      }
    ],
    actions: [
      {
        id: 'apply-polish',
        type: 'text-replace',
        label: '应用润色建议',
        description: '自动应用语言改进',
        icon: '✏️'
      }
    ]
  },
  
  'format-check': {
    suggestions: [
      {
        id: 'format-1',
        type: 'warning' as const,
        title: '格式规范检查',
        content: '发现以下格式问题需要修正：\n\n1. 第5页图表标题格式不统一\n2. 参考文献第3、7、12条缺少DOI信息\n3. 页眉页脚格式需要调整\n4. 表格边框样式不符合期刊要求',
        confidence: 0.88
      }
    ],
    actions: [
      {
        id: 'fix-format',
        type: 'format-fix',
        label: '修复格式问题',
        description: '自动修复检测到的格式问题',
        icon: '🛠️'
      }
    ]
  },
  
  'data-analysis': {
    suggestions: [
      {
        id: 'data-1',
        type: 'enhancement' as const,
        title: '数据分析建议',
        content: '基于您的数据特征，建议采用以下分析方法：\n\n1. 描述性统计：均值、标准差、分布特征\n2. 相关性分析：Pearson或Spearman相关\n3. 回归分析：多元线性回归或逻辑回归\n4. 效应量计算：Cohen\'s d或η²\n\n建议使用SPSS或R进行分析。',
        confidence: 0.87
      }
    ],
    actions: [
      {
        id: 'generate-analysis',
        type: 'analysis-template',
        label: '生成分析模板',
        description: '创建数据分析代码模板',
        icon: '📊'
      }
    ]
  }
};