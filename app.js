/* ============================================================
   AIFinder – app.js
   Production-Ready Application Logic & Security Hardening
   Real Supabase Auth, Role-Based Access Control, XSS Prevention & Dynamic UX
   ============================================================ */

// ── CATEGORIES DEFINITION ────────────────────────────────────
const CATEGORIES = [
  { id: 'writing',      emoji: '✍️',  name: 'Writing & Content' },
  { id: 'image',        emoji: '🎨',  name: 'Image Generation' },
  { id: 'code',         emoji: '💻',  name: 'Code & Dev' },
  { id: 'video',        emoji: '🎬',  name: 'Video & Animation' },
  { id: 'audio',        emoji: '🎵',  name: 'Audio & Music' },
  { id: 'research',     emoji: '🔬',  name: 'Research' },
  { id: 'productivity', emoji: '⚡',  name: 'Productivity' },
  { id: 'customer',     emoji: '💬',  name: 'Customer Support' },
  { id: 'data',         emoji: '📊',  name: 'Data & Analytics' },
  { id: 'education',    emoji: '📚',  name: 'Education' },
  { id: 'marketing',    emoji: '📣',  name: 'Marketing' },
  { id: 'other',        emoji: '🔮',  name: 'Other' },
];

// ── INITIAL SEED DATASET (64 AUTHENTIC AI TOOLS) ──────────────
const INITIAL_AI_TOOLS = [
  // WRITING & CONTENT
  { id: 1, name: 'ChatGPT', emoji: '🤖', category: 'writing', categoryLabel: 'Writing & Content', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.8, ratingCount: 8241, description: 'OpenAI\'s flagship conversational AI for drafting text, brainstorming, reasoning, and coding.', tags: ['Conversational AI', 'Text Gen', 'Q&A'], features: ['Multi-turn reasoning', 'File & image analysis', 'Custom GPTs', 'REST API'], website: 'https://chat.openai.com', hasAPI: true, hasFreeplan: true },
  { id: 2, name: 'Claude', emoji: '⚡', category: 'writing', categoryLabel: 'Writing & Content', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.9, ratingCount: 5712, description: 'Anthropic\'s safety-focused AI assistant with 200K token context, superior writing tone, and interactive Artifacts.', tags: ['Long Context', 'Analysis', 'Creative Writing'], features: ['200K token context', 'Interactive Artifacts', 'Constitutional AI', 'API access'], website: 'https://claude.ai', hasAPI: true, hasFreeplan: true },
  { id: 3, name: 'Jasper AI', emoji: '✍️', category: 'writing', categoryLabel: 'Writing & Content', pricing: 'paid', pricingLabel: 'Paid', rating: 4.4, ratingCount: 2714, description: 'Enterprise AI writing copilot designed for marketing teams to generate on-brand blog posts and campaigns.', tags: ['Marketing Copy', 'Blog Writing', 'Brand Voice'], features: ['Brand voice style guides', '50+ templates', 'SEO mode', 'Team workspaces'], website: 'https://jasper.ai', hasAPI: true, hasFreeplan: false },
  { id: 4, name: 'Copy.ai', emoji: '📝', category: 'writing', categoryLabel: 'Writing & Content', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.5, ratingCount: 3120, description: 'GTM AI platform that automates sales outreach, social media, and marketing copy generation.', tags: ['Sales Outreach', 'Social Media', 'Automation'], features: ['Workflow automations', 'Infobase brand storage', 'Multi-channel copy'], website: 'https://copy.ai', hasAPI: true, hasFreeplan: true },
  { id: 5, name: 'Writesonic', emoji: '🚀', category: 'writing', categoryLabel: 'Writing & Content', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.5, ratingCount: 2980, description: 'AI writer built for SEO content with real-time Google search grounding and landing page generator.', tags: ['SEO Articles', 'Landing Pages', 'Fact Checking'], features: ['Real-time Google grounding', 'Article Writer 6.0', 'Chatsonic bot'], website: 'https://writesonic.com', hasAPI: true, hasFreeplan: true },
  { id: 6, name: 'Grammarly AI', emoji: '✨', category: 'writing', categoryLabel: 'Writing & Content', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.7, ratingCount: 9400, description: 'Writing assistant providing real-time grammar checks, clarity enhancements, and generative rewrites.', tags: ['Grammar', 'Tone Adjustment', 'Proofreading'], features: ['Contextual grammar', 'Tone detector', 'Plagiarism detection'], website: 'https://grammarly.com', hasAPI: false, hasFreeplan: true },
  { id: 7, name: 'QuillBot', emoji: '🪶', category: 'writing', categoryLabel: 'Writing & Content', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.6, ratingCount: 6850, description: 'Paraphrasing and summarization tool that rewrites sentences across multiple creative and formal modes.', tags: ['Paraphrasing', 'Summarizer', 'Academic'], features: ['7 Paraphrase modes', 'Built-in thesaurus', 'Grammar checker'], website: 'https://quillbot.com', hasAPI: false, hasFreeplan: true },

  // IMAGE GENERATION
  { id: 8, name: 'Midjourney', emoji: '🎨', category: 'image', categoryLabel: 'Image Generation', pricing: 'paid', pricingLabel: 'Paid', rating: 4.9, ratingCount: 7102, description: 'The gold standard for AI art creation. Produces photorealistic and artistic visuals from text prompts.', tags: ['Art', 'Photorealism', 'Concept Art'], features: ['Style references', 'Character consistency', 'Inpainting & Pan'], website: 'https://midjourney.com', hasAPI: false, hasFreeplan: false },
  { id: 9, name: 'DALL-E 3', emoji: '🖼️', category: 'image', categoryLabel: 'Image Generation', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.6, ratingCount: 5123, description: 'OpenAI\'s image generator natively in ChatGPT. Superb prompt adherence and legible in-image text.', tags: ['OpenAI', 'Text in Images', 'Concept Design'], features: ['Prompt comprehension', 'In-image typography', 'API access'], website: 'https://openai.com/dall-e-3', hasAPI: true, hasFreeplan: true },
  { id: 10, name: 'Stable Diffusion', emoji: '🌌', category: 'image', categoryLabel: 'Image Generation', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.7, ratingCount: 6300, description: 'Open-weight generative image model by Stability AI. Total control via ControlNet and LoRA fine-tuning.', tags: ['Open Source', 'ControlNet', 'Fine-Tuning'], features: ['Local GPU execution', 'ControlNet pose guidance', 'Custom LoRAs'], website: 'https://stability.ai', hasAPI: true, hasFreeplan: true },
  { id: 11, name: 'Leonardo.Ai', emoji: '🦁', category: 'image', categoryLabel: 'Image Generation', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.8, ratingCount: 4890, description: 'Creative suite for game assets, marketing graphics, and digital illustration with real-time canvas.', tags: ['Game Assets', 'Real-Time Canvas', 'Illustration'], features: ['Realtime Canvas', 'Custom models', 'Daily free tokens'], website: 'https://leonardo.ai', hasAPI: true, hasFreeplan: true },
  { id: 12, name: 'Adobe Firefly', emoji: '🔥', category: 'image', categoryLabel: 'Image Generation', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.6, ratingCount: 3950, description: 'Commercially safe generative AI built into Adobe Photoshop and Illustrator with Generative Fill.', tags: ['Commercially Safe', 'Photoshop Integration', 'Vector Gen'], features: ['Generative Fill', 'Text to Vector', 'Commercial safety indemnity'], website: 'https://firefly.adobe.com', hasAPI: true, hasFreeplan: true },
  { id: 13, name: 'Ideogram', emoji: '🔤', category: 'image', categoryLabel: 'Image Generation', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.7, ratingCount: 3410, description: 'AI image generator specializing in typography, posters, logos, and t-shirt designs with accurate text.', tags: ['Typography', 'Logos', 'Poster Design'], features: ['Accurate text rendering', 'Magic Prompt', 'Style palettes'], website: 'https://ideogram.ai', hasAPI: true, hasFreeplan: true },

  // CODE & DEV
  { id: 14, name: 'GitHub Copilot', emoji: '💻', category: 'code', categoryLabel: 'Code & Dev', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.7, ratingCount: 5893, description: 'AI pair programmer by GitHub and OpenAI that completes code and entire functions inside your IDE.', tags: ['Pair Programming', 'VS Code', 'Code Completion'], features: ['Inline ghost completions', 'Copilot Chat', 'PR summaries'], website: 'https://github.com/features/copilot', hasAPI: true, hasFreeplan: true },
  { id: 15, name: 'Cursor', emoji: '🖱️', category: 'code', categoryLabel: 'Code & Dev', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.9, ratingCount: 4847, description: 'AI-first code editor built on VS Code. Understands your full repo and writes multi-file features.', tags: ['AI IDE', 'Codebase Chat', 'Refactoring'], features: ['Codebase indexing', 'Composer multi-file edits', 'Cursor Tab model'], website: 'https://cursor.com', hasAPI: false, hasFreeplan: true },
  { id: 16, name: 'v0 by Vercel', emoji: '⚡', category: 'code', categoryLabel: 'Code & Dev', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.8, ratingCount: 3920, description: 'Generative UI development system that creates production React, Tailwind CSS, and shadcn/ui code.', tags: ['Frontend Gen', 'React UI', 'Tailwind'], features: ['Prompt to React UI', 'Interactive preview', 'npm export'], website: 'https://v0.dev', hasAPI: true, hasFreeplan: true },
  { id: 17, name: 'Replit Agent', emoji: '🤖', category: 'code', categoryLabel: 'Code & Dev', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.6, ratingCount: 2950, description: 'Autonomous engineering agent that installs dependencies, writes full-stack code, and deploys live apps.', tags: ['Autonomous Agent', 'Cloud IDE', 'Instant Deployment'], features: ['Idea to deployed app', 'Database provisioning', 'Cloud hosting'], website: 'https://replit.com', hasAPI: true, hasFreeplan: true },
  { id: 18, name: 'Codeium', emoji: '🚀', category: 'code', categoryLabel: 'Code & Dev', pricing: 'free', pricingLabel: 'Free', rating: 4.7, ratingCount: 4210, description: 'Free AI code autocomplete toolkit with in-editor chat and search across 70+ programming languages.', tags: ['Free Forever', 'Fast Autocomplete', 'Self-Host'], features: ['Unlimited autocomplete', 'In-editor chat', '70+ languages'], website: 'https://codeium.com', hasAPI: true, hasFreeplan: true },
  { id: 19, name: 'Tabnine', emoji: '🛡️', category: 'code', categoryLabel: 'Code & Dev', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.4, ratingCount: 2650, description: 'Privacy-focused AI code assistant trained exclusively on permissively licensed open code.', tags: ['Privacy First', 'Permissive Code', 'Enterprise'], features: ['Zero data retention', 'Self-hosted option', 'Custom fine-tuning'], website: 'https://tabnine.com', hasAPI: true, hasFreeplan: true },

  // VIDEO & ANIMATION
  { id: 20, name: 'Runway Gen-3', emoji: '🎬', category: 'video', categoryLabel: 'Video & Animation', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.6, ratingCount: 2893, description: 'Cinematic AI video generation synthesizing 10-second video clips from text or reference images.', tags: ['Text-to-Video', 'Cinematics', 'VFX'], features: ['Photorealistic video', 'Motion Brush control', 'Lip-sync'], website: 'https://runwayml.com', hasAPI: true, hasFreeplan: true },
  { id: 21, name: 'Pika', emoji: '✨', category: 'video', categoryLabel: 'Video & Animation', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.6, ratingCount: 2450, description: 'Idea-to-video platform with 3D animation, physics effects (inflate, melt), and lip-syncing.', tags: ['Pikaffects', 'Animation', 'Lip Sync'], features: ['Pikaffects physics', 'Sound generator', 'Lip-sync'], website: 'https://pika.art', hasAPI: false, hasFreeplan: true },
  { id: 22, name: 'Sora (OpenAI)', emoji: '👁️', category: 'video', categoryLabel: 'Video & Animation', pricing: 'paid', pricingLabel: 'Paid', rating: 4.9, ratingCount: 3100, description: 'OpenAI video model generating 60-second scenes with physics simulation and complex camera angles.', tags: ['Physics Simulation', 'Ultra HD', 'OpenAI'], features: ['60-second scenes', 'World simulation', 'Multi-camera angles'], website: 'https://openai.com/sora', hasAPI: true, hasFreeplan: false },
  { id: 23, name: 'Luma Dream Machine', emoji: '🪐', category: 'video', categoryLabel: 'Video & Animation', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.7, ratingCount: 2200, description: 'Ultra-fast video generation model built directly on a transformer architecture with fluid motions.', tags: ['Fast Rendering', 'Transformer Video', 'Camera Moves'], features: ['Rapid rendering', 'Character physics', 'Keyframing'], website: 'https://lumalabs.ai/dream-machine', hasAPI: true, hasFreeplan: true },
  { id: 24, name: 'Synthesia', emoji: '🧑‍💼', category: 'video', categoryLabel: 'Video & Animation', pricing: 'paid', pricingLabel: 'Paid', rating: 4.5, ratingCount: 3100, description: 'AI video creation platform with 160+ photorealistic avatars and voiceovers in 140+ languages.', tags: ['AI Avatars', 'Corporate Training', 'Multi-Language'], features: ['160+ avatars', 'Custom avatars', '140+ languages'], website: 'https://synthesia.io', hasAPI: true, hasFreeplan: false },
  { id: 25, name: 'HeyGen', emoji: '🗣️', category: 'video', categoryLabel: 'Video & Animation', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.8, ratingCount: 3650, description: 'Personalized video platform featuring digital twins and video translation with natural lip-syncing.', tags: ['Video Translation', 'Digital Twin', 'Lip Sync'], features: ['Lip-matched translation', 'Digital twins', 'Streaming avatars'], website: 'https://heygen.com', hasAPI: true, hasFreeplan: true },

  // AUDIO & MUSIC
  { id: 26, name: 'ElevenLabs', emoji: '🎙️', category: 'audio', categoryLabel: 'Audio & Music', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.9, ratingCount: 5201, description: 'Industry-leading AI voice generator with instant voice cloning and emotional inflection in 29+ languages.', tags: ['Voice Synthesis', 'Voice Cloning', 'Audiobooks'], features: ['Instant voice cloning', 'Sound effects', 'Dubbing in 29 langs'], website: 'https://elevenlabs.io', hasAPI: true, hasFreeplan: true },
  { id: 27, name: 'Suno AI', emoji: '🎵', category: 'audio', categoryLabel: 'Audio & Music', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.8, ratingCount: 4950, description: 'Generative AI music platform composing full songs with custom lyrics, instrumentals, and vocals.', tags: ['Song Generation', 'Custom Lyrics', 'Full Tracks'], features: ['Full songs with vocals', 'Any musical genre', 'Stem export'], website: 'https://suno.com', hasAPI: false, hasFreeplan: true },
  { id: 28, name: 'Udio', emoji: '🎸', category: 'audio', categoryLabel: 'Audio & Music', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.7, ratingCount: 3600, description: 'Music creation tool with pristine acoustic fidelity, complex chord structures, and vocal styling.', tags: ['Acoustic Quality', 'DeepMind', 'Music Production'], features: ['Acoustic fidelity', 'Audio inpainting', '15-min track extension'], website: 'https://udio.com', hasAPI: false, hasFreeplan: true },
  { id: 29, name: 'Murf AI', emoji: '🎧', category: 'audio', categoryLabel: 'Audio & Music', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.5, ratingCount: 2800, description: 'AI voice generator studio for podcasters and educators with pitch, speed, and emphasis modulation.', tags: ['Voiceover Studio', 'E-Learning', 'Audio Editor'], features: ['120+ AI voices', 'Pitch modulation', 'Video sync'], website: 'https://murf.ai', hasAPI: true, hasFreeplan: true },
  { id: 30, name: 'Speechify', emoji: '📖', category: 'audio', categoryLabel: 'Audio & Music', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.6, ratingCount: 4100, description: 'Text-to-speech reader converting PDFs, articles, and books into audio with natural celebrity voices.', tags: ['Text to Speech', 'Audio Reader', 'Accessibility'], features: ['Natural voices', 'Up to 4.5x speed', 'OCR mobile scanner'], website: 'https://speechify.com', hasAPI: true, hasFreeplan: true },

  // RESEARCH & ANALYSIS
  { id: 31, name: 'Perplexity AI', emoji: '🔬', category: 'research', categoryLabel: 'Research', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.8, ratingCount: 6200, description: 'AI conversational search engine delivering concise answers backed by real-time citations.', tags: ['Citations', 'Search Engine', 'Fact Based'], features: ['Pro Search reasoning', 'Inline academic citations', 'Focus modes'], website: 'https://perplexity.ai', hasAPI: true, hasFreeplan: true },
  { id: 32, name: 'Consensus', emoji: '🧪', category: 'research', categoryLabel: 'Research', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.7, ratingCount: 2900, description: 'Academic AI querying 200M+ peer-reviewed papers to provide scientifically grounded consensus summaries.', tags: ['Peer Reviewed', 'Consensus Meter', 'Medical Research'], features: ['Consensus Meter', 'Paper summaries', 'PubMed index'], website: 'https://consensus.app', hasAPI: false, hasFreeplan: true },
  { id: 33, name: 'Elicit', emoji: '📑', category: 'research', categoryLabel: 'Research', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.7, ratingCount: 2600, description: 'AI research assistant that automates literature reviews and extracts structured table data from PDFs.', tags: ['Literature Review', 'Data Extraction', 'PDF Analysis'], features: ['Auto lit reviews', 'Table extraction', 'BibTeX export'], website: 'https://elicit.com', hasAPI: false, hasFreeplan: true },
  { id: 34, name: 'Scite.ai', emoji: '📊', category: 'research', categoryLabel: 'Research', pricing: 'paid', pricingLabel: 'Paid', rating: 4.6, ratingCount: 1850, description: 'Citation analysis platform evaluating whether citations support or contrast scientific claims.', tags: ['Smart Citations', 'Evidence Check', 'Academic'], features: ['Smart Citations', 'Reference check audit', 'Browser extension'], website: 'https://scite.ai', hasAPI: true, hasFreeplan: false },
  { id: 35, name: 'Semantic Scholar', emoji: '🎓', category: 'research', categoryLabel: 'Research', pricing: 'free', pricingLabel: 'Free', rating: 4.7, ratingCount: 4500, description: 'Free AI research index highlighting paper TLDRs and citation influence across 210M+ papers.', tags: ['Free Research', 'AI2', 'Paper TLDRs'], features: ['One-sentence TLDRs', 'Citation tracking', 'Free API'], website: 'https://semanticscholar.org', hasAPI: true, hasFreeplan: true },

  // PRODUCTIVITY
  { id: 36, name: 'Notion AI', emoji: '📝', category: 'productivity', categoryLabel: 'Productivity', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.6, ratingCount: 4821, description: 'AI embedded inside Notion to auto-fill tables, summarize notes, and answer questions across docs.', tags: ['Workspace', 'Summarization', 'Q&A on Docs'], features: ['Q&A on workspace', 'Autofill database', 'Meeting summaries'], website: 'https://notion.so/product/ai', hasAPI: false, hasFreeplan: true },
  { id: 37, name: 'Otter.ai', emoji: '🎙️', category: 'productivity', categoryLabel: 'Productivity', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.6, ratingCount: 5200, description: 'Meeting assistant that joins calls to transcribe, record, and extract automated action items.', tags: ['Meeting Notes', 'Transcription', 'Action Items'], features: ['Live transcription', 'Automated summaries', 'Otter AI Chat'], website: 'https://otter.ai', hasAPI: true, hasFreeplan: true },
  { id: 38, name: 'Motion', emoji: '📅', category: 'productivity', categoryLabel: 'Productivity', pricing: 'paid', pricingLabel: 'Paid', rating: 4.5, ratingCount: 2300, description: 'Intelligent daily planner automatically scheduling tasks and meetings around your priorities.', tags: ['Auto Scheduling', 'Calendar AI', 'Task Manager'], features: ['Schedule optimization', 'Task auto-priority', 'Meeting booking'], website: 'https://usemotion.com', hasAPI: false, hasFreeplan: false },
  { id: 39, name: 'Taskade AI', emoji: '⚡', category: 'productivity', categoryLabel: 'Productivity', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.7, ratingCount: 3100, description: 'Unified AI workspace featuring custom autonomous AI agents, mind maps, and team workflow automations.', tags: ['Custom Agents', 'Mind Mapping', 'Workflows'], features: ['AI agent teams', 'Mind maps to tasks', 'Workflow automation'], website: 'https://taskade.com', hasAPI: true, hasFreeplan: true },
  { id: 40, name: 'Gamma App', emoji: '📊', category: 'productivity', categoryLabel: 'Productivity', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.9, ratingCount: 4700, description: 'AI presentation and webpage maker turning plain text notes into polished slide decks in seconds.', tags: ['Decks & Slides', 'Interactive Docs', 'Visual AI'], features: ['One-click presentation', 'Interactive widgets', 'PPTX export'], website: 'https://gamma.app', hasAPI: false, hasFreeplan: true },

  // CUSTOMER SUPPORT
  { id: 41, name: 'Intercom Fin', emoji: '🤖', category: 'customer', categoryLabel: 'Customer Support', pricing: 'paid', pricingLabel: 'Paid', rating: 4.8, ratingCount: 2400, description: 'AI customer service bot resolving 50%+ of questions grounded strictly in your verified help docs.', tags: ['Support Bot', 'Intercom', 'Ticket Deflection'], features: ['50%+ automated resolution', 'Grounded knowledge', 'Human handoff'], website: 'https://intercom.com/fin', hasAPI: true, hasFreeplan: false },
  { id: 42, name: 'Zendesk AI', emoji: '🤝', category: 'customer', categoryLabel: 'Customer Support', pricing: 'paid', pricingLabel: 'Paid', rating: 4.5, ratingCount: 3800, description: 'Service intelligence predicting customer intent and providing automated suggestions to support agents.', tags: ['Agent Copilot', 'Intent Detection', 'Omnichannel'], features: ['Intelligent triage', 'Intent detection', 'Agent copilot'], website: 'https://zendesk.com/ai', hasAPI: true, hasFreeplan: false },
  { id: 43, name: 'Tidio Lyro', emoji: '💬', category: 'customer', categoryLabel: 'Customer Support', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.7, ratingCount: 2900, description: 'Conversational bot answering customer questions using verified store FAQs and product catalogs.', tags: ['SMB Support', 'Live Chat', 'E-Commerce'], features: ['Verified data answers', 'Shopify integration', '1-click takeover'], website: 'https://tidio.com/lyro', hasAPI: true, hasFreeplan: true },
  { id: 44, name: 'Ada Support', emoji: '🛡️', category: 'customer', categoryLabel: 'Customer Support', pricing: 'paid', pricingLabel: 'Paid', rating: 4.6, ratingCount: 1600, description: 'Enterprise AI resolving complex inquiries across voice, email, and chat in 50+ languages.', tags: ['Enterprise Omnichannel', 'Voice & Chat', 'No Code'], features: ['Omnichannel resolution', 'API action triggers', 'No-code builder'], website: 'https://ada.cx', hasAPI: true, hasFreeplan: false },
  { id: 45, name: 'Gorgias AI', emoji: '🛍️', category: 'customer', categoryLabel: 'Customer Support', pricing: 'paid', pricingLabel: 'Paid', rating: 4.7, ratingCount: 2100, description: 'E-commerce AI helpdesk tailored for Shopify brands to automate order tracking and returns.', tags: ['E-Commerce', 'Shopify', 'Auto Responses'], features: ['Order tracking responses', 'Shopify refunds', 'Multi-channel'], website: 'https://gorgias.com', hasAPI: true, hasFreeplan: false },

  // DATA & ANALYTICS
  { id: 46, name: 'Julius AI', emoji: '📊', category: 'data', categoryLabel: 'Data & Analytics', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.8, ratingCount: 3400, description: 'Personal AI data scientist. Upload CSVs or Excel sheets to generate charts and regressions using Python.', tags: ['Data Science', 'Python Code', 'Chart Generator'], features: ['Upload CSV/Excel', 'Python execution', 'Forecasting & models'], website: 'https://julius.ai', hasAPI: false, hasFreeplan: true },
  { id: 47, name: 'Polymer Search', emoji: '🔍', category: 'data', categoryLabel: 'Data & Analytics', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.6, ratingCount: 1950, description: 'Turns spreadsheets into interactive, searchable, and visual data dashboards without writing code.', tags: ['No-Code BI', 'Interactive Dashboard', 'Spreadsheets'], features: ['Instant dashboards', 'AI suggested insights', 'Live syncing'], website: 'https://polymersearch.com', hasAPI: false, hasFreeplan: true },
  { id: 48, name: 'Tableau Pulse', emoji: '📈', category: 'data', categoryLabel: 'Data & Analytics', pricing: 'paid', pricingLabel: 'Paid', rating: 4.6, ratingCount: 2800, description: 'Personalized AI metrics digest delivering plain-English driver analyses directly in Slack and email.', tags: ['Tableau', 'Salesforce', 'Metric Digests'], features: ['Plain English summaries', 'Proactive anomaly alerts', 'Slack digest'], website: 'https://tableau.com/products/pulse', hasAPI: true, hasFreeplan: false },
  { id: 49, name: 'Akkio', emoji: '🔮', category: 'data', categoryLabel: 'Data & Analytics', pricing: 'paid', pricingLabel: 'Paid', rating: 4.7, ratingCount: 1750, description: 'Predictive analytics platform for building machine learning lead scoring and churn models in minutes.', tags: ['Predictive ML', 'Agency Analytics', 'Lead Scoring'], features: ['Predictive lead scoring', 'Chat with live data', 'Snowflake sync'], website: 'https://akkio.com', hasAPI: true, hasFreeplan: false },
  { id: 50, name: 'Rows AI', emoji: '📑', category: 'data', categoryLabel: 'Data & Analytics', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.7, ratingCount: 2250, description: 'Smart spreadsheet where AI meets live data. Ask questions, clean dirty data, and enrich leads in grids.', tags: ['Smart Spreadsheet', 'Lead Enrichment', 'Chart Maker'], features: ['AI spreadsheet formulas', 'Data cleansing', 'LinkedIn enrichment'], website: 'https://rows.com', hasAPI: true, hasFreeplan: true },

  // EDUCATION
  { id: 51, name: 'Khanmigo', emoji: '🧑‍🏫', category: 'education', categoryLabel: 'Education', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.9, ratingCount: 5100, description: 'Khan Academy\'s AI tutor guiding students step-by-step through STEM subjects using the Socratic method.', tags: ['Socratic Tutoring', 'Khan Academy', 'STEM'], features: ['Socratic coaching', 'Teacher lesson plans', 'Math breakdown'], website: 'https://khanacademy.org/khanmigo', hasAPI: false, hasFreeplan: true },
  { id: 52, name: 'Quizlet Q-Chat', emoji: '💡', category: 'education', categoryLabel: 'Education', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.7, ratingCount: 6800, description: 'AI study coach quizzing students conversationally and adapting to individual knowledge gaps.', tags: ['Flashcards', 'Adaptive Quiz', 'Study Coach'], features: ['Conversational study', 'Adaptive memory quiz', 'Practice test creator'], website: 'https://quizlet.com', hasAPI: false, hasFreeplan: true },
  { id: 53, name: 'Socratic by Google', emoji: '🦉', category: 'education', categoryLabel: 'Education', pricing: 'free', pricingLabel: 'Free', rating: 4.8, ratingCount: 7400, description: 'Google\'s visual learning app. Snap photos of homework to get visual explanations and step-by-step steps.', tags: ['Free', 'Visual Explanations', 'Google AI'], features: ['Camera recognition', 'Step-by-step math', 'Curated videos'], website: 'https://socratic.org', hasAPI: false, hasFreeplan: true },
  { id: 54, name: 'Duolingo Max', emoji: '🦜', category: 'education', categoryLabel: 'Education', pricing: 'paid', pricingLabel: 'Paid', rating: 4.6, ratingCount: 4200, description: 'Duolingo tier with GPT-4 Roleplay conversations and Explain My Answer pedagogical breakdowns.', tags: ['Language Learning', 'Roleplay', 'GPT-4'], features: ['Roleplay scenarios', 'Explain My Answer', '20+ languages'], website: 'https://duolingo.com', hasAPI: false, hasFreeplan: false },
  { id: 55, name: 'Photomath', emoji: '📐', category: 'education', categoryLabel: 'Education', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.7, ratingCount: 8100, description: 'Camera calculator scanning equations and graphing quadratic curves with step-by-step logic.', tags: ['Math Solver', 'Camera Scanner', 'Step-by-Step'], features: ['Camera scan', 'Multiple solving methods', 'Interactive graphs'], website: 'https://photomath.com', hasAPI: false, hasFreeplan: true },

  // MARKETING
  { id: 56, name: 'AdCreative.ai', emoji: '🎯', category: 'marketing', categoryLabel: 'Marketing', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.6, ratingCount: 3100, description: 'Generates hundreds of high-converting ad banners and videos optimized for Meta, Google, and LinkedIn.', tags: ['Ad Creatives', 'Conversion Rate', 'Social Ads'], features: ['High-converting banners', 'AI conversion scoring', 'Headline generator'], website: 'https://adcreative.ai', hasAPI: true, hasFreeplan: true },
  { id: 57, name: 'Surfer SEO', emoji: '🏄', category: 'marketing', categoryLabel: 'Marketing', pricing: 'paid', pricingLabel: 'Paid', rating: 4.8, ratingCount: 4100, description: 'Content intelligence analyzing top SERPs to provide real-time NLP keywords and content scores.', tags: ['SEO Optimization', 'SERP Analysis', 'Content Score'], features: ['Content Score editor', 'NLP keyword suggestions', 'Internal link audit'], website: 'https://surferseo.com', hasAPI: true, hasFreeplan: false },
  { id: 58, name: 'HubSpot Breeze', emoji: '🧡', category: 'marketing', categoryLabel: 'Marketing', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.6, ratingCount: 3300, description: 'HubSpot\'s AI engine for customer intelligence, social post remixing, and automated lead nurturing.', tags: ['HubSpot CRM', 'Lead Nurturing', 'Inbound'], features: ['Breeze Copilot', 'Content remixer', 'Buyer intent scoring'], website: 'https://hubspot.com/products/artificial-intelligence', hasAPI: true, hasFreeplan: true },
  { id: 59, name: 'MarketMuse', emoji: '🏛️', category: 'marketing', categoryLabel: 'Marketing', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.5, ratingCount: 1600, description: 'Topic modeling platform identifying authority gaps and planning complete content roadmaps.', tags: ['Topic Modeling', 'Topical Authority', 'Strategy'], features: ['Topical authority score', 'Content gap analysis', 'Automated briefs'], website: 'https://marketmuse.com', hasAPI: true, hasFreeplan: true },
  { id: 60, name: 'Lately AI', emoji: '🎙️', category: 'marketing', categoryLabel: 'Marketing', pricing: 'paid', pricingLabel: 'Paid', rating: 4.5, ratingCount: 1400, description: 'Repurposes long-form podcasts and webinars into dozens of high-engagement social media posts.', tags: ['Repurposing', 'Social Media', 'Audio to Posts'], features: ['Video to social snippets', 'Predictive engagement', 'Social scheduler'], website: 'https://lately.ai', hasAPI: true, hasFreeplan: false },

  // OTHER
  { id: 61, name: 'Phind', emoji: '🔎', category: 'other', categoryLabel: 'Other', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.8, ratingCount: 3800, description: 'Intelligent search engine specifically engineered for developers with working code and live docs.', tags: ['Dev Search', 'Technical Q&A', 'Code Solutions'], features: ['Live documentation', 'Pair programmer mode', 'VS Code extension'], website: 'https://phind.com', hasAPI: true, hasFreeplan: true },
  { id: 62, name: 'Character.ai', emoji: '🎭', category: 'other', categoryLabel: 'Other', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.7, ratingCount: 8900, description: 'Platform hosting millions of custom AI personas, fictional characters, and conversational roleplay bots.', tags: ['Roleplay', 'Custom Personas', 'Entertainment'], features: ['Custom characters', 'Voice generation', 'Group chat mode'], website: 'https://character.ai', hasAPI: false, hasFreeplan: true },
  { id: 63, name: 'Pi by Inflection', emoji: '🌱', category: 'other', categoryLabel: 'Other', pricing: 'free', pricingLabel: 'Free', rating: 4.8, ratingCount: 4600, description: 'Empathetic personal conversational AI companion designed for friendly dialogue and advice.', tags: ['Personal Companion', 'Empathetic AI', 'Voice Chat'], features: ['Spoken voice modes', 'Empathetic conversation', 'Active listening'], website: 'https://pi.ai', hasAPI: false, hasFreeplan: true },
  { id: 64, name: 'Poe by Quora', emoji: '🏰', category: 'other', categoryLabel: 'Other', pricing: 'freemium', pricingLabel: 'Freemium', rating: 4.6, ratingCount: 4200, description: 'Multi-bot interface allowing you to chat with GPT-4, Claude 3.5, Gemini, Flux, and custom bots in one app.', tags: ['Multi-Model Hub', 'Custom Bots', 'Quora'], features: ['Access to all models', 'Bot creator monetization', 'Unified subscription'], website: 'https://poe.com', hasAPI: true, hasFreeplan: true }
];

