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
          <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <span className="subheader text-sm sm:text-base">FAQs</span>
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`faq-${index}`}
              className="border border-border rounded-lg px-3 sm:px-4 data-[state=open]:bg-muted/30"
            >
              <AccordionTrigger className="text-left hover:text-primary hover:no-underline py-3 sm:py-4 text-sm sm:text-base touch-manipulation">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-3 sm:pb-4 text-sm sm:text-base">
                <div
                  className="lesson-content ck-content"
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
