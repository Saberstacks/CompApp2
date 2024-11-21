import cheerio from 'cheerio';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { website } = req.body;
  console.log('Received website for analysis:', website);

  if (!website) {
    return res.status(400).json({ error: 'Website URL is required.' });
  }

  try {
    // Validate and format the URL
    const formattedUrl = website.startsWith('http://') || website.startsWith('https://') ? website : `https://${website}`;
    console.log('Formatted URL:', formattedUrl);

    // Fetch the webpage
    const response = await axios.get(formattedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
    });

    // Check if the response contains valid HTML
    if (!response || !response.data || typeof response.data !== 'string') {
      throw new Error('Invalid HTML response from the website.');
    }
    console.log('HTML successfully fetched.');

    // Load HTML into Cheerio
    let $;
    try {
      $ = cheerio.load(response.data);
    } catch (error) {
      throw new Error('Failed to load HTML with Cheerio.');
    }
    console.log('Cheerio loaded the HTML successfully.');

    // Extract metadata
    const analysis = {
      title: $('title').text() || 'N/A',
      metaDescription: $('meta[name="description"]').attr('content') || 'N/A',
      canonical: $('link[rel="canonical"]').attr('href') || 'N/A',
      headings: $('h1, h2, h3')
        .map((_, el) => ({
          tag: $(el).prop('tagName'),
          text: $(el).text().trim(),
        }))
        .get(),
    };

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing website:', error.message);

    // Send user-friendly error messages
    let userMessage = 'Failed to analyze the website.';
    if (error.message.includes('Invalid HTML response')) {
      userMessage = 'The website returned invalid or non-HTML content. Try a different site.';
    } else if (error.message.includes('Failed to load HTML with Cheerio')) {
      userMessage = 'Unable to process the website\'s content. The page might rely on JavaScript.';
    }

    res.status(500).json({ error: userMessage });
  }
}
