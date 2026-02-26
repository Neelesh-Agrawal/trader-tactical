import { useNavigate } from 'react-router-dom';
import { useProgress } from '@/hooks/useProgress';
import { useEnrollment } from '@/hooks/useEnrollment';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Clock, BookOpen, Lock, ArrowRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Level } from '@/hooks/useCourses';

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

  const getModuleProgress = (moduleId: string) => {
    const module = level.modules.find(m => m.id === moduleId);
    if (!module) return { completed: 0, total: 0, percent: 0 };
    
    let completed = 0;
    module.lessons.forEach(lesson => {
      if (isLessonCompleted(level.id, moduleId, lesson.id)) completed++;
    });
    return {
      completed,
      total: module.lessons.length,
      percent: Math.round((completed / module.lessons.length) * 100)
    };
  };

  const getModuleStatus = (moduleId: string) => {
    const isUnlocked = isModuleUnlocked(level.id, moduleId);
    const isComplete = isModuleCompleted(level.id, moduleId);
    const { percent } = getModuleProgress(moduleId);
    
    if (isComplete) return 'completed';
    if (isUnlocked && percent > 0) return 'in-progress';
    if (isUnlocked) return 'available';
    return 'locked';
  };

  const getLessonReadingTime = (content: string) => {
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

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
        <p className="font-body text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 leading-relaxed">{level.description}</p>
        
        {enrollment && remainingDays !== null && remainingDays > 0 && (
          <div className="inline-flex items-center gap-2 mt-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-warning/10 border border-warning/20 text-warning text-sm">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="font-medium">{remainingDays} days remaining</span>
          </div>
        )}
      </div>

      {/* Stats Row */}
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

      {/* Module Accordion */}
      <div className="space-y-4">
        <h2 className="font-ui text-lg sm:text-xl font-semibold">Modules</h2>
        
        <Accordion type="single" collapsible className="space-y-3">
          {level.modules.map((module, index) => {
            const status = getModuleStatus(module.id);
            const progress = getModuleProgress(module.id);
            const isUnlocked = status !== 'locked';

            return (
              <AccordionItem
                key={module.id}
                value={module.id}
                className={cn(
                  "rounded-xl border bg-card px-4 sm:px-5 transition-all duration-200",
                  "data-[state=open]:shadow-md data-[state=open]:border-success/30",
                  status === 'locked' && "opacity-50",
                  status === 'completed' && "border-success/30 bg-success/5",
                  status === 'in-progress' && "border-success/20"
                )}
              >
                <AccordionTrigger className="hover:no-underline py-4 sm:py-5 touch-manipulation">
                  <div className="flex items-center gap-3 sm:gap-4 w-full pr-2">
                    {/* Module progress circle */}
                    <div className="shrink-0">
                      {isUnlocked ? (
                        <ProgressRing progress={progress.percent} size={40} strokeWidth={3} />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="font-ui text-sm sm:text-base font-semibold leading-tight">
                        {module.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {progress.completed} of {progress.total} lessons
                      </p>
                    </div>

                    {/* Status badge */}
                    <div className="shrink-0 mr-2">
                      {status === 'completed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20">
                          <CheckCircle className="h-3 w-3" />
                          Done
                        </span>
                      )}
                      {status === 'in-progress' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20">
                          In Progress
                        </span>
                      )}
                      {status === 'locked' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="pb-4 space-y-1">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isCompleted = isLessonCompleted(level.id, module.id, lesson.id);
                      const readingTime = getLessonReadingTime(lesson.content);
                      
                      // Determine if lesson is accessible
                      let isAccessible = false;
                      if (isUnlocked) {
                        if (lessonIndex === 0) isAccessible = true;
                        else {
                          const prevLesson = module.lessons[lessonIndex - 1];
                          if (prevLesson && isLessonCompleted(level.id, module.id, prevLesson.id)) {
                            isAccessible = true;
                          }
                        }
                        if (isCompleted) isAccessible = true;
                      }

                      const isCurrent = isAccessible && !isCompleted;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => isAccessible && onLessonSelect(module.id, lesson.id)}
                          disabled={!isAccessible}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-3 sm:py-3.5 rounded-lg text-left transition-all touch-manipulation",
                            isAccessible && "hover:bg-muted/50",
                            isCurrent && "bg-success/5 border border-success/20",
                            !isAccessible && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {/* Status icon */}
                          <div className="shrink-0">
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-success" />
                            ) : (
                              <div className={cn(
                                "w-5 h-5 rounded-full border-2",
                                isCurrent ? "border-success" : "border-muted-foreground/30"
                              )} />
                            )}
                          </div>

                          {/* Lesson title */}
                          <span className={cn(
                            "flex-1 text-sm sm:text-base",
                            isCompleted && "line-through text-muted-foreground"
                          )}>
                            {lesson.title}
                          </span>

                          {/* Reading time */}
                          <span className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {readingTime} min
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
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
