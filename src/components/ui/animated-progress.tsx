import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  showPulse?: boolean;
  variant?: 'default' | 'success' | 'warning';
}

const AnimatedProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  AnimatedProgressProps
>(({ className, value, showPulse = false, variant = 'default', ...props }, ref) => {
  const [displayValue, setDisplayValue] = React.useState(0);
  const [isPulsing, setIsPulsing] = React.useState(false);

  React.useEffect(() => {
    // Animate from current to new value
    const start = displayValue;
    const end = value || 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Check for milestones
        if (end >= 100 || end >= 50 || end >= 25) {
          setIsPulsing(true);
          setTimeout(() => setIsPulsing(false), 1000);
        }
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const getBarColor = () => {
    switch (variant) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      default: return 'bg-primary';
    }
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-secondary",
        isPulsing && showPulse && "animate-pulse",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-300 ease-out rounded-full",
          getBarColor(),
          displayValue >= 100 && "animate-milestone-glow"
        )}
        style={{ transform: `translateX(-${100 - displayValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

AnimatedProgress.displayName = "AnimatedProgress";

export { AnimatedProgress };
