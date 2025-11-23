-- Fix RLS Policies for Tools Table
-- Run this in your Supabase SQL Editor

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Tools can be inserted by anyone" ON tools;
DROP POLICY IF EXISTS "Tools can be deleted by anyone" ON tools;

-- Verify RLS is enabled
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy for anonymous users
CREATE POLICY "Tools can be inserted by anyone"
  ON tools FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create DELETE policy for anonymous users
CREATE POLICY "Tools can be deleted by anyone"
  ON tools FOR DELETE
  TO anon
  USING (true);

-- Verify policies were created
SELECT 
    policyname,
    cmd as operation,
    roles
FROM pg_policies 
WHERE tablename = 'tools'
ORDER BY policyname;

