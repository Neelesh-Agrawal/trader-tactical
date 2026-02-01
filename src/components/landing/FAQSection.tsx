import { HelpCircle } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

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
    <section id="faqs" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Frequently Asked <span className="text-success">Questions</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Common questions from learners just like you.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <AnimatedSection key={faq.question} direction="up" delay={100 + index * 50}>
              <div className="group tactical-card p-5 md:p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-success/30 hover:border-l-success h-full">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                    <HelpCircle className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <h3 className="font-ui font-medium text-foreground mb-2 text-sm md:text-base">
                      "{faq.question}"
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
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
