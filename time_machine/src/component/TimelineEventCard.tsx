import React from 'react';
import { 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Bookmark, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { HistoricalEvent } from '../types';

interface TimelineEventCardProps {
  event: HistoricalEvent;
  onSelect: (event: HistoricalEvent) => void;
  isSaved?: boolean;
  onToggleSave?: (event: HistoricalEvent) => void;
}

export const TimelineEventCard: React.FC<TimelineEventCardProps> = ({
  event,
  onSelect,
  isSaved,
  onToggleSave
}) => {
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'INDIA_EVENTS':
        return { label: 'India Milestone', bg: 'bg-[#F5F2EA] text-[#C05A3E] border-[#E5E3D8]' };
      case 'WORLD_EVENTS':
        return { label: 'World Event', bg: 'bg-[#F5F2EA] text-[#5A5A40] border-[#E5E3D8]' };
      case 'TECHNOLOGY':
        return { label: 'Technology', bg: 'bg-[#F5F2EA] text-[#4A6B5B] border-[#E5E3D8]' };
      case 'SCIENCE':
        return { label: 'Science & Space', bg: 'bg-[#F5F2EA] text-[#5A5A40] border-[#E5E3D8]' };
      case 'SPORTS':
        return { label: 'Sports', bg: 'bg-[#F5F2EA] text-[#8C6B38] border-[#E5E3D8]' };
      default:
        return { label: category.replace('_', ' '), bg: 'bg-[#F5F2EA] text-[#636158] border-[#E5E3D8]' };
    }
  };

  const badge = getCategoryBadge(event.category);

  return (
    <div 
      id={`event-card-${event.id}`}
      className="group relative bg-white border border-[#E5E3D8] hover:border-[#5A5A40] rounded-[28px] overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col justify-between"
    >
      {/* Top Banner Image (if present) */}
      {event.imageUrl && (
        <div className="relative h-44 w-full overflow-hidden bg-[#F5F2EA]">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          
          {/* Category Tag on Image */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border backdrop-blur-md shadow-xs ${badge.bg}`}>
              {badge.label}
            </span>
          </div>

          {/* Bookmark Button */}
          {onToggleSave && (
            <button
              id={`bookmark-btn-${event.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(event);
              }}
              className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md border transition-all ${
                isSaved 
                  ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs' 
                  : 'bg-white/90 text-[#636158] border-[#E5E3D8] hover:text-[#5A5A40]'
              }`}
              title={isSaved ? "Remove from bookmarks" : "Save milestone"}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>
          )}
        </div>
      )}

      {/* Card Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Location header */}
          <div className="flex items-center justify-between text-xs text-[#8C8A7D] mb-3">
            <div className="flex items-center gap-1.5 font-sans font-semibold text-[#C05A3E]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{event.displayDate}</span>
            </div>

            {event.location && (
              <div className="flex items-center gap-1 text-[11px] text-[#8C8A7D] truncate max-w-[140px]">
                <MapPin className="w-3 h-3 text-[#8C8A7D] shrink-0" />
                <span className="truncate">{event.location.name}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(event)}
            className="text-base sm:text-lg font-serif font-bold text-[#2C2C26] group-hover:text-[#5A5A40] transition-colors leading-snug cursor-pointer mb-2"
          >
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#636158] leading-relaxed line-clamp-3 mb-4">
            {event.shortDescription}
          </p>
        </div>

        {/* Footer: Tags & Provenance Source */}
        <div className="pt-3.5 border-t border-[#E5E3D8] flex items-center justify-between gap-2">
          {/* Source Provenance Link */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#8C8A7D] truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
            <span className="truncate">{event.source.sourceName.split(' ')[0]}</span>
          </div>

          {/* Detail Trigger */}
          <button
            id={`view-detail-btn-${event.id}`}
            onClick={() => onSelect(event)}
            className="flex items-center gap-1 text-xs font-semibold text-[#5A5A40] hover:text-[#2C2C26] transition-colors group/btn"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
