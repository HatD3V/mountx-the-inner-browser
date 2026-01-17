const express = require('express');

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  const region = req.query.region;

  if (typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'Missing search query.' });
  }

  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'BRAVE_API_KEY is not configured.' });
  }

  const searchUrl = new URL('https://api.search.brave.com/res/v1/web/search');
  searchUrl.searchParams.set('q', query);
  if (typeof region === 'string' && region.trim().length > 0) {
    searchUrl.searchParams.set('region', region);
  }

  try {
    const response = await fetch(searchUrl.toString(), {
      headers: {
        Accept: 'application/json',
        'X-Subscription-Token': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'Search provider request failed.',
        details: errorText,
      });
    }

    const payload = await response.json();
    const webResults = Array.isArray(payload?.web?.results)
      ? payload.web.results
      : [];
    const imageResults = Array.isArray(payload?.images?.results)
      ? payload.images.results
      : [];

    const results = webResults.map((result) => ({
      title: result?.title ?? '',
      url: result?.url ?? '',
      snippet: result?.description ?? '',
    }));

    const images = imageResults.map((image) => ({
      title: image?.title ?? '',
      url: image?.url ?? '',
      sourceUrl: image?.page_url ?? '',
    }));

    return res.json({ results, images });
  } catch (error) {
    console.error('Search failed', error);
    return res.status(500).json({ error: 'Search request failed.' });
  }
});

app.listen(port, () => {
  console.log(`Search API server listening on ${port}`);
});
