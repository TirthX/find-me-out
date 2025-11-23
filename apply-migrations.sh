#!/bin/bash

# Script to apply Supabase migrations
# Make sure you're logged in: supabase login
# Then link your project: supabase link --project-ref YOUR_PROJECT_REF

echo "Applying Supabase migrations..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Error: Supabase CLI is not installed"
    echo "Install it with: brew install supabase/tap/supabase"
    exit 1
fi

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "Please login to Supabase first:"
    echo "  supabase login"
    exit 1
fi

# Check if project is linked
if [ ! -f ".supabase/config.toml" ] && [ ! -f "supabase/.temp/project-ref" ]; then
    echo "Please link your project first:"
    echo "  supabase link --project-ref YOUR_PROJECT_REF"
    echo ""
    echo "To find your project ref:"
    echo "  1. Go to https://supabase.com/dashboard"
    echo "  2. Select your project"
    echo "  3. Go to Settings > General"
    echo "  4. Copy the 'Reference ID'"
    exit 1
fi

# Push migrations
echo "Pushing migrations to remote database..."
supabase db push

echo ""
echo "✅ Migrations applied successfully!"

