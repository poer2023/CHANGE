import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CreditProvider } from "@/contexts/CreditContext";
import AuthGuard from "@/components/AuthGuard";

import AcademicProofWriting from "./pages/AcademicProofWriting";
import HomePage from "./pages/HomePage";
import DocumentsPage from "./pages/DocumentsPage";
import LibraryPage from "./pages/LibraryPage";
import NotFound from "./pages/NotFound";
import WritingFlowPage from "./pages/WritingFlow/WritingFlowPage";
import ResultPage from "./pages/ResultPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { WritingFlowProvider } from "@/contexts/WritingFlowContext";
import { AppProvider } from "@/state/AppContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Routes>
              {/* Homepage */}
              <Route path="/" element={
                <AuthGuard requireAuth={false}>
                  <AcademicProofWriting />
                </AuthGuard>
              } />
              
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
          </BrowserRouter>
          </TooltipProvider>
        </AppProvider>
      </CreditProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;