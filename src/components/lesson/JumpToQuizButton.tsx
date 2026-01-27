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
        "fixed z-40 shadow-lg gap-2 touch-manipulation",
        // Position: avoid overlap with FAB on mobile
        "bottom-24 right-4 sm:bottom-24 sm:right-6",
        // Larger touch target on mobile
        "h-10 sm:h-9 px-4 sm:px-3",
        "bg-success hover:bg-success/90 active:scale-95 text-success-foreground",
        "transition-all duration-300 animate-fade-in"
      )}
    >
      <ArrowDown className="h-4 w-4" />
      <span className="hidden xs:inline">Jump to Quiz</span>
      <span className="xs:hidden">Quiz</span>
    </Button>
  );
};
