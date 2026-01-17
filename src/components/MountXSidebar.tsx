import { motion } from 'framer-motion';
import { Home, Clock, Star, Layers, Settings, ChevronLeft, ChevronRight, Mountain } from 'lucide-react';
import { useMountX } from '@/context/MountXContext';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export function MountXSidebar() {
  const { currentView, setCurrentView, sidebarCollapsed, setSidebarCollapsed } = useMountX();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "glass-panel h-full flex flex-col transition-all duration-300 relative z-20",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 p-4 border-b border-white/5",
        sidebarCollapsed && "justify-center"
      )}>
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Mountain className="w-5 h-5 text-primary" />
        </div>
        {!sidebarCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold text-gradient"
          >
            MountX
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || 
            (currentView === 'search' && item.id === 'home') || 
            (currentView === 'url' && item.id === 'home');

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "nav-item w-full",
                isActive && "nav-item-active",
                sidebarCollapsed && "justify-center px-3"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            "nav-item w-full",
            sidebarCollapsed && "justify-center px-3"
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
