import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log values to help debug in the browser console (safely)
if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.error('Invalid or missing Supabase URL:', supabaseUrl);
}

if (!supabaseAnonKey) {
  console.error('Supabase Anon Key is missing');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
