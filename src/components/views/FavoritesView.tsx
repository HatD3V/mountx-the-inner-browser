import { motion } from 'framer-motion';
import { Star, ExternalLink, Trash2 } from 'lucide-react';
import { useMountX } from '@/context/MountXContext';

export function FavoritesView() {
  const { favorites, toggleFavorite } = useMountX();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-6 py-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
        </div>
        <h2 className="text-2xl font-semibold">Favorites</h2>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <Star className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No favorites yet.</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Star search results or sites to save them here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {favorites.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="result-card"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline font-medium mb-1 group"
                  >
                    <span className="truncate">{item.title}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </a>
                  <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                  {item.snippet && (
                    <p className="text-sm text-foreground/80 line-clamp-2 mt-1">{item.snippet}</p>
                  )}
                </div>

                <button
                  onClick={() => toggleFavorite({ title: item.title, url: item.url, snippet: item.snippet })}
                  className="glass-button p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
