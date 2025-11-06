
import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import Layout from '../components/Layout';
import HeadMeta from '../components/HeadMeta';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [bots, setBots] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();

    async function fetchData() {
      const { data: catsData } = await supabase.from('categories').select('*');
      const { data: botsData } = await supabase.from('bots').select('*');
      setCategories(catsData || []);
      setBots(botsData || []);

      try {
        const res = await fetch('/api/analytics');
        const json = await res.json();
        setTrending(json.trending || []);
      } catch (err) {
        console.error('Analytics fetch failed:', err);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const seoTitle = 'Chatbot City 🏙️ — Explore AI Companions by Category';
  const seoDesc = 'Browse hundreds of AI companions built for creativity, fun, and connection. Discover trending bots and explore your favorites.';

  if (loading) {
    return (
      <Layout>
        <HeadMeta title={seoTitle} description={seoDesc} />
        <div className="text-center py-20 text-gray-600">Loading Chatbot City...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeadMeta title={seoTitle} description={seoDesc} />
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-8 text-center shadow-md">
        <h1 className="text-4xl font-bold mb-3">🤖 Chatbot City 🏙️</h1>
        <p className="text-blue-100 mb-4">Your gateway to AI companions.</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map(cat => (
          <a key={cat.id} href={'/category/' + cat.slug}
            className="group relative p-6 border-2 border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-500 transition-all text-center cursor-pointer">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.emoji}</div>
            <div className="font-semibold text-lg mb-2">{cat.category_name}</div>
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {bots.filter(b => b.category_id === cat.id).length} bots
            </div>
            <p className="text-xs text-gray-500 mt-3 line-clamp-2">{cat.description}</p>
          </a>
        ))}
      </div>
    </Layout>
  );
}
