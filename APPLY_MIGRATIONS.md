# Applying Supabase Migrations

This guide will help you apply the database migrations to enable INSERT and DELETE operations for tools.

## Option 1: Using Supabase CLI (Recommended)

### Step 1: Login to Supabase
```bash
supabase login
```
This will open a browser for authentication.

### Step 2: Link Your Project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

To find your project reference ID:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** > **General**
4. Copy the **Reference ID**

You'll be prompted for your database password (the one you set when creating the project).

### Step 3: Apply Migrations
```bash
supabase db push
```

Or use the provided script:
```bash
./apply-migrations.sh
```

## Option 2: Run SQL Directly in Supabase Dashboard

If you prefer to run the SQL manually:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Run each migration SQL:

### Migration 1: Allow INSERT
```sql
CREATE POLICY "Tools can be inserted by anyone"
  ON tools FOR INSERT
  TO anon
  WITH CHECK (true);
```

### Migration 2: Allow DELETE
```sql
CREATE POLICY "Tools can be deleted by anyone"
  ON tools FOR DELETE
  TO anon
  USING (true);
```

## Verification

After applying migrations, you can verify by:
1. Trying to add a tool (should prompt for password, then work)
2. Trying to delete a tool (should prompt for password, then work)

If you encounter any errors, check:
- Row Level Security (RLS) is enabled on the `tools` table
- The policies were created successfully (check in **Authentication** > **Policies**)

