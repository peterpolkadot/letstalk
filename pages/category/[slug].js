import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';

export default function CategoryPage() {
  const { slug } = useRouter().query;
  const [category, setCategory] = useState(null);
  const [bots, setBots] = useState([]);

  useEffect(() => {
    if (!slug) return;
    async function fetchCategoryAndBots() {
      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      setCategory(cats);

      const { data: botsData } = await supabase
        .from('bots')
        .select('*')
        .eq('category_slug', slug);
      setBots(botsData || []);
    }
    fetchCategoryAndBots();
  }, [slug]);

  if (!category) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">{category.emoji} {category.category_name}</h1>
      <p className="text-gray-500 mb-6">{category.description}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {bots.map(bot => (
          <a key={bot.id} href={'/bot/' + bot.slug}
             className="p-4 border rounded-lg hover:shadow-md">
            <h2 className="font-semibold">{bot.bot_name}</h2>
            <p className="text-sm text-gray-600">{bot.description}</p>
          </a>
        ))}
      </div>
    </Layout>
  );
}