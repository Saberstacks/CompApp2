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
    // Ensure proper URL formatting
    const formattedUrl = /^https?:\/\//i.test(website) ? website : `https://${website}`;
    console.log(`Formatted URL: ${formattedUrl}`);

    // Fetch the website content
    const response = await fetch(formattedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch the website: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract data with graceful fallbacks
    const pageTitle = $('title').text() || 'No title available';
    const metaDescription =
      $('meta[name="description"]').attr('content') || 'No meta description available';
    const canonicalUrl = $('link[rel="canonical"]').attr('href') || 'No canonical URL available';

    // Handle headings
    const headings = [];
    $('h1, h2, h3').each((_, el) => {
      headings.push({
        tag: $(el).prop('tagName'),
        text: $(el).text().trim() || 'No text available',
      });
    });

    // Internal links count
    const internalLinks = $('a[href^="/"]').length;

    // Images with alt attributes
    const imagesWithAlt = $('img[alt]').length;
    const totalImages = $('img').length;

    // Return collected data
    res.status(200).json({
      pageTitle,
      metaDescription,
      canonicalUrl,
      headings,
      internalLinks,
      imagesWithAlt,
      totalImages,
    });
  } catch (error) {
    console.error(`Error analyzing website: ${error.message}`);
    res.status(500).json({ error: 'Failed to analyze the website. Please try again.' });
  }
}
