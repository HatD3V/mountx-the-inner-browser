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

interface WikipediaPageImage {
  pageid: number;
  title: string;
  thumbnail?: {
    source: string;
  };
}

interface WikipediaQueryResponse {
  query?: {
    pages?: Record<string, WikipediaPageImage>;
  };
}

const imageCount = 6;

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

  const response = await fetch(endpoint.toString(), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Image search failed.');
  }

  const data = (await response.json()) as WikipediaQueryResponse;
  const pages = Object.values(data.query?.pages ?? {});

  return pages
    .filter((page) => Boolean(page.thumbnail?.source))
    .slice(0, imageCount)
    .map((page) => ({
      title: page.title,
      url: page.thumbnail?.source ?? '',
      sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
    }));
};

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

export async function searchWeb(query: string): Promise<{
  results: SearchResult[];
  images: SearchImage[];
}> {
  const endpoint = new URL('https://api.allorigins.win/raw');
  endpoint.searchParams.set(
    'url',
    `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1&t=mountx`
  );
  endpoint.searchParams.set('cb', Date.now().toString());

  const [searchResponse, images] = await Promise.all([
    fetch(endpoint.toString(), { cache: 'no-store' }),
    fetchWikipediaImages(query).catch(() => []),
  ]);

  if (!searchResponse.ok) {
    throw new Error('Search request failed.');
  }

  const data = (await searchResponse.json()) as DuckDuckGoResponse;
  const rawResults = [...(data.Results ?? []), ...flattenTopics(data.RelatedTopics)];
  const results = rawResults
    .map(topicToResult)
    .filter((result): result is SearchResult => Boolean(result))
    .filter((result) => {
      try {
        const hostname = new URL(result.url).hostname;
        return !hostname.includes('duckduckgo.com');
      } catch {
        return true;
      }
    })
    .slice(0, 8);

  if (results.length === 0 && data.AbstractURL) {
    results.push({
      title: data.Heading || query,
      url: data.AbstractURL,
      snippet: data.AbstractText || data.Abstract || `Learn more about ${query}.`,
    });
  }

  return {
    results,
    images,
  };
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
