/**
 * 文献管理器主面板
 * 提供文献的增删改查、搜索过滤等功能的UI
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Reference,
  ReferenceType,
  ReferenceSearchQuery,
  ReferenceSearchResult,
  CitationStyle,
  ReferenceManagerSettings
} from '../../types';
import { defaultReferenceManager } from '../../services/reference-manager';
import { ReferenceList } from './ReferenceList';
import { ReferenceEditor } from './ReferenceEditor';
import { SearchFilters } from './SearchFilters';
import { ImportDialog } from './ImportDialog';
import { ExportDialog } from './ExportDialog';
import { CitationInserter } from './CitationInserter';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { Toast } from '../UI/Toast';
import { LoadingSpinner } from '../UI/LoadingSpinner';

interface ReferenceManagerPanelProps {
  paperId?: string;
  onCitationInsert?: (referenceId: string, text: string) => void;
  className?: string;
}

export const ReferenceManagerPanel: React.FC<ReferenceManagerPanelProps> = ({
  paperId,
  onCitationInsert,
  className = ''
}) => {
  // 状态管理
  const [references, setReferences] = useState<Reference[]>([]);
  const [searchResult, setSearchResult] = useState<ReferenceSearchResult | null>(null);
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'search' | 'add' | 'edit'>('list');
  
  // 对话框状态
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showCitationInserter, setShowCitationInserter] = useState(false);
  
  // 搜索相关状态
  const [searchQuery, setSearchQuery] = useState<ReferenceSearchQuery>({});
  const [searchTerm, setSearchTerm] = useState('');

  // 加载文献列表
  const loadReferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allReferences = defaultReferenceManager.getAllReferences();
      setReferences(allReferences);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载文献失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 搜索文献
  const handleSearch = useCallback(async (query: ReferenceSearchQuery) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await defaultReferenceManager.searchReferences(query);
      setSearchResult(result);
      setSearchQuery(query);
      setActiveView('search');
    } catch (err) {
      setError(err instanceof Error ? err.message : '搜索失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 快速搜索
  const handleQuickSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setActiveView('list');
      setSearchResult(null);
      return;
    }

    const query: ReferenceSearchQuery = {
      query: term,
      limit: 50
    };

    await handleSearch(query);
  }, [handleSearch]);

  // 添加文献
  const handleAddReference = useCallback(async (referenceData: Omit<Reference, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);

    try {
      await defaultReferenceManager.addReference(referenceData);
      await loadReferences();
      setActiveView('list');
      setSelectedReference(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加文献失败');
    } finally {
      setIsLoading(false);
    }
  }, [loadReferences]);

  // 更新文献
  const handleUpdateReference = useCallback(async (id: string, updates: Partial<Reference>) => {
    setIsLoading(true);
    setError(null);

    try {
      await defaultReferenceManager.updateReference(id, updates);
      await loadReferences();
      setActiveView('list');
      setSelectedReference(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新文献失败');
    } finally {
      setIsLoading(false);
    }
  }, [loadReferences]);

  // 删除文献
  const handleDeleteReference = useCallback(async (id: string) => {
    if (!confirm('确定要删除这个文献吗？此操作不可撤销。')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await defaultReferenceManager.deleteReference(id);
      await loadReferences();
      if (selectedReference?.id === id) {
        setSelectedReference(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除文献失败');
    } finally {
      setIsLoading(false);
    }
  }, [loadReferences, selectedReference]);

  // 插入引用
  const handleInsertCitation = useCallback(async (referenceId: string, citationText: string) => {
    if (onCitationInsert) {
      onCitationInsert(referenceId, citationText);
      setShowCitationInserter(false);
    }
  }, [onCitationInsert]);

  // 初始化加载
  useEffect(() => {
    loadReferences();
  }, [loadReferences]);

  // 搜索防抖
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleQuickSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, handleQuickSearch]);

  // 渲染主内容
  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">加载中...</span>
        </div>
      );
    }

    switch (activeView) {
      case 'add':
        return (
          <ReferenceEditor
            onSave={handleAddReference}
            onCancel={() => setActiveView('list')}
          />
        );

      case 'edit':
        return selectedReference ? (
          <ReferenceEditor
            reference={selectedReference}
            onSave={(updates) => handleUpdateReference(selectedReference.id, updates)}
            onCancel={() => {
              setActiveView('list');
              setSelectedReference(null);
            }}
          />
        ) : null;

      case 'search':
        return searchResult ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                搜索结果 ({searchResult.total} 条)
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveView('list')}
              >
                返回列表
              </Button>
            </div>
            <ReferenceList
              references={searchResult.references}
              onSelect={setSelectedReference}
              onEdit={(ref) => {
                setSelectedReference(ref);
                setActiveView('edit');
              }}
              onDelete={handleDeleteReference}
              onInsertCitation={paperId ? (ref) => {
                setSelectedReference(ref);
                setShowCitationInserter(true);
              } : undefined}
            />
          </div>
        ) : null;

      case 'list':
      default:
        return (
          <ReferenceList
            references={references}
            onSelect={setSelectedReference}
            onEdit={(ref) => {
              setSelectedReference(ref);
              setActiveView('edit');
            }}
            onDelete={handleDeleteReference}
            onInsertCitation={paperId ? (ref) => {
              setSelectedReference(ref);
              setShowCitationInserter(true);
            } : undefined}
          />
        );
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* 工具栏 */}
      <div className="flex-none border-b border-gray-200 p-4 space-y-4">
        {/* 搜索栏 */}
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索文献..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveView('add')}
          >
            添加文献
          </Button>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={activeView === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveView('list')}
            >
              全部文献 ({references.length})
            </Button>
            <SearchFilters
              onSearch={handleSearch}
              facets={searchResult?.facets}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImportDialog(true)}
            >
              导入
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportDialog(true)}
              disabled={references.length === 0}
            >
              导出
            </Button>
            {paperId && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowCitationInserter(true)}
                disabled={!selectedReference}
              >
                插入引用
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-hidden">
        {renderMainContent()}
      </div>

      {/* 错误提示 */}
      {error && (
        <Toast
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* 对话框 */}
      {showImportDialog && (
        <ImportDialog
          onClose={() => setShowImportDialog(false)}
          onImport={async (importData) => {
            try {
              setIsLoading(true);
              await defaultReferenceManager.importReferences(importData);
              await loadReferences();
              setShowImportDialog(false);
            } catch (err) {
              setError(err instanceof Error ? err.message : '导入失败');
            } finally {
              setIsLoading(false);
            }
          }}
        />
      )}

      {showExportDialog && (
        <ExportDialog
          references={activeView === 'search' ? searchResult?.references || [] : references}
          onClose={() => setShowExportDialog(false)}
        />
      )}

      {showCitationInserter && selectedReference && paperId && (
        <CitationInserter
          reference={selectedReference}
          paperId={paperId}
          onInsert={handleInsertCitation}
          onClose={() => setShowCitationInserter(false)}
        />
      )}
    </div>
  );
};