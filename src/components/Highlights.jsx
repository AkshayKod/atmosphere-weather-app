import React from 'react';
import {
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Thermometer,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  SunMedium,
  Radio,
  Zap
} from 'lucide-react';

export default function Highlights({ weatherData, unit = 'C' }) {
  if (!weatherData) return null;

  const {
    windSpeed = 0,
    windDeg = 0,
    windDirection = 'N',
    humidity = 0,
    visibility = 10,
    pressure = 1013,
    feelsLike = 0,
    sunrise = '--:--',
    sunset = '--:--',
    uvIndex = 5,
    clouds = 0
  } = weatherData;

  // Convert temperature
  const formatTemp = (celsius) => {
    if (celsius === undefined || celsius === null) return '--';
    const temp = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
    return Math.trunc(temp);
  };

  // Convert wind speed
  const displayWindSpeed = unit === 'F' 
    ? `${(windSpeed * 0.621371).toFixed(1)} mph` 
    : `${windSpeed.toFixed(1)} km/h`;

  // Convert visibility
  const displayVisibility = unit === 'F'
    ? `${(visibility * 0.621371).toFixed(1)} mi`
    : `${visibility.toFixed(1)} km`;

  // Status helpers
  const getHumidityStatus = (val) => {
    if (val < 30) return { label: 'Dry Air', color: 'text-amber-400' };
    if (val <= 60) return { label: 'Optimum', color: 'text-emerald-400' };
    if (val <= 80) return { label: 'Elevated', color: 'text-cyan-400' };
    return { label: 'Saturated', color: 'text-blue-400' };
  };

  const getVisibilityStatus = (valKm) => {
    if (valKm >= 10) return { label: 'Optimal Clear', desc: 'Maximum horizon definition' };
    if (valKm >= 5) return { label: 'Nominal', desc: 'Slight particulate diffusion' };
    if (valKm >= 2) return { label: 'Moderate Haze', desc: 'Reduced distance clarity' };
    return { label: 'Dense Obscurity', desc: 'Navigation caution advised' };
  };

  const getPressureStatus = (valHpa) => {
    if (valHpa > 1020) return { label: 'High Barometric', trend: 'Anticyclone / Fair Stability' };
    if (valHpa >= 1005) return { label: 'Standard Pressure', trend: 'Sea-level equilibrium' };
    return { label: 'Depression / Low', trend: 'Precipitation potential' };
  };

  const humidityInfo = getHumidityStatus(humidity);
  const visibilityInfo = getVisibilityStatus(visibility);
  const pressureInfo = getPressureStatus(pressure);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Highlights Section Tactical Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-3 font-sans">
            Atmospheric Highlights
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-mono font-bold neu-inset text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              TELEMETRY GRID
            </span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 font-mono">
            Calibrated real-time sensor metrics & meteorological indices
          </p>
        </div>
      </div>

      {/* Grid of Neumorphic Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Wind Vector & Compass Dial */}
        <div className="neu-card neu-card-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-300 font-mono">Wind Dynamics</span>
            <div className="w-9 h-9 rounded-2xl neu-inset flex items-center justify-center text-cyan-400">
              <Wind className="w-4 h-4" />
            </div>
          </div>

          <div className="my-5 flex items-center justify-between">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
                {displayWindSpeed}
              </div>
              <p className="text-xs text-cyan-400 font-mono font-medium mt-1">
                Heading {windDirection} ({windDeg}°)
              </p>
            </div>

            {/* Tactical Rotating Compass Dial Well */}
            <div className="w-16 h-16 rounded-full neu-dial-inset flex items-center justify-center relative p-2">
              <div 
                className="w-10 h-10 rounded-full neu-button flex items-center justify-center text-cyan-400 transition-transform duration-700 shadow-sm"
                style={{ transform: `rotate(${windDeg}deg)` }}
              >
                <ArrowUpRight className="w-5 h-5 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Gust Velocity: {(windSpeed * 1.25).toFixed(1)} km/h</span>
            <span className="text-cyan-400 font-bold">ACTIVE</span>
          </div>
        </div>

        {/* 2. Humidity Card with Tactical Inset Illuminated Bar */}
        <div className="neu-card neu-card-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-300 font-mono">Humidity Index</span>
            <div className="w-9 h-9 rounded-2xl neu-inset flex items-center justify-center text-blue-400">
              <Droplets className="w-4 h-4" />
            </div>
          </div>

          <div className="my-5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
                {humidity}
              </span>
              <span className="text-xl font-bold text-cyan-400 font-mono">%</span>
            </div>

            {/* Inset Engraved Progress Well */}
            <div className="mt-4 w-full">
              <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 mb-2">
                <span>0%</span>
                <span className={humidityInfo.color}>{humidityInfo.label}</span>
                <span>100%</span>
              </div>
              <div className="w-full neu-inset rounded-full h-3.5 p-1 flex items-center overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(56,189,248,0.6)]"
                  style={{ width: `${Math.min(Math.max(humidity, 0), 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Dew Point: {formatTemp(feelsLike - 2)}°{unit}</span>
            <span className="text-blue-400 font-semibold">HYGROMETRIC</span>
          </div>
        </div>

        {/* 3. Optical Visibility Distance */}
        <div className="neu-card neu-card-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-300 font-mono">Visual Range</span>
            <div className="w-9 h-9 rounded-2xl neu-inset flex items-center justify-center text-amber-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>

          <div className="my-5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
                {displayVisibility}
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-2 font-bold font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              {visibilityInfo.label}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {visibilityInfo.desc}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Optical Clarity</span>
            <span className="text-amber-400 font-semibold">OPTIMAL</span>
          </div>
        </div>

        {/* 4. Barometric Pressure */}
        <div className="neu-card neu-card-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-300 font-mono">Air Pressure</span>
            <div className="w-9 h-9 rounded-2xl neu-inset flex items-center justify-center text-indigo-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>

          <div className="my-5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
                {pressure}
              </span>
              <span className="text-sm font-bold text-slate-400 font-mono">hPa / mb</span>
            </div>
            <p className="text-xs text-indigo-300 mt-2 font-bold font-mono">
              {pressureInfo.label}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {pressureInfo.trend}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Equivalent: 1.01 atm</span>
            <span className="text-indigo-400 font-semibold">BAROMETER</span>
          </div>
        </div>

        {/* 5. Feels Like & Thermal Sensation */}
        <div className="neu-card neu-card-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-300 font-mono">Thermal Index</span>
            <div className="w-9 h-9 rounded-2xl neu-inset flex items-center justify-center text-rose-400">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>

          <div className="my-5">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
                {formatTemp(feelsLike)}
              </span>
              <span className="text-xl font-bold text-rose-400 font-mono">°{unit}</span>
            </div>
            <p className="text-xs text-slate-200 mt-2 font-semibold font-mono">
              {Math.abs(feelsLike - weatherData.temp) < 1 
                ? 'Matches ambient mercury' 
                : feelsLike > weatherData.temp 
                  ? 'Moisture causes thermal elevation' 
                  : 'Air draft produces wind-chill factor'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              Cloud obstruction: {clouds}%
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Sensory Index</span>
            <span className="text-rose-400 font-semibold">REALFEEL</span>
          </div>
        </div>

        {/* 6. Solar Cycle & UV Index */}
        <div className="neu-card neu-card-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-300 font-mono">Solar Ephemeris</span>
            <div className="w-9 h-9 rounded-2xl neu-inset flex items-center justify-center text-amber-400">
              <SunMedium className="w-4 h-4" />
            </div>
          </div>

          <div className="my-4 space-y-2.5">
            <div className="flex items-center gap-3 neu-inset p-2.5 rounded-2xl">
              <div className="w-8 h-8 rounded-xl neu-button flex items-center justify-center text-amber-400 shrink-0">
                <Sunrise className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Sunrise</span>
                <span className="text-sm font-bold text-white font-mono tracking-tight">{sunrise}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 neu-inset p-2.5 rounded-2xl">
              <div className="w-8 h-8 rounded-xl neu-button flex items-center justify-center text-orange-400 shrink-0">
                <Sunset className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Sunset</span>
                <span className="text-sm font-bold text-white font-mono tracking-tight">{sunset}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>UV Radiation: Level {uvIndex}</span>
            <span className="text-amber-400 font-semibold">SOLAR DIAL</span>
          </div>
        </div>

      </div>
    </div>
  );
}
