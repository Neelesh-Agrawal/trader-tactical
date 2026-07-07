import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import { normalizeRichHtml } from './html';

interface FAQ {
  question: string;
  answer: string;
}

interface LessonFAQsProps {
  faqs: FAQ[];
}

export const LessonFAQs = ({ faqs }: LessonFAQsProps) => {
  if (faqs.length === 0) return null;

  return (
    <AnimatedSection>
      <div className="tactical-card p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <HelpCircle className="h-5 w-5 shrink-0 text-primary" />
          <h2 className="subheader text-[17px] md:text-[18px]">FAQs</h2>
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="border border-border rounded-lg px-3 sm:px-4 data-[state=open]:bg-muted/30"
            >
              <AccordionTrigger className="font-sans text-left font-medium hover:text-primary hover:no-underline py-3 sm:py-4 text-[15px] md:text-[16px] leading-relaxed touch-manipulation">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-sans text-[15px] md:text-[16px] leading-[1.7] text-muted-foreground pb-3 sm:pb-4">
                <div
                  className="lesson-content ck-content faq-answer-content"
                  dangerouslySetInnerHTML={{ __html: normalizeRichHtml(faq.answer) }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AnimatedSection>
  );
};
