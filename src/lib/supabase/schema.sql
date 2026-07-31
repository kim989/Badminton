-- 1. Profiles Table DDL
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nickname TEXT,
  preferred_racket_weight TEXT DEFAULT '4U',
  preferred_tension TEXT DEFAULT '22 lbs',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow individual read access" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow individual insert access" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow individual update access" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Training Logs Table DDL
CREATE TABLE IF NOT EXISTS public.user_training_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  week_number INT NOT NULL,
  routine_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_duration_seconds INT DEFAULT 0,
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for training logs
ALTER TABLE public.user_training_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow individual read training logs" ON public.user_training_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow individual insert training logs" ON public.user_training_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow individual update training logs" ON public.user_training_logs
  FOR UPDATE USING (auth.uid() = user_id);
