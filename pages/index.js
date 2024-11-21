import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/results?keyword=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="home-container">
      <h1>Search and Analyze</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your search query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
