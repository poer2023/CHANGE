// 文章状态枚举
export enum ArticleStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

// 文章类型枚举
export enum ArticleType {
  ACADEMIC_PAPER = 'academic_paper',
  TECH_REVIEW = 'tech_review',
  SOCIAL_ANALYSIS = 'social_analysis',
  LITERARY_CRITICISM = 'literary_criticism',
  BUSINESS_ANALYSIS = 'business_analysis',
  RESEARCH_REPORT = 'research_report',
  OPINION_PIECE = 'opinion_piece',
  CASE_STUDY = 'case_study'
}

// 目标读者类型
export enum TargetAudience {
  GENERAL_PUBLIC = 'general_public',
  ACADEMICS = 'academics',
  PROFESSIONALS = 'professionals',
  STUDENTS = 'students',
  INDUSTRY_EXPERTS = 'industry_experts',
  DECISION_MAKERS = 'decision_makers'
}

// 语言类型
export enum Language {
  CHINESE = 'zh-CN',
  ENGLISH = 'en-US',
  BILINGUAL = 'bilingual'
}

// 文章元数据接口
export interface ArticleMetadata {
  wordCount: number;
  language: Language;
  targetAudience: TargetAudience;
  estimatedReadTime: number; // 分钟
  keywords: string[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  citations?: number;
  references?: string[];
}

// 文章段落接口
export interface ArticleParagraph {
  id: string;
  type: 'heading' | 'paragraph' | 'quote' | 'list' | 'code';
  content: string;
  level?: number; // 用于标题级别
  order: number;
}

// 文章数据接口
export interface Article {
  id: string;
  title: string;
  type: ArticleType;
  status: ArticleStatus;
  abstract: string;
  content: ArticleParagraph[];
  metadata: ArticleMetadata;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  version: number;
  outline?: string[];
  collaborators?: string[];
  comments?: number;
  likes?: number;
  shares?: number;
}

// 历史记录过滤器接口
export interface HistoryFilter {
  type?: ArticleType[];
  status?: ArticleStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  author?: string;
  keyword?: string;
  minWordCount?: number;
  maxWordCount?: number;
}

// 历史记录排序选项
export interface HistorySortOptions {
  field: 'createdAt' | 'updatedAt' | 'title' | 'wordCount' | 'likes';
  order: 'asc' | 'desc';
}

// 示例文章数据
export const sampleArticles: Article[] = [
  {
    id: 'article-001',
    title: '人工智能在现代教育中的应用与挑战',
    type: ArticleType.ACADEMIC_PAPER,
    status: ArticleStatus.COMPLETED,
    abstract: '本文深入探讨了人工智能技术在教育领域的应用现状，分析了AI教育工具的优势与局限性，并提出了未来发展的建议和策略。',
    content: [
      {
        id: 'p1',
        type: 'heading',
        content: '引言',
        level: 1,
        order: 1
      },
      {
        id: 'p2',
        type: 'paragraph',
        content: '随着人工智能技术的快速发展，教育领域正在经历前所未有的变革。从智能辅导系统到个性化学习平台，AI技术正在重新定义教学和学习的方式。本研究旨在全面分析人工智能在教育中的应用现状，探讨其带来的机遇与挑战。',
        order: 2
      },
      {
        id: 'p3',
        type: 'heading',
        content: '人工智能在教育中的主要应用',
        level: 2,
        order: 3
      },
      {
        id: 'p4',
        type: 'paragraph',
        content: '当前，人工智能在教育领域的应用主要体现在以下几个方面：个性化学习推荐、智能评估系统、自动化批改、虚拟教学助手等。这些应用不仅提高了教学效率，还为学习者提供了更加个性化和精准的学习体验。',
        order: 4
      },
      {
        id: 'p5',
        type: 'heading',
        content: '技术优势分析',
        level: 2,
        order: 5
      },
      {
        id: 'p6',
        type: 'paragraph',
        content: 'AI教育技术的主要优势包括：1）数据驱动的个性化学习路径设计；2）实时学习反馈和调整；3）大规模教育资源的智能管理；4）学习行为的深度分析和预测。这些优势使得教育能够更好地适应每个学习者的独特需求。',
        order: 6
      },
      {
        id: 'p7',
        type: 'heading',
        content: '面临的挑战',
        level: 2,
        order: 7
      },
      {
        id: 'p8',
        type: 'paragraph',
        content: '尽管AI技术在教育中展现出巨大潜力，但也面临诸多挑战：数据隐私保护、算法偏见、技术依赖性、教师角色转变等。这些挑战需要教育工作者、技术开发者和政策制定者共同应对。',
        order: 8
      },
      {
        id: 'p9',
        type: 'heading',
        content: '未来发展建议',
        level: 2,
        order: 9
      },
      {
        id: 'p10',
        type: 'paragraph',
        content: '为了更好地发挥人工智能在教育中的作用，建议：1）建立完善的数据治理框架；2）加强教师的AI素养培训；3）促进产学研合作；4）制定相关政策和标准。只有通过多方协作，才能实现AI技术在教育中的健康发展。',
        order: 10
      },
      {
        id: 'p11',
        type: 'heading',
        content: '结论',
        level: 1,
        order: 11
      },
      {
        id: 'p12',
        type: 'paragraph',
        content: '人工智能技术为教育带来了革命性的变化，但其应用需要在技术创新与教育本质之间找到平衡。未来的教育将是人机协作的教育，关键在于如何有效整合AI技术与人文关怀，创造更加智慧、公平和有效的教育环境。',
        order: 12
      }
    ],
    metadata: {
      wordCount: 1250,
      language: Language.CHINESE,
      targetAudience: TargetAudience.ACADEMICS,
      estimatedReadTime: 5,
      keywords: ['人工智能', '教育技术', '个性化学习', '智能教育'],
      tags: ['AI', '教育', '技术应用', '学术研究'],
      difficulty: 'intermediate',
      citations: 15,
      references: [
        'Zhang, L. (2023). AI in Education: Current Trends and Future Prospects',
        'Wang, M. (2022). Personalized Learning Through Artificial Intelligence',
        'Li, S. (2023). Challenges of AI Implementation in Educational Systems'
      ]
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    author: '张教授',
    version: 3,
    outline: ['引言', '主要应用', '优势分析', '面临挑战', '发展建议', '结论'],
    collaborators: ['李研究员', '王博士'],
    comments: 12,
    likes: 89,
    shares: 23
  },
  
  {
    id: 'article-002',
    title: '区块链技术发展趋势与未来展望',
    type: ArticleType.TECH_REVIEW,
    status: ArticleStatus.COMPLETED,
    abstract: '本文分析了区块链技术的最新发展动态，探讨了其在各行业的应用前景，并对未来技术演进趋势进行了深入分析。',
    content: [
      {
        id: 'p1',
        type: 'heading',
        content: '区块链技术概述',
        level: 1,
        order: 1
      },
      {
        id: 'p2',
        type: 'paragraph',
        content: '区块链作为一种分布式账本技术，自2008年比特币诞生以来，已经发展成为影响多个行业的重要技术。其去中心化、不可篡改、透明性等特征，为数字经济时代的信任机制建设提供了新的解决方案。',
        order: 2
      },
      {
        id: 'p3',
        type: 'heading',
        content: '当前发展状况',
        level: 2,
        order: 3
      },
      {
        id: 'p4',
        type: 'paragraph',
        content: '2024年，区块链技术在可扩展性、互操作性和可持续性方面取得了显著进展。以太坊2.0的成功升级、Layer 2解决方案的广泛应用，以及跨链技术的成熟，标志着区块链技术正在向更加实用和高效的方向发展。',
        order: 4
      },
      {
        id: 'p5',
        type: 'heading',
        content: '行业应用案例',
        level: 2,
        order: 5
      },
      {
        id: 'p6',
        type: 'paragraph',
        content: '金融服务、供应链管理、数字身份认证、版权保护等领域的区块链应用日趋成熟。特别是在跨境支付、商品溯源、数字资产管理等方面，区块链技术已经展现出巨大的商业价值和社会效益。',
        order: 6
      },
      {
        id: 'p7',
        type: 'heading',
        content: '技术创新趋势',
        level: 2,
        order: 7
      },
      {
        id: 'p8',
        type: 'paragraph',
        content: '未来区块链技术的发展将聚焦于：零知识证明技术的广泛应用、量子抗性算法的集成、绿色挖矿和共识机制的优化、以及与AI、IoT等技术的深度融合。这些创新将进一步拓展区块链的应用边界。',
        order: 8
      },
      {
        id: 'p9',
        type: 'heading',
        content: '面临的挑战',
        level: 2,
        order: 9
      },
      {
        id: 'p10',
        type: 'paragraph',
        content: '尽管发展前景广阔，区块链技术仍面临监管政策不明确、技术标准不统一、用户接受度有待提高等挑战。这些问题需要技术社区、企业和政府部门的共同努力来解决。',
        order: 10
      },
      {
        id: 'p11',
        type: 'heading',
        content: '未来展望',
        level: 1,
        order: 11
      },
      {
        id: 'p12',
        type: 'paragraph',
        content: '预计到2030年，区块链技术将在全球数字经济中发挥更加重要的作用。随着技术的不断成熟和应用场景的拓展，区块链有望成为数字社会基础设施的重要组成部分，推动建立更加透明、高效和可信的数字生态系统。',
        order: 12
      }
    ],
    metadata: {
      wordCount: 980,
      language: Language.CHINESE,
      targetAudience: TargetAudience.PROFESSIONALS,
      estimatedReadTime: 4,
      keywords: ['区块链', '分布式账本', '数字经济', '技术创新'],
      tags: ['区块链', '金融科技', '技术分析', '行业趋势'],
      difficulty: 'intermediate'
    },
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-12'),
    author: '李技术专家',
    version: 2,
    outline: ['技术概述', '发展状况', '应用案例', '创新趋势', '面临挑战', '未来展望'],
    comments: 8,
    likes: 67,
    shares: 15
  },

  {
    id: 'article-003',
    title: '远程工作模式对现代社会的深远影响',
    type: ArticleType.SOCIAL_ANALYSIS,
    status: ArticleStatus.COMPLETED,
    abstract: '疫情加速了远程工作的普及，本文分析了这一工作模式变革对社会结构、经济发展和个人生活方式的多重影响。',
    content: [
      {
        id: 'p1',
        type: 'heading',
        content: '远程工作的兴起背景',
        level: 1,
        order: 1
      },
      {
        id: 'p2',
        type: 'paragraph',
        content: '2020年全球疫情的爆发，迫使世界各地的企业和员工快速适应远程工作模式。这一原本被视为特殊情况下的临时措施，如今已演变为许多组织的长期战略选择，深刻改变着现代社会的工作方式和生活模式。',
        order: 2
      },
      {
        id: 'p3',
        type: 'heading',
        content: '对劳动力市场的影响',
        level: 2,
        order: 3
      },
      {
        id: 'p4',
        type: 'paragraph',
        content: '远程工作打破了地理限制，创造了全球化的人才市场。企业可以在世界范围内招聘最优秀的人才，而员工也获得了更多的就业机会。这种变化促进了人才流动，但也加剧了某些地区和行业的竞争。',
        order: 4
      },
      {
        id: 'p5',
        type: 'heading',
        content: '城市发展模式的转变',
        level: 2,
        order: 5
      },
      {
        id: 'p6',
        type: 'paragraph',
        content: '随着通勤需求的减少，传统的"卧城"模式正在发生改变。许多人选择离开昂贵的大城市，迁移到生活成本较低的地区。这一趋势正在重塑城市规划理念，推动分布式城市发展模式的兴起。',
        order: 6
      },
      {
        id: 'p7',
        type: 'heading',
        content: '社会关系与文化变迁',
        level: 2,
        order: 7
      },
      {
        id: 'p8',
        type: 'paragraph',
        content: '远程工作改变了传统的工作场所社交模式，虚拟协作成为新常态。这既带来了工作灵活性的提升，也引发了对职场文化、团队凝聚力和员工心理健康的新思考。数字化社交工具的普及正在重新定义人际关系的建立和维护方式。',
        order: 8
      },
      {
        id: 'p9',
        type: 'heading',
        content: '经济结构的深层调整',
        level: 2,
        order: 9
      },
      {
        id: 'p10',
        type: 'paragraph',
        content: '远程工作模式推动了数字经济的快速发展，云服务、协作软件、网络安全等行业迎来爆发式增长。同时，传统的商业地产、交通运输等行业面临结构性调整。这种经济结构的重组正在创造新的增长点和就业机会。',
        order: 10
      },
      {
        id: 'p11',
        type: 'heading',
        content: '挑战与应对策略',
        level: 2,
        order: 11
      },
      {
        id: 'p12',
        type: 'paragraph',
        content: '远程工作也带来了新的挑战：工作与生活边界模糊、团队管理难度增加、数字鸿沟加剧等问题。应对这些挑战需要政府、企业和个人的共同努力，通过政策引导、技术创新和文化适应来构建更加完善的远程工作生态。',
        order: 12
      },
      {
        id: 'p13',
        type: 'heading',
        content: '未来发展趋势',
        level: 1,
        order: 13
      },
      {
        id: 'p14',
        type: 'paragraph',
        content: '展望未来，远程工作将与传统办公模式并存，形成更加多元化和灵活的工作生态。混合办公模式可能成为主流，技术进步将继续降低远程协作的障碍。这一变革将持续影响社会的各个层面，推动人类工作方式向更加人性化和高效化的方向发展。',
        order: 14
      }
    ],
    metadata: {
      wordCount: 1180,
      language: Language.CHINESE,
      targetAudience: TargetAudience.GENERAL_PUBLIC,
      estimatedReadTime: 5,
      keywords: ['远程工作', '社会变迁', '数字化转型', '工作模式'],
      tags: ['社会分析', '工作趋势', '数字经济', '生活方式'],
      difficulty: 'intermediate'
    },
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-28'),
    author: '王社会学者',
    version: 2,
    outline: ['兴起背景', '劳动力影响', '城市发展', '社会关系', '经济调整', '挑战应对', '发展趋势'],
    comments: 15,
    likes: 92,
    shares: 31
  },

  {
    id: 'article-004',
    title: '现代诗歌的艺术特征与文化价值探析',
    type: ArticleType.LITERARY_CRITICISM,
    status: ArticleStatus.COMPLETED,
    abstract: '本文深入分析了21世纪现代诗歌的创作特点，探讨了其在当代文化语境下的艺术价值和社会意义。',
    content: [
      {
        id: 'p1',
        type: 'heading',
        content: '现代诗歌的时代背景',
        level: 1,
        order: 1
      },
      {
        id: 'p2',
        type: 'paragraph',
        content: '21世纪的现代诗歌诞生于一个信息爆炸、文化多元、技术革新的时代。诗人们面对着前所未有的表达媒介和文化环境，这为诗歌创作带来了新的可能性，也提出了新的挑战。现代诗歌不再局限于传统的纸质载体，而是拥抱了数字媒体、多媒体艺术等新形式。',
        order: 2
      },
      {
        id: 'p3',
        type: 'heading',
        content: '语言创新与实验性',
        level: 2,
        order: 3
      },
      {
        id: 'p4',
        type: 'paragraph',
        content: '现代诗歌最显著的特征之一是对语言的大胆实验。诗人们突破传统的语法结构，采用碎片化、拼贴式的表达方式，融合网络语言、方言俚语等多种语言形式。这种语言创新不仅丰富了诗歌的表现力，也反映了当代社会语言使用的多样性和复杂性。',
        order: 4
      },
      {
        id: 'p5',
        type: 'quote',
        content: '诗歌是语言的艺术，而现代诗歌正在重新定义语言本身的边界。',
        order: 5
      },
      {
        id: 'p6',
        type: 'heading',
        content: '主题的多元化与个人化',
        level: 2,
        order: 6
      },
      {
        id: 'p7',
        type: 'paragraph',
        content: '现代诗歌的主题呈现出前所未有的多元化特征。从个人内心的微观体验到全球化的宏大叙事，从环保议题到数字生活的反思，诗人们以更加个人化的视角观察和表达世界。这种个人化的表达方式使得每首诗都成为独特的精神产品，具有不可替代的价值。',
        order: 7
      },
      {
        id: 'p8',
        type: 'heading',
        content: '形式创新与跨媒体表达',
        level: 2,
        order: 8
      },
      {
        id: 'p9',
        type: 'paragraph',
        content: '现代诗歌在形式上表现出强烈的实验精神。视觉诗、声音诗、互动诗等新形式层出不穷。诗人们不再满足于文字的平面表达，而是积极探索诗歌与音乐、绘画、数字艺术的结合，创造出更加丰富的艺术体验。',
        order: 9
      },
      {
        id: 'p10',
        type: 'heading',
        content: '文化反思与社会关怀',
        level: 2,
        order: 10
      },
      {
        id: 'p11',
        type: 'paragraph',
        content: '优秀的现代诗歌往往承载着深刻的文化反思和社会关怀。诗人们通过敏锐的观察和独特的表达，揭示当代社会的矛盾和问题，传达对人类命运的思考。这种关怀不是抽象的说教，而是通过具体的意象和情感体验来触动读者的心灵。',
        order: 11
      },
      {
        id: 'p12',
        type: 'heading',
        content: '数字时代的传播与影响',
        level: 2,
        order: 12
      },
      {
        id: 'p13',
        type: 'paragraph',
        content: '互联网和社交媒体改变了诗歌的传播方式和影响范围。微博、微信、短视频等平台为诗歌提供了新的展示空间，也培养了新的读者群体。这种传播方式的变化不仅扩大了诗歌的影响力，也对诗歌创作本身产生了影响。',
        order: 13
      },
      {
        id: 'p14',
        type: 'heading',
        content: '文化价值与当代意义',
        level: 1,
        order: 14
      },
      {
        id: 'p15',
        type: 'paragraph',
        content: '现代诗歌在当代文化中具有重要价值：它保持着对语言纯净性的守护，提供着对快节奏生活的诗意反思，承担着文化传承与创新的使命。在一个日益物质化的世界中，诗歌为人们保留了精神家园，提醒我们不要忘记内心的声音和生活的诗意。',
        order: 15
      }
    ],
    metadata: {
      wordCount: 1320,
      language: Language.CHINESE,
      targetAudience: TargetAudience.ACADEMICS,
      estimatedReadTime: 6,
      keywords: ['现代诗歌', '文学批评', '艺术特征', '文化价值'],
      tags: ['文学', '诗歌', '文化研究', '艺术分析'],
      difficulty: 'advanced'
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
    author: '刘文学教授',
    version: 2,
    outline: ['时代背景', '语言创新', '主题多元', '形式创新', '文化反思', '数字传播', '文化价值'],
    comments: 7,
    likes: 45,
    shares: 12
  },

  {
    id: 'article-005',
    title: '数字营销策略的演进与企业应用实践',
    type: ArticleType.BUSINESS_ANALYSIS,
    status: ArticleStatus.COMPLETED,
    abstract: '本文分析了数字营销在移动互联网时代的发展趋势，探讨了成功企业的数字营销实践案例，并提出了未来营销策略的发展方向。',
    content: [
      {
        id: 'p1',
        type: 'heading',
        content: '数字营销的发展历程',
        level: 1,
        order: 1
      },
      {
        id: 'p2',
        type: 'paragraph',
        content: '数字营销的发展经历了从传统网络营销到移动社交营销，再到当前AI驱动的精准营销的演进过程。每一个阶段都伴随着技术进步和消费者行为的变化，推动着营销理念和实践方式的革新。',
        order: 2
      },
      {
        id: 'p3',
        type: 'heading',
        content: '当前数字营销的核心特征',
        level: 2,
        order: 3
      },
      {
        id: 'p4',
        type: 'paragraph',
        content: '现代数字营销具有以下核心特征：数据驱动的决策制定、个性化的用户体验、全渠道的整合营销、实时的效果监测与优化。这些特征使得数字营销能够更精准地触达目标用户，提高营销投资回报率。',
        order: 4
      },
      {
        id: 'p5',
        type: 'heading',
        content: '成功案例分析',
        level: 2,
        order: 5
      },
      {
        id: 'p6',
        type: 'paragraph',
        content: '以某知名电商平台为例，其通过大数据分析用户购买行为，结合AI算法进行商品推荐，同时在社交媒体上开展内容营销，形成了完整的数字营销生态。这种多维度的营销策略不仅提升了用户粘性，也显著提高了销售转化率。',
        order: 6
      },
      {
        id: 'p7',
        type: 'heading',
        content: '新兴营销渠道的崛起',
        level: 2,
        order: 7
      },
      {
        id: 'p8',
        type: 'paragraph',
        content: '短视频平台、直播电商、KOL营销等新兴渠道正在重塑数字营销格局。这些渠道具有强互动性、高传播效率和良好的转化效果，为企业提供了更多样化的营销选择。企业需要根据自身特点和目标用户特征，选择合适的营销渠道组合。',
        order: 8
      },
      {
        id: 'p9',
        type: 'heading',
        content: '数据隐私与合规挑战',
        level: 2,
        order: 9
      },
      {
        id: 'p10',
        type: 'paragraph',
        content: '随着数据保护法规的完善，企业在进行数字营销时面临着更严格的合规要求。如何在保护用户隐私的前提下，实现有效的营销目标，成为企业必须解决的重要问题。这要求企业在营销策略制定时充分考虑法律风险和伦理责任。',
        order: 10
      },
      {
        id: 'p11',
        type: 'heading',
        content: '技术创新驱动的营销变革',
        level: 2,
        order: 11
      },
      {
        id: 'p12',
        type: 'paragraph',
        content: 'AI、AR/VR、区块链等新技术正在为数字营销带来新的可能性。智能客服、虚拟试用、NFT营销等创新应用，不仅提升了用户体验，也为品牌营销创造了新的价值点。企业应积极拥抱技术创新，探索适合自身的营销新模式。',
        order: 12
      },
      {
        id: 'p13',
        type: 'heading',
        content: '未来发展趋势预测',
        level: 1,
        order: 13
      },
      {
        id: 'p14',
        type: 'paragraph',
        content: '未来的数字营销将呈现以下趋势：更加智能化的自动化营销、更注重情感连接的品牌建设、更强调可持续发展的营销理念。企业需要在技术应用和人文关怀之间找到平衡，构建既高效又有温度的营销体系。',
        order: 14
      },
      {
        id: 'p15',
        type: 'heading',
        content: '实施建议',
        level: 2,
        order: 15
      },
      {
        id: 'p16',
        type: 'paragraph',
        content: '对于希望优化数字营销策略的企业，建议：1）建立完善的数据分析体系；2）投资营销技术和人才培养；3）注重品牌价值与用户体验的统一；4）保持对新技术和新趋势的敏感度。只有不断学习和适应，才能在激烈的市场竞争中占据优势地位。',
        order: 16
      }
    ],
    metadata: {
      wordCount: 1450,
      language: Language.CHINESE,
      targetAudience: TargetAudience.PROFESSIONALS,
      estimatedReadTime: 6,
      keywords: ['数字营销', '商业策略', '营销创新', '企业实践'],
      tags: ['营销', '商业分析', '数字化转型', '企业管理'],
      difficulty: 'intermediate'
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
    author: '陈营销总监',
    version: 3,
    outline: ['发展历程', '核心特征', '成功案例', '新兴渠道', '合规挑战', '技术创新', '发展趋势', '实施建议'],
    comments: 11,
    likes: 78,
    shares: 22
  },

  {
    id: 'article-006',
    title: '可持续发展目标下的企业环境责任研究',
    type: ArticleType.RESEARCH_REPORT,
    status: ArticleStatus.IN_PROGRESS,
    abstract: '本研究报告分析了联合国可持续发展目标框架下，企业在环境保护方面的责任担当和实践路径。',
    content: [
      {
        id: 'p1',
        type: 'heading',
        content: '研究背景与意义',
        level: 1,
        order: 1
      },
      {
        id: 'p2',
        type: 'paragraph',
        content: '随着全球气候变化和环境问题的日益严重，企业作为经济活动的主要参与者，其环境责任日益受到关注。本研究基于联合国2030年可持续发展目标，深入分析企业在环境保护中的作用和责任。',
        order: 2
      },
      {
        id: 'p3',
        type: 'heading',
        content: '研究方法',
        level: 2,
        order: 3
      },
      {
        id: 'p4',
        type: 'paragraph',
        content: '本研究采用混合研究方法，结合文献分析、案例研究和实地调研。选取了50家不同行业的领先企业作为样本，分析其环境责任实践情况。',
        order: 4
      },
      {
        id: 'p5',
        type: 'heading',
        content: '主要发现',
        level: 2,
        order: 5
      },
      {
        id: 'p6',
        type: 'paragraph',
        content: '研究发现，69%的样本企业已建立了明确的环境责任战略，45%的企业设立了具体的碳中和目标。然而，在实施效果方面仍存在较大差异，主要受到行业特征、企业规模和管理层承诺等因素影响。',
        order: 6
      }
    ],
    metadata: {
      wordCount: 650,
      language: Language.CHINESE,
      targetAudience: TargetAudience.ACADEMICS,
      estimatedReadTime: 3,
      keywords: ['可持续发展', '企业责任', '环境保护', '研究报告'],
      tags: ['研究', '环保', '企业管理', '可持续发展'],
      difficulty: 'advanced'
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-20'),
    author: '环境研究团队',
    version: 1,
    outline: ['研究背景', '研究方法', '主要发现', '案例分析', '建议与展望'],
    comments: 3,
    likes: 25,
    shares: 8
  },

  {
    id: 'article-007',
    title: '5G技术对智慧城市建设的推动作用',
    type: ArticleType.TECH_REVIEW,
    status: ArticleStatus.DRAFT,
    abstract: '探讨5G技术在智慧城市建设中的关键作用，分析其在交通、医疗、教育等领域的应用前景。',
    content: [
      {
        id: 'p1',
        type: 'heading',
        content: '5G技术概述',
        level: 1,
        order: 1
      },
      {
        id: 'p2',
        type: 'paragraph',
        content: '5G作为第五代移动通信技术，具有高速率、低延迟、大连接的特点，为智慧城市的建设提供了强有力的技术支撑。',
        order: 2
      }
    ],
    metadata: {
      wordCount: 200,
      language: Language.CHINESE,
      targetAudience: TargetAudience.PROFESSIONALS,
      estimatedReadTime: 1,
      keywords: ['5G', '智慧城市', '技术应用'],
      tags: ['5G', '智慧城市', '技术创新'],
      difficulty: 'intermediate'
    },
    createdAt: new Date('2024-02-18'),
    updatedAt: new Date('2024-02-18'),
    author: '科技评论员',
    version: 1,
    outline: ['技术概述', '应用领域', '案例分析', '挑战与机遇'],
    comments: 0,
    likes: 5,
    shares: 1
  },

  {
    id: 'article-008',
    title: '新媒体时代的文化传播与价值重构',
    type: ArticleType.OPINION_PIECE,
    status: ArticleStatus.COMPLETED,
    abstract: '分析新媒体技术如何改变文化传播方式，探讨传统文化价值在数字时代的传承与创新。',
    content: [
      {
        id: 'p1',
        type: 'heading',
        content: '新媒体时代的文化生态',
        level: 1,
        order: 1
      },
      {
        id: 'p2',
        type: 'paragraph',
        content: '新媒体技术的普及彻底改变了文化传播的生态环境。传统的单向传播模式被多元化、交互式的传播网络所取代，每个人既是文化的接受者，也是创造者和传播者。这种变化为文化的多样性发展提供了前所未有的机遇。',
        order: 2
      },
      {
        id: 'p3',
        type: 'heading',
        content: '传统文化的数字化重生',
        level: 2,
        order: 3
      },
      {
        id: 'p4',
        type: 'paragraph',
        content: '在新媒体平台上，传统文化正在经历数字化的重生。从故宫的文创产品到非遗技艺的短视频展示，传统文化找到了与年轻一代对话的新方式。这种数字化不仅保护了文化遗产，更让其焕发出新的生命力。',
        order: 4
      },
      {
        id: 'p5',
        type: 'heading',
        content: '文化价值的重新定义',
        level: 2,
        order: 5
      },
      {
        id: 'p6',
        type: 'paragraph',
        content: '新媒体时代，文化价值的判断标准正在发生变化。传播量、互动度、影响力等数字化指标成为衡量文化产品价值的重要维度。这种变化既带来了机遇，也提出了如何在追求传播效果的同时保持文化深度的挑战。',
        order: 6
      },
      {
        id: 'p7',
        type: 'heading',
        content: '文化创新的新路径',
        level: 2,
        order: 7
      },
      {
        id: 'p8',
        type: 'paragraph',
        content: '新媒体为文化创新提供了新的路径和工具。VR技术让人们身临其境地体验历史文化，AI技术帮助创作者探索新的艺术表现形式，区块链技术为文化产品的版权保护提供了新的解决方案。技术与文化的深度融合正在创造出前所未有的文化体验。',
        order: 8
      },
      {
        id: 'p9',
        type: 'heading',
        content: '面临的挑战与思考',
        level: 2,
        order: 9
      },
      {
        id: 'p10',
        type: 'paragraph',
        content: '然而，新媒体时代的文化传播也面临着挑战：信息过载导致的注意力分散、算法推荐可能造成的文化茧房、商业化过度对文化纯净性的冲击等。我们需要在拥抱技术便利的同时，保持对文化本质的坚守。',
        order: 10
      },
      {
        id: 'p11',
        type: 'heading',
        content: '未来展望',
        level: 1,
        order: 11
      },
      {
        id: 'p12',
        type: 'paragraph',
        content: '新媒体时代的文化发展需要在传承与创新、本土与全球、深度与广度之间找到平衡。只有这样，才能构建一个既有民族特色又具世界影响力的文化传播新格局，让人类的文化财富在数字时代得到更好的传承和发展。',
        order: 12
      }
    ],
    metadata: {
      wordCount: 1050,
      language: Language.CHINESE,
      targetAudience: TargetAudience.GENERAL_PUBLIC,
      estimatedReadTime: 4,
      keywords: ['新媒体', '文化传播', '价值重构', '数字化'],
      tags: ['文化', '新媒体', '数字化转型', '价值观'],
      difficulty: 'intermediate'
    },
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-02-02'),
    author: '文化评论家',
    version: 2,
    outline: ['文化生态', '数字化重生', '价值重定义', '创新路径', '面临挑战', '未来展望'],
    comments: 9,
    likes: 63,
    shares: 18
  }
];

// 历史记录统计数据
export interface HistoryStats {
  totalArticles: number;
  totalWords: number;
  averageWordsPerArticle: number;
  articlesThisMonth: number;
  completedArticles: number;
  draftArticles: number;
  mostPopularType: ArticleType;
  totalReadTime: number;
}

// 计算历史统计数据的函数
export const calculateHistoryStats = (articles: Article[]): HistoryStats => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const articlesThisMonth = articles.filter(article => {
    const articleDate = new Date(article.createdAt);
    return articleDate.getMonth() === currentMonth && articleDate.getFullYear() === currentYear;
  }).length;

  const completedArticles = articles.filter(article => article.status === ArticleStatus.COMPLETED).length;
  const draftArticles = articles.filter(article => article.status === ArticleStatus.DRAFT).length;
  
  const totalWords = articles.reduce((sum, article) => sum + article.metadata.wordCount, 0);
  const totalReadTime = articles.reduce((sum, article) => sum + article.metadata.estimatedReadTime, 0);
  
  // 统计最受欢迎的文章类型
  const typeCount: Record<ArticleType, number> = {} as Record<ArticleType, number>;
  articles.forEach(article => {
    typeCount[article.type] = (typeCount[article.type] || 0) + 1;
  });
  
  const mostPopularType = Object.entries(typeCount).reduce((a, b) => 
    typeCount[a[0] as ArticleType] > typeCount[b[0] as ArticleType] ? a : b
  )[0] as ArticleType;

  return {
    totalArticles: articles.length,
    totalWords,
    averageWordsPerArticle: Math.round(totalWords / articles.length),
    articlesThisMonth,
    completedArticles,
    draftArticles,
    mostPopularType,
    totalReadTime
  };
};

// 获取文章类型的中文名称
export const getArticleTypeLabel = (type: ArticleType): string => {
  const typeLabels: Record<ArticleType, string> = {
    [ArticleType.ACADEMIC_PAPER]: '学术论文',
    [ArticleType.TECH_REVIEW]: '科技评论',
    [ArticleType.SOCIAL_ANALYSIS]: '社会分析',
    [ArticleType.LITERARY_CRITICISM]: '文学评论',
    [ArticleType.BUSINESS_ANALYSIS]: '商业分析',
    [ArticleType.RESEARCH_REPORT]: '研究报告',
    [ArticleType.OPINION_PIECE]: '观点文章',
    [ArticleType.CASE_STUDY]: '案例研究'
  };
  return typeLabels[type];
};

// 获取文章状态的中文名称
export const getArticleStatusLabel = (status: ArticleStatus): string => {
  const statusLabels: Record<ArticleStatus, string> = {
    [ArticleStatus.DRAFT]: '草稿',
    [ArticleStatus.IN_PROGRESS]: '进行中',
    [ArticleStatus.COMPLETED]: '已完成',
    [ArticleStatus.PUBLISHED]: '已发布',
    [ArticleStatus.ARCHIVED]: '已归档'
  };
  return statusLabels[status];
};

// 搜索和过滤函数
export const filterArticles = (articles: Article[], filter: HistoryFilter): Article[] => {
  return articles.filter(article => {
    // 类型过滤
    if (filter.type && filter.type.length > 0 && !filter.type.includes(article.type)) {
      return false;
    }
    
    // 状态过滤
    if (filter.status && filter.status.length > 0 && !filter.status.includes(article.status)) {
      return false;
    }
    
    // 日期范围过滤
    if (filter.dateRange) {
      const articleDate = new Date(article.createdAt);
      if (articleDate < filter.dateRange.start || articleDate > filter.dateRange.end) {
        return false;
      }
    }
    
    // 作者过滤
    if (filter.author && !article.author.toLowerCase().includes(filter.author.toLowerCase())) {
      return false;
    }
    
    // 关键词过滤
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      const matchesTitle = article.title.toLowerCase().includes(keyword);
      const matchesAbstract = article.abstract.toLowerCase().includes(keyword);
      const matchesKeywords = article.metadata.keywords.some(k => k.toLowerCase().includes(keyword));
      const matchesTags = article.metadata.tags.some(t => t.toLowerCase().includes(keyword));
      
      if (!matchesTitle && !matchesAbstract && !matchesKeywords && !matchesTags) {
        return false;
      }
    }
    
    // 字数范围过滤
    if (filter.minWordCount && article.metadata.wordCount < filter.minWordCount) {
      return false;
    }
    
    if (filter.maxWordCount && article.metadata.wordCount > filter.maxWordCount) {
      return false;
    }
    
    return true;
  });
};

// 排序函数
export const sortArticles = (articles: Article[], sortOptions: HistorySortOptions): Article[] => {
  return [...articles].sort((a, b) => {
    let comparison = 0;
    
    switch (sortOptions.field) {
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'wordCount':
        comparison = a.metadata.wordCount - b.metadata.wordCount;
        break;
      case 'likes':
        comparison = (a.likes || 0) - (b.likes || 0);
        break;
      default:
        comparison = 0;
    }
    
    return sortOptions.order === 'asc' ? comparison : -comparison;
  });
};

// 根据ID获取文章
export const getArticleById = (id: string): Article | undefined => {
  return sampleArticles.find(article => article.id === id);
};

// 导出历史数据别名
export const historyData = sampleArticles;

export default sampleArticles;