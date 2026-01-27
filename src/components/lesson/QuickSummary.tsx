import { CheckCircle2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickSummaryProps {
  title?: string;
  points: string[];
  variant?: 'default' | 'tldr';
  className?: string;
}

export const QuickSummary = ({ title, points, variant = 'default', className }: QuickSummaryProps) => {
  const isTldr = variant === 'tldr';
  
  return (
    <div className={cn(
      "my-8 rounded-lg border-l-4 overflow-hidden animate-fade-in",
      isTldr 
        ? "border-l-purple-500 bg-purple-50 dark:bg-purple-950/20" 
        : "border-l-slate-400 bg-slate-100 dark:bg-slate-800/50",
      className
    )}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {isTldr ? (
            <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          )}
          <h4 className={cn(
            "font-ui text-sm font-semibold uppercase tracking-wider",
            isTldr 
              ? "text-purple-700 dark:text-purple-400" 
              : "text-slate-700 dark:text-slate-300"
          )}>
            {title || (isTldr ? 'TL;DR' : 'Quick Summary')}
          </h4>
        </div>
        
        <ul className="space-y-3">
          {points.map((point, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className={cn(
                "h-4 w-4 mt-0.5 shrink-0",
                isTldr 
                  ? "text-purple-500 dark:text-purple-400" 
                  : "text-success"
              )} />
              <span className={cn(
                "font-body text-base leading-relaxed",
                isTldr 
                  ? "text-purple-900 dark:text-purple-100" 
                  : "text-slate-700 dark:text-slate-300"
              )}>
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
