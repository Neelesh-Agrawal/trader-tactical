import { UserPlus, Clock, Zap, TrendingUp } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

const learningFlow = [
  { 
    step: 1, 
    icon: UserPlus, 
    title: 'Sign Up', 
    description: 'Create your account in minutes' 
  },
  { 
    step: 2, 
    icon: Clock, 
    title: 'Learn at Your Own Pace', 
    description: 'Structured modules with deep clarity' 
  },
  { 
    step: 3, 
    icon: Zap, 
    title: 'Apply It Practically', 
    description: 'Learn how concepts work in real markets' 
  },
  { 
    step: 4, 
    icon: TrendingUp, 
    title: 'Level Up', 
    description: 'Unlock higher levels as you progress' 
  }
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
              How <span className="text-success">It Works</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A clear, structured learning process designed to build real understanding.
            </p>
          </div>
        </AnimatedSection>

        {/* Your Learning Journey */}
        <div className="max-w-4xl mx-auto">
          <AnimatedSection direction="up" delay={100}>
            <h3 className="text-lg font-semibold text-center mb-8 text-foreground">
              Your Learning Journey
            </h3>
          </AnimatedSection>
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-success/20 via-success/40 to-success/20 -translate-y-1/2" />
            
            <div className="grid md:grid-cols-4 gap-6">
              {learningFlow.map((item, index) => (
                <AnimatedSection key={item.step} direction="up" delay={150 + index * 100}>
                  <div className="relative group">
                    <div className="tactical-card p-6 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full">
                      <div className="w-12 h-12 rounded-full bg-success text-success-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg group-hover:scale-110 transition-transform">
                        {item.step}
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-3">
                        <item.icon className="h-5 w-5 text-success" />
                      </div>
                      <h4 className="font-semibold mb-2 text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
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
