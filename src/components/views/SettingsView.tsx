import { motion } from 'framer-motion';
import { Settings, Globe, Monitor, ChevronDown } from 'lucide-react';
import { useMountX } from '@/context/MountXContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Region } from '@/types/mountx';

const regions: { value: Region; label: string; description: string }[] = [
  { value: 'global', label: 'Global', description: 'Best available worldwide' },
  { value: 'us', label: 'United States', description: 'US-based servers' },
  { value: 'eu', label: 'Europe', description: 'EU-based servers' },
  { value: 'asia', label: 'Asia', description: 'Asia-Pacific servers' },
];

export function SettingsView() {
  const { settings, updateSettings } = useMountX();
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-6 py-8"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold">Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Default Region */}
        <div className="glass-panel-light rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Default Region</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose your preferred region for searches and browsing.
              </p>

              <div className="relative">
                <button
                  onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                  className="w-full glass-input px-4 py-3 rounded-xl flex items-center justify-between text-left"
                >
                  <div>
                    <p className="font-medium">
                      {regions.find(r => r.value === settings.defaultRegion)?.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {regions.find(r => r.value === settings.defaultRegion)?.description}
                    </p>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    showRegionDropdown && "rotate-180"
                  )} />
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
                      className="absolute left-0 right-0 top-full mt-2 glass-panel rounded-xl overflow-hidden z-50"
                    >
                      {regions.map((region) => (
                        <button
                          key={region.value}
                          onClick={() => {
                            updateSettings({ defaultRegion: region.value });
                            setShowRegionDropdown(false);
                          }}
                          className={cn(
                            "w-full px-4 py-3 text-left hover:bg-white/10 transition-colors",
                            settings.defaultRegion === region.value && "bg-primary/10"
                          )}
                        >
                          <p className="font-medium">{region.label}</p>
                          <p className="text-xs text-muted-foreground">{region.description}</p>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Behavior */}
        <div className="glass-panel-light rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Monitor className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Search Behavior</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose how search results are displayed.
              </p>

              <div className="space-y-2">
                <label className={cn(
                  "flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all",
                  settings.openInMountX 
                    ? "bg-primary/10 border border-primary/30" 
                    : "bg-muted/30 hover:bg-muted/50"
                )}>
                  <input
                    type="radio"
                    name="searchBehavior"
                    checked={settings.openInMountX}
                    onChange={() => updateSettings({ openInMountX: true })}
                    className="sr-only"
                  />
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                    settings.openInMountX ? "border-primary" : "border-muted-foreground"
                  )}>
                    {settings.openInMountX && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Show results in MountX</p>
                    <p className="text-xs text-muted-foreground">
                      View and interact with results inside the app
                    </p>
                  </div>
                </label>

                <label className={cn(
                  "flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all",
                  !settings.openInMountX 
                    ? "bg-primary/10 border border-primary/30" 
                    : "bg-muted/30 hover:bg-muted/50"
                )}>
                  <input
                    type="radio"
                    name="searchBehavior"
                    checked={!settings.openInMountX}
                    onChange={() => updateSettings({ openInMountX: false })}
                    className="sr-only"
                  />
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                    !settings.openInMountX ? "border-primary" : "border-muted-foreground"
                  )}>
                    {!settings.openInMountX && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Redirect externally</p>
                    <p className="text-xs text-muted-foreground">
                      Open links directly in a new browser tab
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="glass-panel-light rounded-2xl p-6 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="text-gradient font-semibold">MountX</span> • Version 1.0.0
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            A modern meta-browser experience
          </p>
        </div>
      </div>
    </motion.div>
  );
}
