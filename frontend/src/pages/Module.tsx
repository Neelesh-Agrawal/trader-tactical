import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { useCourses } from '@/hooks/useCourses';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Lock, Play, Trophy } from 'lucide-react';

const Module = () => {
  const { levelId, moduleId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { isLessonCompleted, isModuleCompleted, isLevelUnlocked, loading: progressLoading } = useProgress();
  const { levels, loading: coursesLoading, getLevelById, getModuleById } = useCourses();
  const navigate = useNavigate();

  const loading = authLoading || progressLoading || coursesLoading;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mono text-muted-foreground">LOADING MODULE...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!levelId || !moduleId) {
    return <Navigate to="/dashboard" replace />;
  }

  const level = getLevelById(levelId);
  const module = getModuleById(levelId, moduleId);

  if (!level || !module) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isLevelUnlocked(levelId)) {
    return <Navigate to="/dashboard" replace />;
  }

  const completedLessons = module.lessons.filter(
    lesson => isLessonCompleted(levelId, moduleId, lesson.id)
  ).length;

  const allLessonsCompleted = completedLessons === module.lessons.length && module.lessons.length > 0;
  const moduleComplete = isModuleCompleted(levelId, moduleId);

  const getLessonStatus = (lessonIndex: number, lessonId: string): 'complete' | 'active' | 'locked' => {
    if (isLessonCompleted(levelId, moduleId, lessonId)) return 'complete';
    
    // First lesson is always unlocked
    if (lessonIndex === 0) return 'active';
    
    // Unlock if previous lesson is complete
    const prevLesson = module.lessons[lessonIndex - 1];
    if (prevLesson && isLessonCompleted(levelId, moduleId, prevLesson.id)) {
      return 'active';
    }
    
    return 'locked';
  };

  const stripHtml = (value: string) => value.replace(/<[^>]*>/g, '').trim();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Tactical Map
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Module Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{module.icon}</div>
          <div className="caption text-primary mb-2">{level.title.toUpperCase()} LEVEL</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{module.title}</h1>
          <p className="text-muted-foreground prose-body">{module.description}</p>
          
          {/* Progress Bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span className="mono text-muted-foreground">PROGRESS</span>
              <span className="mono text-primary">{completedLessons}/{module.lessons.length} LESSONS</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-success transition-all duration-500"
                style={{ width: `${module.lessons.length > 0 ? (completedLessons / module.lessons.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-4 mb-12">
          <h2 className="subheader text-muted-foreground mb-6">Mission Objectives</h2>
          
          {module.lessons.map((lesson, index) => {
            const status = getLessonStatus(index, lesson.id);
            
            return (
              <button
                key={lesson.id}
                onClick={() => status !== 'locked' && navigate(`/lesson/${levelId}/${moduleId}/${lesson.id}`)}
                disabled={status === 'locked'}
                className={`w-full tactical-card p-6 flex items-center gap-4 text-left transition-all ${
                  status === 'locked' 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:border-primary/50 hover:bg-card/80'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  status === 'complete' ? 'bg-success/20 text-success' :
                  status === 'active' ? 'bg-warning/20 text-warning' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {status === 'complete' ? <CheckCircle className="h-6 w-6" /> :
                   status === 'locked' ? <Lock className="h-5 w-5" /> :
                   <Play className="h-5 w-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="caption text-muted-foreground mb-1">LESSON {index + 1}</div>
                  <h3 className="font-semibold text-lg">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{stripHtml(lesson.lesson_objective)}</p>
                </div>
                
                {status === 'active' && (
                  <div className="mono text-xs text-warning">START →</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Module Final Quiz */}
        <div className="tactical-card p-8 text-center border-2 border-primary/30">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-warning" />
          <h3 className="text-xl font-bold mb-2">Module Final Assessment</h3>
          <p className="text-muted-foreground mb-6">
            Complete all lessons to unlock the final quiz
          </p>

          <Button
            size="lg"
            disabled={!allLessonsCompleted || moduleComplete}
            onClick={() => navigate(`/quiz/module/${levelId}/${moduleId}`)}
            className="gap-2"
          >
            {moduleComplete ? (
              <>
                <CheckCircle className="h-5 w-5" />
                Module Completed
              </>
            ) : allLessonsCompleted ? (
              'Take Module Quiz'
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Complete All Lessons First
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Module;
