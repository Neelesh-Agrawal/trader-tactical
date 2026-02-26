import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { LessonActions } from './LessonActions';
import { LessonFAQs } from './LessonFAQs';
import { ScrollProgressBar } from './ScrollProgressBar';
import { JumpToQuizButton } from './JumpToQuizButton';
import { ReadingTimeRemaining } from './ReadingTimeRemaining';
import { LessonObjectives } from './LessonObjectives';
import { LessonIntelV2 } from './LessonIntelV2';
import { LessonKeyTakeaways } from './LessonKeyTakeaways';
import { ProgressRing } from '@/components/ui/progress-ring';
import { 
  ChevronLeft, Clock, BookOpen, Badge
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lesson, Module } from '@/hooks/useCourses';

interface LessonContentProps {
  lesson: Lesson;
  module: Module;
  levelId: string;
  lessonIndex: number;
  onBack: () => void;
}

export const LessonContent = ({ lesson, module, levelId, lessonIndex, onBack }: LessonContentProps) => {
  const navigate = useNavigate();
  const { updateStreak } = useAuth();
  const { isLessonCompleted } = useProgress();
  const quizRef = useRef<HTMLDivElement>(null);

  // Ensure keyTakeaways and faqs are always arrays
  const keyTakeaways = lesson.keyTakeaways || [];
  const faqs = lesson.faqs || [];

  const isCompleted = isLessonCompleted(levelId, module.id, lesson.id);
  const nextLesson = module.lessons[lessonIndex + 1];

  // Calculate reading time
  const wordCount = lesson.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Calculate module progress
  const completedInModule = module.lessons.filter(l => isLessonCompleted(levelId, module.id, l.id)).length;
  const moduleProgress = Math.round((completedInModule / module.lessons.length) * 100);

  const handleStartQuiz = async () => {
    await updateStreak();
    navigate(`/quiz/lesson/${levelId}/${module.id}/${lesson.id}`);
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      window.location.href = `/level/${levelId}?module=${module.id}&lesson=${nextLesson.id}`;
    } else {
      onBack();
    }
  };

  const handleJumpToQuiz = useCallback(() => {
    quizRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const levelDisplayName = levelId.charAt(0).toUpperCase() + levelId.slice(1);

  return (
    <div className="animate-fade-in">
      <ScrollProgressBar />

      <div className="hidden sm:block">
        <ReadingTimeRemaining totalReadingTime={readingTime} />
      </div>

      <JumpToQuizButton onJumpToQuiz={handleJumpToQuiz} />

      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground active:scale-95 transition-all mb-4 sm:mb-6 py-2 touch-manipulation"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="text-sm sm:text-base">Back to Overview</span>
      </button>

      {/* Content Container */}
      <div className="reading-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span className="px-2 py-0.5 rounded bg-success/10 text-success text-xs font-medium">{levelDisplayName}</span>
          <span>/</span>
          <span>{module.title}</span>
        </div>

        {/* Lesson Title + Progress Ring */}
        <div className="mb-4">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
            {lesson.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readingTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Lesson content
            </span>
          </div>
        </div>

        {/* What You'll Learn */}
        <LessonObjectives objective={lesson.objective} keyTakeaways={keyTakeaways} />

        {/* Main Content */}
        <LessonIntelV2 content={lesson.content} />

        {/* Key Takeaways */}
        <LessonKeyTakeaways takeaways={keyTakeaways} lessonId={lesson.id} />

        {/* FAQs */}
        <LessonFAQs faqs={faqs} />

        {/* Action Buttons */}
        <div ref={quizRef}>
          <LessonActions
            isCompleted={isCompleted}
            hasNextLesson={!!nextLesson}
            onStartQuiz={handleStartQuiz}
            onNextLesson={handleNextLesson}
          />
        </div>
      </div>
    </div>
  );
};
