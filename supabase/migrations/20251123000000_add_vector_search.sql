-- Enable the pgvector extension (Supabase usually puts this in 'extensions' schema)
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Add embedding column to the tools table using explicit schema
ALTER TABLE tools ADD COLUMN IF NOT EXISTS embedding extensions.vector(384);

-- Drop the function if it already exists with a different return type
DROP FUNCTION IF EXISTS match_tools(extensions.vector(384), float, int);

-- Create a function to search for tools by embedding
CREATE OR REPLACE FUNCTION match_tools (
  query_embedding extensions.vector(384),

  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  url text,
  category_id uuid,
  tags text[],
  is_trending boolean,
  "order" int,
  created_at timestamptz,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tools.id,
    tools.name,
    tools.description,
    tools.url,
    tools.category_id,
    tools.tags,
    tools.is_trending,
    tools."order",
    tools.created_at,
    1 - (tools.embedding <=> query_embedding) AS similarity
  FROM tools
  WHERE 1 - (tools.embedding <=> query_embedding) > match_threshold
  ORDER BY tools.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
