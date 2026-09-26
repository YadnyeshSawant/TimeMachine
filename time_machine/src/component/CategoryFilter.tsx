import React from 'react';
import { 
  Globe, 
  Flag, 
  Film, 
  Music, 
  Cpu, 
  Atom, 
  Trophy, 
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { EventCategory } from '../types';

interface CategoryFilterProps {
  activeCategory: EventCategory;
  onSelectCategory: (category: EventCategory) => void;
  counts: Record<string, number>;
}

interface CategoryConfig {
  id: EventCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const CATEGORIES: CategoryConfig[] = [
  { id: 'ALL', label: 'All Categories', icon: LayoutGrid, accentColor: 'text-amber-400' },
  { id: 'WORLD_EVENTS', label: 'World Events', icon: Globe, accentColor: 'text-blue-400' },
  { id: 'INDIA_EVENTS', label: 'India Milestones', icon: Flag, accentColor: 'text-orange-400' },
  { id: 'MOVIES', label: 'Cinema (TMDB)', icon: Film, accentColor: 'text-rose-400' },
  { id: 'MUSIC', label: 'Music & Hits', icon: Music, accentColor: 'text-purple-400' },
  { id: 'TECHNOLOGY', label: 'Technology', icon: Cpu, accentColor: 'text-cyan-400' },
  { id: 'SCIENCE', label: 'Science & Space', icon: Atom, accentColor: 'text-emerald-400' },
  { id: 'SPORTS', label: 'Sports', icon: Trophy, accentColor: 'text-yellow-400' },
  { id: 'CULTURE', label: 'Culture & Trends', icon: Sparkles, accentColor: 'text-pink-400' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  counts
}) => {
  return (
    <div id="category-filter-bar" className="w-full overflow-x-auto py-2 scrollbar-thin">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const count = counts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              id={`filter-cat-${cat.id.toLowerCase()}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-[#5A5A40] border-[#5A5A40] text-white shadow-xs'
                  : 'bg-white border-[#E5E3D8] text-[#636158] hover:text-[#2C2C26] hover:bg-[#F5F2EA]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#8C8A7D]'}`} />
              <span>{cat.label}</span>
              {count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/25 text-white' : 'bg-[#F5F2EA] text-[#8C8A7D]'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
