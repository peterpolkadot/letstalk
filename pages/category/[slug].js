
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSupabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';

export default function CategoryPage() {
  const { slug } = useRouter().query;
  const [category, setCategory] = useState(null);
  const [bots, setBots] = useState([]);
  const [activity, setActivity] = useState({});

  useEffect(() => {
    if (!slug) return;
    const supabase = getSupabase();

    async function fetchCategoryAndBots() {
      // 📦 Load category + bots
      const { data: cat } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      setCategory(cat);

      if (!cat) return;
      const { data: botsData } = await supabase
        .from('bots')
        .select('*')
        .eq('category_id', cat.id);
      setBots(botsData || []);

      // 💬 Fetch trending analytics once for all bots
      try {
        const res = await fetch('/api/analytics');
        const json = await res.json();
        const map = {};
        (json.trending || []).forEach((b) => {
          map[b.bot_alias] = b;
        });
        setActivity(map);
      } catch (err) {
        console.error('Analytics fetch failed:', err);
      }
    }

    fetchCategoryAndBots();
  }, [slug]);

  if (!category) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-2">
        {category.emoji} {category.category_name}
      </h1>
      <p className="text-gray-500 mb-6">{category.description}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bots.map((bot) => {
          const act = activity[bot.alias];
          return (
            <a
              key={bot.id}
              href={'/bot/' + bot.alias}
              className="relative p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
            >
              {/* 🔥 Live badge */}
              {act && (
                <div className="absolute top-2 right-2 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                  🔥 {act.messages_24h} chats
                </div>
              )}

              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{bot.emoji}</span>
                <div>
                  <h2 className="font-semibold text-lg">{bot.name}</h2>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {bot.tagline}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-600 line-clamp-2">
                {bot.description}
              </p>
            </a>
          );
        })}
      </div>
    </Layout>
  );
}
