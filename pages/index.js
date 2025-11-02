
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
      // 🗂️ Load categories and bots
      const { data: catsData } = await supabase.from('categories').select('*');
      const { data: botsData } = await supabase.from('bots').select('*');

      setCategories(catsData || []);
      setBots(botsData || []);

      // 🔥 Fetch trending analytics from API
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

  const getBotCount = (categoryId) =>
    bots.filter((bot) => bot.category_id === categoryId).length;

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

  // Helper: find bot details by alias
  const getBot = (alias) => bots.find((b) => b.alias === alias);

  return (
    <Layout>
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

      {/* 🔥 Trending Bots */}
      {trending.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            🔥 Trending Bots (Past 24h)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((t) => {
              const bot = getBot(t.bot_alias);
              if (!bot) return null;
              return (
                <a
                  key={bot.id}
                  href={'/bot/' + bot.alias}
                  className="p-5 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{bot.emoji}</span>
                    <div>
                      <h3 className="font-bold text-lg">{bot.name}</h3>
                      <p className="text-sm text-gray-500">
                        {bot.tagline || ''}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-4 text-sm text-gray-600">
                    <div>💬 {t.messages_24h} chats</div>
                    <div>👥 {t.users_24h} users</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* 🗂️ Category Grid */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Explore Categories</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => {
          const botCount = getBotCount(cat.id);
          return (
            <a
              key={cat.id}
              href={'/category/' + cat.slug}
              className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer text-center"
            >
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

      {/* Footer note */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>
          Discover AI chatbots across {categories.length} specialized categories
        </p>
      </div>
    </Layout>
  );
}
