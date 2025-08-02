import React, { useMemo, useState } from 'react';
import { 
  Target, 
  Clock, 
  FileText, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Circle,
  BarChart3,
  Award,
  Flame,
  Users,
  BookOpen
} from 'lucide-react';

interface ProgressStats {
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
  pageCount: number;
  readingTime: number;
}

interface Goal {
  id: string;
  type: 'word' | 'page' | 'time' | 'deadline';
  target: number;
  current: number;
  label: string;
  deadline?: Date;
}

interface ProgressTrackerProps {
  content: string;
  goals?: Goal[];
  className?: string;
  onUpdateGoal?: (goalId: string, current: number) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  content,
  goals = [],
  className = "",
  onUpdateGoal
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'goals' | 'analytics'>('overview');

  // 计算统计数据
  const stats: ProgressStats = useMemo(() => {
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const characterCount = content.length;
    const paragraphCount = content.split(/\n\s*\n/).filter(p => p.trim()).length;
    const pageCount = Math.ceil(wordCount / 250); // 假设每页250字
    const readingTime = Math.ceil(wordCount / 200); // 假设每分钟200字

    return {
      wordCount,
      characterCount,
      paragraphCount,
      pageCount,
      readingTime
    };
  }, [content]);

  // 默认目标
  const defaultGoals: Goal[] = [
    {
      id: 'word-target',
      type: 'word',
      target: 5000,
      current: stats.wordCount,
      label: '字数目标'
    },
    {
      id: 'page-target',
      type: 'page',
      target: 20,
      current: stats.pageCount,
      label: '页数目标'
    }
  ];

  const allGoals = goals.length > 0 ? goals : defaultGoals;

  // 计算总体进度
  const overallProgress = useMemo(() => {
    if (allGoals.length === 0) return 0;
    
    const totalProgress = allGoals.reduce((sum, goal) => {
      const progress = Math.min((goal.current / goal.target) * 100, 100);
      return sum + progress;
    }, 0);
    
    return Math.round(totalProgress / allGoals.length);
  }, [allGoals]);

  // 今日写作数据（模拟）
  const todayStats = {
    wordsWritten: Math.min(stats.wordCount, 500 + Math.floor(Math.random() * 300)),
    timeSpent: Math.floor(stats.wordCount / 50), // 假设每分钟写50字
    sessionsCount: Math.max(1, Math.floor(stats.wordCount / 200))
  };

  // 写作连续天数（模拟）
  const streakDays = 7;

  const renderProgressRing = (progress: number, size = 120, strokeWidth = 8) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* 背景圆环 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          {/* 进度圆环 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-blue-500 transition-all duration-500 ease-in-out"
            style={{ strokeLinecap: 'round' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{progress}%</div>
            <div className="text-xs text-gray-500">完成</div>
          </div>
        </div>
      </div>
    );
  };

  const renderGoalCard = (goal: Goal) => {
    const progress = Math.min((goal.current / goal.target) * 100, 100);
    const isCompleted = goal.current >= goal.target;

    return (
      <div key={goal.id} className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
            <h4 className="text-sm font-medium text-gray-900">{goal.label}</h4>
          </div>
          <span className="text-xs text-gray-500">
            {goal.current}/{goal.target}
          </span>
        </div>

        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isCompleted ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>{progress.toFixed(0)}% 完成</span>
          {goal.deadline && (
            <span>截止: {goal.deadline.toLocaleDateString()}</span>
          )}
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="p-4 space-y-6">
      {/* 总体进度 */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">总体进度</h3>
        <div className="flex justify-center mb-4">
          {renderProgressRing(overallProgress)}
        </div>
        <p className="text-sm text-gray-600">
          已完成 {allGoals.filter(g => g.current >= g.target).length} / {allGoals.length} 个目标
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">字数</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{stats.wordCount.toLocaleString()}</div>
          <div className="text-xs text-blue-700">{stats.characterCount} 字符</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <BookOpen className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">页数</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{stats.pageCount}</div>
          <div className="text-xs text-green-700">{stats.paragraphCount} 段落</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">阅读时间</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{stats.readingTime}</div>
          <div className="text-xs text-purple-700">分钟</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Flame className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">连续天数</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">{streakDays}</div>
          <div className="text-xs text-orange-700">天</div>
        </div>
      </div>

      {/* 今日成就 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <Award className="h-4 w-4 mr-2 text-yellow-600" />
          今日进展
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">写作字数</span>
            <span className="font-medium text-gray-900">{todayStats.wordsWritten}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">投入时间</span>
            <span className="font-medium text-gray-900">{todayStats.timeSpent} 分钟</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">写作次数</span>
            <span className="font-medium text-gray-900">{todayStats.sessionsCount} 次</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">写作目标</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          设置目标
        </button>
      </div>

      <div className="space-y-3">
        {allGoals.map(renderGoalCard)}
      </div>

      {/* 目标建议 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 建议</h4>
        <p className="text-sm text-blue-800">
          基于你的写作节奏，建议每天至少写作500字，这样可以在合理时间内完成目标。
        </p>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">写作分析</h3>

      {/* 写作效率 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
          写作效率
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">平均写作速度</span>
            <span className="font-medium text-gray-900">
              {Math.round(stats.wordCount / Math.max(todayStats.timeSpent, 1))} 字/分钟
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">平均段落长度</span>
            <span className="font-medium text-gray-900">
              {Math.round(stats.wordCount / Math.max(stats.paragraphCount, 1))} 字
            </span>
          </div>
        </div>
      </div>

      {/* 文档质量 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <BarChart3 className="h-4 w-4 mr-2 text-green-600" />
          文档质量
        </h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">结构完整性</span>
              <span className="text-green-600">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">内容丰富度</span>
              <span className="text-blue-600">72%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">语言流畅度</span>
              <span className="text-purple-600">78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 改进建议 */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-yellow-900 mb-2">🎯 改进建议</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• 增加更多的具体例子和案例</li>
          <li>• 优化段落间的逻辑连接</li>
          <li>• 考虑添加图表和可视化内容</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* 标签栏 */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveView('overview')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeView === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            概览
          </button>
          <button
            onClick={() => setActiveView('goals')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeView === 'goals'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            目标
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeView === 'analytics'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            分析
          </button>
        </nav>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'goals' && renderGoals()}
        {activeView === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default ProgressTracker;