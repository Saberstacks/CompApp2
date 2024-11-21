import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ResultRow from '../components/ResultRow';
import MessageBox from '../components/MessageBox';
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
            {mapPackResults.map((result, index) =>
              result ? <ResultRow key={index} data={result} type="map" /> : null
            )}
          </>
        )}
        {organicResults.length > 0 && (
          <>
            <h2>Organic Results</h2>
            {organicResults.map((result, index) =>
              result ? <ResultRow key={index} data={result} type="organic" /> : null
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
