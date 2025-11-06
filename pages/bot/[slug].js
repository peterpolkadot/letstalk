
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSupabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';
import HeadMeta from '../../components/HeadMeta';
import ChatInterface from '../../components/ChatInterface';

export default function BotPage() {
  const { slug } = useRouter().query;
  const [bot, setBot] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const supabase = getSupabase();

    async function fetchBot() {
      const { data: botData } = await supabase.from('bots').select('*').eq('alias', slug).single();
      setBot(botData);
    }

    fetchBot();
  }, [slug]);

  if (!bot) return <Layout>Loading...</Layout>;

  const seoTitle = `${bot.emoji} ${bot.name} — AI Chatbot | Chatbot City`;
  const seoDesc = bot.tagline || bot.description || 'Meet this unique AI chatbot personality.';
  const ogImage = bot.image_url || '/default-og.png';

  return (
    <Layout>
      <HeadMeta title={seoTitle} description={seoDesc} image={ogImage} url={`https://chatbotcity.ai/bot/${bot.alias}`} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-3">{bot.emoji} {bot.name}</h1>
        <p className="text-xl text-gray-600 italic mb-6">{bot.tagline}</p>
        <ChatInterface botAlias={bot.alias} botName={bot.name} botEmoji={bot.emoji} />
        <div className="bg-gray-100 p-6 rounded-lg mt-6">
          <p>{bot.description}</p>
        </div>
      </div>
    </Layout>
  );
}
