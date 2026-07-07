import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollment } from '@/hooks/useEnrollment';
import { isNismCourseTitle, NISM_LEVEL_SLUG, nismConfig } from '@/config/courseConfig';
import type { Course, Level } from '@/hooks/useCourses';

export const isNismCourse = (course: Pick<Course, 'title'>) =>
  isNismCourseTitle(course.title);

export const findNismCourse = (courses: Course[]) => courses.find(isNismCourse);

export const findNismLevel = (levels: Level[]) =>
  levels.find(
    (level) =>
      level.id === NISM_LEVEL_SLUG ||
      level.title.trim().toLowerCase() === 'nism',
  );

export const isNismEnrolled = ({
  enrolledCourseIds,
  courses,
  levels,
}: {
  enrolledCourseIds: number[];
  courses: Course[];
  levels: Level[];
}): boolean => {
  const nismCourse = findNismCourse(courses);
  if (nismCourse && enrolledCourseIds.includes(nismCourse.id)) {
    return true;
  }

  const nismLevel = findNismLevel(levels);
  return Boolean(nismLevel?.is_enrolled);
};

export const getNismReviewUrl = (levels: Level[]): string => {
  const nismLevel = findNismLevel(levels);
  return nismLevel ? `/level/${nismLevel.id}` : `/level/${NISM_LEVEL_SLUG}`;
};

export const useNismEnrollment = () => {
  const { user } = useAuth();
  const { levels, courses } = useCourses();
  const { enrolledCourseIds, loading } = useEnrollment();

  const isEnrolled =
    Boolean(user) &&
    isNismEnrolled({
      enrolledCourseIds,
      courses,
      levels,
    });

  return {
    isEnrolled,
    reviewUrl: getNismReviewUrl(levels),
    primaryLabel: isEnrolled ? nismConfig.enrolledCTA : nismConfig.primaryCTA,
    primaryHref: isEnrolled ? getNismReviewUrl(levels) : nismConfig.purchaseUrl,
    loading,
  };
};
