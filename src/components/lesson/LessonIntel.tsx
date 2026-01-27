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
            <h3 className="font-ui text-xl font-semibold mt-12 mb-4 text-foreground">
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
            className={`font-body text-foreground/90 leading-relaxed mb-6 ${isFirstParagraph ? 'text-lg' : 'text-base md:text-lg'}`}
            style={{ lineHeight: '1.75' }}
          >
            {renderFormattedText(paragraph)}
          </p>
        </AnimatedSection>
      );
    });
  };

  return (
    <div className="tactical-card p-6 md:p-8 mb-8 content-depth">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-5 w-5 text-primary" />
        <span className="subheader">Intel</span>
      </div>
      <div className="lesson-content space-y-2">
        {renderContent()}
      </div>
    </div>
  );
};
