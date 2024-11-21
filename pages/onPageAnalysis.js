import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AnalyzePage() {
    const router = useRouter();
    const { website } = router.query;

    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!website) return;

        const fetchData = async () => {
            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ website }),
                });

                const result = await response.json();
                if (response.ok) {
                    setData(result);
                } else {
                    setError(result.error || 'Failed to analyze the website.');
                }
            } catch (err) {
                setError('An error occurred while analyzing the website.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [website]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Analysis Results for {website}</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
