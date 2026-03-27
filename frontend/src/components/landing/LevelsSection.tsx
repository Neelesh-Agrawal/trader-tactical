import { Button } from '@/components/ui/button';
import { CheckCircle, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './AnimatedSection';
import { getLevelColorScheme, typography } from '@/design-system';

const levels = [
  {
    id: 'beginner' as const,
    number: 1,
    title: 'Beginner',
    status: 'active',
    modules: 6,
    duration: '6-10 weeks',
    points: [
      'Go from “What’s an option?” to placing real trades with clarity. No panic, no guessing — just simple rules you understand.'
    ],
    cta: 'Start Now'
  },
  {
    id: 'intermediate' as const,
    number: 2,
    title: 'Intermediate',
    status: 'locked',
    points: [
      'Move beyond guessing direction and start thinking in probabilities. Trade more consistently while managing risk the right way.'
    ],
    cta: 'Coming soon'
  },
  {
    id: 'advanced' as const,
    number: 3,
    title: 'Advanced',
    status: 'locked',
    points: [
      'Start thinking like a pro — not just trading, but understanding the market deeply. Build a clear, repeatable approach you can trust.'
    ],
    cta: 'Coming soon'
  }
];

export const LevelsSection = () => {
  const navigate = useNavigate();

  return (
    <section id="levels" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
            <h2 className={`${typography.heading.h1} font-display font-bold mb-4 text-foreground`}>
            No more random YouTube learning <span className="text-success">Just a clear path</span>
            </h2>
            <p className={`${typography.body.lg} font-body text-muted-foreground leading-relaxed`}>
            Three clear levels. Learn it. Master it. Then move forward.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {levels.map((level, index) => {
            const isLocked = level.status === 'locked';
            const isActive = level.status === 'active';
            const colorScheme = getLevelColorScheme(level.id);
            
            return (
              <AnimatedSection key={level.id} direction="up" delay={100 + index * 100}>
                <div 
                  className={`relative bg-card border rounded-xl p-5 sm:p-6 transition-all duration-300 h-full ${
                    isLocked ? 'opacity-75 border-border' : 'hover:-translate-y-1'
                  }`}
                  style={{
                    borderColor: !isLocked ? colorScheme.border : undefined
                  }}
                >
                  {/* Sparkle icon for active */}
                  {isActive && (
                    <div 
                      className="absolute -top-3 -right-3 w-10 h-10 rounded-xl flex items-center justify-center rotate-12"
                      style={{ backgroundColor: colorScheme.primary }}
                    >
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="flex items-center justify-between mb-4">
                    {isActive ? (
                      <div 
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-ui font-medium"
                        style={{
                          backgroundColor: colorScheme.light,
                          color: colorScheme.text,
                          borderWidth: '1px',
                          borderColor: colorScheme.border
                        }}
                      >
                        <CheckCircle className="h-3 w-3" />
                        Available Now
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-ui font-medium">
                        <Lock className="h-3 w-3" />
                        Coming Soon
                      </div>
                    )}
                    <span className={`${typography.ui.sm} font-ui text-muted-foreground`}>Level {level.number}</span>
                  </div>

                  {/* Title */}
                  <h3 className={`${typography.heading.h3} font-display font-bold mb-3 ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {level.title}
                  </h3>

                  {/* Description */}
                  <ul className={`${typography.body.sm} font-body leading-relaxed mb-6 space-y-2 list-disc pl-4 ${isLocked ? 'text-muted-foreground/80' : 'text-muted-foreground'}`}>
                    {level.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>

                  {/* Stats */}
                  <div className={`flex items-center gap-6 mb-6 ${typography.body.sm} font-ui`}>
                    <div>
                      <span className="text-muted-foreground">Modules</span>
                      <p className={`font-semibold font-mono ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>{level.modules}</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                      <span className="text-muted-foreground">Duration</span>
                      <p className={`font-semibold ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>{level.duration}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button 
                    className="w-full gap-2 rounded-full font-ui"
                    style={isActive && !isLocked ? {
                      backgroundColor: colorScheme.primary,
                      color: 'white'
                    } : undefined}
                    variant={isLocked ? 'outline' : 'default'}
                    disabled={isLocked}
                    onClick={() => !isLocked && navigate('/register')}
                  >
                    {isLocked ? level.cta : (
                      <>
                        {level.cta}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};
