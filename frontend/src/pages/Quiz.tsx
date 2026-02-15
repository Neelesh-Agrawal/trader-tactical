import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { useCourses } from '@/hooks/useCourses';
import { QuizInterface } from '@/components/quiz/QuizInterface';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, AlertTriangle, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

const Quiz = () => {
  const { quizType, levelId, moduleId, lessonId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { getCooldownRemaining, loading: progressLoading } = useProgress();
  const { fetchQuiz, loading: coursesLoading } = useCourses();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [quizData, setQuizData] = useState<{
    questions: any[];
    quizInfo: { id: number; passPercentage: number; timeLimit: number; cooldown: number };
  } | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [quizError, setQuizError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizType || !levelId) {
        setLoadingQuiz(false);
        return;
      }

      setLoadingQuiz(true);
      setQuizError(null);

      try {
        const data = await fetchQuiz(
          quizType as 'lesson' | 'module' | 'level',
          levelId,
          moduleId,
          lessonId
        );

        if (data) {
          setQuizData(data);
        } else {
          setQuizError('Quiz not found');
        }
      } catch (err) {
        console.error('Failed to load quiz:', err);
        setQuizError('Failed to load quiz');
      } finally {
        setLoadingQuiz(false);
      }
    };

    loadQuiz();
  }, [quizType, levelId, moduleId, lessonId, fetchQuiz]);

  useEffect(() => {
    if (quizType && levelId && quizData?.quizInfo) {
      const remaining = getCooldownRemaining(quizType, levelId, moduleId);
      setCooldown(remaining);

      if (remaining > 0) {
        const interval = setInterval(() => {
          setCooldown(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [quizType, levelId, moduleId, quizData?.quizInfo, getCooldownRemaining]);

  if (authLoading || progressLoading || coursesLoading || loadingQuiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mono text-muted-foreground">PREPARING ASSESSMENT...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!quizType || !levelId || !['lesson', 'module', 'level'].includes(quizType)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (quizError || !quizData) {
    return <Navigate to="/dashboard" replace />;
  }

  const questions = quizData.questions;
  const quizInfo = quizData.quizInfo;
  let returnPath = '/dashboard';
  let quizTitle = '';

  if (quizType === 'lesson' && moduleId && lessonId) {
    returnPath = `/lesson/${levelId}/${moduleId}/${lessonId}`;
    quizTitle = 'Lesson Quiz';
  } else if (quizType === 'module' && moduleId) {
    returnPath = `/module/${levelId}/${moduleId}`;
    quizTitle = 'Module Final';
  } else if (quizType === 'level') {
    returnPath = '/dashboard';
    quizTitle = 'Level Assessment';
  }

  if (questions.length === 0) {
    return <Navigate to={returnPath} replace />;
  }

  if (cooldown > 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="tactical-card max-w-md w-full p-8 text-center border-warning">
          <Clock className="h-16 w-16 mx-auto mb-6 text-warning animate-pulse" />
          <h2 className="text-2xl font-bold mb-4">Cooldown Active</h2>
          <p className="text-muted-foreground mb-6">
            You must wait before retrying this quiz.
          </p>
          <div className="text-4xl font-bold mono text-warning mb-8">
            {Math.floor(cooldown / 60)}:{(cooldown % 60).toString().padStart(2, '0')}
          </div>
          <Button variant="outline" onClick={() => navigate(returnPath)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return
          </Button>
        </div>
      </div>
    );
  }

  if (!accepted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="tactical-card max-w-lg w-full p-8 border-primary">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">{quizTitle}</h2>
            <p className="text-muted-foreground">
              Review the rules before proceeding
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Tab Switching Detection</p>
                <p className="text-sm text-muted-foreground">
                  Switching tabs or windows will immediately invalidate your quiz.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Time Limit</p>
                <p className="text-sm text-muted-foreground">
                  {quizInfo.timeLimit} seconds per question. Timer auto-advances on timeout.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg">
              <Shield className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Passing Score: {quizInfo.passPercentage}%</p>
                <p className="text-sm text-muted-foreground">
                  Questions and options are randomized each attempt.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate(returnPath)} className="flex-1 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={() => setAccepted(true)} className="flex-1">
              Begin Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QuizInterface
      questions={questions}
      quizType={quizType as 'lesson' | 'module' | 'level'}
      levelId={levelId}
      moduleId={moduleId}
      lessonId={lessonId}
      returnPath={returnPath}
      quizId={quizInfo.id}
      passPercentage={quizInfo.passPercentage}
      timePerQuestion={quizInfo.timeLimit}
    />
  );
};

export default Quiz;
