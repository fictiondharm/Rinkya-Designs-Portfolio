-- Fix: New tables in Supabase have Row Level Security (RLS) enabled by default.
-- This blocks all anonymous access even with the anon key.
-- Run this in Supabase SQL Editor to allow public read + authenticated write.

-- Option 1: Disable RLS entirely (simplest — for this admin-only use case)
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- OR Option 2: Use proper policies (uncomment the 3 lines below instead)
-- CREATE POLICY "Public read" ON projects FOR SELECT USING (true);
-- CREATE POLICY "Admin all" ON projects FOR ALL USING (auth.role() = 'authenticated');
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
