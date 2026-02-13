import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href?: string;
  className?: string;
}

export const SkipLink = ({ href = '#main-content', className }: SkipLinkProps) => {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only",
        "fixed top-2 left-2 z-[100]",
        "bg-primary text-primary-foreground",
        "px-4 py-2 rounded-md font-medium text-sm",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "transition-transform duration-200",
        "translate-y-[-100%] focus:translate-y-0",
        className
      )}
    >
      Skip to main content
    </a>
  );
};
