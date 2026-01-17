import { motion } from 'framer-motion';
import { Mountain, Search, Globe, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Intelligent search with region-specific results',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Browse from multiple virtual locations',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your browsing stays private and secure',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed and performance',
  },
];

export function HomeView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-full px-6 py-12"
    >
      {/* Hero */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-center mb-12"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-primary/20 flex items-center justify-center animate-float">
          <Mountain className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-5xl font-bold mb-4">
          Welcome to <span className="text-gradient">MountX</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
          Your gateway to a smarter, faster browsing experience. Search the web or visit any site — all from one place.
        </p>
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
              className="glass-panel-light p-6 rounded-2xl text-center hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-muted-foreground">
          <span className="text-primary">Pro tip:</span> Type a URL to visit a site, or enter any text to search the web
        </p>
      </motion.div>
    </motion.div>
  );
}
