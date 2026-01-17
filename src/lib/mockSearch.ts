import type { SearchImage, SearchResult } from '@/types/mountx';

interface DuckDuckGoTopic {
  Text?: string;
  FirstURL?: string;
  Topics?: DuckDuckGoTopic[];
}

interface DuckDuckGoResponse {
  Abstract?: string;
  AbstractText?: string;
  AbstractURL?: string;
  Heading?: string;
  RelatedTopics?: DuckDuckGoTopic[];
  Results?: DuckDuckGoTopic[];
}

const imageCount = 6;

const buildUnsplashFallbackImages = (query: string): SearchImage[] =>
  Array.from({ length: imageCount }).map((_, index) => ({
    title: `${query} image ${index + 1}`,
    url: `https://source.unsplash.com/featured/400x300?${encodeURIComponent(query)}&sig=${index}`,
    sourceUrl: `https://unsplash.com/s/photos/${encodeURIComponent(query)}`,
  }));

const flattenTopics = (topics: DuckDuckGoTopic[] = []): DuckDuckGoTopic[] =>
  topics.flatMap((topic) => (topic.Topics ? flattenTopics(topic.Topics) : topic));

const topicToResult = (topic: DuckDuckGoTopic): SearchResult | null => {
  if (!topic.Text || !topic.FirstURL) return null;
  const [title, snippet] = topic.Text.split(' - ');
  return {
    title: title || topic.Text,
    url: topic.FirstURL,
    snippet: snippet || topic.Text,
  };
};

const fetchDuckDuckGoResults = async (query: string): Promise<SearchResult[]> => {
  const endpoint = new URL('https://api.allorigins.win/raw');
  endpoint.searchParams.set(
    'url',
    `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1&t=mountx`
  );
  endpoint.searchParams.set('cb', Date.now().toString());

  try {
    const response = await fetch(endpoint.toString(), { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Search request failed.');
    }

    const data = (await response.json()) as DuckDuckGoResponse;
    const rawResults = [...(data.Results ?? []), ...flattenTopics(data.RelatedTopics)];
    const results = rawResults
      .map(topicToResult)
      .filter((result): result is SearchResult => Boolean(result))
      .slice(0, 8);

    if (results.length === 0 && data.AbstractURL) {
      results.push({
        title: data.Heading || query,
        url: data.AbstractURL,
        snippet: data.AbstractText || data.Abstract || `Learn more about ${query}.`,
      });
    }

    return results;
  } catch (error) {
    console.warn('Search request failed, returning empty results.', error);
    return [];
  }
};

const fetchWikipediaImages = async (query: string): Promise<SearchImage[]> => {
  const endpoint = new URL('https://en.wikipedia.org/w/api.php');
  endpoint.searchParams.set('action', 'query');
  endpoint.searchParams.set('format', 'json');
  endpoint.searchParams.set('origin', '*');
  endpoint.searchParams.set('generator', 'search');
  endpoint.searchParams.set('gsrsearch', query);
  endpoint.searchParams.set('gsrlimit', imageCount.toString());
  endpoint.searchParams.set('prop', 'pageimages');
  endpoint.searchParams.set('piprop', 'thumbnail');
  endpoint.searchParams.set('pithumbsize', '400');

  try {
    const response = await fetch(endpoint.toString(), { cache: 'no-store' });
    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as {
      query?: {
        pages?: Record<
          string,
          { pageid: number; title: string; thumbnail?: { source: string } }
        >;
      };
    };

    const pages = Object.values(data.query?.pages ?? {});
    return pages
      .filter((page) => page.thumbnail?.source)
      .map((page) => ({
        title: page.title,
        url: page.thumbnail?.source ?? '',
        sourceUrl: `https://en.wikipedia.org/?curid=${page.pageid}`,
      }))
      .filter((image) => image.url.length > 0)
      .slice(0, imageCount);
  } catch (error) {
    console.warn('Wikipedia image request failed.', error);
    return [];
  }
};

export async function searchWeb(query: string): Promise<{
  results: SearchResult[];
  images: SearchImage[];
}> {
  const [results, imagesResponse] = await Promise.all([
    fetchDuckDuckGoResults(query),
    fetchWikipediaImages(query),
  ]);

  const images =
    imagesResponse.length > 0 ? imagesResponse : buildUnsplashFallbackImages(query);

  return { results, images };
}

export function isUrl(input: string): boolean {
  // Check if input looks like a URL
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return true;
  }
  // Check for domain-like patterns
  const domainPattern = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+/;
  return domainPattern.test(input);
}

export function normalizeUrl(input: string): string {
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input;
  }
  return `https://${input}`;
}
