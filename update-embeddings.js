import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // Use SERVICE ROLE key (starts with eyJ...)
const geminiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiKey) {
  console.error('❌ Missing environment variables. Make sure VITE_SUPABASE_URL, VITE_SUPABASE_SERVICE_ROLE_KEY, and GEMINI_API_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function updateEmbeddings() {
  console.log('🔄 Fetching tools...');
  
  // 1. Get all tools
  const { data: tools, error } = await supabase.from('tools').select('*');
  
  if (error) {
    console.error('Error fetching tools:', error);
    return;
  }

  console.log(`Found ${tools.length} tools. Generating embeddings...`);

  let successCount = 0;

  for (const tool of tools) {
    try {
      // 2. Create the text to embed (Name + Description + Tags)
      const textToEmbed = `${tool.name}: ${tool.description}. Tags: ${tool.tags ? tool.tags.join(', ') : ''}`;

      // 3. Generate Vector using Gemini
      const result = await model.embedContent(textToEmbed);
      const embedding = result.embedding.values;

      // 4. Update the row in Supabase
      const { error: updateError } = await supabase
        .from('tools')
        .update({ embedding: embedding })
        .eq('id', tool.id);

      if (updateError) {
        console.error(`❌ Failed to update ${tool.name}:`, updateError.message);
      } else {
        console.log(`✅ Updated: ${tool.name}`);
        successCount++;
      }

      // Add a tiny delay to avoid hitting Gemini rate limits
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (err) {
      console.error(`❌ Error processing ${tool.name}:`, err.message);
    }
  }

  console.log(`\n🎉 Finished! Successfully updated ${successCount} of ${tools.length} tools.`);
}

updateEmbeddings();