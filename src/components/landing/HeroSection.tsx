import { Button } from '@/components/ui/button';
import { ArrowRight, Play, TrendingUp, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './AnimatedSection';
import heroImage from '@/assets/hero-trading.jpg';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <AnimatedSection direction="up" delay={0}>
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Learn Options Trading Step by Step
              </div>
              
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground">
                Options Trading{' '}
                <span className="text-gradient-primary">Made Clear</span>
              </h1>
              
              <p className="font-body text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Build conceptual clarity first. No guessing, no shortcuts—just structured learning 
                that helps you think like a trader.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg" 
                  className="text-base md:text-lg px-6 md:px-8 gap-2 h-12 md:h-14" 
                  onClick={() => navigate('/register')}
                >
                  Start with the Basics
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base md:text-lg px-6 md:px-8 gap-2 h-12 md:h-14"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play className="h-5 w-5" />
                  How This Course Works
                </Button>
              </div>

              {/* Progress indicators */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <span>3 Structured Levels</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-success" />
                  </div>
                  <span>Learn by Doing</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Hero Image */}
          <AnimatedSection direction="right" delay={200} className="relative hidden lg:block">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
              <img 
                src={heroImage} 
                alt="Options trading education platform showing structured learning paths"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 tactical-card p-4 rounded-xl shadow-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Beginner Level</p>
                  <p className="text-xs text-muted-foreground">Start your journey</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
