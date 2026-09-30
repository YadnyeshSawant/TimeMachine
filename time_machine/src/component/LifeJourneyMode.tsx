import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Plus, 
  Trash2, 
  Sparkles, 
  Calendar, 
  Film, 
  Music, 
  Cpu, 
  Globe, 
  ArrowRight, 
  Download, 
  Share2, 
  BookOpen, 
  Coins, 
  Clock, 
  Edit3, 
  Check, 
  RotateCcw,
  GraduationCap,
  Briefcase,
  Baby,
  Home,
  Plane,
  Award,
  Rocket,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { YearData, MovieRecord, MusicRecord, TechnologyMilestone, HistoricalEvent } from '../types';
import { api } from '../services/api';
import { YEARLY_ECONOMICS } from '../data/historicalEconomicsAndTech';

const STORAGE_KEY_LIFE_JOURNEY = 'timemachine_life_journey_milestones_v1';

export interface LifeMilestone {
  id: string;
  year: number;
  title: string;
  category: 'BIRTH' | 'EDUCATION' | 'CAREER' | 'RELATIONSHIP' | 'HOME' | 'TRAVEL' | 'ACHIEVEMENT' | 'PROJECT' | 'OTHER';
  personalNote?: string;
  iconName?: string;
}

interface LifeJourneyModeProps {
  onExploreYear: (year: number) => void;
  onOpenCardGenerator?: (year: number) => void;
}

