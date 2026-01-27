import { Clock, Target, CheckCircle } from 'lucide-react';
import type { Lesson, Module } from '@/data/courseData';

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
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <span className="caption text-primary flex items-center gap-2">
          <Target className="h-4 w-4" />
          LESSON {lessonIndex + 1} OF {module.lessons.length}
        </span>
        
        {/* Reading Time Badge */}
        <span className="reading-time-badge">
          <Clock className="h-3.5 w-3.5" />
          {readingTime} min read
        </span>
        
        {isCompleted && (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 text-success text-sm ml-auto">
            <CheckCircle className="h-4 w-4" />
            Completed
          </span>
        )}
      </div>
      
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
        {lesson.title}
      </h1>
    </div>
  );
};
