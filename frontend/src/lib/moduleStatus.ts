import type { Module } from '@/hooks/useCourses';

interface GetModuleDisplayStatusParams {
  levelId: string;
  module: Module;
  currentModuleId?: string;
  isModuleUnlocked: (levelId: string, moduleId: string) => boolean;
  isModuleCompleted: (levelId: string, moduleId: string) => boolean;
  isLessonCompleted: (levelId: string, moduleId: string, lessonId: string) => boolean;
}

export type ModuleDisplayStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export function getModuleDisplayStatus({
  levelId,
  module,
  currentModuleId,
  isModuleUnlocked,
  isModuleCompleted,
  isLessonCompleted,
}: GetModuleDisplayStatusParams): ModuleDisplayStatus {
  if (isModuleCompleted(levelId, module.id)) {
    return 'completed';
  }

  if (currentModuleId === module.id) {
    return 'in-progress';
  }

  const hasCompletedLesson = module.lessons.some((lesson) =>
    isLessonCompleted(levelId, module.id, lesson.id),
  );
  if (hasCompletedLesson) {
    return 'in-progress';
  }

  if (module.is_unlocked || isModuleUnlocked(levelId, module.id)) {
    return 'available';
  }

  return 'locked';
}

export function isModuleAccessible(status: ModuleDisplayStatus): boolean {
  return status !== 'locked';
}
