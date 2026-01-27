import { useNavigate } from 'react-router-dom';
import { useProgress } from '@/hooks/useProgress';
import { useEnrollment } from '@/hooks/useEnrollment';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle, Star, Crown, Award, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Level } from '@/data/courseData';

interface LevelCardProps {
  level: Level;
  levelIndex: number;
  isCurrent: boolean;
}

export const LevelCard = ({ level, levelIndex, isCurrent }: LevelCardProps) => {
  const navigate = useNavigate();
  const { isLevelUnlocked, isLevelCompleted, isModuleCompleted } = useProgress();
  const { getEnrollment, enrollInLevel, getRemainingDays } = useEnrollment();

  const isUnlocked = isLevelUnlocked(level.id);
  const isComplete = isLevelCompleted(level.id);
  const enrollment = getEnrollment(level.id);
  const remainingDays = enrollment ? getRemainingDays(level.id) : null;

  const getLevelProgress = () => {
    let completedModules = 0;
    level.modules.forEach(m => {
      if (isModuleCompleted(level.id, m.id)) completedModules++;
    });
    return Math.round((completedModules / level.modules.length) * 100);
  };

  const progress = getLevelProgress();

  const getLevelIcon = () => {
    switch (level.id) {
      case 'beginner': return Star;
      case 'intermediate': return Crown;
      case 'advanced': return Award;
      default: return Star;
    }
  };

  const LevelIcon = getLevelIcon();

  const handleEnter = async () => {
    if (!enrollment) {
      await enrollInLevel(level.id);
    }
    navigate(`/level/${level.id}`);
  };

  return (
    <div
      className={cn(
        "group tactical-card p-6 relative transition-all duration-300",
        "hover:scale-[1.02] hover:border-primary/50",
        isCurrent && "border-primary ring-2 ring-primary/20",
        !isUnlocked && "opacity-60 cursor-not-allowed",
        isComplete && "border-success/50"
      )}
    >
      {/* Current Badge */}
      {isCurrent && !isComplete && (
        <div className="absolute -top-3 right-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1 animate-pulse-glow">
          Current
        </div>
      )}

      {/* Completed Badge */}
      {isComplete && (
        <div className="absolute -top-3 right-4 px-3 py-1 bg-success text-success-foreground text-xs font-medium rounded-full flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Completed
        </div>
      )}

      {/* Locked Overlay */}
      {!isUnlocked && (
        <div className="absolute top-4 right-4">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
      )}

      <div className="flex items-start gap-6">
        {/* Progress Ring */}
        <div className="shrink-0">
          {isUnlocked ? (
            <ProgressRing 
              progress={progress} 
              size={80} 
              strokeWidth={6}
              className={cn(
                "transition-all duration-300",
                "group-hover:scale-105"
              )}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <LevelIcon className={cn(
              "h-5 w-5",
              isComplete ? "text-success" : 
              isUnlocked ? "text-primary" : "text-muted-foreground"
            )} />
            <span className="caption text-muted-foreground">LEVEL {levelIndex + 1}</span>
          </div>
          
          <h3 className="font-ui text-xl font-semibold mb-2 capitalize">{level.id}</h3>
          <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">{level.description}</p>

          {/* Deadline */}
          {enrollment && remainingDays !== null && remainingDays > 0 && !isComplete && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Clock className="h-4 w-4" />
              <span>{remainingDays} days remaining</span>
            </div>
          )}

          {/* Modules Count */}
          <div className="text-sm text-muted-foreground mb-4">
            {level.modules.length} modules • {level.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
          </div>

          {/* Action Button */}
          <Button
            className="w-full transition-all duration-200 group-hover:shadow-lg"
            variant={isComplete ? 'outline' : isUnlocked ? 'default' : 'secondary'}
            disabled={!isUnlocked}
            onClick={handleEnter}
          >
            {isComplete ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Review
              </>
            ) : isUnlocked ? (
              'Enter Level'
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Locked
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
