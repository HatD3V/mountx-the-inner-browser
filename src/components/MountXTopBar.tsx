import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, Globe, ChevronDown } from 'lucide-react';
import { useMountX } from '@/context/MountXContext';
import { searchWeb, isUrl, normalizeUrl } from '@/lib/searchClient';
import { cn } from '@/lib/utils';
import type { Region } from '@/types/mountx';

const regions: { value: Region; label: string }[] = [
  { value: 'global', label: 'Global' },
  { value: 'us', label: 'US' },
  { value: 'eu', label: 'EU' },
  { value: 'asia', label: 'Asia' },
];

export function MountXTopBar() {
  const {
    currentRegion,
    setCurrentRegion,
    setCurrentView,
    setSearchQuery,
    setSearchResults,
    setSearchImages,
    setSearchNotice,
    setIsSearching,
    setCurrentUrl,
    addHistoryEntry,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
  } = useMountX();

  const [inputValue, setInputValue] = useState('');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const input = inputValue.trim();

    if (isUrl(input)) {
      // It's a URL
      const url = normalizeUrl(input);
      setCurrentUrl(url);
      addHistoryEntry('url', url);
      setCurrentView('url');
    } else {
      // It's a search query
      setSearchQuery(input);
      addHistoryEntry('search', input);
      setIsSearching(true);
      setSearchNotice(undefined);
      setCurrentView('search');

      try {
        const { results, images, notice } = await searchWeb(input, currentRegion);
        setSearchResults(results);
        setSearchImages(images);
        setSearchNotice(
          notice
            ? {
                message: notice,
                variant: 'warning',
              }
            : undefined
        );
      } catch (error) {
        console.error('Search failed', error);
        setSearchResults([]);
        setSearchImages([]);
        setSearchNotice({
          message: 'Search failed. Please try again in a moment.',
          variant: 'warning',
        });
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleReload = () => {
    // Simulate reload
    if (inputValue.trim()) {
      handleSubmit({ preventDefault: () => {} } as FormEvent);
    }
  };

  const handleHome = () => {
    setInputValue('');
    setCurrentView('home');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-panel px-4 py-3 flex items-center gap-3"
    >
      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className={cn(
            "glass-button p-2 rounded-lg",
            !canGoBack && "opacity-40 cursor-not-allowed"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={goForward}
          disabled={!canGoForward}
          className={cn(
            "glass-button p-2 rounded-lg",
            !canGoForward && "opacity-40 cursor-not-allowed"
          )}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={handleReload} className="glass-button p-2 rounded-lg">
          <RotateCw className="w-4 h-4" />
        </button>
        <button onClick={handleHome} className="glass-button p-2 rounded-lg">
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* Search/URL Bar */}
      <form onSubmit={handleSubmit} className="flex-1 relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search the web or enter a URL"
            className="w-full glass-input pl-11 pr-4 py-2.5 rounded-xl text-sm placeholder:text-muted-foreground/60 focus:outline-none"
          />
        </div>
      </form>

      {/* Region Selector */}
      <div className="relative">
        <button
          onClick={() => setShowRegionDropdown(!showRegionDropdown)}
          className="glass-button px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          <Globe className="w-4 h-4 text-primary" />
          <span>{regions.find(r => r.value === currentRegion)?.label}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {showRegionDropdown && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowRegionDropdown(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 glass-panel rounded-xl overflow-hidden z-50 min-w-[120px]"
            >
              {regions.map((region) => (
                <button
                  key={region.value}
                  onClick={() => {
                    setCurrentRegion(region.value);
                    setShowRegionDropdown(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors",
                    currentRegion === region.value && "text-primary bg-primary/10"
                  )}
                >
                  {region.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </motion.header>
  );
}
