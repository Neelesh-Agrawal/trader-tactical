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
    modules: 12,
    duration: '4-6 weeks',
    points: [
      'Build Conceptual Clarity – Understand the core concepts behind options trading.',
      'Learn Key Terminology – Master the essential words and phrases used in the market.',
      'Identify Risks and Rewards – Recognize potential gains and pitfalls before placing trades.',
      'Gain Basic Execution Skills – Practice safe beginner-level trades and apply your learning.',
      'Read Option Chains Confidently – Analyze and interpret option data like a pro.',
      'Avoid Common Pitfalls – Learn strategies to prevent mistakes that beginners often make.'
    ],
    cta: 'Start Now'
  },
  {
    id: 'intermediate' as const,
    number: 2,
    title: 'Intermediate',
    status: 'locked',
    modules: 10,
    duration: '6-8 weeks',
    points: [
      'Master Option Strategies – Learn single-leg and multi-leg strategies used in real markets.',
      'Analyse Market Context – Understand volatility, probabilities, and trends to make informed decisions.',
      'Evaluate Risk vs Reward – Assess each trade\'s potential outcomes before committing capital.',
      'Apply Practical Case Studies – Practice with real-life examples to strengthen decision-making.',
      'Build Structured Trading Processes – Develop repeatable frameworks for consistent trading.',
      'Trade with Confidence – Move beyond guessing to disciplined, process-driven execution.'
    ],
    cta: 'Working on it'
  },
  {
    id: 'advanced' as const,
    number: 3,
    title: 'Advanced',
    status: 'locked',
    modules: 8,
    duration: '8-10 weeks',
    points: [
      'Learn Advanced Strategies – Master spreads, hedging techniques, and volatility-based trades.',
      'Manage Risk Effectively – Apply position sizing and capital protection strategies for sustainable trading.',
      'Analyse Complex Market Scenarios – Evaluate multiple factors and market conditions before making decisions.',
      'Simulate Real Trades – Practice advanced trades in a safe, hands-on environment.',
      'Develop Process-Driven Execution – Build a repeatable framework for disciplined and consistent trading.',
      'Trade with Long-Term Focus – Make decisions that prioritise capital preservation and sustainable growth.'
    ],
    cta: 'Working on it'
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
              Your <span className="text-success">Learning Path</span>
            </h2>
            <p className={`${typography.body.lg} font-body text-muted-foreground leading-relaxed`}>
              Progress through three structured levels, mastering concepts before moving forward.
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
