import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/results?keyword=${encodeURIComponent(keyword)}`);
    } else {
      alert('Please enter a keyword.');
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
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
