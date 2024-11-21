import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Results() {
    const router = useRouter();
    const { keyword } = router.query;

    const [mapPackResults, setMapPackResults] = useState([]);
    const [organicResults, setOrganicResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!keyword) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`);
                const data = await res.json();

                if (res.ok) {
                    setMapPackResults(data.mapPackResults || []);
                    setOrganicResults(data.organicResults || []);
                } else {
                    setError(data.message || 'Error fetching results.');
                }
            } catch (err) {
                setError('An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [keyword]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Search Results for "{keyword}"</h1>
            <h2>Map Pack Results</h2>
            {mapPackResults.length === 0 ? (
                <p>No Map Pack results found.</p>
            ) : (
                <ul>
                    {mapPackResults.map((result, index) => (
                        <li key={index}>
                            <p>
                                <strong>{result.title}</strong>
                            </p>
                            <p>{result.address || 'Address not available'}</p>
                            <p>Rating: {result.rating || 'N/A'} ({result.reviews || '0'} reviews)</p>
                        </li>
                    ))}
                </ul>
            )}
            <h2>Organic Results</h2>
            <ul>
                {organicResults.map((result, index) => (
                    <li key={index}>
                        <p>
                            <strong>{result.title}</strong>
                        </p>
                        <p>{result.snippet || 'Description not available'}</p>
                        <button onClick={() => router.push(`/analyze?url=${encodeURIComponent(result.url)}`)}>
                            Analyze Competitor Site
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
