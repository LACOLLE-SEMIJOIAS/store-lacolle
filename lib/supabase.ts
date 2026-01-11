
import { createClient } from '@supabase/supabase-js';

// Tenta ler do process.env (definido no vite.config) ou do import.meta.env (padrão Vite)
const supabaseUrl = process.env.VITE_SUPABASE_URL || (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn("Supabase: Chaves de API não encontradas. O catálogo funcionará em modo offline (armazenamento local).");
}
