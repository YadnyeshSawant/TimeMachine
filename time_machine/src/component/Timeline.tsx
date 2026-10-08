import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe, 
  Flag, 
  Film, 
  Music, 
  Cpu, 
  Users, 
  Wifi, 
  Crown, 
  Award, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  RefreshCw,
  TrendingUp, 
  MapPin,
  Radio,
  Disc,
  Play,
  Clapperboard,
  Newspaper,
  Coins,
  Sliders,
  Calendar as CalendarIcon,
  X,
  ArrowRight,
  Stamp
} from 'lucide-react';
import { 
  YearData, 
  EventCategory, 
  HistoricalEvent, 
  MovieRecord, 
  MusicRecord, 
  TechnologyMilestone 
} from '../types';
import { CategoryFilter } from './CategoryFilter';
import { TimelineEventCard } from './TimelineEventCard';
import { MovieCard } from './MovieCard';
import { MusicCard } from './MusicCard';
import { TechnologyCard } from './TechnologyCard';
import { TimeTravelerDispatch } from './TimeTravelerDispatch';
import { ExactDateExplorer } from './ExactDateExplorer';
import { api } from '../services/api';
import { audioService } from '../services/audioService';
import { MONTH_NAMES } from '../data/historicalEconomicsAndTech';

interface TimelineProps {
  yearData: YearData | null;
  loading: boolean;
  selectedCategory: EventCategory;
  onSelectCategory: (cat: EventCategory) => void;
  onSelectEvent: (event: HistoricalEvent) => void;
  savedEventIds: Set<string>;
  onToggleSaveEvent: (event: HistoricalEvent) => void;
  onOpenLiveWiki: () => void;
  onWatchTrailer?: (movie: MovieRecord) => void;
  onOpenWalkman?: (music?: MusicRecord) => void;
  onOpenInflationCalculator?: () => void;
  onOpenTechComparator?: () => void;
  onOpenCardGenerator?: (year: number) => void;
  selectedMonth?: number | null;
  selectedDay?: number | null;
  onSelectExactDate?: (month: number | null, day: number | null) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  yearData,
  loading,
  selectedCategory,
  onSelectCategory,
  onSelectEvent,
  savedEventIds,
  onToggleSaveEvent,
  onWatchTrailer,
  onOpenWalkman,
  onOpenInflationCalculator,
  onOpenTechComparator,
  onOpenCardGenerator,
  selectedMonth = null,
  selectedDay = null,
  onSelectExactDate
}) => {
  const [wikiData, setWikiData] = useState<any>(null);
  const [loadingWiki, setLoadingWiki] = useState(false);
  const [isExactDateOpen, setIsExactDateOpen] = useState<boolean>(false);

  useEffect(() => {
    if (yearData) {
      setLoadingWiki(true);
      api.getWikimediaLive(yearData.year)
        .then(data => setWikiData(data))
        .catch(() => setWikiData(null))
        .finally(() => setLoadingWiki(false));
    }
  }, [yearData?.year]);

  // Filter events if exact date is active (unconditional hook execution)
  const filteredEvents = useMemo(() => {
    if (!yearData) return [];
    if (!selectedMonth) return yearData.events;

    const monthPadded = String(selectedMonth).padStart(2, '0');
    const dayPadded = selectedDay ? String(selectedDay).padStart(2, '0') : '';

    const matched = yearData.events.filter(e => {
      if (!e.date) return false;
      if (selectedDay) {
        return e.date.includes(`-${monthPadded}-${dayPadded}`) || e.date.includes(`-${monthPadded}-`);
      }
      return e.date.includes(`-${monthPadded}`);
    });

    return matched.length > 0 ? matched : yearData.events;
  }, [yearData, selectedMonth, selectedDay]);

  if (loading || !yearData) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4 text-[#8C8A7D]">
        <RefreshCw className="w-10 h-10 animate-spin text-[#5A5A40]" />
        <p className="text-sm font-serif italic tracking-wide">Traversing through historical archives...</p>
      </div>
    );
  }

  // Calculate category counts
  const categoryCounts: Record<string, number> = {
    ALL: filteredEvents.length + yearData.movies.length + yearData.music.length + yearData.technology.length,
    WORLD_EVENTS: filteredEvents.filter(e => e.category === 'WORLD_EVENTS').length,
    INDIA_EVENTS: filteredEvents.filter(e => e.category === 'INDIA_EVENTS').length,
    MOVIES: yearData.movies.length,
    MUSIC: yearData.music.length,
    TECHNOLOGY: yearData.technology.length + filteredEvents.filter(e => e.category === 'TECHNOLOGY').length,
    SCIENCE: filteredEvents.filter(e => e.category === 'SCIENCE').length,
    SPORTS: filteredEvents.filter(e => e.category === 'SPORTS').length,
    CULTURE: filteredEvents.filter(e => e.category === 'CULTURE').length,
  };

  const handleStartEraRadio = () => {
    if (yearData.music.length > 0) {
      audioService.startEraRadio(yearData.music, 0);
    }
  };

  return (
    <div id="year-timeline-content" className="w-full space-y-8 animate-fadeIn">
      
      {/* Year Overview Banner */}
      <div className="bg-[#F5F2EA] border border-[#E5E3D8] rounded-[32px] p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="relative z-10 space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-white border border-[#E5E3D8] text-[#5A5A40] text-xs font-bold uppercase tracking-wider">
                Year in Perspective
              </span>
              <span className="text-xs font-serif italic text-[#8C8A7D]">
                Decade of the {yearData.decade}s
              </span>
            </div>

            {/* Quick Media Launch Action Bar */}
            <div className="flex items-center gap-2">
              {onOpenCardGenerator && (
                <button
                  onClick={() => onOpenCardGenerator(yearData.year)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6EC] hover:bg-[#FAF0D8] border border-[#E2DCBA] text-[#5A5A40] text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                  title="Generate Vintage Postcard & Story Card"
                >
                  <Stamp className="w-3.5 h-3.5 text-[#C05A3E]" />
                  <span>Vintage Postcard</span>
                </button>
              )}

              {yearData.music.length > 0 && (
                <button
                  onClick={handleStartEraRadio}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Play {yearData.year} Radio</span>
                </button>
              )}

              {onOpenWalkman && (
                <button
                  onClick={() => onOpenWalkman()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FDFCF8] border border-[#E5E3D8] text-[#2C2C26] text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <Disc className="w-3.5 h-3.5 text-[#C05A3E]" />
                  <span>Walkman Deck</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2C2C26] tracking-tight">
              {yearData.title}
            </h1>
            <p className="text-base font-serif italic text-[#C05A3E] mt-1">
              "{yearData.tagline}"
            </p>
          </div>

          <p className="text-sm text-[#636158] max-w-4xl leading-relaxed">
            {yearData.summary}
          </p>

          {/* Key Global Indicators / Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/80 p-3 rounded-2xl border border-[#E5E3D8]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#8C8A7D] font-medium mb-1">
                <Users className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>World Population</span>
              </div>
              <div className="font-serif font-bold text-sm text-[#2C2C26]">
                {yearData.statistics.worldPopulation}
              </div>
            </div>

            {yearData.statistics.globalInternetUsers && (
              <div className="bg-white/80 p-3 rounded-2xl border border-[#E5E3D8]">
                <div className="flex items-center gap-1.5 text-[11px] text-[#8C8A7D] font-medium mb-1">
                  <Wifi className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Internet Users</span>
                </div>
                <div className="font-serif font-bold text-sm text-[#2C2C26]">
                  {yearData.statistics.globalInternetUsers}
                </div>
              </div>
            )}

            {yearData.statistics.bestPictureWinner && (
              <div className="bg-white/80 p-3 rounded-2xl border border-[#E5E3D8]">
                <div className="flex items-center gap-1.5 text-[11px] text-[#8C8A7D] font-medium mb-1">
                  <Award className="w-3.5 h-3.5 text-[#C05A3E]" />
                  <span>Oscar Best Picture</span>
                </div>
                <div className="font-serif font-bold text-xs text-[#2C2C26] truncate">
                  {yearData.statistics.bestPictureWinner}
                </div>
              </div>
            )}

            {yearData.statistics.topTechCompany && (
              <div className="bg-white/80 p-3 rounded-2xl border border-[#E5E3D8]">
                <div className="flex items-center gap-1.5 text-[11px] text-[#8C8A7D] font-medium mb-1">
                  <Cpu className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Dominant Tech</span>
                </div>
                <div className="font-serif font-bold text-xs text-[#2C2C26] truncate">
                  {yearData.statistics.topTechCompany}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* --- DEEPER IMMERSION & "DAY IN THE LIFE" MODULES BAR --- */}
      <div className="bg-[#FAF8F2] border border-[#E5E3D8] rounded-[28px] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#2C2C26]">
                "Day in the Life" & Deeper Immersion Modules
              </h3>
              <p className="text-[11px] text-[#8C8A7D]">
                Step inside {yearData.year} with exact date newspaper archives, inflation calculators, and tech evolutions.
              </p>
            </div>
          </div>

          {selectedMonth && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#C05A3E]/10 border border-[#C05A3E]/30 text-[#C05A3E] text-xs font-bold flex items-center gap-1.5">
                <CalendarIcon className="w-3 h-3" />
                <span>Filtered: {MONTH_NAMES[selectedMonth - 1]} {selectedDay || ''}</span>
              </span>
              <button
                onClick={() => onSelectExactDate && onSelectExactDate(null, null)}
                className="p-1 text-[#8C8A7D] hover:text-[#2C2C26] rounded-full hover:bg-[#E5E3D8] transition-colors"
                title="Reset to full year"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Module 1: Exact Date & Newspaper Filter */}
          <button
            onClick={() => setIsExactDateOpen(prev => !prev)}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer group ${
              isExactDateOpen || selectedMonth
                ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm'
                : 'bg-white text-[#2C2C26] border-[#E5E3D8] hover:border-[#5A5A40]/50 hover:shadow-xs'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isExactDateOpen || selectedMonth ? 'bg-white/20 text-white' : 'bg-[#F5F2EA] text-[#5A5A40]'
            }`}>
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-bold">
                <span>Exact Date & Newspaper</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className={`text-[11px] mt-0.5 ${
                isExactDateOpen || selectedMonth ? 'text-stone-200' : 'text-[#8C8A7D]'
              }`}>
                Filter to specific day headlines & vintage front page.
              </p>
            </div>
          </button>

          {/* Module 2: Price & Inflation Machine */}
          <button
            onClick={onOpenInflationCalculator}
            className="p-3.5 rounded-2xl bg-white border border-[#E5E3D8] hover:border-[#C05A3E]/50 hover:shadow-xs text-left transition-all flex items-start gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-[#C05A3E] flex items-center justify-center shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-[#2C2C26]">
                <span>Price & Inflation Machine</span>
                <ArrowRight className="w-3 h-3 text-[#C05A3E] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-[#8C8A7D] mt-0.5">
                Calculate ₹ / $ purchasing power (petrol, gold, cinema).
              </p>
            </div>
          </button>

          {/* Module 3: Tech Spec Evolution Comparator */}
          <button
            onClick={onOpenTechComparator}
            className="p-3.5 rounded-2xl bg-white border border-[#E5E3D8] hover:border-[#5A5A40]/50 hover:shadow-xs text-left transition-all flex items-start gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-800 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-[#2C2C26]">
                <span>Tech Spec Evolution</span>
                <ArrowRight className="w-3 h-3 text-emerald-800 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-[#8C8A7D] mt-0.5">
                Compare RAM, storage cost/GB & internet speed vs today.
              </p>
            </div>
          </button>

          {/* Module 4: Vintage Postcard & Story Card Generator */}
          {onOpenCardGenerator && (
            <button
              onClick={() => onOpenCardGenerator(yearData.year)}
              className="p-3.5 rounded-2xl bg-white border border-[#E5E3D8] hover:border-[#5A5A40]/50 hover:shadow-xs text-left transition-all flex items-start gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-[#C05A3E] flex items-center justify-center shrink-0">
                <Stamp className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#2C2C26]">
                  <span>Postcard & Story Card</span>
                  <ArrowRight className="w-3 h-3 text-[#C05A3E] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-[#8C8A7D] mt-0.5">
                  Export high-res PNG postcard or Instagram story card.
                </p>
              </div>
            </button>
          )}

        </div>
      </div>

      {/* Embed Date Explorer if open or if a specific date is active */}
      {(isExactDateOpen || selectedMonth) && (
        <ExactDateExplorer
          yearData={yearData}
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
          onSelectExactDate={(m, d) => {
            if (onSelectExactDate) onSelectExactDate(m, d);
          }}
          onSelectEvent={onSelectEvent}
        />
      )}

      {/* Interactive AI Time Traveler Dispatch */}
      <TimeTravelerDispatch 
        year={yearData.year}
        yearTitle={yearData.title}
        eraMoniker={yearData.eraMoniker}
      />

      {/* Category Tabs Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        counts={categoryCounts}
      />

      {/* ALL CATEGORIES VIEW */}
      {selectedCategory === 'ALL' && (
        <div className="space-y-12">
          
          {/* Main Historical Events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-serif font-bold text-[#2C2C26] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#5A5A40]" />
                <span>
                  {selectedMonth 
                    ? `Historical Events in ${MONTH_NAMES[selectedMonth - 1]} (${filteredEvents.length})` 
                    : `Headline World & India Events (${filteredEvents.length})`}
                </span>
              </h3>

              {selectedMonth && (
                <button
                  onClick={() => onSelectExactDate && onSelectExactDate(null, null)}
                  className="text-xs text-[#C05A3E] hover:underline font-semibold cursor-pointer"
                >
                  Show all {yearData.events.length} events from {yearData.year}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <TimelineEventCard
                  key={event.id}
                  event={event}
                  onSelect={onSelectEvent}
                  isSaved={savedEventIds.has(event.id)}
                  onToggleSave={onToggleSaveEvent}
                />
              ))}
            </div>
          </div>

          {/* Movies Section with Trailer Actions */}
          {yearData.movies.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-serif font-bold text-[#2C2C26] flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#C05A3E]" />
                  <span>Cinematic Watersheds (TMDB)</span>
                </h3>

                {onWatchTrailer && yearData.movies[0] && (
                  <button
                    onClick={() => onWatchTrailer(yearData.movies[0])}
                    className="flex items-center gap-1.5 text-xs text-[#C05A3E] hover:text-[#a3472e] font-semibold cursor-pointer"
                  >
                    <Clapperboard className="w-3.5 h-3.5" />
                    <span>Watch Trailers</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {yearData.movies.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onWatchTrailer={onWatchTrailer}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Music Section with Era Radio & Cassette Deck */}
          {yearData.music.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-serif font-bold text-[#2C2C26] flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#5A5A40]" />
                  <span>Top Music & Chart Anthems (MusicBrainz)</span>
                </h3>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleStartEraRadio}
                    className="flex items-center gap-1.5 text-xs text-[#5A5A40] hover:text-[#C05A3E] font-semibold transition-colors cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>Continuous Radio</span>
                  </button>

                  {onOpenWalkman && (
                    <button
                      onClick={() => onOpenWalkman()}
                      className="flex items-center gap-1.5 text-xs text-[#C05A3E] hover:text-[#a3472e] font-semibold transition-colors cursor-pointer"
                    >
                      <Disc className="w-3.5 h-3.5" />
                      <span>Cassette Deck</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {yearData.music.map((mus) => (
                  <MusicCard 
                    key={mus.id} 
                    music={mus} 
                    onOpenWalkman={onOpenWalkman}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Technology Section */}
          {yearData.technology.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-serif font-bold text-[#2C2C26] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#5A5A40]" />
                  <span>Breakthrough Technologies & Inventions</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {yearData.technology.map((tech) => (
                  <TechnologyCard key={tech.id} technology={tech} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Specialized Category Views */}
      {selectedCategory === 'MOVIES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {yearData.movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onWatchTrailer={onWatchTrailer}
            />
          ))}
        </div>
      )}

      {selectedCategory === 'MUSIC' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
            <div className="flex items-center gap-2 text-xs text-[#636158]">
              <Radio className="w-4 h-4 text-[#5A5A40]" />
              <span>Playing {yearData.year} continuous stream queue with vintage Dolby tape synthesis</span>
            </div>
            <button
              onClick={handleStartEraRadio}
              className="px-4 py-2 rounded-full bg-[#5A5A40] text-white hover:bg-[#484832] text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Era Radio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yearData.music.map((mus) => (
              <MusicCard 
                key={mus.id} 
                music={mus} 
                onOpenWalkman={onOpenWalkman}
              />
            ))}
          </div>
        </div>
      )}

      {selectedCategory === 'TECHNOLOGY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {yearData.technology.map((tech) => (
            <TechnologyCard key={tech.id} technology={tech} />
          ))}
        </div>
      )}

      {(selectedCategory === 'WORLD_EVENTS' || 
        selectedCategory === 'INDIA_EVENTS' || 
        selectedCategory === 'SCIENCE' || 
        selectedCategory === 'SPORTS' || 
        selectedCategory === 'CULTURE') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents
            .filter(e => e.category === selectedCategory)
            .map((evt) => (
              <TimelineEventCard
                key={evt.id}
                event={evt}
                onSelect={onSelectEvent}
                isSaved={savedEventIds.has(evt.id)}
                onToggleSave={onToggleSaveEvent}
              />
            ))}
        </div>
      )}

      {/* Live Wikipedia Knowledge Card Citation */}
      {wikiData && (
        <div className="p-6 rounded-[28px] bg-[#F5F2EA] border border-[#E5E3D8] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Wikimedia Foundation Live Citation ({yearData.year})</span>
            </div>
            <p className="text-xs text-[#636158] max-w-3xl leading-relaxed">
              {wikiData.worldWiki.summary}
            </p>
          </div>

          <a
            href={wikiData.worldWiki.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 rounded-full bg-white border border-[#E5E3D8] text-[#2C2C26] hover:bg-[#5A5A40] hover:text-white hover:border-[#5A5A40] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>Read Wikipedia Entry</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

    </div>
  );
};
