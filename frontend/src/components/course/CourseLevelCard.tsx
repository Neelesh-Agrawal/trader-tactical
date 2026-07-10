import { Check, CheckCircle, Lock, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseLevel } from '@/config/courseConfig';
import { getPdfUrl, openPdf } from '@/lib/pdf';
import { cn } from '@/lib/utils';

interface CourseLevelCardProps {
  level: CourseLevel;
  variant: 'landing' | 'pricing';
  isActive?: boolean;
  onCtaClick?: () => void;
  className?: string;
  index: number;
  displayPrice?: number;
}

export const CourseLevelCard = ({ 
  level, 
  variant, 
  isActive = true, 
  onCtaClick, 
  className,
  index,
  displayPrice,
}: CourseLevelCardProps) => {
  const isLanding = variant === 'landing';
  const isFeatured = level.id === 'beginner';
  const resolvedPrice = displayPrice ?? level.price;

  return (
    <div
      className={cn(
        'relative bg-card border rounded-2xl p-6 transition-all duration-300 h-full flex flex-col justify-between lv-card-hover',
        index === 0 && 'lv-c1',
        index === 1 && 'lv-c2',
        index === 2 && 'lv-c3',
        isFeatured ? 'lv-card-featured border-success/50' : 'border-border shadow-md',
        className
      )}
    >
      {/* ⭐ Recommended badge for Beginner */}
      {isFeatured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-success text-white text-[11px] font-bold shadow-lg shadow-success/20 whitespace-nowrap flex items-center gap-1">
          <span>⭐</span> Recommended
        </div>
      )}

      {/* Card Content Top area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-2xl shrink-0">{level.emoji}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-success uppercase tracking-widest">{level.badge}</p>
                <h3 className="text-lg font-bold text-foreground truncate">{level.name}</h3>
              </div>
            </div>
            {isLanding && (
              <div className={cn(
                "shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
                isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
              )}>
                {isActive ? <CheckCircle className="h-3 w-3 shrink-0" /> : <Lock className="h-3 w-3 shrink-0" />}
                {isActive ? 'Active' : 'Locked'}
              </div>
            )}
            {!isLanding && (
              <div className="text-right shrink-0">
                <span className="text-2xl font-bold text-foreground">₹{resolvedPrice}</span>
              </div>
            )}
          </div>
          <h4 className="text-sm font-semibold text-foreground mb-2 leading-snug">
            {level.title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {level.description}
          </p>
        </div>

        {/* Best For callout box */}
        {level.bestFor && (
          <div className="mb-5 pb-5 border-b border-border">
            <div className="px-3 py-2 rounded-lg bg-success/8 border border-success/15">
              <p className="text-xs font-bold text-success uppercase tracking-wide mb-0.5">Best For</p>
              <p className="text-xs font-semibold text-foreground leading-snug">{level.bestFor}</p>
            </div>
          </div>
        )}

        {/* Points (What You'll Master) */}
        <div className="mb-6 flex-1">
          <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">What You'll Master</p>
          <ul className="space-y-2.5">
            {level.points.slice(0, 6).map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-success" strokeWidth={3} />
                </div>
                <span className="text-sm text-muted-foreground leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Bottom area pinned cleanly */}
      <div className="mt-auto pt-4 border-t border-border/40">
        {/* Stats (Modules, Lessons, Duration) */}
        <div className="grid grid-cols-3 gap-2 text-center p-3.5 mb-5 rounded-xl border border-border/50 bg-muted/50">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Modules</span>
            <p className="text-[17px] font-extrabold font-mono text-foreground">{level.modules}</p>
          </div>
          <div className="border-l border-border/60 space-y-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Lessons</span>
            <p className="text-[17px] font-extrabold font-mono text-foreground">{level.lessons ?? '—'}</p>
          </div>
          <div className="border-l border-border/60 space-y-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Duration</span>
            <p className="text-xs font-extrabold text-foreground uppercase pt-0.5">{level.duration}</p>
          </div>
        </div>

        {/* Trust Value Proposition Area */}
        <div className="flex items-center justify-center gap-4 mb-4 text-[11px] font-semibold text-muted-foreground/90">
          <span className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5 text-success shrink-0" strokeWidth={3} />
            Lifetime Access
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5 text-success shrink-0" strokeWidth={3} />
            Certificate Included
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Button
            className={cn(
              "w-full font-semibold rounded-xl h-11 gap-2 lv-btn",
              isFeatured ? "bg-success hover:bg-success/90 text-white" : "bg-background border border-border text-foreground hover:bg-muted"
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (onCtaClick) onCtaClick();
            }}
            disabled={isLanding && !isActive}
          >
            {isLanding && !isActive ? (
              <>
                <Lock className="h-4 w-4" />
                Locked
              </>
            ) : (
              <>
                <span>{isLanding ? `Enroll Now — ₹${resolvedPrice}` : level.cta}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          {isLanding && level.samplePdfPath && level.sampleDownloadCTA && (
            <a
              href={getPdfUrl(level.samplePdfPath)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => openPdf(level.samplePdfPath!, e)}
              className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl border border-success/30 text-success bg-success/5 hover:bg-success/10 text-sm font-semibold transition-transform duration-200 hover:-translate-y-px"
            >
              <Download className="w-4 h-4" />
              {level.sampleDownloadCTA}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
