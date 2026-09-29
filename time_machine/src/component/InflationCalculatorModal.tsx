import React, { useState, useMemo } from 'react';
import { 
  X, 
  Coins, 
  TrendingUp, 
  Fuel, 
  Award, 
  Film, 
  Utensils, 
  Flame, 
  Coffee, 
  Home, 
  DollarSign, 
  ArrowRightLeft,
  Sparkles,
  Calculator,
  RotateCcw,
  CheckCircle2,
  Info,
  Layers
} from 'lucide-react';
import { YEARLY_ECONOMICS, InflationData } from '../data/historicalEconomicsAndTech';

interface InflationCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseYear: number;
}

export const InflationCalculatorModal: React.FC<InflationCalculatorModalProps> = ({
  isOpen,
  onClose,
  baseYear: initialBaseYear
}) => {
  const [baseYear, setBaseYear] = useState<number>(initialBaseYear || 1995);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [amount, setAmount] = useState<number>(1000);

  const baseYearState = baseYear || 1995;
  const currentYear = 2026;
  const baseEcon = YEARLY_ECONOMICS[baseYearState] || YEARLY_ECONOMICS[1995];
  const nowEcon = YEARLY_ECONOMICS[currentYear];

  // Calculations
  const multiplier = currency === 'INR' ? baseEcon.inrCpiMultiplierTo2026 : baseEcon.usdCpiMultiplierTo2026;
  const equivalentValueToday = Math.round(amount * multiplier);
  const percentageIncrease = Math.round((multiplier - 1) * 100);

  // Basket calculations
  const basketItems = useMemo(() => {
    if (currency === 'INR') {
      const petrolPast = baseEcon.petrolPriceInr;
      const petrolNow = nowEcon.petrolPriceInr;
      const petrolLitersPast = (amount / petrolPast).toFixed(1);
      const petrolLitersNow = (amount / petrolNow).toFixed(1);

      const goldPast = baseEcon.gold10gInr / 10; // per gram
      const goldNow = nowEcon.gold10gInr / 10;
      const goldGramsPast = (amount / goldPast).toFixed(2);
      const goldGramsNow = (amount / goldNow).toFixed(2);

      const moviePast = baseEcon.movieTicketInr;
      const movieNow = nowEcon.movieTicketInr;
      const movieTicketsPast = Math.floor(amount / moviePast);
      const movieTicketsNow = Math.floor(amount / movieNow);

      const mealPast = baseEcon.bigMacInr;
      const mealNow = nowEcon.bigMacInr;
      const mealsPast = Math.floor(amount / mealPast);
      const mealsNow = Math.floor(amount / mealNow);

      const lpgPast = baseEcon.lpgCylinderInr;
      const lpgNow = nowEcon.lpgCylinderInr;
      const lpgCylindersPast = (amount / lpgPast).toFixed(1);
      const lpgCylindersNow = (amount / lpgNow).toFixed(1);

      const chaiPast = baseEcon.coffeeCupInr;
      const chaiNow = nowEcon.coffeeCupInr;
      const chaiCupsPast = Math.floor(amount / chaiPast);
      const chaiCupsNow = Math.floor(amount / chaiNow);

      const rePast = baseEcon.sqFtRealEstateInr;
      const reNow = nowEcon.sqFtRealEstateInr;
      const sqFtPast = (amount / rePast).toFixed(2);
      const sqFtNow = (amount / reNow).toFixed(2);

      return [
        {
          name: "Petrol / Fuel",
          icon: Fuel,
          unit: "Liters",
          pastRate: `₹${petrolPast.toFixed(2)}/L`,
          nowRate: `₹${petrolNow.toFixed(2)}/L`,
          pastQty: `${petrolLitersPast} L`,
          nowQty: `${petrolLitersNow} L`,
          change: `${((petrolNow / petrolPast - 1) * 100).toFixed(0)}% price rise`,
          color: "text-amber-600 bg-amber-50"
        },
        {
          name: "24K Pure Gold",
          icon: Award,
          unit: "Grams",
          pastRate: `₹${Math.round(goldPast)}/g`,
          nowRate: `₹${Math.round(goldNow)}/g`,
          pastQty: `${goldGramsPast} g`,
          nowQty: `${goldGramsNow} g`,
          change: `${((goldNow / goldPast - 1) * 100).toFixed(0)}% appreciation`,
          color: "text-yellow-600 bg-yellow-50"
        },
        {
          name: "Cinema / Movie Tickets",
          icon: Film,
          unit: "Tickets",
          pastRate: `₹${moviePast}`,
          nowRate: `₹${movieNow}`,
          pastQty: `${movieTicketsPast} tickets`,
          nowQty: `${movieTicketsNow} tickets`,
          change: `${((movieNow / moviePast - 1) * 100).toFixed(0)}% rise`,
          color: "text-rose-600 bg-rose-50"
        },
        {
          name: "Wholesome Meals / Dining",
          icon: Utensils,
          unit: "Meals",
          pastRate: `₹${mealPast}`,
          nowRate: `₹${mealNow}`,
          pastQty: `${mealsPast} meals`,
          nowQty: `${mealsNow} meals`,
          change: `${((mealNow / mealPast - 1) * 100).toFixed(0)}% rise`,
          color: "text-orange-600 bg-orange-50"
        },
        {
          name: "Domestic LPG Cylinder",
          icon: Flame,
          unit: "Cylinders",
          pastRate: `₹${lpgPast}`,
          nowRate: `₹${lpgNow}`,
          pastQty: `${lpgCylindersPast} cylinders`,
          nowQty: `${lpgCylindersNow} cylinders`,
          change: `${((lpgNow / lpgPast - 1) * 100).toFixed(0)}% rise`,
          color: "text-blue-600 bg-blue-50"
        },
        {
          name: "Chai / Coffee Cups",
          icon: Coffee,
          unit: "Cups",
          pastRate: `₹${chaiPast}`,
          nowRate: `₹${chaiNow}`,
          pastQty: `${chaiCupsPast} cups`,
          nowQty: `${chaiCupsNow} cups`,
          change: `${((chaiNow / chaiPast - 1) * 100).toFixed(0)}% rise`,
          color: "text-emerald-600 bg-emerald-50"
        },
        {
          name: "Metro Prime Real Estate",
          icon: Home,
          unit: "Sq. Ft.",
          pastRate: `₹${rePast}/sq ft`,
          nowRate: `₹${reNow}/sq ft`,
          pastQty: `${sqFtPast} sq ft`,
          nowQty: `${sqFtNow} sq ft`,
          change: `${((reNow / rePast - 1) * 100).toFixed(0)}% rise`,
          color: "text-purple-600 bg-purple-50"
        }
      ];
    } else {
      // USD Basket
      const petrolPast = baseEcon.petrolPriceUsd;
      const petrolNow = nowEcon.petrolPriceUsd;
      const petrolGalPast = (amount / petrolPast).toFixed(1);
      const petrolGalNow = (amount / petrolNow).toFixed(1);

      const goldPast = baseEcon.goldOzUsd;
      const goldNow = nowEcon.goldOzUsd;
      const goldOzPast = (amount / goldPast).toFixed(3);
      const goldOzNow = (amount / goldNow).toFixed(3);

      const moviePast = baseEcon.movieTicketUsd;
      const movieNow = nowEcon.movieTicketUsd;
      const movieTicketsPast = Math.floor(amount / moviePast);
      const movieTicketsNow = Math.floor(amount / movieNow);

      const mealPast = baseEcon.bigMacUsd;
      const mealNow = nowEcon.bigMacUsd;
      const mealsPast = Math.floor(amount / mealPast);
      const mealsNow = Math.floor(amount / mealNow);

      const coffeePast = baseEcon.coffeeCupUsd;
      const coffeeNow = nowEcon.coffeeCupUsd;
      const coffeeCupsPast = Math.floor(amount / coffeePast);
      const coffeeCupsNow = Math.floor(amount / coffeeNow);

      const rePast = baseEcon.sqFtRealEstateUsd;
      const reNow = nowEcon.sqFtRealEstateUsd;
      const sqFtPast = (amount / rePast).toFixed(2);
      const sqFtNow = (amount / reNow).toFixed(2);

      return [
        {
          name: "Gasoline / Petrol",
          icon: Fuel,
          unit: "Gallons",
          pastRate: `$${petrolPast.toFixed(2)}/gal`,
          nowRate: `$${petrolNow.toFixed(2)}/gal`,
          pastQty: `${petrolGalPast} gal`,
          nowQty: `${petrolGalNow} gal`,
          change: `${((petrolNow / petrolPast - 1) * 100).toFixed(0)}% price rise`,
          color: "text-amber-600 bg-amber-50"
        },
        {
          name: "Gold (Troy Ounce)",
          icon: Award,
          unit: "Troy Ounces",
          pastRate: `$${goldPast}/oz`,
          nowRate: `$${goldNow}/oz`,
          pastQty: `${goldOzPast} oz`,
          nowQty: `${goldOzNow} oz`,
          change: `${((goldNow / goldPast - 1) * 100).toFixed(0)}% appreciation`,
          color: "text-yellow-600 bg-yellow-50"
        },
        {
          name: "Movie Theatre Tickets",
          icon: Film,
          unit: "Tickets",
          pastRate: `$${moviePast.toFixed(2)}`,
          nowRate: `$${movieNow.toFixed(2)}`,
          pastQty: `${movieTicketsPast} tickets`,
          nowQty: `${movieTicketsNow} tickets`,
          change: `${((movieNow / moviePast - 1) * 100).toFixed(0)}% rise`,
          color: "text-rose-600 bg-rose-50"
        },
        {
          name: "Big Mac / Fast Food Meal",
          icon: Utensils,
          unit: "Meals",
          pastRate: `$${mealPast.toFixed(2)}`,
          nowRate: `$${mealNow.toFixed(2)}`,
          pastQty: `${mealsPast} meals`,
          nowQty: `${mealsNow} meals`,
          change: `${((mealNow / mealPast - 1) * 100).toFixed(0)}% rise`,
          color: "text-orange-600 bg-orange-50"
        },
        {
          name: "Espresso / Specialty Coffee",
          icon: Coffee,
          unit: "Cups",
          pastRate: `$${coffeePast.toFixed(2)}`,
          nowRate: `$${coffeeNow.toFixed(2)}`,
          pastQty: `${coffeeCupsPast} cups`,
          nowQty: `${coffeeCupsNow} cups`,
          change: `${((coffeeNow / coffeePast - 1) * 100).toFixed(0)}% rise`,
          color: "text-emerald-600 bg-emerald-50"
        },
        {
          name: "US Real Estate (Sq. Ft)",
          icon: Home,
          unit: "Sq. Ft.",
          pastRate: `$${rePast}/sq ft`,
          nowRate: `$${reNow}/sq ft`,
          pastQty: `${sqFtPast} sq ft`,
          nowQty: `${sqFtNow} sq ft`,
          change: `${((reNow / rePast - 1) * 100).toFixed(0)}% rise`,
          color: "text-purple-600 bg-purple-50"
        }
      ];
    }
  }, [currency, amount, baseEcon, nowEcon]);

  const presets = currency === 'INR' 
    ? [
        { label: "Pocket Money", value: 100 },
        { label: "Casual Outing", value: 500 },
        { label: "Monthly Grocery", value: 2000 },
        { label: "Average Salary", value: 5000 },
        { label: "Gold Token", value: 20000 },
        { label: "Scooter / Bike", value: 45000 },
      ]
    : [
        { label: "Pocket Money", value: 20 },
        { label: "Date Night", value: 100 },
        { label: "Monthly Grocery", value: 350 },
        { label: "Monthly Salary", value: 2500 },
        { label: "Used Car", value: 6000 },
        { label: "Down Payment", value: 25000 },
      ];

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF8F2] border border-[#E5E3D8] rounded-[32px] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-[#E5E3D8] bg-[#F5F2EA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C05A3E] text-white flex items-center justify-center shadow-xs">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-[#2C2C26]">
                  Interactive Price & Inflation Machine
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5A5A40] text-white">
                  1990–2026
                </span>
              </div>
              <p className="text-xs text-[#8C8A7D]">
                Measure real purchasing power and historical commodity baskets across eras.
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

        {/* Modal Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-thin">
          
          {/* Controls: Year Selector, Currency Switcher, Amount Input */}
          <div className="bg-white border border-[#E5E3D8] rounded-2xl p-5 shadow-xs space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* 1. Base Year */}
              <div>
                <label className="block text-xs font-bold text-[#2C2C26] uppercase tracking-wider mb-1.5">
                  Historical Year
                </label>
                <select
                  value={baseYear}
                  onChange={(e) => setBaseYear(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#E5E3D8] text-sm font-bold text-[#2C2C26] focus:outline-none focus:border-[#5A5A40]"
                >
                  {Array.from({ length: 37 }, (_, i) => 1990 + i).map(yr => (
                    <option key={yr} value={yr}>
                      Year {yr} {yr === 2026 ? '(Today)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Currency Selector */}
              <div>
                <label className="block text-xs font-bold text-[#2C2C26] uppercase tracking-wider mb-1.5">
                  Currency
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#F5F2EA] p-1 rounded-xl border border-[#E5E3D8]">
                  <button
                    onClick={() => {
                      setCurrency('INR');
                      if (amount === 100 || amount === 2500) setAmount(1000);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currency === 'INR'
                        ? 'bg-[#5A5A40] text-white shadow-xs'
                        : 'text-[#636158] hover:text-[#2C2C26]'
                    }`}
                  >
                    ₹ INR (India)
                  </button>
                  <button
                    onClick={() => {
                      setCurrency('USD');
                      if (amount === 1000) setAmount(100);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currency === 'USD'
                        ? 'bg-[#5A5A40] text-white shadow-xs'
                        : 'text-[#636158] hover:text-[#2C2C26]'
                    }`}
                  >
                    $ USD (United States)
                  </button>
                </div>
              </div>

              {/* 3. Base Amount */}
              <div>
                <label className="block text-xs font-bold text-[#2C2C26] uppercase tracking-wider mb-1.5">
                  Amount in {baseYear}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8C8A7D]">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value, 10) || 0))}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#E5E3D8] text-sm font-bold text-[#2C2C26] focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
              </div>

            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-[#8C8A7D] mr-1">Presets:</span>
              {presets.map(p => (
                <button
                  key={p.label}
                  onClick={() => setAmount(p.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    amount === p.value
                      ? 'bg-[#C05A3E] text-white'
                      : 'bg-[#F5F2EA] text-[#636158] hover:bg-[#E5E3D8]'
                  }`}
                >
                  {p.label} ({currencySymbol}{p.value.toLocaleString()})
                </button>
              ))}
            </div>

          </div>

          {/* Result Grand Banner */}
          <div className="bg-gradient-to-br from-[#5A5A40] to-[#3E3E2B] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-300 font-medium">
                <span>PURCHASING POWER CONVERSION</span>
                <span className="font-mono bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                  {multiplier.toFixed(2)}x Multiplier
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <span className="text-3xl sm:text-5xl font-serif font-extrabold text-amber-300">
                    {currencySymbol}{amount.toLocaleString()} in {baseYear}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-stone-300 font-serif italic text-sm">
                  <span>has the buying power of</span>
                </div>
              </div>

              <div className="pt-1">
                <div className="text-2xl sm:text-4xl font-serif font-bold text-white">
                  ≈ {currencySymbol}{equivalentValueToday.toLocaleString()} in 2026
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  Cumulative price rise of <strong className="text-amber-300">+{percentageIncrease}%</strong> over {2026 - baseYear} years based on national Consumer Price Index (CPI) benchmarks.
                </p>
              </div>
            </div>
          </div>

          {/* Real Basket of Goods Side-by-Side Comparison */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-serif font-bold text-[#2C2C26]">
                What {currencySymbol}{amount.toLocaleString()} Could Buy in {baseYear} vs Today (2026):
              </h4>
              <span className="text-[11px] text-[#8C8A7D]">
                Real Commodity Pricing Records
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {basketItems.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={idx}
                    className="bg-white border border-[#E5E3D8] rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <h5 className="text-xs font-bold text-[#2C2C26]">{item.name}</h5>
                      </div>
                      <span className="text-[10px] font-mono text-[#8C8A7D]">{item.unit}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-[#F5F2EA]/60 p-2.5 rounded-xl text-center">
                      <div>
                        <span className="block text-[10px] font-bold text-[#8C8A7D] uppercase">
                          In {baseYear}
                        </span>
                        <span className="block text-base font-serif font-bold text-[#2C2C26] mt-0.5">
                          {item.pastQty}
                        </span>
                        <span className="block text-[10px] text-[#8C8A7D]">
                          @{item.pastRate}
                        </span>
                      </div>

                      <div className="border-l border-[#E5E3D8] pl-2">
                        <span className="block text-[10px] font-bold text-[#C05A3E] uppercase">
                          In 2026
                        </span>
                        <span className="block text-base font-serif font-bold text-[#C05A3E] mt-0.5">
                          {item.nowQty}
                        </span>
                        <span className="block text-[10px] text-[#8C8A7D]">
                          @{item.nowRate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#8C8A7D] pt-0.5">
                      <span>Rate shift:</span>
                      <span className="font-semibold text-[#5A5A40]">{item.change}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Average Salary Context */}
          <div className="bg-[#F5F2EA] border border-[#E5E3D8] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white text-[#5A5A40] flex items-center justify-center shrink-0 border border-[#E5E3D8]">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#2C2C26]">Average Monthly Income Benchmark:</span>
                <p className="text-[#636158] mt-0.5">
                  {currency === 'INR' ? (
                    <>In {baseYear}, average monthly white-collar salary was ~<strong>₹{baseEcon.avgMonthlySalaryInr.toLocaleString()}</strong> vs ~<strong>₹{nowEcon.avgMonthlySalaryInr.toLocaleString()}</strong> in 2026.</>
                  ) : (
                    <>In {baseYear}, average US monthly median wage was ~<strong>${baseEcon.avgMonthlySalaryUsd.toLocaleString()}</strong> vs ~<strong>${nowEcon.avgMonthlySalaryUsd.toLocaleString()}</strong> in 2026.</>
                  )}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
