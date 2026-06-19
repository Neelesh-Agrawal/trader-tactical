import { HelpCircle } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';
import { landingFaqConfig } from '@/config/courseConfig';
import { TacticalCard } from '@/components/ui/tactical-card';

export const FAQSection = () => {
  return (
    <section id="faqs" className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
            <h2 className={`${typography.heading.h1} font-display font-bold mb-4 text-foreground`}>
              Frequently Asked <span className="text-success">Questions</span>
            </h2>
            <p className={`${typography.body.lg} font-body text-muted-foreground leading-relaxed`}>
              Common questions from learners just like you.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {landingFaqConfig.map((faq, index) => (
            <AnimatedSection key={faq.question} direction="up" delay={100 + index * 50}>
              <TacticalCard
                borderAccent="success"
                animateHover={true}
                className="p-4 md:p-5"
              >
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                    <HelpCircle className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <h3 className={`${typography.body.md} font-ui font-medium text-foreground mb-2`}>
                      {faq.question}
                    </h3>
                    <p className={`${typography.body.sm} font-body text-muted-foreground leading-relaxed`}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </TacticalCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
