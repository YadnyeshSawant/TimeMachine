import React, { useState, useEffect } from 'react';
import { Header, ActiveAppView } from './components/Header';
import { YearSelector } from './components/YearSelector';
import { Timeline } from './components/Timeline';
import { EventModal } from './components/EventModal';
import { BirthdateMode } from './components/BirthdateMode';
import { ThenVsNowModal } from './components/ThenVsNowModal';
import { DecadeExplorer } from './components/DecadeExplorer';
import { HistoricalMap } from './components/HistoricalMap';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SavedBookmarksModal } from './components/SavedBookmarksModal';
import { GlobalAudioBar } from './components/GlobalAudioBar';
import { RetroCassetteModal } from './components/RetroCassetteModal';
import { MovieTrailerModal } from './components/MovieTrailerModal';
import { InflationCalculatorModal } from './components/InflationCalculatorModal';
import { TechEvolutionComparator } from './components/TechEvolutionComparator';
import { VintageTimeCapsuleModal } from './components/VintageTimeCapsuleModal';
import { LifeJourneyMode } from './components/LifeJourneyMode';
import { 
  YearData, 
  EventCategory, 
  HistoricalEvent, 
  MovieRecord, 
  MusicRecord, 
  GlobalSearchResult 
} from './types';
import { api } from './services/api';
import { audioService } from './services/audioService';
import { Clock, ShieldCheck, Database, Sparkles, Coins, Cpu, Newspaper, Stamp, Heart } from 'lucide-react';

