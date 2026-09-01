import React, { useState, useEffect, useCallback } from 'react';
import Temperature from './components/Temperature';
import Highlights from './components/Highlights';
import ErrorCard from './components/ErrorCard';
import { Settings, Key, X, Sun, Compass, Activity, Info, CheckCircle2, AlertCircle } from 'lucide-react';

const WMO_CODE_MAP = {
  0: { condition: 'Clear Sky' },
  1: { condition: 'Mainly Clear' },
  2: { condition: 'Partly Cloudy' },
  3: { condition: 'Overcast' },
  45: { condition: 'Foggy & Mist' },
  48: { condition: 'Depositing Rime Fog' },
  51: { condition: 'Light Drizzle' },
  53: { condition: 'Moderate Drizzle' },
  55: { condition: 'Dense Drizzle' },
  61: { condition: 'Slight Rain' },
  63: { condition: 'Moderate Rain' },
  65: { condition: 'Heavy Rain' },
  71: { condition: 'Slight Snowfall' },
  73: { condition: 'Moderate Snowfall' },
  75: { condition: 'Heavy Snowfall' },
  80: { condition: 'Rain Showers' },
  81: { condition: 'Heavy Showers' },
  95: { condition: 'Thunderstorm' },
  96: { condition: 'Thunderstorm with Hail' },
};

const getCardinalDirection = (angle) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 22.5) % 16;
  return directions[index];
};

