import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Send, 
  Wand2, 
  FileText, 
  BarChart3,
  Image,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Square,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Sparkles,
  Settings,
  History,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

// Agent command type definitions
interface AgentCommand {
  id: string;
  text: string;
  type: 'structural' | 'formatting' | 'citation' | 'style' | 'chart' | 'custom';
  category: 'quick' | 'advanced' | 'custom';
  timestamp: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: string;
  preview?: string;
  executionTime?: number;
  changes?: Array<{
    type: 'text' | 'structure' | 'citation' | 'image';
    description: string;
    before?: string;
    after?: string;
  }>;
}

// Quick commands factory
const createQuickCommands = (t: (key: string) => string) => [
  {
    id: 'restructure',
    text: t('result.agent.command.restructure_text'),
    type: 'structural' as const,
    category: 'quick' as const,
    icon: FileText,
    description: t('result.agent.command.restructure_desc'),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'format_apa',
    text: t('result.agent.command.format_apa_text'),
    type: 'formatting' as const,
    category: 'quick' as const,
    icon: BookOpen,
    description: t('result.agent.command.format_apa_desc'),
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'add_chart',
    text: t('result.agent.command.add_chart_text'),
    type: 'chart' as const,
    category: 'quick' as const,
    icon: BarChart3,
    description: t('result.agent.command.add_chart_desc'),
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'polish_style',
    text: t('result.agent.command.polish_style_text'),
    type: 'style' as const,
    category: 'quick' as const,
    icon: Sparkles,
    description: t('result.agent.command.polish_style_desc'),
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
];

// Advanced templates factory
const createAdvancedTemplates = (t: (key: string) => string) => [
  {
    id: 'comprehensive_review',
    template: t('result.agent.template.comprehensive_review'),
    type: 'style',
    description: t('result.agent.template.comprehensive_review_desc')
  },
  {
    id: 'citation_enhancement',
    template: t('result.agent.template.citation_enhancement'),
    type: 'citation',
    description: t('result.agent.template.citation_enhancement_desc')
  },
  {
    id: 'figure_generation',
    template: t('result.agent.template.figure_generation'),
    type: 'chart',
    description: t('result.agent.template.figure_generation_desc')
  },
  {
    id: 'section_expansion',
    template: t('result.agent.template.section_expansion'),
    type: 'structural',
    description: t('result.agent.template.section_expansion_desc')
  }
];

// Execution history factory
const createMockExecutionHistory = (t: (key: string) => string): AgentCommand[] => [
  {
    id: 'cmd-001',
    text: t('result.agent.history.cmd1_text'),
    type: 'structural',
    category: 'quick',
    timestamp: '14:35',
    status: 'completed',
    result: t('result.agent.history.cmd1_result'),
    executionTime: 1.2,
    changes: [
      {
        type: 'structure',
        description: t('result.agent.history.cmd1_change_desc'),
        before: t('result.agent.history.cmd1_before'),
        after: t('result.agent.history.cmd1_after')
      }
    ]
  },
  {
    id: 'cmd-002',
    text: t('result.agent.history.cmd2_text'),
    type: 'chart',
    category: 'quick',
    timestamp: '14:42',
    status: 'completed',
    result: t('result.agent.history.cmd2_result'),
    executionTime: 3.8,
    changes: [
      {
        type: 'image',
        description: t('result.agent.history.cmd2_change_desc'),
        after: t('result.agent.history.cmd2_after')
      }
    ]
  },
  {
    id: 'cmd-003',
    text: t('result.agent.history.cmd3_text'),
    type: 'formatting',
    category: 'advanced',
    timestamp: '14:48',
    status: 'executing',
    result: t('result.agent.history.cmd3_result'),
    executionTime: undefined
  }
];

// Single command execution card
const CommandExecutionCard: React.FC<{
  command: AgentCommand;
  onCancel?: () => void;
  onViewResult?: () => void;
  t: (key: string) => string;
}> = ({ command, onCancel, onViewResult, t }) => {
  const [expanded, setExpanded] = useState(false);

  const StatusIcon = () => {
    switch (command.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'executing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (command.status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'executing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <StatusIcon />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 mb-2">{command.text}</p>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={getStatusColor()}>
                  {command.status === 'completed' ? t('result.agent.status.completed') :
                   command.status === 'executing' ? t('result.agent.status.executing') :
                   command.status === 'failed' ? t('result.agent.status.failed') : t('result.agent.status.pending')}
                </Badge>
                <span className="text-xs text-gray-500">{command.timestamp}</span>
                {command.executionTime && (
                  <span className="text-xs text-gray-500">
                    {t('result.agent.execution_time', { time: command.executionTime?.toString() || '0' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {command.status === 'executing' && onCancel && (
              <Button size="sm" variant="outline" onClick={onCancel}>
                <Square className="w-3 h-3" />
              </Button>
            )}
            
            {command.status === 'completed' && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </Button>
                {onViewResult && (
                  <Button size="sm" variant="outline" onClick={onViewResult}>
                    {t('result.agent.view')}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Execution progress */}
        {command.status === 'executing' && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">{t('result.agent.execution_progress')}</span>
              <span className="text-gray-600">{t('result.agent.processing')}</span>
            </div>
            <Progress value={65} className="h-1" />
          </div>
        )}

        {/* Expanded details */}
        {expanded && command.changes && (
          <div className="mt-4 space-y-2">
            <h5 className="text-sm font-medium text-gray-900">{t('result.agent.change_details')}:</h5>
            {command.changes.map((change, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                <div className="font-medium text-gray-700 mb-1">
                  {change.type === 'structure' ? t('result.agent.change_type.structure') :
                   change.type === 'text' ? t('result.agent.change_type.text') :
                   change.type === 'citation' ? t('result.agent.change_type.citation') :
                   change.type === 'image' ? t('result.agent.change_type.image') : t('result.agent.change_type.other')}
                </div>
                <div className="text-gray-600">{change.description}</div>
                {change.before && change.after && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-red-600 font-medium">{t('result.agent.before')}:</div>
                      <div className="bg-red-50 p-1 rounded border">{change.before}</div>
                    </div>
                    <div>
                      <div className="text-green-600 font-medium">{t('result.agent.after')}:</div>
                      <div className="bg-green-50 p-1 rounded border">{change.after}</div>
                    </div>
                  </div>
                )}
                {change.after && !change.before && (
                  <div className="mt-2">
                    <div className="text-green-600 font-medium text-xs">{t('result.agent.new_content')}:</div>
                    <div className="bg-green-50 p-1 rounded border text-xs">{change.after}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Result summary */}
        {command.status === 'completed' && command.result && !expanded && (
          <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
            <p className="text-sm text-green-800">{command.result}</p>
          </div>
        )}

        {/* Failure message */}
        {command.status === 'failed' && (
          <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
            <p className="text-sm text-red-800">{t('result.agent.execution_failed')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main component
const AgentCommandPanel: React.FC = () => {
  const { t } = useTranslation();
  const quickCommands = createQuickCommands(t);
  const advancedTemplates = createAdvancedTemplates(t);
  const mockExecutionHistory = createMockExecutionHistory(t);
  
  const [activeTab, setActiveTab] = useState('chat');
  const [inputText, setInputText] = useState('');
  const [executionHistory, setExecutionHistory] = useState<AgentCommand[]>(mockExecutionHistory);
  const [isExecuting, setIsExecuting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [executionHistory]);

  // Execute quick command
  const executeQuickCommand = async (commandTemplate: typeof quickCommands[0]) => {
    const newCommand: AgentCommand = {
      id: `cmd-${Date.now()}`,
      text: commandTemplate.text,
      type: commandTemplate.type,
      category: commandTemplate.category,
      timestamp: new Date().toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: 'executing'
    };

    setExecutionHistory(prev => [...prev, newCommand]);
    setIsExecuting(true);

    // 模拟执行过程
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // 模拟执行结果
    const completedCommand: AgentCommand = {
      ...newCommand,
      status: 'completed',
      result: t('result.agent.operation_completed', { desc: commandTemplate.description }),
      executionTime: Math.round((2 + Math.random() * 3) * 10) / 10,
      changes: [
        {
          type: commandTemplate.type === 'structural' ? 'structure' :
                commandTemplate.type === 'chart' ? 'image' :
                commandTemplate.type === 'citation' ? 'citation' : 'text',
          description: t('result.agent.description_completed', { desc: commandTemplate.description }),
          after: t('result.agent.change_applied', { desc: commandTemplate.description })
        }
      ]
    };

    setExecutionHistory(prev => 
      prev.map(cmd => cmd.id === newCommand.id ? completedCommand : cmd)
    );
    setIsExecuting(false);
    toast.success(t('result.agent.desc_completed', { desc: commandTemplate.description }));
  };

  // Execute custom command
  const executeCustomCommand = async () => {
    if (!inputText.trim()) return;

    const newCommand: AgentCommand = {
      id: `cmd-${Date.now()}`,
      text: inputText,
      type: 'custom',
      category: 'custom',
      timestamp: new Date().toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: 'executing'
    };

    setExecutionHistory(prev => [...prev, newCommand]);
    setInputText('');
    setIsExecuting(true);

    // 模拟执行
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2500));

    const completedCommand: AgentCommand = {
      ...newCommand,
      status: 'completed',
      result: t('result.agent.custom_operation_completed'),
      executionTime: Math.round((1.5 + Math.random() * 2.5) * 10) / 10
    };

    setExecutionHistory(prev => 
      prev.map(cmd => cmd.id === newCommand.id ? completedCommand : cmd)
    );
    setIsExecuting(false);
    toast.success(t('result.agent.custom_command_completed'));
  };

  // Cancel execution
  const cancelExecution = (commandId: string) => {
    setExecutionHistory(prev => 
      prev.map(cmd => 
        cmd.id === commandId && cmd.status === 'executing' 
          ? { ...cmd, status: 'failed' }
          : cmd
      )
    );
    setIsExecuting(false);
    toast.info(t('result.agent.command_cancelled'));
  };

  // Insert template to input
  const insertTemplate = (template: string) => {
    setInputText(template);
    setActiveTab('chat');
  };

  return (
    <div className="space-y-4">
      {/* Header info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">{t('result.agent.title')}</h3>
              <p className="text-sm text-blue-700">
                {t('result.agent.subtitle')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main interaction interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="text-xs">
            <Bot className="h-3 w-3 mr-1" />
            {t('result.agent.tab.smart_chat')}
          </TabsTrigger>
          <TabsTrigger value="quick" className="text-xs">
            <Wand2 className="h-3 w-3 mr-1" />
            {t('result.agent.tab.quick_commands')}
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            <History className="h-3 w-3 mr-1" />
            {t('result.agent.tab.execution_history')}
          </TabsTrigger>
        </TabsList>

        {/* Smart chat */}
        <TabsContent value="chat" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('result.agent.natural_language_title')}</CardTitle>
              <p className="text-sm text-gray-600">
                {t('result.agent.natural_language_desc')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Textarea
                  placeholder={t('result.agent.input_placeholder')}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[100px] resize-none"
                  disabled={isExecuting}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Settings className="w-4 h-4" />
                    <span>{t('result.agent.supported_features')}</span>
                  </div>
                  
                  <Button
                    onClick={executeCustomCommand}
                    disabled={!inputText.trim() || isExecuting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        {t('result.agent.executing')}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t('result.agent.execute_command')}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Advanced templates */}
              <div className="border-t pt-4">
                <h5 className="text-sm font-medium text-gray-900 mb-3">{t('result.agent.common_templates')}</h5>
                <div className="space-y-2">
                  {advancedTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => insertTemplate(template.template)}
                      className="w-full text-left p-2 rounded hover:bg-gray-50 border border-gray-200 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900">{template.description}</div>
                      <div className="text-xs text-gray-600 mt-1">{template.template}</div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick commands */}
        <TabsContent value="quick" className="mt-4">
          <div className="grid gap-3">
            {quickCommands.map((command) => {
              const IconComponent = command.icon;
              return (
                <Card 
                  key={command.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => executeQuickCommand(command)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${command.bgColor}`}>
                        <IconComponent className={`w-5 h-5 ${command.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">{command.description}</h4>
                        <p className="text-sm text-gray-600 truncate">{command.text}</p>
                      </div>
                      <Play className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Execution history */}
        <TabsContent value="history" className="mt-4">
          <div className="space-y-4">
            {executionHistory.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('result.agent.no_commands_yet')}</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {executionHistory.slice().reverse().map((command) => (
                  <CommandExecutionCard
                    key={command.id}
                    command={command}
                    onCancel={command.status === 'executing' ? () => cancelExecution(command.id) : undefined}
                    t={t}
                    onViewResult={command.status === 'completed' ? () => toast.info(t('result.agent.view_detailed_result')) : undefined}
                  />
                ))}
                <div ref={chatEndRef} />
              </>
            )}

            {/* Action buttons */}
            {executionHistory.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const commandsText = executionHistory
                      .map(cmd => `${cmd.timestamp}: ${cmd.text}`)
                      .join('\n');
                    navigator.clipboard.writeText(commandsText);
                    toast.success(t('result.agent.history_copied'));
                  }}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {t('result.agent.copy_history')}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const csvContent = executionHistory
                      .map(cmd => `"${cmd.timestamp}","${cmd.text}","${cmd.status}","${cmd.executionTime || ''}"`)
                      .join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'agent-command-history.csv';
                    a.click();
                    toast.success(t('result.agent.history_exported'));
                  }}
                >
                  <Download className="w-4 h-4 mr-1" />
                  {t('result.agent.export_records')}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentCommandPanel;