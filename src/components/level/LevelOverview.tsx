import { useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { useEnrollment } from '@/hooks/useEnrollment';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  CheckCircle, Clock, BookOpen, Lock, ArrowRight, 
  TrendingUp, Target, Shield, Zap, BarChart3, 
  Layers, GitBranch, Compass, Lightbulb, Award,
  PieChart, Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Level } from '@/data/courseData';

interface LevelOverviewProps {
  level: Level;
  onModuleSelect: (moduleId: string) => void;
  onLessonSelect: (moduleId: string, lessonId: string) => void;
}

// Module icons mapping
const moduleIcons = [
  TrendingUp, Target, Shield, Zap, BarChart3, 
  Layers, GitBranch, Compass, Lightbulb, Award,
  PieChart, Rocket
];

// Gradient configurations for different module ranges
const getModuleGradient = (index: number) => {
  if (index < 3) return {
    bg: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    border: 'border-emerald-500/20',
    accent: 'text-emerald-600',
    glow: 'shadow-emerald-500/20'
  };
  if (index < 6) return {
    bg: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    border: 'border-blue-500/20',
    accent: 'text-blue-600',
    glow: 'shadow-blue-500/20'
  };
  if (index < 9) return {
    bg: 'from-purple-500/10 via-pink-500/5 to-transparent',
    border: 'border-purple-500/20',
    accent: 'text-purple-600',
    glow: 'shadow-purple-500/20'
  };
  return {
    bg: 'from-orange-500/10 via-amber-500/5 to-transparent',
    border: 'border-orange-500/20',
    accent: 'text-orange-600',
    glow: 'shadow-orange-500/20'
  };
};

// Determine card size based on index (featured vs regular)
const getCardSize = (index: number, total: number) => {
  // First 2 modules are featured (large)
  if (index < 2) return 'featured';
  // Last module if odd count gets full width
  if (index === total - 1 && total % 2 !== 0) return 'featured';
  return 'regular';
};

