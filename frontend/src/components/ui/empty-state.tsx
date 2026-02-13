import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { 
  BookOpen, Search, Bell, Trophy, Rocket, 
  GraduationCap, Target, Sparkles, LucideIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'lessons' | 'notifications' | 'achievement';
  className?: string;
  children?: ReactNode;
}

const variantConfig = {
  default: {
    icon: Sparkles,
    iconColor: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  search: {
    icon: Search,
    iconColor: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  lessons: {
    icon: BookOpen,
    iconColor: 'text-success',
    bgColor: 'bg-success/10',
  },
  notifications: {
    icon: Bell,
    iconColor: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  achievement: {
    icon: Trophy,
    iconColor: 'text-warning',
    bgColor: 'bg-warning/10',
  },
};

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
  children,
}: EmptyStateProps) => {
  const config = variantConfig[variant];
  const IconComponent = icon || config.icon;

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-4",
        className
      )}
    >
      <div 
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center mb-4",
          config.bgColor
        )}
      >
        <IconComponent className={cn("h-8 w-8", config.iconColor)} />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>

      {action && (
        <Button onClick={action.onClick} className="gap-2">
          {action.label}
        </Button>
      )}

      {children}
    </div>
  );
};

// Pre-configured empty states for common use cases
export const NoLessonsCompleted = ({ onStart }: { onStart: () => void }) => (
  <EmptyState
    icon={Rocket}
    title="Ready to Begin?"
    description="You haven't completed any lessons yet. Start your trading journey now and unlock your potential."
    action={{ label: "Start First Lesson", onClick: onStart }}
    variant="lessons"
  />
);

export const NoModulesUnlocked = () => (
  <EmptyState
    icon={Target}
    title="Module Locked"
    description="Complete the previous modules to unlock this content. Keep up the great work!"
    variant="default"
  />
);

export const NoSearchResults = ({ query }: { query: string }) => (
  <EmptyState
    icon={Search}
    title="No Results Found"
    description={`We couldn't find anything matching "${query}". Try adjusting your search terms.`}
    variant="search"
  />
);

export const NoNotifications = () => (
  <EmptyState
    icon={Bell}
    title="All Caught Up!"
    description="You have no new notifications. Check back later for updates on your progress."
    variant="notifications"
  />
);

export const CongratulationsComplete = ({ onContinue }: { onContinue: () => void }) => (
  <EmptyState
    icon={GraduationCap}
    title="Congratulations!"
    description="You've completed all available content. Stay tuned for new lessons and modules."
    action={{ label: "Review Progress", onClick: onContinue }}
    variant="achievement"
  />
);
