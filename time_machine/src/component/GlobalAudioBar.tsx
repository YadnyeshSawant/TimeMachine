import React, { useState, useEffect } from 'react';
import { Play, Pause, X, Volume2, Music2, Disc3, Sparkles, SkipBack, SkipForward, Radio, Flame, Disc } from 'lucide-react';
import { audioService, AudioPlayerState } from '../services/audioService';

interface GlobalAudioBarProps {
  onOpenDeck?: () => void;
}

export const GlobalAudioBar: React.FC<GlobalAudioBarProps> = ({ onOpenDeck }) => {
  const [state, setState] = useState<AudioPlayerState>(() => audioService.getState());

  useEffect(() => {
    return audioService.subscribe((newState) => {
      setState(newState);
    });
  }, []);

  if (!state.currentTrackId || (!state.isPlaying && !state.isLoading && state.progress === 0)) {
    return null;
  }

  const handleClosePlayer = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.stop();
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl animate-bounce-short">
      <div className="bg-[#2C2C26] text-white p-3 sm:p-3.5 rounded-[28px] shadow-2xl border border-[#5A5A40]/50 flex flex-col gap-2 backdrop-blur-lg relative">
        
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Track Info (clickable to open Deck) */}
          <div 
            onClick={onOpenDeck}
            className="flex items-center gap-2.5 sm:gap-3 min-w-0 cursor-pointer group flex-1"
            title="Click to open Retro Cassette Walkman Deck"
          >
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#5A5A40]/40 bg-black/40 shadow-sm">
              {state.coverUrl ? (
                <img src={state.coverUrl} alt="Album" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#E5E3D8]">
                  <Music2 className="w-5 h-5" />
                </div>
              )}
              {state.isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Disc3 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-xs font-serif font-bold text-white truncate flex items-center gap-1.5 group-hover:text-[#C05A3E] transition-colors">
                <span>{state.title || 'Historical Audio Track'}</span>
                {state.isRadioMode && (
                  <span className="px-1.5 py-0.2 bg-purple-500/30 text-purple-300 rounded font-mono text-[9px] font-bold">
                    RADIO
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#A8A69B] truncate flex items-center gap-1">
                <span>{state.artist}</span>
                {state.year && <span>({state.year})</span>}
                <span>•</span>
                <span className="text-[#C05A3E] font-medium">
                  {state.audioSource === 'STREAM' ? '30s Stream' : 'Synth Engine'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Player Transport Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Vintage Crackle Toggle */}
            <button
              onClick={() => audioService.toggleTapeCrackle()}
              className={`p-2 rounded-full transition-colors ${
                state.isTapeCrackleActive 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                  : 'bg-white/10 hover:bg-white/20 text-[#A8A69B]'
              }`}
              title={`Tape Crackle FX: ${state.isTapeCrackleActive ? 'ON' : 'OFF'}`}
            >
              <Flame className={`w-3.5 h-3.5 ${state.isTapeCrackleActive ? 'animate-pulse' : ''}`} />
            </button>

            {/* Prev Track if in radio */}
            {state.queue.length > 1 && (
              <button
                onClick={() => audioService.prevTrack()}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#A8A69B] hover:text-white transition-all flex items-center justify-center cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Play/Pause */}
            <button
              onClick={() => {
                if (state.isPlaying) {
                  audioService.pause();
                } else if (state.currentTrackId && state.title) {
                  audioService.togglePlayMusic({
                    id: state.currentTrackId,
                    title: state.title,
                    artist: state.artist || '',
                    coverUrl: state.coverUrl,
                    year: state.year
                  });
                }
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#5A5A40] text-white hover:bg-[#C05A3E] transition-all flex items-center justify-center shadow-sm cursor-pointer"
              title={state.isPlaying ? "Pause" : "Play"}
            >
              {state.isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
              )}
            </button>

            {/* Next Track if in radio */}
            {state.queue.length > 1 && (
              <button
                onClick={() => audioService.nextTrack()}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#A8A69B] hover:text-white transition-all flex items-center justify-center cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Open Full Walkman Cassette Modal */}
            {onOpenDeck && (
              <button
                onClick={onOpenDeck}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold font-mono tracking-wider cursor-pointer"
                title="Open Walkman Cassette Deck"
              >
                <Disc className="w-3 h-3" />
                <span>WALKMAN</span>
              </button>
            )}

            {/* Cut / Close Button */}
            <button
              id="mini-player-cut-close-button"
              onClick={handleClosePlayer}
              className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 transition-all flex items-center justify-center shadow-sm cursor-pointer ml-0.5 group/cut"
              title="Cut / Close Mini Player"
              aria-label="Cut / Close Mini Player"
            >
              <X className="w-4 h-4 transition-transform group-hover/cut:scale-110" />
            </button>
          </div>
        </div>

        {/* Scrubber Timeline Bar */}
        <div className="flex items-center gap-2 px-1">
          <span className="font-mono text-[9px] text-[#8C8A7D] w-6 text-right">
            {Math.floor(state.currentTime)}s
          </span>
          <div 
            className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              audioService.seek(ratio);
            }}
          >
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-[#C05A3E] rounded-full"
              style={{ width: `${state.progress * 100}%` }}
            />
          </div>
          <span className="font-mono text-[9px] text-[#8C8A7D] w-6">
            {Math.floor(state.duration || 30)}s
          </span>
        </div>

      </div>
    </div>
  );
};
