
import { createClient } from '@supabase/supabase-js';

// Tenta obter de múltiplas fontes para garantir funcionamento na Vercel e localmente
const supabaseUrl = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  (process as any).env?.VITE_SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  (process as any).env?.VITE_SUPABASE_ANON_KEY || 
  '';

// Validação técnica rigorosa
const hasUrl = supabaseUrl.length > 5 && supabaseUrl.startsWith('http');
const hasKey = supabaseAnonKey.length > 10;

export const supabase = (hasUrl && hasKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const connectionMeta = {
  hasUrl,
  hasKey,
  status: (hasUrl && hasKey) ? 'Configurado' : 'Pendente',
};
