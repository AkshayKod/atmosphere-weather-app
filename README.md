# 🌦️ Atmosphere PRO • Modern Weather Forecasting App

A modern, high-precision Weather Forecasting Dashboard application built with **React (Vite)**, **Tailwind CSS**, and **Lucide Icons** featuring a tactile **Neumorphic Luxury Dark** 2-column split layout, dynamic atmospheric condition backdrops, and resilient multi-provider meteorological telemetry.

---

## 🌟 Key Features

### 1. 2-Column Split Dashboard Architecture
- **Left Column (Current Weather Overview)**:
  - **Live Search**: Real-time input with instant submit, clear trigger, and popular city shortcuts (*London, Tokyo, New York, Paris, New Delhi*).
  - **Dynamic Weather Visual**: Radial dial well with condition-reactive glowing visuals (Sun, Moon, CloudSun, CloudMoon, Rain, Thunderstorm, Snow, Fog/Mist, Drizzle).
  - **Primary Readout**: Large temperature readout formatted with `Math.trunc()` in **°C** or **°F**.
  - **Location & Local Ephemeris**: Targeted city, country code, formatted date, and real-time clock.
  - **Geolocation Button**: One-click *"Use Current Location"* trigger using browser GPS coordinates.

- **Right Column (Weather Highlights Grid)**:
  - **Wind Status Block**: Live speed (`km/h` / `mph`), dynamic rotating compass needle indicator (`${windDeg}deg`), cardinal direction (e.g. *"SSW"*), and gust estimate.
  - **Humidity Block**: Percentage readout with dynamic inline illuminated progress bar and hygrometric comfort assessment.
  - **Visibility Block**: Optical clarity distance in `km` / `miles` with visual quality indicator.
  - **Air Pressure Block**: Atmospheric pressure in `hPa / mb` with standard sea-level barometric evaluation.
  - **RealFeel® Thermal Card**: Apparent temperature with comparisons vs actual temperature and cloud coverage.
  - **Solar Cycle Card**: Sunrise and Sunset timeline tracker with UV radiation index rating.

### 2. Multi-Tier Weather API Telemetry
- **OpenWeatherMap Integration**: Live weather endpoints with API key calibration modal.
- **WeatherAPI Integration**: Seamless support for WeatherAPI.com keys.
- **Zero-Downtime Global Fallback**: High-precision Open-Meteo Geocoding & live telemetry engine ensuring 100% uptime worldwide.

### 3. Neumorphic Luxury Dark Aesthetics
- Soft 3D extruded slate surfaces with dual-directional lighting.
- Engraved inset wells for input fields and progress tracks.
- Reactive condition backdrops matching clear, overcast, rainy, snowy, or stormy weather.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/AkshayKod/atmosphere-weather-app.git

# Navigate to project directory
cd atmosphere-weather-app

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 🛠️ Tech Stack
- **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **APIs:** OpenWeatherMap, WeatherAPI, and Open-Meteo

---

## 📄 License
This project is licensed under the MIT License.
