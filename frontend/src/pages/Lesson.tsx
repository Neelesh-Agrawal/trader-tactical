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
  const { getModuleById, getLessonById, fetchLessonDetail, fetchQuiz, trackLessonActivity, loading: coursesLoading } = useCourses();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lessonDetail, setLessonDetail] = useState<LessonType | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [lessonQuizAvailable, setLessonQuizAvailable] = useState(false);
  const [loadingLessonQuiz, setLoadingLessonQuiz] = useState(true);

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

  useEffect(() => {
    const loadLessonQuiz = async () => {
      if (!levelId || !moduleId || !lessonId) {
        setLessonQuizAvailable(false);
        setLoadingLessonQuiz(false);
        return;
      }

      setLoadingLessonQuiz(true);
      const quiz = await fetchQuiz('lesson', levelId, moduleId, lessonId);
      setLessonQuizAvailable(Boolean(quiz && quiz.questions.length > 0));
      setLoadingLessonQuiz(false);
    };

    loadLessonQuiz();
  }, [levelId, moduleId, lessonId, fetchQuiz]);

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
    <div className="lesson-content ck-content" dangerouslySetInnerHTML={{ __html: normalizeLessonHtml(html) }} />
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

          {lessonQuizAvailable && (
            <div className="mb-8 rounded-xl border-2 border-primary/20 bg-primary/5 p-4 md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="caption text-primary mb-1">QUIZ READY</div>
                  <p className="text-sm text-muted-foreground">
                    {isCompleted
                      ? 'Retake the lesson quiz any time.'
                      : 'This lesson has a quiz ready when you finish reading.'}
                  </p>
                </div>
                <Button
                  size="lg"
                  variant={isCompleted ? 'outline' : 'success'}
                  onClick={handleStartQuiz}
                  className="gap-2 self-start md:self-auto"
                >
                  {isCompleted ? 'Retake Quiz' : 'Start Lesson Quiz'}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

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
                <span className="subheader">FAQs</span>
              </div>
              <Accordion type="single" collapsible>
                {fullLesson.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left hover:text-primary">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        <div className="lesson-content ck-content" dangerouslySetInnerHTML={{ __html: normalizeLessonHtml(faq.answer) }} />
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

          {/* Lesson Checkpoint */}
          <div className="tactical-card mt-12 border-2 border-primary/20 bg-primary/5 p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="caption text-primary">LESSON CHECKPOINT</div>
                <h2 className="text-2xl font-bold">
                  {isCompleted ? 'Quiz Completed' : 'Ready for the Quiz?'}
                </h2>
                <p className="text-muted-foreground">
                  {isCompleted
                    ? 'You can retake the lesson quiz or move on to the next step.'
                    : 'Take the lesson quiz to lock in the material and mark this lesson complete.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 md:justify-end shrink-0">
                {loadingLessonQuiz ? (
                  <Button size="lg" disabled className="gap-2 text-lg px-8 shadow-lg shadow-primary/20">
                    Checking Quiz...
                  </Button>
                ) : lessonQuizAvailable ? (
                  <Button size="lg" variant="success" onClick={handleStartQuiz} className="gap-2 text-lg px-8 shadow-lg shadow-primary/20">
                    Start Lesson Quiz <ArrowRight className="h-5 w-5" />
                  </Button>
                ) : !isCompleted ? (
                  <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-foreground">
                    No lesson quiz is configured for this lesson yet.
                  </div>
                ) : (
                  <>
                    {lessonQuizAvailable && (
                      <Button size="lg" variant="outline" onClick={handleStartQuiz}>
                        Retake Quiz
                      </Button>
                    )}
                    <Button size="lg" onClick={handleNextLesson} className="gap-2">
                      {nextLesson ? <>Next Lesson <ArrowRight className="h-5 w-5" /></> : 'Back to Module'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

function normalizeLessonHtml(html: string) {
  if (typeof document === 'undefined') {
    return html.replace(/&amp;nbsp;|&nbsp;|\u00a0/g, ' ');
  }

  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  const decodedHtml = textarea.value || html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(decodedHtml, 'text/html');
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);

  let currentNode = walker.nextNode();
  while (currentNode) {
    currentNode.textContent = (currentNode.textContent || '')
      .replace(/\u00a0/g, ' ')
      .replace(/&nbsp;/g, ' ');
    currentNode = walker.nextNode();
  }

  return doc.body.innerHTML;
}

export default Lesson;
