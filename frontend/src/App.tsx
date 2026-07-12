import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { isAuthRequired } from "@/config/appConfig";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SkipLink } from "@/components/ui/skip-link";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import ForgotPin from "./pages/ForgotPin";
import Dashboard from "./pages/Dashboard";
import Level from "./pages/Level";
import Module from "./pages/Module";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import Certificates from "./pages/Certificates";
import LevelFinal from "./pages/LevelFinal";
import NotFound from "./pages/NotFound";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import RiskDisclosure from "./pages/RiskDisclosure";
import Disclaimer from "./pages/Disclaimer";
import Pricing from "./pages/Pricing";
import PurchaseResult from "./pages/PurchaseResult";
import { WelcomeOfferPopup } from "@/components/landing/WelcomeOfferPopup";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const GA_MEASUREMENT_ID = "G-1MWXLLHFBF";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: pathname + search,
    });
  }, [pathname, search]);

  return null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();

  if (!isAuthRequired()) {
    return <>{children}</>;
  }

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to verification page if email or phone is not verified
  if (profile && (profile.email_verified === false || profile.phone_verified === false)) {
    return <Navigate to="/verify" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <SkipLink />
          <Toaster />
          <Sonner />
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <ScrollToTop />
            <WelcomeOfferPopup />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/verify"
                element={
                  <ProtectedRoute>
                    <Verify />
                  </ProtectedRoute>
                }
              />
              <Route path="/forgot-pin" element={<ForgotPin />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/certificates"
                element={
                  <ProtectedRoute>
                    <Certificates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/level/:levelId"
                element={
                  <ProtectedRoute>
                    <Level />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/level/:levelId/final"
                element={
                  <ProtectedRoute>
                    <LevelFinal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/module/:levelId/:moduleId"
                element={
                  <ProtectedRoute>
                    <Module />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lesson/:levelId/:moduleId/:lessonId"
                element={
                  <ProtectedRoute>
                    <Lesson />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/:quizType/:levelId"
                element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/:quizType/:levelId/:moduleId"
                element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/:quizType/:levelId/:moduleId/:lessonId"
                element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                }
              />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/purchase/result" element={<PurchaseResult />} />
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
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
