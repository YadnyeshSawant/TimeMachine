// BirthdateMode.tsx
// Component for displaying a time capsule of events, media, and tech from a user's birth date
// Allows users to select any date between 1990-2026 and see what was popular/happening at that time

import React, { useState } from 'react';
import confetti from 'canvas-confetti'; // For celebratory confetti animation
import {
  Calendar,
  Sparkles,
  Film,      // Movie/cinema icon
  Music,     // Music/song icon
  Cpu,       // Technology icon
  Clock,
  Users,
  Globe,
  Share2,
  RefreshCw, // Loading spinner icon
  Award      // Trivia/achievement icon
} from 'lucide-react';
import { BirthdateCapsule } from '../types';
import { api } from '../services/api';

// Props for the BirthdateMode component
interface BirthdateModeProps {
  // Callback to navigate to full year exploration view
  onExploreYear: (year: number) => void;
}

export const BirthdateMode: React.FC<BirthdateModeProps> = ({ onExploreYear }) => {
  // State for selected birth date (default: Jan 1, 2000)
  const [selectedDate, setSelectedDate] = useState('2000-01-01');
  // State for the generated time capsule data
  const [capsule, setCapsule] = useState<BirthdateCapsule | null>(null);
  // Loading state while fetching capsule data from API
  const [loading, setLoading] = useState(false);
  // Error state for failed API calls or validation errors
  const [error, setError] = useState<string | null>(null);

  /**
   * Generates a new time capsule for the given date
   * Fetches cultural, music, tech, and trivia data from the API
   * Triggers confetti animation on success
   * @param dateToUse - Optional date string; uses selectedDate if not provided
   */
  const generateCapsule = async (dateToUse?: string) => {
    const targetDate = dateToUse || selectedDate;
    setLoading(true);
    setError(null);

    try {
      // Fetch time capsule data from API
      const data = await api.getBirthdateCapsule(targetDate);
      setCapsule(data);

      // Trigger festive celebratory confetti animation
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      // Display error message if API call fails
      setError(err.message || 'Failed to generate time capsule.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles quick preset date button clicks
   * Updates the selected date and immediately generates the capsule
   * @param presetDate - The preset date string (e.g., '1991-07-24')
   */
  const handleQuickPreset = (presetDate: string) => {
    setSelectedDate(presetDate);
    generateCapsule(presetDate);
  };

  return (
    // Main container for the birthdate mode view
    <div id="birthdate-mode-view" className="w-full max-w-5xl mx-auto py-6 space-y-8 animate-fadeIn">

      {/* Hero Header Section - Title, subtitle, and description */}
      <div className="text-center space-y-3">
        {/* Badge/label for the feature */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] text-[#5A5A40] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#C05A3E]" />
          <span>Chrono-Capsule Generator</span>
        </div>
        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2C26] tracking-tight">
          The Day & Era You Were Born
        </h1>
        {/* Descriptive subtitle explaining the feature */}
        <p className="text-[#636158] text-sm sm:text-base max-w-2xl mx-auto">
          Enter any birth date or milestone date between 1990 and 2026 to discover what was happening in the world, the #1 movie, top song, tech landscape, and trivia of that exact era.
        </p>
      </div>

      {/* Input Card Section - Date picker, generate button, and quick presets */}
      <div className="bg-white border border-[#E5E3D8] p-6 sm:p-8 rounded-[32px] shadow-xs max-w-xl mx-auto">
        {/* Date input and generate button container */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Date picker input */}
          <div className="relative w-full">
            <input
              id="birthdate-picker-input"
              type="date"
              min="1990-01-01"
              max="2026-12-31"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#F5F2EA] border border-[#E5E3D8] text-[#2C2C26] font-sans font-semibold text-sm px-4 py-3 rounded-full focus:outline-none focus:border-[#5A5A40]"
            />
          </div>

          {/* Generate capsule button - shows loading state while fetching */}
          <button
            id="generate-capsule-btn"
            onClick={() => generateCapsule()}
            disabled={loading}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#5A5A40] text-white font-bold text-sm hover:bg-[#484832] disabled:opacity-50 transition-all shadow-xs"
          >
            {loading ? (
              // Loading state with spinner
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Brewing...</span>
              </>
            ) : (
              // Default state
              <>
                <Sparkles className="w-4 h-4" />
                <span>Open Capsule</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Preset Buttons - Allows users to quickly explore significant historical dates */}
        <div className="mt-4 pt-4 border-t border-[#E5E3D8] flex flex-wrap items-center justify-center gap-2 text-xs text-[#636158]">
          <span className="text-[11px] uppercase tracking-wider text-[#8C8A7D] font-semibold">Try:</span>
          {/* 1991 - India Reforms */}
          <button
            onClick={() => handleQuickPreset('1991-07-24')}
            className="px-3 py-1 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] hover:border-[#5A5A40] text-[#2C2C26]"
          >
            1991 (India Reforms)
          </button>
          {/* 1995 - Internet Day */}
          <button
            onClick={() => handleQuickPreset('1995-08-15')}
            className="px-3 py-1 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] hover:border-[#5A5A40] text-[#2C2C26]"
          >
            1995 (Internet Day)
          </button>
          {/* 2007 - iPhone Launch */}
          <button
            onClick={() => handleQuickPreset('2007-01-09')}
            className="px-3 py-1 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] hover:border-[#5A5A40] text-[#2C2C26]"
          >
            2007 (iPhone Debut)
          </button>
          {/* 2011 - India World Cup Win */}
          <button
            onClick={() => handleQuickPreset('2011-04-02')}
            className="px-3 py-1 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] hover:border-[#5A5A40] text-[#2C2C26]"
          >
            2011 (World Cup Win)
          </button>
        </div>

        {/* Error message display - Shows if API call fails */}
        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-[#C05A3E]/10 border border-[#C05A3E]/30 text-[#C05A3E] text-xs text-center font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Rendered Capsule Content - Only shown after user generates a capsule */}
      {capsule && (
        <div id="capsule-results" className="space-y-6 animate-fadeIn">

          {/* Milestone Banner - Displays date info and navigate-to-year button */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E5E3D8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              {/* Formatted date display */}
              <div className="text-xs font-sans text-[#C05A3E] uppercase tracking-wider font-bold">
                Chrono-Coordinates: {capsule.monthName} {capsule.day}, {capsule.year}
              </div>
              {/* Era summary/title */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2C26]">
                {capsule.eraSummary}
              </h2>
              {/* Context about the user's age and era description */}
              <p className="text-xs text-[#636158]">
                You are {capsule.ageToday} years old in 2026. Here is the cultural and technological tapestry of your birth era.
              </p>
            </div>

            {/* Button to explore the full year in detail */}
            <button
              onClick={() => onExploreYear(capsule.year)}
              className="shrink-0 px-5 py-2.5 rounded-full bg-[#5A5A40] text-white hover:bg-[#484832] font-bold text-xs transition-all shadow-xs"
            >
              Explore Full Year {capsule.year} →
            </button>
          </div>

          {/* 3-Column Bento Grid: Movie, Music, and Tech at time of birth */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1: Top Movie at Birth - Displays #1 film with poster, title, overview, and director */}
            <div className="bg-white border border-[#E5E3D8] rounded-[28px] p-6 flex flex-col justify-between shadow-xs">
              <div>
                {/* Card header with icon and data source attribution */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#C05A3E] uppercase tracking-wider">
                    <Film className="w-4 h-4" />
                    <span>Theatres At Your Birth</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C8A7D]">TMDB</span>
                </div>

                {/* Movie poster image */}
                <div className="h-44 rounded-2xl overflow-hidden mb-4 bg-[#F5F2EA]">
                  <img
                    src={capsule.topMovieAtBirth.posterUrl}
                    alt={capsule.topMovieAtBirth.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Movie title, overview */}
                <h3 className="text-base font-serif font-bold text-[#2C2C26] mb-1">{capsule.topMovieAtBirth.title}</h3>
                <p className="text-xs text-[#636158] line-clamp-2 mb-2">{capsule.topMovieAtBirth.overview}</p>
              </div>

              {/* Director information at bottom */}
              <div className="pt-3 border-t border-[#E5E3D8] text-[11px] text-[#8C8A7D]">
                Dir: <strong className="text-[#2C2C26]">{capsule.topMovieAtBirth.director}</strong>
              </div>
            </div>

            {/* Card 2: Top Song at Birth - Displays #1 hit with album art, song title, artist, and album name */}
            <div className="bg-white border border-[#E5E3D8] rounded-[28px] p-6 flex flex-col justify-between shadow-xs">
              <div>
                {/* Card header with icon and data source attribution */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
                    <Music className="w-4 h-4" />
                    <span>Radio Sensation</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C8A7D]">MusicBrainz</span>
                </div>

                {/* Album/song cover art */}
                <div className="h-44 rounded-2xl overflow-hidden mb-4 bg-[#F5F2EA]">
                  <img
                    src={capsule.topSongAtBirth.coverUrl}
                    alt={capsule.topSongAtBirth.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Song title, artist, and notable achievement */}
                <h3 className="text-base font-serif font-bold text-[#2C2C26] mb-1">{capsule.topSongAtBirth.title}</h3>
                <p className="text-xs text-[#C05A3E] font-medium mb-1">{capsule.topSongAtBirth.artist}</p>
                <p className="text-xs text-[#636158] line-clamp-2 mb-2">{capsule.topSongAtBirth.notableAchievement}</p>
              </div>

              {/* Album name at bottom */}
              <div className="pt-3 border-t border-[#E5E3D8] text-[11px] text-[#8C8A7D]">
                Album: <span className="italic text-[#2C2C26]">{capsule.topSongAtBirth.album}</span>
              </div>
            </div>

            {/* Card 3: Tech Landscape at Birth - Displays key tech product/innovation with image and company */}
            <div className="bg-white border border-[#E5E3D8] rounded-[28px] p-6 flex flex-col justify-between shadow-xs">
              <div>
                {/* Card header with icon and data source attribution */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
                    <Cpu className="w-4 h-4" />
                    <span>Tech Landscape</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C8A7D]">Tech Archive</span>
                </div>

                {/* Tech product image */}
                <div className="h-44 rounded-2xl overflow-hidden mb-4 bg-[#F5F2EA]">
                  <img
                    src={capsule.techLandscapeAtBirth.imageUrl}
                    alt={capsule.techLandscapeAtBirth.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Tech title and description */}
                <h3 className="text-base font-serif font-bold text-[#2C2C26] mb-1">{capsule.techLandscapeAtBirth.title}</h3>
                <p className="text-xs text-[#636158] line-clamp-3 mb-2">{capsule.techLandscapeAtBirth.description}</p>
              </div>

              {/* Company/maker information at bottom */}
              <div className="pt-3 border-t border-[#E5E3D8] text-[11px] text-[#5A5A40]">
                Company: <strong>{capsule.techLandscapeAtBirth.company}</strong>
              </div>
            </div>

          </div>

          {/* Historical Trivia Section - Lists numbered fun facts and events from the birth year */}
          <div className="bg-white border border-[#E5E3D8] rounded-[28px] p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-serif font-bold text-[#2C2C26] mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C05A3E]" />
              <span>Snapshot of Earth When You Arrived ({capsule.year})</span>
            </h3>

            {/* Grid of trivia items with numbered badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Map through array of trivia facts, displaying each with an index number */}
              {capsule.funTrivia.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
                  {/* Numbered badge for trivia item */}
                  <div className="w-5 h-5 rounded-full bg-[#5A5A40] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  {/* Trivia fact text */}
                  <p className="text-xs text-[#2C2C26] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
