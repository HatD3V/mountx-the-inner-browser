export type Region = 'global' | 'us' | 'eu' | 'asia';

export interface HistoryEntry {
  id: string;
  type: 'search' | 'url';
  text: string;
  timestamp: number;
}

export interface FavoriteItem {
  id: string;
  title: string;
  url: string;
  snippet?: string;
  addedAt: number;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface SearchImage {
  title: string;
  url: string;
  sourceUrl?: string;
}

export interface SearchNotice {
  message: string;
  variant?: 'info' | 'warning';
}

export interface Settings {
  defaultRegion: Region;
  openInMountX: boolean;
}
