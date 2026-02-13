import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useScrollProgress } from '@/hooks/useScrollProgress';

interface ReadingTimeRemainingProps {
  totalReadingTime: number; // in minutes
}

export const ReadingTimeRemaining = ({ totalReadingTime }: ReadingTimeRemainingProps) => {
  const { progress } = useScrollProgress();
  const [timeRemaining, setTimeRemaining] = useState(totalReadingTime);

  useEffect(() => {
    const remaining = Math.max(0, Math.ceil(totalReadingTime * (1 - progress / 100)));
    setTimeRemaining(remaining);
  }, [progress, totalReadingTime]);

  if (progress < 10 || progress > 95) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3 py-2 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-sm text-sm text-muted-foreground animate-fade-in">
      <Clock className="h-3.5 w-3.5" />
      <span>{timeRemaining} min left</span>
    </div>
  );
};
