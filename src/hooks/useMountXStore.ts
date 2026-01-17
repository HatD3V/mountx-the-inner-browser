import { useState, useEffect, useCallback } from 'react';
import type { HistoryEntry, FavoriteItem, Settings, Region } from '@/types/mountx';

const HISTORY_KEY = 'mountx_history';
const FAVORITES_KEY = 'mountx_favorites';
const SETTINGS_KEY = 'mountx_settings';

const defaultSettings: Settings = {
  defaultRegion: 'global',
  openInMountX: true,
};

export function useMountXStore() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [currentRegion, setCurrentRegion] = useState<Region>('global');

  // Load from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    const storedSettings = localStorage.getItem(SETTINGS_KEY);

    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }

    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }

    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        setSettings(parsed);
        setCurrentRegion(parsed.defaultRegion);
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  // Persist history
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const addHistoryEntry = useCallback((type: 'search' | 'url', text: string) => {
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      text,
      timestamp: Date.now(),
    };
    setHistory(prev => [entry, ...prev.slice(0, 99)]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'id' | 'addedAt'>) => {
    const favorite: FavoriteItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      addedAt: Date.now(),
    };
    setFavorites(prev => {
      // Don't add duplicates
      if (prev.some(f => f.url === item.url)) return prev;
      return [favorite, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((url: string) => {
    setFavorites(prev => prev.filter(f => f.url !== url));
  }, []);

  const isFavorite = useCallback((url: string) => {
    return favorites.some(f => f.url === url);
  }, [favorites]);

  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'id' | 'addedAt'>) => {
    if (isFavorite(item.url)) {
      removeFavorite(item.url);
    } else {
      addFavorite(item);
    }
  }, [isFavorite, removeFavorite, addFavorite]);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    history,
    favorites,
    settings,
    currentRegion,
    setCurrentRegion,
    addHistoryEntry,
    clearHistory,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    updateSettings,
  };
}
