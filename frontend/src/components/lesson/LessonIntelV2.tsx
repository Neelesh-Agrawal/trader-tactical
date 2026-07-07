import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { normalizeRichHtml } from './html';

interface LessonIntelV2Props {
  content: string;
}

export const LessonIntelV2 = ({ content }: LessonIntelV2Props) => {
  // Check if content contains HTML tags
  const isHtml = content.includes('<') && content.includes('>');

  if (!content) {
    return (
      <div className="tactical-card p-6 text-center text-muted-foreground">
        <p>No content available for this lesson.</p>
      </div>
    );
  }

  // Render HTML content directly from CKEditor
  if (isHtml) {
      return (
        <div 
          className="lesson-content ck-content prose-body min-w-0 max-w-full"
          dangerouslySetInnerHTML={{ __html: normalizeRichHtml(content) }}
        />
      );
  }

  // Original plain text rendering
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  const renderFormattedText = (text: string) => {
    return text.split('**').map((part, i) => 
      i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
    );
  };

  // Check if paragraph contains bullet-like items (lines starting with -)
  const hasBullets = (text: string) => {
    return text.split('\n').some(line => line.trim().startsWith('- '));
  };

  const renderBullets = (text: string) => {
    const lines = text.split('\n');
    const intro = lines.filter(l => !l.trim().startsWith('- ')).join(' ').trim();
    const bullets = lines.filter(l => l.trim().startsWith('- ')).map(l => l.trim().slice(2));

    return (
      <div className="mb-6 sm:mb-8">
        {intro && (
          <p className="text-foreground/90 leading-relaxed mb-4" style={{ lineHeight: '1.8' }}>
            {renderFormattedText(intro)}
          </p>
        )}
        <ul className="space-y-3 ml-1">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-foreground/40" />
              <span className="text-foreground/90 leading-relaxed" style={{ lineHeight: '1.8' }}>
                {renderFormattedText(bullet)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderContent = () => {
    return paragraphs.map((paragraph, index) => {
      // Headers
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h2 key={index} className="font-display text-xl sm:text-2xl font-bold mt-10 sm:mt-14 mb-4 text-foreground">
            {paragraph.replace(/\*\*/g, '')}
          </h2>
        );
      }

      // Bullet list paragraphs
      if (hasBullets(paragraph)) {
        return <div key={index}>{renderBullets(paragraph)}</div>;
      }

      // Numbered concept items - render as callout cards
      if (paragraph.includes('**1.') || paragraph.includes('**2.') || paragraph.includes('**3.')) {
        return (
          <div key={index} className="my-4 sm:my-6 p-4 sm:p-5 rounded-xl border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 shrink-0 text-warning" />
              <div className="text-foreground/90 leading-relaxed text-sm sm:text-base" style={{ lineHeight: '1.8' }}>
                {renderFormattedText(paragraph)}
              </div>
            </div>
          </div>
        );
      }

      // Regular paragraph
      const isFirstParagraph = index === 0 || (index === 1 && paragraphs[0].startsWith('**'));
      
      return (
        <p 
          key={index}
          className={cn(
            "text-foreground/90 leading-relaxed mb-5 sm:mb-7",
            isFirstParagraph ? 'text-base sm:text-lg' : 'text-base'
          )}
          style={{ lineHeight: '1.8' }}
        >
          {renderFormattedText(paragraph)}
        </p>
      );
    });
  };

  return (
    <div className="mb-8 sm:mb-10">
      {renderContent()}
    </div>
  );
};
