import { useRef, useCallback, useEffect } from 'react';
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
import { extractParagraphText, getLessonReadTimeMinutes } from './html';
import { LessonKeyTakeaways } from './LessonKeyTakeaways';
import { LessonRichSection } from './LessonRichSection';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, Clock, BookOpen, ArrowRight, AlertTriangle, Wrench
} from 'lucide-react';
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

  const keyTakeaways = extractParagraphText(lesson.key_takeaway);
  const faqs = lesson.faqs || [];

  const isCompleted = isLessonCompleted(levelId, module.id, lesson.id);
  const nextLesson = module.lessons[lessonIndex + 1];
  const readingTime = getLessonReadTimeMinutes(lesson.estimated_time_minutes);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [lesson.id]);


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

        {/* Learning Objectives */}
        <LessonObjectives objective={lesson.lesson_objective} />

        {/* Content */}
        <div className="tactical-card p-5 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 shrink-0 text-primary" />
            <h2 className="subheader text-[17px] md:text-[18px]">Content</h2>
          </div>
          <LessonIntelV2 content={lesson.content} />
        </div>

        {/* Common Mistakes */}
        <LessonRichSection
          title="Common Mistakes"
          html={lesson.common_mistakes}
          icon={AlertTriangle}
          iconClassName="text-warning"
        />

        {/* Key Takeaways */}
        {keyTakeaways.length > 0 && <LessonKeyTakeaways takeaways={keyTakeaways} />}

        {/* FAQs */}
        <LessonFAQs faqs={faqs} />

        {/* Practical Task */}
        <LessonRichSection
          title="Practical Task"
          html={lesson.practical_task}
          icon={Wrench}
        />

        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {isCompleted ? 'Quiz completed. You can retake it anytime.' : 'Ready when you are: take the lesson quiz.'}
          </p>
          <Button
            size="lg"
            variant={isCompleted ? 'outline' : 'success'}
            onClick={handleStartQuiz}
            className="gap-2 w-full sm:w-auto"
          >
            {isCompleted ? 'Retake Quiz' : 'Start Lesson Quiz'}
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

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
