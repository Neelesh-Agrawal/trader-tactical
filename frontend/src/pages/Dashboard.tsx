import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { useProgress } from '@/hooks/useProgress';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/landing/Footer';
import { DashboardSkeleton } from '@/components/layout/LoadingSkeleton';
import { QnAWidget } from '@/components/qna/QnAWidget';
import { LevelCard } from '@/components/dashboard/LevelCard';
import { ContinueLearning } from '@/components/dashboard/ContinueLearning';
import { Flame, Target, TrendingUp, BookOpen } from 'lucide-react';

const Dashboard = () => {
  const { user, profile, streak, loading: authLoading } = useAuth();
  const { levels, loading: coursesLoading } = useCourses();
  const { isLevelCompleted, isLessonCompleted, lessonProgress, loading: progressLoading } = useProgress();

  const loading = authLoading || coursesLoading || progressLoading;

  if (loading) {
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
    for (const level of levels) {
      if (!isLevelCompleted(level.id)) return level;
    }
    return levels[levels.length - 1];
  };

  const currentLevel = getCurrentLevel();
  const completedLessons = lessonProgress.filter(l => l.completed).length;

  // Calculate next milestone
  const getNextMilestone = () => {
    for (const level of levels) {
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header showStreak />
      <QnAWidget contextType="dashboard" />

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl flex-1">
        {/* Continue Learning Hero Card */}
        <div className="mb-8 sm:mb-10 animate-fade-in">
          <ContinueLearning />
        </div>

        {/* Level Cards Section */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-foreground">Your Learning Path</h2>
          {/* Single column on mobile, 3 columns on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {levels.map((level, index) => {
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

        {/* Quick Stats Section - 2 columns on mobile, 3 on desktop */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-foreground">Quick Stats</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Lessons Completed */}
            <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-card border border-border hover:border-success/30 transition-colors touch-manipulation">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xl sm:text-2xl font-bold text-foreground">{completedLessons}</p>
                <p className="font-ui text-xs sm:text-sm text-muted-foreground truncate">Lessons</p>
              </div>
            </div>

            {/* Current Streak */}
            <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-card border border-border hover:border-warning/30 transition-colors touch-manipulation">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-warning" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xl sm:text-2xl font-bold text-foreground">{streak?.current_streak || 0}</p>
                <p className="font-ui text-xs sm:text-sm text-muted-foreground truncate">Day Streak</p>
              </div>
            </div>

            {/* Next Milestone - Full width on mobile when 3rd item */}
            <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors col-span-2 lg:col-span-1 touch-manipulation">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-ui text-xs sm:text-sm font-medium text-foreground">Next Milestone</p>
                <p className="font-body text-xs sm:text-sm text-muted-foreground line-clamp-1">{getNextMilestone()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