const MILESTONE_CATEGORIES: Array<{
  id: LifeMilestone['category'];
  label: string;
  icon: string;
  color: string;
}> = [
  { id: 'BIRTH', label: 'Birth / Early Childhood', icon: '👶', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'EDUCATION', label: 'School / Graduation', icon: '🎓', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'CAREER', label: 'First Job / Career', icon: '💼', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'RELATIONSHIP', label: 'Love / Marriage', icon: '💍', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'HOME', label: 'First Home / City Move', icon: '🏠', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'TRAVEL', label: 'Milestone Trip / Relocation', icon: '✈️', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'ACHIEVEMENT', label: 'Award / Major Milestone', icon: '🏆', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { id: 'PROJECT', label: 'Startup / Passion Project', icon: '🚀', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'OTHER', label: 'Personal Memory', icon: '⭐', color: 'bg-stone-50 text-stone-700 border-stone-200' },
];

const PRESETS: Record<string, { name: string; description: string; milestones: LifeMilestone[] }> = {
  MILLENNIAL: {
    name: '90s Millennial Chronicle',
    description: 'Born in the dial-up 90s, grew up with the internet revolution.',
    milestones: [
      { id: '1', year: 1993, title: 'Born into the World', category: 'BIRTH', personalNote: 'Cassette tapes & CRT TVs were everywhere.' },
      { id: '2', year: 2000, title: 'Y2K & Primary School', category: 'EDUCATION', personalNote: 'Survived the Y2K bug scare.' },
      { id: '3', year: 2011, title: 'High School Graduation', category: 'EDUCATION', personalNote: 'First touchscreen smartphone and Facebook days.' },
      { id: '4', year: 2015, title: 'College Degree & First Job', category: 'CAREER', personalNote: 'Stepping into software and the digital world.' },
      { id: '5', year: 2021, title: 'First Home & Big Life Step', category: 'HOME', personalNote: 'New home during the remote-work shift.' },
      { id: '6', year: 2026, title: 'Today: The AI Frontier', category: 'ACHIEVEMENT', personalNote: 'Living in the age of generative intelligence.' },
    ]
  },
  GEN_Z: {
    name: 'Gen Z Digital Native',
    description: 'Born at the dawn of the millennium, streaming and mobile-first.',
    milestones: [
      { id: '1', year: 2001, title: 'Born at the Millennium', category: 'BIRTH', personalNote: 'The dawn of iPods and 21st century tech.' },
      { id: '2', year: 2008, title: 'Childhood & Gaming', category: 'OTHER', personalNote: 'Playing Flash games and watching YouTube launch.' },
      { id: '3', year: 2019, title: 'High School Graduation', category: 'EDUCATION', personalNote: 'Streaming Spotify and TikTok taking off.' },
      { id: '4', year: 2023, title: 'College Graduation & First Role', category: 'CAREER', personalNote: 'First tech job in the post-pandemic era.' },
      { id: '5', year: 2026, title: 'Building the Future Today', category: 'PROJECT', personalNote: 'Creating next-gen AI applications.' },
    ]
  },
  CUSTOM: {
    name: 'Custom Journey',
    description: 'Create your own personalized milestones from scratch.',
    milestones: [
      { id: '1', year: 1995, title: 'My Starting Milestone', category: 'BIRTH', personalNote: 'The beginning of my adventure.' },
      { id: '2', year: 2010, title: 'A Memorable Turning Point', category: 'EDUCATION', personalNote: 'A pivotal year in my story.' },
      { id: '3', year: 2026, title: 'Where I Am Today', category: 'ACHIEVEMENT', personalNote: 'Looking back at how far the world has come.' },
    ]
  }
};

export const LifeJourneyMode: React.FC<LifeJourneyModeProps> = ({
  onExploreYear,
  onOpenCardGenerator
}) => {
  const [milestones, setMilestones] = useState<LifeMilestone[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LIFE_JOURNEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return PRESETS.MILLENNIAL.milestones;
  });

  // Cached year data map for milestones
  const [yearDataMap, setYearDataMap] = useState<Record<number, YearData>>({});
  const [loadingYears, setLoadingYears] = useState<boolean>(false);

  // Form states for adding new milestone
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);
  const [newYear, setNewYear] = useState<number>(2015);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<LifeMilestone['category']>('CAREER');
  const [newNote, setNewNote] = useState<string>('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Save milestones to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LIFE_JOURNEY, JSON.stringify(milestones));
    } catch (e) {
      console.error(e);
    }
  }, [milestones]);

  // Fetch year data for all milestone years
  useEffect(() => {
    const rawYears: number[] = Array.from(new Set(milestones.map(m => m.year)));
    const yearsToFetch: number[] = rawYears.filter((y: number) => !yearDataMap[y]);
    if (yearsToFetch.length === 0) return;

    setLoadingYears(true);
    Promise.all(yearsToFetch.map((y: number) => api.getYearData(y).catch(() => null)))
      .then(results => {
        setYearDataMap(prev => {
          const updated = { ...prev };
          results.forEach(res => {
            if (res) updated[res.year] = res;
          });
          return updated;
        });
      })
      .finally(() => setLoadingYears(false));
  }, [milestones]);

  // Sort milestones chronologically
  const sortedMilestones = [...milestones].sort((a, b) => a.year - b.year);
  const birthMilestone = sortedMilestones.find(m => m.category === 'BIRTH') || sortedMilestones[0];
  const birthYear = birthMilestone ? birthMilestone.year : sortedMilestones[0]?.year || 1995;

  const handleAddMilestone = () => {
    if (!newTitle.trim()) return;
    const newM: LifeMilestone = {
      id: Date.now().toString(),
      year: newYear,
      title: newTitle.trim(),
      category: newCategory,
      personalNote: newNote.trim() || undefined,
    };
    setMilestones(prev => [...prev, newM]);
    setNewTitle('');
    setNewNote('');
    setIsAddFormOpen(false);
  };

  const handleDeleteMilestone = (id: string) => {
    if (milestones.length <= 1) return;
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  const handleLoadPreset = (presetKey: string) => {
    if (PRESETS[presetKey]) {
      setMilestones(PRESETS[presetKey].milestones);
    }
  };

  return (
    <div id="life-journey-mode-view" className="w-full max-w-5xl mx-auto py-6 space-y-8 animate-fadeIn">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] text-[#5A5A40] text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 text-[#C05A3E]" />
          <span>Personal Chronicle</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2C26] tracking-tight">
          "My Life Journey" Multi-Year Timeline
        </h1>
        <p className="text-[#636158] text-sm sm:text-base max-w-2xl mx-auto">
          Chart your key life milestones (birth, graduation, career, marriage, travel) and discover the historical world, #1 movies, anthem tracks, and tech revolutions that unfolded alongside your personal story.
        </p>
      </div>

      {/* Preset Pickers & Controls Bar */}
      <div className="bg-[#FAF8F2] border border-[#E5E3D8] rounded-[28px] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#2C2C26] uppercase tracking-wider mr-1">
            Presets:
          </span>
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => handleLoadPreset(key)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#E5E3D8] hover:border-[#5A5A40] text-xs font-semibold text-[#2C2C26] transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Action: Add New Milestone Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddFormOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Life Milestone</span>
          </button>
        </div>
      </div>

      {/* Add Milestone Drawer Form */}
      {isAddFormOpen && (
        <div className="bg-white border-2 border-[#5A5A40]/30 rounded-[24px] p-6 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#E5E3D8] pb-3">
            <h3 className="text-sm font-serif font-bold text-[#2C2C26] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C05A3E]" />
              <span>Record a New Life Milestone</span>
            </h3>
            <button
              onClick={() => setIsAddFormOpen(false)}
              className="text-xs text-[#8C8A7D] hover:text-[#2C2C26]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Year */}
            <div>
              <label className="block text-xs font-bold text-[#2C2C26] uppercase tracking-wider mb-1">
                Milestone Year (1990–2026)
              </label>
              <select
                value={newYear}
                onChange={(e) => setNewYear(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#E5E3D8] text-xs font-bold text-[#2C2C26] focus:outline-none focus:border-[#5A5A40]"
              >
                {Array.from({ length: 37 }, (_, i) => 1990 + i).map(yr => (
                  <option key={yr} value={yr}>
                    Year {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-[#2C2C26] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#E5E3D8] text-xs font-bold text-[#2C2C26] focus:outline-none focus:border-[#5A5A40]"
              >
                {MILESTONE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-[#2C2C26] uppercase tracking-wider mb-1">
                Milestone Title
              </label>
              <input
                type="text"
                placeholder="e.g. Graduated University, Moved to London"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#E5E3D8] text-xs font-semibold text-[#2C2C26] focus:outline-none focus:border-[#5A5A40]"
              />
            </div>

          </div>

          {/* Personal Note */}
          <div>
            <label className="block text-xs font-bold text-[#2C2C26] uppercase tracking-wider mb-1">
              Personal Memory or Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Listened to Linkin Park on repeat, bought my first laptop..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#F5F2EA] border border-[#E5E3D8] text-xs text-[#2C2C26] focus:outline-none focus:border-[#5A5A40]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleAddMilestone}
              disabled={!newTitle.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#484832] text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              Save Milestone to Journey
            </button>
          </div>
        </div>
      )}

      {/* --- MULTI-YEAR CHRONOLOGICAL JOURNEY TRACK --- */}
      <div className="relative space-y-8 pl-4 sm:pl-8 before:content-[''] before:absolute before:top-6 before:bottom-6 before:left-8 sm:before:left-12 before:w-1 before:bg-gradient-to-b before:from-[#5A5A40] before:via-[#C05A3E] before:to-[#5A5A40] before:rounded-full">
        
        {sortedMilestones.map((m, index) => {
          const ageAtMilestone = m.year - birthYear;
          const yData = yearDataMap[m.year];
          const econ = YEARLY_ECONOMICS[m.year];
          const catConfig = MILESTONE_CATEGORIES.find(c => c.id === m.category) || MILESTONE_CATEGORIES[8];

          return (
            <div key={m.id} className="relative flex items-start gap-4 sm:gap-6 group">
              
              {/* Timeline Illuminated Node Marker */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md border-4 border-[#FDFCF8] z-10 group-hover:scale-110 group-hover:bg-[#C05A3E] transition-all">
                <span className="text-base">{catConfig.icon}</span>
              </div>

              {/* Main Milestone Card */}
              <div className="flex-1 bg-white border border-[#E5E3D8] hover:border-[#5A5A40]/50 rounded-[28px] p-5 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-5">
                
                {/* Milestone Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E3D8] pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl sm:text-2xl font-serif font-extrabold text-[#2C2C26]">
                      {m.year}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F5F2EA] text-[#5A5A40] text-xs font-bold">
                      {ageAtMilestone <= 0 ? 'Birth / Day 1' : `Age ${ageAtMilestone}`}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${catConfig.color}`}>
                      {catConfig.label}
                    </span>
                  </div>

                  {/* Quick Card & Year Jump Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onExploreYear(m.year)}
                      className="px-3 py-1 rounded-full bg-[#F5F2EA] hover:bg-[#5A5A40] text-[#636158] hover:text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      title={`Jump to full ${m.year} Timeline`}
                    >
                      <span>Explore {m.year}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    {onOpenCardGenerator && (
                      <button
                        onClick={() => onOpenCardGenerator(m.year)}
                        className="p-1.5 rounded-full text-[#8C8A7D] hover:text-[#C05A3E] hover:bg-[#F5F2EA] transition-colors"
                        title="Generate Time-Capsule Card for this year"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    )}

                    {milestones.length > 1 && (
                      <button
                        onClick={() => handleDeleteMilestone(m.id)}
                        className="p-1.5 rounded-full text-[#8C8A7D] hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* User's Personal Milestone Title & Note */}
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#2C2C26]">
                    {m.title}
                  </h3>
                  {m.personalNote && (
                    <p className="text-sm font-serif italic text-[#636158] bg-[#FAF8F2] p-3 rounded-xl border border-[#E5E3D8]">
                      "{m.personalNote}"
                    </p>
                  )}
                </div>

                {/* Historical Backdrop Grid for this Milestone Year */}
                {yData ? (
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#8C8A7D] uppercase tracking-wider">
                      <span>The World in {m.year} During this Milestone</span>
                      <span className="font-serif italic text-[#5A5A40]">"{yData.eraMoniker}"</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      
                      {/* 1. Top Cinema Movie */}
                      {yData.movies[0] && (
                        <div className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#E5E3D8] space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#C05A3E] uppercase">
                            <Film className="w-3 h-3" />
                            <span>In Cinemas</span>
                          </div>
                          <div className="font-serif font-bold text-xs text-[#2C2C26] line-clamp-1">
                            {yData.movies[0].title}
                          </div>
                          <div className="text-[10px] text-[#8C8A7D] line-clamp-1">
                            ★ {yData.movies[0].rating} • {yData.movies[0].director}
                          </div>
                        </div>
                      )}

                      {/* 2. Top Hit Anthem */}
                      {yData.music[0] && (
                        <div className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#E5E3D8] space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#5A5A40] uppercase">
                            <Music className="w-3 h-3" />
                            <span>On the Radio</span>
                          </div>
                          <div className="font-serif font-bold text-xs text-[#2C2C26] line-clamp-1">
                            {yData.music[0].title}
                          </div>
                          <div className="text-[10px] text-[#8C8A7D] line-clamp-1">
                            {yData.music[0].artist}
                          </div>
                        </div>
                      )}

                      {/* 3. Tech Frontier */}
                      {yData.technology[0] && (
                        <div className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#E5E3D8] space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 uppercase">
                            <Cpu className="w-3 h-3" />
                            <span>Tech Frontier</span>
                          </div>
                          <div className="font-serif font-bold text-xs text-[#2C2C26] line-clamp-1">
                            {yData.technology[0].title}
                          </div>
                          <div className="text-[10px] text-[#8C8A7D] line-clamp-1">
                            {yData.technology[0].company}
                          </div>
                        </div>
                      )}

                      {/* 4. Global Event Headline */}
                      {yData.events[0] && (
                        <div className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#E5E3D8] space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 uppercase">
                            <Globe className="w-3 h-3" />
                            <span>Global Milestone</span>
                          </div>
                          <div className="font-serif font-bold text-xs text-[#2C2C26] line-clamp-1">
                            {yData.events[0].title}
                          </div>
                          <div className="text-[10px] text-[#8C8A7D] line-clamp-1">
                            {yData.events[0].displayDate || yData.events[0].date}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Quick Economic Snapshot */}
                    {econ && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[#636158] font-mono border-t border-[#E5E3D8]/60">
                        <span>Petrol: ₹{econ.petrolPriceInr.toFixed(2)}/L (${econ.petrolPriceUsd.toFixed(2)}/gal)</span>
                        <span>Gold: ₹{econ.gold10gInr.toLocaleString()}/10g (${econ.goldOzUsd}/oz)</span>
                        <span>Pop: {yData.statistics.worldPopulation}</span>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="py-2 text-xs text-[#8C8A7D] font-serif italic">
                    Loading historical archives for {m.year}...
                  </div>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};
