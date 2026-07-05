import { Sparkles } from 'lucide-react';

interface LessonKeyTakeawaysProps {
  takeaways: string[];
}

export const LessonKeyTakeaways = ({ takeaways }: LessonKeyTakeawaysProps) => {
  if (takeaways.length === 0) {
    return null;
  }

  return (
    <div className="my-8 sm:my-10 border-l-4 border-l-success rounded-2xl bg-success/5 p-5 sm:p-7">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-success" />
        </div>
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">Key Takeaways</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">If you remember nothing else, remember this</p>
        </div>
      </div>

      <ul className="mt-5 space-y-3.5">
        {takeaways.map((takeaway, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-success" />
            <p className="text-sm sm:text-base text-foreground leading-relaxed" style={{ lineHeight: '1.75' }}>
              {takeaway}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
