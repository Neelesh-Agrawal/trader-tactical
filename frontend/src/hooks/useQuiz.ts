import { useState, useEffect, useCallback, useRef } from 'react';
import { Question } from '@/hooks/useCourses';
import { useProgress } from '@/hooks/useProgress';
import { apiFetch } from '@/lib/api';

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: (number | null)[];
  timeRemaining: number;
  isSubmitted: boolean;
  isInvalidated: boolean;
  invalidationReason: string | null;
  score: number;
  passed: boolean;
  startTime: number;
}

interface UseQuizOptions {
  questions: Question[];
  quizType: 'lesson' | 'module' | 'level';
  levelId: string;
  moduleId?: string;
  lessonId?: string;
  timePerQuestion?: number; // seconds
  passingScore?: number; // percentage
  cooldownMinutes?: number;
  quizId?: number;
}

// Fisher-Yates shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Shuffle question options while tracking the correct answer
const shuffleQuestionOptions = (question: Question): { question: Question; correctIndex: number } => {
  const optionsWithIndices = question.options.map((opt, idx) => ({ opt, originalIndex: idx }));
  const shuffledOptions = shuffleArray(optionsWithIndices);
  
  const newCorrectIndex = shuffledOptions.findIndex(o => o.originalIndex === question.correctIndex);
  
  return {
    question: {
      ...question,
      options: shuffledOptions.map(o => o.opt),
      correctIndex: newCorrectIndex
    },
    correctIndex: newCorrectIndex
  };
};

export const useQuiz = ({
  questions,
  quizType,
  levelId,
  moduleId,
  lessonId,
  timePerQuestion = 45,
  passingScore = 80,
  cooldownMinutes = 2,
  quizId
}: UseQuizOptions) => {
  const { recordQuizAttempt, setCooldown, markLessonComplete, markModuleComplete, unlockNextModule, markLevelComplete, unlockNextLevel } = useProgress();
  
  // Randomize questions and options on mount
  const [shuffledQuestions] = useState(() => {
    const shuffledQs = shuffleArray(questions);
    return shuffledQs.map(q => shuffleQuestionOptions(q).question);
  });

  const [state, setState] = useState<QuizState>({
    questions: shuffledQuestions,
    currentQuestionIndex: 0,
    answers: new Array(shuffledQuestions.length).fill(null),
    timeRemaining: timePerQuestion,
    isSubmitted: false,
    isInvalidated: false,
    invalidationReason: null,
    score: 0,
    passed: false,
    startTime: Date.now()
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const tabSwitchCountRef = useRef(0);
  const answersRef = useRef<(number | null)[]>(new Array(shuffledQuestions.length).fill(null));

  // Timer countdown
  useEffect(() => {
    if (state.isSubmitted || state.isInvalidated) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          // Time's up - move to next question or submit
          if (prev.currentQuestionIndex < prev.questions.length - 1) {
            return {
              ...prev,
              currentQuestionIndex: prev.currentQuestionIndex + 1,
              timeRemaining: timePerQuestion
            };
          } else {
            // Auto-submit on last question timeout
            return prev; // Will be handled by autoSubmit
          }
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.currentQuestionIndex, state.isSubmitted, state.isInvalidated, timePerQuestion]);

  // Tab switching detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !state.isSubmitted && !state.isInvalidated) {
        tabSwitchCountRef.current += 1;
        
        if (tabSwitchCountRef.current >= 1) {
          // Invalidate quiz on first tab switch
          setState(prev => ({
            ...prev,
            isInvalidated: true,
            invalidationReason: 'Tab switching detected. Quiz invalidated for security.'
          }));
        }
      }
    };

    const handleBlur = () => {
      if (!state.isSubmitted && !state.isInvalidated) {
        tabSwitchCountRef.current += 1;
        
        if (tabSwitchCountRef.current >= 1) {
          setState(prev => ({
            ...prev,
            isInvalidated: true,
            invalidationReason: 'Window focus lost. Quiz invalidated for security.'
          }));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [state.isSubmitted, state.isInvalidated]);

  const selectAnswer = useCallback((optionIndex: number) => {
    if (state.isSubmitted || state.isInvalidated) return;

    setState(prev => {
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentQuestionIndex] = optionIndex;
      answersRef.current = newAnswers;
      return { ...prev, answers: newAnswers };
    });
  }, [state.isSubmitted, state.isInvalidated]);

  const nextQuestion = useCallback(() => {
    if (state.isSubmitted || state.isInvalidated) return;
    
    setState(prev => {
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          timeRemaining: timePerQuestion
        };
      }
      return prev;
    });
  }, [state.isSubmitted, state.isInvalidated, timePerQuestion]);

  const previousQuestion = useCallback(() => {
    if (state.isSubmitted || state.isInvalidated) return;
    
    setState(prev => {
      if (prev.currentQuestionIndex > 0) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex - 1,
          timeRemaining: timePerQuestion
        };
      }
      return prev;
    });
  }, [state.isSubmitted, state.isInvalidated, timePerQuestion]);

  const submitQuiz = useCallback(async () => {
    if (state.isSubmitted) return;

    const timeTaken = Math.floor((Date.now() - state.startTime) / 1000);
    
    // Use ref for accurate answer count (avoids stale closure)
    const latestAnswers = answersRef.current;
    let correctCount = 0;
    state.questions.forEach((q, idx) => {
      if (latestAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / state.questions.length) * 100);
    const passed = scorePercentage >= passingScore;

    setState(prev => ({
      ...prev,
      isSubmitted: true,
      score: scorePercentage,
      passed
    }));

    // Submit to backend API if quizId is available
    if (quizId) {
      try {
        // Format answers as { question_id: option_index }
        const formattedAnswers: Record<string, number> = {};
        state.questions.forEach((q, qIdx) => {
          const answerIndex = latestAnswers[qIdx];
          if (answerIndex !== null && q.options[answerIndex]) {
            formattedAnswers[q.id] = parseInt(q.options[answerIndex].id, 10);
          }
        });

        await apiFetch(`/api/quizzes/${quizId}/submit/`, {
          method: 'POST',
          body: JSON.stringify({ answers: formattedAnswers }),
        });
      } catch (err) {
        console.error('Failed to submit quiz to backend:', err);
      }
    }

    // Record attempt
    await recordQuizAttempt(
      quizType,
      levelId,
      correctCount,
      state.questions.length,
      passed,
      moduleId,
      lessonId,
      state.isInvalidated,
      state.invalidationReason || undefined,
      timeTaken
    );

    // Handle pass/fail
    if (passed && !state.isInvalidated) {
      if (quizType === 'lesson' && lessonId && moduleId) {
        await markLessonComplete(levelId, moduleId, lessonId);
      } else if (quizType === 'module' && moduleId) {
        await markModuleComplete(levelId, moduleId);
        // Unlock next module logic would go here
      } else if (quizType === 'level') {
        await markLevelComplete(levelId);
        // Unlock next level
        if (levelId === 'beginner') {
          await unlockNextLevel('intermediate');
        } else if (levelId === 'intermediate') {
          await unlockNextLevel('advanced');
        }
      }
    } else if (!passed && quizType !== 'lesson') {
      // Set cooldown only for module and level quizzes (not lesson quizzes)
      const cooldownMins = quizType === 'level' ? 3 : 2;
      await setCooldown(quizType, levelId, moduleId, cooldownMins);
    }
  }, [state, passingScore, quizType, levelId, moduleId, lessonId, quizId, recordQuizAttempt, setCooldown, markLessonComplete, markModuleComplete, markLevelComplete, unlockNextLevel]);

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const currentAnswer = state.answers[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / state.questions.length) * 100;
  const answeredCount = state.answers.filter(a => a !== null).length;
  const canSubmit = answeredCount === state.questions.length;
  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;

  return {
    currentQuestion,
    currentQuestionIndex: state.currentQuestionIndex,
    totalQuestions: state.questions.length,
    currentAnswer,
    answers: state.answers,
    timeRemaining: state.timeRemaining,
    isSubmitted: state.isSubmitted,
    isInvalidated: state.isInvalidated,
    invalidationReason: state.invalidationReason,
    score: state.score,
    passed: state.passed,
    progress,
    answeredCount,
    canSubmit,
    isLastQuestion,
    questions: state.questions,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz
  };
};
