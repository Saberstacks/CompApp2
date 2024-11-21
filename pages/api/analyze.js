import cheerio from 'cheerio';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { website } = req.query;

  if (!website) {
    return res.status(400).json({ error: 'Website URL is required.' });
  }

  try {
    // Ensure valid URL
    const url = website.startsWith('http') ? website : `https://${website}`;

    // Fetch website HTML
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const html = response.data;

    // Load HTML with Cheerio
    const $ = cheerio.load(html);

    // Extract metadata
    const metadata = {
      pageTitle: $('title').text() || 'N/A',
      metaDescription: $('meta[name="description"]').attr('content') || 'N/A',
      canonicalUrl: $('link[rel="canonical"]').attr('href') || 'N/A',
      sslStatus: url.startsWith('https://') ? 'Active' : 'Inactive',
      headings: $('h1, h2, h3')
        .map((_, el) => ({ tag: $(el).prop('tagName'), text: $(el).text().trim() }))
        .get(),
    };

    res.status(200).json(metadata);
  } catch (error) {
    console.error('Error fetching metadata:', error.message);
    res.status(500).json({ error: 'Failed to analyze the website.' });
  }
}