// ── APP STATE ────────────────────────────────────────────────
let state = {
  currentPage: 'home',
  previousPage: 'home',
  previousCategory: null,
  activeCategory: null,
  activeFilter: 'all',
  sortBy: 'featured',
  searchQuery: '',
  compareSlots: [null, null, null],
  visibleCount: 9,
  currentDetailId: null,
  selectedRating: 0,
  currentUser: null, // { id, email, name, role }
  tools: [],
  submissions: [],
  signInLogs: [],
  isLoadingTools: false
};

// ── DOM & XSS SANITIZATION HELPERS ───────────────────────────
const $ = (id) => document.getElementById(id);

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeURL(url) {
  if (!url) return '#';
  const trimmed = String(url).trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return escapeHTML(trimmed);
  }
  return '#';
}

// ── DYNAMIC COUNT HELPER ─────────────────────────────────────
function getCategoryCount(catId) {
  return state.tools.filter(t => t.category === catId).length;
}

// ── INITIALIZE APPLICATION ───────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  renderToolsLoading();
  initNav();
  initSearch();
  initFilters();
  initCompare();
  initSubmitForm();
  initAdminDashboard();
  initAuthSystem();
  initScrollEffects();

  // Load live user session & subscribe to Supabase Auth State changes
  await loadUserSession();
  DB.onAuthStateChange(async (event) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
      await loadUserSession();
      if (state.currentPage === 'admin' && state.currentUser?.role !== 'admin') {
        navigateTo('home');
      }
    } else if (event === 'SIGNED_OUT') {
      state.currentUser = null;
      updateAuthUI();
      if (state.currentPage === 'admin') {
        navigateTo('home');
      }
    }
  });

  await loadToolsFromDB();
  renderCategories();
  renderTools();
  updateHeroStats();
});

