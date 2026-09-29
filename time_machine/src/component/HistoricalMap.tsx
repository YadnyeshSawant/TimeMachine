import React, { useState } from 'react';
import { MapPin, Globe, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { HistoricalEvent } from '../types';

interface HistoricalMapProps {
  events: HistoricalEvent[];
  selectedYear: number;
  onSelectEvent: (event: HistoricalEvent) => void;
}

export const HistoricalMap: React.FC<HistoricalMapProps> = ({
  events,
  selectedYear,
  onSelectEvent
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'INDIA' | 'GLOBAL'>('ALL');
  const [selectedPin, setSelectedPin] = useState<HistoricalEvent | null>(null);

  // Filter events with location coordinates
  const mappedEvents = events.filter(e => e.location && e.location.coordinates);

  const filteredEvents = mappedEvents.filter(e => {
    if (activeFilter === 'INDIA') return e.location?.country.toLowerCase().includes('india');
    if (activeFilter === 'GLOBAL') return !e.location?.country.toLowerCase().includes('india');
    return true;
  });

  // Calculate approximate SVG position from lat/lng
  // Simple Equirectangular projection: x = (lng + 180) * (width / 360), y = (90 - lat) * (height / 180)
  const getCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) * 100) / 360;
    const y = ((90 - lat) * 100) / 180;
    return { left: `${Math.max(4, Math.min(96, x))}%`, top: `${Math.max(8, Math.min(92, y))}%` };
  };

  return (
    <div id="historical-map-view" className="w-full max-w-5xl mx-auto py-6 space-y-6 animate-fadeIn">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans text-[#C05A3E] uppercase tracking-wider font-bold mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Geographic Distribution • Year {selectedYear}</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#2C2C26]">Historical Map of {selectedYear}</h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#F5F2EA] p-1.5 rounded-full border border-[#E5E3D8]">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all ${
              activeFilter === 'ALL' ? 'bg-[#5A5A40] text-white shadow-xs' : 'text-[#636158] hover:text-[#2C2C26]'
            }`}
          >
            All Coordinates ({mappedEvents.length})
          </button>
          <button
            onClick={() => setActiveFilter('INDIA')}
            className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all ${
              activeFilter === 'INDIA' ? 'bg-[#C05A3E] text-white shadow-xs' : 'text-[#636158] hover:text-[#2C2C26]'
            }`}
          >
            India ({mappedEvents.filter(e => e.location?.country.toLowerCase().includes('india')).length})
          </button>
          <button
            onClick={() => setActiveFilter('GLOBAL')}
            className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all ${
              activeFilter === 'GLOBAL' ? 'bg-[#5A5A40] text-white shadow-xs' : 'text-[#636158] hover:text-[#2C2C26]'
            }`}
          >
            Global
          </button>
        </div>
      </div>

      {/* Map Stage Container */}
      <div className="relative w-full h-[460px] sm:h-[520px] bg-[#F5F2EA] border border-[#E5E3D8] rounded-[32px] overflow-hidden p-4 shadow-sm">
        
        {/* Stylized Vector World Grid Background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none flex items-center justify-center">
          <svg className="w-full h-full text-[#8C8A7D]" viewBox="0 0 1000 500" fill="currentColor">
            {/* Simplified Continents outline paths */}
            <path d="M150,120 Q180,90 240,110 T320,160 Q280,240 220,260 T160,200 Z" opacity="0.35" />
            <path d="M420,100 Q500,80 580,120 T620,200 Q540,240 460,200 Z" opacity="0.35" />
            <path d="M680,140 Q750,110 840,150 T880,240 Q800,280 720,220 Z" opacity="0.35" />
            <path d="M650,220 Q700,200 740,250 T710,320 Q660,300 640,250 Z" opacity="0.45" />
            <path d="M260,300 Q320,290 350,360 T310,440 Q250,420 240,350 Z" opacity="0.35" />
            <path d="M480,240 Q550,230 580,310 T530,420 Q460,380 460,280 Z" opacity="0.35" />
            <path d="M780,340 Q840,330 870,390 T820,440 Q760,420 760,360 Z" opacity="0.35" />
          </svg>
        </div>

        {/* Lat / Long Grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#8C8A7D_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        {/* Render Event Markers */}
        {filteredEvents.map((evt) => {
          if (!evt.location?.coordinates) return null;
          const coords = getCoordinates(evt.location.coordinates[0], evt.location.coordinates[1]);
          const isIndia = evt.location.country.toLowerCase().includes('india');
          const isSelected = selectedPin?.id === evt.id;

          return (
            <div
              key={evt.id}
              style={{ top: coords.top, left: coords.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <button
                id={`map-marker-${evt.id}`}
                onClick={() => setSelectedPin(evt)}
                className={`relative group p-2 rounded-full transition-all duration-300 ${
                  isSelected 
                    ? 'scale-125 z-30' 
                    : 'hover:scale-110'
                }`}
              >
                {/* Ping Pulse */}
                <span className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
                  isIndia ? 'bg-[#C05A3E]' : 'bg-[#5A5A40]'
                }`} />

                {/* Marker Center */}
                <div className={`relative w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white ${
                  isIndia ? 'bg-[#C05A3E]' : 'bg-[#5A5A40]'
                }`}>
                  <MapPin className="w-3.5 h-3.5 fill-current" />
                </div>
              </button>
            </div>
          );
        })}

        {/* Selected Pin Popover / Card Overlay */}
        {selectedPin && (
          <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 bg-white/95 backdrop-blur-md border border-[#E5E3D8] rounded-[28px] p-6 shadow-md z-30 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-[#8C8A7D] mb-2">
              <span className="font-bold text-[#C05A3E]">{selectedPin.location?.name}, {selectedPin.location?.country}</span>
              <span className="font-sans font-semibold text-[#8C8A7D]">{selectedPin.displayDate}</span>
            </div>

            <h4 className="text-base font-serif font-bold text-[#2C2C26] mb-2 leading-snug">{selectedPin.title}</h4>
            <p className="text-xs text-[#636158] line-clamp-3 mb-4 leading-relaxed">{selectedPin.shortDescription}</p>

            <div className="flex items-center justify-between pt-3.5 border-t border-[#E5E3D8]">
              <button
                onClick={() => setSelectedPin(null)}
                className="text-xs text-[#8C8A7D] hover:text-[#2C2C26] font-medium"
              >
                Dismiss
              </button>
              <button
                onClick={() => onSelectEvent(selectedPin)}
                className="flex items-center gap-1 text-xs font-bold text-[#5A5A40] hover:text-[#2C2C26]"
              >
                <span>Full Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-4 right-4 flex items-center gap-3 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#E5E3D8] text-[11px] text-[#2C2C26] shadow-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C05A3E]" />
            <span className="font-medium">India Milestone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#5A5A40]" />
            <span className="font-medium">World Event</span>
          </div>
        </div>

      </div>

      {/* Grid of Geocoded Events in Current Year */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredEvents.map((evt) => (
          <div 
            key={evt.id}
            onClick={() => onSelectEvent(evt)}
            className="p-5 rounded-[24px] bg-white border border-[#E5E3D8] hover:border-[#5A5A40] cursor-pointer transition-all flex flex-col justify-between shadow-xs hover:shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#8C8A7D] mb-2">
                <span className="font-sans font-semibold text-[#C05A3E]">{evt.displayDate}</span>
                <span className="text-[11px] text-[#8C8A7D]">{evt.location?.name}</span>
              </div>
              <h4 className="text-sm font-serif font-bold text-[#2C2C26] mb-1 line-clamp-1">{evt.title}</h4>
              <p className="text-xs text-[#636158] line-clamp-2 leading-relaxed">{evt.shortDescription}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
