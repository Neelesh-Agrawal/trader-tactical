import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getLessonById, getModuleById, getLevelById } from '@/data/courseData';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/ui/progress-ring';
import { ArrowRight, BookOpen, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LastLessonData {
  levelId: string;
  moduleId: string;
  lessonId: string;
}

export const ContinueLearning = () => {
  const { user } = useAuth();
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
      }
      setLoading(false);
    };

    fetchLastLesson();
  }, [user]);

  if (loading) {
    return (
      <div className="tactical-card p-6 animate-pulse">
        <div className="h-24 bg-muted/30 rounded-lg"></div>
      </div>
    );
  }

  if (!lastLesson) {
    return null;
  }

  const level = getLevelById(lastLesson.levelId);
  const module = getModuleById(lastLesson.levelId, lastLesson.moduleId);
  const lesson = getLessonById(lastLesson.levelId, lastLesson.moduleId, lastLesson.lessonId);

  if (!level || !module || !lesson) return null;

  const lessonIndex = module.lessons.findIndex(l => l.id === lastLesson.lessonId);
  const totalLessons = module.lessons.length;
  const moduleProgress = Math.round(((lessonIndex + 1) / totalLessons) * 100);

  // Estimate reading time (avg 200 words per minute)
  const wordCount = lesson.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleContinue = () => {
    navigate(`/level/${lastLesson.levelId}?module=${lastLesson.moduleId}&lesson=${lastLesson.lessonId}`);
  };

  return (
    <div className={cn(
      "tactical-card p-6 relative overflow-hidden",
      "bg-gradient-to-br from-card via-card to-primary/5",
      "border-primary/30 hover:border-primary/50 transition-all duration-300",
      "group cursor-pointer"
    )} onClick={handleContinue}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex items-center gap-6">
        {/* Progress Ring */}
        <div className="shrink-0 hidden sm:block">
          <ProgressRing 
            progress={moduleProgress} 
            size={72} 
            strokeWidth={5}
            showPercentage={false}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-warning" />
            <span className="caption text-warning">CONTINUE LEARNING</span>
          </div>
          
          <h3 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors">
            {lesson.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-3">
            {module.title} • Lesson {lessonIndex + 1} of {totalLessons}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readingTime} min read
            </span>
            <span className="capitalize">{level.id} Level</span>
          </div>
        </div>

        {/* Action */}
        <div className="shrink-0">
          <Button 
            size="lg" 
            className="gap-2 group-hover:gap-3 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              handleContinue();
            }}
          >
            Resume
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
