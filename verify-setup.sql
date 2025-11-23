-- Verify all policies are correctly set up on the new project
-- Run this in your Supabase SQL Editor

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('tools', 'categories');

-- Check all policies on tools table
SELECT 
    policyname,
    cmd as operation,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'tools'
ORDER BY policyname;

-- Expected results:
-- 1. "Tools are publicly readable" - SELECT - {anon}
-- 2. "Tools can be deleted by anyone" - DELETE - {anon}
-- 3. "Tools can be inserted by anyone" - INSERT - {anon}

-- If policies are missing, run the fix:
-- (See fix-policies.sql for the fix SQL)

