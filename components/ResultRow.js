import { useRouter } from 'next/router';

export default function ResultRow({ data, type }) {
  const router = useRouter();

  const handleAnalyze = () => {
    const url = encodeURIComponent(data.url || data.website);
    const keyword = encodeURIComponent(data.page_title || data.business_name || "N/A");
    localStorage.setItem('website', data.url || data.website);
    localStorage.setItem('keyword', data.page_title || data.business_name || "N/A");
    router.push(`/results?website=${url}&keyword=${keyword}`);
  };

  return (
    <div className="result-row">
      <h4>
        {type === 'map' ? data.business_name : data.page_title} (Rank: {type === 'map' ? data.rank_in_map_pack : data.rank_in_organic})
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
