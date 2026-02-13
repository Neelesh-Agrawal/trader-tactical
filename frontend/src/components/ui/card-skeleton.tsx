import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  className?: string;
  variant?: 'default' | 'hero' | 'level' | 'stat';
}

export const CardSkeleton = ({ className, variant = 'default' }: CardSkeletonProps) => {
  const baseClasses = "animate-pulse rounded-xl bg-muted/50";

  switch (variant) {
    case 'hero':
      return (
        <div className={cn(baseClasses, "p-8", className)}>
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-3 flex-1">
              <div className="h-8 w-64 bg-muted rounded-lg shimmer" />
              <div className="h-5 w-96 bg-muted rounded-lg shimmer" />
            </div>
            <div className="h-12 w-12 bg-muted rounded-full shimmer" />
          </div>
          <div className="h-3 w-full bg-muted rounded-full mb-4 shimmer" />
          <div className="h-12 w-48 bg-muted rounded-lg shimmer" />
        </div>
      );

    case 'level':
      return (
        <div className={cn(baseClasses, "p-6 flex flex-col items-center", className)}>
          <div className="h-20 w-20 bg-muted rounded-full mb-4 shimmer" />
          <div className="h-4 w-16 bg-muted rounded mb-2 shimmer" />
          <div className="h-6 w-24 bg-muted rounded mb-2 shimmer" />
          <div className="h-8 w-16 bg-muted rounded mb-1 shimmer" />
          <div className="h-4 w-20 bg-muted rounded shimmer" />
        </div>
      );

    case 'stat':
      return (
        <div className={cn(baseClasses, "p-4 flex flex-col items-center", className)}>
          <div className="h-8 w-8 bg-muted rounded-full mb-2 shimmer" />
          <div className="h-6 w-12 bg-muted rounded mb-1 shimmer" />
          <div className="h-4 w-20 bg-muted rounded shimmer" />
        </div>
      );

    default:
      return (
        <div className={cn(baseClasses, "p-4 space-y-3", className)}>
          <div className="h-4 w-3/4 bg-muted rounded shimmer" />
          <div className="h-4 w-1/2 bg-muted rounded shimmer" />
        </div>
      );
  }
};

// Shimmer effect styles
export const ShimmerOverlay = () => (
  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
);
