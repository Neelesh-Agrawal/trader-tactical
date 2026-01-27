
-- Add gender and occupation columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN gender text,
ADD COLUMN occupation text;

-- Add reset token fields for forgot PIN flow
ALTER TABLE public.profiles
ADD COLUMN reset_token text,
ADD COLUMN reset_token_expires_at timestamp with time zone;
