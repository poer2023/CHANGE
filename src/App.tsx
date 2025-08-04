import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 逐步添加核心页面组件
import HomePage from './pages/HomePage';
import CreatePage from './pages/create/CreatePage';
import FormPage from './pages/form/FormPage';

// 修复导入问题后添加核心组件
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Papers from './pages/Papers';

// 编辑器页面有问题，暂时移除
// import EditorPage from './pages/editor/EditorPage';
// import ModularEditorPage from './pages/editor/ModularEditorPage';

// 先测试Auth页面
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// 原版ModularEditorDemo仍有问题，继续暂时移除
// import ModularEditorDemo from './pages/demo/ModularEditorDemo';
import AgentDemoSimple from './pages/AgentDemo.simple';

// AI写作页面有问题，暂时移除
// import AIWritingPage from './pages/ai-writing/AIWritingPage';

// 测试分析页面
import AnalyticsPage from './pages/analytics/AnalyticsPage';

// 测试其他Demo页面
import ComprehensiveDemo from './pages/demo/ComprehensiveDemo';
// ContentAnalysisDemo有问题，暂时移除
// import ContentAnalysisDemo from './pages/demo/ContentAnalysisDemo';

// 简化版组件
import SimpleModularEditorDemo from './pages/demo/SimpleModularEditorDemo';
import SimpleAIWritingPage from './pages/ai-writing/SimpleAIWritingPage';
import SimpleContentAnalysisDemo from './pages/demo/SimpleContentAnalysisDemo';

// 测试组件有问题，立即移除
// import TestMinimalModular from './pages/demo/TestMinimalModular';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/form" element={<FormPage />} />
          
          {/* 测试Auth页面 */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          
          {/* ModularEditorDemo有问题，暂时移除 */}
          {/* <Route path="/demo" element={<ModularEditorDemo />} /> */}
          <Route path="/agent-demo" element={<AgentDemoSimple />} />
          
          {/* AI写作页面有问题，暂时移除 */}
          {/* <Route path="/ai-writing" element={<AIWritingPage />} /> */}
          
          {/* 测试分析页面 */}
          <Route path="/analytics" element={<AnalyticsPage />} />
          
          {/* 测试其他Demo页面 */}
          <Route path="/comprehensive-demo" element={<ComprehensiveDemo />} />
          {/* ContentAnalysisDemo有问题，暂时移除 */}
          {/* <Route path="/content-analysis-demo" element={<ContentAnalysisDemo />} /> */}
          
          {/* 原版ModularEditorDemo仍有问题，继续暂时移除 */}
          {/* <Route path="/demo" element={<ModularEditorDemo />} /> */}
          
          {/* 简化版组件 */}
          <Route path="/simple-modular-editor" element={<SimpleModularEditorDemo />} />
          <Route path="/simple-ai-writing" element={<SimpleAIWritingPage />} />
          <Route path="/simple-content-analysis" element={<SimpleContentAnalysisDemo />} />
          
          {/* 测试组件有问题，已移除 */}
          {/* <Route path="/test-modular" element={<TestMinimalModular />} /> */}
          
          {/* 编辑器页面有问题，暂时移除 */}
          {/* <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/modular-editor/:id" element={<ModularEditorPage />} /> */}
          
          {/* Dashboard功能 */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="papers" element={<Papers />} />
          </Route>
          
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
      </div>
    </Router>
  );
}

export default App;