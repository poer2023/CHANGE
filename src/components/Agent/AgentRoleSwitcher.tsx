import React from 'react';
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
  const agentRoles: AgentRole[] = [
    'academic-writing-expert',
    'research-assistant',
    'format-expert',
    'content-advisor'
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 mb-2">选择AI助手</h4>
      
      <div className="grid grid-cols-2 gap-2">
        {agentRoles.map((role) => {
          const agent = agents[role];
          const isActive = currentRole === role;
          
          return (
            <Button
              key={role}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRoleChange(role)}
              className={`
                flex flex-col items-center p-3 h-auto text-left transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm' 
                  : 'hover:bg-gray-50 hover:border-gray-300'
                }
              `}
            >
              <div className="text-lg mb-1">{agent.avatar}</div>
              <div className="text-xs font-medium leading-tight">
                {agent.name}
              </div>
              <div className="text-xs text-gray-500 mt-1 leading-tight">
                {agent.description.split('、')[0]}
              </div>
            </Button>
          );
        })}
      </div>

      {/* 当前选中的Agent详细信息 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg">{agents[currentRole].avatar}</span>
          <span className="text-sm font-medium text-gray-900">
            {agents[currentRole].name}
          </span>
          <span className="flex items-center space-x-1 text-xs text-green-600">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
            <span>活跃</span>
          </span>
        </div>
        
        <p className="text-xs text-gray-600 mb-2">
          {agents[currentRole].description}
        </p>
        
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-700">核心能力：</div>
          <div className="flex flex-wrap gap-1">
            {agents[currentRole].capabilities.slice(0, 3).map((capability, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-white text-gray-600 text-xs rounded border"
              >
                {capability}
              </span>
            ))}
            {agents[currentRole].capabilities.length > 3 && (
              <span className="px-2 py-0.5 bg-white text-gray-400 text-xs rounded border">
                +{agents[currentRole].capabilities.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentRoleSwitcher;