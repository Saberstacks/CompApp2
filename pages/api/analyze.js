import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required.' });
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            },
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const metadata = {
            title: $('title').text() || 'N/A',
            metaDescription: $('meta[name="description"]').attr('content') || 'N/A',
            canonical: $('link[rel="canonical"]').attr('href') || 'N/A',
            headings: $('h1, h2, h3')
                .map((_, el) => $(el).text().trim())
                .get(),
            imagesWithAlt: $('img[alt]').length,
            totalImages: $('img').length,
        };

        res.status(200).json(metadata);
    } catch (error) {
        res.status(500).json({ message: `Error analyzing ${url}: ${error.message}` });
    }
}
