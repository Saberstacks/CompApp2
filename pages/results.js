import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ResultRow from '../components/ResultRow';
import MessageBox from '../components/MessageBox';

export default function Results() {
  const router = useRouter();
  const { keyword } = router.query;

  const [mapPackResults, setMapPackResults] = useState([]);
  const [organicResults, setOrganicResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!keyword) return;

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`);
        if (!res.ok) throw new Error('Failed to fetch search results.');

        const data = await res.json();
        setMapPackResults(data.mapPackResults || []);
        setOrganicResults(data.organicResults || []);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keyword]);

  if (loading) {
    return <MessageBox type="info" message="Loading search results..." />;
  }

  if (error) {
    return <MessageBox type="error" message={error} />;
  }

  return (
    <div>
      <h1>Search Results for "{keyword}"</h1>
      <h2>Organic Results</h2>
      {organicResults.map((result, index) => (
        <ResultRow key={index} data={result} type="organic" />
      ))}
    </div>
  );
}
