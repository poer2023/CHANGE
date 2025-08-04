import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Download, 
  Share2, 
  Settings, 
  FileText, 
  MessageSquare,
  History,
  ArrowLeft,
  Maximize2,
  Minimize2,
  List,
  BarChart3,
  PanelLeft,
  PanelRight
} from 'lucide-react';
import { usePaperStore } from '@/store';
import {
  RichTextEditor,
  DocumentOutline,
  ProgressTracker,
  AutoSaveIndicator
} from '@/components/editor';
import { AgentPanel } from '@/components/Agent';
import { 
  exportToMarkdown, 
  exportToHTML, 
  exportToText, 
  shareDocument,
  printDocument,
  exportOptions 
} from '@/utils';

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentPaper, 
    editorState, 
    setEditorContent, 
    setCurrentPaper,
    papers 
  } = usePaperStore();

  // 编辑器状态
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(true);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState<'agent' | 'outline' | 'progress'>('agent');
  const [editorSelection, setEditorSelection] = useState({ start: 0, end: 0 });
  const [showExportMenu, setShowExportMenu] = useState(false);

  // 响应式设计
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setLeftSidebarVisible(false);
        setRightSidebarVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 点击外部关闭导出菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExportMenu) {
        const target = event.target as Element;
        if (!target.closest('.export-menu-container')) {
          setShowExportMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  useEffect(() => {
    if (id) {
      // 根据ID查找论文
      const paper = papers.find(p => p.id === id);
      if (paper) {
        setCurrentPaper(paper);
        setEditorContent(paper.content);
      } else {
        // 如果找不到论文，跳转到首页
        navigate('/');
      }
    }
  }, [id, papers, setCurrentPaper, setEditorContent, navigate]);

  const handleContentChange = useCallback((content: string) => {
    setEditorContent(content);
  }, [setEditorContent]);

  const handleEditorSelectionChange = useCallback((start: number, end: number) => {
    setEditorSelection({ start, end });
  }, []);

  const handleNavigateToText = useCallback((startIndex: number, endIndex: number) => {
    // 实现导航到文本位置的逻辑
    console.log('Navigate to text:', startIndex, endIndex);
  }, []);

  const handleInsertText = useCallback((text: string, position?: number) => {
    const currentContent = editorState.content;
    const insertPosition = position ?? editorSelection.start;
    const newContent = 
      currentContent.substring(0, insertPosition) + 
      text + 
      currentContent.substring(insertPosition);
    setEditorContent(newContent);
  }, [editorState.content, editorSelection.start, setEditorContent]);

  const handleSave = useCallback(async (content?: string) => {
    try {
      // 模拟保存API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('保存论文:', content || editorState.content);
      return true;
    } catch (error) {
      console.error('保存失败:', error);
      return false;
    }
  }, [editorState.content]);

  const handleExport = useCallback((format: 'markdown' | 'html' | 'text' = 'markdown') => {
    const content = editorState.content;
    const options = {
      title: currentPaper?.title || 'document',
      author: 'AI论文写作工具用户', // 可以从用户配置中获取
      date: new Date()
    };
    
    switch (format) {
      case 'html':
        exportToHTML(content, options);
        break;
      case 'text':
        exportToText(content, options);
        break;
      default:
        exportToMarkdown(content, options);
        break;
    }
    
    setShowExportMenu(false);
  }, [editorState.content, currentPaper?.title]);

  const handleShare = useCallback(async () => {
    const title = currentPaper?.title || '文档';
    const content = editorState.content;
    
    const success = await shareDocument(title, content);
    
    if (!success) {
      // 如果分享失败，显示其他选项
      alert('分享功能不可用，链接已复制到剪贴板');
    }
  }, [currentPaper?.title, editorState.content]);

  const handlePrint = useCallback(() => {
    const title = currentPaper?.title || 'document';
    printDocument(editorState.content, title);
  }, [editorState.content, currentPaper?.title]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      // 进入全屏时隐藏侧边栏
      setLeftSidebarVisible(false);
      setRightSidebarVisible(false);
    }
  }, [isFullscreen]);

  const toggleLeftSidebar = useCallback(() => {
    setLeftSidebarVisible(!leftSidebarVisible);
  }, [leftSidebarVisible]);

  const toggleRightSidebar = useCallback(() => {
    setRightSidebarVisible(!rightSidebarVisible);
  }, [rightSidebarVisible]);

  if (!currentPaper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">论文不存在或正在加载...</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* 工具栏 */}
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 lg:space-x-4">
            {!isFullscreen && (
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <h1 className="text-base lg:text-lg font-semibold text-gray-900 truncate max-w-32 lg:max-w-md">
                {currentPaper.title}
              </h1>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              currentPaper.status === 'draft' ? 'bg-gray-100 text-gray-800' :
              currentPaper.status === 'writing' ? 'bg-blue-100 text-blue-800' :
              currentPaper.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {currentPaper.status === 'draft' ? '草稿' :
               currentPaper.status === 'writing' ? '写作中' :
               currentPaper.status === 'reviewing' ? '审阅中' : '已完成'}
            </span>
          </div>

          <div className="flex items-center space-x-1 lg:space-x-2">
            {/* 自动保存指示器 */}
            <AutoSaveIndicator
              content={editorState.content}
              onSave={handleSave}
              showLastSaved={!isMobile}
              showNetworkStatus={!isMobile}
            />
            
            {/* 工具按钮 */}
            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={() => handleSave()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Save className="h-4 w-4 mr-1" />
                保存
              </button>
              
              {/* 导出按钮和菜单 */}
              <div className="relative export-menu-container">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-1" />
                  导出
                </button>
                
                {showExportMenu && (
                  <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40">
                    {exportOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleExport(option.id as 'markdown' | 'html' | 'text')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center space-x-2"
                      >
                        <span>{option.icon}</span>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </button>
                    ))}
                    <hr className="border-gray-200" />
                    <button
                      onClick={handlePrint}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg flex items-center space-x-2"
                    >
                      <span>🖨️</span>
                      <div>
                        <div className="font-medium">打印</div>
                        <div className="text-xs text-gray-500">打印当前文档</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleShare}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4 mr-1" />
                分享
              </button>
            </div>
            
            {/* 视图控制按钮 */}
            <div className="flex items-center space-x-1">
              {!isMobile && (
                <>
                  <button
                    onClick={toggleLeftSidebar}
                    className={`p-2 rounded-lg transition-colors ${
                      leftSidebarVisible ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title="切换左侧边栏"
                  >
                    <PanelLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggleRightSidebar}
                    className={`p-2 rounded-lg transition-colors ${
                      rightSidebarVisible ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title="切换右侧边栏"
                  >
                    <PanelRight className="h-4 w-4" />
                  </button>
                </>
              )}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                title={isFullscreen ? '退出全屏' : '全屏模式'}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧边栏 - 文档大纲 */}
        {leftSidebarVisible && !isMobile && (
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <DocumentOutline
              content={editorState.content}
              onNavigate={handleNavigateToText}
            />
          </aside>
        )}

        {/* 主编辑区域 */}
        <main className="flex-1 flex flex-col min-w-0">
          <RichTextEditor
            value={editorState.content}
            onChange={handleContentChange}
            onSelectionChange={handleEditorSelectionChange}
            placeholder="开始写作你的论文..."
            className="flex-1"
            autoFocus
          />
        </main>

        {/* 右侧边栏 */}
        {rightSidebarVisible && (
          <aside className={`${isMobile ? 'w-full' : 'w-80'} bg-white border-l border-gray-200 flex flex-col`}>
            {/* 侧边栏标签 */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveRightTab('agent')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeRightTab === 'agent'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 inline mr-1" />
                  AI助手
                </button>
                <button
                  onClick={() => setActiveRightTab('outline')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeRightTab === 'outline'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4 inline mr-1" />
                  大纲
                </button>
                <button
                  onClick={() => setActiveRightTab('progress')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeRightTab === 'progress'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 inline mr-1" />
                  进度
                </button>
              </nav>
            </div>

            {/* 侧边栏内容 */}
            <div className="flex-1 overflow-hidden">
              {activeRightTab === 'agent' && (
                <AgentPanel
                  content={editorState.content}
                  onContentChange={handleContentChange}
                  onInsertText={handleInsertText}
                />
              )}
              {activeRightTab === 'outline' && (
                <DocumentOutline
                  content={editorState.content}
                  onNavigate={handleNavigateToText}
                />
              )}
              {activeRightTab === 'progress' && (
                <ProgressTracker
                  content={editorState.content}
                />
              )}
            </div>
          </aside>
        )}
      </div>

      {/* 移动端底部工具栏 */}
      {isMobile && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleRightSidebar}
                className={`p-2 rounded-lg transition-colors ${
                  rightSidebarVisible ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleSave()}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExport()}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage;