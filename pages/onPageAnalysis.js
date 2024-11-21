import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function OnPageAnalysis() {
  const router = useRouter();
  const { website } = router.query;
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!website) {
      setError('No website URL provided.');
      setLoading(false);
      return;
    }

    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `website=${encodeURIComponent(website)}`,
        });

        const data = await response.json();
        if (response.ok) {
          setAnalysisData(data);
        } else {
          setError(data.error || 'Failed to analyze the website.');
        }
      } catch (err) {
        setError('An error occurred while fetching analysis data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [website]);

  if (loading) return <p>Loading analysis data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Analysis for {website}</h1>
      <pre>{JSON.stringify(analysisData, null, 2)}</pre>
    </div>
  );
}
