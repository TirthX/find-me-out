import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    if (!query) throw new Error("No query provided");

    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!geminiKey) {
      console.error("Missing GEMINI_API_KEY");
      throw new Error("Server configuration error: GEMINI_API_KEY is missing");
    }
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase configuration");
      throw new Error("Server configuration error: Supabase URL or Key is missing");
    }

    // 1. Initialize Gemini (stable model and v1 API)
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "embedding-001" }, { apiVersion: "v1" });

    // 2. Generate Embedding (Vector)
    let queryEmbedding;
    try {
      console.log(`Generating embedding for query`);
      const result = await model.embedContent(query);
      queryEmbedding = result.embedding.values;

      if (!queryEmbedding || queryEmbedding.length === 0) {
        throw new Error("Gemini returned an empty embedding");
      }
      console.log("Embedding generated. Dimension:", queryEmbedding.length);
    } catch (e: any) {
      console.error("Gemini Embedding Error:", e);
      throw new Error(`Gemini Error: ${e.message}`);
    }

    // 3. Search Database
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    console.log("Calling Supabase RPC: match_tools");
    let searchResult;
    try {
      searchResult = await supabaseClient.rpc("match_tools", {
        query_embedding: queryEmbedding,
        match_threshold: 0.3,
        match_count: 5,
      });
    } catch (e: any) {
      console.error("RPC Execution Exception:", e);
      throw new Error(`RPC Exception: ${e.message}`);
    }

    const { data: tools, error: rpcError } = searchResult;

    if (rpcError) {
      console.error("Supabase RPC Error:", rpcError);
      throw new Error(`Database Search Error: ${rpcError.message}`);
    }

    console.log(`Found ${tools?.length || 0} matching tools`);

    return new Response(JSON.stringify({ tools: tools || [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Search Tools Function Detailed Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal Server Error",
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});