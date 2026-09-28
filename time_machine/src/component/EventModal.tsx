import React from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Bookmark, 
  ShieldCheck, 
  Sparkles, 
  Share2,
  Quote,
  Tag
} from 'lucide-react';
import { HistoricalEvent } from '../types';

interface EventModalProps {
  event: HistoricalEvent | null;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (event: HistoricalEvent) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  onClose,
  isSaved,
  onToggleSave
}) => {
  if (!event) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Exploring ${event.title} (${event.displayDate}) on TIME MACHINE: ${window.location.href}`
      );
      alert('Event link copied to clipboard!');
    }
  };

  return (
    <div 
      id="event-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="event-detail-modal-dialog"
        className="relative w-full max-w-2xl bg-white border border-[#E5E3D8] rounded-[32px] overflow-hidden shadow-2xl my-8 text-[#2C2C26]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image or Gradient */}
        <div className="relative h-64 sm:h-72 w-full bg-[#F5F2EA] overflow-hidden">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#F5F2EA] flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-[#5A5A40]/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Close Button */}
          <button
            id="close-event-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 border border-[#E5E3D8] text-[#2C2C26] hover:bg-white transition-all backdrop-blur-md shadow-xs"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Actions: Bookmark & Share */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {onToggleSave && (
              <button
                id="modal-bookmark-btn"
                onClick={() => onToggleSave(event)}
                className={`p-2.5 rounded-full border backdrop-blur-md transition-all shadow-xs ${
                  isSaved 
                    ? 'bg-[#5A5A40] text-white border-[#5A5A40] font-bold' 
                    : 'bg-white/90 text-[#636158] border-[#E5E3D8] hover:text-[#5A5A40]'
                }`}
                title={isSaved ? "Saved" : "Save milestone"}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            )}

            <button
              id="modal-share-btn"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/90 border border-[#E5E3D8] text-[#636158] hover:text-[#2C2C26] hover:bg-white transition-all backdrop-blur-md shadow-xs"
              title="Share event link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Category & Date Pill */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#5A5A40] text-white shadow-xs">
              {event.category.replace('_', ' ')}
            </span>
            <div className="flex items-center gap-2 font-sans font-semibold text-xs text-white bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20">
              <Calendar className="w-3.5 h-3.5 text-[#E5E3D8]" />
              <span>{event.displayDate}</span>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto scrollbar-thin">
          
          {/* Location if any */}
          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-[#8C8A7D] mb-2">
              <MapPin className="w-4 h-4 text-[#C05A3E]" />
              <span>{event.location.name}, {event.location.country}</span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2C26] leading-tight mb-4">
            {event.title}
          </h2>

          {/* Full Narrative Description */}
          <div className="text-sm sm:text-base text-[#636158] leading-relaxed space-y-4 mb-6">
            <p>{event.fullDescription || event.shortDescription}</p>
          </div>

          {/* Quote / Famous Statement if available */}
          {event.quotes && (
            <div className="my-6 p-5 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8] relative">
              <Quote className="w-6 h-6 text-[#C05A3E]/40 mb-1" />
              <p className="text-sm italic text-[#2C2C26] font-serif leading-relaxed">
                "{event.quotes.quote}"
              </p>
              <p className="text-xs text-[#5A5A40] mt-2 font-semibold text-right">
                — {event.quotes.by}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Tag className="w-3.5 h-3.5 text-[#8C8A7D]" />
            {event.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[#F5F2EA] text-[#636158] border border-[#E5E3D8]">
                #{tag}
              </span>
            ))}
          </div>

          {/* Provenance & Source Link Box */}
          <div className="p-5 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#5A5A40] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#2C2C26]">Verified Primary Citation</div>
                <div className="text-[11px] text-[#8C8A7D]">{event.source.sourceName}</div>
              </div>
            </div>

            <a
              href={event.source.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5A5A40] text-white font-bold text-xs hover:bg-[#484832] transition-colors shadow-xs"
            >
              <span>View Source Record</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
