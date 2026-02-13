import { ReactNode } from 'react';
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export const AnimatedSection = ({ 
  children, 
  className, 
  delay = 0,
  direction = 'up' 
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useIntersectionAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  });

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    
    switch (direction) {
      case 'up':
        return 'translate3d(0, 40px, 0)';
      case 'down':
        return 'translate3d(0, -40px, 0)';
      case 'left':
        return 'translate3d(40px, 0, 0)';
      case 'right':
        return 'translate3d(-40px, 0, 0)';
      case 'fade':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        className
      )}
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
