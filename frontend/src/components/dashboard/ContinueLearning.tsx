import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { useCourses, type Level } from '@/hooks/useCourses';
import { AnimatedProgress } from '@/components/ui/animated-progress';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { ArrowRight, BookOpen, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentLevel } from '@/lib/currentLevel';

interface LastLessonData {
  levelId: string;
  moduleId: string;
  lessonId: string;
}

const findFirstIncompleteLessonInLevel = (
  level: Level,
  isLessonCompleted: (levelId: string, moduleId: string, lessonId: string) => boolean,
): LastLessonData | null => {
  for (const module of level.modules) {
    for (const lesson of module.lessons) {
      if (!isLessonCompleted(level.id, module.id, lesson.id)) {
        return {
          levelId: level.id,
          moduleId: module.id,
          lessonId: lesson.id,
        };
      }
    }
  }
  return null;
};

const findLastLessonInLevel = (level: Level): LastLessonData | null => {
  const lastModule = level.modules[level.modules.length - 1];
  if (!lastModule?.lessons.length) return null;
  const lastLessonItem = lastModule.lessons[lastModule.lessons.length - 1];
  return {
    levelId: level.id,
    moduleId: lastModule.id,
    lessonId: lastLessonItem.id,
  };
};

export const ContinueLearning = () => {
  const { user } = useAuth();
  const { isLessonCompleted, isLevelCompleted } = useProgress();
  const { levels, getLevelById, getModuleById, getLessonById } = useCourses();
  const navigate = useNavigate();
  const [lastLesson, setLastLesson] = useState<LastLessonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastLesson = () => {
      if (!user) {
        setLoading(false);
        return;
      }

      if (!levels.length) {
        setLoading(false);
        return;
      }

      const currentLevel = getCurrentLevel(levels, isLevelCompleted, isLessonCompleted);
      if (!currentLevel) {
        setLoading(false);
        return;
      }

      const isValidLesson = (data: LastLessonData) =>
        Boolean(getLessonById(data.levelId, data.moduleId, data.lessonId));

      let resolved: LastLessonData | null = null;

      try {
        const saved = localStorage.getItem('last_lesson');
        if (saved) {
          const parsed = JSON.parse(saved) as LastLessonData;
          if (
            parsed.levelId === currentLevel.id &&
            parsed.moduleId &&
            parsed.lessonId &&
            isValidLesson(parsed) &&
            !isLessonCompleted(parsed.levelId, parsed.moduleId, parsed.lessonId)
          ) {
            resolved = parsed;
          }
        }
      } catch {
        // Ignore localStorage errors
      }

      if (!resolved) {
        resolved = findFirstIncompleteLessonInLevel(currentLevel, isLessonCompleted);
      }

      if (!resolved) {
        resolved = findLastLessonInLevel(currentLevel);
      }

      setLastLesson(resolved);
      setLoading(false);
    };

    fetchLastLesson();
  }, [user, isLessonCompleted, isLevelCompleted, levels, getLessonById]);

  if (loading) {
    return <CardSkeleton variant="hero" />;
  }

  const handleContinue = () => {
    if (lastLesson) {
      navigate(`/level/${lastLesson.levelId}?module=${lastLesson.moduleId}&lesson=${lastLesson.lessonId}`);
    } else if (levels[0]) {
      navigate(`/level/${levels[0].id}`);
    } else {
      navigate('/dashboard');
    }
  };

  const level = lastLesson ? getLevelById(lastLesson.levelId) : null;
  const module = lastLesson ? getModuleById(lastLesson.levelId, lastLesson.moduleId) : null;
  const lesson = lastLesson ? getLessonById(lastLesson.levelId, lastLesson.moduleId, lastLesson.lessonId) : null;

  // Calculate level progress
  let levelProgress = 0;
  if (level && lastLesson) {
    let totalLessons = 0;
    let completedLessons = 0;
    level.modules.forEach(m => {
      m.lessons.forEach(l => {
        totalLessons++;
        if (isLessonCompleted(lastLesson.levelId, m.id, l.id)) completedLessons++;
      });
    });
    levelProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  }

  const levelDisplayName = level?.title || (lastLesson ? lastLesson.levelId : 'Your course');

  return (
    <div 
      className={cn(
        "relative rounded-2xl overflow-hidden cursor-pointer group touch-manipulation",
        "bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
        "transition-all duration-300 hover:shadow-2xl active:scale-[0.99]"
      )} 
      onClick={handleContinue}
    >
      <div className="relative z-10 p-5 sm:p-8 flex flex-col items-center text-center">
        {/* Welcome Message & Subheading */}
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-300" />
          Back at it!
        </h2>
        <p className="text-sm text-white/75 mb-6 leading-relaxed max-w-xl">Let's crush your next lesson and keep the momentum going.</p>

        {/* Module & Lesson */}
        {module && lesson && (
          <div className="space-y-1 mb-6">
            <p className="flex items-center justify-center gap-2 text-sm text-white/70">
              <BookOpen className="h-3.5 w-3.5" />
              <span className="font-semibold text-white/90">{module.title}</span>
            </p>
            <p className="flex items-center justify-center gap-2 text-sm text-white/70">
              <Play className="h-3.5 w-3.5" />
              <span className="font-semibold text-white/90">{lesson.title}</span>
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="mb-8">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleContinue();
            }}
            aria-label={`Continue learning ${lesson?.title ?? ''}`}
            className={cn(
              "relative inline-flex items-center gap-2 px-6 py-3 rounded-xl",
              "bg-white text-primary font-semibold text-sm",
              "transition-all duration-300 ease-out",
              "hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(255,255,255,0.25)]",
              "active:scale-[0.98]",
              "shadow-lg"
            )}
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              Continue Learning
              <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
            </span>
          </button>
        </div>

        {/* Full-width Level Progress Section */}
        <div className="w-full">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Level Progress</span>
            <span className="text-xs font-semibold text-amber-300">{levelDisplayName}</span>
          </div>
          <AnimatedProgress value={levelProgress} showPulse={false} variant={levelProgress >= 80 ? 'success' : 'default'} className="h-2.5 rounded-full" />
        </div>
      </div>
    </div>
  );
};
