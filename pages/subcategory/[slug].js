
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSupabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';
import HeadMeta from '../../components/HeadMeta';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function SubcategoryPage() {
  const { slug } = useRouter().query;
  const [subcategory, setSubcategory] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const supabase = getSupabase();
    async function fetchSubcat() {
      const { data: sub } = await supabase.from('subcategories').select('*').eq('slug', slug).single();
      setSubcategory(sub);
      if (sub) {
        const { data: cat } = await supabase.from('categories').select('*').eq('id', sub.category_id).single();
        setCategory(cat);
      }
    }
    fetchSubcat();
  }, [slug]);

  if (!subcategory) return <Layout><div className="p-10 skeleton h-6 w-1/2"></div></Layout>;

  return (
    <Layout>
      <HeadMeta title={subcategory.subcategory_name} description={subcategory.description} />
      <Breadcrumbs category={category} subcategory={subcategory} />
      <h1 className="text-3xl font-bold mb-2">{subcategory.emoji} {subcategory.subcategory_name}</h1>
      <p className="text-gray-500 mb-4">{subcategory.description}</p>
    </Layout>
  );
}
