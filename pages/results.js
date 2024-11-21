import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MessageBox from '../components/MessageBox';
import ResultRow from '../components/ResultRow';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Results() {
  const router = useRouter();
  const { query } = router.query;

  const [mapPackResults, setMapPackResults] = useState([]);
  const [organicResults, setOrganicResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/search?keyword=${encodeURIComponent(query)}`);
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
  }, [query]);

  if (loading) {
    return <MessageBox type="info" message="Loading..." />;
  }

  if (message) {
    return <MessageBox type="error" message={message} />;
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Search Results for "{query}"</h1>

        {/* Map Pack Results */}
        {mapPackResults.length > 0 && (
          <div>
            <h2>Map Pack Results</h2>
            {mapPackResults.map((result, index) => (
              <ResultRow key={index} data={result} type="map" />
            ))}
          </div>
        )}

        {/* Organic Results */}
        {organicResults.length > 0 && (
          <div>
            <h2>Organic Results</h2>
            {organicResults.map((result, index) => (
              <ResultRow key={index} data={result} type="organic" />
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
