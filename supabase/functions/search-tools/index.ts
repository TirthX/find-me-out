import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Edge Function: search-tools
 * 
 * This function performs a vector similarity search in the Supabase database
 * using an embedding provided in the request body.
 */
serve(async (req) => {
  // Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Validate Request Body
    const { embedding } = await req.json();
    
    if (!embedding || !Array.isArray(embedding)) {
      console.error("[Search] Missing or invalid embedding in request");
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'embedding' in request body. Expected an array of numbers." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (embedding.length !== 384) {
      console.warn(`[Search] Embedding length mismatch. Expected 384, got ${embedding.length}`);
      // We still proceed but this might cause a database error if not handled
    }

    // 2. Check Environment Variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Server configuration error: Supabase URL or Key is missing");
    }

    // 3. Search Database using RPC
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`[Database] Executing match_tools search with vector dimension: ${embedding.length}`);
    const { data: tools, error: rpcError } = await supabase.rpc("match_tools", {
      query_embedding: embedding,
      match_threshold: 0.2, // Configurable threshold
      match_count: 5,       // Top 5 results
    });

    if (rpcError) {
      console.error(`[Database Error] RPC Failed:`, rpcError);
      return new Response(
        JSON.stringify({ error: `Database search failed: ${rpcError.message}` }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`[Success] Found ${tools?.length || 0} matching tools`);

    // 4. Return Results
    return new Response(
      JSON.stringify({ tools: tools || [] }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error(`[Fatal Error]`, error.message);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});