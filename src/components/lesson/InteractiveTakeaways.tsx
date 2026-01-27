import { useState } from 'react';
import { CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveTakeawaysProps {
  takeaways: string[];
  title?: string;
  className?: string;
}

export const InteractiveTakeaways = ({ takeaways, title = "Key Takeaways", className }: InteractiveTakeawaysProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [recentlyChecked, setRecentlyChecked] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems);
    
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
      setRecentlyChecked(index);
      setTimeout(() => setRecentlyChecked(null), 600);
    }
    
    setCheckedItems(newChecked);
  };

  const allChecked = checkedItems.size === takeaways.length;

  return (
    <div className={cn(
      "my-8 rounded-xl border border-border bg-card overflow-hidden animate-fade-in",
      className
    )}>
      {/* Header */}
      <div className="px-6 py-4 bg-muted/50 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h4 className="font-ui text-sm font-semibold uppercase tracking-wider text-foreground">
            {title}
          </h4>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {checkedItems.size}/{takeaways.length}
        </span>
      </div>
      
      {/* Items */}
      <div className="p-4 space-y-2">
        {takeaways.map((takeaway, index) => {
          const isChecked = checkedItems.has(index);
          const isRecent = recentlyChecked === index;
          
          return (
            <button
              key={index}
              onClick={() => toggleItem(index)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-300",
                "hover:bg-muted/50",
                isChecked && "bg-success/10",
                isRecent && "animate-pulse bg-success/20"
              )}
            >
              <div className="mt-0.5 shrink-0">
                {isChecked ? (
                  <CheckCircle2 className={cn(
                    "h-5 w-5 text-success transition-transform duration-300",
                    isRecent && "scale-125"
                  )} />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/50" />
                )}
              </div>
              <span className={cn(
                "font-body text-base leading-relaxed transition-all duration-300",
                isChecked 
                  ? "text-success line-through decoration-success/50" 
                  : "text-foreground"
              )}>
                {takeaway}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Completion message */}
      {allChecked && (
        <div className="px-6 py-4 bg-success/10 border-t border-success/20 animate-fade-in">
          <p className="font-ui text-sm text-success font-medium text-center flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            You've reviewed all key takeaways!
          </p>
        </div>
      )}
    </div>
  );
};
