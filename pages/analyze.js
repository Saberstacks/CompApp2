import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Analyze() {
  const router = useRouter();
  const { website } = router.query;

  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!website) return;

    const fetchMetadata = async () => {
      try {
        const res = await fetch(`/api/analyze?website=${encodeURIComponent(website)}`);
        const data = await res.json();

        if (res.ok) {
          setMetadata(data);
        } else {
          setError(data.error || 'Failed to fetch metadata.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('An error occurred while fetching the metadata.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [website]);

  if (loading) {
    return <p>Loading analysis...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h1>Analysis Results for {website}</h1>
      <h2>Page Title</h2>
      <p>{metadata.pageTitle}</p>

      <h2>Meta Description</h2>
      <p>{metadata.metaDescription}</p>

      <h2>Canonical URL</h2>
      <p>{metadata.canonicalUrl}</p>

      <h2>SSL Status</h2>
      <p>{metadata.sslStatus}</p>

      <h2>Headings</h2>
      {metadata.headings.length > 0 ? (
        <ul>
          {metadata.headings.map((heading, index) => (
            <li key={index}>
              {heading.tag}: {heading.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>No headings found.</p>
      )}
    </div>
  );
}
