import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { website } = req.body;

    if (!website) {
        res.status(400).json({ error: 'Website URL is required.' });
        return;
    }

    let formattedURL;

    try {
        // Ensure URL is properly formatted
        formattedURL = website.trim();
        if (!/^https?:\/\//i.test(formattedURL)) {
            formattedURL = `https://${formattedURL}`;
        }
        new URL(formattedURL); // Validate URL format
    } catch {
        res.status(400).json({ error: 'Invalid URL format.' });
        return;
    }

    try {
        // Fetch the website
        const response = await fetch(formattedURL, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch the website: ${response.statusText}`);
        }

        const html = await response.text();

        // Load the HTML
        let $;
        try {
            $ = cheerio.load(html);
        } catch (err) {
            console.error('Error loading HTML with Cheerio:', err);
            res.status(500).json({ error: 'Failed to parse website content.' });
            return;
        }

        // Extract metadata and other data
        const data = {
            pageTitle: $('title').text() || 'N/A',
            metaDescription: $('meta[name="description"]').attr('content') || 'N/A',
            canonicalUrl: $('link[rel="canonical"]').attr('href') || 'N/A',
            sslStatus: formattedURL.startsWith('https://') ? 'Active' : 'Inactive',
            robotsTxtStatus: $('meta[name="robots"]').attr('content') || 'Missing',
            isIndexable: !$('meta[name="robots"]').attr('content')?.includes('noindex'),
            headings: $('h1, h2, h3')
                .map((_, el) => ({
                    tag: $(el).prop('tagName'),
                    text: $(el).text().trim(),
                }))
                .get(),
            internalLinksCount: $('a[href^="/"]').length,
        };

        res.status(200).json(data);
    } catch (error) {
        console.error('Error analyzing website:', error);
        res.status(500).json({ error: 'Failed to analyze the website. Please try again.' });
    }
}
