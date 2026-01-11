
import { createClient } from '@supabase/supabase-js';

// No Vite, a forma oficial de acessar variáveis é import.meta.env
// No Vercel, o bundler injeta essas variáveis durante o build.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Validação técnica rigorosa
const hasUrl = supabaseUrl.length > 5 && supabaseUrl.startsWith('http');
const hasKey = supabaseAnonKey.length > 10;
const isCorrectJwt = supabaseAnonKey.startsWith('eyJ');

export const supabase = (hasUrl && hasKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const connectionMeta = {
  hasUrl,
  hasKey,
  isCorrectJwt,
  isClerk: supabaseAnonKey.startsWith('sb_'),
  // Retorna os primeiros caracteres para conferência (seguro para o log)
  urlPrefix: supabaseUrl.substring(0, 15),
  keyPrefix: supabaseAnonKey.substring(0, 10)
};
