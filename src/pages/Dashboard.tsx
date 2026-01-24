import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { courseData } from '@/data/courseData';
import { useProgress } from '@/hooks/useProgress';
import { Flame, Lock, CheckCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HexModule = ({ 
  module, 
  levelId,
  status, 
  onClick 
}: { 
  module: { id: string; title: string; icon: string; description: string };
  levelId: string;
  status: 'complete' | 'active' | 'locked';
  onClick: () => void;
}) => {
  const statusColors = {
    complete: 'bg-success border-success text-success-foreground',
    active: 'bg-warning/20 border-warning text-foreground hover:bg-warning/30',
    locked: 'bg-locked border-locked text-locked-foreground cursor-not-allowed'
  };

  return (
    <button
      onClick={onClick}
      disabled={status === 'locked'}
      className={`hex-shape w-32 h-36 md:w-40 md:h-44 flex flex-col items-center justify-center border-2 transition-all ${statusColors[status]} ${status !== 'locked' ? 'hover:scale-105' : ''}`}
    >
      <span className="text-3xl mb-2">{module.icon}</span>
      <span className="text-xs md:text-sm font-medium text-center px-2 leading-tight">
        {module.title.split(' ').slice(0, 3).join(' ')}
      </span>
      {status === 'complete' && <CheckCircle className="h-4 w-4 mt-2" />}
      {status === 'locked' && <Lock className="h-4 w-4 mt-2" />}
      {status === 'active' && <Play className="h-4 w-4 mt-2" />}
    </button>
  );
};

const Dashboard = () => {
  const { user, profile, streak, loading, signOut } = useAuth();
  const { isModuleUnlocked, isModuleCompleted, isLevelUnlocked } = useProgress();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mono text-muted-foreground">LOADING TACTICAL MAP...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getModuleStatus = (levelId: string, moduleId: string): 'complete' | 'active' | 'locked' => {
    if (!isLevelUnlocked(levelId)) return 'locked';
    if (isModuleCompleted(levelId, moduleId)) return 'complete';
    if (isModuleUnlocked(levelId, moduleId)) return 'active';
    return 'locked';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">TRADEMASTER</h1>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-warning/20 text-warning">
              <Flame className="h-4 w-4 streak-flame" />
              <span className="mono text-sm font-medium">{streak?.current_streak || 0} DAY STREAK</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              Welcome, {profile?.name?.split(' ')[0]}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Streak */}
      <div className="md:hidden p-4 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-warning/20 text-warning">
          <Flame className="h-5 w-5 streak-flame" />
          <span className="mono font-medium">{streak?.current_streak || 0} DAY STREAK</span>
        </div>
      </div>

      {/* Tactical Map */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Tactical Map</h2>
          <p className="text-muted-foreground">Select a module to begin your training</p>
        </div>

        {courseData.map((level) => {
          const isUnlocked = isLevelUnlocked(level.id);
          
          return (
            <div key={level.id} className="mb-16">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className={`h-px flex-1 max-w-24 ${isUnlocked ? 'bg-primary' : 'bg-border'}`} />
                <h3 className={`text-xl font-bold uppercase tracking-wider ${!isUnlocked ? 'text-locked-foreground' : ''}`}>
                  {!isUnlocked && <Lock className="inline h-4 w-4 mr-2" />}
                  {level.title} Level
                </h3>
                <div className={`h-px flex-1 max-w-24 ${isUnlocked ? 'bg-primary' : 'bg-border'}`} />
              </div>

              <div className={`flex flex-wrap justify-center gap-4 md:gap-6 ${!isUnlocked ? 'locked-blur' : ''}`}>
                {level.modules.map((module, idx) => (
                  <HexModule
                    key={module.id}
                    module={module}
                    levelId={level.id}
                    status={getModuleStatus(level.id, module.id)}
                    onClick={() => navigate(`/module/${level.id}/${module.id}`)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
