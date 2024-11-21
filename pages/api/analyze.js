import cheerio from 'cheerio';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { website } = req.body;
  console.log('Received website for analysis:', website); // Log the input URL for debugging

  if (!website) {
    return res.status(400).json({ error: 'Website URL is required.' });
  }

  try {
    // Validate and format the URL
    const formattedUrl = website.startsWith('http://') || website.startsWith('https://') ? website : `https://${website}`;
    console.log('Formatted URL:', formattedUrl); // Log the formatted URL

    // Fetch the webpage
    const response = await axios.get(formattedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }, // Use a standard user agent
    });

    // Check if the response contains HTML
    if (!response || !response.data) {
      throw new Error('No valid HTML returned from the website.');
    }
    console.log('HTML successfully fetched.');

    const $ = cheerio.load(response.data); // Load HTML into Cheerio
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
    console.error('Error analyzing website:', error.message); // Log the error message
    res.status(500).json({ error: `Failed to analyze the website: ${error.message}` });
  }
}
