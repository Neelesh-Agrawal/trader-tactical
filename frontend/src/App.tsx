import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SkipLink } from "@/components/ui/skip-link";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPin from "./pages/ForgotPin";
import Dashboard from "./pages/Dashboard";
import Level from "./pages/Level";
import Module from "./pages/Module";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import LevelFinal from "./pages/LevelFinal";
import NotFound from "./pages/NotFound";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import RiskDisclosure from "./pages/RiskDisclosure";
import Disclaimer from "./pages/Disclaimer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <SkipLink />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-pin" element={<ForgotPin />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/level/:levelId" element={<Level />} />
              <Route path="/level/:levelId/final" element={<LevelFinal />} />
              <Route path="/module/:levelId/:moduleId" element={<Module />} />
              <Route path="/lesson/:levelId/:moduleId/:lessonId" element={<Lesson />} />
              <Route path="/quiz/:quizType/:levelId" element={<Quiz />} />
              <Route path="/quiz/:quizType/:levelId/:moduleId" element={<Quiz />} />
              <Route path="/quiz/:quizType/:levelId/:moduleId/:lessonId" element={<Quiz />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/risk" element={<RiskDisclosure />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
