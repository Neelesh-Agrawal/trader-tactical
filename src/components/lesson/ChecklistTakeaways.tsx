import { useState, useEffect, useRef } from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCheckbox } from '@/components/ui/animated-checkbox';
import { useConfetti } from '@/hooks/useConfetti';

interface ChecklistTakeawaysProps {
  takeaways: string[];
  lessonId: string;
}

export const ChecklistTakeaways = ({ takeaways, lessonId }: ChecklistTakeawaysProps) => {
  const storageKey = `takeaways-${lessonId}`;
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [justCompleted, setJustCompleted] = useState(false);
  const { fireFromElement } = useConfetti();
  const containerRef = useRef<HTMLDivElement>(null);

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
  }, [lessonId, takeaways.length, storageKey]);

  // Save to localStorage when changed
  const toggleItem = (index: number) => {
    const newChecked = [...checkedItems];
    const wasChecked = newChecked[index];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
    localStorage.setItem(storageKey, JSON.stringify(newChecked));

    // Check if all items are now complete
    const allComplete = newChecked.every(Boolean);
    if (allComplete && !wasChecked && containerRef.current) {
      setJustCompleted(true);
      fireFromElement(containerRef.current);
      setTimeout(() => setJustCompleted(false), 2000);
    }
  };

  const completedCount = checkedItems.filter(Boolean).length;
  const allComplete = completedCount === takeaways.length;

  return (
    <div 
      ref={containerRef}
      className={cn(
        "tactical-card p-6 mb-8 transition-all duration-300",
        allComplete && "border-success/50 bg-gradient-to-br from-card to-success/5",
        justCompleted && "animate-milestone-glow"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className={cn(
            "h-5 w-5 transition-colors duration-300",
            allComplete ? "text-success" : "text-warning"
          )} />
          <span className="font-ui text-lg font-medium">Key Signals</span>
          {allComplete && (
            <Sparkles className="h-4 w-4 text-success animate-spin-slow" />
          )}
        </div>
        <span className={cn(
          "text-sm font-mono px-3 py-1 rounded-full transition-all duration-300",
          allComplete 
            ? "bg-success/20 text-success" 
            : "bg-muted text-muted-foreground"
        )}>
          {completedCount}/{takeaways.length}
        </span>
      </div>

      <div className="space-y-2">
        {takeaways.map((takeaway, index) => {
          const isChecked = checkedItems[index];
          
          return (
            <button
              key={index}
              onClick={() => toggleItem(index)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200",
                "hover:bg-muted/50 hover:translate-x-1",
                isChecked && "bg-success/10"
              )}
            >
              <AnimatedCheckbox 
                checked={isChecked} 
                onChange={() => {}} 
                className="mt-0.5"
              />
              <p className={cn(
                "text-sm transition-all duration-200",
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
          <span className="text-success font-medium flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            All key signals reviewed!
            <Sparkles className="h-4 w-4" />
          </span>
        </div>
      )}
    </div>
  );
};
