import type { Region, SearchImage, SearchResult } from '@/types/mountx';

type RawSearchResponse = {
  results?: unknown;
  images?: unknown;
};

type DuckDuckGoTopic = {
  Text?: unknown;
  FirstURL?: unknown;
  Topics?: unknown;
};

type DuckDuckGoResponse = {
  Results?: unknown;
  RelatedTopics?: unknown;
  Heading?: unknown;
};

type RawSearchResult = {
  title?: unknown;
  url?: unknown;
  snippet?: unknown;
  description?: unknown;
};

type RawSearchImage = {
  title?: unknown;
  url?: unknown;
  sourceUrl?: unknown;
  source_url?: unknown;
};

const configuredSearchEndpoint = import.meta.env.VITE_SEARCH_API_URL;
const fallbackSearchEndpoint = 'https://api.duckduckgo.com/';
const fallbackProxyEndpoint =
  import.meta.env.VITE_SEARCH_PROXY_URL ?? 'https://api.allorigins.win/raw?url=';
const defaultSearchEndpoint = configuredSearchEndpoint ?? fallbackSearchEndpoint;
const isAbsoluteEndpoint = /^https?:\/\//i.test(defaultSearchEndpoint);
const useDuckDuckGoFallback = !configuredSearchEndpoint;

const isString = (value: unknown): value is string => typeof value === 'string';

const normalizeResults = (results: unknown): SearchResult[] => {
  if (!Array.isArray(results)) return [];

  return results
    .map((result) => {
      const { title, url, snippet, description } = result as RawSearchResult;
      if (!isString(title) || !isString(url)) return null;
      const resolvedSnippet = isString(snippet)
        ? snippet
        : isString(description)
          ? description
          : '';

      return {
        title,
        url,
        snippet: resolvedSnippet,
      } satisfies SearchResult;
    })
    .filter((result): result is SearchResult => Boolean(result));
};

const normalizeImages = (images: unknown): SearchImage[] => {
  if (!Array.isArray(images)) return [];

  return images
    .map((image) => {
      const { title, url, sourceUrl, source_url } = image as RawSearchImage;
      if (!isString(title) || !isString(url)) return null;

      const resolvedSourceUrl = isString(sourceUrl)
        ? sourceUrl
        : isString(source_url)
          ? source_url
          : undefined;

      return {
        title,
        url,
        sourceUrl: resolvedSourceUrl,
      } satisfies SearchImage;
    })
    .filter((image): image is SearchImage => Boolean(image));
};

const normalizeDuckDuckGoResults = (data: DuckDuckGoResponse): SearchResult[] => {
  const results: SearchResult[] = [];
  const processTopic = (topic: DuckDuckGoTopic) => {
    const text = isString(topic.Text) ? topic.Text : '';
    const url = isString(topic.FirstURL) ? topic.FirstURL : '';
    const nestedTopics = Array.isArray(topic.Topics) ? topic.Topics : [];

    if (text && url) {
      const [title, snippet] = text.includes(' - ')
        ? text.split(' - ', 2)
        : [text, ''];
      results.push({
        title,
        url,
        snippet,
      });
    }

    nestedTopics.forEach((nested) => {
      processTopic(nested as DuckDuckGoTopic);
    });
  };

  const candidateLists = [data.Results, data.RelatedTopics];
  candidateLists.forEach((list) => {
    if (Array.isArray(list)) {
      list.forEach((topic) => processTopic(topic as DuckDuckGoTopic));
    }
  });

  return results;
};

const buildDuckDuckGoEndpoint = (query: string) => {
  const baseUrl = new URL(defaultSearchEndpoint);
  baseUrl.searchParams.set('q', query);
  baseUrl.searchParams.set('format', 'json');
  baseUrl.searchParams.set('no_redirect', '1');
  baseUrl.searchParams.set('no_html', '1');
  baseUrl.searchParams.set('skip_disambig', '1');
  return baseUrl.toString();
};

const buildProxyUrl = (targetUrl: string) => {
  if (fallbackProxyEndpoint.includes('{url}')) {
    return fallbackProxyEndpoint.replace('{url}', encodeURIComponent(targetUrl));
  }

  return `${fallbackProxyEndpoint}${encodeURIComponent(targetUrl)}`;
};

const buildSearchEndpoint = (query: string, region?: Region) => {
  if (useDuckDuckGoFallback) {
    const duckDuckGoUrl = buildDuckDuckGoEndpoint(query);
    return buildProxyUrl(duckDuckGoUrl);
  }

  const baseUrl = isAbsoluteEndpoint
    ? new URL(defaultSearchEndpoint)
    : new URL(
        defaultSearchEndpoint,
        typeof window !== 'undefined' && window.location?.origin
          ? window.location.origin
          : 'http://localhost'
      );
  baseUrl.searchParams.set('q', query);
  if (region) {
    baseUrl.searchParams.set('region', region);
  }

  return baseUrl.toString();
};

export async function searchWeb(
  query: string,
  region?: Region
): Promise<{ results: SearchResult[]; images: SearchImage[] }> {
  const endpoint = buildSearchEndpoint(query, region);
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Search request failed.');
  }

  const data = (await response.json()) as RawSearchResponse;

  return {
    results: useDuckDuckGoFallback
      ? normalizeDuckDuckGoResults(data as DuckDuckGoResponse)
      : normalizeResults(data.results),
    images: useDuckDuckGoFallback ? [] : normalizeImages(data.images),
  };
}

export function isUrl(input: string): boolean {
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return true;
  }

  const domainPattern = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+/;
  return domainPattern.test(input);
}

export function normalizeUrl(input: string): string {
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input;
  }
  return `https://${input}`;
}
