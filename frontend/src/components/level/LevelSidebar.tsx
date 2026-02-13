import { useProgress } from '@/hooks/useProgress';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, CheckCircle, Lock, BookOpen, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Level } from '@/data/courseData';

interface LevelSidebarProps {
  level: Level;
  currentModuleId?: string;
  currentLessonId?: string;
  onLessonSelect: (moduleId: string, lessonId: string) => void;
  onOverviewSelect: () => void;
}

export const LevelSidebar = ({ 
  level, 
  currentModuleId, 
  currentLessonId, 
  onLessonSelect,
  onOverviewSelect
}: LevelSidebarProps) => {
  const { isLessonCompleted, isModuleUnlocked, isModuleCompleted } = useProgress();
  const [expandedModules, setExpandedModules] = useState<string[]>([currentModuleId || '']);

  useEffect(() => {
    if (currentModuleId && !expandedModules.includes(currentModuleId)) {
      setExpandedModules(prev => [...prev, currentModuleId]);
    }
  }, [currentModuleId]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getLessonStatus = (moduleId: string, lessonId: string, lessonIndex: number) => {
    if (isLessonCompleted(level.id, moduleId, lessonId)) return 'complete';
    if (lessonIndex === 0) return 'active';
    
    const module = level.modules.find(m => m.id === moduleId);
    if (module && lessonIndex > 0) {
      const prevLesson = module.lessons[lessonIndex - 1];
      if (prevLesson && isLessonCompleted(level.id, moduleId, prevLesson.id)) {
        return 'active';
      }
    }
    return 'locked';
  };

  // Calculate overall level progress
  const calculateLevelProgress = () => {
    let completedLessons = 0;
    let totalLessons = 0;
    level.modules.forEach(m => {
      m.lessons.forEach(l => {
        totalLessons++;
        if (isLessonCompleted(level.id, m.id, l.id)) completedLessons++;
      });
    });
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const levelProgress = calculateLevelProgress();

  return (
    <div className="w-[280px] sm:w-[300px] lg:w-[280px] bg-sidebar border-r border-sidebar-border overflow-y-auto scrollbar-tactical h-full flex flex-col">
      {/* Level Header with Progress */}
      <div className="p-3 sm:p-4 border-b border-sidebar-border bg-gradient-to-b from-sidebar to-sidebar/80">
        <button 
          onClick={onOverviewSelect}
          className={cn(
            "w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-xl transition-all duration-200 touch-manipulation",
            "active:scale-[0.98]",
            "hover:bg-sidebar-accent/50",
            !currentModuleId && !currentLessonId && "bg-sidebar-accent ring-2 ring-primary/20"
          )}
        >
          <ProgressRing 
            progress={levelProgress} 
            size={40} 
            strokeWidth={3}
            showPercentage={false}
          />
          <div className="flex-1 text-left min-w-0">
            <h2 className="font-ui font-semibold text-sm sm:text-base text-sidebar-foreground capitalize truncate">{level.id} Level</h2>
            <p className="font-ui text-xs text-muted-foreground">{level.modules.length} modules • {levelProgress}%</p>
          </div>
        </button>
      </div>

      {/* Modules List */}
      <div className="p-2 flex-1 overflow-y-auto">
        {level.modules.map((module, moduleIndex) => {
          const isUnlocked = isModuleUnlocked(level.id, module.id);
          const isComplete = isModuleCompleted(level.id, module.id);
          const isExpanded = expandedModules.includes(module.id);
          const isCurrent = module.id === currentModuleId;

          // Calculate module progress
          const completedLessons = module.lessons.filter(l => 
            isLessonCompleted(level.id, module.id, l.id)
          ).length;
          const moduleProgress = module.lessons.length > 0 
            ? Math.round((completedLessons / module.lessons.length) * 100) 
            : 0;

          return (
            <Collapsible
              key={module.id}
              open={isExpanded && isUnlocked}
              onOpenChange={() => isUnlocked && toggleModule(module.id)}
              className="mb-1"
            >
              {/* Module Header */}
              <CollapsibleTrigger
                disabled={!isUnlocked}
                className={cn(
                  "w-full flex items-center gap-2 p-2.5 sm:p-3 rounded-lg text-left transition-all duration-200 touch-manipulation",
                  "min-h-[44px]", // Minimum touch target
                  isUnlocked ? "hover:bg-sidebar-accent active:scale-[0.98] cursor-pointer" : "opacity-50 cursor-not-allowed",
                  isCurrent && "bg-sidebar-accent"
                )}
              >
                <div className={cn(
                  "w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
                  isComplete ? "bg-success/20 text-success" :
                  isCurrent ? "bg-primary/20 text-primary" :
                  isUnlocked ? "bg-warning/20 text-warning" :
                  "bg-muted text-muted-foreground"
                )}>
                  {isComplete ? <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> :
                   !isUnlocked ? <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> :
                   <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-muted-foreground">M{moduleIndex + 1}</span>
                    {isUnlocked && !isComplete && (
                      <span className="font-mono text-[10px] text-primary">{moduleProgress}%</span>
                    )}
                  </div>
                  <p className="font-ui font-medium text-xs sm:text-sm truncate text-sidebar-foreground leading-tight">{module.title}</p>
                </div>

                {isUnlocked && (
                  <div className="shrink-0 transition-transform duration-200">
                    {isExpanded ? 
                      <ChevronDown className="h-4 w-4 text-muted-foreground" /> :
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    }
                  </div>
                )}
              </CollapsibleTrigger>

              {/* Lessons */}
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <div className="ml-3 pl-3 border-l-2 border-sidebar-border/50 mt-1 space-y-0.5 pb-2">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const status = getLessonStatus(module.id, lesson.id, lessonIndex);
                    const isCurrentLesson = lesson.id === currentLessonId && module.id === currentModuleId;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => status !== 'locked' && onLessonSelect(module.id, lesson.id)}
                        disabled={status === 'locked'}
                        className={cn(
                          "w-full flex items-center gap-2 py-2.5 sm:py-2 px-2 rounded-md text-left transition-all duration-200 group touch-manipulation",
                          "min-h-[44px] sm:min-h-0", // Larger touch target on mobile
                          status === 'locked' ? "opacity-40 cursor-not-allowed" : "hover:bg-sidebar-accent/70 active:scale-[0.98] md:hover:translate-x-1 cursor-pointer",
                          isCurrentLesson && "bg-primary/10 border-l-2 border-primary -ml-0.5 pl-[7px]",
                          status === 'active' && !isCurrentLesson && "animate-unlock-glow"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 text-[10px] font-mono",
                          status === 'complete' ? "bg-success text-success-foreground" :
                          isCurrentLesson ? "bg-primary text-primary-foreground" :
                          status === 'active' ? "bg-primary/20 text-primary ring-2 ring-primary/30" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {status === 'complete' ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : status === 'locked' ? (
                            <Lock className="h-2.5 w-2.5 transition-opacity duration-300" />
                          ) : isCurrentLesson ? (
                            <ArrowRight className="h-3 w-3" />
                          ) : (
                            <span>{lessonIndex + 1}</span>
                          )}
                        </div>
                        <span className={cn(
                          "text-xs sm:text-sm truncate flex-1 font-ui transition-colors duration-200",
                          isCurrentLesson ? "text-primary font-medium" : "text-sidebar-foreground/80 group-hover:text-sidebar-foreground"
                        )}>
                          {lesson.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      {/* Bottom Progress Bar */}
      <div className="p-3 sm:p-4 border-t border-sidebar-border bg-gradient-to-t from-sidebar to-sidebar/80">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="font-ui text-xs text-muted-foreground">Level Progress</span>
          <span className="font-mono text-xs font-medium text-primary">{levelProgress}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700 ease-out rounded-full"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};