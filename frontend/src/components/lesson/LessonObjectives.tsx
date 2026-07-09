import { Target } from 'lucide-react';
import { hasRichHtmlContent, prepareLessonObjectiveHtml } from './html';

interface LessonObjectivesProps {
  objective: string;
}

export const LessonObjectives = ({ objective }: LessonObjectivesProps) => {
  if (!hasRichHtmlContent(objective)) {
    return null;
  }

  const objectiveHtml = prepareLessonObjectiveHtml(objective);
  if (!objectiveHtml) {
    return null;
  }

  return (
    <div className="my-8 sm:my-10 border-l-4 border-l-primary rounded-xl bg-card p-5 sm:p-7 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Target className="h-4.5 w-4.5 text-primary" />
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">Lesson Objective</h2>
      </div>

      <div
        className="lesson-content ck-content min-w-0 max-w-full"
        dangerouslySetInnerHTML={{ __html: objectiveHtml }}
      />
    </div>
  );
};
