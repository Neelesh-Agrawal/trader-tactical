import { useProgress } from '@/hooks/useProgress';
import { useEnrollment } from '@/hooks/useEnrollment';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, BookOpen, Lock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Level } from '@/data/courseData';

interface LevelOverviewProps {
  level: Level;
  onModuleSelect: (moduleId: string) => void;
  onLessonSelect: (moduleId: string, lessonId: string) => void;
}

export const LevelOverview = ({ level, onModuleSelect, onLessonSelect }: LevelOverviewProps) => {
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Level Header */}
      <div className="text-center pb-8 border-b border-border">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 capitalize text-foreground">{level.id} Level</h1>
        <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto" style={{ lineHeight: '1.75' }}>{level.description}</p>
        
        {/* Deadline Badge */}
        {enrollment && remainingDays !== null && remainingDays > 0 && (
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-warning/10 border border-warning/20 text-warning">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{remainingDays} days remaining</span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="tactical-card p-4 text-center">
          <div className="font-mono text-3xl font-bold text-primary">{level.modules.length}</div>
          <div className="font-ui text-sm text-muted-foreground">Modules</div>
        </div>
        <div className="tactical-card p-4 text-center">
          <div className="font-mono text-3xl font-bold text-primary">
            {level.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
          </div>
          <div className="font-ui text-sm text-muted-foreground">Lessons</div>
        </div>
        <div className="tactical-card p-4 text-center">
          <div className="font-mono text-3xl font-bold text-primary">
            {level.modules.filter(m => isModuleCompleted(level.id, m.id)).length}
          </div>
          <div className="font-ui text-sm text-muted-foreground">Completed</div>
        </div>
      </div>

      {/* Module Cards - 2 Column Grid */}
      <div className="space-y-4">
        <h2 className="font-ui text-xl font-semibold">Modules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  "rounded-xl border bg-card p-5 transition-all duration-300",
                  isUnlocked ? "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 cursor-pointer group" : "opacity-60",
                  isComplete && "border-success/40 bg-success/5",
                  isCurrent && "border-primary/40 ring-2 ring-primary/20 animate-pulse-glow"
                )}
                onClick={() => isUnlocked && onModuleSelect(module.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Progress Ring or Lock */}
                  <div className="shrink-0">
                    {isUnlocked ? (
                      <ProgressRing 
                        progress={progress} 
                        size={56} 
                        strokeWidth={4}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-muted/30 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{module.icon}</span>
                      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Module {index + 1}</span>
                      {isComplete && (
                        <span className="ml-auto flex items-center gap-1 text-success text-xs font-medium">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-ui text-base font-semibold mb-1.5 group-hover:text-primary transition-colors leading-tight">
                      {module.title}
                    </h3>
                    
                    <p className="font-ui text-xs text-muted-foreground mb-3 line-clamp-2">{module.description}</p>

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

                    {/* Action */}
                    {isUnlocked && nextLesson && !isComplete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 mt-3 h-8 text-xs px-2 -ml-2"
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
                      <Button variant="ghost" size="sm" className="gap-1.5 mt-3 h-8 text-xs px-2 -ml-2 text-success">
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
        <div className="tactical-card p-6 border-warning/30 bg-gradient-to-br from-card to-warning/5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div className="flex-1">
              <h3 className="font-ui text-xl font-semibold mb-1">Final Assessment</h3>
              <p className="font-body text-sm text-muted-foreground mb-4">
                Complete all modules to unlock the final assessment and earn your certificate.
              </p>
              <Button disabled variant="secondary" className="gap-2">
                <Lock className="h-4 w-4" />
                Complete all modules to unlock
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
