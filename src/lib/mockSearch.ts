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
const fallbackResults: SearchResult[] = [
  {
    title: 'Wikipedia',
    url: 'https://en.wikipedia.org',
    snippet: 'Explore summaries and articles from the free encyclopedia.',
  },
  {
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    snippet: 'Reference documentation and guides for web technologies.',
  },
  {
    title: 'GitHub',
    url: 'https://github.com',
    snippet: 'Discover repositories, topics, and developer tools.',
  },
  {
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    snippet: 'Find community answers and programming knowledge.',
  },
];

const buildImageResults = (query: string): SearchImage[] =>
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

export async function searchWeb(query: string): Promise<{
  results: SearchResult[];
  images: SearchImage[];
  isFallback: boolean;
}> {
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

    return {
      results,
      images: buildImageResults(query),
      isFallback: false,
    };
  } catch (error) {
    console.warn('Search request failed, using fallback results.', error);
    const results = fallbackResults.map((result) => ({
      ...result,
      snippet: `${result.snippet} Suggested for "${query}".`,
    }));
    return {
      results,
      images: buildImageResults(query),
      isFallback: true,
    };
  }
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
