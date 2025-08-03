import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, ArrowRight, PlusCircle, PenTool, LayoutGrid } from 'lucide-react';
import { usePaperStore } from '@/store';

const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { setFormData, resetForm, createPaper, setCurrentPaper } = usePaperStore();
  const [title, setTitle] = useState('');
  const [createMethod, setCreateMethod] = useState<'form' | 'upload' | 'modular' | null>(null);

  const handleCreateFromForm = () => {
    if (!title.trim()) {
      alert('请输入论文标题');
      return;
    }
    
    resetForm();
    setFormData({ title: title.trim() });
    navigate('/form');
  };

  const handleCreateModular = async () => {
    if (!title.trim()) {
      alert('请输入论文标题');
      return;
    }
    
    try {
      resetForm();
      setFormData({ title: title.trim() });
      
      // 创建一个新的论文记录
      const newPaper = await createPaper({ title: title.trim() });
      
      // 设置为当前论文
      setCurrentPaper(newPaper);
      
      // 导航到模块化编辑器页面
      navigate(`/modular-editor/${newPaper.id}`);
    } catch (error) {
      console.error('创建论文失败:', error);
      alert('创建论文失败，请重试');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: 实现文件上传逻辑
      console.log('文件上传:', file.name);
      
      // 模拟文件解析
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // TODO: 解析文件内容，提取标题、摘要等信息
        
        // 暂时使用文件名作为标题
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        setFormData({ 
          title: fileName,
          abstract: '从上传文件中提取的摘要...'
        });
        
        navigate('/form');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <PenTool className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Essay Pass</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              返回首页
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl leading-tight">
            开始你的智能论文写作
          </h1>
          <p className="mt-4 text-base text-gray-600">
            选择创建方式开始使用
          </p>
        </div>

        {/* 模式切换按钮 */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-2xl bg-gray-100 p-2 shadow-sm">
            {/* 从零开始按钮 */}
            <button
              className={`group relative inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                createMethod === 'form'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setCreateMethod('form')}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              从零开始
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                智能表单引导 • 结构化内容生成 • AI辅助写作
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </button>

            {/* 模块化编辑器按钮 */}
            <button
              className={`group relative inline-flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                createMethod === 'modular'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setCreateMethod('modular')}
            >
              <LayoutGrid className="h-5 w-5 mr-2" />
              模块化编辑器
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                🌟 模块化编辑 • 依赖关系可视化 • 智能模板系统 • 拖拽排序
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </button>

            {/* 上传文档按钮 */}
            <button
              className={`group relative inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                createMethod === 'upload'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setCreateMethod('upload')}
            >
              <Upload className="h-5 w-5 mr-2" />
              上传文档
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                支持多种格式 • 自动内容解析 • 智能优化建议
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </button>
          </div>
        </div>

        {/* 统一的主输入区域 */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-3xl">
            <div className="relative bg-white rounded-3xl border-2 border-gray-200 shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
              {createMethod === 'form' ? (
                /* 文本输入模式 */
                <div className="relative">
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="输入论文标题，例如：基于深度学习的图像识别技术研究"
                    rows={4}
                    className="w-full px-6 py-6 pr-20 text-xl border-0 resize-none focus:outline-none placeholder-gray-400 bg-transparent"
                    style={{ minHeight: '120px' }}
                  />
                  <button
                    onClick={handleCreateFromForm}
                    disabled={!title.trim()}
                    className="absolute bottom-4 right-4 inline-flex items-center justify-center w-14 h-14 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-2xl text-white transition-colors shadow-lg hover:shadow-xl"
                  >
                    <ArrowRight className="h-6 w-6" />
                  </button>
                </div>
              ) : createMethod === 'modular' ? (
                /* 模块化编辑器模式 */
                <div className="relative">
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="输入论文标题开始使用模块化编辑器，例如：基于深度学习的图像识别技术研究"
                    rows={4}
                    className="w-full px-6 py-6 pr-20 text-xl border-0 resize-none focus:outline-none placeholder-gray-400 bg-transparent"
                    style={{ minHeight: '120px' }}
                  />
                  <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                    <div className="text-xs text-gray-500 mr-2">
                      🌟 新功能
                    </div>
                    <button
                      onClick={handleCreateModular}
                      disabled={!title.trim()}
                      className="inline-flex items-center justify-center w-14 h-14 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-2xl text-white transition-colors shadow-lg hover:shadow-xl"
                    >
                      <LayoutGrid className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              ) : createMethod === 'upload' ? (
                /* 文件上传模式 */
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-indigo-400 transition-colors" style={{ minHeight: '120px' }}>
                  <input
                    type="file"
                    id="file-upload"
                    accept=".txt,.doc,.docx,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-xl font-semibold text-gray-900 mb-2">
                      点击上传文件
                    </p>
                    <p className="text-sm text-gray-500">
                      支持 TXT、DOC、DOCX、PDF 格式
                    </p>
                  </label>
                </div>
              ) : (
                /* 默认状态：未选择模式 */
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-xl text-gray-500 mb-2">选择创建方式</p>
                  <p className="text-gray-400">请先选择上方的创建方式开始使用</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 帮助信息 */}
        <div className="bg-indigo-50 rounded-lg p-8">
          <div className="text-center">
            <h4 className="text-xl font-bold text-indigo-900 mb-4">
              需要帮助？
            </h4>
            <p className="text-indigo-700 text-base leading-relaxed max-w-3xl mx-auto mb-4">
              • <strong>渐进式表单</strong>：适合初学者，通过智能表单引导完成论文写作<br/>
              • <strong>🌟 模块化编辑器</strong>：全新功能！支持模块化编辑、依赖关系可视化、智能模板等高级功能<br/>
              • <strong>上传文档</strong>：已有草稿？直接上传文档进行编辑和优化
            </p>
            <div className="bg-purple-100 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-center space-x-2 text-purple-800">
                <LayoutGrid className="h-5 w-5" />
                <span className="font-semibold">推荐体验模块化编辑器的新功能！</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePage;