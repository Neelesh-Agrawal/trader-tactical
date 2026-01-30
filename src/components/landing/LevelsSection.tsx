import { Button } from '@/components/ui/button';
import { Star, Crown, Award, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './AnimatedSection';

const levels = [
  {
    id: 'beginner',
    number: 1,
    title: 'Beginner',
    status: 'active',
    icon: Star,
    color: 'primary',
    description: 'Master the fundamentals of derivatives trading in the Indian market. Learn futures, options, terminology, pricing, risk management, and realistic profit expectations—before trading real money.',
    cta: 'Start Now'
  },
  {
    id: 'intermediate',
    number: 2,
    title: 'Intermediate',
    status: 'locked',
    icon: Crown,
    color: 'warning',
    description: 'Dive deeper into advanced strategies, Greeks analysis, volatility trading, and position management techniques used by professional traders.',
    cta: 'Working on it'
  },
  {
    id: 'advanced',
    number: 3,
    title: 'Advanced',
    status: 'locked',
    icon: Award,
    color: 'success',
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
              Your <span className="text-primary">Learning Path</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Progress through three structured levels, mastering concepts before moving forward.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {levels.map((level, index) => {
            const isLocked = level.status === 'locked';
            const colorClass = level.color === 'primary' ? 'text-primary' : level.color === 'warning' ? 'text-warning' : 'text-success';
            const bgClass = level.color === 'primary' ? 'bg-primary/10' : level.color === 'warning' ? 'bg-warning/10' : 'bg-success/10';
            
            return (
              <AnimatedSection key={level.id} direction="up" delay={100 + index * 100}>
                <div 
                  className={`relative tactical-card p-6 md:p-8 rounded-2xl transition-all duration-300 h-full ${
                    isLocked ? 'opacity-60' : 'hover:-translate-y-1 hover:shadow-lg'
                  } ${level.status === 'active' ? 'ring-2 ring-primary/30' : ''}`}
                >
                  {/* Level indicator */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center ${isLocked ? 'blur-[1px]' : ''}`}>
                      <level.icon className={`h-6 w-6 ${colorClass}`} />
                    </div>
                    {isLocked && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                        <Lock className="h-3 w-3" />
                        Locked
                      </div>
                    )}
                    {level.status === 'active' && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Active
                      </div>
                    )}
                  </div>

                  <div className="caption text-muted-foreground mb-1">LEVEL {level.number}</div>
                  <h3 className={`font-ui text-xl font-semibold mb-3 ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {level.title}
                  </h3>
                  <p className={`font-body text-sm leading-relaxed mb-6 ${isLocked ? 'blur-[2px]' : 'text-muted-foreground'}`}>
                    {level.description}
                  </p>

                  <Button 
                    className="w-full gap-2" 
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
