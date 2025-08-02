// 模块化编辑器使用示例

import React from 'react';
import { ModularEditor, TemplateLibrary } from '@/components';
import { PaperModule, ModuleTemplate } from '@/types/modular';

// 示例1: 基本使用
export const BasicUsage: React.FC = () => {
  return (
    <div className="h-screen">
      <ModularEditor paperId="example-paper-1" />
    </div>
  );
};

// 示例2: 自定义模块创建
export const CustomModuleExample: React.FC = () => {
  const createCustomModule = (): PaperModule => {
    return {
      id: `module-${Date.now()}`,
      type: 'custom',
      title: '数据分析',
      content: '',
      order: 1,
      isCollapsed: false,
      isCompleted: false,
      wordCount: 0,
      progress: 0,
      dependencies: [],
      metadata: {
        tags: ['数据', '分析'],
        difficulty: 'medium',
        estimatedTime: 120,
        lastModified: new Date(),
        revisionCount: 0,
        notes: ['需要添加图表', '引用最新研究']
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };

  return (
    <div>
      <button onClick={() => console.log(createCustomModule())}>
        创建自定义模块
      </button>
    </div>
  );
};

// 示例3: 模板使用
export const TemplateUsageExample: React.FC = () => {
  const researchTemplate: ModuleTemplate = {
    id: 'research-paper-template',
    name: '标准研究论文',
    description: '适用于学术期刊投稿的标准研究论文格式',
    structure: [
      {
        id: 'abstract',
        title: '摘要',
        description: '研究概要和主要发现',
        isRequired: true,
        order: 1
      },
      {
        id: 'introduction',
        title: '引言',
        description: '研究背景和问题陈述',
        isRequired: true,
        order: 2
      },
      {
        id: 'methods',
        title: '研究方法',
        description: '研究设计和实施方案',
        isRequired: true,
        order: 3
      },
      {
        id: 'results',
        title: '研究结果',
        description: '数据分析和主要发现',
        isRequired: true,
        order: 4
      },
      {
        id: 'discussion',
        title: '讨论',
        description: '结果解释和意义分析',
        isRequired: true,
        order: 5
      },
      {
        id: 'conclusion',
        title: '结论',
        description: '研究总结和未来方向',
        isRequired: true,
        order: 6
      }
    ],
    prompts: [
      '明确阐述研究问题和假设',
      '提供充分的文献支持',
      '详细描述研究方法和样本',
      '客观报告研究结果',
      '深入讨论研究意义和局限性'
    ],
    guidelines: [
      '遵循APA格式规范',
      '确保逻辑结构清晰',
      '提供充分的数据支持',
      '保持学术写作风格'
    ],
    wordCountTarget: {
      min: 6000,
      max: 8000
    }
  };

  const handleTemplateSelect = (template: ModuleTemplate) => {
    console.log('应用模板:', template);
    // 这里可以实现模板应用逻辑
    // 1. 根据模板结构创建模块
    // 2. 设置模块顺序和依赖关系
    // 3. 应用写作指导和格式要求
  };

  return (
    <TemplateLibrary onTemplateSelect={handleTemplateSelect} />
  );
};

// 示例4: 模块状态管理
export const ModuleStateExample: React.FC = () => {
  const [modules, setModules] = React.useState<PaperModule[]>([]);

  const handleModuleUpdate = (moduleId: string, updates: Partial<PaperModule>) => {
    setModules(prevModules =>
      prevModules.map(module =>
        module.id === moduleId
          ? { 
              ...module, 
              ...updates, 
              updatedAt: new Date(),
              metadata: {
                ...module.metadata,
                revisionCount: module.metadata.revisionCount + 1
              }
            }
          : module
      )
    );
  };

  const handleModuleReorder = (dragIndex: number, hoverIndex: number) => {
    setModules(prevModules => {
      const draggedModule = prevModules[dragIndex];
      const newModules = [...prevModules];
      newModules.splice(dragIndex, 1);
      newModules.splice(hoverIndex, 0, draggedModule);
      
      // 更新order字段
      return newModules.map((module, index) => ({
        ...module,
        order: index + 1
      }));
    });
  };

  const calculateOverallProgress = () => {
    if (modules.length === 0) return 0;
    const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0);
    return Math.round(totalProgress / modules.length);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">论文进度</h2>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${calculateOverallProgress()}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          整体完成度: {calculateOverallProgress()}%
        </p>
      </div>

      <div className="space-y-2">
        {modules.map((module, index) => (
          <div key={module.id} className="border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{module.title}</span>
              <span className="text-sm text-gray-500">{module.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 示例5: AI集成使用
export const AIIntegrationExample: React.FC = () => {
  const [aiSuggestions, setAiSuggestions] = React.useState<any[]>([]);

  const generateAISuggestions = async (module: PaperModule) => {
    // 模拟AI建议生成
    const suggestions = [
      {
        type: 'structure',
        title: '结构优化建议',
        content: '建议在当前章节添加子标题以提高可读性',
        confidence: 0.85
      },
      {
        type: 'content',
        title: '内容补充建议',
        content: '可以添加更多的实例来支持你的观点',
        confidence: 0.78
      },
      {
        type: 'style',
        title: '写作风格建议',
        content: '建议使用更简洁的句式来提高表达效果',
        confidence: 0.92
      }
    ];
    
    setAiSuggestions(suggestions);
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-3">AI写作建议</h3>
      <div className="space-y-3">
        {aiSuggestions.map((suggestion, index) => (
          <div key={index} className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">AI</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-900 font-medium mb-1">
                  {suggestion.title}
                </p>
                <p className="text-sm text-blue-700">
                  {suggestion.content}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-blue-600">
                    置信度: {Math.round(suggestion.confidence * 100)}%
                  </span>
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    应用建议
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 示例6: 协作功能
export const CollaborationExample: React.FC = () => {
  const [collaborators] = React.useState([
    { id: '1', name: '张三', avatar: '', isOnline: true },
    { id: '2', name: '李四', avatar: '', isOnline: false },
    { id: '3', name: '王五', avatar: '', isOnline: true }
  ]);

  const [comments] = React.useState([
    {
      id: '1',
      moduleId: 'introduction',
      author: '张三',
      content: '这个引言部分需要加强背景介绍',
      timestamp: new Date(),
      isResolved: false
    },
    {
      id: '2',
      moduleId: 'methods',
      author: '李四',
      content: '研究方法描述很详细，赞！',
      timestamp: new Date(),
      isResolved: true
    }
  ]);

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="font-semibold mb-3">协作者</h3>
        <div className="flex space-x-2">
          {collaborators.map(collaborator => (
            <div key={collaborator.id} className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center relative ${
                collaborator.isOnline ? 'ring-2 ring-green-400' : ''
              }`}>
                <span className="text-sm font-medium">
                  {collaborator.name[0]}
                </span>
                {collaborator.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>
              <span className="text-sm">{collaborator.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">评论和建议</h3>
        <div className="space-y-3">
          {comments.map(comment => (
            <div key={comment.id} className={`p-3 rounded-lg border ${
              comment.isResolved ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{comment.author}</p>
                  <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {comment.timestamp.toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  comment.isResolved 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {comment.isResolved ? '已解决' : '待处理'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 导出所有示例
export default {
  BasicUsage,
  CustomModuleExample,
  TemplateUsageExample,
  ModuleStateExample,
  AIIntegrationExample,
  CollaborationExample
};