// ── LOAD TOOLS FROM DATABASE ─────────────────────────────────
async function loadToolsFromDB() {
  state.isLoadingTools = true;
  try {
    const dbTools = await DB.fetchTools();
    if (dbTools && dbTools.length > 0) {
      state.tools = dbTools;
    } else {
      state.tools = [...INITIAL_AI_TOOLS];
    }
  } catch (err) {
    console.error('Error fetching tools from DB, using fallback:', err);
    state.tools = [...INITIAL_AI_TOOLS];
  } finally {
    state.isLoadingTools = false;
  }
}

// ── LOADING SKELETON RENDERER ─────────────────────────────────
function renderToolsLoading() {
  const grid = $('tools-grid');
  if (!grid) return;
  const skeletons = Array(6).fill(0).map(() => `
    <div class="tool-card skeleton-card">
      <div class="tool-card-header">
        <div class="skeleton-box" style="width:52px;height:52px;border-radius:var(--radius-md)"></div>
        <div style="flex:1">
          <div class="skeleton-line" style="width:60%;height:18px;margin-bottom:8px"></div>
          <div class="skeleton-line" style="width:40%;height:14px"></div>
        </div>
      </div>
      <div class="skeleton-line" style="width:100%;height:14px;margin-top:12px"></div>
      <div class="skeleton-line" style="width:85%;height:14px;margin-top:6px"></div>
      <div class="tool-card-footer" style="margin-top:16px">
        <div class="skeleton-line" style="width:30%;height:14px"></div>
        <div class="skeleton-line" style="width:20%;height:14px;border-radius:99px"></div>
      </div>
    </div>
  `).join('');
  grid.innerHTML = skeletons;
}

