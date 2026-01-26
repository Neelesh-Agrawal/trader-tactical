import { useProgress } from '@/hooks/useProgress';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, CheckCircle, Lock, Play, BookOpen } from 'lucide-react';
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
    let completedModules = 0;
    level.modules.forEach(m => {
      if (isModuleCompleted(level.id, m.id)) completedModules++;
    });
    return Math.round((completedModules / level.modules.length) * 100);
  };

  const levelProgress = calculateLevelProgress();

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border overflow-y-auto scrollbar-tactical h-full flex flex-col">
      {/* Level Header with Progress */}
      <div className="p-4 border-b border-sidebar-border">
        <button 
          onClick={onOverviewSelect}
          className={cn(
            "w-full flex items-center gap-4 p-3 rounded-lg transition-all",
            "hover:bg-sidebar-accent",
            !currentModuleId && !currentLessonId && "bg-sidebar-accent"
          )}
        >
          <ProgressRing 
            progress={levelProgress} 
            size={48} 
            strokeWidth={4}
            showPercentage={false}
          />
          <div className="flex-1 text-left">
            <h2 className="font-bold text-lg text-sidebar-foreground capitalize">{level.id} Level</h2>
            <p className="text-sm text-muted-foreground">{level.modules.length} modules</p>
          </div>
        </button>
      </div>

      {/* Modules List */}
      <div className="p-2 flex-1">
        {level.modules.map((module, moduleIndex) => {
          const isUnlocked = isModuleUnlocked(level.id, module.id);
          const isComplete = isModuleCompleted(level.id, module.id);
          const isExpanded = expandedModules.includes(module.id);
          const isCurrent = module.id === currentModuleId;

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
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                  isUnlocked ? "hover:bg-sidebar-accent cursor-pointer" : "opacity-50 cursor-not-allowed",
                  isCurrent && "bg-sidebar-accent"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  isComplete ? "bg-success/20 text-success" :
                  isCurrent ? "bg-primary/20 text-primary" :
                  isUnlocked ? "bg-warning/20 text-warning" :
                  "bg-muted text-muted-foreground"
                )}>
                  {isComplete ? <CheckCircle className="h-4 w-4" /> :
                   !isUnlocked ? <Lock className="h-4 w-4" /> :
                   <BookOpen className="h-4 w-4" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Module {moduleIndex + 1}</p>
                  <p className="font-medium text-sm truncate text-sidebar-foreground">{module.title}</p>
                </div>

                {isUnlocked && (
                  <div className="shrink-0">
                    {isExpanded ? 
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" /> :
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform" />
                    }
                  </div>
                )}
              </CollapsibleTrigger>

              {/* Lessons */}
              <CollapsibleContent className="animate-accordion-down">
                <div className="ml-4 pl-4 border-l border-sidebar-border mt-1 space-y-1">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const status = getLessonStatus(module.id, lesson.id, lessonIndex);
                    const isCurrentLesson = lesson.id === currentLessonId;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => status !== 'locked' && onLessonSelect(module.id, lesson.id)}
                        disabled={status === 'locked'}
                        className={cn(
                          "w-full flex items-center gap-2 p-2 rounded-md text-left text-sm transition-all",
                          status === 'locked' ? "opacity-50 cursor-not-allowed" : "hover:bg-sidebar-accent cursor-pointer",
                          isCurrentLesson && "bg-primary/10 text-primary border-l-2 border-primary -ml-px pl-[7px]"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all",
                          status === 'complete' ? "bg-success text-success-foreground" :
                          status === 'active' ? "bg-warning/20 text-warning" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {status === 'complete' ? <CheckCircle className="h-3 w-3" /> :
                           status === 'locked' ? <Lock className="h-3 w-3" /> :
                           <Play className="h-3 w-3" />}
                        </div>
                        <span className="truncate flex-1">{lesson.title}</span>
                      </button>
                    );
                  })}
                  
                  {/* Module Quiz Link */}
                  {module.finalQuiz.length > 0 && (
                    <button
                      onClick={() => {/* Navigate to quiz */}}
                      className="w-full flex items-center gap-2 p-2 rounded-md text-left text-sm hover:bg-sidebar-accent text-warning"
                    >
                      <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                        📝
                      </div>
                      <span className="truncate flex-1">Module Quiz</span>
                    </button>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      {/* Bottom Progress Bar */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Level Progress</span>
          <span className="font-mono font-medium">{levelProgress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
