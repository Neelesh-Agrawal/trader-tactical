import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isAuthRequired } from '@/config/appConfig';
import { useProgress } from '@/hooks/useProgress';
import { useCourses } from '@/hooks/useCourses';
import type { Lesson as LessonType } from '@/hooks/useCourses';
import { CourseSidebar } from '@/components/course/CourseSidebar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Header } from '@/components/layout/Header';
import { QnAWidget } from '@/components/qna/QnAWidget';
import { LessonSkeleton } from '@/components/layout/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Target, BookOpen, Lightbulb, HelpCircle, CheckCircle, Menu, X, AlertTriangle, Wrench } from 'lucide-react';

const Lesson = () => {
  const { levelId, moduleId, lessonId } = useParams();
  const { user, loading: authLoading, updateStreak } = useAuth();
  const { isLessonCompleted, loading: progressLoading } = useProgress();
  const { getModuleById, getLessonById, fetchLessonDetail, trackLessonActivity, loading: coursesLoading } = useCourses();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lessonDetail, setLessonDetail] = useState<LessonType | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);

  const loading = authLoading || progressLoading || coursesLoading;

  useEffect(() => {
    const loadLessonDetail = async () => {
      if (!lessonId) return;
      
      setLoadingDetail(true);
      const detail = await fetchLessonDetail(lessonId);
      setLessonDetail(detail);
      setLoadingDetail(false);
      
      // Track lesson activity for streak
      if (user && detail) {
        trackLessonActivity(lessonId);
      }
    };
    
    loadLessonDetail();
  }, [lessonId, fetchLessonDetail, user, trackLessonActivity]);

  // Save last lesson position to localStorage (backend doesn't have this field yet)
  useEffect(() => {
    if (user && levelId && moduleId && lessonId) {
      localStorage.setItem('last_lesson', JSON.stringify({
        levelId,
        moduleId,
        lessonId
      }));
    }
  }, [user, levelId, moduleId, lessonId]);

  if (loading || loadingDetail) {
    return <LessonSkeleton />;
  }

  if (isAuthRequired() && !user) return <Navigate to="/login" replace />;
  if (!levelId || !moduleId || !lessonId) return <Navigate to="/dashboard" replace />;

  const module = getModuleById(levelId, moduleId);
  const lesson = getLessonById(levelId, moduleId, lessonId);
  
  // Merge basic lesson info with detailed content
  const fullLesson = lesson ? {
    ...lesson,
    ...lessonDetail,
    faqs: lessonDetail?.faqs || lesson.faqs || [],
  } : null;
  
  if (!module || !fullLesson) return <Navigate to="/dashboard" replace />;

  const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
  const nextLesson = module.lessons[lessonIndex + 1];
  const isCompleted = isLessonCompleted(levelId, moduleId, lessonId);

  const handleStartQuiz = async () => {
    await updateStreak();
    navigate(`/quiz/lesson/${levelId}/${moduleId}/${lessonId}`);
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/lesson/${levelId}/${moduleId}/${nextLesson.id}`);
    } else {
      navigate(`/module/${levelId}/${moduleId}`);
    }
  };

  const renderHtmlSection = (html: string) => (
    <div className="lesson-content ck-content" dangerouslySetInnerHTML={{ __html: html }} />
  );

  return (
    <div className="min-h-screen bg-background">
      <Header showStreak />
      <QnAWidget contextType="lesson" contextId={`${levelId}/${moduleId}/${lessonId}`} />

      <div className="flex">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-24 left-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Sidebar */}
        <div className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] z-40 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <CourseSidebar levelId={levelId} currentModuleId={moduleId} currentLessonId={lessonId} />
        </div>

        {/* Overlay */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Main Content */}
        <main className="flex-1 min-w-0 py-8 px-4 lg:px-8 max-w-4xl mx-auto">
          <Breadcrumb items={[
            { label: module.title, href: `/module/${levelId}/${moduleId}` },
            { label: fullLesson.title }
          ]} />

          {/* Lesson Header */}
          <div className="mb-8">
            <div className="caption text-primary mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              LESSON {lessonIndex + 1} OF {module.lessons.length}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{fullLesson.title}</h1>
            {isCompleted && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/20 text-success text-sm">
                <CheckCircle className="h-4 w-4" />
                Completed
              </div>
            )}
          </div>

          {/* Mission Briefing */}
            <div className="mission-briefing mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-primary" />
                <span className="subheader">Mission Briefing</span>
              </div>
            {renderHtmlSection(fullLesson.lesson_objective)}
          </div>

          {/* Intel Section */}
          <div className="tactical-card p-6 md:p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="subheader">Intel</span>
            </div>
            <div className="lesson-content space-y-6">
              {renderHtmlSection(fullLesson.content)}
            </div>
          </div>

          {/* Common Mistakes */}
          {fullLesson.common_mistakes && (
            <div className="tactical-card p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span className="subheader">Common Mistakes</span>
              </div>
              {renderHtmlSection(fullLesson.common_mistakes)}
            </div>
          )}

          {/* Key Takeaways */}
          {fullLesson.key_takeaway && (
            <div className="tactical-card p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-warning" />
                <span className="subheader">Key Signals</span>
              </div>
              {renderHtmlSection(fullLesson.key_takeaway)}
            </div>
          )}

          {/* FAQs */}
          {fullLesson.faqs && fullLesson.faqs.length > 0 && (
            <div className="tactical-card p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span className="subheader">Recon (FAQs)</span>
              </div>
              <Accordion type="single" collapsible>
                {fullLesson.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left hover:text-primary">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        <div className="lesson-content ck-content" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
          )}

          {/* Practical Task */}
          {fullLesson.practical_task && (
            <div className="tactical-card p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="h-5 w-5 text-primary" />
                <span className="subheader">Practical Task</span>
              </div>
              {renderHtmlSection(fullLesson.practical_task)}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            {!isCompleted ? (
              <Button size="lg" onClick={handleStartQuiz} className="gap-2 text-lg px-8">
                Begin Execution (Quiz) <ArrowRight className="h-5 w-5" />
              </Button>
            ) : (
              <>
                <Button size="lg" variant="outline" onClick={handleStartQuiz}>Retake Quiz</Button>
                <Button size="lg" onClick={handleNextLesson} className="gap-2">
                  {nextLesson ? <>Next Lesson <ArrowRight className="h-5 w-5" /></> : 'Back to Module'}
                </Button>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Lesson;
