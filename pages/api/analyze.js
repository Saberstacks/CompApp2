import cheerio from 'cheerio';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { website } = req.body;
  if (!website) {
    return res.status(400).json({ error: 'Website URL is required.' });
  }

  try {
    // Ensure URL starts with http/https
    const formattedUrl = website.startsWith('http://') || website.startsWith('https://') ? website : `https://${website}`;

    // Fetch the webpage
    const response = await axios.get(formattedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }, // Ensure proper headers for the request
    });

    // Validate response
    if (!response || !response.data) {
      throw new Error('Invalid response from the website.');
    }

    const $ = cheerio.load(response.data);

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
    res.status(500).json({ error: 'Failed to analyze the website. Please check the URL and try again.' });
  }
}
