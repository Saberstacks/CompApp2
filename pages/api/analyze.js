import cheerio from 'cheerio';
import fetch from 'node-fetch';

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

    try {
        // Validate and format the URL
        let url = website.trim();
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        // Fetch the website's HTML
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch the website: ${response.statusText}`);
        }

        const html = await response.text();
        
        // Ensure HTML is not empty or invalid
        if (!html || html.trim().length === 0) {
            throw new Error('HTML response is empty or invalid.');
        }

        // Load the HTML with Cheerio
        let $;
        try {
            $ = cheerio.load(html);
        } catch (err) {
            throw new Error(`Error loading HTML with Cheerio: ${err.message}`);
        }

        // Extract metadata
        const pageTitle = $('title').text() || 'N/A';
        const metaDescription = $('meta[name="description"]').attr('content') || 'N/A';
        const canonicalUrl = $('link[rel="canonical"]').attr('href') || 'N/A';
        const headings = $('h1, h2, h3')
            .map((_, el) => ({ tag: $(el).prop('tagName'), text: $(el).text().trim() }))
            .get();

        // Prepare response data
        const data = {
            pageTitle,
            metaDescription,
            canonicalUrl,
            headings,
        };

        res.status(200).json(data);
    } catch (error) {
        console.error('Error analyzing website:', error.message);
        res.status(500).json({
            error: `Failed to analyze the website: ${error.message}`,
        });
    }
}
