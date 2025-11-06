
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSupabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';
import HeadMeta from '../../components/HeadMeta';

export default function CategoryPage() {
  const { slug } = useRouter().query;
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [bots, setBots] = useState([]);

  useEffect(() => {
    if (!slug) return;
    const supabase = getSupabase();

    async function fetchData() {
      const { data: cat } = await supabase.from('categories').select('*').eq('slug', slug).single();
      if (cat) setCategory(cat);

      const { data: subs } = await supabase.from('subcategories').select('*').eq('category_id', cat.id);
      setSubcategories(subs || []);

      const { data: botsData } = await supabase.from('bots').select('*').eq('category_id', cat.id);
      setBots(botsData || []);
    }

    fetchData();
  }, [slug]);

  if (!category) return <Layout>Loading...</Layout>;

  const seoTitle = `${category.emoji} ${category.category_name} — Chatbot City`;
  const seoDesc = category.description || 'Explore engaging AI chatbots in this category.';

  return (
    <Layout>
      <HeadMeta title={seoTitle} description={seoDesc} />
      <h1 className="text-3xl font-bold mb-2">{category.emoji} {category.category_name}</h1>
      <p className="text-gray-500 mb-6">{category.description}</p>

      {subcategories.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Subcategories</h2>
          <div className="flex flex-wrap gap-2">
            {subcategories.map(sub => (
              <a key={sub.id} href={'/subcategory/' + sub.slug}
                 className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition">
                 {sub.emoji} {sub.subcategory_name}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bots.map(bot => (
          <a key={bot.id} href={'/bot/' + bot.alias}
            className="p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{bot.emoji}</span>
              <div>
                <h2 className="font-semibold text-lg">{bot.name}</h2>
                <p className="text-sm text-gray-500 line-clamp-1">{bot.tagline}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">{bot.description}</p>
          </a>
        ))}
      </div>
    </Layout>
  );
}
