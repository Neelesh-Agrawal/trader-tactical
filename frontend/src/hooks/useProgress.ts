import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { getBackendLevelId } from '@/lib/levelIdMap';

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

const getLevelIdInt = (levelId: string): number => {
  const levelMap: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  };
  return getBackendLevelId(levelId) || levelMap[levelId] || parseInt(levelId, 10);
};

const getModuleIdInt = (moduleId: string): number => {
  if (moduleId.includes('-')) {
    const parts = moduleId.split('-');
    return parseInt(parts[parts.length - 1], 10);
  }
  return parseInt(moduleId, 10);
};

const getLessonIdInt = (lessonId: string): number => {
  if (lessonId.includes('-')) {
    const parts = lessonId.split('-');
    return parseInt(parts[parts.length - 1], 10);
  }
  return parseInt(lessonId, 10);
};

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

  const isLessonCompleted = (_levelId: string, _moduleId: string, lessonId: string): boolean => {
    const lessonIdInt = getLessonIdInt(lessonId);
    return lessonProgress.some(
      p => p.lesson_id === lessonIdInt && p.completed
    );
  };

  const isModuleUnlocked = (_levelId: string, moduleId: string): boolean => {
    const moduleIdInt = getModuleIdInt(moduleId);
    const progress = moduleProgress.find((p) => p.module_id === moduleIdInt);
    if (progress) return progress.unlocked;

    const parts = moduleId.split('-');
    if (parts[0] === 'module' && parts[1] === '1') {
      return parseInt(parts[2], 10) === 1;
    }
    return false;
  };

  const isModuleCompleted = (_levelId: string, moduleId: string): boolean => {
    const moduleIdInt = getModuleIdInt(moduleId);
    const progress = moduleProgress.find(p => p.module_id === moduleIdInt);
    return progress?.completed ?? false;
  };

  const isLevelUnlocked = (levelId: string): boolean => {
    const levelIdInt = getLevelIdInt(levelId);
    const progress = levelProgress.find((p) => p.level_id === levelIdInt);
    if (progress) return progress.unlocked;

    return levelId === 'beginner';
  };

  const isLevelCompleted = (levelId: string): boolean => {
    const levelIdInt = getLevelIdInt(levelId);
    const progress = levelProgress.find(p => p.level_id === levelIdInt);
    return progress?.completed ?? false;
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

  const markLessonComplete = async (_levelId: string, _moduleId: string, lessonId: string) => {
    if (!user) return;

    const lessonIdInt = getLessonIdInt(lessonId);

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

  const markModuleComplete = async (_levelId: string, moduleId: string) => {
    if (!user) return;

    const moduleIdInt = getModuleIdInt(moduleId);

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

  const unlockNextModule = async (_levelId: string, nextModuleId: string) => {
    if (!user) return;

    const moduleIdInt = getModuleIdInt(nextModuleId);

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

    const levelIdInt = getLevelIdInt(levelId);

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

    const levelIdInt = getLevelIdInt(nextLevelId);

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

  const setCooldown = async (_quizType: string, _levelId: string, _moduleId?: string, _durationMinutes: number = 2) => {
    // Quiz cooldowns are not yet implemented in the backend API
    // This is a stub for now
    console.warn('Quiz cooldowns not yet implemented in backend');
  };

  const recordQuizAttempt = async (
    _quizType: 'lesson' | 'module' | 'level',
    _levelId: string,
    _score: number,
    _totalQuestions: number,
    _passed: boolean,
    _moduleId?: string,
    _lessonId?: string,
    _invalidated: boolean = false,
    _invalidationReason?: string,
    _timeTaken?: number
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
