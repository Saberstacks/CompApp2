import { useState } from 'react';

export default function Results() {
  const [results, setResults] = useState(null);
  const [analyzeData, setAnalyzeData] = useState(null);
  const [error, setError] = useState('');

  const fetchSearchResults = async (keyword) => {
    try {
      const response = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        throw new Error(data.error || 'Error fetching search results');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const analyzeCompetitor = async (website, keyword) => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `website=${encodeURIComponent(website)}&keyword=${encodeURIComponent(keyword)}`,
      });

      const data = await response.json();

      if (response.ok) {
        setAnalyzeData(data);
      } else {
        throw new Error(data.error || 'Error analyzing website');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Search Results</h1>
      <button onClick={() => fetchSearchResults('example keyword')}>Fetch Results</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results && (
        <div>
          <h2>Map Pack Results</h2>
          {results.mapPackResults.map((result, index) => (
            <div key={index}>
              <h3>{result.business_name}</h3>
              <p>{result.address}</p>
              <button onClick={() => analyzeCompetitor(result.url, 'example keyword')}>Analyze</button>
            </div>
          ))}

          <h2>Organic Results</h2>
          {results.organicResults.map((result, index) => (
            <div key={index}>
              <h3>{result.title}</h3>
              <p>{result.snippet}</p>
              <button onClick={() => analyzeCompetitor(result.url, 'example keyword')}>Analyze</button>
            </div>
          ))}
        </div>
      )}

      {analyzeData && (
        <div>
          <h2>Analysis Results</h2>
          <pre>{JSON.stringify(analyzeData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
