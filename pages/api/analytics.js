
/**
 * 📊 Analytics API
 * Returns trending bots or individual bot stats from Supabase.
 * Used for home page “🔥 Trending Bots” and per-bot badges.
 */
import { getSupabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  try {
    const supabase = getSupabase();
    const { botAlias } = req.query;

    // If a bot alias is given → return that bot’s stats
    if (botAlias) {
      const { data, error } = await supabase
        .from('bot_trends')
        .select('*')
        .eq('bot_alias', botAlias)
        .maybeSingle();
      if (error) throw error;
      return res.status(200).json({ stats: data });
    }

    // Otherwise → return top 10 trending bots
    const { data, error } = await supabase
      .from('bot_trends')
      .select('*')
      .order('messages_24h', { ascending: false })
      .limit(10);
    if (error) throw error;

    return res.status(200).json({ trending: data });
  } catch (err) {
    console.error('Analytics API error:', err);
    return res.status(500).json({ error: 'Failed to load analytics.' });
  }
}
