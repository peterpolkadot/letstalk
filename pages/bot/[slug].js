
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSupabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';
import ChatInterface from '../../components/ChatInterface';
import HeadMeta from '../../components/HeadMeta';

export default function BotPage() {
  const { slug } = useRouter().query;
  const [bot, setBot] = useState(null);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const supabase = getSupabase();

    async function fetchBotAndActivity() {
      const { data: botData } = await supabase.from('bots').select('*').eq('alias', slug).single();
      if (botData) setBot(botData);

      try {
        const res = await fetch('/api/analytics?botAlias=' + slug);
        const json = await res.json();
        setActivity(json.stats || null);
      } catch (err) {
        console.error('Activity fetch failed:', err);
      }
    }

    fetchBotAndActivity();
  }, [slug]);

  if (!bot) return <Layout>Loading...</Layout>;

  const seoTitle = `${bot.emoji} ${bot.name} — AI Chatbot Companion | Chatbot City`;
  const seoDesc = bot.tagline || bot.description || 'Meet this unique AI chatbot with personality and charm.';
  const ogImage = bot.image_url || '/default-og.png';

  return (
    <Layout>
      <HeadMeta title={seoTitle} description={seoDesc} image={ogImage} url={`https://chatbotcity.ai/bot/${bot.alias}`} />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl">{bot.emoji}</span>
          <h1 className="text-4xl font-bold">{bot.name}</h1>
        </div>
        <p className="text-xl text-gray-600 italic mb-4">{bot.tagline}</p>

        {activity && (
          <div className="flex items-center gap-4 mb-6 text-sm">
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">💬 {activity.messages_24h} chats</div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">👥 {activity.users_24h} users</div>
          </div>
        )}

        <ChatInterface botAlias={bot.alias} botName={bot.name} botEmoji={bot.emoji} />

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-gray-800">{bot.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg"><h3 className="font-semibold text-sm text-gray-600 mb-2">Persona</h3><p>{bot.persona}</p></div>
          <div className="bg-gray-50 p-4 rounded-lg"><h3 className="font-semibold text-sm text-gray-600 mb-2">Voice Tone</h3><p>{bot.voice_tone}</p></div>
          <div className="bg-gray-50 p-4 rounded-lg"><h3 className="font-semibold text-sm text-gray-600 mb-2">Audience</h3><p>{bot.audience}</p></div>
          <div className="bg-gray-50 p-4 rounded-lg"><h3 className="font-semibold text-sm text-gray-600 mb-2">Focus</h3><p>{bot.content_focus}</p></div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">System Instructions</h2>
          <pre className="text-sm whitespace-pre-wrap font-sans">{bot.system_instructions}</pre>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Example Prompt</h2>
          <p className="italic">"{bot.example_prompt}"</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">What Makes This Bot Unique</h2>
          <p>{bot.differentiator}</p>
        </div>
      </div>
    </Layout>
  );
}
