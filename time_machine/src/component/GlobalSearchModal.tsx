import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Calendar, 
  Film, 
  Music, 
  Cpu, 
  ArrowRight, 
  Layers, 
  Loader2 
} from 'lucide-react';
import { GlobalSearchResult } from '../types';
import { api } from '../services/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: GlobalSearchResult) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'EVENT' | 'MOVIE' | 'MUSIC' | 'TECH'>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '/' && !isOpen) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await api.globalSearch(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const filteredResults = results.filter(r => {
    if (activeFilter === 'ALL') return true;
    return r.type === activeFilter;
  });

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'MOVIE': return <Film className="w-4 h-4 text-[#C05A3E]" />;
      case 'MUSIC': return <Music className="w-4 h-4 text-[#5A5A40]" />;
      case 'TECH': return <Cpu className="w-4 h-4 text-[#5A5A40]" />;
      default: return <Calendar className="w-4 h-4 text-[#5A5A40]" />;
    }
  };

  return (
    <div 
      id="global-search-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24"
      onClick={onClose}
    >
      <div 
        id="global-search-dialog"
        className="w-full max-w-2xl bg-white border border-[#E5E3D8] rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 sm:p-6 border-b border-[#E5E3D8] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#5A5A40] shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            placeholder="Search events, movies, songs, technologies (1990-2026)... e.g. 'UPI', 'Internet', 'Titanic', 'Chandrayaan'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#2C2C26] text-base sm:text-lg focus:outline-none placeholder:text-[#8C8A7D]"
          />
          {loading && <Loader2 className="w-5 h-5 animate-spin text-[#5A5A40] shrink-0" />}
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-[#F5F2EA] text-[#636158] hover:text-[#2C2C26] border border-[#E5E3D8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 bg-[#F5F2EA] border-b border-[#E5E3D8] flex items-center gap-2 overflow-x-auto text-xs">
          {(['ALL', 'EVENT', 'MOVIE', 'MUSIC', 'TECH'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1 rounded-full font-bold transition-all ${
                activeFilter === filter 
                  ? 'bg-[#5A5A40] text-white shadow-xs' 
                  : 'text-[#636158] hover:text-[#2C2C26] bg-white border border-[#E5E3D8]'
              }`}
            >
              {filter === 'ALL' ? 'All Results' : filter}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-2.5 scrollbar-thin">
          {!query.trim() ? (
            <div className="py-12 text-center text-[#8C8A7D] space-y-2">
              <Search className="w-8 h-8 mx-auto text-[#8C8A7D] mb-2 opacity-50" />
              <p className="text-sm">Type any keyword to search across 36+ years of world & Indian history</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
                {['1991 Reforms', 'Jio 4G', 'Google 1998', 'Dilwale Dulhania', 'Chandrayaan', 'iPhone'].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setQuery(sample)}
                    className="px-3 py-1 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] text-[#636158] hover:text-[#2C2C26] hover:border-[#5A5A40]"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredResults.length === 0 && !loading ? (
            <div className="py-12 text-center text-[#8C8A7D]">
              <p className="text-sm">No historical milestones matching "{query}"</p>
            </div>
          ) : (
            filteredResults.map((res) => (
              <div
                key={`${res.type}-${res.id}`}
                onClick={() => {
                  onSelectResult(res);
                  onClose();
                }}
                className="group p-4 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8] hover:border-[#5A5A40] cursor-pointer transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-full bg-white border border-[#E5E3D8] shrink-0">
                    {getResultIcon(res.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-[#8C8A7D]">
                      <span className="font-sans text-[#C05A3E] font-bold">{res.year}</span>
                      <span>•</span>
                      <span className="truncate">{res.subtitle}</span>
                    </div>
                    <h4 className="text-sm font-serif font-bold text-[#2C2C26] group-hover:text-[#5A5A40] transition-colors truncate">
                      {res.title}
                    </h4>
                    <p className="text-xs text-[#636158] line-clamp-1 truncate">{res.snippet}</p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-[#8C8A7D] group-hover:text-[#5A5A40] group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#F5F2EA] border-t border-[#E5E3D8] text-center text-[11px] text-[#8C8A7D]">
          Press <kbd className="px-2 py-0.5 bg-white border border-[#E5E3D8] rounded-md text-[#2C2C26]">ESC</kbd> to exit search
        </div>
      </div>
    </div>
  );
};
