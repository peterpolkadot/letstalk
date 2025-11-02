
import OpenAI from 'openai';
import { getSupabase } from '../../lib/supabaseClient';

// Helper: log analytics data to Supabase
async function logAnalytics(bot_alias, user_id) {
  try {
    const supabase = getSupabase();
    const now = new Date().toISOString();

    // 1️⃣ Log message
    await supabase.from('chat_messages').insert([{ bot_alias, user_id, created_at: now }]);

    // 2️⃣ Update or insert session
    const { data: session } = await supabase
      .from('bot_sessions')
      .select('id, message_count')
      .eq('bot_alias', bot_alias)
      .eq('user_id', user_id)
      .maybeSingle();

    if (session) {
      await supabase
        .from('bot_sessions')
        .update({
          message_count: session.message_count + 1,
          last_message_at: now
        })
        .eq('id', session.id);
    } else {
      await supabase
        .from('bot_sessions')
        .insert([{ bot_alias, user_id, started_at: now, last_message_at: now, message_count: 1 }]);
    }

    // 3️⃣ Update totals
    await supabase.rpc('increment_bot_meta', {
      bot_alias_param: bot_alias,
      user_id_param: user_id
    });
  } catch (err) {
    console.error('⚠️ Analytics logging failed:', err.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, botAlias, userId } = req.body;
  if (!message || !botAlias) {
    return res.status(400).json({ error: 'Missing message or botAlias' });
  }

  try {
    const supabase = getSupabase();

    // Fetch bot details
    const { data: bot, error: botError } = await supabase
      .from('bots')
      .select('*')
      .eq('alias', botAlias)
      .single();

    if (botError || !bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Generate reply
    const completion = await openai.chat.completions.create({
      model: bot.model || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: bot.system_instructions || 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ],
      temperature: bot.temperature || 0.7,
      max_tokens: 500
    });

    const reply = completion.choices?.[0]?.message?.content || 'No reply.';

    // 🔥 Log analytics
    await logAnalytics(botAlias, userId || 'anon');

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Failed to get response from bot' });
  }
}
