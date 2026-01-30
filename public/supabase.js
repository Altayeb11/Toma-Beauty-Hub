import { createClient } from '@supabase/supabase-js';

// These are available on the client because they are prefixed with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing. Check your environment variables:', {
    url: supabaseUrl,
    key: supabaseAnonKey
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
