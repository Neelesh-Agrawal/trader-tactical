import { Lightbulb, Layers, Brain, GraduationCap } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';

const features = [
  {
    icon: Lightbulb,
    title: 'You watch videos but still feel confused.',
    description: 'Content alone is not enough when the fundamentals are unclear.'
  },
  {
    icon: Layers,
    title: 'You hesitate before every trade.',
    description: 'Confidence drops when decision-making is not systematic.'
  },
  {
    icon: Brain,
    title: "You feel like you're guessing, not trading.",
    description: 'Without a framework, every entry and exit feels random.'
  },
  {
    icon: GraduationCap,
    title: "You understand theory... but can't apply it.",
    description: 'Practical execution is where most beginners get stuck.'
  }
];

export const AboutSection = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
            <span className={`${typography.ui.sm} font-ui font-medium text-success uppercase tracking-wider mb-3 block`}>
              THE APPROACH
            </span>
            <h2 className={`${typography.heading.h1} font-display font-bold mb-4 text-foreground`}>
              If this feels like you... you're in the right place
            </h2>
            <p className={`${typography.body.lg} font-body text-muted-foreground leading-relaxed`}>
              You're not alone - this is where most beginners get stuck. This is exactly what we fix.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} direction="up" delay={100 + index * 75}>
              <div className="group bg-card border border-border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-success" />
                </div>
                <h3 className={`${typography.heading.h5} font-ui font-semibold mb-2 text-foreground`}>{feature.title}</h3>
                <p className={`${typography.body.sm} font-body text-muted-foreground leading-relaxed`}>{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
