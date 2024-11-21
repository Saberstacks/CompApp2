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
    const response = await axios.get(website, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(response.data);

    const analysis = {
      title: $('title').text() || 'N/A',
      metaDescription: $('meta[name="description"]').attr('content') || 'N/A',
      canonical: $('link[rel="canonical"]').attr('href') || 'N/A',
    };

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing website:', error.message);
    res.status(500).json({ error: 'Failed to analyze the website.' });
  }
}