// ── HERO STATS (COMPUTED ACCURATELY) ─────────────────────────
function updateHeroStats() {
  const totalTools = state.tools.length;
  const totalCats = CATEGORIES.length;
  const totalReviews = state.tools.reduce((sum, t) => sum + (t.ratingCount || 0), 0);
  const formattedReviews = totalReviews >= 1000 ? `${Math.round(totalReviews / 1000)}K+` : totalReviews;

  const badgeText = $('hero-badge-text');
  if (badgeText) badgeText.textContent = `${totalTools} AI Tools Curated & Reviewed`;

  const statTools = $('stat-tools-count');
  if (statTools) statTools.textContent = totalTools;

  const statCats = $('stat-cats-count');
  if (statCats) statCats.textContent = totalCats;

  const statReviews = $('stat-reviews-count');
  if (statReviews) statReviews.textContent = formattedReviews;
}

// ── NAVIGATION & ROUTE PROTECTION ────────────────────────────
function initNav() {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(el.dataset.page);
    });
  });

  $('logo-home')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.activeCategory = null;
    state.searchQuery = '';
    state.activeFilter = 'all';
    state.visibleCount = 9;
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    $('chip-all')?.classList.add('active');
    if ($('search-input')) $('search-input').value = '';
    renderCategories();
    renderTools();
    navigateTo('home');
  });

  $('btn-get-started')?.addEventListener('click', () => {
    if (!state.currentUser) {
      openAuthModal('signup');
    } else {
      navigateTo('submit');
    }
  });

  $('btn-open-login')?.addEventListener('click', () => openAuthModal('signin'));
  $('mobile-auth-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!state.currentUser) {
      openAuthModal('signin');
    } else {
      handleSignOut();
    }
  });

  $('btn-404-home')?.addEventListener('click', () => navigateTo('home'));

  // Mobile menu toggle
  $('mobile-menu-btn')?.addEventListener('click', () => {
    $('mobile-menu')?.classList.toggle('open');
  });

  // User Dropdown toggle
  $('user-menu-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    $('user-dropdown')?.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    $('user-dropdown')?.classList.add('hidden');
  });
}

function navigateTo(page, data) {
  const validPages = ['home', 'compare', 'submit', 'admin', 'detail', '404'];
  const targetPage = validPages.includes(page) ? page : '404';

  // Strict route protection for Admin Page
  if (targetPage === 'admin') {
    if (!state.currentUser) {
      showToast('Please sign in with administrator credentials to access the Admin Dashboard.', 'warning');
      openAuthModal('signin');
      return;
    }

    if (state.currentUser.role !== 'admin') {
      showToast('Access denied: Administrator authorization required.', 'error');
      if (state.currentPage !== 'home') navigateTo('home');
      return;
    }
  }

  // Submission page authentication prompt
  if (targetPage === 'submit' && !state.currentUser) {
    showToast('Please sign in or create an account to submit an AI tool.', 'info');
    openAuthModal('signin');
    return;
  }

  if (state.currentPage !== targetPage && state.currentPage !== 'detail') {
    state.previousPage = state.currentPage;
    if (state.currentPage === 'home') {
      state.previousCategory = state.activeCategory;
    }
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.classList.remove('active'));

  state.currentPage = targetPage;
  $(`page-${targetPage}`)?.classList.add('active');
  $(`nav-${targetPage}`)?.classList.add('active');
  $('mobile-menu')?.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (targetPage === 'admin') {
    refreshAdminDashboard();
  }

  if (targetPage === 'detail' && data) {
    renderDetail(data);
  }
}

// ── CATEGORIES ────────────────────────────────────────────────
function renderCategories() {
  const grid = $('categories-grid');
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map(cat => {
    const count = getCategoryCount(cat.id);
    const isActive = state.activeCategory === cat.id;
    return `
      <div class="category-card ${isActive ? 'active' : ''} fade-in-up" data-cat="${escapeHTML(cat.id)}" onclick="selectCategory('${escapeHTML(cat.id)}')">
        <span class="cat-emoji">${escapeHTML(cat.emoji)}</span>
        <span class="cat-name">${escapeHTML(cat.name)}</span>
        <span class="cat-count">${count} ${count === 1 ? 'tool' : 'tools'}</span>
      </div>
    `;
  }).join('');
}

function selectCategory(catId) {
  if (state.activeCategory === catId) {
    state.activeCategory = null;
  } else {
    state.activeCategory = catId;
    state.searchQuery = '';
    if ($('search-input')) $('search-input').value = '';
  }

  document.querySelectorAll('.category-card').forEach(c => {
    c.classList.toggle('active', c.dataset.cat === state.activeCategory);
  });

  state.visibleCount = 9;
  renderTools();

  setTimeout(() => {
    $('tools-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ── FILTER & SORT ENGINE ─────────────────────────────────────
function getFilteredTools() {
  let tools = [...state.tools];

  // Category filter
  if (state.activeCategory) {
    tools = tools.filter(t => t.category === state.activeCategory);
  }

  // Search filter
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    tools = tools.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q))) ||
      t.categoryLabel.toLowerCase().includes(q)
    );
  }

  // Chip filter
  if (state.activeFilter !== 'all') {
    if (state.activeFilter === 'api') {
      tools = tools.filter(t => t.hasAPI);
    } else {
      tools = tools.filter(t => t.pricing === state.activeFilter);
    }
  }

  // Sort
  switch (state.sortBy) {
    case 'rating':  tools.sort((a, b) => b.rating - a.rating); break;
    case 'az':      tools.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'newest':  tools.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); break;
  }

  return tools;
}

