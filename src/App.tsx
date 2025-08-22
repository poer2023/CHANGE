import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CreditProvider } from "@/contexts/CreditContext";
import AuthGuard from "@/components/AuthGuard";

import AcademicProofWriting from "./pages/AcademicProofWriting";
import NotFound from "./pages/NotFound";
import WritingFlowPage from "./pages/WritingFlow/WritingFlowPage";
import ResultPage from "./pages/ResultPage";
import { WritingFlowProvider } from "@/contexts/WritingFlowContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CreditProvider>
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
            
            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </CreditProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;