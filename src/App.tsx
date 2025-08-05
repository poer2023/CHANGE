import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 基础页面组件
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import FormPage from './pages/form/FormPage';
import CreatePage from './pages/create/CreatePage';
import ErrorBoundary from './components/ErrorBoundary';

// 逐步添加复杂组件
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Papers from './pages/Papers';

// 简化版Demo组件（安全的）
import SimpleModularEditorDemo from './pages/demo/SimpleModularEditorDemo';
import SimpleAIWritingPage from './pages/ai-writing/SimpleAIWritingPage';
import SimpleContentAnalysisDemo from './pages/demo/SimpleContentAnalysisDemo';
import ProfessionalEditorDemo from './pages/demo/ProfessionalEditorDemo';

// 复杂编辑器组件（小心添加）
import ProfessionalEditorPage from './pages/editor/ProfessionalEditorPage';
import IntelligentModularEditorPage from './pages/editor/IntelligentModularEditorPage';

// Agent相关组件
import AgentDemoSimple from './pages/AgentDemo.simple';

// AI写作和分析组件
import AIWritingPage from './pages/ai-writing/AIWritingPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';

// 其他Demo组件
import ComprehensiveDemo from './pages/demo/ComprehensiveDemo';

// GLM测试组件和通知组件
import { GLMChatTest, GLMContentTest, NotificationToast } from './components';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* 最基础的路由 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/create" element={<CreatePage />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            
            {/* 编辑器路由 */}
            <Route path="/professional-editor/:id" element={
              <ErrorBoundary fallback={<div>专业编辑器加载失败，请刷新重试</div>}>
                <ProfessionalEditorPage />
              </ErrorBoundary>
            } />
            <Route path="/modular-editor/:id" element={
              <ErrorBoundary fallback={<div>智能模块化编辑器加载失败，请刷新重试</div>}>
                <IntelligentModularEditorPage />
              </ErrorBoundary>
            } />
            <Route path="/ai-writing/:id" element={
              <ErrorBoundary fallback={<div>AI写作页面加载失败，请刷新重试</div>}>
                <AIWritingPage />
              </ErrorBoundary>
            } />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <ErrorBoundary fallback={<div>Dashboard加载失败，请刷新重试</div>}>
                <Layout />
              </ErrorBoundary>
            }>
              <Route index element={<Dashboard />} />
              <Route path="papers" element={<Papers />} />
              <Route path="projects" element={<div className="p-6">Projects Page (Coming Soon)</div>} />
              <Route path="templates" element={<div className="p-6">Templates Page (Coming Soon)</div>} />
              <Route path="chat" element={<div className="p-6">AI Assistant Page (Coming Soon)</div>} />
              <Route path="references" element={<div className="p-6">References Page (Coming Soon)</div>} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
            
            {/* 简化版Demo页面 */}
            <Route path="/simple-modular-editor" element={
              <ErrorBoundary fallback={<div>模块化编辑器演示加载失败</div>}>
                <SimpleModularEditorDemo />
              </ErrorBoundary>
            } />
            <Route path="/simple-ai-writing" element={
              <ErrorBoundary fallback={<div>AI写作演示加载失败</div>}>
                <SimpleAIWritingPage />
              </ErrorBoundary>
            } />
            <Route path="/simple-content-analysis" element={
              <ErrorBoundary fallback={<div>内容分析演示加载失败</div>}>
                <SimpleContentAnalysisDemo />
              </ErrorBoundary>
            } />
            <Route path="/professional-editor-demo" element={
              <ErrorBoundary fallback={<div>专业编辑器演示加载失败</div>}>
                <ProfessionalEditorDemo />
              </ErrorBoundary>
            } />
            
            {/* Agent演示页面 */}
            <Route path="/agent-demo-simple" element={
              <ErrorBoundary fallback={<div>Agent演示加载失败</div>}>
                <AgentDemoSimple />
              </ErrorBoundary>
            } />
            <Route path="/comprehensive-demo" element={
              <ErrorBoundary fallback={<div>综合演示加载失败</div>}>
                <ComprehensiveDemo />
              </ErrorBoundary>
            } />
            
            {/* GLM API测试路由 */}
            <Route path="/test/glm-chat" element={
              <ErrorBoundary fallback={<div>GLM聊天测试加载失败</div>}>
                <GLMChatTest />
              </ErrorBoundary>
            } />
            <Route path="/test/glm-content" element={
              <ErrorBoundary fallback={<div>GLM内容测试加载失败</div>}>
                <GLMContentTest />
              </ErrorBoundary>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">页面不存在</p>
                  <a 
                    href="/" 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    返回首页
                  </a>
                </div>
              </div>
            } />
          </Routes>
          <NotificationToast />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;