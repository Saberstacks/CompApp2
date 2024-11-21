import { useRouter } from 'next/router';

export default function ResultRow({ data, type }) {
  const router = useRouter();

  const handleAnalyze = () => {
    if (data.url) {
      router.push(`/analyze?website=${encodeURIComponent(data.url)}`);
    } else {
      alert('No valid URL available for analysis.');
    }
  };

  if (!data || (!data.business_name && !data.page_title)) return null;

  return (
    <div className="result-row">
      <h4>
        {type === 'map' ? data.business_name : data.page_title} (Rank:{' '}
        {type === 'map' ? data.rank_in_map_pack : data.rank_in_organic})
      </h4>
      <p>{type === 'map' ? data.address : data.page_description}</p>
      <button onClick={handleAnalyze}>Analyze</button>
      <style jsx>{`
        .result-row {
          border: 1px solid #ccc;
          padding: 10px;
          margin-bottom: 10px;
        }
        h4 {
          margin: 0 0 5px 0;
        }
        p {
          margin: 0 0 10px 0;
        }
      `}</style>
    </div>
  );
}
