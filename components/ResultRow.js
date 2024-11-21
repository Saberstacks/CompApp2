import { useRouter } from 'next/router';

export default function ResultRow({ data, type }) {
  const router = useRouter();

  const handleAnalyze = () => {
    if (data.url) {
      router.push(`/onPageAnalysis?website=${encodeURIComponent(data.url)}`);
    } else {
      alert('No valid URL available for analysis.');
    }
  };

  return (
    <div className="result-row">
      <h4>{type === 'map' ? data.business_name : data.page_title}</h4>
      <p>{type === 'map' ? data.address : data.page_description}</p>
      {type === 'organic' && (
        <>
          <a href={data.url} target="_blank" rel="noopener noreferrer">
            Visit Site
          </a>
          <button onClick={handleAnalyze}>Analyze</button>
        </>
      )}
      <style jsx>{`
        .result-row {
          border: 1px solid #ccc;
          padding: 10px;
          margin-bottom: 10px;
        }
        h4 {
          margin: 0 0 5px;
        }
        p {
          margin: 0 0 10px;
        }
      `}</style>
    </div>
  );
}
