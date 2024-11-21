import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function OnPageAnalysis() {
  const router = useRouter();
  const { website } = router.query;

  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!website) return;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ website }),
        });

        const data = await response.json();
        if (response.ok) {
          setAnalysisData(data);
        } else {
          setError(data.error || 'Failed to analyze the website.');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('An error occurred while analyzing the website.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [website]);

  if (loading) {
    return <div>Loading analysis...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="analysis-container">
      <h1>On-Page Analysis for {website}</h1>
      <pre>{JSON.stringify(analysisData, null, 2)}</pre>
      <style jsx>{`
        .analysis-container {
          padding: 20px;
        }
        pre {
          background: #f4f4f4;
          padding: 10px;
          border: 1px solid #ddd;
        }
      `}</style>
    </div>
  );
}
