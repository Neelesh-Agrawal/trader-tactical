import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { supabase } from '@/integrations/supabase/client';
import { getLessonById, getModuleById, getLevelById, courseData } from '@/data/courseData';
import { AnimatedProgress } from '@/components/ui/animated-progress';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { ArrowRight, BookOpen, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LastLessonData {
  levelId: string;
  moduleId: string;
  lessonId: string;
}

export const ContinueLearning = () => {
  const { user, profile } = useAuth();
  const { isLessonCompleted } = useProgress();
  const navigate = useNavigate();
  const [lastLesson, setLastLesson] = useState<LastLessonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastLesson = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('last_lesson_level_id, last_lesson_module_id, last_lesson_id')
        .eq('user_id', user.id)
        .single();

      if (data?.last_lesson_id) {
        setLastLesson({
          levelId: data.last_lesson_level_id,
          moduleId: data.last_lesson_module_id,
          lessonId: data.last_lesson_id
        });
      } else {
        for (const level of courseData) {
          for (const module of level.modules) {
            for (const lesson of module.lessons) {
              if (!isLessonCompleted(level.id, module.id, lesson.id)) {
                setLastLesson({
                  levelId: level.id,
                  moduleId: module.id,
                  lessonId: lesson.id
                });
                setLoading(false);
                return;
              }
            }
          }
        }
      }
      setLoading(false);
    };

    fetchLastLesson();
  }, [user, isLessonCompleted]);

  if (loading) {
    return <CardSkeleton variant="hero" />;
  }

  const handleContinue = () => {
    if (lastLesson) {
      navigate(`/level/${lastLesson.levelId}?module=${lastLesson.moduleId}&lesson=${lastLesson.lessonId}`);
    } else {
      navigate('/level/beginner');
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

  const levelDisplayName = level ? level.id.charAt(0).toUpperCase() + level.id.slice(1) : 'Beginner';

  return (
    <div 
      className={cn(
        "relative rounded-2xl overflow-hidden cursor-pointer group touch-manipulation",
        "bg-gradient-to-r from-[hsl(210,60%,20%)] via-[hsl(200,50%,25%)] to-[hsl(175,45%,35%)]",
        "transition-all duration-300 hover:shadow-2xl active:scale-[0.99]"
      )} 
      onClick={handleContinue}
    >
      <div className="relative z-10 p-5 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Left side - Info */}
        <div className="flex-1 min-w-0">
          {/* Welcome Message */}
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">
            Welcome back, {profile?.name?.split(' ')[0] || 'Learner'}!
          </h2>
          <p className="text-sm text-white/60 mb-4">Continue your {levelDisplayName} level journey</p>

          {/* Module & Lesson */}
          {module && lesson && (
            <div className="space-y-1 mb-5">
              <p className="flex items-center gap-2 text-sm text-white/70">
                <BookOpen className="h-3.5 w-3.5" />
                Module: <span className="font-semibold text-white/90">{module.title}</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-white/70">
                <Play className="h-3.5 w-3.5" />
                Lesson: <span className="font-semibold text-white/90">{lesson.title}</span>
              </p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="max-w-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">Level Progress</span>
              <span className="text-xs font-mono font-medium text-white/80">{levelProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div 
                className="h-full rounded-full bg-white/80 transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right side - CTA */}
        <div className="lg:text-right shrink-0">
          {lesson && (
            <div className="hidden lg:block mb-3">
              <span className="text-xs text-white/50">Pick up where you left off</span>
              <p className="text-sm font-semibold text-white">{lesson.title}</p>
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleContinue();
            }}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-xl",
              "bg-white text-[hsl(210,60%,20%)] font-semibold text-sm",
              "hover:bg-white/95 transition-all duration-200",
              "shadow-lg hover:shadow-xl",
              "w-full sm:w-auto justify-center"
            )}
          >
            Continue Learning
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
