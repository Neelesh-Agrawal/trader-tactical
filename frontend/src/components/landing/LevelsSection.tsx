import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';
import { courseConfigList } from '@/config/courseConfig';
import { CourseLevelCard } from '@/components/course/CourseLevelCard';

const levels = courseConfigList.map(level => ({
  ...level,
  status: 'active' as const
}));

export const LevelsSection = () => {
  const navigate = useNavigate();

  return (
    <section id="levels" className="py-12 md:py-16 relative overflow-hidden bg-background">
      <style>{`
        @keyframes lv-card { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .lv-c1 { animation: lv-card 0.6s ease-out 0.3s both; }
        .lv-c2 { animation: lv-card 0.6s ease-out 0.5s both; }
        .lv-c3 { animation: lv-card 0.6s ease-out 0.7s both; }
        
        .lv-card-hover {
          transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
                      box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
                      border-color 0.3s ease;
        }
        
        .lv-card-hover:hover {
          transform: translateY(-6px);
          border-color: #16a34a !important;
          box-shadow: 0 20px 40px -15px rgba(22, 163, 74, 0.15), 
                      0 8px 16px -8px rgba(22, 163, 74, 0.1);
        }
        
        .lv-card-featured {
          transform: scale(1.025);
          border-color: rgba(22, 163, 74, 0.4);
          box-shadow: 0 10px 30px -10px rgba(22, 163, 74, 0.15);
        }
        
        .lv-card-featured:hover {
          transform: translateY(-8px) scale(1.025);
          border-color: #15803d !important;
          box-shadow: 0 24px 48px -12px rgba(22, 163, 74, 0.25);
        }
        
        .lv-btn {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
        }
        .lv-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 24px -4px rgba(22, 163, 74, 0.4);
        }
        .lv-btn:active {
          transform: scale(0.97);
        }
      `}</style>
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
            <h2 className={`${typography.heading.h1} font-display font-bold mb-4 text-foreground`}>
              No more random videos. <span className="text-success">Just structured learning.</span>
            </h2>
            <p className={`${typography.body.lg} font-body text-muted-foreground leading-relaxed`}>
              Three clear levels. Learn step-by-step with confidence.
            </p>
          </div>
        </AnimatedSection>

        {/* Subtle progression roadmap indicator */}
        <div className="max-w-xl mx-auto mb-10">
          {/* Mobile indicator */}
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 md:hidden">
            <span className="text-success">Beginner</span>
            <ArrowRight className="h-3 w-3 text-success/60 shrink-0" />
            <span>Intermediate</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
            <span>Advanced</span>
          </div>

          {/* Desktop timeline track */}
          <div className="relative flex items-center justify-between hidden md:flex">
            {/* Background line */}
            <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />
            
            {/* Progress line */}
            <div className="absolute left-6 right-1/2 top-1/2 h-0.5 bg-gradient-to-r from-success/80 to-success/40 -translate-y-1/2 z-0" style={{ width: '45%' }} />
            <div className="absolute left-1/2 right-6 top-1/2 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center gap-1 bg-background px-3">
              <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center text-xs font-bold ring-4 ring-background shadow-md">
                1
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-success">Beginner</span>
            </div>

            {/* Connecting Arrow */}
            <div className="absolute left-[28%] top-1/2 -translate-y-1/2 z-10">
              <ArrowRight className="h-3.5 w-3.5 text-success/60 bg-background rounded-full px-0.5" />
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center gap-1 bg-background px-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-muted-foreground flex items-center justify-center text-xs font-semibold ring-4 ring-background shadow-sm border border-border">
                2
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Intermediate</span>
            </div>

            {/* Connecting Arrow */}
            <div className="absolute right-[28%] top-1/2 -translate-y-1/2 z-10">
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 bg-background rounded-full px-0.5" />
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center gap-1 bg-background px-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-muted-foreground flex items-center justify-center text-xs font-semibold ring-4 ring-background shadow-sm border border-border">
                3
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Advanced</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch pt-2">
          {levels.map((level, index) => {
            const isActive = level.status === 'active';

            return (
              <AnimatedSection key={level.id} direction="up" delay={100 + index * 100} className="h-full">
                <CourseLevelCard
                  level={level}
                  variant="landing"
                  isActive={isActive}
                  index={index}
                  onCtaClick={() => navigate('/register')}
                />
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};
