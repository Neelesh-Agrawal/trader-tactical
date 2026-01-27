import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { Button } from '@/components/ui/button';
import { LessonHeader } from './LessonHeader';
import { LessonIntel } from './LessonIntel';
import { LessonActions } from './LessonActions';
import { ChecklistTakeaways } from './ChecklistTakeaways';
import { LessonFAQs } from './LessonFAQs';
import { ScrollProgressBar } from './ScrollProgressBar';
import { JumpToQuizButton } from './JumpToQuizButton';
import { ReadingTimeRemaining } from './ReadingTimeRemaining';
import { 
  Target, ChevronLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lesson, Module } from '@/data/courseData';

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

  const isCompleted = isLessonCompleted(levelId, module.id, lesson.id);
  const nextLesson = module.lessons[lessonIndex + 1];

  // Calculate reading time
  const wordCount = lesson.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

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

  return (
    <div className="animate-fade-in">
      {/* Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* Reading Time Remaining - Hidden on very small screens */}
      <div className="hidden sm:block">
        <ReadingTimeRemaining totalReadingTime={readingTime} />
      </div>

      {/* Jump to Quiz Button */}
      <JumpToQuizButton onJumpToQuiz={handleJumpToQuiz} />

      {/* Back Button - Touch friendly */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground active:scale-95 transition-all mb-4 sm:mb-6 py-2 touch-manipulation"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="text-sm sm:text-base">Back to Overview</span>
      </button>

      {/* Content Container - Full width on mobile, optimized on larger screens */}
      <div className="reading-container">
        {/* Lesson Header */}
        <LessonHeader
          lesson={lesson}
          module={module}
          lessonIndex={lessonIndex}
          readingTime={readingTime}
          isCompleted={isCompleted}
        />

        {/* Mission Briefing */}
        <div className={cn(
          "tactical-card p-4 sm:p-6 mb-6 sm:mb-8 border-l-4 border-l-primary",
          "bg-gradient-to-r from-primary/5 to-transparent"
        )}>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="subheader text-sm sm:text-base">Mission Briefing</span>
          </div>
          <p className="font-body text-base sm:text-lg text-muted-foreground" style={{ lineHeight: '1.75' }}>
            {lesson.objective}
          </p>
        </div>

        {/* Intel Section with Scroll Animations */}
        <LessonIntel content={lesson.content} />

        {/* Key Takeaways */}
        <ChecklistTakeaways 
          takeaways={lesson.keyTakeaways}
          lessonId={lesson.id}
        />

        {/* FAQs */}
        <LessonFAQs faqs={lesson.faqs} />

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
