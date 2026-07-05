import type { Course } from '@/hooks/useCourses';
import type { CourseLevel } from '@/config/courseConfig';

const normalize = (value: string) => value.trim().toLowerCase();

export const findCourseIdForConfig = (
  config: CourseLevel,
  courses: Course[],
): number | null => {
  const configName = normalize(config.name);
  const configTitle = normalize(config.title);

  const exactMatch = courses.find((course) => {
    const title = normalize(course.title);
    return title === configName || title === configTitle;
  });

  if (exactMatch) {
    return exactMatch.id;
  }

  const keywordMatch = courses.find((course) => {
    const title = normalize(course.title);
    return title.includes(configName) || title.includes(configTitle);
  });

  return keywordMatch?.id ?? null;
};
