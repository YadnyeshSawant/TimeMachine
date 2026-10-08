import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  ArrowRight, 
  Wifi, 
  Smartphone, 
  HardDrive, 
  Music, 
  Cpu, 
  TrendingUp, 
  Sparkles,
  RefreshCw,
  Globe
} from 'lucide-react';
import { api } from '../services/api';

interface ThenVsNowModalProps {
  initialYear1?: number;
  initialYear2?: number;
}

const comparisonClientCache = new Map<string, any>();

export const ThenVsNowModal: React.FC<ThenVsNowModalProps> = ({
  initialYear1 = 1995,
  initialYear2 = 2026
}) => {
  const [year1, setYear1] = useState(initialYear1);
  const [year2, setYear2] = useState(initialYear2);
  const cacheKey = `${year1}-${year2}`;
  const [comparisonData, setComparisonData] = useState<any>(() => comparisonClientCache.get(cacheKey) || null);
  const [loading, setLoading] = useState(!comparisonClientCache.has(cacheKey));

  const fetchComparison = async (y1: number, y2: number) => {
    const key = `${y1}-${y2}`;
    if (comparisonClientCache.has(key)) {
      setComparisonData(comparisonClientCache.get(key));
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await api.compareYears(y1, y2);
      comparisonClientCache.set(key, data);
      setComparisonData(data);
    } catch (e) {
      console.warn('Comparison fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison(year1, year2);
  }, [year1, year2]);

  const yearsOptions = [];
  for (let y = 1990; y <= 2026; y++) {
    yearsOptions.push(y);
  }

  const getMetricIcon = (category: string) => {
    if (category.toLowerCase().includes('internet') || category.toLowerCase().includes('web')) return <Wifi className="w-5 h-5 text-[#5A5A40]" />;
    if (category.toLowerCase().includes('mobile') || category.toLowerCase().includes('phone')) return <Smartphone className="w-5 h-5 text-[#C05A3E]" />;
    if (category.toLowerCase().includes('storage') || category.toLowerCase().includes('device')) return <HardDrive className="w-5 h-5 text-[#5A5A40]" />;
    if (category.toLowerCase().includes('music')) return <Music className="w-5 h-5 text-[#C05A3E]" />;
    if (category.toLowerCase().includes('economy')) return <TrendingUp className="w-5 h-5 text-[#5A5A40]" />;
    return <Cpu className="w-5 h-5 text-[#5A5A40]" />;
  };

  return (
    <div id="then-vs-now-view" className="w-full max-w-5xl mx-auto py-6 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] text-[#5A5A40] text-xs font-bold uppercase tracking-wider">
          <GitCompare className="w-3.5 h-3.5 text-[#C05A3E]" />
          <span>Epochal Comparator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2C26] tracking-tight">
          Then vs. Now: The Great Leap
        </h1>
        <p className="text-[#636158] text-sm sm:text-base max-w-2xl mx-auto">
          Compare technology standards, daily lifestyle metrics, communications, and economic output across any two moments in modern history.
        </p>
      </div>

      {/* Dual Year Selectors */}
      <div className="bg-white border border-[#E5E3D8] p-6 rounded-[32px] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 max-w-2xl mx-auto">
        
        {/* Year 1 */}
        <div className="w-full text-center sm:text-left">
          <label className="block text-xs font-sans text-[#8C8A7D] uppercase tracking-wider mb-2 font-bold">Historical Baseline</label>
          <select
            id="comparator-year1-select"
            value={year1}
            onChange={(e) => setYear1(parseInt(e.target.value, 10))}
            className="w-full bg-[#F5F2EA] border border-[#E5E3D8] text-[#C05A3E] font-sans font-bold text-lg px-4 py-3 rounded-full focus:outline-none focus:border-[#5A5A40]"
          >
            {yearsOptions.map((y) => (
              <option key={y} value={y}>
                {y} {y === 1991 ? '• Reforms' : y === 1995 ? '• Win95' : y === 2007 ? '• iPhone' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* VS Divider */}
        <div className="shrink-0 w-12 h-12 rounded-full bg-[#F5F2EA] border border-[#E5E3D8] flex items-center justify-center font-bold text-xs text-[#5A5A40] shadow-xs">
          VS
        </div>

        {/* Year 2 */}
        <div className="w-full text-center sm:text-right">
          <label className="block text-xs font-sans text-[#8C8A7D] uppercase tracking-wider mb-2 font-bold">Comparison Epoch</label>
          <select
            id="comparator-year2-select"
            value={year2}
            onChange={(e) => setYear2(parseInt(e.target.value, 10))}
            className="w-full bg-[#F5F2EA] border border-[#E5E3D8] text-[#5A5A40] font-sans font-bold text-lg px-4 py-3 rounded-full focus:outline-none focus:border-[#5A5A40]"
          >
            {yearsOptions.map((y) => (
              <option key={y} value={y}>
                {y} {y === 2026 ? '• Present' : ''}
              </option>
            ))}
          </select>
        </div>

      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#636158] space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#5A5A40]" />
          <p className="text-sm">Calculating temporal shifts and historical metrics...</p>
        </div>
      ) : comparisonData ? (
        <div className="space-y-6">
          
          {/* AI Historical Analysis Card */}
          {comparisonData.aiInsights && (
            <div className="bg-white border border-[#E5E3D8] rounded-[32px] p-6 sm:p-8 relative overflow-hidden shadow-xs">
              <div className="flex items-center gap-2 text-xs font-sans text-[#C05A3E] uppercase tracking-wider font-bold mb-3">
                <Sparkles className="w-4 h-4" />
                <span>AI Comparative Synthesis</span>
              </div>
              <p className="text-sm sm:text-base text-[#2C2C26] leading-relaxed mb-4">
                {comparisonData.aiInsights.narrative}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5E3D8]">
                <div className="p-4 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
                  <div className="text-[11px] font-bold text-[#C05A3E] mb-1">Single Biggest Shift</div>
                  <div className="text-xs text-[#2C2C26]">{comparisonData.aiInsights.biggestShift}</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
                  <div className="text-[11px] font-bold text-[#5A5A40] mb-1">Technological Leap</div>
                  <div className="text-xs text-[#2C2C26]">{comparisonData.aiInsights.technologicalLeap}</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
                  <div className="text-[11px] font-bold text-[#5A5A40] mb-1">Cultural Contrast</div>
                  <div className="text-xs text-[#2C2C26]">{comparisonData.aiInsights.culturalContrast}</div>
                </div>
              </div>
            </div>
          )}

          {/* Metric Comparison Matrix */}
          <div className="grid grid-cols-1 gap-4">
            {comparisonData.year1?.metrics?.map((metric: any, idx: number) => (
              <div 
                key={idx} 
                className="bg-white border border-[#E5E3D8] rounded-[28px] p-6 hover:border-[#5A5A40] transition-all shadow-xs"
              >
                <div className="flex items-center gap-2 mb-4">
                  {getMetricIcon(metric.category)}
                  <h3 className="text-base font-serif font-bold text-[#2C2C26]">{metric.category}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  
                  {/* Left: Year 1 */}
                  <div className="p-5 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-bold text-[#C05A3E]">{year1}</span>
                      <span className="text-[10px] text-[#8C8A7D] font-bold">THEN</span>
                    </div>
                    <div className="text-sm font-bold text-[#2C2C26] mb-1">{metric.pastValue}</div>
                    <div className="text-xs text-[#636158]">{metric.pastDescription}</div>
                  </div>

                  {/* Right: Year 2 */}
                  <div className="p-5 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-bold text-[#5A5A40]">{year2}</span>
                      <span className="text-[10px] text-[#8C8A7D] font-bold">NOW / TARGET</span>
                    </div>
                    <div className="text-sm font-bold text-[#2C2C26] mb-1">{metric.currentValue}</div>
                    <div className="text-xs text-[#636158]">{metric.currentDescription}</div>
                  </div>

                </div>

                {/* Bottom Ratio Highlight */}
                {metric.metricComparison && (
                  <div className="mt-4 pt-3.5 border-t border-[#E5E3D8] flex items-center gap-2 text-xs text-[#5A5A40] font-medium">
                    <ArrowRight className="w-3.5 h-3.5 text-[#C05A3E] shrink-0" />
                    <span>{metric.metricComparison}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Core Macro Statistics Comparison */}
          <div className="bg-white border border-[#E5E3D8] rounded-[28px] p-6 shadow-xs">
            <h3 className="text-base font-serif font-bold text-[#2C2C26] mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#5A5A40]" />
              <span>Macro Statistical Contrast</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
                <div className="text-xs text-[#C05A3E] font-sans font-bold mb-2">{year1} Statistics</div>
                <div className="text-xs text-[#2C2C26] space-y-1.5">
                  <div>World Population: <strong className="font-bold">{comparisonData.year1?.statistics?.worldPopulation || 'N/A'}</strong></div>
                  <div>Internet Users: <strong className="font-bold">{comparisonData.year1?.statistics?.globalInternetUsers || 'N/A'}</strong></div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F2EA] border border-[#E5E3D8]">
                <div className="text-xs text-[#5A5A40] font-sans font-bold mb-2">{year2} Statistics</div>
                <div className="text-xs text-[#2C2C26] space-y-1.5">
                  <div>World Population: <strong className="font-bold">{comparisonData.year2?.statistics?.worldPopulation || 'N/A'}</strong></div>
                  <div>Internet Users: <strong className="font-bold">{comparisonData.year2?.statistics?.globalInternetUsers || 'N/A'}</strong></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
};
