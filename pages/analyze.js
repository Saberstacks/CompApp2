import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Analyze() {
  const router = useRouter();
  const { website } = router.query;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!website) return;

    const fetchAnalysis = async () => {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `website=${encodeURIComponent(website)}`,
        });
        const result = await res.json();
        if (res.ok) {
          setData(result);
        } else {
          setError(result.error || 'An error occurred.');
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('An error occurred while fetching analysis data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [website]);

  if (loading) return <p>Loading analysis...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>On-Page Analysis for {website}</h1>
      <div>
        <h2>Metadata</h2>
        <ul>
          <li><strong>Title:</strong> {data.pageTitle || 'N/A'}</li>
          <li><strong>Meta Description:</strong> {data.metaDescription || 'N/A'}</li>
          <li><strong>Canonical URL:</strong> {data.canonicalUrl || 'N/A'}</li>
        </ul>

        <h2>SEO Essentials</h2>
        <ul>
          <li><strong>SSL:</strong> {data.sslStatus}</li>
          <li><strong>Robots.txt:</strong> {data.robotsTxtStatus}</li>
          <li><strong>Indexable:</strong> {data.isIndexable}</li>
          <li><strong>Sitemap:</strong> {data.sitemapStatus}</li>
        </ul>

        <h2>Content Analysis</h2>
        <ul>
          <li><strong>Headings:</strong></li>
          {data.headings.map((heading, index) => (
            <li key={index}>
              {heading.tag}: {heading.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
