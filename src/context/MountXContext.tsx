import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useMountXStore } from '@/hooks/useMountXStore';
import type { Region, HistoryEntry, FavoriteItem, Settings, SearchResult } from '@/types/mountx';

interface MountXContextType {
  // Navigation state
  currentView: 'home' | 'search' | 'url' | 'history' | 'favorites' | 'settings';
  setCurrentView: (view: 'home' | 'search' | 'url' | 'history' | 'favorites' | 'settings') => void;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  isSearching: boolean;
  setIsSearching: (loading: boolean) => void;
  
  // URL state
  currentUrl: string;
  setCurrentUrl: (url: string) => void;
  
  // Navigation history for back/forward
  navHistory: string[];
  navIndex: number;
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  
  // Store
  history: HistoryEntry[];
  favorites: FavoriteItem[];
  settings: Settings;
  currentRegion: Region;
  setCurrentRegion: (region: Region) => void;
  addHistoryEntry: (type: 'search' | 'url', text: string) => void;
  clearHistory: () => void;
  toggleFavorite: (item: Omit<FavoriteItem, 'id' | 'addedAt'>) => void;
  isFavorite: (url: string) => boolean;
  updateSettings: (settings: Partial<Settings>) => void;
  
  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const MountXContext = createContext<MountXContextType | undefined>(undefined);

export function MountXProvider({ children }: { children: ReactNode }) {
  const store = useMountXStore();
  
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'url' | 'history' | 'favorites' | 'settings'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Navigation history for back/forward
  const [navHistory, setNavHistory] = useState<string[]>(['home']);
  const [navIndex, setNavIndex] = useState(0);
  
  const canGoBack = navIndex > 0;
  const canGoForward = navIndex < navHistory.length - 1;
  
  const goBack = () => {
    if (canGoBack) {
      const newIndex = navIndex - 1;
      setNavIndex(newIndex);
      const view = navHistory[newIndex] as typeof currentView;
      setCurrentView(view);
    }
  };
  
  const goForward = () => {
    if (canGoForward) {
      const newIndex = navIndex + 1;
      setNavIndex(newIndex);
      const view = navHistory[newIndex] as typeof currentView;
      setCurrentView(view);
    }
  };
  
  const handleSetCurrentView = (view: typeof currentView) => {
    setCurrentView(view);
    // Add to nav history
    const newHistory = [...navHistory.slice(0, navIndex + 1), view];
    setNavHistory(newHistory);
    setNavIndex(newHistory.length - 1);
  };
  
  return (
    <MountXContext.Provider
      value={{
        currentView,
        setCurrentView: handleSetCurrentView,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        isSearching,
        setIsSearching,
        currentUrl,
        setCurrentUrl,
        navHistory,
        navIndex,
        canGoBack,
        canGoForward,
        goBack,
        goForward,
        history: store.history,
        favorites: store.favorites,
        settings: store.settings,
        currentRegion: store.currentRegion,
        setCurrentRegion: store.setCurrentRegion,
        addHistoryEntry: store.addHistoryEntry,
        clearHistory: store.clearHistory,
        toggleFavorite: store.toggleFavorite,
        isFavorite: store.isFavorite,
        updateSettings: store.updateSettings,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </MountXContext.Provider>
  );
}

export function useMountX() {
  const context = useContext(MountXContext);
  if (context === undefined) {
    throw new Error('useMountX must be used within a MountXProvider');
  }
  return context;
}
