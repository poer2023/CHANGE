import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePaperStore } from '@/store';
import ModularEditor from '@/components/editor/ModularEditor';

const ModularEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentPaper, 
    setCurrentPaper,
    papers 
  } = usePaperStore();

  useEffect(() => {
    if (id) {
      // 根据ID查找论文
      const paper = papers.find(p => p.id === id);
      if (paper) {
        setCurrentPaper(paper);
      } else {
        // 如果找不到论文，跳转到首页
        navigate('/');
      }
    }
  }, [id, papers, setCurrentPaper, navigate]);

  if (!currentPaper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">论文不存在或正在加载...</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return <ModularEditor paperId={currentPaper.id} />;
};

export default ModularEditorPage;