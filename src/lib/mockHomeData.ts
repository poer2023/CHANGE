// Mock data generator for Home page

import type { DocItem, DocStatus, Addon } from '@/types/home';

const sampleTitles = [
  "基于深度学习的图像识别算法研究",
  "人工智能在医疗诊断中的应用",
  "区块链技术在供应链管理中的创新",
  "可再生能源的经济效益分析",
  "社交媒体对青少年心理健康的影响",
  "量子计算在密码学中的应用前景",
  "城市化进程对环境的影响及对策",
  "机器学习在金融风险评估中的运用",
  "5G技术对物联网发展的推动作用",
  "基因编辑技术的伦理问题探讨",
  "虚拟现实技术在教育领域的应用",
  "大数据分析在精准营销中的价值"
];

const statusDistribution: { status: DocStatus; weight: number }[] = [
  { status: 'ready', weight: 3 },
  { status: 'gate1', weight: 2 },
  { status: 'addon', weight: 2 },
  { status: 'draft', weight: 2 },
  { status: 'generating', weight: 1 }
];

const addonOptions: Addon[] = ['plagiarism', 'aiCheck', 'evidencePack', 'latex', 'defenseCard', 'shareLink'];

function getRandomStatus(): DocStatus {
  const totalWeight = statusDistribution.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of statusDistribution) {
    random -= item.weight;
    if (random <= 0) {
      return item.status;
    }
  }
  
  return 'ready';
}

function getRandomAddons(): Addon[] {
  const count = Math.floor(Math.random() * 3) + 1; // 1-3 missing addons
  const shuffled = [...addonOptions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date.toISOString();
}

function getLockExpireTime(): string {
  const date = new Date();
  // Random expiry between 5 minutes to 2 hours from now
  const minutesToAdd = Math.floor(Math.random() * 115) + 5;
  date.setMinutes(date.getMinutes() + minutesToAdd);
  return date.toISOString();
}

export function generateMockDocuments(count: number = 10): DocItem[] {
  const documents: DocItem[] = [];
  
  // Ensure we have at least 2 gate1 items with countdown
  let gate1Count = 0;
  let addonCount = 0;
  let readyCount = 0;
  
  for (let i = 0; i < count; i++) {
    const status = getRandomStatus();
    
    // Ensure minimum distribution
    let finalStatus = status;
    if (gate1Count < 2 && i < count - 2) {
      finalStatus = 'gate1';
      gate1Count++;
    } else if (addonCount < 2 && i < count - 1) {
      finalStatus = 'addon';
      addonCount++;
    } else if (readyCount < 2) {
      finalStatus = 'ready';
      readyCount++;
    }
    
    const doc: DocItem = {
      id: `doc-${i + 1}`,
      title: sampleTitles[i % sampleTitles.length] + (i >= sampleTitles.length ? ` (${Math.floor(i / sampleTitles.length) + 1})` : ''),
      words: Math.floor(Math.random() * 8000) + 2000, // 2000-10000 words
      cites: Math.floor(Math.random() * 30) + 5, // 5-35 citations
      updatedAt: getRandomDate(30), // Within last 30 days
      status: finalStatus
    };
    
    // Add specific properties based on status
    if (finalStatus === 'gate1') {
      doc.lockExpireAt = getLockExpireTime();
    } else if (finalStatus === 'addon') {
      doc.missingAddons = getRandomAddons();
    }
    
    documents.push(doc);
  }
  
  // Sort by updatedAt descending (most recent first)
  return documents.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export const mockDocuments = generateMockDocuments(12);

// Helper function to get status label in Chinese
export function getStatusLabel(status: DocStatus): string {
  switch (status) {
    case 'draft':
      return '草稿';
    case 'generating':
      return '生成中';
    case 'ready':
      return '已完成';
    case 'gate1':
      return '待解锁';
    case 'addon':
      return '需补购';
    default:
      return '未知';
  }
}

// Helper function to get status badge variant
export function getStatusBadgeVariant(status: DocStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'draft':
      return 'default';
    case 'generating':
      return 'secondary';
    case 'ready':
      return 'outline';
    case 'gate1':
      return 'destructive';
    case 'addon':
      return 'destructive';
    default:
      return 'default';
  }
}

// Helper function to get addon display name
export function getAddonName(addon: Addon): string {
  switch (addon) {
    case 'plagiarism':
      return '抄袭检测';
    case 'aiCheck':
      return 'AI检测';
    case 'evidencePack':
      return '证据包';
    case 'latex':
      return 'LaTeX导出';
    case 'defenseCard':
      return '口头核验卡';
    case 'shareLink':
      return '只读链接';
    default:
      return addon;
  }
}