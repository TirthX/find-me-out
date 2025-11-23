# Quick Guide: Apply Migrations

## Easiest Method: Run SQL in Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste each SQL below, then click **Run**

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

That's it! Your add and delete functionality will now work.

---

## Alternative: Using Supabase CLI

1. Login: `supabase login`
2. Link project: `supabase link --project-ref YOUR_PROJECT_REF`
3. Push migrations: `supabase db push`

See APPLY_MIGRATIONS.md for detailed instructions.
