import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Film, 
  Star, 
  Award, 
  DollarSign, 
  User, 
  Calendar, 
  ExternalLink, 
  Clapperboard, 
  Sparkles,
  Play,
  Maximize2
} from 'lucide-react';
import { MovieRecord } from '../types';

interface MovieTrailerModalProps {
  movie: MovieRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MovieTrailerModal: React.FC<MovieTrailerModalProps> = ({
  movie,
  isOpen,
  onClose
}) => {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  if (!isOpen || !movie) return null;

  // Direct video ID or clean fallback
  const trailerId = movie.trailerYoutubeId || "2ilzidi_J8Q";
  const directYoutubeWatchUrl = movie.trailerYoutubeId 
    ? `https://www.youtube.com/watch?v=${movie.trailerYoutubeId}` 
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(`${movie.title} ${movie.year} official trailer`)}`;

  const embedUrl = `https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;

  return (
    <div
      id="movie-trailer-cinematic-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-4xl bg-stone-950 rounded-2xl border border-stone-800 shadow-2xl overflow-hidden text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Cinema Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900/90 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-serif tracking-wide">{movie.title}</h3>
                <span className="px-2 py-0.5 text-xs font-semibold bg-stone-800 text-amber-400 rounded-md border border-stone-700">
                  {movie.year}
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-stone-800 text-stone-300 rounded-md">
                  {movie.originCountry}
                </span>
              </div>
              <p className="text-xs text-stone-400">Directed by {movie.director}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={directYoutubeWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
              title="Watch on YouTube"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">YouTube</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="Close Movie Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- CINEMA SCREEN / TRAILER VIEWPORT --- */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group">
          {/* Ambient Projector Lighting Beam */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent z-10 pointer-events-none" />

          {isPlayingTrailer ? (
            <div className="w-full h-full relative z-20">
              {/* Verified Direct YouTube Embed */}
              <iframe
                title={`${movie.title} Trailer`}
                src={embedUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <button
                onClick={() => setIsPlayingTrailer(false)}
                className="absolute top-3 right-3 px-2.5 py-1 bg-black/80 hover:bg-stone-800 text-stone-200 text-xs font-medium rounded-md border border-stone-700/80 backdrop-blur-sm transition-colors z-30"
              >
                Exit Player
              </button>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Movie Backdrop Poster Background */}
              <img
                src={movie.backdropUrl || movie.posterUrl}
                alt={movie.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-sm scale-105"
              />
              
              {/* Overlay Content */}
              <div className="relative z-20 flex flex-col items-center justify-center p-6 text-center max-w-lg">
                <button
                  onClick={() => setIsPlayingTrailer(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all mb-4 group/btn cursor-pointer"
                >
                  <Play className="w-8 h-8 fill-current translate-x-0.5 group-hover/btn:scale-110 transition-transform" />
                </button>

                <h4 className="text-xl font-bold text-white mb-1">Watch Official Trailer</h4>
                <p className="text-xs text-stone-300 mb-4 max-w-md">
                  Experience the theatrical preview and cinematic promos for {movie.title} ({movie.year}).
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingTrailer(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Trailer</span>
                  </button>

                  <a
                    href={directYoutubeWatchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-stone-800/90 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-stone-700"
                  >
                    <span>Watch in 4K on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- FILM DOSSIER & METRICS --- */}
        <div className="p-6 bg-stone-900/60 border-t border-stone-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Poster + Rating & Box Office */}
            <div className="flex md:flex-col gap-4">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                referrerPolicy="no-referrer"
                className="w-24 sm:w-32 md:w-full h-auto rounded-lg shadow-md border border-stone-700 object-cover"
              />

              <div className="space-y-2 flex-1">
                {/* Rating Badge */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-800/80 border border-stone-700 text-xs">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white text-sm">{movie.rating}</span>
                    <span className="text-stone-400 text-[10px]"> / 10 TMDB Rating</span>
                  </div>
                </div>

                {/* Box Office */}
                {movie.boxOffice && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-800/80 border border-stone-700 text-xs">
                    <DollarSign className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-300">{movie.boxOffice}</span>
                      <div className="text-stone-400 text-[10px]">Worldwide Gross</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle & Right: Overview, Cast, Awards */}
            <div className="md:col-span-2 space-y-4">
              {/* Genres Pills */}
              <div className="flex flex-wrap gap-1.5">
                {movie.genres.map((g, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-semibold rounded-md bg-stone-800 text-amber-300/90 border border-stone-700"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">Synopsis</h4>
                <p className="text-sm text-stone-200 leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              {/* Lead Cast */}
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">Starring Cast</h4>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700 text-xs text-stone-200"
                    >
                      <User className="w-3 h-3 text-stone-400" />
                      <span>{actor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Honors & Awards */}
              {movie.awards && movie.awards.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Honors & Accolades</span>
                  </h4>
                  <div className="space-y-1">
                    {movie.awards.map((award, i) => (
                      <div key={i} className="text-xs text-amber-200/90 flex items-start gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Source Citation */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span>Verified Source: <strong className="text-stone-300">{movie.source.sourceName}</strong></span>
                <a
                  href={movie.source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
                >
                  <span>Archive Record</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
