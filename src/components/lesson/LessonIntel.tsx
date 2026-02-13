import { BookOpen } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { ConceptCard } from './ConceptCard';

interface LessonIntelProps {
  content: string;
}

export const LessonIntel = ({ content }: LessonIntelProps) => {
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  const renderFormattedText = (text: string) => {
    return text.split('**').map((part, i) => 
      i % 2 === 1 ? <strong key={i} className="text-primary font-semibold">{part}</strong> : part
    );
  };

  const renderContent = () => {
    return paragraphs.map((paragraph, index) => {
      // Headers (bold text)
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <AnimatedSection key={index} delay={index * 50}>
            <h3 className="font-ui text-lg sm:text-xl font-semibold mt-8 sm:mt-12 mb-3 sm:mb-4 text-foreground">
              {paragraph.replace(/\*\*/g, '')}
            </h3>
          </AnimatedSection>
        );
      }
      
      // Check for concept cards (lines starting with specific patterns)
      if (paragraph.includes('**1.') || paragraph.includes('**2.') || paragraph.includes('**3.')) {
        return (
          <AnimatedSection key={index} delay={index * 50}>
            <ConceptCard variant="info">
              {renderFormattedText(paragraph)}
            </ConceptCard>
          </AnimatedSection>
        );
      }

      // First paragraph slightly larger
      const isFirstParagraph = index === 0 || (index === 1 && paragraphs[0].startsWith('**'));
      
      return (
        <AnimatedSection key={index} delay={index * 50}>
          <p 
            className={`font-body text-foreground/90 leading-relaxed mb-4 sm:mb-6 ${isFirstParagraph ? 'text-base sm:text-lg' : 'text-base'}`}
          >
            {renderFormattedText(paragraph)}
          </p>
        </AnimatedSection>
      );
    });
  };

  return (
    <div className="tactical-card p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 content-depth">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        <span className="subheader text-sm sm:text-base">Intel</span>
      </div>
      <div className="lesson-content space-y-2">
        {renderContent()}
      </div>
    </div>
  );
};
