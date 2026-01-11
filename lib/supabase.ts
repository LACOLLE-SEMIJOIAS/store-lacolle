
import { createClient } from '@supabase/supabase-js';

const getEnv = (name: string): string => {
  const env = (import.meta as any).env;
  const proc = (process as any).env;
  return env?.[name] || proc?.[name] || '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

const isValid = (v: string) => v && v.length > 20 && v.startsWith('http');

export const supabase = (isValid(supabaseUrl) && isValid(supabaseAnonKey)) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
