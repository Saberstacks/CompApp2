import { useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Ensure the URL and keyword are not empty
    if (url.trim() && keyword.trim()) {
      // Redirect to results page with query parameters
      router.push(`/results?url=${encodeURIComponent(url)}&keyword=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div>
      <h1>On-Page Analysis Tool</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="url">Website URL:</label>
          <input
            type="url"
            id="url"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="keyword">Keyword:</label>
          <input
            type="text"
            id="keyword"
            name="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
