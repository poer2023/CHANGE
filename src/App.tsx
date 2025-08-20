import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CreditProvider } from "@/contexts/CreditContext";
import AuthGuard from "@/components/AuthGuard";

import EssayForm from "./pages/EssayForm";
import EssayEditor from "./pages/EssayEditor";
import ProgressiveFormPage from "./pages/ProgressiveFormPage";
import KnowledgeBase from "./pages/KnowledgeBase";
import History from "./pages/History";
import TopUp from "./pages/TopUp";
import TopUpNew from "./pages/TopUpNew";
import UsageHistory from "./pages/UsageHistory";
import UserProfile from "./pages/UserProfile";
import AIDetection from "./pages/AIDetection";
import PlagiarismDetection from "./pages/PlagiarismDetection";
import DetectionHistory from "./pages/DetectionHistory";
import EssayHomePage from "./pages/EssayHomePage";
import EssayAnalysisPage from "./pages/EssayAnalysisPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import ServiceConfirmation from "./pages/ServiceConfirmation";
import PaymentDemo from "./pages/PaymentDemo";
import PaymentSuccess from "./pages/PaymentSuccess";
import OrderTracking from "./pages/OrderTracking";
import DeliveryComplete from "./pages/DeliveryComplete";
import QualityReport from "./pages/QualityReport";
import CustomerService from "./pages/CustomerService";
import DeliveryReport from "./pages/DeliveryReport";
import AcademicProofWriting from "./pages/AcademicProofWriting";
import NotFound from "./pages/NotFound";

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
            <Route path="/" element={
              <AuthGuard requireAuth={false}>
                <AcademicProofWriting />
              </AuthGuard>
            } />
            <Route path="/form" element={
              <AuthGuard requireAuth={true}>
                <EssayForm />
              </AuthGuard>
            } />
            <Route path="/progressive-form" element={
              <AuthGuard requireAuth={true}>
                <ProgressiveFormPage />
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
                <TopUp />
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
            <Route path="/essay-home" element={
              <AuthGuard requireAuth={false}>
                <EssayHomePage />
              </AuthGuard>
            } />
            <Route path="/essay-analysis" element={
              <AuthGuard requireAuth={false}>
                <EssayAnalysisPage />
              </AuthGuard>
            } />
            <Route path="/order-confirmation" element={
              <AuthGuard requireAuth={false}>
                <OrderConfirmation />
              </AuthGuard>
            } />
            <Route path="/service-confirmation" element={
              <AuthGuard requireAuth={false}>
                <ServiceConfirmation />
              </AuthGuard>
            } />
            <Route path="/payment-demo" element={
              <AuthGuard requireAuth={false}>
                <PaymentDemo />
              </AuthGuard>
            } />
            <Route path="/payment-success" element={
              <AuthGuard requireAuth={false}>
                <PaymentSuccess />
              </AuthGuard>
            } />
            <Route path="/order-tracking" element={
              <AuthGuard requireAuth={true}>
                <OrderTracking />
              </AuthGuard>
            } />
            <Route path="/order-tracking/:orderId" element={
              <AuthGuard requireAuth={true}>
                <OrderTracking />
              </AuthGuard>
            } />
            <Route path="/delivery-complete" element={
              <AuthGuard requireAuth={false}>
                <DeliveryComplete />
              </AuthGuard>
            } />
            <Route path="/delivery-complete/:orderId" element={
              <AuthGuard requireAuth={false}>
                <DeliveryComplete />
              </AuthGuard>
            } />
            <Route path="/quality-report" element={
              <AuthGuard requireAuth={false}>
                <QualityReport />
              </AuthGuard>
            } />
            <Route path="/quality-report/:orderId" element={
              <AuthGuard requireAuth={false}>
                <QualityReport />
              </AuthGuard>
            } />
            <Route path="/customer-service" element={
              <AuthGuard requireAuth={false}>
                <CustomerService />
              </AuthGuard>
            } />
            <Route path="/delivery-report" element={
              <AuthGuard requireAuth={true}>
                <DeliveryReport />
              </AuthGuard>
            } />
            <Route path="/delivery-report/:orderId" element={
              <AuthGuard requireAuth={true}>
                <DeliveryReport />
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
