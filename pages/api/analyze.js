import cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    let body = '';
    await new Promise((resolve, reject) => {
      req.on('data', chunk => (body += chunk));
      req.on('end', resolve);
      req.on('error', reject);
    });

    const params = new URLSearchParams(body);
    const website = params.get('website');
    const keyword = params.get('keyword');

    if (!website || !keyword) {
      res.status(400).json({ error: 'Website URL and keyword are required.' });
      return;
    }

    // Fetch website content
    const response = await fetch(website, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!response.ok) {
      res.status(500).json({ error: 'Failed to fetch the website content.' });
      return;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract on-page SEO data
    const pageTitle = $('title').text() || 'N/A';
    const metaDescription = $('meta[name="description"]').attr('content') || 'N/A';
    const h1Text = $('h1').first().text() || 'N/A';

    const titleHasKeyword = pageTitle.toLowerCase().includes(keyword.toLowerCase()) ? 'Present' : 'Missing';
    const descriptionHasKeyword = metaDescription.toLowerCase().includes(keyword.toLowerCase()) ? 'Present' : 'Missing';
    const urlHasKeyword = website.toLowerCase().includes(keyword.toLowerCase()) ? 'Present' : 'Missing';

    const sslStatus = website.startsWith('https://') ? 'Active' : 'Missing';

    res.status(200).json({
      pageTitle,
      metaDescription,
      h1Text,
      titleHasKeyword,
      descriptionHasKeyword,
      urlHasKeyword,
      sslStatus,
    });
  } catch (error) {
    console.error('Error processing the analysis:', error.message);
    res.status(500).json({ error: 'An error occurred while processing the analysis.' });
  }
}