export const LevelOverview = ({ level, onModuleSelect, onLessonSelect }: LevelOverviewProps) => {
  const { isModuleUnlocked, isModuleCompleted, isLessonCompleted } = useProgress();
  const { getEnrollment, getRemainingDays } = useEnrollment();
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  const enrollment = getEnrollment(level.id);
  const remainingDays = enrollment ? getRemainingDays(level.id) : null;

  // Calculate progress for each module
  const getModuleProgress = (moduleId: string) => {
    const module = level.modules.find(m => m.id === moduleId);
    if (!module) return { completed: 0, total: 0, percent: 0 };
    
    let completed = 0;
    module.lessons.forEach(lesson => {
      if (isLessonCompleted(level.id, moduleId, lesson.id)) completed++;
    });
    return {
      completed,
      total: module.lessons.length,
      percent: Math.round((completed / module.lessons.length) * 100)
    };
  };

  // Find first incomplete lesson in a module
  const getNextLesson = (moduleId: string) => {
    const module = level.modules.find(m => m.id === moduleId);
    if (!module) return null;
    
    for (const lesson of module.lessons) {
      if (!isLessonCompleted(level.id, moduleId, lesson.id)) {
        return lesson;
      }
    }
    return null;
  };

  // Get previous module name for unlock tooltip
  const getPrevModuleName = (index: number) => {
    if (index === 0) return null;
    return level.modules[index - 1]?.title || `Module ${index}`;
  };

  const handleModuleClick = (moduleId: string, isUnlocked: boolean) => {
    if (isUnlocked) {
      onModuleSelect(moduleId);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Level Header */}
      <div className="text-center pb-8 border-b border-border">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 capitalize text-foreground">{level.id} Level</h1>
        <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto" style={{ lineHeight: '1.75' }}>{level.description}</p>
        
        {/* Deadline Badge */}
        {enrollment && remainingDays !== null && remainingDays > 0 && (
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-warning/10 border border-warning/20 text-warning">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{remainingDays} days remaining</span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 text-center">
          <div className="font-mono text-3xl font-bold text-primary">{level.modules.length}</div>
          <div className="font-ui text-sm text-muted-foreground">Modules</div>
        </div>
        <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 text-center">
          <div className="font-mono text-3xl font-bold text-primary">
            {level.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
          </div>
          <div className="font-ui text-sm text-muted-foreground">Lessons</div>
        </div>
        <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 text-center">
          <div className="font-mono text-3xl font-bold text-success">
            {level.modules.filter(m => isModuleCompleted(level.id, m.id)).length}
          </div>
          <div className="font-ui text-sm text-muted-foreground">Completed</div>
        </div>
      </div>

      {/* Bento Grid Modules */}
      <div className="space-y-4">
        <h2 className="font-ui text-xl font-semibold">Your Learning Path</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {level.modules.map((module, index) => {
            const isUnlocked = isModuleUnlocked(level.id, module.id);
            const isComplete = isModuleCompleted(level.id, module.id);
            const progress = getModuleProgress(module.id);
            const nextLesson = getNextLesson(module.id);
            const isCurrent = isUnlocked && !isComplete && progress.percent > 0;
            const cardSize = getCardSize(index, level.modules.length);
            const gradient = getModuleGradient(index);
            const ModuleIcon = moduleIcons[index % moduleIcons.length];
            const isHovered = hoveredModule === module.id;

            const cardContent = (
              <div
                className={cn(
                  "group relative rounded-2xl border overflow-hidden transition-all duration-300",
                  "bg-gradient-to-br",
                  gradient.bg,
                  gradient.border,
                  // Size classes
                  cardSize === 'featured' && "md:col-span-2",
                  // Interactive states
                  isUnlocked && [
                    "cursor-pointer",
                    "hover:scale-[1.02] hover:shadow-xl",
                    gradient.glow,
                    "hover:backdrop-blur-sm"
                  ],
                  !isUnlocked && "cursor-not-allowed",
                  // State-based styling
                  isComplete && "border-success/40 ring-1 ring-success/20",
                  isCurrent && "border-primary/50 ring-2 ring-primary/30 animate-pulse-glow"
                )}
                onClick={() => handleModuleClick(module.id, isUnlocked)}
                onMouseEnter={() => setHoveredModule(module.id)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                {/* Locked Overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-2">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="font-ui text-xs text-muted-foreground">
                        Complete {getPrevModuleName(index)} first
                      </p>
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className={cn(
                  "p-5 md:p-6",
                  cardSize === 'featured' && "md:flex md:gap-6"
                )}>
                  {/* Left Section: Icon & Progress */}
                  <div className={cn(
                    "flex items-start gap-4 mb-4",
                    cardSize === 'featured' && "md:flex-col md:items-center md:mb-0 md:w-32"
                  )}>
                    {/* Module Icon */}
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                      "bg-background/80 border shadow-sm",
                      gradient.border,
                      isHovered && isUnlocked && "scale-110 shadow-md"
                    )}>
                      <ModuleIcon className={cn("h-6 w-6", gradient.accent)} />
                    </div>

                    {/* Progress Ring - Larger on featured cards */}
                    {isUnlocked && (
                      <div className={cn(
                        cardSize === 'featured' && "hidden md:block"
                      )}>
                        <ProgressRing 
                          progress={progress.percent} 
                          size={cardSize === 'featured' ? 80 : 56} 
                          strokeWidth={cardSize === 'featured' ? 6 : 4}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Section: Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                          Module {index + 1}
                        </span>
                        <h3 className={cn(
                          "font-display font-bold leading-tight transition-colors",
                          cardSize === 'featured' ? "text-xl md:text-2xl" : "text-lg",
                          isUnlocked && "group-hover:text-primary"
                        )}>
                          {module.title}
                        </h3>
                      </div>

                      {/* Completion Badge */}
                      {isComplete && (
                        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span className="font-ui text-xs font-medium">Completed</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className={cn(
                      "font-body text-muted-foreground mb-4",
                      cardSize === 'featured' ? "text-sm md:text-base line-clamp-3" : "text-sm line-clamp-2"
                    )}>
                      {module.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{module.lessons.length} lessons</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>~{Math.ceil(module.lessons.length * 15 / 60 * 10) / 10} hours</span>
                      </div>
                      {isUnlocked && progress.percent > 0 && !isComplete && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                          <span>{progress.completed}/{progress.total} completed</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar (for unlocked, incomplete modules) */}
                    {isUnlocked && !isComplete && (
                      <div className="mb-4">
                        <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {isUnlocked && nextLesson && !isComplete && (
                      <Button
                        variant="default"
                        size={cardSize === 'featured' ? 'default' : 'sm'}
                        className="gap-2 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLessonSelect(module.id, nextLesson.id);
                        }}
                      >
                        {progress.percent > 0 ? 'Continue Learning' : 'Start Module'}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}

                    {isComplete && (
                      <Button 
                        variant="outline" 
                        size={cardSize === 'featured' ? 'default' : 'sm'}
                        className="gap-2 text-success border-success/30 hover:bg-success/10"
                      >
                        Review Module
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );

            // Wrap locked modules in tooltip
            if (!isUnlocked) {
              return (
                <Tooltip key={module.id}>
                  <TooltipTrigger asChild>
                    {cardContent}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Complete "{getPrevModuleName(index)}" to unlock</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={module.id}>{cardContent}</div>;
          })}
        </div>
      </div>

      {/* Final Assessment Card */}
      {level.finalAssessment.length > 0 && (
        <div className="rounded-2xl border bg-gradient-to-br from-warning/10 via-amber-500/5 to-transparent border-warning/30 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-warning/20 flex items-center justify-center text-4xl shrink-0">
              🏆
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display text-2xl font-bold mb-2">Final Assessment</h3>
              <p className="font-body text-muted-foreground mb-4">
                Complete all modules to unlock the final assessment and earn your certificate for the {level.id} level.
              </p>
              <Button disabled variant="secondary" className="gap-2">
                <Lock className="h-4 w-4" />
                Complete all modules to unlock
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};