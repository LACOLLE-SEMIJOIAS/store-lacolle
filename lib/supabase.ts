
import { createClient } from '@supabase/supabase-js';

// Agora que definimos no vite.config.ts, o process.env será substituído pelos valores reais durante o build
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const isValid = (val: any) => typeof val === 'string' && val.length > 10 && val !== 'undefined';

let client = null;

if (isValid(supabaseUrl) && isValid(supabaseAnonKey)) {
  try {
    client = createClient(supabaseUrl!, supabaseAnonKey!);
  } catch (err) {
    console.error("Erro ao inicializar Supabase:", err);
  }
}

export const supabase = client;

if (!supabase) {
  console.warn("La Colle: Supabase não inicializado. Verifique se as variáveis VITE_ estão no Vercel e faça Redeploy.");
}
