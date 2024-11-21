import cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  let body = '';
  await new Promise((resolve, reject) => {
    req.on('data', chunk => {
      body += chunk.toString();
    });
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

  try {
    const response = await fetch(website, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!response.ok) {
      res.status(500).json({ error: 'Failed to fetch the website content.' });
      return;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Analyze the page content
    const pageTitle = $('title').text() || 'N/A';
    const metaDescription = $('meta[name="description"]').attr('content') || 'N/A';
    const h1Text = $('h1').first().text() || 'N/A';
    const urlHasKeyword = website.toLowerCase().includes(keyword.toLowerCase()) ? 'Present' : 'Missing';
    const titleHasKeyword = pageTitle.toLowerCase().includes(keyword.toLowerCase()) ? 'Present' : 'Missing';
    const descriptionHasKeyword = metaDescription.toLowerCase().includes(keyword.toLowerCase()) ? 'Present' : 'Missing';

    // Collect additional SEO metrics
    const sslStatus = website.startsWith('https://') ? 'Active' : 'Missing';
    const robotsTxtStatus = $('meta[name="robots"]').attr('content') || 'Missing';
    const canonicalUrl = $('link[rel="canonical"]').attr('href') || 'N/A';

    res.status(200).json({
      sslStatus,
      robotsTxtStatus,
      pageTitle,
      metaDescription,
      h1Text,
      urlHasKeyword,
      titleHasKeyword,
      descriptionHasKeyword,
      canonicalUrl,
    });
  } catch (error) {
    console.error('Error analyzing website:', error.message);
    res.status(500).json({ error: 'An error occurred while analyzing the page.' });
  }
}