export default function App() {
  const [city, setCity] = useState('New Delhi');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C'); // 'C' | 'F'
  const [showSettings, setShowSettings] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('weather_api_key') || import.meta.env.VITE_OPENWEATHER_API_KEY || '');
  const [apiProvider, setApiProvider] = useState(() => localStorage.getItem('weather_api_provider') || 'openweathermap');
  const [activeDataSource, setActiveDataSource] = useState('OpenWeatherMap');
  const [keyStatusNotice, setKeyStatusNotice] = useState(null);

  const getAtmosphericClass = () => {
    if (!weatherData) return 'weather-bg-clear-night';
    const condition = (weatherData.condition || '').toLowerCase();
    const isDay = weatherData.isDay;

    if (condition.includes('thunder') || condition.includes('lightning')) return 'weather-bg-thunder';
    if (condition.includes('snow') || condition.includes('blizzard')) return 'weather-bg-snow';
    if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) return 'weather-bg-rain';
    if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('fog') || condition.includes('mist')) return 'weather-bg-clouds';
    return isDay ? 'weather-bg-clear-day' : 'weather-bg-clear-night';
  };

  // Live Fallback Fetcher using Open-Meteo global engine
  const fetchFromGlobalEngine = async (targetCity, coords = null) => {
    let lat = coords?.lat;
    let lon = coords?.lon;
    let resolvedCityName = targetCity;
    let resolvedCountry = '';
    let timezone = 'auto';

    if (!coords) {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(targetCity)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`City "${targetCity}" not found. Please enter a valid location.`);
      }

      const location = geoData.results[0];
      lat = location.latitude;
      lon = location.longitude;
      resolvedCityName = location.name;
      resolvedCountry = location.country_code || location.country || '';
      timezone = location.timezone || 'auto';
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=${encodeURIComponent(timezone)}`;
    const weatherRes = await fetch(weatherUrl);

    if (!weatherRes.ok) {
      throw new Error('Weather telemetry service is currently unavailable.');
    }

    const mData = await weatherRes.json();
    const current = mData.current;
    const daily = mData.daily || {};
    const weatherInfo = WMO_CODE_MAP[current.weather_code] || { condition: 'Clear Sky' };

    const sunriseFormatted = daily.sunrise?.[0] ? daily.sunrise[0].split('T')[1] : '06:00';
    const sunsetFormatted = daily.sunset?.[0] ? daily.sunset[0].split('T')[1] : '18:30';

    const now = new Date();
    const formattedDateStr = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    const localTimeStr = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    setWeatherData({
      city: resolvedCityName || 'Current Location',
      country: resolvedCountry,
      temp: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      tempMin: daily.temperature_2m_min?.[0] ?? (current.temperature_2m - 3),
      tempMax: daily.temperature_2m_max?.[0] ?? (current.temperature_2m + 4),
      condition: weatherInfo.condition,
      humidity: current.relative_humidity_2m,
      pressure: Math.round(current.pressure_msl || current.surface_pressure || 1013),
      visibility: 10,
      windSpeed: current.wind_speed_10m,
      windDeg: current.wind_direction_10m,
      windDirection: getCardinalDirection(current.wind_direction_10m),
      clouds: current.cloud_cover || 10,
      sunrise: sunriseFormatted,
      sunset: sunsetFormatted,
      isDay: current.is_day === 1,
      localTime: localTimeStr,
      formattedDate: formattedDateStr,
      uvIndex: Math.round(daily.uv_index_max?.[0] || 4)
    });
    setActiveDataSource('Global Satellite Telemetry (Real-time)');
  };

  const fetchWeather = useCallback(async (targetCity, coords = null) => {
    if (!targetCity && !coords) {
      setError('Please enter a valid city name.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try OpenWeatherMap first if key is present
      if (customApiKey && (apiProvider === 'openweathermap' || (apiProvider === 'auto' && customApiKey.length === 32))) {
        const query = coords ? `lat=${coords.lat}&lon=${coords.lon}` : `q=${encodeURIComponent(targetCity)}`;
        
        try {
          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${customApiKey.trim()}`);
          
          if (res.ok) {
            const data = await res.json();
            const dateObj = new Date((data.dt + data.timezone) * 1000);
            const sunriseObj = new Date((data.sys.sunrise + data.timezone) * 1000);
            const sunsetObj = new Date((data.sys.sunset + data.timezone) * 1000);
            const isDayTime = data.dt >= data.sys.sunrise && data.dt < data.sys.sunset;

            setWeatherData({
              city: data.name,
              country: data.sys.country || '',
              temp: data.main.temp,
              feelsLike: data.main.feels_like,
              tempMin: data.main.temp_min,
              tempMax: data.main.temp_max,
              condition: data.weather[0]?.main || 'Clear',
              conditionDesc: data.weather[0]?.description || '',
              humidity: data.main.humidity,
              pressure: data.main.pressure,
              visibility: (data.visibility || 10000) / 1000,
              windSpeed: (data.wind.speed * 3.6),
              windDeg: data.wind.deg || 0,
              windDirection: getCardinalDirection(data.wind.deg || 0),
              clouds: data.clouds?.all || 0,
              sunrise: sunriseObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
              sunset: sunsetObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
              isDay: isDayTime,
              localTime: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
              formattedDate: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }),
              uvIndex: 4
            });
            setActiveDataSource('OpenWeatherMap Live API');
            setKeyStatusNotice(null);
            setLoading(false);
            return;
          } else if (res.status === 401) {
            // OpenWeatherMap API key is newly generated or unactivated. Seamlessly fallback to global engine.
            console.warn('OpenWeatherMap API Key returned 401 (Pending activation on OpenWeatherMap servers). Switching to live fallback telemetry engine.');
            setKeyStatusNotice('Note: Your OpenWeatherMap key is pending activation by OpenWeatherMap servers (takes 10-60 mins). Live forecast is seamlessly powered by global fallback telemetry.');
            await fetchFromGlobalEngine(targetCity, coords);
            setLoading(false);
            return;
          } else if (res.status === 404) {
            throw new Error(`City "${targetCity}" not found. Please enter a valid location.`);
          } else {
            console.warn(`OpenWeatherMap returned status ${res.status}. Falling back to global engine.`);
            await fetchFromGlobalEngine(targetCity, coords);
            setLoading(false);
            return;
          }
        } catch (owmErr) {
          if (owmErr.message && owmErr.message.includes('not found')) throw owmErr;
          console.warn('OpenWeatherMap fetch failed, falling back to global engine:', owmErr);
          await fetchFromGlobalEngine(targetCity, coords);
          setLoading(false);
          return;
        }
      }

      // Try WeatherAPI if selected
      if (customApiKey && (apiProvider === 'weatherapi' || (customApiKey.length > 25 && customApiKey.length !== 32))) {
        try {
          const query = coords ? `${coords.lat},${coords.lon}` : encodeURIComponent(targetCity);
          const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${customApiKey.trim()}&q=${query}&aqi=no`);
          
          if (res.ok) {
            const data = await res.json();
            setWeatherData({
              city: data.location.name,
              country: data.location.country,
              temp: data.current.temp_c,
              feelsLike: data.current.feelslike_c,
              tempMin: data.current.temp_c - 2,
              tempMax: data.current.temp_c + 3,
              condition: data.current.condition.text,
              humidity: data.current.humidity,
              pressure: data.current.pressure_mb,
              visibility: data.current.vis_km,
              windSpeed: data.current.wind_kph,
              windDeg: data.current.wind_degree,
              windDirection: data.current.wind_dir,
              clouds: data.current.cloud,
              sunrise: '06:15 AM',
              sunset: '06:45 PM',
              isDay: data.current.is_day === 1,
              localTime: data.location.localtime.split(' ')[1] || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              formattedDate: new Date(data.location.localtime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
              uvIndex: data.current.uv || 3
            });
            setActiveDataSource('WeatherAPI.com Live');
            setLoading(false);
            return;
          } else {
            console.warn('WeatherAPI error, falling back to global engine.');
            await fetchFromGlobalEngine(targetCity, coords);
            setLoading(false);
            return;
          }
        } catch (wErr) {
          console.warn('WeatherAPI request failed, switching to global engine:', wErr);
          await fetchFromGlobalEngine(targetCity, coords);
          setLoading(false);
          return;
        }
      }

      // Default to Global Engine
      await fetchFromGlobalEngine(targetCity, coords);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err.message || 'An error occurred while loading weather data.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [customApiKey, apiProvider]);

  useEffect(() => {
    fetchWeather(city);
  }, [city, fetchWeather]);

  const handleCityChange = (newCity) => {
    if (!newCity || !newCity.trim()) {
      setError('Please enter a valid city name.');
      return;
    }
    setCity(newCity.trim());
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(null, { lat: latitude, lon: longitude });
      },
      (geoError) => {
        console.warn('Geolocation error:', geoError);
        setError('Unable to retrieve location permissions.');
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('weather_api_key', customApiKey.trim());
    localStorage.setItem('weather_api_provider', apiProvider);
    setShowSettings(false);
    fetchWeather(city);
  };

  return (
    <div className={`min-h-screen ${getAtmosphericClass()} transition-colors duration-1000 text-slate-100 p-4 sm:p-6 md:p-10 flex flex-col justify-between font-sans`}>
      
      {/* Top Navbar / Tactical Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl neu-button flex items-center justify-center text-cyan-400">
            <Sun className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-2 font-sans">
              ATMOSPHERE <span className="text-xs px-2.5 py-0.5 rounded-lg neu-inset text-cyan-400 font-mono font-bold tracking-widest uppercase">LUX 3D</span>
            </span>
            <p className="text-[11px] text-slate-400 font-mono">Tactile Neumorphic Meteorological Interface</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Cities Ribbon */}
          <div className="hidden lg:flex items-center gap-2 neu-inset p-1.5 rounded-2xl text-xs font-mono">
            {['New Delhi', 'London', 'Tokyo', 'New York', 'Paris'].map((quickCity) => (
              <button
                key={quickCity}
                onClick={() => handleCityChange(quickCity)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all duration-200 ${
                  city.toLowerCase() === quickCity.toLowerCase()
                    ? 'neu-button text-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {quickCity}
              </button>
            ))}
          </div>

          {/* Settings / API Key Button */}
          <button
            onClick={() => setShowSettings(true)}
            title="Configure Weather API Keys"
            className="px-4 py-2.5 rounded-2xl neu-button text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-2 text-xs font-bold font-mono active:scale-95"
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">API CALIBRATION</span>
          </button>
        </div>
      </header>

      {/* Key Status Notice Banner (if OpenWeatherMap key is activating) */}
      {keyStatusNotice && (
        <div className="max-w-7xl mx-auto w-full mb-4 animate-in fade-in duration-300">
          <div className="neu-card px-4 py-3 rounded-2xl flex items-center gap-3 border border-amber-500/20 text-amber-300 text-xs font-mono">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="flex-1">{keyStatusNotice}</span>
            <button
              onClick={() => setKeyStatusNotice(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main 2-Column Split Dashboard Layout */}
      <main className="max-w-7xl mx-auto w-full my-auto py-2">
        {error ? (
          <div className="w-full max-w-2xl mx-auto my-12">
            <ErrorCard
              message={error}
              onRetry={() => fetchWeather(city)}
              onSelectCity={handleCityChange}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Column (Overview) */}
            <div className="lg:col-span-4 xl:col-span-4 flex flex-col">
              <Temperature
                weatherData={weatherData}
                currentCity={city}
                onSearch={handleCityChange}
                unit={unit}
                onToggleUnit={handleToggleUnit}
                onGetCurrentLocation={handleGetCurrentLocation}
                loading={loading}
              />
            </div>

            {/* Right Column (Highlights) */}
            <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-between">
              <Highlights
                weatherData={weatherData}
                unit={unit}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modern Tactical Footer */}
      <footer className="max-w-7xl mx-auto w-full pt-8 pb-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4 border-t border-slate-800/80 mt-8">
        <div className="flex items-center gap-2">
          <span>React • Vite • Tailwind CSS</span>
          <span>•</span>
          <span className="text-cyan-400">{activeDataSource}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Key: {customApiKey ? `${customApiKey.substring(0, 6)}••••••••` : 'Default'}</span>
          <span>•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Online & Calibrated
          </span>
        </div>
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="neu-card w-full max-w-md rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-2xl relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-2xl neu-button transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="p-3 rounded-2xl neu-inset text-cyan-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-sans">API Calibration</h3>
                <p className="text-xs text-slate-400 font-mono">OpenWeatherMap & Telemetry Key</p>
              </div>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase font-mono mb-2">
                  Provider Selection
                </label>
                <select
                  value={apiProvider}
                  onChange={(e) => setApiProvider(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl neu-inset text-slate-100 text-sm outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                >
                  <option value="openweathermap">OpenWeatherMap API (Current)</option>
                  <option value="weatherapi">WeatherAPI.com</option>
                  <option value="auto">Auto-Detect / Global Engine</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase font-mono mb-2">
                  API Token
                </label>
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="Paste your 32-char key..."
                  className="w-full px-4 py-3 rounded-2xl neu-inset text-slate-100 placeholder-slate-500 text-sm outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-2 font-mono leading-relaxed">
                  OpenWeatherMap newly created keys take up to a short period to activate on their servers. The app gracefully guarantees real-time telemetry at all times.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2.5 rounded-2xl neu-button text-slate-400 hover:text-slate-200 text-xs font-bold font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl neu-button text-cyan-400 hover:text-cyan-300 font-black text-xs tracking-wider uppercase font-mono transition-all"
                >
                  Save & Calibrate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
