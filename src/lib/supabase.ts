import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eqxfgnljylfcovgunbgh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxeGZnbmxqeWxmY292Z3VuYmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NzIwNDMsImV4cCI6MjA3OTQ0ODA0M30.AbehYUb53Lt0OJta5irPcR3f42Qat8bLXoTTQu6rUnE';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
