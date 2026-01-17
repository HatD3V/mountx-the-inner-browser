import { motion } from 'framer-motion';
import { Clock, Search, Globe, Trash2 } from 'lucide-react';
import { useMountX } from '@/context/MountXContext';
import { format } from 'date-fns';

export function HistoryView() {
  const { history, clearHistory } = useMountX();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-6 py-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">History</h2>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No browsing history yet.</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Your searches and visited sites will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="result-card flex items-center gap-4"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                entry.type === 'search' ? 'bg-primary/20' : 'bg-green-500/20'
              }`}>
                {entry.type === 'search' ? (
                  <Search className="w-4 h-4 text-primary" />
                ) : (
                  <Globe className="w-4 h-4 text-green-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{entry.text}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(entry.timestamp), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>

              <span className={`text-xs px-2 py-1 rounded-full ${
                entry.type === 'search' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-green-500/10 text-green-400'
              }`}>
                {entry.type === 'search' ? 'Search' : 'URL'}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
