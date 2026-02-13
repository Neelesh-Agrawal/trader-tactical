import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Star, ArrowRight, Award, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConfetti } from '@/hooks/useConfetti';
import { useCountUp } from '@/hooks/useCountUp';

interface CompletionModalProps {
  open: boolean;
  onClose: () => void;
  type: 'lesson' | 'module' | 'level';
  title: string;
  stats?: {
    score?: number;
    timeTaken?: number;
    lessonsCompleted?: number;
    totalLessons?: number;
  };
  nextPath?: string;
  nextLabel?: string;
}

export const CompletionModal = ({
  open,
  onClose,
  type,
  title,
  stats,
  nextPath,
  nextLabel = 'Continue'
}: CompletionModalProps) => {
  const navigate = useNavigate();
  const { fire } = useConfetti();
  const hasFireRef = useRef(false);

  const { count: scoreCount } = useCountUp({
    end: stats?.score || 0,
    duration: 1000,
    delay: 300
  });

  useEffect(() => {
    if (open && !hasFireRef.current) {
      hasFireRef.current = true;
      const intensity = type === 'level' ? 'high' : type === 'module' ? 'high' : 'medium';
      fire(intensity);
    }
    
    if (!open) {
      hasFireRef.current = false;
    }
  }, [open, type, fire]);

  const handleNext = () => {
    onClose();
    if (nextPath) {
      navigate(nextPath);
    }
  };

  const Icon = type === 'level' ? Award : type === 'module' ? Star : Trophy;
  const iconBg = type === 'level' ? 'bg-gradient-to-br from-warning to-warning/80' :
                  type === 'module' ? 'bg-gradient-to-br from-primary to-primary/80' :
                  'bg-gradient-to-br from-success to-success/80';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-md border-2",
        type === 'lesson' && "border-success/50",
        type === 'module' && "border-primary/50",
        type === 'level' && "border-warning/50"
      )}>
        <DialogHeader className="text-center pt-6">
          {/* Celebration Icon */}
          <div className="mx-auto mb-6 relative">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center animate-bounce-in",
              iconBg
            )}>
              <Icon className="h-10 w-10 text-white" />
            </div>
            {/* Sparkle effects */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full animate-ping opacity-75" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-success rounded-full animate-ping opacity-75 animation-delay-150" />
          </div>

          <DialogTitle className="text-2xl font-display text-center">
            {type === 'level' ? 'Level Complete!' :
             type === 'module' ? 'Module Complete!' :
             'Lesson Complete!'}
          </DialogTitle>
          <DialogDescription className="text-center text-lg pt-2">
            {title}
          </DialogDescription>
        </DialogHeader>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 py-6">
            {stats.score !== undefined && (
              <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="text-3xl font-bold text-success font-mono">{scoreCount}%</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Score</div>
              </div>
            )}
            {stats.timeTaken !== undefined && (
              <div className="text-center p-4 rounded-lg bg-muted border border-border">
                <div className="flex items-center justify-center gap-1.5">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xl font-bold font-mono">{Math.floor(stats.timeTaken / 60)}:{(stats.timeTaken % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Time</div>
              </div>
            )}
            {stats.lessonsCompleted !== undefined && (
              <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20 col-span-2">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-xl font-bold">{stats.lessonsCompleted}/{stats.totalLessons} lessons</span>
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Completed</div>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
          {nextPath && (
            <Button
              onClick={handleNext}
              className={cn(
                "flex-1 gap-2",
                type === 'lesson' && "bg-success hover:bg-success/90",
                type === 'module' && "bg-primary hover:bg-primary/90",
                type === 'level' && "bg-warning hover:bg-warning/90"
              )}
            >
              {nextLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
