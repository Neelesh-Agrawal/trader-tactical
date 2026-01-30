import { CheckCircle, Layers, Zap, Briefcase } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

const reasons = [
  {
    icon: CheckCircle,
    title: 'No Overcomplication',
    description: 'Focus only on what truly drives option prices'
  },
  {
    icon: Layers,
    title: 'Structured Progression',
    description: 'Advance by mastering concepts, not rushing'
  },
  {
    icon: Zap,
    title: 'Learn-by-Doing',
    description: 'Practice that turns understanding into skill'
  },
  {
    icon: Briefcase,
    title: 'Career Path',
    description: 'Built for real trading readiness, not just certificates'
  }
];

export const WhyChooseUsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Why Learners <span className="text-primary">Choose Us</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Because trading deserves clarity, not confusion.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <AnimatedSection key={reason.title} direction="up" delay={100 + index * 75}>
              <div className="group tactical-card p-6 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-success/20 transition-colors">
                  <reason.icon className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-ui font-semibold mb-2 text-foreground">{reason.title}</h3>
                <p className="text-sm text-muted-foreground">{reason.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
