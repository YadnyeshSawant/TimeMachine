import React, { useEffect, useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  Zap,
  RotateCcw
} from 'lucide-react';

interface YearSelectorProps {
  currentYear: number;
  onSelectYear: (year: number) => void;
  eraMoniker?: string;
  tagline?: string;
}

const LANDMARK_YEARS = [
  { year: 1991, label: '1991', desc: 'India Reforms & USSR Ends' },
  { year: 1995, label: '1995', desc: 'Win 95, DDLJ & Public Internet' },
  { year: 1998, label: '1998', desc: 'Google & Pokhran-II' },
  { year: 2001, label: '2001', desc: 'iPod, Wikipedia & Lagaan' },
  { year: 2007, label: '2007', desc: 'iPhone & T20 World Cup' },
  { year: 2008, label: '2008', desc: 'Chandrayaan-1 & IPL' },
  { year: 2011, label: '2011', desc: 'India 2011 World Cup' },
  { year: 2014, label: '2014', desc: 'Mangalyaan on Mars' },
  { year: 2016, label: '2016', desc: 'UPI & Jio 4G Revolution' },
  { year: 2023, label: '2023', desc: 'Chandrayaan-3 & G20' },
  { year: 2026, label: '2026', desc: 'Present Era & FIFA World Cup' },
];

export const YearSelector: React.FC<YearSelectorProps> = ({
  currentYear,
  onSelectYear,
  eraMoniker,
  tagline
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Autoplay through the years
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        onSelectYear(currentYear >= 2026 ? 1990 : currentYear + 1);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentYear, onSelectYear]);

  const handlePrev = () => {
    if (currentYear > 1990) onSelectYear(currentYear - 1);
  };

  const handleNext = () => {
    if (currentYear < 2026) onSelectYear(currentYear + 1);
  };

  return (
    <div id="year-selector-card" className="w-full bg-white border border-[#E5E3D8] rounded-[32px] p-6 sm:p-8 shadow-sm relative overflow-hidden">
      
      {/* Background ambient warm accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#F5F2EA] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 opacity-70" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E5E3D8] rounded-full blur-3xl pointer-events-none -ml-20 -mb-20 opacity-40" />

      {/* Main Year Display Controls */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#E5E3D8]">
        
        {/* Left: Quick step and Playback controls */}
        <div className="flex items-center gap-2">
          <button
            id="prev-year-btn"
            onClick={handlePrev}
            disabled={currentYear <= 1990}
            className="p-2.5 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] text-[#2C2C26] hover:bg-white hover:shadow-xs disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Previous Year"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            id="timeline-autoplay-toggle"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
              isPlaying 
                ? 'bg-[#5A5A40] border-[#5A5A40] text-white shadow-xs' 
                : 'bg-[#F5F2EA] border-[#E5E3D8] text-[#636158] hover:bg-white hover:text-[#2C2C26]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Tour</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-[#5A5A40]" />
                <span>Auto Tour</span>
              </>
            )}
          </button>

          <button
            id="next-year-btn"
            onClick={handleNext}
            disabled={currentYear >= 2026}
            className="p-2.5 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] text-[#2C2C26] hover:bg-white hover:shadow-xs disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Next Year"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Big Animated Year */}
        <div className="text-center flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C05A3E] mb-1 block">Selected Epoch</span>
          <div className="flex items-center gap-3">
            <span className="font-serif text-6xl sm:text-7xl font-black text-[#2C2C26] tracking-tight leading-none">
              {currentYear}
            </span>
          </div>
          {eraMoniker && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#8C8A7D] tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C05A3E]" />
              <span>{eraMoniker}</span>
            </div>
          )}
        </div>

        {/* Right: Decade Selector Jump */}
        <div className="flex items-center gap-1 bg-[#F5F2EA] p-1.5 rounded-full border border-[#E5E3D8]">
          {[1990, 2000, 2010, 2020].map((dec) => {
            const isDecadeActive = Math.floor(currentYear / 10) * 10 === dec;
            return (
              <button
                key={dec}
                id={`decade-jump-${dec}`}
                onClick={() => onSelectYear(dec)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                  isDecadeActive 
                    ? 'bg-[#5A5A40] text-white shadow-xs' 
                    : 'text-[#636158] hover:text-[#2C2C26] hover:bg-white'
                }`}
              >
                {dec}s
              </button>
            );
          })}
        </div>
      </div>

      {/* Slider Bar */}
      <div className="pt-5 px-1">
        <div className="relative flex items-center">
          <input
            id="year-range-slider"
            type="range"
            min={1990}
            max={2026}
            value={currentYear}
            onChange={(e) => onSelectYear(parseInt(e.target.value, 10))}
            className="w-full h-2.5 bg-[#E5E3D8] rounded-lg appearance-none cursor-pointer accent-[#5A5A40] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30"
          />
        </div>

        {/* Scale Numbers */}
        <div className="flex justify-between text-[11px] font-mono text-[#8C8A7D] pt-2 select-none">
          <span>1990</span>
          <span>1995</span>
          <span>2000</span>
          <span>2005</span>
          <span>2010</span>
          <span>2015</span>
          <span>2020</span>
          <span className="text-[#C05A3E] font-bold">2026 (Present)</span>
        </div>
      </div>

      {/* Milestone Quick Jumps Carousel */}
      <div className="mt-5 pt-4 border-t border-[#E5E3D8]">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-3.5 h-3.5 text-[#C05A3E]" />
          <span className="text-[11px] font-bold text-[#8C8A7D] uppercase tracking-wider">Watershed Historical Milestones</span>
        </div>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {LANDMARK_YEARS.map((item) => {
            const isSelected = item.year === currentYear;
            return (
              <button
                key={item.year}
                id={`landmark-${item.year}`}
                onClick={() => onSelectYear(item.year)}
                className={`whitespace-nowrap flex-shrink-0 px-3.5 py-2 rounded-2xl text-xs transition-all border text-left ${
                  isSelected
                    ? 'bg-[#5A5A40] border-[#5A5A40] text-white shadow-sm font-semibold'
                    : 'bg-[#F5F2EA] border-[#E5E3D8] text-[#2C2C26] hover:bg-white hover:border-[#8C8A7D]'
                }`}
              >
                <div className={`font-bold font-serif text-sm ${isSelected ? 'text-white' : 'text-[#2C2C26]'}`}>
                  {item.label}
                </div>
                <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#636158]'}`}>
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
