import { HelpCircle } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';

const faqs = [
  {
    question: "I'm completely new to options. Is this too advanced for me?",
    answer: "No. The Beginner Level starts from absolute basics—no prior experience required."
  },
  {
    question: "Will this feel like boring theory?",
    answer: "No. Concepts are taught through logic, examples, and real market context."
  },
  {
    question: "How much time will I need to commit?",
    answer: "Each level typically takes 6–8 weeks, and you can learn at your own pace."
  },
  {
    question: "Can I really learn without rushing?",
    answer: "Yes. You move forward only after understanding—not by speed."
  },
  {
    question: "Do I get any certification?",
    answer: "Yes. You receive a certification after completing each level."
  },
  {
    question: "Can this actually help me get a job?",
    answer: "Top performers from the Advanced Level may be considered for roles on our trading desk."
  }
];

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
          {faqs.map((faq, index) => (
            <AnimatedSection key={faq.question} direction="up" delay={100 + index * 50}>
              <div className="group tactical-card p-4 md:p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-success/30 hover:border-l-success h-full">
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
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
