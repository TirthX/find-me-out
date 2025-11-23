-- Check existing policies on tools table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'tools';

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Tools can be inserted by anyone" ON tools;
DROP POLICY IF EXISTS "Tools can be deleted by anyone" ON tools;

-- Create INSERT policy
CREATE POLICY "Tools can be inserted by anyone"
  ON tools FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create DELETE policy
CREATE POLICY "Tools can be deleted by anyone"
  ON tools FOR DELETE
  TO anon
  USING (true);

-- Verify policies were created
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'tools';

