import { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { getLessonById, getModuleById } from '@/data/courseData';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, ArrowRight, Target, BookOpen, Lightbulb, HelpCircle, CheckCircle } from 'lucide-react';

const Lesson = () => {
  const { levelId, moduleId, lessonId } = useParams();
  const { user, loading: authLoading, updateStreak } = useAuth();
  const { isLessonCompleted, markLessonComplete, loading: progressLoading } = useProgress();
  const navigate = useNavigate();
  const [showingContent, setShowingContent] = useState(true);

  if (authLoading || progressLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mono text-muted-foreground">LOADING INTEL...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!levelId || !moduleId || !lessonId) {
    return <Navigate to="/dashboard" replace />;
  }

  const module = getModuleById(levelId, moduleId);
  const lesson = getLessonById(levelId, moduleId, lessonId);

  if (!module || !lesson) {
    return <Navigate to="/dashboard" replace />;
  }

  const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
  const nextLesson = module.lessons[lessonIndex + 1];
  const isCompleted = isLessonCompleted(levelId, moduleId, lessonId);

  const handleStartQuiz = async () => {
    // Update streak when starting a quiz
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

  // Parse content into paragraphs
  const contentParagraphs = lesson.content.split('\n\n').filter(p => p.trim());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(`/module/${levelId}/${moduleId}`)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Module
          </Button>
          
          <div className="caption text-muted-foreground">
            LESSON {lessonIndex + 1} OF {module.lessons.length}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Lesson Title */}
        <div className="mb-10">
          <div className="caption text-primary mb-2 flex items-center gap-2">
            <Target className="h-4 w-4" />
            {module.title.toUpperCase()}
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
        <div className="mission-briefing mb-10 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-primary" />
            <span className="subheader">Mission Briefing</span>
          </div>
          <p className="prose-body text-muted-foreground">{lesson.objective}</p>
        </div>

        {/* Intel Section */}
        <div className="intel-section mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="subheader">Intel</span>
          </div>
          
          <div className="lesson-content space-y-6">
            {contentParagraphs.map((paragraph, index) => {
              // Check if it's a heading (starts with **)
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h3 key={index} className="text-xl font-bold mt-8 mb-4">
                    {paragraph.replace(/\*\*/g, '')}
                  </h3>
                );
              }
              
              // Check if it's a list item section
              if (paragraph.includes('\n-') || paragraph.includes('\n*')) {
                const lines = paragraph.split('\n');
                return (
                  <div key={index}>
                    {lines.map((line, lineIndex) => {
                      if (line.startsWith('-') || line.startsWith('*')) {
                        return (
                          <p key={lineIndex} className="pl-4 mb-2 text-muted-foreground">
                            • {line.slice(1).trim()}
                          </p>
                        );
                      }
                      return <p key={lineIndex} className="mb-4">{line}</p>;
                    })}
                  </div>
                );
              }
              
              // Regular paragraph - handle bold text
              const formattedText = paragraph.split('**').map((part, i) => {
                if (i % 2 === 1) {
                  return <strong key={i}>{part}</strong>;
                }
                return part;
              });
              
              return (
                <p key={index} className="prose-body text-foreground/90 leading-relaxed">
                  {formattedText}
                </p>
              );
            })}
          </div>
        </div>

        {/* Key Takeaways (Signals) */}
        <div className="tactical-card p-6 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-warning" />
            <span className="subheader">Signals</span>
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

        {/* FAQs (Recon) */}
        {lesson.faqs.length > 0 && (
          <div className="tactical-card p-6 mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="subheader">Recon (FAQs)</span>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {lesson.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="faq-item">
                  <AccordionTrigger className="text-left hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          {!isCompleted ? (
            <Button size="lg" onClick={handleStartQuiz} className="gap-2 text-lg px-8">
              Begin Execution (Quiz)
              <ArrowRight className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button size="lg" variant="outline" onClick={handleStartQuiz} className="gap-2">
                Retake Quiz
              </Button>
              <Button size="lg" onClick={handleNextLesson} className="gap-2">
                {nextLesson ? (
                  <>Next Lesson <ArrowRight className="h-5 w-5" /></>
                ) : (
                  <>Back to Module</>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lesson;
