import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/hooks/useCourses';
import { startHostedCheckout } from '@/hooks/useCheckout';
import { isAuthRequired } from '@/config/appConfig';
import { findNismCourseId } from '@/lib/courseCatalog';

export const useNismCheckout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses } = useCourses();

  const startNismCheckout = useCallback(async () => {
    if (isAuthRequired() && !user) {
      navigate('/login');
      return;
    }

    const backendCourseId = findNismCourseId(courses);
    if (!backendCourseId) {
      toast.error('NISM is not available for purchase right now. Please contact support.');
      return;
    }

    try {
      await startHostedCheckout(backendCourseId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to start payment right now.';
      toast.error(message);
    }
  }, [courses, navigate, user]);

  return { startNismCheckout };
};
