import { cn } from '@/lib/utils';

interface PullQuoteProps {
  children: string;
  author?: string;
  className?: string;
}

export const PullQuote = ({ children, author, className }: PullQuoteProps) => {
  return (
    <blockquote className={cn(
      "my-10 px-8 py-6 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg animate-fade-in",
      className
    )}>
      <div className="relative">
        {/* Decorative quote marks */}
        <span className="absolute -top-2 -left-2 text-5xl text-blue-200 dark:text-blue-800 font-serif leading-none select-none">
          "
        </span>
        
        <p className="font-body text-xl md:text-2xl italic text-blue-900 dark:text-blue-100 leading-relaxed pl-6">
          {children}
        </p>
        
        <span className="absolute -bottom-4 right-0 text-5xl text-blue-200 dark:text-blue-800 font-serif leading-none select-none">
          "
        </span>
      </div>
      
      {author && (
        <footer className="mt-4 pl-6">
          <cite className="font-ui text-sm font-medium text-blue-600 dark:text-blue-400 not-italic">
            — {author}
          </cite>
        </footer>
      )}
    </blockquote>
  );
};
