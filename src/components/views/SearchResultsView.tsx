import { motion } from 'framer-motion';
import { Star, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useMountX } from '@/context/MountXContext';
import { cn } from '@/lib/utils';

export function SearchResultsView() {
  const {
    searchQuery,
    searchResults,
    searchImages,
    isSearching,
    toggleFavorite,
    isFavorite,
    setCurrentUrl,
    setCurrentView,
  } = useMountX();

  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Searching for "{searchQuery}"...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-6 py-8"
    >
      <h2 className="text-lg font-medium mb-6">
        Results for "<span className="text-primary">{searchQuery}</span>"
      </h2>

      {searchImages.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <ImageIcon className="w-4 h-4" />
            <span>Images</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {searchImages.map((image) => (
              <button
                key={image.url}
                type="button"
                onClick={() => {
                  if (image.sourceUrl) {
                    setCurrentUrl(image.sourceUrl);
                    setCurrentView('url');
                  }
                }}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/20 text-left"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-2 left-2 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.title}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-3">
        {searchResults.map((result, index) => (
          <motion.div
            key={result.url}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="result-card group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentUrl(result.url);
                    setCurrentView('url');
                  }}
                  className="flex items-center gap-2 text-primary hover:underline font-medium mb-1 group text-left"
                >
                  <span className="truncate">{result.title}</span>
                </button>
                <p className="text-xs text-muted-foreground mb-2 truncate">{result.url}</p>
                <p className="text-sm text-foreground/80 line-clamp-2">{result.snippet}</p>
              </div>

              <button
                onClick={() => toggleFavorite({ title: result.title, url: result.url, snippet: result.snippet })}
                className={cn(
                  "p-2 rounded-lg transition-all flex-shrink-0",
                  isFavorite(result.url)
                    ? "text-yellow-400 bg-yellow-400/10"
                    : "text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/10"
                )}
              >
                <Star className={cn("w-4 h-4", isFavorite(result.url) && "fill-current")} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {searchResults.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No results found for your search.</p>
        </div>
      )}
    </motion.div>
  );
}
