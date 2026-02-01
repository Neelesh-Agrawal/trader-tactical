import { Button } from '@/components/ui/button';
import { CheckCircle, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './AnimatedSection';

const levels = [
  {
    id: 'beginner',
    number: 1,
    title: 'Beginner',
    status: 'active',
    modules: 12,
    duration: '4-6 weeks',
    description: 'Master the fundamentals of derivatives trading in the Indian market. Learn futures, options, terminology, pricing, risk management, and realistic profit expectations—before trading real money.',
    cta: 'Start Now'
  },
  {
    id: 'intermediate',
    number: 2,
    title: 'Intermediate',
    status: 'locked',
    modules: 10,
    duration: '6-8 weeks',
    description: 'Dive deeper into advanced strategies, Greeks analysis, volatility trading, and position management techniques used by professional traders.',
    cta: 'Working on it'
  },
  {
    id: 'advanced',
    number: 3,
    title: 'Advanced',
    status: 'locked',
    modules: 8,
    duration: '8-10 weeks',
    description: 'Professional-level techniques including portfolio management, algorithmic strategies, and live market simulations to prepare you for real trading.',
    cta: 'Working on it'
  }
];

export const LevelsSection = () => {
  const navigate = useNavigate();

  return (
    <section id="levels" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Your <span className="text-success">Learning Path</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Progress through three structured levels, mastering concepts before moving forward.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {levels.map((level, index) => {
            const isLocked = level.status === 'locked';
            const isActive = level.status === 'active';
            
            return (
              <AnimatedSection key={level.id} direction="up" delay={100 + index * 100}>
                <div 
                  className={`relative bg-card border rounded-2xl p-6 transition-all duration-300 h-full ${
                    isLocked ? 'opacity-70 border-border' : 'hover:-translate-y-1 hover:shadow-lg border-success/30'
                  }`}
                >
                  {/* Sparkle icon for active */}
                  {isActive && (
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-success flex items-center justify-center rotate-12">
                      <Sparkles className="h-5 w-5 text-success-foreground" />
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="flex items-center justify-between mb-4">
                    {isActive ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20">
                        <CheckCircle className="h-3 w-3" />
                        Available Now
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                        <Lock className="h-3 w-3" />
                        Coming Soon
                      </div>
                    )}
                    <span className="text-sm text-muted-foreground">Level {level.number}</span>
                  </div>

                  {/* Title */}
                  <h3 className={`font-display text-2xl font-bold mb-3 ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {level.title}
                  </h3>

                  {/* Description */}
                  <p className={`font-body text-sm leading-relaxed mb-6 ${isLocked ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                    {level.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Modules</span>
                      <p className={`font-semibold ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>{level.modules}</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                      <span className="text-muted-foreground">Duration</span>
                      <p className={`font-semibold ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>{level.duration}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button 
                    className={`w-full gap-2 rounded-full ${isActive ? 'bg-success hover:bg-success/90 text-success-foreground' : ''}`}
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
