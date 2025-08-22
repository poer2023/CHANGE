import { useEffect, useCallback } from 'react';

type ShortcutHandler = () => void;
type ShortcutMap = Record<string, ShortcutHandler>;

interface UseKeyboardShortcutsProps {
  onFocusAssistant?: () => void;
  onExecuteCommand?: () => void;
  onSwitchToDeliverables?: () => void;
  onSwitchToAssistant?: () => void;
  onSwitchToAudit?: () => void;
  disabled?: boolean;
}

// Original function for backward compatibility
export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Build key combination string
      const keys: string[] = [];
      
      if (event.ctrlKey || event.metaKey) keys.push('CtrlLeft');
      if (event.shiftKey) keys.push('ShiftLeft');
      if (event.altKey) keys.push('AltLeft');
      
      // Add the main key
      if (event.code !== 'ControlLeft' && event.code !== 'ShiftLeft' && event.code !== 'AltLeft' && event.code !== 'MetaLeft') {
        keys.push(event.code);
      }
      
      const combination = keys.join('+');
      
      // Check if this combination has a handler
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

// Enhanced hook for Result page shortcuts
export const useResultShortcuts = ({
  onFocusAssistant,
  onExecuteCommand,
  onSwitchToDeliverables,
  onSwitchToAssistant,
  onSwitchToAudit,
  disabled = false
}: UseKeyboardShortcutsProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return;
    
    // Don't trigger shortcuts when user is typing in inputs, textareas, or contenteditable elements
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      // Only allow Ctrl/Cmd+Enter in text inputs for command execution
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && onExecuteCommand) {
        event.preventDefault();
        onExecuteCommand();
      }
      return;
    }

    // Focus assistant with 'A' key
    if (event.key.toLowerCase() === 'a' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      onFocusAssistant?.();
      return;
    }

    // Tab switching with Alt + number
    if (event.altKey && !event.ctrlKey && !event.metaKey) {
      switch (event.key) {
        case '1':
          event.preventDefault();
          onSwitchToDeliverables?.();
          break;
        case '2':
          event.preventDefault();
          onSwitchToAssistant?.();
          break;
        case '3':
          event.preventDefault();
          onSwitchToAudit?.();
          break;
      }
    }
  }, [
    disabled,
    onFocusAssistant,
    onExecuteCommand,
    onSwitchToDeliverables,
    onSwitchToAssistant,
    onSwitchToAudit
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    // Provide key combination descriptions for UI hints
    shortcuts: {
      focusAssistant: 'A',
      executeCommand: 'Ctrl+Enter',
      switchToDeliverables: 'Alt+1',
      switchToAssistant: 'Alt+2',
      switchToAudit: 'Alt+3'
    }
  };
};