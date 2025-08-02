import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components';
import { 
  Dashboard, 
  Papers, 
  HomePage,
  CreatePage,
  EditorPage,
  ModularEditorPage,
  FormPage,
  ModularEditorDemo,
  ComprehensiveDemo,
  AgentDemo,
  LoginPage,
  RegisterPage
} from '@/pages';
import ErrorBoundary from '@/components/ErrorBoundary';
import NotificationToast from '@/components/NotificationToast';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Landing and Form Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/form" element={<FormPage />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            
            {/* Editor Routes */}
            <Route path="/editor/:id" element={<EditorPage />} />
            <Route path="/modular-editor/:id" element={<ModularEditorPage />} />
            <Route path="/create" element={<CreatePage />} />
            
            {/* Demo Routes */}
            <Route path="/demo" element={<ModularEditorDemo />} />
            <Route path="/agent-demo" element={<AgentDemo />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="papers" element={<Papers />} />
              <Route path="projects" element={<div className="p-6">Projects Page (Coming Soon)</div>} />
              <Route path="templates" element={<div className="p-6">Templates Page (Coming Soon)</div>} />
              <Route path="chat" element={<div className="p-6">AI Assistant Page (Coming Soon)</div>} />
              <Route path="references" element={<div className="p-6">References Page (Coming Soon)</div>} />
              <Route path="analytics" element={<div className="p-6">Analytics Page (Coming Soon)</div>} />
            </Route>
            
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