import React from 'react';
import { Cpu, ExternalLink, Zap, Building2, Calendar } from 'lucide-react';
import { TechnologyMilestone } from '../types';

interface TechnologyCardProps {
  technology: TechnologyMilestone;
}

export const TechnologyCard: React.FC<TechnologyCardProps> = ({ technology }) => {
  return (
    <div 
      id={`tech-card-${technology.id}`}
      className="group bg-white border border-[#E5E3D8] hover:border-[#5A5A40] rounded-[28px] overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col justify-between"
    >
      {/* Header Banner / Tech Illustration */}
      <div className="relative h-44 w-full overflow-hidden bg-[#F5F2EA]">
        <img 
          src={technology.imageUrl} 
          alt={technology.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Company Badge */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E5E3D8] text-[#5A5A40] text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5 text-[#5A5A40]" />
          <span>{technology.company}</span>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full bg-white/90 text-[#636158] text-[10px] font-bold border border-[#E5E3D8] uppercase">
          {technology.category.replace('_', ' ')}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-lg font-serif font-bold text-[#2C2C26] group-hover:text-[#5A5A40] transition-colors leading-snug mb-2">
            {technology.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#636158] leading-relaxed mb-3.5">
            {technology.description}
          </p>

          {/* Impact Callout */}
          <div className="bg-[#F5F2EA] border border-[#E5E3D8] rounded-2xl p-3.5 mb-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A5A40] mb-1">
              <Zap className="w-3.5 h-3.5 text-[#C05A3E]" />
              <span>World Impact</span>
            </div>
            <p className="text-xs text-[#2C2C26]">
              {technology.impact}
            </p>
          </div>

          {/* Spec highlight */}
          {technology.specHighlight && (
            <div className="text-[11px] font-mono text-[#636158] bg-[#F5F2EA] px-3 py-1.5 rounded-xl border border-[#E5E3D8] mb-3 truncate">
              {technology.specHighlight}
            </div>
          )}
        </div>

        {/* Source link */}
        <div className="pt-3.5 border-t border-[#E5E3D8] flex items-center justify-between text-[11px] text-[#8C8A7D]">
          <span className="font-sans">Curated History</span>
          <a
            href={technology.source.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#5A5A40] hover:text-[#2C2C26] transition-colors font-semibold"
          >
            <span>Technical Spec</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
