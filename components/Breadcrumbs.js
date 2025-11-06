
export default function Breadcrumbs({ category, subcategory }) {
  return (
    <nav className="text-sm mb-4 text-blue-600">
      <a href="/" className="hover:underline">Home</a>
      {category && (
        <>
          {' › '}
          <a href={`/category/${category.slug}`} className="hover:underline">
            {category.category_name}
          </a>
        </>
      )}
      {subcategory && (
        <>
          {' › '}
          <span className="text-gray-500">{subcategory.subcategory_name}</span>
        </>
      )}
    </nav>
  );
}
