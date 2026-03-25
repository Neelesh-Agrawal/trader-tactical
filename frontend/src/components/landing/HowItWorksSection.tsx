import { UserPlus, Clock, Zap, TrendingUp } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';

const learningFlow = [
  { 
    icon: UserPlus, 
    title: 'Sign Up', 
    description: 'Create your account in minutes' 
  },
  { 
    icon: Clock, 
    title: 'Learn at Your Own Pace', 
    description: 'Structured modules with deep clarity' 
  },
  { 
    icon: Zap, 
    title: 'Apply It Practically', 
    description: 'Learn how concepts work in real markets' 
  },
  { 
    icon: TrendingUp, 
    title: 'Level Up', 
    description: 'Unlock higher levels as you progress' 
  }
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
            <h2 className={`${typography.heading.h1} font-display font-bold mb-4 text-foreground`}>
              How <span className="text-success">It Works</span>
            </h2>
            <p className={`${typography.body.lg} font-body text-muted-foreground leading-relaxed`}>
              A clear, structured learning process designed to build real understanding.
            </p>
          </div>
        </AnimatedSection>

        {/* Your Learning Journey */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-success/20 via-success/40 to-success/20 -translate-y-1/2" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {learningFlow.map((item, index) => (
                <AnimatedSection key={item.title} direction="up" delay={150 + index * 100}>
                  <div className="relative group">
                    <div className="tactical-card p-4 md:p-5 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full min-h-[200px] md:min-h-[220px] flex flex-col">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-3 shrink-0">
                        <item.icon className="h-4 w-4 md:h-5 md:w-5 text-success" />
                      </div>
                      <h4 className={`${typography.heading.h5} font-ui font-semibold mb-2 text-foreground`}>{item.title}</h4>
                      <p className={`${typography.body.sm} font-body text-muted-foreground line-clamp-2`}>{item.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
