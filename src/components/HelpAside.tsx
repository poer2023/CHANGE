import React from 'react';
import { HelpCircle, BookOpen } from 'lucide-react';

interface HelpAsideProps {
  step?: string;
  className?: string;
}

const HelpAside: React.FC<HelpAsideProps> = ({ step = 'general', className = '' }) => {
  const helpContent = {
    topic: {
      title: '选题阶段帮助',
      tips: [
        '明确研究问题和论文主题',
        '上传一篇历史作业用于风格对齐', 
        '设置合适的字数要求',
        '选择正确的引用格式'
      ]
    },
    research: {
      title: '文献检索帮助',
      tips: [
        '使用关键词搜索相关文献',
        '选择权威和最新的来源',
        '记录重要的引用和笔记',
        '验证DOI和ISBN的有效性'
      ]
    },
    strategy: {
      title: '写作策略帮助',
      tips: [
        '明确主论点和分论点',
        '为每个论点绑定支撑证据',
        '考虑可能的反驳和回应',
        '选择合适的论证方式'
      ]
    },
    outline: {
      title: '大纲编辑帮助',
      tips: [
        '使用层级结构组织内容',
        '为每个段落设定明确目标',
        '确保所有论点都有对应章节',
        '合理分配各部分字数'
      ]
    },
    content: {
      title: '正文写作帮助',
      tips: [
        '使用AI助手快速编辑内容',
        '通过Agent命令批量格式化',
        '保持个人写作风格一致',
        '定期保存和备份内容'
      ]
    },
    general: {
      title: '使用帮助',
      tips: [
        '按照五步流程完成写作',
        '每个步骤都有详细指导',
        '可以随时返回修改前面的步骤',
        '系统会自动保存您的进度'
      ]
    }
  };

  const currentHelp = helpContent[step as keyof typeof helpContent] || helpContent.general;

  return (
    <aside className={`w-96 bg-white border-l border-gray-200 hidden xl:block ${className}`}>
      <div className="p-6 space-y-6">
        <div className="bg-white border border-[#EEF0F4] rounded-2xl p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-[#6E5BFF]" />
            <h3 className="text-lg font-semibold text-slate-900">{currentHelp.title}</h3>
          </div>
          
          <div className="space-y-3">
            {currentHelp.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#6E5BFF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-[#6E5BFF]">{index + 1}</span>
                </div>
                <p className="text-sm text-slate-600">{tip}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-[#F7F8FB] rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-slate-600" />
              <h4 className="font-medium text-slate-900">需要帮助？</h4>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              如果遇到问题，可以查看我们的帮助文档或联系客服。
            </p>
            <button className="text-sm text-[#6E5BFF] hover:text-[#5A4ACF] underline transition-colors">
              查看详细帮助
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default HelpAside;