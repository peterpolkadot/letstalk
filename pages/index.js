
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
      const { data: cats } = await supabase.from('categories').select('*');
      const { data: botsData } = await supabase.from('bots').select('*');
      setCategories(cats || []);
      setBots(botsData || []);

      try {
        const res = await fetch('/api/analytics');
        const json = await res.json();
        setTrending(json.trending || []);
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, []);

  const seoTitle = 'Chatbot City 🏙️ — Explore AI Companions';
  const seoDesc = 'Browse unique AI companions built for romance, friendship, creativity, and fun.';

  if (loading) {
    return (
      <Layout>
        <HeadMeta title={seoTitle} description={seoDesc} />
        <div className="p-10 space-y-4">
          <div className="h-6 w-1/3 skeleton"></div>
          <div className="h-4 w-1/2 skeleton"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeadMeta title={seoTitle} description={seoDesc} />
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">🤖 Chatbot City 🏙️</h1>
        <p className="text-gray-600">Your gateway to the world of AI companions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <a key={cat.id} href={'/category/' + cat.slug} className="group border-2 p-6 rounded-xl hover:border-blue-500 hover:shadow-lg transition">
            <div className="text-4xl mb-3">{cat.emoji}</div>
            <div className="font-semibold text-lg mb-2">{cat.category_name}</div>
            <p className="text-sm text-gray-500 line-clamp-2">{cat.description}</p>
          </a>
        ))}
      </div>
    </Layout>
  );
}
