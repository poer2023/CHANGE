'use client';

import { useState } from 'react';
import FormPage from '@/components/FormPage';
import ModularEditorDemo from '@/pages/demo/ModularEditorDemo';

export default function DemoPage() {
  const [currentDemo, setCurrentDemo] = useState<'form' | 'editor'>('form');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 演示切换器 */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">系统演示</h1>
            <div className="flex rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setCurrentDemo('form')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentDemo === 'form'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                渐进式表单
              </button>
              <button
                onClick={() => setCurrentDemo('editor')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentDemo === 'editor'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                模块化编辑器
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 演示内容 */}
      <div className="h-[calc(100vh-4rem)]">
        {currentDemo === 'form' ? (
          <FormPage />
        ) : (
          <ModularEditorDemo />
        )}
      </div>
    </div>
  );
}