import React, { useState } from 'react';
import { FileText, ClipboardList, BookOpen, MessageCircle, Download, CheckCircle, Clock } from 'lucide-react';

type NavigationTab = 'content' | 'summary' | 'references' | 'interview';

interface ResultNavigationProps {
  activeTab?: NavigationTab;
  onTabChange?: (tab: NavigationTab) => void;
  className?: string;
}

const ResultNavigation: React.FC<ResultNavigationProps> = ({ 
  activeTab = 'content', 
  onTabChange,
  className = ''
}) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>(activeTab);

  const handleTabClick = (tab: NavigationTab) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  const navigationItems = [
    {
      id: 'content' as NavigationTab,
      label: '内容预览',
      icon: FileText,
      status: 'completed' as const,
      description: '查看生成的完整文档内容'
    },
    {
      id: 'summary' as NavigationTab,
      label: '过程摘要',
      icon: ClipboardList,
      status: 'completed' as const,
      description: '写作流程总结和数据统计'
    },
    {
      id: 'references' as NavigationTab,
      label: '参考文献',
      icon: BookOpen,
      status: 'completed' as const,
      description: '完整的引用列表和格式化输出'
    },
    {
      id: 'interview' as NavigationTab,
      label: '面谈准备',
      icon: MessageCircle,
      status: 'generating' as const,
      description: '基于内容生成的问答清单'
    }
  ];

  const getStatusIcon = (status: 'completed' | 'generating' | 'pending') => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'generating':
        return <Clock className="w-3 h-3 text-blue-500 animate-pulse" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-slate-300" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 导航标题 */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">交付内容</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span className="text-xs text-gray-500">已完成</span>
        </div>
      </div>

      {/* 导航项目列表 */}
      <div className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#6E5BFF]/10 text-[#6E5BFF] font-medium shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#6E5BFF]/20 text-[#6E5BFF]' 
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {item.label}
                    </span>
                    {getStatusIcon(item.status)}
                  </div>
                  <p className={`text-xs mt-1 truncate ${
                    isActive ? 'text-[#6E5BFF]/70' : 'text-slate-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 快捷操作区域 */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">快捷操作</h4>
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出完整文档
          </button>
          <button className="w-full flex items-center gap-3 p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
            <FileText className="w-4 h-4" />
            生成PDF报告
          </button>
        </div>
      </div>

      {/* 项目信息卡片 */}
      <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#6E5BFF]/10 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#6E5BFF]" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">交付完成</p>
            <p className="text-xs text-slate-500">所有内容已生成</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">生成时间</span>
            <span className="text-slate-700">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">质量评分</span>
            <span className="text-green-600 font-medium">优秀</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultNavigation;