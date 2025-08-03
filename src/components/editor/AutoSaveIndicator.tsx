import React, { useState, useEffect, useCallback } from 'react';
import { 
  Save, 
  Check, 
  AlertCircle, 
  Clock, 
  Wifi, 
  WifiOff,
  Cloud,
  CloudOff,
  Loader2
} from 'lucide-react';

interface AutoSaveIndicatorProps {
  content: string;
  onSave?: (content: string) => Promise<boolean>;
  autoSaveInterval?: number; // 自动保存间隔（毫秒）
  className?: string;
  showLastSaved?: boolean;
  showNetworkStatus?: boolean;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'pending';

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  content,
  onSave,
  autoSaveInterval = 30000, // 默认30秒
  className = "",
  showLastSaved = true,
  showNetworkStatus = true
}) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [saveError, setSaveError] = useState<string>('');
  const [pendingChanges, setPendingChanges] = useState(false);

  // 监听网络状态
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 保存函数
  const performSave = useCallback(async (contentToSave: string) => {
    if (!onSave) return false;

    setSaveStatus('saving');
    setSaveError('');

    try {
      const success = await onSave(contentToSave);
      
      if (success) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        setPendingChanges(false);
        
        // 2秒后回到idle状态
        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
        
        return true;
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      setSaveStatus('error');
      setSaveError(error instanceof Error ? error.message : '保存时发生错误');
      
      // 如果离线，标记为有待保存的更改
      if (!isOnline) {
        setPendingChanges(true);
      }
      
      return false;
    }
  }, [onSave, isOnline]);

  // 检测内容变化
  useEffect(() => {
    if (content && saveStatus !== 'saving') {
      setSaveStatus('pending');
      setPendingChanges(true);
    }
  }, [content, saveStatus]);

  // 自动保存
  useEffect(() => {
    if (!content || saveStatus === 'saving' || !pendingChanges) {
      return;
    }

    const timer = setTimeout(() => {
      if (isOnline) {
        performSave(content);
      }
    }, autoSaveInterval);

    return () => clearTimeout(timer);
  }, [content, saveStatus, pendingChanges, isOnline, autoSaveInterval, performSave]);

  // 在线状态变化时尝试保存
  useEffect(() => {
    if (isOnline && pendingChanges && content) {
      performSave(content);
    }
  }, [isOnline, pendingChanges, content, performSave]);

  // 手动保存
  const handleManualSave = useCallback(() => {
    if (content && saveStatus !== 'saving') {
      performSave(content);
    }
  }, [content, saveStatus, performSave]);

  // 格式化时间
  const formatTimeAgo = useCallback((date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}分钟前`;
    } else if (seconds > 30) {
      return `${seconds}秒前`;
    } else {
      return '刚刚';
    }
  }, []);

  // 渲染状态图标
  const renderStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'saved':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Save className="h-4 w-4 text-gray-400" />;
    }
  };

  // 渲染状态文本
  const renderStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return '保存中...';
      case 'saved':
        return '已保存';
      case 'error':
        return '保存失败';
      case 'pending':
        return '有未保存的更改';
      default:
        return '所有更改已保存';
    }
  };

  // 渲染网络状态
  const renderNetworkStatus = () => {
    if (!showNetworkStatus) return null;

    return (
      <div className={`flex items-center space-x-1 ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
        {isOnline ? (
          <>
            <Wifi className="h-3 w-3" />
            <Cloud className="h-3 w-3" />
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            <CloudOff className="h-3 w-3" />
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`flex items-center space-x-3 text-sm ${className}`}>
      {/* 主要状态指示器 */}
      <div 
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
          saveStatus === 'error' 
            ? 'bg-red-50 border border-red-200' 
            : saveStatus === 'saving'
            ? 'bg-blue-50 border border-blue-200'
            : saveStatus === 'saved'
            ? 'bg-green-50 border border-green-200'
            : saveStatus === 'pending'
            ? 'bg-yellow-50 border border-yellow-200'
            : 'bg-gray-50 border border-gray-200'
        }`}
      >
        {renderStatusIcon()}
        <span className={`font-medium ${
          saveStatus === 'error' 
            ? 'text-red-700' 
            : saveStatus === 'saving'
            ? 'text-blue-700'
            : saveStatus === 'saved'
            ? 'text-green-700'
            : saveStatus === 'pending'
            ? 'text-yellow-700'
            : 'text-gray-700'
        }`}>
          {renderStatusText()}
        </span>

        {/* 手动保存按钮 */}
        {(saveStatus === 'pending' || saveStatus === 'error') && (
          <button
            onClick={handleManualSave}
            disabled={!isOnline}
            className={`ml-2 px-2 py-1 text-xs rounded border transition-colors ${
              !isOnline 
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            title={!isOnline ? '离线状态下无法保存' : '立即保存'}
          >
            保存
          </button>
        )}
      </div>

      {/* 网络状态 */}
      {renderNetworkStatus()}

      {/* 最后保存时间 */}
      {showLastSaved && lastSaved && (
        <div className="text-xs text-gray-500">
          最后保存: {formatTimeAgo(lastSaved)}
        </div>
      )}

      {/* 错误信息 */}
      {saveStatus === 'error' && saveError && (
        <div className="text-xs text-red-600 max-w-40 truncate" title={saveError}>
          {saveError}
        </div>
      )}

      {/* 离线提示 */}
      {!isOnline && (
        <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
          离线模式 - 连接后将自动同步
        </div>
      )}

      {/* 待保存更改提示 */}
      {pendingChanges && !isOnline && (
        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-200">
          有 {content.length} 字符待同步
        </div>
      )}
    </div>
  );
};

// Hook for auto-save functionality
export const useAutoSave = (
  content: string,
  saveFunction: (content: string) => Promise<boolean>,
  interval: number = 30000
) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>('');

  const save = useCallback(async () => {
    if (isSaving) return false;

    setIsSaving(true);
    setSaveError('');

    try {
      const success = await saveFunction(content);
      if (success) {
        setLastSaved(new Date());
      } else {
        throw new Error('保存失败');
      }
      return success;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : '保存时发生错误');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [content, saveFunction, isSaving]);

  useEffect(() => {
    if (!content) return;

    const timer = setTimeout(save, interval);
    return () => clearTimeout(timer);
  }, [content, save, interval]);

  return {
    lastSaved,
    isSaving,
    saveError,
    save
  };
};

export default AutoSaveIndicator;