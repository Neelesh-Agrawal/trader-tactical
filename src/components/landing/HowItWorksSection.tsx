import { Target, BookOpen, AlertTriangle, CheckCircle, HelpCircle, UserPlus, Clock, Zap, TrendingUp } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

const lessonComponents = [
  { icon: Target, label: 'Learning Objective', description: 'Clear goals for each lesson' },
  { icon: BookOpen, label: 'Course Content', description: 'In-depth, structured material' },
  { icon: AlertTriangle, label: 'Common Mistakes', description: 'What to avoid and why' },
  { icon: CheckCircle, label: 'Key Takeaways', description: 'Essential points to remember' },
  { icon: HelpCircle, label: 'Quiz', description: 'Test before moving ahead' }
];

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
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
              How <span className="text-primary">It Works</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              A clear, structured learning process designed to build real understanding.
            </p>
          </div>
        </AnimatedSection>

        {/* Each Lesson Includes */}
        <div className="max-w-4xl mx-auto mb-16">
          <AnimatedSection direction="up" delay={100}>
            <h3 className="font-ui text-lg font-semibold text-center mb-8 text-foreground">
              Each Lesson Includes
            </h3>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {lessonComponents.map((item, index) => (
              <AnimatedSection key={item.label} direction="up" delay={150 + index * 50}>
                <div className="group tactical-card p-4 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-ui text-sm font-medium text-foreground mb-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Learning Flow */}
        <div className="max-w-4xl mx-auto">
          <AnimatedSection direction="up" delay={400}>
            <h3 className="font-ui text-lg font-semibold text-center mb-8 text-foreground">
              Your Learning Journey
            </h3>
          </AnimatedSection>
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -translate-y-1/2" />
            
            <div className="grid md:grid-cols-4 gap-6">
              {learningFlow.map((item, index) => (
                <AnimatedSection key={item.step} direction="up" delay={450 + index * 100}>
                  <div className="relative group">
                    <div className="tactical-card p-6 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg group-hover:scale-110 transition-transform">
                        {item.step}
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-ui font-semibold mb-2 text-foreground">{item.title}</h4>
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
