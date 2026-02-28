import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { useCourses } from '@/hooks/useCourses';
import { Header } from '@/components/layout/Header';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Confetti } from '@/components/ui/confetti';
import { Trophy, CheckCircle, ArrowRight, Star, Lock, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const LevelFinal = () => {
  const { levelId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { isModuleCompleted, isLevelCompleted, isLevelUnlocked, loading: progressLoading } = useProgress();
  const { levels, loading: coursesLoading, getLevelById } = useCourses();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const loading = authLoading || progressLoading || coursesLoading;

  const level = levelId ? getLevelById(levelId) : null;

  useEffect(() => {
    if (level && isLevelCompleted(levelId!)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [level, levelId, isLevelCompleted]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!levelId || !level) {
    return <Navigate to="/dashboard" replace />;
  }

  const allModulesComplete = level.modules.every(m => isModuleCompleted(levelId!, m.id));
  const levelComplete = isLevelCompleted(levelId);

  // Find next level
  const levelIndex = levels.findIndex(l => l.id === levelId);
  const nextLevel = levels[levelIndex + 1];

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && <Confetti />}
      <Header showStreak />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumb items={[
          { label: level.title, href: `/dashboard` },
          { label: 'Level Assessment' }
        ]} />

        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-6">
            <Trophy className="h-12 w-12 text-warning" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {level.title} Level Assessment
          </h1>
          
          <p className="text-muted-foreground prose-body max-w-xl mx-auto">
            {levelComplete 
              ? "Congratulations! You've mastered this level."
              : "Complete all modules to unlock the final assessment."}
          </p>
        </div>

        {/* Module Status */}
        <div className="tactical-card p-6 mb-8">
          <h2 className="subheader mb-6">Module Completion Status</h2>
          <div className="grid gap-3">
            {level.modules.map((module, index) => {
              const isComplete = isModuleCompleted(levelId, module.id);
              return (
                <div 
                  key={module.id}
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    isComplete ? 'bg-success/10' : 'bg-muted/30'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isComplete ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {isComplete ? <CheckCircle className="h-5 w-5" /> : <span>{index + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{module.title}</p>
                    <p className="text-sm text-muted-foreground">{module.lessons.length} lessons</p>
                  </div>
                  {isComplete && (
                    <Star className="h-5 w-5 text-warning" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Area */}
        {levelComplete ? (
          <div className="tactical-card p-8 text-center border-success">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-success" />
            <h3 className="text-2xl font-bold mb-2 text-success">Level Complete!</h3>
            <p className="text-muted-foreground mb-6">
              You've successfully completed the {level.title} level.
            </p>
            
            {nextLevel ? (
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="gap-2"
              >
                Continue to {nextLevel.title}
                <ArrowRight className="h-5 w-5" />
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-lg font-medium text-warning mb-4">
                  🎉 You've completed all levels!
                </p>
                <Button onClick={() => navigate('/dashboard')}>
                  Return to Dashboard
                </Button>
              </div>
            )}
          </div>
        ) : allModulesComplete ? (
          <div className="tactical-card p-8 text-center border-primary">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-warning" />
            <h3 className="text-2xl font-bold mb-2">Ready for Final Assessment</h3>
            <p className="text-muted-foreground mb-6">
              All modules completed! Take the final assessment to complete this level.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate(`/quiz/level/${levelId}`)}
              className="gap-2"
            >
              Begin Final Assessment
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="tactical-card p-8 text-center border-muted">
            <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-bold mb-2">Assessment Locked</h3>
            <p className="text-muted-foreground mb-6">
              Complete all modules to unlock the level assessment.
            </p>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelFinal;
