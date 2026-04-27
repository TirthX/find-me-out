import { pipeline } from "@xenova/transformers";

async function run() {
  try {
    console.log("Loading local model...");
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const output = await extractor("Hello", { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data);
    
    console.log("Local embedding SUCCESS");
    console.log("Vector dimension:", embedding.length);
  } catch (e) {
    console.error("Local Error:", e.message);
  }
}
run();


