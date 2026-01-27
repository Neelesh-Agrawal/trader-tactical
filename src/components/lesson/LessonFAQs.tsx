import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

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
      <div className="tactical-card p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-primary" />
          <span className="subheader">Recon (FAQs)</span>
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`faq-${index}`}
              className="border border-border rounded-lg px-4 data-[state=open]:bg-muted/30"
            >
              <AccordionTrigger className="text-left hover:text-primary hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AnimatedSection>
  );
};
