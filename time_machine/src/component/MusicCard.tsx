import React, { useState, useEffect } from 'react';
import { Music, Disc3, ExternalLink, Sparkles, Volume2, Play, Pause, Loader2, Radio, Disc } from 'lucide-react';
import { MusicRecord } from '../types';
import { audioService, AudioPlayerState } from '../services/audioService';

interface MusicCardProps {
  music: MusicRecord;
  onOpenWalkman?: (music: MusicRecord) => void;
}

export const MusicCard: React.FC<MusicCardProps> = ({ music, onOpenWalkman }) => {
  const [playerState, setPlayerState] = useState<AudioPlayerState>(() => audioService.getState());

  useEffect(() => {
    const unsubscribe = audioService.subscribe((newState) => {
      setPlayerState(newState);
    });
    return unsubscribe;
  }, []);

  const isCurrentTrack = playerState.currentTrackId === music.id;
  const isPlaying = isCurrentTrack && playerState.isPlaying;
  const isLoading = isCurrentTrack && playerState.isLoading;

  const handleTogglePlay = () => {
    audioService.togglePlayMusic({
      id: music.id,
      title: music.title,
      artist: music.artist,
      album: music.album,
      coverUrl: music.coverUrl,
      year: music.year,
      originCountry: music.originCountry,
      genres: music.genres
    });
  };

  return (
    <div 
      id={`music-card-${music.id}`}
      className={`group bg-white border rounded-[28px] overflow-hidden transition-all duration-300 flex flex-col justify-between ${
        isPlaying 
          ? 'border-[#5A5A40] ring-2 ring-[#5A5A40]/20 shadow-md' 
          : 'border-[#E5E3D8] hover:border-[#5A5A40] hover:shadow-md'
      }`}
    >
      {/* Album Art & Vinyl Disc Mockup */}
      <div className="relative h-48 w-full overflow-hidden bg-[#F5F2EA] flex items-center justify-center p-4">
        <div className={`relative w-36 h-36 rounded-2xl overflow-hidden shadow-md border border-[#E5E3D8] transition-transform duration-500 ${
          isPlaying ? 'scale-105 ring-2 ring-[#5A5A40]' : 'group-hover:scale-105'
        }`}>
          <img 
            src={music.coverUrl} 
            alt={music.album}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Ambient Vinyl Disc */}
        <div className={`absolute -right-6 top-6 w-32 h-32 rounded-full border-4 border-[#E5E3D8] bg-[#2C2C26] shadow-md flex items-center justify-center transition-all duration-700 pointer-events-none ${
          isPlaying ? 'opacity-80 animate-spin' : 'opacity-30 group-hover:opacity-70'
        }`}>
          <div className="w-10 h-10 rounded-full bg-[#5A5A40]/40 border border-[#E5E3D8] flex items-center justify-center">
            <Disc3 className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Audio Playback Button */}
        <button
          onClick={handleTogglePlay}
          className={`absolute bottom-3.5 right-3.5 p-3 rounded-full transition-all shadow-md flex items-center justify-center group/btn active:scale-95 cursor-pointer ${
            isPlaying 
              ? 'bg-[#C05A3E] text-white hover:bg-[#a84d34] animate-pulse' 
              : 'bg-[#5A5A40] text-white hover:bg-[#484832]'
          }`}
          title={isPlaying ? "Pause music" : `Play sample of "${music.title}"`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current translate-x-0.5" />
          )}
        </button>

        {/* Origin Country or Playing Indicator */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
          <div className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#5A5A40] border border-[#E5E3D8] uppercase tracking-wider shadow-xs">
            {music.originCountry}
          </div>

          {isPlaying && (
            <div className="px-2.5 py-1 rounded-full bg-[#5A5A40] text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-xs">
              <span className="flex items-end gap-0.5 h-2.5">
                <span className="w-0.5 bg-white rounded-full h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                <span className="w-0.5 bg-white rounded-full h-2/3 animate-[pulse_0.4s_ease-in-out_infinite_0.1s]" />
                <span className="w-0.5 bg-white rounded-full h-4/5 animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
              </span>
              <span>Playing Audio</span>
            </div>
          )}
        </div>
      </div>

      {/* Playback Progress Ribbon */}
      {isCurrentTrack && (isPlaying || isLoading) && (
        <div className="w-full bg-[#F5F2EA] px-6 py-2 border-y border-[#E5E3D8] flex items-center justify-between text-[11px] text-[#5A5A40] font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-[#C05A3E] shrink-0" />
            <span className="truncate font-semibold">
              {playerState.audioSource === 'STREAM' ? 'Official 30s Audio Stream' : 'Harmonic Web Audio Synthesis'}
            </span>
          </div>
          <div className="font-mono text-[10px] text-[#636158]">
            {Math.floor(playerState.currentTime)}s / {Math.floor(playerState.duration || 30)}s
          </div>
        </div>
      )}

      {/* Music Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Song Title */}
          <h3 className="text-lg font-serif font-bold text-[#2C2C26] group-hover:text-[#5A5A40] transition-colors leading-snug mb-1">
            {music.title}
          </h3>

          {/* Artist & Album */}
          <div className="text-xs text-[#636158] font-medium mb-3">
            <span className="font-semibold text-[#2C2C26]">{music.artist}</span>
            <span className="text-[#8C8A7D] mx-1.5">•</span>
            <span className="text-[#8C8A7D] italic">{music.album}</span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {music.genres.map((g) => (
              <span key={g} className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#F5F2EA] text-[#636158] border border-[#E5E3D8]">
                {g}
              </span>
            ))}
          </div>

          {/* Notable Cultural Impact / Achievement */}
          <div className="bg-[#F5F2EA] p-3.5 rounded-2xl border border-[#E5E3D8] mb-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A5A40] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C05A3E]" />
              <span>Historical Impact</span>
            </div>
            <p className="text-xs text-[#636158] leading-relaxed">
              {music.notableAchievement}
            </p>
          </div>
        </div>

        {/* Source citation & Cassette Walkman Deck action */}
        <div className="pt-3.5 border-t border-[#E5E3D8] flex items-center justify-between text-[11px] text-[#8C8A7D]">
          {onOpenWalkman ? (
            <button
              onClick={() => onOpenWalkman(music)}
              className="flex items-center gap-1 text-[#5A5A40] hover:text-[#C05A3E] font-semibold transition-colors cursor-pointer"
            >
              <Disc className="w-3.5 h-3.5" />
              <span>Walkman Deck</span>
            </button>
          ) : (
            <span className="font-sans">MusicBrainz Catalog</span>
          )}

          <a
            href={music.source.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#8C8A7D] hover:text-[#2C2C26] transition-colors"
          >
            <span>Discography</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
