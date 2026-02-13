import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { getLessonById, getModuleById } from '@/data/courseData';
import { CourseSidebar } from '@/components/course/CourseSidebar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Header } from '@/components/layout/Header';
import { QnAWidget } from '@/components/qna/QnAWidget';
import { LessonSkeleton } from '@/components/layout/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Target, BookOpen, Lightbulb, HelpCircle, CheckCircle, Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Lesson = () => {
  const { levelId, moduleId, lessonId } = useParams();
  const { user, loading: authLoading, updateStreak } = useAuth();
  const { isLessonCompleted, loading: progressLoading } = useProgress();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Save last lesson position
  useEffect(() => {
    if (user && levelId && moduleId && lessonId) {
      supabase.from('profiles').update({
        last_lesson_level_id: levelId,
        last_lesson_module_id: moduleId,
        last_lesson_id: lessonId
      }).eq('user_id', user.id);
    }
  }, [user, levelId, moduleId, lessonId]);

  if (authLoading || progressLoading) {
    return <LessonSkeleton />;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!levelId || !moduleId || !lessonId) return <Navigate to="/dashboard" replace />;

  const module = getModuleById(levelId, moduleId);
  const lesson = getLessonById(levelId, moduleId, lessonId);
  if (!module || !lesson) return <Navigate to="/dashboard" replace />;

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

  const contentParagraphs = lesson.content.split('\n\n').filter(p => p.trim());

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
            { label: lesson.title }
          ]} />

          {/* Lesson Header */}
          <div className="mb-8">
            <div className="caption text-primary mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              LESSON {lessonIndex + 1} OF {module.lessons.length}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{lesson.title}</h1>
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
            <p className="prose-body text-muted-foreground">{lesson.objective}</p>
          </div>

          {/* Intel Section */}
          <div className="tactical-card p-6 md:p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="subheader">Intel</span>
            </div>
            <div className="lesson-content space-y-6">
              {contentParagraphs.map((paragraph, index) => {
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <h3 key={index} className="text-xl font-bold mt-8 mb-4">{paragraph.replace(/\*\*/g, '')}</h3>;
                }
                const formattedText = paragraph.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
                return <p key={index} className="prose-body text-foreground/90 leading-relaxed">{formattedText}</p>;
              })}
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="tactical-card p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-warning" />
              <span className="subheader">Key Signals</span>
            </div>
            <div className="space-y-3">
              {lesson.keyTakeaways.map((takeaway, index) => (
                <div key={index} className="signal-item">
                  <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <p className="text-sm">{takeaway}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          {lesson.faqs.length > 0 && (
            <div className="tactical-card p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span className="subheader">Recon (FAQs)</span>
              </div>
              <Accordion type="single" collapsible>
                {lesson.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left hover:text-primary">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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
