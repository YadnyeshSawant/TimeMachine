import React from 'react';
import { 
  Compass, 
  Sparkles, 
  Search, 
  Bookmark, 
  GitCompare, 
  Calendar, 
  Layers, 
  MapPin,
  Clock,
  Heart,
  Stamp
} from 'lucide-react';

export type ActiveAppView = 'TIMELINE' | 'BIRTHDATE' | 'LIFE_JOURNEY' | 'COMPARE' | 'DECADES' | 'MAP';

interface HeaderProps {
  currentView: ActiveAppView;
  onViewChange: (view: ActiveAppView) => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenCardGenerator?: () => void;
  savedCount: number;
  selectedYear: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenSearch,
  onOpenBookmarks,
  onOpenCardGenerator,
  savedCount,
  selectedYear
}) => {
  return (
    <header id="app-header" className="sticky top-0 z-40 bg-[#FDFCF8]/90 backdrop-blur-md border-b border-[#E5E3D8] px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Logo & Brand */}
        <div 
          id="brand-logo" 
          onClick={() => onViewChange('TIMELINE')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 bg-[#5A5A40] rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
            <Clock className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold tracking-tight uppercase text-[#2C2C26]">Time Machine</h1>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#F5F2EA] text-[#5A5A40] border border-[#E5E3D8]">
                1990–2026
              </span>
            </div>
            <p className="text-[11px] text-[#8C8A7D] hidden sm:block">Interactive Historical Archive</p>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <nav id="view-navigation" className="hidden md:flex items-center gap-1 bg-[#F5F2EA] p-1.5 rounded-full border border-[#E5E3D8]">
          <button
            id="nav-timeline"
            onClick={() => onViewChange('TIMELINE')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'TIMELINE' 
                ? 'bg-[#5A5A40] text-white shadow-sm font-medium' 
                : 'text-[#636158] hover:text-[#2C2C26] hover:bg-white hover:shadow-xs'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Timeline
          </button>

          <button
            id="nav-birthdate"
            onClick={() => onViewChange('BIRTHDATE')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'BIRTHDATE' 
                ? 'bg-[#5A5A40] text-white shadow-sm font-medium' 
                : 'text-[#636158] hover:text-[#2C2C26] hover:bg-white hover:shadow-xs'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Birth Capsule
          </button>

          <button
            id="nav-life-journey"
            onClick={() => onViewChange('LIFE_JOURNEY')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'LIFE_JOURNEY' 
                ? 'bg-[#5A5A40] text-white shadow-sm font-medium' 
                : 'text-[#636158] hover:text-[#2C2C26] hover:bg-white hover:shadow-xs'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#C05A3E]" />
            Life Journey
          </button>

          <button
            id="nav-compare"
            onClick={() => onViewChange('COMPARE')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'COMPARE' 
                ? 'bg-[#5A5A40] text-white shadow-sm font-medium' 
                : 'text-[#636158] hover:text-[#2C2C26] hover:bg-white hover:shadow-xs'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            Then vs Now
          </button>

          <button
            id="nav-decades"
            onClick={() => onViewChange('DECADES')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'DECADES' 
                ? 'bg-[#5A5A40] text-white shadow-sm font-medium' 
                : 'text-[#636158] hover:text-[#2C2C26] hover:bg-white hover:shadow-xs'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Decades
          </button>

          <button
            id="nav-map"
            onClick={() => onViewChange('MAP')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'MAP' 
                ? 'bg-[#5A5A40] text-white shadow-sm font-medium' 
                : 'text-[#636158] hover:text-[#2C2C26] hover:bg-white hover:shadow-xs'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Map
          </button>
        </nav>

        {/* Right Action Icons: Postcard generator, Search & Bookmarks */}
        <div className="flex items-center gap-2">
          
          {/* Postcard generator button */}
          {onOpenCardGenerator && (
            <button
              id="header-postcard-generator-btn"
              onClick={onOpenCardGenerator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6EC] border border-[#E2DCBA] text-[#5A5A40] hover:bg-[#5A5A40] hover:text-white hover:shadow-xs text-xs font-bold transition-all cursor-pointer"
              title="Generate Shareable Vintage Postcard"
            >
              <Stamp className="w-3.5 h-3.5 text-[#C05A3E]" />
              <span className="hidden sm:inline">Card Generator</span>
            </button>
          )}

          {/* Global Search Button */}
          <button
            id="global-search-trigger"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E5E3D8] text-[#636158] hover:text-[#2C2C26] hover:border-[#8C8A7D] hover:shadow-xs text-xs font-medium transition-all group"
            title="Search history (1990-2026)"
          >
            <Search className="w-3.5 h-3.5 text-[#8C8A7D] group-hover:text-[#5A5A40] transition-colors" />
            <span className="hidden lg:inline">Search...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#F5F2EA] text-[#8C8A7D] rounded-full border border-[#E5E3D8]">
              /
            </kbd>
          </button>

          {/* Bookmarks Vault Button */}
          <button
            id="bookmarks-vault-trigger"
            onClick={onOpenBookmarks}
            className="relative p-2 rounded-full bg-white border border-[#E5E3D8] text-[#636158] hover:text-[#5A5A40] hover:border-[#8C8A7D] hover:shadow-xs transition-all"
            title="Saved Historical Milestones"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C05A3E] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden items-center justify-around pt-2.5 mt-2 border-t border-[#E5E3D8] text-[10px] font-semibold text-[#8C8A7D]">
        <button 
          onClick={() => onViewChange('TIMELINE')} 
          className={`flex flex-col items-center gap-0.5 ${currentView === 'TIMELINE' ? 'text-[#5A5A40] font-bold' : 'hover:text-[#2C2C26]'}`}
        >
          <Compass className="w-3.5 h-3.5" />
          Timeline
        </button>
        <button 
          onClick={() => onViewChange('BIRTHDATE')} 
          className={`flex flex-col items-center gap-0.5 ${currentView === 'BIRTHDATE' ? 'text-[#5A5A40] font-bold' : 'hover:text-[#2C2C26]'}`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Birthdate
        </button>
        <button 
          onClick={() => onViewChange('LIFE_JOURNEY')} 
          className={`flex flex-col items-center gap-0.5 ${currentView === 'LIFE_JOURNEY' ? 'text-[#5A5A40] font-bold' : 'hover:text-[#2C2C26]'}`}
        >
          <Heart className="w-3.5 h-3.5 text-[#C05A3E]" />
          My Journey
        </button>
        <button 
          onClick={() => onViewChange('COMPARE')} 
          className={`flex flex-col items-center gap-0.5 ${currentView === 'COMPARE' ? 'text-[#5A5A40] font-bold' : 'hover:text-[#2C2C26]'}`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          Then/Now
        </button>
        <button 
          onClick={() => onViewChange('DECADES')} 
          className={`flex flex-col items-center gap-0.5 ${currentView === 'DECADES' ? 'text-[#5A5A40] font-bold' : 'hover:text-[#2C2C26]'}`}
        >
          <Layers className="w-3.5 h-3.5" />
          Decades
        </button>
        <button 
          onClick={() => onViewChange('MAP')} 
          className={`flex flex-col items-center gap-0.5 ${currentView === 'MAP' ? 'text-[#5A5A40] font-bold' : 'hover:text-[#2C2C26]'}`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Map
        </button>
      </div>
    </header>
  );
};
