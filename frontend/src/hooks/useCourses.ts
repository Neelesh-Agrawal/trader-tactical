import { useState, useEffect, useCallback } from 'react';
import { apiFetch, getAuthTokens } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { setLevelIdMap, getBackendLevelId } from '@/lib/levelIdMap';
import {
  courseConfigList,
  isNismCourseTitle,
  NISM_LEVEL_SLUG,
  nismConfig,
} from '@/config/courseConfig';
import { isAuthRequired } from '@/config/appConfig';

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
  backendId: number;
  courseId: number;
  courseTitle: string;
  title: string;
  order: number;
  is_unlocked: boolean;
  is_enrolled: boolean;
  modules: Module[];
  finalAssessment: Question[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  price_inr: number | null;
}

interface BackendCourseResponse {
  id: number;
  title: string;
  description: string;
  price_inr: number | null;
  is_published: boolean;
}

interface BackendLevelResponse {
  id: number;
  title: string;
  order: number;
  is_unlocked: boolean;
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
  common_mistakes: string;
  key_takeaway: string;
  practical_task: string;
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
  is_correct?: boolean;
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

const levelIdByBackendId: Record<number, string> = {
  1: 'beginner',
  2: 'intermediate',
  3: 'advanced',
};

const levelSlugByOrder: Record<number, string> = {
  1: 'beginner',
  2: 'intermediate',
  3: 'advanced',
};

const levelSlugByTitle: Record<string, string> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
  NISM: NISM_LEVEL_SLUG,
};

const getConfigForCourse = (course: Pick<Course, 'id' | 'title'>) => {
  const normalizedTitle = course.title.trim().toLowerCase();

  return courseConfigList.find((config) => (
    config.number === course.id ||
    config.id === normalizedTitle ||
    config.name.trim().toLowerCase() === normalizedTitle ||
    config.title.trim().toLowerCase() === normalizedTitle
  ));
};

const getLevelSlug = ({
  backendLevelId,
  order,
  title,
  course,
}: {
  backendLevelId?: number;
  order?: number;
  title?: string;
  course: Pick<Course, 'id' | 'title'>;
}): string => {
  const config = getConfigForCourse(course);

  if (config) {
    return config.id;
  }

  if (title && levelSlugByTitle[title]) {
    return levelSlugByTitle[title];
  }

  if (isNismCourseTitle(course.title)) {
    return NISM_LEVEL_SLUG;
  }

  if (backendLevelId && levelIdByBackendId[backendLevelId] && course.id === backendLevelId) {
    return levelIdByBackendId[backendLevelId];
  }

  if (order && title) {
    return `${course.id}-${order}-${title.toLowerCase()}`;
  }

  return String(backendLevelId || course.id || order || title || '');
};

const buildPreviewLevel = (course: Course): Level => {
  const config = getConfigForCourse(course);
  const isNism = isNismCourseTitle(course.title);
  const slug = getLevelSlug({
    course,
    title: isNism ? 'NISM' : config?.name || course.title,
    order: isNism ? 4 : config?.number || course.id,
    backendLevelId: course.id,
  });
  const moduleTitles = isNism
    ? nismConfig.accentItems
    : config?.points.length
      ? config.points
      : ['Course overview'];

  return {
    id: slug,
    backendId: course.id,
    courseId: course.id,
    courseTitle: course.title,
    title: isNism ? 'NISM' : config?.name || course.title,
    order: isNism ? 4 : config?.number || course.id,
    is_unlocked: false,
    is_enrolled: false,
    modules: moduleTitles.map((point, moduleIndex) => ({
      id: `module-preview-${course.id}-${moduleIndex + 1}`,
      title: point,
      description: `Enroll in ${course.title} to unlock this module.`,
      icon: config?.emoji || '📚',
      order: moduleIndex + 1,
      is_unlocked: false,
      finalQuiz: [],
      lessons: [],
    })),
    finalAssessment: [],
  };
};

