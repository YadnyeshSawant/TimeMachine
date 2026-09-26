import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Sparkles, 
  Film, 
  Music, 
  Cpu, 
  Clock, 
  Users, 
  Globe,
  Share2,
  RefreshCw,
  Award
} from 'lucide-react';
import { BirthdateCapsule } from '../types';
import { api } from '../services/api';

interface BirthdateModeProps {
  onExploreYear: (year: number) => void;
}

export const BirthdateMode: React.FC<BirthdateModeProps> = ({ onExploreYear }) => {
  const [selectedDate, setSelectedDate] = useState('2000-01-01');
  const [capsule, setCapsule] = useState<BirthdateCapsule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCapsule = async (dateToUse?: string) => {
    const targetDate = dateToUse || selectedDate;
    setLoading(true);
    setError(null);

    try {
      const data = await api.getBirthdateCapsule(targetDate);
      setCapsule(data);

      // Trigger festive celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to generate time capsule.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreset = (presetDate: string) => {
    setSelectedDate(presetDate);
    generateCapsule(presetDate);
  };

  return (
    <div id="birthdate-mode-view" className="w-full max-w-5xl mx-auto py-6 space-y-8 animate-fadeIn">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] text-[#5A5A40] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#C05A3E]" />
          <span>Chrono-Capsule Generator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2C26] tracking-tight">
          The Day & Era You Were Born
        </h1>
        <p className="text-[#636158] text-sm sm:text-base max-w-2xl mx-auto">
          Enter any birth date or milestone date between 1990 and 2026 to discover what was happening in the world, the #1 movie, top song, tech landscape, and trivia of that exact era.
        </p>
      </div>

      {/* Date Input Card */}
      <div className="bg-white border border-[#E5E3D8] p-6 sm:p-8 rounded-[32px] shadow-xs max-w-xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-3">
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

          <button
            id="generate-capsule-btn"
            onClick={() => generateCapsule()}
            disabled={loading}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#5A5A40] text-white font-bold text-sm hover:bg-[#484832] disabled:opacity-50 transition-all shadow-xs"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Brewing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Open Capsule</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mt-4 pt-4 border-t border-[#E5E3D8] flex flex-wrap items-center justify-center gap-2 text-xs text-[#636158]">
          <span className="text-[11px] uppercase tracking-wider text-[#8C8A7D] font-semibold">Try:</span>
          <button 
            onClick={() => handleQuickPreset('1991-07-24')} 
            className="px-3 py-1 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] hover:border-[#5A5A40] text-[#2C2C26]"
          >
            1991 (India Reforms)
          </button>
          <button 
            onClick={() => handleQuickPreset('1995-08-15')} 
            className="px-3 py-1 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] hover:border-[#5A5A40] text-[#2C2C26]"
          >
            1995 (Internet Day)
          </button>
          <button 
            onClick={() => handleQuickPreset('2007-01-09')} 
            className="px-3 py-1 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] hover:border-[#5A5A40] text-[#2C2C26]"
          >
            2007 (iPhone Debut)
          </button>
          <button 
            onClick={() => handleQuickPreset('2011-04-02')} 
            className="px-3 py-1 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] hover:border-[#5A5A40] text-[#2C2C26]"
          >
            2011 (World Cup Win)
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-[#C05A3E]/10 border border-[#C05A3E]/30 text-[#C05A3E] text-xs text-center font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Rendered Capsule Content */}
      {capsule && (
        <div id="capsule-results" className="space-y-6 animate-fadeIn">
          
          {/* Milestone Banner */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E5E3D8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="text-xs font-sans text-[#C05A3E] uppercase tracking-wider font-bold">
                Chrono-Coordinates: {capsule.monthName} {capsule.day}, {capsule.year}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2C26]">
                {capsule.eraSummary}
              </h2>
              <p className="text-xs text-[#636158]">
                You are {capsule.ageToday} years old in 2026. Here is the cultural and technological tapestry of your birth era.
              </p>
            </div>

            <button
              onClick={() => onExploreYear(capsule.year)}
              className="shrink-0 px-5 py-2.5 rounded-full bg-[#5A5A40] text-white hover:bg-[#484832] font-bold text-xs transition-all shadow-xs"
            >
              Explore Full Year {capsule.year} →
            </button>
          </div>

          {/* 3 Pillar Bento Grid: Movie, Music, Tech at Birth */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Cinema at Birth */}
            <div className="bg-white border border-[#E5E3D8] rounded-[28px] p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#C05A3E] uppercase tracking-wider">
                    <Film className="w-4 h-4" />
                    <span>Theatres At Your Birth</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C8A7D]">TMDB</span>
                </div>

                <div className="h-44 rounded-2xl overflow-hidden mb-4 bg-[#F5F2EA]">
                  <img 
                    src={capsule.topMovieAtBirth.posterUrl} 
                    alt={capsule.topMovieAtBirth.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-base font-serif font-bold text-[#2C2C26] mb-1">{capsule.topMovieAtBirth.title}</h3>
                <p className="text-xs text-[#636158] line-clamp-2 mb-2">{capsule.topMovieAtBirth.overview}</p>
              </div>

              <div className="pt-3 border-t border-[#E5E3D8] text-[11px] text-[#8C8A7D]">
                Dir: <strong className="text-[#2C2C26]">{capsule.topMovieAtBirth.director}</strong>
              </div>
            </div>

            {/* 2. Top Hit at Birth */}
            <div className="bg-white border border-[#E5E3D8] rounded-[28px] p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
                    <Music className="w-4 h-4" />
                    <span>Radio Sensation</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C8A7D]">MusicBrainz</span>
                </div>

                <div className="h-44 rounded-2xl overflow-hidden mb-4 bg-[#F5F2EA]">
                  <img 
                    src={capsule.topSongAtBirth.coverUrl} 
                    alt={capsule.topSongAtBirth.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-base font-serif font-bold text-[#2C2C26] mb-1">{capsule.topSongAtBirth.title}</h3>
                <p className="text-xs text-[#C05A3E] font-medium mb-1">{capsule.topSongAtBirth.artist}</p>
                <p className="text-xs text-[#636158] line-clamp-2 mb-2">{capsule.topSongAtBirth.notableAchievement}</p>
              </div>

              <div className="pt-3 border-t border-[#E5E3D8] text-[11px] text-[#8C8A7D]">
                Album: <span className="italic text-[#2C2C26]">{capsule.topSongAtBirth.album}</span>
              </div>
            </div>

            {/* 3. Tech Landscape at Birth */}
            <div className="bg-white border border-[#E5E3D8] rounded-[28px] p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
                    <Cpu className="w-4 h-4" />
                    <span>Tech Landscape</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C8A7D]">Tech Archive</span>
                </div>

                <div className="h-44 rounded-2xl overflow-hidden mb-4 bg-[#F5F2EA]">
                  <img 
                    src={capsule.techLandscapeAtBirth.imageUrl} 
                    alt={capsule.techLandscapeAtBirth.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-base font-serif font-bold text-[#2C2C26] mb-1">{capsule.techLandscapeAtBirth.title}</h3>
                <p className="text-xs text-[#636158] line-clamp-3 mb-2">{capsule.techLandscapeAtBirth.description}</p>
              </div>

              <div className="pt-3 border-t border-[#E5E3D8] text-[11px] text-[#5A5A40]">
                Company: <strong>{capsule.techLandscapeAtBirth.company}</strong>
              </div>
            </div>

          </div>

          {/* Fun Historical Trivia List */}
          <div className="bg-white border border-[#E5E3D8] rounded-[28px] p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-serif font-bold text-[#2C2C26] mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C05A3E]" />
              <span>Snapshot of Earth When You Arrived ({capsule.year})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {capsule.funTrivia.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
                  <div className="w-5 h-5 rounded-full bg-[#5A5A40] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
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
