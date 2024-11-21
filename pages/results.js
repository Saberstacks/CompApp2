import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ResultRow from '../components/ResultRow';

export default function Results() {
  const router = useRouter();
  const { keyword } = router.query;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!keyword) return;

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`);
        if (!res.ok) throw new Error('Failed to fetch results.');

        const data = await res.json();
        setResults(data.organicResults || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keyword]);

  if (loading) {
    return <p>Loading search results...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Search Results for "{keyword}"</h1>
      {results.map((result, index) => (
        <ResultRow key={index} data={result} type="organic" />
      ))}
    </div>
  );
}
