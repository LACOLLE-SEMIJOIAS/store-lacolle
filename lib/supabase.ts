
import { createClient } from '@supabase/supabase-js';

// Use process.env as defined in vite.config.ts to avoid ImportMeta errors in environments where it's not supported
const url = (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL : '') || '';
const key = (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY : '') || '';

// Verify that we have valid strings and not 'undefined' as a string (common when using define in Vite with missing env vars)
export const supabase = (url && key && url !== 'undefined' && key !== 'undefined') 
  ? createClient(url, key)
  : null;

if (!supabase) {
  console.warn("Supabase: Conexão pendente. Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas.");
}
