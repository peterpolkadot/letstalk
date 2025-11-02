import { createClient } from '@supabase/supabase-js';

export async function getServerSideProps({ params }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (catError || !category) {
    return { notFound: true };
  }

  const { data: bots } = await supabase
    .from('bots')
    .select('*')
    .eq('category_id', category.id)
    .order('id', { ascending: true });

  return {
    props: { category, bots: bots || [] },
  };
}

export default function CategoryPage({ category, bots }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-2">
          {category.emoji} {category.category_name}
        </h1>
        <p className="text-gray-600 mb-8">{category.description}</p>

        {bots.length > 0 ? (
          bots.map(bot => (
            <div key={bot.id} className="border border-gray-200 rounded-lg p-5 mb-4 hover:shadow-md transition">
              <a href={`/bot/${bot.slug}`} className="text-xl font-semibold text-blue-600 hover:underline">
                {bot.bot_name}
              </a>
              <p className="text-gray-700 mt-2">{bot.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No bots found in this category yet.</p>
        )}
      </div>
    </div>
  );
}