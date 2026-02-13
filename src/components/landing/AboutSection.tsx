import { Lightbulb, Layers, Brain, GraduationCap } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';

const features = [
  {
    icon: Lightbulb,
    title: 'Break Complex Concepts',
    description: 'Transform intimidating topics into simple, digestible ideas you can truly understand.'
  },
  {
    icon: Layers,
    title: "Teach the 'Why'",
    description: 'Go beyond surface-level knowledge to understand why strategies work.'
  },
  {
    icon: Brain,
    title: 'Think Like a Trader',
    description: 'Build the mental framework that separates professionals from guessers.'
  },
  {
    icon: GraduationCap,
    title: 'Professional Readiness',
    description: 'Prepare for real trading with structured, practical knowledge.'
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
              What This Course Is Really About
            </h2>
            <p className={`${typography.body.lg} font-body text-muted-foreground leading-relaxed`}>
              No fluff. No shortcuts. Just clear, structured education that builds real understanding from the ground up.
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
