import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TacticalCardProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  animateHover?: boolean;
  borderAccent?: 'default' | 'success';
}

export const TacticalCard = ({
  children,
  icon,
  className,
  animateHover = true,
  borderAccent = 'default'
}: TacticalCardProps) => {
  return (
    <div
      className={cn(
        'bg-card border rounded-2xl p-5 h-full transition-all duration-300',
        animateHover ? 'hover:shadow-lg hover:-translate-y-1' : '',
        borderAccent === 'success' ? 'border-l-4 border-l-success/30 hover:border-l-success border-border' : 'border-border',
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4 shrink-0">
          {icon}
        </div>
      )}
      {children}
    </div>
  );
};
