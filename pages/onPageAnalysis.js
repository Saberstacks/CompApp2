import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import MessageBox from '../components/MessageBox';

export default function OnPageAnalysis() {
  const router = useRouter();
  const { website } = router.query;

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!website) return;

    const fetchAnalysis = async () => {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ website }),
        });

        const data = await res.json();
        if (res.ok) {
          setAnalysis(data);
        } else {
          setMessage(data.error || 'An error occurred while analyzing the website.');
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Failed to analyze the website.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [website]);

  if (loading) {
    return <MessageBox type="info" message="Analyzing website..." />;
  }

  if (message) {
    return <MessageBox type="error" message={message} />;
  }

  return (
    <div className="analysis-container">
      <h1>On-Page Analysis Results</h1>
      <pre>{JSON.stringify(analysis, null, 2)}</pre>
    </div>
  );
}
