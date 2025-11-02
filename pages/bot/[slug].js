import { createClient } from '@supabase/supabase-js';

export async function getServerSideProps({ params }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: bot, error } = await supabase
    .from('bots')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !bot) {
    return { notFound: true };
  }

  const { data: category } = await supabase
    .from('categories')
    .select('id, slug, emoji, category_name')
    .eq('id', bot.category_id)
    .single();

  return {
    props: { bot, category: category || null },
  };
}

export default function BotPage({ bot, category }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-3xl mx-auto py-12 px-6">
        {category && (
          <p className="mb-4 text-sm text-blue-600">
            <a href={`/category/${category.slug}`} className="hover:underline">
              ← Back to {category.emoji} {category.category_name}
            </a>
          </p>
        )}
        <h1 className="text-4xl font-bold mb-4">{bot.bot_name}</h1>
        <p className="text-gray-700 mb-6">{bot.description}</p>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold mb-2 text-gray-800">Prompt</h2>
          <pre className="text-sm bg-gray-100 rounded p-3 whitespace-pre-wrap">
            {bot.prompt}
          </pre>
        </div>
      </div>
    </div>
  );
}