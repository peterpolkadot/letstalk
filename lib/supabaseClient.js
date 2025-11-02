import { createClient } from '@supabase/supabase-js';

// Singleton instance
let supabaseInstance = null;

// Get or create the single Supabase instance
export function getSupabase() {
  // If instance already exists, return it
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Otherwise create it once
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    console.error('⚠️ Missing Supabase credentials:', {
      url,
      keyPresent: !!key,
    });
  }

  // Create and store the instance
  supabaseInstance = createClient(url || '', key || '');
  
  return supabaseInstance;
}

// Default export (client-side)
export const supabase = getSupabase();