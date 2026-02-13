import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export const ProgressRing = React.forwardRef<HTMLDivElement, ProgressRingProps>(
  ({ progress, size = 80, strokeWidth = 6, className, showPercentage = true, animated = true }, ref) => {
    const [displayProgress, setDisplayProgress] = React.useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (displayProgress / 100) * circumference;

    React.useEffect(() => {
      if (animated) {
        const timer = setTimeout(() => {
          setDisplayProgress(progress);
        }, 100);
        return () => clearTimeout(timer);
      } else {
        setDisplayProgress(progress);
      }
    }, [progress, animated]);

    return (
      <div ref={ref} className={cn("relative inline-flex items-center justify-center", className)}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(
              "transition-all duration-1000 ease-out",
              progress >= 100 && "stroke-success"
            )}
          />
        </svg>
        {showPercentage && (
          <span className="absolute text-sm font-semibold font-mono">
            {Math.round(displayProgress)}%
          </span>
        )}
      </div>
    );
  }
);

ProgressRing.displayName = "ProgressRing";
