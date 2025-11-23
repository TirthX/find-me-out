-- Insert Categories and Tools
-- This script first creates categories, then inserts tools with proper category_id references

-- Step 1: Insert Categories (if they don't exist)
INSERT INTO categories (name, slug, description, icon, color, "order") VALUES
('AI Tools', 'ai-tools', 'General AI tools and services', 'Sparkles', '#8B5CF6', 1),
('Writing & Documentation', 'writing', 'AI-powered writing and content creation tools', 'PenTool', '#10B981', 2),
('Video', 'video', 'Video editing and production tools', 'Video', '#EC4899', 3),
('Image', 'image', 'Image generation and editing tools', 'Image', '#14B8A6', 4),
('Design', 'design', 'Design tools and resources', 'Palette', '#F59E0B', 5),
('Design Assets', 'design-assets', 'Design assets and resources', 'Layers', '#6366F1', 6),
('Audio & Utility', 'audio-utility', 'Audio creation and utility tools', 'Music', '#EF4444', 7),
('Automation', 'automation', 'Automation and workflow tools', 'Zap', '#10B981', 8),
('Code & Machine Learning', 'code', 'Coding assistance and ML tools', 'Code', '#3B82F6', 9),
('Website Build', 'website-build', 'Tools to build and design websites', 'Globe', '#3B82F6', 10),
('References & Inspiration', 'references-inspiration', 'Design inspiration and references', 'Bookmark', '#8B5CF6', 11),
('Utility Tools', 'utility-tools', 'General utility tools', 'Tool', '#6B7280', 12)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Step 2: Insert Tools with proper category_id (looked up from slug)
INSERT INTO tools (name, url, category_id, description, tags, is_trending, "order") VALUES

-- 1. AI Tools
('Donotpay', 'https://donotpay.com', (SELECT id FROM categories WHERE slug = 'ai-tools'), 'An AI tool assisting with automated tasks and services.', ARRAY['automation', 'legal'], false, 1),
('Aivalley', 'https://aivalley.ai/', (SELECT id FROM categories WHERE slug = 'ai-tools'), 'A general AI tool platform or service hub.', ARRAY['platform'], false, 2),
('Insidr.ai', 'https://www.insidr.ai/', (SELECT id FROM categories WHERE slug = 'ai-tools'), 'An AI tool for gaining insights or internal information.', ARRAY['insights'], false, 3),
('Lindy.ai', 'https://lindy.ai', (SELECT id FROM categories WHERE slug = 'ai-tools'), 'An AI tool/service (generalized description).', ARRAY[]::text[], false, 4),
('Latentbox.com', 'https://latentbox.com', (SELECT id FROM categories WHERE slug = 'ai-tools'), 'A specialized tool or service (likely AI/ML focused).', ARRAY[]::text[], false, 5),

-- 2. Writing & Documentation
('ChatPDF', 'https://www.chatpdf.com', (SELECT id FROM categories WHERE slug = 'writing'), 'An AI tool for interacting (chatting) with PDF documents.', ARRAY['pdf', 'document'], false, 1),
('Promptify', 'https://app.promptify.com/', (SELECT id FROM categories WHERE slug = 'writing'), 'An AI tool related to prompt engineering for content/writing.', ARRAY['prompt', 'writing'], false, 2),
('Kickresume', 'https://www.kickresume.com/', (SELECT id FROM categories WHERE slug = 'writing'), 'An AI tool assisting in resume creation.', ARRAY['resume', 'career'], false, 3),
('NotebookLM', 'https://notebooklm.google.com/', (SELECT id FROM categories WHERE slug = 'writing'), 'An AI tool for organization, research, or note-taking.', ARRAY['notes', 'research'], false, 4),
('Opus Pro', 'https://www.opus.pro/', (SELECT id FROM categories WHERE slug = 'writing'), 'A content tool geared toward professional content creation.', ARRAY['content', 'professional'], false, 5),
('Jenni.ai', 'https://jenni.ai/', (SELECT id FROM categories WHERE slug = 'writing'), 'An assistant tool focusing on AI writing assistance.', ARRAY['writing', 'assistant'], false, 6),
('Tango.ai', 'https://www.tango.ai/', (SELECT id FROM categories WHERE slug = 'writing'), 'An assistant tool designed for documenting processes and creating tutorials.', ARRAY['documentation', 'tutorials'], false, 7),
('Scribehow', 'https://scribehow.com', (SELECT id FROM categories WHERE slug = 'writing'), 'A tool for creating documentation/how-to guides.', ARRAY['documentation'], false, 8),

-- 3. Video
('InVideo AI', 'https://ai.invideo.io/', (SELECT id FROM categories WHERE slug = 'video'), 'A content tool, likely for AI-assisted video creation.', ARRAY['video', 'ai'], false, 1),
('Filmora', 'https://filmora.wondershare.net/', (SELECT id FROM categories WHERE slug = 'video'), 'A content tool specializing in video editing and production.', ARRAY['video', 'editing'], false, 2),
('Submagic', 'https://app.submagic.co/', (SELECT id FROM categories WHERE slug = 'video'), 'A content tool likely for automatically adding subtitles.', ARRAY['subtitles', 'video'], false, 3),
('Magic Animator', 'https://magicanimator.com', (SELECT id FROM categories WHERE slug = 'video'), 'A tool likely used for creating animations.', ARRAY['animation'], false, 4),
('Hera.video', 'https://hera.video', (SELECT id FROM categories WHERE slug = 'video'), 'A tool focused on video services.', ARRAY['video'], false, 5),

-- 4. Image
('Lummi.ai', 'https://www.lummi.ai/', (SELECT id FROM categories WHERE slug = 'image'), 'A content tool, likely related to image or visual generation.', ARRAY['image', 'generation'], false, 1),
('Imglarger', 'https://imglarger.com/', (SELECT id FROM categories WHERE slug = 'image'), 'A content tool used for image resizing and enhancement.', ARRAY['image', 'enhancement'], false, 2),
('Shots.so', 'https://shots.so/', (SELECT id FROM categories WHERE slug = 'image'), 'A content tool possibly for quick visual captures.', ARRAY['screenshot'], false, 3),

-- 5. Design
('Gradienty', 'https://gradienty.codes/', (SELECT id FROM categories WHERE slug = 'design'), 'A Design resource for generating color gradients.', ARRAY['gradient', 'color'], false, 1),
('Spline', 'https://spline.design/', (SELECT id FROM categories WHERE slug = 'design'), 'A Design tool used for 3D design and animation creation.', ARRAY['3d', 'design'], false, 2),
('Fontjoy', 'https://fontjoy.com/', (SELECT id FROM categories WHERE slug = 'design'), 'A Design tool for pairing and selecting fonts.', ARRAY['fonts', 'typography'], false, 3),
('Grainient', 'https://grainient.supply/', (SELECT id FROM categories WHERE slug = 'design'), 'A Design resource providing gradient assets or tools.', ARRAY['gradient'], false, 4),
('60fps.design', 'https://60fps.design/', (SELECT id FROM categories WHERE slug = 'design'), 'A Design tool focused on high-frame-rate interactions.', ARRAY['performance', 'design'], false, 5),
('Predis.ai', 'https://app.predis.ai/', (SELECT id FROM categories WHERE slug = 'design'), 'A content tool focusing on predictive AI content generation (visuals/social media).', ARRAY['social', 'content'], false, 6),
('Higgsfield.ai', 'https://higgsfield.ai/', (SELECT id FROM categories WHERE slug = 'design'), 'A content tool utilizing AI for creative production.', ARRAY['ai', 'creative'], false, 7),
('Playform.io', 'https://playform.io/', (SELECT id FROM categories WHERE slug = 'design'), 'A content tool, likely related to interactive or graphical forms of content.', ARRAY['interactive'], false, 8),

-- 6. Design Assets
('Asset Pro Design', 'https://assetpro.design/', (SELECT id FROM categories WHERE slug = 'design-assets'), 'A resource for design assets.', ARRAY['assets'], false, 1),
('SVG Doodles', 'https://svgdoodles.com/', (SELECT id FROM categories WHERE slug = 'design-assets'), 'A resource providing SVG illustrations/doodles.', ARRAY['svg', 'illustrations'], false, 2),

-- 7. Audio & Utility
('Krisp.ai', 'https://krisp.ai/', (SELECT id FROM categories WHERE slug = 'audio-utility'), 'An assistant tool specializing in noise cancellation during calls.', ARRAY['audio', 'noise'], false, 1),
('Omnidlm.io', 'https://omnidlm.io', (SELECT id FROM categories WHERE slug = 'audio-utility'), 'AI agent voice making tool.', ARRAY['voice', 'ai'], false, 2),
('TinyWow', 'https://tinywow.com/', (SELECT id FROM categories WHERE slug = 'audio-utility'), 'A multipurpose AI tool offering various tiny, useful functions.', ARRAY['utility'], false, 3),
('Monica.im', 'https://monica.im/', (SELECT id FROM categories WHERE slug = 'audio-utility'), 'A multifunctional assistant tool/browser extension.', ARRAY['assistant', 'browser'], false, 4),

-- 8. Automation
('SEO Studio Tools', 'https://seostudio.tools/', (SELECT id FROM categories WHERE slug = 'automation'), 'An AI tool focused on search engine optimization (SEO) assistance.', ARRAY['seo'], false, 1),
('Fireflies.ai', 'https://fireflies.ai/', (SELECT id FROM categories WHERE slug = 'automation'), 'An assistant tool for meeting transcription and summarization.', ARRAY['transcription', 'meetings'], false, 2),
('TestSprite', 'https://www.testsprite.com/', (SELECT id FROM categories WHERE slug = 'automation'), 'An assistant tool likely related to software testing support.', ARRAY['testing'], false, 3),
('Rocket.new', 'https://rocket.new', (SELECT id FROM categories WHERE slug = 'automation'), 'A tool for rapid launching or initiation of projects.', ARRAY['productivity'], false, 4),

-- 9. Code & Machine Learning
('AI Studio', 'https://aistudio.google.com/', (SELECT id FROM categories WHERE slug = 'code'), 'An assistant platform for developing and testing AI models.', ARRAY['ml', 'development'], false, 1),
('Reactbits', 'https://reactbits.dev/', (SELECT id FROM categories WHERE slug = 'code'), 'A Design tool offering reusable React components (developer focus).', ARRAY['react', 'components'], false, 2),
('21st.dev', 'https://21st.dev/', (SELECT id FROM categories WHERE slug = 'code'), 'A general Design UI/development resource.', ARRAY['development'], false, 3),
('Kilocode.ai', 'https://kilocode.ai/', (SELECT id FROM categories WHERE slug = 'code'), 'An AI-powered development tool for code assistance.', ARRAY['coding', 'ai'], false, 4),
('Emergent.sh', 'https://app.emergent.sh/', (SELECT id FROM categories WHERE slug = 'code'), 'A development tool, possibly for creating command-line interfaces.', ARRAY['cli', 'development'], false, 5),
('Rork.com', 'https://rork.com/', (SELECT id FROM categories WHERE slug = 'code'), 'A general development platform or service.', ARRAY['development'], false, 6),
('Bolt.new', 'https://bolt.new/', (SELECT id FROM categories WHERE slug = 'code'), 'A development tool for rapid project initialization.', ARRAY['development'], false, 7),
('Lovable.dev', 'https://lovable.dev/', (SELECT id FROM categories WHERE slug = 'code'), 'A development resource or tool.', ARRAY['development'], false, 8),
('v0.app', 'https://v0.app/', (SELECT id FROM categories WHERE slug = 'code'), 'An AI development tool, likely for generating code or UI.', ARRAY['ai', 'code'], false, 9),
('Hugging Face', 'https://huggingface.co/', (SELECT id FROM categories WHERE slug = 'code'), 'A development platform for hosting and sharing machine learning models.', ARRAY['ml', 'models'], true, 10),
('Flowith.io', 'https://flowith.io/', (SELECT id FROM categories WHERE slug = 'code'), 'A development tool, likely for workflow or flow diagramming.', ARRAY['workflow'], false, 11),
('Mgx.dev', 'https://mgx.dev/', (SELECT id FROM categories WHERE slug = 'code'), 'A development resource or tool.', ARRAY['development'], false, 12),

-- 10. Website Build
('Mixo', 'https://www.mixo.io/', (SELECT id FROM categories WHERE slug = 'website-build'), 'A development tool for quickly building websites.', ARRAY['website', 'builder'], false, 1),
('Durable', 'https://durable.co/', (SELECT id FROM categories WHERE slug = 'website-build'), 'A development tool for building websites quickly.', ARRAY['website', 'builder'], false, 2),

-- 11. References & Inspiration
('Godly Website', 'https://godly.website/', (SELECT id FROM categories WHERE slug = 'references-inspiration'), 'A reference platform for website design inspiration.', ARRAY['inspiration', 'website'], false, 1),
('Hatch Canvas', 'https://hatchcanvas.com/', (SELECT id FROM categories WHERE slug = 'references-inspiration'), 'A reference platform or canvas for design ideas.', ARRAY['design', 'inspiration'], false, 2),
('Muz.li', 'https://muz.li/', (SELECT id FROM categories WHERE slug = 'references-inspiration'), 'A reference platform for design and technology inspiration.', ARRAY['inspiration', 'design'], false, 3),
('One Page Love', 'https://onepagelove.com/', (SELECT id FROM categories WHERE slug = 'references-inspiration'), 'A reference platform showcasing single-page website designs.', ARRAY['website', 'inspiration'], false, 4),
('Inspirationde', 'https://www.inspirationde.com/', (SELECT id FROM categories WHERE slug = 'references-inspiration'), 'A reference platform for general design inspiration.', ARRAY['inspiration'], false, 5),
('Templifica', 'https://templifica.com/', (SELECT id FROM categories WHERE slug = 'references-inspiration'), 'A reference platform for design templates.', ARRAY['templates'], false, 6),
('Mobbin', 'https://mobbin.com/', (SELECT id FROM categories WHERE slug = 'references-inspiration'), 'A Design UI resource providing mobile app design examples and inspiration.', ARRAY['mobile', 'ui'], false, 7),

-- 12. Utility Tools
('Notion', 'https://www.notion.com/', (SELECT id FROM categories WHERE slug = 'utility-tools'), 'An assistant platform used for workspace organization and note-taking.', ARRAY['productivity', 'notes'], false, 1),
('Flectofy', 'https://flectofy.flecto.io/', (SELECT id FROM categories WHERE slug = 'utility-tools'), 'A specialized tool or service (generalized description).', ARRAY[]::text[], false, 2),
('Flames.blue', 'https://flames.blue', (SELECT id FROM categories WHERE slug = 'utility-tools'), 'A specialized tool or service (generalized description).', ARRAY[]::text[], false, 3),
('Bytez.com', 'https://bytez.com', (SELECT id FROM categories WHERE slug = 'utility-tools'), 'A specialized tool or service (generalized description).', ARRAY[]::text[], false, 4),
('Vercept', 'https://vercept.com', (SELECT id FROM categories WHERE slug = 'utility-tools'), 'A specialized tool or service (generalized description).', ARRAY[]::text[], false, 5);

-- Verify data was inserted
SELECT 
    (SELECT COUNT(*) FROM categories) as total_categories,
    (SELECT COUNT(*) FROM tools) as total_tools;

