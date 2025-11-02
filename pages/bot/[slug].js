import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSupabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';
import ChatInterface from '../../components/ChatInterface';

export default function BotPage() {
  const { slug } = useRouter().query;
  const [bot, setBot] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const supabase = getSupabase();
    async function fetchBot() {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('alias', slug)
        .single();
      if (!error) setBot(data);
    }
    fetchBot();
  }, [slug]);

  if (!bot) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center gap-3 mb-4'>
          <span className='text-5xl'>{bot.emoji}</span>
          <h1 className='text-4xl font-bold'>{bot.name}</h1>
        </div>
        
        <p className='text-xl text-gray-600 italic mb-6'>{bot.tagline}</p>
        
        {/* CHAT INTERFACE - NEW! */}
        <div className='mb-8'>
          <ChatInterface botAlias={bot.alias} botName={bot.name} botEmoji={bot.emoji} />
        </div>
        
        <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-6'>
          <p className='text-gray-800'>{bot.description}</p>
        </div>
        
        <div className='grid md:grid-cols-2 gap-4 mb-6'>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-semibold text-sm text-gray-600 mb-2'>Persona</h3>
            <p className='text-gray-800'>{bot.persona}</p>
          </div>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-semibold text-sm text-gray-600 mb-2'>Voice Tone</h3>
            <p className='text-gray-800'>{bot.voice_tone}</p>
          </div>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-semibold text-sm text-gray-600 mb-2'>Audience</h3>
            <p className='text-gray-800'>{bot.audience}</p>
          </div>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-semibold text-sm text-gray-600 mb-2'>Content Focus</h3>
            <p className='text-gray-800'>{bot.content_focus}</p>
          </div>
        </div>
        
        <div className='bg-gray-100 p-6 rounded-lg mb-6'>
          <h2 className='text-xl font-semibold mb-3'>System Instructions</h2>
          <pre className='text-sm text-gray-800 whitespace-pre-wrap font-sans'>{bot.system_instructions}</pre>
        </div>
        
        <div className='bg-green-50 border-l-4 border-green-500 p-4 mb-6'>
          <h2 className='text-lg font-semibold mb-2'>Example Prompt</h2>
          <p className='text-gray-800 italic'>&quot;{bot.example_prompt}&quot;</p>
        </div>
        
        <div className='bg-purple-50 p-4 rounded-lg'>
          <h2 className='text-lg font-semibold mb-2'>What Makes This Bot Unique</h2>
          <p className='text-gray-800'>{bot.differentiator}</p>
        </div>
      </div>
    </Layout>
  );
}