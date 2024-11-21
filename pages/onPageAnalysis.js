import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function OnPageAnalysis() {
    const router = useRouter();
    const { website } = router.query;

    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!website) return;

        const fetchAnalysis = async () => {
            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ website }),
                });

                const data = await response.json();

                if (response.ok) {
                    setResults(data);
                } else {
                    setError(data.error || 'An error occurred.');
                }
            } catch (err) {
                console.error('Error fetching analysis:', err);
                setError('An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [website]);

    if (loading) return <p>Loading analysis...</p>;

    if (error) return <p className="error">{error}</p>;

    return (
        <div>
            <h1>On-Page Analysis for {website}</h1>
            <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
    );
}
