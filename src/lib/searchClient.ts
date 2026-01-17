import type { Region, SearchImage, SearchResult } from '@/types/mountx';

type RawSearchResponse = {
  results?: unknown;
  images?: unknown;
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

const defaultSearchEndpoint = import.meta.env.VITE_SEARCH_API_URL ?? '/api/search';
const isAbsoluteEndpoint = /^https?:\/\//i.test(defaultSearchEndpoint);

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

const buildSearchEndpoint = (query: string, region?: Region) => {
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
    results: normalizeResults(data.results),
    images: normalizeImages(data.images),
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
