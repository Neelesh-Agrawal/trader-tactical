import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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
import LevelFinal from "./pages/LevelFinal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();

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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
