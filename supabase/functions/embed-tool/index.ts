import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { pipeline, env } from "https://esm.sh/@xenova/transformers@2.16.0";

// Configuration for local transformers in Deno
env.allowRemoteModels = true;
env.useBrowserCache = false;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize model once
let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractor;
}

/**
 * Edge Function: embed-tool
 * 
 * This function generates a vector embedding for a tool using local transformers
 * and updates its record in the database.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { id, name, description, tags } = await req.json();
    if (!id || !name) {
      throw new Error("Missing required fields (id, name)");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    // 1. Construct text for embedding
    const content = `${name}: ${description || ''}. Tags: ${tags?.join(', ') || ''}`;
    console.log(`[Embed] Generating for Tool ID: ${id}`);

    // 2. Generate Embedding LOCALLY
    const pipe = await getExtractor();
    const output = await pipe(content, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data);

    // 3. Update Database
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { error: updateError } = await supabase
      .from("tools")
      .update({ embedding })
      .eq("id", id);

    if (updateError) {
      throw new Error(`Database update failed: ${updateError.message}`);
    }

    console.log(`[Success] Updated tool embedding for ID: ${id}. Dimension: ${embedding.length}`);

    return new Response(
      JSON.stringify({ success: true, message: "Embedding updated successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error(`[Embed Error]`, error.message);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});