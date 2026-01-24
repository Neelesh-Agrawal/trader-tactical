import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '@/data/courseData';
import { useQuiz } from '@/hooks/useQuiz';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle, Clock, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { Confetti } from '@/components/ui/confetti';

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
  const [showConfetti, setShowConfetti] = useState(false);

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
    cooldownMinutes: quizType === 'level' ? 3 : 2
  });

  useEffect(() => {
    if (isSubmitted && passed && quizType === 'level') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [isSubmitted, passed, quizType]);

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
        {showConfetti && <Confetti />}
        
        <div className={`tactical-card max-w-lg w-full p-8 text-center ${passed ? 'border-success' : 'border-destructive'}`}>
          {passed ? (
            <>
              <Trophy className="h-16 w-16 mx-auto mb-6 text-warning" />
              <h2 className="text-2xl font-bold mb-2 text-success">Mission Complete!</h2>
              <p className="text-muted-foreground mb-6">
                Outstanding performance, trader.
              </p>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 mx-auto mb-6 text-destructive" />
              <h2 className="text-2xl font-bold mb-2 text-destructive">Mission Failed</h2>
              <p className="text-muted-foreground mb-6">
                Review the material and try again.
              </p>
            </>
          )}

          <div className="flex justify-center gap-8 mb-8">
            <div>
              <div className="text-4xl font-bold">{score}%</div>
              <div className="caption text-muted-foreground">SCORE</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{answers.filter((a, i) => a === shuffledQuestions[i].correctIndex).length}/{totalQuestions}</div>
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
              const isCorrect = userAnswer === q.correctIndex;
              
              return (
                <div key={q.id} className={`p-4 mb-2 rounded-lg ${isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">{q.question}</p>
                      {!isCorrect && (
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
              <div className="mono text-sm">
                Q{currentQuestionIndex + 1}/{totalQuestions}
              </div>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-2 ${getTimerColor()}`}>
              <Clock className="h-5 w-5" />
              <span className="mono text-xl font-bold">{timeRemaining}s</span>
            </div>

            <div className="mono text-sm text-muted-foreground">
              {answeredCount}/{totalQuestions} answered
            </div>
          </div>
          
          {/* Progress bar */}
          <Progress value={progress} className="mt-3 h-2" />
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
        <div className="tactical-card p-8 mb-8 animate-fade-in">
          <h2 className="text-xl md:text-2xl font-bold mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => selectAnswer(idx)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  currentAnswer === idx
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-card/80'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${
                    currentAnswer === idx
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalQuestions }).map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  answers[idx] !== null ? 'bg-success' :
                  idx === currentQuestionIndex ? 'bg-primary' :
                  'bg-muted'
                }`}
              />
            ))}
          </div>

          {isLastQuestion ? (
            <Button
              onClick={submitQuiz}
              disabled={!canSubmit}
              className="gap-2"
            >
              Submit Quiz
              <CheckCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              className="gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
