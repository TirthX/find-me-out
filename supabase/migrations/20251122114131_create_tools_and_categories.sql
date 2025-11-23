/*
  # AI Tool Finder Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name like "Website Build", "Automation"
      - `slug` (text, unique) - URL-friendly version
      - `description` (text) - Brief category description
      - `icon` (text) - Lucide icon name
      - `color` (text) - Color theme for the category
      - `order` (integer) - Display order
      - `created_at` (timestamp)
    
    - `tools`
      - `id` (uuid, primary key)
      - `name` (text) - Tool name
      - `description` (text) - Brief tool description
      - `url` (text) - Tool website URL
      - `category_id` (uuid, foreign key) - Links to categories
      - `tags` (text array) - Additional tags for search
      - `is_trending` (boolean) - Featured/trending flag
      - `order` (integer) - Display order within category
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (tools are publicly viewable)
    - Only authenticated users with admin role could modify (future feature)
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'Folder',
  color text DEFAULT '#6366f1',
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  tags text[] DEFAULT '{}',
  is_trending boolean DEFAULT false,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Tools are publicly readable"
  ON tools FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_tools_category_id ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_tools_trending ON tools(is_trending) WHERE is_trending = true;
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories("order");
CREATE INDEX IF NOT EXISTS idx_tools_order ON tools("order");