import { useScrollProgress } from '@/hooks/useScrollProgress';
import { cn } from '@/lib/utils';

interface ScrollProgressBarProps {
  className?: string;
}

export const ScrollProgressBar = ({ className }: ScrollProgressBarProps) => {
  const { progress } = useScrollProgress();

  return (
    <div className={cn("fixed top-16 left-0 right-0 h-1 bg-muted/50 z-50", className)}>
      <div 
        className="h-full reading-progress-bar transition-all duration-150 ease-out"
        style={{ 
          width: `${progress}%`,
          transform: 'translateZ(0)',
        }}
      />
    </div>
  );
};
