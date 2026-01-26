import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { getLevelById, getModuleById, getLessonById } from '@/data/courseData';
import { Header } from '@/components/layout/Header';
import { LevelSidebar } from '@/components/level/LevelSidebar';
import { LevelOverview } from '@/components/level/LevelOverview';
import { LessonContent } from '@/components/lesson/LessonContent';
import { QnAWidget } from '@/components/qna/QnAWidget';
import { LessonSkeleton } from '@/components/layout/LoadingSkeleton';
import { Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const Level = () => {
  const { levelId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { loading: progressLoading } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentModuleId = searchParams.get('module') || undefined;
  const currentLessonId = searchParams.get('lesson') || undefined;

  // Save last lesson position
  useEffect(() => {
    if (user && levelId && currentModuleId && currentLessonId) {
      supabase.from('profiles').update({
        last_lesson_level_id: levelId,
        last_lesson_module_id: currentModuleId,
        last_lesson_id: currentLessonId
      }).eq('user_id', user.id);
    }
  }, [user, levelId, currentModuleId, currentLessonId]);

  if (authLoading || progressLoading) {
    return <LessonSkeleton />;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!levelId) return <Navigate to="/dashboard" replace />;

  const level = getLevelById(levelId);
  if (!level) return <Navigate to="/dashboard" replace />;

  const currentModule = currentModuleId ? getModuleById(levelId, currentModuleId) : undefined;
  const currentLesson = currentModuleId && currentLessonId 
    ? getLessonById(levelId, currentModuleId, currentLessonId) 
    : undefined;

  const handleLessonSelect = (moduleId: string, lessonId: string) => {
    setSearchParams({ module: moduleId, lesson: lessonId });
    setSidebarOpen(false);
  };

  const handleOverviewSelect = () => {
    setSearchParams({});
    setSidebarOpen(false);
  };

  const handleModuleSelect = (moduleId: string) => {
    // Find first lesson in module and navigate to it
    const module = getModuleById(levelId, moduleId);
    if (module && module.lessons.length > 0) {
      handleLessonSelect(moduleId, module.lessons[0].id);
    }
  };

  const lessonIndex = currentModule?.lessons.findIndex(l => l.id === currentLessonId) ?? -1;

  return (
    <div className="min-h-screen bg-background">
      <Header showStreak />
      <QnAWidget 
        contextType={currentLesson ? "lesson" : "level"} 
        contextId={currentLesson ? `${levelId}/${currentModuleId}/${currentLessonId}` : levelId} 
      />

      <div className="flex">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-24 left-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Sidebar */}
        <div className={cn(
          "fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] z-40 transition-transform lg:translate-x-0",
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <LevelSidebar 
            level={level}
            currentModuleId={currentModuleId}
            currentLessonId={currentLessonId}
            onLessonSelect={handleLessonSelect}
            onOverviewSelect={handleOverviewSelect}
          />
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 py-8 px-4 lg:px-8">
          {currentLesson && currentModule ? (
            <LessonContent 
              lesson={currentLesson}
              module={currentModule}
              levelId={levelId}
              lessonIndex={lessonIndex}
              onBack={handleOverviewSelect}
            />
          ) : (
            <LevelOverview 
              level={level}
              onModuleSelect={handleModuleSelect}
              onLessonSelect={handleLessonSelect}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Level;
