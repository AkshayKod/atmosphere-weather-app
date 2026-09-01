import React from 'react';
import { RefreshCw, MapPinOff, AlertOctagon } from 'lucide-react';

export default function ErrorCard({ message, onRetry, onSelectCity }) {
  const popularCities = ['New Delhi', 'London', 'New York', 'Tokyo', 'Paris', 'Sydney'];

  return (
    <div className="w-full neu-card rounded-3xl p-8 md:p-12 text-center flex flex-col items-center justify-center border border-rose-500/20 shadow-2xl animate-in fade-in duration-300">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl neu-dial-inset flex items-center justify-center text-rose-400 border border-rose-500/30">
          <MapPinOff className="w-10 h-10 animate-bounce" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
        </span>
      </div>

      <h3 className="text-2xl font-black text-slate-100 mb-2 font-sans">Telemetry Station Offline</h3>
      <p className="text-slate-300 max-w-md text-sm mb-6 leading-relaxed font-mono">
        {message || "We couldn't retrieve weather data for this location. Please check the spelling or select a calibrated station."}
      </p>

      {/* Suggested Cities */}
      <div className="mb-8 w-full max-w-md">
        <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3 font-mono">
          Calibrated Weather Stations
        </p>
        <div className="flex flex-wrap gap-2.5 justify-center">
          {popularCities.map((city) => (
            <button
              key={city}
              onClick={() => onSelectCity && onSelectCity(city)}
              className="px-4 py-2 text-xs font-semibold rounded-2xl neu-button text-slate-300 hover:text-cyan-400 transition-all font-mono"
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl neu-button text-rose-400 hover:text-rose-300 font-bold text-xs tracking-wider uppercase font-mono shadow-md transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Recalibrate & Retry</span>
        </button>
      )}
    </div>
  );
}
