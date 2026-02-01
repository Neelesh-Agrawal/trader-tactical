import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './AnimatedSection';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <AnimatedSection direction="up" delay={0}>
            <div className="max-w-xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium mb-6 border border-success/20">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Designed for Indian Markets
              </div>
              
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground">
                Learn Options Trading{' '}
                <span className="text-success">Step by Step</span>
              </h1>
              
              <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
                No shortcuts. No guesswork. Build real understanding with structured learning 
                that takes you from basics to professional-level trading.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button 
                  size="lg" 
                  className="text-base px-8 gap-2 h-12 bg-success hover:bg-success/90 text-success-foreground rounded-full" 
                  onClick={() => navigate('/register')}
                >
                  Start with the Basics
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base px-8 gap-2 h-12 rounded-full"
                  onClick={() => document.getElementById('levels')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Levels
                </Button>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-success" />
                  <span>Structured Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-success" />
                  <span>Concept-First Approach</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span>Career Ready</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Hero Visual - Progress Card */}
          <AnimatedSection direction="right" delay={200} className="relative hidden lg:block">
            <div className="bg-card rounded-2xl border border-border shadow-xl p-6 max-w-md ml-auto">
              {/* Concept Mastered Badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Concept Mastered</p>
                  <p className="font-semibold text-foreground">Greeks Basics</p>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="relative h-40 mb-6 border border-border/50 rounded-xl bg-muted/20 p-4">
                <div className="absolute top-2 right-2 text-xs text-muted-foreground">Call Option</div>
                <svg className="w-full h-full" viewBox="0 0 200 100">
                  <line x1="0" y1="60" x2="200" y2="60" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1"/>
                  <line x1="100" y1="0" x2="100" y2="100" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1"/>
                  <path d="M 20 70 L 100 70 L 180 20" fill="none" stroke="hsl(var(--success))" strokeWidth="2"/>
                  <circle cx="100" cy="70" r="4" fill="hsl(var(--success))"/>
                  <circle cx="160" cy="35" r="4" fill="hsl(var(--success))"/>
                  <text x="100" y="95" textAnchor="middle" fill="currentColor" opacity="0.5" fontSize="10">Strike</text>
                </svg>
              </div>

              {/* Progress Section */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Your Progress</span>
                  <span className="text-sm font-medium">Module 3/12</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              {/* Next Up */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <Target className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Next Up</p>
                    <p className="text-sm font-medium">Delta Hedging</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
