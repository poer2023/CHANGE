import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Send, 
  Lightbulb, 
  Target, 
  Keyboard,
  Sparkles,
  BookOpen,
  BarChart,
  RefreshCw
} from 'lucide-react';
import { Scope } from '@/types/agent';
import { EXAMPLE_COMMANDS } from '@/services/agentApi';
import { useTranslation } from '@/hooks/useTranslation';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  scope: Scope;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

const CommandInput: React.FC<CommandInputProps> = ({
  onSubmit,
  scope,
  disabled = false,
  loading = false,
  placeholder,
  className = ''
}) => {
  const { t } = useTranslation();
  const [command, setCommand] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整文本域高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [command]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // A 键聚焦输入框
      if (e.key === 'a' || e.key === 'A') {
        if (document.activeElement?.tagName !== 'INPUT' && 
            document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          textareaRef.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 处理提交
  const handleSubmit = () => {
    if (command.trim() && !disabled && !loading) {
      onSubmit(command.trim());
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 获取作用域显示信息
  const getScopeDisplay = (scope: Scope) => {
    const scopeInfo = {
      document: { label: t('agent.scope.document'), icon: BookOpen, color: 'bg-blue-100 text-blue-700' },
      chapter: { label: `${t('agent.scope.chapter').replace(' ', ` ${scope.id} `)}`, icon: BookOpen, color: 'bg-green-100 text-green-700' },
      section: { label: `${t('agent.scope.section').replace(' ', ` ${scope.id} `)}`, icon: BookOpen, color: 'bg-purple-100 text-purple-700' },
      selection: { label: t('agent.scope.selection'), icon: Target, color: 'bg-orange-100 text-orange-700' }
    };
    
    return scopeInfo[scope.kind];
  };

  const scopeDisplay = getScopeDisplay(scope);
  const ScopeIcon = scopeDisplay.icon;

  // 示例命令分类
  const exampleCategories = {
    structure: { 
      label: t('agent.input.examples.structural'), 
      icon: BookOpen, 
      examples: EXAMPLE_COMMANDS.filter(cmd => 
        cmd.text.includes('拆成') || cmd.text.includes('合并') || cmd.text.includes('提升')
      )
    },
    format: { 
      label: t('agent.input.examples.format'), 
      icon: RefreshCw, 
      examples: EXAMPLE_COMMANDS.filter(cmd => 
        cmd.text.includes('统一') || cmd.text.includes('APA') || cmd.text.includes('引用')
      )
    },
    content: { 
      label: t('agent.input.examples.content'), 
      icon: BarChart, 
      examples: EXAMPLE_COMMANDS.filter(cmd => 
        cmd.text.includes('插入') || cmd.text.includes('补充')
      )
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 作用域显示 */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${scopeDisplay.color}`}>
          <ScopeIcon className="w-3 h-3" />
          {scopeDisplay.label}
          {scope.title && (
            <span className="opacity-75">: {scope.title}</span>
          )}
        </div>
        <Badge variant="outline" className="text-xs">
          <Target className="w-3 h-3 mr-1" />
          {t('agent.scope.label')}
        </Badge>
      </div>

      {/* 命令输入区域 */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || t('agent.command.placeholder')}
            className="w-full min-h-[80px] max-h-[120px] p-3 pr-12 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-[#6E5BFF] focus:ring-1 focus:ring-[#6E5BFF] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
            aria-label="Agent Command Input"
            aria-describedby="command-help"
          />
          
          {/* 提交按钮 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleSubmit}
                disabled={!command.trim() || disabled || loading}
                size="sm"
                className="absolute bottom-3 right-3 h-6 w-6 p-0 bg-[#6E5BFF] hover:bg-[#5A4ACF] transition-all duration-200 hover:scale-105"
                aria-label={t('agent.input.shortcut.execute')}
              >
                {loading ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('agent.input.shortcut.execute')}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* 帮助信息 */}
        <div 
          id="command-help" 
          className="flex items-center gap-4 text-xs text-slate-500"
        >
          <div className="flex items-center gap-1">
            <Keyboard className="w-3 h-3" />
            <span>{t('agent.input.shortcut.execute')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            <span>{t('agent.input.shortcut.focus')}</span>
          </div>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-1 hover:text-[#6E5BFF] transition-colors"
          >
            <Lightbulb className="w-3 h-3" />
            <span>{t('agent.input.shortcut.examples')}</span>
          </button>
        </div>
      </div>

      {/* 示例命令 */}
      {showExamples && (
        <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#6E5BFF]" />
            <span className="text-sm font-medium text-slate-700">{t('agent.input.examples.title')}</span>
          </div>
          
          {Object.entries(exampleCategories).map(([category, info]) => {
            const Icon = info.icon;
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-3 h-3 text-slate-500" />
                  <span className="text-xs font-medium text-slate-600">{info.label}</span>
                </div>
                
                <div className="grid gap-2">
                  {info.examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCommand(example.text);
                        setShowExamples(false);
                        textareaRef.current?.focus();
                      }}
                      className="text-left p-3 bg-white rounded-md border border-slate-200 hover:border-[#6E5BFF] hover:bg-slate-50 transition-colors group"
                    >
                      <div className="text-sm text-slate-700 group-hover:text-[#6E5BFF] mb-1">
                        {example.text}
                      </div>
                      <div className="text-xs text-slate-500">
                        {example.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommandInput;