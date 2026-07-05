import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';

const FlexibilityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5l4 4-4 4" />
    <path d="M12 5H7a4 4 0 0 0 0 8h1" />
    <path d="M12 19l-4-4 4-4" />
    <path d="M12 19h5a4 4 0 0 0 0-8h-1" />
  </svg>
);

const RiskManagementIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l8 3.5v5C20 16 16.5 20 12 21 7.5 20 4 16 4 11.5v-5L12 3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const StrategicThinkingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4l3 3" />
    <path d="M9.5 3.5C9.5 5 10.5 6 12 6s2.5-1 2.5-2.5" strokeDasharray="2 1" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const CapitalEfficiencyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="17" rx="7" ry="2.5" />
    <ellipse cx="12" cy="13" rx="7" ry="2.5" />
    <path d="M5 13v4" />
    <path d="M19 13v4" />
    <ellipse cx="12" cy="9" rx="7" ry="2.5" />
    <path d="M5 9v4" />
    <path d="M19 9v4" />
    <path d="M12 6.5V3m0 0l-2 2m2-2l2 2" />
  </svg>
);

const learningFlow = [
  {
    icon: FlexibilityIcon,
    title: 'Flexibility',
    description: 'Learn strategies designed for bullish, bearish, and sideways markets.'
  },
  {
    icon: RiskManagementIcon,
    title: 'Risk Management',
    description: 'Understand how experienced traders define and manage risk systematically.'
  },
  {
    icon: StrategicThinkingIcon,
    title: 'Strategic Thinking',
    description: "Successful options trading is built on probability, planning, and structure — not emotional reactions."
  },
  {
    icon: CapitalEfficiencyIcon,
    title: 'Capital Efficiency',
    description: 'Explore market opportunities without always needing large capital exposure.'
  }
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
            <h2 className={`${typography.heading.h1} font-display font-bold mb-4 text-foreground`}>
            Why everyone’s <span className="text-success">learning options?</span>
            </h2>
          </div>
        </AnimatedSection>

        {/* Your Learning Journey */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-success/20 via-success/40 to-success/20 -translate-y-1/2" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 items-stretch">
              {learningFlow.map((item, index) => (
                <AnimatedSection key={item.title} direction="up" delay={150 + index * 100} className="h-full">
                  <div className="relative group h-full">
                    <div className="tactical-card p-4 md:p-5 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-3 shrink-0 text-success">
                        <item.icon />
                      </div>
                      <h4 className={`${typography.heading.h5} font-ui font-semibold mb-2 text-foreground shrink-0`}>{item.title}</h4>
                      <p className={`${typography.body.sm} font-body text-muted-foreground leading-relaxed flex-1`}>{item.description}</p>
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
