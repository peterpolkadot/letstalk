import OpenAI from 'openai';
import { getSupabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, botAlias } = req.body;

  if (!message || !botAlias) {
    return res.status(400).json({ error: 'Missing message or botAlias' });
  }

  try {
    // Fetch bot configuration from Supabase
    const supabase = getSupabase();
    const { data: bot, error: botError } = await supabase
      .from('bots')
      .select('*')
      .eq('alias', botAlias)
      .single();

    if (botError || !bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Call OpenAI with bot's system instructions
    const completion = await openai.chat.completions.create({
      model: bot.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: bot.system_instructions || 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: bot.temperature || 0.7,
      max_tokens: 500
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Failed to get response from bot' });
  }
}