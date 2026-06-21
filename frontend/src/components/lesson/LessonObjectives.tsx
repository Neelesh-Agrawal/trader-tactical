import { Target } from 'lucide-react';
import { normalizeRichHtml } from './html';

interface LessonObjectivesProps {
  objective: string;
  keyTakeaways: string[];
}

export const LessonObjectives = ({ objective, keyTakeaways }: LessonObjectivesProps) => {
  // Show up to 4 objectives from takeaways
  const objectives = keyTakeaways.slice(0, 4);

  return (
    <div className="my-8 sm:my-10 border-l-4 border-l-primary rounded-xl bg-card p-5 sm:p-7 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <Target className="h-4.5 w-4.5 text-primary" />
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">What You'll Learn</h2>
      </div>
      
      <p className="text-sm text-muted-foreground mb-5">
        By the end of this lesson, you will be able to:
      </p>

      {objective && (
        <div
          className="lesson-content ck-content mb-5"
          dangerouslySetInnerHTML={{ __html: normalizeRichHtml(objective) }}
        />
      )}

      <div className="space-y-4">
        {objectives.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className="shrink-0 w-7 h-7 rounded-lg bg-success/10 text-success text-sm font-bold flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <p className="text-sm sm:text-base text-foreground leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
