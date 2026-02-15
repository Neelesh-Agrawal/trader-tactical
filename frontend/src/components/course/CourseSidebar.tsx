import { useNavigate, useParams } from 'react-router-dom';
import { useProgress } from '@/hooks/useProgress';
import { useCourses } from '@/hooks/useCourses';
import { ChevronDown, ChevronRight, CheckCircle, Lock, Play, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CourseSidebarProps {
  levelId: string;
  currentModuleId?: string;
  currentLessonId?: string;
}

export const CourseSidebar = ({ levelId, currentModuleId, currentLessonId }: CourseSidebarProps) => {
  const navigate = useNavigate();
  const { isLessonCompleted, isModuleUnlocked, isModuleCompleted } = useProgress();
  const { getLevelById } = useCourses();
  const [expandedModules, setExpandedModules] = useState<string[]>([currentModuleId || '']);

  const level = getLevelById(levelId);

  useEffect(() => {
    if (currentModuleId && !expandedModules.includes(currentModuleId)) {
      setExpandedModules(prev => [...prev, currentModuleId]);
    }
  }, [currentModuleId]);

  if (!level) return null;

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getLessonStatus = (moduleId: string, lessonId: string, lessonIndex: number) => {
    if (isLessonCompleted(levelId, moduleId, lessonId)) return 'complete';
    if (lessonIndex === 0) return 'active';
    
    const module = level.modules.find(m => m.id === moduleId);
    if (module && lessonIndex > 0) {
      const prevLesson = module.lessons[lessonIndex - 1];
      if (prevLesson && isLessonCompleted(levelId, moduleId, prevLesson.id)) {
        return 'active';
      }
    }
    return 'locked';
  };

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border overflow-y-auto scrollbar-tactical h-full">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="font-bold text-lg text-sidebar-foreground">{level.title} Level</h2>
        <p className="text-sm text-muted-foreground">{level.modules.length} modules</p>
      </div>

      <div className="p-2">
        {level.modules.map((module, moduleIndex) => {
          const isUnlocked = isModuleUnlocked(levelId, module.id);
          const isComplete = isModuleCompleted(levelId, module.id);
          const isExpanded = expandedModules.includes(module.id);
          const isCurrent = module.id === currentModuleId;

          return (
            <div key={module.id} className="mb-1">
              {/* Module Header */}
              <button
                onClick={() => isUnlocked && toggleModule(module.id)}
                disabled={!isUnlocked}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                  isUnlocked ? "hover:bg-sidebar-accent" : "opacity-50 cursor-not-allowed",
                  isCurrent && "bg-sidebar-accent"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
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
                  isExpanded ? 
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> :
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {/* Lessons */}
              {isExpanded && isUnlocked && (
                <div className="ml-4 pl-4 border-l border-sidebar-border mt-1 space-y-1 animate-accordion-down">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const status = getLessonStatus(module.id, lesson.id, lessonIndex);
                    const isCurrent = lesson.id === currentLessonId;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => status !== 'locked' && navigate(`/lesson/${levelId}/${module.id}/${lesson.id}`)}
                        disabled={status === 'locked'}
                        className={cn(
                          "w-full flex items-center gap-2 p-2 rounded-md text-left text-sm transition-all",
                          status === 'locked' ? "opacity-50 cursor-not-allowed" : "hover:bg-sidebar-accent",
                          isCurrent && "bg-primary/10 text-primary"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
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
                      onClick={() => navigate(`/quiz/module/${levelId}/${module.id}`)}
                      className="w-full flex items-center gap-2 p-2 rounded-md text-left text-sm hover:bg-sidebar-accent text-warning"
                    >
                      <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                        📝
                      </div>
                      <span className="truncate flex-1">Module Quiz</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
