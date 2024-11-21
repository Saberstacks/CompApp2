const cheerio = require('cheerio');
const https = require('https');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    const params = new URLSearchParams(body);
    const websiteParam = params.get('website');
    const keywordParam = params.get('keyword');

    if (!websiteParam || !keywordParam) {
      res.status(400).json({ error: 'Please provide both a website URL and a keyword.' });
      return;
    }

    try {
      const url = websiteParam.startsWith('http') ? websiteParam : `https://${websiteParam}`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' },
      });

      if (!response.ok) {
        throw new Error(`Error fetching website: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const title = $('title').text() || 'N/A';
      const metaDescription = $('meta[name="description"]').attr('content') || 'N/A';
      const h1 = $('h1').first().text() || 'N/A';

      res.status(200).json({
        title,
        metaDescription,
        h1,
        success: true,
      });
    } catch (error) {
      console.error('Analyze API Error:', error.message);
      res.status(500).json({ error: 'An error occurred while analyzing the page.' });
    }
  });
}
