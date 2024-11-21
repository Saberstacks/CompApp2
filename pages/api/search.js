import axios from 'axios';

export default async function handler(req, res) {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: 'Keyword is required.' });
  }

  try {
    const searchResponse = await axios.get('https://api.serpstack.com/search', {
      params: {
        access_key: process.env.SERPSTACK_API_KEY,
        query: keyword,
        type: 'web',
      },
    });

    const data = searchResponse.data;

    if (data.error) {
      console.error('Serpstack API Error:', data.error);
      return res.status(500).json({ message: data.error.info });
    }

    // Process Map Pack Results
    const mapPackResults = Array.isArray(data.local_results)
      ? data.local_results.map((item) => ({
          rank_in_map_pack: item.position || 'N/A',
          business_name: item.title || 'N/A',
          address: item.address || 'N/A',
          average_rating: item.rating || 'N/A',
          total_reviews: item.reviews || 'N/A',
          business_type: item.type || 'N/A',
          url: item.website || '',
        }))
      : [];

    // Process Organic Results
    const organicResults = Array.isArray(data.organic_results)
      ? data.organic_results.slice(0, 5).map((item) => ({
          rank_in_organic: item.position || 'N/A',
          page_title: item.title || 'N/A',
          page_description: item.snippet || 'N/A',
          url: item.url || '',
          domain: item.displayed_url || 'N/A',
        }))
      : [];

    res.status(200).json({
      mapPackResults,
      organicResults,
      message: '',
    });
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'An error occurred while processing your request.',
    });
  }
}
