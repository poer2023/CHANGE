import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageToggle from '@/components/LanguageToggle';

// Import home components
import HomeSidebar from '@/components/Home/HomeSidebar';
import InlineSearch from '@/components/Home/InlineSearch';
import QuickStartCards from '@/components/Home/QuickStartCards';
import TodoPanels from '@/components/Home/TodoPanels';
import RecentDocuments from '@/components/Home/RecentDocuments';
import UploadDialog from '@/components/Home/UploadDialog';

// Import hooks and data
import { useHomeData } from '@/hooks/useHomeData';
import type { DocItem } from '@/types/home';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    documents,
    filters,
    setFilters,
    todoItems,
    updateDocumentStatus,
    removeDocumentAddons
  } = useHomeData();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if not typing in an input/textarea
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case '/':
          // InlineSearch component handles this
          break;
        case 'n':
        case 'N':
          if (event.metaKey || event.ctrlKey) break; // Allow browser shortcuts
          event.preventDefault();
          navigate('/writing-flow/topic');
          break;
        case 'u':
        case 'U':
          if (event.metaKey || event.ctrlKey) break;
          event.preventDefault();
          setUploadDialogOpen(true);
          break;
        case 'a':
        case 'A':
          if (event.metaKey || event.ctrlKey) break;
          event.preventDefault();
          navigate('/writing-flow/topic?autopilot=1');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Quick actions
  const handleNewDocument = () => {
    navigate('/writing-flow/topic');
  };

  const handleAutopilotMode = () => {
    navigate('/writing-flow/topic?autopilot=1');
  };

  const handleUploadResources = () => {
    setUploadDialogOpen(true);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      navigate(`/documents?q=${encodeURIComponent(term)}`);
    }
  };

  const handleGate1Unlock = async (docId: string) => {
    try {
      // In real app, this would call payment API
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateDocumentStatus(docId, 'generating');
      toast.success(t('home.unlock_success'));
    } catch (error) {
      toast.error(t('home.payment_failed'));
    }
  };

  const handleGate1Preview = (docId: string) => {
    navigate(`/result?docId=${docId}&preview=1`);
  };

  const handleGate2Export = async (docId: string, selectedAddons: string[]) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      removeDocumentAddons(docId);
      toast.success(t('home.purchase_success'));
    } catch (error) {
      toast.error(t('home.purchase_failed'));
    }
  };

  const handleUploadConfirm = (files: File[]) => {
    setUploadDialogOpen(false);
    toast.success(t('home.files_selected').replace('${count}', files.length.toString()));
    // Navigate to writing flow with upload context
    navigate('/writing-flow/topic', { state: { uploadedFiles: files } });
  };

  const handleDocumentAction = (doc: DocItem, action: string) => {
    switch (action) {
      case 'continue':
        navigate(`/writing-flow/topic?draft=${doc.id}`);
        break;
      case 'view':
        navigate(`/result?docId=${doc.id}`);
        break;
      case 'unlock':
        handleGate1Unlock(doc.id);
        break;
      case 'preview':
        handleGate1Preview(doc.id);
        break;
      case 'export':
        // This will be handled by Gate2 dialog
        break;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <HomeSidebar />
        
        <SidebarInset className="flex-1">
          {/* Main content - single layer scrolling with surface-alt background */}
          <main className="min-h-screen px-6 md:px-8 py-6 bg-surface-alt">
            <div className="mx-auto max-w-[1200px] space-y-6">
              {/* Welcome section with inline search */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-h1 text-text">
                    {t('home.welcome_back')}{user?.name}
                  </h1>
                  <p className="text-body text-text-muted mt-1">
                    {t('home.getting_started')}
                  </p>
                </div>
                
                {/* Inline search and language toggle - priority position */}
                <div className="flex-shrink-0 flex items-center gap-4">
                  <InlineSearch />
                  <LanguageToggle />
                </div>
              </div>

              {/* Quick start cards */}
              <QuickStartCards 
                onNewDocument={handleNewDocument}
                onUploadResources={handleUploadResources}
                onAutopilotMode={handleAutopilotMode}
              />

              {/* Todo panels */}
              <TodoPanels 
                todoItems={todoItems}
                onGate1Unlock={handleGate1Unlock}
                onGate1Preview={handleGate1Preview}
                onGate2Export={handleGate2Export}
              />

              {/* Recent documents */}
              <RecentDocuments 
                documents={documents}
                filters={filters}
                onFiltersChange={setFilters}
                onDocumentAction={handleDocumentAction}
              />
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Upload dialog */}
      <UploadDialog 
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onConfirm={handleUploadConfirm}
      />
    </SidebarProvider>
  );
};

export default HomePage;