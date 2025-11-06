
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSupabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';
import HeadMeta from '../../components/HeadMeta';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function CategoryPage() {
  const { slug } = useRouter().query;
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (!slug) return;
    const supabase = getSupabase();
    async function fetchCategory() {
      const { data: cat } = await supabase.from('categories').select('*').eq('slug', slug).single();
      if (!cat) return;
      setCategory(cat);
      const { data: subs } = await supabase.from('subcategories').select('*').eq('category_id', cat.id);
      setSubcategories(subs || []);
    }
    fetchCategory();
  }, [slug]);

  if (!category) return <Layout><div className="p-10 skeleton h-6 w-1/2"></div></Layout>;

  return (
    <Layout>
      <HeadMeta title={category.category_name} description={category.description} />
      <Breadcrumbs category={category} />
      <h1 className="text-3xl font-bold mb-2">{category.emoji} {category.category_name}</h1>
      <p className="text-gray-500 mb-6">{category.description}</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {subcategories.map((sub) => (
          <a key={sub.id} href={'/subcategory/' + sub.slug} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition">
            {sub.emoji} {sub.subcategory_name}
          </a>
        ))}
      </div>
    </Layout>
  );
}
