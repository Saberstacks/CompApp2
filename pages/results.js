import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MessageBox from '../components/MessageBox';
import ResultRow from '../components/ResultRow';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Results() {
  const router = useRouter();
  const { keyword } = router.query;

  const [mapPackResults, setMapPackResults] = useState([]);
  const [organicResults, setOrganicResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!keyword) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`);
        const data = await res.json();

        if (res.ok) {
          setMapPackResults(data.mapPackResults || []);
          setOrganicResults(data.organicResults || []);
          setMessage(data.message || '');
        } else {
          setMessage(data.message || 'An error occurred.');
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        setMessage('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]);

  const handleAnalyze = async (url) => {
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push(`/analyze?url=${encodeURIComponent(url)}`);
      } else {
        setMessage(data.message || 'Error analyzing the competitor site.');
      }
    } catch (error) {
      console.error('Analyze Error:', error);
      setMessage('An error occurred during analysis.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <MessageBox type="info" message="Loading..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="results-container">
        {message && <MessageBox type="error" message={message} />}
        <h1>Search Results for "{keyword}"</h1>
        {mapPackResults.length > 0 && (
          <>
            <h2>Map Pack Results</h2>
            {mapPackResults.map((result, index) => (
              <ResultRow
                key={index}
                data={result}
                type="map"
                onAnalyze={() => handleAnalyze(result.url)}
              />
            ))}
          </>
        )}
        {organicResults.length > 0 && (
          <>
            <h2>Organic Results</h2>
            {organicResults.map((result, index) => (
              <ResultRow
                key={index}
                data={result}
                type="organic"
                onAnalyze={() => handleAnalyze(result.url)}
              />
            ))}
          </>
        )}
        <style jsx>{`
          .results-container {
            padding: 20px;
          }
          .loading-container {
            padding: 20px;
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
}
