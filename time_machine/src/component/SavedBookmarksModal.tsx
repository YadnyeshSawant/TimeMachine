import React from 'react';
import { 
  Bookmark, 
  X, 
  Trash2, 
  Calendar, 
  ArrowRight, 
  Download, 
  ExternalLink 
} from 'lucide-react';
import { HistoricalEvent } from '../types';

interface SavedBookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedEvents: HistoricalEvent[];
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
  onSelectEvent: (event: HistoricalEvent) => void;
}

export const SavedBookmarksModal: React.FC<SavedBookmarksModalProps> = ({
  isOpen,
  onClose,
  savedEvents,
  onRemoveBookmark,
  onClearAll,
  onSelectEvent
}) => {
  if (!isOpen) return null;

  const exportBookmarks = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedEvents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `time-machine-saved-milestones-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div 
      id="bookmarks-vault-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div 
        id="bookmarks-vault-dialog"
        className="w-full max-w-2xl bg-white border border-[#E5E3D8] rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[80vh] text-[#2C2C26]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E5E3D8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#F5F2EA] text-[#5A5A40] border border-[#E5E3D8]">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#2C2C26]">Saved Historical Milestones</h2>
              <p className="text-xs text-[#636158]">{savedEvents.length} items in your personal timeline vault</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-[#F5F2EA] text-[#636158] hover:text-[#2C2C26] border border-[#E5E3D8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 scrollbar-thin">
          {savedEvents.length === 0 ? (
            <div className="py-16 text-center text-[#8C8A7D] space-y-3">
              <Bookmark className="w-10 h-10 mx-auto text-[#8C8A7D] mb-2 stroke-1 opacity-50" />
              <p className="text-sm font-serif">No saved milestones yet.</p>
              <p className="text-xs text-[#8C8A7D] max-w-sm mx-auto">
                Click the bookmark icon on any historical event across 1990-2026 to curate your own personal history chronicle.
              </p>
            </div>
          ) : (
            savedEvents.map((evt) => (
              <div 
                key={evt.id}
                className="p-4 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8] hover:border-[#5A5A40] flex items-center justify-between gap-4 transition-all"
              >
                <div 
                  className="cursor-pointer flex-1 min-w-0"
                  onClick={() => {
                    onSelectEvent(evt);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2 text-xs text-[#C05A3E] font-sans font-semibold mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{evt.displayDate}</span>
                    <span className="text-[#8C8A7D]">•</span>
                    <span className="text-[#636158] font-normal">{evt.category.replace('_', ' ')}</span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-[#2C2C26] hover:text-[#5A5A40] transition-colors truncate">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-[#636158] line-clamp-1 truncate">{evt.shortDescription}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectEvent(evt);
                      onClose();
                    }}
                    className="p-2.5 rounded-full bg-white border border-[#E5E3D8] text-[#5A5A40] hover:bg-[#5A5A40] hover:text-white transition-all text-xs font-bold shadow-xs"
                    title="View details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRemoveBookmark(evt.id)}
                    className="p-2.5 rounded-full bg-white border border-[#E5E3D8] text-[#636158] hover:text-[#C05A3E] hover:border-[#C05A3E] transition-all shadow-xs"
                    title="Remove from bookmarks"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {savedEvents.length > 0 && (
          <div className="p-4 bg-[#F5F2EA] border-t border-[#E5E3D8] flex items-center justify-between gap-4">
            <button
              onClick={onClearAll}
              className="text-xs text-[#C05A3E] hover:text-[#a0462e] font-semibold"
            >
              Clear All Bookmarks
            </button>

            <button
              onClick={exportBookmarks}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#5A5A40] text-white font-bold text-xs hover:bg-[#484832] transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Timeline (JSON)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
