const cheerio = require('cheerio');
const https = require('https');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { website, keyword } = req.body || {};

  if (!website || !keyword) {
    res.status(400).json({ error: 'Please provide both a website URL and a keyword.' });
    return;
  }

  try {
    const response = await fetch(website, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html',
      },
      agent: new https.Agent({ rejectUnauthorized: false }),
    });

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const sslStatus = website.startsWith('https') ? 'Active' : 'Inactive';
    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || 'N/A';
    const headings = $('h1, h2, h3')
      .map((i, el) => ({
        tag: $(el).prop('tagName'),
        text: $(el).text(),
      }))
      .get();

    const results = {
      ssl: sslStatus,
      title,
      metaDescription,
      headings,
    };

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
