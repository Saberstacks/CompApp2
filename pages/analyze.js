import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MessageBox from '../components/MessageBox';

export default function AnalyzePage() {
  const router = useRouter();
  const { url } = router.query;

  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    const fetchAnalysis = async () => {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ website: url, keyword: '' }),
        });
        const result = await res.json();
        if (res.ok) {
          setData(result);
        } else {
          setMessage(result.error || 'Failed to analyze the website.');
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setMessage('An error occurred while analyzing the website.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [url]);

  if (loading) {
    return <MessageBox type="info" message="Analyzing..." />;
  }

  if (message) {
    return <MessageBox type="error" message={message} />;
  }

  return (
    <div>
      <h1>On-Page Analysis for {url}</h1>
      {/* Render analysis results */}
      <div>
        <h2>SEO Essentials</h2>
        <p><strong>Page Title:</strong> {data.pageTitle}</p>
        <p><strong>Meta Description:</strong> {data.metaDescription}</p>
        {/* Additional analysis details */}
      </div>
    </div>
  );
}
