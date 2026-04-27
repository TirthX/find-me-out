import { createClient } from '@supabase/supabase-js';
import { pipeline, env } from '@xenova/transformers';
import dotenv from 'dotenv';
dotenv.config();

// Configuration for local transformers
env.allowRemoteModels = true;

/**
 * Script: update-embeddings.js
 * 
 * This script iterates through all tools in your database, generates
 * new embeddings LOCALLY using 'all-MiniLM-L6-v2' (384 dimensions), 
 * and saves them back.
 */

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables. (VITE_SUPABASE_URL, VITE_SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Singleton pattern for the extractor
let extractor = null;

async function generateEmbedding(text) {
  try {
    if (!extractor) {
      console.log('🔄 Loading local model: Xenova/all-MiniLM-L6-v2...');
      extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log('✅ Model loaded.');
    }

    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (error) {
    throw new Error(`Local Embedding Error: ${error.message}`);
  }
}

async function run() {
  console.log('🚀 Starting LOCAL re-indexing process...');

  // 1. Fetch all tools
  const { data: tools, error: fetchError } = await supabase
    .from('tools')
    .select('id, name, description, tags');

  if (fetchError) {
    console.error('❌ Error fetching tools:', fetchError.message);
    return;
  }

  console.log(`📦 Found ${tools.length} tools to re-index.`);

  let success = 0;
  let failed = 0;

  for (const tool of tools) {
    try {
      const textToEmbed = `${tool.name}: ${tool.description || ''}. Tags: ${tool.tags?.join(', ') || ''}`;
      
      process.stdout.write(`[${success + failed + 1}/${tools.length}] Indexing: ${tool.name}... `);
      
      const embedding = await generateEmbedding(textToEmbed);

      const { error: updateError } = await supabase
        .from('tools')
        .update({ embedding })
        .eq('id', tool.id);

      if (updateError) throw updateError;

      success++;
      console.log('✅');
      
    } catch (err) {
      console.log('❌');
      console.error(`   Error: ${err.message}`);
      failed++;
    }
  }

  console.log('\n--- Final Result ---');
  console.log(`✅ Successfully updated: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('--------------------');
}

run();