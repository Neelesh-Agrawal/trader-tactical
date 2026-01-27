import { ReactNode } from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConceptCardProps {
  children: ReactNode;
  variant?: 'tip' | 'warning' | 'example' | 'info';
  title?: string;
  className?: string;
}

export const ConceptCard = ({ children, variant = 'info', title, className }: ConceptCardProps) => {
  const variants = {
    tip: {
      icon: Lightbulb,
      iconColor: 'text-warning',
      borderColor: 'border-l-warning',
      bgColor: 'from-warning/5',
      defaultTitle: 'Key Concept'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-destructive',
      borderColor: 'border-l-destructive',
      bgColor: 'from-destructive/5',
      defaultTitle: 'Important'
    },
    example: {
      icon: TrendingUp,
      iconColor: 'text-success',
      borderColor: 'border-l-success',
      bgColor: 'from-success/5',
      defaultTitle: 'Example'
    },
    info: {
      icon: Info,
      iconColor: 'text-primary',
      borderColor: 'border-l-primary',
      bgColor: 'from-primary/5',
      defaultTitle: 'Note'
    }
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={cn(
      "my-6 p-5 rounded-lg border-l-4 transition-all",
      config.borderColor,
      `bg-gradient-to-r ${config.bgColor} to-transparent`,
      "hover:shadow-lg",
      className
    )}>
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", config.iconColor)} />
        <div className="flex-1">
          {(title || config.defaultTitle) && (
            <h4 className="font-semibold mb-2">{title || config.defaultTitle}</h4>
          )}
          <div className="text-foreground/80 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
