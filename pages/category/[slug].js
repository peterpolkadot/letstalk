import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSupabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';

export default function CategoryPage() {
  const { slug } = useRouter().query;
  const [category, setCategory] = useState(null);
  const [bots, setBots] = useState([]);

  useEffect(() => {
    if (!slug) return;
    const supabase = getSupabase();
    async function fetchCategoryAndBots() {
      const { data: cat } = await supabase.from('categories').select('*').eq('slug', slug).single();
      setCategory(cat);
      if (cat) {
        const { data: botsData } = await supabase.from('bots').select('*').eq('category_id', cat.id);
        setBots(botsData || []);
      }
    }
    fetchCategoryAndBots();
  }, [slug]);

  if (!category) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <h1 className='text-3xl font-bold mb-4'>{category.emoji} {category.category_name}</h1>
      <p className='text-gray-500 mb-6'>{category.description}</p>
      <div className='grid gap-4 sm:grid-cols-2'>
        {bots.map(bot => (
          <a key={bot.id} href={'/bot/' + bot.alias} className='p-4 border rounded-lg hover:shadow-md'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-2xl'>{bot.emoji}</span>
              <h2 className='font-semibold text-lg'>{bot.name}</h2>
            </div>
            <p className='text-sm text-gray-600 mb-2'>{bot.tagline}</p>
            <p className='text-xs text-gray-500'>{bot.description}</p>
          </a>
        ))}
      </div>
    </Layout>
  );
}