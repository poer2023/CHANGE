import React, { useState } from 'react';
import { Card } from '../../UI/Card';
import { Button } from '../../UI/Button';
import { AgentSuggestion } from '../../../types';

interface FormatExpertProps {
  documentContent?: string;
  onSuggestion?: (suggestion: AgentSuggestion) => void;
  className?: string;
}

const FormatExpert: React.FC<FormatExpertProps> = ({
  documentContent = '',
  onSuggestion,
  className = ''
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('APA');
  const [isChecking, setIsChecking] = useState(false);

  // 格式检查功能
  const checkFormat = async (formatType: string) => {
    setIsChecking(true);
    
    setTimeout(() => {
      const issues = generateFormatIssues(formatType, documentContent);
      
      if (issues.length > 0) {
        const suggestion: AgentSuggestion = {
          id: 'format-check-' + Date.now(),
          type: 'warning',
          title: `${formatType}格式检查结果`,
          content: `发现 ${issues.length} 个格式问题：\n\n${issues.map((issue, idx) => 
            `${idx + 1}. ${issue.description}\n   位置: ${issue.location}\n   建议: ${issue.suggestion}`
          ).join('\n\n')}`,
          confidence: 0.92,
          action: {
            id: 'fix-format-issues',
            type: 'format-fix',
            label: '自动修复格式',
            description: '自动修复检测到的格式问题',
            icon: '🔧'
          }
        };
        onSuggestion?.(suggestion);
      } else {
        const suggestion: AgentSuggestion = {
          id: 'format-ok-' + Date.now(),
          type: 'enhancement',
          title: '格式检查通过',
          content: `文档格式符合${formatType}标准，未发现明显问题。建议：\n\n1. 定期检查新增内容的格式\n2. 注意图表标题的一致性\n3. 确保参考文献格式统一`,
          confidence: 0.95
        };
        onSuggestion?.(suggestion);
      }
      
      setIsChecking(false);
    }, 1500);
  };

  // 生成格式问题
  const generateFormatIssues = (formatType: string, content: string) => {
    const issues = [];
    
    // 模拟不同类型的格式问题
    if (content.includes('图1') || content.includes('表1')) {
      issues.push({
        type: 'figure-caption',
        description: '图表标题格式不规范',
        location: '第3页',
        suggestion: '图表标题应居中，字体为小五号'
      });
    }
    
    if (content.includes('(') && content.includes(',')) {
      issues.push({
        type: 'citation',
        description: '引用格式可能不符合规范',
        location: '第2段',
        suggestion: `${formatType}格式要求：(作者, 年份)`
      });
    }
    
    issues.push({
      type: 'spacing',
      description: '行间距不统一',
      location: '全文',
      suggestion: '建议使用1.5倍行间距'
    });
    
    return issues;
  };

  // 格式标准
  const formatStandards = [
    {
      id: 'APA',
      name: 'APA 7th',
      description: '美国心理学会格式',
      icon: '📘',
      rules: [
        '引用格式：(作者, 年份)',
        '参考文献按字母排序',
        '双倍行距',
        '12号Times New Roman字体'
      ]
    },
    {
      id: 'MLA',
      name: 'MLA 8th',
      description: '现代语言协会格式',
      icon: '📗',
      rules: [
        '引用格式：(作者 页码)',
        '参考文献称为Works Cited',
        '双倍行距',
        '12号Times New Roman字体'
      ]
    },
    {
      id: 'Chicago',
      name: 'Chicago',
      description: '芝加哥格式',
      icon: '📙',
      rules: [
        '脚注或尾注形式',
        '参考文献按字母排序',
        '双倍行距',
        '12号字体'
      ]
    },
    {
      id: 'IEEE',
      name: 'IEEE',
      description: '电气电子工程师协会格式',
      icon: '📒',
      rules: [
        '引用格式：[1]',
        '参考文献按出现顺序编号',
        '10号字体',
        '单倍行距'
      ]
    }
  ];

  // 格式检查工具
  const formatTools = [
    {
      id: 'citation-check',
      title: '引用格式检查',
      description: '检查文内引用格式',
      icon: '📚',
      action: () => checkFormat(selectedFormat)
    },
    {
      id: 'reference-check',
      title: '参考文献检查',
      description: '检查参考文献格式',
      icon: '📖',
      action: () => {
        const suggestion: AgentSuggestion = {
          id: 'ref-check-' + Date.now(),
          type: 'improvement',
          title: '参考文献格式建议',
          content: `${selectedFormat}格式参考文献要求：\n\n期刊文章：\n作者. (年份). 标题. 期刊名, 卷号(期号), 页码.\n\n书籍：\n作者. (年份). 书名. 出版社.\n\n网络资源：\n作者. (年份). 标题. 网站名. URL`,
          confidence: 0.90
        };
        onSuggestion?.(suggestion);
      }
    },
    {
      id: 'figure-check',
      title: '图表格式检查',
      description: '检查图表标题和格式',
      icon: '📊',
      action: () => {
        const suggestion: AgentSuggestion = {
          id: 'figure-check-' + Date.now(),
          type: 'enhancement',
          title: '图表格式规范',
          content: '图表格式要求：\n\n图标题：\n- 位置：图下方居中\n- 格式：图1. 标题内容\n- 字体：小五号\n\n表标题：\n- 位置：表上方居中\n- 格式：表1 标题内容\n- 字体：小五号\n\n注意保持编号连续性和格式一致性。',
          confidence: 0.88
        };
        onSuggestion?.(suggestion);
      }
    },
    {
      id: 'layout-check',
      title: '版面格式检查',
      description: '检查页面布局和格式',
      icon: '📄',
      action: () => {
        const suggestion: AgentSuggestion = {
          id: 'layout-check-' + Date.now(),
          type: 'improvement',
          title: '版面格式建议',
          content: '版面格式要求：\n\n页边距：\n- 上下：2.54cm\n- 左右：3.17cm\n\n字体：\n- 正文：宋体12号\n- 标题：黑体加粗\n\n行距：1.5倍\n段落：首行缩进2字符',
          confidence: 0.85
        };
        onSuggestion?.(suggestion);
      }
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 专家介绍 */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">📝</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">格式专家</h3>
            <p className="text-sm text-gray-600">
              专业的引用格式、排版规范和学术标准指导
            </p>
          </div>
        </div>
      </Card>

      {/* 格式标准选择 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">选择格式标准</h4>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {formatStandards.map((format) => (
            <Button
              key={format.id}
              variant={selectedFormat === format.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFormat(format.id)}
              className="flex flex-col items-center p-3 h-auto text-center"
            >
              <div className="text-lg mb-1">{format.icon}</div>
              <div className="text-xs font-medium">{format.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {format.description}
              </div>
            </Button>
          ))}
        </div>
        
        {/* 选中格式的规则 */}
        <div className="bg-gray-50 p-3 rounded">
          <h5 className="text-sm font-medium text-gray-900 mb-2">
            {formatStandards.find(f => f.id === selectedFormat)?.name} 主要规则：
          </h5>
          <ul className="text-xs text-gray-700 space-y-1">
            {formatStandards.find(f => f.id === selectedFormat)?.rules.map((rule, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* 格式检查工具 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">格式检查工具</h4>
        <div className="grid grid-cols-2 gap-2">
          {formatTools.map((tool) => (
            <Button
              key={tool.id}
              variant="outline"
              size="sm"
              onClick={tool.action}
              disabled={isChecking}
              className="flex flex-col items-center p-3 h-auto text-center"
            >
              <div className="text-lg mb-1">{tool.icon}</div>
              <div className="text-xs font-medium">{tool.title}</div>
              <div className="text-xs text-gray-500 mt-1">
                {tool.description}
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* 引用生成器 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">引用生成器</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              📰 期刊文章
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              📚 书籍
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              🌐 网页
            </Button>
          </div>
          <div className="text-xs text-gray-600">
            选择文献类型，自动生成符合{selectedFormat}标准的引用格式
          </div>
        </div>
      </Card>

      {/* 格式模板 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">格式模板</h4>
        <div className="space-y-2">
          {[
            { type: '论文标题页', template: '标题、作者、机构、日期' },
            { type: '摘要页', template: '摘要、关键词' },
            { type: '目录页', template: '章节目录、页码' },
            { type: '正文页', template: '标题层级、段落格式' }
          ].map((item) => (
            <div key={item.type} className="flex items-center justify-between p-2 border border-gray-200 rounded">
              <div>
                <div className="text-sm font-medium text-gray-900">{item.type}</div>
                <div className="text-xs text-gray-500">{item.template}</div>
              </div>
              <Button size="sm" variant="ghost" className="text-xs">
                📥 下载
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* 常见格式错误 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">常见格式错误</h4>
        <div className="space-y-2">
          {[
            {
              error: '引用格式混乱',
              solution: '统一使用选定的引用格式',
              severity: 'high'
            },
            {
              error: '图表标题不规范',
              solution: '确保图下表上，编号连续',
              severity: 'medium'
            },
            {
              error: '参考文献排序错误',
              solution: '按字母顺序或数字顺序排列',
              severity: 'medium'
            },
            {
              error: '页面格式不统一',
              solution: '检查页边距、字体、行距',
              severity: 'low'
            }
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-2 border border-gray-200 rounded">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                item.severity === 'high' ? 'bg-red-500' :
                item.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{item.error}</div>
                <div className="text-xs text-gray-600">{item.solution}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 检查状态 */}
      {isChecking && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-800">正在检查{selectedFormat}格式规范...</span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FormatExpert;