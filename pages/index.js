import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      alert('Please enter a keyword.');
      return;
    }

    setLoading(true);

    try {
      router.push(`/results?keyword=${encodeURIComponent(keyword)}`);
    } catch (error) {
      console.error('Search Error:', error.message);
      alert('An error occurred while submitting your search.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Competitor Analysis Tool</h1>
      <form onSubmit={handleSearch}>
        <label>
          Keyword (Include location in your query for regional results):
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., Plumbers in Miami"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>
    </div>
  );
}
