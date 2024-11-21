import cheerio from 'cheerio';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Parse the request body
    const { website } = JSON.parse(req.body);

    if (!website) {
      return res.status(400).json({ error: 'Website URL is required.' });
    }

    const response = await fetch(website, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch the website: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const data = {
      pageTitle: $('title').text() || 'N/A',
      metaDescription: $('meta[name="description"]').attr('content') || 'N/A',
      canonicalUrl: $('link[rel="canonical"]').attr('href') || 'N/A',
      sslStatus: website.startsWith('https://') ? 'Active' : 'Inactive',
      robotsTxtStatus: $('meta[name="robots"]').attr('content') || 'Missing',
      isIndexable: !$('meta[name="robots"]').attr('content')?.includes('noindex'),
      headings: $('h1, h2, h3')
        .map((_, el) => ({ tag: $(el).prop('tagName'), text: $(el).text().trim() }))
        .get(),
    };

    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to analyze the website.' });
  }
}
