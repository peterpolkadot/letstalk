import { createClient } from '@supabase/supabase-js';
import Layout from '../components/Layout';

export async function getServerSideProps() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('id', { ascending: true });

  return { props: { categories: categories || [] } };
}

export default function Home({ categories }) {
  return (
    <Layout>
      <h1 className="text-4xl font-bold text-center mb-8">Chatbot City 🏙️</h1>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {categories.map(cat => (
          <a key={cat.id} href={'/category/' + cat.slug}
             className="p-6 border rounded-xl hover:bg-gray-50 cursor-pointer text-center">
            <div className="text-3xl">{cat.emoji}</div>
            <div className="font-semibold">{cat.category_name}</div>
          </a>
        ))}
      </div>
    </Layout>
  );
}