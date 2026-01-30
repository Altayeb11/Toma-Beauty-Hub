import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Log values to help debug in the browser console (safely)
if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.warn('Invalid or missing Supabase URL:', supabaseUrl);
}

if (!supabaseAnonKey) {
  console.warn('Supabase Publishable Key is missing');
}

let supabaseClient: any = null;

try {
  // Create client with session persistence enabled for auth
  supabaseClient = createClient(
    supabaseUrl  ,
    supabaseAnonKey  ,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'X-Client-Info': 'toma-beauty',
        },
      },
    }
  );
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  // Create a dummy client that won't crash
  supabaseClient = {
    from: () => ({ select: () => ({ data: [], error: null }) }),
    auth: { 
      signInWithPassword: () => Promise.reject('Auth disabled'),
      getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Auth disabled') }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  };
}

export const supabase = supabaseClient;
