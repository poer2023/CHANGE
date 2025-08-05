import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Zap,
  Eye,
  Settings,
  Download,
  Share2,
  Users,
  Clock,
  BarChart3
} from 'lucide-react';

import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import ProfessionalEditorPage from '../editor/ProfessionalEditorPage';

const ProfessionalEditorDemo: React.FC = () => {
  const navigate = useNavigate();
  const [showEditor, setShowEditor] = useState(false);

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: '增强的富文本编辑器',
      description: '全功能的Markdown编辑器，支持实时预览、语法高亮和智能格式化',
      highlights: ['工具栏分组', '快捷键支持', '自定义字体和主题', '全屏模式']
    },
    {
      icon: <FileText className="h-6 w-6 text-green-600" />,
      title: '智能文档结构',
      description: '自动解析文档结构，提供可导航的大纲视图',
      highlights: ['层级结构', '快速导航', '内容过滤', '搜索功能']
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: 'AI写作助手',
      description: '集成智能AI助手，提供实时写作建议和内容优化',
      highlights: ['语法检查', '内容建议', '结构优化', '多Agent支持']
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-orange-600" />,
      title: '详细统计分析',
      description: '实时统计字数、阅读时间，跟踪写作进度',
      highlights: ['字数统计', '阅读时间', '写作进度', '性能指标']
    },
    {
      icon: <Eye className="h-6 w-6 text-indigo-600" />,
      title: '多模式支持',
      description: '支持编辑模式、预览模式和专注模式',
      highlights: ['实时预览', '专注模式', '全屏编辑', '响应式设计']
    },
    {
      icon: <Settings className="h-6 w-6 text-gray-600" />,
      title: '高度可定制',
      description: '丰富的个性化设置，适应不同的写作习惯',
      highlights: ['主题切换', '字体设置', '布局调整', '快捷键配置']
    }
  ];

  const demoContent = `# AI论文写作工具专业编辑器

## 概述

这是一个功能丰富的专业富文本编辑器，专为学术写作而设计。它结合了现代化的用户界面和强大的AI辅助功能。

## 主要特性

### 1. 增强的编辑体验
- **智能工具栏**: 分组的格式化工具，支持文本格式、标题、列表等
- **快捷键支持**: 完整的键盘快捷键系统
- **实时预览**: 所见即所得的编辑体验
- **主题切换**: 支持浅色和深色主题

### 2. 文档结构管理
- **自动大纲**: 根据标题自动生成文档大纲
- **快速导航**: 点击大纲项目快速跳转到对应位置
- **结构可视化**: 层级清晰的文档结构展示

### 3. AI智能助手
- **写作建议**: 实时提供写作改进建议
- **语法检查**: 智能检测语法错误
- **内容优化**: 建议更好的表达方式
- **多专家Agent**: 不同领域的专业AI助手

### 4. 统计与分析
- **实时统计**: 字数、字符数、段落数统计
- **阅读时间**: 估算阅读所需时间  
- **写作进度**: 跟踪写作进度和目标

## 技术特性

\`\`\`typescript
// 示例代码：编辑器配置
const editorConfig = {
  theme: 'light' | 'dark',
  fontSize: 16,
  fontFamily: 'Inter',
  showToolbar: true,
  showStatusBar: true,
  enableAI: true
};
\`\`\`

> **提示**: 这个编辑器支持完整的Markdown语法，包括表格、代码块、引用等。

### 数据表格示例

| 功能 | 状态 | 优先级 |
|------|------|--------|
| 富文本编辑 | ✅ 完成 | 高 |
| AI助手 | ✅ 完成 | 高 |
| 文档结构 | ✅ 完成 | 中 |
| 导出功能 | ✅ 完成 | 中 |

---

## 开始使用

1. 点击"体验编辑器"按钮开始
2. 在左侧面板中查看文档结构
3. 在右侧面板中使用AI助手
4. 使用工具栏进行格式化
5. 通过设置菜单自定义编辑器

**祝您写作愉快！** 🎉`;

  if (showEditor) {
    // 创建一个模拟的论文对象
    const mockPaper = {
      id: 'demo-professional-editor',
      title: '专业编辑器演示文档',
      content: demoContent,
      status: 'writing' as const,
      type: 'research-paper' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorName: '演示用户',
      paperType: 'research-paper' as const,
      academicLevel: 'graduate' as const
    };

    // 模拟设置当前论文
    React.useEffect(() => {
      // 这里可以设置到store中，但为了演示简单，我们直接渲染
    }, []);

    return (
      <div className="h-screen">
        <ProfessionalEditorPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              专业编辑器演示
            </h1>
          </div>
          
          <Button onClick={() => setShowEditor(true)} className="px-6">
            体验编辑器
          </Button>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            专业富文本编辑器
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            为学术写作量身定制的现代化编辑器，集成AI助手、智能结构分析和丰富的格式化功能
          </p>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>实时统计</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Zap className="h-4 w-4" />
              <span>AI助手</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Eye className="h-4 w-4" />
              <span>实时预览</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Settings className="h-4 w-4" />
              <span>高度可定制</span>
            </div>
          </div>
        </div>

        {/* 功能特性 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-1">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-sm text-gray-500 flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 编辑器预览 */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-16">
          <div className="bg-gray-900 px-6 py-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-4 text-gray-300 text-sm">专业编辑器</span>
            </div>
          </div>
          
          <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                <FileText className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                编辑器界面预览
              </h3>
              <p className="text-gray-600 mb-8 max-w-md">
                点击下方按钮体验完整的专业编辑器功能
              </p>
              <Button 
                onClick={() => setShowEditor(true)}
                size="lg"
                className="px-8"
              >
                <Eye className="h-5 w-5 mr-2" />
                立即体验
              </Button>
            </div>
          </div>
        </div>

        {/* 使用场景 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            适用场景
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: '学术论文', desc: '研究论文、毕业论文写作' },
              { title: '技术文档', desc: '技术规范、API文档编写' },
              { title: '长篇内容', desc: '书籍、报告等长文档' },
              { title: '协作写作', desc: '团队协作的内容创作' }
            ].map((scenario, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {scenario.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {scenario.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA区域 */}
        <div className="bg-blue-600 rounded-2xl px-8 py-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            开始您的专业写作之旅
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            体验现代化的写作工具，让AI助手帮助您创作更优质的内容
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              onClick={() => setShowEditor(true)}
              variant="secondary"
              size="lg"
              className="px-8"
            >
              <Zap className="h-5 w-5 mr-2" />
              立即开始
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              size="lg"
              className="px-8 border-white text-white hover:bg-white hover:text-blue-600"
            >
              返回首页
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalEditorDemo;