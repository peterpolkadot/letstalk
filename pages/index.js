
import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import Layout from '../components/Layout';

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

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🤖</div>
          <p className="text-gray-600">Loading Chatbot City...</p>
        </div>
      </Layout>
    );
  }

  // 🧮 Compute total messages per category
  const categoryActivity = {};
  trending.forEach((t) => {
    const bot = bots.find((b) => b.alias === t.bot_alias);
    if (bot && bot.category_id) {
      if (!categoryActivity[bot.category_id]) categoryActivity[bot.category_id] = 0;
      categoryActivity[bot.category_id] += t.messages_24h;
    }
  });

  // 🏆 Find top 3 hot categories by total messages
  const topCategories = Object.entries(categoryActivity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => Number(id));

  return (
    <Layout>
      {/* 🔥 Animated Styles */}
      <style jsx>{`
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 150, 50, 0.5); }
          50% { box-shadow: 0 0 25px rgba(255, 110, 0, 0.9); }
        }
        .hot-cat {
          border: 2px solid rgba(255, 120, 30, 0.7);
          animation: glowPulse 2.8s infinite ease-in-out;
          background: linear-gradient(160deg, #fff8f3, #fffefb);
        }
      `}</style>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3">🤖 Chatbot City 🏙️</h1>
        <div className="flex justify-center gap-8 text-lg">
          <div>
            <div className="text-3xl font-bold">{categories.length}</div>
            <div className="text-blue-100">Categories</div>
          </div>
          <div className="border-l border-white opacity-50"></div>
          <div>
            <div className="text-3xl font-bold">{bots.length}</div>
            <div className="text-blue-100">Bots</div>
          </div>
        </div>
      </div>

      {/* 🔥 Hot Categories Highlighted */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          🗂️ Explore Categories
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => {
            const isHot = topCategories.includes(cat.id);
            const botCount = bots.filter((b) => b.category_id === cat.id).length;
            const totalChats = categoryActivity[cat.id] || 0;

            return (
              
                key={cat.id}
                href={'/category/' + cat.slug}
                className={`group relative p-6 border-2 border-gray-200 rounded-xl hover:shadow-lg transition-all text-center cursor-pointer ${isHot ? 'hot-cat' : 'hover:border-blue-500'}`}
              >
                {/* 🔥 Optional label */}
                {isHot && (
                  <div className="absolute top-2 right-2 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                    🔥 {totalChats} chats
                  </div>
                )}
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </div>
                <div className="font-semibold text-lg mb-2">
                  {cat.category_name}
                </div>
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {botCount} {botCount === 1 ? 'bot' : 'bots'}
                </div>
                <p className="text-xs text-gray-500 mt-3 line-clamp-2">
                  {cat.description}
                </p>
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>
          Discover AI chatbots across {categories.length} specialized categories
        </p>
      </div>
    </Layout>
  );
}
