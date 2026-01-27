import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistTakeawaysProps {
  takeaways: string[];
  lessonId: string;
}

export const ChecklistTakeaways = ({ takeaways, lessonId }: ChecklistTakeawaysProps) => {
  const storageKey = `takeaways-${lessonId}`;
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  // Load checked state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch {
        setCheckedItems(new Array(takeaways.length).fill(false));
      }
    } else {
      setCheckedItems(new Array(takeaways.length).fill(false));
    }
  }, [lessonId, takeaways.length]);

  // Save to localStorage when changed
  const toggleItem = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
    localStorage.setItem(storageKey, JSON.stringify(newChecked));
  };

  const completedCount = checkedItems.filter(Boolean).length;
  const allComplete = completedCount === takeaways.length;

  return (
    <div className={cn(
      "tactical-card p-6 mb-8 transition-all duration-300",
      allComplete && "border-success/50 bg-gradient-to-br from-card to-success/5"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className={cn(
            "h-5 w-5 transition-colors",
            allComplete ? "text-success" : "text-warning"
          )} />
          <span className="font-ui text-lg font-medium">Key Signals</span>
        </div>
        <span className={cn(
          "text-sm font-mono px-3 py-1 rounded-full transition-colors",
          allComplete 
            ? "bg-success/20 text-success" 
            : "bg-muted text-muted-foreground"
        )}>
          {completedCount}/{takeaways.length}
        </span>
      </div>

      <div className="space-y-3">
        {takeaways.map((takeaway, index) => {
          const isChecked = checkedItems[index];
          
          return (
            <button
              key={index}
              onClick={() => toggleItem(index)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all",
                "hover:bg-muted/50",
                isChecked && "bg-success/10"
              )}
            >
              <div className={cn(
                "shrink-0 mt-0.5 transition-all duration-300",
                isChecked && "scale-110"
              )}>
                {isChecked ? (
                  <CheckCircle className="h-5 w-5 text-success animate-scale-in" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <p className={cn(
                "text-sm transition-all",
                isChecked && "text-muted-foreground line-through"
              )}>
                {takeaway}
              </p>
            </button>
          );
        })}
      </div>

      {allComplete && (
        <div className="mt-4 pt-4 border-t border-success/20 text-center animate-fade-in">
          <span className="text-success font-medium">
            ✨ All key signals reviewed!
          </span>
        </div>
      )}
    </div>
  );
};
