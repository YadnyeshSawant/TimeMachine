import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Newspaper, 
  X, 
  ChevronRight, 
  Sparkles, 
  Filter, 
  TrendingUp, 
  ExternalLink,
  Clock,
  Compass,
  ArrowRight,
  Flame,
  Globe,
  Tag
} from 'lucide-react';
import { HistoricalEvent, YearData } from '../types';
import { 
  MONTH_NAMES, 
  DAYS_IN_MONTH, 
  getDailyVintageHeadline,
  YEARLY_ECONOMICS
} from '../data/historicalEconomicsAndTech';

interface ExactDateExplorerProps {
  yearData: YearData;
  selectedMonth: number | null; // 1-12 or null
  selectedDay: number | null; // 1-31 or null
  onSelectExactDate: (month: number | null, day: number | null) => void;
  onSelectEvent: (event: HistoricalEvent) => void;
}

export const ExactDateExplorer: React.FC<ExactDateExplorerProps> = ({
  yearData,
  selectedMonth,
  selectedDay,
  onSelectExactDate,
  onSelectEvent
}) => {
  const [activeMonth, setActiveMonth] = useState<number>(selectedMonth || 6); // Default June
  const [activeDay, setActiveDay] = useState<number>(selectedDay || 15); // Default 15th
  const [isPickerExpanded, setIsPickerExpanded] = useState<boolean>(Boolean(selectedMonth));
  const [newspaperTheme, setNewspaperTheme] = useState<'vintage' | 'modern'>('vintage');

  const y = yearData.year;
  const maxDays = DAYS_IN_MONTH[activeMonth - 1] || 30;

  // Filter events matching the selected date or month
  const matchingEvents = useMemo(() => {
    if (!selectedMonth) return yearData.events;

    const monthPadded = String(selectedMonth).padStart(2, '0');
    const dayPadded = selectedDay ? String(selectedDay).padStart(2, '0') : '';

    return yearData.events.filter(e => {
      if (!e.date) return false;
      if (selectedDay) {
        // Match YYYY-MM-DD
        return e.date.includes(`-${monthPadded}-${dayPadded}`) || e.date.includes(`-${monthPadded}-`);
      }
      // Match YYYY-MM
      return e.date.includes(`-${monthPadded}`);
    });
  }, [yearData.events, selectedMonth, selectedDay]);

  const vintageFrontPage = useMemo(() => {
    return getDailyVintageHeadline(y, activeMonth, activeDay);
  }, [y, activeMonth, activeDay]);

  const handleApplyDate = (m: number, d: number) => {
    setActiveMonth(m);
    setActiveDay(d);
    onSelectExactDate(m, d);
  };

  const handleClearDate = () => {
    onSelectExactDate(null, null);
    setIsPickerExpanded(false);
  };

  // Quick preset historic dates in this year
  const eraQuickDates = [
    { label: "New Year's Day", month: 1, day: 1 },
    { label: "Spring Equinox", month: 3, day: 21 },
    { label: "Summer Solstice", month: 6, day: 21 },
    { label: "Autumn Milestone", month: 8, day: 15 },
    { label: "Gandhi Jayanti", month: 10, day: 2 },
    { label: "Year-End Finale", month: 12, day: 31 },
  ];

  return (
    <div id="exact-date-filter-section" className="bg-[#FAF8F2] border border-[#E5E3D8] rounded-[28px] p-5 sm:p-7 shadow-sm space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center shadow-xs">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-serif font-bold text-[#2C2C26]">
                "What Happened on this Exact Date?"
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-white border border-[#E5E3D8] text-[10px] font-bold text-[#5A5A40] uppercase">
                Day in the Life
              </span>
            </div>
            <p className="text-xs text-[#8C8A7D]">
              Filter from the entire year of {y} down to daily headlines and front-page news.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedMonth ? (
            <button
              onClick={handleClearDate}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C05A3E]/10 hover:bg-[#C05A3E]/20 text-[#C05A3E] text-xs font-semibold border border-[#C05A3E]/30 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Date ({MONTH_NAMES[selectedMonth - 1]} {selectedDay || ''})</span>
            </button>
          ) : (
            <button
              onClick={() => setIsPickerExpanded(prev => !prev)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{isPickerExpanded ? 'Hide Date Selector' : 'Select Exact Month & Day'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Month & Day Picker Selector */}
      {isPickerExpanded && (
        <div className="bg-white border border-[#E5E3D8] rounded-2xl p-5 space-y-4 shadow-xs animate-fadeIn">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#E5E3D8]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2C2C26] uppercase tracking-wide">
                1. Select Month:
              </span>
            </div>
            
            {/* Quick Era Jump Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-[#8C8A7D] mr-1">Quick Jumps:</span>
              {eraQuickDates.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyDate(q.month, q.day)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    activeMonth === q.month && activeDay === q.day
                      ? 'bg-[#5A5A40] text-white'
                      : 'bg-[#F5F2EA] text-[#636158] hover:bg-[#E5E3D8]'
                  }`}
                >
                  {q.label} ({MONTH_NAMES[q.month - 1].slice(0, 3)} {q.day})
                </button>
              ))}
            </div>
          </div>

          {/* Month Pills Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {MONTH_NAMES.map((m, idx) => {
              const mNum = idx + 1;
              const isSelected = activeMonth === mNum;
              return (
                <button
                  key={m}
                  onClick={() => {
                    setActiveMonth(mNum);
                    if (activeDay > DAYS_IN_MONTH[idx]) setActiveDay(DAYS_IN_MONTH[idx]);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    isSelected
                      ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                      : 'bg-[#FDFCF8] text-[#2C2C26] border-[#E5E3D8] hover:border-[#5A5A40]/40'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {/* Day Number Slider / Chips */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#2C2C26] uppercase tracking-wide">
                2. Select Day of the Month (1–{maxDays}):
              </span>
              <span className="text-xs font-serif font-bold text-[#C05A3E] px-2 py-0.5 rounded-md bg-[#C05A3E]/10">
                {MONTH_NAMES[activeMonth - 1]} {activeDay}, {y}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {Array.from({ length: maxDays }, (_, i) => i + 1).map(d => {
                const isSelected = activeDay === d;
                return (
                  <button
                    key={d}
                    onClick={() => setActiveDay(d)}
                    className={`w-9 h-9 shrink-0 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#C05A3E] text-white shadow-xs scale-105'
                        : 'bg-[#F5F2EA] text-[#636158] hover:bg-[#E5E3D8] hover:text-[#2C2C26]'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => handleApplyDate(activeMonth, activeDay)}
              className="px-6 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#484832] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Apply Date Filter ({MONTH_NAMES[activeMonth - 1]} {activeDay}, {y})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* --- VINTAGE NEWSPAPER FRONT PAGE SIMULATOR --- */}
      <div className="relative border-2 border-[#2C2C26] rounded-2xl bg-[#FFFDF5] p-6 sm:p-8 shadow-md overflow-hidden font-serif">
        
        {/* Newspaper Masthead */}
        <div className="border-b-4 border-double border-[#2C2C26] pb-4 mb-4 text-center space-y-2">
          
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[#636158] border-b border-[#2C2C26] pb-1">
            <span>VOL. CXXIV NO. {y * 31 + activeMonth * 28 + activeDay}</span>
            <span>{vintageFrontPage.editionLocation}</span>
            <span>LATE CITY EDITION • 25¢ / ₹2.50</span>
          </div>

          <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-[#1A1A14] py-1 font-serif">
            {vintageFrontPage.newspaperName}
          </h3>

          <div className="flex flex-wrap items-center justify-between text-xs font-serif italic text-[#4A4A3E] border-t border-[#2C2C26] pt-1">
            <span>{MONTH_NAMES[activeMonth - 1]} {activeDay}, {y}</span>
            <span className="font-bold text-[#C05A3E]">{vintageFrontPage.subHeadline}</span>
            <span>The Archival Record</span>
          </div>
        </div>

        {/* Financial & Commodity Bar */}
        <div className="bg-[#F5F2EA] border border-[#2C2C26] rounded-lg p-2 text-[11px] font-mono text-[#2C2C26] flex items-center justify-between gap-2 overflow-x-auto mb-5">
          <div className="flex items-center gap-1.5 shrink-0 font-bold text-[#5A5A40]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>DAILY TICKER ({y}):</span>
          </div>
          <span className="truncate">{vintageFrontPage.dailyPriceTicker}</span>
        </div>

        {/* Lead Headline Story & Multi-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Story Column (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <h4 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1A1A14] leading-tight border-b-2 border-[#2C2C26] pb-2">
              {vintageFrontPage.leadHeadline}
            </h4>

            <div className="columns-1 sm:columns-2 gap-4 text-xs leading-relaxed text-[#3C3C32] text-justify space-y-3">
              <p>
                <span className="float-left text-3xl font-extrabold leading-none pr-1.5 pt-0.5 text-[#1A1A14]">
                  O
                </span>
                n this day in {y}, public attention was gripped by significant societal and global transformations. Contemporary press bureaus documented shifting geopolitical balances and accelerating technological adoption that came to define this pivotal era.
              </p>
              <p>
                {vintageFrontPage.globalNews[0]}
              </p>
              <p>
                {vintageFrontPage.indiaNews[0]}
              </p>
              <p>
                {vintageFrontPage.globalNews[1]}
              </p>
            </div>

            {/* Weather & Society Snippet */}
            <div className="bg-[#FAF8F2] border-t border-b border-[#2C2C26] py-2 px-3 text-[11px] italic text-[#4A4A3E] flex items-center justify-between">
              <span>{vintageFrontPage.weatherSnapshot}</span>
              <span className="font-bold">Dispatch Filed from Bureau Wires</span>
            </div>
          </div>

          {/* Side Column: Historical Events Occurring In/Around this Date (Right 4 Cols) */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l lg:border-[#2C2C26] lg:pl-5 space-y-3">
            <div className="border-b border-[#2C2C26] pb-1 flex items-center justify-between">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#1A1A14]">
                Recorded Milestones ({y})
              </h5>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#2C2C26] text-white rounded">
                {matchingEvents.length} items
              </span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              {matchingEvents.length > 0 ? (
                matchingEvents.slice(0, 5).map(evt => (
                  <div
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    className="p-2.5 bg-white border border-[#E5E3D8] hover:border-[#2C2C26] rounded-xl cursor-pointer transition-all hover:shadow-xs group"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#C05A3E]">
                        {evt.displayDate || evt.date}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F5F2EA] text-[#636158] font-sans font-bold">
                        {evt.category}
                      </span>
                    </div>
                    <h6 className="text-xs font-bold text-[#1A1A14] group-hover:text-[#5A5A40] transition-colors line-clamp-2">
                      {evt.title}
                    </h6>
                    <p className="text-[11px] text-[#636158] font-sans line-clamp-2 mt-0.5">
                      {evt.shortDescription}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-white border border-dashed border-[#E5E3D8] rounded-xl text-center text-xs text-[#8C8A7D]">
                  <p>No standalone single-day item logged for this exact date in our curated index.</p>
                  <p className="mt-1 text-[11px] font-serif italic">Showing seasonal occurrences across {MONTH_NAMES[activeMonth - 1]} {y}.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
