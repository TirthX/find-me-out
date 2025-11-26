import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_SERVICE_ROLE_KEY');
const openai = new OpenAI({ apiKey: 'YOUR_OPENAI_API_KEY' });

async function generateEmbeddings() {
  // 1. Get tools that don't have an embedding yet
  const { data: tools } = await supabase
    .from('tools')
    .select('id, name, description, tags, category') // Include category!
    .is('embedding', null);

  console.log(`Found ${tools.length} tools to process...`);

  for (const tool of tools) {
    // 2. Create a "rich" text string that represents the tool
    const textToEmbed = `${tool.name}: ${tool.description}. Category: ${tool.category}. Tags: ${tool.tags.join(', ')}`;

    // 3. Generate embedding using OpenAI
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small', // Cheap and fast model
      input: textToEmbed,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // 4. Update the tool in Supabase
    await supabase
      .from('tools')
      .update({ embedding })
      .eq('id', tool.id);

    console.log(`Updated embedding for: ${tool.name}`);
  }
}

generateEmbeddings();