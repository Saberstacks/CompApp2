import { useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (query.trim()) {
      router.push(`/results?query=${encodeURIComponent(query)}`);
    }
  };

  const handleAnalysisSubmit = (event) => {
    event.preventDefault();
    if (url.trim()) {
      router.push(`/analyze?url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <div>
      <h1>SEO Analysis Tool</h1>

      {/* Search Query Form */}
      <form onSubmit={handleSearchSubmit}>
        <h2>Search Query</h2>
        <input
          type="text"
          placeholder="e.g., plumber in Miami"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {/* On-Page Analysis Form */}
      <form onSubmit={handleAnalysisSubmit}>
        <h2>On-Page Analysis</h2>
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit">Analyze</button>
      </form>
    </div>
  );
}
