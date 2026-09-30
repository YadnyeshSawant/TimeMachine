import React from 'react';
import { Film, Star, ExternalLink, Award, User, Calendar, Play } from 'lucide-react';
import { MovieRecord } from '../types';

interface MovieCardProps {
  movie: MovieRecord;
  onOpenSource?: (url: string) => void;
  onWatchTrailer?: (movie: MovieRecord) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onOpenSource, onWatchTrailer }) => {
  return (
    <div 
      id={`movie-card-${movie.id}`}
      className="group bg-white border border-[#E5E3D8] hover:border-[#C05A3E] rounded-[28px] overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col justify-between"
    >
      {/* Poster Image */}
      <div className="relative h-56 w-full overflow-hidden bg-[#F5F2EA] group">
        <img 
          src={movie.posterUrl} 
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />

        {/* Hover Trailer Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
          <button
            onClick={() => onWatchTrailer?.(movie)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C05A3E] hover:bg-[#a3472e] text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Watch Trailer</span>
          </button>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E5E3D8] text-[#2C2C26] text-xs font-bold font-sans shadow-xs">
          <Star className="w-3.5 h-3.5 fill-[#C05A3E] text-[#C05A3E]" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>

        {/* Country Badge */}
        <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#5A5A40] border border-[#E5E3D8] uppercase tracking-wider">
          {movie.originCountry}
        </div>

        {/* Box Office / Year Tag at Bottom of Poster */}
        {movie.boxOffice && (
          <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] text-white font-sans font-semibold drop-shadow-sm pointer-events-none">
            <span className="text-[#FDFCF8] font-bold">{movie.boxOffice}</span>
            <span className="text-[#F5F2EA]">{movie.year}</span>
          </div>
        )}
      </div>

      {/* Movie Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-lg font-serif font-bold text-[#2C2C26] group-hover:text-[#C05A3E] transition-colors leading-snug mb-1">
            {movie.title}
          </h3>

          {/* Director & Cast */}
          <div className="flex items-center gap-1.5 text-xs text-[#8C8A7D] mb-3">
            <User className="w-3.5 h-3.5 text-[#8C8A7D] shrink-0" />
            <span className="truncate">Dir: <strong className="text-[#636158] font-semibold">{movie.director}</strong></span>
          </div>

          {/* Genres Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {movie.genres.map((g) => (
              <span key={g} className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#F5F2EA] text-[#636158] border border-[#E5E3D8]">
                {g}
              </span>
            ))}
          </div>

          {/* Overview */}
          <p className="text-xs text-[#636158] leading-relaxed line-clamp-3 mb-4">
            {movie.overview}
          </p>

          {/* Awards or Accolades */}
          {movie.awards && movie.awards.length > 0 && (
            <div className="flex items-center gap-2 text-[11px] text-[#5A5A40] bg-[#F5F2EA] px-3 py-2 rounded-2xl border border-[#E5E3D8] mb-3">
              <Award className="w-3.5 h-3.5 text-[#C05A3E] shrink-0" />
              <span className="truncate font-medium">{movie.awards[0]}</span>
            </div>
          )}
        </div>

        {/* Source link & Trailer CTA */}
        <div className="pt-3.5 border-t border-[#E5E3D8] flex items-center justify-between text-[11px] text-[#8C8A7D]">
          <button
            onClick={() => onWatchTrailer?.(movie)}
            className="flex items-center gap-1 text-[#C05A3E] hover:text-[#a3472e] font-semibold transition-colors cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Trailer & Specs</span>
          </button>
          
          <a
            href={movie.source.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#8C8A7D] hover:text-[#2C2C26] transition-colors"
          >
            <span>TMDB Record</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
