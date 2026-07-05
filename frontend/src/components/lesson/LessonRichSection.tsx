import type { LucideIcon } from 'lucide-react';
import { hasRichHtmlContent, normalizeRichHtml } from './html';

interface LessonRichSectionProps {
  title: string;
  html: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export const LessonRichSection = ({
  title,
  html,
  icon: Icon,
  iconClassName = 'text-primary',
}: LessonRichSectionProps) => {
  if (!hasRichHtmlContent(html)) {
    return null;
  }

  return (
    <div className="tactical-card p-5 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-5 w-5 shrink-0 ${iconClassName}`} />
        <h2 className="subheader text-base sm:text-lg">{title}</h2>
      </div>
      <div
        className="lesson-content ck-content"
        dangerouslySetInnerHTML={{ __html: normalizeRichHtml(html) }}
      />
    </div>
  );
};