function renderTools() {
  if (state.isLoadingTools) {
    renderToolsLoading();
    return;
  }

  const tools = getFilteredTools();
  const visible = tools.slice(0, state.visibleCount);
  const grid = $('tools-grid');
  if (!grid) return;

  const titleEl = $('tools-section-title');
  const subEl = $('tools-section-sub');

  if (state.activeCategory) {
    const cat = CATEGORIES.find(c => c.id === state.activeCategory);
    const catTotal = getCategoryCount(state.activeCategory);
    if (titleEl) titleEl.textContent = `${cat ? cat.name : 'Category'} Tools`;
    if (subEl) {
      if (state.activeFilter !== 'all') {
        subEl.textContent = `Showing ${tools.length} of ${catTotal} ${cat ? cat.name : ''} tools (filtered by ${escapeHTML(state.activeFilter.toUpperCase())})`;
      } else {
        subEl.textContent = `Showing all ${tools.length} curated tools in ${cat ? cat.name : ''}`;
      }
    }
  } else if (state.searchQuery) {
    if (titleEl) titleEl.textContent = `Search: "${escapeHTML(state.searchQuery)}"`;
    if (subEl) subEl.textContent = `Found ${tools.length} matching AI ${tools.length === 1 ? 'tool' : 'tools'}`;
  } else {
    if (titleEl) titleEl.textContent = 'Featured AI Tools';
    if (subEl) {
      if (state.activeFilter !== 'all') {
        subEl.textContent = `Showing ${tools.length} AI tools with ${escapeHTML(state.activeFilter.toUpperCase())} plan`;
      } else {
        subEl.textContent = `Showing all ${state.tools.length} curated AI tools across all categories`;
      }
    }
  }

  if (tools.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-muted);">
        <div style="font-size:48px;margin-bottom:16px;">🔍</div>
        <h3 style="color:var(--text-secondary);margin-bottom:8px;">No tools found</h3>
        <p>Try changing your category, filter chip, or search query.</p>
        <button class="btn-outline sm" style="margin-top:16px" onclick="resetFilters()">Clear Filters</button>
      </div>`;
    $('load-more-btn')?.classList.add('hidden');
    return;
  }

  grid.innerHTML = visible.map(tool => renderToolCard(tool)).join('');

  const btn = $('load-more-btn');
  if (btn) {
    if (tools.length > state.visibleCount) {
      btn.classList.remove('hidden');
      btn.textContent = `Load More (${tools.length - state.visibleCount} remaining)`;
    } else {
      btn.classList.add('hidden');
    }
  }

  grid.querySelectorAll('.tool-card').forEach((card, i) => {
    card.style.animationDelay = `${(i % 9) * 40}ms`;
    card.classList.add('fade-in-up');
  });
}

function resetFilters() {
  state.activeCategory = null;
  state.activeFilter = 'all';
  state.searchQuery = '';
  if ($('search-input')) $('search-input').value = '';
  document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  $('chip-all')?.classList.add('active');
  renderTools();
}

function renderToolCard(tool) {
  const stars = '★'.repeat(Math.round(tool.rating)) + '☆'.repeat(5 - Math.round(tool.rating));
  const inCompare = state.compareSlots.includes(tool.id);

  return `
    <div class="tool-card" onclick="openDetail(${tool.id})" id="tool-card-${tool.id}">
      <button class="compare-toggle ${inCompare ? 'selected' : ''}"
        id="compare-btn-${tool.id}"
        onclick="toggleCompare(event, ${tool.id})"
        title="Add to compare">⚖️</button>
      <div class="tool-card-header">
        <div class="tool-logo">${escapeHTML(tool.emoji || '🤖')}</div>
        <div class="tool-info">
          <div class="tool-name">${escapeHTML(tool.name)}</div>
          <span class="tool-category">${escapeHTML(tool.categoryLabel)}</span>
        </div>
      </div>
      <p class="tool-desc">${escapeHTML(tool.description)}</p>
      <div class="tool-tags">
        ${(tool.tags || []).slice(0, 3).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
      </div>
      <div class="tool-card-footer">
        <div class="tool-rating">
          <span class="stars">${stars}</span>
          <span class="rating-num">${tool.rating || 4.8}</span>
          <span class="rating-count">(${(tool.ratingCount || 1).toLocaleString()})</span>
        </div>
        <span class="pricing-badge ${escapeHTML(tool.pricing)}">${escapeHTML(tool.pricingLabel || 'Freemium')}</span>
      </div>
    </div>
  `;
}

// ── SEARCH ────────────────────────────────────────────────────
function initSearch() {
  const input = $('search-input');
  const suggestions = $('search-suggestions');
  const btn = $('search-btn');

  if (!input || !suggestions || !btn) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { suggestions.innerHTML = ''; return; }

    const matches = state.tools.filter(t =>
      t.name.toLowerCase().includes(q) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q))) ||
      t.categoryLabel.toLowerCase().includes(q)
    ).slice(0, 6);

    if (matches.length === 0) {
      suggestions.innerHTML = `<div style="padding:12px 16px; font-size:13px; color:var(--text-muted)">No matching AI tools found</div>`;
      return;
    }

    suggestions.innerHTML = matches.map(t => `
      <div class="suggestion-item" onclick="doSearch('${escapeHTML(t.name).replace(/'/g, "\\'")}')">
        <span class="suggestion-emoji">${escapeHTML(t.emoji || '🤖')}</span>
        <div>
          <strong style="font-size:14px">${escapeHTML(t.name)}</strong>
          <div style="font-size:12px;color:var(--text-muted)">${escapeHTML(t.categoryLabel)} • ${escapeHTML(t.pricingLabel)}</div>
        </div>
      </div>
    `).join('');
  });

  btn.addEventListener('click', () => doSearch(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch(input.value);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      suggestions.innerHTML = '';
    }
  });

  $('load-more-btn')?.addEventListener('click', () => {
    state.visibleCount += 9;
    renderTools();
  });

  $('sort-select')?.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    state.visibleCount = 9;
    renderTools();
  });
}

function doSearch(query) {
  state.searchQuery = (query || '').trim();
  if ($('search-suggestions')) $('search-suggestions').innerHTML = '';
  if (state.searchQuery) {
    if ($('search-input')) $('search-input').value = state.searchQuery;
    state.activeCategory = null;
    state.activeFilter = 'all';
    state.visibleCount = 9;
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    $('chip-all')?.classList.add('active');
    renderTools();
    setTimeout(() => {
      $('tools-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

// ── FILTERS ───────────────────────────────────────────────────
function initFilters() {
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      state.activeFilter = chip.dataset.filter;
      state.visibleCount = 9;
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderTools();
    });
  });
}

// ── COMPARE SYSTEM ────────────────────────────────────────────
let currentSlotTarget = null;

function initCompare() {
  $('modal-close-btn')?.addEventListener('click', closeSlotPicker);
  $('slot-picker-modal')?.addEventListener('click', (e) => {
    if (e.target === $('slot-picker-modal')) closeSlotPicker();
  });

  $('modal-search')?.addEventListener('input', (e) => {
    renderModalList(e.target.value);
  });
}

function toggleCompare(e, toolId) {
  e.stopPropagation();
  const idx = state.compareSlots.indexOf(toolId);
  if (idx !== -1) {
    state.compareSlots[idx] = null;
    showToast(`Removed from comparison`, 'info');
  } else {
    const emptyIdx = state.compareSlots.indexOf(null);
    if (emptyIdx === -1) {
      showToast('Comparison is full (max 3 tools). Remove one first.', 'warning');
      return;
    }
    state.compareSlots[emptyIdx] = toolId;
    showToast(`Added to comparison`, 'success');
  }
  renderCompareSlots();
  const btn = $(`compare-btn-${toolId}`);
  if (btn) btn.classList.toggle('selected', state.compareSlots.includes(toolId));
}

function openSlotPicker(slotIdx) {
  currentSlotTarget = slotIdx;
  if ($('modal-search')) $('modal-search').value = '';
  renderModalList('');
  $('slot-picker-modal')?.classList.remove('hidden');
}

function closeSlotPicker() {
  $('slot-picker-modal')?.classList.add('hidden');
  currentSlotTarget = null;
}

function renderModalList(query) {
  const q = (query || '').toLowerCase();
  const tools = state.tools.filter(t =>
    t.name.toLowerCase().includes(q) || t.categoryLabel.toLowerCase().includes(q)
  );

  const modalList = $('modal-list');
  if (!modalList) return;

  modalList.innerHTML = tools.map(t => `
    <div class="modal-tool-item" onclick="selectToolForSlot(${t.id})">
      <span class="modal-tool-emoji">${escapeHTML(t.emoji || '🤖')}</span>
      <div class="modal-tool-info">
        <div class="tool-name">${escapeHTML(t.name)}</div>
        <span class="tool-category">${escapeHTML(t.categoryLabel)}</span>
      </div>
    </div>
  `).join('');
}

function selectToolForSlot(toolId) {
  if (currentSlotTarget === null) return;
  state.compareSlots[currentSlotTarget] = toolId;
  closeSlotPicker();
  renderCompareSlots();
  const btn = $(`compare-btn-${toolId}`);
  if (btn) btn.classList.add('selected');
}

function renderCompareSlots() {
  state.compareSlots.forEach((toolId, idx) => {
    const slot = $(`slot-${idx}`);
    if (!slot) return;
    const tool = state.tools.find(t => t.id === toolId);

    if (tool) {
      slot.innerHTML = `
        <div class="slot-filled">
          <button class="slot-remove" onclick="removeFromSlot(${idx})" title="Remove">✕</button>
          <div class="slot-logo">${escapeHTML(tool.emoji || '🤖')}</div>
          <div class="slot-name">${escapeHTML(tool.name)}</div>
          <div class="slot-cat">${escapeHTML(tool.categoryLabel)}</div>
        </div>`;
    } else {
      slot.innerHTML = `
        <div class="slot-empty" data-slot="${idx}">
          <span class="slot-plus">+</span>
          <p>Add AI Tool</p>
          <button class="btn-outline sm" onclick="openSlotPicker(${idx})">Browse</button>
        </div>`;
    }
  });

  const filled = state.compareSlots.filter(s => s !== null);
  if (filled.length >= 2) {
    renderCompareTable();
    $('compare-table-wrapper')?.classList.remove('hidden');
  } else {
    $('compare-table-wrapper')?.classList.add('hidden');
  }
}

function removeFromSlot(idx) {
  const toolId = state.compareSlots[idx];
  state.compareSlots[idx] = null;
  renderCompareSlots();
  const btn = $(`compare-btn-${toolId}`);
  if (btn) btn.classList.remove('selected');
}

function renderCompareTable() {
  const tools = state.compareSlots.map(id => state.tools.find(t => t.id === id)).filter(Boolean);
  const stars = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

  const rows = [
    ['Category',     tools.map(t => `<span class="tool-category">${escapeHTML(t.categoryLabel)}</span>`)],
    ['Rating',       tools.map(t => `<span class="stars">${stars(t.rating)}</span> <strong>${t.rating}</strong>`)],
    ['Reviews',      tools.map(t => (t.ratingCount || 1).toLocaleString())],
    ['Pricing',      tools.map(t => `<span class="pricing-badge ${escapeHTML(t.pricing)}">${escapeHTML(t.pricingLabel)}</span>`)],
    ['Free Plan',    tools.map(t => t.hasFreeplan ? '<span class="check-yes">✓ Yes</span>' : '<span class="check-no">✗ No</span>')],
    ['API Access',   tools.map(t => t.hasAPI ? '<span class="check-yes">✓ Yes</span>' : '<span class="check-no">✗ No</span>')],
    ['Key Feature',  tools.map(t => escapeHTML((t.features && t.features[0]) || 'AI Powered'))],
    ['Best For',     tools.map(t => escapeHTML((t.tags && t.tags[0]) || t.categoryLabel))],
  ];

  const table = $('compare-table');
  if (!table) return;

  table.innerHTML = `
    <thead>
      <tr>
        <th>Feature</th>
        ${tools.map(t => `<th>${escapeHTML(t.emoji || '🤖')} ${escapeHTML(t.name)}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${rows.map(([label, vals]) => `
        <tr>
          <td>${label}</td>
          ${vals.map(v => `<td>${v}</td>`).join('')}
        </tr>
      `).join('')}
      <tr>
        <td>Visit</td>
        ${tools.map(t => `<td><a href="${sanitizeURL(t.website)}" target="_blank" rel="noopener noreferrer" class="btn-outline sm" onclick="event.stopPropagation()">Go to ${escapeHTML(t.name)} →</a></td>`).join('')}
      </tr>
    </tbody>
  `;
}

// ── DETAIL PAGE ───────────────────────────────────────────────
async function openDetail(toolId) {
  const tool = state.tools.find(t => t.id === toolId);
  if (!tool) {
    navigateTo('404');
    return;
  }
  state.currentDetailId = toolId;
  navigateTo('detail', tool);

  try {
    tool.reviews = await DB.fetchReviews(toolId);
    renderDetail(tool);
  } catch (err) {
    console.warn('Error fetching tool reviews:', err);
  }
}

function renderDetail(tool) {
  const stars = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
  const detailContainer = $('detail-content');
  if (!detailContainer) return;

  detailContainer.innerHTML = `
    <div class="detail-hero">
      <div class="detail-logo">${escapeHTML(tool.emoji || '🤖')}</div>
      <div class="detail-meta">
        <h1 class="detail-name">${escapeHTML(tool.name)}</h1>
        <div class="detail-badges">
          <span class="tool-category">${escapeHTML(tool.categoryLabel)}</span>
          <span class="pricing-badge ${escapeHTML(tool.pricing)}">${escapeHTML(tool.pricingLabel)}</span>
          ${tool.hasAPI ? '<span class="tag">API Available</span>' : ''}
        </div>
        <div class="tool-rating" style="gap:6px">
          <span class="stars" style="font-size:16px">${stars(tool.rating)}</span>
          <span class="rating-num" style="font-size:16px">${tool.rating}</span>
          <span class="rating-count">(${(tool.ratingCount || 1).toLocaleString()} reviews)</span>
        </div>
        <div class="detail-actions">
          <a href="${sanitizeURL(tool.website)}" target="_blank" rel="noopener noreferrer" class="btn-primary">Visit ${escapeHTML(tool.name)} →</a>
          <button class="btn-outline" onclick="addToCompareFromDetail(${tool.id})">⚖️ Add to Compare</button>
        </div>
      </div>
    </div>

    <div class="detail-body">
      <div class="detail-main">
        <div class="detail-section">
          <h3>About ${escapeHTML(tool.name)}</h3>
          <p class="detail-desc">${escapeHTML(tool.description)}</p>
        </div>
        <div class="detail-section">
          <h3>Key Features</h3>
          <div class="feature-list">
            ${(tool.features || ['State-of-the-art AI model', 'Real-time performance', 'User friendly interface']).map(f => `<div class="feature-item">${escapeHTML(f)}</div>`).join('')}
          </div>
        </div>
        <div class="detail-section">
          <h3>User Reviews</h3>
          <div class="reviews-list">
            ${(tool.reviews && tool.reviews.length > 0) ? tool.reviews.map(r => `
              <div class="review-card">
                <div class="review-header">
                  <div class="review-avatar">${escapeHTML((r.user || 'M')[0].toUpperCase())}</div>
                  <div>
                    <div class="review-name">${escapeHTML(r.user)}</div>
                    <div class="review-date">${escapeHTML(r.date)}</div>
                  </div>
                </div>
                <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
                <p class="review-text">${escapeHTML(r.text)}</p>
              </div>
            `).join('') : '<p style="color:var(--text-muted);font-size:14px">Be the first to review this AI tool!</p>'}
          </div>

          <!-- Write Review -->
          <div class="write-review" id="write-review-section">
            <h4 style="font-size:15px;font-weight:600;margin:24px 0 12px">Write a Review</h4>
            <div class="star-input" id="star-input">
              ${[1,2,3,4,5].map(n => `<span class="star-btn" data-val="${n}" onclick="setRating(${n})">★</span>`).join('')}
            </div>
            <textarea class="review-textarea" id="review-text" placeholder="Share your experience with ${escapeHTML(tool.name)} (min. 20 characters)…"></textarea>
            <button class="btn-primary" style="margin-top:12px" onclick="submitReview(${tool.id})">Post Review</button>
          </div>
        </div>
      </div>

      <div class="detail-sidebar">
        <div class="detail-section">
          <h3>Quick Stats</h3>
          <div class="sidebar-stat"><span class="sidebar-stat-label">Rating</span><span class="sidebar-stat-value">${tool.rating}/5.0</span></div>
          <div class="sidebar-stat"><span class="sidebar-stat-label">Reviews</span><span class="sidebar-stat-value">${(tool.ratingCount || 1).toLocaleString()}</span></div>
          <div class="sidebar-stat"><span class="sidebar-stat-label">Pricing</span><span class="sidebar-stat-value">${escapeHTML(tool.pricingLabel)}</span></div>
          <div class="sidebar-stat"><span class="sidebar-stat-label">Free Plan</span><span class="sidebar-stat-value">${tool.hasFreeplan ? '✓ Yes' : '✗ No'}</span></div>
          <div class="sidebar-stat"><span class="sidebar-stat-label">API</span><span class="sidebar-stat-value">${tool.hasAPI ? '✓ Yes' : '✗ No'}</span></div>
          <div class="sidebar-stat"><span class="sidebar-stat-label">Category</span><span class="sidebar-stat-value">${escapeHTML(tool.categoryLabel)}</span></div>
        </div>
        <div class="detail-section">
          <h3>Tags</h3>
          <div class="tool-tags">
            ${(tool.tags || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  const backBtn = $('back-btn');
  if (backBtn) {
    backBtn.onclick = () => {
      if (state.previousCategory) {
        selectCategory(state.previousCategory);
      }
      navigateTo(state.previousPage || 'home');
    };
  }
}

function setRating(n) {
  state.selectedRating = n;
  document.querySelectorAll('.star-btn').forEach((btn, i) => {
    btn.classList.toggle('lit', i < n);
  });
}

function addToCompareFromDetail(toolId) {
  const idx = state.compareSlots.indexOf(null);
  if (idx === -1) { showToast('Comparison full. Remove a tool first.', 'warning'); return; }
  state.compareSlots[idx] = toolId;
  showToast('Added to comparison!', 'success');
}

async function submitReview(toolId) {
  if (!state.currentUser) {
    showToast('Please sign in to write and submit a review.', 'warning');
    openAuthModal('signin');
    return;
  }

  const text = $('review-text') ? $('review-text').value.trim() : '';
  if (!state.selectedRating || state.selectedRating < 1 || state.selectedRating > 5) {
    showToast('Please select a star rating (1 to 5 stars).', 'warning');
    return;
  }

  if (text.length < 20) {
    showToast('Review must be at least 20 characters long.', 'warning');
    return;
  }

  if (text.length > 2000) {
    showToast('Review cannot exceed 2,000 characters.', 'warning');
    return;
  }

  const tool = state.tools.find(t => t.id === toolId);
  if (!tool) return;

  const res = await DB.addReview(toolId, { rating: state.selectedRating, text });
  if (res.success) {
    if (!tool.reviews) tool.reviews = [];
    tool.reviews.unshift(res.review);
    tool.ratingCount += 1;
    state.selectedRating = 0;
    if ($('review-text')) $('review-text').value = '';
    showToast('Review posted successfully!', 'success');
    await loadToolsFromDB();
    const updatedTool = state.tools.find(t => t.id === toolId) || tool;
    renderDetail(updatedTool);
    updateHeroStats();
  } else {
    showToast(res.error || 'Failed to post review.', 'error');
  }
}

// ── USER SUBMIT FORM (COMMUNITY TO ADMIN QUEUE) ───────────────
function initSubmitForm() {
  $('submit-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!state.currentUser) {
      showToast('Authentication required. Please sign in to submit an AI tool.', 'warning');
      openAuthModal('signin');
      return;
    }

    if (!validatePublicSubmit()) return;

    const btn = $('submit-btn');
    if ($('submit-btn-text')) $('submit-btn-text').textContent = 'Submitting to Admin Queue…';
    $('submit-spinner')?.classList.remove('hidden');
    if (btn) btn.disabled = true;

    const catSelect = $('ai-category');
    const catText = catSelect.options[catSelect.selectedIndex].text;

    const submissionData = {
      name: $('ai-name').value.trim(),
      category: $('ai-category').value,
      categoryLabel: catText,
      website: $('ai-url').value.trim(),
      pricing: $('ai-pricing').value,
      email: $('ai-submitter').value.trim(),
      description: $('ai-desc').value.trim(),
      features: $('ai-features').value.trim()
    };

    const res = await DB.submitCommunityTool(submissionData);

    $('submit-spinner')?.classList.add('hidden');
    if (btn) btn.disabled = false;
    if ($('submit-btn-text')) $('submit-btn-text').textContent = 'Submit for Admin Review';

    if (res.success) {
      $('submit-form')?.classList.add('hidden');
      $('submit-success')?.classList.remove('hidden');
      showToast('Tool submitted for Admin approval!', 'success');
      refreshAdminBadges();
    } else {
      showToast(res.error || 'Failed to submit tool', 'error');
      const errName = $('err-name');
      const nameInput = $('ai-name');
      if (errName) errName.textContent = res.error;
      if (nameInput) nameInput.classList.add('error');
    }
  });

  $('submit-again-btn')?.addEventListener('click', () => {
    $('submit-form')?.reset();
    $('submit-form')?.classList.remove('hidden');
    $('submit-success')?.classList.add('hidden');
  });

  $('submit-success-home')?.addEventListener('click', () => {
    navigateTo('home');
  });
}

function validatePublicSubmit() {
  let valid = true;
  const fields = [
    { id: 'ai-name', errId: 'err-name', msg: 'Tool name is required (2–120 characters).' },
    { id: 'ai-category', errId: 'err-category', msg: 'Please select a category.' },
    { id: 'ai-url', errId: 'err-url', msg: 'Please enter a valid HTTPS URL (e.g. https://example.com).', type: 'https' },
    { id: 'ai-pricing', errId: 'err-pricing', msg: 'Please select a pricing model.' },
    { id: 'ai-submitter', errId: 'err-email', msg: 'Please enter a valid email address.', type: 'email' },
    { id: 'ai-desc', errId: 'err-desc', msg: 'Description must be between 10 and 3,000 characters.' },
  ];

  fields.forEach(({ id, errId, msg, type }) => {
    const el = $(id);
    const errEl = $(errId);
    if (!el || !errEl) return;
    const val = el.value.trim();
    let fieldValid = val !== '';

    if (id === 'ai-name' && (val.length < 2 || val.length > 120)) {
      fieldValid = false;
    }
    if (id === 'ai-desc' && (val.length < 10 || val.length > 3000)) {
      fieldValid = false;
    }
    if (type === 'https' && fieldValid) {
      fieldValid = /^https:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/i.test(val);
    }
    if (type === 'email' && fieldValid) {
      fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    el.classList.toggle('error', !fieldValid);
    errEl.textContent = fieldValid ? '' : msg;
    if (!fieldValid) valid = false;
  });

  // Real-time duplicate check against live catalog
  const nameInput = $('ai-name');
  const errName = $('err-name');
  if (nameInput && errName && nameInput.value.trim()) {
    const norm = nameInput.value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const alreadyExists = state.tools.some(t => t.name.toLowerCase().replace(/[^a-z0-9]/g, '') === norm);
    if (alreadyExists) {
      nameInput.classList.add('error');
      errName.textContent = `"${nameInput.value.trim()}" is already listed in the AI directory.`;
      valid = false;
    }
  }

  const agree = $('agree-terms');
  if (agree && $('err-agree')) {
    $('err-agree').textContent = agree.checked ? '' : 'You must confirm before submitting.';
    if (!agree.checked) valid = false;
  }

  return valid;
}

// ── REAL AUTHENTICATION & USER SESSIONS ───────────────────────
function initAuthSystem() {
  $('auth-modal-close')?.addEventListener('click', closeAuthModal);
  $('auth-modal')?.addEventListener('click', (e) => {
    if (e.target === $('auth-modal')) closeAuthModal();
  });

  $('auth-tab-signin')?.addEventListener('click', () => switchAuthTab('signin'));
  $('auth-tab-signup')?.addEventListener('click', () => switchAuthTab('signup'));

  // 1. User Sign In Form (Real Supabase Auth)
  $('form-signin')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = $('signin-email');
    const passInput = $('signin-password');
    const errEmail = $('err-signin-email');
    const errPass = $('err-signin-password');

    if (errEmail) errEmail.textContent = '';
    if (errPass) errPass.textContent = '';

    const email = emailInput?.value.trim() || '';
    const password = passInput?.value || '';

    if (!email) {
      if (errEmail) errEmail.textContent = 'Please enter your email.';
      emailInput?.classList.add('error');
      return;
    }
    if (!password) {
      if (errPass) errPass.textContent = 'Please enter your password.';
      passInput?.classList.add('error');
      return;
    }

    const btn = $('btn-signin');
    if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }

    const res = await DB.authSignIn(email, password);

    if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }

    if (res.success && res.user) {
      state.currentUser = res.user;
      updateAuthUI();
      closeAuthModal();
      showToast(`Welcome back, ${escapeHTML(res.user.name)}!`, 'success');
      if (res.user.role === 'admin') {
        refreshAdminBadges();
      }
    } else {
      showToast(res.error || 'Authentication failed.', 'error');
      if (errPass) errPass.textContent = res.error || 'Invalid credentials.';
      passInput?.classList.add('error');
    }
  });

  // 2. User Sign Up Form (Real Supabase Auth)
  $('form-signup')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = $('signup-name');
    const emailInput = $('signup-email');
    const passInput = $('signup-password');
    const errName = $('err-signup-name');
    const errEmail = $('err-signup-email');
    const errPass = $('err-signup-password');

    if (errName) errName.textContent = '';
    if (errEmail) errEmail.textContent = '';
    if (errPass) errPass.textContent = '';

    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const password = passInput?.value || '';

    let hasError = false;

    if (!name) {
      if (errName) errName.textContent = 'Full name is required.';
      nameInput?.classList.add('error');
      hasError = true;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (errEmail) errEmail.textContent = 'Please enter a valid email address.';
      emailInput?.classList.add('error');
      hasError = true;
    }
    if (!password || password.length < 6) {
      if (errPass) errPass.textContent = 'Password must be at least 6 characters.';
      passInput?.classList.add('error');
      hasError = true;
    }

    if (hasError) return;

    const btn = $('btn-signup');
    if (btn) { btn.disabled = true; btn.textContent = 'Creating Account…'; }

    const res = await DB.authSignUp(email, password, name);

    if (btn) { btn.disabled = false; btn.textContent = 'Create Account'; }

    if (res.success) {
      if (res.requiresConfirmation) {
        showToast(res.message || 'Account created! Please check your email to confirm.', 'info');
        closeAuthModal();
      } else {
        state.currentUser = res.user;
        updateAuthUI();
        closeAuthModal();
        showToast(`Welcome to AIFinder, ${escapeHTML(res.user.name)}!`, 'success');
      }
    } else {
      showToast(res.error || 'Failed to create account.', 'error');
      if (errEmail) errEmail.textContent = res.error || 'Sign up failed.';
      emailInput?.classList.add('error');
    }
  });

  // Logout Handler
  $('btn-logout')?.addEventListener('click', handleSignOut);
}

function openAuthModal(tab = 'signin') {
  switchAuthTab(tab);
  $('auth-modal')?.classList.remove('hidden');
}

function closeAuthModal() {
  $('auth-modal')?.classList.add('hidden');
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.auth-pane').forEach(p => p.classList.remove('active'));

  $(`auth-tab-${tab}`)?.classList.add('active');
  $(`pane-auth-${tab}`)?.classList.add('active');
}

async function loadUserSession() {
  state.currentUser = await DB.getCurrentUser();
  updateAuthUI();
}

function updateAuthUI() {
  const loggedOut = $('auth-logged-out');
  const loggedIn = $('auth-logged-in');
  const mobileAuthBtn = $('mobile-auth-btn');

  if (state.currentUser) {
    loggedOut?.classList.add('hidden');
    loggedIn?.classList.remove('hidden');

    if (mobileAuthBtn) mobileAuthBtn.textContent = 'Sign Out';

    const displayName = $('user-display-name');
    const avatarInitial = $('user-avatar-initial');
    const roleBadge = $('user-role-badge');
    const emailLabel = $('dropdown-user-email');
    const roleDropdown = $('dropdown-user-role');
    const adminLink = $('dropdown-admin-link');

    if (displayName) displayName.textContent = state.currentUser.name;
    if (avatarInitial) avatarInitial.textContent = (state.currentUser.name || 'U')[0].toUpperCase();
    if (roleBadge) roleBadge.textContent = state.currentUser.role === 'admin' ? 'Admin' : 'Member';
    if (emailLabel) emailLabel.textContent = state.currentUser.email;
    if (roleDropdown) roleDropdown.textContent = `Role: ${state.currentUser.role.toUpperCase()}`;

    // Admin nav visual state
    const navAdmin = $('nav-admin');
    const mobileAdmin = $('mobile-admin-link');
    if (state.currentUser.role === 'admin') {
      if (navAdmin) {
        navAdmin.classList.remove('hidden');
        navAdmin.style.opacity = '1';
        navAdmin.title = 'Admin Panel';
      }
      if (adminLink) adminLink.classList.remove('hidden');
      if (mobileAdmin) mobileAdmin.classList.remove('hidden');
    } else {
      if (adminLink) adminLink.classList.add('hidden');
      if (navAdmin) navAdmin.style.opacity = '0.7';
    }
  } else {
    loggedOut?.classList.remove('hidden');
    loggedIn?.classList.add('hidden');
    if (mobileAuthBtn) mobileAuthBtn.textContent = 'Sign In';

    const navAdmin = $('nav-admin');
    if (navAdmin) navAdmin.style.opacity = '0.6';
  }
}

async function handleSignOut() {
  await DB.authSignOut();
  state.currentUser = null;
  updateAuthUI();
  showToast('Signed out successfully.', 'info');
  if (state.currentPage === 'admin') {
    navigateTo('home');
  }
}

// ── ADMIN DASHBOARD MODULE (STRICT AUTHORIZATION) ────────────
function initAdminDashboard() {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchAdminTab(btn.dataset.tab);
    });
  });

  $('btn-refresh-admin')?.addEventListener('click', refreshAdminDashboard);
  $('btn-refresh-logs')?.addEventListener('click', renderSignInLogsTable);
  $('btn-open-add-tool')?.addEventListener('click', () => switchAdminTab('add-tool'));

  // Form: Directly Add AI Tool
  $('admin-add-tool-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleAdminAddTool();
  });

  // Form: Supabase Configuration
  $('supabase-config-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = $('supabase-url').value;
    const anon = $('supabase-anon-key').value;
    const res = await DB.setConfig(url, anon);

    showToast(res.message, 'success');
    updateDBStatusBadge();
    await loadToolsFromDB();
    renderCategories();
    renderTools();
    updateHeroStats();
  });

  $('btn-disconnect-supabase')?.addEventListener('click', async () => {
    await DB.setConfig('', '');
    $('supabase-url').value = '';
    $('supabase-anon-key').value = '';
    showToast('Supabase connection cleared.', 'info');
    updateDBStatusBadge();
  });

  $('btn-seed-supabase')?.addEventListener('click', async () => {
    if (!state.currentUser || state.currentUser.role !== 'admin') {
      showToast('Admin privileges required to seed database.', 'error');
      return;
    }

    const seedBtn = $('btn-seed-supabase');
    if (seedBtn) seedBtn.textContent = 'Seeding Tools…';
    const res = await DB.seedInitialTools(INITIAL_AI_TOOLS);
    if (seedBtn) seedBtn.textContent = '🌱 Seed 64 Tools to Supabase Cloud';

    if (res.success) {
      showToast('Seeded 64 tools to Supabase database!', 'success');
      await refreshAdminDashboard();
    } else {
      showToast(res.error || 'Failed to seed database.', 'error');
    }
  });

  // Copy SQL button
  $('btn-copy-sql')?.addEventListener('click', () => {
    const code = $('sql-code-snippet')?.textContent || '';
    navigator.clipboard.writeText(code);
    showToast('SQL Schema copied to clipboard!', 'success');
  });

  // Search in manage tools table
  $('manage-tools-search')?.addEventListener('input', (e) => {
    renderManageToolsTable(e.target.value);
  });

  // Edit Tool Modal events
  $('edit-tool-modal-close')?.addEventListener('click', closeEditToolModal);
  $('edit-tool-cancel')?.addEventListener('click', closeEditToolModal);
  $('form-edit-tool')?.addEventListener('submit', handleSaveEditedTool);

  // Prefill Supabase config inputs
  if (DB.config.url && $('supabase-url')) $('supabase-url').value = DB.config.url;
  if (DB.config.anonKey && $('supabase-anon-key')) $('supabase-anon-key').value = DB.config.anonKey;
}

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));

  $(`tab-btn-${tabName}`)?.classList.add('active');
  $(`pane-${tabName}`)?.classList.add('active');

  if (tabName === 'pending') renderPendingSubmissions();
  if (tabName === 'manage') renderManageToolsTable();
  if (tabName === 'logs') renderSignInLogsTable();
}

async function refreshAdminDashboard() {
  if (!state.currentUser || state.currentUser.role !== 'admin') return;

  updateDBStatusBadge();
  await loadToolsFromDB();
  renderCategories();
  renderTools();
  updateHeroStats();

  state.submissions = await DB.fetchSubmissions();
  state.signInLogs = await DB.fetchSignInLogs();

  const pendingCount = state.submissions.filter(s => s.status === 'pending').length;
  const totalSignIns = state.signInLogs.length;
  const totalReviews = state.tools.reduce((sum, t) => sum + (t.ratingCount || 0), 0);

  if ($('admin-stat-total-tools')) $('admin-stat-total-tools').textContent = state.tools.length;
  if ($('admin-stat-pending-subs')) $('admin-stat-pending-subs').textContent = pendingCount;
  if ($('admin-stat-signins')) $('admin-stat-signins').textContent = totalSignIns;
  if ($('admin-stat-reviews')) $('admin-stat-reviews').textContent = totalReviews >= 1000 ? `${Math.round(totalReviews/1000)}K+` : totalReviews;

  if ($('badge-pending-count')) $('badge-pending-count').textContent = pendingCount;
  if ($('badge-tools-count')) $('badge-tools-count').textContent = state.tools.length;
  if ($('badge-logs-count')) $('badge-logs-count').textContent = totalSignIns;

  renderPendingSubmissions();
  renderManageToolsTable();
  renderSignInLogsTable();
}

async function refreshAdminBadges() {
  const subs = await DB.fetchSubmissions();
  const pending = subs.filter(s => s.status === 'pending').length;
  if ($('badge-pending-count')) $('badge-pending-count').textContent = pending;
}

function updateDBStatusBadge() {
  const label = $('db-status-label');
  if (!label) return;
  if (DB.isSupabaseConfigured) {
    label.textContent = 'Database Status: Supabase Cloud Connected ⚡';
    label.parentElement.style.background = '#eff6ff';
    label.parentElement.style.borderColor = '#93c5fd';
    label.parentElement.style.color = '#1d4ed8';
  } else {
    label.textContent = 'Database Status: Offline / Configuration Needed';
    label.parentElement.style.background = '#fef2f2';
    label.parentElement.style.borderColor = '#fecaca';
    label.parentElement.style.color = '#b91c1c';
  }
}

// ── ADMIN: ADD NEW AI TOOL ────────────────────────────────────
async function handleAdminAddTool() {
  if (!state.currentUser || state.currentUser.role !== 'admin') {
    showToast('Unauthorized: Administrator privileges required.', 'error');
    return;
  }

  const nameVal = $('admin-tool-name').value.trim();
  const websiteVal = $('admin-tool-website').value.trim();
  const descVal = $('admin-tool-desc').value.trim();

  if (!nameVal || nameVal.length < 2 || nameVal.length > 120) {
    showToast('Tool name must be between 2 and 120 characters.', 'warning');
    return;
  }

  if (!/^https:\/\//i.test(websiteVal)) {
    showToast('Official website URL must begin with https://', 'warning');
    return;
  }

  if (descVal.length < 10 || descVal.length > 3000) {
    showToast('Description must be between 10 and 3,000 characters.', 'warning');
    return;
  }

  const catSelect = $('admin-tool-category');
  const catLabel = catSelect.options[catSelect.selectedIndex].text;
  const pricingVal = $('admin-tool-pricing').value;
  const pricingLabels = { free: 'Free', freemium: 'Freemium', paid: 'Paid', enterprise: 'Enterprise' };

  const toolData = {
    name: nameVal,
    emoji: $('admin-tool-emoji').value.trim() || '🤖',
    category: $('admin-tool-category').value,
    categoryLabel: catLabel,
    pricing: pricingVal,
    pricingLabel: pricingLabels[pricingVal] || 'Freemium',
    rating: parseFloat($('admin-tool-rating').value) || 4.8,
    ratingCount: 1,
    description: descVal,
    tags: $('admin-tool-tags').value.split(',').map(s => s.trim()).filter(Boolean),
    features: $('admin-tool-features').value.split(',').map(s => s.trim()).filter(Boolean),
    website: websiteVal,
    hasAPI: $('admin-tool-has-api').checked,
    hasFreeplan: $('admin-tool-has-free').checked
  };

  const res = await DB.addTool(toolData);
  if (res.success) {
    $('admin-add-tool-form').reset();
    showToast(`AI Tool "${escapeHTML(toolData.name)}" published to database!`, 'success');
    await refreshAdminDashboard();
    switchAdminTab('manage');
  } else {
    showToast(res.error || 'Failed to add tool to database.', 'error');
  }
}

// ── ADMIN: PENDING USER SUBMISSIONS QUEUE ─────────────────────
function renderPendingSubmissions() {
  const container = $('pending-submissions-list');
  if (!container) return;
  const pending = state.submissions.filter(s => s.status === 'pending');

  if (pending.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
        <div style="font-size:36px;margin-bottom:10px">✨</div>
        <h4>No pending submissions</h4>
        <p style="font-size:13.5px">All user submissions have been reviewed and approved!</p>
      </div>`;
    return;
  }

  container.innerHTML = pending.map(sub => {
    const formattedDate = new Date(sub.submitted_at || sub.submittedAt || Date.now()).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const featuresList = Array.isArray(sub.features) ? sub.features.join(', ') : sub.features;

    return `
      <div class="submission-card" id="submission-card-${sub.id}">
        <div class="submission-header">
          <div>
            <div class="submission-title">🚀 ${escapeHTML(sub.name)}</div>
            <div class="submission-meta">
              <span class="tool-category">${escapeHTML(sub.category_label || sub.categoryLabel || sub.category)}</span>
              <span class="pricing-badge ${escapeHTML(sub.pricing)}">${escapeHTML(sub.pricing)}</span>
              <span style="font-size:12px;color:var(--text-muted)">Submitted by: <strong>${escapeHTML(sub.submitter_email || sub.email)}</strong> • ${formattedDate}</span>
            </div>
          </div>
          <a href="${sanitizeURL(sub.website)}" target="_blank" rel="noopener noreferrer" class="btn-outline sm">Visit Website ↗</a>
        </div>
        <p class="submission-desc">${escapeHTML(sub.description)}</p>
        ${featuresList ? `<div class="submission-features"><strong>Features:</strong> ${escapeHTML(featuresList)}</div>` : ''}
        <div class="submission-actions">
          <button class="btn-success-sm" onclick="approveUserSubmission(${sub.id})">✓ Approve & Publish Live</button>
          <button class="btn-danger-sm" onclick="rejectUserSubmission(${sub.id})">✕ Reject</button>
        </div>
      </div>
    `;
  }).join('');
}

async function approveUserSubmission(id) {
  if (!state.currentUser || state.currentUser.role !== 'admin') {
    showToast('Unauthorized: Admin access required.', 'error');
    return;
  }

  const res = await DB.approveSubmission(id);
  if (res.success) {
    showToast(`Approved & published "${escapeHTML(res.tool?.name || 'tool')}" live!`, 'success');
    await refreshAdminDashboard();
  } else {
    showToast(res.error || 'Failed to approve submission.', 'error');
  }
}

async function rejectUserSubmission(id) {
  if (!state.currentUser || state.currentUser.role !== 'admin') {
    showToast('Unauthorized: Admin access required.', 'error');
    return;
  }

  if (!confirm('Are you sure you want to reject this submission?')) return;
  const res = await DB.rejectSubmission(id, 'Did not meet quality guidelines');
  if (res.success) {
    showToast('Submission rejected', 'info');
    await refreshAdminDashboard();
  } else {
    showToast(res.error || 'Failed to reject submission.', 'error');
  }
}

// ── ADMIN: MANAGE ALL DATABASE TOOLS TABLE ───────────────────
function renderManageToolsTable(searchQuery = '') {
  const tbody = $('manage-tools-tbody');
  if (!tbody) return;
  const q = (searchQuery || '').toLowerCase();
  const tools = state.tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.categoryLabel.toLowerCase().includes(q) ||
    t.pricing.toLowerCase().includes(q)
  );

  if (tools.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text-muted)">No matching tools in database</td></tr>`;
    return;
  }

  tbody.innerHTML = tools.map(t => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:22px">${escapeHTML(t.emoji || '🤖')}</span>
          <div>
            <strong>${escapeHTML(t.name)}</strong>
            <div style="font-size:11.5px;color:var(--text-muted)"><a href="${sanitizeURL(t.website)}" target="_blank" rel="noopener noreferrer">${escapeHTML(t.website)}</a></div>
          </div>
        </div>
      </td>
      <td><span class="tool-category">${escapeHTML(t.categoryLabel)}</span></td>
      <td><span class="pricing-badge ${escapeHTML(t.pricing)}">${escapeHTML(t.pricingLabel)}</span></td>
      <td><strong>${t.rating} ★</strong> <span style="font-size:11px;color:var(--text-muted)">(${t.ratingCount})</span></td>
      <td>${t.hasAPI ? '<span style="color:var(--success)">✓ API</span>' : '<span style="color:var(--text-muted)">—</span>'}</td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn-outline sm" onclick="openEditToolModal(${t.id})">✏️ Edit</button>
          <button class="btn-danger-sm" onclick="deleteToolFromDB(${t.id}, '${escapeHTML(t.name).replace(/'/g, "\\'")}')">🗑️ Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function deleteToolFromDB(toolId, toolName) {
  if (!state.currentUser || state.currentUser.role !== 'admin') {
    showToast('Unauthorized: Admin access required.', 'error');
    return;
  }

  if (!confirm(`Are you sure you want to delete "${toolName}" from the database?`)) return;
  const res = await DB.deleteTool(toolId);
  if (res.success) {
    showToast(`Deleted "${toolName}" from database`, 'info');
    await refreshAdminDashboard();
  } else {
    showToast(res.error || 'Failed to delete tool.', 'error');
  }
}

