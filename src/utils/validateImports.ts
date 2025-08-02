// 导入验证脚本 - 检查所有Agent相关组件的导入是否正确

// 检查类型导入
import type { 
  Agent, 
  AgentRole, 
  AgentMessage, 
  ChatSession, 
  AgentContext, 
  AgentSuggestion,
  QuickAction 
} from '../types';

// 检查数据导入
import { AGENTS, QUICK_ACTIONS, MOCK_RESPONSES } from '../data/agents';

// 检查Store导入
import { useAgentStore } from '../store/agentStore';

// 检查组件导入
import AgentPanel from '../components/Agent/AgentPanel';
import AgentRoleSwitcher from '../components/Agent/AgentRoleSwitcher';
import ChatInterface from '../components/Agent/ChatInterface';
import ChatMessage from '../components/Agent/ChatMessage';
import QuickActionBar from '../components/Agent/QuickActionBar';
import AgentSuggestionCard from '../components/Agent/AgentSuggestionCard';

// 检查专门Agent组件导入
import AcademicWritingExpert from '../components/Agent/Agents/AcademicWritingExpert';
import ResearchAssistant from '../components/Agent/Agents/ResearchAssistant';
import FormatExpert from '../components/Agent/Agents/FormatExpert';
import ContentAdvisor from '../components/Agent/Agents/ContentAdvisor';

// 检查UI组件导入
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';

// 验证函数
export const validateImports = () => {
  const validations = {
    types: {
      Agent: typeof Agent !== 'undefined',
      AgentRole: true, // type alias
      AgentMessage: typeof AgentMessage !== 'undefined',
      ChatSession: typeof ChatSession !== 'undefined',
      AgentContext: typeof AgentContext !== 'undefined',
      AgentSuggestion: typeof AgentSuggestion !== 'undefined',
      QuickAction: typeof QuickAction !== 'undefined'
    },
    data: {
      AGENTS: typeof AGENTS === 'object' && AGENTS !== null,
      QUICK_ACTIONS: Array.isArray(QUICK_ACTIONS),
      MOCK_RESPONSES: typeof MOCK_RESPONSES === 'object' && MOCK_RESPONSES !== null
    },
    store: {
      useAgentStore: typeof useAgentStore === 'function'
    },
    components: {
      AgentPanel: typeof AgentPanel === 'function',
      AgentRoleSwitcher: typeof AgentRoleSwitcher === 'function',
      ChatInterface: typeof ChatInterface === 'function',
      ChatMessage: typeof ChatMessage === 'function',
      QuickActionBar: typeof QuickActionBar === 'function',
      AgentSuggestionCard: typeof AgentSuggestionCard === 'function',
      AcademicWritingExpert: typeof AcademicWritingExpert === 'function',
      ResearchAssistant: typeof ResearchAssistant === 'function',
      FormatExpert: typeof FormatExpert === 'function',
      ContentAdvisor: typeof ContentAdvisor === 'function'
    },
    ui: {
      Button: typeof Button === 'function',
      Card: typeof Card === 'function',
      Input: typeof Input === 'function'
    }
  };

  // 检查结果
  const results = Object.entries(validations).map(([category, checks]) => {
    const passed = Object.values(checks).every(Boolean);
    const failed = Object.entries(checks).filter(([, result]) => !result);
    
    return {
      category,
      passed,
      failed: failed.map(([name]) => name),
      total: Object.keys(checks).length
    };
  });

  return {
    allPassed: results.every(r => r.passed),
    results,
    summary: {
      totalChecks: results.reduce((sum, r) => sum + r.total, 0),
      passedChecks: results.reduce((sum, r) => sum + (r.total - r.failed.length), 0),
      failedChecks: results.reduce((sum, r) => sum + r.failed.length, 0)
    }
  };
};

// 仅在开发环境下运行验证
if (process.env.NODE_ENV === 'development') {
  try {
    const validation = validateImports();
    console.log('🔍 Agent系统导入验证结果:', validation);
    
    if (validation.allPassed) {
      console.log('✅ 所有导入验证通过!');
    } else {
      console.warn('⚠️ 发现导入问题:', validation.results.filter(r => !r.passed));
    }
  } catch (error) {
    console.error('❌ 导入验证失败:', error);
  }
}

export default validateImports;