import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Radio, 
  Flame, 
  X, 
  Disc, 
  Sparkles,
  Music,
  ListMusic,
  Maximize2
} from 'lucide-react';
import { audioService, AudioPlayerState, MusicTrackItem } from '../services/audioService';

interface RetroCassetteModalProps {
  isOpen: boolean;
  onClose: () => void;
  year?: number;
  allYearTracks?: MusicTrackItem[];
}

export const RetroCassetteModal: React.FC<RetroCassetteModalProps> = ({
  isOpen,
  onClose,
  year = 1995,
  allYearTracks = []
}) => {
  const [audioState, setAudioState] = useState<AudioPlayerState>(audioService.getState());
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [cassetteColor, setCassetteColor] = useState<'retro-teal' | 'vintage-gold' | 'neon-magenta' | 'carbon-black'>('retro-teal');
  const animationRef = useRef<number | null>(null);
  const [reelAngle, setReelAngle] = useState(0);

  useEffect(() => {
    const unsub = audioService.subscribe(setAudioState);
    return () => unsub();
  }, []);

  // Smooth rotation for cassette reels when playing
  useEffect(() => {
    if (audioState.isPlaying) {
      let current = reelAngle;
      const step = () => {
        current = (current + 2.5) % 360;
        setReelAngle(current);
        animationRef.current = requestAnimationFrame(step);
      };
      animationRef.current = requestAnimationFrame(step);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [audioState.isPlaying]);

  if (!isOpen) return null;

  const currentTrack = audioState.title 
    ? {
        title: audioState.title,
        artist: audioState.artist || 'Unknown Artist',
        year: audioState.year || year,
        coverUrl: audioState.coverUrl,
        originCountry: audioState.originCountry
      }
    : (allYearTracks[0] || {
        title: `Hits of ${year}`,
        artist: 'Vintage Archive',
        year: year,
        coverUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=600&q=80',
        originCountry: 'Global'
      });

  const handlePlayToggle = () => {
    if (audioState.isPlaying) {
      audioService.pause();
    } else {
      if (audioState.currentTrackId) {
        audioService.togglePlayMusic({
          id: audioState.currentTrackId,
          title: currentTrack.title,
          artist: currentTrack.artist,
          coverUrl: currentTrack.coverUrl,
          year: currentTrack.year
        });
      } else if (allYearTracks.length > 0) {
        audioService.startEraRadio(allYearTracks, 0);
      }
    }
  };

  const handleStartRadio = () => {
    if (allYearTracks.length > 0) {
      audioService.startEraRadio(allYearTracks, 0);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Tape color themes
  const colorThemes = {
    'retro-teal': {
      body: 'from-cyan-950 via-slate-900 to-teal-950 border-cyan-700/60',
      label: 'bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 text-stone-900 border-amber-300/80',
      accent: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
      glow: 'shadow-cyan-900/40'
    },
    'vintage-gold': {
      body: 'from-amber-950 via-stone-900 to-yellow-950 border-amber-700/60',
      label: 'bg-gradient-to-r from-yellow-50 via-amber-100 to-yellow-100 text-stone-900 border-amber-400/80',
      accent: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
      glow: 'shadow-amber-900/40'
    },
    'neon-magenta': {
      body: 'from-fuchsia-950 via-neutral-900 to-pink-950 border-fuchsia-700/60',
      label: 'bg-gradient-to-r from-pink-50 via-purple-50 to-rose-100 text-stone-900 border-pink-300/80',
      accent: 'text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-950/40',
      glow: 'shadow-fuchsia-900/40'
    },
    'carbon-black': {
      body: 'from-neutral-900 via-stone-950 to-black border-neutral-700/60',
      label: 'bg-gradient-to-r from-stone-200 via-gray-100 to-stone-300 text-stone-900 border-stone-400',
      accent: 'text-stone-300 border-stone-600/50 bg-stone-900/50',
      glow: 'shadow-neutral-900/40'
    }
  };

  const currentTheme = colorThemes[cassetteColor];

  return (
    <div 
      id="retro-cassette-player-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-2xl bg-gradient-to-b from-stone-900 via-neutral-900 to-zinc-950 rounded-2xl border border-stone-700/80 shadow-2xl p-5 sm:p-7 text-stone-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Metallic Chrome Bar */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs tracking-widest text-amber-400 font-bold uppercase">
                  VINTAGE STEREO WALKMAN • {year} CAPSULE
                </span>
                {audioState.isRadioMode && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40">
                    ERA RADIO LIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-400">High Bias • Dolby NR System • Type II Tape</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Cassette Skin Palette Selector */}
            <div className="hidden sm:flex items-center gap-1.5 p-1 bg-stone-800/80 rounded-lg border border-stone-700">
              {(['retro-teal', 'vintage-gold', 'neon-magenta', 'carbon-black'] as const).map((colorKey) => (
                <button
                  key={colorKey}
                  onClick={() => setCassetteColor(colorKey)}
                  title={`Switch to ${colorKey} tape skin`}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    cassetteColor === colorKey ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                  } ${
                    colorKey === 'retro-teal' ? 'bg-teal-500' :
                    colorKey === 'vintage-gold' ? 'bg-amber-500' :
                    colorKey === 'neon-magenta' ? 'bg-fuchsia-500' : 'bg-stone-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="Close Cassette Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- MAIN CASSETTE SHELL --- */}
        <div className={`relative w-full rounded-xl bg-gradient-to-b ${currentTheme.body} p-4 sm:p-5 border-2 shadow-2xl ${currentTheme.glow} transition-colors duration-500`}>
          {/* Screw corner details */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full border border-stone-500 bg-stone-800 flex items-center justify-center">
            <div className="w-1 h-px bg-stone-400 rotate-45" />
          </div>
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-stone-500 bg-stone-800 flex items-center justify-center">
            <div className="w-1 h-px bg-stone-400 -rotate-45" />
          </div>
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full border border-stone-500 bg-stone-800 flex items-center justify-center">
            <div className="w-1 h-px bg-stone-400 -rotate-12" />
          </div>
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full border border-stone-500 bg-stone-800 flex items-center justify-center">
            <div className="w-1 h-px bg-stone-400 rotate-30" />
          </div>

          {/* Cassette Label Area */}
          <div className={`w-full rounded-lg ${currentTheme.label} p-3 sm:p-4 shadow-inner border relative overflow-hidden`}>
            {/* Lined paper texture & tape header */}
            <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-stone-600 font-bold border-b border-stone-300 pb-1 mb-2">
              <span>SIDE A • 90 MIN</span>
              <span className="bg-stone-800 text-amber-300 px-1.5 py-0.2 rounded text-[10px]">CHRONO-TAPE</span>
              <span>YEAR {currentTrack.year || year}</span>
            </div>

            {/* Handwritten style track title */}
            <div className="py-1">
              <div className="font-serif italic text-lg sm:text-xl font-bold text-stone-900 truncate leading-snug">
                {currentTrack.title}
              </div>
              <div className="font-mono text-xs font-semibold text-stone-700 truncate tracking-tight flex items-center gap-2 mt-0.5">
                <span>{currentTrack.artist}</span>
                {currentTrack.originCountry && (
                  <span className="text-[10px] uppercase px-1.5 py-0.5 bg-stone-200 rounded font-bold text-stone-700">
                    {currentTrack.originCountry}
                  </span>
                )}
              </div>
            </div>

            {/* Central Magnetic Tape Window with Spinning Reels */}
            <div className="mt-3 bg-stone-950/90 rounded-lg p-2.5 sm:p-3 border border-stone-800 relative flex items-center justify-between">
              {/* Left Reel (Spooling out) */}
              <div className="flex items-center gap-2">
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-stone-700 bg-stone-900 relative flex items-center justify-center shadow-inner"
                  style={{
                    transform: `rotate(${reelAngle}deg)`,
                    transition: audioState.isPlaying ? 'none' : 'transform 0.2s ease-out'
                  }}
                >
                  {/* Outer tape layer */}
                  <div 
                    className="absolute inset-1 rounded-full bg-amber-950/80 border border-amber-900"
                    style={{ opacity: 1 - (audioState.progress * 0.5) }}
                  />
                  {/* Inner plastic cog */}
                  <div className="w-6 h-6 rounded-full bg-white/90 border border-stone-400 flex items-center justify-center z-10 shadow">
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-950 flex items-center justify-center">
                      <div className="w-1 h-1 bg-stone-400 rounded-full" />
                    </div>
                  </div>
                  {/* Teeth spokes */}
                  <div className="absolute w-full h-1 bg-stone-700/60" />
                  <div className="absolute h-full w-1 bg-stone-700/60" />
                </div>
              </div>

              {/* Tape Center Window / Counter & Level Meter */}
              <div className="flex flex-col items-center justify-center px-2">
                <div className="font-mono text-xs sm:text-sm font-bold bg-black text-red-500 px-2 py-0.5 rounded border border-stone-700 shadow-inner">
                  {formatTime(audioState.currentTime)} / {formatTime(audioState.duration || 30)}
                </div>

                {/* Animated VU / Frequency bars */}
                <div className="flex items-end gap-1 h-6 mt-1.5">
                  {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={audioState.isPlaying ? {
                        height: [`${h * 0.3}%`, `${h}%`, `${h * 0.5}%`],
                        backgroundColor: h > 80 ? '#ef4444' : h > 60 ? '#f59e0b' : '#10b981'
                      } : {
                        height: '15%',
                        backgroundColor: '#52525b'
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.3 + (i * 0.05),
                        ease: 'easeInOut'
                      }}
                      className="w-1 rounded-t-sm"
                    />
                  ))}
                </div>

                <span className="text-[9px] font-mono tracking-widest text-stone-400 uppercase mt-0.5">
                  {audioState.audioSource === 'STREAM' ? 'STEREO HI-FI' : audioState.audioSource === 'SYNTHESIZER' ? 'CHIP SYNTH' : 'READY'}
                </span>
              </div>

              {/* Right Reel (Spooling in) */}
              <div className="flex items-center gap-2">
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-stone-700 bg-stone-900 relative flex items-center justify-center shadow-inner"
                  style={{
                    transform: `rotate(${reelAngle}deg)`,
                    transition: audioState.isPlaying ? 'none' : 'transform 0.2s ease-out'
                  }}
                >
                  {/* Outer tape layer expanding */}
                  <div 
                    className="absolute inset-1 rounded-full bg-amber-950/80 border border-amber-900"
                    style={{ opacity: 0.4 + (audioState.progress * 0.6) }}
                  />
                  {/* Inner plastic cog */}
                  <div className="w-6 h-6 rounded-full bg-white/90 border border-stone-400 flex items-center justify-center z-10 shadow">
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-950 flex items-center justify-center">
                      <div className="w-1 h-1 bg-stone-400 rounded-full" />
                    </div>
                  </div>
                  {/* Teeth spokes */}
                  <div className="absolute w-full h-1 bg-stone-700/60" />
                  <div className="absolute h-full w-1 bg-stone-700/60" />
                </div>
              </div>
            </div>

            {/* Tape Progress Scrubber Bar */}
            <div className="mt-3">
              <div 
                className="relative h-2 bg-stone-300 rounded-full overflow-hidden cursor-pointer shadow-inner"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = (e.clientX - rect.left) / rect.width;
                  audioService.seek(ratio);
                }}
              >
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full"
                  style={{ width: `${audioState.progress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- PHYSICAL TAPE TRANSPORT BUTTONS --- */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-6 gap-2">
          {/* REW / PREV */}
          <button
            onClick={() => audioService.prevTrack()}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-800 hover:bg-stone-700 active:translate-y-0.5 text-stone-200 font-mono text-xs font-bold rounded-lg border border-stone-600 shadow-md transition-all"
          >
            <SkipBack className="w-4 h-4" />
            <span>REW</span>
          </button>

          {/* PLAY / PAUSE */}
          <button
            onClick={handlePlayToggle}
            className={`col-span-2 sm:col-span-2 flex items-center justify-center gap-2 py-2.5 px-4 font-mono text-xs font-bold rounded-lg border shadow-md active:translate-y-0.5 transition-all ${
              audioState.isPlaying 
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 border-amber-300 shadow-amber-500/20' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-600/20'
            }`}
          >
            {audioState.isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>PLAY TAPE</span>
              </>
            )}
          </button>

          {/* STOP */}
          <button
            onClick={() => audioService.stop(false)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-800 hover:bg-stone-700 active:translate-y-0.5 text-stone-200 font-mono text-xs font-bold rounded-lg border border-stone-600 shadow-md transition-all"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>STOP</span>
          </button>

          {/* FF / NEXT */}
          <button
            onClick={() => audioService.nextTrack()}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-800 hover:bg-stone-700 active:translate-y-0.5 text-stone-200 font-mono text-xs font-bold rounded-lg border border-stone-600 shadow-md transition-all"
          >
            <SkipForward className="w-4 h-4" />
            <span>FFWD</span>
          </button>

          {/* ERA RADIO CONTINUOUS AUTOPLAY */}
          <button
            onClick={handleStartRadio}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 font-mono text-xs font-bold rounded-lg border shadow-md active:translate-y-0.5 transition-all ${
              audioState.isRadioMode
                ? 'bg-purple-600 text-white border-purple-400 ring-2 ring-purple-400/40'
                : 'bg-stone-800 hover:bg-stone-700 text-purple-300 border-stone-600'
            }`}
            title="Continuous era hits autoplay"
          >
            <Radio className="w-4 h-4" />
            <span>RADIO</span>
          </button>
        </div>

        {/* --- AUXILIARY CONTROLS (Tape Crackle FX, Volume, Playlist) --- */}
        <div className="mt-4 pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Vintage Vinyl / Tape Crackle Toggle */}
          <button
            onClick={() => audioService.toggleTapeCrackle()}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              audioState.isTapeCrackleActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/30'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${audioState.isTapeCrackleActive ? 'text-amber-400 animate-pulse' : ''}`} />
            <span>Tape Warmth & Crackle: <strong className="uppercase">{audioState.isTapeCrackleActive ? 'ON' : 'OFF'}</strong></span>
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                audioService.setVolume(nextMuted ? 0 : 0.85);
              }}
              className="text-stone-400 hover:text-stone-200 p-1"
            >
              {isMuted || audioState.volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : audioState.volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setIsMuted(v === 0);
                audioService.setVolume(v);
              }}
              className="w-20 sm:w-28 accent-amber-400 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
            />
          </div>

          {/* Playlist Drawer Toggle */}
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg border border-stone-700 transition-colors"
          >
            <ListMusic className="w-3.5 h-3.5 text-amber-400" />
            <span>Era Queue ({allYearTracks.length})</span>
          </button>
        </div>

        {/* --- EXPANDABLE ERA PLAYLIST QUEUE --- */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 pt-3 border-t border-stone-800 overflow-hidden"
            >
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{year} Definitive Tracklist</span>
                <span className="text-[11px] text-amber-400 lowercase">Click any song to load tape</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {allYearTracks.map((track, idx) => {
                  const isCurrent = audioState.currentTrackId === track.id || audioState.title === track.title;
                  return (
                    <div
                      key={track.id || idx}
                      onClick={() => {
                        audioService.togglePlayMusic(track, true);
                      }}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                        isCurrent
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                          : 'bg-stone-800/60 hover:bg-stone-800 border border-transparent text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="font-mono text-[10px] text-stone-500 w-4">
                          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <div className="truncate">
                          <div className="font-semibold truncate">{track.title}</div>
                          <div className="text-[10px] text-stone-400 truncate">{track.artist}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {track.originCountry && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-stone-700/80 text-stone-300 font-mono">
                            {track.originCountry}
                          </span>
                        )}
                        {isCurrent && audioState.isPlaying && (
                          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
