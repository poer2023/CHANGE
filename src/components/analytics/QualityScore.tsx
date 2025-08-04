import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';

interface QualityScoreProps {
  score: number;
  breakdown: {
    structure: number;
    content: number;
    style: number;
    formatting: number;
  };
  compact?: boolean;
  className?: string;
}

interface ScoreDetail {
  label: string;
  score: number;
  maxScore: number;
  description: string;
  color: string;
  icon: string;
}

const QualityScore: React.FC<QualityScoreProps> = ({
  score,
  breakdown,
  compact = false,
  className = ''
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 90) return 'from-green-500 to-green-600';
    if (score >= 75) return 'from-blue-500 to-blue-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 90) return '优秀';
    if (score >= 75) return '良好';
    if (score >= 60) return '一般';
    return '待改进';
  };

  const scoreDetails: ScoreDetail[] = [
    {
      label: '结构完整性',
      score: breakdown.structure,
      maxScore: 100,
      description: '论文结构的完整性和逻辑性',
      color: 'blue',
      icon: '🏗️'
    },
    {
      label: '内容质量',
      score: breakdown.content,
      maxScore: 100,
      description: '内容的深度、准确性和相关性',
      color: 'green',
      icon: '📚'
    },
    {
      label: '写作风格',
      score: breakdown.style,
      maxScore: 100,
      description: '语言表达的清晰度和学术规范性',
      color: 'purple',
      icon: '✍️'
    },
    {
      label: '格式规范',
      score: breakdown.formatting,
      maxScore: 100,
      description: '引用格式和排版的规范性',
      color: 'orange',
      icon: '📋'
    }
  ];

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  if (compact) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700">写作质量</h3>
            <div className="flex items-center mt-1">
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-gray-500 ml-1">/100</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                score >= 90 ? 'bg-green-100 text-green-800' :
                score >= 75 ? 'bg-blue-100 text-blue-800' :
                score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {getScoreLabel(score)}
              </span>
            </div>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                {Math.round(animatedScore)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">写作质量评分</h3>
          <p className="text-gray-600 text-sm">基于多维度分析的综合评分</p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
        >
          {showDetails ? '隐藏详情' : '查看详情'}
        </button>
      </div>

      {/* 主评分显示 */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#scoreGradient)"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-2000 ease-out"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={`stop-color ${getScoreBgColor(score).split(' ')[0].replace('from-', '')}`} />
                  <stop offset="100%" className={`stop-color ${getScoreBgColor(score).split(' ')[1].replace('to-', '')}`} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {Math.round(animatedScore)}
              </span>
              <span className="text-gray-500 text-sm">/100</span>
            </div>
          </div>
          
          {/* 评分标签 */}
          <div className="text-center mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              score >= 90 ? 'bg-green-100 text-green-800' :
              score >= 75 ? 'bg-blue-100 text-blue-800' :
              score >= 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {getScoreLabel(score)}
            </span>
          </div>
        </div>
      </div>

      {/* 快速指标 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {scoreDetails.map((detail, index) => (
          <div
            key={detail.label}
            className="flex items-center p-3 bg-gray-50 rounded-lg"
          >
            <span className="text-lg mr-3">{detail.icon}</span>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {detail.label}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {detail.score}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-1000 ease-out bg-${detail.color}-500`}
                  style={{
                    width: `${(detail.score / detail.maxScore) * 100}%`,
                    transitionDelay: `${index * 200}ms`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 详细分析 */}
      {showDetails && (
        <div className="border-t pt-6 space-y-4 animate-slide-in-down">
          <h4 className="font-medium text-gray-900">详细分析</h4>
          {scoreDetails.map((detail) => (
            <div key={detail.label} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-lg mr-2">{detail.icon}</span>
                  <span className="font-medium text-gray-900">{detail.label}</span>
                </div>
                <div className="flex items-center">
                  <span className={`font-bold ${getScoreColor(detail.score)}`}>
                    {detail.score}
                  </span>
                  <span className="text-gray-500 ml-1">/{detail.maxScore}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">{detail.description}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-${detail.color}-500 transition-all duration-1000 ease-out`}
                  style={{ width: `${(detail.score / detail.maxScore) * 100}%` }}
                />
              </div>
              
              {/* 改进建议 */}
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                {detail.score < 70 && (
                  <span className="text-red-600 font-medium">
                    需要改进: 
                  </span>
                )}
                {detail.score >= 70 && detail.score < 85 && (
                  <span className="text-yellow-600 font-medium">
                    可以优化: 
                  </span>
                )}
                {detail.score >= 85 && (
                  <span className="text-green-600 font-medium">
                    表现良好: 
                  </span>
                )}
                {detail.label === '结构完整性' && detail.score < 70 && '建议完善论文大纲和章节结构'}
                {detail.label === '结构完整性' && detail.score >= 70 && detail.score < 85 && '可以进一步优化章节间的逻辑连接'}
                {detail.label === '结构完整性' && detail.score >= 85 && '结构清晰，逻辑性强'}
                
                {detail.label === '内容质量' && detail.score < 70 && '需要增加内容深度和相关性'}
                {detail.label === '内容质量' && detail.score >= 70 && detail.score < 85 && '内容较好，可以增加更多支撑材料'}
                {detail.label === '内容质量' && detail.score >= 85 && '内容丰富，质量很高'}
                
                {detail.label === '写作风格' && detail.score < 70 && '建议提升语言表达的清晰度'}
                {detail.label === '写作风格' && detail.score >= 70 && detail.score < 85 && '写作风格良好，可以进一步润色'}
                {detail.label === '写作风格' && detail.score >= 85 && '写作风格优秀，表达清晰'}
                
                {detail.label === '格式规范' && detail.score < 70 && '需要规范引用格式和排版'}
                {detail.label === '格式规范' && detail.score >= 70 && detail.score < 85 && '格式基本规范，细节需完善'}
                {detail.label === '格式规范' && detail.score >= 85 && '格式规范，符合学术标准'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 行动建议 */}
      <div className="mt-6 p-4 bg-primary-50 rounded-lg">
        <h4 className="font-medium text-primary-900 mb-2">即时改进建议</h4>
        <div className="space-y-2">
          {score < 60 && (
            <p className="text-primary-700 text-sm">
              • 建议从结构优化开始，确保论文有清晰的逻辑框架
            </p>
          )}
          {score >= 60 && score < 75 && (
            <p className="text-primary-700 text-sm">
              • 专注于内容深度的提升，增加更多有价值的分析
            </p>
          )}
          {score >= 75 && score < 90 && (
            <p className="text-primary-700 text-sm">
              • 可以开始关注写作风格的润色和格式的完善
            </p>
          )}
          {score >= 90 && (
            <p className="text-primary-700 text-sm">
              • 质量优秀！可以考虑进行最终的校对和格式检查
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default QualityScore;