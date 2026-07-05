import { Target } from 'lucide-react';
import { extractLearningObjectives } from './html';

interface LessonObjectivesProps {
  objective: string;
}

export const LessonObjectives = ({ objective }: LessonObjectivesProps) => {
  const objectives = extractLearningObjectives(objective);

  if (objectives.length === 0) {
    return null;
  }

  return (
    <div className="my-8 sm:my-10 border-l-4 border-l-primary rounded-xl bg-card p-5 sm:p-7 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Target className="h-4.5 w-4.5 text-primary" />
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">What You&apos;ll Learn</h2>
      </div>

      <ul className="space-y-3.5 pl-1">
        {objectives.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-primary" />
            <p className="text-sm sm:text-base text-foreground leading-relaxed flex-1">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
