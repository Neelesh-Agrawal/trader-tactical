import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface BackendCourse {
  id: number;
  title: string;
  description: string;
  is_published: boolean;
}

/** Backend enrolls by course; levels live inside the course. */
export const useEnrollment = () => {
  const { user } = useAuth();
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = useCallback(async () => {
    if (!user) {
      setEnrolledCourseIds([]);
      setLoading(false);
      return;
    }

    try {
      const courses = await apiFetch<BackendCourse[]>('/api/courses/');
      setEnrolledCourseIds(courses.map((c) => c.id));
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      setEnrolledCourseIds([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchEnrollments();
  }, [fetchEnrollments]);

  const isEnrolledInCourse = (courseId = 1): boolean =>
    enrolledCourseIds.includes(courseId);

  const enrollInLevel = async (_levelId: string, courseId = 1): Promise<boolean> => {
    if (!user) return false;

    try {
      await apiFetch('/api/courses/enroll/', {
        method: 'POST',
        body: JSON.stringify({ course_id: courseId }),
      });
      await fetchEnrollments();
      return true;
    } catch (error) {
      console.error('Failed to enroll:', error);
      return false;
    }
  };

  return {
    enrolledCourseIds,
    loading,
    isEnrolledInCourse,
    enrollInLevel,
    refreshEnrollments: fetchEnrollments,
  };
};