const STORAGE_KEY_BOOKMARKS = 'timemachine_saved_events_v1';

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveAppView>('TIMELINE');
  const [selectedYear, setSelectedYear] = useState<number>(1995);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('ALL');
  const [yearData, setYearData] = useState<YearData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [savedEvents, setSavedEvents] = useState<HistoricalEvent[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);

  // Exact Date Filter State
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Media & Immersion Modals
  const [selectedMovieForTrailer, setSelectedMovieForTrailer] = useState<MovieRecord | null>(null);
  const [isWalkmanOpen, setIsWalkmanOpen] = useState<boolean>(false);
  const [isInflationModalOpen, setIsInflationModalOpen] = useState<boolean>(false);
  const [isTechComparatorOpen, setIsTechComparatorOpen] = useState<boolean>(false);

  // Personalization & Social Sharing Modal
  const [isCardGeneratorOpen, setIsCardGeneratorOpen] = useState<boolean>(false);
  const [cardGeneratorYear, setCardGeneratorYear] = useState<number>(1995);

  // Load saved bookmarks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (stored) {
        setSavedEvents(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load bookmarks', e);
    }
  }, []);

  // Save bookmarks to localStorage
  const handleToggleBookmark = (event: HistoricalEvent) => {
    setSavedEvents(prev => {
      const exists = prev.some(e => e.id === event.id);
      let updated: HistoricalEvent[];
      if (exists) {
        updated = prev.filter(e => e.id !== event.id);
      } else {
        updated = [event, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleRemoveBookmark = (id: string) => {
    setSavedEvents(prev => {
      const updated = prev.filter(e => e.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleClearAllBookmarks = () => {
    setSavedEvents([]);
    localStorage.removeItem(STORAGE_KEY_BOOKMARKS);
  };

  // Fetch Year Data
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getYearData(selectedYear)
      .then(data => {
        if (isMounted) {
          setYearData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'm' || e.key === 'M') {
        if (!selectedEvent && !selectedMovieForTrailer) {
          setIsWalkmanOpen(prev => !prev);
        }
      } else if (e.key === 'i' || e.key === 'I') {
        if (!selectedEvent && !selectedMovieForTrailer && !isWalkmanOpen) {
          setIsInflationModalOpen(prev => !prev);
        }
      } else if (e.key === 't' || e.key === 'T') {
        if (!selectedEvent && !selectedMovieForTrailer && !isWalkmanOpen) {
          setIsTechComparatorOpen(prev => !prev);
        }
      } else if (e.key === 'p' || e.key === 'P') {
        if (!selectedEvent && !selectedMovieForTrailer && !isWalkmanOpen && !isInflationModalOpen && !isTechComparatorOpen) {
          setCardGeneratorYear(selectedYear);
          setIsCardGeneratorOpen(prev => !prev);
        }
      } else if (e.key === 'ArrowLeft' && currentView === 'TIMELINE' && !selectedEvent && !selectedMovieForTrailer && !isWalkmanOpen && !isInflationModalOpen && !isTechComparatorOpen && !isCardGeneratorOpen) {
        if (selectedYear > 1990) {
          setSelectedYear(prev => prev - 1);
          setSelectedMonth(null);
          setSelectedDay(null);
        }
      } else if (e.key === 'ArrowRight' && currentView === 'TIMELINE' && !selectedEvent && !selectedMovieForTrailer && !isWalkmanOpen && !isInflationModalOpen && !isTechComparatorOpen && !isCardGeneratorOpen) {
        if (selectedYear < 2026) {
          setSelectedYear(prev => prev + 1);
          setSelectedMonth(null);
          setSelectedDay(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, selectedYear, selectedEvent, selectedMovieForTrailer, isWalkmanOpen, isInflationModalOpen, isTechComparatorOpen, isCardGeneratorOpen]);

  const handleSelectSearchResult = async (result: GlobalSearchResult) => {
    setSelectedYear(result.year);
    setSelectedMonth(null);
    setSelectedDay(null);
    if (result.type === 'EVENT') {
      try {
        const { event } = await api.getEventById(result.id);
        setSelectedEvent(event);
        setCurrentView('TIMELINE');
      } catch (e) {
        setCurrentView('TIMELINE');
      }
    } else {
      setCurrentView('TIMELINE');
      if (result.type === 'MOVIE') setSelectedCategory('MOVIES');
      else if (result.type === 'MUSIC') setSelectedCategory('MUSIC');
      else if (result.type === 'TECH') setSelectedCategory('TECHNOLOGY');
    }
  };

  const handleOpenWalkman = (music?: MusicRecord) => {
    if (music) {
      audioService.togglePlayMusic({
        id: music.id,
        title: music.title,
        artist: music.artist,
        album: music.album,
        coverUrl: music.coverUrl,
        year: music.year,
        originCountry: music.originCountry,
        genres: music.genres
      });
    }
    setIsWalkmanOpen(true);
  };

  const handleSelectExactDate = (month: number | null, day: number | null) => {
    setSelectedMonth(month);
    setSelectedDay(day);
  };

  const savedIdsSet = new Set(savedEvents.map(e => e.id));

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2C2C26] flex flex-col selection:bg-[#5A5A40] selection:text-white font-sans">
      
      {/* Top Sticky Header */}
      <Header
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenCardGenerator={() => {
          setCardGeneratorYear(selectedYear);
          setIsCardGeneratorOpen(true);
        }}
        savedCount={savedEvents.length}
        selectedYear={selectedYear}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* If Timeline or Map View: Show Chrono Dial Year Selector */}
        {(currentView === 'TIMELINE' || currentView === 'MAP') && (
          <YearSelector
            currentYear={selectedYear}
            onSelectYear={(yr) => {
              setSelectedYear(yr);
              setSelectedMonth(null);
              setSelectedDay(null);
            }}
            eraMoniker={yearData?.eraMoniker}
            tagline={yearData?.tagline}
          />
        )}

        {/* View Switching */}
        {currentView === 'TIMELINE' && (
          <Timeline
            yearData={yearData}
            loading={loading}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
            savedEventIds={savedIdsSet}
            onToggleSaveEvent={handleToggleBookmark}
            onOpenLiveWiki={() => {}}
            onWatchTrailer={(movie) => setSelectedMovieForTrailer(movie)}
            onOpenWalkman={handleOpenWalkman}
            onOpenInflationCalculator={() => setIsInflationModalOpen(true)}
            onOpenTechComparator={() => setIsTechComparatorOpen(true)}
            onOpenCardGenerator={(yr) => {
              setCardGeneratorYear(yr || selectedYear);
              setIsCardGeneratorOpen(true);
            }}
            selectedMonth={selectedMonth}
            selectedDay={selectedDay}
            onSelectExactDate={handleSelectExactDate}
          />
        )}

        {currentView === 'BIRTHDATE' && (
          <BirthdateMode
            onExploreYear={(yr) => {
              setSelectedYear(yr);
              setSelectedMonth(null);
              setSelectedDay(null);
              setCurrentView('TIMELINE');
            }}
          />
        )}

        {currentView === 'LIFE_JOURNEY' && (
          <LifeJourneyMode
            onExploreYear={(yr) => {
              setSelectedYear(yr);
              setSelectedMonth(null);
              setSelectedDay(null);
              setCurrentView('TIMELINE');
            }}
            onOpenCardGenerator={(yr) => {
              setCardGeneratorYear(yr);
              setIsCardGeneratorOpen(true);
            }}
          />
        )}

        {currentView === 'COMPARE' && (
          <ThenVsNowModal
            initialYear1={selectedYear === 2026 ? 1995 : selectedYear}
            initialYear2={2026}
          />
        )}

        {currentView === 'DECADES' && (
          <DecadeExplorer
            onSelectYear={(yr) => {
              setSelectedYear(yr);
              setSelectedMonth(null);
              setSelectedDay(null);
              setCurrentView('TIMELINE');
            }}
          />
        )}

        {currentView === 'MAP' && (
          <HistoricalMap
            events={yearData?.events || []}
            selectedYear={selectedYear}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
          />
        )}

      </main>

      {/* Event Details Deep Dive Modal */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        isSaved={selectedEvent ? savedIdsSet.has(selectedEvent.id) : false}
        onToggleSave={handleToggleBookmark}
      />

      {/* Global Keyword Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />

      {/* Bookmarks Vault Modal */}
      <SavedBookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        savedEvents={savedEvents}
        onRemoveBookmark={handleRemoveBookmark}
        onClearAll={handleClearAllBookmarks}
        onSelectEvent={(evt) => setSelectedEvent(evt)}
      />

      {/* Cinema Movie Trailer Modal */}
      <MovieTrailerModal
        movie={selectedMovieForTrailer}
        isOpen={Boolean(selectedMovieForTrailer)}
        onClose={() => setSelectedMovieForTrailer(null)}
      />

      {/* Retro Cassette Walkman Deck Modal */}
      <RetroCassetteModal
        isOpen={isWalkmanOpen}
        onClose={() => setIsWalkmanOpen(false)}
        year={selectedYear}
        allYearTracks={yearData?.music || []}
      />

      {/* Interactive Price & Inflation Calculator Modal */}
      <InflationCalculatorModal
        isOpen={isInflationModalOpen}
        onClose={() => setIsInflationModalOpen(false)}
        baseYear={selectedYear}
      />

      {/* Tech Spec Evolution Comparator Modal */}
      <TechEvolutionComparator
        isOpen={isTechComparatorOpen}
        onClose={() => setIsTechComparatorOpen(false)}
        initialYear={selectedYear}
      />

      {/* Vintage Time-Capsule Postcard & Story Card Modal */}
      <VintageTimeCapsuleModal
        isOpen={isCardGeneratorOpen}
        onClose={() => setIsCardGeneratorOpen(false)}
        year={cardGeneratorYear}
        initialYearData={cardGeneratorYear === selectedYear ? yearData : undefined}
      />

      {/* Floating Global Audio Player Bar */}
      <GlobalAudioBar onOpenDeck={() => setIsWalkmanOpen(true)} />

      {/* Footer */}
      <footer className="border-t border-[#E5E3D8] bg-[#F5F2EA] py-8 px-4 sm:px-8 mt-16 text-[#8C8A7D] text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5A5A40] text-white flex items-center justify-center shadow-sm">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-[#2C2C26] text-sm uppercase tracking-wide">TIME MACHINE</span>
              <span className="text-[#8C8A7D] mx-2">•</span>
              <span>1990 – 2026 Interactive Historical Platform</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#636158] font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Wikimedia Foundation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#C05A3E]" />
              <span>TMDB Movie Catalog</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8C8A7D]" />
              <span>MusicBrainz Discography</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
