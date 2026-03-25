import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-12 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <AnimatedSection direction="up" delay={0}>
            <div className="max-w-xl">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-success/10 text-success ${typography.ui.sm} font-ui font-medium mb-5 sm:mb-6 border border-success/20`}>
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Designed for Indian Markets
              </div>
              
              <h1 className={`${typography.display.md} font-display font-bold mb-5 sm:mb-6 leading-tight text-foreground`}>
                Learn Options Trading{' '}
                <span className="text-success">Step by Step</span>
              </h1>
              
              <p className={`${typography.body.lg} font-body text-muted-foreground mb-7 sm:mb-8 leading-relaxed`}>
              A step-by-step learning path built for beginners 
              — no jargon, no confusion, just clarity. And yes, you can actually get hired after this.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
                <Button 
                  size="lg" 
                  className={`${typography.ui.md} font-ui px-6 sm:px-8 gap-2 h-11 sm:h-12 bg-success hover:bg-success/90 text-success-foreground rounded-full`}
                  onClick={() => navigate('/register')}
                >
                  Start with the Basics
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className={`${typography.ui.md} font-ui px-6 sm:px-8 gap-2 h-11 sm:h-12 rounded-full`}
                  onClick={() => document.getElementById('levels')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Levels
                </Button>
              </div>

              {/* Feature pills */}
              <div className={`flex flex-wrap items-center gap-3 sm:gap-4 ${typography.body.sm} font-body text-muted-foreground`}>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-success shrink-0" />
                  <span>Structured Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-success shrink-0" />
                  <span>Concept-First Approach</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success shrink-0" />
                  <span>Career Ready</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Hero Visual - Progress Card */}
          <AnimatedSection direction="right" delay={200} className="relative hidden lg:block">
            <div className="bg-card rounded-xl border border-border shadow-lg p-5 max-w-lg ml-auto">
              {/* Concept Mastered Badge */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className={`${typography.body.xs} font-ui text-muted-foreground`}>Concept Mastered</p>
                  <p className={`${typography.body.md} font-ui font-semibold text-foreground`}>Greeks Basics</p>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="relative h-36 mb-5 border border-border/50 rounded-lg bg-muted/20 p-3">
                <div className={`absolute top-2 right-2 ${typography.body.xs} font-ui text-muted-foreground`}>Call Option</div>
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
                  <span className={`${typography.body.sm} font-ui text-muted-foreground`}>Your Progress</span>
                  <span className={`${typography.body.sm} font-ui font-medium`}>Module 3/12</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 w-1/4 bg-success rounded-full"></div>
                </div>
              </div>

              {/* Next Up */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <Target className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className={`${typography.body.xs} font-ui text-muted-foreground`}>Next Up</p>
                    <p className={`${typography.body.sm} font-ui font-medium`}>Delta Hedging</p>
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
