import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { courseData } from '@/data/courseData';
import { useProgress } from '@/hooks/useProgress';
import { useEnrollment } from '@/hooks/useEnrollment';
import { Header } from '@/components/layout/Header';
import { DashboardSkeleton } from '@/components/layout/LoadingSkeleton';
import { QnAWidget } from '@/components/qna/QnAWidget';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Flame, Lock, CheckCircle, Star, Crown, Award, Trophy, 
  Target, BarChart3, ArrowRight, Sparkles, Clock
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, profile, streak, loading: authLoading } = useAuth();
  const { 
    isModuleUnlocked, isModuleCompleted, isLevelUnlocked, isLevelCompleted,
    lessonProgress, loading: progressLoading 
  } = useProgress();
  const { getEnrollment, enrollInLevel, getRemainingDays } = useEnrollment();
  const navigate = useNavigate();
  const [lastLesson, setLastLesson] = useState<{ levelId: string; moduleId: string; lessonId: string } | null>(null);
  const [quizStats, setQuizStats] = useState({ averageScore: 0, totalAttempts: 0 });

  // Fetch last lesson and quiz stats
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch last lesson from profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('last_lesson_level_id, last_lesson_module_id, last_lesson_id')
        .eq('user_id', user.id)
        .single();

      if (profileData?.last_lesson_id) {
        setLastLesson({
          levelId: profileData.last_lesson_level_id,
          moduleId: profileData.last_lesson_module_id,
          lessonId: profileData.last_lesson_id
        });
      }

      // Fetch quiz stats
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

  const getLevelProgress = (levelId: string) => {
    const level = courseData.find(l => l.id === levelId);
    if (!level) return 0;
    
    let completedModules = 0;
    level.modules.forEach(m => {
      if (isModuleCompleted(levelId, m.id)) completedModules++;
    });
    
    return Math.round((completedModules / level.modules.length) * 100);
  };

  const getLevelIcon = (levelId: string) => {
    switch (levelId) {
      case 'beginner': return Star;
      case 'intermediate': return Crown;
      case 'advanced': return Award;
      default: return Star;
    }
  };

  const getLevelColor = (levelId: string) => {
    switch (levelId) {
      case 'beginner': return 'primary';
      case 'intermediate': return 'warning';
      case 'advanced': return 'success';
      default: return 'primary';
    }
  };

  const getCurrentLevel = () => {
    for (const level of courseData) {
      if (!isLevelCompleted(level.id)) return level;
    }
    return courseData[courseData.length - 1];
  };

  const currentLevel = getCurrentLevel();
  const completedCertificates = courseData.filter(l => isLevelCompleted(l.id)).length;

  const handleStartLevel = async (levelId: string) => {
    // Enroll if not already enrolled
    const enrollment = getEnrollment(levelId);
    if (!enrollment) {
      await enrollInLevel(levelId);
    }
    
    // Navigate to the level's first module
    const level = courseData.find(l => l.id === levelId);
    if (level && level.modules.length > 0) {
      navigate(`/module/${levelId}/${level.modules[0].id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showStreak />
      <QnAWidget contextType="dashboard" />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="tactical-card p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
              Hello, {profile?.name}! 
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-muted-foreground">
              Complete all 3 levels to get certified and join our trading team.
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm">Current Level</span>
            <span className="font-bold text-primary capitalize">{currentLevel.id}</span>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="mb-8">
          <h2 className="subheader mb-4">Your Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="tactical-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                <Flame className="h-6 w-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">{streak?.current_streak || 0}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>

            <div className="tactical-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{lessonProgress.filter(l => l.completed).length}</div>
                <div className="text-sm text-muted-foreground">Lessons Completed</div>
              </div>
            </div>

            <div className="tactical-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{quizStats.averageScore}%</div>
                <div className="text-sm text-muted-foreground">Quiz Score</div>
              </div>
            </div>

            <div className="tactical-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedCertificates}/3</div>
                <div className="text-sm text-muted-foreground">Certificates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Where Left Off */}
        {lastLesson && (
          <div className="mb-8">
            <Button 
              variant="outline" 
              size="lg"
              className="w-full justify-between gap-2"
              onClick={() => navigate(`/lesson/${lastLesson.levelId}/${lastLesson.moduleId}/${lastLesson.lessonId}`)}
            >
              <span className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Continue where you left off
              </span>
              <span className="text-muted-foreground text-sm">Resume lesson</span>
            </Button>
          </div>
        )}

        {/* Learning Path */}
        <div>
          <h2 className="subheader mb-4">Your Learning Path</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {courseData.map((level) => {
              const isUnlocked = isLevelUnlocked(level.id);
              const isComplete = isLevelCompleted(level.id);
              const progress = getLevelProgress(level.id);
              const isCurrent = currentLevel.id === level.id && !isComplete;
              const LevelIcon = getLevelIcon(level.id);
              const color = getLevelColor(level.id);
              const enrollment = getEnrollment(level.id);
              const remainingDays = enrollment ? getRemainingDays(level.id) : null;

              return (
                <div 
                  key={level.id}
                  className={`tactical-card p-6 relative transition-all ${
                    isCurrent ? `border-${color} ring-2 ring-${color}/20` : ''
                  } ${!isUnlocked ? 'opacity-60' : ''}`}
                >
                  {isCurrent && (
                    <div className={`absolute -top-3 right-4 px-3 py-1 bg-${color} text-${color}-foreground text-xs font-medium rounded-full flex items-center gap-1`}>
                      <Sparkles className="h-3 w-3" />
                      Current
                    </div>
                  )}

                  {!isUnlocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-xl bg-${color}/20 flex items-center justify-center mb-4`}>
                    <LevelIcon className={`h-6 w-6 text-${color}`} />
                  </div>

                  <div className="caption text-muted-foreground mb-1">LEVEL {courseData.indexOf(level) + 1}</div>
                  <h3 className="text-xl font-bold mb-1 capitalize">{level.id}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{level.description}</p>

                  {/* Deadline Badge */}
                  {enrollment && remainingDays !== null && remainingDays > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>{remainingDays} days remaining</span>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <Button 
                    className="w-full"
                    variant={isComplete ? 'outline' : isUnlocked ? 'default' : 'secondary'}
                    disabled={!isUnlocked}
                    onClick={() => isUnlocked && handleStartLevel(level.id)}
                  >
                    {isComplete ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : isUnlocked ? (
                      'Continue'
                    ) : (
                      'Locked'
                    )}
                  </Button>
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
