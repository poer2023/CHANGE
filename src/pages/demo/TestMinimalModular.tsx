import React from 'react';
import { usePaperStore } from '../../store/paperStore';
// 逐步测试ModularEditor的依赖
import ModularEditor from '../../components/editor/ModularEditor';

const TestMinimalModular: React.FC = () => {
  const { currentPaper, setCurrentPaper } = usePaperStore();
  
  // 创建一个简单的测试Paper
  React.useEffect(() => {
    if (!currentPaper) {
      const testPaper = {
        id: 'test-paper',
        title: '测试论文',
        content: '这是测试内容',
        abstract: '测试摘要',
        keywords: ['测试'],
        status: 'writing' as const,
        authorId: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: 0,
        sections: []
      };
      setCurrentPaper(testPaper);
    }
  }, [currentPaper, setCurrentPaper]);
  
  try {
    return (
      <div className="p-6">
        <h1>测试ModularEditor组件渲染</h1>
        <p>如果看到ModularEditor界面，说明组件可以正常渲染</p>
        
        {/* 尝试渲染ModularEditor */}
        <div className="mt-4 border border-gray-300 rounded">
          <ModularEditor paperId="test-paper" />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6">
        <h1>ModularEditor渲染失败</h1>
        <p>错误: {error instanceof Error ? error.message : '未知错误'}</p>
      </div>
    );
  }
};

export default TestMinimalModular;