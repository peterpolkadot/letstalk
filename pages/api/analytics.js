
/**
 * ⚡ Live Analytics API (no materialized view)
 * Always up-to-date — directly queries chat_messages for the past 24h.
 */
import { getSupabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  try {
    const supabase = getSupabase();
    const { botAlias } = req.query;

    // 24-hour window ISO timestamp
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    if (botAlias) {
      // 🔍 Return stats for a specific bot
      const { data, error } = await supabase
        .from('chat_messages')
        .select('bot_alias, user_id, created_at')
        .eq('bot_alias', botAlias)
        .gte('created_at', since);

      if (error) throw error;

      const messages_24h = data.length;
      const users_24h = new Set(data.map(m => m.user_id)).size;

      return res.status(200).json({
        stats: { bot_alias: botAlias, messages_24h, users_24h }
      });
    }

    // 🔥 Trending bots — grouped counts
    const { data, error } = await supabase
      .from('chat_messages')
      .select('bot_alias, user_id, created_at')
      .gte('created_at', since);

    if (error) throw error;

    // Aggregate manually (client-side)
    const aggregates = {};
    data.forEach(row => {
      const alias = row.bot_alias;
      if (!aggregates[alias]) {
        aggregates[alias] = { bot_alias: alias, messages_24h: 0, users: new Set() };
      }
      aggregates[alias].messages_24h++;
      aggregates[alias].users.add(row.user_id);
    });

    // Format + sort
    const trending = Object.values(aggregates)
      .map(r => ({
        bot_alias: r.bot_alias,
        messages_24h: r.messages_24h,
        users_24h: r.users.size
      }))
      .sort((a, b) => b.messages_24h - a.messages_24h)
      .slice(0, 10);

    return res.status(200).json({ trending });
  } catch (err) {
    console.error('Analytics API error:', err);
    return res.status(500).json({ error: 'Failed to load analytics.' });
  }
}
