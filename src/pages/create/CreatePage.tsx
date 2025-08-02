import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, ArrowRight, PlusCircle } from 'lucide-react';
import { usePaperStore } from '@/store';

const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { setFormData, resetForm } = usePaperStore();
  const [title, setTitle] = useState('');
  const [createMethod, setCreateMethod] = useState<'form' | 'upload' | null>(null);

  const handleCreateFromForm = () => {
    if (!title.trim()) {
      alert('请输入论文标题');
      return;
    }
    
    resetForm();
    setFormData({ title: title.trim() });
    navigate('/form');
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">创建新论文</h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              返回首页
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            开始你的论文写作
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            选择创建方式：从零开始使用我们的渐进式表单，或者上传现有文档进行优化
          </p>
        </div>

        {/* 方法选择 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 表单创建 */}
          <div
            className={`relative rounded-lg border-2 p-8 cursor-pointer transition-all ${
              createMethod === 'form'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setCreateMethod('form')}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                <PlusCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                从零开始
              </h3>
              <p className="text-gray-600 mb-6">
                使用我们的渐进式表单，一步步构建你的论文结构和内容
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <span>• 智能表单引导</span>
                </div>
                <div className="flex items-center justify-center">
                  <span>• 结构化内容生成</span>
                </div>
                <div className="flex items-center justify-center">
                  <span>• AI辅助写作</span>
                </div>
              </div>
            </div>
            {createMethod === 'form' && (
              <div className="absolute top-4 right-4">
                <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
              </div>
            )}
          </div>

          {/* 文件上传 */}
          <div
            className={`relative rounded-lg border-2 p-8 cursor-pointer transition-all ${
              createMethod === 'upload'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setCreateMethod('upload')}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <Upload className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                上传文档
              </h3>
              <p className="text-gray-600 mb-6">
                上传现有的文档或草稿，让AI帮助你完善和优化内容
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <span>• 支持多种格式</span>
                </div>
                <div className="flex items-center justify-center">
                  <span>• 自动内容解析</span>
                </div>
                <div className="flex items-center justify-center">
                  <span>• 智能优化建议</span>
                </div>
              </div>
            </div>
            {createMethod === 'upload' && (
              <div className="absolute top-4 right-4">
                <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 具体操作区域 */}
        {createMethod === 'form' && (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="flex items-center mb-6">
              <FileText className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">
                输入论文标题
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  论文标题 *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：基于深度学习的图像识别技术研究"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleCreateFromForm}
                  disabled={!title.trim()}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  开始创建
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {createMethod === 'upload' && (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="flex items-center mb-6">
              <Upload className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">
                上传文档
              </h3>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  点击上传文件
                </p>
                <p className="text-sm text-gray-500">
                  支持 TXT、DOC、DOCX、PDF 格式，最大 10MB
                </p>
              </label>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              <p>提示：上传后我们将自动解析文档内容，提取关键信息并转入表单流程。</p>
            </div>
          </div>
        )}

        {/* 帮助信息 */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h4 className="text-lg font-medium text-blue-900 mb-2">
            需要帮助？
          </h4>
          <p className="text-blue-700 text-sm">
            如果你是第一次使用，我们建议选择"从零开始"方式，跟随我们的渐进式表单来创建论文。
            如果你已经有草稿或相关材料，可以选择"上传文档"来快速开始。
          </p>
        </div>
      </main>
    </div>
  );
};

export default CreatePage;