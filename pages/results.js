import { useState } from 'react';

export default function Results() {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAnalyzeClick = async (website, keyword) => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `website=${encodeURIComponent(website)}&keyword=${encodeURIComponent(keyword)}`,
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'An error occurred during analysis.');
      }

      const data = await response.json();
      setAnalysisResults(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Search Results</h1>

      {/* Example result item */}
      <div>
        <h2>Competitor: Example Website</h2>
        <button
          onClick={() => handleAnalyzeClick('https://example.com', 'sample keyword')}
        >
          Analyze
        </button>
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}
      {analysisResults && (
        <div>
          <h2>Analysis Results</h2>
          <pre>{JSON.stringify(analysisResults, null, 2)}</pre>
        </div>
      )}

      <style jsx>{`
        .error {
          color: red;
        }
      `}</style>
    </div>
  );
}
