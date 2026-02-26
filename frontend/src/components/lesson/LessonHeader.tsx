import { Clock, Target, CheckCircle } from 'lucide-react';
import type { Lesson, Module } from '@/hooks/useCourses';

interface LessonHeaderProps {
  lesson: Lesson;
  module: Module;
  lessonIndex: number;
  readingTime: number;
  isCompleted: boolean;
}

export const LessonHeader = ({ 
  lesson, 
  module, 
  lessonIndex, 
  readingTime, 
  isCompleted 
}: LessonHeaderProps) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
        <span className="caption text-primary flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          LESSON {lessonIndex + 1} OF {module.lessons.length}
        </span>
        
        {/* Reading Time Badge */}
        <span className="reading-time-badge text-xs sm:text-sm">
          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          {readingTime} min read
        </span>
        
        {isCompleted && (
          <span className="flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-success/20 text-success text-xs sm:text-sm ml-auto">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Completed</span>
          </span>
        )}
      </div>
      
      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground leading-tight">
        {lesson.title}
      </h1>
    </div>
  );
};
