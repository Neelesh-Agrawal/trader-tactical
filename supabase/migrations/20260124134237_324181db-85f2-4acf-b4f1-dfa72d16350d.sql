-- Create profiles table for user data (phone + PIN auth)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  pin_hash TEXT NOT NULL,
  current_level TEXT NOT NULL DEFAULT 'beginner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user streaks table
CREATE TABLE public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create lesson progress table
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, level_id, module_id, lesson_id)
);

-- Create quiz attempts table
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_type TEXT NOT NULL CHECK (quiz_type IN ('lesson', 'module', 'level')),
  level_id TEXT NOT NULL,
  module_id TEXT,
  lesson_id TEXT,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  invalidated BOOLEAN DEFAULT false NOT NULL,
  invalidation_reason TEXT,
  time_taken_seconds INTEGER,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create quiz cooldowns table
CREATE TABLE public.quiz_cooldowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_type TEXT NOT NULL,
  level_id TEXT NOT NULL,
  module_id TEXT,
  cooldown_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, quiz_type, level_id, module_id)
);

-- Create module progress table
CREATE TABLE public.module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  unlocked BOOLEAN DEFAULT false NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, level_id, module_id)
);

-- Create level progress table
CREATE TABLE public.level_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level_id TEXT NOT NULL,
  unlocked BOOLEAN DEFAULT false NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, level_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_cooldowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_progress ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User streaks policies
CREATE POLICY "Users can view own streaks" ON public.user_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON public.user_streaks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks" ON public.user_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Lesson progress policies
CREATE POLICY "Users can view own lesson progress" ON public.lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress" ON public.lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress" ON public.lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Quiz attempts policies
CREATE POLICY "Users can view own quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quiz cooldowns policies
CREATE POLICY "Users can view own cooldowns" ON public.quiz_cooldowns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cooldowns" ON public.quiz_cooldowns
  FOR ALL USING (auth.uid() = user_id);

-- Module progress policies
CREATE POLICY "Users can view own module progress" ON public.module_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own module progress" ON public.module_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own module progress" ON public.module_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Level progress policies
CREATE POLICY "Users can view own level progress" ON public.level_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own level progress" ON public.level_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own level progress" ON public.level_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_streaks_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to initialize user progress on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Initialize beginner level as unlocked
  INSERT INTO public.level_progress (user_id, level_id, unlocked)
  VALUES (NEW.user_id, 'beginner', true);
  
  -- Initialize streak
  INSERT INTO public.user_streaks (user_id, current_streak, last_activity_date)
  VALUES (NEW.user_id, 1, CURRENT_DATE);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to initialize progress when profile is created
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_progress();

-- Function to update daily streak
CREATE OR REPLACE FUNCTION public.update_daily_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_last_activity DATE;
  v_current_streak INTEGER;
  v_days_diff INTEGER;
BEGIN
  SELECT last_activity_date, current_streak 
  INTO v_last_activity, v_current_streak
  FROM public.user_streaks 
  WHERE user_id = p_user_id;
  
  IF v_last_activity IS NULL THEN
    -- First activity
    UPDATE public.user_streaks 
    SET current_streak = 1, 
        last_activity_date = CURRENT_DATE,
        longest_streak = GREATEST(longest_streak, 1)
    WHERE user_id = p_user_id;
    RETURN 1;
  END IF;
  
  v_days_diff := CURRENT_DATE - v_last_activity;
  
  IF v_days_diff = 0 THEN
    -- Already logged today
    RETURN v_current_streak;
  ELSIF v_days_diff = 1 THEN
    -- Consecutive day
    UPDATE public.user_streaks 
    SET current_streak = current_streak + 1,
        last_activity_date = CURRENT_DATE,
        longest_streak = GREATEST(longest_streak, current_streak + 1)
    WHERE user_id = p_user_id;
    RETURN v_current_streak + 1;
  ELSIF v_days_diff > 5 THEN
    -- Streak reset (more than 5 days)
    UPDATE public.user_streaks 
    SET current_streak = 1,
        last_activity_date = CURRENT_DATE
    WHERE user_id = p_user_id;
    RETURN 1;
  ELSE
    -- Between 2-5 days, maintain streak but update date
    UPDATE public.user_streaks 
    SET last_activity_date = CURRENT_DATE
    WHERE user_id = p_user_id;
    RETURN v_current_streak;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;