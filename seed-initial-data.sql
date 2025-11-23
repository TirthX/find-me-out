-- Seed initial categories data
-- Run this in your Supabase SQL Editor to add some starter categories

-- Insert sample categories (you can customize these)
INSERT INTO categories (name, slug, description, icon, color, "order") VALUES
('Website Build', 'website-build', 'Tools to build and design websites', 'Globe', '#3B82F6', 1),
('Automation', 'automation', 'Automate your workflows and tasks', 'Zap', '#10B981', 2),
('Design', 'design', 'Create stunning designs and graphics', 'Palette', '#8B5CF6', 3),
('Writing', 'writing', 'AI-powered writing and content creation', 'PenTool', '#F59E0B', 4),
('Code', 'code', 'Coding assistance and development tools', 'Code', '#EF4444', 5),
('Video', 'video', 'Video editing and production tools', 'Video', '#EC4899', 6),
('Image', 'image', 'Image generation and editing tools', 'Image', '#14B8A6', 7),
('Audio', 'audio', 'Audio creation and editing tools', 'Music', '#6366F1', 8)
ON CONFLICT (slug) DO NOTHING;

-- Verify categories were inserted
SELECT 
    id,
    name,
    slug,
    description,
    color,
    "order"
FROM categories
ORDER BY "order";

