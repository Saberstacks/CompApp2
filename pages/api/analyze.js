const cheerio = require('cheerio');
const https = require('https');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { website, keyword } = req.body;

  if (!website || !keyword) {
    return res.status(400).json({ error: 'Website URL and keyword are required.' });
  }

  let url;
  let metadata = {};

  try {
    url = website.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // Timeout of 15 seconds

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html',
      },
      agent: url.startsWith('https') ? new https.Agent({ rejectUnauthorized: false }) : undefined,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Grab the metadata here
    metadata = {
      pageTitle: $('title').text() || 'N/A',
      metaDescription: $('meta[name="description"]').attr('content') || 'N/A',
      canonicalUrl: $('link[rel="canonical"]').attr('href') || 'N/A',
      sslStatus: url.startsWith('https://') ? 'Active' : 'Inactive',
      robotsTxtStatus: $('meta[name="robots"]').attr('content') || 'Missing',
      isIndexable: !$('meta[name="robots"]').attr('content')?.includes('noindex'),
      sitemapStatus: 'Unknown', // Add logic if needed
      headings: $('h1, h2, h3')
        .map((_, el) => ({ tag: $(el).prop('tagName'), text: $(el).text().trim() }))
        .get(),
    };

    res.status(200).json(metadata);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to analyze the website.' });
  }
}
