import cheerio from 'cheerio';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { website } = req.body;

  if (!website) {
    return res.status(400).json({ error: 'Website URL is required.' });
  }

  try {
    const formattedUrl = /^https?:\/\//i.test(website) ? website : `https://${website}`;
    console.log(`Formatted URL: ${formattedUrl}`);

    const response = await fetch(formattedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch the website: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    if (!html || html.trim() === '') {
      throw new Error('Empty or invalid HTML response from the website.');
    }

    console.log(`HTML length: ${html.length}`);

    const $ = cheerio.load(html);

    // Extract data with fallbacks
    const pageTitle = $('title').text() || 'No title available';
    const metaDescription = $('meta[name="description"]').attr('content') || 'No meta description available';
    const canonicalUrl = $('link[rel="canonical"]').attr('href') || 'No canonical URL available';

    // Handle headings
    const headings = [];
    $('h1, h2, h3').each((_, el) => {
      headings.push({
        tag: $(el).prop('tagName'),
        text: $(el).text().trim() || 'No text available',
      });
    });

    const internalLinksCount = $('a[href^="/"]').length;
    const imagesWithAlt = $('img[alt]').length;
    const totalImages = $('img').length;

    // Send back analysis results
    res.status(200).json({
      pageTitle,
      metaDescription,
      canonicalUrl,
      headings,
      internalLinksCount,
      imagesWithAlt,
      totalImages,
    });
  } catch (error) {
    console.error(`Error analyzing website: ${error.message}`);

    let errorMessage = 'An unexpected error occurred.';
    if (error.message.includes('403')) {
      errorMessage = 'This site is blocking analysis or requires login.';
    } else if (error.message.includes('load')) {
      errorMessage = 'Failed to parse the site’s HTML. The site may rely heavily on JavaScript.';
    } else if (error.message.includes('Empty or invalid HTML')) {
      errorMessage = 'The site returned an empty or invalid HTML response.';
    }

    res.status(500).json({ error: errorMessage });
  }
}
