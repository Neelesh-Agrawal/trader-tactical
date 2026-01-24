import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Flame, Target, Shield, TrendingUp } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mono text-muted-foreground">INITIALIZING...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-success/5" />
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="caption text-primary mb-4 flex items-center justify-center gap-2">
              <Target className="h-4 w-4" />
              TACTICAL OPTIONS EDUCATION
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Master Options Trading
              <span className="text-gradient-primary block">Like a Pro</span>
            </h1>
            
            <p className="prose-body text-muted-foreground mb-10 max-w-2xl mx-auto">
              Transform from confusion to confident execution. Our immersive, skill-based 
              program teaches you to think like a professional trader.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <a href="/register">Start Your Mission</a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <a href="/login">Continue Training</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="tactical-card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-bold mb-3">Progressive Learning</h3>
            <p className="text-muted-foreground">
              Master concepts step-by-step from basics to advanced strategies
            </p>
          </div>
          
          <div className="tactical-card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-6">
              <Flame className="h-8 w-8 text-warning" />
            </div>
            <h3 className="text-xl font-bold mb-3">Daily Streaks</h3>
            <p className="text-muted-foreground">
              Build consistent habits with our streak system and rewards
            </p>
          </div>
          
          <div className="tactical-card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Rigorous Assessment</h3>
            <p className="text-muted-foreground">
              Prove your knowledge with anti-cheat quizzes and 80% pass rate
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mono text-sm">TRADEMASTER © 2024 — OPTIONS EDUCATION PLATFORM</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
