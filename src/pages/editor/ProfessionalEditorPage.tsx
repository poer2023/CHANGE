import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  Download,
  Share2,
  Settings,
  FileText,
  MessageSquare,
  Sidebar,
  Menu,
  X,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Eye,
  Edit3,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  MoreHorizontal,
  Clock,
  Users,
  Zap
} from 'lucide-react';

// Components
import EnhancedRichTextEditor from '@/components/editor/EnhancedRichTextEditor';
import DocumentStructureSidebar from '@/components/editor/DocumentStructureSidebar';
import { AgentPanel } from '@/components/Agent';
import { AutoSaveIndicator, ProgressTracker } from '@/components/editor';
import { Button } from '@/components/UI/Button';
import { usePaperStore } from '@/store';

// Utils
import {
  exportToMarkdown,
  exportToHTML,
  exportToText,
  shareDocument,
  printDocument,
  exportOptions
} from '@/utils';

interface EditorStats {
  words: number;
  characters: number;
  paragraphs: number;
  readingTime: number;
  lastSaved: Date | null;
}

const ProfessionalEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    currentPaper,
    editorState,
    setEditorContent,
    setCurrentPaper,
    papers
  } = usePaperStore();

  // UI状态
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(true);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(true);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(320);
  const [activeRightTab, setActiveRightTab] = useState<'ai' | 'structure' | 'progress' | 'stats'>('ai');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  
  // 编辑器状态
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');
  const [editorFontSize, setEditorFontSize] = useState(16);
  const [editorFontFamily, setEditorFontFamily] = useState('Inter');
  const [previewMode, setPreviewMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [editorStats, setEditorStats] = useState<EditorStats>({
    words: 0,
    characters: 0,
    paragraphs: 0,
    readingTime: 0,
    lastSaved: null
  });

  // 响应式设计
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  // 拖拽调整侧边栏大小
  const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);
  const resizeRef = useRef<{ startX: number; startWidth: number }>({ startX: 0, startWidth: 0 });

  // 响应式监听
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      if (mobile) {
        setLeftSidebarVisible(false);
        setRightSidebarVisible(false);
        setFocusMode(true);
      } else if (tablet) {
        setLeftSidebarVisible(false);
        setRightSidebarVisible(true);
        setFocusMode(false);
      } else {
        setFocusMode(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 初始化论文数据
  useEffect(() => {
    if (id) {
      const paper = papers.find(p => p.id === id);
      if (paper) {
        setCurrentPaper(paper);
        setEditorContent(paper.content);
      } else {
        navigate('/');
      }
    }
  }, [id, papers, setCurrentPaper, setEditorContent, navigate]);

  // 更新编辑器统计
  const updateEditorStats = useCallback((content: string) => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const characters = content.length;
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.ceil(words / 200); // 假设每分钟200词

    setEditorStats(prev => ({
      ...prev,
      words,
      characters,
      paragraphs,
      readingTime
    }));
  }, []);

  // 处理内容变化
  const handleContentChange = useCallback((content: string) => {
    setEditorContent(content);
    updateEditorStats(content);
  }, [setEditorContent, updateEditorStats]);

  // 保存文档
  const handleSave = useCallback(async () => {
    try {
      // 模拟保存API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditorStats(prev => ({ ...prev, lastSaved: new Date() }));
      console.log('文档已保存');
      return true;
    } catch (error) {
      console.error('保存失败:', error);
      return false;
    }
  }, []);

  // 导出文档
  const handleExport = useCallback((format: 'markdown' | 'html' | 'text' = 'markdown') => {
    const content = editorState.content;
    const options = {
      title: currentPaper?.title || 'document',
      author: 'AI论文写作工具用户',
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

  // 分享文档
  const handleShare = useCallback(async () => {
    const title = currentPaper?.title || '文档';
    const content = editorState.content;
    
    try {
      await shareDocument(title, content);
    } catch (error) {
      console.error('分享失败:', error);
    }
  }, [currentPaper?.title, editorState.content]);

  // 拖拽调整侧边栏大小
  const handleMouseDown = useCallback((side: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(side);
    resizeRef.current = {
      startX: e.clientX,
      startWidth: side === 'left' ? leftSidebarWidth : rightSidebarWidth
    };
  }, [leftSidebarWidth, rightSidebarWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const diff = e.clientX - resizeRef.current.startX;
      const newWidth = Math.max(200, Math.min(500, resizeRef.current.startWidth + 
        (isResizing === 'left' ? diff : -diff)));

      if (isResizing === 'left') {
        setLeftSidebarWidth(newWidth);
      } else {
        setRightSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // 导航到文本位置
  const handleNavigateToText = useCallback((startIndex: number, endIndex: number) => {
    // 实现导航到文本位置的逻辑
    console.log('Navigate to text:', startIndex, endIndex);
  }, []);

  // 插入文本
  const handleInsertText = useCallback((text: string) => {
    const currentContent = editorState.content;
    const newContent = currentContent + '\n' + text;
    setEditorContent(newContent);
  }, [editorState.content, setEditorContent]);

  if (!currentPaper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">论文不存在或正在加载...</p>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${editorTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${
      isFullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      {/* 顶部工具栏 */}
      <header className={`${editorTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-3`}>
        <div className="flex items-center justify-between">
          {/* 左侧：导航和文档信息 */}
          <div className="flex items-center space-x-4">
            {!isFullscreen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}

            <div className="flex items-center space-x-3">
              <FileText className={`h-5 w-5 ${editorTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              <div>
                <h1 className={`text-lg font-semibold ${editorTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'} truncate max-w-64`}>
                  {currentPaper.title}
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>修改时间: {new Date().toLocaleDateString()}</span>
                  {editorStats.lastSaved && (
                    <span>• 保存于 {editorStats.lastSaved.toLocaleTimeString()}</span>
                  )}
                </div>
              </div>
            </div>

            {/* 状态指示器 */}
            <div className="flex items-center space-x-2">
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

              {focusMode && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  专注模式
                </span>
              )}
            </div>
          </div>

          {/* 右侧：工具按钮 */}
          <div className="flex items-center space-x-2">
            {/* 文档统计 */}
            {!isMobile && (
              <div className="flex items-center space-x-4 text-sm text-gray-500 mr-4">
                <div className="flex items-center space-x-1">
                  <span>{editorStats.words} 词</span>
                  <span>•</span>
                  <span>{editorStats.characters} 字符</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{editorStats.readingTime} 分钟阅读</span>
                </div>
              </div>
            )}

            {/* 自动保存指示器 */}
            <AutoSaveIndicator
              content={editorState.content}
              onSave={handleSave}
              showLastSaved={!isMobile}
              showNetworkStatus={!isMobile}
            />

            {/* 主要操作按钮 */}
            {!isMobile && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleSave()}>
                  <Save className="h-4 w-4 mr-1" />
                  保存
                </Button>

                {/* 导出菜单 */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    导出
                  </Button>

                  {showExportMenu && (
                    <div className="absolute top-full mt-1 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48">
                      {exportOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleExport(option.id as 'markdown' | 'html' | 'text')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center space-x-2"
                        >
                          <span>{option.icon}</span>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  分享
                </Button>
              </div>
            )}

            {/* 视图控制 */}
            <div className="flex items-center space-x-1">
              {!isMobile && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLeftSidebarVisible(!leftSidebarVisible)}
                    className={leftSidebarVisible ? 'text-blue-600 bg-blue-50' : ''}
                  >
                    {leftSidebarVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRightSidebarVisible(!rightSidebarVisible)}
                    className={rightSidebarVisible ? 'text-blue-600 bg-blue-50' : ''}
                  >
                    {rightSidebarVisible ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                  </Button>
                </>
              )}

              {/* 专注模式切换 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFocusMode(!focusMode)}
                className={focusMode ? 'text-purple-600 bg-purple-50' : ''}
                title="专注模式"
              >
                <Zap className="h-4 w-4" />
              </Button>

              {/* 预览模式切换 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className={previewMode ? 'text-green-600 bg-green-50' : ''}
                title="预览模式"
              >
                {previewMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>

              {/* 全屏切换 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? '退出全屏' : '全屏模式'}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>

              {/* 设置菜单 */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                >
                  <Settings className="h-4 w-4" />
                </Button>

                {showSettingsMenu && (
                  <div className="absolute top-full mt-1 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-64 p-4">
                    <h4 className="font-medium mb-3">编辑器设置</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">主题</label>
                        <select
                          value={editorTheme}
                          onChange={(e) => setEditorTheme(e.target.value as 'light' | 'dark')}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="light">浅色</option>
                          <option value="dark">深色</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">字体大小</label>
                        <select
                          value={editorFontSize}
                          onChange={(e) => setEditorFontSize(Number(e.target.value))}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          {[12, 14, 16, 18, 20, 24].map(size => (
                            <option key={size} value={size}>{size}px</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">字体</label>
                        <select
                          value={editorFontFamily}
                          onChange={(e) => setEditorFontFamily(e.target.value)}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="Inter">Inter (推荐)</option>
                          <option value="JetBrains Mono">JetBrains Mono</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧边栏 - 文档结构 */}
        {leftSidebarVisible && !focusMode && !isMobile && (
          <>
            <aside 
              className={`${editorTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-r ${
                editorTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } flex flex-col`}
              style={{ width: `${leftSidebarWidth}px` }}
            >
              <DocumentStructureSidebar
                content={editorState.content}
                onNavigate={handleNavigateToText}
                theme={editorTheme}
                className="flex-1"
              />
            </aside>
            
            {/* 左侧边栏调整手柄 */}
            <div
              className="w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex-shrink-0"
              onMouseDown={(e) => handleMouseDown('left', e)}
            />
          </>
        )}

        {/* 主编辑区域 */}
        <main className="flex-1 flex flex-col min-w-0">
          <EnhancedRichTextEditor
            value={editorState.content}
            onChange={handleContentChange}
            onSave={handleSave}
            placeholder="开始写作你的论文..."
            className="flex-1"
            autoFocus
            theme={editorTheme}
            fontSize={editorFontSize}
            fontFamily={editorFontFamily}
            showToolbar={!focusMode}
            showStatusBar={!focusMode}
            readOnly={previewMode}
          />
        </main>

        {/* 右侧边栏 */}
        {rightSidebarVisible && !focusMode && (
          <>
            {/* 右侧边栏调整手柄 */}
            <div
              className="w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex-shrink-0"
              onMouseDown={(e) => handleMouseDown('right', e)}
            />
            
            <aside 
              className={`${editorTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-l ${
                editorTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } flex flex-col`}
              style={{ width: isMobile ? '100%' : `${rightSidebarWidth}px` }}
            >
              {/* 侧边栏标签 */}
              <div className={`border-b ${editorTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <nav className="flex">
                  {[
                    { id: 'ai', label: 'AI助手', icon: MessageSquare },
                    { id: 'structure', label: '结构', icon: Sidebar },
                    { id: 'progress', label: '进度', icon: Clock },
                    { id: 'stats', label: '统计', icon: MoreHorizontal }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveRightTab(tab.id as any)}
                      className={`flex-1 px-3 py-3 text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${
                        activeRightTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : editorTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {!isMobile && <span>{tab.label}</span>}
                    </button>
                  ))}
                </nav>
              </div>

              {/* 侧边栏内容 */}
              <div className="flex-1 overflow-hidden">
                {activeRightTab === 'ai' && (
                  <AgentPanel
                    content={editorState.content}
                    onContentChange={handleContentChange}
                    onInsertText={handleInsertText}
                  />
                )}
                
                {activeRightTab === 'structure' && (
                  <DocumentStructureSidebar
                    content={editorState.content}
                    onNavigate={handleNavigateToText}
                    theme={editorTheme}
                    className="flex-1"
                  />
                )}
                
                {activeRightTab === 'progress' && (
                  <ProgressTracker content={editorState.content} />
                )}
                
                {activeRightTab === 'stats' && (
                  <div className="p-4 space-y-4">
                    <h3 className={`text-lg font-semibold ${editorTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      文档统计
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-3 rounded-lg ${editorTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className={`text-2xl font-bold ${editorTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {editorStats.words}
                        </div>
                        <div className="text-sm text-gray-500">词数</div>
                      </div>
                      
                      <div className={`p-3 rounded-lg ${editorTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className={`text-2xl font-bold ${editorTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {editorStats.characters}
                        </div>
                        <div className="text-sm text-gray-500">字符</div>
                      </div>
                      
                      <div className={`p-3 rounded-lg ${editorTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className={`text-2xl font-bold ${editorTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {editorStats.paragraphs}
                        </div>
                        <div className="text-sm text-gray-500">段落</div>
                      </div>
                      
                      <div className={`p-3 rounded-lg ${editorTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className={`text-2xl font-bold ${editorTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {editorStats.readingTime}
                        </div>
                        <div className="text-sm text-gray-500">分钟阅读</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </>
        )}
      </div>

      {/* 移动端底部工具栏 */}
      {isMobile && (
        <div className={`${editorTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-4 py-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRightSidebarVisible(!rightSidebarVisible)}
                className={rightSidebarVisible ? 'text-blue-600 bg-blue-50' : ''}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={() => handleSave()}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {editorStats.words} 词
              </span>
              
              <Button variant="ghost" size="sm" onClick={() => handleExport()}>
                <Download className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalEditorPage;