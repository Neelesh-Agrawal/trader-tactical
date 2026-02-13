import { ReactNode } from 'react';
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedSection = ({ children, className, delay = 0 }: AnimatedSectionProps) => {
  const { ref, isVisible } = useIntersectionAnimation();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4",
        className
      )}
      style={{ 
        transitionDelay: `${delay}ms`,
        transform: isVisible ? 'translateY(0) translateZ(0)' : 'translateY(16px) translateZ(0)',
      }}
    >
      {children}
    </div>
  );
};
