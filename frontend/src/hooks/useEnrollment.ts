import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Enrollment {
  level_id: string;
  enrolled_at: string;
  deadline_at: string;
}

interface BackendCourse {
  id: number;
  title: string;
  description: string;
  is_published: boolean;
}

export const useEnrollment = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Backend has course enrollments, not level enrollments
      // For now, we'll fetch enrolled courses and map them
      // Since the frontend expects level enrollments, we'll create a stub
      const courses = await apiFetch<BackendCourse[]>('/api/courses/');
      
      // Map courses to level enrollments (simplified - assumes one course = one level for now)
      // In production, you'd want to properly map courses to levels
      const mappedEnrollments: Enrollment[] = courses.map((course, index) => ({
        level_id: `level-${course.id}`, // Temporary mapping
        enrolled_at: new Date().toISOString(), // Backend doesn't return this in course list
        deadline_at: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString(), // Default 10 weeks
      }));
      
      setEnrollments(mappedEnrollments);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [user]);

  const enrollInLevel = async (levelId: string, weeksToComplete: number = 10) => {
    if (!user) return false;

    try {
      // Backend enrolls in courses, not levels
      // For now, we'll need to map levelId to courseId
      // This is a simplified stub - in production you'd need proper mapping
      const courseId = parseInt(levelId.replace('level-', ''), 10);
      
      if (isNaN(courseId)) {
        console.error('Cannot enroll: levelId must map to a valid course ID');
        return false;
      }

      await apiFetch('/api/courses/enroll/', {
        method: 'POST',
        body: JSON.stringify({
          course_id: courseId,
        }),
      });
      
      await fetchEnrollments();
      return true;
    } catch (error) {
      console.error('Failed to enroll:', error);
      return false;
    }
  };

  const getEnrollment = (levelId: string): Enrollment | undefined => {
    return enrollments.find(e => e.level_id === levelId);
  };

  const getRemainingDays = (levelId: string): number | null => {
    const enrollment = getEnrollment(levelId);
    if (!enrollment) return null;

    const deadline = new Date(enrollment.deadline_at);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const isExpired = (levelId: string): boolean => {
    const remaining = getRemainingDays(levelId);
    return remaining !== null && remaining <= 0;
  };

  return {
    enrollments,
    loading,
    enrollInLevel,
    getEnrollment,
    getRemainingDays,
    isExpired,
    refreshEnrollments: fetchEnrollments
  };
};
