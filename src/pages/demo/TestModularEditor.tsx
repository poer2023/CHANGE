import React from 'react';
import { usePaperStore } from '../../store/paperStore';

// 最小化测试组件，只测试store导入
const TestModularEditor: React.FC = () => {
  try {
    const { papers, loading } = usePaperStore();
    
    return (
      <div className="p-6">
        <h1>ModularEditor Store测试</h1>
        <p>Papers数量: {papers.length}</p>
        <p>Loading状态: {loading ? '是' : '否'}</p>
        <p>Store导入成功！</p>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6">
        <h1>Store导入失败</h1>
        <p>错误: {error instanceof Error ? error.message : '未知错误'}</p>
      </div>
    );
  }
};

export default TestModularEditor;