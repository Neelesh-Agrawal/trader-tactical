import { ReactNode } from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExampleCalloutProps {
  title: string;
  children: ReactNode;
  tryThis?: string;
  className?: string;
}

export const ExampleCallout = ({ title, children, tryThis, className }: ExampleCalloutProps) => {
  return (
    <div className={cn(
      "my-8 rounded-lg border-2 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 overflow-hidden animate-fade-in",
      className
    )}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/50">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="font-ui text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Example
          </span>
        </div>
        
        <h4 className="font-ui text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3">
          {title}
        </h4>
        
        <div className="font-body text-base text-amber-800 dark:text-amber-200 leading-relaxed">
          {children}
        </div>
      </div>
      
      {tryThis && (
        <div className="px-6 py-4 bg-amber-100/50 dark:bg-amber-900/30 border-t border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-ui text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                Try This
              </span>
              <p className="font-body text-sm text-amber-800 dark:text-amber-200">
                {tryThis}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
