import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

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
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 pb-8">
        {!isCompleted ? (
          <Button size="lg" onClick={onStartQuiz} className="gap-2 text-lg px-8">
            Begin Execution (Quiz) <ArrowRight className="h-5 w-5" />
          </Button>
        ) : (
          <>
            <Button size="lg" variant="outline" onClick={onStartQuiz}>
              Retake Quiz
            </Button>
            <Button size="lg" onClick={onNextLesson} className="gap-2">
              {hasNextLesson ? (
                <>Next Lesson <ArrowRight className="h-5 w-5" /></>
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
