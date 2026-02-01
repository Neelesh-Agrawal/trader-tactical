import { CheckCircle } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

const reasons = [
  {
    title: 'No Overcomplication',
    description: 'Focus only on what truly drives option prices. Cut through the noise.'
  },
  {
    title: 'Structured Progression',
    description: 'Advance by mastering concepts, not rushing through material.'
  },
  {
    title: 'Learn-by-Doing',
    description: 'Practice that turns understanding into skill you can actually use.'
  },
  {
    title: 'Career Path',
    description: 'Built for real trading readiness, not just certificates.'
  }
];

const stats = [
  { value: '12+', label: 'Modules' },
  { value: '50+', label: 'Lessons' },
  { value: '100%', label: 'Practical' }
];

export const WhyChooseUsSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left Content */}
          <AnimatedSection direction="left" delay={0}>
            <div>
              <span className="font-ui text-sm font-medium text-success uppercase tracking-wider mb-3 block">
                WHY US
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight">
                Because trading deserves{' '}
                <span className="text-success">clarity, not confusion.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We believe education should build confidence, not overwhelm. Every lesson is designed to give you understanding you can trust.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-8">
              {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                    <div className="font-ui text-sm text-muted-foreground">{stat.label}</div>
                    {index < stats.length - 1 && (
                      <div className="hidden" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Right Cards */}
          <AnimatedSection direction="right" delay={100}>
            <div className="grid sm:grid-cols-2 gap-4">
              {reasons.map((reason, index) => (
                <div 
                  key={reason.title} 
                  className="bg-card border border-border rounded-2xl p-5 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <h3 className="font-semibold text-foreground">{reason.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
