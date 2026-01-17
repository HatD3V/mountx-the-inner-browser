import { MountXSidebar } from './MountXSidebar';
import { MountXTopBar } from './MountXTopBar';
import { useMountX } from '@/context/MountXContext';
import { HomeView } from './views/HomeView';
import { SearchResultsView } from './views/SearchResultsView';
import { UrlPreviewView } from './views/UrlPreviewView';
import { HistoryView } from './views/HistoryView';
import { FavoritesView } from './views/FavoritesView';
import { SettingsView } from './views/SettingsView';
import mountainBg from '@/assets/mountain-bg.jpg';

export function MountXLayout() {
  const { currentView } = useMountX();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'search':
        return <SearchResultsView />;
      case 'url':
        return <UrlPreviewView />;
      case 'history':
        return <HistoryView />;
      case 'favorites':
        return <FavoritesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${mountainBg})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/90" />

      {/* App Container */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <MountXSidebar />

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <div className="p-4 pb-0">
            <MountXTopBar />
          </div>

          {/* Content */}
          <main className="flex-1 overflow-auto p-4">
            <div className="h-full">
              {renderView()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
