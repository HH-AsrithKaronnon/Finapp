import { createClient } from '@supabase/supabase-js';
import { createMockSupabaseClient } from './supabaseMock';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export the active database gateway (real or simulated)
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabaseClient();
export type SupabaseClientType = typeof supabase;
