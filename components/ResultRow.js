import { useRouter } from 'next/router';

export default function ResultRow({ data }) {
    const router = useRouter();

    const handleAnalyze = () => {
        if (data.url) {
            const encodedURL = encodeURIComponent(data.url.trim());
            router.push(`/onPageAnalysis?website=${encodedURL}`, '_blank'); // Open in a new tab
        } else {
            alert('No valid URL available for analysis.');
        }
    };

    return (
        <div className="result-row">
            <h4>{data.page_title}</h4>
            <p>{data.page_description}</p>
            <button onClick={handleAnalyze}>Analyze</button>
        </div>
    );
}
