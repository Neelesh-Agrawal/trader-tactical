import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { supabase } from '@/integrations/supabase/client';
import { getLessonById, getModuleById, getLevelById, courseData } from '@/data/courseData';
import { RippleButton } from '@/components/ui/ripple-button';
import { AnimatedProgress } from '@/components/ui/animated-progress';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { ArrowRight, BookOpen, Clock, Flame, Sparkles, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LastLessonData {
  levelId: string;
  moduleId: string;
  lessonId: string;
}

export const ContinueLearning = () => {
  const { user, profile, streak } = useAuth();
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
        // If no last lesson, find the first incomplete lesson
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
    return <CardSkeleton variant="hero" className="bg-gradient-to-br from-emerald-50/10 to-blue-50/10" />;
  }

  if (!lastLesson) {
    // Show a welcome card for new users
    return (
      <div className={cn(
        "relative rounded-2xl p-8 overflow-hidden",
        "bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-blue-500/10",
        "border border-emerald-500/20"
      )}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <span className="font-ui text-sm font-medium text-emerald-600">START YOUR JOURNEY</span>
          </div>
          
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 text-foreground">
            Welcome to TradeMaster, {profile?.name?.split(' ')[0]}!
          </h2>
          
          <p className="font-body text-muted-foreground mb-6 max-w-xl" style={{ lineHeight: '1.75' }}>
            Begin your journey to becoming a certified options trader. Start with the fundamentals and work your way up.
          </p>

          <RippleButton 
            size="lg" 
            className="gap-2 bg-success hover:bg-success/90 text-success-foreground shadow-lg"
            onClick={() => navigate('/level/beginner')}
          >
            <Play className="h-5 w-5" />
            Start Learning
          </RippleButton>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-emerald-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
      </div>
    );
  }

  const level = getLevelById(lastLesson.levelId);
  const module = getModuleById(lastLesson.levelId, lastLesson.moduleId);
  const lesson = getLessonById(lastLesson.levelId, lastLesson.moduleId, lastLesson.lessonId);

  if (!level || !module || !lesson) return null;

  const lessonIndex = module.lessons.findIndex(l => l.id === lastLesson.lessonId);
  const totalLessons = module.lessons.length;
  const moduleProgress = Math.round(((lessonIndex) / totalLessons) * 100);

  // Estimate reading time (avg 200 words per minute)
  const wordCount = lesson.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Get module icon
  const moduleIcon = module.icon || '📚';

  const handleContinue = () => {
    navigate(`/level/${lastLesson.levelId}?module=${lastLesson.moduleId}&lesson=${lastLesson.lessonId}`);
  };

  return (
    <div 
      className={cn(
        "relative rounded-2xl p-6 md:p-8 overflow-hidden cursor-pointer group",
        "bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-blue-500/10",
        "border border-emerald-500/20 hover:border-emerald-500/40",
        "transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10"
      )} 
      onClick={handleContinue}
    >
      {/* Streak Badge - Top Right */}
      {streak && streak.current_streak > 0 && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/20 border border-warning/30 group-hover:scale-110 transition-transform duration-300">
          <Flame className="h-4 w-4 text-warning animate-streak-pulse" />
          <span className="font-mono text-sm font-bold text-warning">{streak.current_streak}</span>
          <span className="text-xs text-warning/80 hidden sm:inline">day streak</span>
        </div>
      )}

      <div className="relative z-10">
        {/* Welcome Message */}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <span className="font-ui text-sm font-medium text-emerald-600 uppercase tracking-wide">Continue Learning</span>
        </div>
        
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2 text-foreground">
          Welcome back, {profile?.name?.split(' ')[0]}! 👋
        </h2>

        {/* Last Lesson Info */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{moduleIcon}</span>
          <div>
            <p className="font-ui text-sm text-muted-foreground">You were learning:</p>
            <p className="font-body text-lg font-medium text-foreground group-hover:text-emerald-600 transition-colors">
              {lesson.title}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 max-w-md">
          <div className="flex justify-between items-center mb-2">
            <span className="font-ui text-sm text-muted-foreground">
              {module.title} • Lesson {lessonIndex + 1} of {totalLessons}
            </span>
            <span className="font-mono text-sm font-medium text-success">{moduleProgress}%</span>
          </div>
          <AnimatedProgress value={moduleProgress} className="h-2" variant="success" />
        </div>

        {/* Meta Info & Button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readingTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span className="capitalize">{level.id} Level</span>
            </span>
          </div>

          <RippleButton 
            size="lg" 
            className={cn(
              "gap-2 sm:ml-auto",
              "bg-success hover:bg-success/90 text-success-foreground",
              "shadow-lg",
              "transition-all duration-300 group-hover:gap-3"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleContinue();
            }}
          >
            <Play className="h-5 w-5" />
            Continue Learning
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </RippleButton>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-emerald-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
    </div>
  );
};
