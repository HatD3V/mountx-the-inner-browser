import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Star, Lock } from 'lucide-react';
import { useMountX } from '@/context/MountXContext';
import { cn } from '@/lib/utils';

export function UrlPreviewView() {
  const { currentUrl, toggleFavorite, isFavorite } = useMountX();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [currentUrl]);

  const hostname = (() => {
    try {
      return new URL(currentUrl).hostname;
    } catch {
      return currentUrl;
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-full px-6 py-12"
    >
      <div className="w-full max-w-4xl">
        {/* URL Info Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel-light rounded-2xl p-4 mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-green-400" />
                <span className="text-sm text-green-400">Secure</span>
              </div>
              <p className="text-sm text-muted-foreground truncate max-w-md">{currentUrl}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite({ title: hostname, url: currentUrl })}
              className={cn(
                "glass-button p-2 rounded-lg transition-all",
                isFavorite(currentUrl)
                  ? "text-yellow-400 bg-yellow-400/10"
                  : "text-muted-foreground hover:text-yellow-400"
              )}
            >
              <Star className={cn("w-5 h-5", isFavorite(currentUrl) && "fill-current")} />
            </button>
          </div>
        </motion.div>

        {/* Mock Browser Window */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl overflow-hidden"
        >
          {/* Browser Chrome */}
          <div className="bg-secondary/50 px-4 py-3 flex items-center gap-3 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <div className="flex-1 bg-muted/50 rounded-lg px-4 py-1.5 text-xs text-muted-foreground truncate">
              {currentUrl}
            </div>
          </div>

          {/* Content Area */}
          <div className="relative aspect-video bg-gradient-to-b from-background/50 to-background/80">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-glow">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm">Loading {hostname}</p>
                  <p className="text-xs text-muted-foreground/70">Rendering inside MountX</p>
                </div>
              </div>
            )}
            <iframe
              key={currentUrl}
              src={currentUrl}
              title={`Preview of ${hostname}`}
              className={cn(
                "absolute inset-0 h-full w-full border-0 transition-opacity",
                isLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
