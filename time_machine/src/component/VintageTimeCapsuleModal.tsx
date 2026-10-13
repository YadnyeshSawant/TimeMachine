import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Sparkles, 
  Film, 
  Music, 
  Cpu, 
  Globe, 
  Calendar, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Layers, 
  RefreshCw,
  Award,
  Stamp,
  Heart,
  Palette,
  Eye
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { YearData, MovieRecord, MusicRecord, TechnologyMilestone, HistoricalEvent } from '../types';
import { api } from '../services/api';

interface VintageTimeCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  initialYearData?: YearData | null;
}

type CardFormat = 'POSTCARD' | 'STORY' | 'SQUARE';
type CardTheme = 'PARCHMENT' | 'MIDNIGHT' | 'KODACHROME' | 'NEWSPAPER';

export const VintageTimeCapsuleModal: React.FC<VintageTimeCapsuleModalProps> = ({
  isOpen,
  onClose,
  year: initialYear,
  initialYearData
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear || 1995);
  const [yearData, setYearData] = useState<YearData | null>(initialYearData || null);
  const [loading, setLoading] = useState<boolean>(!initialYearData || initialYearData.year !== initialYear);
  const [format, setFormat] = useState<CardFormat>('POSTCARD');
  const [theme, setTheme] = useState<CardTheme>('PARCHMENT');
  const [recipientName, setRecipientName] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // Fetch year data if year changes or if missing
  React.useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);

    api.getYearData(selectedYear)
      .then(data => {
        if (isMounted) {
          setYearData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedYear, isOpen]);

  // Sync with prop when opened
  React.useEffect(() => {
    if (isOpen && initialYear) {
      setSelectedYear(initialYear);
    }
  }, [isOpen, initialYear]);

  if (!isOpen) return null;

  const movie: MovieRecord | undefined = yearData?.movies?.[0];
  const music: MusicRecord | undefined = yearData?.music?.[0];
  const tech: TechnologyMilestone | undefined = yearData?.technology?.[0];
  const mainEvent: HistoricalEvent | undefined = yearData?.events?.[0];

  const generateCardPng = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    return await toPng(cardRef.current, {
      quality: 0.95,
      pixelRatio: 2,
      cacheBust: true,
      fontEmbedCSS: '',
      skipAutoScale: true,
    });
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      // Small delay to ensure all assets and layout are stable
      await new Promise(r => setTimeout(r, 120));
      const dataUrl = await generateCardPng();
      if (!dataUrl) return;

      const link = document.createElement('a');
      link.download = `Time-Capsule-${selectedYear}-${format.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export postcard image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareOrCopy = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 120));
      const dataUrl = await generateCardPng();
      if (!dataUrl) return;
      
      // Convert data URL to Blob for Clipboard or Web Share
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `Time-Capsule-${selectedYear}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Time Machine Capsule - Year ${selectedYear}`,
          text: `Here is a vintage time capsule card from ${selectedYear}! (${yearData?.title})`,
          files: [file],
        });
      } else if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new window.ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        // Fallback: download
        const link = document.createElement('a');
        link.download = `Time-Capsule-${selectedYear}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Aesthetic theme classes
  const getThemeStyles = () => {
    switch (theme) {
      case 'MIDNIGHT':
        return {
          wrapper: 'bg-[#1E1E1A] text-[#F5F2EA] border-stone-700 shadow-2xl',
          headerBg: 'bg-[#2A2A24] border-stone-700',
          accent: 'text-amber-400',
          badge: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
          cardInner: 'bg-[#262620] border-stone-700',
          borderDashed: 'border-stone-700',
          stampColor: 'border-amber-400/40 text-amber-300',
          subtext: 'text-stone-400',
        };
      case 'KODACHROME':
        return {
          wrapper: 'bg-[#FFF8F0] text-[#332219] border-[#E8D8C8] shadow-2xl',
          headerBg: 'bg-[#FBECE0] border-[#E8D8C8]',
          accent: 'text-[#C05A3E]',
          badge: 'bg-[#C05A3E]/15 text-[#C05A3E] border-[#C05A3E]/30',
          cardInner: 'bg-white border-[#E8D8C8]',
          borderDashed: 'border-[#E8D8C8]',
          stampColor: 'border-[#C05A3E]/40 text-[#C05A3E]',
          subtext: 'text-[#8A6D5E]',
        };
      case 'NEWSPAPER':
        return {
          wrapper: 'bg-[#FAF8F5] text-[#1A1A1A] border-[#1A1A1A] shadow-2xl',
          headerBg: 'bg-[#ECE8E1] border-[#1A1A1A]',
          accent: 'text-[#1A1A1A]',
          badge: 'bg-black text-white border-black',
          cardInner: 'bg-white border-[#1A1A1A]',
          borderDashed: 'border-[#1A1A1A]',
          stampColor: 'border-[#1A1A1A] text-[#1A1A1A]',
          subtext: 'text-[#555555]',
        };
      case 'PARCHMENT':
      default:
        return {
          wrapper: 'bg-[#FAF6EC] text-[#2C2C26] border-[#E2DCBA] shadow-2xl',
          headerBg: 'bg-[#EFE9D5] border-[#E2DCBA]',
          accent: 'text-[#5A5A40]',
          badge: 'bg-[#5A5A40] text-white border-[#5A5A40]',
          cardInner: 'bg-white/90 border-[#E2DCBA]',
          borderDashed: 'border-[#D5CEAC]',
          stampColor: 'border-[#5A5A40]/40 text-[#5A5A40]',
          subtext: 'text-[#7D7A6C]',
        };
    }
  };

  const themeStyle = getThemeStyles();

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF8F2] border border-[#E5E3D8] rounded-[32px] w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E3D8] bg-[#F5F2EA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center shadow-xs">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-[#2C2C26]">
                  Vintage Time-Capsule Card Generator
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C05A3E] text-white">
                  Export & Share
                </span>
              </div>
              <p className="text-xs text-[#8C8A7D]">
                Generate an aesthetic, downloadable postcard or social story summary of {selectedYear}.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8C8A7D] hover:text-[#2C2C26] rounded-full hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Body: Controls on left, Live Canvas on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Controls Panel (Left 4 cols) */}
          <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-[#E5E3D8] bg-[#FDFCF8] space-y-5 overflow-y-auto scrollbar-thin">
            
            {/* 1. Year Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#2C2C26] uppercase tracking-wider">
                1. Select Year (1990–2026)
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#E5E3D8] text-sm font-bold text-[#2C2C26] focus:outline-none focus:border-[#5A5A40]"
                >
                  {Array.from({ length: 37 }, (_, i) => 1990 + i).map(yr => (
                    <option key={yr} value={yr}>
                      Year {yr} ({yr === 2026 ? 'Present' : 'Historical Era'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Jump Decades */}
              <div className="flex items-center gap-1.5 pt-1">
                {[1990, 1995, 2000, 2007, 2015, 2020, 2026].map(yr => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      selectedYear === yr
                        ? 'bg-[#5A5A40] text-white'
                        : 'bg-[#F5F2EA] text-[#636158] hover:bg-[#E5E3D8]'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Format Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#2C2C26] uppercase tracking-wider">
                2. Card Format & Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'POSTCARD', label: 'Postcard (4:3)', desc: 'Classic Airmail' },
                  { id: 'STORY', label: 'Story (9:16)', desc: 'Insta & Status' },
                  { id: 'SQUARE', label: 'Square (1:1)', desc: 'Feed Post' },
                ].map(fmt => (
                  <button
                    key={fmt.id}
                    onClick={() => setFormat(fmt.id as CardFormat)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      format === fmt.id
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                        : 'bg-[#F5F2EA] text-[#636158] border-[#E5E3D8] hover:border-[#5A5A40]/40'
                    }`}
                  >
                    <span className="block text-xs font-bold">{fmt.label}</span>
                    <span className={`block text-[10px] mt-0.5 ${format === fmt.id ? 'text-stone-200' : 'text-[#8C8A7D]'}`}>
                      {fmt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Aesthetic Color Theme */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#2C2C26] uppercase tracking-wider">
                3. Color Palette & Typography
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'PARCHMENT', name: 'Vintage Parchment', color: 'bg-[#FAF6EC] text-[#5A5A40]' },
                  { id: 'KODACHROME', name: 'Kodachrome 90s', color: 'bg-[#FFF8F0] text-[#C05A3E]' },
                  { id: 'MIDNIGHT', name: 'Midnight Cyber', color: 'bg-[#1E1E1A] text-amber-300' },
                  { id: 'NEWSPAPER', name: 'Classic Newsprint', color: 'bg-[#FAF8F5] text-black' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as CardTheme)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                      theme === t.id
                        ? 'border-[#5A5A40] ring-2 ring-[#5A5A40]/30 shadow-xs'
                        : 'border-[#E5E3D8] hover:border-[#5A5A40]/40'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border border-black/20 ${t.color}`} />
                    <span className="text-xs font-semibold text-[#2C2C26]">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Personal Inscription */}
            <div className="space-y-3 pt-1 border-t border-[#E5E3D8]">
              <label className="block text-xs font-bold text-[#2C2C26] uppercase tracking-wider">
                4. Personal Dedication (Optional)
              </label>

              <div>
                <input
                  type="text"
                  placeholder="Recipient Name (e.g. For Mom, Alex, or My 18th Self)"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  maxLength={40}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F5F2EA] border border-[#E5E3D8] text-xs font-semibold text-[#2C2C26] focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div>
                <textarea
                  placeholder="Add a custom nostalgic memory or greeting..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  rows={2}
                  maxLength={120}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F5F2EA] border border-[#E5E3D8] text-xs text-[#2C2C26] focus:outline-none focus:border-[#5A5A40] resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 space-y-2">
              <button
                onClick={handleDownload}
                disabled={isGenerating || loading}
                className="w-full py-3 px-4 rounded-xl bg-[#5A5A40] hover:bg-[#484832] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rendering PNG...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download High-Res PNG ({format})</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShareOrCopy}
                disabled={isGenerating || loading}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#E5E3D8] hover:bg-[#F5F2EA] text-[#2C2C26] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-[#C05A3E]" />
                    <span>Share or Copy Image</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Live Graphic Preview Canvas (Right 7 cols) */}
          <div className="lg:col-span-7 p-6 bg-[#EBE7DD] flex flex-col items-center justify-center overflow-auto min-h-[480px]">
            
            {loading ? (
              <div className="flex flex-col items-center gap-3 text-[#8C8A7D]">
                <RefreshCw className="w-8 h-8 animate-spin text-[#5A5A40]" />
                <span className="text-xs font-serif italic">Compiling year archives...</span>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center p-2">
                
                {/* --- RENDERABLE POSTCARD CONTAINER (html-to-image target) --- */}
                <div
                  ref={cardRef}
                  id="rendered-time-capsule-card"
                  style={{
                    width: format === 'STORY' ? '360px' : format === 'SQUARE' ? '460px' : '540px',
                    minHeight: format === 'STORY' ? '640px' : format === 'SQUARE' ? '460px' : '380px',
                  }}
                  className={`relative p-6 sm:p-7 rounded-2xl border-4 transition-all overflow-hidden flex flex-col justify-between font-serif ${themeStyle.wrapper}`}
                >
                  {/* Decorative Airmail / Postal Edge Pattern for Postcard */}
                  {format === 'POSTCARD' && (
                    <div className="absolute top-0 left-0 right-0 h-2 bg-repeating-linear-gradient(45deg,#C05A3E,#C05A3E_10px,#FAF6EC_10px,#FAF6EC_20px,#5A5A40_20px,#5A5A40_30px,#FAF6EC_30px,#FAF6EC_40px)" />
                  )}

                  {/* Top Bar: Year Header & Postmark Stamp */}
                  <div className="flex items-start justify-between gap-4 border-b pb-3 mb-3 border-current/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded ${themeStyle.badge}`}>
                          TIME CAPSULE ARCHIVE
                        </span>
                        <span className="text-[11px] italic opacity-80">
                          {yearData?.decade}s Era
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mt-1">
                        YEAR {selectedYear}
                      </h2>
                      <p className={`text-xs italic ${themeStyle.subtext}`}>
                        "{yearData?.tagline || yearData?.title}"
                      </p>
                    </div>

                    {/* Vintage Postmark Stamp Badge */}
                    <div className={`shrink-0 border-2 rounded-xl p-2 text-center rotate-3 border-dashed ${themeStyle.stampColor}`}>
                      <div className="text-[8px] font-mono uppercase tracking-widest">OFFICIAL SEAL</div>
                      <div className="text-base font-bold font-mono">{selectedYear}</div>
                      <div className="text-[7px] font-mono tracking-tight">TIME MACHINE</div>
                    </div>
                  </div>

                  {/* Recipient Ribbon if set */}
                  {recipientName && (
                    <div className="mb-3 py-1 px-2.5 rounded bg-black/5 border border-current/10 text-xs flex items-center justify-between">
                      <span className="font-sans font-bold text-[11px] opacity-80">DEDICATED TO:</span>
                      <span className="font-serif italic font-bold">{recipientName}</span>
                    </div>
                  )}

                  {/* Core 4 Milestones Matrix */}
                  <div className={`grid gap-2.5 my-auto ${
                    format === 'STORY' ? 'grid-cols-1' : 'grid-cols-2'
                  }`}>
                    
                    {/* 1. Cinema / Film */}
                    {movie && (
                      <div className={`p-2.5 rounded-xl border ${themeStyle.cardInner}`}>
                        <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase opacity-75 mb-0.5">
                          <Film className="w-3 h-3 text-[#C05A3E]" />
                          <span>#1 Movie in Cinemas</span>
                        </div>
                        <div className="text-xs font-bold leading-snug line-clamp-1">
                          {movie.title}
                        </div>
                        <div className="text-[10px] font-sans opacity-70 line-clamp-1">
                          Dir. {movie.director} • ★ {movie.rating}
                        </div>
                      </div>
                    )}

                    {/* 2. Top Anthem / Music */}
                    {music && (
                      <div className={`p-2.5 rounded-xl border ${themeStyle.cardInner}`}>
                        <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase opacity-75 mb-0.5">
                          <Music className="w-3 h-3 text-[#5A5A40]" />
                          <span>Chart Anthem</span>
                        </div>
                        <div className="text-xs font-bold leading-snug line-clamp-1">
                          {music.title}
                        </div>
                        <div className="text-[10px] font-sans opacity-70 line-clamp-1">
                          {music.artist}
                        </div>
                      </div>
                    )}

                    {/* 3. Tech Breakthrough */}
                    {tech && (
                      <div className={`p-2.5 rounded-xl border ${themeStyle.cardInner}`}>
                        <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase opacity-75 mb-0.5">
                          <Cpu className="w-3 h-3 text-amber-600" />
                          <span>Tech Milestone</span>
                        </div>
                        <div className="text-xs font-bold leading-snug line-clamp-1">
                          {tech.title}
                        </div>
                        <div className="text-[10px] font-sans opacity-70 line-clamp-1">
                          {tech.company}
                        </div>
                      </div>
                    )}

                    {/* 4. Global Headline Event */}
                    {mainEvent && (
                      <div className={`p-2.5 rounded-xl border ${themeStyle.cardInner}`}>
                        <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase opacity-75 mb-0.5">
                          <Globe className="w-3 h-3 text-emerald-700" />
                          <span>Global Headline</span>
                        </div>
                        <div className="text-xs font-bold leading-snug line-clamp-1">
                          {mainEvent.title}
                        </div>
                        <div className="text-[10px] font-sans opacity-70 line-clamp-1">
                          {mainEvent.displayDate || mainEvent.date}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Custom Personal Note if added */}
                  {customNote && (
                    <div className="mt-3 p-2 rounded-lg bg-black/5 border border-dashed border-current/20 text-[11px] italic font-serif leading-relaxed text-center">
                      "{customNote}"
                    </div>
                  )}

                  {/* Bottom Footer & Stats Ticker */}
                  <div className="mt-3 pt-2.5 border-t border-current/20 flex items-center justify-between text-[9px] font-sans font-medium opacity-80">
                    <div className="flex items-center gap-2">
                      <span>Pop: {yearData?.statistics.worldPopulation}</span>
                      <span>•</span>
                      <span className="truncate max-w-[140px]">{yearData?.statistics.topTechCompany}</span>
                    </div>
                    <div className="font-mono uppercase tracking-widest text-[8px]">
                      timemachine.app
                    </div>
                  </div>

                </div>

              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-[#636158] mt-3">
              <Eye className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Live Graphic Preview • Click 'Download High-Res PNG' to save</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
