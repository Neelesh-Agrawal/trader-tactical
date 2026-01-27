import { ReactNode } from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, Info, BookOpen, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConceptCardProps {
  children: ReactNode;
  variant?: 'concept' | 'tip' | 'warning' | 'example' | 'info';
  title?: string;
  icon?: 'lightbulb' | 'book' | 'target';
  className?: string;
}

export const ConceptCard = ({ children, variant = 'concept', title, icon = 'lightbulb', className }: ConceptCardProps) => {
  const iconMap = {
    lightbulb: Lightbulb,
    book: BookOpen,
    target: Target,
  };

  const variants = {
    concept: {
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      labelColor: 'text-emerald-700 dark:text-emerald-400',
      gradientBorder: 'bg-gradient-to-b from-emerald-500 to-teal-500',
      defaultTitle: 'Key Concept'
    },
    tip: {
      iconColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      labelColor: 'text-amber-700 dark:text-amber-400',
      gradientBorder: 'bg-gradient-to-b from-amber-500 to-orange-500',
      defaultTitle: 'Pro Tip'
    },
    warning: {
      iconColor: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      labelColor: 'text-red-700 dark:text-red-400',
      gradientBorder: 'bg-gradient-to-b from-red-500 to-rose-500',
      defaultTitle: 'Important'
    },
    example: {
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      labelColor: 'text-blue-700 dark:text-blue-400',
      gradientBorder: 'bg-gradient-to-b from-blue-500 to-indigo-500',
      defaultTitle: 'Example'
    },
    info: {
      iconColor: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-100 dark:bg-slate-800/50',
      labelColor: 'text-slate-700 dark:text-slate-400',
      gradientBorder: 'bg-gradient-to-b from-slate-400 to-slate-500',
      defaultTitle: 'Note'
    }
  };

  const config = variants[variant];
  const Icon = iconMap[icon];

  return (
    <div className={cn(
      "my-8 rounded-lg overflow-hidden animate-fade-in flex",
      className
    )}>
      {/* Gradient left border */}
      <div className={cn("w-1 shrink-0", config.gradientBorder)} />
      
      {/* Content */}
      <div className={cn("flex-1 p-6", config.bgColor)}>
        <div className="flex items-start gap-4">
          <div className={cn(
            "p-2 rounded-lg shrink-0",
            config.bgColor.replace('50', '100').replace('950/20', '900/30')
          )}>
            <Icon className={cn("h-5 w-5", config.iconColor)} />
          </div>
          
          <div className="flex-1 min-w-0">
            <span className={cn(
              "font-ui text-xs font-semibold uppercase tracking-wider block mb-1",
              config.labelColor
            )}>
              {config.defaultTitle}
            </span>
            
            {title && (
              <h4 className="font-ui text-lg font-semibold text-foreground mb-2">
                {title}
              </h4>
            )}
            
            <div className="font-body text-base text-foreground/80 leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
