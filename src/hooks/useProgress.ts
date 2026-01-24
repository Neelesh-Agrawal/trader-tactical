import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
}

interface ModuleProgress {
  module_id: string;
  completed: boolean;
  unlocked: boolean;
}

interface LevelProgress {
  level_id: string;
  unlocked: boolean;
  completed: boolean;
}

interface QuizCooldown {
  quiz_type: string;
  level_id: string;
  module_id: string | null;
  cooldown_until: string;
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

    const [lessonsRes, modulesRes, levelsRes, cooldownsRes] = await Promise.all([
      supabase.from('lesson_progress').select('*').eq('user_id', user.id),
      supabase.from('module_progress').select('*').eq('user_id', user.id),
      supabase.from('level_progress').select('*').eq('user_id', user.id),
      supabase.from('quiz_cooldowns').select('*').eq('user_id', user.id)
    ]);

    if (!lessonsRes.error) setLessonProgress(lessonsRes.data as LessonProgress[]);
    if (!modulesRes.error) setModuleProgress(modulesRes.data as ModuleProgress[]);
    if (!levelsRes.error) setLevelProgress(levelsRes.data as LevelProgress[]);
    if (!cooldownsRes.error) setCooldowns(cooldownsRes.data as QuizCooldown[]);

    setLoading(false);
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const isLessonCompleted = (levelId: string, moduleId: string, lessonId: string): boolean => {
    return lessonProgress.some(
      p => p.lesson_id === lessonId && p.completed
    );
  };

  const isModuleUnlocked = (levelId: string, moduleId: string): boolean => {
    // First module is always unlocked
    const progress = moduleProgress.find(p => p.module_id === moduleId);
    return progress?.unlocked ?? moduleId.includes('derivatives-basics');
  };

  const isModuleCompleted = (levelId: string, moduleId: string): boolean => {
    const progress = moduleProgress.find(p => p.module_id === moduleId);
    return progress?.completed ?? false;
  };

  const isLevelUnlocked = (levelId: string): boolean => {
    if (levelId === 'beginner') return true;
    const progress = levelProgress.find(p => p.level_id === levelId);
    return progress?.unlocked ?? false;
  };

  const isLevelCompleted = (levelId: string): boolean => {
    const progress = levelProgress.find(p => p.level_id === levelId);
    return progress?.completed ?? false;
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

    const { error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        level_id: levelId,
        module_id: moduleId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,level_id,module_id,lesson_id'
      });

    if (!error) {
      await fetchProgress();
    }
  };

  const markModuleComplete = async (levelId: string, moduleId: string) => {
    if (!user) return;

    await supabase
      .from('module_progress')
      .upsert({
        user_id: user.id,
        level_id: levelId,
        module_id: moduleId,
        completed: true,
        unlocked: true,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,level_id,module_id'
      });

    await fetchProgress();
  };

  const unlockNextModule = async (levelId: string, nextModuleId: string) => {
    if (!user) return;

    await supabase
      .from('module_progress')
      .upsert({
        user_id: user.id,
        level_id: levelId,
        module_id: nextModuleId,
        unlocked: true
      }, {
        onConflict: 'user_id,level_id,module_id'
      });

    await fetchProgress();
  };

  const markLevelComplete = async (levelId: string) => {
    if (!user) return;

    await supabase
      .from('level_progress')
      .upsert({
        user_id: user.id,
        level_id: levelId,
        completed: true,
        unlocked: true,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,level_id'
      });

    await fetchProgress();
  };

  const unlockNextLevel = async (nextLevelId: string) => {
    if (!user) return;

    await supabase
      .from('level_progress')
      .upsert({
        user_id: user.id,
        level_id: nextLevelId,
        unlocked: true
      }, {
        onConflict: 'user_id,level_id'
      });

    await fetchProgress();
  };

  const setCooldown = async (quizType: string, levelId: string, moduleId?: string, durationMinutes: number = 2) => {
    if (!user) return;

    const cooldownUntil = new Date(Date.now() + durationMinutes * 60 * 1000);

    await supabase
      .from('quiz_cooldowns')
      .upsert({
        user_id: user.id,
        quiz_type: quizType,
        level_id: levelId,
        module_id: moduleId || null,
        cooldown_until: cooldownUntil.toISOString()
      }, {
        onConflict: 'user_id,quiz_type,level_id,module_id'
      });

    await fetchProgress();
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

    await supabase
      .from('quiz_attempts')
      .insert({
        user_id: user.id,
        quiz_type: quizType,
        level_id: levelId,
        module_id: moduleId || null,
        lesson_id: lessonId || null,
        score,
        total_questions: totalQuestions,
        passed,
        invalidated,
        invalidation_reason: invalidationReason || null,
        time_taken_seconds: timeTaken || null
      });
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
