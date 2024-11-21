import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MessageBox from '../components/MessageBox';

export default function OnPageAnalysis() {
  const router = useRouter();
  const { website } = router.query;

  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!website) {
      setError('No website provided for analysis.');
      setLoading(false);
      return;
    }

    const fetchAnalysis = async () => {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ website }),
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || 'Failed to fetch analysis.');
        }

        const data = await res.json();
        setAnalysisData(data);
      } catch (err) {
        console.error('Error fetching analysis:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [website]);

  if (loading) {
    return (
      <div>
        <MessageBox type="info" message="Loading analysis results..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <MessageBox type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="analysis-container">
      <h1>On-Page Analysis Results for {website}</h1>
      <div className="results">
        <h2>SEO Essentials Overview</h2>
        <p><strong>SSL Certificate:</strong> {analysisData.sslStatus}</p>
        <p><strong>robots.txt:</strong> {analysisData.robotsTxtStatus}</p>
        <p><strong>Indexable:</strong> {analysisData.isIndexable ? 'Yes' : 'No'}</p>

        <h2>Content and Structure</h2>
        <p><strong>Page Title:</strong> {analysisData.pageTitle}</p>
        <p><strong>Meta Description:</strong> {analysisData.metaDescription}</p>
        <p><strong>Canonical URL:</strong> {analysisData.canonicalUrl}</p>

        <h2>Headings</h2>
        <ul>
          {analysisData.headings.map((heading, index) => (
            <li key={index}>
              <strong>{heading.tag}:</strong> {heading.text}
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        .analysis-container {
          padding: 20px;
        }
        .results {
          border: 1px solid #ccc;
          padding: 10px;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
