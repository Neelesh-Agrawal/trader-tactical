import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Illustration */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Compass className="h-12 w-12 text-primary" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Button>
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/register")}>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
