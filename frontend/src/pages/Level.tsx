import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isAuthRequired } from '@/config/appConfig';
import { useProgress } from '@/hooks/useProgress';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useCourses, Lesson } from '@/hooks/useCourses';
import { Header } from '@/components/layout/Header';
import { LevelSidebar } from '@/components/level/LevelSidebar';
import { LevelOverview } from '@/components/level/LevelOverview';
import { LessonContent } from '@/components/lesson/LessonContent';
import { QnAWidget } from '@/components/qna/QnAWidget';
import { LessonSkeleton } from '@/components/layout/LoadingSkeleton';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Level = () => {
  const { levelId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentModuleId = searchParams.get('module') || undefined;
  const currentLessonId = searchParams.get('lesson') || undefined;
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { loading: progressLoading } = useProgress();
  const { loading: coursesLoading, error: coursesError, getLevelById, getModuleById, getLessonById, fetchLessonDetail } = useCourses();
  const { progress: scrollProgress, isScrolling } = useScrollProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [lessonDetail, setLessonDetail] = useState<Lesson | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(() => Boolean(currentLessonId));

  const loading = authLoading || progressLoading || coursesLoading || loadingDetail;

  // Fetch lesson detail when lesson changes
  useEffect(() => {
    let cancelled = false;
    
    const loadLessonDetail = async () => {
      if (!currentLessonId) {
        if (!cancelled) {
          setLessonDetail(null);
          setLoadingDetail(false);
        }
        return;
      }

      if (!cancelled) {
        setLessonDetail(null);
        setLoadingDetail(true);
      }

      const detail = await fetchLessonDetail(currentLessonId);
      if (!cancelled) {
        setLessonDetail(detail);
        setLoadingDetail(false);
      }
    };
    
    loadLessonDetail();
    
    return () => { cancelled = true; };
  }, [currentLessonId, fetchLessonDetail]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [currentLessonId]);

  // Minimum swipe distance for gesture detection
  const minSwipeDistance = 50;

  // Handle swipe gestures for drawer
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    // Close drawer on left swipe when open
    if (isLeftSwipe && sidebarOpen) {
      setSidebarOpen(false);
    }
    // Open drawer on right swipe from left edge when closed
    if (isRightSwipe && !sidebarOpen && touchStart < 50) {
      setSidebarOpen(true);
    }
  }, [touchStart, touchEnd, sidebarOpen]);

  // Save last lesson position to localStorage (backend doesn't have this field yet)
  useEffect(() => {
    if (user && levelId && currentModuleId && currentLessonId) {
      localStorage.setItem('last_lesson', JSON.stringify({
        levelId,
        moduleId: currentModuleId,
        lessonId: currentLessonId
      }));
    }
  }, [user, levelId, currentModuleId, currentLessonId]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  if (loading) {
    return <LessonSkeleton />;
  }

  if (isAuthRequired() && !user) return <Navigate to="/login" replace />;
  if (!levelId) return <Navigate to="/dashboard" replace />;

  const level = getLevelById(levelId);

  if (!level) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header showStreak />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-2xl font-bold">Course content not available</h1>
            <p className="text-muted-foreground">
              {coursesError ||
                'No modules were found for this level. Ask your admin to seed course content.'}
            </p>
            <p className="text-sm text-muted-foreground font-mono">
              Run: python manage.py seed_course
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-primary-foreground"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!level.is_unlocked && !level.is_enrolled) {
    return <Navigate to={`/pricing?level=${levelId}`} replace />;
  }

  const currentModule = currentModuleId ? getModuleById(levelId, currentModuleId) : undefined;
  const basicLesson = currentModuleId && currentLessonId 
    ? getLessonById(levelId, currentModuleId, currentLessonId) 
    : undefined;
  
  // Merge basic lesson with detailed content from API
  const currentLesson = basicLesson ? {
    ...basicLesson,
    ...(lessonDetail ?? {}),
    id: basicLesson.id,
    lesson_objective:
      lessonDetail?.lesson_objective || basicLesson.lesson_objective || '',
    common_mistakes: lessonDetail?.common_mistakes || basicLesson.common_mistakes || '',
    key_takeaway: lessonDetail?.key_takeaway || basicLesson.key_takeaway || '',
    practical_task: lessonDetail?.practical_task || basicLesson.practical_task || '',
    content: lessonDetail?.content || basicLesson.content || '',
    estimated_time_minutes:
      lessonDetail?.estimated_time_minutes ?? basicLesson.estimated_time_minutes ?? null,
    faqs: lessonDetail?.faqs || [],
  } : undefined;

  const handleLessonSelect = (moduleId: string, lessonId: string) => {
    setSearchParams({ module: moduleId, lesson: lessonId });
    setSidebarOpen(false);
  };

  const handleOverviewSelect = () => {
    setSearchParams({});
    setSidebarOpen(false);
  };



  const lessonIndex = currentModule?.lessons.findIndex(l => l.id === currentLessonId) ?? -1;

  return (
    <div 
      className="min-h-screen bg-background"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Header showStreak />
      <QnAWidget 
        contextType={currentLesson ? "lesson" : "level"} 
        contextId={currentLesson ? `${levelId}/${currentModuleId}/${currentLessonId}` : levelId} 
      />

      <div className="flex relative">
        {/* Mobile Sidebar Toggle - Floating Action Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
          className={cn(
            "lg:hidden fixed z-50 flex items-center justify-center transition-all duration-300",
            "shadow-lg active:scale-95 touch-manipulation",
            // Larger touch target on mobile (min 44x44)
            "w-14 h-14 rounded-full",
            // Position based on state
            sidebarOpen 
              ? "bottom-6 right-6 bg-destructive text-destructive-foreground" 
              : "bottom-6 left-6 bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Sidebar - Slide-out drawer on mobile */}
        <aside className={cn(
          "fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] z-40 transition-all duration-300 ease-out",
          "lg:translate-x-0 lg:opacity-100",
          // Mobile slide animation
          sidebarOpen 
            ? "translate-x-0 opacity-100" 
            : "-translate-x-full opacity-0 lg:opacity-100",
          // Dim sidebar when reading lesson content (desktop only)
          currentLesson && isScrolling && scrollProgress > 10 && "lg:opacity-70"
        )}>
          <LevelSidebar 
            level={level}
            currentModuleId={currentModuleId}
            currentLessonId={currentLessonId}
            onLessonSelect={handleLessonSelect}
            onOverviewSelect={handleOverviewSelect}
          />
        </aside>

        {/* Backdrop overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden animate-fade-in" 
            onClick={() => setSidebarOpen(false)} 
            aria-hidden="true"
          />
        )}

        {/* Main Content - Full width on mobile */}
        <main className="flex-1 min-w-0 py-4 px-4 sm:py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className={cn(
            "transition-all duration-300 ease-out",
            currentLesson ? "animate-fade-in" : ""
          )}>
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
                onLessonSelect={handleLessonSelect}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Level;