const buildDemoCourseData = (): { courses: Course[]; levels: Level[] } => {
  const courses: Course[] = courseConfigList.map((config) => ({
    id: config.number,
    title: config.name,
    description: config.description,
    price_inr: null,
  }));

  const levels: Level[] = courseConfigList.map((config, levelIndex) => ({
    id: config.id,
    backendId: config.number,
    courseId: config.number,
    courseTitle: config.name,
    title: config.name,
    order: config.number,
    is_unlocked: levelIndex === 0,
    is_enrolled: levelIndex === 0,
    modules: config.points.map((point, moduleIndex) => {
      const numericId = config.number * 100 + moduleIndex + 1;

      return {
        id: `module-${config.number}-${numericId}`,
        title: point,
        description: `Preview module for ${config.name}. Sign in with an enrolled account to load the full lesson content.`,
        icon: config.emoji,
        order: moduleIndex + 1,
        is_unlocked: levelIndex === 0 && moduleIndex === 0,
        finalQuiz: [],
        lessons: [
          {
            id: `lesson-${config.number}-${numericId}-${numericId}`,
            title: `${point} Overview`,
            lesson_objective: `<ul><li>Preview objective for ${point}</li><li>Enroll to unlock the full lesson content</li></ul>`,
            content: `<p>This is preview content for ${config.name}.</p><p>Sign in with an enrolled account to load the complete course data from the backend.</p>`,
            common_mistakes: '<ul><li>Preview mode does not include full lesson guidance</li></ul>',
            key_takeaway: 'Use an enrolled account to continue with full course content.',
            practical_task: '<ul><li>Sign in with an enrolled account to access practical tasks</li></ul>',
            estimated_time_minutes: 5,
            order: 1,
            is_unlocked: levelIndex === 0 && moduleIndex === 0,
            faqs: [],
            quiz: [],
          },
        ],
      };
    }),
    finalAssessment: [],
  }));

  return { courses, levels };
};



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

  const applyDemoCourseData = useCallback(() => {
    const demoData = buildDemoCourseData();
    setCourses(demoData.courses);
    setLevels(demoData.levels);
    setLevelIdMap(demoData.levels.map((level) => ({ id: level.id, backendId: level.backendId })));
    setError(null);
  }, []);



  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const catalogCoursesData = await apiFetch<BackendCourseResponse[]>('/api/courses/catalog/', {
        auth: false,
      });

      const catalogCourses = catalogCoursesData.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        price_inr: course.price_inr,
      }));

      setCourses(catalogCourses);

      const hasAuthToken = Boolean(getAuthTokens()?.access);
      if (!hasAuthToken || !user) {
        if (!isAuthRequired()) {
          const previewLevels = buildDemoCourseData().levels;
          setLevels(previewLevels);
          setLevelIdMap(previewLevels.map((level) => ({ id: level.id, backendId: level.backendId })));
          setError(null);
        } else {
          setLevels([]);
        }
        return;
      }

      const enrolledCoursesData = await apiFetch<BackendCourseResponse[]>('/api/courses/');
      const enrolledCourseIds = new Set(enrolledCoursesData.map((course) => course.id));

      if (catalogCourses.length > 0) {
        const levelsByCourse = await Promise.allSettled(
          catalogCourses
            .filter((course) => enrolledCourseIds.has(course.id))
            .map(async (course) => {
            const levelsData = await apiFetch<BackendLevelResponse[]>(
              `/api/courses/${course.id}/levels/`
            );

            return levelsData.map((l) => {
              const isNism = isNismCourseTitle(course.title) || l.title === 'NISM';
              const levelSlug = getLevelSlug({
                course,
                backendLevelId: l.id,
                order: l.order,
                title: l.title,
              });

              return {
                id: levelSlug,
                backendId: l.id,
                courseId: course.id,
                courseTitle: course.title,
                title: l.title,
                order: isNism ? 4 : l.order,
                is_unlocked: l.is_unlocked,
                is_enrolled: true,
                modules: l.modules.map((m, mIndex) => ({
                  id: `module-${l.id}-${m.id}`,
                  title: m.title,
                  description: m.description,
                  icon: m.icon || getDefaultIcon(mIndex),
                  order: m.order,
                  is_unlocked: m.is_unlocked,
                  finalQuiz: [],
                  lessons: m.lessons.map((les) => ({
                    id: `lesson-${l.id}-${m.id}-${les.id}`,
                    title: les.title,
                    lesson_objective: les.lesson_objective || '',
                    content: '',
                    common_mistakes: les.common_mistakes || '',
                    key_takeaway: les.key_takeaway || '',
                    practical_task: les.practical_task || '',
                    estimated_time_minutes: les.estimated_time_minutes,
                    order: les.order,
                    is_unlocked: les.is_unlocked,
                    faqs: [],
                    quiz: [],
                  })),
                })),
                finalAssessment: [],
              };
            });
          })
        );

        const mappedLevels: Level[] = levelsByCourse.flatMap((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          }

          console.error(
            `Failed to fetch levels for enrolled course ${Array.from(enrolledCourseIds)[index]}:`,
            result.reason,
          );
          return [];
        });

        const lockedPreviewLevels = catalogCourses
          .filter((course) => !enrolledCourseIds.has(course.id))
          .map(buildPreviewLevel);

        const allLevels = [...mappedLevels, ...lockedPreviewLevels].sort((a, b) => a.order - b.order);
         
        setLevels(allLevels);
        setLevelIdMap(allLevels.map((level) => ({ id: level.id, backendId: level.backendId })));
      } else {
        setLevels([]);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);

      if (!isAuthRequired()) {
        applyDemoCourseData();
      } else {
        setError('Failed to load course data');
      }
    } finally {
      setLoading(false);
    }
  }, [applyDemoCourseData, user]);

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
        id: String(lessonId),
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
      idValue =
        typeof levelId === 'number'
          ? levelId
          : getBackendLevelId(String(levelId));
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
      const questions: Question[] = quiz.questions.map((q) => {
        const correctIndex = q.options.findIndex((o) => o.is_correct);
        return {
          id: String(q.id),
          question: q.text,
          options: q.options.map((o) => ({
            id: String(o.id),
            text: o.text,
            is_correct: o.is_correct ?? false,
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
