import { createClient } from '@supabase/supabase-js';

// Dynamically resolve env vars at runtime
export function getSupabase() {
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

  return createClient(url || '', key || '');
}

// Default export (client-side)
export const supabase = getSupabase();