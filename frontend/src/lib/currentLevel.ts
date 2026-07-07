import type { Level } from '@/hooks/useCourses';

type LessonProgressCheck = (
  levelId: string,
  moduleId: string,
  lessonId: string,
) => boolean;

const levelHasLessonProgress = (
  level: Level,
  isLessonCompleted: LessonProgressCheck,
): boolean =>
  level.modules.some((module) =>
    module.lessons.some((lesson) =>
      isLessonCompleted(level.id, module.id, lesson.id),
    ),
  );

/** Active level: highest in-progress level with lesson activity, else first incomplete. */
export const getCurrentLevel = (
  levels: Level[],
  isLevelCompleted: (levelId: string) => boolean,
  isLessonCompleted: LessonProgressCheck,
): Level | undefined => {
  if (!levels.length) return undefined;

  let activeWithProgress: Level | undefined;
  for (const level of levels) {
    if (isLevelCompleted(level.id)) continue;
    if (levelHasLessonProgress(level, isLessonCompleted)) {
      activeWithProgress = level;
    }
  }
  if (activeWithProgress) return activeWithProgress;

  for (const level of levels) {
    if (!isLevelCompleted(level.id)) return level;
  }

  return levels[levels.length - 1];
};
