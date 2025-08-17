import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CreditProvider } from "@/contexts/CreditContext";
import AuthGuard from "@/components/AuthGuard";
import Index from "./pages/Index";
import EssayForm from "./pages/EssayForm";
import EssayEditor from "./pages/EssayEditor";
import KnowledgeBase from "./pages/KnowledgeBase";
import History from "./pages/History";
import TopUp from "./pages/TopUp";
import TopUpNew from "./pages/TopUpNew";
import UsageHistory from "./pages/UsageHistory";
import UserProfile from "./pages/UserProfile";
import AIDetection from "./pages/AIDetection";
import PlagiarismDetection from "./pages/PlagiarismDetection";
import DetectionHistory from "./pages/DetectionHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CreditProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <AuthGuard requireAuth={false}>
                <Index />
              </AuthGuard>
            } />
            <Route path="/form" element={
              <AuthGuard requireAuth={true}>
                <EssayForm />
              </AuthGuard>
            } />
            <Route path="/essay-editor" element={
              <AuthGuard requireAuth={true}>
                <EssayEditor />
              </AuthGuard>
            } />
            <Route path="/essay-editor/:articleId" element={
              <AuthGuard requireAuth={true}>
                <EssayEditor />
              </AuthGuard>
            } />
            <Route path="/knowledge" element={
              <AuthGuard requireAuth={true}>
                <KnowledgeBase />
              </AuthGuard>
            } />
            <Route path="/history" element={
              <AuthGuard requireAuth={true}>
                <History />
              </AuthGuard>
            } />
            <Route path="/topup" element={
              <AuthGuard requireAuth={true}>
                <TopUpNew />
              </AuthGuard>
            } />
            <Route path="/usage-history" element={
              <AuthGuard requireAuth={true}>
                <UsageHistory />
              </AuthGuard>
            } />
            <Route path="/user-profile" element={
              <AuthGuard requireAuth={true}>
                <UserProfile />
              </AuthGuard>
            } />
            <Route path="/detect/ai" element={
              <AuthGuard requireAuth={true}>
                <AIDetection />
              </AuthGuard>
            } />
            <Route path="/detect/plagiarism" element={
              <AuthGuard requireAuth={true}>
                <PlagiarismDetection />
              </AuthGuard>
            } />
            <Route path="/detect/history" element={
              <AuthGuard requireAuth={true}>
                <DetectionHistory />
              </AuthGuard>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </CreditProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
