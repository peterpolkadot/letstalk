
import Head from 'next/head';

export default function HeadMeta({ title, description, image, url }) {
  const metaTitle = title ? `${title} | Chatbot City 🏙️` : 'Chatbot City 🏙️ — Explore AI Companions';
  const metaDesc = description || 'Discover unique AI chatbots across multiple categories — from romance to creativity and beyond.';
  const metaImage = image || '/default-og.png';
  const metaUrl = url || 'https://chatbotcity.ai';

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": metaTitle,
    "url": metaUrl,
    "description": metaDesc
  };

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
