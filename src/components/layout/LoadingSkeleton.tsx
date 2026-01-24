import { Skeleton } from '@/components/ui/skeleton';

export const DashboardSkeleton = () => (
  <div className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
    {/* Welcome Card Skeleton */}
    <div className="tactical-card p-6">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>

    {/* Progress Cards Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="tactical-card p-4">
          <Skeleton className="h-10 w-10 rounded-full mb-3" />
          <Skeleton className="h-8 w-12 mb-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>

    {/* Level Cards Skeleton */}
    <div>
      <Skeleton className="h-6 w-40 mb-6" />
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="tactical-card p-6">
            <Skeleton className="h-12 w-12 rounded-lg mb-4" />
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-2 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const LessonSkeleton = () => (
  <div className="flex min-h-screen">
    {/* Sidebar Skeleton */}
    <div className="w-80 border-r border-border p-4 space-y-4 hidden lg:block">
      <Skeleton className="h-8 w-full mb-6" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <div className="pl-4 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>

    {/* Content Skeleton */}
    <div className="flex-1 p-8 max-w-4xl">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-10 w-3/4 mb-8" />
      
      <div className="space-y-6">
        <div className="tactical-card p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </div>
        
        <div className="tactical-card p-8">
          <Skeleton className="h-6 w-24 mb-6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-4" />
          <Skeleton className="h-4 w-2/3 mt-4" />
        </div>
      </div>
    </div>
  </div>
);

export const QuizSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="tactical-card max-w-lg w-full p-8">
      <Skeleton className="h-16 w-16 rounded-full mx-auto mb-6" />
      <Skeleton className="h-8 w-48 mx-auto mb-4" />
      <Skeleton className="h-4 w-64 mx-auto mb-8" />
      
      <div className="space-y-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg">
            <Skeleton className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  </div>
);
