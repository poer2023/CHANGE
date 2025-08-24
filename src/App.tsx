import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CreditProvider } from "@/contexts/CreditContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AuthGuard from "@/components/AuthGuard";
import { WritingFlowProvider } from "@/contexts/WritingFlowContext";
import { AppProvider } from "@/state/AppContext";

// 路由级别的代码分割
const SmartHomePage = React.lazy(() => import("./components/SmartHomePage"));
const HomePage = React.lazy(() => import("./pages/HomePage"));
const DocumentsPage = React.lazy(() => import("./pages/DocumentsPage"));
const LibraryPage = React.lazy(() => import("./pages/LibraryPage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const WritingFlowPage = React.lazy(() => import("./pages/WritingFlow/WritingFlowPage"));
const ResultPage = React.lazy(() => import("./pages/ResultPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const SettingsPage = React.lazy(() => import("./pages/SettingsPage"));

// 加载中组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6E5BFF]"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <CreditProvider>
            <AppProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter future={{ 
                  v7_startTransition: true,
                  v7_relativeSplatPath: true 
                }}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Smart Homepage - 根据登录状态智能显示 */}
                      <Route path="/" element={<SmartHomePage />} />
                      
                      {/* Protected Home Page */}
                      <Route path="/home" element={
                        <AuthGuard requireAuth={true}>
                          <HomePage />
                        </AuthGuard>
                      } />
                      
                      {/* Documents Page */}
                      <Route path="/documents" element={
                        <AuthGuard requireAuth={true}>
                          <DocumentsPage />
                        </AuthGuard>
                      } />
                      
                      {/* Library Page */}
                      <Route path="/library" element={
                        <AuthGuard requireAuth={true}>
                          <LibraryPage />
                        </AuthGuard>
                      } />
                      
                      {/* Writing Flow Routes */}
                      <Route path="/writing-flow/*" element={
                        <AuthGuard requireAuth={true}>
                          <WritingFlowProvider>
                            <WritingFlowPage />
                          </WritingFlowProvider>
                        </AuthGuard>
                      } />
                      
                      {/* Result Page */}
                      <Route path="/result" element={
                        <AuthGuard requireAuth={true}>
                          <WritingFlowProvider>
                            <ResultPage />
                          </WritingFlowProvider>
                        </AuthGuard>
                      } />
                      
                      {/* Profile Page */}
                      <Route path="/profile" element={
                        <AuthGuard requireAuth={true}>
                          <ProfilePage />
                        </AuthGuard>
                      } />
                      
                      {/* Settings Page */}
                      <Route path="/settings" element={
                        <AuthGuard requireAuth={true}>
                          <SettingsPage />
                        </AuthGuard>
                      } />
                      
                      {/* 404 Catch-all */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </TooltipProvider>
            </AppProvider>
          </CreditProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;