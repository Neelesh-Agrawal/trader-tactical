-- Add enrollment tracking for level deadlines
CREATE TABLE public.level_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  level_id TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deadline_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, level_id)
);

-- Enable RLS
ALTER TABLE public.level_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS policies for level_enrollments
CREATE POLICY "Users can view their own enrollments"
  ON public.level_enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments"
  ON public.level_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments"
  ON public.level_enrollments FOR UPDATE
  USING (auth.uid() = user_id);

-- Create Q&A inquiries table for the chatbot questions
CREATE TABLE public.qna_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  context_type TEXT NOT NULL CHECK (context_type IN ('dashboard', 'lesson')),
  context_id TEXT,
  question TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'answered')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.qna_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS policies for qna_inquiries
CREATE POLICY "Users can view their own inquiries"
  ON public.qna_inquiries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own inquiries"
  ON public.qna_inquiries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add last_lesson_id to profiles table for "continue where you left off" feature
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_lesson_level_id TEXT,
ADD COLUMN IF NOT EXISTS last_lesson_module_id TEXT,
ADD COLUMN IF NOT EXISTS last_lesson_id TEXT;