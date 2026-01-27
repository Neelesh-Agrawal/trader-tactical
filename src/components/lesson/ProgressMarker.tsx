import { cn } from '@/lib/utils';

interface ProgressMarkerProps {
  currentSection: number;
  totalSections: number;
  sectionTitle?: string;
  className?: string;
}

export const ProgressMarker = ({ currentSection, totalSections, sectionTitle, className }: ProgressMarkerProps) => {
  return (
    <div className={cn(
      "my-10 flex flex-col items-center gap-3 animate-fade-in",
      className
    )}>
      {/* Section dots */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSections }, (_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              i + 1 === currentSection
                ? "w-3 h-3 bg-primary shadow-lg shadow-primary/30"
                : i + 1 < currentSection
                ? "bg-success"
                : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
      
      {/* Section label */}
      <div className="flex items-center gap-3">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
        <span className="font-ui text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Section {currentSection} of {totalSections}
          {sectionTitle && <span className="lowercase"> — {sectionTitle}</span>}
        </span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
      </div>
    </div>
  );
};
