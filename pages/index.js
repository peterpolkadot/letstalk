import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Layout from '../components/Layout';

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error) setCategories(data);
    }
    fetchCategories();
  }, []);

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