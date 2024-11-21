import axios from 'axios';

export default async function handler(req, res) {
  const { keyword } = req.query;

  try {
    const response = await axios.get('https://api.serpstack.com/search', {
      params: {
        access_key: process.env.SERPSTACK_API_KEY,
        query: keyword,
        type: 'web',
      },
    });

    if (response.data.error) {
      res.status(500).json({ error: response.data.error.info });
      return;
    }

    const { local_results, organic_results } = response.data;

    const mapPackResults = (local_results || []).map(item => ({
      business_name: item.title || 'N/A',
      address: item.address || 'N/A',
      rating: item.rating || 'N/A',
      url: item.website || '',
    }));

    const organicResults = (organic_results || []).slice(0, 5).map(item => ({
      title: item.title || 'N/A',
      url: item.url || '',
      snippet: item.snippet || '',
    }));

    res.status(200).json({ mapPackResults, organicResults });
  } catch (error) {
    console.error('Error fetching search results:', error.message);
    res.status(500).json({ error: 'Failed to fetch search results.' });
  }
}
