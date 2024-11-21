import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MessageBox from '../components/MessageBox';

export default function Analyze() {
  const router = useRouter();
  const { website, keyword } = router.query;

  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!website || !keyword) return;

    const fetchAnalysis = async () => {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `website=${encodeURIComponent(website)}&keyword=${encodeURIComponent(keyword)}`,
        });
        const analysisData = await res.json();

        if (res.ok) {
          setData(analysisData);
        } else {
          setMessage(analysisData.error || 'An error occurred while analyzing the page.');
        }
      } catch (error) {
        console.error('Analysis Fetch Error:', error);
        setMessage('An error occurred while fetching analysis data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [website, keyword]);

  if (loading) {
    return (
      <div className="loading-container">
        <MessageBox type="info" message="Analyzing..." />
      </div>
    );
  }

  if (message) {
    return (
      <div className="error-container">
        <MessageBox type="error" message={message} />
      </div>
    );
  }

  return (
    <div className="analysis-container">
      <h1>Analysis Results for {website}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <style jsx>{`
        .analysis-container {
          padding: 20px;
        }
        .loading-container {
          padding: 20px;
        }
        .error-container {
          padding: 20px;
        }
      `}</style
