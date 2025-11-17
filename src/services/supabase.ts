import { createClient } from '@supabase/supabase-js';

// Get URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables');
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
