import React, { useState } from 'react';
import {
  Search,
  X,
  MapPin,
  Calendar,
  Clock,
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudDrizzle,
  CloudFog,
  Navigation,
  Compass,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';

export default function Temperature({
  weatherData,
  currentCity,
  onSearch,
  unit = 'C',
  onToggleUnit,
  onGetCurrentLocation,
  loading = false
}) {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const handleClear = () => {
    setSearchInput('');
  };

  const formatTemp = (celsius) => {
    if (celsius === undefined || celsius === null) return '--';
    const temp = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
    return Math.trunc(temp);
  };

  // Render condition icon with tactical neumorphic dial background
  const renderWeatherIcon = (conditionCode, isDay = true) => {
    const code = (conditionCode || '').toLowerCase();
    
    let IconComponent = Sun;
    let iconColor = 'text-amber-400 drop-shadow-[0_0_18px_rgba(251,191,36,0.5)] animate-spin-slow';
    let ringGlow = 'border-amber-500/30';

    if (code.includes('thunder') || code.includes('lightning')) {
      IconComponent = CloudLightning;
      iconColor = 'text-amber-300 drop-shadow-[0_0_18px_rgba(252,211,77,0.6)] animate-pulse';
      ringGlow = 'border-amber-400/40';
    } else if (code.includes('snow') || code.includes('ice') || code.includes('blizzard')) {
      IconComponent = CloudSnow;
      iconColor = 'text-cyan-200 drop-shadow-[0_0_18px_rgba(186,230,253,0.5)] animate-bounce';
      ringGlow = 'border-cyan-400/30';
    } else if (code.includes('heavy rain') || code.includes('torrential') || code.includes('rain')) {
      IconComponent = CloudRain;
      iconColor = 'text-blue-400 drop-shadow-[0_0_18px_rgba(96,165,250,0.5)] animate-pulse';
      ringGlow = 'border-blue-500/30';
    } else if (code.includes('drizzle') || code.includes('shower')) {
      IconComponent = CloudDrizzle;
      iconColor = 'text-sky-300 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]';
      ringGlow = 'border-sky-500/30';
    } else if (code.includes('fog') || code.includes('mist') || code.includes('haze') || code.includes('smoke')) {
      IconComponent = CloudFog;
      iconColor = 'text-slate-300 drop-shadow-[0_0_12px_rgba(148,163,184,0.4)]';
      ringGlow = 'border-slate-500/30';
    } else if (code.includes('partly') || code.includes('scattered') || code.includes('few clouds')) {
      IconComponent = isDay ? CloudSun : CloudMoon;
      iconColor = isDay 
        ? 'text-amber-300 drop-shadow-[0_0_20px_rgba(252,211,77,0.5)] animate-float' 
        : 'text-indigo-300 drop-shadow-[0_0_20px_rgba(165,180,252,0.4)] animate-float';
      ringGlow = isDay ? 'border-amber-400/30' : 'border-indigo-400/30';
    } else if (code.includes('cloud') || code.includes('overcast')) {
      IconComponent = Cloud;
      iconColor = 'text-slate-300 drop-shadow-[0_0_16px_rgba(203,213,225,0.4)] animate-float';
      ringGlow = 'border-slate-500/30';
    } else {
      if (!isDay) {
        IconComponent = Moon;
        iconColor = 'text-indigo-200 drop-shadow-[0_0_20px_rgba(199,210,254,0.5)] animate-float';
        ringGlow = 'border-indigo-500/30';
      }
    }

    return (
      <div className="relative flex items-center justify-center">
        {/* Tactical Dial Well */}
        <div className={`w-40 h-40 md:w-44 md:h-44 rounded-full neu-dial-inset flex items-center justify-center p-4 relative border ${ringGlow}`}>
          {/* Subtle Outer Dial Ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-slate-700/50 pointer-events-none animate-spin-slow"></div>
          <IconComponent className={`w-20 h-20 md:w-24 md:h-24 ${iconColor} relative z-10`} />
        </div>
      </div>
    );
  };

  const isDay = weatherData ? weatherData.isDay : true;
  const conditionText = weatherData?.condition || 'Clear Sky';
  const locationName = weatherData ? `${weatherData.city}, ${weatherData.country}` : currentCity;
  const tempMin = weatherData?.tempMin !== undefined ? formatTemp(weatherData.tempMin) : null;
  const tempMax = weatherData?.tempMax !== undefined ? formatTemp(weatherData.tempMax) : null;

  return (
    <div className="w-full h-full flex flex-col justify-between neu-card rounded-3xl p-6 md:p-8 relative overflow-hidden transition-all duration-300 shadow-2xl">
      
      {/* Top Header & Search Bar */}
      <div className="relative z-10 w-full mb-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-cyan-400">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                Atmosphere
                <span className="text-[10px] px-2 py-0.5 rounded-md neu-inset text-cyan-400 font-mono tracking-widest uppercase">
                  LUX
                </span>
              </h1>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1 mt-0.5">
                <Activity className="w-3 h-3 text-emerald-400" /> Active Telemetry
              </span>
            </div>
          </div>

          {/* Unit Toggle & Geolocation Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onGetCurrentLocation}
              title="Use current GPS location"
              className="p-2.5 rounded-2xl neu-button text-slate-300 hover:text-cyan-400 transition-all active:scale-95 group"
            >
              <Navigation className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300 text-cyan-400" />
            </button>
            <button
              onClick={onToggleUnit}
              title="Toggle Celsius / Fahrenheit"
              className="px-3.5 py-2 rounded-2xl neu-button text-xs font-bold text-cyan-400 transition-all active:scale-95 font-mono"
            >
              °{unit}
            </button>
          </div>
        </div>

        {/* Tactical Inset Search Form */}
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              id="city-search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search station or city..."
              className="w-full pl-11 pr-24 py-3.5 rounded-2xl neu-inset text-slate-100 placeholder-slate-500 text-sm font-medium outline-none focus:ring-1 focus:ring-cyan-500/40 transition-all duration-200"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-16 text-slate-400 hover:text-slate-200 p-1 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="absolute right-2 px-3.5 py-2 rounded-xl neu-button hover:text-cyan-300 text-cyan-400 font-bold text-xs transition-all disabled:opacity-30 active:scale-95"
            >
              {loading ? '...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Weather Dynamic Visual / Hero Tactical Dial */}
      <div className="relative z-10 flex flex-col items-center justify-center my-3 py-2">
        {renderWeatherIcon(weatherData?.condition, isDay)}

        {/* Large Primary 3D Extruded Readout */}
        <div className="mt-6 flex items-baseline justify-center tracking-tighter">
          <span className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] font-sans">
            {weatherData ? formatTemp(weatherData.temp) : '--'}
          </span>
          <span className="text-3xl md:text-4xl font-light text-cyan-400 ml-1.5 font-mono">
            °{unit}
          </span>
        </div>

        {/* Status Subtitle */}
        <p className="mt-2 text-base md:text-lg font-semibold text-slate-200 capitalize tracking-wide flex items-center gap-2">
          {conditionText}
        </p>

        {/* Min / Max Tactical Pill */}
        {tempMin !== null && tempMax !== null && (
          <div className="mt-3 flex items-center gap-3 px-4 py-1.5 rounded-full neu-inset text-xs font-mono font-medium text-slate-300">
            <span className="flex items-center gap-1 text-cyan-400 font-semibold">
              <ArrowDown className="w-3.5 h-3.5" /> {tempMin}°{unit}
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <ArrowUp className="w-3.5 h-3.5" /> {tempMax}°{unit}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Metadata: Location & Tactical Time/Date Insets */}
      <div className="relative z-10 pt-5 mt-3 border-t border-slate-800/80 flex flex-col gap-3">
        {/* City & Country */}
        <div className="flex items-center gap-2.5 text-slate-200">
          <div className="p-1.5 rounded-xl neu-inset text-cyan-400">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-base md:text-lg font-bold tracking-tight truncate text-white">
            {locationName}
          </span>
        </div>

        {/* Date & Local Time */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2 neu-inset px-3.5 py-2.5 rounded-2xl">
            <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{weatherData?.formattedDate || new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 neu-inset px-3.5 py-2.5 rounded-2xl">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{weatherData?.localTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
