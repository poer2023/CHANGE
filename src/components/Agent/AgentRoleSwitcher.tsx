import React, { useState } from 'react';
import { Agent, AgentRole } from '../../types';
import { Button } from '../UI/Button';

interface AgentRoleSwitcherProps {
  currentRole: AgentRole;
  onRoleChange: (role: AgentRole) => void;
  agents: Record<AgentRole, Agent>;
  className?: string;
}

const AgentRoleSwitcher: React.FC<AgentRoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
  agents,
  className = ''
}) => {
  const [previousRole, setPreviousRole] = useState<AgentRole | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // 处理角色切换
  const handleRoleChange = async (newRole: AgentRole) => {
    if (newRole === currentRole || isTransitioning) return;
    
    setIsTransitioning(true);
    setPreviousRole(currentRole);
    
    // 模拟切换延迟，增强体验
    setTimeout(() => {
      onRoleChange(newRole);
      setIsTransitioning(false);
    }, 150);
  };

  // 获取角色切换状态样式
  const getRoleButtonStyle = (role: AgentRole) => {
    const isActive = currentRole === role;
    const isPrevious = previousRole === role;
    
    if (isActive) {
      return 'bg-blue-100 border-blue-300 text-blue-900 shadow-md ring-2 ring-blue-200 scale-105';
    }
    if (isPrevious && isTransitioning) {
      return 'bg-red-50 border-red-200 text-red-700 scale-95';
    }
    return 'hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm hover:scale-102';
  };

  const agentRoles: AgentRole[] = [
    'academic-writing-expert',
    'research-assistant',
    'format-expert',
    'content-advisor'
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 mb-2">选择AI助手</h4>
      
      <div className="grid grid-cols-2 gap-3">
        {agentRoles.map((role) => {
          const agent = agents[role];
          const isActive = currentRole === role;
          
          return (
            <Button
              key={role}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRoleChange(role)}
              disabled={isTransitioning}
              className={`
                flex flex-col items-center p-4 h-auto text-left transition-all duration-300 relative
                ${getRoleButtonStyle(role)}
                ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* 角色头像和动画 */}
              <div className={`text-2xl mb-2 transition-transform duration-300 ${
                isActive ? 'animate-bounce' : ''
              }`}>
                {agent.avatar}
              </div>
              
              {/* 角色名称 */}
              <div className="text-sm font-medium leading-tight text-center">
                {agent.name}
              </div>
              
              {/* 角色描述 */}
              <div className="text-xs text-gray-500 mt-1 leading-tight text-center line-clamp-2">
                {agent.description.split('、')[0]}
              </div>
              
              {/* 活跃状态指示器 */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
              )}
              
              {/* 加载状态 */}
              {isTransitioning && currentRole === role && (
                <div className="absolute inset-0 bg-white bg-opacity-70 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </Button>
          );
        })}
      </div>

      {/* 当前选中的Agent详细信息 */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 transition-all duration-500">
        <div className="flex items-center space-x-3 mb-3">
          <div className="relative">
            <span className="text-2xl">{agents[currentRole].avatar}</span>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-base font-semibold text-gray-900">
                {agents[currentRole].name}
              </span>
              {isTransitioning && (
                <div className="flex items-center space-x-1 text-xs text-blue-600">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  <span>切换中...</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>在线</span>
              </div>
              <div className="text-xs text-gray-500">
                响应时间: <span className="font-medium">1-2秒</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
          {agents[currentRole].description}
        </p>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-800">核心能力：</div>
          <div className="flex flex-wrap gap-2">
            {agents[currentRole].capabilities.slice(0, 4).map((capability, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white text-blue-700 text-xs rounded-full border border-blue-200 shadow-sm transition-transform hover:scale-105"
              >
                {capability}
              </span>
            ))}
            {agents[currentRole].capabilities.length > 4 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200">
                +{agents[currentRole].capabilities.length - 4} 更多
              </span>
            )}
          </div>
        </div>
        
        {/* 快捷操作 */}
        <div className="mt-4 pt-3 border-t border-blue-200 border-opacity-50">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 text-xs bg-white hover:bg-blue-50 border border-blue-200 text-blue-700"
              onClick={() => {
                console.log('查看能力详情');
              }}
            >
              📋 查看能力
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 text-xs bg-white hover:bg-green-50 border border-green-200 text-green-700"
              onClick={() => {
                console.log('开始对话');
              }}
            >
              💬 开始对话
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentRoleSwitcher;