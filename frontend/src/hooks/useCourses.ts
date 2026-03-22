import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export interface Question {
  id: string;
  question: string;
  options: { id: string; text: string; is_correct: boolean }[];
  correctIndex: number;
  explanation: string;
}

export interface LessonFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Lesson {
  id: string;
  title: string;
  lesson_objective: string;
  content: string;
  common_mistakes: string;
  key_takeaway: string;
  practical_task: string;
  estimated_time_minutes: number | null;
  order: number;
  is_unlocked: boolean;
  faqs: LessonFAQ[];
  quiz: Question[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  is_unlocked: boolean;
  lessons: Lesson[];
  finalQuiz: Question[];
}

export interface Level {
  id: string;
  title: string;
  order: number;
  modules: Module[];
  finalAssessment: Question[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
}

interface BackendCourseResponse {
  id: number;
  title: string;
  description: string;
}

interface BackendLevelResponse {
  id: number;
  title: string;
  order: number;
  modules: BackendModuleResponse[];
}

interface BackendModuleResponse {
  id: number;
  title: string;
  description: string;
  icon: string;
  order: number;
  is_unlocked: boolean;
  lessons: BackendLessonResponse[];
}

interface BackendLessonResponse {
  id: number;
  title: string;
  lesson_objective: string;
  order: number;
  estimated_time_minutes: number | null;
  is_unlocked: boolean;
}

interface BackendLessonDetailResponse {
  id: number;
  title: string;
  lesson_objective: string;
  content: string;
  common_mistakes: string;
  key_takeaway: string;
  practical_task: string;
  estimated_time_minutes: number | null;
  faqs: { id: number; question: string; answer: string }[];
}

interface BackendQuizOption {
  id: number;
  text: string;
  is_correct: boolean;
}

interface BackendQuizQuestion {
  id: number;
  text: string;
  explanation: string;
  order: number;
  options: BackendQuizOption[];
}

interface BackendQuiz {
  id: number;
  quiz_type: string;
  pass_percentage: number;
  time_limit_seconds: number;
  cooldown_minutes: number;
  questions: BackendQuizQuestion[];
  name: string;
}

interface QuizSubmission {
  answers: Record<string, number>; // { question_id: option_id }
}

export const useCourses = () => {
  const { user } = useAuth();
  const [levels, setLevels] = useState<Level[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDefaultIcon = (index: number): string => {
    const icons = ['📊', '🎯', '📈', '💹', '🔍', '⚡'];
    return icons[index % icons.length];
  };

  const mapBackendIdToFrontend = (backendId: number, type: 'level' | 'module' | 'lesson'): string => {
    const levelMap: Record<number, string> = { 1: 'beginner', 2: 'intermediate', 3: 'advanced' };
    return type === 'level' ? String(backendId) : String(backendId);
  };

  const fetchCourses = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const coursesData = await apiFetch<BackendCourseResponse[]>('/api/courses/all/');
      
      const mappedCourses: Course[] = coursesData.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
      }));
      
      setCourses(mappedCourses);

      if (mappedCourses.length > 0) {
        const firstCourseId = mappedCourses[0].id;
        const levelsData = await apiFetch<BackendLevelResponse[]>(`/api/courses/${firstCourseId}/levels/`);
        
        const levelIdMap: Record<number, string> = { 1: 'beginner', 2: 'intermediate', 3: 'advanced' };
        
        const mappedLevels: Level[] = levelsData.map((l, index) => ({
          id: levelIdMap[l.id] || String(l.id),
          title: l.title,
          order: l.order,
          modules: l.modules.map((m, mIndex) => ({
            id: `module-${l.id}-${m.id}`,
            title: m.title,
            description: m.description,
            icon: m.icon || getDefaultIcon(mIndex),
            order: m.order,
            is_unlocked: m.is_unlocked,
            finalQuiz: [],
            lessons: m.lessons.map(les => ({
              id: `lesson-${l.id}-${m.id}-${les.id}`,
              title: les.title,
              lesson_objective: les.lesson_objective,
              content: '',
              common_mistakes: '',
              key_takeaway: '',
              practical_task: '',
              estimated_time_minutes: les.estimated_time_minutes,
              order: les.order,
              is_unlocked: les.is_unlocked,
              faqs: [],
              quiz: [],
            })),
          })),
          finalAssessment: [],
        }));
        
        setLevels(mappedLevels);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const getLevelById = (levelId: string | number): Level | undefined => {
    const levelIdStr = String(levelId);
    return levels.find(l => l.id === levelIdStr);
  };

  const getModuleById = (levelId: string | number, moduleId: string | number): Module | undefined => {
    const level = getLevelById(levelId);
    const moduleIdStr = String(moduleId);
    return level?.modules.find(m => m.id === moduleIdStr);
  };

  const getLessonById = (levelId: string | number, moduleId: string | number, lessonId: string | number): Lesson | undefined => {
    const module = getModuleById(levelId, moduleId);
    const lessonIdStr = String(lessonId);
    return module?.lessons.find(l => l.id === lessonIdStr);
  };

  const fetchLessonDetail = useCallback(async (lessonId: string | number): Promise<Lesson | null> => {
    let lessonIdNum: number;
    
    if (typeof lessonId === 'number') {
      lessonIdNum = lessonId;
    } else {
      // Handle formats like "lesson-1-1-1" - extract the last number
      const parts = lessonId.split('-');
      lessonIdNum = parseInt(parts[parts.length - 1], 10);
    }
    
    if (isNaN(lessonIdNum)) {
      console.error('Invalid lesson ID:', lessonId);
      return null;
    }
    
    try {
      const data = await apiFetch<BackendLessonDetailResponse>(`/api/courses/lessons/${lessonIdNum}/`);
      
      return {
        id: String(data.id),
        title: data.title,
        lesson_objective: data.lesson_objective,
        content: data.content,
        common_mistakes: data.common_mistakes,
        key_takeaway: data.key_takeaway,
        practical_task: data.practical_task,
        estimated_time_minutes: data.estimated_time_minutes,
        order: 0,
        is_unlocked: true,
        faqs: data.faqs.map(f => ({ ...f, id: String(f.id) })),
        quiz: [],
      };
    } catch (err) {
      console.error('Failed to fetch lesson detail:', err);
      return null;
    }
  }, []);

  const fetchQuiz = useCallback(async (quizType: 'lesson' | 'module' | 'level', levelId: string | number, moduleId?: string | number, lessonId?: string | number): Promise<{ questions: Question[]; quizInfo: { id: number; passPercentage: number; timeLimit: number; cooldown: number } } | null> => {
    let queryParam = '';
    let idValue: number;

    if (quizType === 'lesson' && lessonId) {
      queryParam = 'lesson_id';
      idValue = typeof lessonId === 'number' ? lessonId : parseInt(lessonId.toString().split('-').pop() || '0', 10);
    } else if (quizType === 'module' && moduleId) {
      queryParam = 'module_id';
      idValue = typeof moduleId === 'number' ? moduleId : parseInt(moduleId.toString().split('-').pop() || '0', 10);
    } else if (quizType === 'level' && levelId) {
      queryParam = 'level_id';
      const levelMap: Record<string, number> = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
      idValue = typeof levelId === 'number' ? levelId : (levelMap[String(levelId)] || parseInt(levelId, 10));
    } else {
      console.error('Invalid quiz type or missing ID');
      return null;
    }

    if (isNaN(idValue) || idValue === 0) {
      console.error('Invalid ID for quiz:', { quizType, levelId, moduleId, lessonId });
      return null;
    }

    try {
      const quizzes = await apiFetch<BackendQuiz[]>(`/api/quizzes/?${queryParam}=${idValue}`);
      
      if (!quizzes || quizzes.length === 0) {
        console.error('No quiz found for:', { queryParam, idValue });
        return null;
      }

      const quiz = quizzes[0];

      // Convert backend format to frontend format
      const questions: Question[] = quiz.questions.map(q => {
        // Find the index of the correct option
        const correctIndex = q.options.findIndex(o => o.is_correct);
        
        return {
          id: String(q.id),
          question: q.text,
          options: q.options.map(o => ({
            id: String(o.id),
            text: o.text,
            is_correct: o.is_correct,
          })),
          correctIndex,
          explanation: q.explanation || '',
        };
      });

      return {
        questions,
        quizInfo: {
          id: quiz.id,
          passPercentage: quiz.pass_percentage,
          timeLimit: quiz.time_limit_seconds,
          cooldown: quiz.cooldown_minutes,
        },
      };
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
      return null;
    }
  }, []);

  const submitQuiz = useCallback(async (quizId: number, answers: Record<string, number>): Promise<{ score: number; passed: boolean } | null> => {
    try {
      const formattedAnswers: Record<string, number> = {};
      Object.entries(answers).forEach(([questionId, optionIndex]) => {
        // We need to find the actual option ID from the question
        formattedAnswers[questionId] = optionIndex;
      });

      const result = await apiFetch<{ score: number; passed: boolean }>(`/api/quizzes/${quizId}/submit/`, {
        method: 'POST',
        body: JSON.stringify({ answers: formattedAnswers }),
      });

      return result;
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      return null;
    }
  }, []);

  const trackLessonActivity = useCallback(async (lessonId: string | number): Promise<void> => {
    let lessonIdNum: number;
    
    if (typeof lessonId === 'number') {
      lessonIdNum = lessonId;
    } else {
      const parts = lessonId.split('-');
      lessonIdNum = parseInt(parts[parts.length - 1], 10);
    }
    
    if (isNaN(lessonIdNum)) {
      console.error('Invalid lesson ID for activity tracking:', lessonId);
      return;
    }

    try {
      await apiFetch('/api/progress/lessons/activity/', {
        method: 'POST',
        body: JSON.stringify({ lesson_id: lessonIdNum }),
      });
    } catch (err) {
      console.error('Failed to track lesson activity:', err);
    }
  }, []);

  return {
    levels,
    courses,
    loading,
    error,
    getLevelById,
    getModuleById,
    getLessonById,
    fetchLessonDetail,
    fetchQuiz,
    submitQuiz,
    trackLessonActivity,
    refreshCourses: fetchCourses,
  };
};
