import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JumpToQuizButtonProps {
  onJumpToQuiz: () => void;
  threshold?: number;
}

export const JumpToQuizButton = ({ onJumpToQuiz, threshold = 50 }: JumpToQuizButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (window.scrollY / scrollHeight) * 100;
      setIsVisible(scrollProgress >= threshold && scrollProgress < 90);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  if (!isVisible) return null;

  return (
    <Button
      onClick={onJumpToQuiz}
      size="sm"
      className={cn(
        "fixed bottom-24 right-6 z-40 shadow-lg gap-2",
        "bg-success hover:bg-success/90 text-success-foreground",
        "transition-all duration-300 animate-fade-in"
      )}
    >
      <ArrowDown className="h-4 w-4" />
      Jump to Quiz
    </Button>
  );
};
