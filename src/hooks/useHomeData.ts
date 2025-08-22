import { useState, useEffect, useMemo } from 'react';
import type { DocItem, HomeFilters, TodoCounts, DocStatus, Addon } from '@/types/home';
import { mockDocuments } from '@/lib/mockHomeData';

interface TodoItems {
  gate1: DocItem[];
  gate2: DocItem[];
  retry: DocItem[]; // For failed documents (empty for now)
}

export function useHomeData() {
  const [documents, setDocuments] = useState<DocItem[]>(mockDocuments);
  const [filters, setFilters] = useState<HomeFilters>({
    status: 'all',
    search: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    view: 'table'
  });

  // Update document status
  const updateDocumentStatus = (docId: string, newStatus: DocStatus) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const updatedDoc = { ...doc, status: newStatus, updatedAt: new Date().toISOString() };
        
        // Clear relevant properties based on status
        if (newStatus !== 'gate1') {
          delete updatedDoc.lockExpireAt;
        }
        if (newStatus !== 'addon') {
          delete updatedDoc.missingAddons;
        }
        
        return updatedDoc;
      }
      return doc;
    }));
  };

  // Remove addons from document (after purchase)
  const removeDocumentAddons = (docId: string, addonsToRemove?: Addon[]) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        if (!addonsToRemove) {
          // Remove all addons
          const { missingAddons, ...rest } = doc;
          return { ...rest, status: 'ready' as DocStatus, updatedAt: new Date().toISOString() };
        } else {
          // Remove specific addons
          const remainingAddons = doc.missingAddons?.filter(addon => !addonsToRemove.includes(addon)) || [];
          return {
            ...doc,
            missingAddons: remainingAddons.length > 0 ? remainingAddons : undefined,
            status: remainingAddons.length > 0 ? 'addon' : 'ready',
            updatedAt: new Date().toISOString()
          };
        }
      }
      return doc;
    }));
  };

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(doc => doc.status === filters.status);
    }

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm)
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let aValue: any = a[filters.sortBy];
      let bValue: any = b[filters.sortBy];

      // Handle date sorting
      if (filters.sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [documents, filters]);

  // Get todo items
  const todoItems = useMemo((): TodoItems => {
    const gate1Docs = documents.filter(doc => doc.status === 'gate1');
    const gate2Docs = documents.filter(doc => doc.status === 'addon');
    const retryDocs: DocItem[] = []; // Placeholder for failed documents

    return {
      gate1: gate1Docs,
      gate2: gate2Docs,
      retry: retryDocs
    };
  }, [documents]);

  // Get todo counts
  const todoCounts = useMemo((): TodoCounts => ({
    gate1: todoItems.gate1.length,
    gate2: todoItems.gate2.length,
    retry: todoItems.retry.length
  }), [todoItems]);

  // Update countdown timers for gate1 items
  useEffect(() => {
    const interval = setInterval(() => {
      setDocuments(prev => prev.map(doc => {
        if (doc.status === 'gate1' && doc.lockExpireAt) {
          const now = new Date().getTime();
          const expiry = new Date(doc.lockExpireAt).getTime();
          
          // If expired, we keep the document as is but UI will show "已过期"
          // The actual status change would be handled by business logic
          
          return doc;
        }
        return doc;
      }));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return {
    documents: filteredDocuments,
    allDocuments: documents,
    filters,
    setFilters,
    todoItems,
    todoCounts,
    updateDocumentStatus,
    removeDocumentAddons
  };
}