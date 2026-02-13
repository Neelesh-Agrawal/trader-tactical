import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface LessonProgress {
  lesson_id: number; // Backend uses integer IDs
  completed: boolean;
  completed_at: string | null;
}

interface ModuleProgress {
  module_id: number; // Backend uses integer IDs
  completed: boolean;
  unlocked: boolean;
}

interface LevelProgress {
  level_id: number; // Backend uses integer IDs
  unlocked: boolean;
  completed: boolean;
}

interface QuizCooldown {
  quiz_type: string;
  level_id: string;
  module_id: string | null;
  cooldown_until: string;
}

interface BackendProgressResponse {
  lesson_progress: Array<{
    id: number;
    lesson_id: number;
    completed: boolean;
    completed_at: string | null;
  }>;
  module_progress: Array<{
    id: number;
    module_id: number;
    unlocked: boolean;
    completed: boolean;
    completed_at: string | null;
  }>;
  level_progress: Array<{
    id: number;
    level_id: number;
    unlocked: boolean;
    completed: boolean;
    completed_at: string | null;
  }>;
  completed_lessons: number;
  completed_modules: number;
  completed_levels: number;
  unlocked_modules: number;
  unlocked_levels: number;
}

export const useProgress = () => {
  const { user } = useAuth();
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [levelProgress, setLevelProgress] = useState<LevelProgress[]>([]);
  const [cooldowns, setCooldowns] = useState<QuizCooldown[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const data = await apiFetch<BackendProgressResponse>('/api/progress/user/');
      
      setLessonProgress(
        data.lesson_progress.map((lp) => ({
          lesson_id: lp.lesson_id,
          completed: lp.completed,
          completed_at: lp.completed_at,
        }))
      );
      
      setModuleProgress(
        data.module_progress.map((mp) => ({
          module_id: mp.module_id,
          completed: mp.completed,
          unlocked: mp.unlocked,
        }))
      );
      
      setLevelProgress(
        data.level_progress.map((lp) => ({
          level_id: lp.level_id,
          unlocked: lp.unlocked,
          completed: lp.completed,
        }))
      );
      
      // Quiz cooldowns are not yet implemented in backend, keep empty for now
      setCooldowns([]);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      // Keep existing state on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const isLessonCompleted = (levelId: string, moduleId: string, lessonId: string): boolean => {
    // Note: Backend uses integer IDs, frontend uses string IDs from courseData
    // For now, we'll need to map string IDs to integers or fetch course structure
    // This is a simplified check - in production, you'd want to map IDs properly
    // For now, checking by lesson_id as integer (if lessonId can be parsed as int)
    const lessonIdInt = parseInt(lessonId, 10);
    if (!isNaN(lessonIdInt)) {
      return lessonProgress.some(
        p => p.lesson_id === lessonIdInt && p.completed
      );
    }
    // Fallback: if lessonId is a string (like from courseData), we can't match yet
    // This will need proper ID mapping when course structure is fetched from backend
    return false;
  };

  const isModuleUnlocked = (levelId: string, moduleId: string): boolean => {
    // First module is always unlocked
    const moduleIdInt = parseInt(moduleId, 10);
    if (!isNaN(moduleIdInt)) {
      const progress = moduleProgress.find(p => p.module_id === moduleIdInt);
      return progress?.unlocked ?? false;
    }
    // Fallback for string IDs
    return moduleId.includes('derivatives-basics');
  };

  const isModuleCompleted = (levelId: string, moduleId: string): boolean => {
    const moduleIdInt = parseInt(moduleId, 10);
    if (!isNaN(moduleIdInt)) {
      const progress = moduleProgress.find(p => p.module_id === moduleIdInt);
      return progress?.completed ?? false;
    }
    return false;
  };

  const isLevelUnlocked = (levelId: string): boolean => {
    if (levelId === 'beginner') return true;
    const levelIdInt = parseInt(levelId, 10);
    if (!isNaN(levelIdInt)) {
      const progress = levelProgress.find(p => p.level_id === levelIdInt);
      return progress?.unlocked ?? false;
    }
    return false;
  };

  const isLevelCompleted = (levelId: string): boolean => {
    const levelIdInt = parseInt(levelId, 10);
    if (!isNaN(levelIdInt)) {
      const progress = levelProgress.find(p => p.level_id === levelIdInt);
      return progress?.completed ?? false;
    }
    return false;
  };

  const getModuleLessonsCompleted = (levelId: string, moduleId: string, totalLessons: number): number => {
    return lessonProgress.filter(
      p => p.completed
    ).length;
  };

  const getCooldownRemaining = (quizType: string, levelId: string, moduleId?: string): number => {
    const cooldown = cooldowns.find(
      c => c.quiz_type === quizType && 
           c.level_id === levelId && 
           (moduleId ? c.module_id === moduleId : !c.module_id)
    );

    if (!cooldown) return 0;

    const cooldownTime = new Date(cooldown.cooldown_until).getTime();
    const now = Date.now();
    
    return Math.max(0, Math.ceil((cooldownTime - now) / 1000));
  };

  const markLessonComplete = async (levelId: string, moduleId: string, lessonId: string) => {
    if (!user) return;

    const lessonIdInt = parseInt(lessonId, 10);
    if (isNaN(lessonIdInt)) {
      console.error('Cannot mark lesson complete: lessonId must be an integer');
      return;
    }

    try {
      await apiFetch(`/api/progress/lessons/${lessonIdInt}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          completed: true,
        }),
      });
      await fetchProgress();
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
    }
  };

  const markModuleComplete = async (levelId: string, moduleId: string) => {
    if (!user) return;

    const moduleIdInt = parseInt(moduleId, 10);
    if (isNaN(moduleIdInt)) {
      console.error('Cannot mark module complete: moduleId must be an integer');
      return;
    }

    try {
      await apiFetch(`/api/progress/modules/${moduleIdInt}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          completed: true,
          unlocked: true,
        }),
      });
      await fetchProgress();
    } catch (error) {
      console.error('Failed to mark module complete:', error);
    }
  };

  const unlockNextModule = async (levelId: string, nextModuleId: string) => {
    if (!user) return;

    const moduleIdInt = parseInt(nextModuleId, 10);
    if (isNaN(moduleIdInt)) {
      console.error('Cannot unlock module: moduleId must be an integer');
      return;
    }

    try {
      await apiFetch(`/api/progress/modules/${moduleIdInt}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          unlocked: true,
        }),
      });
      await fetchProgress();
    } catch (error) {
      console.error('Failed to unlock module:', error);
    }
  };

  const markLevelComplete = async (levelId: string) => {
    if (!user) return;

    const levelIdInt = parseInt(levelId, 10);
    if (isNaN(levelIdInt)) {
      console.error('Cannot mark level complete: levelId must be an integer');
      return;
    }

    try {
      await apiFetch(`/api/progress/levels/${levelIdInt}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          completed: true,
          unlocked: true,
        }),
      });
      await fetchProgress();
    } catch (error) {
      console.error('Failed to mark level complete:', error);
    }
  };

  const unlockNextLevel = async (nextLevelId: string) => {
    if (!user) return;

    const levelIdInt = parseInt(nextLevelId, 10);
    if (isNaN(levelIdInt)) {
      console.error('Cannot unlock level: levelId must be an integer');
      return;
    }

    try {
      await apiFetch(`/api/progress/levels/${levelIdInt}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          unlocked: true,
        }),
      });
      await fetchProgress();
    } catch (error) {
      console.error('Failed to unlock level:', error);
    }
  };

  const setCooldown = async (quizType: string, levelId: string, moduleId?: string, durationMinutes: number = 2) => {
    // Quiz cooldowns are not yet implemented in the backend API
    // This is a stub for now
    console.warn('Quiz cooldowns not yet implemented in backend');
  };

  const recordQuizAttempt = async (
    quizType: 'lesson' | 'module' | 'level',
    levelId: string,
    score: number,
    totalQuestions: number,
    passed: boolean,
    moduleId?: string,
    lessonId?: string,
    invalidated: boolean = false,
    invalidationReason?: string,
    timeTaken?: number
  ) => {
    if (!user) return;

    // Quiz attempts are recorded when submitting via /api/quizzes/{id}/submit/
    // This function is kept for compatibility but the actual recording happens in quiz submission
    console.warn('Quiz attempts should be recorded via quiz submission endpoint');
  };

  return {
    loading,
    lessonProgress,
    moduleProgress,
    levelProgress,
    isLessonCompleted,
    isModuleUnlocked,
    isModuleCompleted,
    isLevelUnlocked,
    isLevelCompleted,
    getModuleLessonsCompleted,
    getCooldownRemaining,
    markLessonComplete,
    markModuleComplete,
    unlockNextModule,
    markLevelComplete,
    unlockNextLevel,
    setCooldown,
    recordQuizAttempt,
    refreshProgress: fetchProgress
  };
};
