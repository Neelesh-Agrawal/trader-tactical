import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '@/hooks/useCourses';
import { useQuiz } from '@/hooks/useQuiz';
import { Button } from '@/components/ui/button';
import { AnimatedProgress } from '@/components/ui/animated-progress';
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle, Clock, XCircle, Trophy, RotateCcw, Circle } from 'lucide-react';
import { useConfetti } from '@/hooks/useConfetti';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/utils';
import { stripHtml } from '@/components/lesson/html';

interface QuizInterfaceProps {
  questions: Question[];
  quizType: 'lesson' | 'module' | 'level';
  levelId: string;
  moduleId?: string;
  lessonId?: string;
  returnPath: string;
  continuePath?: string;
  continueLabel?: string;
  quizId?: number;
  passPercentage?: number;
  timePerQuestion?: number;
}

export const QuizInterface = ({
  questions,
  quizType,
  levelId,
  moduleId,
  lessonId,
  returnPath,
  continuePath = returnPath,
  continueLabel = 'Continue Learning',
  quizId,
  passPercentage = 80,
  timePerQuestion = 45
}: QuizInterfaceProps) => {
  const navigate = useNavigate();
  const { fire } = useConfetti();
  const hasFireRef = useRef(false);

  // New state for instant feedback
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    timeRemaining,
    isSubmitted,
    isInvalidated,
    invalidationReason,
    score,
    passed,
    correctAnswers,
    progress,
    isLastQuestion,
    isReviewingAnswer,
    questions: shuffledQuestions,
    selectAnswer,
    nextQuestion,
    submitQuiz
  } = useQuiz({
    questions,
    quizType,
    levelId,
    moduleId,
    lessonId,
    timePerQuestion: quizType === 'lesson' ? 45 : (timePerQuestion || 60),
    passingScore: passPercentage,
    cooldownMinutes: quizType === 'level' ? 0 : 2,
    quizId
  });

  const { count: scoreCount } = useCountUp({
    end: isSubmitted ? score : 0,
    duration: 1000,
    delay: 300
  });

  useEffect(() => {
    if (isSubmitted && passed && !hasFireRef.current) {
      hasFireRef.current = true;
      const intensity = quizType === 'level' ? 'high' : quizType === 'module' ? 'high' : 'medium';
      void fire(intensity);
    }
  }, [isSubmitted, passed, quizType, fire]);

  // Reset local selection highlight when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, [currentQuestionIndex]);

  // Sync feedback UI with hook review state (e.g. after selectAnswer)
  useEffect(() => {
    if (isReviewingAnswer) {
      setShowFeedback(true);
    }
  }, [isReviewingAnswer]);

  // Warn about leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSubmitted && !isInvalidated) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitted, isInvalidated]);

  const getTimerColor = () => {
    if (timeRemaining <= 10) return 'text-destructive timer-critical';
    if (timeRemaining <= 20) return 'text-warning';
    return 'text-foreground';
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (showFeedback || isReviewingAnswer) return;

    setSelectedAnswer(optionIndex);
    selectAnswer(optionIndex);
    setShowFeedback(true);
  };

  const handleContinue = () => {
    if (isLastQuestion) {
      void submitQuiz();
    } else {
      nextQuestion();
    }
  };

  const explanationText = stripHtml(currentQuestion?.explanation || '');
  const selectedIsCorrect =
    selectedAnswer !== null &&
    currentQuestion != null &&
    selectedAnswer === currentQuestion.correctIndex;

  if (isInvalidated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="tactical-card max-w-md w-full p-8 text-center border-destructive">
          <XCircle className="h-16 w-16 mx-auto mb-6 text-destructive" />
          <h2 className="text-xl md:text-2xl font-bold mb-4">Quiz Invalidated</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6">{invalidationReason}</p>
          <p className="text-xs md:text-sm text-muted-foreground mb-8">
            This attempt has been recorded. You may retry after the cooldown period.
          </p>
          <Button onClick={() => navigate(returnPath)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return
          </Button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className={cn(
          "tactical-card max-w-lg w-full p-5 sm:p-8 text-center animate-scale-in",
          passed ? "border-success" : "border-destructive"
        )}>
          {passed ? (
            <>
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-success/20 rounded-full animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trophy className="h-12 w-12 text-warning animate-bounce-in" />
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-success">Mission Complete!</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                Outstanding performance, trader.
              </p>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 mx-auto mb-6 text-destructive animate-scale-in" />
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-destructive">Mission Failed</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                Review the material and try again.
              </p>
            </>
          )}

          <div className="flex justify-center gap-4 sm:gap-8 mb-6 sm:mb-8">
            <div className={cn(
              "p-3 sm:p-4 rounded-lg",
              passed ? "bg-success/10" : "bg-muted"
            )}>
              <div className="text-3xl md:text-4xl font-bold font-mono">{scoreCount}%</div>
              <div className="caption text-muted-foreground">SCORE</div>
            </div>
            <div className="p-3 sm:p-4 rounded-lg bg-muted">
              <div className="text-3xl md:text-4xl font-bold font-mono">
                {Math.round((score / 100) * totalQuestions)}/{totalQuestions}
              </div>
              <div className="caption text-muted-foreground">CORRECT</div>
            </div>
          </div>



          {/* Show answers review */}
          <div className="text-left mb-8 max-h-64 overflow-y-auto scrollbar-tactical">
            {shuffledQuestions.map((q, idx) => {
              const userAnswer = answers[idx];
              const selectedOptionId = userAnswer !== null ? parseInt(q.options[userAnswer]?.id || '0', 10) : null;
              const correctOptionId = correctAnswers[q.id];
              const correctOption = q.options.find((option) => parseInt(option.id, 10) === correctOptionId);
              const isCorrectAnswer = selectedOptionId !== null && selectedOptionId === correctOptionId;

              return (
                <div key={q.id} className={`p-4 mb-2 rounded-lg ${isCorrectAnswer ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  <div className="flex items-start gap-2">
                    {isCorrectAnswer ? (
                      <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-[14px] md:text-[15px] font-medium leading-relaxed mb-1">{stripHtml(q.question)}</p>
                      {!isCorrectAnswer && (
                        <div className="space-y-1.5">
                          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                            Correct: {correctOption ? stripHtml(correctOption.text) : 'Unavailable'}
                          </p>
                          {q.explanation && stripHtml(q.explanation) && (
                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                              Explanation: {stripHtml(q.explanation)}
                            </p>
                          )}
                        </div>
                      )}
                      {stripHtml(q.explanation || '') && (
                        <p className="text-xs md:text-sm text-muted-foreground/90 mt-1 leading-relaxed">
                          {stripHtml(q.explanation)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate(returnPath)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            {passed ? (
              <Button
                onClick={() => {
                  if (quizType === 'level') {
                    navigate(`/level/${levelId}/final`);
                  } else {
                    navigate(continuePath);
                  }
                }}
                className="gap-2"
              >
                {quizType === 'level' ? 'Claim Certificate' : continueLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => window.location.reload()} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Quiz Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="caption text-muted-foreground">
                {quizType.toUpperCase()} QUIZ
              </div>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-2 ${getTimerColor()}`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono text-[14px] font-bold">{timeRemaining}s</span>
            </div>
          </div>

          {/* Progress bar */}
          <AnimatedProgress value={progress} className="mt-3 h-2" />
        </div>
      </header>

      {/* Warning Banner */}
      <div className="bg-warning/10 border-b border-warning/20 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-warning text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>Do not switch tabs or windows. Quiz will be invalidated.</span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <span className="text-[12px] text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>

        <h2 className="text-[16px] md:text-[24px] font-bold mb-6 md:mb-8 leading-relaxed text-foreground">
          {stripHtml(currentQuestion.question)}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrectOption = idx === currentQuestion.correctIndex;
            const showAsCorrect = showFeedback && isCorrectOption;
            const showAsWrong = showFeedback && isSelected && !isCorrectOption;

            return (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                disabled={showFeedback}
                className={cn(
                  "w-full p-4 text-left rounded-xl border-2 transition-all duration-200",
                  !showFeedback && !isSelected && "border-border bg-card hover:border-muted-foreground/50",
                  !showFeedback && isSelected && "border-primary bg-primary/5",
                  showAsCorrect && "border-success bg-success/10",
                  showAsWrong && "border-destructive bg-destructive/10",
                  showFeedback && !isSelected && !isCorrectOption && "opacity-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 border-2",
                    !showFeedback && !isSelected && "border-muted-foreground/30 text-muted-foreground",
                    !showFeedback && isSelected && "border-primary text-primary",
                    showAsCorrect && "border-success text-success",
                    showAsWrong && "border-destructive text-destructive"
                  )}>
                    {showAsCorrect ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : showAsWrong ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </div>
                  <span className="flex-1 text-[14px] leading-relaxed">{stripHtml(option.text)}</span>
                </div>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div
            className={cn(
              "mt-6 rounded-xl border p-4 text-left animate-scale-in",
              selectedIsCorrect
                ? "border-success/40 bg-success/10"
                : "border-destructive/40 bg-destructive/10"
            )}
          >
            <div className="flex items-start gap-2 mb-2">
              {selectedIsCorrect ? (
                <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              )}
              <p className={cn(
                "font-semibold text-sm md:text-base",
                selectedIsCorrect ? "text-success" : "text-destructive"
              )}>
                {selectedIsCorrect ? 'Correct!' : 'Incorrect'}
              </p>
            </div>
            {explanationText ? (
              <p className="text-sm md:text-[15px] text-foreground/90 leading-relaxed pl-7">
                {explanationText}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground pl-7">
                {selectedIsCorrect
                  ? 'Nice work — keep going.'
                  : 'Review this concept and try to remember it for next time.'}
              </p>
            )}

            <div className="mt-4 flex justify-end pl-7">
              <Button onClick={handleContinue} className="gap-2">
                {isLastQuestion ? 'See Results' : 'Next Question'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
