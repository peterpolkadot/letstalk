
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSupabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';

export default function CategoryPage() {
  const { slug } = useRouter().query;
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [bots, setBots] = useState([]);
  const [activity, setActivity] = useState({});

  useEffect(() => {
    if (!slug) return;
    const supabase = getSupabase();

    async function fetchCategoryData() {
      // 1️⃣ Load category
      const { data: cat } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!cat) return;
      setCategory(cat);

      // 2️⃣ Load subcategories for that category
      const { data: subcats } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', cat.id)
        .order('subcategory_name', { ascending: true });
      setSubcategories(subcats || []);

      // 3️⃣ Load bots in this category
      const { data: botsData } = await supabase
        .from('bots')
        .select('*')
        .eq('category_id', cat.id);
      setBots(botsData || []);

      // 4️⃣ Fetch trending analytics
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

    fetchCategoryData();
  }, [slug]);

  if (!category) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-2">
        {category.emoji} {category.category_name}
      </h1>
      <p className="text-gray-500 mb-6">{category.description}</p>

      {/* Subcategories Section */}
      {subcategories.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Subcategories</h2>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              
                key={sub.id}
                href={'/subcategory/' + sub.slug}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition"
              >
                {sub.emoji} {sub.subcategory_name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Bots Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bots.map((bot) => {
          const act = activity[bot.alias];
          const isActive = act && act.messages_24h > 0;
          return (
            
              key={bot.id}
              href={'/bot/' + bot.alias}
              className="relative p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
            >
              {isActive && (
                <div
                  className="absolute top-2 right-2 text-xs font-semibold text-orange-700 px-2 py-1 rounded-full shadow-sm animate-pulse"
                  style={{
                    border: '1px solid rgba(255,180,60,0.4)',
                    backgroundColor: '#fff8ef'
                  }}
                >
                  🔥 {act.messages_24h} chats
                </div>
              )}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{bot.emoji}</span>
                <div>
                  <h2 className="font-semibold text-lg">{bot.name}</h2>
                  <p className="text-sm text-gray-500 line-clamp-1">{bot.tagline}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{bot.description}</p>
            </a>
          );
        })}
      </div>
    </Layout>
  );
}