// ── ADMIN: EDIT TOOL MODAL ───────────────────────────────────
function openEditToolModal(toolId) {
  if (!state.currentUser || state.currentUser.role !== 'admin') {
    showToast('Unauthorized: Admin access required.', 'error');
    return;
  }

  const tool = state.tools.find(t => t.id == toolId);
  if (!tool) return;

  $('edit-tool-id').value = tool.id;
  $('edit-tool-name').value = tool.name;
  $('edit-tool-emoji').value = tool.emoji || '🤖';
  $('edit-tool-category').value = tool.category;
  $('edit-tool-pricing').value = tool.pricing;
  $('edit-tool-website').value = tool.website;
  $('edit-tool-desc').value = tool.description;

  $('edit-tool-modal')?.classList.remove('hidden');
}

function closeEditToolModal() {
  $('edit-tool-modal')?.classList.add('hidden');
}

async function handleSaveEditedTool(e) {
  e.preventDefault();
  if (!state.currentUser || state.currentUser.role !== 'admin') {
    showToast('Unauthorized: Admin access required.', 'error');
    return;
  }

  const id = $('edit-tool-id').value;
  const catSelect = $('edit-tool-category');
  const catLabel = catSelect.options[catSelect.selectedIndex].text;
  const pricingVal = $('edit-tool-pricing').value;
  const pricingLabels = { free: 'Free', freemium: 'Freemium', paid: 'Paid', enterprise: 'Enterprise' };

  const updates = {
    name: $('edit-tool-name').value.trim(),
    emoji: $('edit-tool-emoji').value.trim(),
    category: $('edit-tool-category').value,
    categoryLabel: catLabel,
    pricing: pricingVal,
    pricingLabel: pricingLabels[pricingVal] || 'Freemium',
    website: $('edit-tool-website').value.trim(),
    description: $('edit-tool-desc').value.trim()
  };

  const res = await DB.updateTool(id, updates);
  closeEditToolModal();

  if (res.success) {
    showToast('Tool updated in database!', 'success');
    await refreshAdminDashboard();
  } else {
    showToast(res.error || 'Failed to update tool in database.', 'error');
  }
}

