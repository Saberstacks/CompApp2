export default function ResultRow({ data, type }) {
  const handleAnalyzeClick = () => {
    if (data.url) {
      window.location.href = `/api/analyze?url=${encodeURIComponent(data.url)}`;
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px', borderRadius: '5px' }}>
      <h3>{type === 'map' ? data.business_name : data.page_title}</h3>
      <p>{type === 'map' ? data.address : data.page_description}</p>
      <p>
        URL: <a href={data.url} target="_blank" rel="noopener noreferrer">{data.url}</a>
      </p>
      <button onClick={handleAnalyzeClick} style={{ padding: '5px 10px', cursor: 'pointer' }}>
        Analyze Competitor
      </button>
    </div>
  );
}
