import { Quote } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';
import { testimonialsConfig } from '@/config/courseConfig';
import { TacticalCard } from '@/components/ui/tactical-card';

export const TestimonialsSection = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className={`${typography.heading.h1} font-display font-bold mb-4 text-foreground`}>
              What learners <span className="text-success">are saying.</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {testimonialsConfig.map((testimonial, index) => (
            <AnimatedSection key={testimonial.author} direction={index === 0 ? 'left' : 'right'} delay={100 + index * 100}>
              <TacticalCard
                icon={<Quote className="h-5 w-5 text-success" />}
                animateHover={true}
                className="p-6"
              >
                <blockquote className={`${typography.body.lg} font-body text-foreground leading-relaxed mb-5 italic`}>
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <span className="font-ui font-semibold text-sm text-success">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className={`${typography.body.md} font-ui font-semibold text-foreground`}>{testimonial.author}</p>
                    <p className={`${typography.body.sm} font-ui text-muted-foreground`}>{testimonial.role}</p>
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
