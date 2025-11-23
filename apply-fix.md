# Fix RLS Policy Error

The error "new row violates row-level security policy" means the INSERT policy wasn't properly created. 

## Quick Fix (Run this SQL)

1. Go to https://supabase.com/dashboard/project/zroepphazcggjekigtbh
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the SQL from `fix-policies.sql` file (or below)
5. Click **Run**

## SQL to Run:

```sql
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
```

After running this, try adding a tool again. It should work after entering the password.

