
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSupabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';

export default function SubcategoryPage() {
  const { slug } = useRouter().query;
  const [subcategory, setSubcategory] = useState(null);
  const [bots, setBots] = useState([]);

  useEffect(() => {
    if (!slug) return;
    const supabase = getSupabase();

    async function fetchSubcatAndBots() {
      // 1️⃣ Load subcategory
      const { data: subcat } = await supabase
        .from('subcategories')
        .select('*')
        .eq('slug', slug)
        .single();
      setSubcategory(subcat);
      if (!subcat) return;

      // 2️⃣ Load bots belonging to this subcategory
      const { data: botsData } = await supabase
        .from('bots')
        .select('*')
        .eq('subcategory_id', subcat.id);
      setBots(botsData || []);
    }

    fetchSubcatAndBots();
  }, [slug]);

  if (!subcategory) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {subcategory.emoji || '💫'} {subcategory.subcategory_name}
        </h1>
        <p className="text-gray-500 mb-4">{subcategory.description}</p>
        <a
          href={'/category/' + subcategory.category_id}
          className="text-blue-600 text-sm hover:underline"
        >
          ← Back to Category
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bots.length === 0 ? (
          <p className="text-gray-500">No bots yet in this subcategory.</p>
        ) : (
          bots.map((bot) => (
            <a
              key={bot.id}
              href={'/bot/' + bot.alias}
              className="p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
            >
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
          ))
        )}
      </div>
    </Layout>
  );
}
