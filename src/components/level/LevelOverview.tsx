import { useNavigate } from 'react-router-dom';
import { useProgress } from '@/hooks/useProgress';
import { useEnrollment } from '@/hooks/useEnrollment';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CheckCircle, Clock, BookOpen, Lock, ArrowRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Level } from '@/data/courseData';

interface LevelOverviewProps {
  level: Level;
  onModuleSelect: (moduleId: string) => void;
  onLessonSelect: (moduleId: string, lessonId: string) => void;
}

export const LevelOverview = ({ level, onModuleSelect, onLessonSelect }: LevelOverviewProps) => {
  const navigate = useNavigate();
  const { isModuleUnlocked, isModuleCompleted, isLessonCompleted } = useProgress();
  const { getEnrollment, getRemainingDays } = useEnrollment();

  const enrollment = getEnrollment(level.id);
  const remainingDays = enrollment ? getRemainingDays(level.id) : null;

  // Calculate progress for each module
  const getModuleProgress = (moduleId: string) => {
    const module = level.modules.find(m => m.id === moduleId);
    if (!module) return 0;
    
    let completed = 0;
    module.lessons.forEach(lesson => {
      if (isLessonCompleted(level.id, moduleId, lesson.id)) completed++;
    });
    return Math.round((completed / module.lessons.length) * 100);
  };

  // Find first incomplete lesson in a module
  const getNextLesson = (moduleId: string) => {
    const module = level.modules.find(m => m.id === moduleId);
    if (!module) return null;
    
    for (const lesson of module.lessons) {
      if (!isLessonCompleted(level.id, moduleId, lesson.id)) {
        return lesson;
      }
    }
    return null;
  };

  // Format level name for display
  const levelDisplayName = level.id.charAt(0).toUpperCase() + level.id.slice(1);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Back Button & Breadcrumb */}
      <div className="space-y-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground active:scale-95 transition-all py-2 touch-manipulation group"
          aria-label="Back to dashboard"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm sm:text-base font-medium">Back to Dashboard</span>
        </button>
        
        <Breadcrumb items={[{ label: `${levelDisplayName} Level` }]} />
      </div>

      {/* Level Header */}
      <div className="text-center pb-6 sm:pb-8 border-b border-border">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-2 capitalize text-foreground">{level.id} Level</h1>
        <p className="font-body text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2" style={{ lineHeight: '1.75' }}>{level.description}</p>
        
        {/* Deadline Badge */}
        {enrollment && remainingDays !== null && remainingDays > 0 && (
          <div className="inline-flex items-center gap-2 mt-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-warning/10 border border-warning/20 text-warning text-sm">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="font-medium">{remainingDays} days remaining</span>
          </div>
        )}
      </div>

      {/* Stats Row - Responsive grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="tactical-card p-3 sm:p-4 text-center">
          <div className="font-mono text-xl sm:text-3xl font-bold text-primary">{level.modules.length}</div>
          <div className="font-ui text-xs sm:text-sm text-muted-foreground">Modules</div>
        </div>
        <div className="tactical-card p-3 sm:p-4 text-center">
          <div className="font-mono text-xl sm:text-3xl font-bold text-primary">
            {level.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
          </div>
          <div className="font-ui text-xs sm:text-sm text-muted-foreground">Lessons</div>
        </div>
        <div className="tactical-card p-3 sm:p-4 text-center">
          <div className="font-mono text-xl sm:text-3xl font-bold text-primary">
            {level.modules.filter(m => isModuleCompleted(level.id, m.id)).length}
          </div>
          <div className="font-ui text-xs sm:text-sm text-muted-foreground">Complete</div>
        </div>
      </div>

      {/* Module Cards - Single column mobile, 2 columns desktop */}
      <div className="space-y-4">
        <h2 className="font-ui text-lg sm:text-xl font-semibold">Modules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {level.modules.map((module, index) => {
            const isUnlocked = isModuleUnlocked(level.id, module.id);
            const isComplete = isModuleCompleted(level.id, module.id);
            const progress = getModuleProgress(module.id);
            const nextLesson = getNextLesson(module.id);
            const isCurrent = isUnlocked && !isComplete && progress > 0;

            return (
              <div
                key={module.id}
                className={cn(
                  "rounded-xl border bg-card p-4 sm:p-5 transition-all duration-300 touch-manipulation",
                  isUnlocked ? "active:scale-[0.98] cursor-pointer group" : "opacity-60",
                  // Desktop hover effects
                  isUnlocked && "md:hover:border-primary/50 md:hover:shadow-lg md:hover:shadow-primary/5",
                  isComplete && "border-success/40 bg-success/5",
                  isCurrent && "border-primary/40 ring-2 ring-primary/20 animate-pulse-glow"
                )}
                onClick={() => isUnlocked && onModuleSelect(module.id)}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Progress Ring or Lock */}
                  <div className="shrink-0">
                    {isUnlocked ? (
                      <ProgressRing 
                        progress={progress} 
                        size={48} 
                        strokeWidth={3}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg sm:text-xl">{module.icon}</span>
                      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Module {index + 1}</span>
                      {isComplete && (
                        <span className="ml-auto flex items-center gap-1 text-success text-xs font-medium">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-ui text-sm sm:text-base font-semibold mb-1 sm:mb-1.5 group-hover:text-primary transition-colors leading-tight">
                      {module.title}
                    </h3>
                    
                    <p className="font-ui text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2">{module.description}</p>

                    {/* Lessons count and progress */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {module.lessons.length} lessons
                      </span>
                      {isUnlocked && (
                        <span className="font-mono font-medium text-primary">{progress}%</span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {isUnlocked && (
                      <Progress value={progress} className="h-1.5" />
                    )}

                    {/* Action - Larger touch target */}
                    {isUnlocked && nextLesson && !isComplete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 mt-3 h-9 sm:h-8 text-xs px-3 sm:px-2 -ml-3 sm:-ml-2 touch-manipulation"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLessonSelect(module.id, nextLesson.id);
                        }}
                      >
                        Continue
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}

                    {isComplete && (
                      <Button variant="ghost" size="sm" className="gap-1.5 mt-3 h-9 sm:h-8 text-xs px-3 sm:px-2 -ml-3 sm:-ml-2 text-success touch-manipulation">
                        Review
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Assessment Card */}
      {level.finalAssessment.length > 0 && (
        <div className="tactical-card p-4 sm:p-6 border-warning/30 bg-gradient-to-br from-card to-warning/5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-warning/20 flex items-center justify-center text-xl sm:text-2xl shrink-0">
              🏆
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-ui text-lg sm:text-xl font-semibold mb-1">Final Assessment</h3>
              <p className="font-body text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Complete all modules to unlock the final assessment and earn your certificate.
              </p>
              <Button disabled variant="secondary" className="gap-2 h-9 sm:h-10 text-xs sm:text-sm touch-manipulation">
                <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Complete all modules to unlock</span>
                <span className="sm:hidden">Locked</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
