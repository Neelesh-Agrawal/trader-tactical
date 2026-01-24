import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Enrollment {
  level_id: string;
  enrolled_at: string;
  deadline_at: string;
}

export const useEnrollment = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('level_enrollments')
      .select('level_id, enrolled_at, deadline_at')
      .eq('user_id', user.id);

    if (!error && data) {
      setEnrollments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEnrollments();
  }, [user]);

  const enrollInLevel = async (levelId: string, weeksToComplete: number = 10) => {
    if (!user) return;

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + (weeksToComplete * 7));

    const { error } = await supabase
      .from('level_enrollments')
      .upsert({
        user_id: user.id,
        level_id: levelId,
        deadline_at: deadline.toISOString()
      }, {
        onConflict: 'user_id,level_id'
      });

    if (!error) {
      await fetchEnrollments();
    }

    return !error;
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
