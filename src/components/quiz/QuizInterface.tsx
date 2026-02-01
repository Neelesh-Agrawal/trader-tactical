import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '@/data/courseData';
import { useQuiz } from '@/hooks/useQuiz';
import { Button } from '@/components/ui/button';
import { AnimatedProgress } from '@/components/ui/animated-progress';
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle, Clock, XCircle, Trophy, RotateCcw, Circle } from 'lucide-react';
import { useConfetti } from '@/hooks/useConfetti';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/utils';

interface QuizInterfaceProps {
  questions: Question[];
  quizType: 'lesson' | 'module' | 'level';
  levelId: string;
  moduleId?: string;
  lessonId?: string;
  onComplete?: () => void;
  returnPath: string;
}

export const QuizInterface = ({
  questions,
  quizType,
  levelId,
  moduleId,
  lessonId,
  onComplete,
  returnPath
}: QuizInterfaceProps) => {
  const navigate = useNavigate();
  const { fire } = useConfetti();
  const hasFireRef = useRef(false);
  
  // New state for instant feedback
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    currentAnswer,
    answers,
    timeRemaining,
    isSubmitted,
    isInvalidated,
    invalidationReason,
    score,
    passed,
    progress,
    answeredCount,
    canSubmit,
    isLastQuestion,
    questions: shuffledQuestions,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz
  } = useQuiz({
    questions,
    quizType,
    levelId,
    moduleId,
    lessonId,
    timePerQuestion: quizType === 'lesson' ? 45 : 60,
    passingScore: 80,
    cooldownMinutes: quizType === 'level' ? 0 : 2
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
      fire(intensity);
    }
  }, [isSubmitted, passed, quizType, fire]);

  // Reset feedback state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
  }, [currentQuestionIndex]);

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

  // Handle answer selection with instant feedback
  const handleAnswerSelect = (optionIndex: number) => {
    if (showFeedback) return; // Already showing feedback
    
    setSelectedAnswer(optionIndex);
    selectAnswer(optionIndex);
    
    const correct = optionIndex === currentQuestion.correctIndex;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // If correct, auto-advance after brief delay
    if (correct) {
      setTimeout(() => {
        if (isLastQuestion) {
          submitQuiz();
        } else {
          nextQuestion();
        }
      }, 1000);
    }
  };

  // Handle next question after wrong answer
  const handleNextAfterWrong = () => {
    if (isLastQuestion) {
      submitQuiz();
    } else {
      nextQuestion();
    }
  };

  if (isInvalidated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="tactical-card max-w-md w-full p-8 text-center border-destructive">
          <XCircle className="h-16 w-16 mx-auto mb-6 text-destructive" />
          <h2 className="text-2xl font-bold mb-4">Quiz Invalidated</h2>
          <p className="text-muted-foreground mb-6">{invalidationReason}</p>
          <p className="text-sm text-muted-foreground mb-8">
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
          "tactical-card max-w-lg w-full p-8 text-center animate-scale-in",
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
              <h2 className="text-2xl font-bold mb-2 text-success">Mission Complete!</h2>
              <p className="text-muted-foreground mb-6">
                Outstanding performance, trader.
              </p>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 mx-auto mb-6 text-destructive animate-scale-in" />
              <h2 className="text-2xl font-bold mb-2 text-destructive">Mission Failed</h2>
              <p className="text-muted-foreground mb-6">
                Review the material and try again.
              </p>
            </>
          )}

          <div className="flex justify-center gap-8 mb-8">
            <div className={cn(
              "p-4 rounded-lg",
              passed ? "bg-success/10" : "bg-muted"
            )}>
              <div className="text-4xl font-bold font-mono">{scoreCount}%</div>
              <div className="caption text-muted-foreground">SCORE</div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-4xl font-bold font-mono">{answers.filter((a, i) => a === shuffledQuestions[i].correctIndex).length}/{totalQuestions}</div>
              <div className="caption text-muted-foreground">CORRECT</div>
            </div>
          </div>

          {!passed && (
            <p className="text-sm text-muted-foreground mb-6">
              Required: 80% to pass. Cooldown: {quizType === 'level' ? '3' : '2'} minutes before retry.
            </p>
          )}

          {/* Show answers review */}
          <div className="text-left mb-8 max-h-64 overflow-y-auto scrollbar-tactical">
            {shuffledQuestions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrectAnswer = userAnswer === q.correctIndex;
              
              return (
                <div key={q.id} className={`p-4 mb-2 rounded-lg ${isCorrectAnswer ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  <div className="flex items-start gap-2">
                    {isCorrectAnswer ? (
                      <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">{q.question}</p>
                      {!isCorrectAnswer && (
                        <p className="text-xs text-muted-foreground">
                          Correct: {q.options[q.correctIndex]}
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
              Return
            </Button>
            {!passed && (
              <Button onClick={() => window.location.reload()} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Retry (after cooldown)
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
              <Clock className="h-5 w-5" />
              <span className="mono text-xl font-bold">{timeRemaining}s</span>
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
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold mb-8 leading-relaxed text-foreground">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrectOption = idx === currentQuestion.correctIndex;
            const showCorrectHighlight = showFeedback && isCorrectOption;
            const showWrongHighlight = showFeedback && isSelected && !isCorrectOption;
            
            return (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                disabled={showFeedback}
                className={cn(
                  "w-full p-4 text-left rounded-xl border-2 transition-all duration-200",
                  // Default state
                  !showFeedback && !isSelected && "border-border bg-card hover:border-muted-foreground/50",
                  // Selected but not submitted
                  !showFeedback && isSelected && "border-primary bg-primary/5",
                  // Correct answer highlight (green)
                  showCorrectHighlight && "border-success bg-success/10",
                  // Wrong answer highlight (red)
                  showWrongHighlight && "border-destructive bg-destructive/10",
                  // Disabled state
                  showFeedback && !showCorrectHighlight && !showWrongHighlight && "opacity-60"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 border-2",
                    // Default
                    !showFeedback && !isSelected && "border-muted-foreground/30 text-muted-foreground",
                    // Selected
                    !showFeedback && isSelected && "border-primary text-primary",
                    // Correct
                    showCorrectHighlight && "border-success bg-success text-success-foreground",
                    // Wrong
                    showWrongHighlight && "border-destructive bg-destructive text-destructive-foreground"
                  )}>
                    {showCorrectHighlight ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : showWrongHighlight ? (
                      <XCircle className="h-5 w-5" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation Card - Shows after wrong answer */}
        {showFeedback && !isCorrect && (
          <div className="mt-6 p-4 rounded-xl bg-muted/50 border-l-4 border-primary animate-fade-in">
            <p className="font-semibold text-sm mb-2 text-foreground">Explanation:</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Next Question Button - Shows after wrong answer */}
        {showFeedback && !isCorrect && (
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleNextAfterWrong}
              className="gap-2 px-8"
            >
              {isLastQuestion ? 'View Results' : 'Next Question'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
