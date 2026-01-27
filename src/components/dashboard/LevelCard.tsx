import { useNavigate } from 'react-router-dom';
import { useProgress } from '@/hooks/useProgress';
import { useEnrollment } from '@/hooks/useEnrollment';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Lock, CheckCircle, Star, Crown, Award, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Level } from '@/data/courseData';

interface LevelCardProps {
  level: Level;
  levelIndex: number;
  isCurrent: boolean;
}

// Color schemes for each level
const levelColors = {
  beginner: {
    accent: 'emerald',
    bg: 'from-emerald-500/10 to-emerald-500/5',
    border: 'border-emerald-500/30 hover:border-emerald-500/50',
    ring: 'text-emerald-500',
    icon: 'bg-emerald-500/20 text-emerald-500',
    glow: 'hover:shadow-emerald-500/20',
  },
  intermediate: {
    accent: 'blue',
    bg: 'from-blue-500/10 to-blue-500/5',
    border: 'border-blue-500/30 hover:border-blue-500/50',
    ring: 'text-blue-500',
    icon: 'bg-blue-500/20 text-blue-500',
    glow: 'hover:shadow-blue-500/20',
  },
  advanced: {
    accent: 'purple',
    bg: 'from-purple-500/10 to-purple-500/5',
    border: 'border-purple-500/30 hover:border-purple-500/50',
    ring: 'text-purple-500',
    icon: 'bg-purple-500/20 text-purple-500',
    glow: 'hover:shadow-purple-500/20',
  },
};

export const LevelCard = ({ level, levelIndex, isCurrent }: LevelCardProps) => {
  const navigate = useNavigate();
  const { isLevelUnlocked, isLevelCompleted, isModuleCompleted, isLessonCompleted } = useProgress();
  const { getEnrollment, enrollInLevel, getRemainingDays } = useEnrollment();

  const isUnlocked = isLevelUnlocked(level.id);
  const isComplete = isLevelCompleted(level.id);
  const enrollment = getEnrollment(level.id);
  const remainingDays = enrollment ? getRemainingDays(level.id) : null;

  // Get color scheme
  const colors = levelColors[level.id as keyof typeof levelColors] || levelColors.beginner;

  // Calculate progress
  const getLevelProgress = () => {
    let completedLessons = 0;
    let totalLessons = 0;
    level.modules.forEach(m => {
      m.lessons.forEach(l => {
        totalLessons++;
        if (isLessonCompleted(level.id, m.id, l.id)) completedLessons++;
      });
    });
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const progress = getLevelProgress();

  // Estimate remaining time (rough: 5 min per lesson)
  const getRemainingTime = () => {
    let remainingLessons = 0;
    level.modules.forEach(m => {
      m.lessons.forEach(l => {
        if (!isLessonCompleted(level.id, m.id, l.id)) remainingLessons++;
      });
    });
    const hours = Math.ceil((remainingLessons * 5) / 60);
    return hours > 0 ? `~${hours}h remaining` : 'Complete';
  };

  const getLevelIcon = () => {
    switch (level.id) {
      case 'beginner': return Star;
      case 'intermediate': return Crown;
      case 'advanced': return Award;
      default: return Star;
    }
  };

  const LevelIcon = getLevelIcon();

  const handleClick = async () => {
    if (!isUnlocked) return;
    if (!enrollment) {
      await enrollInLevel(level.id);
    }
    navigate(`/level/${level.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative rounded-xl p-6 transition-all duration-300 cursor-pointer",
        "bg-gradient-to-br border",
        colors.bg,
        isUnlocked ? colors.border : "border-muted/30",
        isUnlocked && `hover:scale-[1.02] hover:shadow-xl ${colors.glow}`,
        !isUnlocked && "opacity-60 cursor-not-allowed grayscale",
        isCurrent && !isComplete && "ring-2 ring-offset-2 ring-offset-background ring-primary/50"
      )}
    >
      {/* Completed Badge */}
      {isComplete && (
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
          <CheckCircle className="h-5 w-5 text-white" />
        </div>
      )}

      {/* Lock Icon for locked levels */}
      {!isUnlocked && (
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        {/* Progress Ring */}
        <div className="relative mb-4">
          {isUnlocked ? (
            <ProgressRing 
              progress={progress} 
              size={80} 
              strokeWidth={6}
              className={colors.ring}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          
          {/* Icon in center of ring */}
          {isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", colors.icon)}>
                <LevelIcon className="h-5 w-5" />
              </div>
            </div>
          )}
        </div>

        {/* Level Label */}
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1">
          Level {levelIndex + 1}
        </span>

        {/* Level Name */}
        <h3 className="font-ui text-xl font-semibold capitalize mb-2">{level.id}</h3>

        {/* Progress or Status */}
        {isUnlocked ? (
          <>
            <p className="font-mono text-2xl font-bold mb-1" style={{ color: `var(--${colors.accent}-500, currentColor)` }}>
              {progress}%
            </p>
            <p className="font-ui text-sm text-muted-foreground">
              {isComplete ? 'Completed' : getRemainingTime()}
            </p>
          </>
        ) : (
          <p className="font-ui text-sm text-muted-foreground">
            Complete previous level to unlock
          </p>
        )}

        {/* Deadline */}
        {enrollment && remainingDays !== null && remainingDays > 0 && !isComplete && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{remainingDays} days left</span>
          </div>
        )}
      </div>
    </div>
  );
};
