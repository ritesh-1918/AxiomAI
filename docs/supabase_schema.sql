-- AxiomAI Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. Routing Logs Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.routing_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_text TEXT NOT NULL,
    selected_tier TEXT NOT NULL CHECK (selected_tier IN ('SMALL_LLM', 'LARGE_LLM')),
    confidence FLOAT NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    latency_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_routing_logs_user_id ON public.routing_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_routing_logs_created_at ON public.routing_logs(created_at DESC);

-- ============================================
-- 2. User Profiles Table (Optional - for extended user data)
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    api_key TEXT UNIQUE, -- Custom API key for programmatic access
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 3. Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on routing_logs
ALTER TABLE public.routing_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own logs
CREATE POLICY "Users can view own routing logs"
    ON public.routing_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own logs
CREATE POLICY "Users can insert own routing logs"
    ON public.routing_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users cannot update logs (immutable)
CREATE POLICY "Users cannot update routing logs"
    ON public.routing_logs
    FOR UPDATE
    USING (false);

-- Policy: Users can delete their own logs
CREATE POLICY "Users can delete own routing logs"
    ON public.routing_logs
    FOR DELETE
    USING (auth.uid() = user_id);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own profile
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can update only their own profile
CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================
-- 4. Automatic Profile Creation Trigger
-- ============================================

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 5. Helper Functions
-- ============================================

-- Function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_requests BIGINT,
    small_llm_count BIGINT,
    large_llm_count BIGINT,
    avg_confidence FLOAT,
    avg_latency_ms FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_requests,
        COUNT(*) FILTER (WHERE selected_tier = 'SMALL_LLM')::BIGINT as small_llm_count,
        COUNT(*) FILTER (WHERE selected_tier = 'LARGE_LLM')::BIGINT as large_llm_count,
        AVG(confidence)::FLOAT as avg_confidence,
        AVG(latency_ms)::FLOAT as avg_latency_ms
    FROM public.routing_logs
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. Grant Permissions
-- ============================================

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.routing_logs TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;

-- ============================================
-- Schema Setup Complete! ✅
-- ============================================

-- Verify tables were created:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Test RLS policies:
-- SELECT * FROM routing_logs; -- Should only show your logs when authenticated
