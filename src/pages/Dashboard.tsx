import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { courseData } from '@/data/courseData';
import { useProgress } from '@/hooks/useProgress';
import { Header } from '@/components/layout/Header';
import { DashboardSkeleton } from '@/components/layout/LoadingSkeleton';
import { QnAWidget } from '@/components/qna/QnAWidget';
import { LevelCard } from '@/components/dashboard/LevelCard';
import { ContinueLearning } from '@/components/dashboard/ContinueLearning';
import { Flame, Target, Trophy, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, profile, streak, loading: authLoading } = useAuth();
  const { isLevelCompleted, lessonProgress, loading: progressLoading } = useProgress();
  const [quizStats, setQuizStats] = useState({ averageScore: 0, totalAttempts: 0 });

  // Fetch quiz stats
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const { data: quizData } = await supabase
        .from('quiz_attempts')
        .select('score')
        .eq('user_id', user.id)
        .eq('passed', true);

      if (quizData && quizData.length > 0) {
        const avgScore = quizData.reduce((sum, q) => sum + q.score, 0) / quizData.length;
        setQuizStats({ averageScore: Math.round(avgScore), totalAttempts: quizData.length });
      }
    };

    fetchData();
  }, [user]);

  if (authLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header showStreak />
        <DashboardSkeleton />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getCurrentLevel = () => {
    for (const level of courseData) {
      if (!isLevelCompleted(level.id)) return level;
    }
    return courseData[courseData.length - 1];
  };

  const currentLevel = getCurrentLevel();
  const completedCertificates = courseData.filter(l => isLevelCompleted(l.id)).length;

  return (
    <div className="min-h-screen bg-background">
      <Header showStreak />
      <QnAWidget contextType="dashboard" />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {profile?.name}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Continue your journey to becoming a certified options trader.
          </p>
        </div>

        {/* Continue Learning Card */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <ContinueLearning />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="tactical-card p-4 flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
              <Flame className="h-6 w-6 text-warning streak-flame" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">{streak?.current_streak || 0}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>

          <div className="tactical-card p-4 flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
              <Target className="h-6 w-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">{lessonProgress.filter(l => l.completed).length}</div>
              <div className="text-sm text-muted-foreground">Lessons</div>
            </div>
          </div>

          <div className="tactical-card p-4 flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">{quizStats.averageScore}%</div>
              <div className="text-sm text-muted-foreground">Avg Score</div>
            </div>
          </div>

          <div className="tactical-card p-4 flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">{completedCertificates}/3</div>
              <div className="text-sm text-muted-foreground">Certificates</div>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
          <h2 className="subheader mb-6">Your Learning Path</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {courseData.map((level, index) => {
              const isCurrent = currentLevel.id === level.id && !isLevelCompleted(level.id);
              
              return (
                <div 
                  key={level.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <LevelCard 
                    level={level}
                    levelIndex={index}
                    isCurrent={isCurrent}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
