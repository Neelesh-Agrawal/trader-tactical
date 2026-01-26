import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ConceptCard } from './ConceptCard';
import { ChecklistTakeaways } from './ChecklistTakeaways';
import { 
  ArrowRight, Target, BookOpen, Lightbulb, HelpCircle, 
  CheckCircle, Clock, ChevronLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lesson, Module } from '@/data/courseData';

interface LessonContentProps {
  lesson: Lesson;
  module: Module;
  levelId: string;
  lessonIndex: number;
  onBack: () => void;
}

export const LessonContent = ({ lesson, module, levelId, lessonIndex, onBack }: LessonContentProps) => {
  const navigate = useNavigate();
  const { updateStreak } = useAuth();
  const { isLessonCompleted } = useProgress();
  const [scrollProgress, setScrollProgress] = useState(0);

  const isCompleted = isLessonCompleted(levelId, module.id, lesson.id);
  const nextLesson = module.lessons[lessonIndex + 1];

  // Calculate reading time
  const wordCount = lesson.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleStartQuiz = async () => {
    await updateStreak();
    navigate(`/quiz/lesson/${levelId}/${module.id}/${lesson.id}`);
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      // This will be handled by parent component
      window.location.href = `/level/${levelId}?module=${module.id}&lesson=${nextLesson.id}`;
    } else {
      onBack();
    }
  };

  // Parse content with enhanced formatting
  const renderContent = () => {
    const paragraphs = lesson.content.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Headers (bold text)
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h3 key={index} className="text-xl font-bold mt-8 mb-4 text-foreground">
            {paragraph.replace(/\*\*/g, '')}
          </h3>
        );
      }
      
      // Check for concept cards (lines starting with specific patterns)
      if (paragraph.includes('**1.') || paragraph.includes('**2.') || paragraph.includes('**3.')) {
        return (
          <ConceptCard key={index} variant="info">
            {renderFormattedText(paragraph)}
          </ConceptCard>
        );
      }

      // Regular paragraphs
      return (
        <p key={index} className="prose-body text-foreground/90 leading-relaxed mb-6">
          {renderFormattedText(paragraph)}
        </p>
      );
    });
  };

  const renderFormattedText = (text: string) => {
    return text.split('**').map((part, i) => 
      i % 2 === 1 ? <strong key={i} className="text-primary font-semibold">{part}</strong> : part
    );
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Reading Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-muted z-20">
        <div 
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Overview
      </button>

      {/* Lesson Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="caption text-primary flex items-center gap-2">
            <Target className="h-4 w-4" />
            LESSON {lessonIndex + 1} OF {module.lessons.length}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {readingTime} min read
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 text-success text-sm ml-auto">
              <CheckCircle className="h-4 w-4" />
              Completed
            </span>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{lesson.title}</h1>
      </div>

      {/* Mission Briefing */}
      <div className={cn(
        "tactical-card p-6 mb-8 border-l-4 border-l-primary",
        "bg-gradient-to-r from-primary/5 to-transparent"
      )}>
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
        <div className="lesson-content space-y-2">
          {renderContent()}
        </div>
      </div>

      {/* Key Takeaways */}
      <ChecklistTakeaways 
        takeaways={lesson.keyTakeaways}
        lessonId={lesson.id}
      />

      {/* FAQs */}
      {lesson.faqs.length > 0 && (
        <div className="tactical-card p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span className="subheader">Recon (FAQs)</span>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {lesson.faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`faq-${index}`}
                className="border border-border rounded-lg px-4 data-[state=open]:bg-muted/30"
              >
                <AccordionTrigger className="text-left hover:text-primary hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 pb-8">
        {!isCompleted ? (
          <Button size="lg" onClick={handleStartQuiz} className="gap-2 text-lg px-8">
            Begin Execution (Quiz) <ArrowRight className="h-5 w-5" />
          </Button>
        ) : (
          <>
            <Button size="lg" variant="outline" onClick={handleStartQuiz}>
              Retake Quiz
            </Button>
            <Button size="lg" onClick={handleNextLesson} className="gap-2">
              {nextLesson ? (
                <>Next Lesson <ArrowRight className="h-5 w-5" /></>
              ) : (
                'Back to Overview'
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
