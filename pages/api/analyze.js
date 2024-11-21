const cheerio = require('cheerio');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { website } = req.body;

    if (!website) {
        return res.status(400).json({ error: 'Website URL is required.' });
    }

    try {
        // Ensure the URL has a protocol
        let url = website.trim();
        if (!/^https?:\/\//i.test(url)) {
            url = `https://${url}`;
        }

        // Fetch the HTML content
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch website: ${response.statusText}`);
        }

        const html = await response.text();

        if (!html || html.trim().length === 0) {
            throw new Error('Empty or invalid HTML response.');
        }

        // Use Cheerio to load the HTML
        const $ = cheerio.load(html);

        // Extract key metadata
        const pageTitle = $('title').text() || 'N/A';
        const metaDescription = $('meta[name="description"]').attr('content') || 'N/A';
        const canonicalUrl = $('link[rel="canonical"]').attr('href') || 'N/A';
        const headings = $('h1, h2, h3')
            .map((_, el) => ({
                tag: $(el).prop('tagName'),
                text: $(el).text().trim(),
            }))
            .get();

        // Send the results
        res.status(200).json({
            pageTitle,
            metaDescription,
            canonicalUrl,
            headings,
        });
    } catch (error) {
        console.error('Error analyzing website:', error.message);
        res.status(500).json({ error: `Error analyzing website: ${error.message}` });
    }
};
