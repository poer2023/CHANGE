import { Section, Topic } from '@/types/writing-flow';

// Simulate streaming content generation
export async function streamSections(
  sections: Section[],
  onSectionUpdate: (section: Section) => void,
  onComplete: () => void
): Promise<void> {
  const queuedSections = sections.filter(s => s.state === 'queued');
  
  for (const section of queuedSections) {
    // Mark as generating
    onSectionUpdate({ ...section, state: 'generating' });
    
    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    // Generate sample content
    const sampleContent = generateSampleContent(section.title, section.level);
    
    // Mark as done with content
    onSectionUpdate({ 
      ...section, 
      state: 'done',
      html: sampleContent
    });
    
    // Small delay before next section
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  onComplete();
}

function generateSampleContent(title: string, level: 2 | 3): string {
  const paragraphs = [
    `<p>${title}是本研究的重要组成部分。通过深入分析相关文献和理论框架[1]，我们可以更好地理解这一概念的内涵和外延。</p>`,
    `<p>现有研究表明，${title}在学术界和实践领域都具有重要意义[2][3]。多位学者从不同角度对此进行了探讨，形成了丰富的理论成果。</p>`,
    `<p>基于前期调研和数据分析，本节将从以下几个维度展开论述：首先是理论基础的梳理，其次是实证研究的发现[4]，最后是实践应用的启示。</p>`
  ];
  
  // Level 3 sections get shorter content
  const numParagraphs = level === 2 ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2);
  
  return paragraphs.slice(0, numParagraphs).join('\\n\\n');
}

export function generateDocumentTitle(topic?: Topic): string {
  if (topic?.title) {
    return topic.title;
  }
  
  const sampleTitles = [
    '基于深度学习的文本分析研究',
    '人工智能在教育领域的应用探索',
    '数字化转型背景下的组织变革研究',
    '可持续发展视角下的企业创新策略',
    '社交媒体对消费者行为的影响分析'
  ];
  
  return sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
}