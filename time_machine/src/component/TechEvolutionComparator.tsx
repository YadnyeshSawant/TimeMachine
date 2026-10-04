import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Smartphone, 
  Camera, 
  Zap, 
  BatteryCharging, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Disc,
  Layers,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { 
  getInterpolatedTechSpec, 
  YEARLY_TECH_SPECS, 
  TechSpecData 
} from '../data/historicalEconomicsAndTech';

interface TechEvolutionComparatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialYear: number;
}

export const TechEvolutionComparator: React.FC<TechEvolutionComparatorProps> = ({
  isOpen,
  onClose,
  initialYear
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear || 1995);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CORE' | 'INTERNET' | 'MOBILE' | 'MEDIA'>('ALL');

  if (!isOpen) return null;

  const currentYear = 2026;
  const pastSpec: TechSpecData = getInterpolatedTechSpec(selectedYear);
  const nowSpec: TechSpecData = YEARLY_TECH_SPECS[2026];

  // Multiplier metrics
  const ramMultiplier = Math.round(nowSpec.ramBytes / Math.max(1, pastSpec.ramBytes));
  const speedMultiplier = Math.round(nowSpec.speedKbps / Math.max(1, pastSpec.speedKbps));
  const storageCostDrop = (pastSpec.storageCostPerGbUsd / Math.max(0.001, nowSpec.storageCostPerGbUsd)).toFixed(0);

  const specRows = [
    {
      category: 'CORE',
      title: 'Typical RAM Memory',
      icon: Cpu,
      past: pastSpec.typicalRam,
      now: nowSpec.typicalRam,
      delta: `${ramMultiplier.toLocaleString()}x Capacity Increase`,
      description: `From basic megabytes in ${selectedYear} to unified high-speed AI memory in 2026.`
    },
    {
      category: 'CORE',
      title: 'Storage Cost per 1 GB',
      icon: HardDrive,
      past: `$${pastSpec.storageCostPerGbUsd.toFixed(2)} / GB (~₹${pastSpec.storageCostPerGbInr})`,
      now: `$${nowSpec.storageCostPerGbUsd.toFixed(3)} / GB (~₹${nowSpec.storageCostPerGbInr})`,
      delta: `${parseInt(storageCostDrop).toLocaleString()}x Cheaper per GB`,
      description: `Massive democratization from magnetic spinning platters to 14.5 GB/s PCIe Gen 5 NVMe SSDs.`
    },
    {
      category: 'CORE',
      title: 'Storage Media & Capacity',
      icon: Layers,
      past: pastSpec.storageMedia,
      now: nowSpec.storageMedia,
      delta: 'Thousands of times larger density',
      description: 'Physical floppy disks & small hard drives evolved into multi-terabyte solid state modules.'
    },
    {
      category: 'INTERNET',
      title: 'Internet Download Speed',
      icon: Wifi,
      past: pastSpec.internetSpeed,
      now: nowSpec.internetSpeed,
      delta: `${speedMultiplier.toLocaleString()}x Speed Jump`,
      description: `Wired copper dial-up with telephone line buzz vs multi-gigabit Wi-Fi 7 & mmWave 5G-Advanced.`
    },
    {
      category: 'INTERNET',
      title: 'Network Latency (Ping)',
      icon: Clock,
      past: pastSpec.internetLatency,
      now: nowSpec.internetLatency,
      delta: '99% Latency Reduction',
      description: 'Real-time holographic & interactive zero-lag cloud computing enabled by sub-3ms routing.'
    },
    {
      category: 'INTERNET',
      title: 'Time to Download 20GB 4K Movie',
      icon: Zap,
      past: pastSpec.downloadTime20GB,
      now: nowSpec.downloadTime20GB,
      delta: 'Instantaneous stream vs days of downloading',
      description: 'What took weeks over dial-up now transfers in a single breath.'
    },
    {
      category: 'MOBILE',
      title: 'Mobile Screen & Display Tech',
      icon: Smartphone,
      past: `${pastSpec.mobileDisplay} (${pastSpec.mobileResolution})`,
      now: `${nowSpec.mobileDisplay} (${nowSpec.mobileResolution})`,
      delta: '100x Pixel Density & Foldable Forms',
      description: 'From 1-line green segment LCDs to 3,500-nit LTPO Micro-OLED 144Hz folding screens.'
    },
    {
      category: 'MOBILE',
      title: 'Camera & Imaging Sensor',
      icon: Camera,
      past: pastSpec.cameraSensor,
      now: nowSpec.cameraSensor,
      delta: `${Math.round(nowSpec.cameraMegapixels / Math.max(0.1, pastSpec.cameraMegapixels))}x Resolution + Neural ISP`,
      description: 'From 35mm film / grainy 0.3MP VGA to 200MP 1-inch sensor stacks with real-time neural HDR.'
    },
    {
      category: 'CORE',
      title: 'CPU Transistors & Lithography',
      icon: Cpu,
      past: `${pastSpec.cpuTransistors} (${pastSpec.cpuProcessNode})`,
      now: `${nowSpec.cpuTransistors} (${nowSpec.cpuProcessNode})`,
      delta: 'Sub-2nm Gate-All-Around Breakthrough',
      description: 'Moore\'s Law pushing hundreds of billions of transistors with dedicated NPU neural engines.'
    },
    {
      category: 'MOBILE',
      title: 'Battery & Fast Charging',
      icon: BatteryCharging,
      past: pastSpec.batteryTech,
      now: nowSpec.batteryTech,
      delta: '10x Energy Density & 14-min HyperCharge',
      description: 'Heavy Ni-Cad / NiMH brick packs replaced by Silicon-Carbon anodes and 120W rapid charging.'
    },
    {
      category: 'MEDIA',
      title: 'Music & Audio Experience',
      icon: Disc,
      past: pastSpec.musicMediaFormat,
      now: nowSpec.musicMediaFormat,
      delta: 'Infinite Lossless Catalog & Spatial Audio',
      description: 'From magnetic tape cassettes to 100M+ Dolby Atmos tracks streamed dynamically.'
    }
  ];

  const filteredRows = selectedCategory === 'ALL' 
    ? specRows 
    : specRows.filter(r => r.category === selectedCategory);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF8F2] border border-[#E5E3D8] rounded-[32px] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#E5E3D8] bg-[#F5F2EA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-[#2C2C26]">
                  Tech Spec Evolution Comparator
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C05A3E] text-white">
                  Hardware & Network Evolution
                </span>
              </div>
              <p className="text-xs text-[#8C8A7D]">
                Direct side-by-side benchmark comparing consumer computing in {selectedYear} vs 2026.
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

        {/* Modal Controls & Slider */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-thin">
          
          {/* Year Scrubber Dial Bar */}
          <div className="bg-white border border-[#E5E3D8] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2C2C26] uppercase tracking-wider">
                  Compare Year:
                </span>
                <span className="text-base font-serif font-bold text-[#5A5A40] px-2.5 py-0.5 rounded-lg bg-[#F5F2EA]">
                  {selectedYear}
                </span>
                <span className="text-xs text-[#8C8A7D]">vs</span>
                <span className="text-base font-serif font-bold text-[#C05A3E] px-2.5 py-0.5 rounded-lg bg-[#C05A3E]/10">
                  2026 (Today)
                </span>
              </div>

              {/* Quick Jump Years */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024].map(yr => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
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

            {/* Slider Input */}
            <div className="pt-2">
              <input
                type="range"
                min="1990"
                max="2025"
                step="1"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#E5E3D8] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#8C8A7D] mt-1">
                <span>1990 (Dial-up & Floppy)</span>
                <span>2000 (Y2K & Broadband)</span>
                <span>2010 (Smartphones)</span>
                <span>2020 (5G & Cloud)</span>
                <span>2026 (AI Neural)</span>
              </div>
            </div>
          </div>

          {/* 3 Core Highlight Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#FAF8F2] border border-[#E5E3D8] p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8C8A7D] uppercase mb-1">
                <Cpu className="w-4 h-4 text-[#5A5A40]" />
                <span>RAM Expansion</span>
              </div>
              <div className="text-2xl font-serif font-extrabold text-[#2C2C26]">
                {ramMultiplier.toLocaleString()}x
              </div>
              <div className="text-[11px] text-[#636158] mt-0.5">
                {pastSpec.typicalRam} → {nowSpec.typicalRam}
              </div>
            </div>

            <div className="bg-[#FAF8F2] border border-[#E5E3D8] p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8C8A7D] uppercase mb-1">
                <Wifi className="w-4 h-4 text-[#C05A3E]" />
                <span>Download Speed</span>
              </div>
              <div className="text-2xl font-serif font-extrabold text-[#2C2C26]">
                {speedMultiplier.toLocaleString()}x
              </div>
              <div className="text-[11px] text-[#636158] mt-0.5">
                {pastSpec.internetSpeed} → {nowSpec.internetSpeed}
              </div>
            </div>

            <div className="bg-[#FAF8F2] border border-[#E5E3D8] p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8C8A7D] uppercase mb-1">
                <HardDrive className="w-4 h-4 text-amber-600" />
                <span>Storage Affordability</span>
              </div>
              <div className="text-2xl font-serif font-extrabold text-[#2C2C26]">
                {parseInt(storageCostDrop).toLocaleString()}x
              </div>
              <div className="text-[11px] text-[#636158] mt-0.5">
                ${pastSpec.storageCostPerGbUsd.toFixed(2)}/GB → $0.005/GB
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Dimensions' },
              { id: 'CORE', label: 'Computing & Memory' },
              { id: 'INTERNET', label: 'Internet & Speeds' },
              { id: 'MOBILE', label: 'Mobile & Displays' },
              { id: 'MEDIA', label: 'Audio & Media' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'bg-white border border-[#E5E3D8] text-[#636158] hover:text-[#2C2C26]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Side-by-Side Specs Matrix Table / Cards */}
          <div className="space-y-3">
            {filteredRows.map((row, idx) => {
              const RowIcon = row.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-[#E5E3D8] rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E3D8] pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#F5F2EA] text-[#5A5A40] flex items-center justify-center shrink-0">
                        <RowIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-[#2C2C26]">{row.title}</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 text-[11px] font-bold border border-amber-500/20">
                      {row.delta}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Past Value */}
                    <div className="bg-[#FAF8F2] p-3 rounded-xl border border-[#E5E3D8]">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#8C8A7D] uppercase mb-1">
                        <span>Status in {selectedYear}</span>
                        <span className="font-mono">{selectedYear} Standard</span>
                      </div>
                      <div className="font-serif font-bold text-sm text-[#2C2C26]">
                        {row.past}
                      </div>
                    </div>

                    {/* Today Value */}
                    <div className="bg-[#F5F2EA] p-3 rounded-xl border border-[#C05A3E]/20">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#C05A3E] uppercase mb-1">
                        <span>Today in 2026</span>
                        <span className="font-mono">Current Frontier</span>
                      </div>
                      <div className="font-serif font-bold text-sm text-[#C05A3E]">
                        {row.now}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#636158] leading-relaxed pt-1">
                    {row.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
