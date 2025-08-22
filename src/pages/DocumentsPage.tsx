import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import HomeSidebar from '@/components/Home/HomeSidebar';
import RecentDocuments from '@/components/Home/RecentDocuments';
import InlineSearch from '@/components/Home/InlineSearch';
import UploadDialog from '@/components/Home/UploadDialog';
import { useHomeData } from '@/hooks/useHomeData';
import type { DocItem } from '@/types/home';
import { toast } from 'sonner';

const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const {
    documents,
    filters,
    setFilters,
    updateDocumentStatus,
    removeDocumentAddons
  } = useHomeData();

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
        navigate(`/result?docId=${doc.id}&preview=1`);
        break;
      case 'export':
        // This will be handled by Gate2 dialog
        break;
    }
  };

  const handleGate1Unlock = async (docId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateDocumentStatus(docId, 'generating');
      toast.success('解锁成功！正在生成您的文档...');
    } catch (error) {
      toast.error('支付失败，请重试');
    }
  };

  const handleUploadConfirm = (files: File[]) => {
    setUploadDialogOpen(false);
    toast.success(`已选择 ${files.length} 个文件，正在处理...`);
    navigate('/writing-flow/topic', { state: { uploadedFiles: files } });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <HomeSidebar />
        
        <SidebarInset className="flex-1">
          {/* Main content with surface-alt background */}
          <main className="min-h-screen px-6 md:px-8 py-6 bg-surface-alt">
            <div className="mx-auto max-w-[1200px] space-y-6">
              {/* Header section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-h1 text-text">
                    写作记录
                  </h1>
                  <p className="text-body text-text-muted mt-1">
                    管理您的所有学术写作项目
                  </p>
                </div>
                
                {/* Inline search */}
                <div className="flex-shrink-0">
                  <InlineSearch />
                </div>
              </div>

              {/* Documents list */}
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

export default DocumentsPage;