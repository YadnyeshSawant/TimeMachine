import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Flag, 
  Disc, 
  Globe 
} from 'lucide-react';
import { DecadeOverview } from '../types';
import { api } from '../services/api';

interface DecadeExplorerProps {
  onSelectYear: (year: number) => void;
}

export const DecadeExplorer: React.FC<DecadeExplorerProps> = ({ onSelectYear }) => {
  const [decades, setDecades] = useState<DecadeOverview[]>([]);
  const [selectedDecade, setSelectedDecade] = useState<number>(1990);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDecades = async () => {
      setLoading(true);
      try {
        const data = await api.getDecades();
        setDecades(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDecades();
  }, []);

  const activeDecadeData = decades.find(d => d.decade === selectedDecade) || decades[0];

  return (
    <div id="decade-explorer-view" className="w-full max-w-5xl mx-auto py-6 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] text-[#5A5A40] text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-[#C05A3E]" />
          <span>Epochal Panorama</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2C26] tracking-tight">
          Decades in Perspective (1990 – 2026)
        </h1>
        <p className="text-[#636158] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Explore the macro paradigm shifts, cultural movements, technological breakthroughs, and India's transformation across four distinct modern decades.
        </p>
      </div>

      {/* Decade Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1990, 2000, 2010, 2020].map((dec) => {
          const isSelected = selectedDecade === dec;
          const decadeLabels: Record<number, { title: string; sub: string }> = {
            1990: { title: "The 1990s", sub: "Web & Liberalization" },
            2000: { title: "The 2000s", sub: "Broadband & Mobile" },
            2010: { title: "The 2010s", sub: "Cloud, 4G & UPI" },
            2020: { title: "The 2020s", sub: "Generative AI & Space" },
          };

          return (
            <button
              key={dec}
              id={`decade-tab-${dec}`}
              onClick={() => setSelectedDecade(dec)}
              className={`p-4 rounded-[24px] border text-left transition-all ${
                isSelected
                  ? 'bg-white border-[#5A5A40] text-[#2C2C26] shadow-sm ring-1 ring-[#5A5A40]'
                  : 'bg-[#F5F2EA] border-[#E5E3D8] text-[#636158] hover:border-[#8C8A7D] hover:text-[#2C2C26]'
              }`}
            >
              <div className="font-sans text-xs font-bold text-[#C05A3E] mb-1">{dec} – {dec === 2020 ? '2026' : dec + 9}</div>
              <div className="font-serif font-bold text-base text-[#2C2C26]">{decadeLabels[dec].title}</div>
              <div className="text-[11px] text-[#8C8A7D] truncate">{decadeLabels[dec].sub}</div>
            </button>
          );
        })}
      </div>

      {/* Active Decade Content Card */}
      {activeDecadeData && (
        <div className="bg-white border border-[#E5E3D8] rounded-[32px] overflow-hidden shadow-sm">
          
          {/* Banner */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#F5F2EA]">
            <img 
              src={activeDecadeData.bannerImage} 
              alt={activeDecadeData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-white text-[#5A5A40] font-bold text-xs shadow-xs border border-[#E5E3D8]">
                {activeDecadeData.yearsRange}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {activeDecadeData.name}
              </h2>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Summary & Defining Paradigm */}
            <div className="space-y-4">
              <p className="text-sm sm:text-base text-[#636158] leading-relaxed">
                {activeDecadeData.summary}
              </p>

              <div className="p-5 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
                <div className="text-xs font-bold text-[#C05A3E] uppercase tracking-wider mb-1">Defining Paradigm</div>
                <p className="text-sm text-[#2C2C26] font-medium leading-relaxed">{activeDecadeData.definingParadigm}</p>
              </div>
            </div>

            {/* 3 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Breakthrough Inventions */}
              <div className="p-5 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-3">
                  <Cpu className="w-4 h-4 text-[#5A5A40]" />
                  <span>Breakthrough Inventions</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#2C2C26]">
                  {activeDecadeData.breakthroughInventions.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5A5A40] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cultural Phenomena */}
              <div className="p-5 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C05A3E] uppercase tracking-wider mb-3">
                  <Disc className="w-4 h-4 text-[#C05A3E]" />
                  <span>Cultural Touchstones</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#2C2C26]">
                  {activeDecadeData.culturalPhenomena.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C05A3E] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* India Milestones */}
              <div className="p-5 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-3">
                  <Flag className="w-4 h-4 text-[#C05A3E]" />
                  <span>India's Transformation</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#2C2C26]">
                  {activeDecadeData.indiaMilestones.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C05A3E] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Jump to specific year in this decade */}
            <div className="pt-6 border-t border-[#E5E3D8] flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-[#636158] font-medium">Jump into a specific year from this decade:</div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: selectedDecade === 2020 ? 7 : 10 }, (_, i) => selectedDecade + i).map((y) => (
                  <button
                    key={y}
                    onClick={() => onSelectYear(y)}
                    className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E3D8] text-[#2C2C26] hover:bg-[#5A5A40] hover:text-white hover:border-[#5A5A40] font-sans text-xs font-semibold transition-all shadow-xs"
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
