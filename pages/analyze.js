import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AnalyzePage() {
  const router = useRouter();
  const { website } = router.query;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!website) return;

    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/analyze?website=${encodeURIComponent(website)}`);
        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else {
          setError(result.error || 'Failed to analyze the website.');
        }
      } catch (err) {
        setError('An error occurred while fetching data.');
      }
    };

    fetchAnalysis();
  }, [website]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>On-Page Analysis Results for {website}</h1>
      <h2>Page Title</h2>
      <p>{data.pageTitle}</p>
      <h2>Meta Description</h2>
      <p>{data.metaDescription}</p>
      <h2>Canonical URL</h2>
      <p>{data.canonicalUrl}</p>
      <h2>SSL Status</h2>
      <p>{data.sslStatus}</p>
      <h2>Headings</h2>
      <ul>
        {data.headings.map((heading, index) => (
          <li key={index}>
            {heading.tag}: {heading.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
