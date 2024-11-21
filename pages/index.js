import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const [keyword, setKeyword] = useState('');
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (keyword) {
            router.push(`/results?keyword=${encodeURIComponent(keyword)}`);
        }
    };

    return (
        <div>
            <h1>Search Competitor Analysis</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter keyword (e.g., Plumbers in Houston)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
        </div>
    );
}
