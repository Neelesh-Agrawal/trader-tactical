import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';
import { heroConfig } from '@/config/courseConfig';

const featureIcons = [BookOpen, Target, TrendingUp];

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative overflow-hidden py-12 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <AnimatedSection direction="up" delay={0}>
            <div className="max-w-xl">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-success/10 text-success ${typography.ui.sm} font-ui font-medium mb-5 sm:mb-6 border border-success/20`}>
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                {heroConfig.badge}
              </div>

              <h1 className={`${typography.display.xl} font-display font-bold mb-5 sm:mb-6 leading-tight text-foreground`}>
                {heroConfig.titlePart1}{' '}
                <span className="text-success">{heroConfig.titlePart2}</span>
              </h1>

              <p className={`${typography.body.xl} font-body text-muted-foreground mb-7 sm:mb-8 leading-relaxed`}>
                {heroConfig.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
                <Button 
                  size="lg" 
                  className={`${typography.ui.md} font-ui px-6 sm:px-8 gap-2 h-11 sm:h-12 bg-success hover:bg-success/90 text-white rounded-full`}
                  onClick={() => navigate('/register')}
                >
                  {heroConfig.primaryCTA}
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className={`${typography.ui.md} font-ui px-6 sm:px-8 gap-2 h-11 sm:h-12 rounded-full`}
                  onClick={() => document.getElementById('levels')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {heroConfig.secondaryCTA}
                </Button>
              </div>

              {/* Feature pills */}
              <div className={`flex flex-wrap items-center gap-3 sm:gap-4 ${typography.body.sm} font-body text-muted-foreground`}>
                {heroConfig.features.map((feature, i) => {
                  const Icon = featureIcons[i] || BookOpen;
                  return (
                    <div key={feature} className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-success shrink-0" />
                      <span>{feature}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          {/* Hero Visual - Progress Card */}
          <AnimatedSection direction="right" delay={200} className="relative hidden lg:block">
            {/* Floating card wrapper */}
            <div
              className="max-w-lg ml-auto"
              style={{ animation: 'heroFloat 4s ease-in-out infinite' }}
            >
              <div className="bg-card rounded-xl border border-border shadow-lg p-5">
                {/* Concept Mastered Badge */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0"
                    style={{ animation: 'iconPulse 3s ease-in-out infinite' }}
                  >
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className={`${typography.body.xs} font-ui text-muted-foreground`}>Concept Mastered</p>
                    <p className={`${typography.body.md} font-ui font-semibold text-foreground`}>{heroConfig.mockVisual.concept}</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="relative h-36 mb-5 border border-border/50 rounded-lg bg-muted/20 p-3">
                  <div className={`absolute top-2 right-2 ${typography.body.xs} font-ui text-muted-foreground`}>Call Option</div>
                  <svg className="w-full h-full" viewBox="0 0 200 100">
                    <line x1="0" y1="60" x2="200" y2="60" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1"/>
                    <line x1="100" y1="0" x2="100" y2="100" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1"/>
                    <path
                      d="M 20 70 L 100 70 L 180 20"
                      fill="none"
                      stroke="hsl(var(--success))"
                      strokeWidth="2"
                      strokeDasharray="220"
                      strokeDashoffset="220"
                      style={{ animation: 'drawLine 2s ease-out 0.5s forwards' }}
                    />
                    <circle cx="100" cy="70" r="4" fill="hsl(var(--success))" opacity="0" style={{ animation: 'fadeInDot 0.3s ease-out 1.5s forwards' }}/>
                    <circle cx="160" cy="35" r="4" fill="hsl(var(--success))" opacity="0" style={{ animation: 'fadeInDot 0.3s ease-out 2s forwards' }}/>
                    <text x="100" y="95" textAnchor="middle" fill="currentColor" opacity="0.5" fontSize="10">Strike</text>
                  </svg>
                </div>

                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`${typography.body.sm} font-ui text-muted-foreground`}>Your Progress</span>
                    <span className={`${typography.body.sm} font-ui font-medium`}>{heroConfig.mockVisual.moduleText}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                    <div
                      className="absolute inset-y-0 left-0 bg-success rounded-full"
                      style={{ animation: 'growBar 1.5s ease-out 1s forwards', width: 0 }}
                    />
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
                      <p className={`${typography.body.sm} font-ui font-medium`}>{heroConfig.mockVisual.nextUp}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyframes */}
            <style>{`
              @keyframes heroFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
              }
              @keyframes iconPulse {
                0%, 100% { box-shadow: 0 0 0 0 hsl(var(--success) / 0.2); }
                50% { box-shadow: 0 0 0 6px hsl(var(--success) / 0); }
              }
              @keyframes drawLine {
                to { stroke-dashoffset: 0; }
              }
              @keyframes fadeInDot {
                to { opacity: 1; }
              }
              @keyframes growBar {
                to { width: 25%; }
              }
            `}</style>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
