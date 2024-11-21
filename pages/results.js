import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MessageBox from '../components/MessageBox';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Results() {
  const router = useRouter();
  const { url, keyword } = router.query;

  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url || !keyword) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ website: url, keyword }),
        });
        const result = await res.json();
        if (res.ok) {
          setData(result);
        } else {
          setMessage(result.error || 'An error occurred.');
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setMessage('An error occurred while fetching analysis.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, keyword]);

  if (loading) {
    return <MessageBox type="info" message="Loading analysis results..." />;
  }

  if (message) {
    return <MessageBox type="error" message={message} />;
  }

  return (
    <ErrorBoundary>
      <div className="results-container">
        <h1>On-Page Analysis Results for {url}</h1>
        <h2>SEO Essentials Overview</h2>
        <div>
          <strong>SSL Certificate:</strong> {data.sslStatus}
        </div>
        <div>
          <strong>robots.txt:</strong> {data.robotsTxtStatus}
        </div>
        <div>
          <strong>Indexable:</strong> {data.isIndexable ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Sitemap:</strong> {data.sitemapStatus}
        </div>

        <h2>Keyword Relevance and Optimization</h2>
        <div>
          <strong>Page Title:</strong> {data.pageTitle}
        </div>
        <div>
          <strong>Meta Description:</strong> {data.metaDescription}
        </div>

        <h2>Content Structure</h2>
        {data.headings.map((heading, idx) => (
          <div key={idx}>
            <strong>{heading.tag}:</strong> {heading.text}
          </div>
        ))}
      </div>
    </ErrorBoundary>
  );
}
