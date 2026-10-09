import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Radio, RefreshCw, Compass, BookOpen, Quote } from 'lucide-react';
import { api } from '../services/api';

interface TimeTravelerDispatchProps {
  year: number;
}

interface DispatchData {
  dispatch: string;
  keyAtmosphere: string;
  culturalVibe: string;
  historicalSignificance: string;
}

// Client-side cache across tab switches & repeated year views
const clientDispatchCache = new Map<number, DispatchData>();

export const TimeTravelerDispatch: React.FC<TimeTravelerDispatchProps> = ({ year }) => {
  const [dispatch, setDispatch] = useState<DispatchData | null>(() => clientDispatchCache.get(year) || null);
  const [loading, setLoading] = useState<boolean>(!clientDispatchCache.has(year));
  const activeYearRef = useRef(year);
  activeYearRef.current = year;

  const fetchDispatch = async (forceRefresh = false) => {
    if (!forceRefresh && clientDispatchCache.has(year)) {
      setDispatch(clientDispatchCache.get(year)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await api.getAiHistoricalDispatch(year);
      clientDispatchCache.set(year, data);
      if (activeYearRef.current === year) {
        setDispatch(data);
      }
    } catch (e) {
      console.warn('Dispatch load error:', e);
    } finally {
      if (activeYearRef.current === year) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // If cached already, show immediately with zero delay or spinner
    if (clientDispatchCache.has(year)) {
      setDispatch(clientDispatchCache.get(year)!);
      setLoading(false);
      return;
    }

    // Debounce 250ms when sliding through years quickly
    setLoading(true);
    const timer = setTimeout(() => {
      fetchDispatch(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [year]);

  return (
    <div id="historian-dispatch-card" className="w-full bg-white border border-[#E5E3D8] rounded-[32px] p-6 sm:p-8 shadow-xs relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#F5F2EA] rounded-full blur-3xl pointer-events-none opacity-50" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E5E3D8]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] flex items-center justify-center">
            <Radio className="w-4 h-4 text-[#C05A3E]" />
          </div>
          <div>
            <div className="text-xs font-sans text-[#C05A3E] font-bold uppercase tracking-wider">
              Chronicle Dispatch • Year {year}
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2C2C26]">The Historian's Time Signal</h3>
          </div>
        </div>

        <button
          onClick={() => fetchDispatch(true)}
          disabled={loading}
          className="p-2.5 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] text-[#636158] hover:text-[#2C2C26] hover:border-[#5A5A40] transition-all disabled:opacity-50"
          title="Regenerate historical synthesis"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#5A5A40]' : ''}`} />
        </button>
      </div>

      {loading && !dispatch ? (
        <div className="py-8 flex flex-col items-center justify-center text-[#636158] space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin text-[#5A5A40]" />
          <p className="text-xs font-sans">Tuning into temporal radio frequencies for {year}...</p>
        </div>
      ) : dispatch ? (
        <div className="space-y-5">
          {/* Main Narrative Dispatch */}
          <p className="text-sm sm:text-base text-[#2C2C26] leading-relaxed font-serif italic">
            "{dispatch.dispatch}"
          </p>

          {/* 3 Callout Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#E5E3D8]">
            
            <div className="p-4 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
              <div className="text-[11px] font-bold text-[#C05A3E] uppercase tracking-wider mb-1">Geopolitical Mood</div>
              <p className="text-xs text-[#636158] leading-relaxed">{dispatch.keyAtmosphere}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
              <div className="text-[11px] font-bold text-[#5A5A40] uppercase tracking-wider mb-1">Cultural Vibe</div>
              <p className="text-xs text-[#636158] leading-relaxed">{dispatch.culturalVibe}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
              <div className="text-[11px] font-bold text-[#5A5A40] uppercase tracking-wider mb-1">Lasting Significance</div>
              <p className="text-xs text-[#636158] leading-relaxed">{dispatch.historicalSignificance}</p>
            </div>

          </div>
        </div>
      ) : null}

    </div>
  );
};

