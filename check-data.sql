-- Check what data exists in the new project
-- Run this in SQL Editor

-- Check categories table
SELECT 
    id,
    name,
    slug,
    description,
    icon,
    color,
    "order",
    created_at
FROM categories
ORDER BY "order";

-- Check tools table
SELECT 
    id,
    name,
    description,
    url,
    category_id,
    tags,
    is_trending,
    "order",
    created_at
FROM tools
ORDER BY created_at DESC;

-- Count records
SELECT 
    'categories' as table_name,
    COUNT(*) as record_count
FROM categories
UNION ALL
SELECT 
    'tools' as table_name,
    COUNT(*) as record_count
FROM tools;

