import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';

export default function BotPage() {
  const { slug } = useRouter().query;
  const [bot, setBot] = useState(null);

  useEffect(() => {
    if (!slug) return;
    async function fetchBot() {
      const { data } = await supabase.from('bots').select('*').eq('slug', slug).single();
      setBot(data);
    }
    fetchBot();
  }, [slug]);

  if (!bot) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <h1 className='text-3xl font-bold mb-4'>{bot.bot_name}</h1>
      <p className='text-gray-700 mb-6'>{bot.description}</p>
      <div className='bg-gray-100 p-4 rounded-lg'>
        <strong>Prompt:</strong>
        <pre className='text-sm text-gray-800 mt-2 whitespace-pre-wrap'>{bot.prompt}</pre>
      </div>
    </Layout>
  );
}