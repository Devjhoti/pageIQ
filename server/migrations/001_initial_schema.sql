-- PageIQ Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/bvjckdzkqiihecdrnwhf/sql/new)

-- ─── Users ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'Free' CHECK (plan IN ('Free', 'Pro', 'Agency')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Reports ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  brand_slug TEXT NOT NULL,
  page_url TEXT NOT NULL,
  industry TEXT NOT NULL DEFAULT '',
  score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('completed', 'processing', 'failed')),
  report_data JSONB,
  fb_page_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Competitors ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  page_url TEXT NOT NULL,
  page_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  followers INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('analyzed', 'pending')),
  overall_sentiment INTEGER DEFAULT 0,
  threat_level TEXT NOT NULL DEFAULT 'medium' CHECK (threat_level IN ('high', 'medium', 'low')),
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_analyzed TIMESTAMPTZ
);

-- ─── Competitor Reports ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.competitor_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  report_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Comments ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  post_preview TEXT NOT NULL DEFAULT '',
  commenter_name TEXT NOT NULL,
  commenter_avatar TEXT,
  comment TEXT NOT NULL,
  sentiment TEXT NOT NULL DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  sentiment_score INTEGER NOT NULL DEFAULT 50,
  category TEXT NOT NULL DEFAULT 'general',
  ai_suggested_reply TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'hidden', 'deleted')),
  is_alert BOOLEAN NOT NULL DEFAULT FALSE,
  likes INTEGER NOT NULL DEFAULT 0,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Analysis Queue ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.analysis_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  page_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  progress INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  report_id UUID REFERENCES public.reports(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_competitors_user_id ON public.competitors(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_sentiment ON public.comments(sentiment);
CREATE INDEX IF NOT EXISTS idx_comments_status ON public.comments(status);
CREATE INDEX IF NOT EXISTS idx_analysis_queue_user_id ON public.analysis_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_queue_status ON public.analysis_queue(status);

-- ─── Row Level Security ─────────────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own data" ON public.users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own reports" ON public.reports
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own competitors" ON public.competitors
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own competitor reports" ON public.competitor_reports
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own comments" ON public.comments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own analysis queue" ON public.analysis_queue
  FOR ALL USING (auth.uid() = user_id);

-- ─── Auto-update updated_at ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_reports_updated_at BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_analysis_queue_updated_at BEFORE UPDATE ON public.analysis_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
