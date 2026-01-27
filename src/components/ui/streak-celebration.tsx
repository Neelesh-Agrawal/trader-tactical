import { useEffect, useState } from 'react';
import { Flame, Award, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConfetti } from '@/hooks/useConfetti';

interface StreakCelebrationProps {
  streak: number;
  milestone: 7 | 30 | 100 | null;
  onDismiss: () => void;
}

export const StreakCelebration = ({ streak, milestone, onDismiss }: StreakCelebrationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { fire } = useConfetti();

  useEffect(() => {
    if (milestone) {
      setIsVisible(true);
      fire('low');
      
      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [milestone, fire, onDismiss]);

  if (!milestone) return null;

  const getMessage = () => {
    switch (milestone) {
      case 7: return "One week strong! 🔥";
      case 30: return "Monthly master! 🏆";
      case 100: return "Century achiever! 🌟";
      default: return "Keep it going!";
    }
  };

  const getGradient = () => {
    switch (milestone) {
      case 7: return "from-warning to-destructive";
      case 30: return "from-warning to-warning/80";
      case 100: return "from-primary to-primary/80";
      default: return "from-warning to-destructive";
    }
  };

  return (
    <div 
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      <div className={cn(
        "flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border border-white/20",
        "bg-gradient-to-r",
        getGradient()
      )}>
        <div className="relative">
          <Flame className="h-8 w-8 text-warning-foreground animate-streak-pulse" />
          <Sparkles className="h-4 w-4 text-warning-foreground/80 absolute -top-1 -right-1 animate-spin-slow" />
        </div>
        <div className="text-warning-foreground">
          <div className="font-bold text-lg flex items-center gap-2">
            {streak} Day Streak!
            <Award className="h-5 w-5 text-warning-foreground/80" />
          </div>
          <div className="text-sm text-white/90">{getMessage()}</div>
        </div>
      </div>
    </div>
  );
};
