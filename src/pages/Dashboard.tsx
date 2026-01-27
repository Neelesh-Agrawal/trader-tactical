import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { courseData } from '@/data/courseData';
import { useProgress } from '@/hooks/useProgress';
import { Header } from '@/components/layout/Header';
import { DashboardSkeleton } from '@/components/layout/LoadingSkeleton';
import { QnAWidget } from '@/components/qna/QnAWidget';
import { LevelCard } from '@/components/dashboard/LevelCard';
import { ContinueLearning } from '@/components/dashboard/ContinueLearning';
import { Flame, Target, TrendingUp, BookOpen } from 'lucide-react';

const Dashboard = () => {
  const { user, profile, streak, loading: authLoading } = useAuth();
  const { isLevelCompleted, isLessonCompleted, lessonProgress, loading: progressLoading } = useProgress();

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
  const completedLessons = lessonProgress.filter(l => l.completed).length;

  // Calculate next milestone
  const getNextMilestone = () => {
    for (const level of courseData) {
      for (const module of level.modules) {
        let completedInModule = 0;
        let totalInModule = module.lessons.length;
        
        for (const lesson of module.lessons) {
          if (isLessonCompleted(level.id, module.id, lesson.id)) {
            completedInModule++;
          }
        }
        
        if (completedInModule < totalInModule) {
          const remaining = totalInModule - completedInModule;
          return `${remaining} lesson${remaining > 1 ? 's' : ''} to complete ${module.title}`;
        }
      }
    }
    return 'All modules complete!';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showStreak />
      <QnAWidget contextType="dashboard" />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Continue Learning Hero Card */}
        <div className="mb-10 animate-fade-in">
          <ContinueLearning />
        </div>

        {/* Level Cards Section */}
        <div className="mb-10">
          <h2 className="font-ui text-xl font-semibold mb-6 text-foreground">Your Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courseData.map((level, index) => {
              const isCurrent = currentLevel.id === level.id && !isLevelCompleted(level.id);
              
              return (
                <div 
                  key={level.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
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

        {/* Quick Stats Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="font-ui text-xl font-semibold mb-6 text-foreground">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Lessons Completed */}
            <div className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-foreground">{completedLessons}</p>
                <p className="font-ui text-sm text-muted-foreground">Lessons Completed</p>
              </div>
            </div>

            {/* Current Streak */}
            <div className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-orange-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-foreground">{streak?.current_streak || 0}</p>
                <p className="font-ui text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>

            {/* Next Milestone */}
            <div className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="font-ui text-sm font-medium text-foreground">Next Milestone</p>
                <p className="font-body text-sm text-muted-foreground line-clamp-1">{getNextMilestone()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