// ── ADMIN: SIGN-IN ACTIVITY LOGS TABLE ───────────────────────
async function renderSignInLogsTable() {
  if (!state.currentUser || state.currentUser.role !== 'admin') return;

  const tbody = $('signin-logs-tbody');
  if (!tbody) return;
  state.signInLogs = await DB.fetchSignInLogs();

  if (state.signInLogs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--text-muted)">No sign-in records logged yet</td></tr>`;
    return;
  }

  tbody.innerHTML = state.signInLogs.map(log => {
    const d = new Date(log.signed_in_at || log.signedInAt || Date.now());
    const formatted = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const isAdm = log.role === 'admin';

    const ua = log.user_agent || navigator.userAgent;
    const browser = ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : 'Browser';

    return `
      <tr>
        <td>
          <strong>${escapeHTML(log.user_name || (log.email ? log.email.split('@')[0] : 'User'))}</strong>
          <div style="font-size:12px;color:var(--text-muted)">${escapeHTML(log.email || 'user@example.com')}</div>
        </td>
        <td>
          <span style="font-size:11px;font-weight:700;padding:3px 8px;border-radius:99px;background:${isAdm ? '#f3e8ff;color:#7e22ce' : '#e0f2fe;color:#0369a1'}">
            ${escapeHTML((log.role || 'user').toUpperCase())}
          </span>
        </td>
        <td>${formatted}</td>
        <td><code>${escapeHTML(log.auth_provider || 'email')}</code></td>
        <td style="font-size:12px;color:var(--text-secondary);max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escapeHTML(ua)}">
          💻 ${escapeHTML(browser)} on Client
        </td>
      </tr>
    `;
  }).join('');
}

// ── SCROLL EFFECTS ────────────────────────────────────────────
function initScrollEffects() {
  window.addEventListener('scroll', () => {
    const navbar = $('navbar');
    navbar?.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ── TOAST NOTIFICATIONS ───────────────────────────────────────
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const colors = { success: '#10b981', warning: '#f59e0b', info: '#5b5ef4', error: '#ef4444' };
  const icons  = { success: '✓', warning: '⚠️', info: 'ℹ', error: '✕' };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:999;
    background:#fff; border:1.5px solid ${colors[type] || colors.info};
    border-left:4px solid ${colors[type] || colors.info};
    border-radius:12px; padding:14px 18px;
    display:flex; align-items:center; gap:10px;
    box-shadow:0 8px 32px rgba(0,0,0,.12);
    font-size:14px; font-weight:500; color:var(--text-primary);
    animation:fadeInUp .3s ease; max-width:340px;
  `;

  const iconSpan = document.createElement('span');
  iconSpan.style.color = colors[type] || colors.info;
  iconSpan.style.fontSize = '16px';
  iconSpan.textContent = icons[type] || 'ℹ';

  const textSpan = document.createElement('span');
  textSpan.textContent = String(message);

  toast.appendChild(iconSpan);
  toast.appendChild(textSpan);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
