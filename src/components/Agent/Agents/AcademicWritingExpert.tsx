import React, { useState } from 'react';
import { Card } from '../../UI/Card';
import { Button } from '../../UI/Button';
import { AgentSuggestion, AgentAction } from '../../../types';

interface AcademicWritingExpertProps {
  selectedText?: string;
  onSuggestion?: (suggestion: AgentSuggestion) => void;
  className?: string;
}

const AcademicWritingExpert: React.FC<AcademicWritingExpertProps> = ({
  selectedText = '',
  onSuggestion,
  className = ''
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<string>('');

  // 学术写作分析功能
  const analyzeWriting = async (text: string) => {
    setIsAnalyzing(true);
    
    // 模拟分析过程
    setTimeout(() => {
      const suggestions = generateWritingSuggestions(text);
      suggestions.forEach(suggestion => {
        onSuggestion?.(suggestion);
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  // 生成写作建议
  const generateWritingSuggestions = (text: string): AgentSuggestion[] => {
    const suggestions: AgentSuggestion[] = [];

    // 检查学术语言规范
    if (text.includes('我觉得') || text.includes('我认为')) {
      suggestions.push({
        id: 'academic-tone-1',
        type: 'improvement',
        title: '学术语言规范建议',
        content: '建议使用更客观的学术表达方式：\n\n- "我觉得" → "研究表明" 或 "分析显示"\n- "我认为" → "本研究认为" 或 "可以推断"',
        confidence: 0.9,
        action: {
          id: 'fix-academic-tone',
          type: 'text-replace',
          label: '应用学术语言',
          description: '将主观表达替换为客观学术语言',
          icon: '📝'
        }
      });
    }

    // 检查逻辑连接词
    if (text.length > 100 && !text.includes('因此') && !text.includes('然而') && !text.includes('此外')) {
      suggestions.push({
        id: 'logic-connection-1',
        type: 'enhancement',
        title: '逻辑连接词建议',
        content: '建议添加逻辑连接词以提升表达的连贯性：\n\n- 因果关系：因此、由此可见、这表明\n- 转折关系：然而、但是、相反\n- 递进关系：此外、进一步、同时',
        confidence: 0.85,
        action: {
          id: 'add-connectors',
          type: 'text-enhance',
          label: '添加连接词',
          description: '在适当位置添加逻辑连接词',
          icon: '🔗'
        }
      });
    }

    // 检查引用格式
    if (text.includes('(') && text.includes(')') && text.includes(',')) {
      suggestions.push({
        id: 'citation-format-1',
        type: 'correction',
        title: '引用格式检查',
        content: '发现可能的引用格式问题。请确保：\n\n- APA格式：(Smith, 2023)\n- 多作者：(Smith & Jones, 2023)\n- 多个引用：(Smith, 2023; Jones, 2022)',
        confidence: 0.8,
        action: {
          id: 'fix-citations',
          type: 'format-fix',
          label: '修正引用格式',
          description: '根据APA标准修正引用格式',
          icon: '📚'
        }
      });
    }

    return suggestions;
  };

  // 预设的写作检查功能
  const writingChecks = [
    {
      id: 'tone-check',
      title: '学术语调检查',
      description: '检查是否使用了合适的学术语言',
      icon: '🎯'
    },
    {
      id: 'structure-check',
      title: '段落结构分析',
      description: '分析段落的逻辑结构和连贯性',
      icon: '🏗️'
    },
    {
      id: 'clarity-check',
      title: '表达清晰度评估',
      description: '评估表达的清晰度和准确性',
      icon: '🔍'
    },
    {
      id: 'grammar-check',
      title: '语法规范检查',
      description: '检查语法错误和表达问题',
      icon: '📝'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 专家介绍 */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">👨‍🎓</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">学术写作专家</h3>
            <p className="text-sm text-gray-600">
              专注于提升学术写作质量、规范性和表达力
            </p>
          </div>
        </div>
      </Card>

      {/* 选中文本分析 */}
      {selectedText && (
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">选中文本分析</h4>
          <div className="bg-gray-50 p-3 rounded text-sm mb-3">
            {selectedText.length > 200 
              ? `${selectedText.substring(0, 200)}...` 
              : selectedText
            }
          </div>
          <Button
            onClick={() => analyzeWriting(selectedText)}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>分析中...</span>
              </div>
            ) : (
              '开始学术写作分析'
            )}
          </Button>
        </Card>
      )}

      {/* 写作检查工具 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">写作质量检查</h4>
        <div className="grid grid-cols-2 gap-2">
          {writingChecks.map((check) => (
            <Button
              key={check.id}
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentAnalysis(check.title);
                analyzeWriting(selectedText || '当前文档内容');
              }}
              className="flex flex-col items-center p-3 h-auto text-center"
            >
              <div className="text-lg mb-1">{check.icon}</div>
              <div className="text-xs font-medium">{check.title}</div>
              <div className="text-xs text-gray-500 mt-1">
                {check.description}
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* 写作指导 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">学术写作指导</h4>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-3">
            <h5 className="text-sm font-medium text-blue-900">语言规范</h5>
            <p className="text-xs text-blue-700">
              使用客观、准确的学术语言，避免主观色彩过强的表达
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-3">
            <h5 className="text-sm font-medium text-green-900">逻辑结构</h5>
            <p className="text-xs text-green-700">
              确保论证逻辑清晰，使用适当的连接词和过渡句
            </p>
          </div>
          <div className="border-l-4 border-purple-500 pl-3">
            <h5 className="text-sm font-medium text-purple-900">引用规范</h5>
            <p className="text-xs text-purple-700">
              正确使用引用格式，确保学术诚信和规范性
            </p>
          </div>
        </div>
      </Card>

      {/* 常用学术短语 */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">常用学术表达</h4>
        <div className="space-y-2">
          {[
            { category: '引言', phrases: ['本研究旨在', '研究问题是', '文献表明'] },
            { category: '方法', phrases: ['采用...方法', '数据来源于', '分析框架为'] },
            { category: '结果', phrases: ['结果显示', '数据表明', '分析发现'] },
            { category: '讨论', phrases: ['这一发现说明', '与前人研究一致', '需要进一步研究'] }
          ].map((group) => (
            <div key={group.category} className="text-xs">
              <span className="font-medium text-gray-700">{group.category}：</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {group.phrases.map((phrase, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      navigator.clipboard.writeText(phrase);
                    }}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AcademicWritingExpert;