import React, { useEffect } from 'react';
import { usePaperStore } from '@/store';
import ModularEditor from '@/components/editor/ModularEditor';
import { Paper } from '@/types';

const ModularEditorDemo: React.FC = () => {
  const { setCurrentPaper } = usePaperStore();

  useEffect(() => {
    // 创建一个演示用的论文
    const demoPaper: Paper = {
      id: 'demo-paper',
      title: 'AI在医疗诊断中的应用研究',
      content: '这是一个模块化编辑器的演示论文...',
      abstract: '本研究探讨了人工智能技术在医疗诊断领域的应用现状和发展前景...',
      keywords: ['人工智能', '医疗诊断', '机器学习', '深度学习'],
      status: 'writing',
      authorId: 'demo-user',
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 0,
      sections: [
        {
          id: 'abstract',
          title: '摘要',
          content: '本研究探讨了人工智能技术在医疗诊断领域的应用现状和发展前景。通过对相关文献的系统梳理和实证分析，我们发现AI技术在提高诊断准确性、降低医疗成本、改善患者体验等方面具有显著优势。',
          order: 1,
          level: 1
        },
        {
          id: 'introduction',
          title: '引言',
          content: '随着人工智能技术的快速发展，其在医疗健康领域的应用日益广泛。医疗诊断作为医疗服务的核心环节，如何运用AI技术提升诊断效率和准确性，已成为当前研究的热点问题。',
          order: 2,
          level: 1
        },
        {
          id: 'literature-review',
          title: '文献综述',
          content: '近年来，国内外学者在AI医疗诊断领域进行了大量研究。研究主要集中在影像诊断、疾病预测、个性化治疗等方面。',
          order: 3,
          level: 1
        },
        {
          id: 'methodology',
          title: '研究方法',
          content: '本研究采用文献分析法和案例研究法，通过对国内外相关研究的系统梳理，分析AI在医疗诊断中的应用模式和发展趋势。',
          order: 4,
          level: 1
        },
        {
          id: 'results',
          title: '研究结果',
          content: '研究发现，AI技术在医疗诊断中的应用主要体现在以下几个方面：1）影像识别与分析；2）疾病风险预测；3）个性化诊疗方案制定。',
          order: 5,
          level: 1
        },
        {
          id: 'discussion',
          title: '讨论',
          content: 'AI技术在医疗诊断中的应用虽然前景广阔，但仍面临数据质量、算法透明度、法律伦理等挑战。需要多方协作，共同推进AI医疗诊断技术的健康发展。',
          order: 6,
          level: 1
        },
        {
          id: 'conclusion',
          title: '结论',
          content: '本研究通过系统分析AI在医疗诊断中的应用现状，为相关政策制定和技术发展提供了参考依据。未来需要在保障数据安全和患者隐私的前提下，进一步探索AI技术的创新应用。',
          order: 7,
          level: 1
        }
      ]
    };

    setCurrentPaper(demoPaper);
  }, [setCurrentPaper]);

  return (
    <div className="h-screen bg-gray-50">
      <div className="h-full">
        <ModularEditor paperId="demo-paper" />
      </div>
    </div>
  );
};

export default ModularEditorDemo;