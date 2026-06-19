import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AnimatedSection } from '@/components/landing/AnimatedSection';

interface LessonActionsProps {
  isCompleted: boolean;
  hasNextLesson: boolean;
  onStartQuiz: () => void;
  onNextLesson: () => void;
}

export const LessonActions = ({ 
  isCompleted, 
  hasNextLesson, 
  onStartQuiz, 
  onNextLesson 
}: LessonActionsProps) => {
  return (
    <AnimatedSection>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-12 pb-6 sm:pb-8">
        {!isCompleted ? (
          <Button 
            size="lg" 
            onClick={onStartQuiz} 
            className="gap-2 text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 touch-manipulation w-full sm:w-auto"
          >
            Begin Execution (Quiz) <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        ) : (
          <>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={onStartQuiz}
              className="h-11 sm:h-12 touch-manipulation w-full sm:w-auto"
            >
              Retake Quiz
            </Button>
            <Button 
              size="lg" 
              onClick={onNextLesson} 
              className="gap-2 h-11 sm:h-12 touch-manipulation w-full sm:w-auto"
            >
              {hasNextLesson ? (
                <>Next Lesson <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" /></>
              ) : (
                'Back to Overview'
              )}
            </Button>
          </>
        )}
      </div>
    </AnimatedSection>
  );
};
