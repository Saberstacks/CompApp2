const cheerio = require('cheerio');
const https = require('https');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { website } = req.body;
    if (!website) {
        return res.status(400).json({ error: 'Website URL is required.' });
    }

    let url = website.trim();
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    try {
        // Fetch the website's HTML
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, 15000);

        const response = await fetch(url, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0' },
            agent: url.startsWith('https') ? new https.Agent({ rejectUnauthorized: false }) : undefined,
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`Failed to fetch the website: ${response.statusText}`);
        }

        let html = await response.text();
        html = html.slice(0, 1000000); // Limit HTML size for performance

        const $ = cheerio.load(html);

        // Extract metadata
        const data = {
            pageTitle: $('title').text() || 'N/A',
            metaDescription: $('meta[name="description"]').attr('content') || 'N/A',
            canonicalUrl: $('link[rel="canonical"]').attr('href') || 'N/A',
            sslStatus: url.startsWith('https://') ? 'Active' : 'Inactive',
            robotsTxtStatus: 'Unknown',
            isIndexable: !$('meta[name="robots"]').attr('content')?.includes('noindex'),
            headings: $('h1, h2, h3')
                .map((_, el) => ({ tag: $(el).prop('tagName'), text: $(el).text().trim() }))
                .get(),
        };

        // Attempt to fetch robots.txt
        try {
            const robotsResponse = await fetch(new URL('/robots.txt', url).toString());
            data.robotsTxtStatus = robotsResponse.ok ? 'Present' : 'Missing';
        } catch {
            data.robotsTxtStatus = 'Error fetching robots.txt';
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error analyzing website:', error.message);
        res.status(500).json({ error: 'Failed to analyze the website. Please try again.' });
    }
};
