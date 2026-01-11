
import { createClient } from '@supabase/supabase-js';

const getEnv = (name: string): string => {
  const env = (import.meta as any).env;
  const proc = (process as any).env;
  return env?.[name] || proc?.[name] || '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Chave do Supabase (Anon Key) não começa com http, por isso a validação antiga falhava.
const isValidUrl = (v: string) => v && v.length > 10 && v.startsWith('http');
const isValidKey = (v: string) => v && v.length > 20;

export const supabase = (isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey)) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
